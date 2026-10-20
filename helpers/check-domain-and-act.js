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
//     The email says which keywords matched and where, and is sent
//     once: the hourly scan does not send it again for 30 days unless
//     the categories or users change.
//   - A Cloudflare block for adult content alone (the security resolver
//     does not block the domain, and its page was read and has no adult
//     keyword) is only listed for review: the categorization can be stale
//     or wrong. The domain still waits for a manual review before it is
//     approved for SMTP (see `updateVerdict`).
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
// an `opts` object that supplies the Redis client, resolvers, logger,
// and dry-run flag.
//

const crypto = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const config = require('#config');
const emailHelper = require('#helpers/email');
const getCloudflareRadarFeedbackUrl = require('#helpers/get-cloudflare-radar-feedback-url');
const getDomainCategorization = require('#helpers/get-domain-categorization');
const {
  INVALID_VERDICT,
  PENDING,
  UNSEEN_TTL_MS,
  replaceDomainCheckVerdict,
  getDomainCheckVerdictValue,
  parseDomainCheckVerdict
} = require('#helpers/domain-check-verdict');
const logger = require('#helpers/logger');
const _ = require('#helpers/lodash');

//
// A domain is checked every hour (jobs/check-domains-cloudflare-family.js).
// Its review alert is not sent again for this long unless what was found
// changes: other categories, or other users to review. Each set of findings
// is recorded on its own, so findings that alternate (a page that loads one
// hour and times out the next) are not emailed again either.
//
const ALERT_TTL_MS = ms('30d');
const ALERT_KEY_PREFIX = 'domain_check_alert:';

// (an alert being sent is claimed for this long: one whose process ended
//  mid-send is sent again by a later check)
const ALERT_CLAIM_MS = ms('15m');

// visible text a page needs to contradict a Cloudflare adult categorization
const MIN_TEXT_LENGTH = 200;

const CLOUDFLARE_VERDICTS = {
  security:
    'Blocked as a security threat (malware or phishing) by Cloudflare (1.1.1.2 and 1.1.1.3)',
  adult: 'Blocked as adult content by Cloudflare Family DNS (1.1.1.3) only',
  unknown:
    'Blocked by Cloudflare Family DNS (1.1.1.3); the security resolver (1.1.1.2) did not answer'
};

// (what Cloudflare's block of a domain says)
function describeCloudflareBlock(cat) {
  return cat.blocked
    ? CLOUDFLARE_VERDICTS[cat.cloudflareBlock] || CLOUDFLARE_VERDICTS.unknown
    : 'Not blocked';
}

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
const REVIEW_CATEGORIES = new Set([
  'tiktok_tool',
  'streaming',
  'dns_error',
  'email_service',
  'possible_phishing'
]);

//
// Review categories that still keep a domain from being approved for SMTP
// automatically (see `updateVerdict`): a sign-in page with pressure wording
// is not emailed (banks and help desks write it too), but a domain sending
// mail from one is reviewed first
//
const HELD_CATEGORIES = new Set(['possible_phishing']);

//
// Review categories listed in the digest only, and not in the new domain
// email (as an unconfirmed Cloudflare adult block is not either)
//
const DIGEST_ONLY = new Set(['possible_phishing', 'email_service']);

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

// (per domain record: two users can each add a domain with the same name)
function getAlertKey(domainId, fingerprint) {
  return `${ALERT_KEY_PREFIX}${domainId}:${crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')}`;
}

/**
 * Claim the review alert about to be sent for the domain, unless one for
 * the same findings was sent (or is being sent): false then. The claim is
 * one command, so the hourly job and the post-create hook cannot both send
 * it; it lasts `ALERT_CLAIM_MS`, and `ALERT_TTL_MS` once sent (see
 * `rememberReported`). Without a Redis client, or when it fails, every
 * alert is sent.
 *
 * @param   {object}  client  Redis client
 * @param   {string}  key     See `getAlertKey`
 * @param   {object}  log
 * @returns {Promise<boolean>}
 */
