/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function ensureEnterprisePlan(ctx, next) {
  ctx.state.isEnterprisePlanRequired = ctx.state.domain.plan !== 'enterprise';
  return next();
}

module.exports = ensureEnterprisePlan;
