// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');
const mongoose = require('mongoose');

const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Payments } = require('#models');

const concurrency = os.cpus().length;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id);
  if (!user) throw new Error('User does not exist');
  // check if the user had zero payments
  const count = await Payments.countDocuments({ user: user._id });
  if (count > 0) return;
  // create a new free beta program credit for them
  await Payments.create({
    user: user._id,
    amount:
      user.plan === 'enhanced_protection'
        ? Math.round(300 * 12)
        : Math.round(900 * 12),
    amount_refunded:
      user.plan === 'enhanced_protection'
        ? Math.round(300 * 12)
        : Math.round(900 * 12),
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    duration: ms('1y'),
    plan: user.plan,
    kind: 'one-time'
  });
  // save the user so their plan expired at is updated
  await user.save();
}

(async () => {
  await setupMongoose(logger);

  try {
    // get all users that are not on a paid plan
    // and are not banned and have verified emails
    const ids = await Users.distinct('_id', {
      plan: { $ne: 'free' },
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.isBanned]: false
    });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
