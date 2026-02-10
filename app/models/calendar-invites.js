/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const i18n = require('#helpers/i18n');

/**
 * CalendarInvites Model
 *
 * This model stores calendar invite messages (all iTIP methods) in MongoDB
 * as a processing queue. Messages arrive via:
 * - Web routes: when attendees click Accept/Decline/Tentative links
 * - iMIP pipeline: when emails with text/calendar parts are received
 *
 * The CalDAV server processes these during authentication, updating the
 * user's SQLite calendar database accordingly.
 *
 * Supported iTIP methods (RFC 5546):
 * - REPLY: Attendee response → updates PARTSTAT in organizer's event
 * - REQUEST: Organizer invite → creates/updates event in attendee's calendar
 * - CANCEL: Organizer cancellation → sets STATUS:CANCELLED in attendee's calendar
 * - ADD: Organizer adds instance → merges recurrence into attendee's event
 * - REFRESH: Attendee requests re-send → organizer re-sends current event
 * - COUNTER: Attendee counter-proposal → queued for organizer review
 * - DECLINECOUNTER: Organizer declines counter → attendee notified
 *
 * This architecture ensures:
 * 1. Web routes never directly access SQLite (which requires session/instance)
 * 2. Responses are processed in the context of an authenticated CalDAV session
 * 3. Clean separation between web layer (MongoDB) and CalDAV layer (SQLite)
 *
 * Documents are automatically deleted after 30 days via TTL index on created_at.
 *
 * @see https://tools.ietf.org/html/rfc5546 - iTIP
 * @see https://tools.ietf.org/html/rfc6047 - iMIP
 */

const CalendarInvites = new mongoose.Schema(
  {
    //
    // Event identification
    //

    // The UID from the iCalendar event (VEVENT UID property)
    // This is the unique identifier for the event across all calendars
    eventUid: {
      type: String,
      required: true,
      index: true
    },

    // The organizer's email address (from ORGANIZER property)
    // For REPLY/REFRESH/COUNTER: the organizer who should process this
    // For REQUEST/CANCEL/ADD: the recipient (attendee) who should process this
    organizerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    //
    // Attendee information
    //

    // The attendee's email address who is responding or being invited
    attendeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    //
    // iTIP method and response
    //

    // The iTIP method (RFC 5546)
    // Determines how this invite should be processed
    method: {
      type: String,
      required: true,
      enum: [
        'REPLY',
        'REQUEST',
        'CANCEL',
        'ADD',
        'REFRESH',
        'COUNTER',
        'DECLINECOUNTER',
        'PUBLISH'
      ],
      default: 'REPLY',
      index: true
    },

    // The attendee's response (PARTSTAT value)
    // RFC 5545 Section 3.2.12
    response: {
      type: String,
      required: true,
      enum: [
        'ACCEPTED',
        'DECLINED',
        'TENTATIVE',
        'NEEDS-ACTION',
        'DELEGATED',
        'CANCELLED'
      ],
      index: true
    },

    // Optional comment from the attendee
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    //
    // Raw ICS data (for REQUEST/CANCEL/ADD/COUNTER/DECLINECOUNTER)
    //

    // Full raw ICS data for methods that need the complete calendar object
    // Not stored for REPLY (only PARTSTAT is needed)
    rawIcs: {
      type: String,
      maxlength: 100_000
    },

    // SEQUENCE number from the iTIP message
    // Used to detect stale messages (older sequence = stale)
    sequence: {
      type: Number,
      default: 0
    },

    //
    // Processing status
    //

    // Whether this message has been processed
    // Set to true after successfully updating the CalendarEvent
    processed: {
      type: Boolean,
      default: false,
      index: true
    },

    // When the message was processed
    processedAt: {
      type: Date
    },

    // Error message if processing failed
    processError: {
      type: String
    },

    // Number of processing attempts
    processAttempts: {
      type: Number,
      default: 0
    },

    //
    // Security and tracking
    //

    // IP address of the sender (for rate limiting and audit)
    ip: {
      type: String,
      index: true
    },

    // User agent of the sender
    userAgent: {
      type: String
    },

    // Token hash (for preventing replay attacks on web responses)
    // Store hash of the token, not the token itself
    tokenHash: {
      type: String,
      index: true
    },

    // When the token expires (required for web responses, optional for iMIP)
    tokenExpiresAt: {
      type: Date,
      required: false,
      index: true
    },

    // Source of the message (web = response link click, imip = incoming email)
    source: {
      type: String,
      enum: ['web', 'imip'],
      default: 'web',
      index: true
    },

    // Message-ID of the source email (for iMIP messages)
    sourceMessageId: {
      type: String,
      index: true
    },

    //
    // TTL field for automatic cleanup
    //

    // When this document was created - used for TTL expiration
    // All documents are automatically deleted after 30 days
    created_at: {
      type: Date,
      default: Date.now,
      expires: '30d',
      index: true
    }
  },
  {
    timestamps: {
      createdAt: false, // We use created_at with TTL instead
      updatedAt: 'updated_at'
    }
  }
);

// Compound indexes for efficient querying

// Find unprocessed responses for a specific organizer (REPLY processing)
CalendarInvites.index({ organizerEmail: 1, processed: 1, created_at: 1 });

// Find responses for a specific event
CalendarInvites.index({ eventUid: 1, attendeeEmail: 1 });

// Rate limiting: find recent responses from an IP
CalendarInvites.index({ ip: 1, created_at: 1 });

// Rate limiting: find recent responses for an attendee/event combo
CalendarInvites.index({ eventUid: 1, attendeeEmail: 1, created_at: 1 });

// Find unprocessed invites by method (for REQUEST/CANCEL/ADD processing)
CalendarInvites.index({ method: 1, organizerEmail: 1, processed: 1 });

// Find unprocessed invites by method and event UID
CalendarInvites.index({ method: 1, eventUid: 1, processed: 1 });

CalendarInvites.plugin(mongooseCommonPlugin, {
  object: 'calendar_invite',
  omitExtraFields: ['tokenHash', 'ip', 'userAgent', 'rawIcs'],
  defaultLocale: i18n.config.defaultLocale
});

module.exports = mongoose.model('CalendarInvites', CalendarInvites);
