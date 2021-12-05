const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');

const env = require('../../../../../config/env');

const handlePaymentIntent = require('./handle-payment-intent');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// <https://stripe.com/docs/webhooks/signatures>
async function webhook(ctx) {
  try {
    const sig = ctx.request.get('stripe-signature');

    // throw an error if something was wrong
    if (!isSANB(sig))
      throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));

    const event = stripe.webhooks.constructEvent(
      ctx.request.rawBody,
      sig,
      env.STRIPE_ENDPOINT_SECRET
    );

    // throw an error if something was wrong
    if (!event)
      throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));

    ctx.logger.info(`stripe webhook event: ${event.type}`);

    // handle the event
    if (event.type === 'payment_intent.succeeded') {
      await handlePaymentIntent(event);
    }

    // return a response to acknowledge receipt of the event
    ctx.body = { received: true };

    // ctx.logger.info('stripe webhook', { event });
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = webhook;
