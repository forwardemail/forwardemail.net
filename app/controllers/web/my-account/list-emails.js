/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const config = require('#config');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const { Domains, Emails, Aliases } = require('#models');

// Cap count at 10,000 like list-logs to improve performance
const MAX_COUNT_LIMIT = 10_000;

async function listEmails(ctx, next) {
  // user must be domain admin or alias owner of the email
  const [domains, aliases, count] = await Promise.all([
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
    ctx.client.zcard(`${config.smtpLimitNamespace}:${ctx.state.user.id}`)
  ]);

  ctx.state.dailySMTPLimit =
    ctx.state.user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  ctx.state.dailySMTPMessages = count;

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

  let query = {
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

    // Determine sort field
    let sortField = ctx.api ? 'created_at' : '-created_at';
    if (isSANB(ctx.query.sort)) {
      sortField = ctx.query.sort;
    }

    // Fetch up to MAX_COUNT_LIMIT emails matching user's aliases/domains
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const allEmails = await Emails.find(searchQueryObj)
      .limit(MAX_COUNT_LIMIT)
      .sort(sortField)
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
      !ctx.accepts('html')
    ) {
      ctx.flash(
        'warning',
        `Search results limited to ${MAX_COUNT_LIMIT.toLocaleString()} emails. For comprehensive search, please use the <a href="${ctx.state.l(
          '/email-api#tag/logs/get/v1/logs/download'
        )}" target="_blank" rel="noopener noreferrer">Logs Email API</a>.`
      );
      ctx.body = {
        redirectTo: ctx.href
      };
      return;
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
    let sortField = ctx.api ? 'created_at' : '-created_at';
    if (isSANB(ctx.query.sort)) {
      sortField = ctx.query.sort;
    }

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
      // Capped count with query filter (fast)
      Emails.aggregate(
        [{ $match: query }, { $limit: MAX_COUNT_LIMIT }, { $count: 'total' }],
        { maxTimeMS: 30_000 }
      )
        .exec()
        .then((result) => result[0]?.total || 0)
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
