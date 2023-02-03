const { promisify } = require('util');

const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const parseErr = require('parse-err');

const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const { Users, Payments } = require('#models');
const { paypalAgent, paypal } = require('#helpers/paypal');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const syncPayPalOrderPaymentByPaymentId = require('#helpers/sync-paypal-order-payment-by-payment-id');

const { PAYPAL_PLAN_MAPPING } = config.payments;

// eslint-disable-next-line complexity
async function processEvent(ctx) {
  const { body } = ctx.request;

  switch (body.event_type) {
    case 'CUSTOMER.DISPUTE.CREATED': {
      // /v1/customer/disputes/{id}/accept-claim
      // body.resource.dispute_id => dispute id
      // body.resource.disputed_transactions = [
      //   { seller_transaction_id: '...', invoice_number: 'optional' }
      // ]

      // accept claim
      const agent = await paypalAgent();
      await agent
        .post(`/v1/customer/disputes/${body.resource.dispute_id}/accept-claim`)
        .send({
          note: 'Full refund to the customer.'
        });

      if (
        !_.isArray(body.resource.disputed_transactions) ||
        !_.isObject(body.resource.disputed_transactions[0]) ||
        !isSANB(body.resource.disputed_transactions[0].seller_transaction_id)
      )
        throw new Error('Disputed transaction ID missing');

      // find the payment if it exists on our side
      const $or = [
        {
          paypal_transaction_id:
            body.resource.disputed_transactions[0].seller_transaction_id
        }
      ];

      if (isSANB(body.resource.disputed_transactions[0].invoice_number))
        $or.push({
          reference: body.resource.disputed_transactions[0].invoice_number
        });

      const payment = await Payments.findOne({ $or });

      if (!payment) throw new Error('Payment does not exist');

      const user = await Users.findById(payment.user);
      if (!user) throw new Error('User did not exist for customer');

      // cancel the user's subscription
      if (isSANB(user[config.userFields.paypalSubscriptionID])) {
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${
              user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
        } catch (err) {
          ctx.logger.error(err);
        }

        user[config.userFields.paypalSubscriptionID] = undefined;
        await user.save();
      }

      // ban the user for opening a dispute
      if (!user[config.userFields.isBanned]) {
        user[config.userFields.isBanned] = true;
        // email admins that the user was banned
        await emailHelper({
          template: 'alert',
          message: {
            to: config.email.message.from,
            subject: `Customer banned for opening PayPal dispute: ${user.email}`
          },
          locals: {
            message: `Customer with email ${user.email} was banned for opening dispute ID ${body.resource.dispute_id}.`
          }
        });
        await user.save();
      }

      break;
    }

    case 'BILLING.SUBSCRIPTION.EXPIRED':
    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
    case 'BILLING.SUBSCRIPTION.SUSPENDED':
    case 'BILLING.SUBSCRIPTION.CANCELLED': {
      // body.resource.subscriber.email_address
      // body.resource.subscriber.payer_id
      // body.resource.id => subscription ID
      // body.resource.status === 'CANCELLED'
      const $or = [];

      if (
        _.isObject(body.resource.subscriber) &&
        isSANB(body.resource.subscriber.payer_id)
      )
        $or.push({
          [config.userFields.paypalPayerID]: body.resource.subscriber.payer_id
        });

      if (isSANB(body.resource.id))
        $or.push({
          [config.userFields.paypalSubscriptionID]: body.resource.id
        });

      if ($or.length === 0) throw new Error('$or was empty');

      const user = await Users.findOne({ $or });

      // there will not be a user found if the user cancelled from our site
      // because we have logic to unset paypal subscription id from the user obj
      // in logic such as when a user downgrades within 30d or cancels auto-renew
      if (
        user && // cancel the user's subscription
        isSANB(user[config.userFields.paypalSubscriptionID])
      ) {
        try {
          const agent = await paypalAgent();
          await agent.post(
            `/v1/billing/subscriptions/${
              user[config.userFields.paypalSubscriptionID]
            }/cancel`
          );
        } catch (err) {
          ctx.logger.error(err);
        }

        user[config.userFields.paypalSubscriptionID] = undefined;
        await user.save();
      }

      break;
    }

    case 'PAYMENT.SALE.COMPLETED':
    case 'BILLING.SUBSCRIPTION.ACTIVATED': {
      // 'PAYMENT.SALE.COMPLETED'
      // body.resource.id => paypal transaction id
      // body.resource.billing_agreement_id => paypal subscription id
      //
      // 'BILLING.SUBSCRIPTION.ACTIVATED'
      // body.resource.subscriber.email_address
      // body.resource.subscriber.payer_id
      // body.resource.id => subscription ID
      // body.resource.status === 'ACTIVE'
      let res;
      const agent = await paypalAgent();
      if (body.event_type === 'PAYMENT.SALE.COMPLETED') {
        res = await agent.get(
          `/v1/billing/subscriptions/${body.resource.billing_agreement_id}`
        );
      } else if (body.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
        res = await agent.get(`/v1/billing/subscriptions/${body.resource.id}`);
      } else {
        throw new Error('Unknown event type');
      }

      // validate subscription is active
      if (
        !_.isObject(res.body) ||
        ['SUSPENDED', 'CANCELLED', 'EXPIRED'].includes(res.body.status) ||
        !isSANB(res.body.id) ||
        !isSANB(res.body.plan_id) ||
        !_.isObject(res.body.subscriber) ||
        !isSANB(res.body.subscriber.payer_id)
      )
        return;

      // lookup the user
      const $or = [
        {
          [config.userFields.paypalPayerID]: res.body.subscriber.payer_id
        },
        {
          [config.userFields.paypalSubscriptionID]: res.body.id
        }
      ];

      const user = await Users.findOne({ $or });

      if (isSANB(user[config.userFields.paypalSubscriptionID])) {
        // if subscription does not match, then cancel the old one
        if (user[config.userFields.paypalSubscriptionID] !== res.body.id) {
          try {
            const agent = await paypalAgent();
            await agent.post(
              `/v1/billing/subscriptions/${
                user[config.userFields.paypalSubscriptionID]
              }/cancel`
            );
          } catch (err) {
            ctx.logger.error(err);
          }
        }

        // and then set this as the new one
        user[config.userFields.paypalSubscriptionID] = res.body.id;
        await user.save();
      }

      // create/sync payments for user using the subscription
      const errorEmails = await syncPayPalSubscriptionPaymentsByUser([], user);

      if (errorEmails.length > 0) {
        try {
          await Promise.all(errorEmails.map((email) => emailHelper(email)));
        } catch (err) {
          ctx.logger.error(err);
        }
      }

      // if the plans don't match up then sync them
      let selectedPlan;
      for (const plan of Object.keys(PAYPAL_PLAN_MAPPING)) {
        if (selectedPlan) break;
        for (const duration of Object.keys(PAYPAL_PLAN_MAPPING[plan])) {
          if (PAYPAL_PLAN_MAPPING[plan][duration] === res.body.plan_id) {
            selectedPlan = plan;
            break;
          }
        }
      }

      if (!selectedPlan) throw new Error('Plan did not exist');

      if (user.plan !== selectedPlan) {
        user.plan = selectedPlan;
        // get the first payment for the subscription and use the invoice_at
        const payment = await Payments.findOne(
          {
            user: user._id,
            [config.userFields.paypalSubscriptionID]: res.body.id
          },
          null,
          { sort: { invoice_at: 1 } }
        );
        if (!payment)
          throw new Error(
            'Payment was missing for user subscription and plan set at was not set'
          );
        user[config.userFields.planSetAt] = payment.invoice_at;
      }

      // finally save the user
      await user.save();
      break;
    }

    case 'PAYMENT.SALE.REVERSED':
    case 'PAYMENT.SALE.REFUNDED': {
      // body.resource.id => paypal transaction id
      const payment = await Payments.findOne({
        paypal_transaction_id: body.resource.id
      });
      if (!payment) throw new Error('Payment does not exist');

      // lookup the user
      const user = await Users.findById(payment.user);
      if (!user) throw new Error('User did not exist for customer');

      // sync payments for user depending if it was an order or subscription
      if (isSANB(payment.paypal_order_id)) {
        await syncPayPalOrderPaymentByPaymentId(payment._id);
      } else if (isSANB(payment[config.userFields.paypalSubscriptionID])) {
        const errorEmails = await syncPayPalSubscriptionPaymentsByUser(
          [],
          user
        );

        if (errorEmails.length > 0) {
          try {
            await Promise.all(errorEmails.map((email) => emailHelper(email)));
          } catch (err) {
            ctx.logger.error(err);
          }
        }
      } else {
        throw new Error('Unknown payment type');
      }

      break;
    }

    // one-time payments
    case 'CHECKOUT.ORDER.APPROVED': {
      // body.resource.id => checkout ID (also known as paypal_order_id to us)
      // body.resource.purchase_units[0].reference_id => user ID in our system
      // body.resource.purchase_units[0].invoice_id => payment reference
      // body.resource.payer.email_address
      // body.resource.payer.payer_id
      const agent = await paypalAgent();
      const res = await agent.get(`/v2/checkout/orders/${body.resource.id}`);

      if (
        !_.isObject(res.body) ||
        res.body.intent !== 'CAPTURE' ||
        !['APPROVED', 'COMPLETED'].includes(res.body.status) ||
        !_.isArray(res.body.purchase_units) ||
        _.isEmpty(res.body.purchase_units) ||
        !_.isObject(res.body.payer) ||
        !isSANB(res.body.payer.payer_id)
      )
        throw new Error('Invalid checkout order');

      if (!isSANB(res.body.purchase_units[0].reference_id))
        throw new Error(
          'User ID missing in reference ID in purchase units array'
        );

      // lookup the user
      const user = await Users.findOne({
        id: res.body.purchase_units[0].reference_id
      });
      if (!user) throw new Error('User did not exist for customer');

      // store customer
      user[config.userFields.paypalPayerID] = res.body.payer.payer_id;
      await user.save();

      // get the time the payment was made
      let now = new Date();
      if (res.body.create_time) {
        now = new Date(res.body.create_time);
      } else if (
        res.body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
      ) {
        now = new Date(
          res.body.purchase_units[0].payments.captures[0].create_time
        );
      }

      if (!_.isDate(now)) now = new Date();

      // if the user's plan doesn't match up or if they never had a plan set date
      // then adjust the plan set date to the current time or date parsed
      const plan = res.body.purchase_units[0].custom_id.toLowerCase();
      if (user.plan !== plan) {
        user.plan = plan;
        user[config.userFields.planSetAt] = now;
        await user.save();
      } else if (!_.isDate(user[config.userFields.planSetAt])) {
        user[config.userFields.planSetAt] = now;
        await user.save();
      }

      let transactionId;

      // parse the transaction id
      if (res?.body?.purchase_units?.[0]?.payments?.captures?.[0]?.id)
        transactionId = res?.body.purchase_units[0].payments.captures[0].id;

      // capture payment
      try {
        const agent = await paypalAgent();
        const response = await agent.post(
          `/v2/checkout/orders/${res.body.id}/capture`
        );
        // parse the transaction id
        if (response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.id)
          transactionId =
            response.body.purchase_units[0].payments.captures[0].id;
      } catch (err) {
        ctx.logger.warn(err);
        if (!err.status || err.status !== 422) {
          // email admins here
          emailHelper({
            template: 'alert',
            message: {
              to: config.email.message.from,
              subject: `Error while capturing PayPal order payment for ${user.email}`
            },
            locals: {
              message: `<pre><code>${JSON.stringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
          })
            .then()
            .catch((err) => ctx.logger.fatal(err));
        }
      }

      // NOTE: we don't want to re-create the payment if the redirect after paypal checkout already did
      const $or = [
        {
          user: user._id,
          paypal_order_id: res.body.id
        },
        {
          user: user._id,
          reference: res.body.purchase_units[0].invoice_id
        }
      ];
      if (transactionId)
        $or.push({
          user: user._id,
          paypal_transaction_id: transactionId
        });

      let payment = await Payments.findOne({ $or });

      if (!payment) {
        // we will take the amount and divide it by the cost per the custom_id
        // in order to determine the duration the customer purchased/added
        const amount = Number(
          res.body.purchase_units[0].items[0].unit_amount.value
        );
        const months = Math.round(amount / (plan === 'team' ? 9 : 3));
        if (!_.isFinite(months) || months < 1)
          throw new Error('Months was not finite');

        payment = await Payments.create({
          user: user._id,
          reference: res.body.purchase_units[0].invoice_id,
          amount: Number.parseInt(amount * 100, 10), // convert to cents for consistency with stripe
          method: 'paypal',
          duration:
            months >= 12
              ? ms(`${Math.round(months / 12)}y`)
              : ms(`${Math.round(months * 30)}d`),
          plan,
          kind: 'one-time',
          paypal_order_id: res.body.id,
          paypal_transaction_id: transactionId,
          invoice_at: now
        });

        // log the payment just for sanity
        ctx.logger.info('paypal payment created', { payment });

        // save the user
        await user.save();
      }

      break;
    }

    // TODO: handle other events
    default:
  }
}

// <https://developer.paypal.com/docs/api-basics/notifications/webhooks/>

async function webhook(ctx) {
  try {
    const response = await promisify(
      paypal.notification.webhookEvent.verify,
      paypal.notification.webhookEvent
    )(ctx.request.headers, ctx.request.body, env.PAYPAL_WEBHOOK_ID);

    // throw an error if something was wrong
    if (!_.isObject(response) || response.verification_status !== 'SUCCESS')
      throw Boom.badRequest(ctx.translateError('INVALID_PAYPAL_SIGNATURE'));

    // return a response to acknowledge receipt of the event
    ctx.body = { received: true };
  } catch (err) {
    ctx.throw(err);
    return;
  }

  // run in background
  processEvent(ctx)
    .then()
    .catch((err) => {
      ctx.logger.fatal(err);
      // email admin errors
      emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Error with PayPal Webhook (Event ID ${ctx.request.body.id})`
        },
        locals: {
          message: `<pre><code>${JSON.stringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));
    });
}

module.exports = webhook;
