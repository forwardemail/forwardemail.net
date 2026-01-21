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

const { Buffer } = require('node:buffer');

// <https://github.com/nodemailer/wildduck/blob/a15878c7d709473c5b0d4eec2062e9425c9b5e31/lib/message-handler.js#L1688>
function isMessageEncrypted(raw) {
  if (typeof raw === 'string') raw = Buffer.from(raw);
  else if (typeof raw === 'object' && Array.isArray(raw.chunks) && raw.chunklen)
    raw = Buffer.concat(raw.chunks, raw.chunklen);

  if (!Buffer.isBuffer(raw)) throw new TypeError('Raw must be a Buffer');

  const lastBytes = [];
  let headerEnd = raw.length;

  // split the message into header and body
  for (let i = 0, len = raw.length; i < len; i++) {
    lastBytes.unshift(raw[i]);
    if (lastBytes.length > 10) {
      lastBytes.length = 4;
    }

    if (lastBytes.length < 2) {
      continue;
    }

    let pos = 0;
    if (lastBytes[pos] !== 0x0a) {
      continue;
    }

    pos++;
    if (lastBytes[pos] === 0x0d) {
      pos++;
    }

    if (lastBytes[pos] !== 0x0a) {
      continue;
    }

    pos++;
    if (lastBytes[pos] === 0x0d) {
      pos++;
    }

    // we have a match!'
    headerEnd = i + 1 - pos;
    break;
  }

  const header = raw.slice(0, headerEnd);

  // modify headers
  const headers = [];
  const bodyHeaders = [];
  let lastHeader = false;

  const headerLines = header.toString('binary').split('\r\n');
  // use for, so we could escape from it if needed
  for (let i = 0, len = headerLines.length; i < len; i++) {
    const line = headerLines[i];
    if (!i || !lastHeader || !/^\s/.test(line)) {
      lastHeader = [line];
      if (/^content-type:/i.test(line)) {
        const parts = line.split(':');
        const value = parts.slice(1).join(':');
        const contentType = value.split(';').shift().trim().toLowerCase();

        // Check for PGP encrypted message
        if (contentType === 'multipart/encrypted') {
          return true;
        }

        // Check for S/MIME encrypted message
        if (
          contentType === 'application/pkcs7-mime' ||
          contentType === 'application/x-pkcs7-mime'
        ) {
          return true;
        }

        bodyHeaders.push(lastHeader);
      } else if (/^content-transfer-encoding:/i.test(line)) {
        bodyHeaders.push(lastHeader);
      } else {
        headers.push(lastHeader);
      }
    } else {
      lastHeader.push(line);
    }
  }

  return false;
}

module.exports = isMessageEncrypted;
