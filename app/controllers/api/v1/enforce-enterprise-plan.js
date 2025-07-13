/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const config = require('#config');

async function enforceEnterprisePlan(ctx, next) {
  if (!ctx.isAuthenticated())
    throw Boom.unauthorized(ctx.translateError('LOGIN_REQUIRED'));

  if (config.isSelfHosted) return next();

  // Check if user or domain has enterprise plan
  const hasEnterprisePlan =
    ctx.state.user.plan === 'enterprise' ||
    ctx.state?.domain?.plan === 'enterprise';

  if (!hasEnterprisePlan)
    throw Boom.paymentRequired(
      ctx.translateError(
        'ENTERPRISE_PLAN_REQUIRED',
        ctx.state.l('/my-account/billing/upgrade?plan=enterprise')
      )
    );

  return next();
}

module.exports = enforceEnterprisePlan;
