/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const { sendWebhook } = require('#helpers/observatory/send-webhook');
const { REDIS_PREFIXES, TTL } = require('#config/observatory');

// Human-readable labels for alert types
const ALERT_LABELS = {
  blacklist_listed: 'Blacklist Listing Detected',
  blacklist_delisted: 'Blacklist Delisting Detected',
  dns_mx_changed: 'MX Records Changed',
  dns_ns_changed: 'NS Records Changed',
  dns_dmarc_downgraded: 'DMARC Policy Downgraded',
  dns_spf_misconfigured: 'SPF Misconfiguration Detected',
  ct_suspicious_cert: 'Suspicious Certificate Detected'
};

// Severity levels for alert types
const ALERT_SEVERITY = {
  blacklist_listed: 'high',
  blacklist_delisted: 'info',
  dns_mx_changed: 'medium',
  dns_ns_changed: 'high',
  dns_dmarc_downgraded: 'high',
  dns_spf_misconfigured: 'medium',
  ct_suspicious_cert: 'high'
};

/**
 * Check if an alert has already been sent recently (deduplication).
 * Uses Redis SETNX with TTL to prevent alert storms.
 *
 * @param {Object} client      - Redis client
 * @param {string} userId      - User ObjectId string
 * @param {string} subjectId   - ObservatorySubject ObjectId string
 * @param {string} alertType   - Alert type string
 * @returns {Promise<boolean>} true if alert should be sent (lock acquired)
 */
async function acquireAlertLock(client, userId, subjectId, alertType) {
  const key = `${REDIS_PREFIXES.alert}${userId}:${subjectId}:${alertType}`;
  const result = await client.set(key, '1', 'PX', TTL.alertDedup, 'NX');
  return result === 'OK';
}

/**
 * Send observatory alert notifications to all subscribed users
 * for a given subject.
 *
 * Handles:
 * - Checking each user's alert_types preferences
 * - Rate limiting via Redis to prevent alert storms
 * - Email delivery via the existing email helper
 *
 * @param {Object} options
 * @param {Object}   options.subject    - ObservatorySubject document (with monitored_by populated)
 * @param {string}   options.alertType  - One of the ALERT_LABELS keys
 * @param {string}   options.message    - Human-readable description of what happened
 * @param {Object}   [options.details]  - Additional structured data for the email template
 * @param {Object}   options.client     - Redis client
 * @returns {Promise<number>} Number of alerts actually sent
 */
async function sendAlert(options) {
  const { subject, alertType, message, details, client } = options;

  if (!subject || !subject.monitored_by || subject.monitored_by.length === 0) {
    return 0;
  }

  const label = ALERT_LABELS[alertType] || alertType;
  const severity = ALERT_SEVERITY[alertType] || 'info';
  let sentCount = 0;

  for (const monitor of subject.monitored_by) {
    // Check if this user wants this alert type
    if (!monitor.alerts_enabled) continue;
    if (
      monitor.alert_types &&
      monitor.alert_types.length > 0 &&
      !monitor.alert_types.includes(alertType)
    )
      continue;

    const userId = monitor.user.toString();

    // Rate limit: one alert per user/subject/type per hour
    if (client) {
      const lockAcquired = await acquireAlertLock(
        client,
        userId,
        subject._id.toString(),
        alertType
      );
      if (!lockAcquired) {
        logger.debug('Observatory alert rate limited', {
          userId,
          subject: subject.value,
          alertType
        });
        continue;
      }
    }

    // Send email alert
    if (
      !monitor.alert_channels ||
      monitor.alert_channels.length === 0 ||
      monitor.alert_channels.includes('email')
    ) {
      try {
        // Look up user email
        const user = await Users.findById(monitor.user)
          .select(`email ${config.lastLocaleField}`)
          .lean();

        if (!user || !user.email) continue;

        const locale = user[config.lastLocaleField] || 'en';

        await emailHelper({
          template: 'observatory-alert',
          message: {
            to: user.email
          },
          locals: {
            user,
            locale,
            subject: {
              type: subject.type,
              value: subject.value,
              reputation_score: subject.reputation_score,
              reputation_grade: subject.reputation_grade
            },
            alertType,
            alertLabel: label,
            severity,
            alertMessage: message,
            details: details || {},
            config
          }
        });

        sentCount++;

        logger.info('Observatory alert sent', {
          userId,
          email: user.email,
          subject: subject.value,
          alertType
        });
      } catch (err) {
        logger.error('Failed to send observatory alert email', {
          userId,
          subject: subject.value,
          alertType,
          err
        });
      }
    }

    // Send webhook alert
    if (
      monitor.alert_channels &&
      monitor.alert_channels.includes('webhook') &&
      monitor.webhook_url
    ) {
      try {
        // Look up user for API token (used as webhook signing secret)
        const user = await Users.findById(monitor.user)
          .select('api_token')
          .lean();

        if (user && user.api_token) {
          const webhookPayload = {
            alert_type: alertType,
            alert_label: label,
            severity,
            message,
            subject: {
              type: subject.type,
              value: subject.value,
              reputation_score: subject.reputation_score,
              reputation_grade: subject.reputation_grade
            },
            details: details || {},
            timestamp: new Date().toISOString()
          };

          await sendWebhook({
            url: monitor.webhook_url,
            secret: user.api_token,
            payload: webhookPayload
          });

          sentCount++;

          logger.info('Observatory webhook sent', {
            userId,
            url: monitor.webhook_url,
            subject: subject.value,
            alertType
          });
        }
      } catch (err) {
        logger.error('Failed to send observatory webhook', {
          userId,
          subject: subject.value,
          alertType,
          err
        });
      }
    }
  }

  return sentCount;
}

module.exports = {
  sendAlert,
  acquireAlertLock,
  ALERT_LABELS,
  ALERT_SEVERITY
};
