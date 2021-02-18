const Boom = require('@hapi/boom');

async function enforcePaidPlan(ctx, next) {
  if (!ctx.isAuthenticated())
    return ctx.throw(Boom.unauthorized(ctx.translateError('LOGIN_REQUIRED')));

  if (ctx.state.user.plan === 'free')
    return ctx.throw(
      Boom.paymentRequired(ctx.translateError('PLAN_UPGRADE_REQUIRED'))
    );

  return next();
}

module.exports = enforcePaidPlan;
