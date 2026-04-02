/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Reusable helper that categorises a single domain via the
// `get-domain-categorization` helper and then takes action:
//
//   - If the domain matches one or more *flagged* categories, an email
//     is sent to support@ for manual review instead of automatically
//     banning users or adding to the denylist.  This avoids false
//     positives from the Cloudflare Radar / Family DNS checks.
//   - Protected users (admins, KYC-verified, accounts older than 3
//     months) are still reported separately in the digest.
//   - If the domain only matches *review* categories, it is reported
//     for manual review (same as before).
//
// This module is consumed by:
//   - `jobs/check-domains-cloudflare-family.js`  (batch scan)
//   - `app/models/domains.js`  (post-create hook)
//
// Both callers pass in a `ctx` object that accumulates results and
// an `opts` object that supplies the Redis client, resolver, logger,
// and dry-run flag.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const config = require('#config');
const emailHelper = require('#helpers/email');
const getDomainCategorization = require('#helpers/get-domain-categorization');
const logger = require('#helpers/logger');

// Denylist entries expire after 30 days (consistent with on-data-mx.js)
const DENYLIST_TTL_MS = ms('30d');

// Accounts older than this are protected from automatic banning
const ACCOUNT_AGE_THRESHOLD_MONTHS = 3;

//
// Categories that were previously auto-ban + denylist triggers.
// These now send an email to support@ for manual review instead
// of automatically banning users and denylisting, because the
// Cloudflare Radar check is too strict and causes false positives.
//
const BANNABLE_CATEGORIES = new Set([
  'blocked_by_cloudflare_family',
  'adult',
  'phishing',
  'malware',
  'crypto_scam',
  'pharmacy',
  'gambling',
  // 'url_shortener',
  'disposable_email',
  'piracy'
]);

//
// Categories that are reported in the digest but do NOT trigger a ban.
// Admins can review these manually.
//
const REVIEW_CATEGORIES = new Set(['tiktok_tool', 'streaming', 'dns_error']);

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
 * Categorise a single domain and take action (email support for review / report).
 *
 * Instead of automatically banning users and adding to the denylist,
 * this now emails support@ for manual review when bannable categories
 * are detected.  This prevents false positives from the Cloudflare
 * Radar / Family DNS checks from incorrectly banning legitimate users.
 *
 * @param   {object}  domainDoc  Lean Mongoose domain document (needs `_id`, `name`, `members`)
 * @param   {object}  ctx        Shared context that accumulates results
 * @param   {Array}   ctx.bannedResults    Domains that were flagged for review (kept for API compat)
 * @param   {Array}   ctx.reviewResults    Domains flagged for review
 * @param   {Array}   ctx.skippedResults   Protected users that were skipped
 * @param   {boolean} ctx.dryRun           Whether this is a dry run
 * @param   {object}  opts       Caller-supplied dependencies
 * @param   {object}  opts.client          Redis client (for denylist + cache)
 * @param   {object}  opts.familyResolver  Tangerine instance (1.1.1.3)
 * @param   {object}  [opts.logger]        Logger (defaults to module logger)
 * @param   {number}  [opts.timeout]       HTTP timeout in ms (default 10 000)
 * @param   {object}  opts.Users           Users model
 * @param   {object}  opts.Aliases         Aliases model
 * @returns {Promise<object|null>}  The categorisation result, or null if clean
 */
