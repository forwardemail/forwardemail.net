/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const mongoose = require('mongoose');
const config = require('#config');
const emailHelper = require('#helpers/email');
const Payments = require('#models/payments');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  //
  // count the number of duplicate paypal tx ids
  // and if any then email them to an admin
  //
  try {
    // (one query: every transaction id ever recorded was read and then counted
    // with a query of its own, every 30 minutes)
    const duplicates = await Payments.aggregate([
      { $match: { paypal_transaction_id: { $exists: true, $ne: null } } },
      { $group: { _id: '$paypal_transaction_id', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).allowDiskUse(true);
    const dupIds = duplicates.map((result) => result._id);
    logger.info('dupIds', { dupIds });
    if (dupIds.length > 0)
      throw new Error(
        `<p>The following duplicate PayPal transaction IDs were found:</p><ul><li>${dupIds.join(
          '</li><li>'
        )}</li></ul>`
      );
  } catch (err) {
    logger.error(err);
    // TODO: Once the culprit is determined, set "unique" to true in the Mongoose model for this property.</p>';
    err.message +=
      '<hr /><p>Once the culprit is determined, set "unique" to true in the Mongoose model for this property.</p>';
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Duplicate PayPal Transactions Detected'
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
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
