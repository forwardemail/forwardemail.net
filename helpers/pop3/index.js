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

const onListMessages = require('./on-list-messages');
const onFetchMessage = require('./on-fetch-message');
const onUpdate = require('./on-update');
const { isSendOnly } = require('#helpers/imap');

// (an alias without IMAP lists an empty INBOX, see helpers/imap/index.js)
module.exports = {
  onListMessages(session, fn) {
    if (!isSendOnly(session)) return onListMessages.call(this, session, fn);
    fn(null, { messages: [], count: 0, size: 0 });
  },
  onFetchMessage,
  onUpdate(update, session, fn) {
    if (!isSendOnly(session)) return onUpdate.call(this, update, session, fn);
    fn();
  }
};
