/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const pMap = require('p-map');

const { DNSBL_LISTS, DNSBL_CHECK_CONCURRENCY } = require('#config/observatory');
const logger = require('#helpers/logger');

/**
 * Reverse an IPv4 address for DNSBL lookup.
 * e.g. '1.2.3.4' -> '4.3.2.1'
 *
 * @param {string} ip
 * @returns {string}
 */
function reverseIp(ip) {
  return ip.split('.').reverse().join('.');
}

/**
 * Query a single DNSBL for a given value.
 *
 * For IP-based lists, the query is: reversed-ip.zone
 * For domain-based lists, the query is: domain.zone
 *
 * A successful A record resolution means the value is listed.
 * We also attempt a TXT lookup for the reason string.
 *
 * @param {string} value    - IP address or domain name
 * @param {string} type     - 'ip' or 'domain'
 * @param {Object} list     - { name, zone, weight, type } from DNSBL_LISTS
 * @param {Object} resolver - Tangerine resolver instance
 * @returns {Promise<Object>} { list_name, is_listed, response_code, txt_record }
 */
async function querySingleList(value, type, list, resolver) {
  const result = {
    list_name: list.name,
    is_listed: false,
    response_code: null,
    txt_record: null,
    weight: list.weight
  };

  try {
    // Build the DNSBL query name
    let queryName;
    if (type === 'ip') {
      // Only IPv4 supported by most DNSBLs
      if (!isIP(value) || isIP(value) !== 4) return result;
      queryName = `${reverseIp(value)}.${list.zone}`;
    } else {
      queryName = `${value}.${list.zone}`;
    }

    // Resolve A record -- if it resolves, the value is listed
    const addresses = await resolver.resolve(queryName, 'A');

    if (Array.isArray(addresses) && addresses.length > 0) {
      result.is_listed = true;
      result.response_code = addresses[0];

      // Try to get the TXT record for a reason string
      try {
        const txtRecords = await resolver.resolve(queryName, 'TXT');
        if (Array.isArray(txtRecords) && txtRecords.length > 0) {
          // TXT records come as arrays of strings
          result.txt_record = Array.isArray(txtRecords[0])
            ? txtRecords[0].join('')
            : String(txtRecords[0]);
        }
      } catch {
        // TXT lookup failure is not an error -- many lists don't have TXT
      }
    }
  } catch (err) {
    // NXDOMAIN / NODATA = not listed (expected for clean values)
    // Only log unexpected errors
    if (err.code !== 'ENOTFOUND' && err.code !== 'ENODATA') {
      logger.debug('DNSBL query error', {
        list: list.name,
        value,
        error: err.code || err.message
      });
    }
  }

  return result;
}

/**
 * Check a domain or IP against all configured DNSBL lists.
 *
 * @param {string} value        - IP address or domain name
 * @param {string} type         - 'ip' or 'domain'
 * @param {Object} resolver     - Tangerine resolver instance
 * @param {Object} [options]    - { concurrency, lists }
 * @returns {Promise<Object[]>} Array of { list_name, is_listed, response_code, txt_record, weight }
 */
async function checkDnsbl(value, type, resolver, options = {}) {
  const concurrency = options.concurrency || DNSBL_CHECK_CONCURRENCY;

  // Filter lists to the appropriate type
  const lists = (options.lists || DNSBL_LISTS).filter(
    (list) => list.type === type
  );

  const results = await pMap(
    lists,
    (list) => querySingleList(value, type, list, resolver),
    { concurrency }
  );

  return results;
}

module.exports = { checkDnsbl, querySingleList, reverseIp };
