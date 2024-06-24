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

const _ = require('lodash');

const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onListMessages(session, fn) {
  this.logger.debug('onListMessages', { session });

  try {
    //
    // TODO: wsp.request concept similar to IMAP commands
    //

    await this.refreshSession(session, 'POP3');

    // list messages from the INBOX only
    const mailbox = await Mailboxes.findOne(this, session, {
      path: 'INBOX'
    });

    if (!mailbox)
      throw new Error(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale)
      );

    // TODO: do we need this (?)
    // arbitrary assignment (we could use something else or a Symbol)
    session.user.mailbox = mailbox._id;

    // NOTE: we don't enforce limit right now but we may want to in future
    const messages = await Messages.find(
      this,
      session,
      {
        mailbox: mailbox._id
      },
      {
        uid: true,
        size: true,
        mailbox: true,
        flags: true,
        unseen: true
      },
      {
        sort: 'uid'
      }
    );

    fn(null, {
      messages: messages.map((message) => ({
        id: message._id.toString(),
        uid: message.uid,
        // TODO: is this expecting path instead (?)
        mailbox: message.mailbox.toString(),
        size: message.size,
        flags: message.flags,
        seen: !message.unseen
      })),
      count: messages.length,
      size: _.sumBy(messages, 'size')
    });
  } catch (err) {
    fn(refineAndLogError(err, session, false, this));
  }
}

module.exports = onListMessages;
