/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const { Buffer } = require('node:buffer');

const isSANB = require('is-string-and-not-blank');
const { spf } = require('mailauth/lib/spf');
const { authenticate } = require('mailauth');
const _ = require('#helpers/lodash');

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');
const parseRootDomain = require('#helpers/parse-root-domain');

const HOSTNAME = os.hostname();

const UBUNTU_DOMAINS = Object.keys(config.ubuntuTeamMapping);

async function isAuthenticatedMessage(headers, body, session, resolver) {
  const options = {
    ip: session.remoteAddress,
    helo: session.hostNameAppearsAs,
    mta: HOSTNAME,
    resolver: resolver.resolve
  };

  const [results, spfFromHeader] = await Promise.all([
    authenticate(Buffer.concat([headers.build(), body]), {
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
        //
        // NOTE: we may want to do this:
        //       `result.status.aligned === session.originalFromAddressDomain`
        //        <https://github.com/postalsys/mailauth/issues/74>
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
  // check if the ARC chain was sealed by a truth source
  // by examining the ARC-Message-Signature signing domain
  // <https://datatracker.ietf.org/doc/html/rfc8617>
  // <https://learn.microsoft.com/en-us/defender-office-365/email-authentication-arc-configure>
  //
  // session.arc.signature contains the latest ARC-Message-Signature result
  // with signingDomain being the d= value from the ARC-Message-Signature header
  //
  let isTruthSource = false;
  if (
    session.arc &&
    session.arc.status &&
    session.arc.status.result === 'pass' &&
    session.arc.signature &&
    isSANB(session.arc.signature.signingDomain)
  ) {
    const sealerDomain = parseRootDomain(session.arc.signature.signingDomain);
    if (config.truthSources.has(sealerDomain)) {
      isTruthSource = true;
    }
  }

  //
  // only reject if ARC was not passing from a truth source
  // and DMARC fail with p=reject policy
  //
  // trust ARC chain from truth source senders (RFC 8617 Section 7.2.1)
  // this allows DMARC local policy override when the ARC chain passes
  // and was sealed by a trusted intermediary (e.g., Google, Microsoft)
  //
  if (
    session.dmarc &&
    session.dmarc.status &&
    session.dmarc.status.result === 'fail' &&
    session.dmarc.policy === 'reject' &&
    !isTruthSource
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
    //
    // trust ARC chain from truth source senders (RFC 8617 Section 7.2.1)
    // this allows DMARC local policy override when the ARC chain passes
    // and was sealed by a trusted intermediary (e.g., Google, Microsoft)
    //
    !isTruthSource &&
    // NOTE: this is an exception for Ubuntu since they have custom postfix setup
    (!session.resolvedRootClientHostname ||
      !UBUNTU_DOMAINS.includes(session.resolvedRootClientHostname))
  )
    throw new SMTPError(
      "The email sent has failed SPF validation and is rejected due to the domain's SPF hard fail policy (ensure that your messages have a DKIM aligned signature with your From header)"
    );
}

module.exports = isAuthenticatedMessage;
