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

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const updateStorageUsed = require('#helpers/update-storage-used');

async function onRename(path, newPath, session, fn) {
  this.logger.debug('RENAME', { path, newPath, session });

  if (this.wsp) {
    try {
      const data = await this.wsp.request({
        action: 'rename',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        path,
        newPath
      });
      fn(null, ...data);
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'RENAME');

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

    if (mailbox.path === 'INBOX')
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_RESERVED', session.user.locale),
        {
          imapResponse: 'CANNOT'
        }
      );

    const targetMailbox = await Mailboxes.findOne(this, session, {
      path: newPath
    });

    if (targetMailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', session.user.locale),
        {
          imapResponse: 'ALREADYEXISTS'
        }
      );

    const renamedMailbox = await Mailboxes.findOneAndUpdate(
      this,
      session,
      {
        _id: mailbox._id
      },
      {
        $set: {
          path: newPath
        }
      }
    );

    // could not write/lock mailbox
    if (!renamedMailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'NONEXISTENT'
        }
      );

    await this.server.notifier.addEntries(this, session, mailbox, {
      command: 'RENAME',
      mailbox: mailbox._id,
      path: renamedMailbox.path
    });
    this.server.notifier.fire(session.user.alias_id);

    // update storage
    try {
      session.db.pragma('wal_checkpoint(PASSIVE)');
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      this.logger.fatal(err, { path, session });
    }

    // send response
    fn(null, true, renamedMailbox._id);
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onRename;
