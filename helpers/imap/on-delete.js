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
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onDelete(path, session, fn) {
  this.logger.debug('DELETE', { path, session });

  try {
    const { alias } = await this.refreshSession(session, 'DELETE');

    const mailbox = await Mailboxes.findOne(this, session, {
      path
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    if (mailbox.specialUse || mailbox.path === 'INBOX')
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_RESERVED', 'en'), {
        imapResponse: 'CANNOT'
      });

    // delete mailbox
    const results = await Mailboxes.deleteOne(this, session, {
      _id: mailbox._id
    });

    this.logger.debug('deleted', { results, path, session });

    // results.deletedCount is mainly for publish/notifier
    if (results.deletedCount > 0) {
      try {
        await this.server.notifier.addEntries(this, session, mailbox, {
          command: 'DELETE',
          mailbox: mailbox._id
        });
        this.server.notifier.fire(alias.id);
      } catch (err) {
        this.logger.fatal(err, { path, session });
      }
    }

    // set messages to expired
    await Messages.updateMany(
      this,
      session,
      {
        mailbox: mailbox._id
      },
      {
        $set: {
          exp: true,
          rdate: new Date(Date.now() - 24 * 3600 * 1000)
        }
      }
    );

    fn(null, true, mailbox._id);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, session });
      return fn(null, err.imapResponse);
    }

    return fn(refineAndLogError(err, session, true));
  }
}

module.exports = onDelete;
