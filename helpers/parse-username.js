/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const parseAddresses = require('#helpers/parse-addresses');

function parseUsername(address, ignorePlus = false) {
  address = parseAddresses(address)[0];
  let username =
    !ignorePlus && address.includes('+')
      ? address.split('+')[0]
      : address.split('@')[0];

  username = punycode.toASCII(username).toLowerCase();
  return username;
}

module.exports = parseUsername;
