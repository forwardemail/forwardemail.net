/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const { Buffer } = require('node:buffer');

const isSANB = require('is-string-and-not-blank');
const { spf } = require('mailauth/lib/spf');
const { authenticate } = require('mailauth');
const isEmail = require('#helpers/is-email');
const _ = require('#helpers/lodash');

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');
// const logger = require('#helpers/logger');
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
  // Exempt legitimate DSN/bounce messages from DMARC and SPF hard-fail
  // rejection. When MAIL FROM is <> (null reverse-path per RFC 5321
  // Section 4.5.5), the message is a DSN. For these messages:
  //
  // - SPF evaluates postmaster@HELO-domain (RFC 7208 Section 2.4), which
  //   typically does not align with the RFC5322.From domain in the DSN
  // - Many legitimate servers do not DKIM-sign DSNs, so DKIM alignment
  //   also fails
  // - Rejecting DSNs prevents users from receiving bounce notifications
  //   for their own outbound mail
  //
  // To prevent abuse (an attacker sending MAIL FROM:<> with a spoofed
  // From header), we only exempt messages that are both null-sender AND
  // exhibit at least one structural indicator of a legitimate DSN:
  //   1. Content-Type: multipart/report (RFC 3464)
  //   2. Auto-Submitted header present and not "no" (RFC 3834)
  //   3. From header uses a mailer-daemon/postmaster-style address
  //
  // This matches Gmail and Microsoft behavior (RFC 9989 Section 5.5
  // permits local policy override of DMARC enforcement).
  //
  const isNullSender =
    !session.envelope.mailFrom.address ||
    !isSANB(session.envelope.mailFrom.address) ||
    !isEmail(session.envelope.mailFrom.address);

  let isLegitDSN = false;
  if (isNullSender) {
    // Check for RFC 3464 DSN content type (multipart/report)
    const contentType = headers.hasHeader('content-type')
      ? headers.getFirst('content-type')
      : '';
    const isDSNContentType = /^multipart\/report\b/i.test(contentType);

    // Check for Auto-Submitted header (RFC 3834) - indicates automated message
    const hasAutoSubmitted =
      headers.hasHeader('auto-submitted') &&
      headers.getFirst('auto-submitted').toLowerCase().trim() !== 'no';

    // Check if the From header uses a true bounce-system address
    // NOTE: only actual bounce/DSN usernames qualify here, NOT generic
    // no-reply addresses (e.g. "noreply", "donotreply") which are commonly
    // spoofed in phishing attacks. The full POSTMASTER_USERNAMES set is too
    // broad because it includes the no-reply-list which contains "noreply",
    // "no-reply", etc. that attackers abuse.
    const DSN_USERNAMES = new Set([
      'mailer-daemon',
      'mailer.daemon',
      'maildaemon',
      'mailerdaemon',
      'mail-daemon',
      'mail.daemon',
      'postmaster',
      'hostmaster',
      'bounce',
      'bounces',
      'bounce-notification',
      'bounce-notifications'
    ]);
    const fromUser = session.originalFromAddress
      ? session.originalFromAddress.split('@')[0].toLowerCase()
      : '';
    const isMailerDaemonFrom = DSN_USERNAMES.has(fromUser);

    // Check if the sending server is allowlisted (trusted sender)
    const isSenderAllowlisted = Boolean(session.isAllowlisted);

    //
    // To qualify as a legitimate DSN, we require:
    // - The sender must be allowlisted (trusted infrastructure), AND
    // - At least TWO of the three structural indicators must be present:
    //   1. multipart/report content type (RFC 3464)
    //   2. Auto-Submitted header (RFC 3834)
    //   3. From header uses a true mailer-daemon/postmaster address
    //
    // Previously a single indicator (e.g. just isMailerDaemonFrom) was
    // sufficient, which allowed attackers to spoof From: noreply@victim.be
    // from an allowlisted IP and bypass DMARC p=reject.
    //
    const dsnIndicatorCount =
      (isDSNContentType ? 1 : 0) +
      (hasAutoSubmitted ? 1 : 0) +
      (isMailerDaemonFrom ? 1 : 0);

    isLegitDSN = dsnIndicatorCount >= 2 && isSenderAllowlisted;

    //
    // Safeguard: the allowlisted sending infrastructure must match the
    // From header domain. A legitimate DSN from Google would have
    // From: mailer-daemon@google.com (or a subdomain), NOT
    // From: mailer-daemon@victim.be sent through Google's servers.
    // Without this check, any attacker using allowlisted shared hosting
    // (AWS, GCP, etc.) could forge a DSN-like message with any From domain.
    //
    if (isLegitDSN) {
      const fromDomain = session.originalFromAddress
        ? session.originalFromAddress.split('@')[1]?.toLowerCase()
        : '';
      if (fromDomain) {
        const fromRoot = parseRootDomain(fromDomain);
        // The allowlistValue is the hostname/domain/IP that matched the
        // global allowlist. The sending server's root hostname must match
        // the From header's root domain for the DSN to be legitimate.
        const senderRoot = session.resolvedRootClientHostname
          ? session.resolvedRootClientHostname.toLowerCase()
          : '';
        const allowlistDomain = session.allowlistValue
          ? parseRootDomain(session.allowlistValue.toLowerCase())
          : '';
        const senderMatchesFrom =
          (senderRoot && senderRoot === fromRoot) ||
          (allowlistDomain && allowlistDomain === fromRoot);
        if (!senderMatchesFrom) isLegitDSN = false;
      }
    }

    //
    // Additional safeguard: never exempt a message where the From domain
    // matches a recipient domain (self-spoofing). A legitimate DSN from
    // an external server would never use the recipient's own domain in From.
    //
    if (
      isLegitDSN &&
      session.envelope.rcptTo &&
      session.envelope.rcptTo.length > 0
    ) {
      const fromDomain = session.originalFromAddress
        ? session.originalFromAddress.split('@')[1]?.toLowerCase()
        : '';
      if (fromDomain) {
        const isSelfSpoof = session.envelope.rcptTo.some((rcpt) => {
          if (!rcpt.address) return false;
          const rcptDomain = rcpt.address.split('@')[1]?.toLowerCase();
          return rcptDomain === fromDomain;
        });
        if (isSelfSpoof) isLegitDSN = false;
      }
    }
  }

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
    !isLegitDSN &&
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
    // NOTE: isLegitDSN exemption disabled (monitoring mode)
    // uncomment below to enable DSN bypass once logs confirm accuracy:
    // !isLegitDSN &&
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
