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

const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { convertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder();

// eslint-disable-next-line complexity
async function onExpunge(mailboxId, update, session, fn) {
  this.logger.debug('EXPUNGE', { mailboxId, update, session });

  let lock;
  try {
    const { alias, db } = await this.refreshSession(session, 'EXPUNGE');

    const mailbox = await Mailboxes.findOne(db, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    let storageUsed = 0;

    const condition = {
      mailbox: mailbox._id.toString(),
      undeleted: false
    };

    if (update.isUid) condition.uid = tools.checkRangeQuery(update.messages);

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      // sort required for IMAP UIDPLUS
      sort: 'uid'
    });

    const stmt = db.prepare(sql.query);

    this.logger.debug('expunge query', { condition });

    let err;

    // turn on unsafe mode to allow us to iterate, select, and update at the same time
    db.unsafeMode(true);

    lock = await db.acquireLock();

    try {
      // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#iteratebindparameters---iterator>
      for (const result of stmt.iterate(sql.values)) {
        // eslint-disable-next-line no-await-in-loop
        const message = await convertResult(Messages, result);

        this.logger.debug('expunge message', {
          result,
          message,
          mailboxId,
          update,
          session
        });

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
              this.logger.fatal(err, { message. mailboxId, update, session });
            } else {
              throw err;
            }
          }
        }
        */

        // delete message
        // eslint-disable-next-line no-await-in-loop
        const results = await Messages.deleteOne(
          db,
          {
            _id: message._id,
            mailbox: mailbox._id,
            uid: message.uid
          },
          { lock }
        );

        if (results?.deletedCount === 1) {
          // if we deleted a message then adjust storage quota
          storageUsed += message.size;

          // delete attachments
          const attachmentIds = message?.mimeTree?.attachmentMap
            ? Object.keys(message.mimeTree.attachmentMap || {}).map(
                (key) => message.mimeTree.attachmentMap[key]
              )
            : [];
          if (attachmentIds.length > 0) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await this.attachmentStorage.deleteMany(
                db,
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

          // write to socket we've expunged message
          if (
            !update.silent ||
            (session &&
              session.selected &&
              session.selected.mailbox &&
              session.selected.mailbox.toString() === mailbox.id)
          ) {
            session.writeStream.write(
              session.formatResponse('EXPUNGE', message.uid)
            );
          }

          try {
            // eslint-disable-next-line no-await-in-loop
            await this.server.notifier.addEntries(
              db,
              mailbox,
              {
                ignore: session.id,
                command: 'EXPUNGE',
                uid: message.uid,
                mailbox: mailbox._id,
                message: message._id,
                thread: message.thread,
                // modseq: message.modseq,
                unseen: message.unseen,
                idate: message.idate
              },
              lock
            );
            this.server.notifier.fire(alias.id);
          } catch (err) {
            this.logger.fatal(err, { mailboxId, update, session });
          }
        }
      }
    } catch (_err) {
      err = _err;
    }

    // turn off unsafe mode
    db.unsafeMode(false);

    // close the connection
    db.close();

    // release lock
    try {
      await db.releaseLock(lock);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
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
          this.logger.fatal(err, { storageUsed, mailboxId, update, session })
        );

    // throw error
    if (err) throw err;

    fn(null, true);
  } catch (err) {
    // release lock
    if (lock?.success) {
      try {
        await this.server.lock.releaseLock(lock);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, update, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onExpunge;
