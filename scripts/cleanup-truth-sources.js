/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const isFQDN = require('is-fqdn');

const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');
const Domains = require('#models/domains');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const parseRootDomain = require('#helpers/parse-root-domain');
const setupMongoose = require('#helpers/setup-mongoose');
const logger = require('#helpers/logger');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client);
const graceful = new Graceful({
  redisClients: [client],
  mongooses: [mongoose]
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
  // 'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  // NOTE: ESERVFAIL indicates the NS does not work
  'ESERVFAIL',
  'ETIMEOUT'
]);

graceful.listen();

(async () => {
  await setupMongoose();

  for await (const domain of Domains.find({})
    .sort({ created_at: -1 })
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    try {
      if (!isFQDN(domain.name)) continue;
      // domain cannot be one of the trusted senders
      const root = parseRootDomain(domain.name);
      if (!config.truthSources.has(root)) continue;

      // check one more time for mx or txt if non-root match
      // get verification results (and any errors too)
      const { txt, mx, errors } = await Domains.getVerificationResults(
        domain,
        resolver
      );

      const hasDNSError =
        Array.isArray(errors) &&
        errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

      if (!hasDNSError && !txt && !mx) {
        // otherwise remove the domain
        console.log('removing', domain.name);
        await Domains.findByIdAndRemove(domain._id);
        continue;
      }

      // email admins
      const err = new TypeError(
        `${domain.name} has a truth source of ${root} and is MX and/or TXT verified`
      );
      await logger.error(err);
    } catch (err) {
      console.error(err);
    }
  }

  process.exit(0);
})();
