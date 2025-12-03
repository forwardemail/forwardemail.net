/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');
const sharedConfig = require('@ladjs/shared-config');
const _ = require('#helpers/lodash');

const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains } = require('#models');
const createTangerine = require('#helpers/create-tangerine');

const concurrency = config.env === 'development' ? 1 : os.cpus().length;

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  mongooses: [mongoose],
  logger
});

const resolver = createTangerine(client, logger);

// <https://github.com/nodejs/node/blob/08dd4b1723b20d56fbedf37d52e736fe09715f80/lib/dns.js#L296-L320>
// <https://docs.rs/c-ares/4.0.3/c_ares/enum.Error.html>
const DNS_RETRY_CODES = new Set([
  'EADDRGETNETWORKPARAMS',
  'EBADFAMILY',
  'EBADFLAGS',
  'EBADHINTS',
  'EBADNAME',
  'EBADQUERY',
  'EBADRESP',
  'EBADSTR',
  'ECANCELED',
  'ECANCELLED',
  'ECONNREFUSED',
  'EDESTRUCTION',
  'EFILE',
  'EFORMERR',
  'ELOADIPHLPAPI',
  // NOTE: ENODATA is handled by error handling below
  // 'ENODATA',
  'ENOMEM',
  'ENONAME',
  // NOTE: ENOTFOUND is handled by error handling below
  // 'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  // NOTE: ESERVFAIL indicates the NS does not work
  'ESERVFAIL',
  'ETIMEOUT'
]);

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

(async () => {
  await setupMongoose(logger);

  try {
    //
    // - get all users, go through all their domains
    // - filter out those that are isDisposable or isRestricted
    // - if user is on paid plan, but some of them are disposable or restricted then email them
    //   (e.g. click "Change Plan" for each domain and follow set-up instructions, do this before March 31st)
    //
    const ids = await Users.distinct('_id', {
      group: 'user',
      plan: { $in: ['enhanced_protection', 'team'] },
      [config.userFields.isBanned]: false,
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.paymentReminderTerminationNoticeSentAt]: {
        $exists: false
      }
    });

    await pMap(
      ids,
      async (id) => {
        // return early if the job was already cancelled
        if (isCancelled) return;

        const user = await Users.findById(id).lean().exec();
        if (!user) return;

        let domains = await Domains.find({
          'members.user': user._id,
          has_mx_record: true
        })
          .lean()
          .exec();

        domains = domains.filter((d) => {
          // if user was not an admin then return false
          const member = d.members.find(
            (m) => m.user.toString() === user.id && m.group === 'admin'
          );
          if (!member) return false;
          const { isGood, isDisposable, isRestricted } =
            Domains.getNameRestrictions(d.name);
          if (!isGood || isDisposable || isRestricted) return true;
          return false;
        });

        if (domains.length === 0) return;

        // filter out those that have verified records and not on free plan
        // (most of this code is copied from jobs/check-domains.js)
        domains = await pMapSeries(domains, async (domain) => {
          // store the before state
          const { has_mx_record: mxBefore, has_txt_record: txtBefore } = domain;

          // get verification results (and any errors too)
          const { ns, txt, mx, errors } = await Domains.getVerificationResults(
            domain,
            resolver
          );

          //
          // run a save on the domain name
          // (as long as `errors` does not have a temporary DNS error)
          //
          const hasDNSError =
            Array.isArray(errors) &&
            errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

          if (!hasDNSError) {
            // reset missing txt so we alert users if they are missing a TXT in future again
            if (!txtBefore && txt && _.isDate(domain.missing_txt_sent_at)) {
              domain.missing_txt_sent_at = undefined;
              await Domains.findByIdAndUpdate(domain._id, {
                $unset: {
                  missing_txt_sent_at: 1
                }
              });
            }

            // reset multiple exchanges error so we alert users if they have multiple MX in the future
            if (
              !mxBefore &&
              mx &&
              _.isDate(domain.multiple_exchanges_sent_at)
            ) {
              domain.multiple_exchanges_sent_at = undefined;
              await Domains.findByIdAndUpdate(domain._id, {
                $unset: {
                  multiple_exchanges_sent_at: 1
                }
              });
            }

            // set the values (since we are skipping some verification)
            domain.has_txt_record = txt;
            domain.has_mx_record = mx;
            if (ns) domain.ns = ns;
          }

          // store when we last checked it
          const now = new Date();
          domain.last_checked_at = now;
          await Domains.findByIdAndUpdate(domain._id, {
            $set: {
              last_checked_at: domain.last_checked_at,
              has_txt_record: domain.has_txt_record,
              has_mx_record: domain.has_mx_record,
              ...(ns ? { ns } : {})
            }
          });

          if (hasDNSError) return false;

          return domain;
        });

        // if the domain doesn't have the MX record
        // OR if the domain is not free, has txt, and has mx
        // then filter those out since we don't want to email regarding them
        domains = domains.filter((d) => {
          if (!d.has_mx_record) return false;
          if (d.plan !== 'free' && d.has_mx_record && d.has_txt_record)
            return false;
          // filter out domains that already had this email sent in past month
          if (
            _.isDate(d.restrictions_reminder_sent_at) &&
            dayjs(new Date(d.restrictions_reminder_sent_at)).isAfter(
              dayjs().subtract(1, 'month').toDate()
            )
          )
            return false;
          return true;
        });

        if (domains.length === 0) return;

        // now send an email to the user instructing them to follow setup for each
        // import their existing TXT records for the domain (so they don't have to configure anything)
        await email({
          template: 'domain-restrictions-reminder',
          message: {
            to: user[config.userFields.receiptEmail] || user.email,
            ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {})
          },
          locals: { user, domains }
        });

        // mark all these domains `restriction_reminder_sent_at`
        await Domains.updateMany(
          {
            _id: {
              $in: domains.map((d) => d._id)
            }
          },
          {
            $set: {
              restrictions_reminder_sent_at: new Date()
            }
          }
        );
      },
      { concurrency }
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
