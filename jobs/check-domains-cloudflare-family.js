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
const ms = require('ms');
const pMap = require('p-map');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const getDomainCategorization = require('#helpers/get-domain-categorization');
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

// Denylist entries expire after 30 days (consistent with on-data-mx.js)
const DENYLIST_TTL_MS = ms('30d');

// Accounts older than this are protected from automatic banning
const ACCOUNT_AGE_THRESHOLD_MONTHS = 3;

//
// Categories that trigger an automatic ban + denylist.
// Other categories (e.g. 'minimal_content', 'parking_ip') are
// reported but do NOT trigger a ban.
//
const BANNABLE_CATEGORIES = new Set([
  'blocked_by_cloudflare_family',
  'adult',
  'phishing',
  'malware',
  'crypto_scam',
  'pharmacy',
  'gambling',
  'url_shortener',
  'disposable_email',
  'piracy'
]);

//
// Categories that are reported in the digest but do NOT trigger a ban.
// Admins can review these manually.
//
const REVIEW_CATEGORIES = new Set([
  'parked',
  'parking_ip',
  'tiktok_tool',
  'streaming',
  'minimal_content'
]);

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Determine why a user should be excluded from banning.
 * Returns an array of reason strings, or an empty array if the user
 * is eligible for banning.
 *
 * @param   {object}  user  Lean user document
 * @returns {string[]}
 */
function getExclusionReasons(user) {
  const reasons = [];

  // Admin users are never auto-banned
  if (user.group === 'admin') {
    reasons.push('User is an admin');
  }

  // KYC-verified users are never auto-banned
  if (user.has_passed_kyc === true) {
    reasons.push('User has passed KYC verification');
  }

  // Customers with accounts older than 3 months are excluded
  if (user.created_at) {
    const accountAge = dayjs().diff(dayjs(user.created_at), 'month');
    if (accountAge >= ACCOUNT_AGE_THRESHOLD_MONTHS) {
      reasons.push(
        `Account is ${accountAge} months old (threshold: ${ACCOUNT_AGE_THRESHOLD_MONTHS} months)`
      );
    }
  }

  return reasons;
}

