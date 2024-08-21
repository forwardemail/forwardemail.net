/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { isIP } = require('node:net');

const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const SMTPError = require('#helpers/smtp-error');
const parseAddresses = require('#helpers/parse-addresses');

function parseHostFromDomainOrAddress(address) {
  const parsedAddresses = parseAddresses(address);
  let domain = address;

  if (
    _.isArray(parsedAddresses) &&
    _.isObject(parsedAddresses[0]) &&
    isSANB(parsedAddresses[0].address)
  ) {
    domain = parsedAddresses[0].address;
  }

  const atPos = domain.indexOf('@');
  if (atPos !== -1) domain = domain.slice(atPos + 1);

  domain = domain.toLowerCase().trim();

  try {
    domain = punycode.toASCII(domain);
  } catch {
    // ignore punycode conversion errors
  }

  // ensure fully qualified domain name or IP address
  if (!domain || (!isFQDN(domain) && !isIP(domain)))
    throw new SMTPError(
      `${
        domain || address
      } does not contain a fully qualified domain name ("FQDN") nor IP address`,
      { responseCode: 550 }
    );

  return domain;
}

module.exports = parseHostFromDomainOrAddress;
