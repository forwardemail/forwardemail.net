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
//   1. Cloudflare Family DNS (1.1.1.3 / 1.1.0.3) – detects adult
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
// At the end of the run an HTML digest email is sent to
// `config.alertsEmail` summarising all actions taken (or that would
// have been taken in dry-run mode).
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');
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
const familyResolver = createTangerine(client, logger, {
  servers: new Set(['1.1.1.3', '1.1.0.3'])
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
 * Build an HTML digest email summarising all banned users / domains,
 * skipped (protected) users, and domains flagged for manual review.
 *
 * @param   {object}  opts
 * @param   {Array}   opts.bannedResults   Domains that triggered bans
 * @param   {Array}   opts.skippedResults  Protected users that were skipped
 * @param   {Array}   opts.reviewResults   Domains flagged for review
 * @param   {number}  opts.totalChecked    Total domains checked
 * @param   {number}  opts.durationMs      Job duration in ms
 * @param   {boolean} opts.dryRun          Whether this is a dry run
 * @returns {string} HTML string
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
  // Banned domains table
  //
  if (bannedResults.length > 0) {
    html += `
      <h3>${dryRun ? 'Domains That Would Be Banned' : 'Banned Domains'}</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <th style="padding: 10px; text-align: left;">Domain</th>
          <th style="padding: 10px; text-align: left;">Categories</th>
          <th style="padding: 10px; text-align: left;">${
            dryRun ? 'Would Ban' : 'Banned'
          } Categories</th>
          <th style="padding: 10px; text-align: left;">Title</th>
          <th style="padding: 10px; text-align: left;">HTTP</th>
          <th style="padding: 10px; text-align: left;">Parked</th>
          <th style="padding: 10px; text-align: left;">Legit Hosting</th>
          <th style="padding: 10px; text-align: left;">${
            dryRun ? 'Users That Would Be Banned' : 'Banned Users'
          }</th>
          <th style="padding: 10px; text-align: left;">Aliases</th>
        </tr>
    `;

    for (const row of bannedResults) {
      const userLinks = row.users
        .map((u) => {
          const adminUrl = `${
            config.urls.web
          }/admin/users?q=${encodeURIComponent(u.email)}`;
          return `<a href="${adminUrl}">${u.email}</a>`;
        })
        .join(', ');

      html += `
        <tr>
          <td style="padding: 10px;"><strong>${row.domain}</strong></td>
          <td style="padding: 10px;">${row.categories.join(', ')}</td>
          <td style="padding: 10px; color: red;">${row.bannableCategories.join(
            ', '
          )}</td>
          <td style="padding: 10px;">${row.title || '<em>N/A</em>'}</td>
          <td style="padding: 10px;">${
            row.statusCode === null ? 'N/A' : row.statusCode
          } (${
        row.contentLength === null
          ? 'N/A'
          : `${(row.contentLength / 1024).toFixed(1)}KB`
      })</td>
          <td style="padding: 10px;">${row.isParked ? 'Yes' : 'No'}</td>
          <td style="padding: 10px;">${
            row.hasLegitimateHosting ? 'Yes' : 'No'
          }</td>
          <td style="padding: 10px;">${userLinks}</td>
          <td style="padding: 10px;">${row.aliasCount}</td>
        </tr>
      `;
    }

    html += '</table>';
  }

  //
  // Skipped / protected users table
  //
  if (skippedResults.length > 0) {
    html += `
      <h3>Skipped / Protected Users</h3>
      <p style="color: #e65100;">
        These users are associated with domains that matched bannable
        categories but were <strong>not banned</strong> because they meet
        one or more exclusion criteria.
      </p>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <th style="padding: 10px; text-align: left;">Domain</th>
          <th style="padding: 10px; text-align: left;">Categories</th>
          <th style="padding: 10px; text-align: left;">User</th>
          <th style="padding: 10px; text-align: left;">Group</th>
          <th style="padding: 10px; text-align: left;">KYC</th>
          <th style="padding: 10px; text-align: left;">Account Age</th>
          <th style="padding: 10px; text-align: left;">Exclusion Reasons</th>
          <th style="padding: 10px; text-align: left;">Aliases</th>
        </tr>
    `;

    for (const row of skippedResults) {
      const userAdminUrl = `${
        config.urls.web
      }/admin/users?q=${encodeURIComponent(row.user.email)}`;
      const domainAdminUrl = `${
        config.urls.web
      }/admin/domains?name=${encodeURIComponent(row.domain)}`;
      const accountAgeDays =
        row.user.accountAgeDays === null
          ? 'N/A'
          : `${row.user.accountAgeDays}d`;

      html += `
        <tr style="background: #fff8e1;">
          <td style="padding: 10px;"><a href="${domainAdminUrl}">${
        row.domain
      }</a></td>
          <td style="padding: 10px;">${row.categories.join(', ')}</td>
          <td style="padding: 10px;"><a href="${userAdminUrl}">${
        row.user.email
      }</a></td>
          <td style="padding: 10px;">${row.user.group}</td>
          <td style="padding: 10px;">${
            row.user.hasPassedKyc ? 'Yes' : 'No'
          }</td>
          <td style="padding: 10px;">${accountAgeDays}</td>
          <td style="padding: 10px;">${row.exclusionReasons.join('; ')}</td>
          <td style="padding: 10px;">${row.aliasCount}</td>
        </tr>
      `;
    }

    html += '</table>';
  }

  //
  // Review domains table
  //
  if (reviewResults.length > 0) {
    html += `
      <h3>Domains for Manual Review</h3>
      <p>
        These domains matched non-bannable categories and require manual
        review by an admin.
      </p>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <th style="padding: 10px; text-align: left;">Domain</th>
          <th style="padding: 10px; text-align: left;">Categories</th>
          <th style="padding: 10px; text-align: left;">Review Categories</th>
          <th style="padding: 10px; text-align: left;">Title</th>
          <th style="padding: 10px; text-align: left;">HTTP</th>
          <th style="padding: 10px; text-align: left;">Parked</th>
          <th style="padding: 10px; text-align: left;">Legit Hosting</th>
          <th style="padding: 10px; text-align: left;">Members</th>
          <th style="padding: 10px; text-align: left;">Aliases</th>
        </tr>
    `;

    for (const row of reviewResults) {
      const domainAdminUrl = `${
        config.urls.web
      }/admin/domains?name=${encodeURIComponent(row.domain)}`;

      html += `
        <tr>
          <td style="padding: 10px;"><a href="${domainAdminUrl}">${
        row.domain
      }</a></td>
          <td style="padding: 10px;">${row.categories.join(', ')}</td>
          <td style="padding: 10px; color: #e65100;">${row.reviewCategories.join(
            ', '
          )}</td>
          <td style="padding: 10px;">${row.title || '<em>N/A</em>'}</td>
          <td style="padding: 10px;">${
            row.statusCode === null ? 'N/A' : row.statusCode
          } (${
        row.contentLength === null
          ? 'N/A'
          : `${(row.contentLength / 1024).toFixed(1)}KB`
      })</td>
          <td style="padding: 10px;">${row.isParked ? 'Yes' : 'No'}</td>
          <td style="padding: 10px;">${
            row.hasLegitimateHosting ? 'Yes' : 'No'
          }</td>
          <td style="padding: 10px;">${row.memberCount}</td>
          <td style="padding: 10px;">${row.aliasCount}</td>
        </tr>
      `;
    }

    html += '</table>';
  }

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
    // Process domains in parallel with concurrency control.
    // Concurrency can be tuned via the CONCURRENCY env var;
    // defaults to 100 (same as check-bad-domains.js).
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
      const digestHtml = buildDigestHtml({
        bannedResults: ctx.bannedResults,
        skippedResults: ctx.skippedResults,
        reviewResults: ctx.reviewResults,
        totalChecked: ids.length,
        durationMs: totalDuration,
        dryRun
      });

      const totalBannedUsers = ctx.bannedResults.reduce(
        (s, r) => s + r.users.length,
        0
      );

      const subjectPrefix = dryRun ? '[DRY RUN] ' : '';
      const bannedVerb = dryRun ? 'would be banned' : 'banned';

      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `${subjectPrefix}Cloudflare Family DNS & Content Check: ${ctx.bannedResults.length} domains ${bannedVerb} (${totalBannedUsers} users), ${ctx.skippedResults.length} protected users skipped, ${ctx.reviewResults.length} for review`
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

    const subjectPrefix = dryRun ? '[DRY RUN] ' : '';

    // Send error notification to admins
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `${subjectPrefix}Cloudflare Family DNS & Content Check Job Error`
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
