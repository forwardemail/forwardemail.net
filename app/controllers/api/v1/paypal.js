/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { promisify } = require('node:util');
const { setTimeout } = require('node:timers/promises');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const { Users, Payments } = require('#models');
const { paypalAgent, paypal } = require('#helpers/paypal');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const syncPayPalOrderPaymentByPaymentId = require('#helpers/sync-paypal-order-payment-by-payment-id');
const retryPayPalRequest = require('#helpers/retry-paypal-request');

const { PAYPAL_PLAN_MAPPING } = config.payments;

async function processEvent(ctx) {
  const { body } = ctx.request;

  switch (body.event_type) {
    case 'CUSTOMER.DISPUTE.CREATED': {
      // /v1/customer/disputes/{id}/accept-claim
      // body.resource.dispute_id => dispute id
      // body.resource.disputed_transactions = [
      //   { seller_transaction_id: '...', invoice_number: 'optional' }
      // ]

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

      // accept claim using appropriate agent based on payment legacy status
      // Early return for deprecated legacy PayPal agent
      if (payment.is_legacy_paypal) {
        ctx.logger.debug('Skipping legacy PayPal agent usage - deprecated');
        break;
      }

      const agent = await paypalAgent();
      await agent
        .post(`/v1/customer/disputes/${body.resource.dispute_id}/accept-claim`)
        .send({
          note: 'Full refund to the customer.'
        });

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
            to: config.alertsEmail,
            subject: `Customer banned for opening PayPal dispute: ${user.email}`
          },
          locals: {
            message: `Customer with email ${user.email} was banned for opening dispute ID ${body.resource.dispute_id}.`
          }
        });
        await user.save();
        // clear banned cache
        ctx.client
          .del('banned_user_ids')
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      break;
    }

    //
    // Handle payment failure - send notification but don't cancel immediately
    // PayPal will retry the payment automatically
    // User has 15-day grace period during which services remain active
    //
    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
      if (!isSANB(body.resource.id)) throw new Error('Subscription ID missing');

      const user = await Users.findOne({
        [config.userFields.paypalSubscriptionID]: body.resource.id
      });

      if (user) {
        // Send payment failed notification email
        try {
          await emailHelper({
            template: 'alert',
            message: {
              to: user[config.userFields.receiptEmail] || user.email,
              ...(user[config.userFields.receiptEmail]
                ? { cc: user.email }
                : {}),
              subject: 'Payment failed - action required'
            },
            locals: {
              message: `<p>We were unable to process your subscription payment.</p>
                <p>PayPal will automatically retry the payment. To avoid any service interruption, please ensure your payment method is up to date.</p>
                <p>You have a 15-day grace period during which your services will remain active.</p>
                <p><a href="${config.urls.web}/my-account/billing" class="btn btn-dark btn-lg">Manage Billing</a></p>`,
              locale: user[config.lastLocaleField]
            }
          });

          ctx.logger.info(
            `Sent payment failed notification to ${user.email} for PayPal subscription`
          );
        } catch (err) {
          ctx.logger.error(err);
        }
      }

      break;
    }

    //
    // Handle subscription cancellation/expiration/suspension
    // These events indicate the subscription is no longer active
    //
    case 'BILLING.SUBSCRIPTION.EXPIRED':
    case 'BILLING.SUBSCRIPTION.SUSPENDED':
    case 'BILLING.SUBSCRIPTION.CANCELLED': {
      // body.resource.subscriber.email_address
      // body.resource.subscriber.payer_id
      // body.resource.id => subscription ID
      // body.resource.status === 'CANCELLED'
      if (!isSANB(body.resource.id)) throw new Error('Subscription ID missing');

      const user = await Users.findOne({
        [config.userFields.paypalSubscriptionID]: body.resource.id
      });

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

      let user = await Users.findOne({
        [config.userFields.paypalSubscriptionID]: res.body.id
      });

      //
      // NOTE: if there is no user then we can assume that they didn't
      //       get redirected post-checkout and so their subscription isn't assigned to them yet
      //
      if (!user) {
        // attempt to find the user by their email address
        user = await Users.findOne({
          email: res.body.subscriber.email_address.toLowerCase(),
          [config.userFields.paypalSubscriptionID]: { $exists: false },
          [config.userFields.paypalPayerID]: { $exists: false }
        });
        // save user's subscription ID and payer ID to their account
        if (user) {
          user[config.userFields.paypalSubscriptionID] = res.body.id;
          user[config.userFields.paypalPayerID] = res.body.subscriber.payer_id;
          await user.save();
        }
      }

      // if no user yet, then wait 5m since the user could still be redirecting post checkout
      if (!user && !ctx.isProcessed) {
        await setTimeout(ms('5m'));
        ctx.isProcessed = true;
        await processEvent(ctx);
        return;
      }

      if (!user) {
        //
        // NOTE: cancel and refund and email subscriber email address and CC admins
        //
        if (res.body.status === 'ACTIVE') {
          try {
            const agent = await paypalAgent();
            await agent.post(`/v1/billing/subscriptions/${res.body.id}/cancel`);
          } catch (err) {
            ctx.logger.error(err);
          }
        }

        emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            cc: res.body.subscriber.email_address.toLowerCase(),
            subject: `PayPal Subscription Issue (${res.body.id})`
          },
          locals: {
            message: `Your PayPal subscription could not be synchronized properly since your PayPal email address differs from your Forward Email account.  Please try to checkout again if necessary with PayPal and ensure that you proceed to our website after you have completed your PayPal transaction.  Visit <a target="_blank" rel="noopener noreferrer" href="${config.urls.web}/my-account/billing">${config.urls.web}/my-account/billing</a> to get your latest billing information.  We will automatically process your refund if necessary.`
          }
        })
          .then()
          .catch((err) => ctx.logger.fatal(err));
      }

      // there will not be a user found if the user cancelled from our site
      // because we have logic to unset paypal subscription id from the user obj
      // in logic such as when a user downgrades within 30d or cancels auto-renew
      if (
        user && // cancel the user's subscription
        isSANB(user[config.userFields.paypalSubscriptionID])
      ) {
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

      if (user) {
        // create/sync payments for user using the subscription
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
      }

      break;
    }

    case 'PAYMENT.CAPTURE.REFUNDED':
    case 'PAYMENT.CAPTURE_REVERSED':
    case 'PAYMENT.SALE.REVERSED':
    case 'PAYMENT.SALE.REFUNDED': {
      // if the body contained body.resource.sale_id => paypal transaction id
      // else if the body.resource_type was refund => lookup refund by body.id => get id
      let payment;
      if (isSANB(body?.resource?.sale_id)) {
        payment = await Payments.findOne({
          paypal_transaction_id: body.resource.sale_id
        });
      } else if (isSANB(body?.resource?.invoice_id)) {
        payment = await Payments.findOne({
          reference: body.resource.invoice_id
        });
      } else if (_.isArray(body?.resource?.links)) {
        const str = 'https://api.paypal.com/v2/payments/captures/';
        const link = body.resource.links.find((link) =>
          link.href.startsWith(str)
        );
        if (!link) throw new Error('Link not found with capture endpoint');
        // the `id` here is a refund so we need to get refund details
        // and then find the link with '/v2/payments/captures/' in it
        const id = link.href.replace(str, '');
        payment = await Payments.findOne({
          paypal_transaction_id: id
        });
      } else {
        throw new TypeError('No valid sale_id nor id was found');
      }

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
        !['APPROVED', 'COMPLETED', 'CREATED'].includes(res.body.status) ||
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

      // capture payment with retry logic for PayPal infrastructure delays
      try {
        await retryPayPalRequest(
          async () => {
            const agent = await paypalAgent();
            const response = await agent.post(
              `/v2/checkout/orders/${res.body.id}/capture`
            );
            // parse the transaction id
            if (response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.id)
              transactionId =
                response.body.purchase_units[0].payments.captures[0].id;
          },
          {
            retries: 3,
            additionalStatusCodes: [404], // PayPal infrastructure delays cause 404s
            calculateDelay: (count) => Math.round(1000 * 2 ** count) // 2s, 4s, 8s
          }
        );
      } catch (err) {
        ctx.logger.warn(err, {
          paypal_order_id: res.body.id,
          user_email: user.email,
          retry_count: err.retryCount || 0,
          max_retries: err.maxRetries || 0
        });

        // Only email admins for non-422 errors and include retry information
        if (!err.status || err.status !== 422) {
          const isRetryExhausted = err.retryCount >= (err.maxRetries || 0);
          emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `${
                isRetryExhausted ? 'CRITICAL: ' : ''
              }Error while capturing PayPal order payment for ${user.email}${
                isRetryExhausted ? ' (Retries Exhausted)' : ''
              }`
            },
            locals: {
              message: `<pre><code>PayPal Order ID: ${res.body.id}
User Email: ${user.email}
Retry Count: ${err.retryCount || 0}/${err.maxRetries || 0}
Error Status: ${err.status || err.statusCode || 'Unknown'}

${safeStringify(parseErr(err), null, 2)}</code></pre>`
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
          invoice_at: now,
          stack: new Error('stack').stack
        });

        // log the payment just for sanity
        ctx.logger.info('paypal payment created', { payment });

        // save the user
        await user.save();
      }

      break;
    }

    // Payment approval reversed - customer approved but payment wasn't captured in time
    // Payment approval reversed - delete payment and cancel order
    case 'CHECKOUT.PAYMENT-APPROVAL.REVERSED': {
      if (!body?.resource?.id) {
        const err = new TypeError(
          'PayPal order ID missing from CHECKOUT.PAYMENT-APPROVAL.REVERSED webhook'
        );
        ctx.logger.error(err);
        throw err;
      }

      if (!body?.resource?.purchase_units?.[0]?.reference_id) {
        const err = new TypeError(
          'Reference ID missing from CHECKOUT.PAYMENT-APPROVAL.REVERSED webhook'
        );
        ctx.logger.error(err);
        throw err;
      }

      const user = await Users.findOne({
        id: body.resource.purchase_units[0].reference_id
      });

      if (!user) {
        ctx.logger.warn(
          'User not found for CHECKOUT.PAYMENT-APPROVAL.REVERSED event',
          {
            paypal_order_id: body.resource.id,
            reference_id: body.resource.purchase_units[0].reference_id
          }
        );
        break;
      }

      // Find the payment record if it exists
      const $or = [
        {
          user: user._id,
          paypal_order_id: body.resource.id
        }
      ];

      if (body?.resource?.purchase_units?.[0]?.invoice_id) {
        $or.push({
          user: user._id,
          reference: body.resource.purchase_units[0].invoice_id
        });
      }

      const payment = await Payments.findOne({ $or });

      if (payment) {
        ctx.logger.warn(
          'Payment approval reversed by PayPal - deleting payment record',
          {
            payment_id: payment._id,
            paypal_order_id: body.resource.id,
            user_email: user.email,
            amount: payment.amount,
            plan: payment.plan
          }
        );

        // Attempt to cancel the order on PayPal's side
        try {
          const cancelResponse = await paypalAgent.post(
            `/v2/checkout/orders/${body.resource.id}/cancel`,
            {
              headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': `cancel-${body.resource.id}-${Date.now()}`
              }
            }
          );

          ctx.logger.info('Successfully cancelled PayPal order', {
            paypal_order_id: body.resource.id,
            cancel_response: cancelResponse.body
          });
        } catch (cancelErr) {
          ctx.logger.warn(
            'Failed to cancel PayPal order (order may already be cancelled)',
            {
              paypal_order_id: body.resource.id,
              error: cancelErr.message
            }
          );
        }

        // Delete the payment record
        await Payments.findByIdAndRemove(payment._id);

        ctx.logger.info(
          'Payment record deleted due to PayPal approval reversal',
          {
            payment_id: payment._id,
            paypal_order_id: body.resource.id,
            user_email: user.email
          }
        );
      } else {
        ctx.logger.warn(
          'Payment record not found for CHECKOUT.PAYMENT-APPROVAL.REVERSED event',
          {
            paypal_order_id: body.resource.id,
            user_email: user.email
          }
        );
      }

      // Send email notification to user
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: user.email,
            cc: config.alertsEmail,
            subject: 'Payment Processing Issue - Please Retry Your Payment'
          },
          locals: {
            user: user.toObject(),
            message: `
<p>Hello ${user[config.userFields.fullEmail]},</p>

<p>We encountered an issue processing your recent PayPal payment due to PayPal's infrastructure problems.</p>

<p><strong>What happened:</strong></p>
<ul>
<li>PayPal approved your payment but then automatically reversed it</li>
<li>No charge was made to your account</li>
<li>Your payment attempt has been cancelled</li>
</ul>

<p><strong>Next steps:</strong></p>
<ol>
<li><strong>Please retry your payment</strong> by visiting your <a href="${
              config.urls.web
            }/my-account/billing">account billing page</a></li>
<li>Consider using a credit card directly instead of PayPal for more reliable processing</li>
<li>If you continue to experience issues, please contact our support team</li>
</ol>

<p><strong>Why this happened:</strong></p>
<p>This issue is caused by PayPal's infrastructure problems, not your account or payment method. PayPal has had <a href="https://forwardemail.net/blog/docs/paypal-api-disaster-11-years-missing-features-broken-promises">documented API issues for over 11 years</a> that affect payment processing reliability.</p>

<p>We apologize for any inconvenience. This is entirely due to PayPal's technical limitations.</p>

<p>Best regards,<br>Forward Email Team</p>
            `
          }
        });
      } catch (err) {
        ctx.logger.error(
          'Failed to send user notification for CHECKOUT.PAYMENT-APPROVAL.REVERSED',
          err
        );
      }

      // Send detailed notification to team
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            cc: user.email,
            subject: `PayPal Payment Approval Reversed - ${user.email} - Order ${body.resource.id}`
          },
          locals: {
            message: `
<h3>PayPal Payment Approval Reversed - Payment Deleted</h3>

<p><strong>User Details:</strong></p>
<ul>
<li>Email: ${user.email}</li>
<li>User ID: ${user.id}</li>
<li>Plan: ${user.plan}</li>
</ul>

<p><strong>PayPal Details:</strong></p>
<ul>
<li>Order ID: ${body.resource.id}</li>
<li>Payer Email: ${body?.resource?.payer?.email_address || 'N/A'}</li>
<li>Payer ID: ${body?.resource?.payer?.payer_id || 'N/A'}</li>
<li>Invoice ID: ${body?.resource?.purchase_units?.[0]?.invoice_id || 'N/A'}</li>
</ul>

<p><strong>Actions Taken:</strong></p>
<ul>
<li>✅ Payment record deleted from database</li>
<li>✅ Attempted to cancel order on PayPal side</li>
<li>✅ User notified to retry payment</li>
</ul>

<p><strong>Root Cause:</strong></p>
<p>This is another example of PayPal's systematic infrastructure failures documented in our <a href="https://forwardemail.net/blog/docs/paypal-api-disaster-11-years-missing-features-broken-promises">PayPal API disaster blog post</a>.</p>

<p><strong>Recommended Action:</strong></p>
<p>Monitor if this user successfully retries with a different payment method. Consider reaching out proactively if they don't retry within 24 hours.</p>
            `
          }
        });
      } catch (err) {
        ctx.logger.error(
          'Failed to send team notification for CHECKOUT.PAYMENT-APPROVAL.REVERSED',
          err
        );
      }

      break;
    }

    // TODO: handle other events
    default:
  }
}

