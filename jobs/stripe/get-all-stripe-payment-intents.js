/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pWhilst = require('p-whilst');
const stripe = require('#helpers/stripe');

async function getAllStripePaymentIntents(stripeCustomerId, options = {}) {
  const paymentIntents = [];
  let has_more = true;
  let starting_after;
  await pWhilst(
    () => has_more,
    async () => {
      const parameters = {
        customer: stripeCustomerId,
        limit: 100,
        starting_after,
        // Expand charges so that syncStripePaymentIntent can access
        // paymentIntent.charges.data without an additional API call
        expand: ['data.charges']
      };

      // Support filtering by created timestamp for incremental syncing
      if (options.created) {
        parameters.created = options.created;
      }

      const res = await stripe.paymentIntents.list(parameters);

      paymentIntents.push(...res.data);
      has_more = res.has_more;
      if (has_more && res.data.at(-1)) {
        starting_after = res.data.at(-1).id;
      }
    }
  );

  return paymentIntents;
}

module.exports = getAllStripePaymentIntents;
