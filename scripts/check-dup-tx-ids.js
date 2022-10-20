// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const pMap = require('p-map');

const logger = require('#helpers/logger');

const Payments = require('#models/payment');

const breeSharedConfig = sharedConfig('BREE');

const concurrency = os.cpus().length;
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
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

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
})();
