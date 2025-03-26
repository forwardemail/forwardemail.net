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

class SocketError extends Error {
  constructor(message = 'Socket is closed', options = {}, ...args) {
    super(message, options, ...args);
    Error.captureStackTrace(this, SocketError);
    // wildduck uses `responseMessage` in some instances
    this.responseMessage = message;
    this.responseCode = 421; // 550;
    this.response = 'NO';
  }
}

module.exports = SocketError;
