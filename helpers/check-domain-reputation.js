/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');
const ms = require('ms');

const logger = require('./logger');
const retryRequest = require('./retry-request');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const { nsProviderLookup } = require('#config/utilities');
const {
  REPUTABLE_DNS_PROVIDER_SLUGS,
  isValidPublicIP
} = require('#config/smtp-reputation');

function hasReputableDNS(nsRecords, domain = null) {
  if (!Array.isArray(nsRecords) || nsRecords.length === 0) return false;

  // Use nsProviderLookup if domain is provided (preferred approach)
  if (domain) {
    const provider = nsProviderLookup({ ns: nsRecords, name: domain });
    if (provider && provider.slug) {
      return REPUTABLE_DNS_PROVIDER_SLUGS.has(provider.slug);
    }
  }

  // Fallback: return false if no domain provided (requires nsProviderLookup)
  return false;
}

function hasLegitimateHosting(aRecords) {
  if (!Array.isArray(aRecords) || aRecords.length === 0) return false;
  return aRecords.some((ip) => isValidPublicIP(ip));
}

async function respondsToHTTP(domain, timeout = ms('5s')) {
  // Check if domain resolves to localhost/private IP and return false if so
  if (isIP(domain) && REGEX_LOCALHOST.test(domain)) return false;

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
