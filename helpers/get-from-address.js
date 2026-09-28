/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { createRequire } = require('node:module');

// the parser mailauth itself uses for the From header (its own nodemailer)
const addressParser = createRequire(
  require.resolve('mailauth/lib/dkim/dkim-verifier')
)('nodemailer/lib/addressparser');

const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');
const isEmail = require('#helpers/is-email');
const parseAddresses = require('#helpers/parse-addresses');

const MAX_CROSS_CHECK_LENGTH = 4096;

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

  //
  // DMARC (mailauth) takes the From address from nodemailer's addressparser,
  // which reads it from the angle brackets.  For a header whose display name
  // is itself an address, e.g. `support@example.com <attacker@evil.com>` or
  // `alice@example.org via Group <group@example.net>` (not valid RFC 5322,
  // but sent by some list managers), the parser above takes the display name
  // instead, so every check that trusts this address after DMARC passed
  // (impersonation, allowlists, DMARC policy) would have trusted a domain
  // that was never authenticated.  The address in the angle brackets is the
  // sender (it is what DMARC authenticated), so it is used; nothing is
  // refused.  (Only for headers of ordinary length: addressparser is slow
  // on very long values, see helpers/parse-addresses.js.)
  //
  let [address] = originalFromAddresses;
  const dmarcAddresses =
    originalFrom.length <= MAX_CROSS_CHECK_LENGTH
      ? addressParser(originalFrom.trim())
          .flatMap((addr) => (Array.isArray(addr?.group) ? addr.group : [addr]))
          .map((addr) => addr?.address)
          .filter(Boolean)
      : [];
  if (
    dmarcAddresses.length === 1 &&
    dmarcAddresses[0].toLowerCase() !== address.toLowerCase() &&
    isEmail(dmarcAddresses[0])
  )
    [address] = dmarcAddresses;

  // set original from address that was parsed
  return checkSRS(punycode.toASCII(address)).toLowerCase();
}

module.exports = getFromAddress;
