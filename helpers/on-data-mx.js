/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const SpamScanner = require('spamscanner');
const _ = require('lodash');
const bytes = require('bytes');
const isSANB = require('is-string-and-not-blank');
const { SRS } = require('sender-rewriting-scheme');
const { isEmail } = require('validator');
const { sealMessage } = require('mailauth');

const DenylistError = require('#helpers/denylist-error');
const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const env = require('#config/env');
const getHeaders = require('#helpers/get-headers');
const getRecipients = require('#helpers/get-recipients');
const hasFingerprintExpired = require('#helpers/has-fingerprint-expired');
const isArbitrary = require('#helpers/is-arbitrary');
const isAuthenticatedMessage = require('#helpers/is-authenticated-message');
const isBackscatterer = require('#helpers/is-backscatterer');
const isDenylisted = require('#helpers/is-denylisted');
const isGreylisted = require('#helpers/is-greylisted');
const isSilentBanned = require('#helpers/is-silent-banned');
const logger = require('#helpers/logger');
const parseUsername = require('#helpers/parse-username');
const updateHeaders = require('#helpers/update-headers');

const srs = new SRS(config.srs);

const scanner = new SpamScanner({
  logger,
  clamscan: config.env === 'test',
  memoize: {
    // since memoizee doesn't support supplying mb or gb of cache size
    // we can calculate how much the maximum could potentially be
    // the max length of a domain name is 253 characters (bytes)
    // and if we want to store up to 1 GB in memory, that's
    // `Math.floor(bytes('1GB') / 253)` = 4244038 (domains)
    // note that this is per thread, so if you have 4 core server
    // you will have 4 threads, and therefore need 4 GB of free memory
    size: Math.floor(bytes('0.5GB') / 253)
  }
});

//
// TODO: all counters should be reflected in new deliverability dashboard for users
//

async function updateMXHeaders(session, headers, body) {
  headers.remove('x-forwardemail-sender');
  const senderHeader = [];
  if (
    isSANB(session.envelope.mailFrom.address) &&
    isEmail(session.envelope.mailFrom.address, { ignore_max_length: true })
  )
    senderHeader.push(checkSRS(session.envelope.mailFrom.address));
  if (session.resolvedClientHostname)
    senderHeader.push(session.resolvedClientHostname);
  senderHeader.push(session.remoteAddress);
  headers.add(
    'X-ForwardEmail-Sender',
    `rfc822; ${senderHeader.join(', ')}`,
    headers.lines.length
  );
  if (config.env !== 'production') {
    headers.remove('x-forwardemail-session-id');
    headers.add('X-ForwardEmail-Session-ID', session.id, headers.lines.length);
  }

  //
  // perform a friendly-from rewrite if necessary using mailauth data
  // (basically if no aligned DKIM and if strict DMARC we can assume it's relying on SPF)
  //
  // TODO: remove other instances of session.dmarc.policy and rely on status.result
  if (
    session.dmarc?.status?.result === 'pass' &&
    !session.hadAlignedAndPassingDKIM
  ) {
    session.rewriteFriendlyFrom = true;

    if (isSANB(session.envelope.mailFrom.address))
      session.envelope.mailFrom.address = srs.forward(
        checkSRS(session.envelope.mailFrom.address),
        env.WEB_HOST
      );

    // TODO: if sender was allowlisted then we should notify them of their issue (?)

    headers.update(
      'From',
      `"${session.originalFromAddress}" <${config.friendlyFromEmail}>`
    );
    headers.add('X-Original-From', session.originalFromAddress);
    //
    // if there was an original reply-to on the email
    // then we don't want to modify it of course
    //
    // <https://github.com/andris9/mailsplit/issues/21>
    if (!getHeaders(headers, true, 'reply-to'))
      headers.update('Reply-To', session.originalFromAddress);

    // rewrite ARC sealed headers with updated headers object value
    session.arcSealedHeaders = await sealMessage(
      Buffer.concat([headers.build(), body]),
      {
        ...config.signatureData,
        // values from the authentication step
        authResults: session.arc.authResults,
        cv: session.arc.status.result
      }
    );
  }
}

// TODO: add X-Original-To and Received headers to outbound SMTP (to top of message)
//       and to MX below on a per-message basis for accuracy

