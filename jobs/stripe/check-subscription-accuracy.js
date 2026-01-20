/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');

const { setTimeout } = require('node:timers/promises');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');

const getAllStripeCustomers = require('./get-all-stripe-customers');
const _ = require('#helpers/lodash');

const env = require('#config/env');
const stripe = require('#helpers/stripe');
const config = require('#config');
const payments = require('#config/payments');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const Users = require('#models/users');
const emailHelper = require('#helpers/email');

// stripe api rate limitation is 100 writes/100 reads per second in live mode
const concurrency = os.cpus().length;

//
// this gets all customers in stripe
// and ensures that the customer exists in our db
// and it also looks up subscriptions for them
// and if there is more than one active subscription or the subscription isn't stored on our side, then store it
// and it will email admins if any errors occur
//

async function mapper(customer) {
  // wait a second to prevent rate limitation error
  await setTimeout(ms('1s'));

  // check for user on our side
  let user = await Users.findOne({
    [config.userFields.stripeCustomerID]: customer.id
  })
    .lean()
    .exec();

  // if user doesn't exist, this is an orphaned subscription
  if (!user) {
    // get all subscriptions for this customer
    const [activeSubscriptions, trialingSubscriptions] = await Promise.all([
      stripe.subscriptions.list({
        customer: customer.id,
        status: 'active'
      }),
      stripe.subscriptions.list({
        customer: customer.id,
        status: 'trialing'
      })
    ]);

    const subscriptions = [
      ...activeSubscriptions.data,
      ...trialingSubscriptions.data
    ];

    if (subscriptions.length > 0) {
      await logger.warn(
        `Found ${subscriptions.length} active/trialing subscription(s) for customer ${customer.id} (${customer.email}) with no corresponding user in database`
      );

      // separate legacy add-ons from normal plan subscriptions
      const legacyAddOns = [];
      const normalPlanSubscriptions = [];

      for (const subscription of subscriptions) {
        // check if subscription has items and get the product ID
        let isNormalPlan = false;
        if (
          subscription.items &&
          subscription.items.data &&
          subscription.items.data.length > 0
        ) {
          for (const item of subscription.items.data) {
            const productId = item.price.product;
            // check if this product ID is in the STRIPE_PRODUCTS mapping
            if (payments.STRIPE_PRODUCTS[productId]) {
              isNormalPlan = true;
              break;
            }
          }
        }

        if (isNormalPlan) {
          normalPlanSubscriptions.push(subscription);
        } else {
          legacyAddOns.push(subscription);
        }
      }

      // cancel normal plan subscriptions
      if (normalPlanSubscriptions.length > 0) {
        await pMapSeries(normalPlanSubscriptions, async (subscription) => {
          await stripe.subscriptions.cancel(subscription.id);
          logger.info(
            `Cancelled orphaned subscription ${subscription.id} for customer ${customer.id} (${customer.email})`
          );
        });

        // send alert email to admins
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Cancelled orphaned Stripe subscriptions: ${customer.email}`
          },
          locals: {
            message: `<p>Found and cancelled ${normalPlanSubscriptions.length} orphaned subscription(s) for Stripe customer ${customer.id} (${customer.email}) with no corresponding user in our database.</p>
          <p><a href="https://dashboard.stripe.com/customers/${customer.id}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
          }
        });
      }

      // email admins about legacy add-ons without canceling them
      if (legacyAddOns.length > 0) {
        const subscriptionDetails = legacyAddOns
          .map((sub) => {
            const productIds = sub.items.data
              .map((item) => item.price.product)
              .join(', ');
            return `<li>Subscription ID: ${sub.id}<br>Product ID(s): ${productIds}</li>`;
          })
          .join('');

        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Legacy add-on subscription needs review: ${customer.email}`
          },
          locals: {
            message: `<p>Found ${legacyAddOns.length} legacy add-on subscription(s) for Stripe customer ${customer.id} (${customer.email}) with no corresponding user in our database.</p>
          <p>These subscriptions have NOT been cancelled automatically and need to be manually reviewed, fixed, deleted, or re-assigned to the correct user email address in our system.</p>
          <p><strong>Subscription Details:</strong></p>
          <ul>${subscriptionDetails}</ul>
          <p><a href="https://dashboard.stripe.com/customers/${customer.id}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
          }
        });

        logger.info(
          `Sent admin notification for ${legacyAddOns.length} legacy add-on subscription(s) for customer ${customer.id} (${customer.email})`
        );
      }
    }

    return;
  }

  // if user is banned, cancel their subscriptions
  if (user.is_banned) {
    // get all subscriptions for this customer
    const [activeSubscriptions, trialingSubscriptions] = await Promise.all([
      stripe.subscriptions.list({
        customer: customer.id,
        status: 'active'
      }),
      stripe.subscriptions.list({
        customer: customer.id,
        status: 'trialing'
      })
    ]);

    const subscriptions = [
      ...activeSubscriptions.data,
      ...trialingSubscriptions.data
    ];

    if (subscriptions.length > 0) {
      await logger.warn(
        `Found ${subscriptions.length} active/trialing subscription(s) for banned user ${user.email} (${customer.id})`
      );

      // cancel all subscriptions for banned user
      await pMapSeries(subscriptions, async (subscription) => {
        await stripe.subscriptions.cancel(subscription.id);
        logger.info(
          `Cancelled subscription ${subscription.id} for banned user ${user.email} (${customer.id})`
        );
      });

      // unset the subscription ID from user if it exists
      if (user[config.userFields.stripeSubscriptionID]) {
        await Users.findByIdAndUpdate(user._id, {
          $unset: {
            [config.userFields.stripeSubscriptionID]: 1
          }
        });
      }

      // send alert email to admins
      await emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Cancelled subscriptions for banned user: ${user.email}`
        },
        locals: {
          message: `<p>Found and cancelled ${subscriptions.length} subscription(s) for banned user ${user.email} (${customer.id}).</p>
          <p><a href="https://dashboard.stripe.com/customers/${customer.id}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
        }
      });
    }

    return;
  }

  // if emails did not match
  if (user.email !== customer.email) {
    logger.info(
      `User email ${user.email} did not match customer email ${customer.email} (${customer.id})`
    );
    customer = await stripe.customers.update(customer.id, {
      email: user.email
    });
    logger.info(`Updated user email to match ${user.email}`);
  }

  // check for active subscriptions
  // (if there is more than one than error)
  // (otherwise if there is one then ensure it is set on user object)
  const [activeSubscriptions, trialingSubscriptions] = await Promise.all([
    stripe.subscriptions.list({
      customer: customer.id,
      status: 'active'
    }),
    stripe.subscriptions.list({
      customer: customer.id,
      status: 'trialing'
    })
  ]);

  if (activeSubscriptions.has_more || trialingSubscriptions.has_more) {
    const err = new TypeError(
      `Subscriptions has_more issue - this should not have pagination ${customer.email} (${customer.id})`
    );
    err.isCodeBug = true;
    err.customer = customer;
    err.activeSubscriptions = activeSubscriptions;
    err.trialingSubscriptions = trialingSubscriptions;
    throw err;
  }

  let subscriptions = [
    ...activeSubscriptions.data,
    ...trialingSubscriptions.data
  ];

  if (subscriptions.length > 1) {
    await logger.error(
      new Error(
        `We may need to refund: User had multiple subscriptions ${user.email} (${customer.id})`
      )
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `Customer had multiple subscriptions: ${user.email}`
      },
      locals: {
        message: `<p>Customer may have had duplicate subscription payments and may need some of them refunded.</p>
          <p>Subscriptions are already synced correctly to the latest trial or most recently active.</p>
          <p><a href="https://dashboard.stripe.com/customers/${customer.id}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
      }
    });

    // find the subscription that is trialing
    // and cancel all the other ones
    // otherwise if no trialing then cancel everything but newest
    // save to the user the trialing or newest
    const trialing = subscriptions.find((s) => s.status === 'trialing');
    if (trialing) {
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.stripeSubscriptionID]: trialing.id
        }
      });
      const subscriptionsToCancel = subscriptions.filter(
        (s) => s.id !== trialing.id
      );
      await pMapSeries(subscriptionsToCancel, async (subscription) => {
        await stripe.subscriptions.del(subscription.id);
      });
    } else {
      // sort subscriptions by `created` in reverse (gets newest timestamp first)
      subscriptions = _.sortBy(subscriptions, 'created').reverse();
      const [first, ...others] = subscriptions;
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.stripeSubscriptionID]: first.id
        }
      });
      await pMapSeries(others, async (subscription) => {
        await stripe.subscriptions.del(subscription.id);
      });
    }
  } else if (
    subscriptions.length === 1 &&
    (!user[config.userFields.stripeSubscriptionID] ||
      user[config.userFields.stripeSubscriptionID] !== subscriptions[0].id)
  ) {
    // if subscription ID was not saved to the user then error
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.stripeSubscriptionID]: subscriptions[0].id
      }
    });
  }

  // return early since no subscriptions
  if (subscriptions.length === 0) return;

  // lookup when the user's subscription ends
  user = await Users.findById(user._id).lean().exec();

  //
  // BUG FIX: Check if user is on free plan but has an active/trialing subscription
  // This handles the edge case where webhook doesn't fire or user doesn't complete redirect
  //
  if (user.plan === 'free' && subscriptions.length > 0) {
    // Determine which subscription to use:
    // - If there's a trialing subscription, use that (already set above)
    // - Otherwise use the newest subscription (already sorted by created desc above)
    // Note: After the conflict resolution above, subscriptions[0] is guaranteed to be
    // either the trialing subscription or the newest active subscription
    const subscription = subscriptions[0];

    logger.warn(
      `User ${user.email} is on free plan but has active/trialing Stripe subscription ${subscription.id}`
    );

    // Determine the plan from the subscription's price ID
    let plan = 'free';

    // Check the price ID to determine the plan
    if (
      subscription.items &&
      subscription.items.data &&
      subscription.items.data.length > 0
    ) {
      const priceId = subscription.items.data[0].price.id;

      // Map price IDs to plans (enhanced_protection or team)
      if (
        env.STRIPE_PRICE_IDS_ENHANCED_PROTECTION &&
        env.STRIPE_PRICE_IDS_ENHANCED_PROTECTION.includes(priceId)
      ) {
        plan = 'enhanced_protection';
      } else if (
        env.STRIPE_PRICE_IDS_TEAM &&
        env.STRIPE_PRICE_IDS_TEAM.includes(priceId)
      ) {
        plan = 'team';
      }
    }

    if (plan !== 'free') {
      // Update user's plan to match their active subscription
      const userDoc = await Users.findById(user._id);
      if (!userDoc) throw new Error('User does not exist');

      userDoc.plan = plan;

      // Set planSetAt to the payment intent created date
      // This mirrors the webhook logic at app/controllers/api/v1/stripe.js:347
      try {
        // Get the first invoice for this subscription
        const invoices = await stripe.invoices.list({
          limit: 100,
          customer: customer.id,
          subscription: subscription.id
        });

        if (invoices.has_more) {
          logger.warn('Invoices object has more than 100 items');
        }

        // Sort by created date (oldest first)
        const sortedInvoices = _.sortBy(invoices.data, 'created');

        if (sortedInvoices.length > 0 && sortedInvoices[0].payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            sortedInvoices[0].payment_intent
          );

          if (paymentIntent) {
            userDoc[config.userFields.planSetAt] = dayjs
              .unix(paymentIntent.created)
              .toDate();
            logger.info(
              `Set planSetAt to ${
                userDoc[config.userFields.planSetAt]
              } for user ${userDoc.email}`
            );
          }
        } else {
          logger.warn(
            `No payment intent found for subscription ${subscription.id}, cannot set planSetAt`
          );
        }
      } catch (err) {
        logger.error(err, {
          user_email: userDoc.email,
          subscription_id: subscription.id
        });
      }

      await userDoc.save();

      logger.info(`Updated user ${user.email} from free plan to ${plan} plan`);

      // Send notification email to user and admin
      const locale = user[config.lastLocaleField] || i18n.config.defaultLocale;
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: user[config.userFields.receiptEmail] || user.email,
            ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {}),
            bcc: config.supportEmail,
            subject: i18n.api.t({
              phrase: config.i18n.phrases.SUBSCRIPTION_ACTIVATED_SUBJECT,
              locale
            })
          },
          locals: {
            message: i18n.api.t(
              {
                phrase: config.i18n.phrases.SUBSCRIPTION_ACTIVATED_BODY,
                locale
              },
              i18n.api.t({ phrase: plan.toUpperCase(), locale }),
              `${config.urls.web}/${locale}/my-account/billing`
            ),
            locale
          }
        });
        logger.info(
          `Sent subscription activation email to ${user.email} and admin`
        );
      } catch (err) {
        logger.error(err, {
          user_email: user.email,
          subscription_id: subscription.id
        });
      }

      // Refresh user object with updated plan
      user = await Users.findById(user._id).lean().exec();
    }
  }

  if (!user) return;

  // lookup when the user is supposed to get billed next time
  const subscription = await stripe.subscriptions.retrieve(
    user[config.userFields.stripeSubscriptionID]
  );

  if (!subscription.current_period_end) return;

  // if subscription has trial and trial end is equal to billing cycle anchor
  // (this means we've already maximized the duration that we can possibly trial for)
  if (
    subscription.billing_cycle_anchor &&
    subscription.trial_end &&
    subscription.start_date &&
    subscription.billing_cycle_anchor === subscription.trial_end &&
    subscription.billing_cycle_anchor !== subscription.start_date
  )
    return;

  // ensure they're not more than a day apart and if so then extend it
  const nextBillDate = dayjs.unix(subscription.current_period_end).toDate();
  const days = dayjs(new Date(user[config.userFields.planExpiresAt])).diff(
    nextBillDate,
    'days'
  );

  if (
    new Date(user[config.userFields.planExpiresAt]).getTime() > Date.now() &&
    nextBillDate.getTime() > Date.now() &&
    days > 0
  ) {
    // Stripe's maximum trial period is 730 days (2 years) from NOW
    // Cap trial_end to the maximum allowed to prevent API errors
    const maxTrialEnd = dayjs().add(730, 'days').toDate();
    let trialEnd = dayjs(user[config.userFields.planExpiresAt]).toDate();

    // Cap trial_end to the maximum allowed
    if (trialEnd.getTime() > maxTrialEnd.getTime()) {
      trialEnd = maxTrialEnd;
    }

    await stripe.subscriptions.update(
      user[config.userFields.stripeSubscriptionID],
      {
        trial_end: dayjs(trialEnd).unix(),
        proration_behavior: 'none'
      }
    );

    // send an email here
    const locale = user[config.lastLocaleField] || i18n.config.defaultLocale;
    await emailHelper({
      template: 'alert',
      message: {
        to: user[config.userFields.receiptEmail] || user.email,
        ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {}),
        subject: i18n.api.t({
          phrase: config.i18n.phrases.BILLING_CYCLE_UPDATED_SUBJECT,
          locale
        })
      },
      locals: {
        message: i18n.api.t(
          {
            phrase: config.i18n.phrases.BILLING_CYCLE_UPDATED_BODY,
            locale
          },
          dayjs(trialEnd).locale(locale).format('LL'),
          dayjs(nextBillDate).locale(locale).format('LL'),
          `${config.urls.web}/${locale}/my-account/billing`
        ),
        locale
      }
    });
  }
}

async function checkSubscriptionAccuracy() {
  logger.info('Fetching Stripe customers');
  const customers = await getAllStripeCustomers();
  logger.info(`Started checking ${customers.length} Stripe customers`);
  await pMap(customers, mapper, { concurrency });
  logger.info(`Finished checking ${customers.length} Stripe customers`);
}

module.exports = checkSubscriptionAccuracy;
