/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { readFileSync } = require('node:fs');
const process = require('node:process');

const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');

const PushTokens = require('#models/push-tokens');
const config = require('#config');
const { isPrivateHostResolved } = require('#helpers/is-private-host');
const logger = require('#helpers/logger');

//
// Push notification delivery helper for the Forward Email Mail App.
//
// This module delivers "alert"-style push notifications to registered
// mobile/desktop devices when a WebSocket event occurs and the target
// alias has no active WebSocket connection (i.e. the app is backgrounded
// or closed).
//
// Architecture:
//   1. `sendWebSocketNotification` publishes to Redis pub/sub.
//   2. The WS handler delivers to connected clients.
//   3. For aliases with NO connected WS clients, the WS handler calls
//      `sendPushNotification` (this module) as a fallback to wake the app.
//
// Delivery transports:
//   * APNs  — via token-based auth (.p8 key) with pushType='alert'.
//   * FCM   — via Firebase Admin SDK HTTP v1 API.
//   * UnifiedPush — via plain HTTPS POST to the distributor endpoint.
//   * Web Push — via web-push library (future).
//
// Rate limiting:
//   One push per (alias, event) per 30 seconds via Redis to coalesce
//   rapid-fire mutations (e.g. bulk IMAP STORE) into a single wake-up.
//
// Safety:
//   If env vars are not configured for a given platform, delivery is
//   silently skipped (no-op). This ensures the server runs cleanly in
//   development or environments where push is not yet set up.
//

const PUSH_COALESCE_MS = ms('30s');
const PUSH_CONCURRENCY = 5;

/**
 * Validate a URL is safe for outbound fetch (not SSRF).
 * Uses isPrivateHostResolved which:
 *   - Checks hostname against REGEX_LOCALHOST (RFC 1918, loopback, link-local, etc.)
 *   - Checks against config.testDomains (reserved TLDs, cloud metadata hostnames)
 *   - Resolves the hostname via DNS and checks all returned IPs
 *   - Prevents DNS rebinding attacks (attacker changes A record after registration)
 *
 * This matches the pattern used by domain-connect, on-data-mx, process-email,
 * and wkd helpers — all of which resolve DNS before making outbound requests.
 *
 * @param {string} urlString - The URL to validate
 * @returns {Promise<void>}
 * @throws {Error} if URL targets private/reserved addresses
 */
async function validateOutboundUrl(urlString) {
  const parsed = new URL(urlString);

  if (parsed.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs are allowed for push delivery');
  }

  // Use isPrivateHostResolved (async DNS resolution) to prevent DNS rebinding.
  // This matches the pattern in domain-connect.js, on-data-mx.js, process-email.js, wkd.js
  if (await isPrivateHostResolved(parsed.hostname)) {
    throw new Error(
      `Push endpoint targets private/reserved address: ${parsed.hostname}`
    );
  }

  if (parsed.username || parsed.password) {
    throw new Error('Push endpoint must not contain credentials');
  }
}

/**
 * Returns true if APNs is configured and ready to deliver.
 */
function isApnsConfigured() {
  const keyPath =
    config.pushNotifications?.apnsKeyPath || process.env.APNS_KEY_PATH;
  const keyId = config.pushNotifications?.apnsKeyId || process.env.APNS_KEY_ID;
  const teamId =
    config.pushNotifications?.apnsTeamId || process.env.APNS_TEAM_ID;
  return Boolean(keyPath && keyId && teamId);
}

/**
 * Returns true if FCM is configured and ready to deliver.
 */
function isFcmConfigured() {
  const projectId =
    config.pushNotifications?.fcmProjectId || process.env.FCM_PROJECT_ID;
  const serviceAccountPath =
    config.pushNotifications?.fcmServiceAccountPath ||
    process.env.FCM_SERVICE_ACCOUNT_PATH;
  return Boolean(projectId && serviceAccountPath);
}

// Cached APNs provider (reused across requests to avoid connection churn)
let _apnsProvider = null;
let _apnsProviderConfig = null;

/**
 * Get or create a cached APNs provider instance.
 * Recreated if configuration changes.
 */
function getApnsProvider() {
  const apn = require('@parse/node-apn');

  const keyPath =
    config.pushNotifications?.apnsKeyPath || process.env.APNS_KEY_PATH;
  const keyId = config.pushNotifications?.apnsKeyId || process.env.APNS_KEY_ID;
  const teamId =
    config.pushNotifications?.apnsTeamId || process.env.APNS_TEAM_ID;
  const production = config.pushNotifications?.apnsProduction !== false;

  const configKey = `${keyPath}:${keyId}:${teamId}:${production}`;

  if (_apnsProvider && _apnsProviderConfig === configKey) {
    return _apnsProvider;
  }

  // Validate the key file exists and is readable before creating provider
  try {
    readFileSync(keyPath);
  } catch (err) {
    throw new Error(`APNs key file not readable at ${keyPath}: ${err.message}`);
  }

  if (_apnsProvider) {
    _apnsProvider.shutdown();
  }

  _apnsProvider = new apn.Provider({
    token: { key: keyPath, keyId, teamId },
    production
  });
  _apnsProviderConfig = configKey;

  return _apnsProvider;
}

