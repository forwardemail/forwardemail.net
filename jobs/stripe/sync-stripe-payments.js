const os = require('os');

const Stripe = require('stripe');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const dedent = require('dedent');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');

const getAllStripePaymentIntents = require('./get-all-stripe-payment-intents');

const env = require('#config/env');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const Users = require('#models/user');
const Payments = require('#models/payment');

const concurrency = os.cpus().length;
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const { STRIPE_MAPPING, STRIPE_PRODUCTS } = config.payments;
const thresholdError = new Error('Error threshold has been met');

async function syncStripePayments({ errorThreshold }) {
  const errorEmails = [];

  const stripeCustomers = await Users.find({
    [config.userFields.stripeCustomerID]: { $exists: true, $ne: null }
  })
    // sort by newest customers first
    .sort('-created_at')
    .lean()
    .exec();

  logger.info(
    `Syncing payments for ${stripeCustomers.length} stripe customers.`
  );

  async function mapper(customer) {
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
      logger.error(err, { customer });
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Problem syncing billing history for ${customer.email} - could not retrieve customer payments`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      });

      if (errorEmails.length >= errorThreshold) throw thresholdError;

      return;
    }

    // if for some reason data doesn't match between a saved
    // payment and the data we are getting from stripe, we do
    // not make any changes and send an alert for that payment
    // eslint-disable-next-line complexity
    async function paymentIntentMapper(paymentIntent) {
      logger.info(`paymentIntent ${paymentIntent.id}`);
      try {
        if (paymentIntent.status !== 'succeeded') return;

        //
        // charges includes a `data` Array with only one charge (the latest/successful)
        // (unless we explicitly filter using "payment_intent" filter for all charges)
        // <https://stripe.com/docs/api/payment_intents/object?lang=node#payment_intent_object-charges>
        //
        const [stripeCharge] = paymentIntent.charges.data;
        if (
          !stripeCharge ||
          !stripeCharge.paid ||
          stripeCharge.status !== 'succeeded'
        )
          throw new Error('No successful stripe charge on payment intent.');

        logger.info(`charge ${stripeCharge.id}`);

        let amountRefunded;
        if (stripeCharge.refunded)
          amountRefunded = stripeCharge.amount_refunded;

        const hasInvoice = isSANB(paymentIntent.invoice);

        // one time payments have no invoice nor subscription
        const isOneTime = !hasInvoice;

        // there should only ever be 1 checkout
        // session per successful payment intent
        const { data: checkoutSessions } = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id
        });

        if (checkoutSessions.length > 1)
          throw new Error('Found an unexpected # of checkout sessions');

        const [checkoutSession] = checkoutSessions;

        logger.info(`checkoutSession ${checkoutSession?.id}`);

        // invoices only on subscription payments
        let invoice;
        if (hasInvoice)
          invoice = await stripe.invoices.retrieve(paymentIntent.invoice);

        let productId;
        let priceId;
        if (_.isObject(invoice)) {
          logger.info(`invoice ${invoice.id}`);
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

        logger.info(`product ${productId}`);
        logger.info(`price ${priceId}`);

        // this logic is the same in rerieve-domain-billing
        const plan = STRIPE_PRODUCTS[productId];
        const kind = isOneTime ? 'one-time' : 'subscription';
        let durationMatch = _.keys(STRIPE_MAPPING[plan][kind]).find(
          (key) => STRIPE_MAPPING[plan][kind][key] === priceId
        );

        //
        // support legacy price ids
        // <https://github.com/forwardemail/forwardemail.net/commit/c9777a86f37741b6b7dc73483926c0f71d7d5ce8>
        //
        if (!durationMatch) {
          if (priceId === 'price_1HbLh0LFuf8FuIPJD4lYB3Jz') {
            durationMatch = '60d';
          } else if (priceId === 'price_1HbLhFLFuf8FuIPJBPD5hScR') {
            durationMatch = '90d';
          } else {
            throw new Error(
              `Invalid price id ${priceId} could not find matching duration`
            );
          }
        }

        const duration = ms(durationMatch);

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
            `There are too many payments in the system with stripe_payment_intent_id ${paymentIntent.id}. It is recommended to remove all the payments with this checkout session id and recreate with this script. Please review first to ensure this is the correct course of action.`
          );

        if (!payment && isSANB(checkoutSession?.id)) {
          const payments = await Payments.find({
            ...q,
            stripe_session_id: checkoutSession.id
          });

          if (payments.length > 1)
            throw new Error(
              `Unexpected amount of payments found when searched for checkout session id ${checkoutSession.id}. It is recommended to remove all the payments with this checkout session id and recreate with this script. Please review first to ensure this is the correct course of action.`
            );

          [payment] = payments;
        }

        if (payment) {
          logger.info('found existing payment');

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

          if (
            isSANB(payment.stripe_session_id) &&
            (!checkoutSession ||
              payment.stripe_session_id !== checkoutSession.id)
          )
            throw new Error(
              'Saved payment.stripe_session_id does not match billing history sync'.concat(
                errorDetails
              )
            );

          if (paymentIntent.amount !== payment.amount)
            throw new Error(
              'Saved payment.amount does not match amount from billing history sync'.concat(
                errorDetails
              )
            );

          if (
            isSANB(payment.stripe_invoice_id) &&
            payment.stripe_invoice_id !== invoice.id
          )
            throw new Error(
              `Saved payment.stripe_invoice_id (${payment.stripe_invoice_id}) does not match billing history sync`.concat(
                errorDetails
              )
            );

          if (
            isSANB(payment.stripe_payment_intent_id) &&
            payment.stripe_payment_intent_id !== paymentIntent.id
          )
            throw new Error(
              `Saved payment.stripe_payment_intent_id (${payment.stripe_payment_intent_id}) does not match billing history sync`.concat(
                errorDetails
              )
            );

          // always sync duration
          payment.duration = duration;

          // always sync payment method
          payment.is_apple_pay = false;
          payment.is_google_pay = false;
          if (stripeCharge.payment_method_details.type === 'card') {
            payment.method = stripeCharge.payment_method_details.card.brand;
            payment.exp_month =
              stripeCharge.payment_method_details.card.exp_month;
            payment.exp_year =
              stripeCharge.payment_method_details.card.exp_year;
            payment.last4 = stripeCharge.payment_method_details.card.last4;
            if (_.isObject(stripeCharge.payment_method_details.card.wallet)) {
              if (
                stripeCharge.payment_method_details.card.wallet.type ===
                'apple_pay'
              )
                payment.is_apple_pay = true;
              else if (
                stripeCharge.payment_method_details.card.wallet.type ===
                'google_pay'
              )
                payment.is_google_pay = true;
            }
          } else {
            payment.method = stripeCharge.payment_method_details.type;
            payment.exp_month = undefined;
            payment.exp_year = undefined;
            payment.last4 = undefined;
          }

          if (checkoutSession && isSANB(checkoutSession.client_reference_id))
            payment.reference = checkoutSession.client_reference_id;

          payment.stripe_session_id = checkoutSession?.id;
          payment.stripe_invoice_id = invoice?.id;
          payment.stripe_payment_intent_id = paymentIntent.id;
          payment.stripe_subscription_id = invoice?.subscription;
          payment.invoice_at = dayjs.unix(paymentIntent.created).toDate();
          payment.amount_refunded = amountRefunded;

          await payment.save();

          logger.info(
            `Successfully synced and saved payment for stripe payment_intent ${paymentIntent.id}`
          );
        } else {
          logger.info('creating new payment');
          payment = {
            user: customer._id,
            plan,
            kind,
            duration,
            amount: paymentIntent.amount,
            amount_refunded: amountRefunded,
            stripe_session_id: checkoutSession?.id,
            stripe_payment_intent_id: paymentIntent?.id,
            stripe_invoice_id: invoice?.id,
            stripe_subscription_id: invoice?.subscription,
            invoice_at: dayjs.unix(paymentIntent.created).toDate()
          };

          if (stripeCharge.payment_method_details.type === 'card') {
            payment.method = stripeCharge.payment_method_details.card.brand;
            payment.exp_month =
              stripeCharge.payment_method_details.card.exp_month;
            payment.exp_year =
              stripeCharge.payment_method_details.card.exp_year;
            payment.last4 = stripeCharge.payment_method_details.card.last4;
            if (_.isObject(stripeCharge.payment_method_details.card.wallet)) {
              if (
                stripeCharge.payment_method_details.card.wallet.type ===
                'apple_pay'
              )
                payment.is_apple_pay = true;
              else if (
                stripeCharge.payment_method_details.card.wallet.type ===
                'google_pay'
              )
                payment.is_google_pay = true;
            }
          } else {
            payment.method = stripeCharge.payment_method_details.type;
            payment.exp_month = undefined;
            payment.exp_year = undefined;
            payment.last4 = undefined;
          }

          if (checkoutSession && isSANB(checkoutSession.client_reference_id))
            payment.reference = checkoutSession.client_reference_id;

          await Payments.create(payment);

          logger.info(
            `Successfully created new payment for stripe payment_intent ${paymentIntent.id}`
          );
        }

        // find and save the associated user
        // so that their plan_expires_at gets updated
        const user = await Users.findById(customer._id);
        if (!user) throw new Error('User does not exist');
        await user.save();
      } catch (err) {
        hasError = true;
        logger.error(err, { customer });
        errorEmails.push({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Problem syncing billing history for ${customer.email} - payment_intent ${paymentIntent.id}`
          },
          locals: {
            message: `<pre><code>${JSON.stringify(
              parseErr(err),
              null,
              2
            )}</code></pre>`
          }
        });

        if (errorEmails.length >= errorThreshold) {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Sync Stripe payment histories hit ${errorThreshold} errors during the script`
            },
            locals: {
              message:
                'This may have occurred because of an error in the script, or the stripe service was down, or another error was causing an abnormal number of payment syncing failures'
            }
          });

          logger.error(JSON.stringify(errorEmails, null, 2));
          throw thresholdError;
        }
      }
    }

    await pMapSeries(stripePaymentIntents, paymentIntentMapper);

    // if there were any errors then return early
    if (hasError) return;

    // after we have finished syncing subscriptions
    // if the subscription itself was cancelled
    // then we need to remove it from our system
    if (isSANB(customer[config.userFields.stripeSubscriptionID])) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          customer[config.userFields.stripeSubscriptionID]
        );
        // subscription.status is enumerable field and must be one of the following:
        // - incomplete
        // - incomplete_expired
        // - trialing
        // - active
        // - past_due
        // - canceled
        // - unpaid
        if (subscription.status !== 'active') {
          // if the status was not cancelled then attempt to cancel it
          if (!['canceled', 'cancelled'].includes(subscription.status))
            await stripe.subscriptions.del(
              customer[config.userFields.stripeSubscriptionID]
            );

          // remove it from the user's account
          const user = await Users.findById(customer._id);
          if (!user) throw new Error('User does not exist');
          user[config.userFields.stripeSubscriptionID] = undefined;
          await user.save();
        }
      } catch (err) {
        logger.error(err, { customer });
      }
    }

    // check the db to see if there is any payments this script couldn't handle
    // we skip this if we had an error saving above because if we did
    // then this will send a duplicate email for this customer
    try {
      const missed = await Payments.find({
        user: customer._id,
        method: {
          $nin: ['unknown', 'paypal', 'free_beta_program', 'plan_conversion']
        },
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
    } catch (err) {
      logger.error(err, { customer });
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `${customer.email} has stripe payments that were not synced by the sync-payment-histories job`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      });

      if (errorEmails.length >= errorThreshold) {
        logger.info(`Sending ${errorEmails.length} error emails`);
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Sync Stripe payment histories hit ${errorThreshold} errors during the script`
          },
          locals: {
            message:
              'This may have occurred because of an error in the script, or the stripe service was down, or another error was causing an abnormal number of payment syncing failures'
          }
        });

        logger.error(JSON.stringify(errorEmails, null, 2));
        throw thresholdError;
      }
    }
  }

  await pMap(stripeCustomers, mapper, { concurrency });

  if (errorEmails.length > 0) {
    try {
      await Promise.all(errorEmails.map((email) => emailHelper(email)));
    } catch (err) {
      logger.error(err);
    }
  }

  logger.info('Stripe payments synced successfully');
}

module.exports = syncStripePayments;
