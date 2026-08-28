/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const bytes = require('@forwardemail/bytes');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');

const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');
const { getDomainSmtpLimitAsync } = require('#helpers/get-domain-smtp-limit');
const i18n = require('#helpers/i18n');
const clearAliasQuotaCache = require('#helpers/clear-alias-quota-cache');
const { Aliases, Domains, Emails, Users } = require('#models');

async function list(ctx) {
  const domain = await Domains.findById(ctx.params.id)
    .populate('members.user', 'id email')
    .lean()
    .exec();
  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

  const query = { domain: domain._id };

  // Filter by name
  if (isSANB(ctx.query.name)) {
    query.name = { $regex: _.escapeRegExp(ctx.query.name), $options: 'i' };
  }

  // Filter by suspension status
  if (ctx.query.suspended === 'true') {
    query.smtp_suspended_sent_at = { $exists: true, $ne: null };
  }

  const [aliases, itemCount] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Aliases.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .populate('user', 'id email')
      .lean()
      .exec(),
    Aliases.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Enrich aliases with today's SMTP send count
  if (aliases.length > 0) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const aliasIds = aliases.map((a) => a._id);
    const catchAllAlias = aliases.find((a) => a.name === '*');
    const [counts, catchAllCount] = await Promise.all([
      Emails.aggregate([
        {
          $match: {
            alias: { $in: aliasIds },
            created_at: { $gte: startOfDay }
          }
        },
        { $group: { _id: '$alias', count: { $sum: 1 } } }
      ]),
      catchAllAlias
        ? Emails.countDocuments({
            domain: domain._id,
            alias: { $in: [null, undefined] },
            created_at: { $gte: startOfDay }
          })
        : Promise.resolve(0)
    ]);
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));
    for (const alias of aliases) {
      if (alias.name === '*' && catchAllAlias) {
        alias.smtp_count =
          (countMap.get(alias._id.toString()) || 0) + catchAllCount;
      } else {
        alias.smtp_count = countMap.get(alias._id.toString()) || 0;
      }
    }
  }

  if (ctx.accepts('html')) {
    return ctx.render('admin/domains/aliases/index', {
      domain,
      aliases,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/domains/aliases/_table', {
    domain,
    aliases,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });
  ctx.body = { table };
}

async function retrieve(ctx) {
  const domain = await Domains.findById(ctx.params.id)
    .populate('members.user', 'id email')
    .lean()
    .exec();
  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

  const alias = await Aliases.findOne({
    _id: ctx.params.alias_id,
    domain: domain._id
  })
    .populate('user', 'id email')
    .lean()
    .exec();
  if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

  // Set domain.group to 'admin' so the shared _form.pug shows admin-only fields
  domain.group = 'admin';

  // Get SMTP usage count for display
  // For catch-all aliases, also count emails with no alias set (domain-wide catch-all sends)
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  let smtpCount;
  if (alias.name === '*') {
    const [taggedCount, untaggedCount] = await Promise.all([
      Emails.countDocuments({
        alias: alias._id,
        created_at: { $gte: startOfDay }
      }),
      Emails.countDocuments({
        domain: domain._id,
        alias: { $in: [null, undefined] },
        created_at: { $gte: startOfDay }
      })
    ]);
    smtpCount = taggedCount + untaggedCount;
  } else {
    smtpCount = await Emails.countDocuments({
      alias: alias._id,
      created_at: { $gte: startOfDay }
    });
  }

  ctx.state.breadcrumbs = ctx.state.breadcrumbs || [];
  ctx.state.breadcrumbs.push(
    {
      name: ctx.state.t('Domains'),
      href: ctx.state.l('/admin/domains')
    },
    {
      name: domain.name,
      href: ctx.state.l(`/admin/domains/${domain._id}/aliases`)
    },
    {
      header: ctx.state.t('Edit Alias'),
      name: `${alias.name}@${domain.name}`
    }
  );

  return ctx.render('admin/domains/aliases/retrieve', {
    domain,
    alias,
    smtpCount
  });
}

