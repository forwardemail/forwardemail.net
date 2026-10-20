/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('@forwardemail/bytes');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const Aliases = require('#models/aliases');
const config = require('#config');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const {
  isWithinGracePeriod,
  getGracePeriodDaysRemaining
} = require('#helpers/is-within-grace-period');

//
// IMAP ALERT Response Code (RFC 3501 Section 7.1)
//
// Sends `* OK [ALERT] <message>` untagged responses to the IMAP client.
// Per RFC 3501, clients MUST present ALERT text to the user in a fashion
// that calls their attention to the message (e.g. popup dialog).
//
// Supported by: Thunderbird, Apple Mail, Outlook, iOS Mail
//
// Rate limiting: Each alert type is deduplicated per-alias using Redis
// with a configurable TTL to prevent spamming the user with repeated dialogs.
//

// Alert dedup TTLs (how often a given alert can fire per alias)
const ALERT_TTL = {
  quota_warning: ms('5d'),
  quota_critical: ms('5d'),
  payment_grace_period: ms('5d'),
  smtp_not_enabled: ms('5d')
};

//
// Send an IMAP ALERT to the client connection.
// This writes an untagged `* OK [ALERT] message` response directly to the socket.
//
// Per RFC 3501 Section 7.1:
//   "The human-readable text contains a special alert that MUST be
//    presented to the user in a fashion that calls the user's
//    attention to the message."
//
function sendAlert(connection, message) {
  if (
    !connection ||
    typeof connection.send !== 'function' ||
    connection._closing ||
    connection._closed
  ) {
    return;
  }

  try {
    connection.send(`* OK [ALERT] ${message}`);
  } catch (err) {
    logger.debug('Failed to send IMAP ALERT', { err });
  }
}

//
// Find the IMAPConnection object for a given session from the server's
// active connections set. In wildduck, session.id === connection.id.
//
function getConnectionForSession(server, session) {
  if (!server || !server.connections || !session || !session.id) return null;
  for (const connection of server.connections) {
    if (connection.id === session.id) return connection;
  }

  return null;
}

//
// Check and send all applicable IMAP alerts for the current session.
// This should be called after successful authentication but BEFORE
// the fn(null, {user}) callback so that the ALERT appears before
// the tagged OK response (RFC-compliant ordering).
//
// Alerts are rate-limited per alias using Redis to avoid
// spamming the user with repeated dialogs on every reconnect.
//
async function checkAndSendAlerts({
  connection,
  client,
  session,
  domain,
  alias
}) {
  if (!connection || typeof connection.send !== 'function') return;
  if (!client) return;

  const locale =
    session?.user?.locale ||
    (alias && alias.user && alias.user[config.lastLocaleField]) ||
    i18n.config.defaultLocale;
  const aliasId = alias ? alias.id || alias._id : domain.id || domain._id;

  // Collect alerts to send (run checks in parallel for performance)
  const alerts = [];

  try {
    const checks = await Promise.allSettled([
      checkQuotaAlert(client, alias, aliasId, locale),
      checkPaymentAlert(client, domain, aliasId, locale),
      checkSmtpAlert(client, domain, aliasId, locale)
    ]);

    for (const result of checks) {
      if (result.status === 'fulfilled' && result.value) {
        alerts.push(result.value);
      }
    }
  } catch (err) {
    logger.debug('IMAP ALERT check error', { err });
  }

  // Send collected alerts (limit to 3 max to avoid overwhelming the user)
  for (const alert of alerts.slice(0, 3)) {
    sendAlert(connection, alert);
  }
}

