/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('@forwardemail/bytes');
const config = require('#config');
const emailHelper = require('#helpers/email');

async function upgradeBillingRequest(ctx) {
  try {
    const { kind, upgrade_option } = ctx.request.body;

    const validKinds = ['storage_limit', 'smtp_limit'];
    if (!validKinds.includes(kind)) {
      ctx.throw(400, ctx.translateError('INVALID_UPGRADE_KIND'));
    }

    // TODO: Should move this to a central place to render the page
    // from and also validate against. Possible billing changes would remove
    // this need completely though.
    const validOptions = {
      storage_limit: [
        '+10 GB',
        '+20 GB',
        '+30 GB',
        '+40 GB',
        '+50 GB',
        'Other'
      ],
      smtp_limit: [
        '+1000 emails daily (+$30/mo)',
        '+2000 emails daily (+$60/mo)',
        '+3000 emails daily (+$90/mo)',
        'Other'
      ]
    };

    if (
      !upgrade_option ||
      typeof upgrade_option !== 'string' ||
      !validOptions[kind].includes(upgrade_option)
    ) {
      ctx.throw(
        400,
        ctx.translateError(
          kind === 'storage_limit'
            ? 'INVALID_STORAGE_OPTION'
            : 'INVALID_SMTP_OPTION'
        )
      );
    }

    const { user } = ctx.state;
    const currentQuota = user.max_quota_per_alias;
    const currentQuotaFormatted = bytes(currentQuota);

    const emailData = {
      user,
      kind,
      upgrade_option,
      current_quota: currentQuotaFormatted,
      request_date: new Date().toISOString(),
      admin_user_link: `${
        config.urls.web
      }/admin/users?search=${encodeURIComponent(user.email)}`
    };

    const kindLabel =
      kind === 'storage_limit'
        ? ctx.translate('STORAGE')
        : ctx.translate('SMTP');
    const subject = `${ctx.translate('UPGRADE_REQUEST')}: ${kindLabel} - ${
      user.email
    }`;

    try {
      await emailHelper({
        template: 'upgrade-request-alert',
        message: {
          to: config.supportEmail,
          subject
        },
        locals: emailData
      });

      ctx.logger.info('Upgrade request email sent', {
        user_id: user.id,
        kind,
        upgrade_option
      });
    } catch (err) {
      ctx.logger.error('Failed to send upgrade request email', err);
      // Gracefully continue if email fails
    }

    ctx.logger.info('Upgrade request submitted', {
      user_id: user.id,
      user_email: user.email,
      kind,
      upgrade_option,
      current_quota: currentQuota
    });

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
  } catch (err) {
    ctx.logger.error('Upgrade request handler error', err);
    ctx.flash('error', ctx.translateError('UPGRADE_REQUEST_ERROR'));
  }
}

module.exports = upgradeBillingRequest;
