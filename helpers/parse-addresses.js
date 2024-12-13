/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const addressParser = require('nodemailer/lib/addressparser');
const addrs = require('email-addresses');
const isSANB = require('is-string-and-not-blank');

const isEmail = require('#helpers/is-email');

// <https://github.com/validatorjs/validator.js/issues/2508>
function parseAddresses(input) {
  if (!isSANB(input)) return [];

  let addresses = addrs.parseAddressList({ input, partial: true }) || [];

  if (addresses.length === 0)
    addresses = addrs.parseAddressList({ input }) || [];

  // safeguard
  if (addresses.length === 0) addresses = addressParser(input);

  addresses = addresses.filter(
    (addr) => _.isObject(addr) && isSANB(addr.address) && isEmail(addr.address)
  );

  return addresses;
}

module.exports = parseAddresses;
