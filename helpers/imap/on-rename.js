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

const ms = require('ms');

const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const IMAPError = require('#helpers/imap-error');

async function onRename(path, newPath, session, fn) {
  this.logger.debug('RENAME', { path, newPath, session });

  try {
    if (this?.constructor?.name === 'IMAP') {
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
        fn(err);
      }

      return;
    }

    await this.refreshSession(session, 'RENAME');

    // TODO: parallel

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

    try {
      await this.server.notifier.addEntries(this, session, mailbox, {
        command: 'RENAME',
        mailbox: mailbox._id,
        path: renamedMailbox.path
      });
      this.server.notifier.fire(session.user.alias_id);
    } catch (err) {
      this.logger.fatal(err, { path, session });
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