//
// Check if the alias is approaching or over its storage quota.
// Returns alert message if applicable, null otherwise.
//
async function checkQuotaAlert(client, alias, aliasId, locale) {
  if (!alias || !alias.has_imap) return null;

  // Rate limit: check Redis dedup key
  const criticalKey = `imap_alert:quota_critical:${aliasId}`;
  const warningKey = `imap_alert:quota_warning:${aliasId}`;

  try {
    const { storageUsed, maxQuotaPerAlias } = await Aliases.isOverQuota(
      {
        id: aliasId,
        domain: alias.domain?._id || alias.domain,
        locale
      },
      0,
      client
    );

    if (maxQuotaPerAlias <= 0) return null;

    const usagePercent = storageUsed / maxQuotaPerAlias;

    if (usagePercent >= 0.95) {
      // Critical: >95% usage
      const cached = await client.get(criticalKey);
      if (cached) return null;

      await client.set(criticalKey, '1', 'PX', ALERT_TTL.quota_critical);
      return i18n.translate(
        'IMAP_ALERT_QUOTA_CRITICAL',
        locale,
        Math.round(usagePercent * 100),
        bytes(storageUsed),
        bytes(maxQuotaPerAlias)
      );
    }

    if (usagePercent >= 0.8) {
      // Warning: >80% usage
      const cached = await client.get(warningKey);
      if (cached) return null;

      await client.set(warningKey, '1', 'PX', ALERT_TTL.quota_warning);
      return i18n.translate(
        'IMAP_ALERT_QUOTA_WARNING',
        locale,
        Math.round(usagePercent * 100),
        bytes(storageUsed),
        bytes(maxQuotaPerAlias)
      );
    }
  } catch (err) {
    logger.debug('IMAP ALERT quota check error', { err });
  }

  return null;
}

//
// Whether an admin pays for the domain's plan: their plan covers it, and it
// has not expired or renews through an active subscription
//
function isInGoodStanding(user, domainPlan) {
  const plans =
    domainPlan === 'team' ? ['team'] : ['team', 'enhanced_protection'];
  if (!plans.includes(user.plan)) return false;
  if (
    isSANB(user[config.userFields.stripeSubscriptionID]) ||
    isSANB(user[config.userFields.paypalSubscriptionID])
  )
    return true;
  const expiresAt = new Date(user[config.userFields.planExpiresAt]).getTime();
  return Number.isFinite(expiresAt) && expiresAt >= Date.now();
}

//
// Check if the domain's billing admin is in a grace period (payment past due).
// Returns alert message if applicable, null otherwise.
//
async function checkPaymentAlert(client, domain, aliasId, locale) {
  if (!domain || !domain.members) return null;

  const dedupKey = `imap_alert:payment_grace_period:${aliasId}`;

  try {
    const admins = domain.members.filter(
      (m) =>
        m.user && m.group === 'admin' && !m.user[config.userFields.isBanned]
    );

    //
    // the domain is in good standing when any admin on its plan is paid up or
    // has an active subscription, whose renewal may not be recorded yet
    // (the same rule as `helpers/validate-domain.js`)
    //
    if (admins.some((m) => isInGoodStanding(m.user, domain.plan))) return null;

    // Check if any admin is in grace period
    const adminInGrace = admins.find((m) => isWithinGracePeriod(m.user));

    if (!adminInGrace) return null;

    const cached = await client.get(dedupKey);
    if (cached) return null;

    await client.set(dedupKey, '1', 'PX', ALERT_TTL.payment_grace_period);

    const daysRemaining = getGracePeriodDaysRemaining(adminInGrace.user);
    return i18n.translate(
      'IMAP_ALERT_PAYMENT_GRACE_PERIOD',
      locale,
      daysRemaining,
      `${config.urls.web}/my-account/billing`
    );
  } catch (err) {
    logger.debug('IMAP ALERT payment check error', { err });
  }

  return null;
}

//
// Check if the domain does not have SMTP enabled (outbound mail won't work).
// Returns alert message if applicable, null otherwise.
//
async function checkSmtpAlert(client, domain, aliasId, locale) {
  if (!domain || domain.has_smtp) return null;

  const dedupKey = `imap_alert:smtp_not_enabled:${aliasId}`;

  try {
    const cached = await client.get(dedupKey);
    if (cached) return null;

    await client.set(dedupKey, '1', 'PX', ALERT_TTL.smtp_not_enabled);
    return i18n.translate(
      'IMAP_ALERT_SMTP_NOT_ENABLED',
      locale,
      domain.name,
      `${config.urls.web}/my-account/domains/${domain.name}/verify-smtp`
    );
  } catch (err) {
    logger.debug('IMAP ALERT SMTP check error', { err });
  }

  return null;
}

module.exports = {
  sendAlert,
  getConnectionForSession,
  checkAndSendAlerts,
  checkQuotaAlert,
  checkPaymentAlert,
  checkSmtpAlert,
  ALERT_TTL
};
