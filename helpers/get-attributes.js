/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const os = require('node:os');

const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const { spf } = require('mailauth/lib/spf');

const checkSRS = require('#helpers/check-srs');
const getHeaders = require('#helpers/get-headers');
const logger = require('#helpers/logger');
const parseAddresses = require('#helpers/parse-addresses');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');

const HOSTNAME = os.hostname();

//
// NOTE: the `isAligned` option can be set to `true` if we want to
//       only return metadata that is verified and aligned
//       (e.g. a MAIL FROM that has aligned SPF or DKIM)
//       (e.g. a From header that has aligned SPF or DKIM)
//       (e.g. a Reply-To header that has aligned SPF or DKIM)
//
async function getAttributes(headers, session, resolver, isAligned = false) {
  const replyToAddresses = parseAddresses(getHeaders(headers, 'reply-to'));

  // NOTE: we don't check HELO command input because it's arbitrary and can be spoofed

  const arr = [
    session.resolvedClientHostname,
    session.resolvedRootClientHostname,
    session.remoteAddress
  ];

  const from = [
    // check the From header
    session.originalFromAddress,
    // check the From header domains
    session.originalFromAddressDomain,
    // check the From header root domains
    session.originalFromAddressRootDomain
  ];

  // TODO: this is null it seems
  const replyTo = [
    // check the Reply-To header
    ...replyToAddresses.map((addr) => checkSRS(addr.address).toLowerCase()),
    // check the Reply-To header domains
    ...replyToAddresses.map((addr) =>
      parseHostFromDomainOrAddress(checkSRS(addr.address))
    ),
    // check the Reply-To header root domains
    ...replyToAddresses.map((addr) =>
      parseRootDomain(parseHostFromDomainOrAddress(checkSRS(addr.address)))
    )
  ];

  const mailFrom = [];
  if (isSANB(session.envelope.mailFrom.address)) {
    mailFrom.push(
      // check the MAIL FROM (if provided; lowercased)
      checkSRS(session.envelope.mailFrom.address).toLowerCase(),
      // check the MAIL FROM host (if provided; lowercased)
      parseHostFromDomainOrAddress(checkSRS(session.envelope.mailFrom.address)),
      // check the MAIL FROM host root (if provided; lowercased)
      // (but only if the root domain was not equal to the parsed host)
      parseRootDomain(
        parseHostFromDomainOrAddress(
          checkSRS(session.envelope.mailFrom.address)
        )
      )
    );
  }

  if (isAligned) {
    //
    // if From header has SPF pass (or) DKIM alignment then push it
    // <https://github.com/postalsys/mailauth/blob/41b8e03207fa175d3bc8998ed13e2ca40ac793f2/lib/spf/index.js#L214-L252>
    //
    if (
      session?.spfFromHeader?.status?.result === 'pass' ||
      (session?.signingDomains?.size > 0 &&
        (session.signingDomains.has(session.originalFromAddressDomain) ||
          session.signingDomains.has(session.originalFromAddressRootDomain)))
    )
      arr.push(...from);

    //
    // NOTE: it's typically bad practice to include multiple reply-to values, but we generalize this for simplicity
    //       if any Reply-To has SPF pass (or) DKIM alignment then push _all_ of the addresses
    //
    let hasAlignedReplyTo = false;
    for (const sender of replyToAddresses) {
      if (
        session?.signingDomains?.size > 0 &&
        (session.signingDomains.has(
          parseHostFromDomainOrAddress(checkSRS(sender))
        ) ||
          session.signingDomains.has(
            parseRootDomain(parseHostFromDomainOrAddress(checkSRS(sender)))
          ))
      ) {
        hasAlignedReplyTo = true;
        break;
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await spf({
          ip: session.remoteAddress,
          helo: session.hostNameAppearsAs,
          mta: HOSTNAME,
          resolver: resolver.resolve,
          sender: checkSRS(sender).toLowerCase()
        });
        if (result?.status?.result === 'pass') {
          hasAlignedReplyTo = true;
          break;
        }
      } catch (err) {
        logger.warn(err);
      }
    }

    if (hasAlignedReplyTo) arr.push(...replyTo);

    // if MAIL FROM has SPF pass|neutral|none (or) DKIM alignment then push it
    if (isSANB(session.envelope.mailFrom.address)) {
      if (
        session?.signingDomains?.size > 0 &&
        (session.signingDomains.has(
          parseHostFromDomainOrAddress(
            checkSRS(session.envelope.mailFrom.address)
          )
        ) ||
          session.signingDomains.has(
            parseRootDomain(
              parseHostFromDomainOrAddress(
                checkSRS(session.envelope.mailFrom.address)
              )
            )
          ))
      ) {
        arr.push(...mailFrom);
      } else {
        try {
          const result = await spf({
            ip: session.remoteAddress,
            helo: session.hostNameAppearsAs,
            mta: HOSTNAME,
            resolver: resolver.resolve,
            sender: checkSRS(session.envelope.mailFrom.address).toLowerCase()
          });
          if (result?.status?.result === 'pass') arr.push(...mailFrom);
        } catch (err) {
          logger.warn(err);
        }
      }
    }
  } else {
    arr.push(...from, ...replyTo, ...mailFrom);
  }

  return _.uniq(
    _.compact(
      arr.map((str) =>
        typeof str === 'string'
          ? punycode.toASCII(str).toLowerCase().trim()
          : null
      )
    )
  );
}

module.exports = getAttributes;
