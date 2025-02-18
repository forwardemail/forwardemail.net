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

const pMapSeries = require('p-map-series');
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');
const { IMAPConnection } = require('wildduck/imap-core/lib/imap-connection');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const getAttachments = require('#helpers/get-attachments');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const updateStorageUsed = require('#helpers/update-storage-used');

const { formatResponse } = IMAPConnection.prototype;

const builder = new Builder();

async function onExpunge(mailboxId, update, session, fn) {
  this.logger.debug('EXPUNGE', { mailboxId, update, session });

  if (this.wsp) {
    try {
      const [bool] = await this.wsp.request({
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

      this.server.notifier.fire(session.user.alias_id);

      fn(null, bool);
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

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

    // let storageUsed = 0;

    //
    // NOTE: we return early as a safeguard if the mailbox is not Trash/Junk/Spam
    //       <https://github.com/nodemailer/wildduck/issues/702>
    //       (mirrors trashCheck in `helpers/get-database.js`)
    //
    // if (
    //   config.env === 'production' &&
    //   !['Trash', 'Spam', 'Junk'].includes(mailbox.path)
    // )
    //   throw new IMAPError('EXPUNGE_RESERVED', { imapResponse: 'CANNOT' });

    const condition = {
      mailbox: mailbox._id.toString(),
      undeleted: 0
    };

    // NOTE: this edge case would never get hit right now since `onExpunge` cmd in wildduck always passes `isUid: false`
    if (update.isUid) condition.uid = tools.checkRangeQuery(update.messages);

    this.logger.debug('expunge query', { condition });

    let err;

    try {
      const sql = builder.build({
        type: 'remove',
        table: 'Messages',
        condition,
        returning: ['_id', 'uid', 'modseq', 'magic', 'mimeTree'],
        // sort required for IMAP UIDPLUS
        sort: 'uid'
      });

      // delete messages
      let messages;
      if (session.db.readonly) {
        messages = await this.wsp.request({
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', sql.query],
            ['all', sql.values]
          ],
          checkpoint: 'PASSIVE'
        });
      } else {
        messages = session.db.prepare(sql.query).all(sql.values);
      }

      // delete attachments
      try {
        await pMapSeries(messages, async (m) => {
          const attachmentIds = getAttachments(m.mimeTree);
          if (attachmentIds.length > 0)
            await this.attachmentStorage.deleteMany(
              this,
              session,
              attachmentIds,
              m.magic
            );
        });
      } catch (err) {
        err.message = `Error while deleting attachments: ${err.message}`;
        err.isCodeBug = true;
        this.logger.fatal(err);
      }

      if (messages.length > 0) {
        //
        // NOTE: we have autovacuum on so we don't need to do a checkpoint nor vacuum
        //
        // run a checkpoint to copy over wal to db
        // try { session.db.pragma('wal_checkpoint(PASSIVE)'); } catch (err) { ... }
        //
        // vacuum database
        // session.db.prepare('VACUUM').run();

        // write to socket we've expunged message
        if (
          !update.silent ||
          (session &&
            session.selected &&
            session.selected.mailbox &&
            session.selected.mailbox.toString() === mailbox._id.toString())
        ) {
          await this.wss.broadcast(
            session,
            messages.map((message) =>
              formatResponse.call(session, 'EXPUNGE', message.uid)
            )
          );
        }

        if (!update.silent && session?.selected?.uidList) {
          await this.wss.broadcast(session, {
            tag: '*',
            command: String(session.selected.uidList.length),
            attributes: [
              {
                type: 'atom',
                value: 'EXISTS'
              }
            ]
          });
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
            modseq: message.modseq
            // thread: message.thread,
            // unseen: message.unseen,
            // idate: message.idate
          }))
        );
      }
    } catch (_err) {
      err = _err;
    }

    // update storage
    try {
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
    }

    // throw error
    if (err) throw err;

    fn(null, true);
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onExpunge;
