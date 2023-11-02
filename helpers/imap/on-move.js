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

const mongoose = require('mongoose');
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { convertResult } = require('#helpers/mongoose-to-sqlite');

const BULK_BATCH_SIZE = 150;

const builder = new Builder();

// eslint-disable-next-line complexity
async function onMove(mailboxId, update, session, fn) {
  this.logger.debug('MOVE', { mailboxId, update, session });

  let lock;

  try {
    const { alias, db } = await this.refreshSession(session, 'MOVE');

    // TODO: parallel

    const mailbox = await Mailboxes.findOne(db, this.wsp, session, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    const targetMailbox = await Mailboxes.findOne(db, this.wsp, session, {
      path: update.destination
    });

    if (!targetMailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    lock = await db.acquireLock();

    let err;

    let existEntries = [];
    let expungeEntries = [];

    const sourceUid = [];
    const destinationUid = [];

    try {
      // increment modification index to indicate a change occurred
      const updatedMailbox = await Mailboxes.findOneAndUpdate(
        db,
        this.wsp,
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
          lock,
          returnDocument: 'after',
          projection: {
            _id: true,
            uidNext: true,
            modifyIndex: true
          }
        }
      );

      //
      // NOTE: wildduck does not check that the result exists nor does it pass NONEXISTENT on this edge case
      // (e.g. `throw new IMAPError('...', { imapResponse: 'NONEXISTENT' });`)
      //
      if (!updatedMailbox)
        throw new IMAPError(
          i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en')
        );

      const newModseq = updatedMailbox.modifyIndex || 1;

      const sql = builder.build({
        type: 'select',
        table: 'Messages',
        condition: {
          mailbox: mailbox._id.toString(),
          uid: tools.checkRangeQuery(update.messages)
        },
        // sort required for IMAP UIDPLUS
        sort: 'uid'
      });

      let messages;

      if (db.wsp) {
        messages = await this.wsp.request({
          action: 'stmt',
          session: { user: session.user },
          lock,
          stmt: [
            ['prepare', sql.query],
            ['all', sql.values]
          ]
        });
      } else {
        messages = db.prepare(sql.query).all(sql.values);
      }

      for (const result of messages) {
        // eslint-disable-next-line no-await-in-loop
        let message = await convertResult(Messages, result);

        this.logger.debug('fetched message', {
          result,
          message,
          mailboxId,
          update,
          session
        });

        //
        // this is a fix for clients like Thunderbird which
        // do not display Draft flagged messages in the Inbox
        // (even though they exist in the Inbox)
        //
        // TODO: notify wildduck about this in GH issues
        //
        // if (targetMailbox.specialUse !== '\\Drafts')
        //   message.flags = _.pull(message.flags, '\\Draft');

        // store reference to existing message data
        const existingMessageId = message._id;
        const existingMailboxId = message.mailbox;
        const existingMessageUid = message.uid;

        // add to source uid array
        sourceUid.push(existingMessageUid);

        // eslint-disable-next-line no-await-in-loop
        const updatedTargetMailbox = await Mailboxes.findOneAndUpdate(
          db,
          this.wsp,
          session,
          {
            _id: targetMailbox._id,
            path: update.destination
          },
          {
            $inc: {
              uidNext: 1
            }
          },
          {
            lock,
            projection: {
              uidNext: true,
              modifyIndex: true
            },
            returnDocument: 'before'
          }
        );

        // NOTE: wildduck does not pass NONEXISTENT on this edge case
        // <https://github.com/nodemailer/wildduck/blob/fed3d93f7f2530d468accbbac09ef6195920b28e/lib/message-handler.js#L942-L944>
        // (e.g. `throw new IMAPError('...', { imapResponse: 'NONEXISTENT' });`)
        if (!updatedTargetMailbox)
          throw new IMAPError(
            i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en')
          );

        // push new destination uid
        destinationUid.push(updatedTargetMailbox.uidNext);

        const { unseen } = message;

        // update message
        message._id = new mongoose.Types.ObjectId();
        message.id = message._id.toString();
        message.mailbox = targetMailbox._id;
        message.uid = updatedTargetMailbox.uidNext;
        message.exp =
          typeof targetMailbox.retention === 'number'
            ? targetMailbox.retention !== 0
            : false;
        message.rdate = new Date(Date.now() + (targetMailbox.retention || 0));
        message.modseq = updatedTargetMailbox.modifyIndex;
        message.junk = targetMailbox.specialUse === '\\Junk';
        message.remoteAddress = session.remoteAddress;
        message.transaction = 'MOVE';
        message.searchable = !message.flags.includes('\\Deleted');

        // virtual helper for locking if we lock in advance
        message.lock = lock;

        // virtual db helper
        message.db = db;
        message.wsp = this.wsp;
        message.session = session;

        // create new message (in new target mailbox)
        // eslint-disable-next-line no-await-in-loop
        message = await Messages.create(message);

        existEntries.push({
          // NOTE: we don't want to ignore this
          // ignore: session.id,
          command: 'EXISTS',
          uid: message.uid,
          // mailbox: message.mailbox,
          message: message._id,
          thread: message.thread,
          // modseq: message.modseq,
          unseen: message.unseen,
          idate: message.idate,
          ...(message.junk ? { junk: true } : {})
        });

        // delete old message
        // eslint-disable-next-line no-await-in-loop
        const results = await Messages.deleteOne(
          db,
          this.wsp,
          session,
          {
            _id: existingMessageId,
            mailbox: existingMailboxId,
            uid: existingMessageUid
          },
          { lock }
        );

        if (results && results.deletedCount) {
          session.writeStream.write(
            session.formatResponse('EXPUNGE', sourceUid)
          );
          session.writeStream.write(
            session.formatResponse('EXPUNGE', existingMessageUid)
          );
          expungeEntries.push({
            ignore: session.id,
            command: 'EXPUNGE',
            uid: existingMessageUid,
            modseq: newModseq,
            unseen,
            idate: message.idate,
            mailbox: existingMailboxId,
            message: existingMessageId,
            thread: message.thread
          });
        } else {
          this.logger.fatal(new Error('failed to delete old message'), {
            mailboxId,
            update,
            session
          });
        }

        //
        // iterate over entries if necessary
        //
        if (expungeEntries.length >= BULK_BATCH_SIZE) {
          // expunge messages from old mailbox
          try {
            // eslint-disable-next-line no-await-in-loop
            await this.server.notifier.addEntries(
              db,
              mailbox,
              expungeEntries,
              lock
            );
            expungeEntries = [];
            this.server.notifier.fire(alias.id);
          } catch (err) {
            this.logger.fatal(err, { mailboxId, update, session });
          }
        }

        if (existEntries.length >= BULK_BATCH_SIZE) {
          // add new messages to new mailbox
          try {
            // eslint-disable-next-line no-await-in-loop
            await this.server.notifier.addEntries(
              db,
              targetMailbox._id,
              existEntries,
              lock
            );
            existEntries = [];
            this.server.notifier.fire(alias.id);
          } catch (err) {
            this.logger.fatal(err, { mailboxId, update, session });
          }
        }
      }
    } catch (_err) {
      err = _err;
    }

    // close the connection
    db.close();

    // release lock
    try {
      await db.releaseLock(lock);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
    }

    // write any if needed
    if (sourceUid.length > 0)
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

    //
    // iterate over entries if necessary
    //
    if (expungeEntries.length > 0) {
      // expunge messages from old mailbox
      try {
        await this.server.notifier.addEntries(
          db,
          mailbox,
          expungeEntries,
          lock
        );
        this.server.notifier.fire(alias.id);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    if (existEntries.length > 0) {
      // add new messages to new mailbox
      try {
        await this.server.notifier.addEntries(
          db,
          targetMailbox,
          existEntries,
          lock
        );
        this.server.notifier.fire(alias.id);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // throw error if any
    if (err) throw err;

    // send response
    const response = {
      uidValidity: targetMailbox.uidValidity,
      sourceUid,
      destinationUid,
      mailbox: mailbox._id,
      target: targetMailbox._id,
      status: 'moved'
    };
    fn(null, true, response);
  } catch (err) {
    // release lock
    if (lock?.success) {
      try {
        await this.lock.releaseLock(lock);
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

module.exports = onMove;
