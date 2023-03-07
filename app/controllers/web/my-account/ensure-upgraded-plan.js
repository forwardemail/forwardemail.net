const Boom = require('@hapi/boom');

function ensureUpgradedPlan(ctx, next) {
  if (
    ctx.state.domain &&
    ctx.state.domain.plan !== 'free' &&
    !ctx.state.isTeamPlanRequired
  )
    return next();

  if (!ctx.state.domain && ctx.state.user.plan !== 'free') return next();

  const redirectTo = ctx.state.domain
    ? ctx.state.l(
        `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
      )
    : ctx.state.l(`/my-account/billing/upgrade?plan=enhanced_protection`);

  const swal = {
    title: ctx.translate('UPGRADE_PLAN'),
    html: ctx.translate('PLAN_UPGRADE_REQUIRED', redirectTo),
    type: 'warning'
  };

  if (ctx.api)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('PLAN_UPGRADE_REQUIRED', redirectTo))
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
