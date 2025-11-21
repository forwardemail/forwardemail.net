/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');

const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');
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
const { decrypt } = require('#helpers/encrypt-decrypt');

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
        `id ${config.userFields.isBanned} ${config.userFields.smtpLimit} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
      )
      .select('+tokens.hash +tokens.salt')
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
      `id plan email ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.smtpLimit} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
    )
    .select('+tokens +tokens.hash +tokens.salt')
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

  // TODO: document storage of outbound SMTP email in FAQ/Privacy
  //       (it will be retained for 30d after + enable 30d expiry)
  // TODO: document suspension process in Terms of Use
  //       (e.g. after 30d unpaid access, API access restrictions, etc)
  // TODO: suspend domains with has_smtp that have past due balance

  // prepare envelope
  const envelope = {};

  if (isEmail(session?.envelope?.mailFrom?.address))
    envelope.from = session.envelope.mailFrom.address;

  // TODO: prevent users from using "return@forwardemail.net" in FROM address
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
        `id email ${config.userFields.isBanned} ${config.userFields.smtpLimit} smtp_rate_limit_sent_at ${config.userFields.fullEmail} ${config.lastLocaleField}`
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
    } else {
      reassign = true;
    }

    //
    // if we need to reassign then find first admin that is not banned
    // reassign the token to the first admin found
    // alert admins of the token reassignment (if user then share email otherwise don't)
    //
    if (reassign) {
      const admin = domain.members.find(
        (m) =>
          m.group === 'admin' && m.user && !m.user[config.userFields.isBanned]
      );
      // if no admin exists then purge token as a safeguard and alert system admins
      if (admin) {
        const token = domain.tokens.id(tokenUsed._id);
        token.user = admin.user._id;
        domain.skip_verification = true;
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
              admin.email
            } since the user no longer existed or is no longer an admin of the domain.`
          }
        })
          .then()
          .catch((err) =>
            logger.fatal(err, { session, resolver: this.resolver })
          );

        //
        // reassign user to the admin
        // (after we send email to keep preservation of variables for message/subject)
        //
        user = admin;
      } else {
        domain.tokens.id(tokenUsed._id).remove();
        domain.skip_verification = true;
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

  // queue the email
  let email;
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

    email = await Emails.queue({
      message: {
        envelope,
        raw: Buffer.concat([headers.build(), body])
      },
      alias,
      domain,
      user,
      date,
      catchall: typeof session?.user?.alias_id !== 'string',
      isPending: true,
      rcptTo: session.envelope.rcptTo,
      dsn
    });

    if (!_.isDate(domain.smtp_suspended_sent_at)) {
      email.status = 'queued';
      await email.save();
    }
  } catch (err) {
    logger.fatal(err, { session, resolver: this.resolver });
    if (!err.emailAlreadyExists) throw err;
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
