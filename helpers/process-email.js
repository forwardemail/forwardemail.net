const os = require('node:os');
const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const DKIM = require('nodemailer/lib/dkim');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const intoStream = require('into-stream');
const ip = require('ip');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const parseErr = require('parse-err');
const prettyMilliseconds = require('pretty-ms');
const safeStringify = require('fast-safe-stringify');
const { SRS } = require('sender-rewriting-scheme');
const { Splitter, Joiner } = require('mailsplit');
const { authenticate } = require('mailauth');
const { isEmail } = require('validator');

const sendEmail = require('./send-email');

const config = require('#config');
const createSession = require('#helpers/create-session');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const getErrorCode = require('#helpers/get-error-code');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const logger = require('#helpers/logger');
const { Emails, Users, Domains, Aliases } = require('#models');
const { decrypt } = require('#helpers/encrypt-decrypt');
const parseRootDomain = require('#helpers/parse-root-domain');

const HOSTNAME = os.hostname();
const IP_ADDRESS = ip.address();
const ONE_SECOND_AFTER_UNIX_EPOCH = new Date(1000);

const RETURN_PATH =
  config.webHost === 'localhost' && config.env === 'development'
    ? 'forwardemail.net'
    : config.webHost;

// <https://github.com/zone-eu/zone-mta/blob/5daa48eea4aa05e724eb2ab80fd3a957e6cc8c6c/lib/sender.js#L64-L110>
function createMtaStsCache(client) {
  return {
    async set(domain, policy) {
      try {
        const expires = policy.expires ? new Date(policy.expires) : false;
        let ttl =
          expires && expires.toString() !== 'Invalid Date'
            ? expires.getTime() - Date.now()
            : 0;
        if (!ttl || ttl <= 0) {
          ttl = 60 * 1000;
        }

        const json = safeStringify(policy);

        logger.debug('MTA-STS', {
          domain,
          ttl: Math.round(ttl / 1000),
          policy: json
        });
        await client.set(`sts:${domain}`, json, 'PX', ttl);
      } catch (err) {
        logger.error(err, {
          domain
        });
      }
    },

    async get(domain) {
      try {
        const policy = await client.get(`sts:${domain}`);
        if (policy) {
          logger.debug('MTA-STS', {
            domain,
            policy
          });
          return JSON.parse(policy);
        }
      } catch (err) {
        logger.error(err, { domain });
      }
    }
  };
}

