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
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const monitorServer = require('#helpers/monitor-server');

const entries = [...config.allowlist];

monitorServer();

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

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

    const keysToDelete = allKeys.filter((key) => keyMatchesEntries(key));

    const filterDuration = Date.now() - filterStartTime;
    logger.info(
      `Phase 2 complete: Found ${keysToDelete.length} keys to delete in ${filterDuration}ms`
    );

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

      // Process in chunks
      for (let i = 0; i < keysToDelete.length; i += options.deleteChunkSize) {
        const chunk = keysToDelete.slice(i, i + options.deleteChunkSize);

        await pMap(
          chunk,
          async (key) => {
            try {
              await client.del(key);
              deletedCount++;
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
      const summaryHtml = `
<h2>Denylist Cleanup Report</h2>
<table border="1" cellpadding="5" cellspacing="0">
  <tr><th>Metric</th><th>Value</th></tr>
  <tr><td>Total denylist keys scanned</td><td>${allKeys.length}</td></tr>
  <tr><td>Keys matching entries</td><td>${keysToDelete.length}</td></tr>
  <tr><td>Keys deleted</td><td>${deletedCount}</td></tr>
  <tr><td>Errors</td><td>${errorCount}</td></tr>
  <tr><td>Scan duration</td><td>${scanDuration}ms</td></tr>
  <tr><td>Filter duration</td><td>${filterDuration}ms</td></tr>
  <tr><td>Delete duration</td><td>${deleteDuration}ms</td></tr>
  <tr><td>Total duration</td><td>${totalDuration}ms</td></tr>
</table>
${
  errorCount > 0 && errors.length <= 10
    ? `<h3>Errors</h3><ul>${errors
        .map((e) => `<li>${e.key}: ${e.error}</li>`)
        .join('')}</ul>`
    : ''
}
${
  errorCount > 10
    ? `<p><em>Note: Only showing first 10 errors out of ${errorCount} total</em></p>`
    : ''
}
      `.trim();

      await emailHelper({
        template: 'alert',
        message: {
          to: config.supportEmail,
          subject: `Denylist Cleanup: ${deletedCount} keys deleted${
            errorCount > 0 ? ` (${errorCount} errors)` : ''
          }`
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
