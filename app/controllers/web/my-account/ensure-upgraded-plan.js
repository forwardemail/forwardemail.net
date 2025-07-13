/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');

function ensureUpgradedPlan(ctx, next) {
  if (
    ctx.state.domain &&
    ctx.state.domain.plan !== 'free' &&
    !ctx.state.isTeamPlanRequired
  )
    return next();

  if (
    (!ctx.state.domain && ctx.state.user.plan !== 'free') ||
    ctx.state?.domain?.plan === 'team' ||
    ctx.state?.domain?.plan === 'enterprise'
  )
    return next();

  const redirectTo = ctx.state.domain
    ? ctx.state.l(
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/billing?plan=enhanced_protection`
      )
    : ctx.state.l(`/my-account/billing/upgrade?plan=enhanced_protection`);

  const swal = {
    title: ctx.translate('UPGRADE_PLAN'),
    html: ctx.translate('PLAN_UPGRADE_REQUIRED', redirectTo),
    type: 'warning'
  };

  //
  // if we're creating a new alias and we're on the free plan
  // then we should instruct the user that they need to use DNS records
  //
  if (
    ctx.method === 'POST' &&
    (ctx.pathWithoutLocale === '/my-account/aliases' ||
      ctx.pathWithoutLocale === '/my-account/domains/aliases/new' ||
      (ctx.state.domain &&
        ctx.pathWithoutLocale ===
          `/my-account/domains/${ctx.state.domain.id}/aliases/new`) ||
      (ctx.state.domain &&
        ctx.pathWithoutLocale ===
          `/my-account/domains/${punycode.toASCII(
            ctx.state.domain.name
          )}/aliases/new`))
  ) {
    swal.title = ctx.state.t('Unlock this feature');
    swal.html = `
      <strong>${ctx.state.t(
        'You are currently on the free plan, which requires your aliases to be managed in DNS records.'
      )}</strong>
      <br />
      <br />
      ${ctx.state.t(
        'If you upgrade to a paid plan, then you will unlock our alias manager feature.'
      )}
      <br />
      <br />
      ${ctx.state.t(
        'If you do not wish to upgrade, then please see <a href="%s" class="text-decoration-underline text-primary font-weight-bold" target="_blank">Options A to G in our FAQ</a> in order to manage your aliases.',
        ctx.state.domain
          ? ctx.state.l(
              `/faq?domain=${ctx.state.domain.name}#dns-configuration-options`
            )
          : ctx.state.l('/faq#dns-configuration-options')
      )}
      ${ctx.state.t(
        '<a href="https://www.youtube.com/watch?v=N6zjv40zuIY" rel="noopener noreferrer" target="_blank" class="text-decoration-underline text-danger font-weight-bold">Click to watch our product tour</a>.',
        ctx.state.l('/private-business-email')
      )}
    `.trim();
  }

  if (ctx.api)
    throw Boom.paymentRequired(
      ctx.translateError('PLAN_UPGRADE_REQUIRED', redirectTo)
    );

  if (ctx.method === 'GET' || ctx.accepts('html')) {
    if (!ctx.api) ctx.flash('custom', swal);
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  ctx.body = { swal };
}

module.exports = ensureUpgradedPlan;
