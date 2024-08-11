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

// <https://github.com/nodemailer/wildduck/blob/49bd5015c188079e3a265c0873178e805f84ca2e/lib/mbox-stream.js#L177-L201>
// <https://github.com/IJMacD/crowdproperty-extension/blob/0d0f0e05f1e816faba5c0148b3a0600a1e420905/popup.js#L437-L449>

// Sat Nov  5 23:27:03 2016
function asctime(date) {
  // 'Tue, 12 Nov 2019 14:19:37 GMT'
  const parts = date.toUTCString().split(/[\s,]+/);

  const res = [];

  // "Sat"
  res.push(parts[0].slice(0, 3), parts[2]);

  // " 5"
  const day = parts[1].replace(/^0/, '').trim();
  // <https://github.com/nodemailer/wildduck/issues/722>
  // res.push((day.length < 2 ? '0' : '') + day, parts[4], parts[3]);
  res.push((day.length < 2 ? ' ' : '') + day, parts[4], parts[3]);

  return res.join(' ');
}

module.exports = asctime;
