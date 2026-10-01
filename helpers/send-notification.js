/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const config = require('#config');
const { encoder } = require('#helpers/encoder-decoder');
const logger = require('#helpers/logger');
const sendPushNotification = require('#helpers/send-push-notification');

// Maximum outbound payload size (1 MB) — payloads exceeding this limit
// have large string fields stripped to prevent Redis pub/sub abuse
const MAX_NOTIFICATION_PAYLOAD = 1024 * 1024;

// Fields that may contain large string data (eml, vCard, iCal)
const LARGE_FIELDS = ['eml', 'content', 'ical'];

/**
 * Valid realtime notification event types.
 *
 * IMAP events:
 *   - newMessage          New message appended (APPEND / delivery)
 *   - messagesMoved       Messages moved between mailboxes (MOVE)
 *   - messagesCopied      Messages copied between mailboxes (COPY)
 *   - flagsUpdated        Message flags changed (STORE / implicit \Seen via FETCH)
 *   - labelsUpdated       Message custom labels/keywords changed (REST PUT / STORE)
 *   - messagesExpunged    Messages permanently removed (EXPUNGE)
 *   - mailboxCreated      New mailbox created (CREATE)
 *   - mailboxDeleted      Mailbox deleted (DELETE)
 *   - mailboxRenamed      Mailbox renamed (RENAME)
 *
 * CalDAV events:
 *   - calendarCreated     New calendar created (MKCALENDAR)
 *   - calendarUpdated     Calendar properties updated (PROPPATCH)
 *   - calendarDeleted     Calendar deleted (DELETE)
 *   - calendarEventCreated  New calendar event created (PUT)
 *   - calendarEventUpdated  Calendar event updated (PUT)
 *   - calendarEventDeleted  Calendar event deleted (DELETE)
 *
 * CardDAV events:
 *   - contactCreated      New contact created (PUT)
 *   - contactUpdated      Contact updated (PUT)
 *   - contactDeleted      Contact deleted (DELETE)
 *   - addressBookCreated  New address book created (MKCOL)
 *   - addressBookUpdated  Address book properties updated (PROPPATCH)
 *   - addressBookDeleted  Address book deleted (DELETE)
 *
 * App release events:
 *   - newRelease          New GitHub release published for the mail app
 *                         (https://github.com/forwardemail/mail.forwardemail.net)
 */
const VALID_EVENTS = new Set([
  // IMAP
  'newMessage',
  'messagesMoved',
  'messagesCopied',
  'flagsUpdated',
  'labelsUpdated',
  'messagesExpunged',
  'mailboxCreated',
  'mailboxDeleted',
  'mailboxRenamed',
  // CalDAV
  'calendarCreated',
  'calendarUpdated',
  'calendarDeleted',
  'calendarEventCreated',
  'calendarEventUpdated',
  'calendarEventDeleted',
  // CardDAV
  'contactCreated',
  'contactUpdated',
  'contactDeleted',
  'addressBookCreated',
  'addressBookUpdated',
  'addressBookDeleted',
  // App releases
  'newRelease'
]);

/**
 * Deliver one per-alias realtime event over BOTH push and WebSocket.
 *
 * This fire-and-forget coordinator creates exactly one immutable
 * `notificationId`, starts `sendPushNotification` for every active device
 * token belonging to the alias, and publishes the same msgpackr-encoded
 * payload to the shared Redis channel for WebSocket fan-out. The two delivery
 * promises run independently and concurrently: push does not depend on the
 * Redis subscriber finding an active socket, and a push-provider failure does
 * not suppress WebSocket publication (or vice versa).
 *
 * `sendPushNotification` performs an atomic Redis claim keyed by this immutable
 * notification ID and bounded parallel per-token fan-out. Every active token is
 * attempted once, while a retry of the same envelope cannot duplicate provider
 * delivery across processes.
 *
 * The `data` parameter should contain the full resource object that mirrors
 * the corresponding REST API response:
 *   - For message events: full message object with `eml` (raw email string)
 *   - For contact events: full contact object with `content` (vCard string)
 *   - For calendar events: full calendar event object with `ical` (iCal string)
 *   - For calendar events: full calendar object
 *
 * @param {Object} client - Redis client instance
 * @param {string} aliasId - The alias ID to notify
 * @param {string} event - The event name (must be one of VALID_EVENTS)
 * @param {Object} [data={}] - Additional event data (enriched resource payload)
 * @returns {string|undefined} The immutable notification ID when accepted
 */
function sendNotification(client, aliasId, event, data = {}) {
  return sendNotificationWithDependencies({ client, aliasId, event, data });
}

