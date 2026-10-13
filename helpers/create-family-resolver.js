/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const createTangerine = require('#helpers/create-tangerine');

// Cloudflare Family DNS: blocks malware, phishing and adult content
const FAMILY_SERVERS = ['1.1.1.3', '1.0.0.3'];
// Cloudflare's malware blocking DNS: blocks malware and phishing only
const SECURITY_SERVERS = ['1.1.1.2', '1.0.0.2'];

//
// Whether an answer from either is a block: 0.0.0.0, also next to other
// records (e.g. alongside an IPv6 or CNAME result)
//
function isBlockedAnswer(answer) {
  return Array.isArray(answer) && answer.includes('0.0.0.0');
}

// how long an answer from either filter is cached at most
const MAX_TTL_SECONDS = ms('30m') / 1000;

// (`overrides`: other Tangerine options, e.g. a shorter `timeout`)
function createFilteredResolver(
  client,
  logger,
  { cachePrefix, servers, overrides = {} }
) {
  return createTangerine(client, logger, {
    ...overrides,
    cachePrefix,
    servers: new Set(servers),
    // (an answer without a TTL, or with a longer one, is cached for 30 minutes)
    defaultTTLSeconds: MAX_TTL_SECONDS,
    maxTTLSeconds: MAX_TTL_SECONDS,
    setCacheArgs(key, result) {
      return ['PX', Math.round(result.ttl * 1000)];
    }
  });
}

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
function createFamilyResolver(client, logger, overrides) {
  return createFilteredResolver(client, logger, {
    cachePrefix: 'tangerine_family:',
    servers: FAMILY_SERVERS,
    overrides
  });
}

//
// A resolver for Cloudflare's malware blocking DNS (1.1.1.2 and 1.0.0.2),
// which answers 0.0.0.0 for malware and phishing but not for adult content.
// Asked about a domain the family resolver blocks, it tells a security threat
// from a domain categorized as adult (cached apart from both other resolvers
// for the same reasons).
//
function createSecurityResolver(client, logger, overrides) {
  return createFilteredResolver(client, logger, {
    cachePrefix: 'tangerine_security:',
    servers: SECURITY_SERVERS,
    overrides
  });
}

//
// The resolvers the domain check asks (see `helpers/check-domain-and-act`):
// Cloudflare Family DNS, its security filter, and an unfiltered one (to see
// whether a domain both block points to 0.0.0.0 itself); `overrides` are
// other options for the first two, e.g. a shorter `timeout`
//
function createDomainCheckResolvers(client, logger, overrides) {
  return {
    familyResolver: createFamilyResolver(client, logger, overrides),
    securityResolver: createSecurityResolver(client, logger, overrides),
    resolver: createTangerine(client, logger)
  };
}

module.exports = createFamilyResolver;
module.exports.createSecurityResolver = createSecurityResolver;
module.exports.createDomainCheckResolvers = createDomainCheckResolvers;
module.exports.FAMILY_SERVERS = FAMILY_SERVERS;
module.exports.isBlockedAnswer = isBlockedAnswer;
