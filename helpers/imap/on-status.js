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

async function onStatus(path, session, fn) {
  this.logger.debug('STATUS', { path, session });

  try {
    const { db } = await this.refreshSession(session, 'STATUS');

    const mailbox = await Mailboxes.findOne(db, this.wsp, session, {
      path
    });

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    // TODO: parallel

    const messages = await Messages.countDocuments(db, this.wsp, session, {
      mailbox: mailbox._id
    });

    const unseen = await Messages.countDocuments(db, this.wsp, session, {
      mailbox: mailbox._id,
      unseen: true
    });

    // close the connection
    db.close();

    fn(null, {
      messages,
      uidNext: mailbox.uidNext,
      uidValidity: mailbox.uidValidity,
      unseen,
      highestModseq: mailbox.modifyIndex || 0
    });
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onStatus;