// eslint-disable-next-line complexity
async function onDataMX(raw, session, headers, body) {
  //
  // determine if we should check against backscatterer list
  // (only if blank, mailer-daemon@, postmaster@, or another standard)
  // (and if not allowlisted)
  // <https://unix.stackexchange.com/q/65013>
  // <http://www.backscatterer.org/?target=usage>
  //
  if (!session.isAllowlisted) {
    let checkBackscatterer = false;
    // check against MAIL FROM
    if (
      isSANB(session.envelope.mailFrom.address) &&
      isEmail(session.envelope.mailFrom.address, { ignore_max_length: true })
    ) {
      const username = parseUsername(
        checkSRS(session.envelope.mailFrom.address)
      );
      if (config.POSTMASTER_USERNAMES.has(username)) checkBackscatterer = true;
    } else {
      // MAIL FROM was <> (empty)
      checkBackscatterer = true;
    }

    // check against From header
    if (!checkBackscatterer) {
      const username = parseUsername(checkSRS(session.originalFromAddress));
      if (config.POSTMASTER_USERNAMES.has(username)) checkBackscatterer = true;
    }

    // check against backscatterer list
    // (it will throw a DenylistError if so)
    if (checkBackscatterer) {
      try {
        await isBackscatterer(
          session.remoteAddress,
          this.client,
          this.resolver
        );
      } catch (err) {
        // store a counter
        if (err instanceof DenylistError)
          await this.client.incr(
            `backscatter_prevented:${session.arrivalDateFormatted}`
          );
        throw err;
      }
    }
  }

  //
  // NOTE: here is where we check against denylist
  //       (we simply check if any of the `session.attributes` were denylisted)
  //       (this includes added RCPT TO values as parsed in `helpers/on-data.js`)
  //       (it will throw a DenylistError if so)
  //
  try {
    await isDenylisted(session.attributes, this.client, this.resolver);
  } catch (err) {
    // store a counter
    if (err instanceof DenylistError)
      await this.client.incr(
        `denylist_prevented:${session.arrivalDateFormatted}`
      );
    throw err;
  }

  // only let this message retry for up to 5 days
  // (this throws an error if it exceeds duration)
  await hasFingerprintExpired(session, this.client);

  // TODO: possibly store a counter here too
  // check if the message needs to be greylisted
  // (this throws an error if so)
  await isGreylisted(session, this.client);

  //
  // check message against DKIM, SPF, DMARC
  // (this populates `session.spf`, `session.dmarc`, etc)
  // (it also throws an error if it was found to be unauthenticated)
  //
  await isAuthenticatedMessage(raw, session, this.resolver);

  // arbitrary spam checks
  // (this throws an error if any arbitrary checks were detected)
  // (this relies on `isAuthenticatedMessage` to populate `session.spf` etc)
  await isArbitrary(session, headers, body.toString());

  // if there were DKIM signing domains then check them
  // against the silent ban and denylists
  if (session.signingDomains.size > 0) {
    let silentBanned = false;
    for (const signingDomain of session.signingDomains) {
      // eslint-disable-next-line no-await-in-loop
      silentBanned = await isSilentBanned(
        signingDomain,
        this.client,
        this.resolver
      );
      if (silentBanned) break; // break early
      try {
        // eslint-disable-next-line no-await-in-loop
        await isDenylisted(signingDomain, this.client, this.resolver);
      } catch (err) {
        // store a counter
        if (err instanceof DenylistError)
          // eslint-disable-next-line no-await-in-loop
          await this.client.incr(
            `denylist_prevented:${session.arrivalDateFormatted}`
          );
        throw err;
      }
    }

    // return early if it was silent banned
    if (silentBanned) return;
  }

  // TODO: session.arcSealedHeaders

  const scan = await scanner.scan(raw);

  // arbitrary tests (e.g. EICAR) always should throw
  if (_.isArray(scan?.results?.arbitrary) && !_.isEmpty(scan.results.arbitrary))
    throw new SMTPError(scan.results.arbitrary.join(' '), {
      responseCode: 554
    });

  //
  // NOTE: however the other spamscanner tests including these should be on a per-domain basis
  // - phishing
  // - executables
  // - viruses
  //
  // (see `helpers/get-recipients.js` as these args are passed)
  //

  // add X-* headers (e.g. version + report-to)
  await updateHeaders(headers);

  // additional headers to add specifically for MX
  // (this also does a friendly-from rewrite if necessary)
  await updateMXHeaders(session, headers, body);

  // this is the core logic that determines where to forward and deliver emails to
  const data = await getRecipients.call(this, session, scan);

  // return early if necessary (e.g. all recipients were silent banned)
  if (
    !data ||
    (data.bounces.length === 0 &&
      data.normalized.length === 0 &&
      data.imap.length === 0)
  )
    return;

  console.log('WIP');

  // TODO: add opt-in logging in Domain > Settings and log for each if enabled
  // logger.info('email processed', {
  //   // TODO: session.headers etc need set (see createSession)
  //   session,
  //   // TODO: figure this out
  //   // user: email.user,
  //   // email: email._id,
  //   // domains: [email.domain],
  //   ignore_hook: false
  // });
  // TODO: send email here and log "email delivered" (or) "email forwarded"

  // TODO: fill this in
}

module.exports = onDataMX;