async function claimAlert(client, key, log) {
  if (!client) return true;
  try {
    return (await client.set(key, '1', 'PX', ALERT_CLAIM_MS, 'NX')) === 'OK';
  } catch (err) {
    log.warn(err);
    return true;
  }
}

async function rememberReported(client, key, log) {
  if (!client) return;
  try {
    // (the claim can have lapsed during a slow send)
    if ((await client.pexpire(key, ALERT_TTL_MS)) !== 1)
      await client.set(key, '1', 'PX', ALERT_TTL_MS);
  } catch (err) {
    log.warn(err);
  }
}

async function forgetReported(client, key, log) {
  if (!client) return;
  try {
    await client.del(key);
  } catch (err) {
    log.warn(err);
  }
}

/**
 * Whether the domain's page was read: it answered, and has enough text to
 * go by or is a parked page (by its IP or its registrar's page, not a
 * phrase such as "coming soon" that any page with little text can show).
 * Adult sites often refuse the check with a 403, or show an age gate or an
 * app with little text.
 *
 * @param   {object}  cat  See `get-domain-categorization`
 * @returns {boolean}
 */
function wasPageRead(cat) {
  return (
    // (not a page cut off by the timeout: the rest may say more)
    !cat.timedOut &&
    Number.isInteger(cat.statusCode) &&
    cat.statusCode >= 200 &&
    cat.statusCode < 300 &&
    Boolean(
      cat.isParkedLander ||
        cat.categories.includes('parking_ip') ||
        cat.textLength >= MIN_TEXT_LENGTH
    )
  );
}

/**
 * Keep what a check flagged the domain for (see `domain-check-verdict`),
 * and clear it after a clean check. A check that could not look at
 * everything (its DNS lookup failed, or its page could not be read) does
 * not clear what it could not see: a domain flagged for its page that
 * blocks the check for an hour would otherwise lose its flag and be
 * approved for SMTP. A page counts as read as in `wasPageRead` (an empty
 * page is not), a Cloudflare block as checked unless the lookup failed or
 * the domain points to 0.0.0.0 itself (which hides any block; one with no
 * address is not blocked, as Cloudflare answers 0.0.0.0 for a name it
 * blocks either way), and the disposable email domain list unless it could
 * not be read. What is kept lapses 90 days after a check last saw it.
 * Another check changing the verdict meanwhile (the one when a domain is
 * created and the hourly one at once) makes it start over with that one.
 *
 * @param   {object}    client
 * @param   {object}    domainDoc
 * @param   {object}    cat        See `get-domain-categorization`
 * @param   {string[]}  flagged    Categories found this time
 * @returns {Promise<void>}
 */
async function updateVerdict(client, domainDoc, cat, flagged) {
  if (!client) return;
  const pageWasRead = wasPageRead(cat);
  const wasChecked = (category) =>
    category === 'blocked_by_cloudflare_family'
      ? !cat.dnsError && !cat.pointsToZeroAddress
      : category === 'disposable_email'
      ? pageWasRead && !cat.disposableListError
      : pageWasRead;

  for (let attempt = 0; attempt < 5; attempt++) {
    // (a Redis error throws: the verdict is then left as it is; a value
    //  that is not a verdict is replaced)
    const value = await getDomainCheckVerdictValue(client, domainDoc._id);
    let previous;
    try {
      previous = parseDomainCheckVerdict(value, domainDoc._id);
    } catch (err) {
      if (err.code !== INVALID_VERDICT) throw err;
      previous = { categories: [] };
    }

    //
    // (what it was flagged for and this check could not see is kept, with
    //  when a check last saw it, for 90 days after that: a domain that can
    //  never be read again, such as one only for email, is not held
    //  forever)
    //
    const now = Date.now();
    const seen = {};
    const unseen = previous
      ? previous.categories.filter((category) => {
          if (category === PENDING) return false;
          if (flagged.includes(category) || wasChecked(category)) return false;
          const at = Date.parse(
            previous.seen?.[category] || previous.checked_at || ''
          );
          if (Number.isFinite(at) && now - at > UNSEEN_TTL_MS) return false;
          if (Number.isFinite(at)) seen[category] = new Date(at).toISOString();
          return true;
        })
      : [];

    const categories = [...flagged, ...unseen];
    if (categories.length === 0 && !value) return;
    if (
      await replaceDomainCheckVerdict(client, domainDoc._id, {
        read: value,
        categories,
        seen
      })
    )
      return;
  }

  throw new Error(`Domain check verdict of ${domainDoc._id} kept changing`);
}

