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

const ms = require('ms');
const tools = require('wildduck/lib/tools');

const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const refineAndLogError = require('#helpers/refine-and-log-error');

// eslint-disable-next-line complexity
async function onExpunge(mailboxId, update, session, fn) {
  logger.debug('EXPUNGE', { mailboxId, update, session });

  try {
    const { alias } = await this.refreshSession(session, 'EXPUNGE');

    const mailbox = await Mailboxes.findOne({
      alias: alias._id,
      _id: mailboxId
    })
      .maxTimeMS(ms('3s'))
      .lean()
      .exec();

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    const lock = await this.server.lock.waitAcquireLock(
      `mbwr:${mailbox.id}`,
      ms('5m'),
      ms('1m')
    );

    if (!lock.success)
      throw new IMAPError(i18n.translate('IMAP_WRITE_LOCK_FAILED'));

    let storageUsed = 0;

    const query = {
      mailbox: mailbox._id,
      alias: alias._id,
      undeleted: false
    };

    if (update.isUid) query.uid = tools.checkRangeQuery(update.messages);

    // eslint-disable-next-line unicorn/no-array-callback-reference
    const cursor = Messages.find(query)
      .sort({
        uid: 1
      })
      .maxTimeMS('2m')
      .lean()
      .cursor();

    logger.debug('expunge query', { query });

    let err;

    try {
      for await (const message of cursor) {
        logger.debug('expunge message', {
          message,
          mailboxId,
          update,
          session
        });

        //
        // TODO: will edge cases like this in cursor() usage ever occur (?)
        //
        if (!message) {
          logger.fatal('message not expunged', { mailboxId, update, session });
          // write to stream
          if (
            !update.silent &&
            session?.selected?.uidList &&
            Array.isArray(session.selected.uidList)
          )
            session.writeStream.write({
              tag: '*',
              command: String(session.selected.uidList.length),
              attributes: [
                {
                  type: 'atom',
                  value: 'EXISTS'
                }
              ]
            });
          break;
        }

        /*
        // archive message (not used yet)
        // don't archive drafts nor copies
        const shouldArchive = !message.flags.includes('\\Draft') && !message.copied;
        if (shouldArchive) {
          message.archived = new Date();
          message.exp = true;
          message.rdate = new Date(message.archived.getTime() + ms('30d'));
          try {
            await Archived.insertOne(message);
          } catch (err) {
            // duplicate error (already archived)
            if (err.code === 11000) {
              logger.fatal(err, { message. mailboxId, update, session });
            } else {
              throw err;
            }
          }
        }
        */

        // delete message
        const results = await Messages.deleteOne({
          _id: message._id,
          mailbox: mailbox._id,
          alias: alias._id,
          uid: message.uid
        });

        if (results?.deletedCount === 1) {
          // if we deleted a message then adjust storage quota
          storageUsed += message.size;

          // delete attachments
          const attachmentIds = message?.mimeTree?.attachmentMap
            ? Object.keys(message.mimeTree.attachmentMap || {}).map(
                (key) => message.mimeTree.attachmentMap[key]
              )
            : [];
          if (attachmentIds.length > 0)
            this.attachmentStorage
              .deleteManyPromise(attachmentIds, message.magic)
              .then()
              .catch((err) =>
                logger.fatal(err, { mailboxId, update, session })
              );

          // write to socket we've expunged message
          if (
            !update.silent ||
            (session &&
              session.selected &&
              session.selected.mailbox &&
              session.selected.mailbox.toString() === mailbox.id)
          )
            session.writeStream.write(
              session.formatResponse('EXPUNGE', message.uid)
            );

          try {
            await this.server.notifier.addEntries(mailbox, {
              ignore: session.id,
              command: 'EXPUNGE',
              uid: message.uid,
              mailbox: mailbox._id,
              message: message._id,
              thread: message.thread,
              // modseq: message.modseq,
              unseen: message.unseen,
              idate: message.idate
            });
            this.server.notifier.fire(alias.id);
          } catch (err) {
            logger.fatal(err, { mailboxId, update, session });
          }
        }
      }
    } catch (_err) {
      err = _err;
    }

    // close cursor for cleanup
    try {
      await cursor.close();
    } catch (err) {
      logger.fatal(err, { mailboxId, update, session });
    }

    // release lock
    try {
      await this.server.lock.releaseLock(lock);
    } catch (err) {
      logger.fatal(err, { mailboxId, update, session });
    }

    // update storage quota
    if (storageUsed > 0)
      Aliases.findOneAndUpdate(
        {
          _id: alias._id
        },
        {
          $inc: {
            storageUsed: storageUsed * -1
          }
        }
      )
        .then()
        .catch((err) =>
          logger.fatal(err, { storageUsed, mailboxId, update, session })
        );

    // throw error
    if (err) throw err;

    fn(null, true);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      logger.error(err, { mailboxId, update, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onExpunge;
