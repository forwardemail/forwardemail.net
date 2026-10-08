/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const pickOriginal = require('@ladjs/pick-original');

const Aliases = require('#models/aliases');
const Emails = require('#models/emails');
const _ = require('#helpers/lodash');
const config = require('#config');
const { getSmtpDayStart } = require('#helpers/get-smtp-day');
const createSession = require('#helpers/create-session');
const getCatchallTokenUser = require('#helpers/get-catchall-token-user');
const validateDomain = require('#helpers/validate-domain');
const { decrypt } = require('#helpers/encrypt-decrypt');
const getNodemailerMessageFromRequest = require('#helpers/get-nodemailer-message-from-request');
const smtpCodeToHttpError = require('#helpers/smtp-code-to-http-error');
const toObject = require('#helpers/to-object');
const {
  getSenderSmtpLimitAsync,
  getUserSmtpLimitAcrossDomainsAsync
} = require('#helpers/get-domain-smtp-limit');
const {
  getSmtpEffectiveLimit,
  getSmtpSendingLimits
} = require('#helpers/get-smtp-sending-limits');
const { Domains, Users } = require('#models');

const REJECTED_ERROR_KEYS = [
  'recipient',
  'responseCode',
  'response',
  'message'
];

function json(email, isList = false) {
  const object = toObject(Emails, email);

  //
  // NOTE: we always rewrite rejectedErrors
  //       since we don't want to show code bugs
  //       to user via API response
  //
  delete object.rejectedErrors;

  // only admins need this info
  delete object.blocked_hashes;
  delete object.has_blocked_hashes;

  if (isList) {
    delete object.message;
    delete object.headers;
  } else {
    //
    // instead we render it similarly as we do in My Account > Emails
    // (and we only render these fields to the user)
    //
    // - recipient
    // - responseCode
    // - response
    // - message
    //
    // (not the full error object which contains stack trace etc.)
    //
    object.rejectedErrors = email.rejectedErrors.map((err) => {
      const error = {};
      for (const key of REJECTED_ERROR_KEYS) {
        if (typeof err[key] !== 'undefined') error[key] = err[key];
      }

      return error;
    });
  }

  //
  // safeguard to always add `rejectedErrors` since
  // we have it listed in omitExtraFields in emails model
  // (we never want to accidentally render it to a user)
  //
  const keys = _.isFunction(email.toObject) ? email.toObject() : email;
  if (!isList) keys.rejectedErrors = object.rejectedErrors;

  return {
    ...pickOriginal(object, keys),
    // add a helper url
    link: `${config.urls.web}/my-account/emails/${email.id}`
  };
}

async function list(ctx) {
  ctx.body = ctx.state.emails.map((email) => json(email, true));
}

async function retrieve(ctx) {
  const body = json(ctx.state.email);
  // we want to return the `message` property
  body.message = await Emails.getMessage(ctx.state.email.message, true);
  ctx.body = body;
}

