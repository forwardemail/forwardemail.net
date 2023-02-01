// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');

const Graceful = require('@ladjs/graceful');
const pMap = require('p-map');

const mongoose = require('mongoose');
const logger = require('#helpers/logger');

const Payments = require('#models/payments');

const concurrency = os.cpus().length;
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const count = await Payments.countDocuments({ paypal_transaction_id: id });
  if (count > 1)
    console.log(
      `~~~~~~~~~~~~~~\nTransaction duplicate: ${id}\n~~~~~~~~~~~~~~~~~~`
    );
}

(async () => {
  await mongoose.connect();

  const ids = await Payments.distinct('paypal_transaction_id', {
    paypal_transaction_id: { $exists: true }
  });
  await pMap(ids, mapper, { concurrency });

  process.exit(0);
})();
