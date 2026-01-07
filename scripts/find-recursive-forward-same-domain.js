/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Script to find domains affected by the recursive forward same-domain bug
 * and optionally notify users about the fix.
 *
 * Environment variables:
 *   DRY_RUN=true      - Don't send emails, just log what would be sent
 *   USER_EMAIL=x@y.z  - Only process domains for this specific user
 *   PREVIEW=true      - Generate a preview email with fake data (for local testing)
 *
 * Usage:
 *   node scripts/find-recursive-forward-same-domain.js
 *   DRY_RUN=true node scripts/find-recursive-forward-same-domain.js
 *   USER_EMAIL=user@example.com node scripts/find-recursive-forward-same-domain.js
 *   PREVIEW=true node scripts/find-recursive-forward-same-domain.js
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const isFQDN = require('is-fqdn');
const mongoose = require('mongoose');
const ms = require('ms');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');
const { boolean } = require('boolean');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const setupMongoose = require('#helpers/setup-mongoose');

// Environment variable flags
const DRY_RUN = boolean(process.env.DRY_RUN);
const { USER_EMAIL } = process.env;
const PREVIEW = boolean(process.env.PREVIEW);

// Concurrency settings (increased for faster execution)
const DOMAIN_CONCURRENCY = 50;
const ALIAS_CONCURRENCY = 20;
const DNS_CONCURRENCY = 10;
const EMAIL_CONCURRENCY = 10;

// Redis cache key prefix and TTL
const CACHE_KEY_PREFIX = 'recursive_forward_fix_notified:';
const CACHE_TTL = ms('30d');

// Setup Redis and resolver
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client);

// Setup graceful shutdown
const graceful = new Graceful({
  redisClients: [client],
  mongooses: [mongoose]
});

let isCancelled = false;

if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

// Cache for MX and TXT lookups to avoid repeated DNS queries
const mxCache = new Map();
const txtCache = new Map();

// Helper to check if MX records point to Forward Email's servers (with caching)
async function hasForwardEmailMX(domain) {
  if (mxCache.has(domain)) return mxCache.get(domain);

  try {
    const mxRecords = await resolver.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      mxCache.set(domain, false);
      return false;
    }

    for (const record of mxRecords) {
      const exchange = record.exchange.toLowerCase();
      const isOurs = config.exchanges.some(
        (ex) => exchange === ex || exchange.endsWith(`.${ex}`)
      );
      if (isOurs) {
        mxCache.set(domain, true);
        return true;
      }
    }

    mxCache.set(domain, false);
    return false;
  } catch {
    mxCache.set(domain, false);
    return false;
  }
}

// Helper to check if domain has Forward Email TXT records (with caching)
async function hasForwardEmailTXT(domain) {
  if (txtCache.has(domain)) return txtCache.get(domain);

  try {
    const records = await resolver.resolveTxt(domain);
    for (const record of records) {
      const joined = record.join('');
      if (
        joined.startsWith(`${config.recordPrefix}=`) ||
        joined.startsWith(`${config.recordPrefix}-site-verification=`)
      ) {
        txtCache.set(domain, true);
        return true;
      }
    }

    txtCache.set(domain, false);
    return false;
  } catch {
    txtCache.set(domain, false);
    return false;
  }
}

// Helper to check if an email address is valid
function isEmail(str) {
  return (
    typeof str === 'string' && str.includes('@') && str.split('@').length === 2
  );
}

// Process a single recipient to check if it's affected
async function checkRecipient(recipient, alias, domain) {
  if (!isEmail(recipient)) return null;

  try {
    const recipientDomain = parseHostFromDomainOrAddress(recipient);

    // Skip if recipient is on the same domain (that's a different issue)
    if (recipientDomain === domain.name) return null;

    // Check if the recipient domain:
    // 1. Has Forward Email TXT records
    // 2. Does NOT have Forward Email MX records
    const [hasTXT, hasMX] = await Promise.all([
      hasForwardEmailTXT(recipientDomain),
      hasForwardEmailMX(recipientDomain)
    ]);

    if (hasTXT && !hasMX) {
      return {
        sourceDomain: domain.name,
        sourceAlias: `${alias.name}@${domain.name}`,
        forwardsTo: recipient,
        recipientDomain,
        userId: alias.user ? alias.user.toString() : null
      };
    }
  } catch (err) {
    logger.debug(err);
  }

  return null;
}

// Process a single alias
async function processAlias(alias, domain) {
  if (isCancelled) return [];

  const recipients = alias.recipients || [];
  if (recipients.length === 0) return [];

  // Skip wildcards and regex aliases
  if (alias.name === '*' || alias.name.startsWith('/')) return [];

  const results = await pMap(
    recipients,
    (recipient) => checkRecipient(recipient, alias, domain),
    { concurrency: DNS_CONCURRENCY }
  );

  return results.filter(Boolean);
}

