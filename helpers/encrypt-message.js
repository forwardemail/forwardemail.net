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

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const openpgp = require('openpgp');
const tools = require('@zone-eu/wildduck/lib/tools');

const config = require('#config');

openpgp.config.commentString = 'Plaintext message encrypted by Forward Email';
openpgp.config.versionString = `Forward Email v${config.pkg.version}`;

// <https://github.com/nodemailer/wildduck/blob/a15878c7d709473c5b0d4eec2062e9425c9b5e31/lib/message-handler.js#L1688>

async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  if (!pubKeyArmored) throw new TypeError('Public key missing');

  if (typeof raw === 'string') raw = Buffer.from(raw);
  else if (typeof raw === 'object' && Array.isArray(raw.chunks) && raw.chunklen)
    raw = Buffer.concat(raw.chunks, raw.chunklen);

  if (!Buffer.isBuffer(raw)) throw new TypeError('Raw must be a Buffer');

  const lastBytes = [];
  let headerEnd = raw.length;
  let headerLength = 0;

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
    headerLength = pos;
    break;
  }

  const header = raw.slice(0, headerEnd);
  const breaker = headerLength
    ? raw.slice(headerEnd, headerEnd + headerLength)
    : Buffer.alloc(0);
  const body =
    headerEnd + headerLength < raw.length
      ? raw.slice(headerEnd + headerLength)
      : Buffer.alloc(0);

  // modify headers
  let headers = [];
  let bodyHeaders = [];
  let lastHeader = false;
  const boundary = 'nm_' + crypto.randomBytes(14).toString('hex');

  const headerLines = header.toString('binary').split('\r\n');
  // use for, so we could escape from it if needed
  for (let i = 0, len = headerLines.length; i < len; i++) {
    const line = headerLines[i];
    if (!i || !lastHeader || !/^\s/.test(line)) {
      lastHeader = [line];
      if (/^content-type:/i.test(line)) {
        const parts = line.split(':');
        const value = parts.slice(1).join(':');
        if (
          value.split(';').shift().trim().toLowerCase() ===
          'multipart/encrypted'
        ) {
          // message is already encrypted, do nothing
          return raw;
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

  headers.push(
    [
      'Content-Type: multipart/encrypted; protocol="application/pgp-encrypted";'
    ],
    [' boundary="' + boundary + '"'],
    ['Content-Description: OpenPGP encrypted message'],
    ['Content-Transfer-Encoding: 7bit']
  );

  headers = Buffer.from(
    headers.map((line) => line.join('\r\n')).join('\r\n'),
    'binary'
  );
  bodyHeaders = Buffer.from(
    bodyHeaders.map((line) => line.join('\r\n')).join('\r\n'),
    'binary'
  );

  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { ignoreMalformedPackets: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not eixst');

  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  const text =
    'This is an OpenPGP/MIME encrypted message\r\n\r\n' +
    '--' +
    boundary +
    '\r\n' +
    'Content-Type: application/pgp-encrypted\r\n' +
    'Content-Transfer-Encoding: 7bit\r\n' +
    '\r\n' +
    'Version: 1\r\n' +
    '\r\n' +
    '--' +
    boundary +
    '\r\n' +
    'Content-Type: application/octet-stream; name=encrypted.asc\r\n' +
    'Content-Disposition: inline; filename=encrypted.asc\r\n' +
    'Content-Transfer-Encoding: 7bit\r\n' +
    '\r\n' +
    ciphertext +
    '\r\n--' +
    boundary +
    '--\r\n';

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}

module.exports = encryptMessage;
