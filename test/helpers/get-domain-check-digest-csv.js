/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The CSV attached to the hourly Cloudflare Family DNS & content check
// digest: every row has a cell under every header.
//

const test = require('ava');

const getDomainCheckDigestCsv = require('#helpers/get-domain-check-digest-csv');

// (every cell is quoted, and a quote inside one is doubled)
function parseCsv(csv) {
  return csv
    .split('\n')
    .map((line) =>
      [...line.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map((m) =>
        m[1] === undefined ? m[2] : m[1].replaceAll('""', '"')
      )
    );
}

const page = {
  title: 'Example',
  statusCode: 200,
  contentLength: 1000,
  isParked: false,
  hasLegitimateHosting: true,
  aliasCount: 2
};

test('each section lines its cells up under the headers', (t) => {
  const csv = getDomainCheckDigestCsv({
    dryRun: false,
    bannedResults: [
      {
        ...page,
        domain: 'flagged.example',
        categories: ['gambling'],
        bannableCategories: ['gambling'],
        users: [{ id: '1', email: 'new-user@example.com' }],
        cloudflareBlock: null,
        evidence: {
          gambling: [
            { keyword: 'casino', in: 'text', excerpt: 'casino' },
            { keyword: 'free spins', in: 'title', excerpt: 'free spins' }
          ]
        },
        alreadyReported: true,
        alertSent: false
      },
      {
        ...page,
        domain: 'newly-flagged.example',
        categories: ['phishing'],
        bannableCategories: ['phishing'],
        users: [{ id: '3', email: 'other-user@example.com' }],
        cloudflareBlock: null,
        evidence: {},
        alreadyReported: false,
        alertSent: true
      }
    ],
    skippedResults: [
      {
        domain: 'protected.example',
        categories: ['adult'],
        bannableCategories: ['adult'],
        title: 'Example',
        user: {
          id: '2',
          email: 'admin@example.com',
          group: 'admin',
          hasPassedKyc: true,
          accountAgeDays: 400
        },
        exclusionReasons: ['User is an admin'],
        aliasCount: 3
      }
    ],
    reviewResults: [
      {
        ...page,
        domain: 'review.example',
        categories: ['blocked_by_cloudflare_family'],
        reviewCategories: ['blocked_by_cloudflare_family'],
        cloudflareBlock: 'adult',
        memberCount: 1
      }
    ]
  });

  const [headers, ...rows] = parseCsv(csv);
  t.is(rows.length, 4);
  for (const row of rows) t.is(row.length, headers.length);

  const cell = (row, header) => row[headers.indexOf(header)];
  const [flagged, newlyFlagged, skipped, review] = rows;

  t.is(cell(flagged, 'Section'), 'Flagged for Review');
  t.is(cell(flagged, 'User Email'), 'new-user@example.com');
  t.is(
    cell(flagged, 'Evidence'),
    'gambling: "casino" (text: casino), "free spins" (title: free spins)'
  );
  t.is(cell(flagged, 'New Alert This Run'), 'No');
  t.is(cell(newlyFlagged, 'New Alert This Run'), 'Yes');

  // every section links to the Cloudflare Radar change request
  for (const row of rows) {
    t.true(
      cell(row, 'Cloudflare Radar Change Request').includes(cell(row, 'Domain'))
    );
  }

  t.is(cell(skipped, 'Section'), 'Skipped (Protected)');
  t.is(cell(skipped, 'User Group'), 'admin');
  t.is(cell(skipped, 'Account Age (days)'), '400');
  t.is(cell(skipped, 'Exclusion Reasons'), 'User is an admin');
  t.is(cell(skipped, 'Alias Count'), '3');

  t.is(cell(review, 'Section'), 'Review');
  t.is(cell(review, 'Actionable Categories'), 'blocked_by_cloudflare_family');
  t.is(cell(review, 'Cloudflare Block'), 'adult');
  t.is(cell(review, 'HTTP Status'), '200');
  t.is(cell(review, 'Alias Count'), '2');
  t.is(cell(review, 'Dry Run'), 'No');
});

test('a dry run says so, and sends no new alert', (t) => {
  const csv = getDomainCheckDigestCsv({
    dryRun: true,
    bannedResults: [
      {
        ...page,
        domain: 'flagged.example',
        categories: ['gambling'],
        bannableCategories: ['gambling'],
        users: [{ id: '1', email: 'new-user@example.com' }],
        cloudflareBlock: null,
        evidence: {},
        alreadyReported: false,
        alertSent: false
      }
    ],
    skippedResults: [],
    reviewResults: []
  });
  const [headers, row] = parseCsv(csv);
  t.is(row[headers.indexOf('Dry Run')], 'Yes');
  t.is(row[headers.indexOf('New Alert This Run')], 'No');
});
