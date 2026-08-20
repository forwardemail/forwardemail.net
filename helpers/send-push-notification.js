/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { readFileSync } = require('node:fs');
const process = require('node:process');

const apn = require('@parse/node-apn');
const { GoogleAuth } = require('google-auth-library');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');
const webPush = require('web-push');

const PushTokens = require('#models/push-tokens');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const { isPrivateHostResolved } = require('#helpers/is-private-host');
const logger = require('#helpers/logger');
const safeFetch = require('#helpers/safe-fetch');

//
// Push notification delivery helper for the Forward Email Mail App.
//
// This module delivers push notifications to registered mobile/desktop devices
// for every per-alias realtime notification.
//
// Only the events in USER_VISIBLE_PUSH_EVENTS are delivered as user-visible
// alerts. Every other event is still delivered, but silently: clients need
// them for badge counts and cache invalidation, and the device must not raise
// a notification for one. See that constant for why this is decided here
// rather than on the client.
//
// Architecture:
//   1. `sendNotification` creates one immutable notificationId.
//   2. It directly starts this helper AND publishes the same payload to Redis
//      for WebSocket fan-out; neither transport depends on the other.
//   3. This helper selects every active token for the alias and attempts each
//      token with bounded parallelism, even when zero sockets are connected.
//   4. Clients coalesce the two transports by notificationId so foreground
//      delivery performs exactly one visual notification and one state update.
//
// Delivery transports:
//   * APNs  — via token-based auth (.p8 key); pushType 'alert', or
//             'background' for silent events.
//   * FCM   — via Firebase Admin SDK HTTP v1 API.
//   * UnifiedPush — RFC 8291 encrypted Web Push to the distributor endpoint.
//   * Web Push — reserved for browser PushSubscription delivery.
//
// Idempotency:
//   One push fan-out per (alias, notificationId) via an atomic Redis NX key.
//   Legacy events without an identifier retain the previous (alias, event)
//   30-second coalescing behavior.
//
// Safety:
//   If env vars are not configured for a given platform, delivery is
//   silently skipped (no-op). This ensures the server runs cleanly in
//   development or environments where push is not yet set up.
//

const PUSH_COALESCE_MS = ms('30s');
const PUSH_CONCURRENCY = 5;

//
// Events that justify interrupting the user.
//
// This has to be decided here, not on the device. A push carrying an FCM
// `notification` block or an APNs `alert` is displayed by the OS before the
// app is given the payload, so a client cannot suppress one it did not want.
// Sending an alert for every event type meant a single user action fanned out
// into a screenful of notifications: marking a thread read emits one
// flagsUpdated event per message, and each arrived as "Flags Updated / You
// have a new flagsUpdated event".
//
// Everything absent from this set is still delivered — clients depend on it
// for badge counts and cache invalidation — but as a silent data-only message
// the app decides what, if anything, to show. That also lets device-scoped
// preferences (the mail app's app-update toggle, for instance) actually apply,
// which they cannot when the OS draws the notification for us.
//
const USER_VISIBLE_PUSH_EVENTS = new Set(['newMessage']);

//
// Folders whose arrivals are not something to interrupt the user about.
//
// newMessage fires for any message appended to any mailbox, so saving a draft
// or filing a copy into Sent looks exactly like incoming mail from here. The
// app already refuses to draw these itself, but that only covers the WebSocket
// path: the OS draws an FCM `notification` block or an APNs `alert` before the
// app sees the payload, so a push for a draft cannot be taken back on-device.
// The decision has to be made here to have any effect.
//
// Matched on the mailbox path because that is all the newMessage emitters
// carry (see helpers/imap/on-append.js and helpers/parse-payload.js) — no
// specialUse attribute reaches this point. Kept in step with SILENT_FOLDERS in
// the mail app's utils/notification-manager.js.
//
const SILENT_MAILBOX_PATHS = new Set([
  'DRAFTS',
  'DRAFT',
  'SENT',
  'SENT MAIL',
  'SENT MESSAGES',
  'SENT ITEMS',
  'ARCHIVE',
  'ARCHIVES',
  'ALL MAIL',
  'JUNK',
  'JUNK EMAIL',
  'SPAM',
  'TRASH',
  'BIN',
  'DELETED ITEMS',
  'DELETED MESSAGES'
]);

