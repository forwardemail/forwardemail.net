const delay = require('delay');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');

const emailHelper = require('#helpers/email');
const Payments = require('#models/payment');
const logger = require('#helpers/logger');
const config = require('#config');
const { paypalAgent } = require('#helpers/paypal');

const FIVE_SECONDS = ms('5s');

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

  let invoiceAt;
  if (response.body.create_time) {
    invoiceAt = new Date(response.body.create_time);
  } else if (
    response.body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
  ) {
    invoiceAt = new Date(
      response.body.purchase_units[0].payments.captures[0].create_time
    );
  }

  if (
    invoiceAt &&
    new Date(payment.invoice_at).getTime() !== invoiceAt.getTime()
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
    // prevent double tx id save
    if (payment.paypal_transaction_id !== capture.id) {
      const count = await Payments.countDocuments({
        paypal_transaction_id: capture.id,
        _id: {
          $ne: payment._id
        }
      });

      if (count > 0)
        throw new Error(
          `Capture ID ${capture.id} was attempting to be duplicated for payment ID ${payment.id}`
        );

      // otherwise set the tx id
      payment.paypal_transaction_id = capture.id;
    }

    payment.amount_refunded = amountRefunded;
    if (invoiceAt) payment.invoice_at = invoiceAt;
    await payment.save();
  }

  //
  // the mapper makes a max of ~4 requests per ID call
  // therefore if the limit on the PayPal API side is 50 requests per minute
  // we can do 50/4=~12.5 ids in 1 minute
  // therefore we need a delay of ~5 seconds in between each
  // 60/5 = 12 (and 12*4 = 48)
  //
  await delay(FIVE_SECONDS);
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
