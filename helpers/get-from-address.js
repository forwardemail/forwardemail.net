/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');
const parseAddresses = require('#helpers/parse-addresses');

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
  const originalFromAddresses = parseAddresses(originalFrom);

  if (originalFromAddresses.length !== 1)
    throw new SMTPError(
      'Your message must contain one valid email address in the "From" header'
    );

  // set original from address that was parsed
  return checkSRS(punycode.toASCII(originalFromAddresses[0])).toLowerCase();
}

module.exports = getFromAddress;
