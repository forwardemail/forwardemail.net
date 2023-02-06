const pWhilst = require('p-whilst');
const Stripe = require('stripe');
const _ = require('lodash');

const env = require('#config/env');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function getAllStripePaymentIntents(stripeCustomerId) {
  const paymentIntents = [];
  let has_more = true;
  let starting_after;
  await pWhilst(
    () => has_more,
    async () => {
      const res = await stripe.paymentIntents.list({
        customer: stripeCustomerId,
        limit: 100,
        starting_after
      });

      paymentIntents.push(...res.data);
      has_more = res.has_more;
      if (has_more && _.last(res.data)) starting_after = _.last(res.data).id;
    }
  );

  return paymentIntents;
}

module.exports = getAllStripePaymentIntents;
