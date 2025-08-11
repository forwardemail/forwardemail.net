/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const logger = require('./logger');
const retryRequest = require('./retry-request');
const {
  REPUTABLE_DNS_PROVIDERS,
  PARKING_IPS
} = require('#config/smtp-reputation');

function hasReputableDNS(nsRecords) {
  if (!Array.isArray(nsRecords) || nsRecords.length === 0) return false;

  return nsRecords.some((ns) => {
    const lowerNS = ns.toLowerCase();
    return [...REPUTABLE_DNS_PROVIDERS].some((provider) =>
      lowerNS.includes(provider.toLowerCase())
    );
  });
}

function hasLegitimateHosting(aRecords) {
  if (!Array.isArray(aRecords) || aRecords.length === 0) return false;
  return aRecords.some((ip) => !PARKING_IPS.has(ip));
}

async function respondsToHTTP(domain, timeout = ms('5s')) {
  const urls = [`https://${domain}`, `http://${domain}`];

  for (const url of urls) {
    try {
      const response = await retryRequest(url, {
        method: 'GET',
        timeout,
        retries: 0,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; ForwardEmail/1.0; +https://forwardemail.net)'
        }
      });

      if (response && response.status >= 200 && response.status < 400) {
        // consume body to prevent memory leaks
        if (
          !response?.signal?.aborted &&
          typeof response?.body?.dump === 'function'
        )
          await response.body.dump();

        return true;
      }
    } catch (err) {
      logger.debug(err);
    }
  }

  return false;
}

async function hasValidPTR(ip, domain, resolver) {
  try {
    const ptrRecords = await resolver.reverse(ip);

    if (!Array.isArray(ptrRecords) || ptrRecords.length === 0) return false;

    const domainParts = domain.toLowerCase().split('.');
    const rootDomain = domainParts.slice(-2).join('.');

    return ptrRecords.some((ptr) => {
      const lowerPTR = ptr.toLowerCase();
      return (
        lowerPTR.includes(rootDomain) || lowerPTR.includes(domain.toLowerCase())
      );
    });
  } catch (err) {
    logger.debug(err);
    return false;
  }
}

module.exports = {
  hasReputableDNS,
  hasLegitimateHosting,
  respondsToHTTP,
  hasValidPTR
};
