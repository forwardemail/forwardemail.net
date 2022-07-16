const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');

const env = require('#config/env');

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

    ctx.logger.info('stripe webhook', { event });

    //
    // handle the events
    // <https://stripe.com/docs/cli/trigger#trigger-event>
    //
    switch (event.type) {
      // TODO: create or update existing payment
      //       (we may also want to upgrade plan; e.g. in case redirect does not occur)
      //       (also need to ensure no conflicts with redirect)
      case 'charge.succeeded':
        break;
      // TODO: update payments with refund amount
      case 'charge.refunded':
        break;
      // TODO: ban users that dispute charges
      // and cancel their subscriptions (if not already)
      case 'charge.dispute.created':
        break;
      // TODO: create subscription for customer if not already set
      //       (also need to ensure no conflicts with redirect)
      case 'customer.subscription.created':
        break;
      // TODO: remove stripe subscription from user
      // when cancelled (if not already)
      case 'customer.subscription.deleted':
        break;
      // TODO: handle other events
      default:
    }

    // return a response to acknowledge receipt of the event
    ctx.body = { received: true };
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = webhook;
