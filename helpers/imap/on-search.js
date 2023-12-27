/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const { Buffer } = require('node:buffer');

const _ = require('lodash');
const tools = require('wildduck/lib/tools');
const safeStringify = require('fast-safe-stringify');
const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

const builder = new Builder();

async function onSearch(mailboxId, options, session, fn) {
  this.logger.debug('SEARCH', { mailboxId, options, session, fn });

  try {
    if (this?.constructor?.name === 'IMAP') {
      try {
        const data = await this.wsp.request({
          action: 'search',
          session: {
            id: session.id,
            user: session.user,
            remoteAddress: session.remoteAddress,
            selected: session.selected
          },
          mailboxId,
          options
        });
        fn(null, ...data);
      } catch (err) {
        fn(err);
      }

      return;
    }

    await this.refreshSession(session, 'SEARCH');

    const mailbox = await Mailboxes.findOne(this, session, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'NONEXISTENT'
        }
      );

    // prepare query for search
    const query = {
      mailbox: mailbox._id
    };

    const uidList = [];

    let highestModseq = 0;
    let returned;

    // eslint-disable-next-line complexity
    const walkQuery = async (parent, ne, node) => {
      if (returned) {
        return;
      }

      for (const term of node) {
        // <https://github.com/nodemailer/wildduck/issues/531#issuecomment-1756877321>
        if (returned) break;
        switch (term.key) {
          case 'all': {
            if (ne) {
              parent.push({
                // should not match anything
                _id: -1
              });
            }

            break;
          }

          case 'not': {
            // eslint-disable-next-line no-await-in-loop
            await walkQuery(parent, !ne, [term.value || []].flat());
            break;
          }

          case 'or': {
            const $or = [];

            for (const entry of [term.value || []].flat()) {
              // eslint-disable-next-line no-await-in-loop
              await walkQuery($or, false, [entry || []].flat());
            }

            if ($or.length > 0) {
              parent.push({
                $or
              });
            }

            break;
          }

          case 'text': // search over entire email
          case 'body': {
            //
            // use FTS5 for full text search in onSearch function
            // <https://kimsereylam.com/sqlite/2020/03/06/full-text-search-with-sqlite.html>
            //
            let ids;

            //
            // TODO: note this is currently disabled (see notes in sqlite-server.js regarding fts5)
            //
            let sql;
            if (env.SQLITE_FTS5_ENABLED) {
              sql = {
                query: `select _id from Messages_fts where Messages_fts ${
                  ne ? 'NOT MATCH' : 'MATCH'
                } $p1 ORDER BY rank;`,
                values: {
                  p1: term.value
                }
              };
            } else {
              sql = {
                query: `select _id from Messages where text ${
                  ne ? 'NOT LIKE' : 'LIKE'
                } $p1;`,
                values: {
                  p1: `%${term.value}%`
                }
              };
            }

            if (session.db.wsp) {
              // eslint-disable-next-line no-await-in-loop
              ids = await this.wsp.request({
                action: 'stmt',
                session: { user: session.user },
                stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
              });
            } else {
              ids = session.db.prepare(sql.query).pluck().all(sql.values);
            }

            parent.push({
              _id: { $in: ids }
            });

            // NOTE: this is the wildduck reference (which does not support NOT matches)
            /*
            // search over email body
            if (term.value && !ne) {
              query.searchable = true;
              query.$text = {
                $search: term.value
              };
            } else {
              // can not search by text
              parent.push({
                // should not match anything
                _id: -1
              });
            }
            */

            break;
          }

          case 'modseq': {
            parent.push({
              modseq: {
                [ne ? '$lt' : '$gte']: term.value
              }
            });
            break;
          }

          case 'uid': {
            if (Array.isArray(term.value)) {
              if (term.value.length === 0) {
                // trying to find a message that does not exist
                returned = true;
                fn(null, {
                  uidList: [],
                  highestModseq: 0
                });
                continue;
              }

              // <https://github.com/nodemailer/wildduck/pull/570>
              // if (
              //   !_.isEqual(term.value.sort(), session.selected.uidList.sort())
              // ) {
              if (term.value.length !== session.selected.uidList.length) {
                // not 1:*
                parent.push({
                  uid: tools.checkRangeQuery(term.value, ne)
                });
              } else if (ne) {
                parent.push({
                  // should not match anything
                  _id: -1
                });
              }
            } else {
              parent.push({
                uid: {
                  [ne ? '$ne' : '$eq']: term.value
                }
              });
            }

            break;
          }

          case 'flag': {
            switch (term.value) {
              case '\\Seen':
              case '\\Deleted': {
                // message object has "unseen" and "undeleted" properties
                if (term.exists) {
                  parent.push({
                    ['un' + term.value.toLowerCase().slice(1)]: ne
                  });
                } else {
                  parent.push({
                    ['un' + term.value.toLowerCase().slice(1)]: !ne
                  });
                }

                break;
              }

              case '\\Flagged':
              case '\\Draft': {
                if (term.exists) {
                  parent.push({
                    [term.value.toLowerCase().slice(1)]: !ne
                  });
                } else {
                  parent.push({
                    [term.value.toLowerCase().slice(1)]: ne
                  });
                }

                break;
              }

              default: {
                if (term.exists) {
                  parent.push({
                    flags: {
                      [ne ? '$ne' : '$eq']: term.value
                    }
                  });
                } else {
                  parent.push({
                    flags: {
                      [ne ? '$eq' : '$ne']: term.value
                    }
                  });
                }
              }
            }

            break;
          }

          case 'header': {
            {
              //
              // NOTE: we can use using lodash instead of `tools.escapeRegexStr`
              //       since the usage is the same (but perf slightly better in lodash)
              //       <https://github.com/lodash/lodash/blob/0843bd46ef805dd03c0c8d804630804f3ba0ca3c/lodash.js#L14274-L14279>
              //

              // <https://github.com/asg017/sqlite-regex/issues/13>
              // <https://github.com/nalgeon/sqlean/issues/100>
              const regex =
                '(?i)' + // case insensitive (PCRE_CASELESS)
                _.escapeRegExp(Buffer.from(term.value, 'binary').toString());

              const entry = {};
              if (term.value) {
                if (ne) {
                  const sql = {
                    // `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') != $p2;`
                    // NOTE: unlike MongoDB we can do a NOT for a RegExp here (see below commented out WildDuck reference)
                    query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') NOT REGEXP $p2;`,
                    values: {
                      p1: term.header,
                      p2: Buffer.from(term.value, 'binary')
                        .toString()
                        .toLowerCase()
                        .trim()
                    }
                  };
                  let ids;
                  if (session.db.wsp) {
                    // eslint-disable-next-line no-await-in-loop
                    ids = await this.wsp.request({
                      action: 'stmt',
                      session: { user: session.user },
                      stmt: [
                        ['prepare', sql.query],
                        ['pluck'],
                        ['all', sql.values]
                      ]
                    });
                  } else {
                    ids = session.db.prepare(sql.query).pluck().all(sql.values);
                  }

                  entry._id = { $in: ids };
                } else {
                  const sql = {
                    // NOTE: for array lookups:
                    // REGEXP `select _id from Messages, json_each(Messages.headers) where key = $p1 and value REGEXP $p2;`
                    query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') REGEXP $p2;`,
                    values: { p1: term.header, p2: regex }
                  };
                  let ids;
                  if (session.db.wsp) {
                    // eslint-disable-next-line no-await-in-loop
                    ids = await this.wsp.request({
                      action: 'stmt',
                      session: { user: session.user },
                      stmt: [
                        ['prepare', sql.query],
                        ['pluck'],
                        ['all', sql.values]
                      ]
                    });
                  } else {
                    ids = session.db.prepare(sql.query).pluck().all(sql.values);
                  }

                  entry._id = { $in: ids };
                }
              } else if (ne) {
                const sql = {
                  query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') != $p1;`,
                  values: { p1: term.header, p2: term.value }
                };
                let ids;
                if (session.db.wsp) {
                  // eslint-disable-next-line no-await-in-loop
                  ids = await this.wsp.request({
                    action: 'stmt',
                    session: { user: session.user },
                    stmt: [
                      ['prepare', sql.query],
                      ['pluck'],
                      ['all', sql.values]
                    ]
                  });
                } else {
                  ids = session.db.prepare(sql.query).pluck().all(sql.values);
                }

                entry._id = { $in: ids };
              } else {
                const sql = {
                  query: `select _id from Messages, json_each(Messages.headers) where key = $p1;`,
                  values: { p1: term.header }
                };
                let ids;
                if (session.db.wsp) {
                  // eslint-disable-next-line no-await-in-loop
                  ids = await this.wsp.request({
                    action: 'stmt',
                    session: { user: session.user },
                    stmt: [
                      ['prepare', sql.query],
                      ['pluck'],
                      ['all', sql.values]
                    ]
                  });
                } else {
                  ids = session.db.prepare(sql.query).pluck().all(sql.values);
                }

                entry._id = { $in: ids };
              }

              // wildduck/mongodb version
              /*
              const entry = term.value
                ? {
                    headers: {
                      $elemMatch: {
                        key: term.header,
                        value: ne
                          ? {
                              // not can not have a regex, so try exact match instead even if it fails
                              $not: {
                                $eq: Buffer.from(term.value, 'binary')
                                  .toString()
                                  .toLowerCase()
                                  .trim()
                              }
                            }
                          : {
                              $regex: regex,
                              $options: 'i'
                            }
                      }
                    }
                  }
                : {
                    'headers.key': ne
                      ? {
                          $ne: term.header
                        }
                      : term.header
                  };
              */
              parent.push(entry);
            }

            break;
          }

          case 'date':
          case 'internaldate':
          case 'headerdate': {
            {
              let op = false;
              const value = new Date(term.value + ' GMT');
              switch (term.operator) {
                case '<': {
                  op = '$lt';
                  break;
                }

                case '<=': {
                  op = '$lte';
                  break;
                }

                case '>': {
                  op = '$gt';
                  break;
                }

                case '>=': {
                  op = '$gte';
                  break;
                }

                default: {
                  break;
                }
              }

              let entry = op
                ? {
                    [op]: value
                  }
                : // NOTE: slight difference here with wildduck
                  //       in that we support json-sql by having an object
                  //       instead of an array of objects for the same prop
                  // json-sql version:
                  {
                    $gte: value,
                    $lt: new Date(value.getTime() + 24 * 3600 * 1000)
                  };
              // wildduck version:
              // : [
              //     {
              //       $gte: value
              //     },
              //     {
              //       $lt: new Date(value.getTime() + 24 * 3600 * 1000)
              //     }
              //   ];

              // headerdate => hdate
              // internaldate => idate
              // date => $or
              // <https://github.com/nodemailer/wildduck/issues/560>
              switch (term.key) {
                case 'headerdate': {
                  entry = {
                    hdate: ne
                      ? {
                          $not: entry
                        }
                      : entry
                  };
                  break;
                }

                case 'internaldate': {
                  entry = {
                    idate: ne
                      ? {
                          $not: entry
                        }
                      : entry
                  };

                  break;
                }

                case 'date': {
                  entry = {
                    $or: [
                      {
                        hdate: ne
                          ? {
                              $not: entry
                            }
                          : entry
                      },
                      {
                        idate: ne
                          ? {
                              $not: entry
                            }
                          : entry
                      }
                    ]
                  };

                  break;
                }

                default: {
                  throw new TypeError(`${term.key} unsupported`);
                }
              }

              parent.push(entry);
            }

            break;
          }

          case 'size': {
            {
              let op = '$eq';
              const value = Number(term.value) || 0;
              switch (term.operator) {
                case '<': {
                  op = '$lt';
                  break;
                }

                case '<=': {
                  op = '$lte';
                  break;
                }

                case '>': {
                  op = '$gt';
                  break;
                }

                case '>=': {
                  op = '$gte';
                  break;
                }

                default: {
                  this.logger.fatal(new TypeError('Unknown term operator'), {
                    term,
                    node,
                    mailboxId,
                    options,
                    session
                  });
                  break;
                }
              }

              let entry = {
                [op]: value
              };

              entry = {
                size: ne
                  ? {
                      $not: entry
                    }
                  : entry
              };

              parent.push(entry);
            }

            break;
          }

          // NOTE: CHARSET unsupported
          case 'charset': {
            // <https://github.com/nodemailer/wildduck/issues/562>
            break;
          }

          default: {
            this.logger.fatal(new TypeError(`Unknown term key "${term.key}"`), {
              term,
              node,
              mailboxId,
              options,
              session
            });
            break;
          }
        }
      }
    };

    const $and = [];
    await walkQuery($and, false, options.query);

    if (returned) return;

    if ($and.length > 0) query.$and = $and;

    // converts objectids -> strings and arrays/json appropriately
    const condition = JSON.parse(safeStringify(query));

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      fields: ['uid', 'modseq']
    });

    let messages;

    //
    // NOTE: using `all()` currently for faster performance
    //       (since we don't write to the socket here)
    //
    if (session.db.wsp) {
      messages = await this.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', sql.query],
          ['all', sql.values]
        ]
      });
    } else {
      messages = session.db.prepare(sql.query).all(sql.values);
    }

    try {
      for (const message of messages) {
        if (highestModseq < message.modseq) highestModseq = message.modseq;
        uidList.push(message.uid);
      }
      /*
      for (const result of stmt.iterate(sql.values)) {
        // eslint-disable-next-line no-await-in-loop
        const message = await convertResult(Messages, result, {
          uid: true,
          modseq: true
        });

        this.logger.debug('fetched message', {
          result,
          message,
          mailboxId,
          options,
          session
        });

        if (highestModseq < message.modseq) highestModseq = message.modseq;

        uidList.push(message.uid);
      }
      */
    } catch (err) {
      this.logger.fatal(err, { mailboxId, options, session });
      throw new IMAPError(i18n.translateError('IMAP_INVALID_SEARCH'));
    }

    // send response
    fn(null, {
      uidList,
      highestModseq
    });
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, options, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onSearch;
