/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { createPublicKey, randomBytes, createHmac } = require('node:crypto');

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const intoStream = require('into-stream');
const ip = require('ip');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const prettyMilliseconds = require('pretty-ms');
const safeStringify = require('fast-safe-stringify');
const { SRS } = require('sender-rewriting-scheme');
const { Splitter, Joiner } = require('mailsplit');
const { authenticate } = require('mailauth');
const { dkimSign } = require('mailauth/lib/dkim/sign');
const { isURL } = require('@forwardemail/validator');

const pkg = require('../package.json');

const _ = require('./lodash');
const combineErrors = require('./combine-errors');
const createBounce = require('./create-bounce');
const createMtaStsCache = require('./create-mta-sts-cache');
const createSession = require('./create-session');
const emailHelper = require('./email');
const getBlockedHashes = require('./get-blocked-hashes');
const getBounceInfo = require('./get-bounce-info');
const getErrorCode = require('./get-error-code');
const i18n = require('./i18n');
const isCodeBug = require('./is-code-bug');
const isEmail = require('./is-email');
const logger = require('./logger');
const parseRootDomain = require('./parse-root-domain');
const retryRequest = require('./retry-request');
const sendEmail = require('./send-email');
const updateHeaders = require('./update-headers');
const { encoder } = require('./encoder-decoder');
const { encrypt, decrypt } = require('./encrypt-decrypt');
const shouldSendDSN = require('./should-send-dsn');

const config = require('#config');
const env = require('#config/env');
const { Emails, Users, Domains, Aliases } = require('#models');

const USER_AGENT = `${pkg.name}/${pkg.version}`;
const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();
const ONE_SECOND_AFTER_UNIX_EPOCH = new Date(1000);

const RETURN_PATH =
  config.webHost === 'localhost' && config.env === 'development'
    ? 'localhost' // TODO: is this wrong? We want localhost or we need DNS involved?
    : config.webHost;

const srs = new SRS(config.srs);

// `email` is an Email object from mongoose
// `resolver` is a Tangerine instance

