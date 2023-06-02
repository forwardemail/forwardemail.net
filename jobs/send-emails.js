// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const pThrottle = require('p-throttle');
const sharedConfig = require('@ladjs/shared-config');
const parseErr = require('parse-err');

const config = require('#config');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

// global interval we use (for graceful)
let interval;

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger,
  customHandlers: [
    () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
  ]
});

graceful.listen();

//
// this will throttle sending emails to X limit per Y interval
// (e.g. on a 4 cpu server, it will limit to sending 4 * 4 emails max over the course of 1s)
// (note this limit is super high right now since we're early stage)
//
const throttle = pThrottle({
  limit: Math.round(config.concurrency * 4),
  interval: ms('1s')
});

const throttled = throttle(async (email) => {
  // wrapped with try/catch so it should never throw an error
  // (however if there's an error with catch block in `sendEmail` then it will throw
  return processEmail({ email, resolver, client });
});

async function sendEmails(query) {
  // eslint-disable-next-line unicorn/no-array-callback-reference
  for await (const email of Emails.find(query)
    .sort({ created_at: -1 })
    .cursor()) {
    //
    // even though this is in a for-loop we still throttle it
    // because of the possibility from receiving messages from parent port
    //
    await throttled(email);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    // get list of all suspended domains to exclude
    const suspendedDomainIds = await Domains.distinct('_id', {
      smtp_suspended_sent_at: {
        $exists: true
      }
    });

    //
    // TODO: warm up IP addresses
    // <https://serverfault.com/a/1016122>
    //
    const query = {
      locked_at: {
        $exists: false
      },
      status: 'queued',
      domain: {
        $nin: suspendedDomainIds
      }
    };

    if (parentPort)
      parentPort.on('message', async (value) => {
        if (typeof value !== 'object' || typeof value.id !== 'string') return;
        const email = await Emails.findOne({
          ...query,
          date: {
            $lte: new Date()
          },
          id: value.id
        });
        if (email) await throttled(email);
        else logger.warn(new Error('Email does not exist'), { value });
      });

    // every 3s attempt to send emails that are in the queue
    interval = setInterval(
      () =>
        sendEmails({
          ...query,
          date: {
            $lte: new Date()
          }
        }),
      ms('3s')
    );

    sendEmails({
      ...query,
      date: {
        $lte: new Date()
      }
    });
  } catch (err) {
    await logger.error(err);

    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Send emails had an error'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });

    //
    // TODO: this needs checked
    // only exit if there was an error (the job will auto-restart)
    //
    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  }
})();
