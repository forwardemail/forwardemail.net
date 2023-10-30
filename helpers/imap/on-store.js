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

const imapTools = require('wildduck/imap-core/lib/imap-tools');
const safeStringify = require('fast-safe-stringify');
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { convertResult } = require('#helpers/mongoose-to-sqlite');

const MAX_BULK_WRITE_SIZE = 150;

const builder = new Builder();

function getFlag(f) {
  return f.trim().toLowerCase();
}

async function getModseq(db, mailbox) {
  const updatedMailbox = await Mailboxes.findOneAndUpdate(
    db,
    {
      _id: mailbox._id
    },
    {
      $inc: {
        modifyIndex: 1
      }
    },
    {
      returnDocument: 'after'
    }
  );
  return updatedMailbox && updatedMailbox.modifyIndex;
}

// eslint-disable-next-line complexity
async function onStore(mailboxId, update, session, fn) {
  this.logger.debug('STORE', { mailboxId, update, session });

  try {
    const { alias, db } = await this.refreshSession(session, 'STORE');

    const mailbox = await Mailboxes.findOne(db, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    const condstoreEnabled = Boolean(session.selected.condstoreEnabled);

    const query = {
      mailbox: mailbox._id
    };

    const modified = [];

    let entries = [];
    let bulkWrite = [];
    let newModseq;

    let queryAll;
    // `1:*`
    if (update.messages.length === session.selected.uidList.length)
      queryAll = true;
    // NOTE: don't use uid for `1:*`
    else query.uid = tools.checkRangeQuery(update.messages);

    // converts objectids -> strings and arrays/json appropriately
    const condition = JSON.parse(safeStringify(query));

    // TODO: `condition` may need further refined for accuracy (e.g. see `prepareQuery`)

    const projection = {
      _id: true,
      uid: true,
      flags: true,
      modseq: true
    };

    const fields = Object.keys(projection);

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      fields,
      // sort required for IMAP UIDPLUS
      sort: 'uid'
    });

    const stmt = db.prepare(sql.query);

    let err;

    try {
      // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#iteratebindparameters---iterator>

      // turn on unsafe mode to allow us to iterate, select, and update at the same time
      db.unsafeMode(true);

      for (const result of stmt.iterate(sql.values)) {
        // eslint-disable-next-line no-await-in-loop
        const message = await convertResult(Messages, result, projection);

        this.logger.debug('fetched message', {
          result,
          message,
          mailboxId,
          update,
          session
        });

        // return early if no message
        // TODO: does this actually occur as an edge case (?)
        if (!message) {
          this.logger.fatal('message not fetched', {
            mailboxId,
            update,
            session
          });
          break;
        }

        // skip messages if necessary
        if (
          queryAll &&
          session?.selected?.uidList &&
          Array.isArray(session.selected.uidList) &&
          !session.selected.uidList.includes(message.uid)
        )
          continue;

        if (update.unchangedSince && message.modseq > update.unchangedSince) {
          modified.push(message.uid);
          continue;
        }

        // TODO: trim() on flags in message model (?)
        const existingFlags = new Set(message.flags.map((f) => getFlag(f)));

        let flagsUpdate;
        let updated;

        switch (update.action) {
          case 'set': {
            // operation is only an update if flags are different
            if (
              existingFlags.size !== update.value.length ||
              update.value.some((f) => !existingFlags.has(getFlag(f)))
            )
              updated = true;

            message.flags = [update.value].flat();

            // set flags
            if (updated) {
              flagsUpdate = {
                $set: {
                  flags: message.flags,
                  unseen: !message.flags.includes('\\Seen'),
                  flagged: message.flags.includes('\\Flagged'),
                  undeleted: !message.flags.includes('\\Deleted'),
                  draft: message.flags.includes('\\Draft')
                }
              };

              if (message.flags.includes('\\Deleted'))
                flagsUpdate.$unset = {
                  searchable: ''
                };
              else flagsUpdate.$set.searchable = true;
            }

            break;
          }

          case 'add': {
            const newFlags = [];
            message.flags = [
              ...message.flags,
              ...update.value.filter((f) => {
                if (!existingFlags.has(getFlag(f))) {
                  updated = true;
                  newFlags.push(f);
                  return true;
                }

                return false;
              })
            ];

            // add flags
            if (updated) {
              flagsUpdate = {
                $addToSet: {
                  flags: {
                    $each: newFlags
                  }
                }
              };

              if (
                newFlags.includes('\\Seen') ||
                newFlags.includes('\\Flagged') ||
                newFlags.includes('\\Deleted') ||
                newFlags.includes('\\Draft')
              ) {
                flagsUpdate.$set = {};

                if (newFlags.includes('\\Seen')) {
                  flagsUpdate.$set = {
                    unseen: false
                  };
                }

                if (newFlags.includes('\\Flagged')) {
                  flagsUpdate.$set = {
                    flagged: true
                  };
                }

                if (newFlags.includes('\\Deleted')) {
                  flagsUpdate.$set = {
                    undeleted: false
                  };
                  flagsUpdate.$unset = {
                    searchable: ''
                  };
                }

                if (newFlags.includes('\\Draft')) {
                  flagsUpdate.$set = {
                    draft: true
                  };
                }
              }
            }

            break;
          }

          case 'remove': {
            // operation is only an update if flags are different
            const oldFlags = [];
            const flagUpdates = new Set(update.value.map((f) => getFlag(f)));
            message.flags = message.flags.filter((f) => {
              if (!flagUpdates.has(getFlag(f))) return true;

              oldFlags.push(f);
              updated = true;
              return false;
            });

            // remove flags
            if (updated) {
              flagsUpdate = {
                $pull: {
                  flags: {
                    $in: oldFlags
                  }
                }
              };
              if (
                oldFlags.includes('\\Seen') ||
                oldFlags.includes('\\Flagged') ||
                oldFlags.includes('\\Deleted') ||
                oldFlags.includes('\\Draft')
              ) {
                flagsUpdate.$set = {};
                if (oldFlags.includes('\\Seen')) {
                  flagsUpdate.$set = {
                    unseen: true
                  };
                }

                if (oldFlags.includes('\\Flagged')) {
                  flagsUpdate.$set = {
                    flagged: false
                  };
                }

                if (oldFlags.includes('\\Deleted')) {
                  flagsUpdate.$set = {
                    undeleted: true
                  };
                  if (!['\\Junk', '\\Trash'].includes(mailbox.specialUse)) {
                    flagsUpdate.$set.searchable = true;
                  }
                }

                if (oldFlags.includes('\\Draft')) {
                  flagsUpdate.$set = {
                    draft: false
                  };
                }
              }
            }

            break;
          }

          default: {
            throw new TypeError('Unknown action');
          }
        }

        // return early if not updated
        if (!updated) continue;

        // get modseq
        // eslint-disable-next-line no-await-in-loop
        const modseq = newModseq || (await getModseq(db, mailbox));

        if (!update.silent || condstoreEnabled) {
          // write to socket the response
          session.writeStream.write(
            session.formatResponse('FETCH', message.uid, {
              uid: update.isUid ? message.uid : false,
              flags: message.flags,
              modseq: condstoreEnabled ? modseq : false
            })
          );
        }

        if (!flagsUpdate.$set) flagsUpdate.$set = {};

        flagsUpdate.$set.modseq = modseq;

        bulkWrite.push({
          updateOne: {
            filter: {
              _id: message._id,
              mailbox: mailbox._id,
              uid: message.uid,
              modseq: {
                $lt: modseq
              }
            },
            update: flagsUpdate
          }
        });

        entries.push({
          // TODO: do we want to ignore this (?)
          // ignore: session.id,
          command: 'FETCH',
          uid: message.uid,
          message: message._id,
          mailbox: mailbox._id,
          thread: message.thread,
          modseq,
          unseen: update.value && update.value.includes('\\Seen'),
          idate: message.idate
        });

        if (bulkWrite.length >= MAX_BULK_WRITE_SIZE) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await Messages.bulkWrite(db, bulkWrite, {
              // ordered: false,
              // w: 1
            });
            bulkWrite = [];
          } catch (err) {
            bulkWrite = [];
            this.logger.fatal(err, { mailboxId, update, session });
            throw err;
          }

          if (entries.length > 0) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await this.server.notifier.addEntries(db, mailbox, entries);
              this.server.notifier.fire(alias.id);
              entries = [];
            } catch (err) {
              this.logger.fatal(err, { mailboxId, update, session });
            }
          }
        }
      }
    } catch (_err) {
      err = _err;
    }

    // turn off unsafe mode
    db.unsafeMode(false);

    // update messages
    if (bulkWrite.length > 0)
      await Messages.bulkWrite(db, bulkWrite, {
        // ordered: false,
        // w: 1
      });

    if (entries.length > 0) {
      try {
        await this.server.notifier.addEntries(db, mailbox, entries);
        this.server.notifier.fire(alias.id);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // update mailbox flags
    if (update.action !== 'remove') {
      const mailboxFlags = [
        ...imapTools.systemFlags,
        ...(mailbox.flags || [])
      ].map((f) => getFlag(f));
      const newFlags = [];

      // find flags that don't yet exist for mailbox to add
      for (const flag of update.value) {
        // TODO: probably should error here for >= 100
        // limit mailbox flags by 100
        if (mailboxFlags.length + newFlags.length >= 100) continue;

        // add flag if mailbox does not include it
        if (!mailboxFlags.includes(getFlag(flag))) newFlags.push(flag);
      }

      if (newFlags.length > 0) {
        // TODO: see FIXME from wildduck at <https://github.com/nodemailer/wildduck/blob/fed3d93f7f2530d468accbbac09ef6195920b28e/lib/handlers/on-store.js#L419>
        await Mailboxes.updateOne(
          db,
          {
            _id: mailbox._id
          },
          {
            $addToSet: {
              flags: {
                $each: newFlags
              }
            }
          }
        );
      }
    }

    // close the connection
    db.close();

    // if there was an error during cursor then throw
    if (err) throw err;

    // send response
    fn(null, true, modified);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, update, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onStore;