async function checkDomainAndAct(domainDoc, ctx, opts) {
  const { familyResolver, Users, Aliases } = opts;
  const log = opts.logger || logger;
  const timeout = opts.timeout || 10_000;
  const { name } = domainDoc;

  //
  // Run the full categorisation (DNS + domain-name + HTTP content)
  //
  const cat = await getDomainCategorization(name, {
    familyResolver,
    logger: log,
    timeout
  });

  // No categories detected – domain is clean
  if (cat.categories.length === 0) return null;

  //
  // Determine whether any bannable category matched
  //
  const bannableHits = cat.categories.filter((c) => BANNABLE_CATEGORIES.has(c));
  const reviewHits = cat.categories.filter((c) => REVIEW_CATEGORIES.has(c));

  // Nothing actionable
  if (bannableHits.length === 0 && reviewHits.length === 0) return null;

  //
  // Collect member user IDs
  //
  const memberUserIds = (domainDoc.members || []).map((m) => m.user);
  if (memberUserIds.length === 0) return null;

  //
  // Count aliases on this domain (for the digest report)
  //
  const aliasCount = await Aliases.countDocuments({
    domain: domainDoc._id
  });

  //
  // If there are bannable hits, evaluate each user and email support@
  // for review instead of automatically banning and denylisting.
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

    if (users.length === 0) return cat;

    //
    // Separate users into flagged vs. protected (skipped)
    //
    const flaggedUsers = [];
    const protectedUsers = [];

    for (const user of users) {
      const exclusionReasons = getExclusionReasons(user);
      if (exclusionReasons.length > 0) {
        protectedUsers.push({ user, exclusionReasons });
      } else {
        flaggedUsers.push(user);
      }
    }

    //
    // Email support@ for review instead of auto-banning (skipped in dry-run mode)
    //
    if (flaggedUsers.length > 0) {
      const flaggedEmails = [];

      if (ctx.dryRun) {
        //
        // DRY RUN – log what would happen but take no action
        //
        for (const user of flaggedUsers) {
          flaggedEmails.push(user.email);
          log.info(
            `[DRY RUN] Would flag user ${user._id} (${
              user.email
            }) for review – domain ${name} categorised as [${bannableHits.join(
              ', '
            )}]`
          );
        }

        log.info(
          `[DRY RUN] Would email support@ for review: domain ${name} and ${flaggedEmails.length} user(s)`
        );
      } else {
        //
        // LIVE – email support@ for manual review instead of auto-banning
        //
        for (const user of flaggedUsers) {
          flaggedEmails.push(user.email);

          log.info(
            `Flagged user ${user._id} (${
              user.email
            }) for review – domain ${name} categorised as [${bannableHits.join(
              ', '
            )}]`
          );
        }

        //
        // Send a single review email to support@ with all flagged users
        // for this domain so an admin can manually decide whether to ban.
        //
        const userListHtml = flaggedUsers
          .map(
            (u) =>
              `<li><a href="${
                config.urls.web
              }/admin/users?q=${encodeURIComponent(u.email)}">${
                u.email
              }</a> (ID: ${u._id})</li>`
          )
          .join('\n');

        emailHelper({
          template: 'alert',
          message: {
            to: config.supportEmail,
            subject: `[Review Required] Domain flagged by Cloudflare check: ${name} – ${bannableHits.join(
              ', '
            )}`
          },
          locals: {
            message: `
              <h3>Domain Flagged for Review</h3>
              <p>The following domain was flagged by the Cloudflare Family DNS &amp; content categorisation check and requires manual review before any ban action is taken.</p>
              <table border="1" cellpadding="5" cellspacing="0">
                <tr><th>Field</th><th>Value</th></tr>
                <tr><td><strong>Domain</strong></td><td>${name}</td></tr>
                <tr><td><strong>Categories</strong></td><td>${cat.categories.join(
                  ', '
                )}</td></tr>
                <tr><td><strong>Actionable Categories</strong></td><td>${bannableHits.join(
                  ', '
                )}</td></tr>
                <tr><td><strong>Page Title</strong></td><td>${
                  cat.title || '(none)'
                }</td></tr>
                <tr><td><strong>HTTP Status</strong></td><td>${
                  cat.statusCode === null ? 'N/A' : cat.statusCode
                }</td></tr>
                <tr><td><strong>Content Length</strong></td><td>${
                  cat.contentLength
                } bytes</td></tr>
                <tr><td><strong>Is Parked</strong></td><td>${
                  cat.isParked ? 'Yes' : 'No'
                }</td></tr>
                <tr><td><strong>Legitimate Hosting</strong></td><td>${
                  cat.hasLegitimateHosting ? 'Yes' : 'No'
                }</td></tr>
                <tr><td><strong>Alias Count</strong></td><td>${aliasCount}</td></tr>
              </table>
              <h4>Users Requiring Review (${flaggedUsers.length})</h4>
              <ul>${userListHtml}</ul>
              <p>To ban these users and denylist this domain, visit the <a href="${
                config.urls.web
              }/admin/users">admin panel</a>.</p>
            `
          }
        })
          .then()
          .catch((err) => log.fatal(err));
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
        users: flaggedUsers.map((u) => ({
          id: u._id.toString(),
          email: u.email
        })),
        aliasCount,
        bannedEmails: flaggedEmails
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

        log.info(
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

  return cat;
}

module.exports = checkDomainAndAct;
module.exports.BANNABLE_CATEGORIES = BANNABLE_CATEGORIES;
module.exports.REVIEW_CATEGORIES = REVIEW_CATEGORIES;
module.exports.DENYLIST_TTL_MS = DENYLIST_TTL_MS;
module.exports.ACCOUNT_AGE_THRESHOLD_MONTHS = ACCOUNT_AGE_THRESHOLD_MONTHS;
module.exports.getExclusionReasons = getExclusionReasons;
