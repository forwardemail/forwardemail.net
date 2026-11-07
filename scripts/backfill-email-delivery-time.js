/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// One-time migration script to backfill `delivery_time` for outbound emails
// delivered before it was stored, so My Account > Emails sorts them by the
// delivery time it shows (see `helpers/get-email-delivery-time.js`).
//
// Usage:
//   node scripts/backfill-email-delivery-time.js            # apply
//   node scripts/backfill-email-delivery-time.js --dry-run  # report only
//

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const mongoose = require('mongoose');
const Graceful = require('@ladjs/graceful');

const Emails = require('#models/emails');
const getEmailDeliveryTime = require('#helpers/get-email-delivery-time');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const DRY_RUN = process.argv.includes('--dry-run');
const BATCH_SIZE = 1000;

(async () => {
  await setupMongoose(logger);

  try {
    let updated = 0;
    let operations = [];

    const write = async () => {
      if (operations.length === 0) return;
      if (!DRY_RUN) await Emails.bulkWrite(operations, { ordered: false });
      updated += operations.length;
      operations = [];
    };

    for await (const email of Emails.find({
      delivery_time: { $exists: false },
      'deliveries.0': { $exists: true }
    })
      .select('created_at date deliveries.date')
      .lean()
      .cursor()) {
      const deliveryTime = getEmailDeliveryTime(email);
      if (deliveryTime === undefined) continue;
      operations.push({
        updateOne: {
          filter: { _id: email._id, delivery_time: { $exists: false } },
          update: { $set: { delivery_time: deliveryTime } }
        }
      });
      if (operations.length >= BATCH_SIZE) await write();
    }

    await write();

    logger.info(
      `Backfill complete: ${updated} emails ${
        DRY_RUN ? 'would be ' : ''
      }updated with their delivery time`
    );
  } catch (err) {
    logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
