// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const delay = require('delay');
const mongoose = require('mongoose');
const ms = require('ms');

const env = require('#config/env');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Emails = require('#models/emails');
const Domains = require('#models/emails');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // NOTE: if you change this then also update `jobs/send-emails` if necessary
    //
    // get list of all suspended domains
    // and recently blocked emails to exclude
    const now = new Date();
    const [suspendedDomainIds, recentlyBlockedIds] = await Promise.all([
      Domains.distinct('_id', {
        smtp_suspended_sent_at: {
          $exists: true
        }
      }),
      Emails.distinct('_id', {
        updated_at: {
          $gte: dayjs().subtract(1, 'hour').toDate(),
          $lte: now
        },
        rejectedErrors: {
          $elemMatch: {
            date: {
              $gte: dayjs().subtract(1, 'hour').toDate(),
              $lte: now
            },
            'bounceInfo.category': 'blocklist',
            'mx.localHostname': env.SMTP_HOST
          }
        }
      })
    ]);

    logger.info('%d suspended domain ids', suspendedDomainIds.length);

    logger.info('%d recently blocked ids', recentlyBlockedIds.length);
    //
    // check the unique ids for emails in the queue
    // if the list is still the same after 1 minute
    // then email admins and throw an error
    //

    // NOTE: if you change this then also update `jobs/send-emails` if necessary
    const query = {
      _id: { $nin: recentlyBlockedIds },
      status: 'queued',
      domain: {
        $nin: suspendedDomainIds
      }
    };

    const count = await Emails.countDocuments(query);

    // if the count is >= half of the queue threshold
    // then we can assume there's something wrong
    // (we can fine tune this in the future)
    if (count >= Math.round(config.smtpMaxQueue / 2)) {
      const err = new Error(
        `SMTP queue count is ${count} (exceeds 50% threshold)`
      );
      err.isCodeBug = true; // triggers sms
      throw err;
    }
  } catch (err) {
    await logger.error(err);
    // only send one of these emails every 15m
    // (this prevents the job from exiting)
    await delay(ms('15m'));
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
