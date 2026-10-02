/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');

const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const _ = require('#helpers/lodash');
const checkAndAutoApproveSMTP = require('#helpers/check-and-auto-approve-smtp');
const isEmail = require('#helpers/is-email');
const parseTLSRequiredHeader = require('#helpers/parse-tls-required-header');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const SMTPError = require('#helpers/smtp-error');
const Users = require('#models/users');
const config = require('#config');
const createSession = require('#helpers/create-session');
const emailHelper = require('#helpers/email');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
const validateAlias = require('#helpers/validate-alias');
const validateDomain = require('#helpers/validate-domain');
const i18n = require('#helpers/i18n');
const { decrypt } = require('#helpers/encrypt-decrypt');
const checkSmtpVelocity = require('#helpers/check-smtp-velocity');
const {
  checkBandwidth,
  getBandwidthLimitMessage
} = require('#helpers/bandwidth-limiter');

const { reserveAliasMessage } = checkSmtpVelocity;
const {
  enforceSmtpSendingLimits
} = require('#helpers/get-smtp-sending-limits');
const { getSmtpDayStart } = require('#helpers/get-smtp-day');

async function onDataSMTP(session, date, headers, body) {
  //
  // NOTE: we don't share the full alias and domain object
  //       in between onAuth and onData because there could
  //       be a time gap between the SMTP commands are sent
  //       (we want the most real-time information)
  //
  // ensure that user is authenticated
  if (
    !isEmail(session?.user?.username) ||
    typeof session?.user?.password !== 'string' ||
    typeof session?.user?.domain_id !== 'string' ||
    typeof session?.user?.domain_name !== 'string'
  )
    throw new SMTPError(config.authRequiredMessage, {
      responseCode: 530
    });

  //
  // NOTE: we validate that the in-memory password is still active for
  //       the given user or the domain-wide catch-all generated password
  //       (e.g. edge case where AUTH done, a few seconds go by, then pass removed by user, and email would've gone through)
  //

  let alias;
  let isValid = false;
  if (session.user.alias_id) {
    alias = await Aliases.findOne({
      _id: new mongoose.Types.ObjectId(session.user.alias_id),
      domain: new mongoose.Types.ObjectId(session.user.domain_id)
    })
      .populate(
        'user',
        `id email plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpBaselineDaily} ${config.userFields.smtpBaselineAt} ${config.userFields.smtpBaselineHourly} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
      )
      .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
      .lean()
      .exec();

    // alias must exist
    if (!alias) throw new Error('Alias does not exist');

    // validate alias
    validateAlias(alias, session.user.domain_name, session.user.alias_name);

    // ensure the token is still valid
    if (Array.isArray(alias.tokens) && alias.tokens.length > 0)
      isValid = await isValidPassword(
        alias.tokens,
        decrypt(session.user.password),
        alias
      );
  }

  const domain = await Domains.findOne({
    id: session.user.domain_id,
    plan: { $in: ['enhanced_protection', 'team'] }
  })
    .populate(
      'members.user',
      `id plan email group ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpBaselineDaily} ${config.userFields.smtpBaselineAt} ${config.userFields.smtpBaselineHourly} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
    )
    .select('+tokens +tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .exec();

  if (!domain)
    throw new Error(
      'Domain does not exist with current TXT verification record'
    );

  // validate domain
  validateDomain(domain, session.user.domain_name);

  //
  // NOTE: this is only applicable to SMTP servers (outbound mail)
  //       we allow users to use a generated token for the domain
  //
  if (!isValid && Array.isArray(domain.tokens) && domain.tokens.length > 0)
    isValid = await isValidPassword(
      domain.tokens,
      decrypt(session.user.password),
      domain
    );

  if (!isValid)
    throw new SMTPError(
      `Invalid password, please try again or go to ${
        config.urls.web
      }/my-account/domains/${punycode.toASCII(
        session.user.domain_name
      )}/aliases and click "Generate Password"`,
      {
        responseCode: 535
        // ignoreHook: true
      }
    );

  //
  // TODO: should we use `is_smtp_suspended` here instead (it's not consistent everywhere right now)
  //
  // NOTE: if the domain is suspended then the state is "pending" not queued
  //
  if (_.isDate(domain.smtp_suspended_sent_at))
    throw new SMTPError(
      `Domain is suspended from outbound SMTP access, contact us at ${config.supportEmail}`
    );

  //
  // Per-alias SMTP suspension check
  // Also check catch-all alias (name='*') when alias is null (domain-wide token auth)
  //
  if (alias && _.isDate(alias.smtp_suspended_sent_at))
    throw new SMTPError(
      `Alias is suspended from outbound SMTP access, contact us at ${config.supportEmail}`
    );

  if (!alias && domain) {
    // Check if the catch-all alias is suspended
    const catchAllAlias = await Aliases.findOne({
      domain: domain._id,
      name: '*'
    })
      .select('smtp_suspended_sent_at')
      .lean()
      .exec();
    if (catchAllAlias && _.isDate(catchAllAlias.smtp_suspended_sent_at))
      throw new SMTPError(
        `Alias is suspended from outbound SMTP access, contact us at ${config.supportEmail}`
      );
  }

  if (!domain.has_smtp) {
    //
    // Attempt auto-approval: if DNS records are verified and the user
    // meets auto-approval criteria (e.g. passed KYC), approve on the fly.
    // This mirrors the logic from the "Verify SMTP" button flow.
    //
    try {
      // Determine the sending user's ID for auto-approval lookup.
      // If the user authenticated via alias, use the populated alias.user.id.
      // If via domain catch-all, use session.user.alias_user_id (set by on-auth).
      // As a last resort, find the first admin member of the domain.
      let sendingUserId;
      if (alias) {
        sendingUserId = alias.user?.id || alias.user?._id?.toString();
      } else if (session.user.alias_user_id) {
        sendingUserId = session.user.alias_user_id;
      } else {
        // Catch-all without alias_user_id: find an admin member
        const adminMember = domain.members.find(
          (m) => _.isObject(m.user) && m.group === 'admin'
        );
        if (adminMember) sendingUserId = adminMember.user.id;
      }

      if (sendingUserId) {
        const { isAutoApproved } = await checkAndAutoApproveSMTP({
          domain,
          resolver: this.resolver,
          userId: sendingUserId
        });

        if (isAutoApproved) {
          // Domain was approved – continue with sending
          logger.info('SMTP auto-approved domain', {
            domain: domain.name,
            userId: sendingUserId
          });
        }
      }
    } catch (err) {
      // Log but do not throw – fall through to the existing error messages
      logger.error(err, { domain: domain.name });
    }

    // Re-check after auto-approval attempt
    if (!domain.has_smtp) {
      if (_.isDate(domain.smtp_verified_at))
        throw new SMTPError(
          `Domain is pending admin approval for outbound SMTP access. Approval typically takes less than 24 hours; please check your inbox soon as we may be requesting additional information`,
          {
            responseCode: 535,
            ignoreHook: true
          }
        );

      throw new SMTPError(
        `Domain is not configured for outbound SMTP, go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domain.name
        )}/verify-smtp and click "Verify"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );
    }
  }

  // TODO: document storage of outbound SMTP email in FAQ/Privacy
  //       (it will be retained for 30d after + enable 30d expiry)
  // TODO: document suspension process in Terms of Use
  //       (e.g. after 30d unpaid access, API access restrictions, etc)
  // TODO: suspend domains with has_smtp that have past due balance

  // prepare envelope
  const envelope = {};

  if (isEmail(session?.envelope?.mailFrom?.address))
    envelope.from = session.envelope.mailFrom.address;

  //
  // only our own domain may use an envelope MAIL FROM on our own domain
  // (it is not SRS-rewritten in `process-email`, and `support@` skips the
  // outbound phishing/virus scan in `Emails.queue`)
  //
  if (
    envelope.from &&
    punycode.toASCII(domain.name).toLowerCase() !==
      config.webHost.toLowerCase() &&
    punycode
      .toASCII(envelope.from)
      .toLowerCase()
      .endsWith(`@${config.webHost.toLowerCase()}`)
  )
    throw new SMTPError(
      `Envelope MAIL FROM of ${envelope.from} is not allowed, use an address on ${domain.name}`,
      { responseCode: 550, ignoreHook: true }
    );

  // TODO: envelope FROM needs to match From address of sending domain

  if (
    Array.isArray(session?.envelope?.rcptTo) &&
    session.envelope.rcptTo.length > 0
  ) {
    const to = [];
    for (const rcpt of session.envelope.rcptTo) {
      if (isEmail(rcpt.address)) to.push(rcpt);
    }

    if (to.length > 0) envelope.to = to;
  }

  let user;
  if (alias) {
    if (!alias.user) throw new TypeError('Alias user does not exist');
    user = alias.user;
  } else {
    //
    // NOTE: if no alias was found then we can assume it's a domain catch-all password
    //       so we will assign the user to be either the user that generated the token
    //       or if that user no longer an admin of the domain then we'll email admins
    //       (and leave it up to them if they want to purge it, but at least we will re-assign)
    //
    //       this also yields us the opportunity to validate that the in-memory password is still valid
    //
    let isValid = false;
    let tokenUsed;
    if (Array.isArray(domain.tokens) && domain.tokens.length > 0) {
      for (const token of domain.tokens) {
        isValid = await isValidPassword(
          [token],
          decrypt(session.user.password),
          domain
        );
        if (isValid) {
          tokenUsed = token;
          break; // break out early if we found one that is valid
        }
      }
    }

    if (!isValid)
      throw new SMTPError(
        `Invalid password, please try again or go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domain.name
        )}/aliases and click "Generate Password"`,
        {
          responseCode: 535
          // ignoreHook: true
        }
      );

    // now that we have `tokenUsed` we can perform a lookup on `tokenUsed.user`
    user = await Users.findById(tokenUsed.user)
      .select(
        `id email plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpBaselineDaily} ${config.userFields.smtpBaselineAt} ${config.userFields.smtpBaselineHourly} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
      )
      .lean()
      .exec();

    let reassign = false; // should we re-assign token and alert admins (?)

    // if user exists then ensure they are not banned and still an admin of domain
    if (user) {
      // user must not be banned
      if (user[config.userFields.isBanned]) reassign = true;
      // alias must still be an admin
      else if (
        !domain.members.some(
          (m) => m.user && m.user.id === user.id && m.group === 'admin'
        )
      )
        reassign = true;
      // system admins cannot send from customer domains (e.g. a password a
      // system admin generated while helping a customer)
      else if (
        user.group === 'admin' &&
        domain.members.some(
          (m) =>
            m.group === 'admin' &&
            m.user &&
            !m.user[config.userFields.isBanned] &&
            m.user.group !== 'admin'
        )
      )
        reassign = true;
    } else {
      reassign = true;
    }

    //
    // if we need to reassign then find first admin that is not banned
    // reassign the token to the first admin found
    // alert admins of the token reassignment (if user then share email otherwise don't)
    //
    if (reassign) {
      // (the customer rather than a system admin, if the domain has one)
      const admins = domain.members.filter(
        (m) =>
          m.group === 'admin' && m.user && !m.user[config.userFields.isBanned]
      );
      const admin = admins.find((m) => m.user.group !== 'admin') || admins[0];
      // if no admin exists then purge token as a safeguard and alert system admins
      if (admin) {
        const token = domain.tokens.id(tokenUsed._id);
        token.user = admin.user._id;
        domain.skip_verification = true;
        domain.skip_payment_check = true;
        // Set audit metadata for system-initiated token reassignment
        domain.__audit_metadata = {
          isSystem: true
        };
        await domain.save();
        const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
          domain
        );
        // email the admins of the domain
        emailHelper({
          template: 'alert',
          message: {
            to,
            locale,
            subject: 'Domain catch-all generated password re-assigned'
          },
          locals: {
            locale,
            message: `Domain catch-all generated password has been re-assigned from ${
              user ? user.email : '<unknown user>'
            } to ${
              admin.user.email
            } since the user no longer existed, is no longer an admin of the domain, or is a system administrator.`
          }
        })
          .then()
          .catch((err) =>
            logger.fatal(err, { session, resolver: this.resolver })
          );

        //
        // reassign user to the admin
        // (after we send email to keep preservation of variables for message/subject)
        // (`admin` is the domain member, `admin.user` is the populated user)
        //
        user = admin.user;
      } else {
        domain.tokens.id(tokenUsed._id).remove();
        domain.skip_verification = true;
        domain.skip_payment_check = true;
        // Set audit metadata for system-initiated token removal
        domain.__audit_metadata = {
          isSystem: true
        };
        await domain.save();
        // alert admins of the edge case
        const err = new TypeError(
          `Domain name ${domain.name} (ID ${domain.id}) was using a catch-all alias that no longer has a valid admin/user assigned and SMTP onData attempted`
        );
        logger.error(err, { session, resolver: this.resolver });
        // throw an error that password is not valid
        throw new SMTPError('Catch-all password no longer exists', {
          responseCode: 535
        });
      }
    }
  }

  // if for any reason there isn't a user then throw an error
  if (!user) throw new TypeError('User does not exist');

  //
  // Per-alias SMTP rate limiting check
  // If alias has a custom smtp_limit > 0, check daily count against it.
  //
  // NOTE: Alias sends also count toward the domain's overall SMTP limit.
  // The domain-level rate limiting (in Emails model pre-save/post-save hooks)
  // uses getDomainSmtpLimitAsync to find the HIGHEST threshold among ALL
  // admin members of the domain. Every email queued here will also be checked
  // against and deducted from the domain's quota.
  // The per-alias limit is an additional, more restrictive check.
  //
  // NOTE: For catch-all aliases (name='*'), the alias is loaded from the DB
  //       via session.user.alias_id if the user authenticated with an alias-
  //       specific password. If they used a domain-wide catch-all token,
  //       alias will be null and we look up the '*' alias below.
  //
  let rateLimitAlias = alias;
  // (undoes counting this message toward the alias's limit if it ends up not
  // queued)
  let releaseAlias = () => {};
  if (!rateLimitAlias && domain) {
    // Catch-all: look up the '*' alias for this domain to apply its smtp_limit
    rateLimitAlias = await Aliases.findOne({
      domain: domain._id,
      name: '*'
    })
      .select('_id name smtp_limit smtp_suspended_sent_at user')
      .lean()
      .exec();
  }

  if (rateLimitAlias && rateLimitAlias.smtp_limit > 0) {
    // (one time for the count and the reservation's day)
    const aliasNow = new Date();
    const startOfDay = getSmtpDayStart(aliasNow);
    // For catch-all aliases, emails may not have alias field set (catchall=true),
    // so we count by both alias._id and by domain with no alias set
    const aliasCountQuery =
      rateLimitAlias.name === '*'
        ? {
            domain: domain._id,
            $or: [
              { alias: rateLimitAlias._id },
              { alias: { $exists: false } },
              { alias: null }
            ],
            // (bounces and auto-replies do not count)
            is_bounce: { $ne: true },
            created_at: { $gte: startOfDay }
          }
        : {
            alias: rateLimitAlias._id,
            is_bounce: { $ne: true },
            created_at: { $gte: startOfDay }
          };
    const aliasEmailCount = await Emails.countDocuments(aliasCountQuery);
    // (reserved atomically, so concurrent sessions cannot pass the limit)
    try {
      releaseAlias = await reserveAliasMessage({
        client: this.client,
        alias: rateLimitAlias,
        count: aliasEmailCount,
        now: aliasNow
      });
    } catch (err) {
      // Fire-and-forget rate limit alert (deduplicated via Redis)
      if (this.client) {
        const alertKey = `${config.smtpLimitNamespace}:rate_alert:alias:${rateLimitAlias._id}`;
        this.client
          .set(alertKey, '1', 'PX', config.smtpRateLimitAlertTTL, 'NX')
          .then((wasSet) => {
            if (wasSet !== 'OK') return;
            return Domains.getToAndMajorityLocaleByDomain(domain).then(
              ({ to, locale }) =>
                emailHelper({
                  template: 'alert',
                  message: {
                    to,
                    bcc: config.alertsEmail,
                    locale,
                    subject: i18n.translate('SMTP_RATE_LIMIT_EXCEEDED', locale)
                  },
                  locals: {
                    locale,
                    message: i18n.translate('SMTP_RATE_LIMIT_EXCEEDED', locale)
                  }
                })
            );
          })
          .catch((err) => logger.fatal(err));
      }

      // return 421 error code (temporary failure, try again later)
      throw err;
    }
  }

  // (undoes counting this message's recipients if it ends up not queued)
  let releaseRecipients = releaseAlias;

  //
  // Daily thresholds (see helpers/get-smtp-sending-limits.js):
  // the account-wide threshold (all mail from every domain of the account),
  // the sender's own count, and the domain's ramp-up within the account's
  // threshold; whichever is hit first triggers a 421 rejection.
  // System admins cannot send from customer domains (550), and domains whose
  // admins are all system admins are exempt.
  //
  try {
    // (one time for the counts and the reservations, see `checkSmtpVelocity`)
    const now = new Date();
    const limits = await enforceSmtpSendingLimits({
      user,
      domain,
      Users,
      Domains,
      Emails,
      client: this.client,
      now
    });

    if (!limits.isExempt) {
      // slow down unusual sending patterns (regardless of threshold)
      const releaseVelocity = await checkSmtpVelocity({
        user,
        domain,
        dailyLimit: limits.userLimit,
        todayCount: limits.userCount,
        domainLimit: limits.domainLimit,
        domainCount: limits.domainCount,
        accountId: limits.accountId,
        accountLimit: limits.accountLimit,
        accountCount: limits.accountCount,
        date,
        recipients: Array.isArray(session?.envelope?.rcptTo)
          ? session.envelope.rcptTo.length
          : 1,
        to: session?.envelope?.rcptTo,
        Emails,
        Users,
        client: this.client,
        now
      });
      releaseRecipients = () => {
        releaseAlias();
        releaseVelocity();
      };
    }
  } catch (err) {
    // (a message refused here does not count toward the alias's limit)
    releaseAlias();
    throw err;
  }

  // (counted toward the account's bandwidth limit, refused once it is used up)
  const { allowed } = await checkBandwidth(this.client, {
    userId: user?.id || user?._id?.toString(),
    service: 'smtp_upload',
    bytes: headers.build().length + body.length
  });
  if (!allowed) {
    releaseRecipients();
    throw new SMTPError(
      getBandwidthLimitMessage(
        user?.[config.lastLocaleField] || i18n.config.defaultLocale
      ),
      { responseCode: 452, ignoreHook: true }
    );
  }

  // queue the email
  let email;
  let isQueued = false;
  try {
    //
    // normalize/map DSN object similar to one provided via API
    //
    const dsn = {};
    if (isSANB(session.envelope?.dsn?.envid))
      dsn.id = session.envelope.dsn.envid;
    if (isSANB(session.envelope?.dsn?.ret)) {
      if (session.envelope.dsn.ret === 'FULL') dsn.return = 'full';
      else if (session.envelope.dsn.ret === 'HDRS') dsn.return = 'headers';
    }

    //
    // RFC 8689 Section 5: Parse TLS-Required header
    //
    const raw = Buffer.concat([headers.build(), body]);
    const { tlsOptional } = parseTLSRequiredHeader(raw);

    email = await Emails.queue({
      message: {
        envelope,
        raw
      },
      alias,
      domain,
      user,
      date,
      catchall: typeof session?.user?.alias_id !== 'string',
      isPending: true,
      rateLimitChecked: true,
      rcptTo: session.envelope.rcptTo,
      dsn,
      requireTLS: session.envelope.requireTLS,
      tlsOptional
    });

    // (the message exists now, so it counts even if queueing it fails below)
    isQueued = true;

    if (!_.isDate(domain.smtp_suspended_sent_at)) {
      email.status = 'queued';
      await email.save();
    }
  } catch (err) {
    logger.fatal(err, { session, resolver: this.resolver });
    if (!err.emailAlreadyExists) throw err;
  } finally {
    // recipients of a message that was not queued do not count
    if (!isQueued) releaseRecipients();
  }

  if (email)
    logger.debug('email created', {
      session: {
        ...session,
        ...createSession(email)
      },
      user: email.user,
      email: email._id,
      domains: [email.domain],
      ignore_hook: false
    });
}

module.exports = onDataSMTP;
