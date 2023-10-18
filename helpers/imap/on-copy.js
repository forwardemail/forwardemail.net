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

const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const SocketError = require('#helpers/socket-error');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

// eslint-disable-next-line max-params, complexity
async function onCopy(connection, mailboxId, update, session, fn) {
  this.logger.debug('COPY', { connection, mailboxId, update, session });

  try {
    const { alias } = await this.refreshSession(session, 'COPY');

    // check if over quota
    const overQuota = await Aliases.isOverQuota(alias);
    if (overQuota)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', 'en'), {
        imapResponse: 'OVERQUOTA'
      });

    const mailbox = await Mailboxes.findOne({
      _id: mailboxId,
      alias: alias._id
    })
      .lean()
      .exec();

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    const targetMailbox = await Mailboxes.findOne({
      path: update.destination,
      alias: alias._id
    })
      .lean()
      .exec();

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

    for await (const message of Messages.find({
      alias: alias._id,
      mailbox: mailbox._id,
      uid: tools.checkRangeQuery(update.messages)
    })
      .sort({ uid: 1 })
      .maxTimeMS(ms('2m'))
      .lean()
      .cursor()) {
      this.logger.debug('copying message', { message });

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
        alias: alias._id,
        mailbox: message.mailbox
      };

      // don't copy in bulk so it doesn't get out of incremental uid sync
      sourceUid.unshift(message.uid);

      const updatedMailbox = await Mailboxes.findOneAndUpdate(
        {
          _id: targetMailbox._id,
          alias: alias._id
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

      // set existing message as copied
      // TODO: may want to check for return value
      await Messages.findOneAndUpdate(query, {
        $set: {
          copied: true
        }
      });

      // create new message
      const newMessage = await Messages.create(message);

      // update attachment store magic number
      const attachmentIds = Object.keys(
        newMessage.mimeTree.attachmentMap || {}
      ).map((key) => newMessage.mimeTree.attachmentMap[key]);
      if (attachmentIds.length > 0) {
        try {
          await this.attachmentStorage.updateManyPromise(
            attachmentIds,
            1,
            newMessage.magic
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
        await this.server.notifier.addEntries(targetMailbox, {
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
        .then((exceedsQuota) => {
          if (exceedsQuota) {
            const err = new IMAPError(
              i18n.translate('IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA', 'en'),
              {
                imapResponse: 'OVERQUOTA',
                isCodeBug: true // admins will get an email/sms alert
              }
            );
            this.logger.fatal(err, { mailboxId, update, session });
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

      // add to `alias.storageSize` the message `size`
      Aliases.findByIdAndUpdate(alias._id, {
        $inc: {
          storageUsed: copiedStorage
        }
      })
        .then()
        .catch((err) =>
          this.logger.fatal(err, {
            copiedStorage,
            connection,
            mailboxId,
            update,
            session
          })
        );
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
