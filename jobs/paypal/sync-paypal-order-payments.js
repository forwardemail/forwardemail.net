const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');

const emailHelper = require('#helpers/email');
const Payments = require('#models/payment');
const logger = require('#helpers/logger');
const config = require('#config');
const { paypalAgent } = require('#helpers/paypal');

async function mapper(id) {
  const payment = await Payments.findById(id);

  if (!payment) throw new Error('Payment does not exist');

  const agent = await paypalAgent();

  //
  // if the payment was missing its transaction ID then we can
  // call the capture endpoint again which will return the ID
  //
  // (regardless we have to call this in order to get refund information)
  //
  logger.info('fetching transaction id', { payment });
  const response = await agent.get(
    `/v2/checkout/orders/${payment.paypal_order_id}`
  );

  // find the initial transaction
  const [capture] = response.body.purchase_units[0].payments.captures;
  if (!capture) throw new Error('Capture does not exist');

  let shouldSave = false;

  if (
    payment.paypal_transaction_id &&
    payment.paypal_transaction_id !== capture.id
  )
    shouldSave = true;

  if (
    new Date(payment.invoice_at).getTime() !==
    new Date(response.body.create_time).getTime()
  ) {
    shouldSave = true;
  }

  let amountRefunded = 0;
  if (capture.status === 'REFUNDED') {
    amountRefunded = payment.amount;
    logger.info('amount refunded detected', {
      amountRefunded,
      payment,
      capture
    });
  } else if (capture.status === 'PARTIALLY_REFUNDED') {
    // lookup the refund and parse the amount refunded
    const agent = await paypalAgent();
    const { body: refund } = await agent.get(
      `/v2/payments/refunds/${capture.id}`
    );
    amountRefunded = Math.round(Number(refund.amount.value) * 100);
  }

  if (payment.amount_refunded !== amountRefunded) shouldSave = true;

  if (shouldSave) {
    payment.paypal_transaction_id = capture.id;
    payment.amount_refunded = amountRefunded;
    payment.invoice_at = new Date(response.body.create_time);
    await payment.save();
  }
}

async function syncPayPalOrderPayments() {
  //
  // NOTE: PayPal's Order list API endpoint is restricted to "Partners" only
  //       (so we can't retroactively get anyone that failed on redirect or webhook)
  //
  //       In order to get it, we'd have to traverse through all transactions
  //       and then parse out `invoice_id` (which we don't currently set)
  //       because we only store `reference_id` and `custom_id` and
  //       `custom_id` is the plan in uppercase and `reference_id` is not
  //       in the API response for transaction data (at least in PayPal's example)
  //       <https://developer.paypal.com/docs/api/transaction-search/v1/>
  //
  //       (we started actually storing paypal_transaction_id on orders on 7/13/22)
  //       (so it will only work for PayPal order payments made on or after that date)
  //
  //       (note we also started storing `invoice_id` on PayPal Orders created on 7/13/22)
  //
  try {
    const ids = await Payments.distinct('_id', {
      paypal_order_id: { $exists: true },
      paypal_subscription_id: { $exists: false }
    });

    await pMapSeries(ids, mapper);
  } catch (err) {
    logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Sync PayPal Orders had an error'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }
}

module.exports = syncPayPalOrderPayments;
