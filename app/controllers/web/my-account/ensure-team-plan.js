function ensureTeamPlan(ctx, next) {
  ctx.state.isTeamPlanRequired = ctx.state.domain.plan !== 'team';
  return next();
}

module.exports = ensureTeamPlan;
