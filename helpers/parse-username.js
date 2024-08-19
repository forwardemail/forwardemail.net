/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const addressParser = require('nodemailer/lib/addressparser');

function parseUsername(address) {
  ({ address } = addressParser(address)[0]);
  let username = address.includes('+')
    ? address.split('+')[0]
    : address.split('@')[0];

  username = punycode.toASCII(username).toLowerCase();
  return username;
}

module.exports = parseUsername;
