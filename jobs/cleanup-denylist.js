/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const pMap = require('p-map');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const CappedList = require('#helpers/capped-list');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const isAllowlisted = require('#helpers/is-allowlisted');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

// Create Tangerine DNS resolver
const resolver = createTangerine(client, logger);

//
// List of entries to remove from denylist
// Combines allowlist and truth sources
//
const entries = [...config.allowlist, ...config.truthSources];

//
// Configuration
//
const options = {
  scanCount: 10000, // Keys per SCAN iteration
  deleteChunkSize: 100, // Keys to delete before delay
  deleteDelay: 100, // Milliseconds to wait between chunks
  deleteConcurrency: 10, // Parallel delete operations
  maxReportRows: 1000 // Rows of each kind listed in the report email
};

//
// Check if a key matches any of the entries and return the matched entry
// Uses exact domain matching: the value must equal the entry or be a subdomain of it
// e.g., "stripe.com" matches "stripe.com" and "sub.stripe.com" but NOT "loanstripe.com"
//
function keyMatchesEntries(key) {
  const keyLower = key.toLowerCase();
  // Remove 'denylist:' prefix to get the value
  const value = keyLower.replace(/^denylist:/, '');

  // Extract domain from value (could be email, domain, or IP)
  const emailMatch = value.match(/@([^@]+)$/);
  // It's an email address - extract domain part
  // else it's a domain, subdomain, or IP
  const domain = emailMatch ? emailMatch[1] : value;

  for (const entry of entries) {
    const entryLower = entry.toLowerCase();
    // Exact domain match: domain equals entry OR is a subdomain (ends with .entry)
    if (domain === entryLower || domain.endsWith(`.${entryLower}`)) {
      return { matched: true, entry };
    }
  }

  return { matched: false, entry: null };
}

//
// Check if a key matches any truth source
// Truth sources are domains like gmail.com, outlook.com, etc.
// For email addresses, we do MX lookup and check the root domain of MX records
// Keys like denylist:spammer@gmail.com should be flagged but not deleted
// Returns { matched: boolean, source: string, matchType: string }
//
async function keyMatchesTruthSource(key) {
  const keyLower = key.toLowerCase();
  // Remove 'denylist:' prefix
  const value = keyLower.replace(/^denylist:/, '');

  // Check if value is an email address
  const emailMatch = value.match(/@([^@]+)$/);

  if (emailMatch) {
    // It's an email address - extract domain
    const domain = emailMatch[1];

    try {
      // Do MX lookup using Tangerine
      const mxRecords = await resolver.resolveMx(domain);

      if (mxRecords && mxRecords.length > 0) {
        // Check root domain of each MX record against truth sources
        for (const mx of mxRecords) {
          const mxHostname = mx.exchange || mx;
          const rootDomain = parseRootDomain(mxHostname);

          // Check if this root domain matches any truth source
          for (const truthSource of config.truthSources) {
            const truthSourceLower = truthSource.toLowerCase();
            if (rootDomain === truthSourceLower) {
              logger.debug(
                `Key ${key} matches truth source: MX ${mxHostname} -> root ${rootDomain} matches ${truthSource}`
              );
              return {
                matched: true,
                source: truthSource,
                matchType: `MX lookup (${mxHostname} → ${rootDomain})`
              };
            }
          }
        }
      }
    } catch (err) {
      // MX lookup failed - fall back to domain check
      logger.debug(`MX lookup failed for ${domain}:`, err.message);

      // Fall back to checking if the email domain itself matches truth sources
      for (const truthSource of config.truthSources) {
        const truthSourceLower = truthSource.toLowerCase();
        if (domain === truthSourceLower) {
          logger.debug(
            `Key ${key} matches truth source (fallback): domain ${domain} matches ${truthSource}`
          );
          return {
            matched: true,
            source: truthSource,
            matchType: `Domain match (MX lookup failed)`
          };
        }
      }
    }
  } else {
    // Not an email address - check if it's a domain or contains truth source
    for (const truthSource of config.truthSources) {
      const truthSourceLower = truthSource.toLowerCase();
      // Match if the value contains the truth source as a domain
      if (
        value.includes(`.${truthSourceLower}`) ||
        value === truthSourceLower
      ) {
        return {
          matched: true,
          source: truthSource,
          matchType: 'Direct domain match'
        };
      }
    }
  }

  return { matched: false, source: null, matchType: null };
}