//
// Whether a newMessage event is a delivery worth alerting about.
//
// Three ways it is not, in order of how much we trust them:
//   1. The message carries \Draft — a draft the user is writing, whatever
//      folder it landed in.
//   2. It arrives already \Seen. A genuine delivery is never pre-read, so
//      this is another client copying or migrating existing mail.
//   3. The mailbox is one of the paths above.
//
function isAlertWorthyNewMessage(data) {
  const message = data && data.message;
  const flags = message && Array.isArray(message.flags) ? message.flags : [];
  const hasFlag = (name) =>
    flags.some(
      (flag) => typeof flag === 'string' && flag.toLowerCase() === name
    );

  if (message && message.is_draft === true) return false;
  if (hasFlag('\\draft')) return false;
  if (message && message.is_unread === false) return false;
  if (hasFlag('\\seen')) return false;

  const mailbox =
    (data && typeof data.mailbox === 'string' && data.mailbox) ||
    (message &&
      typeof message.folder_path === 'string' &&
      message.folder_path) ||
    '';
  return !SILENT_MAILBOX_PATHS.has(mailbox.trim().toUpperCase());
}

//
// FCM rejects the entire message with 400 INVALID_ARGUMENT when the data
// payload contains a reserved key: "from", "notification", "message_type",
// or any key starting with "google" or "gcm".
// <https://firebase.google.com/docs/cloud-messaging/concept-options#data_messages>
//
const FCM_RESERVED_DATA_KEYS = new Set([
  'from',
  'notification',
  'message_type'
]);

function isFcmReservedDataKey(key) {
  return (
    FCM_RESERVED_DATA_KEYS.has(key) ||
    key.startsWith('google') ||
    key.startsWith('gcm')
  );
}

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
 * @param {object} [resolver] - Optional Tangerine resolver instance (Redis-backed, cached)
 * @returns {Promise<void>}
 * @throws {Error} if URL targets private/reserved addresses
 */
