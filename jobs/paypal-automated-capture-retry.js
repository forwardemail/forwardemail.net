/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const emailHelper = require('#helpers/email');
const retryPayPalRequest = require('#helpers/retry-paypal-request');
const config = require('#config');
const { Users, Payments } = require('#models');
const { paypalAgent } = require('#helpers/paypal');

const graceful = new Graceful({
  mongooses: [Mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    // Find payments that haven't been captured yet
    const expiredPayments = await Payments.find({
      method: 'paypal',
      paypal_order_id: { $exists: true, $ne: null },
      paypal_transaction_id: { $exists: false } // Not captured yet
    }).populate('user');

    logger.info(
      `Found ${expiredPayments.length} expired PayPal payments to process`
    );

    for (const payment of expiredPayments) {
      try {
        logger.info('Processing expired PayPal payment', {
          payment_id: payment._id,
          paypal_order_id: payment.paypal_order_id,
          user_email: payment.user.email,
          amount: payment.amount,
          created_at: payment.created_at
        });

        const agent = await paypalAgent();

        // First attempt to capture the payment one more time
        let captureSuccessful = false;

        try {
          const captureResult = await retryPayPalRequest(
            async () => {
              logger.log('sending request to capture');
              const response = await agent.post(
                `/v2/checkout/orders/${payment.paypal_order_id}/capture`
              );
              logger.log('response', response);
              return response;
            },
            {
              retries: 3,
              additionalStatusCodes: [404]
            }
          );

          if (captureResult?.body?.status === 'COMPLETED') {
            // Success! Update the payment record
            payment.paypal_transaction_id =
              captureResult.body.purchase_units[0].payments.captures[0].id;
            await payment.save();

            captureSuccessful = true;

            logger.info(
              'Successfully captured expired PayPal payment on retry',
              {
                payment_id: payment._id,
                paypal_order_id: payment.paypal_order_id,
                transaction_id: payment.paypal_transaction_id,
                user_email: payment.user.email
              }
            );

            // Send success notification to team
            await emailHelper({
              template: 'alert',
              message: {
                to: config.alertsEmail,
                subject: `PayPal Payment Recovered - ${payment.user.email} - $${
                  payment.amount / 100
                }`
              },
              locals: {
                message: `
<h3>PayPal Payment Successfully Recovered</h3>

<p>An expired PayPal payment was successfully captured on retry:</p>

<ul>
<li>User: ${payment.user.email}</li>
<li>Amount: $${payment.amount / 100}</li>
<li>Order ID: ${payment.paypal_order_id}</li>
<li>Transaction ID: ${payment.paypal_transaction_id}</li>
<li>Original Date: ${payment.created_at}</li>
</ul>

<p>The automated recovery system prevented a revenue loss.</p>
                `
              }
            });

            continue; // Move to next payment
          }
        } catch (captureErr) {
          if (
            captureErr?.status === 422 ||
            captureErr?.response?.status === 422
          ) {
            logger.log('Order already captured');
            const { body } = await agent.get(
              `/v2/checkout/orders/${payment.paypal_order_id}`
            );
            if (body?.purchase_units?.[0]?.payments?.captures?.[0]?.id) {
              captureSuccessful = true;
              payment.paypal_transaction_id =
                body.purchase_units[0].payments.captures[0].id;
              await payment.save();
              logger.log(
                'Updated payment with transaction id',
                payment.paypal_transaction_id
              );
            }
          } else {
            throw captureErr;
          }
        }

        // If we reach here, capture failed - delete payment and cancel order
        // But if and only if the payment was more than 3 hours ago (max time)
        const paymentCreatedAt = new Date(payment.created_at).getTime();
        const threeHoursAgo = dayjs().subtract(3, 'hours').toDate().getTime();

        if (!captureSuccessful && paymentCreatedAt < threeHoursAgo) {
          logger.warn(
            'Deleting expired PayPal payment after failed capture attempts',
            {
              payment_id: payment._id,
              paypal_order_id: payment.paypal_order_id,
              user_email: payment.user.email,
              amount: payment.amount,
              hours_elapsed: dayjs().diff(dayjs(payment.created_at), 'hours')
            }
          );

          // Attempt to cancel the order on PayPal's side
          const agent = await paypalAgent();
          await agent.post(
            `/v2/checkout/orders/${payment.paypal_order_id}/cancel`
          );

          logger.info('Successfully cancelled expired PayPal order', {
            paypal_order_id: payment.paypal_order_id
          });

          // Send notification to user about the failed payment
          await emailHelper({
            template: 'alert',
            message: {
              to: payment.user.email,
              cc: config.alertsEmail,
              subject: 'Payment Processing Failed - Please Retry Your Payment'
            },
            locals: {
              user: payment.user.toObject(),
              message: `
<p>Hello ${payment.user[config.userFields.fullEmail]},</p>

<p>We were unable to process your PayPal payment due to PayPal's infrastructure issues.</p>

<p><strong>What happened:</strong></p>
<ul>
<li>Your payment was approved by PayPal but couldn't be captured within the required timeframe</li>
<li>We attempted multiple retries over several hours</li>
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

          // Send detailed notification to team
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              cc: payment.user.email,
              subject: `PayPal Payment Failed & Deleted - ${
                payment.user.email
              } - $${payment.amount / 100}`
            },
            locals: {
              message: `
<h3>PayPal Payment Failed - Payment Deleted</h3>

<p><strong>User Details:</strong></p>
<ul>
<li>Email: ${payment.user.email}</li>
<li>User ID: ${payment.user.id}</li>
<li>Plan: ${payment.user.plan}</li>
</ul>

<p><strong>Payment Details:</strong></p>
<ul>
<li>Amount: $${payment.amount / 100}</li>
<li>Order ID: ${payment.paypal_order_id}</li>
<li>Created: ${payment.created_at}</li>
<li>Hours Elapsed: ${dayjs().diff(dayjs(payment.created_at), 'hours')}</li>
</ul>

<p><strong>Actions Taken:</strong></p>
<ul>
<li>✅ Multiple capture attempts with retry logic</li>
<li>✅ Payment record deleted from database</li>
<li>✅ Attempted to cancel order on PayPal side</li>
<li>✅ User notified to retry payment</li>
</ul>

<p><strong>Root Cause:</strong></p>
<p>This is another example of PayPal's systematic infrastructure failures documented in our <a href="https://forwardemail.net/blog/docs/paypal-api-disaster-11-years-missing-features-broken-promises">PayPal API disaster blog post</a>.</p>

<p><strong>Revenue Impact:</strong></p>
<p>Lost revenue: $${payment.amount / 100} (prevented by automated cleanup)</p>

<p><strong>Recommended Action:</strong></p>
<p>Monitor if this user successfully retries with a different payment method. Consider reaching out proactively if they don't retry within 24 hours.</p>
                `
            }
          });

          // Delete the payment record
          await Payments.findByIdAndRemove(payment._id);

          // Save the user for updated billing info
          if (payment?.user?._id) {
            const user = await Users.findById(payment.user._id);
            await user.save();
          }

          logger.info('Expired PayPal payment deleted', {
            payment_id: payment._id,
            paypal_order_id: payment.paypal_order_id,
            user_email: payment.user.email,
            amount: payment.amount
          });
        }
      } catch (err) {
        logger.error(err);
        logger.error('Error processing expired PayPal payment', {
          payment_id: payment._id,
          paypal_order_id: payment.paypal_order_id,
          error: err.message
        });
      }
    }

    logger.info('Completed processing expired PayPal payments');
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'PayPal Automated Capture Retry Error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
