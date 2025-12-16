/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pMap = require('p-map');

const getAllStripeCustomers = require('./get-all-stripe-customers');

const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const stripe = require('#helpers/stripe');

async function mapper(customer) {
  // check if user has more than 5 payment methods
  // and if the user is not currently banned in system
  const user = await Users.findOne({
    [config.userFields.stripeCustomerID]: customer.id
  });

  if (!user) return;
  if (user.is_banned) return;

  // check for:
  // - # of verified domains
  // - # stripe payment methods
  // - # active subscriptions
  const [count, paymentMethods, subscriptions] = await Promise.all([
    Domains.countDocuments({
      members: {
        $elemMatch: {
          user: user._id,
          group: 'admin'
        }
      },
      plan: { $in: ['enhanced_protection', 'team'] },
      has_txt_record: true
    }),
    stripe.customers.listPaymentMethods(customer.id),
    stripe.subscriptions.list({ customer: customer.id, status: 'active' })
  ]);

  // only do this for users with an active subscription in stripe
  if (
    !user.has_passed_kyc &&
    count === 0 &&
    paymentMethods.data.length >= 3 &&
    subscriptions.data.length > 0
  ) {
    emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `Potential Payment Method Fraud: ${user.email} - ${customer.id} - ${paymentMethods.data.length} payment methods`
      },
      locals: {
        message: `<p><a href="https://dashboard.stripe.com/customers/${customer.id}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
      }
    })
      .then()
      .catch((err) => logger.fatal(err));
  }
}

async function fraudCheck() {
  logger.info('Fetching Stripe customers');
  const customers = await getAllStripeCustomers();
  logger.info(`Started checking ${customers.length} Stripe customers`);
  await pMap(customers, mapper, {
    concurrency: Math.floor(config.concurrency / 3)
  });
  logger.info(`Finished checking ${customers.length} Stripe customers`);
}

module.exports = fraudCheck;
