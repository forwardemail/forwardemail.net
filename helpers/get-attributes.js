/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');

const checkSRS = require('#helpers/check-srs');
const getHeaders = require('#helpers/get-headers');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const parseAddresses = require('#helpers/parse-addresses');

function getAttributes(headers, session) {
  const replyToAddresses = parseAddresses(
    getHeaders(headers, true, 'reply-to')
  );

  //
  // check if the From, Reply-To, MAIL FROM, sender IP/host, or RCPT TO were silent banned
  // (and filter out RCPT TO while parsing so we don't send twice)
  // (and also check root domains as well for each of these)
  //
  return _.uniq(
    _.compact(
      [
        // NOTE: we don't check HELO because it's arbitrary
        // check the From header
        session.originalFromAddress,
        // check the From header domains
        parseHostFromDomainOrAddress(session.originalFromAddress),
        // check the From header root domains
        parseRootDomain(
          parseHostFromDomainOrAddress(session.originalFromAddress)
        ),
        // check the Reply-To header
        ...replyToAddresses.map((addr) => checkSRS(addr.address).toLowerCase()),
        // check the Reply-To header domains
        ...replyToAddresses.map((addr) =>
          parseHostFromDomainOrAddress(checkSRS(addr.address))
        ),
        // check the Reply-To header root domains
        ...replyToAddresses.map((addr) =>
          parseRootDomain(parseHostFromDomainOrAddress(checkSRS(addr.address)))
        ),
        // check the sender client host (if provided)
        // (only applicable if not allowlisted)
        !session.isAllowlisted && session.resolvedClientHostname
          ? session.resolvedClientHostname
          : null,
        // check the sender client host root (if provided)
        // (only applicable if not allowlisted)
        // (but only if the root domain was not equal to the parsed host)
        !session.isAllowlisted &&
        session.resolvedClientHostname &&
        session.resolvedClientHostname !== session.resolvedRootClientHostname
          ? session.resolvedRootClientHostname
          : null,
        // check the sender client IP address
        // (only applicable if not allowlisted)
        session.isAllowlisted ? null : session.remoteAddress,
        // check the MAIL FROM (if provided; lowercased)
        isSANB(session.envelope.mailFrom.address)
          ? checkSRS(session.envelope.mailFrom.address).toLowerCase()
          : null,
        // check the MAIL FROM host (if provided; lowercased)
        isSANB(session.envelope.mailFrom.address)
          ? parseHostFromDomainOrAddress(
              checkSRS(session.envelope.mailFrom.address).toLowerCase()
            )
          : null,
        // check the MAIL FROM host root (if provided; lowercased)
        // (but only if the root domain was not equal to the parsed host)
        isSANB(session.envelope.mailFrom.address) &&
        parseRootDomain(
          parseHostFromDomainOrAddress(
            checkSRS(session.envelope.mailFrom.address).toLowerCase()
          )
        ) !==
          parseHostFromDomainOrAddress(
            checkSRS(session.envelope.mailFrom.address).toLowerCase()
          )
          ? parseRootDomain(
              parseHostFromDomainOrAddress(
                checkSRS(session.envelope.mailFrom.address).toLowerCase()
              )
            )
          : null
      ].map((str) =>
        typeof str === 'string' ? str.toLowerCase().trim() : null
      )
    )
  );
}

module.exports = getAttributes;
