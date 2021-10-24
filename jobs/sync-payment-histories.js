/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
/* eslint-disable complexity */
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const Stripe = require('stripe');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const env = require('../config/env');
const config = require('../config');
const emailHelper = require('../helpers/email');
const logger = require('../helpers/logger');
const Users = require('../app/models/user');
const Payments = require('../app/models/payment');

const breeSharedConfig = sharedConfig('BREE');
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

const isTest =
  !env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY.startsWith('sk_test');

const STRIPE_MAPPING = {
  enhanced_protection: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXyLFuf8FuIPJrPzAy9y7',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJOZ53q1Pa',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJt1actni9',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJakedaHaz',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJ3X8FfkRn',
      '2y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJFKeUg5kf',
      '3y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJkavB2UyM'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLglLFuf8FuIPJDmpFggVW',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLh0LFuf8FuIPJD4lYB3Jz',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhFLFuf8FuIPJBPD5hScR',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhaLFuf8FuIPJ2eUbPZfI',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLi4LFuf8FuIPJTSsQAit3'
    }
  },
  team: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJFo5Q9L3E',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJxLg7dYmV',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJlvIwyhNT',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ00A3zNFB',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJENDdnNWs',
      '2y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ8LSXjG48',
      '3y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJSaHAcuOv'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJa44UB4fa',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yrLFuf8FuIPJ33ffzO71',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJ3ev702mN',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJvNJJswbG',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJYbtNstWT'
    }
  }
};

const STRIPE_PRODUCTS = {
  // test
  prod_ICSwLEvQhmYDcy: 'team',
  prod_ICStJG6fjZhEjl: 'enhanced_protection',
  // live
  prod_ICRsgPRv2sVKlp: 'team',
  prod_IBizMRHKSjMQcl: 'enhanced_protection'
};

graceful.listen();

