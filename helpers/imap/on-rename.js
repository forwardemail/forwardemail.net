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

const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const IMAPError = require('#helpers/imap-error');

async function onRename(path, newPath, session, fn) {
  this.logger.debug('RENAME', { path, newPath, session });

  try {
    const { alias } = await this.refreshSession(session, 'RENAME');

    // TODO: parallel

    const mailbox = await Mailboxes.findOne(this, session, {
      path
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    if (mailbox.path === 'INBOX')
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_RESERVED', 'en'), {
        imapResponse: 'CANNOT'
      });

    const targetMailbox = await Mailboxes.findOne(this, session, {
      path: newPath
    });

    if (targetMailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', 'en'), {
        imapResponse: 'ALREADYEXISTS'
      });

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
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    try {
      await this.server.notifier.addEntries(this, session, mailbox, {
        command: 'RENAME',
        mailbox: mailbox._id,
        path: renamedMailbox.path
      });
      this.server.notifier.fire(alias.id);
    } catch (err) {
      this.logger.fatal(err, { path, session });
    }

    // send response
    fn(null, true, renamedMailbox._id);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, newPath, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onRename;
