/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// This job iterates over all domains with `has_txt_record: true` OR
// `has_mx_record: true` using a cursor (noCursorTimeout) and runs
// comprehensive categorisation on each domain via the reusable
// `get-domain-categorization` helper:
//
//   1. Cloudflare Family DNS (1.1.1.3 / 1.0.0.3) – detects adult
//      content and malware (resolver returns 0.0.0.0).
//   2. Domain-name pattern matching – URL shortener naming, phishing
//      look-alikes, disposable-email patterns, etc.
//   3. HTTP content analysis – fetches the page with undici and checks
//      for gambling, adult, phishing, piracy, crypto-scam, parked /
//      for-sale, disposable-email, TikTok tools, streaming, pharmacy,
//      malware/warez keywords.
//
// When a domain matches one or more *bannable* categories the job:
//   1. Bans every eligible member user by setting `is_banned = true`.
//   2. Adds the user's email address and the domain name to the Redis
//      denylist (`denylist:<value>`, 30-day TTL).
//   3. Clears the `banned_user_ids` cache key.
//
// The following users are EXCLUDED from banning (but still reported
// in a separate "Skipped / Protected Users" section of the digest):
//   - Admin users (`group === 'admin'`)
//   - Users who have passed KYC (`has_passed_kyc === true`)
//   - Customers whose account is older than 3 months
//
// DRY_RUN mode:
//   Set `DRY_RUN=true` (or `DRY_RUN=1`) to run the full scan without
//   performing any ban or denylist actions.  The digest email is still
//   sent but its subject and body clearly indicate it was a dry run.
//
//   Usage:  DRY_RUN=true node jobs/check-domains-cloudflare-family.js
//
// At the end of the run a summary HTML digest email is sent to
// security@forwardemail.net with full results attached as a
// gzip-compressed CSV file (one row per flagged domain).
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('tiny-pmap');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const checkDomainAndAct = require('#helpers/check-domain-and-act');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

