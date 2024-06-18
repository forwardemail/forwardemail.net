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
const ms = require('ms');
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

async function getModseq(instance, session, mailbox) {
  const updatedMailbox = await Mailboxes.findOneAndUpdate(
    instance,
    session,
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
    if (this?.constructor?.name === 'IMAP') {
      try {
        const [bool, response, writeStream] = await this.wsp.request({
          action: 'store',
          session: {
            id: session.id,
            user: session.user,
            remoteAddress: session.remoteAddress,
            selected: session.selected
          },
          mailboxId,
          update
        });
        if (Array.isArray(writeStream)) {
          for (const write of writeStream) {
            if (Array.isArray(write)) {
              session.writeStream.write(session.formatResponse(...write));
            } else {
              session.writeStream.write(write);
            }
          }
        }

        fn(null, bool, response);
      } catch (err) {
        fn(err);
      }

      return;
    }

    await this.refreshSession(session, 'STORE');

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

    const condstoreEnabled = Boolean(session.selected.condstoreEnabled);

    const query = {
      mailbox: mailbox._id
    };

    const modified = [];
    const writeStream = [];

    let entries = [];
    let bulkWrite = [];
    let newModseq;

    let queryAll;
    // `1:*`
    // <https://github.com/nodemailer/wildduck/pull/569>
    // if (_.isEqual(update.messages.sort(), session.selected.uidList.sort()))
    if (update.messages.length === session.selected.uidList.length)
      queryAll = true;
    // NOTE: don't use uid for `1:*`
    else query.uid = tools.checkRangeQuery(update.messages);

    // converts objectids -> strings and arrays/json appropriately
    const condition = JSON.parse(JSON.stringify(query));

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

    let messages;

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

    let err;
    let fire = false;

    try {
      for (const result of messages) {
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
        ) {
          this.logger.debug('message skipped due to queryAll', {
            message,
            queryAll,
            session,
            update
          });
          continue;
        }

        if (update.unchangedSince && message.modseq > update.unchangedSince) {
          this.logger.debug('message skipped due to unchangedSince', {
            message,
            queryAll,
            session,
            update
          });
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
        const modseq =
          // eslint-disable-next-line no-await-in-loop
          newModseq || (await getModseq(this, session, mailbox));

        if (!update.silent || condstoreEnabled) {
          // write to socket the response
          const payload = [
            'FETCH',
            message.uid,
            {
              uid: update.isUid ? message.uid : false,
              flags: message.flags,
              modseq: condstoreEnabled ? modseq : false
            }
          ];
          if (this?.constructor?.name === 'IMAP') {
            session.writeStream.write(session.formatResponse(...payload));
          } else {
            writeStream.push(payload);
          }
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
          command: 'FETCH',
          ignore: session.id,
          uid: message.uid,
          flags: message.flags,
          message: message._id,
          modseq
        });

        if (bulkWrite.length >= MAX_BULK_WRITE_SIZE) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await Messages.bulkWrite(this, session, bulkWrite, {
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
              await this.server.notifier.addEntries(
                this,
                session,
                mailbox,
                entries
              );
              fire = true;
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

    // update messages
    if (bulkWrite.length > 0)
      await Messages.bulkWrite(this, session, bulkWrite, {
        // ordered: false,
        // w: 1
      });

    if (entries.length > 0) {
      try {
        await this.server.notifier.addEntries(this, session, mailbox, entries);
        fire = true;
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    if (fire) {
      try {
        this.server.notifier.fire(session.user.alias_id);
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
        await Mailboxes.findOneAndUpdate(
          this,
          session,
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

    // update storage
    try {
      await this.wsp.request({
        action: 'size',
        timeout: ms('15s'),
        alias_id: session.user.alias_id
      });
    } catch (err) {
      this.logger.fatal(err);
    }

    // if there was an error during cursor then throw
    if (err) throw err;

    // send response
    fn(null, true, modified, writeStream);
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
