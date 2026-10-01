/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const { boolean } = require('boolean');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const config = require('#config');
const { getSmtpDayEnd, getSmtpDayStart } = require('#helpers/get-smtp-day');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const {
  getSenderSmtpLimitAsync,
  getUserSmtpLimitAcrossDomainsAsync
} = require('#helpers/get-domain-smtp-limit');
const {
  getSmtpEffectiveLimit,
  getSmtpSendingLimits
} = require('#helpers/get-smtp-sending-limits');
const getSmtpReputationSummary = require('#helpers/get-smtp-reputation-summary');

const { canSendSmtp } = getSmtpReputationSummary;
const getAllowedSort = require('#helpers/get-allowed-sort');
const { Domains, Emails, Aliases, Users } = require('#models');

// Cap count at 10,000 like list-logs to improve performance
const MAX_COUNT_LIMIT = 10_000;
const EMAIL_SORT_FIELDS = new Set([
  'id',
  'created_at',
  'date',
  'status',
  'subject'
]);

async function listEmails(ctx, next) {
  const isAliasAuth = Boolean(ctx.state?.session?.db);
  let domains = [];
  let aliases = [];
  let count = 0;

  if (isAliasAuth) {
    const alias = await Aliases.findById(ctx.state.user.alias_id)
      .populate(
        'user',
        `id email plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
      )
      .populate({
        path: 'domain',
        select:
          'id name plan max_quota_per_alias has_smtp has_dkim_record has_return_path_record has_dmarc_record is_global members smtp_daily_counts smtp_daily_counts_at',
        populate: {
          path: 'members.user',
          select: `id plan ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        }
      })
      .lean()
      .exec();

    if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));
    if (!alias.domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
    if (!alias.user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

    const startOfDay = getSmtpDayStart();

    // Per-alias limit takes priority if set
    if (alias.smtp_limit > 0) {
      const aliasCountQuery =
        alias.name === '*'
          ? {
              domain: alias.domain._id,
              $or: [
                { alias: alias._id },
                { alias: { $exists: false } },
                { alias: null }
              ],
              is_bounce: { $ne: true },
              created_at: { $gte: startOfDay }
            }
          : {
              alias: alias._id,
              is_bounce: { $ne: true },
              created_at: { $gte: startOfDay }
            };
      count = await Emails.countDocuments(aliasCountQuery);
      ctx.state.dailySMTPLimit = alias.smtp_limit;
    } else {
      // what is enforced when sending from this domain: the sender's
      // threshold, and what is left of the domain's and the account's
      // (see `helpers/get-smtp-sending-limits.js`)
      const limits = await getSmtpSendingLimits({
        user: alias.user,
        domain: alias.domain,
        Users,
        Domains,
        Emails,
        // (so a domain's history is computed once, under the same lock)
        client: ctx.client
      });
      // (otherwise team plan: highest admin threshold, or the user's own)
      const max = limits.isBlocked
        ? 0
        : limits.isExempt
        ? await getSenderSmtpLimitAsync(alias.domain, alias.user, Users)
        : getSmtpEffectiveLimit(limits);
      count = await Emails.countDocuments({
        user: alias.user._id,
        is_bounce: { $ne: true },
        created_at: { $gte: startOfDay }
      });
      ctx.state.dailySMTPLimit = max;
    }

    ctx.state.dailySMTPMessages = count;
    ctx.state.dailySMTPResetAt = getSmtpDayEnd();
    ctx.state.domains = [alias.domain];
    ctx.state.domain = alias.domain;

    domains = [alias.domain._id];
    aliases = [alias._id];
  } else {
    // user must be domain admin or alias owner of the email
    const startOfDay = getSmtpDayStart();
    const [userDomains, userAliases, userCount, max] = await Promise.all([
      Domains.distinct('_id', {
        members: {
          $elemMatch: {
            user: ctx.state.user._id,
            group: 'admin'
          }
        }
      }),
      Aliases.distinct('_id', {
        user: ctx.state.user._id
      }),
      Emails.countDocuments({
        user: ctx.state.user._id,
        is_bounce: { $ne: true },
        created_at: { $gte: startOfDay }
      }),
      // (the same as `/v1/emails/limit`)
      getUserSmtpLimitAcrossDomainsAsync(ctx.state.user, Domains, Users)
    ]);

    domains = userDomains;
    aliases = userAliases;
    count = userCount;

    ctx.state.dailySMTPLimit = max;
    ctx.state.dailySMTPMessages = count;
    ctx.state.dailySMTPResetAt = getSmtpDayEnd();

    // outbound SMTP reputation (full page only, not table refreshes)
    if (!ctx.api && ctx.accepts('html') && (await canSendSmtp(ctx.state.user)))
      ctx.state.smtpReputation = await getSmtpReputationSummary(ctx.state.user);
  }

  // TODO: status filter

  // Ensure user has at least one alias or domain to prevent empty queries
  if (aliases.length === 0 && domains.length === 0) {
    ctx.state.emails = [];
    ctx.state.itemCount = 0;
    ctx.state.pageCount = 0;
    ctx.state.pages = [];
    setPaginationHeaders(ctx, 0, ctx.query.page, 0, 0);
    if (ctx.api) return next();
    if (ctx.accepts('html')) return ctx.render('my-account/emails');
    const table = await ctx.render('my-account/emails/_table');
    ctx.body = { table };
    return;
  }

  let query = isAliasAuth
    ? {
        alias: { $in: aliases }
      }
    : {
        $or: [
          {
            alias: { $in: aliases }
          },
          {
            domain: { $in: domains }
          }
        ]
      };

  // find matching domain otherwise error if does not have access or suspended
  if (isSANB(ctx.query.domain)) {
    if (!isFQDN(ctx.query.domain))
      throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

    const domain = ctx.state.domains.find(
      (d) => d.name === ctx.query.domain && !d.is_global
    );

    if (!domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    // domain must be on paid plan
    if (domain.plan === 'free')
      throw Boom.paymentRequired(
        ctx.translateError(
          'PLAN_UPGRADE_REQUIRED',
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.state.domain.name
            )}/billing?plan=enhanced_protection`
          )
        )
      );

    // if domain has not yet been setup yet then alert user
    if (
      !ctx.api &&
      (!domain.has_dkim_record ||
        !domain.has_return_path_record ||
        !domain.has_dmarc_record)
    ) {
      ctx.flash(
        'warning',
        ctx.translate(
          'EMAIL_SMTP_CONFIGURATION_REQUIRED',
          domain.name,
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(domain.name)}/verify-smtp`
          )
        )
      );

      const redirectTo = ctx.state.l(
        `/my-account/domains/${punycode.toASCII(domain.name)}/advanced-settings`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    }

    // domain must be enabled
    if (!domain.has_smtp)
      throw Boom.badRequest(ctx.translateError('EMAIL_SMTP_ACCESS_REQUIRED'));

    // Filter by domain AND user's aliases/domains (for proper access control)
    query = {
      $and: [
        {
          domain: domain._id
        },
        {
          ...query
        }
      ]
    };
  }

  // Filter by is_scheduled (Boolean) - emails with future date
  if (isSANB(ctx.query.is_scheduled)) {
    const isScheduled = boolean(ctx.query.is_scheduled);
    if (isScheduled) {
      const now = new Date();
      query.date = { $gt: now };
    }
  }

  // Only pass documented account-email fields to the database sort option.
  const sortField = getAllowedSort(
    ctx.query.sort,
    EMAIL_SORT_FIELDS,
    ctx.api ? 'created_at' : '-created_at'
  );

  // For search queries: fetch emails and do comprehensive search in memory
  if (isSANB(ctx.query.q)) {
    const searchQuery = ctx.query.q.trim();
    const searchRegex = new RegExp(_.escapeRegExp(searchQuery), 'i');

    // Use the full query (includes $or or $and with proper access control)
    const searchQueryObj = query;

    // Validate searchQueryObj is not empty
    if (!searchQueryObj || Object.keys(searchQueryObj).length === 0) {
      throw Boom.badRequest('Invalid search query');
    }

    // Fetch up to MAX_COUNT_LIMIT emails matching user's aliases/domains
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const allEmails = await Emails.find(searchQueryObj)
      .sort(sortField)
      .limit(MAX_COUNT_LIMIT)
      .select('-message')
      .lean()
      .maxTimeMS(30_000)
      .exec();

    // Filter in memory with comprehensive search
    // (permission already checked by the query above)
    const filteredEmails = allEmails.filter((email) => {
      // Comprehensive search across all fields (like original)
      // Check headers
      if (email.headers && typeof email.headers === 'object') {
        for (const [key, value] of Object.entries(email.headers)) {
          if (
            searchRegex.test(key) ||
            (typeof value === 'string' && searchRegex.test(value))
          ) {
            return true;
          }
        }
      }

      // Check envelope.from and envelope.to
      if (email.envelope) {
        if (email.envelope.from && searchRegex.test(email.envelope.from))
          return true;
        if (
          email.envelope.to &&
          (Array.isArray(email.envelope.to)
            ? email.envelope.to.some((to) => searchRegex.test(to))
            : searchRegex.test(email.envelope.to))
        )
          return true;
      }

      // Check messageId
      if (email.messageId && searchRegex.test(email.messageId)) return true;

      // Check subject
      if (email.subject && searchRegex.test(email.subject)) return true;

      // Check rejectedErrors
      if (email.rejectedErrors && Array.isArray(email.rejectedErrors)) {
        for (const error of email.rejectedErrors) {
          if (error.response && searchRegex.test(error.response)) return true;
          if (error.message && searchRegex.test(error.message)) return true;
        }
      }

      return false;
    });

    //
    // TODO: optimize this in future by instead of redirecting it renders an alert
    // (would need to modify @ladjs/assets to support swal in body of table ajax)
    //
    // Show warning if we hit the limit
    if (
      !ctx.api &&
      allEmails.length >= MAX_COUNT_LIMIT &&
      ctx.accepts('html')
    ) {
      ctx.flash(
        'warning',
        `Search results limited to ${MAX_COUNT_LIMIT.toLocaleString()} emails. For comprehensive search, please use the <a href="${ctx.state.l(
          '/email-api#tag/logs/get/v1/logs/download'
        )}" target="_blank" rel="noopener noreferrer">Logs Email API</a>.`
      );
    }

    // Remove headers/accepted/rejectedErrors for API responses
    if (ctx.api) {
      for (const email of filteredEmails) {
        delete email.headers;
        delete email.accepted;
        delete email.rejectedErrors;
      }
    }

    // Paginate the filtered results
    const startIndex = ctx.paginate.skip;
    const endIndex = startIndex + ctx.query.limit;
    const paginatedEmails = filteredEmails.slice(startIndex, endIndex);

    ctx.state.emails = paginatedEmails;
    ctx.state.itemCount = filteredEmails.length;
  } else {
    // No search: use the fast .find() approach
    const [emails, itemCount] = await Promise.all([
      // eslint-disable-next-line unicorn/no-array-callback-reference
      Emails.find(query)
        .limit(ctx.query.limit)
        .skip(ctx.paginate.skip)
        .sort(sortField)
        .select(
          ctx.api ? '-message -headers -accepted -rejectedErrors' : '-message'
        )
        .lean()
        .maxTimeMS(30_000)
        .exec(),
      // Actual count when no search query
      Emails.countDocuments(query).maxTimeMS(30_000)
    ]);

    ctx.state.emails = emails;
    ctx.state.itemCount = itemCount;
  }

  ctx.state.pageCount = Math.ceil(ctx.state.itemCount / ctx.query.limit);
  ctx.state.pages = paginate.getArrayPages(ctx)(
    6,
    ctx.state.pageCount,
    ctx.query.page
  );

  //
  // set HTTP headers for pagination
  // <https://forwardemail.net/email-api#description/pagination>
  //
  setPaginationHeaders(
    ctx,
    ctx.state.pageCount,
    ctx.query.page,
    ctx.state.emails.length,
    ctx.state.itemCount
  );

  if (ctx.api) return next();

  if (ctx.accepts('html')) return ctx.render('my-account/emails');

  const table = await ctx.render('my-account/emails/_table');
  ctx.body = { table };
}

module.exports = listEmails;