// <https://developer.paypal.com/docs/api-basics/notifications/webhooks/>

async function webhook(ctx) {
  let response;
  try {
    response = await promisify(
      paypal.notification.webhookEvent.verify,
      paypal.notification.webhookEvent
    )(ctx.request.headers, ctx.request.body, env.PAYPAL_WEBHOOK_ID);

    // throw an error if something was wrong
    if (!_.isObject(response) || response.verification_status !== 'SUCCESS')
      throw Boom.badRequest(ctx.translateError('INVALID_PAYPAL_SIGNATURE'));
  } catch {
    response = await promisify(
      paypal.notification.webhookEvent.verify,
      paypal.notification.webhookEvent
    )(ctx.request.headers, ctx.request.body, env.PAYPAL_WEBHOOK_ID_LEGACY);

    // throw an error if something was wrong
    if (!_.isObject(response) || response.verification_status !== 'SUCCESS')
      throw Boom.badRequest(ctx.translateError('INVALID_PAYPAL_SIGNATURE'));
  }

  // return a response to acknowledge receipt of the event
  ctx.body = { received: true };

  // run in background
  processEvent(ctx)
    .then()
    .catch((err) => {
      ctx.logger.fatal(err);
      // email admin errors
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Error with PayPal Webhook (Event ID ${ctx.request.body.id})`
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
        .catch((err) => ctx.logger.fatal(err));
    });
}

module.exports = webhook;
