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
const ms = require('ms');
const tools = require('wildduck/lib/tools');

const IMAPError = require('#helpers/imap-error');
const Messages = require('#models/messages');
const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onSearch(mailboxId, options, session, fn) {
  this.logger.debug('SEARCH', { mailboxId, options, session, fn });

  try {
    const { alias } = await this.refreshSession(session, 'SEARCH');

    const mailbox = await Mailboxes.findOne({
      _id: mailboxId,
      alias: alias._id
    })
      .maxTimeMS(ms('3s'))
      .lean()
      .exec();

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    // prepare query for search
    const query = {
      mailbox: mailbox._id,
      alias: alias._id
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
            // search over email body
            if (term.value && !ne) {
              // fulltext can only be in the root of the query, not in $not, $or expressions
              // https://docs.mongodb.com/v3.4/tutorial/text-search-in-aggregation/#restrictions
              query.alias = alias._id;
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
              const regex = _.escapeRegExp(
                Buffer.from(term.value, 'binary').toString()
              );
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
                  // TODO: should we log an error here (?)
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
                  // TODO: should we log an error here (?)
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
                  // TODO: should we log an error here (?)
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
            // TODO: should we log an error here (?)
            break;
          }
        }
      }
    };

    const $and = [];
    walkQuery($and, false, options.query);

    if (returned) return;

    if ($and.length > 0) query.$and = $and;

    // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
    const cursor = Messages.find(query, {
      uid: true,
      modseq: true
    })
      // <https://github.com/Automattic/mongoose/issues/4670#issuecomment-260161006>
      .read('sp')
      .maxTimeMS(ms('2m'))
      .lean()
      .cursor();

    try {
      for await (const message of cursor) {
        this.logger.debug('fetched message', {
          message,
          mailboxId,
          options,
          session
        });

        if (!message) break;

        if (highestModseq < message.modseq) highestModseq = message.modseq;

        uidList.push(message.uid);
      }
    } catch (err) {
      this.logger.fatal(err, { mailboxId, options, session });
      throw new IMAPError(i18n.translateError('IMAP_INVALID_SEARCH'));
    }

    // close cursor for cleanup
    try {
      await cursor.close();
    } catch (err) {
      this.logger.fatal(err, { mailboxId, options, session });
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
