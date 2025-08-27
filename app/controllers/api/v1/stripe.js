/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');
const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const parseErr = require('parse-err');
const pMapSeries = require('p-map-series');
const titleize = require('titleize');
const safeStringify = require('fast-safe-stringify');
const _ = require('#helpers/lodash');

const { Users, Domains } = require('#models');
const config = require('#config');
const env = require('#config/env');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const syncStripePaymentIntent = require('#helpers/sync-stripe-payment-intent');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const { STRIPE_PRODUCTS } = config.payments;

async function processEvent(ctx, event) {
  //
  // handle the events
  // <https://stripe.com/docs/cli/trigger#trigger-event>
  //
  switch (event.type) {
    //
    // NOTE: due to unprecedented Stripe credit card fraud (which Stripe has refused to help mitigate)
    //       we've implemented our own logic here to prevent fraud (user's doing client-side attacks with generated numbers)
    //       <https://docs.stripe.com/disputes/prevention/card-testing>
    //
    // prevent fraud by checking for users with 5+ failed charges in < 30 days
    // with zero verified domains on their account and/or unverified email address
    // ban user and notify admins, and refund all other charges from them
    //
    case 'charge.failed': {
      // exit early if it wasn't a charge failure
      if (event?.data?.object?.object !== 'charge') break;
      if (typeof event?.data?.object?.customer !== 'string')
        throw new Error('Charge did not have customer');
      const user = await Users.findOne({
        [config.userFields.stripeCustomerID]: event.data.object.customer
      });
      if (!user) throw new Error('User did not exist for customer');
      // <https://docs.stripe.com/api/charges/list>
      const charges = await stripe.charges.list({
        customer: event.data.object.customer,
        created: {
          gte: dayjs().subtract(1, 'month').unix() // only search last 30 days to prevent false positives
        }
      });

      const filtered = charges.data.filter(
        (d) => d.status === 'failed' && d.failure_code === 'card_declined'
      );

      // if not more than 5 then return early
      if (filtered.length < 5) break;

      // TODO: we may want to use payment methods count here too instead of just failed charges
      //       (see `jobs/stripe/fraud-check.js` which uses this approach on a recurring basis)

      // if user had verified domains then alert admins
      // otherwise ban the user and refund all their payments
      const count = await Domains.countDocuments({
        members: {
          $elemMatch: {
            user: user._id,
            group: 'admin'
          }
        },
        plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
        has_txt_record: true
      });

      if (!user.is_banned) {
        const subject = `${user.email} - ${event.data.object.customer} - ${filtered.length} declined charges and ${count} verified domains`;
        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `${
              count > 0
                ? 'Potential Fraud to Investigate'
                : 'Banned User for Fraud Alert'
            }: ${subject}`
          },
          locals: {
            message: `<p><a href="https://dashboard.stripe.com/customers/${event.data.object.customer}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
          }
        })
          .then()
          .catch((err) => logger.fatal(err));
      }

      if (count === 0) {
        if (!user.is_banned) {
          user.is_banned = true;
          await user.save();
        }

        const [charges, subscriptions] = await Promise.all([
          stripe.charges.list({
            customer: event.data.object.customer
          }),
          stripe.subscriptions.list({
            customer: event.data.object.customer
          })
        ]);

        // refund all payments as fraudulent
        if (charges?.data?.length > 0)
          await pMapSeries(charges.data, async (charge) => {
            try {
              await stripe.refunds.create({
                charge: charge.id,
                reason: 'fraudulent'
              });
            } catch (err) {
              logger.fatal(err, { charge });
            }
          });

        // cancel all subscriptions
        if (subscriptions?.data?.length > 0)
          await pMapSeries(subscriptions.data, async (subscription) => {
            if (subscription.status !== 'canceled') return;
            await stripe.subscriptions.cancel(subscription.id);
          });
      }

      break;
    }

    // create or update existing payment
    // (we may also want to upgrade plan; e.g. in case redirect does not occur)
    // (also need to ensure no conflicts with redirect)
    case 'charge.captured':
    case 'charge.succeeded':
    case 'charge.refunded': {
      if (event.data.object.object !== 'charge')
        throw new Error('Event object was not a charge');

      const charge = event.data.object;
      // ensure it has customer
      if (!isSANB(charge.customer))
        throw new Error('Charge did not have customer');

      // ensure it has payment_intent
      if (!isSANB(charge.payment_intent))
        throw new Error('Charge did not have payment_intent');

      // lookup user in our system
      const user = await Users.findOne({
        [config.userFields.stripeCustomerID]: charge.customer
      });

      if (!user) {
        if (event.type === 'charge.refunded') return;
        throw new Error('User did not exist for customer');
      }

      //
      // NOTE: this re-uses the payment intent mapper that is also used
      //       in the job for `sync-stripe-payments` which syncs payments
      //
      const paymentIntent = await stripe.paymentIntents.retrieve(
        charge.payment_intent
      );
      if (!paymentIntent)
        throw new Error('Payment intent did not exist in Stripe');
      const errorEmails = await syncStripePaymentIntent(user)(
        [],
        paymentIntent
      );
      if (errorEmails.length > 0) {
        try {
          await Promise.all(errorEmails.map((email) => emailHelper(email)));
        } catch (err) {
          ctx.logger.error(err);
        }
      }

      break;
    }

    case 'checkout.session.async_payment_failed': {
      if (event.data.object.object !== 'checkout.session')
        throw new Error('Event object was not a checkout.session');
      const session = event.data.object;
      // lookup user by customer
      const user = await Users.findOne({
        [config.userFields.stripeCustomerID]: session.customer
      });
      if (!user) throw new Error('User did not exist for customer');
      // email the user and CC admins
      await emailHelper({
        template: 'alert',
        message: {
          to: user[config.userFields.receiptEmail] || user.email,
          ...(user[config.userFields.receiptEmail]
            ? {
                cc: [user.email, config.alertsEmail]
              }
            : { cc: config.alertsEmail }),
          subject: 'Issue with delayed payment'
        },
        locals: {
          message: `
          <p class="text-center">There was an issue with your payment &ndash; you were not charged.</p>
          <p class="text-center">Go to the billing page and try again with a new payment method.</p>
          <p class="text-center"><a href="/my-account/billing" class="btn btn-dark btn-lg" rel="noopener noreferrer" target="_blank">Manage Billing</a></p>
          `
        }
      });
      break;
    }

    // then lookup the session if it existed for the payment intent
    // and lookup the plan mapping, and if it doesn't match then adjust it
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.completed': {
      // most of this logic is mirrored from web/my-account/retrieve-domain-billing.js
      if (event.data.object.object !== 'checkout.session')
        throw new Error('Event object was not a checkout.session');
      const session = event.data.object;
      if (session.payment_status !== 'paid') return;
      // lookup user by customer
      const user = await Users.findOne({
        [config.userFields.stripeCustomerID]: session.customer
      });
      if (!user) throw new Error('User did not exist for customer');

      // look at the line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      if (!Array.isArray(lineItems.data) || lineItems.data.length !== 1)
        throw ctx.translateError('UNKNOWN_ERROR');

      // look up the product associated with the line item
      // (it should match ctx.query.plan but this is a safeguard)
      const productToPlan = STRIPE_PRODUCTS[lineItems.data[0].price.product];

      if (
        !isSANB(productToPlan) ||
        !['team', 'enhanced_protection', 'enterprise'].includes(productToPlan)
      )
        throw new Error('Plan was not valid');

      //
      // NOTE: this re-uses the payment intent mapper that is also used
      //       in the job for `sync-stripe-payments` which syncs payments
      //
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );
        if (!paymentIntent)
          throw new Error('Payment intent did not exist in Stripe');

        // sync the payment intent
        const errorEmails = await syncStripePaymentIntent(user)(
          [],
          paymentIntent
        );
        if (errorEmails.length > 0) {
          try {
            await Promise.all(errorEmails.map((email) => emailHelper(email)));
          } catch (err) {
            ctx.logger.error(err);
          }
        }

        // lookup the payment intent created date and if its after plan_set_at then adjust it
        if (
          !_.isDate(user[config.userFields.planSetAt]) ||
          // if the user changed plans then adjust plan set at
          user.plan !== productToPlan
        )
          user[config.userFields.planSetAt] = dayjs
            .unix(paymentIntent.created)
            .toDate();
      } else if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        if (!subscription)
          throw new Error('Subscription does not exist in Stripe');
        // store the subscription id to the user
        user[config.userFields.stripeSubscriptionID] = subscription.id;
        // if it was not a trial then lookup the payment intent
        if (subscription.status !== 'trialing') {
          const invoices = await stripe.invoices.list({
            limit: 100, // it'd be impossible for a customer to hit this (at least right now)
            customer: session.customer,
            subscription: subscription.id
          });

          if (invoices.has_more)
            throw new Error('Invoices object should not have more');
          invoices.data = _.sortBy(invoices.data, 'created');

          if (
            invoices.data.length === 0 ||
            !invoices.data[0] ||
            !invoices.data[0].id ||
            !invoices.data[0].payment_intent
          )
            throw new Error('Payment intent missing');
          const paymentIntent = await stripe.paymentIntents.retrieve(
            invoices.data[0].payment_intent
          );

          if (!paymentIntent)
            throw new Error('Payment intent did not exist in Stripe');
          // sync the payment intent
          const errorEmails = await syncStripePaymentIntent(user)(
            [],
            paymentIntent
          );

          if (errorEmails.length > 0) {
            try {
              await Promise.all(errorEmails.map((email) => emailHelper(email)));
            } catch (err) {
              ctx.logger.error(err);
            }
          }

          // lookup the payment intent created date and if its after plan_set_at then adjust it

          if (
            !_.isDate(user[config.userFields.planSetAt]) ||
            // if the user changed plans then adjust plan set at
            user.plan !== productToPlan
          )
            user[config.userFields.planSetAt] = dayjs
              .unix(paymentIntent.created)
              .toDate();
        }
      }

      // if the plans don't match up them sync them
      if (user.plan !== productToPlan) user.plan = productToPlan;

      // finally save the user
      await user.save();

      if (event.type === 'checkout.session.async_payment_succeeded') {
        // email the user that their async payment was successful
        // if and only if some of their domains don't match up
        const count = await Domains.countDocuments({
          plan: {
            $ne: productToPlan
          },
          members: {
            $elemMatch: {
              user: user._id,
              group: 'admin'
            }
          }
        });

        if (count > 0)
          await emailHelper({
            template: 'alert',
            message: {
              to: user[config.userFields.receiptEmail] || user.email,
              ...(user[config.userFields.receiptEmail]
                ? {
                    cc: [user.email, config.alertsEmail]
                  }
                : { cc: config.alertsEmail }),
              subject: 'Your payment was successful: please follow these steps'
            },
            locals: {
              message: `
          <p class="text-center">Manage Domains &rarr; click "Change Plan" &rarr; "${titleize(
            humanize(productToPlan)
          )}".</p>
          <p class="text-center"><a href="/my-account/billing" class="btn btn-dark btn-lg" rel="noopener noreferrer" target="_blank">Manage Domains</a></p>
          `
            }
          });
      }

      break;
    }

    // TODO: 'payment_intent.succeeded'

    // ban users that dispute charges
    // and cancel their subscriptions (if not already)
    case 'charge.dispute.created': {
      // event.data.object is a dispute object
      if (event.data.object.object !== 'dispute')
        throw new Error('Event object was not a dispute');
      const dispute = event.data.object;
      // close the dispute (accepts as lost)
      await stripe.disputes.close(dispute.id);
      // ensure it has payment_intent
      if (!isSANB(dispute.payment_intent))
        throw new Error('Dispute did not have payment_intent');
      // attempt to sync the payment (so user gets a refund email)
      const paymentIntent = await stripe.paymentIntents.retrieve(
        dispute.payment_intent
      );
      if (!paymentIntent)
        throw new Error('Payment intent did not exist in Stripe');
      // lookup the user from the payment intent customer field
      if (!isSANB(paymentIntent.customer))
        throw new Error('Payment intent missing customer field');
      const user = await Users.findOne({
        [config.userFields.stripeCustomerID]: paymentIntent.customer
      });
      if (!user) throw new Error('User did not exist for customer');
      // artificially wait 5s for refund to process
      await setTimeout(ms('15s'));
      //
      // NOTE: this re-uses the payment intent mapper that is also used
      //       in the job for `sync-stripe-payments` which syncs payments
      //
      const errorEmails = await syncStripePaymentIntent(user)(
        [],
        paymentIntent
      );
      if (errorEmails.length > 0) {
        try {
          await Promise.all(errorEmails.map((email) => emailHelper(email)));
        } catch (err) {
          ctx.logger.error(err);
        }
      }

      // cancel the user's subscription
      if (isSANB(user[config.userFields.stripeSubscriptionID])) {
        try {
          await stripe.subscriptions.del(
            user[config.userFields.stripeSubscriptionID]
          );
        } catch (err) {
          ctx.logger.error(err);
        }

        user[config.userFields.stripeSubscriptionID] = undefined;
        await user.save();
      }

      // ban the user for opening a dispute
      if (!user[config.userFields.isBanned]) {
        user[config.userFields.isBanned] = true;
        await user.save();
        // clear banned cache
        ctx.client
          .del('banned_user_ids')
          .then()
          .catch((err) => ctx.logger.fatal(err));
        // email admins that the user was banned
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `Customer banned for opening Stripe dispute: ${user.email}`
          },
          locals: {
            message: `Customer with email ${user.email} was banned for opening dispute ID ${dispute.id}.`
          }
        });
      }

      break;
    }

    // set subscription for customer if not already set
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      // event.data.object is a subscription object
      if (event.data.object.object !== 'subscription')
        throw new Error('Event object was not a subscription');
      if (['active', 'trialing'].includes(event.data.object.status))
        await Users.findOneAndUpdate(
          {
            [config.userFields.stripeCustomerID]: event.data.object.customer
          },
          {
            $set: {
              [config.userFields.stripeSubscriptionID]: event.data.object.id
            }
          }
        );
      // if user had more than one subscription then notify admins by email
      const subscriptions = await stripe.subscriptions.list({
        customer: event.data.object.customer
      });
      const filtered = subscriptions.data.filter(
        (s) => s.status !== 'canceled'
      );

      // lookup user in our system
      const user = await Users.findOne({
        [config.userFields.stripeCustomerID]: event.data.object.customer
      });

      if (!user) throw new Error('User did not exist for customer');

      if (filtered.length > 1) {
        // if user had verified domains then alert admins
        // otherwise ban the user and refund all their payments
        const count = await Domains.countDocuments({
          members: {
            $elemMatch: {
              user: user._id,
              group: 'admin'
            }
          },
          plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
          has_txt_record: true
        });

        if (count === 0) {
          if (!user.is_banned) {
            user.is_banned = true;
            await user.save();
            emailHelper({
              template: 'alert',
              message: {
                to: config.alertsEmail,
                subject: 'Banned User for Fraud Alert'
              },
              locals: {
                message: `<p><a href="https://dashboard.stripe.com/customers/${event.data.object.customer}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
              }
            })
              .then()
              .catch((err) => logger.fatal(err));
          }

          const [charges, subscriptions] = await Promise.all([
            stripe.charges.list({
              customer: event.data.object.customer
            }),
            stripe.subscriptions.list({
              customer: event.data.object.customer
            })
          ]);

          // refund all payments as fraudulent
          if (charges?.data?.length > 0)
            await pMapSeries(charges.data, async (charge) => {
              try {
                await stripe.refunds.create({
                  charge: charge.id,
                  reason: 'fraudulent'
                });
              } catch (err) {
                logger.fatal(err, { charge });
              }
            });

          // cancel all subscriptions
          if (subscriptions?.data?.length > 0)
            await pMapSeries(subscriptions.data, async (subscription) => {
              if (subscription.status !== 'canceled') return;
              await stripe.subscriptions.cancel(subscription.id);
            });
        } else {
          emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `Multiple Subscriptions Detected: ${event.data.object.customer}`
            },
            locals: {
              message: `<p><a href="https://dashboard.stripe.com/customers/${event.data.object.customer}" class="btn btn-dark btn-lg" target="_blank" rel="noopener noreferrer">Review Stripe Customer</a></p>`
            }
          })
            .then()
            .catch((err) => logger.fatal(err));
        }
      }

      break;
    }

    // remove stripe subscription from user
    // when cancelled (if not already)
    case 'customer.subscription.deleted': {
      // event.data.object is a subscription object
      if (event.data.object.object !== 'subscription')
        throw new Error('Event object was not a subscription');
      const subscription = event.data.object;
      await Users.findOneAndUpdate(
        {
          [config.userFields.stripeSubscriptionID]: subscription.id
        },
        {
          $unset: {
            [config.userFields.stripeSubscriptionID]: 1
          }
        }
      );
      break;
    }

    // TODO: handle other events
    default:
  }
}

// <https://stripe.com/docs/webhooks/signatures>

async function webhook(ctx) {
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

  // return a response to acknowledge receipt of the event
  ctx.body = { received: true };

  // run in background
  processEvent(ctx, event)
    .then()
    .catch((err) => {
      ctx.logger.fatal(err, { event });
      // email admin errors
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Error with Stripe Webhook (Event ID ${event.id})`
        },
        locals: {
          message: `<pre><code>${safeStringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err, { event }));
    });
}

module.exports = webhook;
