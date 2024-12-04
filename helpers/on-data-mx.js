/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const os = require('node:os');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

const RE2 = require('re2');
const SpamScanner = require('spamscanner');
const _ = require('lodash');
const bytes = require('@forwardemail/bytes');
const escapeStringRegexp = require('escape-string-regexp');
const getStream = require('get-stream');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMap = require('p-map');
const parseErr = require('parse-err');
const revHash = require('rev-hash');
const status = require('statuses');
const { Iconv } = require('iconv');
const { SRS } = require('sender-rewriting-scheme');
const { boolean } = require('boolean');
const { isEmail } = require('validator');
const { sealMessage } = require('mailauth');
const { simpleParser } = require('mailparser');

const DenylistError = require('#helpers/denylist-error');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const SMTPError = require('#helpers/smtp-error');
const checkSRS = require('#helpers/check-srs');
const combineErrors = require('#helpers/combine-errors');
const config = require('#config');
const createBounce = require('#helpers/create-bounce');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const getErrorCode = require('#helpers/get-error-code');
const getHeaders = require('#helpers/get-headers');
const getRecipients = require('#helpers/get-recipients');
const hasFingerprintExpired = require('#helpers/has-fingerprint-expired');
const i18n = require('#helpers/i18n');
const isArbitrary = require('#helpers/is-arbitrary');
const isAuthenticatedMessage = require('#helpers/is-authenticated-message');
const isBackscatterer = require('#helpers/is-backscatterer');
const isCodeBug = require('#helpers/is-code-bug');
const isDenylisted = require('#helpers/is-denylisted');
const isGreylisted = require('#helpers/is-greylisted');
const isSilentBanned = require('#helpers/is-silent-banned');
const logger = require('#helpers/logger');
const parseError = require('#helpers/parse-error');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const parseUsername = require('#helpers/parse-username');
const retryRequest = require('#helpers/retry-request');
const sendEmail = require('#helpers/send-email');
const updateHeaders = require('#helpers/update-headers');
const { Users, SelfTests } = require('#models');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { encoder } = require('#helpers/encoder-decoder');

const USER_AGENT = `${config.pkg.name}/${config.pkg.version}`;
const HOSTNAME = os.hostname();

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

async function sendBounce(bounce, headers, session, sealedMessage) {
  try {
    // bounces are unique by fingerprint, address, and error code
    const key = getFingerprintKey(
      session,
      encoder.pack([bounce.address, getErrorCode(bounce.err)])
    );

    // prevent sending a duplicate bounce to this address
    const count = await this.client.incrby(key, 0);
    if (count > 0) return;

    const stream = createBounce(
      {
        envelope: {
          from: `mailer-daemon@${env.WEB_HOST}`
        },
        messageId: headers.getFirst('message-id'),
        date: session.arrivalDate
      },
      bounce.error,
      sealedMessage
    );

    const raw = await getStream.buffer(stream);

    try {
      // NOTE: sendEmail function will handle DKIM signing and PGP encryption for bounces
      const info = await sendEmail({
        session,
        cache: this.cache,
        target: parseHostFromDomainOrAddress(
          checkSRS(session.envelope.mailFrom.address)
        ),
        envelope: {
          from: `mailer-daemon@${env.WEB_HOST}`,
          to: checkSRS(session.envelope.mailFrom.address)
        },
        raw,
        resolver: this.resolver,
        client: this.client
      });

      logger.info('sent email', { info, session });

      // store that we sent this so we don't again
      this.client
        .pipeline()
        .incr(key)
        .pexpire(key, config.fingerprintTTL)
        .exec()
        .then()
        .catch((err) => logger.fatal(err));

      // accepted counter
      if (info.accepted && info.accepted.length > 0) {
        this.client
          .incrby(
            `mail_accepted:${session.arrivalDateFormatted}`,
            info.accepted.length
          )
          .then()
          .catch((err) => logger.fatal(err));
        // store a counter for the day of how many bounces were sent
        this.client
          .incrby(
            `bounce_sent:${session.arrivalDateFormatted}`,
            info.accepted.length
          )
          .then()
          .catch((err) => logger.fatal(err));
      }

      if (info.rejectedErrors && info.rejectedErrors.length > 0) {
        for (const err of info.rejectedErrors) {
          logger.warn(err, { session });
        }

        // rejected counter
        this.client
          .incrby(
            `mail_rejected:${session.arrivalDateFormatted}`,
            info.rejectedErrors.length
          )
          .then()
          .catch((err) => logger.fatal(err));
      }
    } catch (err) {
      logger.fatal(err, { session });
      // rejected counter
      this.client
        .incr(`mail_rejected:${session.arrivalDateFormatted}`)
        .then()
        .catch((err) => logger.fatal(err));
    }
  } catch (err_) {
    logger.fatal(err_, { session });
  }
}

