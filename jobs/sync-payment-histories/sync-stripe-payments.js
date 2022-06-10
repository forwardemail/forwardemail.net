/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
/* eslint-disable complexity */
const Stripe = require('stripe');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const dedent = require('dedent');
const dayjs = require('dayjs-with-plugins');

const getAllStripePaymentIntents = require('./get-all-stripe-payment-intents');

const env = require('#config/env');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const Users = require('#models/user');
const Payments = require('#models/payment');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const { STRIPE_MAPPING, STRIPE_PRODUCTS } = config.payments;

const thresholdError = new Error('Error threshold has been met');

async function syncStripePayments({ errorThreshold }) {
  const errorEmails = [];

  const stripeCustomers = await Users.find({
    [config.userFields.stripeCustomerID]: { $exists: true, $ne: null }
  })
    .lean()
    .exec();

  logger.info(
    `Syncing payments for ${stripeCustomers.length} stripe customers.`
  );

  for (const customer of stripeCustomers) {
    let hasError = false;
    logger.info(
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
      logger.info(`syncing ${stripePaymentIntents.length} payment intents`);
    } catch (err) {
      // if we couldn't get the customers payments
      // send an alert and try the next customer
      logger.error(err);
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Problem syncing billing history for ${customer.email} - could not retrieve customer payments`
        },
        locals: { message: err.message }
      });

      if (errorEmails.length >= errorThreshold) throw thresholdError;

      continue;
    }

    // if for some reason data doesn't match between a saved
    // payment and the data we are getting from stripe, we do
    // not make any changes and send an alert for that payment
    for (const paymentIntent of stripePaymentIntents) {
      logger.debug(`paymentIntent ${paymentIntent.id}`);
      try {
        if (paymentIntent.status !== 'succeeded') {
          continue;
        }

        // charges will usually just be an array of the successful charge,
        // but I think it may be possible a failed charge could be there as well
        // so we need to find the successful one for any payment details
        const stripeCharge = paymentIntent.charges.data.find(
          (charge) => charge.paid && charge.status === 'succeeded'
        );

        logger.debug(`charge ${stripeCharge?.id}`);

        let amountRefunded;
        if (stripeCharge.refunded)
          ({ amount_refunded: amountRefunded } = stripeCharge);

        const hasInvoice = isSANB(paymentIntent.invoice);

        // one time payments have no invoice nor subscription
        const isOneTime = !hasInvoice;

        if (!stripeCharge)
          throw new Error('No successful stripe charge on payment intent.');

        // there should only ever be 1 checkout
        // session per successful payment intent
        const { data: checkoutSessions } = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id
        });

        if (checkoutSessions.length > 1)
          throw new Error('Found an unexpected # of checkout sessions');

        const [checkoutSession] = checkoutSessions;

        logger.debug(`checkoutSession ${checkoutSession?.id}`);

        // invoices only on subscription payments
        let invoice;
        if (hasInvoice)
          invoice = await stripe.invoices.retrieve(paymentIntent.invoice);

        let productId;
        let priceId;
        if (_.isObject(invoice)) {
          logger.debug(`invoice ${invoice.id}`);
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

        logger.debug(`product ${productId}`);
        logger.debug(`price ${priceId}`);

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

        const q = {
          user: customer._id
        };

        let [payment, ...tooManyPayments] = await Payments.find({
          ...q,
          stripe_payment_intent_id: paymentIntent.id
        });

        if (tooManyPayments.length > 0)
          throw new Error(
            `There are too many payments in the system with stripe_payment_intent_id ${paymentIntent.id}. It is reccomended to remove all the payments with this checkout session id and recreate with this script. Please review first to ensure this is the correct course of action.`
          );

        if (!payment && isSANB(checkoutSession?.id)) {
          const payments = await Payments.find({
            ...q,
            stripe_session_id: checkoutSession.id
          });

          if (payments.length > 1)
            throw new Error(
              `Unexpected amount of payments found when searched for checkout session id ${checkoutSession.id}. It is reccomended to remove all the payments with this checkout session id and recreate with this script. Please review first to ensure this is the correct course of action.`
            );

          [payment] = payments;
        }

        if (payment) {
          logger.debug('found existing payment');

          const { id } = payment;

          const errorDetails = dedent`
            <br/>
            <br/> Forward Email Payment id: ${id}
            <br/> Stripe payment_intent id: ${paymentIntent.id}
            <br/> Stripe charge id: ${stripeCharge?.id}
            <br/> Stripe checkout_session id: ${checkoutSession?.id}
            <br/> Stripe invoice id: ${invoice?.id}
            <br/> Stripe subscription id: ${invoice?.subscription}
            <br/> Stripe product id: ${productId}
            <br/> Stripe price id: ${priceId}
            <br/> Stripe created: ${dayjs
              .unix(paymentIntent.created)
              .format('MM/DD/YY')}
          `;

          //
          // validate the required fields first - these must exists on the document
          //
          if (plan !== payment.plan)
            throw new Error(
              'Saved payment.plan does not match plan from billing history sync.'.concat(
                errorDetails
              )
            );

          if (kind !== payment.kind)
            throw new Error(
              'Saved payment.kind does not match kind from billing history sync'.concat(
                errorDetails
              )
            );

          if (duration !== payment.duration)
            throw new Error(
              'Saved payment.duration does not match duration from billing history sync'.concat(
                errorDetails
              )
            );

          if (paymentIntent.amount !== payment.amount)
            throw new Error(
              'Saved payment.amount does not match amount from billing history sync'.concat(
                errorDetails
              )
            );

          if (stripeCharge.payment_method_details.card.brand !== payment.method)
            throw new Error(
              'Saved payment.method does not match method from billing history sync'.concat(
                errorDetails
              )
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
              'Saved payment.exp_month does not match exp_month from billing history sync'.concat(
                errorDetails
              )
            );

          payment.exp_month =
            stripeCharge.payment_method_details.card.exp_month;

          if (
            isSANB(payment.exp_year) &&
            stripeCharge.payment_method_details.card.exp_year !==
              payment.exp_year
          )
            throw new Error(
              'Saved payment.exp_year does not match exp_year from billing history sync'.concat(
                errorDetails
              )
            );

          payment.exp_year = stripeCharge.payment_method_details.card.exp_year;

          if (
            isSANB(payment.last4) &&
            stripeCharge.payment_method_details.card.last4 !== payment.last4
          )
            throw new Error(
              'Saved payment.last4 does not match last4 from billing history sync'.concat(
                errorDetails
              )
            );

          payment.last4 = stripeCharge.payment_method_details.card.last4;

          if (
            isSANB(payment.stripe_session_id) &&
            (!checkoutSession ||
              payment.stripe_session_id !== checkoutSession.id)
          ) {
            throw new Error(
              'Saved payment.stripe_session_id does not match billing history sync'.concat(
                errorDetails
              )
            );
          }

          payment.stripe_session_id = checkoutSession?.id;

          if (
            isSANB(payment.stripe_invoice_id) &&
            payment.stripe_invoice_id !== invoice.id
          )
            throw new Error(
              `Saved payment.stripe_invoice_id (${payment.stripe_invoice_id}) does not match billing history sync`.concat(
                errorDetails
              )
            );

          payment.stripe_invoice_id = invoice?.id;

          if (
            isSANB(payment.stripe_payment_intent_id) &&
            payment.stripe_payment_intent_id !== paymentIntent.id
          )
            throw new Error(
              `Saved payment.stripe_payment_intent_id (${payment.stripe_payment_intent_id}) does not match billing history sync`.concat(
                errorDetails
              )
            );

          payment.stripe_payment_intent_id = paymentIntent.id;

          if (
            isSANB(payment.stripe_subscription_id) &&
            payment.stripe_subscription_id !== invoice.subscription
          )
            throw new Error(
              `Saved payment.stripe_subscription_id (${payment.stripe_subscription_id}) does not match billing history sync`.concat(
                errorDetails
              )
            );

          payment.stripe_subscription_id = invoice?.subscription;

          if (
            isSANB(payment.amount_refunded) &&
            payment.amount_refunded !== amountRefunded
          )
            throw new Error(
              `Saved payment.amount_refunded (${payment.amount_refunded}) does not match billing history sync`.concat(
                errorDetails
              )
            );

          if (
            _.isDate(payment.invoice_at) &&
            dayjs(payment.invoice_at).format('MM/DD/YY') !==
              dayjs.unix(paymentIntent.created).format('MM/DD/YY')
          )
            throw new Error(
              `Saved payment.invoice_at (${dayjs(payment.invoice_at).format(
                'MM/DD/YY'
              )}) does not match billing history sync`.concat(errorDetails)
            );

          payment.invoice_at = dayjs.unix(paymentIntent.created).toDate();

          payment.amount_refunded = amountRefunded;

          await payment.save();

          logger.debug(
            `sucessfully synced and saved payment for stripe payment_intent ${paymentIntent.id}`
          );
        } else {
          logger.debug('creating new payment');
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
            stripe_sessions_id: checkoutSession?.id,
            stripe_payment_intent_id: paymentIntent?.id,
            stripe_invoice_id: invoice?.id,
            stripe_subscription_id: invoice?.subscription,
            invoice_at: dayjs.unix(paymentIntent.created).toDate()
          };

          await Payments.create(payment);

          logger.debug(
            `Successfully created new payment for stripe payment_intent ${paymentIntent.id}`
          );
        }
      } catch (err) {
        hasError = true;
        logger.error(err);
        errorEmails.push({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Problem syncing billing history for ${customer.email} - payment_intent ${paymentIntent.id}`
          },
          locals: { message: err.message }
        });

        if (errorEmails.length >= errorThreshold) {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Sync payment histories hit ${errorThreshold} errors during the script`
            },
            locals: {
              message:
                'This may have occurred because of an error in the script, or the stripe service was down, or another error was causing an abnormal number of payment syncing failures'
            }
          });

          throw thresholdError;
        }
      }
    }

    // finally - check the db to see if there is any payments this script couldn't handle
    // we skip this if we had an error saving above because if we did - then this will send a duplicate email
    // for this customer
    try {
      if (!hasError) {
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
              missed.reduce(
                (acc, miss) =>
                  // eslint-disable-next-line unicorn/prefer-spread
                  acc.concat(miss.id + '<br />'),
                'The Payment ids are listed below: <br />'
              )
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
            'The number of payment_intents from stripe does not match the number of stripe payments in the db. Please review manually.'
          );
      }
    } catch (err) {
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `${customer.email} has stripe payments that were not synced by the sync-payment-histories job`
        },
        locals: { message: err.message }
      });

      if (errorEmails.length >= errorThreshold) {
        logger.info(`Sending ${errorEmails.length} error emails`);
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Sync payment histories hit ${errorThreshold} errors during the script`
          },
          locals: {
            message:
              'This may have occurred because of an error in the script, or the stripe service was down, or another error was causing an abnormal number of payment syncing failures'
          }
        });

        throw thresholdError;
      }
    }
  }

  if (errorEmails.length > 0) {
    try {
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = syncStripePayments;