const EVIDENCE_PLACES = {
  title: 'in the page title or description',
  text: 'in the page text',
  link: 'linked from the page',
  domain: 'in the domain name',
  list: 'is on the disposable email domain list'
};

/**
 * The review alert's HTML.
 *
 * NOTE: the page title and the excerpts come from the (attacker controlled)
 *       web page and are entity-decoded by `readPage`, and the alert
 *       template renders `message` unescaped, so every interpolated value
 *       below is HTML escaped
 *
 * @param   {object}  opts
 * @returns {string}
 */
function getAlertHtml({ name, cat, bannableHits, flaggedUsers, aliasCount }) {
  const safeName = _.escape(name);
  const userListHtml = flaggedUsers
    .map(
      (u) =>
        `<li><a href="${_.escape(
          `${config.urls.web}/admin/users?q=${encodeURIComponent(u.email)}`
        )}">${_.escape(u.email)}</a> (ID: ${_.escape(String(u._id))})</li>`
    )
    .join('\n');

  //
  // What made each actionable category match, so a keyword used in another
  // sense (or another language) is plain to see
  //
  const evidenceHtml = bannableHits
    .map((category) => {
      if (category === 'blocked_by_cloudflare_family')
        return `<li><strong>${_.escape(category)}</strong>: ${_.escape(
          describeCloudflareBlock(cat)
        )}</li>`;
      const found = (cat.evidence && cat.evidence[category]) || [];
      return `<li><strong>${_.escape(category)}</strong>${
        found.length === 0
          ? ''
          : `<ul>${found
              .map(
                (e) =>
                  `<li>&ldquo;${_.escape(e.keyword)}&rdquo; ${_.escape(
                    EVIDENCE_PLACES[e.in] || ''
                  )}: <em>${_.escape(e.excerpt)}</em></li>`
              )
              .join('')}</ul>`
      }</li>`;
    })
    .join('\n');

  return `
    <h3>Domain Flagged for Review</h3>
    <p>The following domain was flagged by the Cloudflare Family DNS &amp; content categorisation check and requires manual review before any ban action is taken.</p>
    <h4>Why it was flagged</h4>
    <ul>${evidenceHtml}</ul>
    ${
      cat.blocked
        ? `<p>Cloudflare's categorization can predate the current owner of a domain (one registered again after it expired keeps it). If the site does not match it, <a href="${_.escape(
            getCloudflareRadarFeedbackUrl(name)
          )}" target="_blank" rel="noopener noreferrer">submit a Cloudflare Radar classification change request for ${safeName}</a>.</p>`
        : ''
    }
    <table border="1" cellpadding="5" cellspacing="0">
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td><strong>Domain</strong></td><td>${safeName}</td></tr>
      <tr><td><strong>Categories</strong></td><td>${_.escape(
        cat.categories.join(', ')
      )}</td></tr>
      <tr><td><strong>Actionable Categories</strong></td><td>${_.escape(
        bannableHits.join(', ')
      )}</td></tr>
      <tr><td><strong>Cloudflare</strong></td><td>${_.escape(
        describeCloudflareBlock(cat)
      )}</td></tr>
      <tr><td><strong>Page Title</strong></td><td>${_.escape(
        cat.title || '(none)'
      )}</td></tr>
      <tr><td><strong>HTTP Status</strong></td><td>${_.escape(
        cat.statusCode === null ? 'N/A' : String(cat.statusCode)
      )}</td></tr>
      <tr><td><strong>Content Length</strong></td><td>${_.escape(
        String(cat.contentLength)
      )} bytes</td></tr>
      <tr><td><strong>Is Parked</strong></td><td>${
        cat.isParked ? 'Yes' : 'No'
      }</td></tr>
      <tr><td><strong>Legitimate Hosting</strong></td><td>${
        cat.hasLegitimateHosting ? 'Yes' : 'No'
      }</td></tr>
      <tr><td><strong>Alias Count</strong></td><td>${_.escape(
        String(aliasCount)
      )}</td></tr>
    </table>
    <h4>Users Requiring Review (${flaggedUsers.length})</h4>
    <ul>${userListHtml}</ul>
    <p>To ban these users and denylist this domain, visit the <a href="${_.escape(
      `${config.urls.web}/admin/users`
    )}">admin panel</a>.</p>
  `;
}

/**
 * Categorise a single domain and take action (email support for review / report).
 *
 * Instead of automatically banning users and adding to the denylist,
 * this now emails alerts@ for manual review when bannable categories
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
 * @param   {object}  opts.client          Redis client (records the alerts sent)
 * @param   {object}  opts.familyResolver  Tangerine instance (1.1.1.3)
 * @param   {object}  [opts.securityResolver]  Tangerine instance (1.1.1.2)
 * @param   {object}  [opts.resolver]      Tangerine instance (unfiltered)
 * @param   {object}  [opts.logger]        Logger (defaults to module logger)
 * @param   {number}  [opts.timeout]       ms for the whole check (default 1500)
 * @param   {object}  opts.Users           Users model
 * @param   {object}  opts.Aliases         Aliases model
 * @returns {Promise<object|null>}  The categorisation result when the domain
 *                                   was flagged or listed for review, null when
 *                                   nothing was found or it has no members
 */
async function checkDomainAndAct(domainDoc, ctx, opts) {
  const { client, familyResolver, securityResolver, resolver, Users, Aliases } =
    opts;
  const log = opts.logger || logger;
  // (see `getDomainCategorization`: 1.5 seconds unless given)
  const { timeout } = opts;
  const { name } = domainDoc;

  //
  // Run the full categorisation (DNS + domain-name + HTTP content)
  //
  const cat = await getDomainCategorization(name, {
    familyResolver,
    securityResolver,
    resolver,
    client,
    logger: log,
    timeout
  });

  //
  // Determine whether any bannable category matched
  //
  let bannableHits = cat.categories.filter((c) => BANNABLE_CATEGORIES.has(c));
  // (what the domain is held for: see `updateVerdict`)
  const flagged = cat.categories.filter(
    (c) => BANNABLE_CATEGORIES.has(c) || HELD_CATEGORIES.has(c)
  );
  const reviewHits = cat.categories.filter((c) => REVIEW_CATEGORIES.has(c));

  //
  // A Cloudflare block for adult content alone is not enough for an alert:
  // the categorization can predate the current owner (a domain registered
  // again after it expired keeps it) or be wrong. When the page was read
  // (a parked page counts: see `wasPageRead`) and has no adult keyword at
  // all, it is only listed for review in the digest. A page that could not
  // be read cannot contradict the block, and one adult keyword (an age
  // gate) bears it out. A security block (malware or phishing) stands on
  // its own.
  //
  const isUnconfirmedAdultBlock =
    cat.cloudflareBlock === 'adult' &&
    wasPageRead(cat) &&
    !cat.keywordCounts?.adult &&
    !cat.categories.includes('adult') &&
    bannableHits.includes('blocked_by_cloudflare_family');
  if (isUnconfirmedAdultBlock) {
    bannableHits = bannableHits.filter(
      (c) => c !== 'blocked_by_cloudflare_family'
    );
    reviewHits.push('blocked_by_cloudflare_family');
  }

  //
  // Keep what the domain is flagged for, whoever its members are and
  // whether or not it is emailed: it is then not approved for outbound SMTP
  // automatically, and waits for a manual review
  //
  if (!ctx.dryRun) {
    try {
      await updateVerdict(client, domainDoc, cat, flagged);
    } catch (err) {
      // (a flagged domain left without a verdict can be approved)
      log.error(err);
    }
  }

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
      let alreadyReported = false;
      let alertSent = false;

      for (const user of flaggedUsers) {
        flaggedEmails.push(user.email);
        log.info(
          `${ctx.dryRun ? '[DRY RUN] Would flag' : 'Flagged'} user ${
            user._id
          } (${
            user.email
          }) for review – domain ${name} categorised as [${bannableHits.join(
            ', '
          )}]`
        );
      }

      if (ctx.dryRun) {
        // (a dry run sends nothing)
        log.info(
          `[DRY RUN] Would email alerts@ for review: domain ${name} and ${flaggedEmails.length} user(s)`
        );
      } else {
        //
        // The domain is checked every hour: an alert already sent for the
        // same categories and users is not sent again (see ALERT_TTL_MS)
        //
        const fingerprint = [
          [...bannableHits].sort().join(','),
          flaggedUsers
            .map((u) => String(u._id))
            .sort()
            .join(',')
        ].join('|');
        const alertKey = getAlertKey(String(domainDoc._id), fingerprint);
        alreadyReported = !(await claimAlert(client, alertKey, log));

        if (alreadyReported) {
          log.debug(`Review alert for ${name} was already sent`);
        } else {
          //
          // Send a single review email to support@ with all flagged users
          // for this domain so an admin can manually decide whether to ban.
          //
          // (awaited: the job's worker is ended when the job is done, and
          //  an alert it did not send must be sent by the next check)
          //
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: config.alertsEmail,
                subject: `[Review Required] Domain flagged by Cloudflare check: ${name} – ${bannableHits.join(
                  ', '
                )}`
              },
              locals: {
                message: getAlertHtml({
                  name,
                  cat,
                  bannableHits,
                  flaggedUsers,
                  aliasCount
                })
              }
            });
            alertSent = true;
            await rememberReported(client, alertKey, log);
          } catch (err) {
            log.fatal(err);
            await forgetReported(client, alertKey, log);
          }
        }
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
        bannedEmails: flaggedEmails,
        cloudflareBlock: cat.cloudflareBlock,
        evidence: cat.evidence,
        alreadyReported,
        alertSent
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
          aliasCount,
          cloudflareBlock: cat.cloudflareBlock,
          evidence: cat.evidence
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
      aliasCount,
      cloudflareBlock: cat.cloudflareBlock,
      // (a Cloudflare adult block the page does not bear out)
      isUnconfirmedAdultBlock,
      // (listed in the digest only, not emailed: see `DIGEST_ONLY`)
      digestOnly: reviewHits.every(
        (c) =>
          DIGEST_ONLY.has(c) ||
          (c === 'blocked_by_cloudflare_family' && isUnconfirmedAdultBlock)
      ),
      evidence: cat.evidence
    });
  }

  return cat;
}

module.exports = checkDomainAndAct;
module.exports.BANNABLE_CATEGORIES = BANNABLE_CATEGORIES;
module.exports.REVIEW_CATEGORIES = REVIEW_CATEGORIES;
module.exports.ACCOUNT_AGE_THRESHOLD_MONTHS = ACCOUNT_AGE_THRESHOLD_MONTHS;
module.exports.getExclusionReasons = getExclusionReasons;
