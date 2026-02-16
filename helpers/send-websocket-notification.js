/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const { encoder } = require('#helpers/encoder-decoder');
const logger = require('#helpers/logger');

/**
 * Valid WebSocket event types.
 *
 * IMAP events:
 *   - newMessage          New message appended (APPEND / delivery)
 *   - messagesMoved       Messages moved between mailboxes (MOVE)
 *   - messagesCopied      Messages copied between mailboxes (COPY)
 *   - flagsUpdated        Message flags changed (STORE / implicit \Seen via FETCH)
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
  'addressBookDeleted',
  // App releases
  'newRelease'
]);

/**
 * Publish a WebSocket notification to Redis pub/sub for delivery
 * to connected WebSocket clients on the API server.
 *
 * This is a fire-and-forget helper (mirrors sendApn / sendApnCalendar
 * / sendApnContacts patterns).  It publishes a msgpackr-encoded Buffer
 * to the shared Redis channel via `publishBuffer`; the ApiWebSocketHandler
 * on the API server picks it up via `messageBuffer` and fans it out to
 * every WebSocket connection that is authenticated for the given alias.
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
 */
function sendWebSocketNotification(client, aliasId, event, data = {}) {
  if (!client) return;
  if (!aliasId) return;
  if (!event) return;

  if (!VALID_EVENTS.has(event)) {
    logger.warn('Unknown WebSocket event type', { event, aliasId });
  }

  try {
    const packed = encoder.pack({
      aliasId: aliasId.toString(),
      payload: {
        event,
        timestamp: Date.now(),
        ...data
      }
    });
    client.publishBuffer(config.WS_REDIS_CHANNEL_NAME, packed);
  } catch (err) {
    logger.fatal(err, { aliasId, event });
  }
}

module.exports = sendWebSocketNotification;
module.exports.VALID_EVENTS = VALID_EVENTS;