async function processEmail({ email, port = 25, resolver, client }) {
  const meta = {
    session: createSession(email),
    user: email.user,
    email: email._id,
    domains: [email.domain],
    ignore_hook: false
  };

  //
  // ATOMIC LOCK ACQUISITION
  //
  // Use findOneAndUpdate with conditions to atomically:
  // 1. Check if email exists
  // 2. Check if email is not already locked
  // 3. Check if email status is 'queued'
  // 4. Check if email date is in the past
  // 5. Lock the email if all conditions are met
  //
  // This prevents race conditions where multiple workers could
  // try to process the same email simultaneously.
  //
  try {
    const now = new Date();
    email = await Emails.findOneAndUpdate(
      {
        _id: email._id,
        status: 'queued',
        is_locked: false,
        date: { $lte: now }
      },
      {
        $set: {
          is_locked: true,
          locked_by: IP_ADDRESS,
          locked_at: now,
          status: 'queued'
        }
      },
      {
        new: true,
        returnDocument: 'after'
      }
    );

    // If no document was returned, the email either:
    // - doesn't exist
    // - is already locked by another worker
    // - has a status other than 'queued' (already sent/failed)
    // - has a date in the future
    if (!email) {
      logger.debug(
        'Email not available for processing (already locked, sent, or not ready)',
        meta
      );
      return;
    }
  } catch (err) {
    logger.debug(err, meta);
    return;
  }

  try {
    // ensure user, domain, and alias still exist and are all enabled
    let [user, domain, alias] = await Promise.all([
      Users.findById(email.user).lean().exec(),
      Domains.findById(email.domain)
        .populate(
          'members.user',
          `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
        .exec(),
      Aliases.findById(email.alias)
        .populate(
          'user',
          `id ${config.userFields.isBanned} email ${config.userFields.fullEmail} ${config.lastLocaleField}`
        )
        .lean()
        .exec()
    ]);

    // user must exist
    if (!user) throw Boom.notFound(i18n.translateError('INVALID_USER'));

    // user must not be banned
    if (user[config.userFields.isBanned])
      throw Boom.forbidden(i18n.translateError('ACCOUNT_BANNED'));

    // domain must exist
    if (!domain) throw Boom.notFound(i18n.translateError('INVALID_DOMAIN'));

    // domain must be on paid plan
    if (domain.plan === 'free')
      throw Boom.paymentRequired(i18n.translateError('PLAN_UPGRADE_REQUIRED'));

    // domain cannot be in suspended domains list
    if (_.isDate(domain.smtp_suspended_sent_at))
      throw Boom.badRequest(i18n.translateError('DOMAIN_SUSPENDED'));

    // domain must be enabled
    if (!domain.has_smtp)
      throw Boom.badRequest(i18n.translateError('EMAIL_SMTP_ACCESS_REQUIRED'));

    // safeguard for global
    if (domain.is_global)
      throw Boom.notFound(
        i18n.translateError('EMAIL_SMTP_GLOBAL_NOT_PERMITTED')
      );

    //
    // TODO: domain must have credits to be accepted for processing
    //       (unless it is a non-global domain where one of the admins is an admin)
    //       (since they get unlimited credits, e.g. ourselves forwardemail.net)
    //

    // NOTE: we support catch-all passwords so alias may not always exist

    if (alias) {
      // alias must be enabled
      if (!alias.is_enabled)
        throw Boom.notFound(i18n.translateError('ALIAS_IS_NOT_ENABLED'));

      // user must exist
      if (!alias.user) {
        const err = new TypeError(i18n.translateError('INVALID_USER'));
        err.alias = alias;
        err.email = email;
        throw err;
        // throw Boom.notFound(i18n.translateError('INVALID_USER'));
      }

      // alias owner must not be banned
      if (alias.user[config.userFields.isBanned])
        throw Boom.forbidden(i18n.translateError('ACCOUNT_BANNED'));
    }

    //
    // validate that at least one paying, non-banned admin on >= same plan without expiration
    //
    const validPlans =
      domain.plan === 'team' ? ['team'] : ['team', 'enhanced_protection'];

    if (
      !domain.members.some(
        (m) =>
          m.user &&
          !m.user[config.userFields.isBanned] &&
          m.user[config.userFields.hasVerifiedEmail] &&
          validPlans.includes(m.user.plan) &&
          (new Date(m.user[config.userFields.planExpiresAt]).getTime() >=
            Date.now() ||
            isSANB(m.user[config.userFields.stripeSubscriptionID]) ||
            isSANB(m.user[config.userFields.paypalSubscriptionID])) &&
          m.group === 'admin'
      )
    )
      throw Boom.paymentRequired(
        i18n.translateError('PAST_DUE_OR_INVALID_ADMIN')
      );

    // create log
    logger.debug('email queued', meta);

    const message = await Emails.getMessage(email.message);

    // after 5+ days of attempted delivery, send bounce email
    const shouldBounce =
      new Date(email.date).getTime() + config.maxRetryDuration < Date.now();

    if (shouldBounce) {
      //
      // TODO: send bounce email (which is in itself belongs in the queue and will consume a user's credit)
      //       (but only send the bounce email to the recipients that it failed to send to)
      //

      //
      // NOTE: this mirrors the same error and `config.maxRetryDuration` from email forwarding codebase
      //
      const err = new Error(
        `This message has been retried for the maximum period of ${prettyMilliseconds(
          config.maxRetryDuration,
          { verbose: true, secondsDecimalDigits: 0 }
        )} and has permanently failed.`
      );

      err.responseCode = 550;

      // helper boolean for setting "bounced" status (see email pre-save hook)
      err.maxRetryDuration = true;

      // lookup the email by id to get most recent data and version key (`__v`)
      email = await Emails.findById(email._id);
      if (!email) throw new Error('Email does not exist');

      // NOTE: save() will automatically remove from `rejectedErrors` any already `accepted`
      email.rejectedErrors.push(
        ...email.envelope.to.map((recipient) => {
          const error = parseErr(err);
          error.recipient = recipient;
          error.date = new Date();
          return error;
        })
      );

      // NOTE: we leave it up to the pre-save hook to determine the "status"
      email = await email.save();

      const filteredErrors = email.rejectedErrors.filter(
        (error) =>
          isSANB(error.recipient) &&
          isEmail(error.recipient) &&
          !email.hard_bounces.includes(error.recipient) &&
          // code must be 550 (safeguard)
          getErrorCode(error) === 550
      );

      if (!email.is_bounce && filteredErrors.length > 0) {
        const hardBounces = [];
        await pMap(
          filteredErrors,
          async (error) => {
            try {
              // bounces are unique by email id, recipient, and error code
              const key = `${config.fingerprintPrefix}:${
                email.id
              }:${encoder.pack([error.recipient, getErrorCode(error)])}`;

              // prevent sending a duplicate bounce to this address
              const count = await client.incrby(key, 0);
              if (count > 0) return;

              // check for DSN here
              if (!shouldSendDSN(email, error.recipient, 'FAILURE')) return;

              const envelope = {
                from: punycode.toASCII(`mailer-daemon@${domain.name}`),
                to: email.envelope.from
              };

              const stream = await createBounce(
                {
                  ...(typeof email.toObject === 'function'
                    ? email.toObject()
                    : email),
                  envelope
                },
                error,
                message
              );
              const raw = await getStream.buffer(stream);
              const bounceEmail = await Emails.queue({
                message: {
                  envelope,
                  raw
                },
                alias,
                domain,
                user,
                date: new Date(),
                is_bounce: true
              });

              // store that we sent this so we don't again
              client
                .pipeline()
                .incr(key)
                .pexpire(key, config.fingerprintTTL)
                .exec()
                .then()
                .catch((err) => logger.fatal(err));

              hardBounces.push(error.recipient);

              logger.debug('email created', {
                session: createSession(bounceEmail),
                user: bounceEmail.user,
                email: bounceEmail._id,
                domains: [bounceEmail.domain],
                ignore_hook: false
              });
            } catch (err) {
              logger.fatal(err, meta);
            }
          },
          { concurrency: config.concurrency }
        );

        if (hardBounces.length > 0)
          await Emails.findByIdAndUpdate(email._id, {
            $addToSet: {
              hard_bounces: {
                $each: hardBounces
              }
            }
          });
      }

      return;
    }

    //
    // check against list of emails suspended
    //
    if (
      Array.isArray(domain.smtp_emails_blocked) &&
      domain.smtp_emails_blocked.length > 0
    ) {
      const matches = [];

      // lookup the email by id to get most recent data and version key (`__v`)
      email = await Emails.findById(email._id);
      if (!email) throw new Error('Email does not exist');

      for (const recipient of email.envelope.to) {
        if (domain.smtp_emails_blocked.includes(recipient)) {
          const error = Boom.forbidden(
            i18n.translateError('RECIPIENT_BLOCKED')
          );
          error.responseCode = 550;
          error.recipient = recipient;
          error.date = new Date();
          email.rejectedErrors.push(error);
          matches.push(recipient);
        }
      }

      if (matches.length > 0) {
        // if all recipients are blocked then throw early
        if (_.isEqual(matches.sort(), email.envelope.to.sort()))
          throw Boom.forbidden(
            i18n.translateError(
              matches.length === 1
                ? 'RECIPIENT_BLOCKED'
                : 'ALL_RECIPIENTS_BLOCKED'
            )
          );

        email = await email.save();
      }
    }

    //
    // prepare message for sending with mailsplit
    //
    // - [x] remove Bcc header
    // - [x] set Message-ID header
    // - [x] set Date header
    // - [x] add X-* headers (e.g. version + report-to)
    // - [x] DKIM sign message
    // - [x] rewrite envelope From with SRS using CNAME (custom Return-Path but we don't add this header since IMAP does)
    // - [x] verify DKIM
    // - [x] verify SPF
    // - [x] verify DMARC
    //
    // headers can be modified until passed to a joiner
    const splitter = new Splitter();
    const joiner = new Joiner();

    let hasNewsletter = false;

    // these are used for bounce webhooks
    let listId;
    let listUnsubscribe;
    let feedbackId;

    // <https://github.com/andris9/mailsplit#events>

    splitter.on('data', (data) => {
      if (data.type !== 'node' || data.root !== true) return;
      // - data.headers.get
      // - data.headers.getFirst
      // - data.headers.hasHeader
      // - data.headers.add(key, value)
      // - data.headers.update(key, value)
      // - data.headers.remove(key)
      // - data.disposition = 'attachment' or 'inline'
      // - data.value

      //
      // NOTE: if user did not have newsletter add-on approval for the domain
      //       then throw an error and email admins if not sent already for approval
      //       (e.g. user's can use our service with ListMonk, etc)
      //       <https://github.com/knadh/listmonk>
      //
      //       * `List-Id`
      //       * `List-Unsubscribe`
      //
      //       if the message had any of these headers then don't allow
      //       <https://www.jitbit.com/maxblog/18-detecting-outlook-autoreplyout-of-office-emails-and-x-auto-response-suppress-header/>
      //       <https://github.com/nodemailer/smtp-server/issues/129>
      //       <https://www.arp242.net/autoreply.html>
      //
      // NOTE: hasHeader from mailsplit library is case-insensitive and trimmed
      //
      // <https://datatracker.ietf.org/doc/html/rfc5230#:~:text=Implementations%20SHOULD%20NOT,in%20%5BRFC3834%5D.>
      if (
        //
        // NOTE: vacation responders are bounces (aka auto responses) and have "precedence" header
        //       (in future we may want to rewrite for readability `is_bounce` to `is_auto_response`)
        //
        !email.is_bounce &&
        (data.headers.hasHeader('list-id') ||
          data.headers.hasHeader('list-subscribe') ||
          data.headers.hasHeader('list-unsubscribe') ||
          data.headers.hasHeader('list-help') ||
          data.headers.hasHeader('list-post') ||
          data.headers.hasHeader('list-owner') ||
          data.headers.hasHeader('list-archive') ||
          (data.headers.hasHeader('precedence') &&
            ['bulk', 'list'].includes(
              data.headers.getFirst('precedence').toLowerCase().trim()
            )))
      )
        hasNewsletter = true;

      //
      // NOTE: these are used for bounce webhooks
      //
      if (data.headers.hasHeader('list-id'))
        listId = data.headers.getFirst('list-id');
      if (data.headers.hasHeader('list-unsubscribe'))
        listUnsubscribe = data.headers.getFirst('list-unsubscribe');
      if (data.headers.hasHeader('feedback-id'))
        feedbackId = data.headers.getFirst('feedback-id');

      // remove Bcc header
      data.headers.remove('bcc');

      // set Message-ID header
      const messageId = data.headers.getFirst('message-id');
      if (!messageId || messageId !== `<${email.messageId}>`) {
        data.headers.remove('message-id');
        data.headers.add('Message-ID', `<${email.messageId}>`);
      }

      // set Date header
      const date = data.headers.getFirst('date');
      const dateValue = new Date(date);
      if (
        !date ||
        dateValue.toString() === 'Invalid Date' ||
        dateValue < ONE_SECOND_AFTER_UNIX_EPOCH ||
        dateValue.getTime() !== new Date(email.date).getTime()
      ) {
        data.headers.remove('date');
        data.headers.add(
          'Date',
          new Date(email.date).toUTCString().replace(/GMT/, '+0000')
        );
      }

      // add X-* headers (e.g. version + report-to)
      updateHeaders(data.headers);

      // additional headers to add specifically for outbound smtp
      data.headers.remove('x-forward-email-sender');
      data.headers.add(
        'X-Forward-Email-Sender',
        `rfc822; ${[
          punycode.toASCII(email.envelope.from),
          HOSTNAME,
          IP_ADDRESS
        ].join(', ')}`
        // data.headers.lines.length
      );
      data.headers.remove('x-forward-email-id');
      data.headers.add(
        'X-Forward-Email-ID',
        email.id
        // data.headers.lines.length
      );
    });

    // if domain does not have DKIM key/selector then create one
    if (!isSANB(domain.dkim_private_key) || !isSANB(domain.return_path)) {
      domain.skip_payment_check = true;
      domain.skip_verification = true;
      domain = await domain.save();
    }

    const unsigned = await getStream.buffer(
      intoStream(message).pipe(splitter).pipe(joiner)
    );

    if (hasNewsletter && !domain.has_newsletter) {
      // only send email if it's not sent yet or been more than three days without approval
      if (
        !_.isDate(domain.newsletter_sent_at) ||
        new Date(domain.newsletter_sent_at).getTime() <
          dayjs().subtract(3, 'days').toDate().getTime()
      ) {
        // send an email to all admins of the domain
        const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
        const subject = i18n.translate(
          'NEWSLETTER_APPROVAL_REQUIRED_SUBJECT',
          obj.locale,
          domain.name
        );
        const message = i18n.translate(
          'NEWSLETTER_APPROVAL_REQUIRED_MESSAGE',
          obj.locale,
          domain.name
        );
        await emailHelper({
          template: 'alert',
          message: {
            to: obj.to,
            bcc: config.email.message.from,
            subject
          },
          locals: {
            message,
            locale: obj.locale
          }
        });
        await Domains.findByIdAndUpdate(domain._id, {
          $set: {
            newsletter_sent_at: new Date()
          }
        });
      }

      throw Boom.badRequest(
        i18n.translateError('NEWSLETTER_USAGE_NOT_APPROVED')
      );
    }

    //
    // NOTE: we switched to use mailauth vs nodemailer for DKIM signing since body hash calculations were different
    //       <https://github.com/postalsys/mailauth/issues/39>
    //       <https://github.com/postalsys/mailauth/issues/17>
    //
    // <https://github.com/postalsys/mailauth#signing>
    //
    const signResult = await dkimSign(unsigned, {
      canonicalization: 'relaxed/relaxed',
      algorithm: 'rsa-sha256',
      signTime: new Date(),
      signatureData: [
        {
          signingDomain: punycode.toASCII(domain.name),
          selector: domain.dkim_key_selector,
          privateKey: decrypt(domain.dkim_private_key),
          algorithm: 'rsa-sha256',
          canonicalization: 'relaxed/relaxed'
        }
      ]
    });

    if (signResult.errors.length > 0) {
      const err = combineErrors(signResult.errors.map((error) => error.err));
      // we may want to remove cyclical reference
      // for (const error of signResult.errors) {
      //   delete error.err;
      // }
      err.signResult = signResult;
      throw err;
    }

    const signatures = Buffer.from(signResult.signatures, 'utf8');

    // create new raw message
    const raw = Buffer.concat(
      [signatures, unsigned],
      signatures.length + unsigned.length
    );

    //
    // if domain has CNAME pointing to forwardemail.net with the domain.return_path
    // then use that as the return path for SRS rewrite, otherwise use our normal value
    //
    let srsDomain;
    const returnPath = `${domain.return_path}.${punycode.toASCII(domain.name)}`;
    let returnPathResults;
    try {
      returnPathResults = await resolver.resolveCname(returnPath);
      if (
        Array.isArray(returnPathResults) &&
        isSANB(returnPathResults[0]) &&
        returnPathResults[0] === RETURN_PATH
      )
        srsDomain = returnPath;
    } catch (err) {
      logger.warn(err, meta);
    }

    // verify Return-Path (enforces domain reputation)
    if (srsDomain !== returnPath) {
      //
      // NOTE: this indicates typically an outbound SMTP configuration issue
      //       (as a courtesy send this once a week to the user on a per-domain basis)
      //
      const cache = await client.get(`return_path_check:${domain.id}`);
      if (!cache) {
        await client.set(
          `return_path_check:${domain.id}`,
          true,
          'PX',
          ms('1d')
        );
        // send an email to all admins of the domain
        const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
        const subject = i18n.translate(
          'RETURN_PATH_ERROR_SUBJECT',
          obj.locale,
          domain.name
        );
        const message = i18n.translate(
          'RETURN_PATH_ERROR_MESSAGE',
          obj.locale,
          domain.name,
          `${config.urls.web}/${
            obj.locale
          }/my-account/domains/${punycode.toASCII(domain.name)}/verify-smtp`
        );
        // TODO: if error occurs then unset cache
        await emailHelper({
          template: 'alert',
          message: {
            to: obj.to,
            subject
          },
          locals: {
            message,
            locale: obj.locale
          }
        });
      }

      const err = Boom.badRequest(i18n.translateError('INVALID_RETURN_PATH'));
      err.returnPathResults = returnPathResults;
      err.srsDomain = srsDomain;
      err.returnPath = returnPath;
      throw err;
    }

    // rewrite envelope From with SRS using CNAME
    // (custom Return-Path but we don't add this header since IMAP does)
    const envelope = {
      from: punycode
        .toASCII(email.envelope.from)
        .toLowerCase()
        .endsWith(`@${env.WEB_HOST}`)
        ? punycode.toASCII(email.envelope.from)
        : srs.forward(punycode.toASCII(email.envelope.from), srsDomain),
      to: [...email.envelope.to]
    };

    // development mode hack for passing SPF
    let ip = IP_ADDRESS;
    if (config.webHost === 'localhost' && config.env === 'development') {
      const ips = await resolver.resolve('forwardemail.net');
      ip = ips[0];
    }

    const { dkim, spf, dmarc } = await authenticate(raw, {
      sender: envelope.from,
      ip,
      helo: HOSTNAME,
      mta: HOSTNAME,
      disableArc: true,
      disableBimi: true,
      resolver: resolver.resolve
    });

    const dkimPublicKey = createPublicKey(
      Buffer.from(
        `-----BEGIN PUBLIC KEY-----\n${domain.dkim_public_key.toString(
          'base64'
        )}\n-----END PUBLIC KEY-----`
      ),
      { encoding: 'base64' }
    );

    let dkimAlignedMatch;

    try {
      dkimAlignedMatch = dkim?.results
        ? dkim.results.find((result) => {
            const isAligned =
              punycode.toASCII(result.signingDomain) ===
                punycode.toASCII(domain.name) &&
              result.selector === domain.dkim_key_selector &&
              result?.status?.result === 'pass' &&
              ((result?.status?.aligned &&
                punycode.toASCII(result.status.aligned) ===
                  punycode.toASCII(domain.name)) ||
                (result?.status?.aligned &&
                  punycode.toASCII(result.status.aligned) ===
                    parseRootDomain(punycode.toASCII(domain.name))));

            if (!isAligned) return;

            // <https://github.com/postalsys/mailauth/issues/48#issuecomment-1797936586>
            return dkimPublicKey.equals(createPublicKey(result.publicKey));
          })
        : false;
    } catch (err) {
      logger.fatal(err);
    }

    // verify DKIM
    // <https://github.com/postalsys/mailauth/issues/48>

    // TODO: https://github.com/postalsys/mailauth/issues/58
    let bodyHashIssue = false;
    if (
      dkim.results &&
      dkim.results.some(
        (r) =>
          r.status?.comment === 'body hash did not verify' &&
          punycode.toASCII(r.signingDomain) === punycode.toASCII(domain.name) &&
          r.selector === domain.dkim_key_selector &&
          ((r.status?.aligned &&
            punycode.toASCII(r.status.aligned) ===
              punycode.toASCII(domain.name)) ||
            (r.status?.aligned &&
              punycode.toASCII(r.status.aligned) ===
                parseRootDomain(punycode.toASCII(domain.name))))
      )
    )
      bodyHashIssue = true;

    if (!bodyHashIssue && (!dkim || !dkimAlignedMatch)) {
      const err = Boom.badRequest(
        i18n.translateError('INVALID_DKIM_SIGNATURE')
      );
      err.dkim = dkim;
      throw err;
    }

    // verify SPF
    if (
      !spf ||
      !spf.domain ||
      ![
        `${domain.return_path}.${punycode.toASCII(domain.name)}`,
        env.WEB_HOST
      ].includes(punycode.toASCII(spf.domain)) ||
      spf?.status?.result !== 'pass'
    ) {
      const err = Boom.badRequest(i18n.translateError('INVALID_SPF_RESULT'));
      if (spf) err.spf = spf;
      err.envelope = envelope;
      err.srsDomain = srsDomain;
      err.returnPath = returnPath;
      throw err;
    }

    // verify DMARC
    if (
      !dmarc ||
      (dmarc?.domain &&
        punycode.toASCII(dmarc.domain) !== punycode.toASCII(domain.name) &&
        dmarc?.domain &&
        punycode.toASCII(dmarc.domain) !==
          parseRootDomain(punycode.toASCII(domain.name))) ||
      // !isSANB(dmarc?.policy) ||
      // !['none', 'reject', 'quarantine'].includes(dmarc.policy) ||
      // dmarc?.policy !== 'reject' ||
      dmarc?.status?.result !== 'pass' ||
      (typeof dmarc?.pct === 'number' && dmarc.pct !== 100)
    ) {
      const err = Boom.badRequest(i18n.translateError('INVALID_DMARC_RESULT'));
      if (dmarc) err.dmarc = dmarc;
      throw err;
    }

    //
    // accepted [String]
    // rejectedErrors [Object] (an Array of Objects which were parsed Errors via `parse-err`)
    //
    // - [x] filter out recipients already accepted
    // - [x] filter out recipients that have 5xx errors and were already rejected
    // - [x] group by same target
    //
    // NOTE: `sendEmail` either throws an error or returns an info nodemailer object
    //       info = { accepted: [String], rejected: [String], rejectedErrors [err] }
    //       (whereas `err` in `rejectedErrors` has `err.recipient`)
    //       (if an error is thrown then it is assumed that all recipients to target failed)
    //
    const map = new Map();
    for (const to of envelope.to) {
      // filter out recipients already accepted
      if (
        Array.isArray(email.accepted) &&
        email.accepted.includes(to.toLowerCase())
      )
        continue;

      // filter out recipients that have 5xx errors and were already rejected
      if (
        Array.isArray(email.rejectedErrors) &&
        email.rejectedErrors.some(
          (err) =>
            Number.isFinite(err.responseCode) &&
            err.responseCode >= 500 &&
            typeof err.recipient === 'string' &&
            err.recipient.toLowerCase() === to
        )
      )
        continue;

      // group by same target
      const target = to.split('@')[1];
      if (map.has(target)) {
        map.set(target, map.get(target).add(to));
      } else {
        map.set(target, new Set([to]));
      }
    }

    // safeguard
    if (map.size === 0) {
      //
      // NOTE: this is a safeguard so that if every envelope recipient
      //       is already accepted it will mark the email as being sent
      //
      if (
        email.accepted.sort().join(',') ===
        email.envelope.to
          .map((s) => s.toLowerCase())
          .sort()
          .join(',')
      ) {
        await Emails.findByIdAndUpdate(email._id, {
          $set: {
            status: 'sent',
            is_locked: false
          },
          $unset: {
            locked_by: 1,
            locked_at: 1
          }
        });
      } else {
        logger.error(new Error('Invalid envelope recipients'), meta);
      }

      return;
    }

    const cache = createMtaStsCache(client);

    // sort by targets from trusted list first so that we can block spam quickly
    const keys = _.sortBy([...map.keys()], (key) =>
      config.truthSources.has(parseRootDomain(key)) ? 0 : 1
    );

    // prepare an array of emails to send to
    const addresses = [];
    for (const target of keys) {
      addresses.push(...map.get(target));
    }

    let results = [];
    if (addresses.length > 0)
      results = await pMap(
        addresses,

        async (address) => {
          const to = address.toLowerCase();
          const target = address.split('@')[1];
          //
          // check if exists for domain being blocked
          // (ensures real-time blocking working)
          // or if the domain no longer has smtp access
          //
          const isDomainBlocked = await Domains.exists({
            $or: [
              {
                _id: domain._id,
                has_smtp: false
              },
              {
                _id: domain._id,
                is_smtp_suspended: true
              }
            ]
          });

          if (isDomainBlocked)
            throw Boom.badRequest(i18n.translateError('DOMAIN_SUSPENDED'));

          try {
            //
            // if target is our own service then ignore
            //
            if (target !== env.WEB_HOST) {
              //
              // NOTE: check `target` against recently blocked domains and if so then retry later
              //       (this gives postmasters like Outlook and Gmail a back-off period)
              //       (and gives opportunity for another server to try sending it)
              //
              const isRecentlyBlocked = await Emails.exists({
                updated_at: {
                  $gte: dayjs().subtract(1, 'hour').toDate(),
                  $lte: new Date()
                },
                has_blocked_hashes: true,
                blocked_hashes: {
                  $in: getBlockedHashes(IP_ADDRESS)
                },
                rejectedErrors: {
                  $elemMatch: {
                    date: {
                      $gte: dayjs().subtract(1, 'hour').toDate(),
                      $lte: new Date()
                    },
                    target,
                    'bounceInfo.category': 'blocklist',
                    'mx.localAddress': IP_ADDRESS
                  }
                }
              });

              if (isRecentlyBlocked) {
                const err = Boom.badRequest(
                  i18n.translateError(
                    'RECENTLY_BLOCKED',
                    i18n.config.defaultLocale,
                    target
                  )
                );
                err.is_recently_blocked = true;
                throw err;
              }
            }

            const options = {
              session: createSession(email),
              cache,
              target,
              port,
              envelope: {
                from: envelope.from,
                to
              },
              raw: unsigned,
              localAddress: IP_ADDRESS,
              localHostname: HOSTNAME,
              resolver,
              client
            };

            // NOTE: sendEmail will PGP/DKIM sign the message
            const info = await sendEmail(options, email, domain);
            logger.debug('sent email', {
              info,
              options: _.omit(options, ['raw', 'session']),
              session: options.session
            });
            return info;
          } catch (err) {
            // log the error (dups will be removed)
            logger.error(err, {
              user: email.user,
              email: email._id,
              domains: [email.domain],
              session: createSession(email)
            });

            //
            // if the SMTP response was from trusted root host and it was rejected for spam/virus
            // then denylist the sender (probably a low-reputation domain name spammer)
            //
            if (
              user.group !== 'admin' &&
              domain.name !== env.WEB_HOST &&
              err.truthSource &&
              typeof err.bounceInfo === 'object' &&
              typeof err.bounceInfo.category === 'string' &&
              ['virus', 'spam'].includes(err.bounceInfo.category)
            ) {
              // send an email to all admins of the domain
              const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
              try {
                await emailHelper({
                  // TODO: smtp-spam-detected
                  template: 'smtp-suspended',
                  message: { to: obj.to, bcc: config.email.message.from },
                  locals: {
                    domain:
                      typeof domain.toObject === 'function'
                        ? domain.toObject()
                        : domain,
                    locale: obj.locale,
                    category: err.bounceInfo.category,
                    responseCode: err.responseCode,
                    response: err.response,
                    truthSource: err.truthSource,
                    email:
                      typeof email.toObject === 'function'
                        ? email.toObject()
                        : email
                  }
                });
              } catch (err) {
                logger.fatal(err, meta);
              }

              // if any of the domain admins are admins then don't ban
              const adminExists = await Users.exists({
                _id: {
                  $in: domain.members
                    .filter((m) => m.user && m.group === 'admin')
                    .map((m) =>
                      typeof m.user === 'object' &&
                      typeof m?.user?._id === 'object'
                        ? m.user._id
                        : m.user
                    )
                },
                group: 'admin'
              });

              if (!adminExists) {
                // store when we sent this email and mark user as suspended
                await Domains.findByIdAndUpdate(domain._id, {
                  $set: {
                    smtp_suspended_sent_at: new Date(),
                    is_smtp_suspended: true
                  }
                });

                // send sms/email alert to admins
                const _err = new TypeError(
                  `${domain.name} (ID ${domain.id}) was suspended from SMTP access per email ID ${email.id}`
                );
                _err.err = err; // reference original error
                logger.error(_err, meta);

                // delete all existing tokens for the alias
                // (this way further retries will fail with incorrect password)
                // await Aliases.findByIdAndUpdate(alias._id, {
                //   $set: {
                //     tokens: []
                //   }
                // });
              }

              //
              // NOTE: we do `forbidden` here instead of `badRequest`
              //       so that the email will permanently fail instead of retrying
              //
              const error = Boom.forbidden(
                i18n.translateError('DOMAIN_SUSPENDED')
              );
              // preserve original err
              error.error = err;
              throw error;
            }

            const rejectedErrors = [];
            const error = parseErr(err);
            error.recipient = to;
            error.date = new Date();
            rejectedErrors.push(error);

            return {
              accepted: [],
              rejected: to,
              rejectedErrors
            };
          }
        },
        { concurrency: config.concurrency }
      );

    // - [ ] TODO: credits get deducted regardless (and do not roll over to next period)
    //       (if out of credits then make an automated job email users courtesy)
    //       (once user pays up their credit balance this date email sent is reset)

    meta.results = results;
    logger.debug('sent email', meta);

    // go through the results and determine which were accepted, rejected, or deferred
    const accepted = new Set();
    const rejectedErrors = [];
    for (const info of results) {
      if (Array.isArray(info.accepted) && info.accepted.length > 0) {
        for (const a of info.accepted) {
          accepted.add(a);

          // store delivery information with transport metadata
          if (!Array.isArray(email.deliveries)) email.deliveries = [];

          // extract delivery information from info and session
          const delivery = {
            recipient: a,
            date: new Date(),
            response: info.response,
            responseCode: info.responseCode || 250,
            pgp: info.pgp || false,
            dkim: true // always signed by sendEmail
          };

          // add MX information from session if available
          if (info.session?.mx) {
            delivery.mx = {
              host: info.session.mx.host,
              priority: info.session.mx.priority,
              ip: info.session.mx.ip,
              port: info.session.mx.port
            };
          }

          // add TLS information from session if available
          if (info.session?.tls) {
            delivery.tls = {
              enabled: true,
              version: info.session.tls.version,
              cipher: info.session.tls.cipher
            };
          }

          // add truth source and TLS policy information
          if (info.session) {
            delivery.truthSource = info.session.truthSource;
            delivery.requireTLS = info.session.requireTLS;
            delivery.ignoreTLS = info.session.ignoreTLS;
            delivery.opportunisticTLS = info.session.opportunisticTLS;
          }

          email.deliveries.push(delivery);
        }
      }

      if (Array.isArray(info.rejectedErrors) && info.rejectedErrors.length > 0)
        rejectedErrors.push(...info.rejectedErrors);

      //
      // TODO: some servers like Outlook can be configured to
      //       not accept more than one RCPT TO at once
      //       (e.g. EENVELOPE and err.message contains "Too many recipients")
      //       therefore we should detect this an posssibly retry
      //
    }

    // lookup the email by id to get most recent data and version key (`__v`)
    email = await Emails.findById(email._id);
    if (!email) throw new Error('Email does not exist');

    //
    // update `accepted` array
    //
    if (Array.isArray(email.accepted)) {
      for (const a of email.accepted) {
        accepted.add(a);
      }
    }

    email.accepted = [...accepted];

    //
    // store a list of bounced recipients we're going to block
    //
    // TODO: copy over isTLSRequired stuff from SMTP
    // const hasNewlyBlocked = false;

    //
    // update or add to `rejectedErrors` if necessary
    // (we only store the most recent `rejectedError` per recipient)
    //
    if (!Array.isArray(email.rejectedErrors)) email.rejectedErrors = [];
    if (rejectedErrors.length > 0) {
      for (const err of rejectedErrors) {
        if (!isEmail(err.recipient))
          throw new Error('Recipient not assigned to error');

        // enhance error with transport information from session
        const enhancedError = err instanceof Error ? parseErr(err) : err;

        // add MX information if available
        if (err.mx) {
          enhancedError.mx = {
            host: err.mx.host,
            priority: err.mx.priority,
            ip: err.mx.ip,
            port: err.port
          };
        }

        // add TLS information if available
        if (err.tls) {
          enhancedError.tls = {
            enabled: Boolean(err.tls),
            version: err.tls.version,
            cipher: err.tls.cipher
          };
        }

        // add truth source and TLS policy information
        if (err.truthSource) enhancedError.truthSource = err.truthSource;
        if (typeof err.requireTLS === 'boolean')
          enhancedError.requireTLS = err.requireTLS;
        if (typeof err.ignoreTLS === 'boolean')
          enhancedError.ignoreTLS = err.ignoreTLS;
        if (typeof err.opportunisticTLS === 'boolean')
          enhancedError.opportunisticTLS = err.opportunisticTLS;

        email.rejectedErrors.push(enhancedError);
        /*
        // TODO: re-enable this after checking bounceInfo and more
        if (
          typeof err.responseCode === 'number' &&
          err.responseCode >= 500 &&
          err.responseCode < 600
        ) {
          domain.smtp_emails_blocked.push(err.recipient);
          hasNewlyBlocked = true;
        }
        */
      }
    }

    //
    // now we have in-memory the most recent array of `accepted` and `rejectedErrors`
    // and can properly update the `status` of the email as such (by calling `save()`)
    //
    email = await email.save();

    //
    // send bounces if any
    //
    const filteredErrors = email.rejectedErrors.filter(
      (error) =>
        isSANB(error.recipient) &&
        isEmail(error.recipient) &&
        !error.is_recently_blocked &&
        !email.soft_bounces.includes(error.recipient) &&
        !email.hard_bounces.includes(error.recipient)
      // !isRetryableError(error) &&
      // !isSSLError(error) &&
      // !isTLSError(error) &&
      // !isCodeBug(error)
    );

    //
    // NOTE: here's where we send bounce webhook in the background for each of our sending attempts
    //
    const bounceErrors = email.rejectedErrors.filter(
      (error) =>
        isSANB(error.recipient) &&
        isEmail(error.recipient) &&
        !error.is_recently_blocked
      // this is similar to filteredErrors except we send it for every bounce attempt so we don't need these:
      // !email.soft_bounces.includes(error.recipient) &&
      // !email.hard_bounces.includes(error.recipient) &&
      // !isRetryableError(error) &&
      // !isSSLError(error) &&
      // !isTLSError(error) &&
      // !isCodeBug(error)
    );

    if (
      !email.is_bounce &&
      bounceErrors.length > 0 &&
      typeof domain.bounce_webhook === 'string' &&
      isURL(domain.bounce_webhook, config.isURLOptions)
    ) {
      let webhookKey = domain.webhook_key;
      if (!webhookKey) {
        // SHA256 HMAC should not exceed 512 bytes for key length
        // <https://security.stackexchange.com/a/96176>
        webhookKey = encrypt(randomBytes(16).toString('hex'));
        domain.webhook_key = webhookKey;
        await Domains.findByIdAndUpdate(domain._id, {
          $set: { webhook_key: webhookKey }
        });
      }

      // send bounces in the background here
      pMapSeries(bounceErrors, async (error) => {
        const body = JSON.stringify({
          email_id: email.id,
          list_id: listId,
          list_unsubscribe: listUnsubscribe,
          feedback_id: feedbackId,
          recipient: error.recipient,
          message:
            isCodeBug(error) && !error.isBoom
              ? 'An internal server error has occurred, please try again later.'
              : error.message,
          response: error.response,
          response_code: error.responseCode,
          truth_source: error.truthSource,
          bounce: getBounceInfo(error),
          headers: email.headers,
          bounced_at:
            typeof error.date !== 'undefined' && _.isDate(new Date(error.date))
              ? new Date(error.date).toISOString()
              : new Date().toISOString()
        });
        // dummyproofing
        const url = domain.bounce_webhook
          .replace('HTTP://', 'http://')
          .replace('HTTPS://', 'https://')
          .trim();
        const response = await retryRequest(url, {
          method: 'POST',
          headers: {
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/json',
            'X-Webhook-Signature': createHmac('sha256', decrypt(webhookKey))
              .update(body)
              .digest('hex')
          },
          body,
          timeout: ms('5s'),
          retries: 1,
          resolver
        });
        // consume body
        if (
          !response?.signal?.aborted &&
          typeof response?.body?.dump === 'function'
        )
          await response.body.dump();
      })
        .then()
        .catch(async (err) => {
          logger.fatal(err);
          try {
            // only send email if it's not sent yet or been more than 1 week since last time
            if (
              !_.isDate(domain.bounce_webhook_sent_at) ||
              new Date(domain.bounce_webhook_sent_at).getTime() <
                dayjs().subtract(1, 'week').toDate().getTime()
            ) {
              // send an email to all admins of the domain
              const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
              const subject = i18n.translate(
                'BOUNCE_WEBHOOK_ERROR_SUBJECT',
                obj.locale,
                domain.name
              );
              const message =
                i18n.translate(
                  'BOUNCE_WEBHOOK_ERROR_MESSAGE',
                  obj.locale,
                  domain.name,
                  domain.bounce_webhook
                ) +
                `<pre><code>${safeStringify(
                  _.omit(parseErr(err), 'stack'),
                  null,
                  2
                )}</code></pre>`;
              await emailHelper({
                template: 'alert',
                message: {
                  to: obj.to,
                  bcc: config.alertsEmail,
                  subject
                },
                locals: {
                  message,
                  locale: obj.locale
                }
              });
              await Domains.findByIdAndUpdate(domain._id, {
                $set: {
                  bounce_webhook_sent_at: new Date()
                }
              });
            }
          } catch (err) {
            logger.fatal(err);
          }
        });
    }

    if (!email.is_bounce && filteredErrors.length > 0) {
      const softBounces = [];
      const hardBounces = [];
      await pMap(
        filteredErrors,
        async (error) => {
          try {
            //
            // if it was a soft bounce and within 15 mins of email's date then return early
            // (we don't want to send temporary bounce emails too quickly)
            //
            const code = getErrorCode(error);

            if (
              code < 500 &&
              Date.now() <
                dayjs(email.date).add(15, 'minutes').toDate().getTime()
            )
              return;

            // check for DSN here
            if (
              !shouldSendDSN(
                email,
                error.recipient,
                code < 500 ? 'DELAY' : 'FAILURE'
              )
            )
              return;

            const envelope = {
              from: punycode.toASCII(`mailer-daemon@${domain.name}`),
              to: email.envelope.from
            };

            const stream = await createBounce(
              {
                ...(typeof email.toObject === 'function'
                  ? email.toObject()
                  : email),
                envelope
              },
              error,
              message
            );
            const raw = await getStream.buffer(stream);
            const bounceEmail = await Emails.queue({
              message: {
                envelope,
                raw
              },
              alias,
              domain,
              user,
              date: new Date(),
              is_bounce: true
            });

            if (code < 500) softBounces.push(error.recipient);
            else hardBounces.push(error.recipient);

            logger.debug('email created', {
              session: createSession(bounceEmail),
              user: bounceEmail.user,
              email: bounceEmail._id,
              domains: [bounceEmail.domain],
              ignore_hook: false
            });
          } catch (err) {
            logger.fatal(err, meta);
          }
        },
        { concurrency: config.concurrency }
      );

      if (softBounces.length > 0 || hardBounces.length > 0) {
        const $addToSet = {};
        if (softBounces.length > 0)
          $addToSet.soft_bounces = {
            $each: softBounces
          };
        if (hardBounces.length > 0)
          $addToSet.hard_bounces = {
            $each: hardBounces
          };
        await Emails.findByIdAndUpdate(email._id, {
          $addToSet
        });
      }
    }

    //
    // if the SMTP response indicated the email bounced
    // then prevent the domain sender from sending to this recipient again
    //
    // if (hasNewlyBlocked) {
    //   // wrapped with a try/catch since we want the email still to save if the domain didn't
    //   try {
    //     domain.skip_payment_check = true;
    //     domain.skip_verification = true;
    //     domain = await domain.save();
    //   } catch (err) {
    //     logger.fatal(err);
    //   }
    // }

    // used to detect pgp encryption
    if (config.env === 'test') return results;

    return;
  } catch (err) {
    //
    // these two properties are set to ensure consistency of `rejectedErrors`
    // (each err has `err.recipient` and `err.responseCode` per nodemailer)
    //
    err.isCodeBug = isCodeBug(err);
    err.responseCode = getErrorCode(err);

    // create log
    logger.error(err, meta);

    // lookup the email by id to get most recent data and version key (`__v`)
    email = await Emails.findById(email._id);
    if (!email) throw new Error('Email does not exist');

    // if we threw an error with Boom, then based off the type we need to update email status
    if (
      err.isBoom === true &&
      typeof err?.output?.statusCode === 'number' &&
      [400, 402, 403, 404].includes(err.output.statusCode)
    ) {
      // if badRequest (400) then set status to "deferred" and don't throw
      // if paymentRequired (402) then set status to "deferred" and don't throw
      if ([400, 402].includes(err.output.statusCode)) {
        // NOTE: save() will automatically remove from `rejectedErrors` any already `accepted`
        email.rejectedErrors.push(
          ...email.envelope.to.map((recipient) => {
            const error = parseErr(err);
            error.recipient = recipient;
            error.date = new Date();
            return error;
          })
        );
        // NOTE: we leave it up to the pre-save hook to determine the "status"
        email = await email.save();
        return;
      }

      // if forbidden (403) then set status to "rejected" and don't throw
      // if notFound (404) then set status to "rejected" and don't throw
      if ([403, 404].includes(err.output.statusCode)) {
        // NOTE: save() will automatically remove from `rejectedErrors` any already `accepted`
        email.rejectedErrors.push(
          ...email.envelope.to.map((recipient) => {
            const error = parseErr(err);
            error.recipient = recipient;
            error.date = new Date();
            return error;
          })
        );
        // NOTE: we leave it up to the pre-save hook to determine the "status"
        email = await email.save();
        return;
      }
    }

    //
    // if it wasn't a boom error or known error then set status to deferred
    // and ensure that the response code set for the error is 421 (retry later)
    // (this gives transparency to users with internal errors and gives us time to discover and resolve)
    //
    err.responseCode = 421;
    // NOTE: save() will automatically remove from `rejectedErrors` any already `accepted`
    email.rejectedErrors.push(
      ...email.envelope.to.map((recipient) => {
        const error = parseErr(err);
        error.recipient = recipient;
        error.date = new Date();
        return error;
      })
    );
    // NOTE: we leave it up to the pre-save hook to determine the "status"
    email = await email.save();

    throw err;
  }
}

module.exports = processEmail;