//
// Dedicated Tangerine resolver using Cloudflare Family DNS servers.
// These servers return 0.0.0.0 for domains categorised as adult
// content or malware.  Uses `createTangerine` (the standard codebase
// helper) with a custom `servers` option.
//
// NOTE: The correct Cloudflare Family DNS IPs are 1.1.1.3 and 1.0.0.3
// (not 1.1.0.3 which is undocumented and may not apply family filtering).
//
const familyResolver = createTangerine(client, logger, {
  servers: new Set(['1.1.1.3', '1.0.0.3'])
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Process a single domain document using the shared helper.
 *
 * @param   {object}  domainDoc       Lean Mongoose document
 * @param   {object}  ctx             Shared context
 * @param   {Array}   ctx.bannedResults   Domains that were banned
 * @param   {Array}   ctx.reviewResults   Domains for manual review
 * @param   {Array}   ctx.skippedResults  Protected users that were skipped
 * @param   {boolean} ctx.dryRun          Whether this is a dry run
 */
async function processDomain(domainDoc, ctx) {
  if (isCancelled) return;

  try {
    await checkDomainAndAct(domainDoc, ctx, {
      client,
      familyResolver,
      logger,
      timeout: 10_000,
      Users,
      Aliases
    });
  } catch (err) {
    logger.error(`Error processing domain ${domainDoc.name}:`, err);
  }
}

/**
 * Escape a value for safe inclusion in a CSV cell.
 * Wraps in double-quotes and escapes internal double-quotes.
 *
 * @param   {*}       val
 * @returns {string}
 */
function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // Always quote to handle commas, newlines, and quotes in values
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Build a CSV string containing ALL flagged domains (banned, skipped,
 * and review) with one row per entry.  This replaces the giant inline
 * HTML tables that could exceed email size limits.
 *
 * @param   {object}  opts
 * @param   {Array}   opts.bannedResults
 * @param   {Array}   opts.skippedResults
 * @param   {Array}   opts.reviewResults
 * @param   {boolean} opts.dryRun
 * @returns {string}  CSV content
 */
function buildDigestCsv(opts) {
  const { bannedResults, skippedResults, reviewResults, dryRun } = opts;

  const headers = [
    'Section',
    'Domain',
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
    'Dry Run'
  ];

  const rows = [headers.join(',')];

  const dryRunVal = dryRun ? 'Yes' : 'No';

  // Banned domains – one row per banned user
  for (const row of bannedResults) {
    for (const user of row.users) {
      rows.push(
        [
          csvEscape('Banned'),
          csvEscape(row.domain),
          csvEscape(row.categories.join('; ')),
          csvEscape(row.bannableCategories.join('; ')),
          csvEscape(row.title || ''),
          csvEscape(row.statusCode === null ? '' : row.statusCode),
          csvEscape(row.contentLength),
          csvEscape(row.isParked ? 'Yes' : 'No'),
          csvEscape(row.hasLegitimateHosting ? 'Yes' : 'No'),
          csvEscape(user.email),
          csvEscape(''),
          csvEscape(''),
          csvEscape(''),
          csvEscape(''),
          csvEscape(row.aliasCount),
          csvEscape(dryRunVal)
        ].join(',')
      );
    }
  }

  // Skipped / protected users – one row per skipped user
  for (const row of skippedResults) {
    rows.push(
      [
        csvEscape('Skipped (Protected)'),
        csvEscape(row.domain),
        csvEscape(row.categories.join('; ')),
        csvEscape(row.bannableCategories.join('; ')),
        csvEscape(row.title || ''),
        csvEscape(''),
        csvEscape(''),
        csvEscape(''),
        csvEscape(''),
        csvEscape(row.user.email),
        csvEscape(row.user.group),
        csvEscape(row.user.hasPassedKyc ? 'Yes' : 'No'),
        csvEscape(
          row.user.accountAgeDays === null ? '' : row.user.accountAgeDays
        ),
        csvEscape(row.exclusionReasons.join('; ')),
        csvEscape(row.aliasCount),
        csvEscape(dryRunVal)
      ].join(',')
    );
  }

  // Review domains – one row per domain
  for (const row of reviewResults) {
    rows.push(
      [
        csvEscape('Review'),
        csvEscape(row.domain),
        csvEscape(row.categories.join('; ')),
        csvEscape(row.reviewCategories.join('; ')),
        csvEscape(row.title || ''),
        csvEscape(row.statusCode === null ? '' : row.statusCode),
        csvEscape(row.contentLength),
        csvEscape(row.isParked ? 'Yes' : 'No'),
        csvEscape(row.hasLegitimateHosting ? 'Yes' : 'No'),
        csvEscape(''),
        csvEscape(''),
        csvEscape(''),
        csvEscape(''),
        csvEscape(''),
        csvEscape(row.aliasCount),
        csvEscape(dryRunVal)
      ].join(',')
    );
  }

  return rows.join('\n');
}

/**
 * Build a concise HTML summary for the email body.
 * Detailed per-domain data is in the attached CSV.
 *
 * @param   {object}  opts
 * @param   {Array}   opts.bannedResults
 * @param   {Array}   opts.skippedResults
 * @param   {Array}   opts.reviewResults
 * @param   {number}  opts.totalChecked
 * @param   {number}  opts.durationMs
 * @param   {boolean} opts.dryRun
 * @returns {string}  HTML string
 */
function buildDigestHtml(opts) {
  const {
    bannedResults,
    skippedResults,
    reviewResults,
    totalChecked,
    durationMs,
    dryRun
  } = opts;

  const totalBannedDomains = bannedResults.length;
  const totalBannedUsers = bannedResults.reduce(
    (sum, r) => sum + r.users.length,
    0
  );
  const totalBannedAliases = bannedResults.reduce(
    (sum, r) => sum + r.aliasCount,
    0
  );
  const totalReviewDomains = reviewResults.length;
  const totalSkippedUsers = skippedResults.length;

  //
  // Aggregate category counts across banned results
  //
  const categoryCounts = {};
  for (const r of bannedResults) {
    for (const cat of r.bannableCategories) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  }

  //
  // Dry-run banner (shown at the top of the email when DRY_RUN=true)
  //
  let html = '';

  if (dryRun) {
    html += `
      <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 5px; margin: 0 0 20px 0;">
        <h3 style="margin: 0 0 8px 0; color: #856404;">DRY RUN MODE</h3>
        <p style="margin: 0; color: #856404;">
          This is a <strong>dry-run report</strong>.  No users were banned and
          no denylist entries were created.  The results below show what
          <em>would</em> have happened in a live run.
        </p>
      </div>
    `;
  }

  const bannedLabel = dryRun
    ? 'Domains that would be banned'
    : 'Domains banned';
  const usersLabel = dryRun ? 'Users that would be banned' : 'Users banned';

  html += `
    <h2>Cloudflare Family DNS &amp; Content Categorisation – ${
      dryRun ? 'Dry-Run ' : ''
    }Ban Digest</h2>

    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Summary</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <th style="padding: 10px; text-align: left;">Metric</th>
          <th style="padding: 10px; text-align: left;">Value</th>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>Total domains checked</strong></td>
          <td style="padding: 10px;">${totalChecked}</td>
        </tr>
        <tr style="background: #fff5f5;">
          <td style="padding: 10px;"><strong>${bannedLabel}</strong></td>
          <td style="padding: 10px; color: red; font-weight: bold;">${totalBannedDomains}</td>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>${usersLabel}</strong></td>
          <td style="padding: 10px; color: red; font-weight: bold;">${totalBannedUsers}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px;"><strong>Aliases on ${
            dryRun ? 'flagged' : 'banned'
          } domains</strong></td>
          <td style="padding: 10px;">${totalBannedAliases}</td>
        </tr>
        <tr style="background: #fff8e1;">
          <td style="padding: 10px;"><strong>Protected users skipped (flagged but not banned)</strong></td>
          <td style="padding: 10px; color: #e65100; font-weight: bold;">${totalSkippedUsers}</td>
        </tr>
        <tr>
          <td style="padding: 10px;"><strong>Domains for manual review</strong></td>
          <td style="padding: 10px;">${totalReviewDomains}</td>
        </tr>
        <tr style="background: #f0f0f0;">
          <td style="padding: 10px;"><strong>Duration</strong></td>
          <td style="padding: 10px;">${durationMs}ms</td>
        </tr>
      </table>
    </div>
  `;

  //
  // Category breakdown
  //
  if (Object.keys(categoryCounts).length > 0) {
    html += `
      <h3>Category Breakdown (${dryRun ? 'Would-Be ' : ''}Banned Domains)</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <th style="padding: 10px; text-align: left;">Category</th>
          <th style="padding: 10px; text-align: left;">Count</th>
        </tr>
    `;
    for (const [cat, count] of Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )) {
      html += `
        <tr>
          <td style="padding: 10px;">${cat}</td>
          <td style="padding: 10px;">${count}</td>
        </tr>
      `;
    }

    html += '</table>';
  }

  //
  // Note about CSV attachment (replaces the giant inline tables)
  //
  html += `
    <p style="margin-top: 20px;">
      <strong>Full details are attached as a gzip-compressed CSV file.</strong>
      The CSV contains one row per flagged domain/user with all categories,
      HTTP metadata, user details, and exclusion reasons.
    </p>
  `;

  //
  // Footer
  //
  html += `
    <p style="margin-top: 20px; color: #666; font-size: 12px;">
      <em>Generated by check-domains-cloudflare-family job at ${dayjs().format(
        'YYYY-MM-DD HH:mm:ss [UTC]'
      )}${dryRun ? ' – DRY RUN MODE (no actions taken)' : ''}</em>
    </p>
  `;

  return html;
}

(async () => {
  await setupMongoose(logger);

  const startTime = Date.now();

  // Check for dry run mode from environment variable
  const dryRun = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';

  try {
    if (dryRun) {
      logger.info(
        'Running Cloudflare Family DNS & content categorisation check in DRY RUN mode – no ban or denylist actions will be performed'
      );
    }

    logger.info(
      `Starting Cloudflare Family DNS & content categorisation check${
        dryRun ? ' (DRY RUN)' : ''
      }...`
    );

    //
    // Collect domain IDs using cursor + noCursorTimeout
    //
    const ids = [];

    for await (const domain of Domains.find({
      is_global: { $ne: true },
      $or: [{ has_txt_record: true }, { has_mx_record: true }]
    })
      .select('_id')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      ids.push(domain._id);
    }

    logger.info(`Found ${ids.length} domains with TXT or MX records to check`);

    if (ids.length === 0) {
      logger.info('No domains to check – exiting');
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    //
    // Process ALL domains in parallel batches.  Concurrency controls
    // how many domains are checked simultaneously; defaults to 100.
    // Every domain in the cursor is checked – this only controls how
    // many run at the same time to avoid overwhelming DNS/HTTP.
    // Override with the CONCURRENCY env var if needed.
    //
    const CONCURRENCY = Number.parseInt(process.env.CONCURRENCY, 10) || 100;

    const ctx = {
      bannedResults: [],
      reviewResults: [],
      skippedResults: [],
      dryRun
    };

    let processed = 0;

    await pMap(
      ids,
      async (id) => {
        if (isCancelled) return;

        try {
          const domain = await Domains.findById(id)
            .select('name members has_txt_record has_mx_record')
            .lean()
            .exec();

          if (!domain) return;

          await processDomain(domain, ctx);
        } catch (err) {
          logger.error(`Error in mapper for domain ID ${id}:`, err);
        }

        processed++;

        // Log progress every 100 domains so operators can see the
        // job is making forward progress on large domain sets.
        if (processed % 100 === 0 || processed === ids.length) {
          logger.info(
            `${dryRun ? '[DRY RUN] ' : ''}Progress: ${processed}/${
              ids.length
            } domains checked (${ctx.bannedResults.length} banned, ${
              ctx.reviewResults.length
            } review)`
          );
        }
      },
      { concurrency: CONCURRENCY }
    );

    const totalDuration = Date.now() - startTime;

    logger.info(
      `${
        dryRun ? '[DRY RUN] ' : ''
      }Categorisation check complete in ${totalDuration}ms – ${
        ctx.bannedResults.length
      } domains ${dryRun ? 'would be ' : ''}banned, ${
        ctx.skippedResults.length
      } users skipped (protected), ${
        ctx.reviewResults.length
      } flagged for review`
    );

    //
    // Send digest email to admins
    //
    if (
      ctx.bannedResults.length > 0 ||
      ctx.skippedResults.length > 0 ||
      ctx.reviewResults.length > 0
    ) {
      //
      // Build a concise HTML summary for the email body
      //
      const digestHtml = buildDigestHtml({
        bannedResults: ctx.bannedResults,
        skippedResults: ctx.skippedResults,
        reviewResults: ctx.reviewResults,
        totalChecked: ids.length,
        durationMs: totalDuration,
        dryRun
      });

      //
      // Build a comprehensive CSV with ALL flagged domains and
      // attach it as a gzip-compressed file (same pattern as
      // bounce-report.js) to avoid email size limit issues.
      //
      const csv = buildDigestCsv({
        bannedResults: ctx.bannedResults,
        skippedResults: ctx.skippedResults,
        reviewResults: ctx.reviewResults,
        dryRun
      });

      const totalBannedUsers = ctx.bannedResults.reduce(
        (s, r) => s + r.users.length,
        0
      );

      const subjectPrefix = dryRun ? '[DRY RUN] ' : '';
      const bannedVerb = dryRun ? 'would be banned' : 'banned';
      const timestamp = dayjs().format('YYYY-MM-DD-HHmmss');

      await emailHelper({
        template: 'alert',
        message: {
          to: config.securityEmail,
          subject: `${subjectPrefix}Cloudflare Family DNS & Content Check: ${ctx.bannedResults.length} domains ${bannedVerb} (${totalBannedUsers} users), ${ctx.skippedResults.length} protected users skipped, ${ctx.reviewResults.length} for review`,
          attachments: [
            {
              filename: `cloudflare-family-digest-${timestamp}.csv.gz`,
              content: zlib.gzipSync(Buffer.from(csv, 'utf8'), {
                level: 9
              })
            }
          ]
        },
        locals: {
          message: digestHtml
        }
      });

      logger.info(`${dryRun ? '[DRY RUN] ' : ''}Digest email sent to admins`);
    } else {
      logger.info('No domains were flagged – no digest to send');
    }
  } catch (err) {
    await logger.error(err);

    // Send error notification to admins via alertsEmail (fallback)
    // so errors are delivered even if securityEmail is misconfigured.
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `${
          dryRun ? '[DRY RUN] ' : ''
        }Cloudflare Family DNS & Content Check Job Error`
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
