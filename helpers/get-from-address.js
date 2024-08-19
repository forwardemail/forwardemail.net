/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const addressParser = require('nodemailer/lib/addressparser');
const addrs = require('email-addresses');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');

function getFromAddress(originalFrom) {
  if (!originalFrom)
    throw new SMTPError(
      'Your message is not RFC 5322 compliant, please include a valid "From" header'
    );

  //
  // parse the original from and ensure that there is one valid email address
  //
  // <https://github.com/nodemailer/nodemailer/issues/1102>
  // <https://github.com/jackbearheart/email-addresses/issues/12>
  //
  // TODO: we probably should rewrite this with something else (!!!!)
  //
  let originalFromAddresses =
    addrs.parseAddressList({ input: originalFrom, partial: true }) || [];

  if (originalFromAddresses.length === 0)
    originalFromAddresses =
      addrs.parseAddressList({ input: originalFrom }) || [];

  // safeguard
  if (originalFromAddresses.length === 0)
    originalFromAddresses = addressParser(originalFrom);

  const originalLength = originalFromAddresses.length;

  originalFromAddresses = originalFromAddresses.filter(
    (addr) =>
      _.isObject(addr) &&
      isSANB(addr.address) &&
      isEmail(addr.address, { ignore_max_length: true })
  );

  if (
    originalFromAddresses.length !== 1 ||
    originalLength !== originalFromAddresses.length
  )
    throw new SMTPError(
      'Your message must contain one valid email address in the "From" header'
    );

  // set original from address that was parsed
  return checkSRS(originalFromAddresses[0].address).toLowerCase();
}

module.exports = getFromAddress;
