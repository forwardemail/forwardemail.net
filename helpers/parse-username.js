/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const parseAddresses = require('#helpers/parse-addresses');

//
// NOTE: the local part is returned as Unicode (NFC normalized and lowercase)
//       punycode is only defined for domain names, so a local part such as
//       "fællestest" is not rewritten to "xn--fllestest-g3a" anymore
//       (see `#helpers/get-username-variants` for matching legacy aliases)
//
function parseUsername(address, ignorePlus = false) {
  address = parseAddresses(address)[0];
  const username =
    !ignorePlus && address.includes('+')
      ? address.split('+')[0]
      : address.split('@')[0];

  return username.normalize('NFC').toLowerCase();
}

module.exports = parseUsername;
