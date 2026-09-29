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

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const CappedList = require('#helpers/capped-list');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const forEachInBatches = require('#helpers/for-each-in-batches');
const isDenylisted = require('#helpers/is-denylisted');
const logger = require('#helpers/logger');
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

const Users = require('#models/users');

(async () => {
  await setupMongoose(logger);

  const startTime = Date.now();

  try {
    logger.info('Starting denylisted users check job');

    //
    // Rows kept for the report (every user is still counted). A run can
    // list every user (e.g. when Redis is down each check is an error), and
    // the report is one HTML table rendered in memory.
    //
    const MAX_REPORT_ROWS = 1000;
    const bannedUsers = new CappedList(MAX_REPORT_ROWS);
    const skippedKycUsers = new CappedList(MAX_REPORT_ROWS);
    const errors = new CappedList(MAX_REPORT_ROWS);

    //
    // Check the email of every user that is not banned and has not passed
    // KYC against the denylist, reading users from a cursor a batch at a
    // time (loading them all first held the whole users collection)
    //
    const totalUsers = await forEachInBatches(
      Users.find({
        [config.userFields.isBanned]: false,
        has_passed_kyc: false
      })
        .select('_id email has_passed_kyc')
        .lean()
        .cursor({ batchSize: 1000 })
        .addCursorFlag('noCursorTimeout', true),
      { batchSize: 1000, concurrency: 10 },
      async (user) => {
        try {
          // Double-check KYC status (safety check)
          if (user.has_passed_kyc) {
            skippedKycUsers.push({
              id: user._id.toString(),
              email: user.email,
              reason: 'Has passed KYC verification'
            });
            logger.debug(
              `Skipping user ${user._id} (${user.email}) - has passed KYC`
            );
            return;
          }

          // Check if email is denylisted
          await isDenylisted(user.email, client, resolver);
        } catch (err) {
          // If isDenylisted throws an error, the email is denylisted
          if (err.name === 'DenylistError') {
            logger.warn(
              `User ${user._id} (${user.email}) is denylisted: ${err.message}`
            );

            try {
              // Ban the user
              await Users.findByIdAndUpdate(user._id, {
                $set: {
                  [config.userFields.isBanned]: true
                }
              });

              bannedUsers.push({
                id: user._id.toString(),
                email: user.email,
                reason: err.message
              });

              logger.info(`Banned user ${user._id} (${user.email})`);
            } catch (updateErr) {
              logger.error(
                `Failed to ban user ${user._id} (${user.email}):`,
                updateErr
              );
              errors.push({
                id: user._id.toString(),
                email: user.email,
                error: updateErr.message
              });
            }
          } else {
            // Some other error occurred
            logger.error(
              `Error checking user ${user._id} (${user.email}):`,
              err
            );
            errors.push({
              id: user._id.toString(),
              email: user.email,
              error: err.message
            });
          }
        }
      }
    );

    logger.info(`Checked ${totalUsers} non-banned users (without KYC)`);

    const totalDuration = Date.now() - startTime;

    const summary = {
      totalUsers,
      bannedUsers: bannedUsers.count,
      skippedKycUsers: skippedKycUsers.count,
      errors: errors.count,
      duration: `${totalDuration}ms`
    };

    logger.info('Denylisted users check summary:', summary);

    //
    // Send email report with complete summary
    //
    if (
      bannedUsers.count > 0 ||
      errors.count > 0 ||
      skippedKycUsers.count > 0
    ) {
      const bannedUsersHtml =
        bannedUsers.count > 0
          ? `
<h3 style="color: red;">🚫 Banned Users (${bannedUsers.count})</h3>
<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 8px; text-align: left;">#</th>
    <th style="padding: 8px; text-align: left;">User ID</th>
    <th style="padding: 8px; text-align: left;">Email</th>
    <th style="padding: 8px; text-align: left;">Reason</th>
  </tr>
  ${bannedUsers.items
    .map(
      (u, index) =>
        `<tr style="${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
    <td style="padding: 8px;">${index + 1}</td>
    <td style="padding: 8px; font-family: monospace;">${u.id}</td>
    <td style="padding: 8px; font-family: monospace;">${u.email}</td>
    <td style="padding: 8px;">${u.reason}</td>
  </tr>`
    )
    .join('\n  ')}
</table>${
              bannedUsers.omitted > 0
                ? `\n<p><em>${bannedUsers.omitted} more not shown.</em></p>`
                : ''
            }
        `.trim()
          : '<p><em>No users were banned.</em></p>';

      const skippedKycUsersHtml =
        skippedKycUsers.count > 0
          ? `
<h3 style="color: green;">✅ Skipped (KYC Verified) (${
              skippedKycUsers.count
            })</h3>
<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 8px; text-align: left;">#</th>
    <th style="padding: 8px; text-align: left;">User ID</th>
    <th style="padding: 8px; text-align: left;">Email</th>
    <th style="padding: 8px; text-align: left;">Reason</th>
  </tr>
  ${skippedKycUsers.items
    .map(
      (u, index) =>
        `<tr style="${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
    <td style="padding: 8px;">${index + 1}</td>
    <td style="padding: 8px; font-family: monospace;">${u.id}</td>
    <td style="padding: 8px; font-family: monospace;">${u.email}</td>
    <td style="padding: 8px;">${u.reason}</td>
  </tr>`
    )
    .join('\n  ')}
</table>${
              skippedKycUsers.omitted > 0
                ? `\n<p><em>${skippedKycUsers.omitted} more not shown.</em></p>`
                : ''
            }
        `.trim()
          : '<p><em>No KYC-verified users were skipped.</em></p>';

      const errorsHtml =
        errors.count > 0
          ? `
<h3 style="color: orange;">⚠️ Errors (${errors.count})</h3>
<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 8px; text-align: left;">#</th>
    <th style="padding: 8px; text-align: left;">User ID</th>
    <th style="padding: 8px; text-align: left;">Email</th>
    <th style="padding: 8px; text-align: left;">Error</th>
  </tr>
  ${errors.items
    .map(
      (e, index) =>
        `<tr style="${index % 2 === 0 ? 'background: #f9f9f9;' : ''}">
    <td style="padding: 8px;">${index + 1}</td>
    <td style="padding: 8px; font-family: monospace;">${e.id}</td>
    <td style="padding: 8px; font-family: monospace;">${e.email}</td>
    <td style="padding: 8px;">${e.error}</td>
  </tr>`
    )
    .join('\n  ')}
</table>${
              errors.omitted > 0
                ? `\n<p><em>${errors.omitted} more not shown.</em></p>`
                : ''
            }
        `.trim()
          : '<p><em>No errors occurred.</em></p>';

      const summaryHtml = `
<h2>🔍 Denylisted Users Check - Complete Report</h2>

<h3>📊 Summary</h3>
<table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 10px; text-align: left;">Metric</th>
    <th style="padding: 10px; text-align: left;">Value</th>
  </tr>
  <tr>
    <td style="padding: 10px;"><strong>Total users checked</strong></td>
    <td style="padding: 10px;">${totalUsers}</td>
  </tr>
  <tr style="background: #fff5f5;">
    <td style="padding: 10px;"><strong>Users banned</strong></td>
    <td style="padding: 10px; color: red; font-weight: bold;">${bannedUsers.count}</td>
  </tr>
  <tr style="background: #f5fff5;">
    <td style="padding: 10px;"><strong>KYC-verified users skipped</strong></td>
    <td style="padding: 10px; color: green; font-weight: bold;">${skippedKycUsers.count}</td>
  </tr>
  <tr style="background: #fff8e1;">
    <td style="padding: 10px;"><strong>Errors</strong></td>
    <td style="padding: 10px; color: orange; font-weight: bold;">${errors.count}</td>
  </tr>
  <tr>
    <td style="padding: 10px;"><strong>Duration</strong></td>
    <td style="padding: 10px;">${totalDuration}ms</td>
  </tr>
</table>

<hr style="margin: 30px 0; border: none; border-top: 2px solid #ddd;">

${bannedUsersHtml}

<hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

${skippedKycUsersHtml}

<hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

${errorsHtml}

<hr style="margin: 30px 0; border: none; border-top: 2px solid #ddd;">

<p style="color: #666; font-size: 12px; margin-top: 20px;"><em>This is an automated report from the denylisted users check job. Users with verified KYC status are automatically skipped to prevent false positives.</em></p>
      `.trim();

      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Denylisted Users Check: ${bannedUsers.count} banned, ${
            skippedKycUsers.count
          } skipped (KYC)${errors.count > 0 ? `, ${errors.count} errors` : ''}`
        },
        locals: {
          message: summaryHtml
        }
      });
    }
  } catch (err) {
    await logger.error(err);

    // Send error email
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Denylisted Users Check Job Failed'
      },
      locals: {
        message: `<p>The denylisted users check job encountered an error:</p><pre>${
          err.stack || err.message
        }</pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
