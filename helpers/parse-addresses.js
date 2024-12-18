/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const addressParser = require('nodemailer/lib/addressparser');
const addrs = require('email-addresses');
const isSANB = require('is-string-and-not-blank');

const isEmail = require('#helpers/is-email');

//
// NOTE: if we ever use `email-regex-safe` in future
//       we need to ensure `tlds` are considered against punycode toASCII cases
//

// <https://github.com/validatorjs/validator.js/issues/2508>
function parseAddresses(input) {
  if (!isSANB(input)) return [];

  // <foo@bar.com>
  if (
    input.startsWith('<') &&
    input.endsWith('>') &&
    isEmail(input.slice(1, -1))
  )
    return [input.slice(1, -1)];

  // foo@bar.com
  if (isEmail(input)) return [input];

  // more complex stuff here
  // `"Adobe Acrobat" <mail@email.adobe.com>`
  // `"foo@bar.com" <foo@bar.com>, "beep@boop.com" <beep@boop.com>`
  let addresses = addrs.parseAddressList({ input, partial: true }) || [];

  //
  // NOTE: we can't use `email-regex-safe` for values with quotes and such because it returns the wrong values (and dups)
  //
  // > const emailRegexSafe = require('email-regex-safe')
  // > `"foo@bar.com" <foo@bar.com>, "beep@boop.com" <beep@boop.com>`.match(emailRegexSafe())
  // [ 'foo@bar.com', 'foo@bar.com', 'beep@boop.com', 'beep@boop.com' ]
  //

  if (addresses.length === 0)
    addresses = addrs.parseAddressList({ input }) || [];

  // safeguard
  if (addresses.length === 0) addresses = addressParser(input);

  return addresses
    .filter((addr) => isEmail(addr?.address))
    .map((addr) => addr.address);
}

module.exports = parseAddresses;
