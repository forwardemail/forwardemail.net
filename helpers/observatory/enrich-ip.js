/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const { REDIS_PREFIXES, TTL } = require('#config/observatory');
const logger = require('#helpers/logger');

/**
 * Enrich an IP address with ASN, organization, and country data
 * using Team Cymru's DNS-based ASN lookup service.
 *
 * Query: reversed-ip.origin.asn.cymru.com TXT
 * Response format: "ASN | PREFIX | CC | RIR | DATE"
 * e.g. "15169 | 8.8.8.0/24 | US | arin | 2014-03-14"
 *
 * Then query AS description: AS{asn}.asn.cymru.com TXT
 * Response format: "ASN | CC | RIR | DATE | ORG"
 * e.g. "15169 | US | arin | 2000-03-30 | GOOGLE, US"
 *
 * @param {string} ip         - IPv4 address
 * @param {Object} resolver   - Tangerine resolver instance
 * @param {Object} [client]   - Redis client for caching (optional)
 * @returns {Promise<Object>}  { asn, asn_org, country_code, prefix }
 */
async function enrichIp(ip, resolver, client) {
  if (!isIP(ip) || isIP(ip) !== 4) {
    return { asn: null, asn_org: null, country_code: null, prefix: null };
  }

  // Check cache first
  if (client) {
    try {
      const cached = await client.get(`${REDIS_PREFIXES.asn}${ip}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Cache miss, proceed with lookup
    }
  }

  const result = { asn: null, asn_org: null, country_code: null, prefix: null };

  try {
    // Step 1: Query origin ASN
    const reversed = ip.split('.').reverse().join('.');
    const originQuery = `${reversed}.origin.asn.cymru.com`;
    const originTxt = await resolver.resolve(originQuery, 'TXT');

    if (!Array.isArray(originTxt) || originTxt.length === 0) return result;

    // Parse the first TXT record
    const originRecord = Array.isArray(originTxt[0])
      ? originTxt[0].join('')
      : String(originTxt[0]);
    const originParts = originRecord.split('|').map((s) => s.trim());

    if (originParts.length >= 3) {
      result.asn = Number.parseInt(originParts[0], 10) || null;
      result.prefix = originParts[1] || null;
      result.country_code = originParts[2] || null;
    }

    // Step 2: Query AS description for org name
    if (result.asn) {
      try {
        const asnQuery = `AS${result.asn}.asn.cymru.com`;
        const asnTxt = await resolver.resolve(asnQuery, 'TXT');

        if (Array.isArray(asnTxt) && asnTxt.length > 0) {
          const asnRecord = Array.isArray(asnTxt[0])
            ? asnTxt[0].join('')
            : String(asnTxt[0]);
          const asnParts = asnRecord.split('|').map((s) => s.trim());

          // Format: "ASN | CC | RIR | DATE | ORG"
          if (asnParts.length >= 5) {
            result.asn_org = asnParts[4] || null;
          }
        }
      } catch {
        // ASN description lookup failure is not critical
      }
    }
  } catch (err) {
    logger.debug('IP enrichment error', {
      ip,
      error: err.code || err.message
    });
  }

  // Cache the result
  if (client && (result.asn || result.country_code)) {
    try {
      await client.set(
        `${REDIS_PREFIXES.asn}${ip}`,
        JSON.stringify(result),
        'PX',
        TTL.asnCache
      );
    } catch {
      // Non-critical cache write failure
    }
  }

  return result;
}

module.exports = enrichIp;
