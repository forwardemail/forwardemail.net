/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const punycode = require('node:punycode');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const Emails = require('#models/emails');
const Domains = require('#models/domains');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

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
  'ECANCELED',
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
  // NOTE: ENOTFOUND indicates the record doesn't exist
  'ENOTFOUND',
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

async function mapper(id) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    const domain = await Domains.findById(id);

    // it could have been deleted by the user mid-process
    if (!domain) return;

    // if the domain was checked since this job started
    if (
      _.isDate(domain.smtp_last_checked_at) &&
      new Date(domain.smtp_last_checked_at).getTime() >=
        dayjs().subtract(2, 'hour').toDate().getTime()
    )
      return;

    // get recipients and the majority favored locale
    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

    // set locale of domain
    domain.locale = locale;
    domain.resolver = resolver;

    const { ns, dkim, returnPath, dmarc, strictDmarc, spf, errors } =
      await Domains.verifySMTP(domain, resolver);

    // skip verification since this is separate from domain forwarding setup
    domain.skip_verification = true;

    // store when we last checked smtp
    domain.smtp_last_checked_at = new Date();

    //
    // run a save on the domain name
    // (as long as `errors` does not have a temporary DNS error)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

    // return early if DNS error occurred
    if (hasDNSError) {
      // save the domain
      await domain.save();
      return;
    }

    // only email the user if there were emails in the past 30+ days
    // (otherwise we spam users that may no longer use outbound smtp)
    const count = await Emails.countDocuments({
      domain: domain._id,
      created_at: {
        $gte: dayjs().subtract(1, 'month').toDate()
      }
    });

    const isVerified = dkim && returnPath && dmarc;

    if (domain.has_smtp && !isVerified) {
      domain.smtp_verified_at = undefined;
      if (count > 0 && !_.isDate(domain.missing_smtp_sent_at)) {
        // if the domain has_smtp and it is not verified
        // and it hasn't been sent error notification
        // then send the notification and mark it as being sent
        const subject =
          config.views.locals.emoji('warning') +
          ' ' +
          i18n.translate('SMTP_ERROR_SUBJECT', locale, domain.name);
        const message = i18n.translate(
          'SMTP_ERROR_MESSAGE',
          locale,
          domain.name,
          `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
            domain.name
          )}/verify-smtp`
        );
        await emailHelper({
          template: 'alert',
          message: {
            to,
            // bcc: config.alertsEmail,
            subject
          },
          locals: {
            message,
            locale
          }
        });
        domain.missing_smtp_sent_at = new Date();
      }
    } else if (!domain.has_smtp && isVerified) {
      domain.missing_smtp_sent_at = undefined;
      if (count > 0 && !_.isDate(domain.smtp_verified_at)) {
        // if the domain was newly verified and doesn't have smtp yet then email admins
        const subject = i18n.translate(
          'SMTP_ACCESS_SUBJECT',
          locale,
          domain.name
        );
        const message = i18n.translate(
          'SMTP_ACCESS_PENDING',
          locale,
          domain.name
        );
        await emailHelper({
          template: 'alert',
          message: {
            to,
            bcc: config.alertsEmail,
            subject
          },
          locals: {
            message,
            locale
          }
        });
        domain.smtp_verified_at = new Date();
      }
    }

    // set the values (since we are skipping some verification)
    domain.has_dkim_record = dkim;
    domain.has_return_path_record = returnPath;
    domain.has_dmarc_record = dmarc;
    domain.has_strict_dmarc = strictDmarc;
    domain.has_spf_record = spf;
    if (ns) domain.ns = ns;

    // save the domain
    await domain.save();

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
  await setupMongoose(logger);

  try {
    //
    // TODO: in the future when we integrate historical checks
    //       and routine checking (e.g. 3 in a row fail)
    //       then we will need to modify this query
    //
    // get all non-API created domains (sorted by last_checked_at)
    const results = await Domains.aggregate([
      {
        $match: {
          $and: [
            {
              plan: {
                $in: ['enhanced_protection', 'team']
              }
            },
            {
              $or: [
                {
                  smtp_last_checked_at: {
                    $exists: false
                  }
                },
                {
                  smtp_last_checked_at: {
                    $lte: dayjs().subtract(2, 'hour').toDate()
                  }
                },
                {
                  smtp_verified_at: {
                    $exists: false
                  }
                }
              ]
            }
          ]
        }
      },
      {
        $sort: {
          smtp_last_checked_at: 1
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

    logger.info('checking domains', { count: ids.length });

    await pMap(ids, mapper, { concurrency: 25 });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
