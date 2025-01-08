/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const getAttributes = require('#helpers/get-attributes');
const getFromAddress = require('#helpers/get-from-address');
const getFingerprint = require('#helpers/get-fingerprint');
const getHeaders = require('#helpers/get-headers');
const isAllowlisted = require('#helpers/is-allowlisted');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');

async function updateSession(body, headers, session) {
  //
  // NOTE: we set `session.headers` and `session.originalFromAddress`
  //       so that if an error is thrown, then the error log
  //       will have this information in the `session` object
  //       and therefore it will be useful debugging information for the end user
  //       (since our error log UI renders these values in My Account > Logs)
  //
  session.headers = getHeaders(headers);

  // <https://github.com/andris9/mailsplit/issues/21>
  const from = getHeaders(headers, 'from');

  // getFromAddress will thrown an error if it's not RFC 5322 compliant
  session.originalFromAddress = getFromAddress(from);
  session.originalFromAddressDomain = parseHostFromDomainOrAddress(
    session.originalFromAddress
  );
  session.originalFromAddressRootDomain = parseRootDomain(
    session.originalFromAddressDomain
  );

  // store if the From had same sender hostname (used for spam prevention)
  session.hasSameHostnameAsFrom = Boolean(
    session.resolvedClientHostname === session.originalFromAddressDomain ||
      session.resolvedRootClientHostname ===
        session.originalFromAddressRootDomain
  );

  // get message fingerprint
  session.fingerprint = getFingerprint(session, headers, body);

  await Promise.all([
    (async () => {
      session.isOriginalFromAddressAllowlisted = await isAllowlisted(
        session.originalFromAddress,
        this.client,
        this.resolver
      );

      if (!session.isOriginalFromAddressAllowlisted)
        session.isOriginalFromAddressAllowlisted = await isAllowlisted(
          session.originalFromAddressDomain,
          this.client,
          this.resolver
        );

      if (
        !session.isOriginalFromAddressAllowlisted &&
        session.originalFromAddressDomain !==
          session.originalFromAddressRootDomain
      )
        session.isOriginalFromAddressAllowlisted = await isAllowlisted(
          session.originalFromAddressRootDomain,
          this.client,
          this.resolver
        );
    })(),
    (async () => {
      // get all sender attributes (e.g. email, domain, root domain)
      session.attributes = await getAttributes(headers, session, this.resolver);
    })()
  ]);

  return session;
}

module.exports = updateSession;