// eslint-disable-next-line complexity
async function processBounces(headers, bounces, session, sealedMessage) {
  //
  // instead of returning an error if it bounced
  // which would in turn cause the message to get retried
  // we should instead send a bounce email to the user
  //
  // <https://github.com/nodemailer/smtp-server/issues/129>
  //
  // and we also need to make bounces unique by address here
  // (will basically pick the first that was pushed to the list)
  //
  const uniqueBounces = _.uniqBy(bounces, 'address').filter((bounce) => {
    // extra safeguards to prevent exception and let us know of any weirdness
    if (!_.isObject(bounce)) return false;

    if (!_.isError(bounce.err)) return false;

    // < 500 error codes should not send a bounce error
    return getErrorCode(bounce.err) >= 500;
  });

  // if all the bounces were retries, defer, slowdown, etc then return early
  if (uniqueBounces.length === 0) return;

  //
  // prevent sending a bounce message if missing MAIL FROM
  // (if the MAIL FROM wasn't set or blank then it's likely spam or misconfigured message)
  //
  if (!isSANB(session.envelope.mailFrom.address)) {
    this.client
      .incrby(
        `bounce_prevented_empty:${session.arrivalDateFormatted}`,
        bounces.length
      )
      .then()
      .catch((err) => logger.fatal(err));
    return;
  }

  try {
    //
    // don't send bounces for content type with multipart/report
    //
    // NOTE: we might want to improve this accuracy in future
    //       <https://github.com/zone-eu/zone-mta/issues/432#:~:text=You%20only%20check%20Content%2DType%20for%20multipart/report%20right%20now%2C%20but%20you%20might%20want%20to%20specifically%20check%20against%20report%2Dtype%20of%20delivery%2Dstatus%20or%20delivery%2Dnotification%20for%20accuracy.>
    // https://github.com/zone-eu/zone-mta/blob/49cc03a6dba473f4e6e585ca6f0b2b956a0fa77f/lib/bounces.js#L170-L183
    if (
      headers.hasHeader('content-type') &&
      /^multipart\/report\b/i.test(headers.getFirst('content-type'))
    )
      throw new Error('Bounce prevented due to Content-Type header');

    //
    // if the message had any of these headers then don't send bounce
    // <https://www.jitbit.com/maxblog/18-detecting-outlook-autoreplyout-of-office-emails-and-x-auto-response-suppress-header/>
    // <https://github.com/nodemailer/smtp-server/issues/129>
    // <https://www.arp242.net/autoreply.html>
    //
    // NOTE: hasHeader from mailsplit library is case-insensitive and trimmed
    //
    if (
      (headers.hasHeader('auto-submitted') &&
        headers.getFirst('auto-submitted').toLowerCase().trim() !== 'no') ||
      (headers.hasHeader('x-auto-response-suppress') &&
        ['dr', 'autoreply', 'auto-reply', 'auto_reply', 'all'].includes(
          headers.getFirst('x-auto-response-suppress').toLowerCase().trim()
        )) ||
      headers.hasHeader('x-autoreply') ||
      headers.hasHeader('x-auto-reply') ||
      headers.hasHeader('x-autorespond') ||
      headers.hasHeader('x-auto-respond') ||
      (headers.hasHeader('precedence') &&
        //
        // NOTE: we don't include "bulk" and "list" as part of precedence check
        //       (similarly to how we don't check for "list-id" nor "list-unsubscribe" headers
        //
        ['autoreply', 'auto-reply', 'auto_reply'].includes(
          headers.getFirst('precedence').toLowerCase().trim()
        ))
    )
      throw new Error('Bounce prevented due to auto-response header');

    //
    // NOTE: we check against both MAIL FROM and From header for some arbitrary checks
    //       <https://github.com/zone-eu/zone-mta/issues/432>
    //
    const username = parseUsername(checkSRS(session.envelope.mailFrom.address));
    const fromUsername = parseUsername(checkSRS(session.originalFromAddress));
    // <https://github.com/andris9/mailsplit/issues/21>
    const fromLc = getHeaders(headers, 'from').toLowerCase();

    if (
      config.POSTMASTER_USERNAMES.has(username) ||
      config.POSTMASTER_USERNAMES.has(fromUsername) ||
      // google groups
      checkSRS(session.envelope.mailFrom.address).endsWith('+donotreply') ||
      checkSRS(session.envelope.mailFrom.address).endsWith('-donotreply') ||
      checkSRS(session.originalFromAddress).endsWith('+donotreply') ||
      checkSRS(session.originalFromAddress).endsWith('-donotreply')
    )
      throw new Error('Bounce prevented due to mailer-daemon username');

    // MDaemon X-MDDSN-Message
    if (
      (username === 'mdaemon' ||
        fromUsername === 'mdaemon' ||
        fromLc.includes('mdaemon')) &&
      headers.hasHeader('x-mddsn-message')
    )
      throw new Error('Bounce prevented due to X-MDDSN-Message header');

    //
    // iterate over each unique bounces and send if we already haven't
    // (note that we keep track of bounces we sent via fingerprint in order to prevent dups on SMTP retries)
    //
    await pMap(
      uniqueBounces,
      (bounce) => sendBounce.call(this, bounce, headers, sealedMessage),
      {
        concurrency: config.concurrency
      }
    );
  } catch (err) {
    logger.warn(err, { session });
    this.client
      .incrby(
        `bounce_prevented_restricted:${session.arrivalDateFormatted}`,
        bounces.length
      )
      .then()
      .catch((err) => logger.fatal(err));
  }
}

