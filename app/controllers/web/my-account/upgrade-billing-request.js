/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const bytes = require('@forwardemail/bytes');
const ms = require('ms');

const config = require('#config');
const emailHelper = require('#helpers/email');

async function upgradeBillingRequest(ctx) {
  const { kind, upgrade_option } = ctx.request.body;

  const validKinds = ['storage_limit', 'smtp_limit'];
  if (!kind || typeof kind !== 'string' || !validKinds.includes(kind))
    throw Boom.badRequest(ctx.translateError('INVALID_UPGRADE_KIND'));

  // TODO: Should move this to a central place to render the page
  // from and also validate against. Possible billing changes would remove
  // this need completely though.
  const validOptions = {
    storage_limit: ['+10 GB', '+20 GB', '+30 GB', '+40 GB', '+50 GB', 'Other'],
    smtp_limit: [
      '+1000 emails daily',
      '+2000 emails daily',
      '+3000 emails daily',
      'Other'
    ]
  };

  if (
    !upgrade_option ||
    typeof upgrade_option !== 'string' ||
    !validOptions[kind].includes(upgrade_option)
  )
    throw Boom.badRequest(
      ctx.translateError(
        kind === 'storage_limit'
          ? 'INVALID_STORAGE_OPTION'
          : 'INVALID_SMTP_OPTION'
      )
    );

  const { user } = ctx.state;
  const currentQuota = user.max_quota_per_alias;
  const currentQuotaFormatted = bytes(currentQuota);
  const kindLabel =
    kind === 'storage_limit' ? ctx.translate('STORAGE') : ctx.translate('SMTP');
  const subject = `${ctx.translate('UPGRADE_REQUEST')}: ${kindLabel} - ${
    user.email
  }`;
  const key = `upgrade_request:${kind}:${user.id}`;
  const cache = await ctx.client.get(key);

  if (cache)
    throw Boom.badRequest(ctx.translateError('UPGRADE_REQUEST_ALREADY_SENT'));

  await emailHelper({
    template: 'upgrade-request-alert',
    message: {
      to: config.supportEmail,
      subject
    },
    locals: {
      userData: {
        email: user.email,
        plan: user.plan
      },
      kind,
      upgrade_option,
      current_quota: currentQuotaFormatted,
      request_date: new Date().toISOString(),
      admin_user_link: `${config.urls.web}/admin/users?q=${encodeURIComponent(
        user.email
      )}`
    }
  });

  await ctx.client.set(key, true, 'PX', ms('3d'));

  ctx.flash('custom', {
    title: ctx.translate('SUCCESS'),
    text: ctx.translate('UPGRADE_REQUEST_NOTIFICATION'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 10000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = upgradeBillingRequest;
