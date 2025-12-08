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

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');
const Aliases = require('#models/aliases');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { cleanupOrphanedBackups } = require('#helpers/remove-alias-backup');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

// Store boolean if the job is cancelled
let isCancelled = false;

// Handle cancellation (this is a very simple example)
if (parentPort) {
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') {
      isCancelled = true;
    }
  });
}

graceful.listen();

(async () => {
  await setupMongoose(logger);

  // Initialize variables for email reporting
  const results = [];
  let totalDeletedFiles = 0;
  let totalOrphanedFiles = 0;
  let totalBannedUserFiles = 0;
  let totalRemovedUserFiles = 0;
  let storageLocations = [];
  let jobError = null;
  let dryRun = false;

  try {
    if (isCancelled) {
      return;
    }

    // Check for dry run mode from environment variable
    dryRun = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';

    if (dryRun) {
      logger.info(
        'Running R2 cleanup in DRY RUN mode - no files will actually be deleted'
      );
    }

    // Get all distinct storage locations that actually have aliases
    storageLocations = await Aliases.distinct('storage_location');

    if (storageLocations.length === 0) {
      logger.info('No storage locations found with aliases');
      return;
    }

    for (const storageLocation of storageLocations) {
      if (isCancelled) {
        break;
      }

      try {
        logger.info(
          dryRun
            ? 'Analyzing orphaned R2 backups (dry run)'
            : 'Cleaning up orphaned R2 backups',
          {
            storageLocation,
            dryRun
          }
        );

        const result = await cleanupOrphanedBackups(storageLocation, {
          dryRun
        });

        results.push({
          storageLocation,
          ...result
        });

        totalDeletedFiles += result.deletedFiles.length;
        totalOrphanedFiles += result.orphanedFiles;
        totalBannedUserFiles += result.bannedUserFiles;
        totalRemovedUserFiles += result.removedUserFiles;

        logger.info(
          dryRun
            ? 'Completed R2 analysis for storage location (dry run)'
            : 'Completed R2 cleanup for storage location',
          {
            storageLocation,
            deletedFiles: result.deletedFiles.length,
            orphanedFiles: result.orphanedFiles,
            bannedUserFiles: result.bannedUserFiles,
            removedUserFiles: result.removedUserFiles,
            totalFiles: result.totalFiles,
            dryRun
          }
        );
      } catch (err) {
        logger.error('Error cleaning up R2 backups for storage location', {
          error: err,
          storageLocation,
          dryRun
        });
      }
    }

    logger.info(
      dryRun
        ? 'R2 backup analysis job completed (dry run)'
        : 'R2 backup cleanup job completed',
      {
        totalDeletedFiles,
        totalOrphanedFiles,
        totalBannedUserFiles,
        totalRemovedUserFiles,
        storageLocations: storageLocations.length,
        dryRun
      }
    );
  } catch (err) {
    jobError = err;
    logger.error('Error in R2 backup cleanup job', { error: err });
  } finally {
    // ALWAYS send email notification regardless of success or failure
    try {
      let subject;
      let message;

      if (jobError) {
        subject = dryRun
          ? 'R2 backup cleanup analysis FAILED (DRY RUN)'
          : 'R2 backup cleanup job FAILED';
        message = `<p><strong>ERROR:</strong> The R2 cleanup job encountered an error and may not have completed successfully.</p>
                   <p><strong>Error:</strong> ${jobError.message}</p>`;
      } else {
        subject = dryRun
          ? `R2 backup cleanup analysis (DRY RUN) - ${totalDeletedFiles} files would be removed`
          : `R2 backup cleanup completed - ${totalDeletedFiles} files removed`;
        message = dryRun
          ? '<p><strong>DRY RUN MODE:</strong> No files were actually deleted. This is a report of what would be cleaned up.</p>'
          : '<p>R2 backup cleanup has been completed successfully.</p>';
      }

      await emailHelper({
        template: 'alert',
        message: {
          to: config.supportEmail,
          subject
        },
        locals: {
          message: `${message}<ul><li><code class="small">${results
            .filter((r) => r.deletedFiles && r.deletedFiles.length > 0)
            .map((r) => {
              const action = dryRun ? 'would delete' : 'deleted';
              return `${r.storageLocation}: ${
                r.deletedFiles.length
              } files ${action} (${r.orphanedFiles || 0} orphaned, ${
                r.bannedUserFiles || 0
              } banned users, ${r.removedUserFiles || 0} removed users)`;
            })
            .join('</code></li><li><code class="small">')}</code></li></ul>

            <h3>Summary</h3>
            <ul>
              <li><strong>Total Files ${
                dryRun ? 'Would Be' : ''
              } Processed:</strong> ${totalDeletedFiles}</li>
              <li><strong>Orphaned Aliases:</strong> ${totalOrphanedFiles}</li>
              <li><strong>Banned User Aliases:</strong> ${totalBannedUserFiles}</li>
              <li><strong>Removed User Aliases:</strong> ${totalRemovedUserFiles}</li>
              <li><strong>Storage Locations:</strong> ${
                storageLocations.length
              }</li>
              <li><strong>Job Status:</strong> ${
                jobError ? 'FAILED' : 'SUCCESS'
              }</li>
            </ul>

            ${
              dryRun
                ? '<p><em>To perform actual cleanup, run the job without DRY_RUN environment variable.</em></p>'
                : ''
            }
            ${
              jobError
                ? '<p><strong>Please check the logs for detailed error information.</strong></p>'
                : ''
            }`
        }
      });
    } catch (err) {
      logger.error('CRITICAL: Failed to send R2 cleanup notification email', {
        emailError: err,
        originalError: jobError,
        dryRun
      });
    }
  }
})()
  .then(() => {
    if (parentPort) {
      parentPort.postMessage('done');
    } else {
      process.exit(0);
    }
  })
  .catch((err) => {
    logger.error(err);

    if (parentPort) {
      parentPort.postMessage('done');
    } else {
      process.exit(1);
    }
  });
