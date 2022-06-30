// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const logger = require('#helpers/logger');
const email = require('#helpers/email');
const Users = require('#models/user');
const Domains = require('#models/domain');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const concurrency = os.cpus().length;
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});
const fifteenMinutesAgo = dayjs().subtract(15, 'minutes').toDate();

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
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

async function mapper(_id) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    let domain = await Domains.findById(_id);

    // it could have been deleted by the user mid-process
    if (!domain) return;

    logger.info('checking domain', { domain });

    // store the before state
    const { has_mx_record: mxBefore, has_txt_record: txtBefore } = domain;

    // store when we last checked it
    const now = new Date();
    domain.last_checked_at = now;
    await Domains.findByIdAndUpdate(domain._id, {
      $set: {
        last_checked_at: now
      }
    });

    // get verification results (and any errors too)
    const { txt, mx, errors } = await Domains.getVerificationResults(
      domain,
      client
    );

    //
    // run a save on the domain name
    // (as long as `errors` does not have an error with ENOTFOUND nor ENODATA)
    // since DNS can sometimes have intermittent false information (e.g. Cloudflare issues)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some(
        (err) => err.code && ['ENOTFOUND', 'ENODATA'].includes(err.code)
      );

    if (!hasDNSError) {
      // reset missing txt so we alert users if they are missing a TXT in future again
      if (!domain.has_txt_record && txt && _.isDate(domain.missing_txt_sent_at))
        domain.missing_txt_sent_at = null;

      // set the values (since we are skipping some verification)
      domain.has_txt_record = txt;
      domain.has_mx_record = mx;

      // skip verification because we already checked (to capture errors)
      domain.skip_verification = true;

      // save the domain
      domain = await domain.save();
    }

    // get all the admins we should send the email to
    const users = await Users.find({
      _id: {
        $in: domain.members
          .filter((member) => member.group === 'admin')
          .map((member) => member.user)
      }
    });

    if (users.length === 0) {
      logger.warn(new Error('Domain had zero admins'), { domain });
      return;
    }

    const locale = users[0].last_locale;
    const to = _.map(users, 'email');

    // if verification was not passing and now is
    // then send email (if we haven't sent one yet)
    if (
      !_.isDate(domain.verified_email_sent_at) &&
      (!mxBefore || !txtBefore) &&
      mx &&
      txt
    ) {
      // send the domain verified email
      await email({
        template: 'domain-verified',
        message: { to },
        locals: {
          locale,
          domain: domain.toObject()
        }
      });
      // store that we sent this email
      await Domains.findByIdAndUpdate(domain._id, {
        $set: {
          verified_email_sent_at: now,
          // this also counts as our onboard email too
          // (if it was not already sent, e.g. we don't want redundant emails)
          ...(_.isDate(domain.onboard_email_sent_at)
            ? {}
            : { onboard_email_sent_at: now })
        }
      });
    } else if (!_.isDate(domain.onboard_email_sent_at)) {
      // send the onboard email
      await email({
        template: 'domain-onboard',
        message: { to },
        locals: {
          locale,
          domain: domain.toObject(),
          txt,
          mx,
          errors,
          hasDNSError
        }
      });
      // store that we sent this email
      await Domains.findByIdAndUpdate(domain._id, {
        $set: {
          onboard_email_sent_at: now,
          ...(mx && txt ? { verified_email_sent_at: now } : {})
        }
      });
    }

    //
    // TODO: store historical checks (so we can evaluate Cloudflare accuracy)
    // TODO: if the last 3 historical checks failed in a
    //       row failed including this one then send an email alert
    //
  } catch (err) {
    logger.warn(err);
  }
}

(async () => {
  await mongoose.connect();

  //
  // TODO: in the future when we integrate historical checks
  //       and routine checking (e.g. 3 in a row fail)
  //       then we will need to modify this query
  //
  // get all non-API created domains
  const _ids = await Domains.distinct('_id', {
    $and: [
      {
        $or: [
          {
            last_checked_at: {
              $exists: false
            }
          },
          {
            last_checked_at: {
              $lte: fifteenMinutesAgo
            }
          }
        ]
      },
      {
        $or: [
          {
            verified_email_sent_at: {
              $exists: false
            }
          },
          {
            onboard_email_sent_at: {
              $exists: false
            }
          }
        ]
      }
    ]
  });

  logger.info('checking domains', { count: _ids.length });

  await pMap(_ids, mapper, { concurrency });

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
