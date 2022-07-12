// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const { email, logger } = require('#helpers');
const { Users, Payments } = require('#models');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  // can't use `lean()` because we need payment.description virtual
  const payment = await Payments.findById(id);
  if (!payment) throw new Error('Payment does not exist');

  const user = await Users.findOne({
    _id: payment.user,
    [config.userFields.isBanned]: false,
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
    Payments.getPDFReceipt(payment, user, user[config.lastLocaleField])
  ]);

  const filename = `${dayjs(payment.invoice_at).format('YYYY-MM-DD')}-${
    payment.reference
  }.pdf`;

  // send email
  await email({
    template: 'payment',
    message: {
      to: user[config.userFields.fullEmail],
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

  await Payments.findByIdAndUpdate(payment._id, {
    $set: {
      receipt_sent_at: new Date()
    }
  });
}

(async () => {
  await mongoose.connect();

  const ids = await Payments.distinct('_id', {
    // within the past 24 hours
    invoice_at: {
      $gte: dayjs().subtract(24, 'hour').toDate()
    },
    receipt_sent_at: {
      $exists: false
    }
  });
  await pMap(ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