/**
 * Send a push notification to all registered devices for an alias.
 *
 * @param {Object} client - Redis client instance
 * @param {string} aliasId - The alias ID to notify
 * @param {string} event - The WebSocket event name (e.g. 'newMessage')
 * @param {Object} [data={}] - Event payload (title, body, etc.)
 */
async function sendPushNotification(client, aliasId, event, data = {}) {
  if (!client || !aliasId || !event) return;

  // Sanitize event name: only allow known safe characters
  if (typeof event !== 'string' || !/^[a-zA-Z]{1,64}$/.test(event)) return;

  try {
    // Rate-limit: one push per (alias, event) per PUSH_COALESCE_MS
    const cacheKey = `push_notify:${revHash(aliasId.toString())}:${revHash(
      event
    )}`;
    const cached = await client.get(cacheKey);
    if (cached) return;
    await client.set(cacheKey, '1', 'PX', PUSH_COALESCE_MS);

    // Find all active tokens for this alias
    const tokens = await PushTokens.findActiveForAlias(aliasId);
    if (!tokens || tokens.length === 0) return;

    // Build the notification payload
    const payload = buildPayload(event, data);

    await pMap(
      tokens,
      async (tokenDoc) => {
        try {
          await deliverToToken(tokenDoc, payload);
          await PushTokens.recordSuccess(tokenDoc._id);
        } catch (err) {
          logger.warn('Push delivery failed', {
            token_id: tokenDoc._id,
            platform: tokenDoc.platform,
            error: err.message
          });
          await PushTokens.recordFailure(tokenDoc._id);
        }
      },
      { concurrency: PUSH_CONCURRENCY }
    );
  } catch (err) {
    logger.fatal(err, { aliasId, event });
  }
}

/**
 * Build a platform-agnostic notification payload from the WS event.
 * Sanitizes all string fields to prevent injection.
 */
function buildPayload(event, data) {
  // Map WS events to human-readable notification content
  const TITLES = {
    newMessage: 'New Email',
    messagesMoved: 'Messages Moved',
    messagesCopied: 'Messages Copied',
    flagsUpdated: 'Flags Updated',
    messagesExpunged: 'Messages Deleted',
    mailboxCreated: 'Mailbox Created',
    mailboxDeleted: 'Mailbox Deleted',
    mailboxRenamed: 'Mailbox Renamed',
    calendarCreated: 'Calendar Created',
    calendarUpdated: 'Calendar Updated',
    calendarDeleted: 'Calendar Deleted',
    calendarEventCreated: 'New Calendar Event',
    calendarEventUpdated: 'Calendar Event Updated',
    calendarEventDeleted: 'Calendar Event Deleted',
    contactCreated: 'New Contact',
    contactUpdated: 'Contact Updated',
    contactDeleted: 'Contact Deleted',
    addressBookCreated: 'Address Book Created',
    addressBookDeleted: 'Address Book Deleted',
    newRelease: 'App Update Available'
  };

  // Use only known titles; fallback to generic
  const title = TITLES[event] || 'Forward Email';

  // Sanitize body: truncate to prevent oversized payloads
  const MAX_BODY_LENGTH = 256;
  let body = '';
  switch ('string') {
    case typeof data.body: {
      body = data.body.slice(0, MAX_BODY_LENGTH);

      break;
    }

    case typeof data.subject: {
      body = data.subject.slice(0, MAX_BODY_LENGTH);

      break;
    }

    case typeof data.name: {
      body = data.name.slice(0, MAX_BODY_LENGTH);

      break;
    }

    default: {
      body = `You have a new ${event} event`;
    }
  }

  // Sanitize data fields: only include known safe identifiers
  const safeAliasId =
    typeof data.aliasId === 'string' || typeof data.alias_id === 'string'
      ? String(data.aliasId || data.alias_id).slice(0, 64)
      : '';
  const safeMessageId =
    typeof data.message_id === 'string' || typeof data.id === 'string'
      ? String(data.message_id || data.id).slice(0, 255)
      : '';
  const safeMailbox =
    typeof data.mailbox === 'string' || typeof data.path === 'string'
      ? String(data.mailbox || data.path).slice(0, 255)
      : '';

  return {
    title,
    body,
    event,
    data: {
      event,
      alias_id: safeAliasId,
      message_id: safeMessageId,
      mailbox: safeMailbox
    }
  };
}

/**
 * Deliver a notification to a specific token based on its platform.
 */
async function deliverToToken(tokenDoc, payload) {
  switch (tokenDoc.platform) {
    case 'apns': {
      return deliverApns(tokenDoc, payload);
    }

    case 'fcm': {
      return deliverFcm(tokenDoc, payload);
    }

    case 'unified-push': {
      return deliverUnifiedPush(tokenDoc, payload);
    }

    case 'web-push': {
      return deliverWebPush(tokenDoc);
    }

    default: {
      throw new Error(`Unsupported platform: ${tokenDoc.platform}`);
    }
  }
}

