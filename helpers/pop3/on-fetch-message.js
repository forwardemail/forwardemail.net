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

const intoStream = require('into-stream');
const mongoose = require('mongoose');

const Messages = require('#models/messages');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onFetchMessage(message, session, fn) {
  this.logger.debug('onFetchMessage', { message, session });

  try {
    if (
      message?.id === undefined ||
      !mongoose.isObjectIdOrHexString(message.id)
    )
      throw new Error('Invalid message ID');

    if (
      message?.mailbox === undefined ||
      !mongoose.isObjectIdOrHexString(message.mailbox)
    )
      throw new Error('Invalid mailbox');

    if (typeof message?.uid !== 'number')
      throw new Error('Invalid message UID');

    //
    // TODO: wsp.request concept similar to IMAP commands
    //

    await this.refreshSession(session, 'POP3');

    const msg = await Messages.findOne(
      this,
      session,
      {
        _id: new mongoose.Types.ObjectId(message.id),
        mailbox: new mongoose.Types.ObjectId(message.mailbox),
        uid: message.uid
      },
      {
        mimeTree: true,
        size: true
      }
    );

    // mirrored to WildDuck error
    if (!msg) throw new Error('Message does not exist or is already deleted');

    const obj = await this.indexer.rebuild(
      msg.mimeTree,
      false,
      {},
      this,
      session
    );

    if (
      typeof obj !== 'object' ||
      obj.type !== 'stream' ||
      typeof obj.value !== 'object'
    )
      obj.value = intoStream(obj.value);

    fn(null, obj.value);
  } catch (err) {
    fn(refineAndLogError(err, session, false, this));
  }
}

module.exports = onFetchMessage;
