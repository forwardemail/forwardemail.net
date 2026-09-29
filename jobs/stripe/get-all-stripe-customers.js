/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');

const stripe = require('#helpers/stripe');

async function getAllStripeCustomers() {
  const customers = [];
  let has_more = true;
  let starting_after;
  do {
    const res = await stripe.customers.list({
      limit: 100,
      starting_after
    });

    // (push, where copying the whole list for every page of 100 was
    // quadratic in the number of customers)
    customers.push(...res.data);
    has_more = res.has_more;
    if (has_more && _.last(res.data)) {
      starting_after = _.last(res.data).id;
    }
  } while (has_more);

  return customers;
}

module.exports = getAllStripeCustomers;