async function validateOutboundUrl(urlString, resolver) {
  const parsed = new URL(urlString);

  if (parsed.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs are allowed for push delivery');
  }

  // Use isPrivateHostResolved (async DNS resolution) to prevent DNS rebinding.
  // This matches the pattern in domain-connect.js, on-data-mx.js, process-email.js, wkd.js
  if (await isPrivateHostResolved(parsed.hostname, resolver)) {
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
    config.pushNotifications?.appleKeyPath || process.env.APPLE_KEY_PATH;
  const keyId =
    config.pushNotifications?.appleKeyId || process.env.APPLE_KEY_ID;
  const teamId =
    config.pushNotifications?.appleTeamId || process.env.APPLE_TEAM_ID;
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

/**
 * Returns true if the matching UnifiedPush VAPID key pair is configured.
 */
function isVapidConfigured() {
  const subject =
    config.pushNotifications?.vapidSubject || process.env.VAPID_SUBJECT;
  const publicKey =
    config.pushNotifications?.vapidPublicKey || process.env.VAPID_PUBLIC_KEY;
  const privateKey =
    config.pushNotifications?.vapidPrivateKey || process.env.VAPID_PRIVATE_KEY;
  return Boolean(subject && publicKey && privateKey);
}

function getVapidDetails() {
  return {
    subject:
      config.pushNotifications?.vapidSubject || process.env.VAPID_SUBJECT,
    publicKey:
      config.pushNotifications?.vapidPublicKey || process.env.VAPID_PUBLIC_KEY,
    privateKey:
      config.pushNotifications?.vapidPrivateKey || process.env.VAPID_PRIVATE_KEY
  };
}

function createPermanentPushError(message, cause) {
  const error = new Error(message, cause ? { cause } : undefined);
  error.isPermanentPushFailure = true;
  return error;
}

// Cached APNs provider (reused across requests to avoid connection churn)
let _apnsProvider = null;
let _apnsProviderConfig = null;

/**
 * Get or create a cached APNs provider instance.
 * Recreated if configuration changes.
 */
function getApnsProvider() {
  const keyPath =
    config.pushNotifications?.appleKeyPath || process.env.APPLE_KEY_PATH;
  const keyId =
    config.pushNotifications?.appleKeyId || process.env.APPLE_KEY_ID;
  const teamId =
    config.pushNotifications?.appleTeamId || process.env.APPLE_TEAM_ID;
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
 * @param {object} [resolver] - Optional Tangerine resolver instance
 */
// eslint-disable-next-line max-params
async function sendPushNotification(
  client,
  aliasId,
  event,
  data = {},
  resolver
) {
  if (!client || !aliasId || !event) return;

  // Sanitize event name: only allow known safe characters
  if (typeof event !== 'string' || !/^[a-zA-Z]{1,64}$/.test(event)) return;

  // Ensure a Tangerine resolver is available for safeFetch DNS pinning.
  // Most callers (sendNotification) do not pass one, so we lazily create
  // a resolver backed by the same Redis client used for idempotency.
  if (!resolver) {
    resolver = createTangerine(client, logger);
  }

  try {
    // Claim this logical event atomically so a duplicate producer invocation
    // cannot fan the same notification out to all active alias tokens twice.
    const notificationId =
      typeof data.notificationId === 'string'
        ? data.notificationId.slice(0, 64)
        : '';
    const idempotencyValue = notificationId || event;
    const cacheKey = `push_notify:${revHash(aliasId.toString())}:${revHash(
      idempotencyValue
    )}`;
    const claimed = await client.set(
      cacheKey,
      '1',
      'PX',
      PUSH_COALESCE_MS,
      'NX'
    );
    if (claimed !== 'OK') return;

    // Find all active tokens for this alias
    const tokens = await PushTokens.findActiveForAlias(aliasId);
    if (!tokens || tokens.length === 0) return;

    // Build the notification payload with the authoritative alias scope. This
    // guarantees every active token selected above receives the same alias ID
    // even when a producer omits or supplies malformed payload metadata.
    const payload = buildPayload(event, {
      ...data,
      aliasId: aliasId.toString()
    });

    await fanOutToTokens(tokens, payload, resolver);
  } catch (err) {
    logger.fatal(err, { aliasId, event });
  }
}

/**
 * Attempt delivery to every active token with bounded parallelism.
 * A failure for one token is recorded but never prevents the remaining tokens
 * from being attempted.
 *
 * @param {Array<Object>} tokens - All active token documents for the alias
 * @param {Object} payload - Normalized push payload shared by every token
 * @param {Object} [resolver] - Optional Tangerine resolver
 * @param {Object} [dependencies={}] - Internal dependency injection for tests
 */
async function fanOutToTokens(tokens, payload, resolver, dependencies = {}) {
  const deliver = dependencies.deliverToToken || deliverToToken;
  const recordSuccess =
    dependencies.recordSuccess ||
    ((tokenId) => PushTokens.recordSuccess(tokenId));
  const recordFailure =
    dependencies.recordFailure ||
    ((tokenId) => PushTokens.recordFailure(tokenId));
  const deleteToken =
    dependencies.deleteToken ||
    ((tokenId) => PushTokens.deleteOne({ _id: tokenId }).exec());

  await pMap(
    tokens,
    async (tokenDoc) => {
      try {
        await deliver(tokenDoc, payload, resolver);
        await recordSuccess(tokenDoc._id);
      } catch (err) {
        logger.warn('Push delivery failed', {
          token_id: tokenDoc._id,
          platform: tokenDoc.platform,
          error: err.message
        });
        await (err.isPermanentPushFailure
          ? deleteToken(tokenDoc._id)
          : recordFailure(tokenDoc._id));
      }
    },
    { concurrency: PUSH_CONCURRENCY }
  );
}

/**
 * Normalize a parsed "from" header into a "Name <addr>" string.
 * The MX delivery path sends the decoded header string while the IMAP
 * append path sends WildDuck's parsedHeader.from (an array of
 * { name, address } objects).
 * @param {string|Array} from - The from field
 * @returns {string} "Name <addr>" string or '' if nothing usable
 */
function formatSenderString(from) {
  if (isSANB(from)) return from.trim();
  if (!Array.isArray(from)) return '';

  const addr = from.find((a) => a && (isSANB(a.name) || isSANB(a.address)));
  if (!addr) return '';
  if (isSANB(addr.name) && isSANB(addr.address))
    return `${addr.name.trim()} <${addr.address.trim()}>`;
  return isSANB(addr.name) ? addr.name.trim() : addr.address.trim();
}

/**
 * Extract a human-readable sender display name from a "Name <addr>" string.
 * Falls back to the email address if no display name is present.
 * @param {string} from - The from field (e.g. "John Smith <john@example.com>")
 * @returns {string} The display name or email address
 */
function extractSenderName(from) {
  if (typeof from !== 'string' || from.length === 0) return '';
  // Match "Display Name <email>" format
  const match = from.match(/^\s*"?([^"<]+?)"?\s*</);
  if (match && match[1] && match[1].trim().length > 0) {
    return match[1].trim();
  }

  // Match bare "<email>" format
  const emailMatch = from.match(/<([^>]+)>/);
  if (emailMatch) return emailMatch[1];
  // Bare email or name without angle brackets
  return from.trim();
}

/**
 * Build a platform-agnostic notification payload from the WS event.
 * Sanitizes all string fields to prevent injection.
 */
function buildPayload(event, data) {
  // Silent events carry no title or body at all. Computing them "just in case"
  // is how the generic `You have a new ${event} event` string reached devices
  // in the first place — a transport that forwards whatever it is given (the
  // UnifiedPush body, for one) will happily display it.
  //
  // `suppressAlert` is set by a producer that knows an earlier alert already
  // fired for this message (e.g. the tmp storage sync-back in on-append via
  // sync-temporary-mailbox): deliver the data for cache sync, never re-alert.
  const silent =
    !USER_VISIBLE_PUSH_EVENTS.has(event) ||
    !isAlertWorthyNewMessage(data) ||
    data.suppressAlert === true;

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

  const MAX_TITLE_LENGTH = 128;
  const MAX_BODY_LENGTH = 256;

  let title;
  let body;

  // normalized once and reused for both the title and data payload below
  const senderString = data.message
    ? formatSenderString(data.message.from)
    : '';

  //
  // Gmail-style rich notifications for new messages:
  //   Title = sender name (e.g. "John Smith")
  //   Body  = subject + snippet preview (e.g. "Meeting tomorrow\nHey, just wanted to confirm...")
  //
  // When expanded (BigTextStyle on Android), users see both subject and preview.
  // When collapsed, they see the subject line.
  //
  if (silent) {
    title = undefined;
    body = undefined;
  } else if (event === 'newMessage' && data.message) {
    const senderName = extractSenderName(senderString);
    title = senderName
      ? senderName.slice(0, MAX_TITLE_LENGTH)
      : TITLES.newMessage;
    const subject =
      typeof data.message.subject === 'string' &&
      data.message.subject.length > 0
        ? data.message.subject
        : 'No subject';
    // Include snippet/preview after subject (Gmail shows subject + body preview)
    const snippet =
      typeof data.message.snippet === 'string' &&
      data.message.snippet.length > 0
        ? data.message.snippet.replace(/\s+/g, ' ').trim()
        : '';
    body = snippet
      ? `${subject}\n${snippet}`.slice(0, MAX_BODY_LENGTH)
      : subject.slice(0, MAX_BODY_LENGTH);
  } else {
    // Fallback: use static title with best-effort body
    title = TITLES[event] || 'Forward Email';
    const bodySource = [data.body, data.subject, data.name].find(
      (value) => typeof value === 'string'
    );
    // Never interpolate the raw event name: it is an internal camelCase
    // identifier and reads as gibberish on a lock screen.
    body =
      typeof bodySource === 'string'
        ? bodySource.slice(0, MAX_BODY_LENGTH)
        : event === 'newMessage'
        ? 'You have new mail'
        : 'Open Forward Email for details';
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
  const safeNotificationId =
    typeof data.notificationId === 'string'
      ? data.notificationId.slice(0, 64)
      : '';

  // Include from/subject/snippet so all channels (FCM, APNs, UnifiedPush,
  // WebSocket) deliver consistent notification content to the client.
  const safeFrom = senderString.slice(0, 255);
  const safeSubject =
    data.message && typeof data.message.subject === 'string'
      ? data.message.subject.slice(0, 255)
      : '';
  const safeSnippet =
    data.message && typeof data.message.snippet === 'string'
      ? data.message.snippet.replace(/\s+/g, ' ').trim().slice(0, 255)
      : '';
  return {
    title,
    body,
    event,
    silent,
    data: {
      event,
      alias_id: safeAliasId,
      message_id: safeMessageId,
      mailbox: safeMailbox,
      notificationId: safeNotificationId,
      // NOTE: the key is "sender" and not "from" because "from" is a reserved
      //       word in FCM data payloads and Google rejects the entire message
      //       with 400 INVALID_ARGUMENT if it is present
      sender: safeFrom,
      subject: safeSubject,
      snippet: safeSnippet,
      // Forwarded so clients that draw their own notification from the data
      // payload (Android foreground, web) also skip re-alerting. Kept as a
      // distinct key rather than reusing `silent` because the UnifiedPush
      // body spreads this object after its own boolean silent field.
      ...(data.suppressAlert === true ? { suppressAlert: 'true' } : {})
    }
  };
}

/**
 * Deliver a notification to a specific token based on its platform.
 */
async function deliverToToken(tokenDoc, payload, resolver) {
  switch (tokenDoc.platform) {
    case 'apns': {
      return deliverApns(tokenDoc, payload);
    }

    case 'fcm': {
      return deliverFcm(tokenDoc, payload, resolver);
    }

    case 'unified-push': {
      return deliverUnifiedPush(tokenDoc, payload, resolver);
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
async function deliverApns(
  tokenDoc,
  payload,
  { getProvider = getApnsProvider } = {}
) {
  if (!isApnsConfigured()) {
    logger.debug('APNs not configured, skipping push delivery');
    return;
  }

  const provider = getProvider();
  const bundleId =
    config.pushNotifications?.apnsBundleId ||
    process.env.APNS_BUNDLE_ID ||
    'net.forwardemail.mail';

  const note = new apn.Notification();
  note.topic = bundleId;
  note.expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  note.payload = payload.data;

  if (payload.silent === true) {
    //
    // An `alert` is drawn by iOS before the app sees the payload, so a silent
    // event has to go out as a background push instead: pushType 'background'
    // with content-available and no alert or sound. Priority must be 5 —
    // APNs rejects a background push sent at priority 10.
    //
    // Apple throttles these and only delivers them to an app that declares the
    // `remote-notification` background mode, so treat them as best effort. The
    // WebSocket remains the reliable path for state the client needs promptly.
    //
    note.pushType = 'background';
    note.priority = 5;
    note.contentAvailable = 1;
  } else {
    note.pushType = 'alert';
    note.priority = 10;
    note.alert = {
      title: String(payload.title).slice(0, 128),
      body: String(payload.body).slice(0, 256)
    };
    note.sound = 'default';
  }

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
async function deliverFcm(
  tokenDoc,
  payload,
  resolver,
  { fetch = safeFetch, GoogleAuthClass = GoogleAuth } = {}
) {
  if (!isFcmConfigured()) {
    logger.debug('FCM not configured, skipping push delivery');
    return;
  }

  const projectId =
    config.pushNotifications?.fcmProjectId || process.env.FCM_PROJECT_ID;
  const serviceAccountPath =
    config.pushNotifications?.fcmServiceAccountPath ||
    process.env.FCM_SERVICE_ACCOUNT_PATH;

  // Validate projectId format to prevent URL injection
  if (!/^[a-z][a-z\d-]{4,28}[a-z\d]$/.test(projectId)) {
    throw new Error('Invalid FCM project ID format');
  }

  const auth = new GoogleAuthClass({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });

  const accessToken = await auth.getAccessToken();

  //
  // A `notification` block is what makes Android's FCM SDK draw the
  // notification itself, before the app is handed the payload. Omitting it
  // leaves a data-only message, which is delivered to onMessageReceived and
  // displays nothing — the only way to keep a silent event silent on Android.
  //
  const silent = payload.silent === true;
  const message = {
    message: {
      token: tokenDoc.token,
      ...(silent
        ? {}
        : {
            notification: {
              title: String(payload.title).slice(0, 128),
              body: String(payload.body).slice(0, 256)
            }
          }),
      data: Object.fromEntries(
        Object.entries(payload.data)
          .filter(([k]) => !isFcmReservedDataKey(String(k)))
          .map(([k, v]) => [String(k).slice(0, 64), String(v).slice(0, 255)])
      ),
      android: {
        // Silent events are background state, not something to wake for.
        priority: silent ? 'normal' : 'high',
        ...(silent
          ? {}
          : {
              notification: {
                channel_id: 'new-mail',
                // Use the dedicated monochrome notification icon resource
                // (defined in the Android app as res/drawable/ic_notification)
                icon: 'ic_notification'
              }
            })
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
    body: JSON.stringify(message),
    bodyTimeout: 10_000,
    headersTimeout: 10_000,
    resolver
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    const responseBody = await response.body.text();
    // 404 = token not found (unregistered)
    if (response.statusCode === 404) {
      throw new Error('FCM token not registered (404)');
    }

    throw new Error(
      `FCM delivery failed (${response.statusCode}): ${responseBody.slice(
        0,
        200
      )}`
    );
  }
}

/**
 * Parse the canonical RFC 8291 subscription stored for UnifiedPush.
 * Legacy endpoint-only records are intentionally treated as permanently
 * invalid because they do not contain the client key material required to
 * encrypt a payload.
 */
function parseUnifiedPushSubscription(token) {
  let subscription;
  try {
    subscription = JSON.parse(token);
  } catch (err) {
    throw createPermanentPushError(
      'UnifiedPush subscription is not valid JSON',
      err
    );
  }

  if (
    !subscription ||
    typeof subscription.endpoint !== 'string' ||
    !subscription.keys ||
    typeof subscription.keys.p256dh !== 'string' ||
    typeof subscription.keys.auth !== 'string'
  ) {
    throw createPermanentPushError('UnifiedPush subscription is incomplete');
  }

  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }
  };
}

/**
 * Deliver an RFC 8291 encrypted payload to a UnifiedPush distributor.
 *
 * Android's UnifiedPush connector decrypts the aes128gcm content before the
 * application callback receives it. VAPID binds delivery to the application
 * server key whose public half was supplied during connector registration.
 * The encrypted request is sent through safeFetch so DNS is resolved once,
 * validated, and pinned to the outbound connection.
 */
async function deliverUnifiedPush(
  tokenDoc,
  payload,
  resolver,
  {
    generateRequestDetails = webPush.generateRequestDetails,
    fetch = safeFetch
  } = {}
) {
  if (!isVapidConfigured()) {
    logger.debug('VAPID not configured, skipping UnifiedPush delivery');
    return;
  }

  const subscription = parseUnifiedPushSubscription(tokenDoc.token);
  const parsed = new URL(subscription.endpoint);
  if (parsed.protocol !== 'https:') {
    throw createPermanentPushError(
      'Only HTTPS URLs are allowed for push delivery'
    );
  }

  if (parsed.username || parsed.password) {
    throw createPermanentPushError(
      'Push endpoint must not contain credentials'
    );
  }

  // The Android client displays whatever title/body it is handed when the app
  // is backgrounded, so a silent event must not carry them. `silent` is sent
  // explicitly as well so the client can distinguish a deliberately silent
  // event from an older server that simply omitted the strings.
  const body = JSON.stringify({
    event: payload.event,
    ...(payload.silent === true
      ? { silent: true }
      : { title: payload.title, body: payload.body }),
    ...payload.data
  });

  try {
    const request = generateRequestDetails(subscription, body, {
      TTL: 60,
      urgency: 'high',
      contentEncoding: 'aes128gcm',
      vapidDetails: getVapidDetails()
    });
    const response = await fetch(request.endpoint, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      bodyTimeout: 10_000,
      headersTimeout: 10_000,
      resolver
    });
    const responseBody = await response.body.text();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      const error = new Error('UnifiedPush endpoint returned an error');
      error.statusCode = response.statusCode;
      error.body = responseBody;
      throw error;
    }

    return { statusCode: response.statusCode };
  } catch (err) {
    const statusCode = Number(err.statusCode);
    const details =
      typeof err.body === 'string' && err.body
        ? `: ${err.body.slice(0, 200)}`
        : '';
    const message = `UnifiedPush delivery failed (${
      statusCode || 'network'
    })${details}`;

    // RFC 8030: 404/410 mean the subscription is no longer valid and must not
    // be retried. Other statuses retain the normal consecutive-failure policy.
    if (statusCode === 404 || statusCode === 410) {
      throw createPermanentPushError(message, err);
    }

    throw new Error(message, { cause: err });
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
  PUSH_CONCURRENCY,
  fanOutToTokens,
  buildPayload,
  isAlertWorthyNewMessage,
  extractSenderName,
  formatSenderString,
  deliverToToken,
  deliverApns,
  deliverFcm,
  deliverUnifiedPush,
  deliverWebPush,
  parseUnifiedPushSubscription,
  isApnsConfigured,
  isFcmConfigured,
  isVapidConfigured,
  getVapidDetails,
  validateOutboundUrl
};