function getFingerprintKey(session, value) {
  return `${config.fingerprintPrefix}:${session.fingerprint}:${revHash(value)}`;
}

async function imap(aliases, session, raw) {
  const accepted = [];
  const bounces = [];

  //
  // NOTE: we filter out already accepted aliases here
  //
  // aliases = [
  //   {
  //     address: 'test@example.com',
  //     id: '674f6167316b8198f8a09f32'
  //   },
  //   ...
  // ]
  const values = await this.client.mget(
    aliases.map((a) => getFingerprintKey(session, a.id))
  );
  const unsentAliases = [];
  for (const [i, value] of values.entries()) {
    if (boolean(value)) {
      accepted.push(aliases[i].address);
      continue;
    }

    unsentAliases.push(aliases[i]);
  }

  if (unsentAliases.length === 0) return { accepted, bounces };

  try {
    // <https://github.com/websockets/ws/issues/1959>
    const response = await this.wsp.request({
      action: 'tmp',
      aliases: unsentAliases,
      remoteAddress: session.remoteAddress,
      resolvedRootClientHostname: session.resolvedRootClientHostname,
      resolvedClientHostname: session.resolvedClientHostname,
      allowlistValue: session.allowlistValue,
      date:
        typeof session.arrivalDate === 'string'
          ? session.arrivalDate
          : session.arrivalDate.toISOString(),
      raw,
      timeout: ms('1m')
    });

    for (const alias of unsentAliases) {
      if (response[alias.address]) {
        // convert response object error into an Error
        const err = parseError(response[alias.address]);
        err.target = env.IMAP_HOST;
        bounces.push({
          address: alias.address,
          err,
          host: env.SQLITE_HOST
        });
      } else {
        // store that we sent this message so we don't again
        const key = getFingerprintKey(session, alias.id);
        this.client
          .pipeline()
          .incr(key)
          .pexpire(key, config.fingerprintTTL)
          .exec()
          .then()
          .catch((err) => logger.fatal(err));
        // push to accepted array
        accepted.push(alias.address);
      }
    }
  } catch (_err) {
    // an error occurred here with websockets so we bounce all IMAP recipients
    logger.fatal(_err, { session });
    // unsentAliases = [
    //   { address: 'some@address.com', id: 'some-alias-id-in-our-db' },
    //   ...
    // ]
    for (const alias of unsentAliases) {
      const err = parseError(_err);
      err.target = env.IMAP_HOST;
      bounces.push({
        address: alias.address,
        err,
        host: HOSTNAME
      });
    }
  }

  return { accepted, bounces };
}

