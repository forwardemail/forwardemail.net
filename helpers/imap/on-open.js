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

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onOpen(path, session, fn) {
  this.logger.debug('OPEN', { path, session });

  try {
    const { alias } = await this.refreshSession(session, 'OPEN');

    const mailbox = await Mailboxes.findOne({
      path,
      alias: alias._id
    })
      .maxTimeMS(ms('3s'))
      .lean()
      .exec();

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        imapResponse: 'NONEXISTENT'
      });

    //
    // distinct has a limited response size of 16 MB
    // <https://www.mongodb.com/docs/manual/reference/method/db.collection.distinct/>
    // > 'The maximum BSON document size is 16 megabytes'
    // <https://github.com/nodemailer/wildduck/issues/530>
    //
    // TODO: rewrite this to use cursor and sort { uid: 1 }
    //
    const uidList = await Messages.distinct('uid', {
      mailbox: mailbox._id,
      alias: alias._id
    }).maxTimeMS(ms('2s'));

    mailbox.uidList = uidList.sort();

    // send response
    fn(null, mailbox);
  } catch (err) {
    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { path, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true));
  }
}

module.exports = onOpen;
