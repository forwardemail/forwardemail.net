/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function ensureTeamPlan(ctx, next) {
  if (ctx.state.domain.plan !== 'team')
    throw Boom.paymentRequired(ctx.translateError('TEAM_PLAN_REQUIRED'));
  return next();
}

module.exports = ensureTeamPlan;
