/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('bytes');
const getStream = require('get-stream');
const safeStringify = require('fast-safe-stringify');
const { isEmail } = require('validator');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const Users = require('#models/users');
const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const createSession = require('#helpers/create-session');
const env = require('#config/env');
const logger = require('#helpers/logger');
const refineAndLogError = require('#helpers/refine-and-log-error');
const validateAlias = require('#helpers/validate-alias');
const validateDomain = require('#helpers/validate-domain');

const MAX_BYTES = bytes(env.SMTP_MESSAGE_MAX_SIZE);

//
// NOTE: we can merge SMTP/FE codebase in future and simply check if auth disabled
//       then this will act as a forwarding server only (MTA)
//
async function onData(stream, _session, fn) {
  if (this.server._closeTimeout)
    return setImmediate(() => fn(new ServerShutdownError()));

  // store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  logger.debug('DATA', { session });

  try {
    // we have to consume the stream
    const raw = await getStream.buffer(stream, {
      maxBuffer: MAX_BYTES
    });

    //
    // NOTE: we don't share the full alias and domain object
    //       in between onAuth and onData because there could
    //       be a time gap between the SMTP commands are sent
    //       (we want the most real-time information)
    //
    // ensure that user is authenticated
    if (
      typeof session.user !== 'object' ||
      typeof session.user.alias_id !== 'string' ||
      typeof session.user.domain_id !== 'string'
    )
      throw new SMTPError(config.authRequiredMessage, {
        responseCode: 530
      });

    // shorthand variables for alias and domain
    const [alias, domain] = await Promise.all([
      Aliases.findOne({ id: session.user.alias_id })
        .populate(
          'user',
          `id ${config.userFields.isBanned} ${config.userFields.smtpLimit}`
        )
        .lean()
        .exec(),
      Domains.findOne({ id: session.user.domain_id, plan: { $ne: 'free' } })
        .populate(
          'members.user',
          `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt}`
        )
        .lean()
        .exec()
    ]);

    if (!domain)
      throw new Error(
        'Domain does not exist with current TXT verification record'
      );

    // validate domain
    validateDomain(domain, session.user.domain_name);

    // alias must exist
    if (!alias) throw new Error('Alias does not exist');

    // validate alias
    validateAlias(alias, session.user.domain_name, session.user.alias_name);

    // TODO: document storage of outbound SMTP email in FAQ/Privacy
    //       (it will be retained for 30d after + enable 30d expiry)
    // TODO: document suspension process in Terms of Use
    //       (e.g. after 30d unpaid access, API access restrictions, etc)
    // TODO: suspend domains with has_smtp that have past due balance

    // prepare envelope
    const envelope = {};

    if (
      isEmail(session?.envelope?.mailFrom?.address, { ignore_max_length: true })
    )
      envelope.from = session.envelope.mailFrom.address;

    if (
      Array.isArray(session?.envelope?.rcptTo) &&
      session.envelope.rcptTo.length > 0
    ) {
      const to = [];
      for (const rcpt of session.envelope.rcptTo) {
        if (isEmail(rcpt.address, { ignore_max_length: true })) to.push(rcpt);
      }

      if (to.length > 0) envelope.to = to;
    }

    // if any of the domain admins are admins then don't rate limit
    const adminExists = await Users.exists({
      _id: {
        $in: domain.members
          .filter((m) => m.group === 'admin')
          .map((m) =>
            typeof m.user === 'object' && typeof m.user._id === 'object'
              ? m.user._id
              : m.user
          )
      },
      group: 'admin'
    });

    if (!adminExists) {
      // rate limit to X emails per day by domain id then denylist
      {
        const limit = await this.rateLimiter.get({
          id: domain.id,
          max:
            alias.user[config.userFields.smtpLimit] || config.smtpLimitMessages
        });

        // return 550 error code
        if (!limit.remaining)
          throw new SMTPError('Rate limit exceeded', { ignoreHook: true });
      }

      // rate limit to X emails per day by alias user id then denylist
      {
        const limit = await this.rateLimiter.get({
          id: alias.user.id,
          max:
            alias.user[config.userFields.smtpLimit] || config.smtpLimitMessages
        });

        // return 550 error code
        if (!limit.remaining)
          throw new SMTPError('Rate limit exceeded', { ignoreHook: true });
      }
    }

    // queue the email
    const email = await Emails.queue({
      message: {
        envelope,
        raw
      },
      alias,
      domain,
      user: alias.user,
      date: new Date(session.arrivalDate)
    });

    // TODO: implement credit system

    logger.info('email created', {
      session: {
        ...session,
        ...createSession(email)
      },
      user: email.user,
      email: email._id,
      domains: [email.domain],
      ignore_hook: false
    });

    setImmediate(fn);
  } catch (err) {
    setImmediate(() => fn(refineAndLogError(err, session)));
  }
}

module.exports = onData;
