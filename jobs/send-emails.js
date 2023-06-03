// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const delay = require('delay');
const ip = require('ip');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const sharedConfig = require('@ladjs/shared-config');
const { default: PQueue } = require('p-queue');

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
const IP_ADDRESS = ip.address();

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

const queue = new PQueue({
  concurrency: config.concurrency * 4,
  timeout: config.smtpQueueTimeout
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') {
      isCancelled = true;
      // clear the queue
      queue.clear();
    }
  });

graceful.listen();

// 60 items (50 MB * 60 = 3000 MB = 3 GB)
const MAX_QUEUE = 60;

async function sendEmails() {
  // return early if the job was already cancelled
  if (isCancelled) return;

  if (queue.size > MAX_QUEUE) {
    logger.info(`queue has more than ${MAX_QUEUE} tasks`);
    return;
  }

  const limit = MAX_QUEUE - queue.size;
  logger.info('queueing %d emails', limit);

  // TODO: filter out recently blocked targets by rejectedErrors[x].mx.target

  // get list of all suspended domains
  // and recently blocked emails to exclude
  const [suspendedDomainIds, recentlyBlockedIds] = await Promise.all([
    Domains.distinct('_id', {
      smtp_suspended_sent_at: {
        $exists: true
      }
    }),
    Emails.distinct('_id', {
      updated_at: {
        $gte: dayjs().subtract(1, 'hour').toDate(),
        $lte: new Date()
      },
      rejectedErrors: {
        $elemMatch: {
          date: {
            $gte: dayjs().subtract(1, 'hour').toDate(),
            $lte: new Date()
          },
          'bounceInfo.category': 'blocklist',
          'mx.localAddress': IP_ADDRESS
        }
      }
    })
  ]);

  logger.info('%d suspended domain ids', suspendedDomainIds.length);

  logger.info('%d recently blocked ids', recentlyBlockedIds.length);

  //
  // TODO: warm up IP addresses
  // <https://serverfault.com/a/1016122>
  //

  for await (const email of Emails.find({
    _id: { $nin: recentlyBlockedIds },
    locked_at: {
      $exists: false
    },
    status: 'queued',
    domain: {
      $nin: suspendedDomainIds
    },
    date: {
      $lte: new Date()
    }
  })
    .sort({ created_at: 1 })
    .limit(limit)
    .cursor()) {
    // return early if the job was already cancelled
    if (isCancelled) break;
    // TODO: implement queue on a per-target/provider basis (e.g. 10 at once to Cox addresses)
    await queue.add(() => processEmail({ email, resolver, client }), {
      // if the email was admin owned domain then priority higher (see email pre-save hook)
      priority: email.priority || 0
    });
  }

  // wait 1 second
  await delay(1000);

  // queue more messages once finished processing
  return sendEmails();
}

(async () => {
  await setupMongoose(logger);

  try {
    await sendEmails();
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

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  }
})();
