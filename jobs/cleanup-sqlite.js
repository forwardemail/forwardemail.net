/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const _ = require('#helpers/lodash');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const isMongoError = require('#helpers/is-mongo-error');
const isRedisError = require('#helpers/is-redis-error');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const updateStorageUsed = require('#helpers/update-storage-used');
const removeAliasBackup = require('#helpers/remove-alias-backup');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const tmpdir = os.tmpdir();

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
    if (message === 'cancel') {
      isCancelled = true;
    }
  });
}

graceful.listen();

const mountDir = config.env === 'production' ? '/mnt' : tmpdir;

(async () => {
  await setupMongoose(logger);

  // Determine if this is a dry run
  const dryRun = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';

  // Configuration for parallel processing
  const BATCH_SIZE =
    Number.parseInt(process.env.CLEANUP_BATCH_SIZE, 10) || 1000;
  const CONCURRENCY =
    Number.parseInt(process.env.CLEANUP_CONCURRENCY, 10) || 10;

  // Tracking variables
  let processedAliases = 0;
  let deletedOrphanedAliases = 0;
  let deletedNonImapAliases = 0;
  let sentUserNotifications = 0;
  let databaseErrors = 0;
  let fileSystemErrors = 0;
  const deletedLocalFiles = [];
  const deletedR2Files = [];
  const orphanedAliases = [];
  const nonImapAliases = [];
  const thresholdNotifications = [];

  try {
    if (isCancelled) {
      return;
    }

    logger.info(`Starting SQLite cleanup ${dryRun ? '(DRY RUN)' : ''}`, {
      dryRun,
      batchSize: BATCH_SIZE,
      concurrency: CONCURRENCY
    });

    // Read all directories in mountDir
    const dirents = await fs.promises.readdir(mountDir, {
      withFileTypes: true
    });

    const ids = new Set();
    const sqliteFiles = [];

    // Iterate through each directory
    for (const dirent of dirents) {
      if (!dirent.isDirectory()) {
        continue;
      }

      const files = await fs.promises.readdir(
        path.join(mountDir, dirent.name),
        {
          withFileTypes: true
        }
      );

      for (const file of files) {
        if (!file.isFile()) {
          continue;
        }

        // Check for all SQLite file types
        const isSqliteFile =
          file.name.endsWith('.sqlite') ||
          file.name.endsWith('.sqlite.gz') ||
          file.name.endsWith('.sqlite-shm') ||
          file.name.endsWith('.sqlite-wal') ||
          file.name.includes('-tmp.sqlite') ||
          file.name.includes('-tmp.sqlite-shm') ||
          file.name.includes('-tmp.sqlite-wal');

        if (!isSqliteFile) {
          continue;
        }

        const filePath = path.join(mountDir, dirent.name, file.name);
        sqliteFiles.push({
          name: file.name,
          path: filePath,
          directory: dirent.name
        });

        // Extract alias ID from filename
        const match = file.name.match(/^([a-f\d]{24})(?:-tmp)?\.sqlite/);
        if (match) {
          ids.add(match[1]);
        }
      }
    }

    logger.info('Found SQLite files for processing', {
      totalFiles: sqliteFiles.length,
      uniqueAliasIds: ids.size,
      dryRun
    });

    // Convert Set to Array for batch processing
    const aliasIds = [...ids];

    // Process aliases in batches
    const batches = [];
    for (let i = 0; i < aliasIds.length; i += BATCH_SIZE) {
      batches.push(aliasIds.slice(i, i + BATCH_SIZE));
    }

    logger.info('Processing aliases in batches', {
      totalBatches: batches.length,
      batchSize: BATCH_SIZE,
      concurrency: CONCURRENCY,
      dryRun
    });

    // Process each batch in parallel
    await pMap(
      batches,
      async (batch, batchIndex) => {
        if (isCancelled) {
          return;
        }

        logger.info(`Processing batch ${batchIndex + 1}/${batches.length}`, {
          batchSize: batch.length,
          dryRun
        });

        let batchProcessedAliases = 0;
        let batchDeletedOrphanedAliases = 0;
        let batchDeletedNonImapAliases = 0;
        const batchSentUserNotifications = 0;
        const batchOrphanedAliases = [];
        const batchNonImapAliases = [];

        // Process each alias in the batch
        await pMap(
          batch,
          async (id) => {
            if (isCancelled) {
              return;
            }

            try {
              // Validate ObjectId format
              if (!mongoose.isObjectIdOrHexString(id)) {
                return;
              }

              // Check if alias still exists - if NOT, this is what we want to clean up
              const alias = await Aliases.findOne({ id });

              if (!alias) {
                // ALIAS DOESN'T EXIST - This is what we want to delete!
                logger.warn(
                  `Found SQLite files for non-existent alias ${
                    dryRun ? '- would be deleted (dry run)' : '- deleting files'
                  }`,
                  {
                    aliasId: id,
                    dryRun
                  }
                );

                // Track orphaned files for email notification
                batchOrphanedAliases.push({
                  aliasId: id,
                  domainId: 'unknown',
                  aliasName: 'unknown',
                  reason: 'alias_not_found'
                });

                // Find all files that would be/are deleted
                const filesToDelete = sqliteFiles.filter((file) => {
                  const match = file.name.match(
                    /^([a-f\d]{24})(?:-tmp)?\.sqlite/
                  );
                  return match && match[1] === id;
                });

                // Track files for reporting (in both dry run and normal mode)
                for (const file of filesToDelete) {
                  deletedLocalFiles.push(file.name);
                }

                if (dryRun) {
                  logger.info(
                    'Would delete files for non-existent alias (dry run)',
                    {
                      aliasId: id,
                      filesToDelete: filesToDelete.length
                    }
                  );
                } else {
                  // Actually delete the files (ONLY in normal mode)
                  for (const file of filesToDelete) {
                    try {
                      await fs.promises.rm(file.path, { force: true });
                      logger.info(
                        'Deleted local SQLite file for non-existent alias',
                        {
                          aliasId: id,
                          file: file.name
                        }
                      );
                    } catch (err) {
                      fileSystemErrors++;
                      logger.error('Failed to delete local SQLite file', {
                        aliasId: id,
                        file: file.name,
                        fileError: err
                      });
                    }
                  }

                  batchDeletedOrphanedAliases++;
                  logger.info(
                    'Successfully deleted files for non-existent alias',
                    {
                      aliasId: id,
                      deletedFiles: filesToDelete.length
                    }
                  );
                }

                return; // Done processing this non-existent alias
              }

              // ALIAS EXISTS - Check if domain exists
              batchProcessedAliases++;

              const domain = await Domains.findOne({ _id: alias.domain });
              if (!domain) {
                // DOMAIN DOESN'T EXIST - This is also what we want to clean up!
                logger.warn(
                  `Found alias with missing domain ${
                    dryRun
                      ? '- would be deleted (dry run)'
                      : '- deleting orphaned alias'
                  }`,
                  {
                    aliasId: id,
                    domainId: alias.domain,
                    aliasName: alias.name,
                    dryRun
                  }
                );

                // Track orphaned aliases for email notification
                batchOrphanedAliases.push({
                  aliasId: id,
                  domainId: alias.domain,
                  aliasName: alias.name,
                  reason: 'domain_not_found'
                });

                // Find all files that would be/are deleted
                const filesToDelete = sqliteFiles.filter((file) => {
                  const match = file.name.match(
                    /^([a-f\d]{24})(?:-tmp)?\.sqlite/
                  );
                  return match && match[1] === id;
                });

                // Track files for reporting (in both dry run and normal mode)
                for (const file of filesToDelete) {
                  deletedLocalFiles.push(file.name);
                }

                // Handle R2 backup files (in both dry run and normal mode)
                try {
                  const r2Result = await removeAliasBackup(alias, {
                    dryRun // Use the same dryRun flag - helper handles both modes
                  });
                  if (r2Result && Array.isArray(r2Result)) {
                    deletedR2Files.push(...r2Result);
                  }
                } catch (err) {
                  logger.error(
                    dryRun
                      ? 'Failed to check R2 backup files'
                      : 'Failed to delete R2 backup files',
                    {
                      aliasId: id,
                      r2Error: err
                    }
                  );
                }

                if (dryRun) {
                  logger.info(
                    'Would delete orphaned alias and files (dry run)',
                    {
                      aliasId: id,
                      localFiles: filesToDelete.length
                    }
                  );
                } else {
                  // Delete the orphaned alias from the database (ONLY in normal mode)
                  try {
                    await Aliases.findByIdAndRemove(id);
                    batchDeletedOrphanedAliases++;

                    // Actually delete local files (ONLY in normal mode)
                    for (const file of filesToDelete) {
                      try {
                        await fs.promises.rm(file.path, { force: true });
                        logger.info(
                          'Deleted local SQLite file for orphaned alias',
                          {
                            aliasId: id,
                            file: file.name
                          }
                        );
                      } catch (err) {
                        fileSystemErrors++;
                        logger.error('Failed to delete local SQLite file', {
                          aliasId: id,
                          file: file.name,
                          fileError: err
                        });
                      }
                    }

                    logger.info(
                      'Successfully deleted orphaned alias and all files',
                      {
                        aliasId: id,
                        deletedLocalFiles: filesToDelete.length
                      }
                    );
                  } catch (err) {
                    databaseErrors++;
                    logger.error('Failed to delete orphaned alias', {
                      aliasId: id,
                      dbError: err
                    });

                    // Check if this is a database connectivity error
                    if (isMongoError(err) || isRedisError(err)) {
                      throw err; // Abort cleanup on database errors
                    }
                  }
                }

                return; // Done processing this orphaned alias
              }

              // ALIAS AND DOMAIN EXIST - Check if alias has IMAP enabled
              // If alias does NOT have IMAP enabled, we should clean up its storage
              if (!alias.has_imap) {
                logger.warn(
                  `Found alias without IMAP enabled ${
                    dryRun
                      ? '- would delete storage (dry run)'
                      : '- deleting storage'
                  }`,
                  {
                    aliasId: id,
                    domainId: domain._id,
                    aliasName: alias.name,
                    hasImap: alias.has_imap,
                    dryRun
                  }
                );

                // Track non-IMAP aliases for email notification
                batchNonImapAliases.push({
                  aliasId: id,
                  domainId: domain._id,
                  aliasName: alias.name,
                  reason: 'imap_not_enabled'
                });

                // Find all files that would be/are deleted
                const filesToDelete = sqliteFiles.filter((file) => {
                  const match = file.name.match(
                    /^([a-f\d]{24})(?:-tmp)?\.sqlite/
                  );
                  return match && match[1] === id;
                });

                // Track files for reporting (in both dry run and normal mode)
                for (const file of filesToDelete) {
                  deletedLocalFiles.push(file.name);
                }

                // Handle R2 backup files (in both dry run and normal mode)
                try {
                  const r2Result = await removeAliasBackup(alias, {
                    dryRun // Use the same dryRun flag - helper handles both modes
                  });
                  if (r2Result && Array.isArray(r2Result)) {
                    deletedR2Files.push(...r2Result);
                  }
                } catch (err) {
                  logger.error(
                    dryRun
                      ? 'Failed to check R2 backup files for non-IMAP alias'
                      : 'Failed to delete R2 backup files for non-IMAP alias',
                    {
                      aliasId: id,
                      r2Error: err
                    }
                  );
                }

                if (dryRun) {
                  logger.info(
                    'Would delete storage for non-IMAP alias (dry run)',
                    {
                      aliasId: id,
                      localFiles: filesToDelete.length
                    }
                  );
                } else {
                  // Actually delete local files (ONLY in normal mode)
                  for (const file of filesToDelete) {
                    try {
                      await fs.promises.rm(file.path, { force: true });
                      logger.info(
                        'Deleted local SQLite file for non-IMAP alias',
                        {
                          aliasId: id,
                          file: file.name
                        }
                      );
                    } catch (err) {
                      fileSystemErrors++;
                      logger.error('Failed to delete local SQLite file', {
                        aliasId: id,
                        file: file.name,
                        fileError: err
                      });
                    }
                  }

                  batchDeletedNonImapAliases++;
                  logger.info(
                    'Successfully deleted storage for non-IMAP alias',
                    {
                      aliasId: id,
                      deletedFiles: filesToDelete.length
                    }
                  );
                }

                return; // Done processing this non-IMAP alias
              }

              // ALIAS AND DOMAIN EXIST AND IMAP IS ENABLED - This is valid, skip cleanup
              logger.debug(
                'Alias and domain are valid with IMAP enabled, skipping cleanup',
                {
                  aliasId: id,
                  domainId: domain._id,
                  aliasName: alias.name,
                  hasImap: alias.has_imap
                }
              );
            } catch (err) {
              databaseErrors++;
              logger.error('Error processing alias', {
                aliasId: id,
                error: err
              });

              // Check if this is a database connectivity error
              if (isMongoError(err) || isRedisError(err)) {
                throw err; // Abort cleanup on database errors
              }
            }
          },
          { concurrency: CONCURRENCY }
        );

        // Update totals from batch
        processedAliases += batchProcessedAliases;
        deletedOrphanedAliases += batchDeletedOrphanedAliases;
        deletedNonImapAliases += batchDeletedNonImapAliases;
        sentUserNotifications += batchSentUserNotifications;
        orphanedAliases.push(...batchOrphanedAliases);
        nonImapAliases.push(...batchNonImapAliases);

        logger.info(`Completed batch ${batchIndex + 1}/${batches.length}`, {
          batchProcessedAliases,
          batchDeletedOrphanedAliases,
          batchDeletedNonImapAliases,
          batchSentUserNotifications,
          dryRun
        });
      },
      { concurrency: 1 } // Process batches sequentially to avoid overwhelming the database
    );

    // ========================================
    // THRESHOLD NOTIFICATIONS (ONLY IN NORMAL MODE, AT THE VERY END)
    // ========================================
    if (dryRun) {
      logger.info(
        'Skipping threshold notifications in dry run mode (no user emails sent)'
      );
    } else {
      logger.info('Starting threshold notifications for all aliases');

      // Process threshold notifications for all aliases
      await pMap(
        aliasIds,
        async (id) => {
          if (isCancelled) {
            return;
          }

          try {
            // Validate ObjectId format
            if (!mongoose.isObjectIdOrHexString(id)) {
              return;
            }

            // Update storage for this alias
            try {
              await updateStorageUsed(id, client);
            } catch (err) {
              logger.fatal(err, { id });
              return;
            }

            // Get the updated alias
            const alias = await Aliases.findOne({ id });

            if (!alias) {
              logger.debug('alias no longer exists', { id });
              return;
            }

            // If the alias did not have imap or it was not enabled
            // then we can return early since the check is not useful
            if (!alias.has_imap || !alias.is_enabled) {
              return;
            }

            const [storageUsed, maxQuotaPerAlias] = await Promise.all([
              Aliases.getStorageUsed(alias),
              Domains.getMaxQuota(alias.domain, alias)
            ]);

            const percentageUsed = Math.round(
              (storageUsed / maxQuotaPerAlias) * 100
            );

            // Find closest threshold
            let threshold;
            for (const percentage of [50, 60, 70, 80, 90, 100]) {
              if (percentageUsed >= percentage) {
                threshold = percentage;
              }
            }

            // Return early if no threshold found
            if (!threshold) {
              return;
            }

            // If user already received threshold notification
            // and the notification was sent within the past 7 days
            // then we can return early
            if (
              _.isPlainObject(alias.storage_thresholds_sent_at) &&
              alias.storage_thresholds_sent_at[threshold.toString()] &&
              _.isDate(
                alias.storage_thresholds_sent_at[threshold.toString()]
              ) &&
              new Date(
                alias.storage_thresholds_sent_at[threshold.toString()]
              ).getTime() >= dayjs().subtract(1, 'week').toDate().getTime()
            ) {
              return;
            }

            if (!_.isPlainObject(alias.storage_thresholds_sent_at)) {
              alias.storage_thresholds_sent_at = {};
            }

            const domain = await Domains.findById(alias.domain);

            if (!domain) {
              return;
            }

            // Get recipients and the majority favored locale
            const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
              domain
            );

            //
            // Don't send a notification to the alias if the `alias.user` has
            // already received this threshold notification in past 7d
            //
            let cache = await client.get(
              `threshold:${alias.user.toString()}:${threshold.toString()}`
            );
            if (cache) {
              return;
            }

            //
            // Don't send a notification to admins if they've already received
            // this threshold notification in past 7d
            //
            cache = await client.get(
              `threshold:${revHash(safeStringify(to))}:${threshold.toString()}`
            );
            if (cache) {
              return;
            }

            // Send the email to the user with threshold notification
            const subject =
              config.views.locals.emoji('warning') +
              ' ' +
              i18n.translate(
                'STORAGE_THRESHOLD_SUBJECT',
                locale,
                percentageUsed,
                `${alias.name}@${domain.name}`
              );

            const message = i18n.translate(
              'STORAGE_THRESHOLD_MESSAGE',
              locale,
              percentageUsed,
              bytes(storageUsed),
              bytes(maxQuotaPerAlias),
              `${alias.name}@${domain.name}`,
              `${config.urls.web}/${locale}/my-account/billing`
            );

            // Mark when the email was successfully sent/queued
            alias.storage_thresholds_sent_at[threshold.toString()] = new Date();
            alias.markModified('storage_thresholds_sent_at');

            await alias.save();

            // Set threshold object for all aliases that belong to this domain with same user
            await Aliases.updateMany(
              {
                user: alias.user,
                domain: alias.domain
              },
              {
                $set: {
                  storage_thresholds_sent_at: alias.storage_thresholds_sent_at
                }
              }
            );

            await client.set(
              `threshold:${alias.user.toString()}:${threshold.toString()}`,
              true,
              'PX',
              ms('7d')
            );
            await client.set(
              `threshold:${revHash(safeStringify(to))}:${threshold.toString()}`,
              true,
              'PX',
              ms('7d')
            );

            await emailHelper({
              template: 'alert',
              message: {
                to,
                subject
              },
              locals: {
                message
              }
            });

            sentUserNotifications++;

            // Track threshold notification for reporting
            thresholdNotifications.push({
              aliasId: id,
              aliasName: `${alias.name}@${domain.name}`,
              threshold,
              percentageUsed,
              storageUsed: bytes(storageUsed),
              maxQuota: bytes(maxQuotaPerAlias),
              recipients: Array.isArray(to) ? to.join(', ') : to
            });

            logger.info('Sent threshold notification', {
              aliasId: id,
              aliasName: `${alias.name}@${domain.name}`,
              threshold,
              percentageUsed,
              to
            });
          } catch (err) {
            logger.error('Error processing threshold notification', {
              aliasId: id,
              error: err
            });
          }
        },
        { concurrency: CONCURRENCY }
      );

      logger.info('Completed threshold notifications', {
        totalNotifications: thresholdNotifications.length
      });
    }

    // Send orphaned aliases notification if any were found
    if (orphanedAliases.length > 0) {
      try {
        const actionText = dryRun
          ? 'would be automatically deleted from the database (dry run)'
          : 'have been automatically deleted from the database';

        await emailHelper({
          template: 'alert',
          message: {
            to: config.supportEmail,
            subject: `Found ${orphanedAliases.length} orphaned aliases ${
              dryRun ? '(DRY RUN)' : '- automatically cleaned up'
            }`
          },
          locals: {
            message: `<p><strong>${
              dryRun ? 'DRY RUN - ' : ''
            }ORPHANED ALIASES ${
              dryRun ? 'ANALYSIS' : 'CLEANUP'
            }:</strong> Found aliases that reference domains that no longer exist.</p>
                    <p>These aliases ${actionText}:</p>
                    <ul><li><code class="small">${orphanedAliases
                      .map(
                        (a) =>
                          `Alias ID: ${a.aliasId}, Name: ${a.aliasName}, Missing Domain ID: ${a.domainId}, Reason: ${a.reason}`
                      )
                      .join(
                        '</code></li><li><code class="small">'
                      )}</code></li></ul>
                    <p><strong>Total orphaned aliases:</strong> ${
                      orphanedAliases.length
                    }</p>
                    <p>${
                      dryRun
                        ? 'In normal mode, these aliases would be automatically deleted from the database to maintain data integrity.'
                        : 'These aliases have been automatically removed from the database to maintain data integrity.'
                    }</p>`
          }
        });

        logger.info('Sent orphaned aliases notification email', {
          orphanedCount: orphanedAliases.length,
          dryRun
        });
      } catch (err) {
        logger.error('Failed to send orphaned aliases notification email', {
          orphanedCount: orphanedAliases.length,
          emailError: err,
          dryRun
        });
      }
    }

    // Send non-IMAP aliases notification if any were found
    if (nonImapAliases.length > 0) {
      try {
        const actionText = dryRun
          ? 'would have their storage deleted (dry run)'
          : 'have had their storage deleted';

        await emailHelper({
          template: 'alert',
          message: {
            to: config.supportEmail,
            subject: `Found ${
              nonImapAliases.length
            } aliases without IMAP enabled ${
              dryRun ? '(DRY RUN)' : '- storage cleaned up'
            }`
          },
          locals: {
            message: `<p><strong>${
              dryRun ? 'DRY RUN - ' : ''
            }NON-IMAP ALIASES ${
              dryRun ? 'ANALYSIS' : 'CLEANUP'
            }:</strong> Found aliases that do not have IMAP enabled and should not have storage.</p>
                    <p>These aliases ${actionText}:</p>
                    <ul><li><code class="small">${nonImapAliases
                      .map(
                        (a) =>
                          `Alias ID: ${a.aliasId}, Name: ${a.aliasName}, Domain ID: ${a.domainId}, Reason: ${a.reason}`
                      )
                      .join(
                        '</code></li><li><code class="small">'
                      )}</code></li></ul>
                    <p><strong>Total non-IMAP aliases:</strong> ${
                      nonImapAliases.length
                    }</p>
                    <p>${
                      dryRun
                        ? 'In normal mode, storage for these aliases would be automatically deleted to free up space.'
                        : 'Storage for these aliases has been automatically removed to free up space.'
                    }</p>`
          }
        });

        logger.info('Sent non-IMAP aliases notification email', {
          nonImapCount: nonImapAliases.length,
          dryRun
        });
      } catch (err) {
        logger.error('Failed to send non-IMAP aliases notification email', {
          nonImapCount: nonImapAliases.length,
          emailError: err,
          dryRun
        });
      }
    }

    // Send comprehensive completion email to support
    try {
      const completionSubject = dryRun
        ? `SQLite cleanup analysis (DRY RUN) - ${processedAliases} aliases analyzed`
        : `SQLite cleanup completed - ${processedAliases} aliases processed`;

      const thresholdNotificationDetails =
        thresholdNotifications.length > 0
          ? `<p><strong>Threshold Notifications Sent:</strong></p>
           <ul>${thresholdNotifications
             .map(
               (n) =>
                 `<li><code class="small">Alias: ${n.aliasName}, Threshold: ${n.threshold}%, Usage: ${n.percentageUsed}% (${n.storageUsed} / ${n.maxQuota}), Recipients: ${n.recipients}</code></li>`
             )
             .join('')}</ul>`
          : '';

      const completionMessage = dryRun
        ? `<p><strong>DRY RUN MODE:</strong> SQLite cleanup analysis has been completed.</p>
         <p><strong>Analysis Results:</strong></p>
         <ul>
           <li>Total aliases analyzed: ${processedAliases}</li>
           <li>Orphaned aliases found: ${orphanedAliases.length}</li>
           <li>Non-IMAP aliases found: ${nonImapAliases.length}</li>
           <li>Local SQLite files that would be deleted: ${deletedLocalFiles.length}</li>
           <li>R2 backup files that would be deleted: ${deletedR2Files.length}</li>
           <li>User notifications that would be sent: Skipped (dry run mode)</li>
           <li>Threshold notifications that would be sent: Skipped (dry run mode)</li>
           <li>Database errors encountered: ${databaseErrors}</li>
           <li>File system errors encountered: ${fileSystemErrors}</li>
         </ul>
         <p><strong>No actual changes were made.</strong> Run without DRY_RUN to execute cleanup.</p>`
        : `<p><strong>SQLite cleanup has been completed successfully.</strong></p>
         <p><strong>Cleanup Results:</strong></p>
         <ul>
           <li>Total aliases processed: ${processedAliases}</li>
           <li>Orphaned aliases deleted: ${deletedOrphanedAliases}</li>
           <li>Non-IMAP aliases storage deleted: ${deletedNonImapAliases}</li>
           <li>Local SQLite files deleted: ${deletedLocalFiles.length}</li>
           <li>R2 backup files deleted: ${deletedR2Files.length}</li>
           <li>User notifications sent: ${sentUserNotifications}</li>
           <li>Threshold notifications sent: ${
             thresholdNotifications.length
           }</li>
           <li>Database errors encountered: ${databaseErrors}</li>
           <li>File system errors encountered: ${fileSystemErrors}</li>
         </ul>
         ${
           deletedLocalFiles.length > 0
             ? `<p><strong>Deleted Local Files:</strong></p><ul><li><code class="small">${deletedLocalFiles.join(
                 '</code></li><li><code class="small">'
               )}</code></li></ul>`
             : ''
         }
         ${
           deletedR2Files.length > 0
             ? `<p><strong>Deleted R2 Files:</strong></p><ul><li><code class="small">${deletedR2Files.join(
                 '</code></li><li><code class="small">'
               )}</code></li></ul>`
             : ''
         }
         ${thresholdNotificationDetails}
         <p><strong>Data integrity maintained:</strong> All orphaned aliases and their associated files have been cleaned up, and storage for non-IMAP aliases has been purged.</p>`;

      await emailHelper({
        template: 'alert',
        message: {
          to: config.supportEmail,
          subject: completionSubject
        },
        locals: {
          message: completionMessage
        }
      });

      logger.info('Sent cleanup completion email', {
        processedAliases,
        orphanedAliases: orphanedAliases.length,
        nonImapAliases: nonImapAliases.length,
        deletedOrphanedAliases,
        deletedNonImapAliases,
        deletedLocalFiles: deletedLocalFiles.length,
        deletedR2Files: deletedR2Files.length,
        sentUserNotifications,
        thresholdNotifications: thresholdNotifications.length,
        databaseErrors,
        fileSystemErrors,
        dryRun
      });
    } catch (err) {
      logger.error('Failed to send cleanup completion email', {
        emailError: err,
        dryRun
      });
    }
  } catch (err) {
    logger.error('SQLite cleanup job failed', { error: err, dryRun });

    // Send error notification email
    try {
      await emailHelper({
        template: 'alert',
        message: {
          to: config.supportEmail,
          subject: `SQLite cleanup job FAILED ${dryRun ? '(DRY RUN)' : ''}`
        },
        locals: {
          message: `<p><strong>ERROR:</strong> The SQLite cleanup job encountered an error and failed to complete.</p>
          <p><strong>Error Details:</strong></p>
          <pre><code>${err.message}</code></pre>
          <p><strong>Partial Results:</strong></p>
          <ul>
            <li>Aliases processed before failure: ${processedAliases}</li>
            <li>Orphaned aliases deleted: ${deletedOrphanedAliases}</li>
            <li>Non-IMAP aliases storage deleted: ${deletedNonImapAliases}</li>
            <li>Local files deleted: ${deletedLocalFiles.length}</li>
            <li>R2 files deleted: ${deletedR2Files.length}</li>
            <li>Threshold notifications sent: ${thresholdNotifications.length}</li>
            <li>Database errors: ${databaseErrors}</li>
            <li>File system errors: ${fileSystemErrors}</li>
          </ul>
          <p>Please investigate and retry the cleanup job.</p>`
        }
      });
    } catch (err_) {
      logger.error('Failed to send error notification email', {
        emailError: err_
      });
    }

    throw err;
  }

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
