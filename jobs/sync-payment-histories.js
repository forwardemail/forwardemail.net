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

  for (const customer of stripeCustomers) {
    console.group(`Syncing payments for customer ${customer.email}`);
    // stripe payment_intents are source of truth for stripe payments as one is created
    // for each time a customer is charged for both one-time and subscriptions
    // we go through each successful charge and ensure there is an existing payment and
    // that if there is - all the information is correct with the invoice
    let stripePaymentIntents;
    try {
      stripePaymentIntents = await getAllStripePaymentIntents(
        customer[config.userFields.stripeCustomerID]
      );
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

      continue;
    }

    // if for some reason data doesn't match between a saved
    // payment and the data we are getting from stripe, we do
    // not make any changes and send an alert for that payment
    for (const paymentIntent of stripePaymentIntents) {
      try {
        if (paymentIntent.status !== 'succeeded') continue;

        // charges will usually just be an array of the successful charge,
        // but I think it may be possible a failed charge could be there as well
        // so we need to find the successful one for any payment details
        const stripeCharge = paymentIntent.charges.data.find(
          (charge) => charge.paid && charge.status === 'succeeded'
        );

        // TODO: what should we do with refunded charges?
        //       ignoring these for now
        if (stripeCharge.refunded) continue;

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

        if (!stripeCharge)
          throw new Error('No successful stripe charge on payment intent.');

        let checkoutSession;
        if (isOneTime || isSubscriptionCreation) {
          // there will only ever be 1 checkout
          // session per successful payment intent
          const { data: checkoutSessions } =
            await stripe.checkout.sessions.list({
              payment_intent: paymentIntent.id
            });

          if (checkoutSessions.length !== 1)
            throw new Error('Found an unexpected # of checkout sessions');

          [checkoutSession] = checkoutSessions;
        }

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

        // Once all the required/relevant information is gathered from stripe
        // we attempt to look up the payment in our system, if it already exists
        // we validate it and modify any missing params, if it doesnt, we create it
        // depending on how it was created it will have some of the following fields
        // in the $or correctly populated
        const $or = [{ stripe_payment_intent_id: paymentIntent.id }];
        if (isSANB(checkoutSession?.id))
          $or.push({ stripe_session_id: checkoutSession.id });
        if (isSANB(invoice?.subscription))
          $or.push({ stripe_subscription_id: invoice.subscription });

        const payments = await Payments.find({
          user: customer._id,
          $or
        });

        if (payments.length > 1)
          throw new Error(
            `More than 1 matching payment was found for stripe payment intent ${paymentIntent.id}`
          );

        let [payment] = payments;

        if (payment) {
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
            payment.stripe_session_id !== checkoutSession.id
          )
            throw new Error(
              `Saved payment.stripe_session_id (${payment.stripe_session_id}) does not match billing history sync session_id ${checkoutSession.id}`
            );

          payment.stripe_session_id = checkoutSession.id;

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

          await payment.save();

          console.log(
            `sucessfully synced and saved payment for stripe payment_intent ${paymentIntent.id}`
          );
        } else {
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
    }

    console.groupEnd();
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();

async function getAllStripePaymentIntents(stripeCustomerId) {
  let paymentIntents = [];
  let has_more = true;
  do {
    const res = await stripe.paymentIntents.list({
      customer: stripeCustomerId
    });

    paymentIntents = [...paymentIntents, ...res.data];

    has_more = res.has_more;
  } while (has_more);

  return paymentIntents;
}
