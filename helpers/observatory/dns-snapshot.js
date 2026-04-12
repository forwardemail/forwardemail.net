/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isEqual } = require('node:util');

const getDmarcRecord = require('mailauth/lib/dmarc/get-dmarc-record');

const logger = require('#helpers/logger');

/**
 * Count the number of DNS lookups an SPF record would cause.
 * Mechanisms that trigger lookups: include, a, mx, ptr, exists, redirect.
 * The RFC 7208 limit is 10.
 *
 * This is a shallow count from the record text itself -- it does not
 * recursively resolve includes (that would require full SPF evaluation).
 *
 * @param {string} spfRecord - The SPF TXT record value
 * @returns {number} Estimated lookup count
 */
function countSpfLookups(spfRecord) {
  if (!spfRecord) return 0;

  const lower = spfRecord.toLowerCase();
  let count = 0;

  // Each of these mechanisms triggers a DNS lookup
  const lookupMechanisms = [
    /\binclude:/g,
    /\ba:/g,
    /\bmx\b/g,
    /\bptr\b/g,
    /\bexists:/g,
    /\bredirect=/g
  ];

  for (const regex of lookupMechanisms) {
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }

  return count;
}

/**
 * Take a DNS snapshot of a domain, resolving all relevant record types.
 *
 * @param {string} domain    - The domain name to snapshot
 * @param {Object} resolver  - Tangerine resolver instance
 * @returns {Promise<Object>} Structured snapshot
 */
async function takeDnsSnapshot(domain, resolver) {
  const snapshot = {
    MX: null,
    SPF: null,
    DMARC: null,
    NS: null,
    A: null,
    AAAA: null,
    spf_record: null,
    spf_lookup_count: 0,
    dmarc_policy: null,
    dmarc_record: null,
    errors: []
  };

  // Run all DNS lookups concurrently
  const [mxResult, txtResult, nsResult, aResult, aaaaResult, dmarcResult] =
    await Promise.allSettled([
      resolver.resolve(domain, 'MX'),
      resolver.resolve(domain, 'TXT'),
      resolver.resolve(domain, 'NS'),
      resolver.resolve(domain, 'A'),
      resolver.resolve(domain, 'AAAA'),
      getDmarcRecord({ resolver, params: domain }).catch((err) => {
        logger.debug('DMARC record lookup failed', {
          domain,
          error: err.message
        });
        return null;
      })
    ]);

  // MX records
  if (mxResult.status === 'fulfilled' && Array.isArray(mxResult.value)) {
    snapshot.MX = mxResult.value
      .map((mx) =>
        typeof mx === 'object'
          ? { priority: mx.priority, exchange: mx.exchange }
          : mx
      )
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  } else if (mxResult.status === 'rejected') {
    snapshot.errors.push({ type: 'MX', error: mxResult.reason?.code });
  }

  // TXT records -- extract SPF
  if (txtResult.status === 'fulfilled' && Array.isArray(txtResult.value)) {
    for (const record of txtResult.value) {
      const txt = Array.isArray(record) ? record.join('') : String(record);
      if (txt.toLowerCase().startsWith('v=spf1')) {
        snapshot.SPF = txt;
        snapshot.spf_record = txt;
        snapshot.spf_lookup_count = countSpfLookups(txt);
        break;
      }
    }
  } else if (txtResult.status === 'rejected') {
    snapshot.errors.push({ type: 'TXT', error: txtResult.reason?.code });
  }

  // NS records
  if (nsResult.status === 'fulfilled' && Array.isArray(nsResult.value)) {
    snapshot.NS = nsResult.value.sort();
  } else if (nsResult.status === 'rejected') {
    snapshot.errors.push({ type: 'NS', error: nsResult.reason?.code });
  }

  // A records
  if (aResult.status === 'fulfilled' && Array.isArray(aResult.value)) {
    snapshot.A = aResult.value.sort();
  } else if (aResult.status === 'rejected') {
    snapshot.errors.push({ type: 'A', error: aResult.reason?.code });
  }

  // AAAA records
  if (aaaaResult.status === 'fulfilled' && Array.isArray(aaaaResult.value)) {
    snapshot.AAAA = aaaaResult.value.sort();
  } else if (aaaaResult.status === 'rejected') {
    snapshot.errors.push({ type: 'AAAA', error: aaaaResult.reason?.code });
  }

  // DMARC record
  if (
    dmarcResult.status === 'fulfilled' &&
    dmarcResult.value &&
    typeof dmarcResult.value === 'object'
  ) {
    const dmarc = dmarcResult.value;
    snapshot.DMARC = dmarc;
    snapshot.dmarc_record = dmarc.record || null;
    snapshot.dmarc_policy = dmarc.p || null;
  }

  return snapshot;
}

/**
 * Compare two DNS snapshots and return an array of changes.
 *
 * @param {Object|null} previous - Previous snapshot (null for first run)
 * @param {Object} current       - Current snapshot
 * @returns {Object[]} Array of { record_type, change_type, record_data, previous_data }
 */
function diffSnapshots(previous, current) {
  const changes = [];
  const recordTypes = ['MX', 'SPF', 'DMARC', 'NS', 'A', 'AAAA'];

  for (const type of recordTypes) {
    const prev = previous ? previous[type] : null;
    const curr = current[type];

    if (prev === null && curr === null) continue;

    if (prev === null && curr !== null) {
      changes.push({
        record_type: type,
        change_type: previous ? 'added' : 'initial',
        record_data: curr,
        previous_data: null
      });
    } else if (prev !== null && curr === null) {
      changes.push({
        record_type: type,
        change_type: 'removed',
        record_data: null,
        previous_data: prev
      });
    } else if (!isEqual(prev, curr)) {
      changes.push({
        record_type: type,
        change_type: 'modified',
        record_data: curr,
        previous_data: prev
      });
    }
  }

  return changes;
}

module.exports = {
  takeDnsSnapshot,
  diffSnapshots,
  countSpfLookups
};
