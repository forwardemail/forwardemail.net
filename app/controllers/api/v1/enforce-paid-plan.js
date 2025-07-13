/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const config = require('#config');

async function enforcePaidPlan(ctx, next) {
  if (!ctx.isAuthenticated())
    throw Boom.unauthorized(ctx.translateError('LOGIN_REQUIRED'));

  // if the user is a member of a team plan and in the admin group, continue
  if (
    ctx.state?.domain?.group === 'admin' &&
    (ctx.state?.domain?.plan === 'team' ||
      ctx.state?.domain?.plan === 'enterprise')
  )
    return next();

  if (config.isSelfHosted) return next();

  if (ctx.state.user.plan === 'free')
    throw Boom.paymentRequired(
      ctx.translateError(
        'PLAN_UPGRADE_REQUIRED',
        ctx.state.l('/my-account/billing/upgrade?plan=enhanced_protection')
      )
    );

  return next();
}

module.exports = enforcePaidPlan;
