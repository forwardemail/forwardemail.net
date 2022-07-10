const { promisify } = require('util');

const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const paypal = require('paypal-rest-sdk');
const superagent = require('superagent');

const env = require('#config/env');
const config = require('#config');

const PAYPAL_ENDPOINT =
  env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

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
          const token = await promisify(paypal.generateToken)();
          await superagent
            .post(
              `${PAYPAL_ENDPOINT}/v1/billing/subscriptions/${
                ctx.state.user[config.userFields.paypalSubscriptionID]
              }/cancel`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .timeout(ms('5s'));
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
