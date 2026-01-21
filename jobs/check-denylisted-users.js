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
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
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
    // Find all users that are not banned and have not passed KYC
    //
    const users = await Users.find({
      [config.userFields.isBanned]: false,
      has_passed_kyc: false
    })
      .select('_id email has_passed_kyc')
      .lean()
      .exec();

    logger.info(
      `Found ${users.length} non-banned users (without KYC) to check`
    );

    const bannedUsers = [];
    const skippedKycUsers = [];
    const errors = [];

    //
    // Check each user's email against denylist
    //
    await pMap(
      users,
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
      },
      { concurrency: 10 }
    );

    const totalDuration = Date.now() - startTime;

    const summary = {
      totalUsers: users.length,
      bannedUsers: bannedUsers.length,
      skippedKycUsers: skippedKycUsers.length,
      errors: errors.length,
      duration: `${totalDuration}ms`
    };

    logger.info('Denylisted users check summary:', summary);

    //
    // Send email report with complete summary
    //
    if (
      bannedUsers.length > 0 ||
      errors.length > 0 ||
      skippedKycUsers.length > 0
    ) {
      const bannedUsersHtml =
        bannedUsers.length > 0
          ? `
<h3 style="color: red;">🚫 Banned Users (${bannedUsers.length})</h3>
<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 8px; text-align: left;">#</th>
    <th style="padding: 8px; text-align: left;">User ID</th>
    <th style="padding: 8px; text-align: left;">Email</th>
    <th style="padding: 8px; text-align: left;">Reason</th>
  </tr>
  ${bannedUsers
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
</table>
        `.trim()
          : '<p><em>No users were banned.</em></p>';

      const skippedKycUsersHtml =
        skippedKycUsers.length > 0
          ? `
<h3 style="color: green;">✅ Skipped (KYC Verified) (${
              skippedKycUsers.length
            })</h3>
<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 8px; text-align: left;">#</th>
    <th style="padding: 8px; text-align: left;">User ID</th>
    <th style="padding: 8px; text-align: left;">Email</th>
    <th style="padding: 8px; text-align: left;">Reason</th>
  </tr>
  ${skippedKycUsers
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
</table>
        `.trim()
          : '<p><em>No KYC-verified users were skipped.</em></p>';

      const errorsHtml =
        errors.length > 0
          ? `
<h3 style="color: orange;">⚠️ Errors (${errors.length})</h3>
<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #f0f0f0;">
    <th style="padding: 8px; text-align: left;">#</th>
    <th style="padding: 8px; text-align: left;">User ID</th>
    <th style="padding: 8px; text-align: left;">Email</th>
    <th style="padding: 8px; text-align: left;">Error</th>
  </tr>
  ${errors
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
</table>
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
    <td style="padding: 10px;">${users.length}</td>
  </tr>
  <tr style="background: #fff5f5;">
    <td style="padding: 10px;"><strong>Users banned</strong></td>
    <td style="padding: 10px; color: red; font-weight: bold;">${bannedUsers.length}</td>
  </tr>
  <tr style="background: #f5fff5;">
    <td style="padding: 10px;"><strong>KYC-verified users skipped</strong></td>
    <td style="padding: 10px; color: green; font-weight: bold;">${skippedKycUsers.length}</td>
  </tr>
  <tr style="background: #fff8e1;">
    <td style="padding: 10px;"><strong>Errors</strong></td>
    <td style="padding: 10px; color: orange; font-weight: bold;">${errors.length}</td>
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
          subject: `Denylisted Users Check: ${bannedUsers.length} banned, ${
            skippedKycUsers.length
          } skipped (KYC)${
            errors.length > 0 ? `, ${errors.length} errors` : ''
          }`
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
