/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function ensureTeamPlan(ctx, next) {
  ctx.state.isTeamPlanRequired = ctx.state.domain.plan !== 'team';
  return next();
}

module.exports = ensureTeamPlan;
