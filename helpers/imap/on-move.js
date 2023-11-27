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
const ms = require('ms');
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { convertResult } = require('#helpers/mongoose-to-sqlite');
const { acquireLock, releaseLock } = require('#helpers/lock');

const BULK_BATCH_SIZE = 150;

const builder = new Builder();

// eslint-disable-next-line complexity
async function onMove(mailboxId, update, session, fn) {
  this.logger.debug('MOVE', { mailboxId, update, session });

  let lock;
  try {
    if (this?.constructor?.name === 'IMAP') {
      try {
        const [bool, response, writeStream] = await this.wsp.request({
          action: 'move',
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

    await this.refreshSession(session, 'MOVE');

    // TODO: parallel

    const mailbox = await Mailboxes.findOne(this, session, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    const targetMailbox = await Mailboxes.findOne(this, session, {
      path: update.destination
    });

    if (!targetMailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    lock = await acquireLock(this, session.db);

    let err;

    let existEntries = [];
    let expungeEntries = [];

    const sourceUid = [];
    const destinationUid = [];
    const writeStream = [];

    try {
      // increment modification index to indicate a change occurred
      const updatedMailbox = await Mailboxes.findOneAndUpdate(
        this,
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

      if (session.db.wsp) {
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
        messages = session.db.prepare(sql.query).all(sql.values);
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

        // store reference to existing message data
        const existingMessageId = message._id;
        const existingMailboxId = message.mailbox;
        const existingMessageUid = message.uid;

        // add to source uid array
        sourceUid.push(existingMessageUid);

        // eslint-disable-next-line no-await-in-loop
        const updatedTargetMailbox = await Mailboxes.findOneAndUpdate(
          this,
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
        message.instance = this;
        message.session = session;

        // create new message (in new target mailbox)
        // eslint-disable-next-line no-await-in-loop
        message = await Messages.create(message);

        existEntries.push({
          ignore: session.id,
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
          this,
          session,
          {
            _id: existingMessageId,
            mailbox: existingMailboxId,
            uid: existingMessageUid
          },
          { lock }
        );

        if (results && results.deletedCount) {
          if (this?.constructor?.name === 'IMAP') {
            session.writeStream.write(
              session.formatResponse('EXPUNGE', sourceUid)
            );
            session.writeStream.write(
              session.formatResponse('EXPUNGE', existingMessageUid)
            );
          } else {
            writeStream.push(
              ['EXPUNGE', sourceUid],
              ['EXPUNGE', existingMessageUid]
            );
          }

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
        let notify = false;

        if (expungeEntries.length >= BULK_BATCH_SIZE) {
          // expunge messages from old mailbox
          try {
            // eslint-disable-next-line no-await-in-loop
            await this.server.notifier.addEntries(
              session,
              mailbox,
              expungeEntries,
              lock
            );
            expungeEntries = [];
            notify = true;
          } catch (err) {
            this.logger.fatal(err, { mailboxId, update, session });
          }
        }

        if (existEntries.length >= BULK_BATCH_SIZE) {
          // add new messages to new mailbox
          try {
            // eslint-disable-next-line no-await-in-loop
            await this.server.notifier.addEntries(
              this,
              session,
              targetMailbox._id,
              existEntries,
              lock
            );
            existEntries = [];
            notify = true;
          } catch (err) {
            this.logger.fatal(err, { mailboxId, update, session });
          }
        }

        if (notify) {
          try {
            this.server.notifier.fire(session.user.alias_id);
          } catch (err) {
            this.logger.fatal(err, { mailboxId, update, session });
          }
        }
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

    // write any if needed
    if (sourceUid.length > 0) {
      const payload = {
        tag: '*',
        command: String(session.selected.uidList.length),
        attributes: [
          {
            type: 'atom',
            value: 'EXISTS'
          }
        ]
      };
      if (this?.constructor?.name === 'IMAP') {
        session.writeStream.write(payload);
      } else {
        writeStream.push(payload);
      }
    }

    //
    // iterate over entries if necessary
    //
    if (expungeEntries.length > 0) {
      // expunge messages from old mailbox
      try {
        await this.server.notifier.addEntries(
          this,
          session,
          mailbox,
          expungeEntries,
          lock
        );
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    if (existEntries.length > 0) {
      // add new messages to new mailbox
      try {
        await this.server.notifier.addEntries(
          this,
          session,
          targetMailbox,
          existEntries,
          lock
        );
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    if (expungeEntries.length > 0 || existEntries.length > 0) {
      try {
        this.server.notifier.fire(session.user.alias_id);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // update storage
    try {
      await this.wsp.request({
        action: 'size',
        timeout: ms('5s'),
        alias_id: session.user.alias_id
      });
    } catch (err) {
      this.logger.fatal(err);
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
    fn(null, true, response, writeStream);
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

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onMove;
