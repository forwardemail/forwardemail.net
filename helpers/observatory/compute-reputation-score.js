/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const {
  SCORING_WEIGHTS,
  REPUTATION_GRADES,
  DNSBL_LISTS
} = require('#config/observatory');
const {
  REPUTABLE_DNS_PROVIDER_SLUGS,
  isValidPublicIP
} = require('#config/smtp-reputation');

// Maximum possible weighted penalty from blacklists
// (sum of all IP list weights + all domain list weights)
const MAX_IP_BL_WEIGHT = DNSBL_LISTS.filter((l) => l.type === 'ip').reduce(
  (sum, l) => sum + l.weight,
  0
);
const MAX_DOMAIN_BL_WEIGHT = DNSBL_LISTS.filter(
  (l) => l.type === 'domain'
).reduce((sum, l) => sum + l.weight, 0);

/**
 * Compute a reputation score from 0-100 and a letter grade
 * for an observatory subject.
 *
 * This is a pure function with no side effects.
 *
 * @param {Object} inputs
 * @param {Object}   inputs.blacklistResults - Array of { list_name, is_listed, weight }
 * @param {Object}   inputs.dnsSnapshot      - DNS snapshot object (or null)
 * @param {Object}   inputs.dmarcCompliance  - { spf_aligned_pct, dkim_aligned_pct } (0-100 each, or null)
 * @param {Object}   inputs.infrastructure   - { ns_records, a_records, has_ptr } (or null)
 * @param {Object}   inputs.ctSummary        - { suspicious_count } (or null)
 * @param {string}   inputs.subjectType      - 'ip' or 'domain'
 * @returns {{ score: number, grade: string, breakdown: Object }}
 */
function computeReputationScore(inputs) {
  const {
    blacklistResults,
    dnsSnapshot,
    dmarcCompliance,
    infrastructure,
    ctSummary,
    subjectType
  } = inputs;

  const breakdown = {
    blacklists: 100,
    dns_config: 100,
    dmarc_compliance: 100,
    infrastructure: 100,
    cert_hygiene: 100
  };

  // ── Blacklist Score (0-100) ───────────────────────────────────
  // Deduct points proportional to the severity weight of each listing
  if (Array.isArray(blacklistResults) && blacklistResults.length > 0) {
    const maxWeight =
      subjectType === 'ip' ? MAX_IP_BL_WEIGHT : MAX_DOMAIN_BL_WEIGHT;

    if (maxWeight > 0) {
      let listedWeight = 0;
      for (const result of blacklistResults) {
        if (result.is_listed) {
          listedWeight += result.weight || 1;
        }
      }

      // Scale: 0 listings = 100, all listings = 0
      breakdown.blacklists = Math.max(
        0,
        Math.round(100 * (1 - listedWeight / maxWeight))
      );
    }
  }

  // ── DNS Config Score (0-100) ──────────────────────────────────
  // Only applicable to domains
  if (subjectType === 'domain' && dnsSnapshot) {
    let dnsScore = 100;

    // No MX records: -30
    if (!dnsSnapshot.MX || dnsSnapshot.MX.length === 0) {
      dnsScore -= 30;
    }

    // No SPF record: -25
    if (!dnsSnapshot.SPF) {
      dnsScore -= 25;
    } else if (dnsSnapshot.spf_lookup_count > 10) {
      // SPF exceeds 10 lookups: -15
      dnsScore -= 15;
    }

    // DMARC policy scoring
    if (dnsSnapshot.DMARC) {
      const policy = dnsSnapshot.dmarc_policy;
      if (policy === 'none') dnsScore -= 15; // Monitoring only
      else if (policy === 'quarantine') dnsScore -= 5; // Partial enforcement
      // 'reject' = full enforcement, no deduction
    } else {
      // No DMARC record: -25
      dnsScore -= 25;
    }

    // No NS records: -20
    if (!dnsSnapshot.NS || dnsSnapshot.NS.length === 0) {
      dnsScore -= 20;
    }

    breakdown.dns_config = Math.max(0, dnsScore);
  } else if (subjectType === 'ip') {
    // For IPs, DNS config is less relevant -- base on PTR
    breakdown.dns_config = infrastructure?.has_ptr ? 100 : 50;
  }

  // ── DMARC Compliance Score (0-100) ────────────────────────────
  // Average of SPF alignment % and DKIM alignment %
  if (dmarcCompliance) {
    const spfPct =
      typeof dmarcCompliance.spf_aligned_pct === 'number'
        ? dmarcCompliance.spf_aligned_pct
        : 0;
    const dkimPct =
      typeof dmarcCompliance.dkim_aligned_pct === 'number'
        ? dmarcCompliance.dkim_aligned_pct
        : 0;
    breakdown.dmarc_compliance = Math.round((spfPct + dkimPct) / 2);
  } else {
    // No DMARC data: neutral (don't penalize for lack of reports)
    breakdown.dmarc_compliance = 75;
  }

  // ── Infrastructure Score (0-100) ──────────────────────────────
  if (infrastructure) {
    let infraScore = 100;

    // Check NS provider reputation (reuse existing REPUTABLE_DNS_PROVIDER_SLUGS)
    if (
      infrastructure.ns_provider_slug &&
      !REPUTABLE_DNS_PROVIDER_SLUGS.has(infrastructure.ns_provider_slug)
    ) {
      infraScore -= 20;
    }

    // Check A records for parking/private IPs
    if (Array.isArray(infrastructure.a_records)) {
      const hasLegitimate = infrastructure.a_records.some((ip) =>
        isValidPublicIP(ip)
      );
      if (!hasLegitimate && infrastructure.a_records.length > 0) {
        infraScore -= 40;
      }
    }

    // PTR record
    if (!infrastructure.has_ptr && subjectType === 'ip') {
      infraScore -= 20;
    }

    breakdown.infrastructure = Math.max(0, infraScore);
  }

  // ── Certificate Hygiene Score (0-100) ─────────────────────────
  if (ctSummary && ctSummary.suspicious_count > 0) {
    // Each suspicious cert deducts 25 points (capped at 0)
    breakdown.cert_hygiene = Math.max(0, 100 - ctSummary.suspicious_count * 25);
  }

  // ── Weighted Composite Score ──────────────────────────────────
  const score = Math.round(
    breakdown.blacklists * SCORING_WEIGHTS.blacklists +
      breakdown.dns_config * SCORING_WEIGHTS.dns_config +
      breakdown.dmarc_compliance * SCORING_WEIGHTS.dmarc_compliance +
      breakdown.infrastructure * SCORING_WEIGHTS.infrastructure +
      breakdown.cert_hygiene * SCORING_WEIGHTS.cert_hygiene
  );

  // ── Letter Grade ──────────────────────────────────────────────
  let grade = 'F';
  // REPUTATION_GRADES is ordered highest to lowest
  const sortedGrades = Object.entries(REPUTATION_GRADES).sort(
    (a, b) => b[1] - a[1]
  );
  for (const [letter, threshold] of sortedGrades) {
    if (score >= threshold) {
      grade = letter;
      break;
    }
  }

  return { score, grade, breakdown };
}

module.exports = computeReputationScore;
