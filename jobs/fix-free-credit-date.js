/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const dayjs = require('dayjs-with-plugins');
const Graceful = require('@ladjs/graceful');

const mongoose = require('mongoose');
const Users = require('#models/users');
const Payments = require('#models/payments');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const config = require('#config');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const users = await Users.distinct('_id', {
      [config.userFields.planSetAt]: {
        $lte: dayjs('3/31/23', 'M/DD/YY').endOf('day').toDate(),
        $gte: dayjs('3/31/23', 'M/DD/YY').startOf('day').toDate()
      },
      [config.userFields.isBanned]: false
    });

    for (const user of users) {
      // lookup if they have free credit with same date
      // if so, then set the plan_set_at date equal to it
      // and re-save the user so they have proper credit

      const payment = await Payments.findOne({
        kind: 'one-time',
        method: 'free_beta_program',
        invoice_at: {
          $lte: dayjs('3/31/23', 'M/DD/YY').endOf('day').toDate(),
          $gte: dayjs('3/31/23', 'M/DD/YY').startOf('day').toDate()
        }
      });
      if (payment) {
        payment.invoice_at = dayjs('3/31/23').startOf('day').toDate();

        await payment.save();
        user[config.userFields.planSetAt] = dayjs('3/31/23')
          .startOf('day')
          .toDate();

        await user.save();
        console.log(`Fixed ${user.email} to have proper credit`);
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
