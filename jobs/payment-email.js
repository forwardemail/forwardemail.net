/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort, workerData } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const pMap = require('p-map');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const setupMongoose = require('#helpers/setup-mongoose');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const { Users, Payments } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// (see `longRunning` in jobs/index.js)
const { longRunning, interval } = workerData?.job ?? {};
let isCancelled = false;
const cancelled = new AbortController();
if (parentPort)
  parentPort.on('message', (message) => {
    if (message !== 'cancel') return;
    isCancelled = true;
    cancelled.abort();
  });

// receipts that may fail in one run before the rest of it is left for the next
const MAX_FAILURES = 10;

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
    [config.userFields.hasVerifiedEmail]: true
  })
    .lean()
    .exec();

  if (!user) {
    logger.info('User does not exist or not verified');
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
    bcc = config.alertsEmail;
  } else if (payment.amount_refunded > 0) {
    if (payment.method !== 'free_beta_program') bcc = config.alertsEmail;
    $set.refund_receipt_sent_at = $set.receipt_sent_at;
  }

  // TODO: if user email is removed (e.g. `id@config.removedEmailDomain`)
  //       then attempt to look up the transaction to get the end users email
  if (user.email.endsWith(`@${config.removedEmailDomain}`)) {
    await Payments.findByIdAndUpdate(payment._id, { $set });
    return;
  }

  // send email
  try {
    await email({
      template: 'payment',
      message: {
        to: user[config.userFields.receiptEmail] || user.email,
        ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {}),
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
  } catch (err) {
    err.isCodeBug = true;
    logger.error(err);
  }
}

async function run() {
  try {
    const ids = await Payments.distinct('_id', {
      //
      // a payment is written before its user is saved (which is when the
      // plan's expiry takes it into account), so a receipt picked up in
      // between said "Plan expired" for the plan it had just paid for
      //
      updated_at: {
        $lte: dayjs().subtract(1, 'minute').toDate()
      },
      $or: [
        {
          // within the past 3 months
          invoice_at: {
            $gte: dayjs().subtract(3, 'month').toDate()
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
    // (a receipt that fails does not hold back the ones after it; once
    // `MAX_FAILURES` have failed, e.g. while none can be rendered, the
    // rest wait for the next run, and an error they share is logged once)
    let failures = 0;
    const logged = new Set();
    await pMap(
      ids,
      async (id) => {
        if (failures >= MAX_FAILURES) return;
        try {
          await mapper(id);
        } catch (err) {
          failures++;
          if (logged.has(err.message)) return;
          logged.add(err.message);
          err.isCodeBug = true;
          logger.error(err);
        }
      },
      { concurrency: 4 }
    );
  } catch (err) {
    err.isCodeBug = true;
    await logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  for (;;) {
    await run();
    if (!longRunning || !Number.isFinite(interval) || isCancelled) break;
    // (a cancel ends the wait, so bree stops without waiting out the interval)
    await delay(interval, undefined, { signal: cancelled.signal }).catch(
      () => {}
    );
    if (isCancelled) break;
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
