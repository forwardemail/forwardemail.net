const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');

const env = require('#config/env');
const { paypalAgent } = require('#helpers/paypal');
const config = require('#config');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function cancelSubscription(ctx, next) {
  if (
    !isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
    !isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
  )
    throw Boom.badRequest(ctx.translateError('SUBSCRIPTION_ALREADY_CANCELLED'));

  await Promise.all([
    isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])
      ? stripe.subscriptions.del(
          ctx.state.user[config.userFields.stripeSubscriptionID]
        )
      : Promise.resolve(),
    isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
      ? (async () => {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${
              ctx.state.user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
        })()
      : Promise.resolve()
  ]);

  ctx.state.user[config.userFields.stripeSubscriptionID] = undefined;
  ctx.state.user[config.userFields.paypalSubscriptionID] = undefined;

  await ctx.state.user.save();

  ctx.flash('success', ctx.translate('SUBSCRIPTION_CANCELLED'));

  return next();
}

module.exports = cancelSubscription;