(async () => {
  await mongoose.connect();

  const stripeCustomers = await Users.find({
    [config.userFields.stripeCustomerID]: { $exists: true, $ne: null }
  })
    .lean()
    .exec();

  console.log(
    `Syncing payments for ${stripeCustomers.length} stripe customers.`
  );

  for (const customer of stripeCustomers) {
    console.group(
      `Syncing payments for customer ${customer.email} ${
        customer[config.userFields.stripeCustomerID]
      }`
    );
    // stripe payment_intents are source of truth for stripe payments as one is created
    // for each time a customer is charged for both one-time and subscriptions
    // we go through each successful charge and ensure there is an existing payment and
    // that if there is - all the information is correct with the invoice
    let stripePaymentIntents;
    try {
      stripePaymentIntents = await getAllStripePaymentIntents(
        customer[config.userFields.stripeCustomerID]
      );
      console.log(`syncing ${stripePaymentIntents.length} payment intents`);
    } catch (err) {
      // if we couldn't get the customers payments
      // send an alert and try the next customer
      logger.error(err);
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Problem syncing billing history for ${customer.email} - could not retrieve customer payments`
          },
          locals: { message: err.message }
        });
      } catch (err) {
        logger.error(err);
      }

      console.groupEnd();

      continue;
    }

    // if for some reason data doesn't match between a saved
    // payment and the data we are getting from stripe, we do
    // not make any changes and send an alert for that payment
    for (const paymentIntent of stripePaymentIntents) {
      console.group('paymentIntent', paymentIntent.id);
      try {
        if (paymentIntent.status !== 'succeeded') {
          console.groupEnd();
          continue;
        }

        // charges will usually just be an array of the successful charge,
        // but I think it may be possible a failed charge could be there as well
        // so we need to find the successful one for any payment details
        const stripeCharge = paymentIntent.charges.data.find(
          (charge) => charge.paid && charge.status === 'succeeded'
        );

        let amountRefunded;
        if (stripeCharge.refunded) {
          ({ amount_refunded: amountRefunded } = stripeCharge);
        }

        // one time payments have no invoice nor subscription
        const isOneTime = !paymentIntent.invoice;

        // subscription creation has the subscription creation description
        const isSubscriptionCreation =
          paymentIntent.description === 'Subscription creation';

        // subscription auto payments have invoices
        // and their description says invoice
        const isSubscriptionRenewal =
          isSANB(paymentIntent.invoice) &&
          paymentIntent.description?.includes('Invoice');

        if (isOneTime) console.log('isOneTime', true);
        if (isSubscriptionCreation) console.log('isSubscriptionCreation', true);
        if (isSubscriptionRenewal) console.log('isSubscriptionRenewal', true);

        if (!stripeCharge)
          throw new Error('No successful stripe charge on payment intent.');

        // let checkoutSession;
        // if (isOneTime || isSubscriptionCreation) {
        // there will only ever be 1 checkout
        // session per successful payment intent
        const { data: checkoutSessions } = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id
        });

        if (checkoutSessions.length > 1)
          throw new Error('Found an unexpected # of checkout sessions');

        const [checkoutSession] = checkoutSessions;
        // }

        console.log('checkoutSession', checkoutSession?.id);

        // invoices only on subscription payments
        let invoice;
        if (isSubscriptionCreation || isSubscriptionRenewal)
          invoice = await stripe.invoices.retrieve(paymentIntent.invoice);

        let productId;
        let priceId;
        if (isSubscriptionRenewal || isSubscriptionCreation) {
          productId = invoice.lines.data[0].price.product;
          priceId = invoice.lines.data[0].price.id;
        } else {
          // for one-time payments we must retrieve the lines from the checkout session
          const lines = await stripe.checkout.sessions.listLineItems(
            checkoutSession.id
          );
          productId = lines.data[0].price.product;
          priceId = lines.data[0].price.id;
        }

        // this logic is the same in rerieve-domain-billing
        const plan = STRIPE_PRODUCTS[productId];
        const kind = isOneTime ? 'one-time' : 'subscription';
        const duration = ms(
          _.keys(STRIPE_MAPPING[plan][kind]).find(
            (key) => STRIPE_MAPPING[plan][kind][key] === priceId
          )
        );

        console.log('plan', plan);
        console.log('duration', duration);

        // Once all the required/relevant information is gathered from stripe
        // we attempt to look up the payment in our system, if it already exists
        // we validate it and modify any missing params, if it doesnt, we create it
        // depending on how it was created it will have some of the following fields

        const q = {
          user: customer._id
        };

        let [payment, ...tooManyPayments] = await Payments.find({
          ...q,
          stripe_payment_intent_id: paymentIntent.id
        });

        if (tooManyPayments.length > 0)
          throw new Error(
            `There are too many payments in the system with stripe_payment_intent_id ${paymentIntent.id}`
          );

        if (!payment && isSANB(checkoutSession?.id)) {
          const payments = await Payments.find({
            ...q,
            stripe_session_id: checkoutSession.id
          });

          if (payments.length > 1)
            throw new Error(
              `Unexpected amount of payments found when searched for checkout session id ${checkoutSession.id}`
            );

          [payment] = payments;
        }

        if (payment) {
          console.log('found existing payment');
          const { id } = payment;

          //
          // validate the required fields first - these must exists on the document
          //
          if (plan !== payment.plan)
            throw new Error(
              `Saved payment.plan for ${id} does not match plan from billing history sync`
            );

          if (kind !== payment.kind)
            throw new Error(
              `Saved payment.kind for ${id} does not match kind from billing history sync`
            );

          if (duration !== payment.duration)
            throw new Error(
              `Saved payment.duration for ${id} does not match duration from billing history sync`
            );

          if (paymentIntent.amount !== payment.amount)
            throw new Error(
              `Saved payment.amount for ${id} does not match amount from billing history sync from stripe payment intent ${paymentIntent.id}`
            );

          if (stripeCharge.payment_method_details.card.brand !== payment.method)
            throw new Error(
              `Saved payment.method does not match method from billing history sync from stripe payment intent ${paymentIntent.id}`
            );

          //
          // the non-required fields need to be validated and set
          //
          if (
            isSANB(payment.exp_month) &&
            stripeCharge.payment_method_details.card.exp_month !==
              payment.exp_month
          )
            throw new Error(
              `Saved payment.exp_month does not match exp_month from billing history sync from stripe payment intent ${paymentIntent.id}`
            );

          payment.exp_month =
            stripeCharge.payment_method_details.card.exp_month;

          if (
            isSANB(payment.exp_year) &&
            stripeCharge.payment_method_details.card.exp_year !==
              payment.exp_year
          )
            throw new Error(
              `Saved payment.exp_year does not match exp_year from billing history sync from stripe payment intent ${paymentIntent.id}`
            );

          payment.exp_year = stripeCharge.payment_method_details.card.exp_year;

          if (
            isSANB(payment.last4) &&
            stripeCharge.payment_method_details.card.last4 !== payment.last4
          )
            throw new Error(
              `Saved payment.last4 does not match last4 from billing history sync from stripe payment intent ${paymentIntent.id}`
            );

          payment.last4 = stripeCharge.payment_method_details.card.last4;

          if (
            isSANB(payment.stripe_session_id) &&
            (!checkoutSession ||
              payment.stripe_session_id !== checkoutSession.id)
          ) {
            throw new Error(
              `Saved payment.stripe_session_id (${payment.stripe_session_id}) does not match billing history sync session_id ${checkoutSession.id}`
            );
          }

          payment.stripe_session_id = checkoutSession?.id;

          if (
            isSANB(payment.stripe_invoice_id) &&
            payment.stripe_invoice_id !== invoice.id
          )
            throw new Error(
              `Saved payment.stripe_invoice_id (${payment.stripe_invoice_id}) does not match billing history sync invoice.id ${invoice.id}`
            );

          payment.stripe_invoice_id = invoice?.id;

          if (
            isSANB(payment.stripe_payment_intent_id) &&
            payment.stripe_payment_intent_id !== paymentIntent.id
          )
            throw new Error(
              `Saved payment.stripe_payment_intent_id (${payment.stripe_payment_intent_id}) does not match billing history sync payment_intent.id ${paymentIntent.id}`
            );

          payment.stripe_payment_intent_id = paymentIntent.id;

          if (
            isSANB(payment.stripe_subscription_id) &&
            payment.stripe_subscription_id !== invoice.subscription
          )
            throw new Error(
              `Saved payment.stripe_subscription_id (${payment.stripe_subscription_id}) does not match billing history sync invoice.subscription invoice: ${invoice.id}, subscription: ${invoice.subscription}`
            );

          payment.stripe_subscription_id = invoice?.subscription;

          if (
            isSANB(payment.amount_refunded) &&
            payment.amount_refunded !== amountRefunded
          )
            throw new Error(
              `Saved payment.amount_refunded (${payment.amount_refunded}) does not match billing history sync stripe charge: ${stripeCharge.id}, payment_intent: ${paymentIntent.id}`
            );

          payment.amount_refunded = amountRefunded;

          await payment.save();

          console.log(
            `sucessfully synced and saved payment for stripe payment_intent ${paymentIntent.id}`
          );
        } else {
          console.log('creating new payment');
          payment = {
            user: customer._id,
            plan,
            kind,
            duration,
            amount: paymentIntent.amount,
            method: stripeCharge.payment_method_details.card.brand,
            exp_month: stripeCharge.payment_method_details.card.exp_month,
            exp_year: stripeCharge.payment_method_details.card.exp_year,
            last4: stripeCharge.payment_method_details.card.last4,
            stripe_payment_intent_id: paymentIntent?.id,
            stripe_invoice_id: invoice?.id,
            stripe_subscription_id: invoice?.subscription
          };

          await Payments.create(payment);

          console.log(
            `Successfully created new payment for stripe payment_intent ${paymentIntent.id}`
          );
        }
      } catch (err) {
        logger.error(err);
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Problem syncing billing history for ${customer.email} - payment_intent ${paymentIntent.id}`
            },
            locals: { message: err.message }
          });
        } catch {}
      }

      console.groupEnd();
    }

    // finally - check the db to see if there is any payments this script couldn't handle
    try {
      const missed = await Payments.find({
        user: customer._id,
        method: { $nin: ['unknown', 'paypal'] },
        stripe_payment_intent_id: { $exists: false }
      })
        .lean()
        .exec();

      if (missed.length > 0)
        throw new Error(
          `${customer.email} has some stripe payments that were not found and synced, please fix manually.`.concat(
            // eslint-disable-next-line unicorn/no-array-reduce
            missed.reduce((acc, miss) => {
              // eslint-disable-next-line unicorn/prefer-spread
              return acc.concat(miss.id + '<br />');
            }, 'The Payment ids are listed below: <br />')
          )
        );

      const stripePaymentCount = await Payments.countDocuments({
        user: customer._id,
        stripe_payment_intent_id: { $exists: true, $ne: null }
      });

      if (
        stripePaymentIntents.filter((pi) => pi.status === 'succeeded')
          .length !== stripePaymentCount
      )
        throw new Error(
          `The number of payment_intents from stripe does not match the number of stripe payments in the db. Please review manually.`
        );
    } catch (err) {
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `${customer.email} has stripe payments that were not synced by the sync-payment-hitories job`
          },
          locals: { message: err.message }
        });
      } catch {}
    }

    console.groupEnd();
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();

async function getAllStripePaymentIntents(stripeCustomerId) {
  let paymentIntents = [];
  let has_more = true;
  let starting_after;
  do {
    let res;
    try {
      console.log('stripeCustomerId', stripeCustomerId);
      res = await stripe.paymentIntents.list({
        customer: stripeCustomerId,
        limit: 100,
        starting_after
      });
    } catch (err) {
      console.error(err);
      throw err;
    }

    paymentIntents = [...paymentIntents, ...res.data];
    has_more = res.has_more;
    starting_after = _.last(res.data).id;
  } while (has_more);

  return paymentIntents;
}