async function limit(ctx) {
  const isAliasAuth = Boolean(ctx.state?.session?.db);
  const startOfDay = getSmtpDayStart();

  if (isAliasAuth) {
    // Alias auth: ctx.state.user has alias_id, alias_user_id, domain_id
    const [aliasDoc, user, domain] = await Promise.all([
      Aliases.findById(ctx.state.user.alias_id)
        .select('_id name smtp_limit domain user')
        .lean()
        .exec(),
      Users.findById(ctx.state.user.alias_user_id)
        .select(
          `id plan group ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
        .lean()
        .exec(),
      Domains.findById(ctx.state.user.domain_id)
        .populate(
          'members.user',
          `id plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
        .select('id plan members smtp_daily_counts smtp_daily_counts_at')
        .lean()
        .exec()
    ]);
    if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

    // Per-alias limit takes priority if set
    if (aliasDoc && aliasDoc.smtp_limit > 0) {
      const aliasCountQuery =
        aliasDoc.name === '*'
          ? {
              domain: aliasDoc.domain,
              $or: [
                { alias: aliasDoc._id },
                { alias: { $exists: false } },
                { alias: null }
              ],
              is_bounce: { $ne: true },
              created_at: { $gte: startOfDay }
            }
          : {
              alias: aliasDoc._id,
              is_bounce: { $ne: true },
              created_at: { $gte: startOfDay }
            };
      const count = await Emails.countDocuments(aliasCountQuery);
      ctx.body = { count, limit: aliasDoc.smtp_limit };
      return;
    }

    // what is enforced when sending from this domain: the sender's threshold,
    // and what is left of the domain's and the account's
    // (see `helpers/get-smtp-sending-limits.js`)
    if (domain) {
      const limits = await getSmtpSendingLimits({
        user,
        domain,
        Users,
        Domains,
        Emails,
        // (so a domain's history is computed once, under the same lock)
        client: ctx.client
      });
      if (limits.isBlocked) {
        ctx.body = { count: 0, limit: 0 };
        return;
      }

      if (!limits.isExempt) {
        ctx.body = {
          count: limits.userCount,
          limit: getSmtpEffectiveLimit(limits)
        };
        return;
      }
    }

    // Domain-wide limit (team plan: highest admin threshold; otherwise: user's threshold)
    const max = await getSenderSmtpLimitAsync(domain, user, Users);

    // Count is per-user (prevents bypass via alias/domain deletion)
    const count = await Emails.countDocuments({
      user: user._id,
      is_bounce: { $ne: true },
      created_at: { $gte: startOfDay }
    });
    ctx.body = { count, limit: max };
    return;
  }

  // Standard user auth
  // (the user's own threshold, or the highest threshold of a Team plan domain
  // they are a member of, the same as enforced when sending)
  const max = await getUserSmtpLimitAcrossDomainsAsync(
    ctx.state.user,
    Domains,
    Users
  );

  const count = await Emails.countDocuments({
    user: ctx.state.user._id,
    is_bounce: { $ne: true },
    created_at: { $gte: startOfDay }
  });
  ctx.body = { count, limit: max };
}

//
// Queue an email sent with a domain-wide catch-all password (a send-only
// login, see `helpers/on-auth.js`). This follows the SMTP catch-all path in
// `helpers/on-data-smtp.js`: the password must still be valid, it sends as
// the admin who generated it, and the From address can be any address on the
// domain. Limits are checked by the `Emails` pre-save hook, against the
// catch-all ('*') alias the same as over SMTP.
//
async function queueCatchallEmail(ctx, message) {
  const { user: sessionUser } = ctx.state;
  const domain = await Domains.findOne({
    id: sessionUser.domain_id,
    plan: { $in: ['enhanced_protection', 'team'] }
  })
    .populate(
      'members.user',
      // (what `validateDomain` and `getCatchallTokenUser` read)
      `id email plan group ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} ${config.userFields.fullEmail} ${config.lastLocaleField}`
    )
    .select('+tokens +tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .exec();

  if (!domain)
    throw Boom.unauthorized(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  validateDomain(domain, sessionUser.domain_name);

  // (also checks the password is still one of the domain's catch-all passwords)
  const user = await getCatchallTokenUser(
    domain,
    decrypt(sessionUser.password),
    { session: ctx.state.session }
  );
  if (!user) throw Boom.unauthorized(ctx.translateError('INVALID_USER'));

  const catchAllAlias = await Aliases.findOne({
    domain: domain._id,
    name: '*'
  })
    .select('smtp_suspended_sent_at')
    .lean()
    .exec();
  if (catchAllAlias && _.isDate(catchAllAlias.smtp_suspended_sent_at))
    throw Boom.forbidden(
      `Alias is suspended from outbound SMTP access, contact us at ${config.supportEmail}`
    );

  return Emails.queue(
    {
      message,
      domain: domain._id,
      user,
      catchall: true,
      dsn: message?.dsn
    },
    sessionUser.locale
  );
}

async function create(ctx) {
  try {
    if (!_.isPlainObject(ctx.request.body))
      throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));

    // TODO: rewrite this similar to /v1/messages where we use MailComposer
    // this will throw any errors if necessary
    const message = getNodemailerMessageFromRequest(ctx);

    //
    // ctx.request.files
    // - attachment[]
    // - attachments[]
    //
    if (_.isObject(ctx.request.files)) {
      if (!_.isArray(message.attachments)) message.attachments = [];

      const multerAttachments = [];

      if (
        _.isArray(ctx.request.files.attachment) &&
        ctx.request.files.attachment.length > 0
      ) {
        multerAttachments.push(...ctx.request.files.attachment);
        delete ctx.request.files.attachment; // cleanup
      }

      if (
        _.isArray(ctx.request.files.attachments) &&
        ctx.request.files.attachments.length > 0
      ) {
        multerAttachments.push(...ctx.request.files.attachments);
        delete ctx.request.files.attachments; // cleanup
      }

      if (multerAttachments.length > 0)
        message.attachments.push(
          ...multerAttachments.map((file) => {
            return {
              filename: file.originalname,
              content: file.buffer.toString('base64'), // Convert buffer to Base64 string
              encoding: 'base64', // Crucially, specify the encoding for Nodemailer
              contentType: file.mimetype
            };
          })
        );
    }

    // queue the email
    let email;

    try {
      if (ctx.state?.user?.catchall_send_only) {
        email = await queueCatchallEmail(ctx, message);
      } else if (ctx.state?.session?.db) {
        email = await Emails.queue(
          {
            message,
            // (as an object, so the alias itself is sent as, and its limit
            // applies, see `Emails.queue`)
            alias: ctx.state.user.alias_id
              ? { _id: ctx.state.user.alias_id }
              : undefined,
            domain: ctx.state.user.domain_id,
            user: ctx.state.user.alias_user_id
          },
          ctx.state.user.locale
        );
      } else {
        email = await Emails.queue(
          { message, user: ctx.state.user, dsn: message?.dsn },
          ctx.locale
        );
      }
    } catch (err) {
      if (err.code === 'ERR_UNKNOWN_ENCODING')
        throw Boom.badRequest(err.message);
      // map SMTP response codes to proper HTTP status codes
      // (e.g. 421 rate limit -> 429, 550 -> 400, 552 -> 413)
      throw smtpCodeToHttpError(err);
    }

    ctx.logger.debug('email created', {
      session: createSession(email),
      user: email.user,
      email: email._id,
      domains: [email.domain],
      ignore_hook: false
    });

    // we want to return the `message` property
    const body = json(email);
    body.message = await Emails.getMessage(email.message, true);
    ctx.body = body;
  } catch (err) {
    ctx.logger.error(err);
    throw err;
  }
}

module.exports = { list, retrieve, create, limit };