/**
 * Process a single domain document.
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

  const { name } = domainDoc;

  try {
    //
    // Run the full categorisation (DNS + domain-name + HTTP content)
    //
    const cat = await getDomainCategorization(name, {
      familyResolver,
      logger,
      timeout: 10_000
    });

    // No categories detected – domain is clean
    if (cat.categories.length === 0) return;

    //
    // Determine whether any bannable category matched
    //
    const bannableHits = cat.categories.filter((c) =>
      BANNABLE_CATEGORIES.has(c)
    );
    const reviewHits = cat.categories.filter((c) => REVIEW_CATEGORIES.has(c));

    // Nothing actionable
    if (bannableHits.length === 0 && reviewHits.length === 0) return;

    //
    // Collect member user IDs
    //
    const memberUserIds = (domainDoc.members || []).map((m) => m.user);
    if (memberUserIds.length === 0) return;

    //
    // Count aliases on this domain (for the digest report)
    //
    const aliasCount = await Aliases.countDocuments({
      domain: domainDoc._id
    });

    //
    // If there are bannable hits, evaluate each user for banning
    //
    if (bannableHits.length > 0) {
      //
      // Fetch ALL member users who are not already banned
      // (we need to check each one for exclusion reasons)
      //
      const users = await Users.find({
        _id: { $in: memberUserIds },
        [config.userFields.isBanned]: false
      })
        .select(
          `_id email group has_passed_kyc created_at ${config.userFields.isBanned}`
        )
        .lean()
        .exec();

      if (users.length === 0) return;

      //
      // Separate users into bannable vs. protected (skipped)
      //
      const bannableUsers = [];
      const protectedUsers = [];

      for (const user of users) {
        const exclusionReasons = getExclusionReasons(user);
        if (exclusionReasons.length > 0) {
          protectedUsers.push({ user, exclusionReasons });
        } else {
          bannableUsers.push(user);
        }
      }

      //
      // Ban eligible users (skipped in dry-run mode)
      //
      if (bannableUsers.length > 0) {
        const bannedEmails = [];

        if (ctx.dryRun) {
          //
          // DRY RUN – log what would happen but take no action
          //
          for (const user of bannableUsers) {
            bannedEmails.push(user.email);
            logger.info(
              `[DRY RUN] Would ban user ${user._id} (${
                user.email
              }) – domain ${name} categorised as [${bannableHits.join(', ')}]`
            );
          }

          logger.info(
            `[DRY RUN] Would denylist domain ${name} and ${bannedEmails.length} email(s)`
          );
        } else {
          //
          // LIVE – perform ban + denylist
          //
          const pipeline = client.pipeline();

          for (const user of bannableUsers) {
            // Ban the user
            await Users.findByIdAndUpdate(user._id, {
              $set: {
                [config.userFields.isBanned]: true
              }
            });

            // Denylist the user's email address
            pipeline.set(
              `denylist:${user.email}`,
              'true',
              'PX',
              DENYLIST_TTL_MS
            );
            bannedEmails.push(user.email);

            logger.info(
              `Banned user ${user._id} (${
                user.email
              }) – domain ${name} categorised as [${bannableHits.join(', ')}]`
            );
          }

          // Denylist the domain name itself
          pipeline.set(`denylist:${name}`, 'true', 'PX', DENYLIST_TTL_MS);

          await pipeline.exec();

          // Clear the banned_user_ids cache
          await client.del('banned_user_ids');
        }

        ctx.bannedResults.push({
          domain: name,
          categories: cat.categories,
          bannableCategories: bannableHits,
          title: cat.title,
          statusCode: cat.statusCode,
          contentLength: cat.contentLength,
          isParked: cat.isParked,
          hasLegitimateHosting: cat.hasLegitimateHosting,
          users: bannableUsers.map((u) => ({
            id: u._id.toString(),
            email: u.email
          })),
          aliasCount,
          bannedEmails
        });
      }

      //
      // Record protected (skipped) users for the digest
      //
      if (protectedUsers.length > 0) {
        for (const { user, exclusionReasons } of protectedUsers) {
          const accountAge = user.created_at
            ? dayjs().diff(dayjs(user.created_at), 'day')
            : null;

          ctx.skippedResults.push({
            domain: name,
            categories: cat.categories,
            bannableCategories: bannableHits,
            title: cat.title,
            user: {
              id: user._id.toString(),
              email: user.email,
              group: user.group,
              hasPassedKyc: user.has_passed_kyc === true,
              accountAgeDays: accountAge,
              createdAt: user.created_at
            },
            exclusionReasons,
            aliasCount
          });

          logger.info(
            `${ctx.dryRun ? '[DRY RUN] ' : ''}Skipped protected user ${
              user._id
            } (${
              user.email
            }) for domain ${name} – reasons: ${exclusionReasons.join('; ')}`
          );
        }
      }
    } else if (reviewHits.length > 0) {
      //
      // Review-only – no ban, just report
      //
      ctx.reviewResults.push({
        domain: name,
        categories: cat.categories,
        reviewCategories: reviewHits,
        title: cat.title,
        statusCode: cat.statusCode,
        contentLength: cat.contentLength,
        isParked: cat.isParked,
        hasLegitimateHosting: cat.hasLegitimateHosting,
        memberCount: memberUserIds.length,
        aliasCount
      });
    }
  } catch (err) {
    logger.error(`Error processing domain ${name}:`, err);
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
          <td style="padding: 10px;"><strong>Domains flagged for review</strong></td>
          <td style="padding: 10px; color: orange; font-weight: bold;">${totalReviewDomains}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px;"><strong>Duration</strong></td>
          <td style="padding: 10px;">${Math.round(durationMs / 1000)}s</td>
        </tr>
      </table>
    </div>
  `;

  //
  // Category breakdown
  //
  if (Object.keys(categoryCounts).length > 0) {
    html += `
      <h3>${
        dryRun ? 'Category Breakdown (Would-Be Bans)' : 'Ban Category Breakdown'
      }</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 50%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left;">Category</th>
            <th style="padding: 8px; text-align: left;">Domains</th>
          </tr>
        </thead>
        <tbody>
    `;
    for (const [cat, count] of Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )) {
      html += `
          <tr>
            <td style="padding: 8px;"><code>${cat}</code></td>
            <td style="padding: 8px;">${count}</td>
          </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;
  }

  //
  // Banned domains detail table
  //
  if (bannedResults.length > 0) {
    const bannedHeading = dryRun
      ? `Domains That Would Be Banned (${bannedResults.length})`
      : `Banned Domains (${bannedResults.length})`;

    html += `
      <h3 style="color: red;">${bannedHeading}</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left;">#</th>
            <th style="padding: 8px; text-align: left;">Domain</th>
            <th style="padding: 8px; text-align: left;">Categories</th>
            <th style="padding: 8px; text-align: left;">Title</th>
            <th style="padding: 8px; text-align: left;">Aliases</th>
            <th style="padding: 8px; text-align: left;">${
              dryRun ? 'Users (would be banned)' : 'Banned Users'
            }</th>
            <th style="padding: 8px; text-align: left;">${
              dryRun ? 'Emails (would be denylisted)' : 'Denylisted Emails'
            }</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const [index, row] of bannedResults.entries()) {
      const userLinks = row.users
        .map((u) => {
          const adminUrl = `${
            config.urls.web
          }/admin/users?q=${encodeURIComponent(u.email)}`;
          return `<a href="${adminUrl}">${u.email}</a>`;
        })
        .join('<br>');

      const emails = row.bannedEmails
        .map((e) => `<code>${e}</code>`)
        .join('<br>');

      const cats = row.categories
        .map((c) => {
          const color = BANNABLE_CATEGORIES.has(c) ? '#dc3545' : '#ffc107';
          return `<span style="background:${color};color:#fff;padding:2px 6px;border-radius:3px;font-size:11px;margin:1px;">${c}</span>`;
        })
        .join(' ');

      html += `
          <tr style="${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
            <td style="padding: 8px;">${index + 1}</td>
            <td style="padding: 8px;"><code>${row.domain}</code></td>
            <td style="padding: 8px;">${cats}</td>
            <td style="padding: 8px; max-width: 200px; word-wrap: break-word;">${
              row.title || '<em>N/A</em>'
            }</td>
            <td style="padding: 8px;">${row.aliasCount}</td>
            <td style="padding: 8px;">${userLinks}</td>
            <td style="padding: 8px;">${emails}</td>
          </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;
  }

  //
  // Skipped / Protected Users section
  // These users matched bannable categories but were excluded from
  // banning because they are admins, KYC-verified, or long-standing
  // customers.  Admins should review these manually.
  //
  if (skippedResults.length > 0) {
    html += `
      <h3 style="color: #e65100;">Protected Users – Skipped from Ban (${skippedResults.length})</h3>
      <p style="font-size: 13px; color: #555;">
        The following users own domains that matched bannable categories but
        were <strong>not banned</strong> because they are admins, have passed
        KYC verification, or have been customers for longer than
        ${ACCOUNT_AGE_THRESHOLD_MONTHS} months.  These should be reviewed
        manually and may still warrant action.
      </p>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background-color: #fff3e0;">
            <th style="padding: 8px; text-align: left;">#</th>
            <th style="padding: 8px; text-align: left;">Domain</th>
            <th style="padding: 8px; text-align: left;">Categories</th>
            <th style="padding: 8px; text-align: left;">Title</th>
            <th style="padding: 8px; text-align: left;">User</th>
            <th style="padding: 8px; text-align: left;">Account Age</th>
            <th style="padding: 8px; text-align: left;">Aliases</th>
            <th style="padding: 8px; text-align: left;">Reason Not Banned</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const [index, row] of skippedResults.entries()) {
      const cats = row.categories
        .map((c) => {
          const color = BANNABLE_CATEGORIES.has(c) ? '#dc3545' : '#ffc107';
          return `<span style="background:${color};color:#fff;padding:2px 6px;border-radius:3px;font-size:11px;margin:1px;">${c}</span>`;
        })
        .join(' ');

      const userAdminUrl = `${
        config.urls.web
      }/admin/users?q=${encodeURIComponent(row.user.email)}`;

      const domainAdminUrl = `${
        config.urls.web
      }/admin/domains?name=${encodeURIComponent(row.domain)}`;

      const { accountAgeDays } = row.user;
      const accountAgeStr =
        accountAgeDays === null ? '<em>unknown</em>' : `${accountAgeDays} days`;

      // Build protection reason badges
      const reasonBadges = row.exclusionReasons
        .map((r) => {
          let badgeColor = '#0288d1'; // default blue
          if (r.includes('admin')) badgeColor = '#7b1fa2'; // purple for admin
          if (r.includes('KYC')) badgeColor = '#2e7d32'; // green for KYC
          if (r.includes('months old')) badgeColor = '#ef6c00'; // orange for age
          return `<span style="background:${badgeColor};color:#fff;padding:2px 6px;border-radius:3px;font-size:11px;display:inline-block;margin:1px;">${r}</span>`;
        })
        .join('<br>');

      html += `
          <tr style="${
            index % 2 === 0 ? 'background: #fff8e1;' : 'background: #fffde7;'
          }">
            <td style="padding: 8px;">${index + 1}</td>
            <td style="padding: 8px;"><a href="${domainAdminUrl}"><code>${
        row.domain
      }</code></a></td>
            <td style="padding: 8px;">${cats}</td>
            <td style="padding: 8px; max-width: 200px; word-wrap: break-word;">${
              row.title || '<em>N/A</em>'
            }</td>
            <td style="padding: 8px;"><a href="${userAdminUrl}">${
        row.user.email
      }</a></td>
            <td style="padding: 8px;">${accountAgeStr}</td>
            <td style="padding: 8px;">${row.aliasCount}</td>
            <td style="padding: 8px;">${reasonBadges}</td>
          </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;
  }

  //
  // Review domains detail table
  //
  if (reviewResults.length > 0) {
    html += `
      <h3 style="color: orange;">Domains Flagged for Review (${reviewResults.length})</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left;">#</th>
            <th style="padding: 8px; text-align: left;">Domain</th>
            <th style="padding: 8px; text-align: left;">Categories</th>
            <th style="padding: 8px; text-align: left;">Title</th>
            <th style="padding: 8px; text-align: left;">Members</th>
            <th style="padding: 8px; text-align: left;">Aliases</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const [index, row] of reviewResults.entries()) {
      const cats = row.categories
        .map((c) => {
          const color = REVIEW_CATEGORIES.has(c) ? '#ffc107' : '#6c757d';
          return `<span style="background:${color};color:#fff;padding:2px 6px;border-radius:3px;font-size:11px;margin:1px;">${c}</span>`;
        })
        .join(' ');

      const domainAdminUrl = `${
        config.urls.web
      }/admin/domains?name=${encodeURIComponent(row.domain)}`;

      html += `
          <tr style="${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
            <td style="padding: 8px;">${index + 1}</td>
            <td style="padding: 8px;"><a href="${domainAdminUrl}"><code>${
        row.domain
      }</code></a></td>
            <td style="padding: 8px;">${cats}</td>
            <td style="padding: 8px; max-width: 200px; word-wrap: break-word;">${
              row.title || '<em>N/A</em>'
            }</td>
            <td style="padding: 8px;">${row.memberCount}</td>
            <td style="padding: 8px;">${row.aliasCount}</td>
          </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;
  }

  html += `
    <hr style="margin: 30px 0; border: none; border-top: 2px solid #ddd;">
    <p style="color: #666; font-size: 12px;">
      <em>This is an automated report from the Cloudflare Family DNS &amp;
      content categorisation job.  Domains that resolve to 0.0.0.0 via
      Cloudflare Family DNS (1.1.1.3) are categorised as adult content or
      malware.  Additional categories are detected by analysing the domain
      name and HTTP page content.<br><br>
      <strong>Exclusion rules:</strong> Admin users, KYC-verified users,
      and customers with accounts older than ${ACCOUNT_AGE_THRESHOLD_MONTHS}
      months are never auto-banned.  They appear in the "Protected Users"
      section for manual review.  All other flagged users are banned and
      their email addresses and domain names are added to the Redis denylist
      for 30 days.${
        dryRun
          ? '<br><br><strong>NOTE:</strong> This report was generated in DRY RUN mode.  No ban or denylist actions were performed.'
          : ''
      }</em>
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
    // Process domains in parallel with concurrency control
    //
    const ctx = {
      bannedResults: [],
      reviewResults: [],
      skippedResults: [],
      dryRun
    };

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
      },
      { concurrency: 100 }
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
