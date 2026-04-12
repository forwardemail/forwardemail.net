/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Central configuration for the Email Deliverability Observatory.
//
// Defines DNSBL lists, scoring weights, reputation grade thresholds,
// CT log endpoints, DNS record types to monitor, and Redis key prefixes.
//
// Pattern: config/smtp-reputation.js
//

// ───────────────────────────────────────────────────────────────────
// DNSBL Lists
// ───────────────────────────────────────────────────────────────────
//
// Each entry defines a DNS-based blacklist to query.
//   - name:   unique identifier used in events and summaries
//   - zone:   DNSBL zone to query (reverse-IP.zone for IP lists)
//   - weight: 1-10 severity weight for scoring (10 = most impactful)
//   - type:   'ip' for IP-based lists, 'domain' for domain-based lists
//
const DNSBL_LISTS = [
  // IP-based lists (query as reversed-IP.zone)
  {
    name: 'spamhaus-zen',
    zone: 'zen.spamhaus.org',
    weight: 10,
    type: 'ip'
  },
  { name: 'spamcop', zone: 'bl.spamcop.net', weight: 7, type: 'ip' },
  {
    name: 'barracuda',
    zone: 'b.barracudacentral.org',
    weight: 6,
    type: 'ip'
  },
  { name: 'cbl', zone: 'cbl.abuseat.org', weight: 8, type: 'ip' },
  { name: 'sorbs', zone: 'dnsbl.sorbs.net', weight: 5, type: 'ip' },
  { name: 'psbl', zone: 'psbl.surriel.com', weight: 4, type: 'ip' },
  {
    name: 'uceprotect-1',
    zone: 'dnsbl-1.uceprotect.net',
    weight: 3,
    type: 'ip'
  },
  {
    name: 'backscatterer',
    zone: 'ips.backscatterer.org',
    weight: 2,
    type: 'ip'
  },

  // Domain-based lists (query as domain.zone)
  {
    name: 'spamhaus-dbl',
    zone: 'dbl.spamhaus.org',
    weight: 9,
    type: 'domain'
  },
  { name: 'surbl', zone: 'multi.surbl.org', weight: 7, type: 'domain' },
  { name: 'uribl', zone: 'multi.uribl.com', weight: 6, type: 'domain' }
];

// Subset of DNSBL_LISTS that support bulk file download
// (extends the existing update-uceprotect.js approach)
const DOWNLOADABLE_LISTS = [
  {
    name: 'uceprotect-1',
    prefix: 'obs:bl:bulk',
    url: 'http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz'
  },
  {
    name: 'backscatterer',
    prefix: 'obs:bl:bulk',
    url: 'http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz'
  }
];

// ───────────────────────────────────────────────────────────────────
// Reputation Scoring
// ───────────────────────────────────────────────────────────────────

// How each factor contributes to the composite 0-100 score
const SCORING_WEIGHTS = {
  blacklists: 0.4, // Presence on DNSBLs (weighted by list severity)
  dns_config: 0.25, // DMARC policy, valid SPF, MX exists, PTR
  dmarc_compliance: 0.2, // SPF + DKIM alignment rates from reports
  infrastructure: 0.1, // Reputable DNS provider, legitimate hosting
  cert_hygiene: 0.05 // No suspicious CT events, valid TLS
};

// Letter grade thresholds (score >= threshold gets the grade)
const REPUTATION_GRADES = {
  'A+': 95,
  A: 85,
  B: 70,
  C: 55,
  D: 40,
  F: 0
};

// ───────────────────────────────────────────────────────────────────
// Certificate Transparency
// ───────────────────────────────────────────────────────────────────

const CT_LOG_APIS = [
  {
    name: 'crt.sh',
    baseUrl: 'https://crt.sh',
    // query: /?q=%.{domain}&output=json
    type: 'json'
  }
];

// ───────────────────────────────────────────────────────────────────
// DNS Monitoring
// ───────────────────────────────────────────────────────────────────

const DNS_MONITOR_RECORD_TYPES = [
  'MX',
  'SPF',
  'DMARC',
  'DKIM',
  'NS',
  'A',
  'AAAA'
];

// ───────────────────────────────────────────────────────────────────
// Concurrency & Rate Limits
// ───────────────────────────────────────────────────────────────────

const DNSBL_CHECK_CONCURRENCY = 5; // Parallel DNS lookups per subject
const DNS_MONITOR_CONCURRENCY = 10; // Parallel domain DNS snapshots
const CT_CHECK_CONCURRENCY = 3; // Parallel crt.sh requests
const SUBJECT_BATCH_SIZE = 500; // Subjects per job iteration

// ───────────────────────────────────────────────────────────────────
// Redis Key Prefixes
// ───────────────────────────────────────────────────────────────────
//
// All observatory keys live under the 'obs:' namespace to avoid
// collisions with the existing denylist:/allowlist: keys used
// by the SMTP pipeline.
//
const REDIS_PREFIXES = {
  blacklist: 'obs:bl:',
  dns: 'obs:dns:',
  rateLimit: 'obs:rl:',
  alert: 'obs:alert:',
  ct: 'obs:ct:',
  lookup: 'obs:lookup:',
  asn: 'obs:asn:'
};

// ───────────────────────────────────────────────────────────────────
// TTL Defaults (milliseconds)
// ───────────────────────────────────────────────────────────────────

const ms = require('ms');

const TTL = {
  blacklistCache: ms('30m'),
  lookupCache: ms('5m'),
  asnCache: ms('7d'),
  alertDedup: ms('1h'),
  ctLastCheck: ms('7d')
};

module.exports = {
  DNSBL_LISTS,
  DOWNLOADABLE_LISTS,
  SCORING_WEIGHTS,
  REPUTATION_GRADES,
  CT_LOG_APIS,
  DNS_MONITOR_RECORD_TYPES,
  DNSBL_CHECK_CONCURRENCY,
  DNS_MONITOR_CONCURRENCY,
  CT_CHECK_CONCURRENCY,
  SUBJECT_BATCH_SIZE,
  REDIS_PREFIXES,
  TTL
};
