/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const parseAddresses = require('#helpers/parse-addresses');
const {
  MAX_PUNYCODE_LENGTH,
  normalizeUsername
} = require('#helpers/get-username-variants');

function getLocalPart(address, ignorePlus) {
  address = parseAddresses(address)[0];
  return !ignorePlus && address.includes('+')
    ? address.split('+')[0]
    : address.split('@')[0];
}

//
// The local part of an address (without its "+" tag unless `ignorePlus`),
// lowercase and converted to punycode, as the addresses built from it
// (forwarding to a domain, a "+" tag, a regular expression substitution)
// have always been.
//
// (punycode takes time with the square of the length of a string, and a
// local part longer than this is not an address anyone uses)
//
function parseUsername(address, ignorePlus = false) {
  const username = getLocalPart(address, ignorePlus);
  return (
    username.length > MAX_PUNYCODE_LENGTH
      ? username
      : punycode.toASCII(username)
  ).toLowerCase();
}

//
// The local part as it is, NFC normalized and lowercase, which alias names
// and regular expressions are matched with: "fællestest" in punycode,
// "xn--fllestest-g3a", matched no alias named "fællestest" nor a regular
// expression for it, so the mail went to the catch-all (#619). See
// `#helpers/get-username-variants`.
//
function parseUnicodeUsername(address, ignorePlus = false) {
  return normalizeUsername(getLocalPart(address, ignorePlus));
}

//
// The local part as it is written, only lowercase (to tell an alias named
// exactly that way from one named another form of the name)
//
function parseLocalPart(address, ignorePlus = false) {
  return getLocalPart(address, ignorePlus).toLowerCase();
}

module.exports = parseUsername;
module.exports.parseUnicodeUsername = parseUnicodeUsername;
module.exports.parseLocalPart = parseLocalPart;
