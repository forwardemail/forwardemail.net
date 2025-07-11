/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('@forwardemail/validator');

const { detectInvisibleUnicode } = require('#helpers/detect-invisible-unicode');

//
// NOTE: this does not support local portion with quotes
//
// <https://github.com/validatorjs/validator.js/issues/2376>
// <https://github.com/validatorjs/validator.js/issues/2508>
// <https://github.com/validatorjs/validator.js/issues/2504>
module.exports = function (str) {
  if (!isSANB(str)) return false;

  // Check for invisible Unicode characters as a security measure
  if (detectInvisibleUnicode(str)) return false;

  return isEmail(punycode.toASCII(str), {
    allow_ip_domain: true,
    ignore_max_length: true,
    // NOTE: we need `blacklisted_chars` otherwise this will be valid:
    //       `"amazon-[%lowletter(20,25)]_"@xyz.com`
    blacklisted_chars: '"'
  });
};
