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
const dayjs = require('dayjs-with-plugins');
const { distance } = require('fastest-levenshtein');
const mongoose = require('mongoose');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

const MAX_DISTANCE = 3;

async function getBannedEmails() {
  try {
    const bannedEmails = await Users.distinct('email', {
      [config.userFields.isBanned]: true,
      email: {
        $exists: true,
        $ne: null,
        $not: { $regex: `@${config.removedEmailDomain}$`, $options: 'i' }
      }
    });

    return bannedEmails.filter(
      (email) => email && typeof email === 'string' && email.includes('@')
    );
  } catch (err) {
    logger.error('Error fetching banned emails', err);
    return [];
  }
}

function isEmailSuspicious(email, bannedEmails) {
  if (!email || typeof email !== 'string') return null;

  const emailLower = email.toLowerCase().trim();

  if (bannedEmails.includes(emailLower)) {
    return {
      type: 'exact',
      bannedEmail: emailLower,
      reason: 'Exact match to banned email'
    };
  }

  for (const bannedEmail of bannedEmails) {
    const dist = distance(emailLower, bannedEmail.toLowerCase());
    if (dist <= MAX_DISTANCE && dist > 0) {
      return {
        type: 'similar',
        bannedEmail,
        distance: dist,
        reason: `Similar to banned email: ${bannedEmail} (distance: ${dist})`
      };
    }
  }

  return null;
}

async function sendAggregatedAlert(suspiciousUsers) {
  if (suspiciousUsers.length === 0) return;

  try {
    const subject = `${suspiciousUsers.length} Suspicious Email Registration(s) Detected`;

    const usersList = suspiciousUsers
      .map(
        ({ user, suspicionResult }) => `
        <li>
          <strong><a href="${
            config.urls.web
          }/admin/users?q=${encodeURIComponent(
          user.email
        )}" target="_blank" rel="noopener noreferrer">${
          user.email
        }</a></strong> (${user._id})
          <ul>
            <li>Registration: ${dayjs(user.created_at).format(
              'YYYY-MM-DD HH:mm:ss UTC'
            )}</li>
            <li>Type: ${suspicionResult.type}</li>
            <li>Reason: ${suspicionResult.reason}</li>
            ${
              suspicionResult.bannedEmail
                ? `<li>Similar to: <code>${suspicionResult.bannedEmail}</code></li>`
                : ''
            }
            ${
              suspicionResult.distance
                ? `<li>Distance: ${suspicionResult.distance}</li>`
                : ''
            }
          </ul>
        </li>
      `
      )
      .join('');

    const message = `
      <p><strong>Found ${suspiciousUsers.length} suspicious email registration(s) among paid users:</strong></p>
      <ul>${usersList}</ul>
      <p><strong>Recommended Actions:</strong></p>
      <ul>
        <li>Review user account activity</li>
        <li>Monitor for suspicious behavior</li>
        <li>Consider additional verification if needed</li>
      </ul>
    `;

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject
      },
      locals: { message }
    });

    logger.warn('Aggregated admin alert sent for suspicious emails', {
      count: suspiciousUsers.length,
      emails: suspiciousUsers.map(({ user }) => user.email)
    });
  } catch (err) {
    logger.error('Failed to send aggregated admin alert', err);
  }
}

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const paidUsers = await Users.find({
      plan: { $ne: 'free' },
      [config.userFields.isBanned]: false,
      email: {
        $exists: true,
        $ne: null,
        $not: { $regex: `@${config.removedEmailDomain}$` }
      }
    })
      .select('_id email created_at')
      .lean()
      .exec();

    if (paidUsers.length === 0) {
      logger.info('No paid users to check for suspicious emails');
      return;
    }

    const bannedEmails = await getBannedEmails();
    const suspiciousUsers = [];

    await pMap(
      paidUsers,
      async (user) => {
        try {
          const suspicionResult = isEmailSuspicious(user.email, bannedEmails);

          if (suspicionResult) {
            suspiciousUsers.push({ user, suspicionResult });

            logger.warn('Suspicious email detected', {
              userId: user._id,
              email: user.email,
              suspicionType: suspicionResult.type,
              reason: suspicionResult.reason
            });
          }
        } catch (err) {
          logger.error('Error checking user email', err, {
            userId: user._id,
            email: user.email
          });
        }
      },
      { concurrency: 5 }
    );

    await sendAggregatedAlert(suspiciousUsers);

    logger.info('Suspicious email check completed', {
      usersChecked: paidUsers.length,
      suspiciousFound: suspiciousUsers.length,
      bannedEmailsCount: bannedEmails.length
    });
  } catch (err) {
    logger.error('Suspicious email check job failed', err);
    throw err;
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
