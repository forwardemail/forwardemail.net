/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

//
// returns every form a username can be matched against in alias names
// and regular expressions (first entry is always the NFC Unicode form)
//
// e.g. "fællestest" -> [ "fællestest", "xn--fllestest-g3a" ]
//      "xn--fllestest-g3a" -> [ "xn--fllestest-g3a", "fællestest" ]
//
// NOTE: aliases were previously matched against the punycode form of the
//       local part, so some users created aliases starting with "xn--"
//       which we still need to support for backwards compatibility
//
function getUsernameVariants(username) {
  const variants = [username.normalize('NFC').toLowerCase()];
  for (const fn of [punycode.toASCII, punycode.toUnicode]) {
    try {
      const variant = fn(variants[0]).normalize('NFC').toLowerCase();
      if (!variants.includes(variant)) variants.push(variant);
    } catch {
      // ignore punycode conversion errors
    }
  }

  return variants;
}

module.exports = getUsernameVariants;
