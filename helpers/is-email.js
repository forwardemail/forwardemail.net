/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const { isEmail } = require('@forwardemail/validator');

//
// NOTE: this does not support local portion with quotes
//
// <https://github.com/validatorjs/validator.js/issues/2376>
// <https://github.com/validatorjs/validator.js/issues/2508>
// <https://github.com/validatorjs/validator.js/issues/2504>
module.exports = function (str) {
  return isEmail(punycode.toASCII(str), {
    allow_ip_domain: true,
    ignore_max_length: true,
    // NOTE: we need `blacklisted_chars` otherwise this will be valid:
    //       `"amazon-[%lowletter(20,25)]_"@xyz.com`
    blacklisted_chars: '"'
  });
};
