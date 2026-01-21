/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
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
const syncPayPalOrderPayments = require('./sync-paypal-order-payments');
const syncPayPalSubscriptionPayments = require('./sync-paypal-subscription-payments');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const emailHelper = require('#helpers/email');
const config = require('#config');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  await Promise.all([
    (async () => {
      //
      // NOTE: we have to do this in series due to PayPal 429 API rate limitations
      //       (it seems like the limit is 50 requests per minute with 5 min backoff)
      //       <https://github.com/airbytehq/airbyte/issues/4415#issue-933070375>
      //
      try {
        await syncPayPalOrderPayments();
      } catch (err) {
        await logger.error(err);
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: 'Error with job for PayPal syncing of order payments'
          },
          locals: {
            message: `<pre><code>${encode(
              safeStringify(parseErr(err), null, 2)
            )}</code></pre>`
          }
        });
      }
    })(),
    (async () => {
      // set an amount of errors that causes the script to bail out completely.
      // ex... if errorTolerance = 50, and there are 50 stripe error emails sent, the stripe function will stop looping and
      // send a final email that the script needs work or that the service is down - so as to not flood inboxes with thousands of emails
      // note that the tolerance applies to each payment provider not to the entire script
      try {
        await syncPayPalSubscriptionPayments();
      } catch (err) {
        await logger.error(err);
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject:
              'Error with job for PayPal syncing of subscription payments'
          },
          locals: {
            message: `<pre><code>${encode(
              safeStringify(parseErr(err), null, 2)
            )}</code></pre>`
          }
        });
      }
    })()
  ]);

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
