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

// const imapTools = require('wildduck/imap-core/lib/imap-tools');
const pify = require('pify');

const onMove = require('./on-move');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const updateStorageUsed = require('#helpers/update-storage-used');

const onMovePromise = pify(onMove, { multiArgs: true });

async function onDelete(path, session, fn) {
  this.logger.debug('DELETE', { path, session });

  if (this.wsp) {
    try {
      const [bool, mailboxId] = await this.wsp.request({
        action: 'delete',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        path
      });

      fn(null, bool, mailboxId);
    } catch (err) {
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'DELETE');

    const mailbox = await Mailboxes.findOne(this, session, {
      path
    });

    if (!mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'NONEXISTENT'
        }
      );

    if (mailbox.specialUse || mailbox.path === 'INBOX')
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_RESERVED', session.user.locale),
        {
          imapResponse: 'CANNOT'
        }
      );

    //
    // NOTE: we move all messages to trash dir (safeguard for users)
    //       otherwise if we just deleted mailbox we'd get a foreign key constraint
    //       SQLite error (since messages have a foreign key ref to mailbox id)
    //
    //       name: 'SqliteError',
    //       message: 'FOREIGN KEY constraint failed',
    //       stack: 'SqliteError: FOREIGN KEY constraint failed\n' + ...
    //       code: 'SQLITE_CONSTRAINT_FOREIGNKEY',
    //

    // Source via wildduck/imap-core/lib/commands/move.js
    // (this is the same as the MOVE command logic)
    const uidList = await Messages.distinct(this, session, 'uid', {
      mailbox: mailbox._id
    });

    // const range = '1:*';
    // const messages = imapTools.getMessageRange(
    //   uidList,
    //   range,
    //   true // cmd === 'UID MOVE'
    // );

    try {
      const results = await onMovePromise.call(
        this,
        mailbox._id,
        {
          destination: 'Trash',
          messages: uidList
        },
        {
          ...session,
          selected: {
            uidList
          }
        }
      );
      this.logger.debug('results', { results });
    } catch (_err) {
      // since we use multiArgs from pify
      // if a promise that was wrapped with multiArgs: true
      // throws, then the error will be an array so we need to get first key
      let err = _err;
      if (Array.isArray(err)) err = _err[0];
      throw err;
    }

    // delete mailbox
    const results = await Mailboxes.deleteOne(this, session, {
      _id: mailbox._id
    });

    this.logger.debug('deleted', { results, path, session });

    // results.deletedCount is mainly for publish/notifier
    if (results.deletedCount > 0) {
      await this.server.notifier.addEntries(this, session, mailbox, {
        command: 'DELETE',
        mailbox: mailbox._id
      });
      this.server.notifier.fire(session.user.alias_id);
    }

    //
    // NOTE: no need to do this as we move to trash
    //       and the logic in onMove will set `exp` and `rdate`
    //
    // set messages to expired
    // await Messages.updateMany(
    //   this,
    //   session,
    //   {
    //     mailbox: mailbox._id
    //   },
    //   {
    //     $set: {
    //       exp: true,
    //       rdate: new Date(Date.now() - 24 * 3600 * 1000)
    //     }
    //   }
    // );

    // update storage
    try {
      session.db.pragma('wal_checkpoint(PASSIVE)');
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      this.logger.fatal(err, { path, session });
    }

    fn(null, true, mailbox._id);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, session });
      return fn(null, err.imapResponse);
    }

    return fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onDelete;
