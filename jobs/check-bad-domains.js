/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
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

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const email = require('#helpers/email');
const Domains = require('#models/domains');
const createTangerine = require('#helpers/create-tangerine');

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
  // NOTE: ENOTFOUND indicates the domain doesn't exist
  //       (and we don't want to send emails to people that didn't even register it yet)
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
    const domain = await Domains.findById(id).lean().exec();

    // it could have been deleted by the user mid-process
    if (!domain) return;

    // if the domain was checked since this job started
    if (
      _.isDate(domain.last_checked_at) &&
      new Date(domain.last_checked_at).getTime() >=
        dayjs().subtract(2, 'hour').toDate().getTime()
    )
      return;

    // get recipients and the majority favored locale
    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

    // set locale of domain
    domain.locale = locale;

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
      if (!mxBefore && mx && _.isDate(domain.multiple_exchanges_sent_at)) {
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

    // include helpful error message if needed
    let errorMessage;
    if (errors.length === 1) errorMessage = errors[0].message;
    else if (errors.length > 1)
      errorMessage = `<ul class="text-left mb-0">${errors
        .map((e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`)
        .join('')}</ul>`;

    // if had no dns errors and mx record but no txt
    // then send configuration issue email
    if (!hasDNSError && mx && !txt && !_.isDate(domain.missing_txt_sent_at)) {
      await email({
        template: 'domain-configuration-issue',
        message: { to },
        locals: {
          to,
          locale,
          domain,
          errorMessage
        }
      });
      // store that we sent this email
      await Domains.findByIdAndUpdate(domain._id, {
        $set: {
          missing_txt_sent_at: new Date()
        }
      });
    }
    // if had no dns errors and no mx record
    // and errors contains multiple mx record error
    // then send configuration issue email
    else if (
      !hasDNSError &&
      !mx &&
      errors.some((err) => err.has_multiple_exchanges) &&
      !_.isDate(domain.multiple_exchanges_sent_at)
    ) {
      await email({
        template: 'domain-configuration-issue',
        message: { to },
        locals: {
          to,
          locale,
          domain,
          errorMessage
        }
      });
      // store that we sent this email
      await Domains.findByIdAndUpdate(domain._id, {
        $set: {
          multiple_exchanges_sent_at: new Date()
        }
      });
    }
    // if verification was not passing and now is
    // then send email (if we haven't sent one yet)
    else if (
      // we don't want to send emails to bulk API created
      !domain.is_api &&
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
          to,
          locale,
          domain,
          errorMessage
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
    } else if (
      // we don't want to send emails to bulk API created
      !domain.is_api &&
      !_.isDate(domain.onboard_email_sent_at) &&
      !hasDNSError &&
      // ensure domain was created <= 1 month ago
      new Date(domain.created_at).getTime() >=
        dayjs().subtract(1, 'month').toDate().getTime()
    ) {
      // send the onboard email
      await email({
        template: 'domain-onboard',
        message: { to },
        locals: {
          to,
          locale,
          domain,
          errorMessage
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
  await setupMongoose(logger);

  try {
    //
    // TODO: in the future when we integrate historical checks
    //       and routine checking (e.g. 3 in a row fail)
    //       then we will need to modify this query
    //
    // get all non-API created domains (sorted by last_checked_at)
    let names = await Domains.distinct('name', { plan: 'free' });

    // filter out the names that are malicious
    names = names.filter((name) => {
      const { isGood, isDisposable, isRestricted } =
        Domains.getNameRestrictions(name);
      return isRestricted || !isGood || isDisposable;
    });

    if (names.length === 0) {
      process.exit(0);
    }

    // then run them through the lookup
    const results = await Domains.aggregate([
      {
        $match: {
          $and: [
            {
              plan: 'free',
              name: {
                $in: names
              },
              has_mx_record: true,
              has_txt_record: true
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
                    $lte: dayjs().subtract(2, 'hour').toDate()
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
        }
      },
      {
        $sort: {
          has_mx_record: 1
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

    await pMap(ids, mapper, { concurrency: 100 });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
