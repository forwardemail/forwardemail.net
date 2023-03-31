// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const pMapSeries = require('p-map-series');
const mongoose = require('mongoose');

const setupMongoose = require('#helpers/setup-mongoose');
const config = require('#config');
const { email, logger } = require('#helpers');
const { Users, Payments } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  // can't use `lean()` because we need payment.description virtual
  const payment = await Payments.findById(id);
  if (!payment) throw new Error('Payment does not exist');

  // if the receipt was sent somehow already then ignore it
  if (payment.amount_refunded > 0 && _.isDate(payment.refund_receipt_sent_at)) {
    logger.info('Payment refund receipt already sent');
    return;
  }

  if (payment.amount_refunded === 0 && _.isDate(payment.receipt_sent_at)) {
    logger.info('Payment receipt already sent');
    return;
  }

  const user = await Users.findOne({
    _id: payment.user,
    // NOTE: we want to send refund receipts even to banned customers
    // [config.userFields.isBanned]: false,
    [config.userFields.hasVerifiedEmail]: true
  })
    .lean()
    .exec();

  if (!user) {
    logger.info('User does not exist, not verified, or was banned');
    return;
  }

  // localize the payment
  payment.locale = user[config.lastLocaleField];

  const [receiptHTML, content] = await Promise.all([
    Payments.getPDFReceipt(payment, user, user[config.lastLocaleField], true),
    (async () => {
      const stream = await Payments.getPDFReceipt(
        payment,
        user,
        user[config.lastLocaleField]
      );
      const buffer = await getStream.buffer(stream);
      return buffer;
    })()
  ]);

  const filename = `${dayjs(payment.invoice_at).format('YYYY-MM-DD')}-${
    payment.reference
  }.pdf`;

  const $set = {
    receipt_sent_at: new Date()
  };

  let bcc;
  if (payment.method === 'plan_conversion') {
    bcc = config.email.message.from;
  } else if (payment.amount_refunded > 0) {
    if (payment.method !== 'free_beta_program') bcc = config.email.message.from;
    $set.refund_receipt_sent_at = $set.receipt_sent_at;
  }

  // TODO: if user email is removed (e.g. `id@config.removedEmailDomain`)
  //       then attempt to look up the transaction to get the end users email

  // send email
  await email({
    template: 'payment',
    message: {
      to:
        user[config.userFields.receiptEmail] ||
        user[config.userFields.fullEmail],
      ...(user[config.userFields.receiptEmail]
        ? { cc: user[config.userFields.fullEmail] }
        : {}),
      bcc,
      attachments: [
        {
          filename,
          content
        }
      ]
    },
    locals: {
      user,
      payment: payment.toObject(),
      receiptHTML
    }
  });

  await Payments.findByIdAndUpdate(payment._id, { $set });
}

(async () => {
  await setupMongoose(logger);
  try {
    const ids = await Payments.distinct('_id', {
      $or: [
        {
          // within the past 24 hours
          invoice_at: {
            $gte: dayjs().subtract(24, 'hour').toDate()
          },
          receipt_sent_at: {
            $exists: false
          }
        },
        {
          // has a refund and hasn't yet received refund receipt email
          amount_refunded: {
            $gt: 0
          },
          refund_receipt_sent_at: {
            $exists: false
          },
          // and it's not the free_beta_program method or a plan_conversion
          method: {
            $nin: ['free_beta_program', 'plan_conversion']
          }
        }
      ]
    });
    await pMapSeries(ids, mapper);
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