// Process a single domain
async function processDomain(domain) {
  if (isCancelled) return [];

  if (!isFQDN(domain.name)) return [];

  const affected = [];

  try {
    // Get all aliases for this domain
    const aliases = await Aliases.find({
      domain: domain._id,
      is_enabled: true
    })
      .lean()
      .select('name recipients user domain');

    const results = await pMap(
      aliases,
      (alias) => processAlias(alias, domain),
      { concurrency: ALIAS_CONCURRENCY }
    );

    for (const result of results) {
      affected.push(...result);
    }
  } catch (err) {
    logger.error(`Error processing domain ${domain.name}:`, err.message);
  }

  return affected;
}

/**
 * Generate preview data for testing email template
 */
function generatePreviewData() {
  return new Map([
    [
      'preview@example.com',
      {
        email: 'preview@example.com',
        domains: [
          {
            domain: 'example.com',
            affected: [
              {
                sourceAlias: 'hello@example.com',
                forwardsTo: 'forward@external.com',
                recipientDomain: 'external.com'
              },
              {
                sourceAlias: 'support@example.com',
                forwardsTo: 'team@another.org',
                recipientDomain: 'another.org'
              }
            ]
          },
          {
            domain: 'mysite.org',
            affected: [
              {
                sourceAlias: 'info@mysite.org',
                forwardsTo: 'contact@thirdparty.net',
                recipientDomain: 'thirdparty.net'
              }
            ]
          }
        ]
      }
    ]
  ]);
}

/**
 * Build HTML message for email
 */
function buildEmailMessage(domains) {
  let html = `
<p>We recently fixed a bug that may have affected some of your email forwarding rules. Here's what happened and what's now fixed:</p>

<h3>The Issue</h3>
<p>When you forwarded emails to a domain that had our TXT records configured but used a different email provider (MX server), those emails were incorrectly rejected with an "Invalid recipients" error instead of being delivered.</p>

<h3>The Fix</h3>
<p>We've updated our system to properly deliver these emails to the target domain's actual email server. Your forwarding rules listed below should now work correctly.</p>

<h3>Your Affected Forwarding Rules</h3>
`;

  for (const domainData of domains) {
    html += `<h4>${domainData.domain}</h4>`;
    html += '<ul>';
    for (const item of domainData.affected) {
      html += `<li><strong>${item.sourceAlias}</strong> → ${item.forwardsTo}</li>`;
    }

    html += '</ul>';
  }

  html += `
<p>No action is required on your part. These forwarding rules should now work as expected.</p>

<p>If you have any questions, please don't hesitate to reach out to our support team.</p>
`;

  return html;
}

/**
 * Send notification email to a user
 */
