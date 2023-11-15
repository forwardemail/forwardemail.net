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

const Attachments = require('#models/attachments');
const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const SocketError = require('#helpers/socket-error');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { convertResult } = require('#helpers/mongoose-to-sqlite');

const builder = new Builder();

// eslint-disable-next-line max-params, complexity
async function onCopy(connection, mailboxId, update, session, fn) {
  this.logger.debug('COPY', { connection, mailboxId, update, session });

  try {
    const { alias, db } = await this.refreshSession(session, 'COPY');

    // check if over quota
    const { isOverQuota } = await Aliases.isOverQuota(alias);
    if (isOverQuota)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', 'en'), {
        imapResponse: 'OVERQUOTA'
      });

    const mailbox = await Mailboxes.findOne(this, session, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    const targetMailbox = await Mailboxes.findOne(this, session, {
      path: update.destination
    });

    if (!targetMailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'TRYCREATE'
      });

    const sourceUid = [];
    const destinationUid = [];

    let copiedMessages = 0;
    let copiedStorage = 0;

    // start notifying connection of progress
    let timeout;
    (function update() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        connection.send('* OK Copy still in progress...');
        update();
      }, ms('1m'));
    })();

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

    //
    // NOTE: you cannot perform updates while iterating
    //       <https://github.com/WiseLibs/better-sqlite3/issues/203#issuecomment-456534827>
    //
    // NOTE: but you can if you set unsafe mode on
    //       <https://github.com/WiseLibs/better-sqlite3/issues/203#issuecomment-619401512>
    //       <https://github.com/WiseLibs/better-sqlite3/blob/master/docs/unsafe.md>
    //
    //       however from tests we see that this causes write conflicts
    //       (e.g. says it was written but then when you check it doesn't exist)
    //
    let messages;
    if (db.wsp) {
      messages = await this.wsp.request({
        action: 'stmt',
        session: { user: session.user },
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
      const message = await convertResult(Messages, result);

      this.logger.debug('copying message', { result, message });

      // check if server is in the process of shutting down
      if (this.server._closeTimeout) throw new ServerShutdownError();

      // check if socket is still connected
      const socket =
        (session.socket && session.socket._parent) || session.socket;
      if (!socket || socket?.destroyed || socket?.readyState !== 'open')
        throw new SocketError();

      // store current query for updating copied state
      const query = {
        _id: message._id,
        uid: message.uid,
        mailbox: message.mailbox
      };

      // don't copy in bulk so it doesn't get out of incremental uid sync
      sourceUid.unshift(message.uid);

      // eslint-disable-next-line no-await-in-loop
      const updatedMailbox = await Mailboxes.findOneAndUpdate(
        this,
        session,
        {
          _id: targetMailbox._id
        },
        {
          $inc: {
            uidNext: 1
          }
        },
        {
          returnDocument: 'before'
        }
      );

      if (!updatedMailbox)
        throw new IMAPError(
          i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'),
          {
            imapResponse: 'TRYCREATE'
          }
        );

      destinationUid.unshift(updatedMailbox.uidNext);

      // copy the message and generate new id
      message._id = new mongoose.Types.ObjectId();
      message.id = message._id.toString();
      message.mailbox = targetMailbox._id;
      message.uid = updatedMailbox.uidNext;
      message.exp =
        typeof targetMailbox.retention === 'number'
          ? targetMailbox.retention !== 0
          : false;
      message.rdate = new Date(
        Date.now() +
          (typeof targetMailbox.retention === 'number'
            ? targetMailbox.retention
            : 0)
      );
      message.modseq = updatedMailbox.modifyIndex;
      message.junk = targetMailbox.specialUse === '\\Junk';
      message.remoteAddress = session.remoteAddress;
      message.transaction = 'COPY';

      // virtual helper for locking if we lock in advance
      // message.lock = lock;

      // virtual helper
      message.instance = this;
      message.session = session;

      // set existing message as copied
      // TODO: may want to check for return value
      // eslint-disable-next-line no-await-in-loop
      await Messages.findOneAndUpdate(this, session, query, {
        $set: {
          copied: true
        }
      });

      // create new message
      // eslint-disable-next-line no-await-in-loop
      const newMessage = await Messages.create(message);

      // update attachment store magic number
      const attachmentIds = Object.keys(
        newMessage.mimeTree.attachmentMap || {}
      ).map((key) => newMessage.mimeTree.attachmentMap[key]);
      if (attachmentIds.length > 0) {
        try {
          // update attachments
          // eslint-disable-next-line no-await-in-loop
          await Attachments.updateMany(
            this,
            session,
            {
              hash: { $in: attachmentIds }
            },
            {
              $inc: {
                counter: 1,
                magic: newMessage.magic
              },
              $set: {
                counterUpdated: new Date()
              }
            }
            // {
            //   multi: true
            // }
          );
        } catch (err) {
          this.logger.fatal(err, { mailboxId, update, session });
        }
      }

      // increase counters
      copiedMessages++;
      copiedStorage += newMessage.size;

      // add entries
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.server.notifier.addEntries(this, session, targetMailbox, {
          command: 'EXISTS',
          uid: message.uid,
          mailbox: newMessage.mailbox,
          message: newMessage._id,
          thread: newMessage.thread,
          unseen: newMessage.unseen,
          idate: newMessage.idate,
          junk: newMessage.junk
        });
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // update quota if copied messages
    if (copiedMessages > 0 && copiedStorage > 0) {
      // send notifications
      this.server.notifier.fire(alias.id);

      //
      // NOTE: we don't error for quota during copy due to this reasoning
      //       <https://github.com/nodemailer/wildduck/issues/517#issuecomment-1748329188>
      //
      Aliases.isOverQuota(alias, copiedStorage)
        .then((results) => {
          if (results.isOverQuota) {
            const err = new IMAPError(
              i18n.translate(
                'IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA',
                'en',
                session.user.username
              ),
              {
                imapResponse: 'OVERQUOTA',
                isCodeBug: true // admins will get an email/sms alert
              }
            );
            this.logger.fatal(err, {
              mailboxId,
              update,
              session
            });
          }
        })
        .catch((err) =>
          this.logger.fatal(err, {
            copiedStorage,
            connection,
            mailboxId,
            update,
            session
          })
        );

      // NOTE: we update storage used in real-time in `getDatabase`
      // add to `alias.storageSize` the message `size`
      // Aliases.findByIdAndUpdate(alias._id, {
      //   $inc: {
      //     storageUsed: copiedStorage
      //   }
      // })
      //   .then()
      //   .catch((err) =>
      //     this.logger.fatal(err, {
      //       copiedStorage,
      //       connection,
      //       mailboxId,
      //       update,
      //       session
      //     })
      //   );
    }

    // update storage
    try {
      await this.wsp.request({
        action: 'size',
        timeout: ms('5s'),
        alias_id: alias.id
      });
    } catch (err) {
      this.logger.fatal(err);
    }

    fn(null, true, {
      uidValidity: targetMailbox.uidValidity,
      sourceUid,
      destinationUid
    });
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { connection, mailboxId, update, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onCopy;
