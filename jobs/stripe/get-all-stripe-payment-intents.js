/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pWhilst = require('p-whilst');
const _ = require('#helpers/lodash');

const stripe = require('#helpers/stripe');

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
