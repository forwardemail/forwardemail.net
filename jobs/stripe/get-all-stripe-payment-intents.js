/* eslint-disable no-await-in-loop */
const Stripe = require('stripe');
const _ = require('lodash');

const env = require('#config/env');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function getAllStripePaymentIntents(stripeCustomerId) {
  let paymentIntents = [];
  let has_more = true;
  let starting_after;
  do {
    const res = await stripe.paymentIntents.list({
      customer: stripeCustomerId,
      limit: 100,
      starting_after
    });

    paymentIntents = [...paymentIntents, ...res.data];
    has_more = res.has_more;
    starting_after = _.last(res.data).id;
  } while (has_more);

  return paymentIntents;
}

module.exports = getAllStripePaymentIntents;
