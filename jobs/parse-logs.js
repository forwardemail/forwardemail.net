// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');

const mongoose = require('mongoose');
const Logs = require('#models/logs');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // NOTE: we use async iterator (cursor) for performance
    // <https://mongoosejs.com/docs/api/querycursor.html#querycursor_QueryCursor-Symbol.asyncIterator>
    // <https://thecodebarbarian.com/whats-new-in-mongoose-53-async-iterators.html
    //
    const query = {
      $or: [
        {
          is_restricted: {
            $exists: true,
            $eq: true
          },
          domains: {
            $exists: false
          },
          domains_checked_at: {
            $exists: false
          }
        },
        {
          is_restricted: {
            $exists: true,
            $eq: true
          },
          domains: {
            $exists: true,
            $eq: []
          },
          domains_checked_at: {
            $exists: false
          }
        }
      ]
    };

    // eslint-disable-next-line unicorn/no-array-callback-reference
    for await (const log of Logs.find(query)
      .sort({ created_at: -1 })
      .cursor()) {
      // this calls the internal static method `parseLog`
      try {
        // helper property to skip duplicate check
        log.skip_duplicate_check = true;
        await log.save();
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
