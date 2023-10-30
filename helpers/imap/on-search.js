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
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

const builder = new Builder();

async function onSearch(mailboxId, options, session, fn) {
  this.logger.debug('SEARCH', { mailboxId, options, session, fn });

  try {
    const { db } = await this.refreshSession(session, 'SEARCH');

    const mailbox = await Mailboxes.findOne(db, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    // prepare query for search
    const query = {
      mailbox: mailbox._id
    };

    const uidList = [];

    let highestModseq = 0;
    let returned;

    // eslint-disable-next-line complexity
    const walkQuery = (parent, ne, node) => {
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
            walkQuery(parent, !ne, [term.value || []].flat());
            break;
          }

          case 'or': {
            const $or = [];

            for (const entry of [term.value || []].flat()) {
              walkQuery($or, false, [entry || []].flat());
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
            const ids = db
              .prepare(
                `select _id from Messages_fts where Messages_fts ${
                  ne ? 'NOT MATCH' : 'MATCH'
                } $p1 ORDER BY rank;`
              )
              .pluck()
              .all({
                p1: term.value
              });

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
                  const ids = db
                    .prepare(
                      // `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') != $p2;`
                      // NOTE: unlike MongoDB we can do a NOT for a RegExp here (see below commented out WildDuck reference)
                      `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') NOT REGEXP $p2;`
                    )
                    .pluck()
                    .all({
                      p1: term.header,
                      p2: Buffer.from(term.value, 'binary')
                        .toString()
                        .toLowerCase()
                        .trim()
                    });
                  entry._id = { $in: ids };
                } else {
                  const ids = db
                    .prepare(
                      // NOTE: for array lookups:
                      // REGEXP `select _id from Messages, json_each(Messages.headers) where key = $p1 and value REGEXP $p2;`
                      `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') REGEXP $p2;`
                    )
                    .pluck()
                    .all({ p1: term.header, p2: regex });
                  entry._id = { $in: ids };
                }
              } else if (ne) {
                const ids = db
                  .prepare(
                    `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') != $p1;`
                  )
                  .pluck()
                  .all({ p1: term.header, p2: term.value });
                entry._id = { $in: ids };
              } else {
                const ids = db
                  .prepare(
                    `select _id from Messages, json_each(Messages.headers) where key = $p1;`
                  )
                  .pluck()
                  .all({ p1: term.header });
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

          case 'internaldate': {
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

              entry = {
                idate: ne
                  ? {
                      $not: entry
                    }
                  : entry
              };

              parent.push(entry);
            }

            break;
          }

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

              let entry = op
                ? {
                    [op]: value
                  }
                : [
                    {
                      $gte: value
                    },
                    {
                      $lt: new Date(value.getTime() + 24 * 3600 * 1000)
                    }
                  ];

              entry = {
                hdate: ne
                  ? {
                      $not: entry
                    }
                  : entry
              };

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
      }
    };

    const $and = [];
    walkQuery($and, false, options.query);

    if (returned) return;

    if ($and.length > 0) query.$and = $and;

    // converts objectids -> strings and arrays/json appropriately
    const condition = JSON.parse(safeStringify(query));

    // TODO: need to support FTS5 for text search
    //       (using $match)
    // `SELECT * FROM Messages_fts WHERE Messages_fts MATCH 'some phrase' ORDER BY rank;`
    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      fields: ['uid', 'modseq']
    });

    const stmt = db.prepare(sql.query);

    try {
      //
      // NOTE: using `all()` currently for faster performance
      //       (since we don't write to the socket here)
      //
      const messages = stmt.all(sql.values);
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

    // close the connection
    db.close();

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
