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

const ms = require('ms');
const tools = require('@zone-eu/wildduck/lib/tools');
const { Builder } = require('json-sql-enhanced');
const _ = require('#helpers/lodash');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const env = require('#config/env');
const escapeSqliteLike = require('#helpers/escape-sqlite-like');
const logger = require('#helpers/logger');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { decodeMetadata } = require('#helpers/msgpack-helpers');
const recursivelyParse = require('#helpers/recursively-parse');

const builder = new Builder({ bufferAsNative: true });

async function onSearch(mailboxId, options, session, fn) {
  this.logger.debug('SEARCH', { mailboxId, options, session, fn });

  if (this.wsp) {
    try {
      const start = Date.now();
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

      // useful for admins to debug which queries are taking long
      if (Date.now() - start >= ms('30s')) {
        const err = new TypeError('Search took longer than 30s');
        err.isCodeBug = true;
        err.delta = Date.now() - start;
        err.mailboxId = mailboxId;
        err.options = options;
        logger.fatal(err);
      }

      fn(null, ...data);
    } catch (err) {
      // IMAP handler command supports `results.uidList` arbitrary obj
      if (err.imapResponse) return fn(null, { uidList: err.imapResponse });
      fn(err);
    }

    return;
  }

  try {
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
      mailbox: mailbox._id.toString()
    };

    const uidList = new Set();

    let highestModseq = 0;
    let returned;

    const set = new Set();
    let mustIncludeIds = false;

    // eslint-disable-next-line no-inner-declarations
    async function walkQuery(parent, ne, node) {
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
            await walkQuery(parent, !ne, [term.value || []].flat());
            break;
          }

          case 'or': {
            const $or = [];

            for (const entry of [term.value || []].flat()) {
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

            //
            // TODO: note this is currently disabled (see notes in sqlite-server.js regarding fts5)
            // WARNING: when enabling FTS5, term.value MUST be sanitized against
            // FTS5 query syntax injection (*, ", OR, AND, NOT, NEAR, column:)
            // to prevent users from crafting malicious MATCH expressions.
            //
            let sql;
            if (env.SQLITE_FTS5_ENABLED) {
              // Sanitize FTS5 query to prevent injection of operators
              // (*, ", OR, AND, NOT, NEAR, column:).  Wrap the term in
              // double-quotes so FTS5 treats it as a literal phrase.
              const sanitized = term.value
                .replace(/"/g, '""') // escape embedded double-quotes
                .replace(/\*/g, ''); // strip wildcard operator
              if (ne) {
                // FTS5 does not support NOT MATCH; use a NOT IN subquery
                sql = {
                  query: `select _id from Messages where mailbox = $mailbox and _id NOT IN (SELECT _id FROM Messages_fts WHERE text MATCH $p1);`,
                  values: {
                    mailbox: mailbox._id.toString(),
                    p1: `"${sanitized}"`
                  }
                };
              } else {
                sql = {
                  query: `select _id from Messages_fts where text MATCH $p1 ORDER BY rank;`,
                  values: {
                    p1: `"${sanitized}"`
                  }
                };
              }
            } else {
              // Escape LIKE metacharacters (%, _, \) so they match literally
              const escaped = escapeSqliteLike(term.value);
              sql = {
                query: `select _id from Messages where mailbox = $mailbox and text ${
                  ne ? 'NOT LIKE' : 'LIKE'
                } $p1 ESCAPE '\\';`,
                values: {
                  mailbox: mailbox._id.toString(),
                  p1: `%${escaped}%`
                }
              };
            }

            let ids;
            try {
              ids = session.db.prepare(sql.query).pluck().all(sql.values);
            } catch (err) {
              // Graceful fallback: if Messages_fts table doesn't exist yet
              // (migration pending), retry with LIKE query
              if (
                env.SQLITE_FTS5_ENABLED &&
                err.message &&
                err.message.includes('Messages_fts')
              ) {
                const escaped = escapeSqliteLike(term.value);
                const fallbackSql = {
                  query: `select _id from Messages where mailbox = $mailbox and text ${
                    ne ? 'NOT LIKE' : 'LIKE'
                  } $p1 ESCAPE '\\';`,
                  values: {
                    mailbox: mailbox._id.toString(),
                    p1: `%${escaped}%`
                  }
                };
                ids = session.db
                  .prepare(fallbackSql.query)
                  .pluck()
                  .all(fallbackSql.values);
              } else {
                throw err;
              }
            }

            // RFC 3501: multiple criteria are AND'd; intersect when set already populated
            if (mustIncludeIds) {
              const newIds = new Set(ids);
              for (const id of set) {
                if (!newIds.has(id)) set.delete(id);
              }
            } else {
              for (const id of ids) {
                set.add(id);
              }
            }

            mustIncludeIds = true;

            // NOTE: this is the wildduck reference (which does not support NOT matches)
            // search over email body
            // if (term.value && !ne) {
            //   query.searchable = true;
            //   query.$text = {
            //     $search: term.value
            //   };
            // } else {
            //   // can not search by text
            //   parent.push({
            //     // should not match anything
            //     _id: -1
            //   });
            // }

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
              //   !_.isEqual(_.sortBy(term.value), _.sortBy(session.selected.uidList))
              // )
              if (
                term.value.length !== session.selected.uidList.length &&
                term.value.length > 0
              ) {
                // not 1:*
                parent.push({
                  uid: tools.checkRangeQuery(term.value, ne, term.isContiguous)
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
                // Custom keywords are stored in the brotli-compressed
                // `flags` blob and cannot be queried via SQL operators.
                // Decode each message's flags and filter in JavaScript,
                // using the same set/mustIncludeIds intersection pattern
                // as BODY/TEXT/HEADER searches.
                const wantPresent = term.exists ? !ne : ne;
                const keyword = term.value;
                const flagSql = {
                  query:
                    'select _id, flags from Messages where mailbox = $mailbox;',
                  values: { mailbox: mailbox._id.toString() }
                };
                const flagRows = session.db
                  .prepare(flagSql.query)
                  .all(flagSql.values);
                const matchedIds = [];
                for (const row of flagRows) {
                  const decoded =
                    decodeMetadata(row.flags, recursivelyParse) || [];
                  const has = decoded.some(
                    (f) => (typeof f === 'string' ? f : String(f)) === keyword
                  );
                  if (wantPresent ? has : !has) {
                    matchedIds.push(row._id);
                  }
                }

                if (mustIncludeIds) {
                  const newIds = new Set(matchedIds);
                  for (const id of set) {
                    if (!newIds.has(id)) set.delete(id);
                  }
                } else {
                  for (const id of matchedIds) {
                    set.add(id);
                  }
                }

                mustIncludeIds = true;
              }
            }

            break;
          }

          case 'header': {
            {
              //
              // The header value is matched as a literal with LIKE.  Indexed
              // header values are stored lowercased (see
              // `generateIndexedHeaders` in the message handler), so the
              // lowercased term matches them case-insensitively, non-ASCII
              // characters included.
              //
              // REGEXP must not be used for user-supplied terms: the
              // sqlite-regex extension is optional, and it fails with
              // "utf8 err" for every row of a mailbox as soon as one header
              // value is not valid UTF-8 (a header that decoded to a lone
              // surrogate is stored as a JSON escape and extracted as
              // invalid UTF-8), which made every HEADER search of such a
              // mailbox fail.
              //
              const pattern = `%${escapeSqliteLike(
                Buffer.from(term.value, 'binary').toString().toLowerCase()
              )}%`;

              if (term.value) {
                if (ne) {
                  const sql = {
                    // NOT HEADER X value: messages where the header is absent
                    // OR the header value does not match the pattern.
                    // Using NOT IN (positive match set) captures both cases.
                    query: `select _id from Messages where mailbox = $mailbox and _id NOT IN (select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') LIKE $p2 ESCAPE '\\');`,
                    values: {
                      mailbox: mailbox._id.toString(),
                      p1: term.header,
                      p2: pattern
                    }
                  };
                  const ids = session.db
                    .prepare(sql.query)
                    .pluck()
                    .all(sql.values);
                  // RFC 3501: multiple criteria are AND'd; intersect when set already populated
                  if (mustIncludeIds) {
                    const newIds = new Set(ids);
                    for (const id of set) {
                      if (!newIds.has(id)) set.delete(id);
                    }
                  } else {
                    for (const id of ids) {
                      set.add(id);
                    }
                  }

                  mustIncludeIds = true;
                } else {
                  const sql = {
                    query: `select _id from Messages, json_each(Messages.headers) where Messages.mailbox = $mailbox and json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') LIKE $p2 ESCAPE '\\';`,
                    values: {
                      mailbox: mailbox._id.toString(),
                      p1: term.header,
                      p2: pattern
                    }
                  };
                  const ids = session.db
                    .prepare(sql.query)
                    .pluck()
                    .all(sql.values);
                  // RFC 3501: multiple criteria are AND'd; intersect when set already populated
                  if (mustIncludeIds) {
                    const newIds = new Set(ids);
                    for (const id of set) {
                      if (!newIds.has(id)) set.delete(id);
                    }
                  } else {
                    for (const id of ids) {
                      set.add(id);
                    }
                  }

                  mustIncludeIds = true;
                }
              } else if (ne) {
                const sql = {
                  query: `select _id from Messages where mailbox = $mailbox and _id NOT IN (select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1);`,
                  values: { mailbox: mailbox._id.toString(), p1: term.header }
                };
                const ids = session.db
                  .prepare(sql.query)
                  .pluck()
                  .all(sql.values);
                // RFC 3501: multiple criteria are AND'd; intersect when set already populated
                if (mustIncludeIds) {
                  const newIds = new Set(ids);
                  for (const id of set) {
                    if (!newIds.has(id)) set.delete(id);
                  }
                } else {
                  for (const id of ids) {
                    set.add(id);
                  }
                }

                mustIncludeIds = true;
              } else {
                const sql = {
                  query: `select _id from Messages, json_each(Messages.headers) where Messages.mailbox = $mailbox and json_extract(value, '$.key') = $p1;`,
                  values: { mailbox: mailbox._id.toString(), p1: term.header }
                };
                const ids = session.db
                  .prepare(sql.query)
                  .pluck()
                  .all(sql.values);
                // RFC 3501: multiple criteria are AND'd; intersect when set already populated
                if (mustIncludeIds) {
                  const newIds = new Set(ids);
                  for (const id of set) {
                    if (!newIds.has(id)) set.delete(id);
                  }
                } else {
                  for (const id of ids) {
                    set.add(id);
                  }
                }

                mustIncludeIds = true;
              }

              // wildduck/mongodb version
              // const entry = term.value
              //   ? {
              //       headers: {
              //         $elemMatch: {
              //           key: term.header,
              //           value: ne
              //             ? {
              //                 // not can not have a regex, so try exact match instead even if it fails
              //                 $not: {
              //                   $eq: Buffer.from(term.value, 'binary')
              //                     .toString()
              //                     .toLowerCase()
              //                     .trim()
              //                 }
              //               }
              //             : {
              //                 $regex: regex,
              //                 $options: 'i'
              //               }
              //         }
              //       }
              //     }
              //   : {
              //       'headers.key': ne
              //         ? {
              //             $ne: term.header
              //           }
              //         : term.header
              //     };
            }

            break;
          }

          case 'date':
          case 'internaldate':
          case 'headerdate': {
            {
              let op = false;
              const dateObj = new Date(term.value + ' GMT');
              // IMPORTANT: Convert Date to ISO string because SQLite cannot
              // bind Date objects (throws "can only bind numbers, strings,
              // bigints, buffers, and null"). Dates are stored as ISO strings
              // in the database (via the Date setter in mongoose-to-sqlite).
              const value = dateObj.toISOString();
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

              const endOfDay = new Date(
                dateObj.getTime() + 24 * 3600 * 1000
              ).toISOString();
              const entry = op
                ? {
                    [op]: value
                  }
                : // NOTE: slight difference here with wildduck
                  //       in that we support json-sql by having an object
                  //       instead of an array of objects for the same prop
                  // json-sql version:
                  {
                    $gte: value,
                    $lt: endOfDay
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
              // For single-operator searches (BEFORE, SINCE, SENTBEFORE, etc.),
              // `entry` is {$op: value} and $not works correctly.
              // For "ON date" searches (no operator), `entry` is {$gte: X, $lt: Y}.
              // json-sql-enhanced's $not incorrectly negates compound conditions as
              // NOT(A) AND NOT(B) instead of NOT(A AND B) = NOT(A) OR NOT(B).
              // So for negated ON-date, manually construct the correct inversion.
              switch (term.key) {
                case 'headerdate': {
                  if (ne && !op) {
                    parent.push({
                      $or: [
                        { hdate: { $lt: value } },
                        { hdate: { $gte: endOfDay } }
                      ]
                    });
                  } else {
                    parent.push({
                      hdate: ne ? { $not: entry } : entry
                    });
                  }

                  break;
                }

                case 'internaldate': {
                  if (ne && !op) {
                    parent.push({
                      $or: [
                        { idate: { $lt: value } },
                        { idate: { $gte: endOfDay } }
                      ]
                    });
                  } else {
                    parent.push({
                      idate: ne ? { $not: entry } : entry
                    });
                  }

                  break;
                }

                case 'date': {
                  if (ne) {
                    // Negated: NOT(hdate_in_range OR idate_in_range)
                    // De Morgan's: (NOT hdate_in_range) AND (NOT idate_in_range)
                    if (op) {
                      // Single op: $not works correctly
                      parent.push({
                        $and: [
                          { hdate: { $not: { [op]: value } } },
                          { idate: { $not: { [op]: value } } }
                        ]
                      });
                    } else {
                      // ON-date: manually invert each
                      parent.push({
                        $and: [
                          {
                            $or: [
                              { hdate: { $lt: value } },
                              { hdate: { $gte: endOfDay } }
                            ]
                          },
                          {
                            $or: [
                              { idate: { $lt: value } },
                              { idate: { $gte: endOfDay } }
                            ]
                          }
                        ]
                      });
                    }
                  } else {
                    // Positive: match if EITHER hdate OR idate is in range
                    parent.push({
                      $or: [{ hdate: entry }, { idate: entry }]
                    });
                  }

                  break;
                }

                default: {
                  throw new TypeError(`${term.key} unsupported`);
                }
              }
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

              if (!_.isEmpty(entry)) parent.push(entry);
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
    }

    const $and = [];
    await walkQuery($and, false, options.query);

    if (returned) return;

    //
    // When subqueries (TEXT/BODY/HEADER/keyword) have narrowed results
    // to a known set of _id values, inject them directly into the SQL
    // WHERE clause instead of fetching all rows and filtering in JS.
    // This avoids a full-table iterate + per-row Set.has() check that
    // dominated CPU in profiling (57% of total CPU time).
    //
    if (mustIncludeIds) {
      if (set.size === 0) {
        // Subqueries matched nothing — short-circuit with empty result
        fn(null, { uidList: [], highestModseq: 0 });
        return;
      }

      const ids = [...set];
      // SQLITE_MAX_VARIABLE_NUMBER defaults to 999; chunk to stay safe
      if (ids.length <= 900) {
        $and.push({ _id: { $in: ids } });
      } else {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 900) {
          chunks.push({ _id: { $in: ids.slice(i, i + 900) } });
        }

        $and.push({ $or: chunks });
      }
    }

    if ($and.length > 0) query.$and = $and;

    const condition = query;

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      fields: ['_id', 'uid', 'modseq']
    });

    try {
      for (const message of session.db.prepare(sql.query).iterate(sql.values)) {
        if (highestModseq < message.modseq) highestModseq = message.modseq;
        uidList.add(message.uid);
      }
    } catch (err) {
      err.isCodeBug = true;
      err.mailboxId = mailboxId;
      err.options = options;
      err.condition = condition;
      this.logger.fatal(err, { session, resolver: this.resolver });
      throw new IMAPError(i18n.translateError('IMAP_INVALID_SEARCH'), {
        imapResponse: 'CANNOT'
      });
    }

    // send response
    fn(null, {
      uidList: [...uidList],
      highestModseq
    });
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onSearch;
