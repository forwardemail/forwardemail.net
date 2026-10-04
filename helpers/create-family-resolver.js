/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const createTangerine = require('#helpers/create-tangerine');

// how long an answer from Cloudflare Family DNS is cached at most
const MAX_TTL_SECONDS = ms('30m') / 1000;

//
// A resolver for Cloudflare Family DNS (1.1.1.3 and 1.0.0.3), which answers
// 0.0.0.0 for a domain categorized as malware, phishing or adult content (see
// `helpers/get-domain-categorization`).
//
// Its answers are cached apart from the default resolver's: under the same
// keys, a blocked answer (0.0.0.0) would be returned for that domain by every
// other lookup, and an unfiltered answer cached first would hide the block.
// They are also cached for at most 30 minutes, so a change in categorization
// (e.g. after a Cloudflare Radar change request) is picked up soon.
//
function createFamilyResolver(client, logger) {
  return createTangerine(client, logger, {
    cachePrefix: 'tangerine_family:',
    servers: new Set(['1.1.1.3', '1.0.0.3']),
    // (an answer without a TTL, or with a longer one, is cached for 30 minutes)
    defaultTTLSeconds: MAX_TTL_SECONDS,
    maxTTLSeconds: MAX_TTL_SECONDS,
    setCacheArgs(key, result) {
      return ['PX', Math.round(result.ttl * 1000)];
    }
  });
}

module.exports = createFamilyResolver;
module.exports.MAX_TTL_SECONDS = MAX_TTL_SECONDS;
