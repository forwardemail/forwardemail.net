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

//
// email-addresses is a backtracking parser: about 0.1 ms per character, and a
// stack overflow on deeply nested comments (`((((…`).  Header values reach
// here straight from incoming mail, where a single header can be megabytes
// long, and blocked the event loop for seconds to minutes.  It is only used
// for values of ordinary size; longer ones (long recipient lists, abuse) go
// to nodemailer's linear addressparser, which was already the fallback.
//
const MAX_EMAIL_ADDRESSES_LENGTH = 1024;
const MAX_EMAIL_ADDRESSES_COMMENTS = 16;

//
// Nothing parses more than this much of a value (the same limit as Postfix's
// header_size_limit, past which Postfix truncates a header).
//
const MAX_INPUT_LENGTH = 102_400;

//
// nodemailer's addressparser is linear except for one fallback regex that is
// quadratic in the length of a run of text without whitespace or separators
// (and without a usable address): 50 KB of `a.a.a.…` took 13 s.  No address
// is longer than 256 characters (RFC 5321), so much longer runs are dropped.
//
const MAX_TOKEN_LENGTH = 1024;

// whitespace and the separators around addresses (, ; < >)
function isDelimiter(code) {
  return (
    code === 32 ||
    (code >= 9 && code <= 13) ||
    code === 44 ||
    code === 59 ||
    code === 60 ||
    code === 62
  );
}

function dropOversizedTokens(str) {
  let out = '';
  let start = 0;
  for (let i = 0; i <= str.length; i++) {
    if (i < str.length && !isDelimiter(str.codePointAt(i))) continue;
    // keep the delimiter itself, so a dropped run cannot join two addresses
    out += i - start <= MAX_TOKEN_LENGTH ? str.slice(start, i) : ' ';
    if (i < str.length) out += str[i];
    start = i + 1;
  }

  return out;
}

function countChar(str, char) {
  let count = 0;
  for (let i = str.indexOf(char); i !== -1; i = str.indexOf(char, i + 1))
    count++;
  return count;
}

function parseAddressList(options) {
  try {
    return addrs.parseAddressList(options) || [];
  } catch {
    return [];
  }
}

// <https://github.com/validatorjs/validator.js/issues/2508>
function parseAddresses(input) {
  if (!isSANB(input)) return [];

  // cut an oversized value after its last complete address
  if (input.length > MAX_INPUT_LENGTH) {
    input = input.slice(0, MAX_INPUT_LENGTH);
    const comma = input.lastIndexOf(',');
    if (comma > 0) input = input.slice(0, comma);
  }

  const original = input;
  input = dropOversizedTokens(input);
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
  // (a value that had runs dropped is left to addressparser, which skips the
  // empty list elements they leave where email-addresses stops at them)
  const useEmailAddresses =
    input === original &&
    input.length <= MAX_EMAIL_ADDRESSES_LENGTH &&
    countChar(input, '(') <= MAX_EMAIL_ADDRESSES_COMMENTS;

  let addresses = useEmailAddresses
    ? parseAddressList({ input, partial: true })
    : [];

  //
  // NOTE: we can't use `email-regex-safe` for values with quotes and such because it returns the wrong values (and dups)
  //
  // > const emailRegexSafe = require('email-regex-safe')
  // > `"foo@bar.com" <foo@bar.com>, "beep@boop.com" <beep@boop.com>`.match(emailRegexSafe())
  // [ 'foo@bar.com', 'foo@bar.com', 'beep@boop.com', 'beep@boop.com' ]
  //

  if (addresses.length === 0 && useEmailAddresses)
    addresses = parseAddressList({ input });

  // safeguard
  if (addresses.length === 0) addresses = addressParser(input);

  addresses = addresses
    .filter((addr) => isEmail(addr?.address))
    .map((addr) => addr.address);

  // support `foo @ beep <foo@beep.com>`
  // <https://github.com/nodemailer/nodemailer/issues/1707>
  if (addresses.length === 0 && input.includes('<') && input.includes('>')) {
    const str = input.slice(input.indexOf('<') + 1);
    const addr = str.slice(0, str.indexOf('>'));
    if (isEmail(addr)) return [addr];
  }

  return addresses;
}

module.exports = parseAddresses;
module.exports.MAX_INPUT_LENGTH = MAX_INPUT_LENGTH;
