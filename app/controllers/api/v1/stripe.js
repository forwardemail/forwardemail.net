const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const isSANB = require('is-string-and-not-blank');

const env = require('../../../../config/env');
const config = require('../../../../config');
const email = require('../../../../helpers/email');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// <https://stripe.com/docs/webhooks/signatures>
async function webhook(ctx) {
  try {
    const sig = ctx.request.get('stripe-signature');

    // throw an error if something was wrong
    if (!isSANB(sig))
      throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));

    const event = stripe.webhooks.constructEvent(
      ctx.request.body,
      sig,
      env.STRIPE_ENDPOINT_SECRET
    );

    // throw an error if something was wrong
    if (!event)
      throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));

    // handle the event
    // switch(event.type)

    // NOTE: for now we just manually email admins of every event
    //       (and manual edits can be made as needed)

    // return a response to acknowledge receipt of the event
    ctx.body = { received: true };

    // email admins here
    try {
      await email({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Stripe Webhook: ${event.type}`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(event, null, 2)}</code></pre>`
        }
      });
    } catch (err) {
      ctx.logger.fatal(err);
    }
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = webhook;