// `email` is an Email object from mongoose
// `resolver` is a Tangerine instance
// eslint-disable-next-line complexity
async function processEmail({ email, port = 25, resolver, client }) {
  const meta = {
    session: createSession(email),
    user: email.user,
    email: email._id,
    domains: [email.domain],
    ignore_hook: false
  };

  try {
    // lookup the email by id to get most recent data and version key (`__v`)
    email = await Emails.findById(email._id);
    if (!email) throw new Error('Email does not exist');

    // locked_at must not be set
    if (_.isDate(email.locked_at)) throw new Error('Email is locked already');

    // date must be in the past
    if (new Date(email.date).getTime() > Date.now())
      throw new Error('Email date is in the future');

    // status must be "queued" in order to be processed
    if (email.status !== 'queued')
      throw new Error('Email status must be queued');
  } catch (err) {
    // create log
    await logger.error(err, meta);
    return;
  }

  try {
    // lock job
    email.locked_by = IP_ADDRESS;
    email.locked_at = new Date();
    email.is_being_locked = true;
    email = await email.save();
    email.is_being_locked = false;

    // ensure user, domain, and alias still exist and are all enabled
    let [user, domain, alias] = await Promise.all([
      Users.findById(email.user).lean().exec(),
      Domains.findById(email.domain),
      Aliases.findById(email.alias)
        .populate('user', config.userFields.isBanned)
        .lean()
        .exec()
    ]);

    // user must exist
    if (!user) throw Boom.notFound(i18n.translateError('INVALID_USER'));

    // user must not be banned
    if (user[config.userFields.isBanned])
      throw Boom.forbidden(i18n.translateError('ACCOUNT_BANNED'));

    // user must be on paid plan
    if (user.plan === 'free')
      throw Boom.paymentRequired(i18n.translateError('PLAN_UPGRADE_REQUIRED'));

    // user must be paid to date
    if (new Date(user[config.userFields.planExpiresAt]).getTime() < Date.now())
      throw Boom.paymentRequired(
        i18n.translateError('PAYMENT_PAST_DUE_MESSAGE')
      );

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

    // alias must exist
    if (!alias)
      throw Boom.notFound(i18n.translateError('ALIAS_DOES_NOT_EXIST'));

    // alias must be enabled
    if (!alias.is_enabled)
      throw Boom.notFound(i18n.translateError('ALIAS_IS_NOT_ENABLED'));

    // alias owner must not be banned
    if (alias.user[config.userFields.isBanned])
      throw Boom.forbidden(i18n.translateError('ACCOUNT_BANNED'));

    // create log
    await logger.info('email queued', meta);

    // after 5+ days of attempted delivery, send bounce email
    const shouldBounce =
      new Date(email.date).getTime() + config.maxRetryDuration < Date.now();
    // TODO: revisit this in the future (this would be more accurate approach)
    // const shouldBounce = await Logs.exists({
    //   created_at: {
    //     $lte: new Date(Date.now() - config.maxRetryDuration)
    //   },
    //   message: 'email queued',
    //   email: {
    //     $eq: email._id,
    //     $exists: true
    //   }
    // });

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

    //
    // check against list of emails suspended
    //
    if (
      Array.isArray(domain.smtp_emails_blocked) &&
      domain.smtp_emails_blocked.length > 0
    ) {
      const matches = [];
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
    // - [x] set Message-Id header
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

      // remove Bcc header
      data.headers.remove('bcc');

      // set Message-Id header
      const messageId = data.headers.getFirst('message-id');
      if (!messageId || messageId !== email.messageId) {
        data.headers.remove('message-id');
        data.headers.add('Message-Id', email.messageId);
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
      for (const key of [
        'x-report-abuse-to',
        'x-report-abuse',
        'x-complaints-to',
        'x-forwardemail-version',
        'x-forwardemail-sender',
        'x-forwardemail-id'
      ]) {
        data.headers.remove(key);
      }

      data.headers.add(
        'X-Report-Abuse-To',
        config.abuseEmail,
        data.headers.lines.length
      );
      data.headers.add(
        'X-Report-Abuse',
        config.abuseEmail,
        data.headers.lines.length
      );
      data.headers.add(
        'X-Complaints-To',
        config.abuseEmail,
        data.headers.lines.length
      );
      data.headers.add(
        'X-ForwardEmail-Version',
        config.pkg.version,
        data.headers.lines.length
      );
      data.headers.add(
        'X-ForwardEmail-Sender',
        `rfc822; ${[email.envelope.from, HOSTNAME, IP_ADDRESS].join(', ')}`,
        data.headers.lines.length
      );
      data.headers.add(
        'X-ForwardEmail-Id',
        email.id,
        data.headers.lines.length
      );
    });

    // if domain does not have DKIM key/selector then create one
    if (!isSANB(domain.dkim_private_key) || !isSANB(domain.return_path)) {
      domain.skip_payment_check = true;
      domain.skip_verification = true;
      domain = await domain.save();
    }

    // DKIM sign message
    const privateKey = decrypt(domain.dkim_private_key);
    const d = new DKIM({
      domainName: domain.name,
      keySelector: domain.dkim_key_selector,
      privateKey,
      // default as of nodemailer v6.9.1
      hashAlgo: 'sha256'
    });

    // NOTE: use pure streams in the future
    if (!Buffer.isBuffer(email.message))
      throw new Error('Email message is not a buffer');

    const raw = await getStream.buffer(
      d.sign(intoStream(email.message).pipe(splitter).pipe(joiner))
    );

    const srs = new SRS({
      separator: '=',
      secret: env.SRS_SECRET,
      maxAge: 30
    });

    //
    // if domain has CNAME pointing to forwardemail.net with the domain.return_path
    // then use that as the return path for SRS rewrite, otherwise use our normal value
    //
    let srsDomain;
    const returnPath = `${domain.return_path}.${domain.name}`;
    try {
      const results = await resolver.resolveCname(returnPath);
      if (
        Array.isArray(results) &&
        isSANB(results[0]) &&
        results[0] === RETURN_PATH
      )
        srsDomain = returnPath;
    } catch (err) {
      logger.warn(err, meta);
    }

    // verify Return-Path (enforces domain reputation)
    if (srsDomain !== returnPath)
      throw Boom.badRequest(i18n.translateError('INVALID_RETURN_PATH'));

    // rewrite envelope From with SRS using CNAME
    // (custom Return-Path but we don't add this header since IMAP does)
    const envelope = {
      from: srs.forward(email.envelope.from, srsDomain),
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

    const dkimAlignedMatch = dkim?.results
      ? dkim.results.find(
          (result) =>
            result.signingDomain === domain.name &&
            result.selector === domain.dkim_key_selector &&
            result?.status?.result === 'pass' &&
            result?.status?.aligned === domain.name &&
            result?.publicKey?.split('\n')?.slice(1, -1)?.join('') ===
              domain.dkim_public_key.toString('base64')
        )
      : false;

    // verify DKIM
    if (!dkim || !dkimAlignedMatch) {
      const err = Boom.badRequest(
        i18n.translateError('INVALID_DKIM_SIGNATURE')
      );
      if (dkim) err.dkim = dkim;
      throw err;
    }

    // verify SPF
    if (
      !spf ||
      !spf.domain ||
      ![`${domain.return_path}.${domain.name}`, env.WEB_HOST].includes(
        spf.domain
      ) ||
      spf?.status?.result !== 'pass'
    ) {
      const err = Boom.badRequest(i18n.translateError('INVALID_SPF_RESULT'));
      if (spf) err.spf = spf;
      throw err;
    }

    // verify DMARC
    if (
      !dmarc ||
      dmarc?.domain !== domain.name ||
      dmarc?.policy !== 'reject' ||
      dmarc?.status?.result !== 'pass' ||
      dmarc?.pct !== 100
    ) {
      const err = Boom.badRequest(i18n.translateError('INVALID_DMARC_RESULT'));
      if (dmarc) err.dmarc = dmarc;
      throw err;
    }

    //
    // accepted [String]
    // rejected [String]
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
      if (Array.isArray(email.accepted) && email.accepted.includes(to))
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
      logger.error(new Error('Invalid envelope recipients'), meta);
      return;
    }

    const cache = createMtaStsCache(client);

    // sort by targets from trusted list first so that we can block spam quickly
    const keys = _.sortBy([...map.keys()], (key) =>
      config.truthSources.has(parseRootDomain(key)) ? 0 : 1
    );

    const results = await pMap(
      keys,
      async (target) => {
        const to = [...map.get(target)];

        //
        // check if exists for domain being blocked
        // (ensures real-time blocking working)
        // or if the domain no longer has smtp access
        //
        const isDomainBlocked = await Domains.exists({
          $or: [
            {
              domain: domain._id,
              has_smtp: false
            },
            {
              domain: domain._id,
              smtp_suspended_sent_at: {
                $exists: true
              }
            }
          ]
        });

        if (isDomainBlocked)
          throw Boom.badRequest(i18n.translateError('DOMAIN_SUSPENDED'));

        try {
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

          if (isRecentlyBlocked)
            throw Boom.badRequest(
              i18n.translateError(
                'RECENTLY_BLOCKED',
                i18n.defaultLocale,
                target
              )
            );

          const info = await sendEmail({
            session: createSession(email),
            cache,
            target,
            port,
            envelope: {
              from: envelope.from,
              to
            },
            raw,
            localAddress: IP_ADDRESS,
            localHostname: HOSTNAME,
            resolver
          });
          return info;
        } catch (err) {
          err.isCodeBug = isCodeBug(err);
          err.responseCode = getErrorCode(err);

          //
          // if the SMTP response was from trusted root host and it was rejected for spam/virus
          // then denylist the sender (probably a low-reputation domain name spammer)
          //
          if (
            user.group !== 'admin' &&
            domain.name !== env.WEB_HOST &&
            typeof err.bounceInfo === 'object' &&
            typeof err.bounceInfo.category === 'string' &&
            ['virus', 'spam'].includes(err.bounceInfo.category)
          ) {
            let truthSource = config.truthSources.has(parseRootDomain(target))
              ? parseRootDomain(target)
              : false;

            //
            // if host was not allowlisted then check against MX connection hostname
            // (e.g. users with business domains pointing at a hosted provider like Google Business)
            //
            if (
              !truthSource &&
              typeof err.mx === 'object' &&
              isSANB(err.mx.hostname) &&
              isFQDN(err.mx.hostname)
            )
              truthSource = config.truthSources.has(
                parseRootDomain(err.mx.hostname)
              )
                ? parseRootDomain(err.mx.hostname)
                : false;

            if (truthSource) {
              // send an email to all admins of the domain
              const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
              try {
                await emailHelper({
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
                    truthSource,
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
                    .filter((m) => m.group === 'admin')
                    .map((m) =>
                      typeof m.user === 'object' &&
                      typeof m.user._id === 'object'
                        ? m.user._id
                        : m.user
                    )
                },
                group: 'admin'
              });

              // store when we sent this email
              if (!adminExists)
                await Domains.findByIdAndUpdate(domain._id, {
                  $set: {
                    smtp_suspended_sent_at: new Date()
                  }
                });

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
          }

          return {
            accepted: [],
            rejected: to,
            rejectedErrors: to.map((recipient) => {
              const error = parseErr(err);
              error.recipient = recipient;
              error.date = new Date();
              return error;
            })
          };
        }
      },
      { concurrency: config.concurrency }
    );

    // - [ ] TODO: credits get deducted regardless (and do not roll over to next period)
    //       (if out of credits then make an automated job email users courtesy)
    //       (once user pays up their credit balance this date email sent is reset)

    // TODO: check against silent ban and denylist (to wherever we're sending)

    meta.results = results;
    await logger.info('sent email', meta);

    // go through the results and determine which were accepted, rejected, or deferred
    const accepted = new Set();
    const rejectedErrors = [];
    for (const info of results) {
      if (Array.isArray(info.accepted) && info.accepted.length > 0) {
        for (const a of info.accepted) {
          accepted.add(a);
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
    const hasNewlyBlocked = false;

    //
    // update or add to `rejectedErrors` if necessary
    // (we only store the most recent `rejectedError` per recipient)
    //
    if (!Array.isArray(email.rejectedErrors)) email.rejectedErrors = [];
    if (rejectedErrors.length > 0) {
      for (const err of rejectedErrors) {
        if (!isEmail(err.recipient))
          throw new Error('Recipient not assigned to error');
        email.rejectedErrors.push(err instanceof Error ? parseErr(err) : err);
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
    // if the SMTP response indicated the email bounced
    // then prevent the domain sender from sending to this recipient again
    //
    if (hasNewlyBlocked) {
      // wrapped with a try/catch since we want the email still to save if the domain didn't
      try {
        domain.skip_payment_check = true;
        domain.skip_verification = true;
        domain = await domain.save();
      } catch (err) {
        logger.fatal(err);
      }
    }

    return;
  } catch (err) {
    // create log
    await logger.error(err, meta);

    //
    // these two properties are set to ensure consistency of `rejectedErrors`
    // (each err has `err.recipient` and `err.responseCode` per nodemailer)
    //
    err.isCodeBug = isCodeBug(err);
    err.responseCode = getErrorCode(err);

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
