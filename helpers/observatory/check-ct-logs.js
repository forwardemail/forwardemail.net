/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const undici = require('undici');

const pkg = require('../../package.json');

const config = require('#config');
const logger = require('#helpers/logger');

// Shared dispatcher with redirect support (same pattern as get-domain-categorization.js)
const dispatcher = new undici.Agent().compose(
  undici.interceptors.redirect({ maxRedirections: 3 })
);

// Well-known CAs that are expected for most domains.
// Certificates from issuers NOT in this set are flagged as suspicious
// when no custom allowlist is configured for the subject.
const COMMON_ISSUERS = new Set([
  "C=US, O=Let's Encrypt, CN=R3",
  "C=US, O=Let's Encrypt, CN=R10",
  "C=US, O=Let's Encrypt, CN=R11",
  "C=US, O=Let's Encrypt, CN=E5",
  "C=US, O=Let's Encrypt, CN=E6",
  'C=US, O=Amazon, CN=Amazon RSA 2048 M01',
  'C=US, O=Amazon, CN=Amazon RSA 2048 M02',
  'C=US, O=Amazon, CN=Amazon RSA 2048 M03',
  'C=US, O=DigiCert Inc, CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1',
  'C=US, O=Cloudflare, Inc., CN=Cloudflare Inc ECC CA-3',
  'C=US, O=Google Trust Services LLC, CN=GTS CA 1P5',
  'C=US, O=Google Trust Services LLC, CN=GTS CA 1D4',
  'C=US, O=Google Trust Services, CN=WR2',
  'C=US, O=Internet Security Research Group, CN=ISRG Root X1',
  'C=AT, O=ZeroSSL, CN=ZeroSSL RSA Domain Secure Site CA',
  'C=GB, ST=Greater Manchester, L=Salford, O=Sectigo Limited, CN=Sectigo RSA Domain Validation Secure Server CA'
]);

/**
 * Query crt.sh for certificates issued for a domain.
 *
 * API: https://crt.sh/?q=%.{domain}&output=json
 *
 * Returns an array of certificate entries with:
 *   - id, issuer_ca_id, issuer_name
 *   - common_name, name_value (SANs as newline-separated string)
 *   - not_before, not_after
 *   - serial_number, result_count
 *
 * @param {string} domain      - Domain to query
 * @param {Object} [options]   - { since: Date, timeout: number }
 * @returns {Promise<Object[]>} Array of cert entries
 */
async function queryCrtSh(domain, options = {}) {
  const timeout = options.timeout || 30_000;

  const url = `https://crt.sh/?q=${encodeURIComponent(
    `%.${domain}`
  )}&output=json`;

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    if (!abortController.signal.aborted) abortController.abort();
  }, timeout);

  try {
    const response = await undici.request(url, {
      method: 'GET',
      signal: abortController.signal,
      dispatcher,
      headers: {
        'User-Agent': `${pkg.name}/${pkg.version} (+${config.urls.web})`,
        Accept: 'application/json'
      }
    });

    clearTimeout(timer);

    if (response.statusCode !== 200) {
      // Consume body to prevent socket hang
      try {
        if (typeof response.body?.dump === 'function') {
          await response.body.dump();
        }
      } catch {
        // ignore
      }

      logger.debug('crt.sh returned non-200', {
        domain,
        statusCode: response.statusCode
      });
      return [];
    }

    // Read the body (limit to 5MB to prevent abuse)
    const chunks = [];
    let totalBytes = 0;
    const MAX_BYTES = 5 * 1024 * 1024;

    for await (const chunk of response.body) {
      chunks.push(chunk);
      totalBytes += chunk.length;
      if (totalBytes >= MAX_BYTES) break;
    }

    // Consume remaining body
    try {
      if (typeof response.body?.dump === 'function') {
        await response.body.dump();
      }
    } catch {
      // ignore
    }

    const bodyStr = Buffer.concat(chunks).toString('utf8');
    const entries = JSON.parse(bodyStr);

    if (!Array.isArray(entries)) return [];

    // Filter by date if `since` is provided
    if (options.since) {
      const sinceTime = new Date(options.since).getTime();
      return entries.filter((entry) => {
        const entryTime = new Date(entry.not_before || entry.entry_timestamp);
        return entryTime.getTime() >= sinceTime;
      });
    }

    return entries;
  } catch (err) {
    clearTimeout(timer);
    logger.debug('crt.sh query failed', {
      domain,
      error: err.code || err.message
    });
    return [];
  }
}

/**
 * Process raw crt.sh entries into structured CT events.
 * Deduplicates by certificate serial number (hashed),
 * parses SANs, and flags suspicious issuers.
 *
 * @param {Object[]} entries   - Raw crt.sh JSON entries
 * @param {string}   domain    - The domain being monitored
 * @param {Set}      [allowedIssuers] - Custom allowed issuers for this domain
 * @returns {Object[]} Processed events ready for DB insertion
 */
function processCtEntries(entries, domain, allowedIssuers) {
  const seenHashes = new Set();
  const results = [];
  const issuersToCheck = allowedIssuers || COMMON_ISSUERS;

  for (const entry of entries) {
    // Generate a unique hash for deduplication
    const hashInput = [
      entry.serial_number || '',
      entry.issuer_ca_id || '',
      entry.not_before || ''
    ].join(':');
    const certHash = crypto
      .createHash('sha256')
      .update(hashInput)
      .digest('hex');

    if (seenHashes.has(certHash)) continue;
    seenHashes.add(certHash);

    // Parse SANs from name_value (newline-separated in crt.sh)
    const sanList = entry.name_value
      ? entry.name_value
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    // Check if the issuer is expected
    const issuerName = entry.issuer_name || '';
    const isSuspicious =
      issuerName.length > 0 && !issuersToCheck.has(issuerName);

    results.push({
      certificate_hash: certHash,
      issuer: issuerName,
      not_before: entry.not_before ? new Date(entry.not_before) : null,
      not_after: entry.not_after ? new Date(entry.not_after) : null,
      san_list: sanList,
      ct_log_name: 'crt.sh',
      is_suspicious: isSuspicious,
      detected_at: new Date()
    });
  }

  return results;
}

module.exports = {
  queryCrtSh,
  processCtEntries,
  COMMON_ISSUERS
};
