/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Stripe = require('stripe');
const dayjs = require('dayjs-with-plugins');
const dedent = require('dedent');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');

const logger = require('./logger');
const ThresholdError = require('./threshold-error');
const _ = require('#helpers/lodash');
const config = require('#config');
const env = require('#config/env');
const Users = require('#models/users');
const Payments = require('#models/payments');

const { STRIPE_MAPPING, STRIPE_PRODUCTS } = config.payments;
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// if for some reason data doesn't match between a saved
// payment and the data we are getting from stripe, we do
// not make any changes and send an alert for that payment
function syncStripePaymentIntent(user) {
  return async function (errorEmails, paymentIntent) {
    logger.info(`paymentIntent ${paymentIntent.id}`);

    const q = {
      user: user._id
    };

    let stripeCharge;

    try {
      //
      // payment intent status could be "failed", "canceled", "processing"
      // or other non-complete status and so we don't want to store this if wasn't successful
      // (otherwise the user might get credit for something that wasn't successful)
      //
      if (paymentIntent.status !== 'succeeded') {
        // remove the Payment on our side if any that corresponds to this intent
        const payment = await Payments.findOne({
          ...q,
          stripe_payment_intent_id: paymentIntent.id
        });
        if (payment) {
          // remove the payment from our side
          await payment.remove();
          // find and save the associated user
          // so that their plan_expires_at gets updated
          const existingUser = await Users.findById(user._id);
          if (!existingUser) throw new Error('User does not exist');
          await existingUser.save();
        }

        return errorEmails;
      }

      //
      // charges includes a `data` Array with only one charge (the latest/successful)
      // (unless we explicitly filter using "payment_intent" filter for all charges)
      // <https://stripe.com/docs/api/payment_intents/object?lang=node#payment_intent_object-charges>
      //
      // TODO: note that we are on Stripe v10.x and v11+ has a breaking change
      //       the `paymentIntent.charges` field no longer exists (?)
      //       <https://github.com/stripe/stripe-node/blob/master/CHANGELOG.md#%EF%B8%8F-removed>
      //
      //
      [stripeCharge] = paymentIntent.charges.data;
      if (
        !stripeCharge ||
        !stripeCharge.paid ||
        stripeCharge.status !== 'succeeded'
      )
        throw new Error('No successful stripe charge on payment intent.');

      logger.info(`charge ${stripeCharge.id}`, { charge: stripeCharge });

      let amountRefunded;
      let fee;
      let exchangeRate;
      let currencyAmountRefunded;

      let { amount } = paymentIntent;
      if (stripeCharge.refunded) {
        amountRefunded = stripeCharge.amount_refunded;

        const payment = await Payments.findOne({
          ...q,
          stripe_payment_intent_id: paymentIntent.id
        });

        if (
          !_.isArray(stripeCharge.refunds.data) ||
          _.isEmpty(stripeCharge.refunds.data)
        )
          throw new Error(
            `Payment intent ID ${payment?.stripe_payment_intent_id} has currency of ${payment?.currency} without refunds object`
          );

        const [stripeChargeRefund] = stripeCharge.refunds.data;

        if (
          !isSANB(stripeChargeRefund.balance_transaction) &&
          stripeChargeRefund.balance_transaction !== null
        )
          throw new Error(
            `Payment intent ID ${payment?.stripe_payment_intent_id} has currency of ${payment?.currency} without "balance_transaction" ID in charge refund object retrieved`
          );

        //
        // NOTE: balance transaction is usually null when `stripeChargeRefund.reason = "fraudulent"`
        //
        if (stripeChargeRefund.balance_transaction === null) {
          currencyAmountRefunded = Math.abs(stripeChargeRefund.amount);
        } else {
          const balanceTransaction = await stripe.balanceTransactions.retrieve(
            stripeChargeRefund.balance_transaction
          );

          if (!balanceTransaction)
            throw new Error(
              `Payment intent ID ${payment?.stripe_payment_intent_id} is missing balance transaction for refund`
            );

          currencyAmountRefunded = Math.abs(balanceTransaction.amount);
        }
      }

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

      if (
        !isSANB(stripeCharge.balance_transaction) &&
        stripeCharge.balance_transaction !== null
      )
        throw new Error(
          `Payment intent ID ${payment.stripe_payment_intent_id} has currency of ${payment.currency} without "balance_transaction" ID in charge object retrieved`
        );

      //
      // NOTE: stripe adaptive pricing allows us to accept in foreign amount
      //       and to get the converted amount and exchange rate we need to
      //       use the balance transaction API to retrieve based off stripe
      //       charge's balance_transaction ID

      //
      // NOTE: balance transaction is usually null when `stripeChargeRefund.reason = "fraudulent"`
      //
      if (stripeCharge.balance_transaction === null) {
        amount = stripeCharge.amount;
      } else {
        const balanceTransaction = await stripe.balanceTransactions.retrieve(
          stripeCharge.balance_transaction
        );

        if (!balanceTransaction)
          throw new Error(
            `Payment intent ID ${payment.stripe_payment_intent_id} is missing balance transaction`
          );

        // sync payment amount in USD
        amount = balanceTransaction.amount;

        // sync fee
        fee = balanceTransaction.fee;

        // sync exchange rate
        exchangeRate = balanceTransaction.exchange_rate;
      }

      // always sync currency
      const { currency } = stripeCharge;

      // sync amount in currency
      const currencyAmount = stripeCharge.amount;

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
          (!checkoutSession || payment.stripe_session_id !== checkoutSession.id)
        )
          throw new Error(
            'Saved payment.stripe_session_id does not match billing history sync'.concat(
              errorDetails
            )
          );

        // TODO: uncomment this in future once migration run
        // if (paymentIntent.amount !== payment.amount)
        //   throw new Error(
        //     'Saved payment.amount does not match amount from billing history sync'.concat(
        //       errorDetails
        //     )
        //   );

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
          payment.exp_year = stripeCharge.payment_method_details.card.exp_year;
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

        if (isSANB(checkoutSession?.client_reference_id))
          payment.reference = checkoutSession.client_reference_id;

        payment.stripe_session_id = checkoutSession?.id;
        payment.stripe_invoice_id = invoice?.id;
        payment.stripe_payment_intent_id = paymentIntent.id;
        payment.stripe_subscription_id = invoice?.subscription;
        payment.invoice_at = dayjs.unix(paymentIntent.created).toDate();
        payment.amount = amount;
        payment.amount_refunded = amountRefunded;
        payment.fee = fee;
        payment.exchange_rate = exchangeRate;
        payment.currency = currency;
        payment.currency_amount = currencyAmount;
        payment.currency_amount_refunded = currencyAmountRefunded;

        await payment.save();

        logger.info(
          `Successfully synced and saved payment for stripe payment_intent ${paymentIntent.id}`
        );
      } else {
        logger.info('creating new payment');
        payment = {
          user: user._id,
          plan,
          kind,
          duration,
          amount,
          amount_refunded: amountRefunded,
          fee,
          exchange_rate: exchangeRate,
          currency,
          currency_amount: currencyAmount,
          currency_amount_refunded: currencyAmountRefunded,
          stripe_session_id: checkoutSession?.id,
          stripe_payment_intent_id: paymentIntent?.id,
          stripe_invoice_id: invoice?.id,
          stripe_subscription_id: invoice?.subscription,
          invoice_at: dayjs.unix(paymentIntent.created).toDate(),
          stack: new Error('stack').stack
        };

        if (stripeCharge.payment_method_details.type === 'card') {
          payment.method = stripeCharge.payment_method_details.card.brand;
          payment.exp_month =
            stripeCharge.payment_method_details.card.exp_month;
          payment.exp_year = stripeCharge.payment_method_details.card.exp_year;
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
      const existingUser = await Users.findById(user._id);
      if (!existingUser) throw new Error('User does not exist');
      await existingUser.save();
    } catch (err) {
      // add more debug output to error log
      err.paymentIntent = paymentIntent;
      err.q = q;
      err.user = user;
      err.stripeCharge = stripeCharge;
      err.stripeChargeRefundsData = stripeCharge?.refunds?.data;

      logger.error(err);
      errorEmails.push({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Problem syncing billing history for ${user.email} - payment_intent ${paymentIntent.id}`
        },
        locals: {
          message: `<pre><code>${safeStringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        },
        err
      });

      if (errorEmails.length >= config.stripeErrorThreshold)
        throw new ThresholdError(errorEmails.map((e) => e.err));
    }

    return errorEmails;
  };
}

module.exports = syncStripePaymentIntent;
