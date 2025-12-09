/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const pEvent = require('p-event');
const pMap = require('p-map');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
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
  deleteConcurrency: 10 // Parallel delete operations
};

//
// Check if a key matches any of the entries
//
function keyMatchesEntries(key) {
  const keyLower = key.toLowerCase();
  for (const entry of entries) {
    const entryLower = entry.toLowerCase();
    // Match pattern: denylist:*{entry}*
    if (keyLower.includes(entryLower)) {
      return true;
    }
  }

  return false;
}

//
// Check if a key matches any truth source
// Truth sources are domains like gmail.com, outlook.com, etc.
// For email addresses, we do MX lookup and check the root domain of MX records
// Keys like denylist:spammer@gmail.com should be flagged but not deleted
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
              return true;
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
          return true;
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
        return true;
      }
    }
  }

  return false;
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
    // Phase 1: Scan all denylist keys
    //
    logger.info('Phase 1: Scanning all denylist keys');
    const scanStartTime = Date.now();

    const stream = client.scanStream({
      match: 'denylist:*',
      count: options.scanCount,
      type: 'string'
    });

    const allKeys = [];

    stream.on('data', (keys) => {
      if (!Array.isArray(keys) || keys.length === 0) return;
      allKeys.push(...keys);
      logger.debug(`Scanned ${allKeys.length} keys so far`);
    });

    stream.on('error', (err) => {
      logger.error('Scan stream error:', err);
    });

    await pEvent(stream, 'end');

    const scanDuration = Date.now() - scanStartTime;
    logger.info(
      `Phase 1 complete: Found ${allKeys.length} denylist keys in ${scanDuration}ms`
    );

    //
    // Phase 2: Filter keys that match entries
    //
    logger.info('Phase 2: Filtering keys that match entries');
    const filterStartTime = Date.now();

    const keysMatchingEntries = allKeys.filter((key) => keyMatchesEntries(key));

    // Separate keys that match truth sources (don't delete these)
    const truthSourceKeys = [];
    const keysToDelete = [];

    // Process keys with concurrency to speed up MX lookups
    await pMap(
      keysMatchingEntries,
      async (key) => {
        const matches = await keyMatchesTruthSource(key);
        if (matches) {
          truthSourceKeys.push(key);
        } else {
          keysToDelete.push(key);
        }
      },
      { concurrency: 10 }
    );

    const filterDuration = Date.now() - filterStartTime;
    logger.info(
      `Phase 2 complete: Found ${keysMatchingEntries.length} matching keys (${keysToDelete.length} to delete, ${truthSourceKeys.length} truth sources to preserve) in ${filterDuration}ms`
    );

    if (truthSourceKeys.length > 0) {
      logger.warn(
        `Found ${truthSourceKeys.length} keys matching truth sources - these will NOT be deleted`
      );
    }

    //
    // Phase 3: Delete keys in batches
    //
    if (keysToDelete.length === 0) {
      logger.info('No keys to delete');
    } else {
      logger.info(
        `Phase 3: Deleting ${keysToDelete.length} keys in batches of ${options.deleteChunkSize}`
      );
      const deleteStartTime = Date.now();

      let deletedCount = 0;
      let errorCount = 0;
      const errors = [];
      const deletedKeys = [];

      // Process in chunks
      for (let i = 0; i < keysToDelete.length; i += options.deleteChunkSize) {
        const chunk = keysToDelete.slice(i, i + options.deleteChunkSize);

        await pMap(
          chunk,
          async (key) => {
            try {
              await client.del(key);
              deletedCount++;
              deletedKeys.push(key);
            } catch (err) {
              errorCount++;
              errors.push({ key, error: err.message });
              logger.error(`Failed to delete key ${key}:`, err);
            }
          },
          { concurrency: options.deleteConcurrency }
        );

        // Log progress
        if (
          deletedCount % 100 === 0 ||
          i + chunk.length >= keysToDelete.length
        ) {
          logger.info(
            `Progress: ${deletedCount}/${keysToDelete.length} (${Math.round(
              (deletedCount / keysToDelete.length) * 100
            )}%)`
          );
        }

        // Add delay between chunks to prevent blocking Redis
        if (i + options.deleteChunkSize < keysToDelete.length) {
          await delay(options.deleteDelay);
        }
      }

      const deleteDuration = Date.now() - deleteStartTime;
      logger.info(
        `Phase 3 complete: Deleted ${deletedCount} keys in ${deleteDuration}ms`
      );

      if (errorCount > 0) {
        logger.warn(`Encountered ${errorCount} errors during deletion`);
      }

      //
      // Summary
      //
      const totalDuration = Date.now() - startTime;

      const summary = {
        totalKeys: allKeys.length,
        matchedKeys: keysToDelete.length,
        deletedKeys: deletedCount,
        errorCount,
        scanDuration: `${scanDuration}ms`,
        filterDuration: `${filterDuration}ms`,
        deleteDuration: `${deleteDuration}ms`,
        totalDuration: `${totalDuration}ms`
      };

      logger.info('Denylist cleanup summary:', summary);

      // Email report to security@forwardemail.net
      const deletedKeysHtml =
        deletedKeys.length > 0
          ? `
<h3>Deleted Keys (${deletedKeys.length})</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>#</th><th>Key</th></tr>
  ${deletedKeys
    .map((key, index) => `<tr><td>${index + 1}</td><td>${key}</td></tr>`)
    .join('\n  ')}
</table>
        `.trim()
          : '';

      const truthSourceKeysHtml =
        truthSourceKeys.length > 0
          ? `
<h3>⚠️ Truth Source Matches - NOT DELETED (${truthSourceKeys.length})</h3>
<p><strong>These keys match truth sources via MX lookup (e.g., gmail.com → google.com) and were preserved for manual review.</strong></p>
<p>Truth sources may contain legitimate spammers that should remain on the denylist.</p>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>#</th><th>Key</th></tr>
  ${truthSourceKeys
    .map((key, index) => `<tr><td>${index + 1}</td><td>${key}</td></tr>`)
    .join('\n  ')}
</table>
        `.trim()
          : '';

      const errorsHtml =
        errorCount > 0 && errors.length <= 100
          ? `
<h3>Errors (${errorCount})</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>#</th><th>Key</th><th>Error</th></tr>
  ${errors
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
  <tr><td>Total denylist keys scanned</td><td>${allKeys.length}</td></tr>
  <tr><td>Keys matching entries</td><td>${keysMatchingEntries.length}</td></tr>
  <tr><td>Keys deleted</td><td>${deletedCount}</td></tr>
  <tr><td>Truth source matches (preserved)</td><td>${truthSourceKeys.length}</td></tr>
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
          to: 'security@forwardemail.net',
          subject: `Denylist Cleanup: ${deletedCount} keys deleted${
            truthSourceKeys.length > 0
              ? `, ${truthSourceKeys.length} truth sources preserved`
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
        to: 'security@forwardemail.net',
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
