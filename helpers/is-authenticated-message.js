/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');

const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const { spf } = require('mailauth/lib/spf');
const { authenticate } = require('mailauth');

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');
const parseRootDomain = require('#helpers/parse-root-domain');

const HOSTNAME = os.hostname();

const UBUNTU_DOMAINS = Object.keys(config.ubuntuTeamMapping);

// eslint-disable-next-line complexity
async function isAuthenticatedMessage(raw, session, resolver) {
  const options = {
    ip: session.remoteAddress,
    helo: session.hostNameAppearsAs,
    mta: HOSTNAME,
    resolver: resolver.resolve
  };

  const [results, spfFromHeader] = await Promise.all([
    authenticate(raw, {
      ...options,
      sender: session.envelope.mailFrom.address,
      seal: config.signatureData
    }),
    spf({
      ...options,
      sender: session.originalFromAddress
    })
  ]);

  session.dkim = results.dkim;
  session.spf = results.spf;

  //
  // safeguard in case mailauth is not accurate or breaks
  //
  if (
    !_.isObject(session.spf) ||
    !_.isObject(session.spf.status) ||
    !isSANB(session.spf.status.result)
  ) {
    session.spf = {
      status: {
        // <https://github.com/postalsys/mailauth/blob/f43e6668008eaddd7b7a7b0fcb83e78c7435e9a5/lib/spf/index.js#L247>
        result: 'temperror'
      }
    };
  }

  session.arc = results.arc;
  session.dmarc = results.dmarc;
  // NOTE: `arcSealedHeaders` does not include our DKIM signature
  session.arcSealedHeaders = results.headers;
  session.bimi = results.bimi;
  session.receivedChain = results.receivedChain;

  // we check that if SPF was aligned with "From" header
  // (this is similar to DKIM alignment, but an extra step we take to prevent spam and spoofing)
  // <https://github.com/postalsys/mailauth/blob/41b8e03207fa175d3bc8998ed13e2ca40ac793f2/lib/spf/index.js#L113-L119>
  session.spfFromHeader = spfFromHeader;

  //
  // safeguard in case mailauth is not accurate or breaks
  //
  if (
    !_.isObject(session.spfFromHeader) ||
    !_.isObject(session.spfFromHeader.status) ||
    !isSANB(session.spfFromHeader.status.result)
  ) {
    session.spfFromHeader = {
      status: {
        // <https://github.com/postalsys/mailauth/blob/f43e6668008eaddd7b7a7b0fcb83e78c7435e9a5/lib/spf/index.js#L247>
        result: 'temperror'
      }
    };
  }

  session.signingDomains = new Set();
  session.alignedDKIMResults = [];

  if (
    _.isObject(session.dkim) &&
    _.isArray(session.dkim.results) &&
    !_.isEmpty(session.dkim.results)
  ) {
    for (const result of session.dkim.results) {
      if (
        _.isObject(result) &&
        _.isObject(result.status) &&
        result.status.result === 'pass'
      ) {
        if (isSANB(result.status.aligned))
          session.alignedDKIMResults.push(result);

        //
        // check DKIM signature domain against denylist and silent ban
        //

        if (isSANB(result.signingDomain)) {
          const rootSigningDomain = parseRootDomain(result.signingDomain);
          session.signingDomains.add(result.signingDomain);
          session.signingDomains.add(rootSigningDomain);
        }
      }
    }
  }

  session.hadAlignedAndPassingDKIM = session.alignedDKIMResults.length > 0;

  //
  // NOTE: since our SPF check does not have PTR support
  //       we need to conditionally set SPF passing to true
  //       in order to override DMARC and strict SPF checks
  //

  //
  // only reject if ARC was not passing
  // and DMARC fail with p=reject policy
  //
  if (
    session.dmarc &&
    session.dmarc.status &&
    session.dmarc.status.result === 'fail' &&
    (!session.isAllowlisted ||
      session.dmarc.policy === 'reject' ||
      (session.hostNameAppearsAs &&
        session.hostNameAppearsAs !== session.originalFromAddressRootDomain &&
        session.hostNameAppearsAs !== session.originalFromAddressDomain &&
        session.hostNameAppearsAs !== session.resolvedClientHostname &&
        session.hostNameAppearsAs !== session.resolvedRootClientHostname))
  ) {
    throw new SMTPError(
      "The email sent has failed DMARC validation and is rejected due to the domain's DMARC policy",
      {
        // if spf status was temperror then retry
        responseCode: session.spf.status.result === 'temperror' ? 421 : 550
      }
    );
  }

  // if no DMARC and SPF had hardfail and no aligned DKIM then reject
  // NOTE: it'd be nice if we alerted admins of SPF permerror due to SPF misconfiguration
  if (
    session.spf.status.result === 'fail' &&
    session.dmarc &&
    session.dmarc.status &&
    session.dmarc.status.result === 'none' &&
    !session.hadAlignedAndPassingDKIM &&
    // NOTE: this is an exception for Ubuntu since they have custom postfix setup
    (!session.resolvedRootClientHostname ||
      !UBUNTU_DOMAINS.includes(session.resolvedRootClientHostname))
  )
    throw new SMTPError(
      "The email sent has failed SPF validation and is rejected due to the domain's SPF hard fail policy"
    );
}

module.exports = isAuthenticatedMessage;