/**
 * APNs delivery via HTTP/2.
 *
 * Uses token-based auth (.p8 key) with pushType='alert' and priority=10
 * for user-visible notifications.
 * The topic is the mail app's bundle ID (not the DAV cert topic).
 *
 * If APNs env vars are not configured, this is a silent no-op.
 */
async function deliverApns(tokenDoc, payload) {
  if (!isApnsConfigured()) {
    logger.debug('APNs not configured, skipping push delivery');
    return;
  }

  const apn = require('@parse/node-apn');
  const provider = getApnsProvider();
  const bundleId =
    config.pushNotifications?.apnsBundleId || 'net.forwardemail.app';

  const note = new apn.Notification();
  note.pushType = 'alert';
  note.topic = bundleId;
  note.expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  note.priority = 10;
  note.alert = {
    title: String(payload.title).slice(0, 128),
    body: String(payload.body).slice(0, 256)
  };
  note.payload = payload.data;
  note.sound = 'default';

  const result = await provider.send(note, tokenDoc.token);

  if (result.failed && result.failed.length > 0) {
    const failure = result.failed[0];
    // 410 Gone = token is no longer valid
    if (Number.parseInt(failure.status, 10) === 410) {
      throw new Error('APNs token expired (410 Gone)');
    }

    throw new Error(
      `APNs delivery failed: ${failure.response?.reason || failure.status}`
    );
  }
}

/**
 * FCM delivery via Firebase Admin SDK HTTP v1 API.
 *
 * Uses service account credentials for authentication.
 * Sends a data+notification message for maximum compatibility.
 *
 * If FCM env vars are not configured, this is a silent no-op.
 */
async function deliverFcm(tokenDoc, payload) {
  if (!isFcmConfigured()) {
    logger.debug('FCM not configured, skipping push delivery');
    return;
  }

  const { GoogleAuth } = require('google-auth-library');

  const projectId =
    config.pushNotifications?.fcmProjectId || process.env.FCM_PROJECT_ID;
  const serviceAccountPath =
    config.pushNotifications?.fcmServiceAccountPath ||
    process.env.FCM_SERVICE_ACCOUNT_PATH;

  // Validate projectId format to prevent URL injection
  if (!/^[a-z][a-z\d-]{4,28}[a-z\d]$/.test(projectId)) {
    throw new Error('Invalid FCM project ID format');
  }

  const auth = new GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });

  const accessToken = await auth.getAccessToken();

  const message = {
    message: {
      token: tokenDoc.token,
      notification: {
        title: String(payload.title).slice(0, 128),
        body: String(payload.body).slice(0, 256)
      },
      data: Object.fromEntries(
        Object.entries(payload.data).map(([k, v]) => [
          String(k).slice(0, 64),
          String(v).slice(0, 255)
        ])
      ),
      android: {
        priority: 'high',
        notification: { channel_id: 'email_notifications' }
      }
    }
  };

  const fcmUrl = `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/messages:send`;

  const response = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });

  if (!response.ok) {
    const responseBody = await response.text();
    // 404 = token not found (unregistered)
    if (response.status === 404) {
      throw new Error('FCM token not registered (404)');
    }

    throw new Error(
      `FCM delivery failed (${response.status}): ${responseBody.slice(0, 200)}`
    );
  }
}

/**
 * UnifiedPush delivery via plain HTTPS POST.
 *
 * The UnifiedPush spec requires a simple POST to the endpoint URL
 * with the notification payload as the body.
 * <https://unifiedpush.org/spec/server/>
 *
 * No env var configuration needed — the endpoint URL is the token itself.
 */
async function deliverUnifiedPush(tokenDoc, payload) {
  const endpointUrl = tokenDoc.token;

  // SSRF prevention: resolve DNS and validate against private/reserved ranges
  // (prevents DNS rebinding attacks where attacker changes A record after registration)
  await validateOutboundUrl(endpointUrl);

  const body = JSON.stringify({
    event: payload.event,
    title: payload.title,
    body: payload.body,
    ...payload.data
  });

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body))
    },
    body,
    // Timeout to prevent hanging on unresponsive endpoints
    signal: AbortSignal.timeout(10_000)
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `UnifiedPush delivery failed (${response.status}): ${responseBody.slice(
        0,
        200
      )}`
    );
  }
}

/**
 * Web Push delivery (placeholder for future implementation).
 * Silent no-op until web-push is integrated.
 */

async function deliverWebPush(tokenDoc) {
  // TODO: implement web-push delivery using the web-push npm package
  logger.info('Web Push delivery not yet implemented', {
    token_id: tokenDoc._id
  });
}

module.exports = sendPushNotification;
module.exports.sendPushNotification = sendPushNotification;
module.exports._test = {
  buildPayload,
  deliverToToken,
  deliverApns,
  deliverFcm,
  deliverUnifiedPush,
  deliverWebPush,
  isApnsConfigured,
  isFcmConfigured,
  validateOutboundUrl
};