async function sendNotificationEmail(userEmail, domains) {
  const cacheKey = `${CACHE_KEY_PREFIX}${userEmail.toLowerCase()}`;

  // Check if we already sent this email (skip for preview)
  if (!PREVIEW) {
    try {
      const cached = await client.get(cacheKey);
      if (cached) {
        logger.info(`Already notified ${userEmail}, skipping`);
        return { skipped: true, reason: 'already_notified' };
      }
    } catch (err) {
      logger.error(`Redis error checking cache for ${userEmail}:`, err.message);
    }
  }

  const message = buildEmailMessage(domains);

  if (DRY_RUN) {
    logger.info(`[DRY RUN] Would send email to ${userEmail}`);
    logger.info(
      `[DRY RUN] Affected domains: ${domains.map((d) => d.domain).join(', ')}`
    );
    logger.info(
      `[DRY RUN] Total affected rules: ${domains.reduce(
        (sum, d) => sum + d.affected.length,
        0
      )}`
    );
    return { sent: false, dryRun: true };
  }

  try {
    await email({
      template: 'alert',
      message: {
        to: userEmail,
        subject: 'Email Forwarding Bug Fix - Your Rules Are Now Working'
      },
      locals: {
        message
      }
    });

    // Cache that we sent this email (30 days) - skip for preview
    if (!PREVIEW) {
      await client.set(cacheKey, 'true', 'PX', CACHE_TTL);
    }

    logger.info(`Sent notification email to ${userEmail}`);
    return { sent: true };
  } catch (err) {
    logger.error(`Failed to send email to ${userEmail}:`, err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Main function
 */
async function main() {
  await setupMongoose(logger);

  logger.info('Starting recursive forward same-domain bug detection script');
  logger.info(`DRY_RUN: ${DRY_RUN}`);
  logger.info(`USER_EMAIL: ${USER_EMAIL || 'all users'}`);
  logger.info(`PREVIEW: ${PREVIEW}`);

  // Handle preview mode
  if (PREVIEW) {
    logger.info('Running in PREVIEW mode with fake data');
    const previewData = generatePreviewData();

    for (const [userEmail, userData] of previewData) {
      await sendNotificationEmail(userEmail, userData.domains);
    }

    logger.info('Preview complete');
    return;
  }

  // Build domain query
  const domainQuery = { has_txt_record: true };

  // If USER_EMAIL is specified, find domains for that user
  if (USER_EMAIL) {
    const user = await Users.findOne({ email: USER_EMAIL })
      .select('_id')
      .lean();
    if (!user) {
      logger.error(`User not found: ${USER_EMAIL}`);
      return;
    }

    domainQuery.members = {
      $elemMatch: {
        user: user._id
      }
    };
    logger.info(`Filtering domains for user: ${USER_EMAIL}`);
  }

  // Count total domains
  const totalDomains = await Domains.countDocuments(domainQuery);
  logger.info(`Total domains to process: ${totalDomains}`);

  // Collect all affected configs
  const allAffected = [];
  let processedCount = 0;

  // Process domains in batches
  const domainBatch = [];

  // eslint-disable-next-line unicorn/no-array-callback-reference
  for await (const domain of Domains.find(domainQuery)
    .lean()
    .select('_id name members')
    .populate('members.user', 'email')
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    if (isCancelled) break;

    domainBatch.push(domain);

    if (domainBatch.length >= DOMAIN_CONCURRENCY) {
      const results = await pMap(domainBatch, processDomain, {
        concurrency: DOMAIN_CONCURRENCY
      });

      for (const [i, domainAffected] of results.entries()) {
        if (domainAffected.length > 0) {
          // Attach domain info and user emails
          const domainDoc = domainBatch[i];
          for (const affected of domainAffected) {
            // Get user emails from domain members
            const userEmails = [];
            for (const member of domainDoc.members || []) {
              if (
                member.user &&
                member.user.email &&
                !member.user.email.endsWith('@removed.forwardemail.net')
              ) {
                userEmails.push(member.user.email);
              }
            }

            allAffected.push({
              ...affected,
              domainName: domainDoc.name,
              userEmails
            });
          }
        }
      }

      processedCount += domainBatch.length;
      logger.info(
        `Progress: ${processedCount}/${totalDomains} domains, ${allAffected.length} affected rules`
      );

      domainBatch.length = 0;

      // Clear caches periodically
      if (processedCount % 500 === 0) {
        mxCache.clear();
        txtCache.clear();
      }
    }
  }

  // Process remaining domains
  if (domainBatch.length > 0 && !isCancelled) {
    const results = await pMap(domainBatch, processDomain, {
      concurrency: DOMAIN_CONCURRENCY
    });

    for (const [i, domainAffected] of results.entries()) {
      if (domainAffected.length > 0) {
        const domainDoc = domainBatch[i];
        for (const affected of domainAffected) {
          const userEmails = [];
          for (const member of domainDoc.members || []) {
            if (
              member.user &&
              member.user.email &&
              !member.user.email.endsWith('@removed.forwardemail.net')
            ) {
              userEmails.push(member.user.email);
            }
          }

          allAffected.push({
            ...affected,
            domainName: domainDoc.name,
            userEmails
          });
        }
      }
    }

    processedCount += domainBatch.length;
  }

  logger.info(`\nProcessing complete:`);
  logger.info(`  Total domains processed: ${processedCount}`);
  logger.info(`  Total affected rules: ${allAffected.length}`);

  // Group by user email for notifications
  const userAffectedMap = new Map();

  for (const affected of allAffected) {
    for (const userEmail of affected.userEmails) {
      if (!userAffectedMap.has(userEmail)) {
        userAffectedMap.set(userEmail, new Map());
      }

      const userDomains = userAffectedMap.get(userEmail);
      if (!userDomains.has(affected.domainName)) {
        userDomains.set(affected.domainName, []);
      }

      userDomains.get(affected.domainName).push(affected);
    }
  }

  logger.info(`  Users to notify: ${userAffectedMap.size}`);

  // Send emails to affected users
  if (userAffectedMap.size > 0) {
    logger.info('\nSending notification emails...');

    let sentCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    const userEntries = [...userAffectedMap.entries()];

    await pMap(
      userEntries,
      async ([userEmail, domainsMap]) => {
        if (isCancelled) return;

        // Convert map to array format for email
        const domains = [];
        for (const [domainName, affected] of domainsMap) {
          domains.push({
            domain: domainName,
            affected
          });
        }

        const result = await sendNotificationEmail(userEmail, domains);
        if (result.sent) sentCount++;
        else if (result.skipped || result.dryRun) skippedCount++;
        else errorCount++;
      },
      { concurrency: EMAIL_CONCURRENCY }
    );

    logger.info(`\nEmail sending complete:`);
    logger.info(`  Sent: ${sentCount}`);
    logger.info(`  Skipped (already notified or dry run): ${skippedCount}`);
    logger.info(`  Errors: ${errorCount}`);
  }

  // Output summary for dry run
  if (userAffectedMap.size > 0 && DRY_RUN) {
    logger.info('\n--- DRY RUN SUMMARY ---');
    for (const [userEmail, domainsMap] of userAffectedMap) {
      let totalRules = 0;
      for (const affected of domainsMap.values()) {
        totalRules += affected.length;
      }

      logger.info(
        `${userEmail}: ${domainsMap.size} domains, ${totalRules} affected rules`
      );
    }
  }
}

(async () => {
  try {
    await main();
  } catch (err) {
    logger.error('Script failed:', err);
  } finally {
    try {
      await client.quit();
    } catch {
      // Ignore cleanup errors
    }

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  }
})();