//
// TODO: since we rewrote most of this and sendEmail only accepts one email at a time
//       we can probably rewrite most of the `recipient.replacements` stuff below to clean it up
//

// eslint-disable-next-line complexity
async function forward(recipient, session, raw) {
  const accepted = [];
  const bounces = [];

  // prevent sending to the same webhook or email twice
  const key = getFingerprintKey(session, recipient.webhook || recipient.to[0]);

  const count = await this.client.incrby(key, 0);

  if (count > 0) {
    // NOTE: we group together recipients based off endpoint
    for (const replacement of Object.keys(recipient.replacements)) {
      if (!accepted.includes(replacement)) accepted.push(replacement);
    }

    return { accepted, bounces };
  }

  if (recipient.webhook) {
    try {
      const mail = await simpleParser(raw, {
        Iconv,
        skipHtmlToText: true,
        skipTextLinks: true,
        skipTextToHtml: true,
        skipImageLinks: true,
        maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
      });

      const body = JSON.stringify({
        ...mail,
        raw: raw.toString(),
        dkim: session.dkim,
        spf: session.spf,
        arc: session.arc,
        dmarc: session.dmarc,
        bimi: session.bimi,
        // NOTE: we don't add the following (yet)
        // - `session.receivedChain`
        // - `session.spfFromHeader`
        // - `session.signingDomains` (Set)
        // - `session.alignedDKIMResults`
        // - `sesion.hadAlignedAndPassingDKIM`
        headers: session.headers,
        recipients: Object.keys(recipient.replacements),
        session: {
          recipient: recipient.recipient,
          remoteAddress: session.remoteAddress,
          remotePort: session.remotePort,
          clientHostname:
            session.resolvedClientHostname || session.clientHostname,
          hostNameAppearsAs: session.hostNameAppearsAs,
          sender: session.envelope.mailFrom.address,
          mta: HOSTNAME,
          arrivalDate: session.arrivalDate,
          arrivalTime: session.arrivalTime
        }
      });

      // TODO: we may want to prevent localhost bound reverse hostname
      //       (in which case we'd need `punycode.toASCII` on the domain)
      if (
        isIP(parseRootDomain(recipient.webhook)) &&
        REGEX_LOCALHOST.test(parseRootDomain(recipient.webhook))
      )
        throw new SMTPError(i18n.translateError('INVALID_LOCALHOST_URL', 'en'));

      const response = await retryRequest(
        // dummyproofing
        recipient.webhook
          .replace('HTTP://', 'http://')
          .replace('HTTPS://', 'https://'),
        {
          method: 'POST',
          headers: {
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/json',
            //
            // NOTE: per discussion at <https://github.com/forwardemail/free-email-forwarding/issues/235>
            //       it was requested that we sign webhooks with a signature for payload verification
            //       <https://stackoverflow.com/a/68885281>
            //
            ...(recipient.webhookKey
              ? {
                  'X-Webhook-Signature': crypto
                    .createHmac('sha256', decrypt(recipient.webhookKey))
                    .update(body)
                    .digest('hex')
                }
              : {})
          },
          body,
          resolver: this.resolver
        }
      );

      if (
        !response?.signal?.aborted &&
        typeof response?.body?.dump === 'function'
      )
        await response.body.dump();

      // store that we sent this so we don't again
      this.client
        .pipeline()
        .incr(key)
        .pexpire(key, config.fingerprintTTL)
        .exec()
        .then()
        .catch((err) => logger.fatal(err));

      // NOTE: we group together recipients based off endpoint
      for (const replacement of Object.keys(recipient.replacements)) {
        if (!accepted.includes(replacement)) accepted.push(replacement);
      }

      return { accepted, bounces };
    } catch (err_) {
      // delete undici's `body` prop in err object
      // in order to prevent huge payloads in-memory
      delete err_.body;

      // preserve webhook for admins to inspect if user needs help
      err_.webhook = recipient.webhook;
      logger.error(err_, { session });

      // determine if code or status is retryable here and set it as `err._responseCode`
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err_.responseCode = getErrorCode(err_);

      // preserve original message
      err_.original_message = err_.message;

      // hide the webhook endpoint
      try {
        err_.message = err_.message.replace(
          new RE2(new RegExp(escapeStringRegexp(recipient.webhook), 'gi')),
          'a webhook endpoint'
        );
        // TODO: may need to replace by `value` property (e.g. HTTP -> http)
      } catch (err) {
        // catch in case undici error
        // (e.g. Cannot set property which only has a getter)
        // TODO: we shouldn't call `.replace` on an instance of a ResponseStatusCodeError (?)
        // new undici.errors.ResponseStatusCodeError(...)
        err.orig_error = err_;
        err.isCodeBug = true;
        logger.fatal(err);
      }

      // in case the response had sensitive email user information hide it too
      for (const address of Object.keys(recipient.replacements)) {
        try {
          err_.message = err_.message.replace(
            new RE2(new RegExp(escapeStringRegexp(address), 'gi')),
            recipient.replacements[address]
          );
        } catch (err) {
          // catch in case undici error
          // (e.g. Cannot set property which only has a getter)
          // TODO: we shouldn't call `.replace` on an instance of a ResponseStatusCodeError (?)
          // new undici.errors.ResponseStatusCodeError(...)
          err.orig_error = err_;
          err.isCodeBug = true;
          logger.fatal(err);
        }
      }

      const obj = parseErr(err_);
      // webhook response is helpful for users to debug
      if (obj.response) {
        if (obj.response.text) {
          // ensure the response is not more than 1 KB
          const bytes = Buffer.byteLength(obj.response.text, 'utf8');
          obj.response =
            bytes > bytes('1KB')
              ? 'Response byte size exceeds 1 KB'
              : obj.response.text;
        } else delete obj.response;
      }

      for (const address of Object.keys(recipient.replacements)) {
        const err = new Error(err_.message);
        for (const k of Object.keys(obj)) {
          if (k === 'message') continue;
          err[k] = obj[k];
        }

        if (err_.status) {
          err.message = `${err_.status} ${status(err_.status)}${
            err_.status === 500 ? '' : ' Error'
          } for ${address}`;
        } else if (err_.code) {
          err.message = `${err_.code} for ${address}`;
        }

        // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
        err.responseCode = getErrorCode(err_);

        err.target = parseHostFromDomainOrAddress(recipient.webhook);

        bounces.push({
          address,
          err,
          recipient
        });
      }
    }

    return { accepted, bounces };
  }

  let from;
  if (isSANB(session.envelope.mailFrom.address))
    from = srs.forward(
      checkSRS(session.envelope.mailFrom.address),
      env.WEB_HOST
    );

  // NOTE: only webhooks use array for `to`, send email uses a string (we convert it)
  if (!_.isArray(recipient.to) || recipient.to.length > 1)
    throw new TypeError('Invalid array of recipients');

  try {
    // TODO: add Feedback-ID header if not exists for Google recipients to `sendEmail` function
    //       and add automated job to scrape Google Postmaster API (they have an API) for detection
    //       and abuse/spam complaint automation

    // NOTE: sendEmail function will handle DKIM signing and PGP encryption for bounces
    const info = await sendEmail({
      session,
      cache: this.cache,
      target: recipient.host,
      port: recipient.port,
      envelope: {
        from,
        to: recipient.to[0]
      },
      raw,
      resolver: this.resolver,
      client: this.client,
      publicKey: recipient.aliasPublicKey
    });

    logger.info('sent email', {
      info,
      session
    });

    // store that we sent this so we don't again
    this.client
      .pipeline()
      .incr(key)
      .pexpire(key, config.fingerprintTTL)
      .exec()
      .then()
      .catch((err) => logger.fatal(err));

    if (info.accepted && info.accepted.length > 0) {
      // add the masked recipient to the final accepted array
      // (we don't want to reveal forwarding config to client SMTP servers)
      for (const replacement of Object.keys(recipient.replacements)) {
        if (!accepted.includes(replacement)) accepted.push(replacement);
      }

      for (const a of info.accepted) {
        //
        // check to see if we sent an email to the same address it was coming from
        // (and if so, then send a self test email to notify sender it won't show up twice)
        //

        //
        // get normalized form without `+` symbol (in case someone tries test+something@gmail.com)
        //
        const domainName = parseHostFromDomainOrAddress(a);
        const rootDomain = parseRootDomain(domainName);
        const normal = `${parseUsername(a)}@${domainName}`;
        if (
          !config.ignoredSelfTestDomains.has(rootDomain) &&
          isSANB(session.envelope.mailFrom.address) &&
          normal === checkSRS(session.envelope.mailFrom.address).toLowerCase()
        ) {
          // NOTE: instead of using /v1/self-test endpoint we do this in real-time
          SelfTests.exists({
            email: normal
          })
            .then(async (exists) => {
              if (exists) return;
              try {
                await SelfTests.create({ email: normal });
                const user = await Users.findOne({ email: normal })
                  .lean()
                  .exec();
                const locale = user
                  ? user[config.lastLocaleField]
                  : i18n.getLocale();
                const locals = { locale };
                if (user) locals.user = user;

                await emailHelper({
                  template: 'self-test',
                  message: { to: normal },
                  locals
                });
              } catch (err) {
                logger.fatal(err);
              }
            })
            .catch((err) => logger.fatal(err));
        }
      }
    }

    if (info.rejectedErrors && info.rejectedErrors.length > 0) {
      for (const err of info.rejectedErrors) {
        logger.warn(err, {
          session
        });

        // here we do some magic so that we push an error message
        // that has the end-recipient's email masked with the
        // original to address that we were trying to send to
        err._message = err.message;
        for (const address of Object.keys(recipient.replacements)) {
          err.message = err.message.replace(
            new RE2(new RegExp(escapeStringRegexp(address), 'gi')),
            recipient.replacements[address]
          );
        }

        if (!err.target) err.target = recipient.host;

        bounces.push({
          address: recipient.recipient,
          host: recipient.host,
          err,
          recipient // TODO: should this be `recipient.to` (?) or more specific
        });
      }
    }
  } catch (err) {
    // here we do some magic so that we push an error message
    // that has the end-recipient's email masked with the
    // original to address that we were trying to send to
    err._message = err.message;
    for (const address of Object.keys(recipient.replacements)) {
      err.message = err.message.replace(
        new RE2(new RegExp(escapeStringRegexp(address), 'gi')),
        recipient.replacements[address]
      );
    }

    if (!err.target) err.target = recipient.host;

    bounces.push({
      address: recipient.recipient,
      host: recipient.host,
      err,
      recipient
    });
  }

  return { accepted, bounces };
}

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
  if (
    session.dmarc?.status?.result === 'pass' &&
    !session.hadAlignedAndPassingDKIM
  ) {
    session.rewriteFriendlyFrom = true;

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
    if (!getHeaders(headers, 'reply-to'))
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

// TODO: ensure MX servers have database/redis access

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

  // TODO: possibly store a counter here too
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
  ) {
    logger.debug('returning early', { session });
    return;
  }

  // TODO: we need to check denylist for each in between deliveries

  //
  // TODO: we need to set x-original-to, and add received headers
  // TODO: add X-Original-To and Received headers to outbound SMTP (to top of message)
  //       and to `sealedMessage` and also on a per-recipient MX basis for accuracy
  //       (x-original-to should be comma separated list based off RCPT TO command)
  // TODO: ensure `session.headers` is updated as well
  //
  const sealedMessage = Buffer.concat([
    Buffer.from(session.arcSealedHeaders),
    headers.build(),
    body
  ]);

  console.log('data', data);

  // deliver to IMAP and forward messages in parallel
  const [imapResults, forwardResults] = await Promise.all([
    // imap
    data.imap.length === 0
      ? Promise.resolve()
      : imap.call(this, data.imap, session, sealedMessage),
    // forwarding
    data.normalized.length === 0
      ? Promise.resolve()
      : pMap(
          data.normalized,
          (recipient) => forward.call(this, recipient, session, sealedMessage),
          {
            concurrency: config.concurrency
          }
        )
  ]);

  const accepted = [];
  const bounces = [];

  console.log('imapResults', imapResults);
  console.log('forwardResults', forwardResults);

  if (imapResults) {
    if (imapResults.accepted.length > 0) {
      for (const a of imapResults.accepted) {
        if (!accepted.includes(a)) accepted.push(a);
      }
    }

    if (imapResults.bounces.length > 0) bounces.push(...imapResults.bounces);
  }

  if (forwardResults) {
    for (const result of forwardResults) {
      if (result.accepted.length > 0) {
        for (const a of result.accepted) {
          if (!accepted.includes(a)) accepted.push(a);
        }
      }

      if (result.bounces.length > 0) {
        bounces.push(...result.bounces);
      }
    }
  }

  console.log('accepted', accepted);
  console.log('bounces', bounces);

  // accepted counter
  if (accepted.length > 0) {
    this.client
      .incrby(
        `mail_accepted:${session.arrivalDateFormatted}`,
        accepted.length // TODO: `- alreadyAccepted.length`
      )
      .then()
      .catch((err) => logger.fatal(err));
  }

  // return early if no bounces (complete successful delivery)
  if (bounces.length === 0) return;

  // rejected counter
  this.client
    .incrby(`mail_rejected:${session.arrivalDateFormatted}`, bounces.length)
    .then()
    .catch((err) => logger.fatal(err));

  //
  // prepare final combined error and message
  //
  const errors = [];
  const codes = [];
  let isDenylistError = false;
  let hasCodeBug = false;

  for (const bounce of bounces) {
    errors.push(bounce.err);
    codes.push(getErrorCode(bounce.err));
    if (bounce.err instanceof DenylistError) isDenylistError = true;
    if (isCodeBug(bounce.err)) hasCodeBug = true;
  }

  const err = combineErrors(errors);
  if (isDenylistError) err.name = 'DenylistError';
  if (hasCodeBug) err.isCodeBug = true;

  // set SMTP response code equal to lowest error code
  err.responseCode = codes.sort()[0];

  // preserve original bounce array
  err.bounces = bounces;

  // if lowest error code was >= 500 then don't send a bounce email notification
  if (err.responseCode >= 500) return;

  // process (and then send) bounces if any in the background
  processBounces
    .call(this, headers, bounces, session, sealedMessage)
    .then()
    .catch((err) => logger.fatal(err));

  // throw the error so it bubbles up to connection
  throw err;
}

module.exports = onDataMX;
