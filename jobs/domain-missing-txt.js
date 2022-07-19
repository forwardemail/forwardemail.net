// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const pMapSeries = require('p-map-series');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const { email, logger } = require('#helpers');
const { Users, Domains } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

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
  'ECANCELLED',
  'ECONNREFUSED',
  'EDESTRUCTION',
  'EFILE',
  'EFORMERR',
  'ELOADIPHLPAPI',
  // NOTE: ENODATA indicates there were no records set for MX or TXT
  // 'ENODATA',
  'ENOMEM',
  'ENONAME',
  // NOTE: ENOTFOUND indicates the domain doesn't exist
  //       (and we don't want to send emails to people that didn't even register it yet)
  'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  'ESERVFAIL',
  'ETIMEOUT'
]);

graceful.listen();

(async () => {
  await mongoose.connect();

  //
  // check domains created over 24 hours ago
  // that have MX records set but are missing TXT records
  // (and check in-memory here for each)
  //
  // (sorted by last_checked_at)
  //
  const results = await Domains.aggregate([
    {
      $match: {
        $and: [
          {
            has_mx_record: true,
            has_txt_record: false,
            missing_txt_sent_at: {
              $exists: false
            },
            created_at: {
              $lte: dayjs().subtract(1, 'day').toDate()
            }
          },
          {
            $or: [
              {
                last_checked_at: {
                  $exists: false
                }
              },
              {
                last_checked_at: {
                  $lte: dayjs().subtract(1, 'week').toDate()
                }
              }
            ]
          }
        ]
      }
    },
    {
      $sort: {
        last_checked_at: 1
      }
    },
    {
      $group: {
        _id: '$_id'
      }
    }
  ]);

  // flatten array
  const ids = results.map((r) => r._id);

  // iterate over each domain and group it together by the same user
  // (so we only send one email digest per user, and only send it once per domain)
  const data = {};

  async function mapper(id) {
    const domain = await Domains.findById(id).lean().exec();

    if (!domain) return;

    // if the domain passed mx and txt since this job started then ignore it
    if (
      !domain.has_mx_record ||
      domain.has_txt_record ||
      (_.isDate(domain.last_checked_at) &&
        new Date(domain.last_checked_at).getTime() >=
          dayjs().subtract(2, 'hour').toDate().getTime())
    )
      return;

    //
    // set locale of domain
    //
    // NOTE: does not matter to user we're emailing because errors never show in emails
    //
    domain.locale = 'en';

    logger.info('checking domain', { domain });

    // get latest verification results (and any errors too)
    const { txt, mx, errors } = await Domains.getVerificationResults(
      domain,
      client
    );

    if (errors.length > 0) logger.error(...errors, { domain });

    //
    // run a save on the domain name
    // (as long as `errors` does not have a temporary DNS error)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

    if (!hasDNSError) {
      // reset missing txt so we alert users if they are missing a TXT in future again
      if (
        !domain.has_txt_record &&
        txt &&
        _.isDate(domain.missing_txt_sent_at)
      ) {
        domain.missing_txt_sent_at = undefined;
        await Domains.findByIdAndUpdate(domain._id, {
          $unset: {
            missing_txt_sent_at: 1
          }
        });
      }

      // set the values (since we are skipping some verification)
      domain.has_txt_record = txt;
      domain.has_mx_record = mx;
    }

    // store when we last checked it
    const now = new Date();
    domain.last_checked_at = now;
    await Domains.findByIdAndUpdate(domain._id, {
      $set: {
        last_checked_at: domain.last_checked_at,
        has_txt_record: domain.has_txt_record,
        has_mx_record: domain.has_mx_record
      }
    });

    // ignore domains that don't exist or had DNS errors
    if (hasDNSError) return;

    //
    // ignore domains that had TXT or did not have MX
    //
    // TODO: we should email users separately regarding domain-missing-mx
    //       (probably should combine both this and `jobs/check-domains` into one)
    //
    if (txt || !mx) return;

    for (const member of domain.members) {
      if (member.group !== 'admin') continue;
      if (!data[member.user.toString()]) {
        // eslint-disable-next-line no-await-in-loop
        const user = await Users.findOne({
          _id: member.user,
          [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.isBanned]: false
        })
          .lean()
          .exec();
        if (!user) continue;
        data[member.user.toString()] = {
          user,
          domains: [],
          locale: user[config.lastLocale]
        };
      }

      data[member.user.toString()].domains.push(domain);
    }
  }

  logger.info('checking domains', { count: ids.length });

  await pMapSeries(ids, mapper);

  for (const userId of Object.keys(data)) {
    const locals = data[userId];
    // eslint-disable-next-line no-await-in-loop
    await email({
      template: 'domain-missing-txt',
      message: {
        to: locals.user[config.userFields.fullEmail]
      },
      locals
    });

    // eslint-disable-next-line no-await-in-loop
    await Domains.updateMany(
      {
        _id: {
          $in: locals.domains.map((domain) => domain._id)
        }
      },
      {
        missing_txt_sent_at: new Date()
      }
    );
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