function sendNotificationWithDependencies({
  client,
  aliasId,
  event,
  data = {},
  pushNotificationSender = sendPushNotification,
  resolver
}) {
  if (!client) return;
  if (!aliasId) return;
  if (!event) return;

  if (!VALID_EVENTS.has(event)) {
    logger.warn('Unknown realtime notification event type', {
      event,
      aliasId
    });
  }

  try {
    const message = {
      aliasId: aliasId.toString(),
      payload: {
        ...data,
        event,
        timestamp: Date.now(),
        notificationId: randomUUID()
      }
    };

    let packed = encoder.pack(message);

    // If the packed payload exceeds the size limit, strip large string fields
    if (packed.length > MAX_NOTIFICATION_PAYLOAD) {
      logger.warn('Realtime notification payload exceeds size limit', {
        aliasId,
        event,
        originalSize: packed.length
      });

      const { payload } = message;
      // Recursively walk nested objects (max 4 levels) to find large string fields
      // (covers payload.message.eml, payload.data.contact.content, etc.)
      const truncateDeep = (obj, depth = 0) => {
        if (depth > 4 || !obj || typeof obj !== 'object' || Array.isArray(obj))
          return;
        for (const field of LARGE_FIELDS) {
          if (typeof obj[field] === 'string') {
            obj[field] = { truncated: true };
          }
        }

        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            truncateDeep(val, depth + 1);
          }
        }
      };

      truncateDeep(payload);

      packed = encoder.pack(message);
    }

    // Eagerly release large string references from the payload object
    // so GC can reclaim them while the async publish is in flight.
    // The `packed` buffer already contains the serialized form.
    if (message.payload) {
      const nullifyDeep = (obj, depth = 0) => {
        if (depth > 4 || !obj || typeof obj !== 'object' || Array.isArray(obj))
          return;
        for (const field of LARGE_FIELDS) {
          if (typeof obj[field] === 'string' && obj[field].length > 1024) {
            obj[field] = null;
          }
        }

        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            nullifyDeep(val, depth + 1);
          }
        }
      };

      nullifyDeep(message.payload);
    }

    // Push and WebSocket are intentionally started here, from the same
    // immutable payload.  Neither transport is conditional on the other.
    const deliveries = [
      {
        transport: 'push',
        promise: Promise.resolve().then(() =>
          pushNotificationSender(
            client,
            message.aliasId,
            event,
            message.payload,
            resolver
          )
        )
      },
      {
        transport: 'websocket',
        promise: Promise.resolve().then(() =>
          client.publishBuffer(config.WS_REDIS_CHANNEL_NAME, packed)
        )
      }
    ];

    Promise.allSettled(deliveries.map(({ promise }) => promise))
      .then((results) => {
        for (const [index, result] of results.entries()) {
          if (result.status === 'rejected') {
            logger.fatal(result.reason, {
              aliasId,
              event,
              notificationId: message.payload.notificationId,
              transport: deliveries[index].transport
            });
          }
        }
      })
      .catch((err) =>
        logger.fatal(err, {
          aliasId,
          event,
          notificationId: message.payload.notificationId
        })
      );

    return message.payload.notificationId;
  } catch (err) {
    logger.fatal(err, { aliasId, event });
  }
}

//
// A change to many messages (an EXPUNGE of a large folder, a STORE on 1:*)
// is sent as several events of at most this many UIDs, so that no event
// comes near MAX_NOTIFICATION_PAYLOAD.  The lists named in `keys` are cut
// in step (e.g. `sourceUid` and `destinationUid`); each event has its own
// notificationId.
//
const MAX_UIDS_PER_NOTIFICATION = 1000;

// eslint-disable-next-line max-params
function sendNotificationInChunks(client, aliasId, event, data, keys) {
  const length = Math.max(
    0,
    ...keys.map((key) => (Array.isArray(data[key]) ? data[key].length : 0))
  );
  if (length <= MAX_UIDS_PER_NOTIFICATION)
    return sendNotification(client, aliasId, event, data);

  for (let i = 0; i < length; i += MAX_UIDS_PER_NOTIFICATION) {
    const chunk = { ...data };
    for (const key of keys) {
      if (Array.isArray(data[key]))
        chunk[key] = data[key].slice(i, i + MAX_UIDS_PER_NOTIFICATION);
    }

    sendNotification(client, aliasId, event, chunk);
  }
}

module.exports = sendNotification;
module.exports.VALID_EVENTS = VALID_EVENTS;
module.exports.MAX_UIDS_PER_NOTIFICATION = MAX_UIDS_PER_NOTIFICATION;
module.exports.inChunks = sendNotificationInChunks;
module.exports._test = { sendNotificationWithDependencies };
