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

const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const updateStorageUsed = require('#helpers/update-storage-used');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder();

// eslint-disable-next-line complexity
async function onExpunge(mailboxId, update, session, fn) {
  this.logger.debug('EXPUNGE', { mailboxId, update, session });

  if (this.wsp) {
    try {
      const [bool, writeStream] = await this.wsp.request({
        action: 'expunge',
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

      fn(null, bool);
    } catch (err) {
      fn(err);
    }

    return;
  }

  let lock;
  try {
    await this.refreshSession(session, 'EXPUNGE');

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

    const writeStream = [];

    // let storageUsed = 0;

    const condition = {
      mailbox: mailbox._id.toString(),
      undeleted: 0
    };

    if (update.isUid) condition.uid = tools.checkRangeQuery(update.messages);

    this.logger.debug('expunge query', { condition });

    lock = await acquireLock(this, session.db);

    let err;

    try {
      const sql = builder.build({
        type: 'select',
        table: 'Messages',
        condition,
        // sort required for IMAP UIDPLUS
        sort: 'uid'
      });

      const messages = session.db.prepare(sql.query).all(sql.values);

      if (messages.length > 0) {
        const results = await Messages.deleteMany(
          this,
          session,
          {
            $or: messages.map((message) => ({
              _id: message._id,
              mailbox: mailbox._id,
              uid: message.uid
            }))
          },
          { lock }
        );

        if (results?.deletedCount > 0) {
          // delete attachments
          await Promise.all(
            messages.map(async (_message) => {
              const message = syncConvertResult(Messages, _message);
              const attachmentIds = message?.mimeTree?.attachmentMap
                ? Object.keys(message.mimeTree.attachmentMap || {}).map(
                    (key) => message.mimeTree.attachmentMap[key]
                  )
                : [];
              if (attachmentIds.length > 0) {
                try {
                  await this.attachmentStorage.deleteMany(
                    this,
                    session,
                    attachmentIds,
                    message.magic,
                    lock
                  );
                } catch (err) {
                  this.logger.fatal(err, {
                    attachmentIds,
                    message,
                    mailbox,
                    update,
                    session
                  });
                }
              }
            })
          );
        }

        // write to socket we've expunged message
        if (
          !update.silent ||
          (session &&
            session.selected &&
            session.selected.mailbox &&
            session.selected.mailbox.toString() === mailbox._id.toString())
        ) {
          for (const message of messages) {
            writeStream.push(['EXPUNGE', message.uid]);
          }
        }

        await this.server.notifier.addEntries(
          this,
          session,
          mailbox,
          messages.map((message) => ({
            ignore: session.id,
            command: 'EXPUNGE',
            uid: message.uid,
            mailbox: mailbox._id,
            message: message._id,
            thread: message.thread,
            modseq: message.modseq,
            unseen: message.unseen,
            idate: message.idate
          }))
        );
        this.server.notifier.fire(session.user.alias_id);
      }
    } catch (_err) {
      err = _err;
    }

    // release lock
    try {
      await releaseLock(this, session.db, lock);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
    }

    // NOTE: we update storage used in real-time in `getDatabase`
    // update storage quota
    // if (storageUsed > 0)
    //   Aliases.findOneAndUpdate(
    //     {
    //       _id: alias._id
    //     },
    //     {
    //       $inc: {
    //         storageUsed: storageUsed * -1
    //       }
    //     }
    //   )
    //     .then()
    //     .catch((err) =>
    //       this.logger.fatal(err, { storageUsed, mailboxId, update, session })
    //     );

    // update storage
    try {
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
    }

    // throw error
    if (err) throw err;

    fn(null, true, writeStream);
  } catch (err) {
    // release lock
    if (lock?.success) {
      try {
        await releaseLock(this, session.db, lock);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, update, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onExpunge;
