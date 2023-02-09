// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const dayjs = require('dayjs-with-plugins');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Logs } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    logger.info('starting log deletion');
    const results = await Logs.deleteMany({
      $or: [
        // mx1.forwardemail.net and mx2.forwardemail.net have 1d log policy
        {
          'meta.app.hostname': {
            $in: ['mx1.forwardemail.net', 'mx2.forwardemail.net']
          },
          created_at: { $lte: dayjs().subtract(1, 'day').toDate().getTime() }
        },
        // all others have 30d
        {
          created_at: { $lte: dayjs().subtract(30, 'day').toDate().getTime() }
        }
      ]
    });
    logger.info('deleted logs', { results });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