//
// Delay helper
//
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  await setupMongoose(logger);

  const startTime = Date.now();

  try {
    logger.info('Starting denylist cleanup job');
    logger.info(`Scanning for keys matching ${entries.length} entries`);

    //
    // Scan the denylist keys and handle each page of the scan as it
    // arrives: filter it, delete what matched and keep only counts plus
    // the first rows for the report. Collecting every key first held the
    // whole denylist (millions of keys) in memory before anything was done.
    //
    logger.info('Scanning denylist keys');

    let totalKeys = 0;
    let keysToDeleteCount = 0;
    let allowlistedCount = 0;
    let deletedCount = 0;
    let errorCount = 0;
    let filterDuration = 0;
    let deleteDuration = 0;
    const deletedKeys = new CappedList(options.maxReportRows);
    const truthSourceKeys = new CappedList(options.maxReportRows);
    const errors = new CappedList(100);

    for await (const keys of client.scanStream({
      match: 'denylist:*',
      count: options.scanCount,
      type: 'string',
      // hold one page at a time (a readable stream buffers 16 by default)
      highWaterMark: 1
    })) {
      if (!Array.isArray(keys) || keys.length === 0) continue;
      totalKeys += keys.length;

      //
      // Filter keys that match entries or are allowlisted
      //
      const filterStartTime = Date.now();
      const keysToDelete = [];

      await pMap(
        keys,
        async (key) => {
          // Remove 'denylist:' prefix to get the value
          const value = key.replace(/^denylist:/i, '');

          // Check if the value is allowlisted (this checks Redis allowlist:* keys,
          // hard-coded config.allowlist, config.truthSources, and performs
          // reverse DNS lookups for IPs)
          // Now returns reason string or false
          const allowlistedReason = await isAllowlisted(
            value,
            client,
            resolver
          );
          if (allowlistedReason) {
            // Explicitly allowlisted - always delete from denylist
            // (explicit allowlist takes precedence over truth source matching)
            allowlistedCount++;
            keysToDelete.push({
              key,
              reason: 'Explicitly allowlisted via isAllowlisted() check',
              source: allowlistedReason
            });
            return;
          }

          // Check if key matches entries (config.allowlist or config.truthSources)
          const entryMatch = keyMatchesEntries(key);
          if (entryMatch.matched) {
            const truthSourceMatch = await keyMatchesTruthSource(key);
            if (truthSourceMatch.matched) {
              // Matches truth source via MX but NOT explicitly allowlisted
              // Preserve for manual review (could be legitimate spammer)
              truthSourceKeys.push({
                key,
                reason: `Matches truth source - preserved for manual review`,
                source: `${truthSourceMatch.source} (${truthSourceMatch.matchType})`
              });
            } else {
              keysToDelete.push({
                key,
                reason: `Key contains allowlist/truthSource entry`,
                source: entryMatch.entry
              });
            }
          }
        },
        { concurrency: 10 }
      );

      filterDuration += Date.now() - filterStartTime;
      keysToDeleteCount += keysToDelete.length;

      //
      // Delete this page's matches in chunks
      //
      const deleteStartTime = Date.now();
      for (let i = 0; i < keysToDelete.length; i += options.deleteChunkSize) {
        const chunk = keysToDelete.slice(i, i + options.deleteChunkSize);

        await pMap(
          chunk,
          async (keyInfo) => {
            try {
              await client.del(keyInfo.key);
              deletedCount++;
              deletedKeys.push(keyInfo);
            } catch (err) {
              errorCount++;
              errors.push({ key: keyInfo.key, error: err.message });
              logger.error(`Failed to delete key ${keyInfo.key}:`, err);
            }
          },
          { concurrency: options.deleteConcurrency }
        );

        // Add delay between chunks to prevent blocking Redis
        if (i + options.deleteChunkSize < keysToDelete.length) {
          await delay(options.deleteDelay);
        }
      }

      deleteDuration += Date.now() - deleteStartTime;
    }

    const totalDuration = Date.now() - startTime;
    const scanDuration = totalDuration - filterDuration - deleteDuration;

    logger.info(
      `Scanned ${totalKeys} denylist keys: ${keysToDeleteCount} to delete (${allowlistedCount} via allowlist lookup), ${deletedCount} deleted, ${truthSourceKeys.count} truth sources preserved`
    );

    if (truthSourceKeys.count > 0) {
      logger.warn(
        `Found ${truthSourceKeys.count} keys matching truth sources (not explicitly allowlisted) - these will NOT be deleted`
      );
    }

    if (errorCount > 0) {
      logger.warn(`Encountered ${errorCount} errors during deletion`);
    }

    if (keysToDeleteCount === 0) {
      logger.info('No keys to delete');
    } else {
      //
      // Summary
      //
      const summary = {
        totalKeys,
        matchedKeys: keysToDeleteCount,
        allowlistedKeys: allowlistedCount,
        deletedKeys: deletedCount,
        errorCount,
        scanDuration: `${scanDuration}ms`,
        filterDuration: `${filterDuration}ms`,
        deleteDuration: `${deleteDuration}ms`,
        totalDuration: `${totalDuration}ms`
      };

      logger.info('Denylist cleanup summary:', summary);

      const omittedNote = (list) =>
        list.omitted > 0
          ? `\n<p><em>${list.omitted} more not shown (the first ${list.items.length} are listed).</em></p>`
          : '';

      // Email report to security@forwardemail.net
      const deletedKeysHtml =
        deletedKeys.count > 0
          ? `
<h3>Deleted Keys (${deletedKeys.count})</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>#</th><th>Key</th><th>Reason</th><th>Source</th></tr>
  ${deletedKeys.items
    .map(
      (item, index) =>
        `<tr><td>${index + 1}</td><td>${item.key}</td><td>${
          item.reason
        }</td><td>${item.source}</td></tr>`
    )
    .join('\n  ')}
</table>${omittedNote(deletedKeys)}
        `.trim()
          : '';

      const truthSourceKeysHtml =
        truthSourceKeys.count > 0
          ? `
<h3>⚠️ Truth Source Matches - NOT DELETED (${truthSourceKeys.count})</h3>
<p><strong>These keys match truth sources via MX lookup (e.g., gmail.com → google.com) and were preserved for manual review.</strong></p>
<p>Truth sources may contain legitimate spammers that should remain on the denylist.</p>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>#</th><th>Key</th><th>Reason</th><th>Source</th></tr>
  ${truthSourceKeys.items
    .map(
      (item, index) =>
        `<tr><td>${index + 1}</td><td>${item.key}</td><td>${
          item.reason
        }</td><td>${item.source}</td></tr>`
    )
    .join('\n  ')}
</table>${omittedNote(truthSourceKeys)}
        `.trim()
          : '';

      const errorsHtml =
        errorCount > 0 && errorCount <= 100
          ? `
<h3>Errors (${errorCount})</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>#</th><th>Key</th><th>Error</th></tr>
  ${errors.items
    .map(
      (e, index) =>
        `<tr><td>${index + 1}</td><td>${e.key}</td><td>${e.error}</td></tr>`
    )
    .join('\n  ')}
</table>
        `.trim()
          : errorCount > 100
          ? `<p><em>Note: ${errorCount} errors occurred (too many to display)</em></p>`
          : '';

      const summaryHtml = `
<h2>Denylist Cleanup Report</h2>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>Metric</th><th>Value</th></tr>
  <tr><td>Total denylist keys scanned</td><td>${totalKeys}</td></tr>
  <tr><td>Keys to delete (entries + allowlisted)</td><td>${keysToDeleteCount}</td></tr>
  <tr><td>Keys found via isAllowlisted()</td><td>${allowlistedCount}</td></tr>
  <tr><td>Keys deleted</td><td>${deletedCount}</td></tr>
  <tr><td>Truth source matches (preserved)</td><td>${truthSourceKeys.count}</td></tr>
  <tr><td>Errors</td><td>${errorCount}</td></tr>
  <tr><td>Scan duration</td><td>${scanDuration}ms</td></tr>
  <tr><td>Filter duration</td><td>${filterDuration}ms</td></tr>
  <tr><td>Delete duration</td><td>${deleteDuration}ms</td></tr>
  <tr><td>Total duration</td><td>${totalDuration}ms</td></tr>
</table>
${deletedKeysHtml}
${truthSourceKeysHtml}
${errorsHtml}
      `.trim();

      await emailHelper({
        template: 'alert',
        message: {
          to: config.securityEmail,
          subject: `Denylist Cleanup: ${deletedCount} keys deleted${
            truthSourceKeys.count > 0
              ? `, ${truthSourceKeys.count} truth sources preserved`
              : ''
          }${errorCount > 0 ? ` (${errorCount} errors)` : ''}`
        },
        locals: {
          message: summaryHtml
        }
      });
    }
  } catch (err) {
    await logger.error(err);

    // Send error email to security@forwardemail.net
    await emailHelper({
      template: 'alert',
      message: {
        to: config.securityEmail,
        subject: 'Denylist Cleanup Job Failed'
      },
      locals: {
        message: `<p>The denylist cleanup job encountered an error:</p><pre>${
          err.stack || err.message
        }</pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