async function update(ctx) {
  const domain = await Domains.findById(ctx.params.id)
    .populate('members.user', 'id email')
    .exec();
  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

  const alias = await Aliases.findOne({
    _id: ctx.params.alias_id,
    domain: domain._id
  });
  if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

  const { body } = ctx.request;

  //
  // Handle smtp_limit update with security hardening:
  // - Validate the value is a non-negative integer
  // - Changing smtp_limit does NOT clear suspension or reset daily count
  //   (daily count is derived from Emails collection, not a resettable counter)
  // - Cannot exceed the domain's effective SMTP limit
  //
  if (typeof body.smtp_limit !== 'undefined' && body.smtp_limit !== '') {
    const smtpLimit = Number.parseInt(body.smtp_limit, 10);
    if (!Number.isFinite(smtpLimit) || smtpLimit < 0) {
      throw Boom.badRequest(ctx.translateError('ALIAS_SMTP_LIMIT_INVALID'));
    }

    // Cap: alias smtp_limit cannot exceed the domain's effective SMTP limit.
    // The effective limit is the HIGHEST smtp_limit among ALL admin members
    // of the domain (since the domain benefits from the highest-tier admin).
    if (smtpLimit > 0) {
      const domainSmtpLimit = await getDomainSmtpLimitAsync(domain, Users);
      if (smtpLimit > domainSmtpLimit) {
        throw Boom.badRequest(
          ctx.translateError('ALIAS_SMTP_LIMIT_EXCEEDS_DOMAIN', domainSmtpLimit)
        );
      }
    }

    alias.smtp_limit = smtpLimit;
  } else if (body.smtp_limit === '') {
    alias.smtp_limit = 0;
  }

  //
  // Handle SMTP suspension toggle (admin-only action)
  // Only system admins (site admins) can clear suspension
  //
  const hadSMTPSuspension = _.isDate(alias.smtp_suspended_sent_at);
  if (
    typeof body.smtp_suspended_sent_at !== 'undefined' &&
    isSANB(body.smtp_suspended_sent_at)
  ) {
    alias.smtp_suspended_sent_at = boolean(body.smtp_suspended_sent_at)
      ? new Date()
      : undefined;
    alias.is_smtp_suspended = _.isDate(alias.smtp_suspended_sent_at);
  }

  //
  // Handle full alias settings update (same fields as user-facing form)
  // This allows admins to edit all alias settings from the admin panel
  //
  if (typeof body.is_enabled !== 'undefined') {
    alias.is_enabled = boolean(body.is_enabled);
  }

  if (typeof body.has_imap !== 'undefined') {
    alias.has_imap = boolean(body.has_imap);
  }

  if (typeof body.has_pgp !== 'undefined') {
    alias.has_pgp = boolean(body.has_pgp);
  }

  if (typeof body.has_smime !== 'undefined') {
    alias.has_smime = boolean(body.has_smime);
  }

  if (typeof body.has_wkd_disabled !== 'undefined') {
    alias.has_wkd_disabled = boolean(body.has_wkd_disabled);
  }

  if (typeof body.has_recipient_verification !== 'undefined') {
    alias.has_recipient_verification = boolean(body.has_recipient_verification);
  }

  if (typeof body.public_key === 'string') {
    alias.public_key = body.public_key;
  }

  if (typeof body.smime_certificate === 'string') {
    alias.smime_certificate = body.smime_certificate;
  }

  if (isSANB(body.description)) {
    alias.description = body.description.slice(0, 150);
  } else if (body.description === '') {
    alias.description = '';
  }

  if (isSANB(body.recipients)) {
    alias.recipients = body.recipients
      .split(/[\s,]+/)
      .map((r) => r.trim())
      .filter(Boolean);
  } else if (body.recipients === '') {
    alias.recipients = [];
  }

  if (isSANB(body.labels)) {
    alias.labels = body.labels
      .split(/[\s,]+/)
      .map((l) => l.trim())
      .filter(Boolean);
  } else if (typeof body.labels === 'string' && body.labels === '') {
    alias.labels = [];
  }

  if (typeof body.error_code_if_disabled !== 'undefined') {
    const code = Number.parseInt(body.error_code_if_disabled, 10);
    if ([250, 421, 550].includes(code)) {
      alias.error_code_if_disabled = code;
    }
  }

  // Handle max_quota
  if (typeof body.max_quota === 'string' && body.max_quota !== '') {
    // Let the model validation handle bytes parsing
    const parsed = bytes(body.max_quota);
    if (parsed) alias.max_quota = parsed;
  } else if (body.max_quota === '') {
    alias.max_quota = undefined;
  }

  // Handle retention
  if (typeof body.retention !== 'undefined' && body.retention !== '') {
    const retention = Number.parseInt(body.retention, 10);
    if (Number.isFinite(retention) && retention >= 0 && retention <= 365) {
      alias.retention = retention;
    }
  }

  // Handle vacation responder
  if (typeof body.vacation_responder_is_enabled !== 'undefined') {
    if (!alias.vacation_responder) alias.vacation_responder = {};
    alias.vacation_responder.is_enabled = boolean(
      body.vacation_responder_is_enabled
    );
  }

  if (typeof body.vacation_responder_subject === 'string') {
    if (!alias.vacation_responder) alias.vacation_responder = {};
    alias.vacation_responder.subject = body.vacation_responder_subject;
  }

  if (typeof body.vacation_responder_message === 'string') {
    if (!alias.vacation_responder) alias.vacation_responder = {};
    alias.vacation_responder.message = body.vacation_responder_message;
  }

  if (typeof body.vacation_responder_start_date === 'string') {
    if (!alias.vacation_responder) alias.vacation_responder = {};
    if (body.vacation_responder_start_date === '') {
      alias.vacation_responder.start_date = undefined;
    } else {
      alias.vacation_responder.start_date = new Date(
        body.vacation_responder_start_date
      );
    }
  }

  if (typeof body.vacation_responder_end_date === 'string') {
    if (!alias.vacation_responder) alias.vacation_responder = {};
    if (body.vacation_responder_end_date === '') {
      alias.vacation_responder.end_date = undefined;
    } else {
      alias.vacation_responder.end_date = new Date(
        body.vacation_responder_end_date
      );
    }
  }

  alias.locale = ctx.locale;
  alias.is_update = true;
  await alias.save();

  //
  // Side effects (same as update-alias.js in my-account):
  //

  // Clear alias quota cache when max_quota is updated
  if (typeof body.max_quota !== 'undefined' && ctx.client) {
    clearAliasQuotaCache(ctx.client, domain._id)
      .then()
      .catch((err) => ctx.logger.fatal(err));
  }

  // Publish pgp_reload when PGP fields change
  if (
    ctx.client &&
    (typeof body.public_key === 'string' || typeof body.has_pgp !== 'undefined')
  ) {
    ctx.client.publish('pgp_reload', alias.id);
  }

  // Publish smime_reload when S/MIME fields change
  if (
    ctx.client &&
    (typeof body.smime_certificate === 'string' ||
      typeof body.has_smime !== 'undefined')
  ) {
    ctx.client.publish('smime_reload', alias.id);
  }

  // Send notification emails for suspension/unsuspension
  const object = await Domains.getToAndMajorityLocaleByDomain(domain);
  const aliasAddress = `${alias.name}@${domain.name}`;

  if (!hadSMTPSuspension && _.isDate(alias.smtp_suspended_sent_at)) {
    const subject = i18n.translate(
      'ALIAS_IS_ADMIN_SUSPENDED',
      object.locale,
      aliasAddress
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: object.locale
      }
    });
  } else if (hadSMTPSuspension && !_.isDate(alias.smtp_suspended_sent_at)) {
    const subject = i18n.translate(
      'ALIAS_SUSPENSION_REMOVED',
      object.locale,
      aliasAddress
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        subject
      },
      locals: {
        message: subject,
        locale: object.locale
      }
    });
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) {
    ctx.redirect('back');
  } else {
    ctx.body = { reloadPage: true };
  }
}

module.exports = {
  list,
  retrieve,
  update
};
