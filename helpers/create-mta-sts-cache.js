/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const safeStringify = require('fast-safe-stringify');

const logger = require('./logger');

// <https://github.com/zone-eu/zone-mta/blob/5daa48eea4aa05e724eb2ab80fd3a957e6cc8c6c/lib/sender.js#L64-L110>
function createMtaStsCache(client) {
  return {
    async set(domain, policy) {
      try {
        const expires = policy.expires ? new Date(policy.expires) : false;
        let ttl =
          expires && expires.toString() !== 'Invalid Date'
            ? expires.getTime() - Date.now()
            : 0;
        if (!ttl || ttl <= 0) {
          ttl = 60 * 1000;
        }

        const json = safeStringify(policy);

        logger.debug('MTA-STS', {
          domain,
          ttl: Math.round(ttl / 1000),
          policy: json
        });
        await client.set(`sts:${domain}`, json, 'PX', ttl);
      } catch (err) {
        logger.error(err, {
          domain
        });
      }
    },

    async get(domain) {
      try {
        const policy = await client.get(`sts:${domain}`);
        if (policy) {
          logger.debug('MTA-STS', {
            domain,
            policy
          });
          return JSON.parse(policy);
        }
      } catch (err) {
        logger.error(err, { domain });
      }
    }
  };
}

module.exports = createMtaStsCache;
