/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The CSV attached to the digest of `jobs/check-domains-cloudflare-family.js`:
// every flagged domain (flagged for review, skipped, and review) with one row
// per entry. It replaces the giant inline HTML tables that could exceed email
// size limits.
//

const csvEscape = require('#helpers/csv-escape');
const getCloudflareRadarFeedbackUrl = require('#helpers/get-cloudflare-radar-feedback-url');

const HEADERS = [
  'Section',
  'Domain',
  'Cloudflare Radar Change Request',
  'All Categories',
  'Actionable Categories',
  'Title',
  'HTTP Status',
  'Content Length (bytes)',
  'Is Parked',
  'Legit Hosting',
  'User Email',
  'User Group',
  'KYC Passed',
  'Account Age (days)',
  'Exclusion Reasons',
  'Alias Count',
  'Dry Run',
  'Cloudflare Block',
  'Evidence',
  'New Alert This Run'
];

// e.g. `adult: "porn video" (text: …free porn video…), "hentai" (title: …)`
// (the words around each, as in the review email: for what is listed in the
//  digest only, this is where a reviewer sees them)
function formatEvidence(evidence) {
  if (!evidence) return '';
  return Object.entries(evidence)
    .map(
      ([category, found]) =>
        `${category}: ${(found || [])
          .map(
            (e) =>
              `"${e.keyword}" (${e.in}${e.excerpt ? `: ${e.excerpt}` : ''})`
          )
          .join(', ')}`
    )
    .join('; ');
}

/**
 * @param   {object}  opts
 * @param   {Array}   opts.bannedResults
 * @param   {Array}   opts.skippedResults
 * @param   {Array}   opts.reviewResults
 * @param   {boolean} opts.dryRun
 * @returns {string}  CSV content
 */
function getDomainCheckDigestCsv(opts) {
  const { bannedResults, skippedResults, reviewResults, dryRun } = opts;

  const rows = [HEADERS.join(',')];
  const dryRunVal = dryRun ? 'Yes' : 'No';

  function row(section, result, values) {
    const cells = {
      Section: section,
      Domain: result.domain,
      'Cloudflare Radar Change Request': getCloudflareRadarFeedbackUrl(
        result.domain
      ),
      'All Categories': result.categories.join('; '),
      Title: result.title || '',
      'Alias Count': result.aliasCount,
      'Dry Run': dryRunVal,
      'Cloudflare Block': result.cloudflareBlock || '',
      Evidence: formatEvidence(result.evidence),
      ...values
    };
    // (every row has a cell under every header, in the same order)
    rows.push(
      HEADERS.map((header) =>
        csvEscape(cells[header] === undefined ? '' : cells[header])
      ).join(',')
    );
  }

  function pageCells(result) {
    return {
      'HTTP Status': result.statusCode === null ? '' : result.statusCode,
      'Content Length (bytes)': result.contentLength,
      'Is Parked': result.isParked ? 'Yes' : 'No',
      'Legit Hosting': result.hasLegitimateHosting ? 'Yes' : 'No'
    };
  }

  // Flagged domains (emailed to support@ for review once) – one row per flagged user
  for (const result of bannedResults) {
    for (const user of result.users) {
      row('Flagged for Review', result, {
        'Actionable Categories': result.bannableCategories.join('; '),
        ...pageCells(result),
        'User Email': user.email,
        'New Alert This Run': !dryRun && result.alertSent ? 'Yes' : 'No'
      });
    }
  }

  // Skipped / protected users – one row per skipped user
  for (const result of skippedResults) {
    row('Skipped (Protected)', result, {
      'Actionable Categories': result.bannableCategories.join('; '),
      'User Email': result.user.email,
      'User Group': result.user.group,
      'KYC Passed': result.user.hasPassedKyc ? 'Yes' : 'No',
      'Account Age (days)':
        result.user.accountAgeDays === null ? '' : result.user.accountAgeDays,
      'Exclusion Reasons': result.exclusionReasons.join('; ')
    });
  }

  // Review domains – one row per domain
  for (const result of reviewResults) {
    row('Review', result, {
      'Actionable Categories': result.reviewCategories.join('; '),
      ...pageCells(result)
    });
  }

  return rows.join('\n');
}

module.exports = getDomainCheckDigestCsv;
