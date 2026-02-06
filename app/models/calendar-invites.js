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
 * This model stores calendar invite responses (Accept/Decline/Tentative)
 * in MongoDB as a queue. When users click response links in invitation emails,
 * the response is stored here. The CalDAV server processes these responses
 * when the organizer next interacts with CalDAV (via middleware), updating
 * the SQLite calendar event and then deleting the queue entry.
 *
 * This architecture ensures:
 * 1. Web routes never directly access SQLite (which requires session/instance)
 * 2. Responses are processed in the context of an authenticated CalDAV session
 * 3. Clean separation between web layer (MongoDB) and CalDAV layer (SQLite)
 *
 * Documents are automatically deleted after 30 days via TTL index on created_at.
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
    // Used to find the correct user's calendar when processing
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

    // The attendee's email address who is responding
    attendeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    //
    // Response information
    //

    // The attendee's response (PARTSTAT value)
    // RFC 5545 Section 3.2.12
    response: {
      type: String,
      required: true,
      enum: ['ACCEPTED', 'DECLINED', 'TENTATIVE'],
      index: true
    },

    // Optional comment from the attendee
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    //
    // Processing status
    //

    // Whether this response has been processed
    // Set to true after successfully updating the CalendarEvent
    processed: {
      type: Boolean,
      default: false,
      index: true
    },

    // When the response was processed
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

    // IP address of the responder (for rate limiting and audit)
    ip: {
      type: String,
      index: true
    },

    // User agent of the responder
    userAgent: {
      type: String
    },

    // Token hash (for preventing replay attacks)
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

    // Source of the response (web = response link click, imip = incoming email)
    source: {
      type: String,
      enum: ['web', 'imip'],
      default: 'web',
      index: true
    },

    // Message-ID of the source email (for iMIP responses)
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

// Find unprocessed responses for a specific organizer
CalendarInvites.index({ organizerEmail: 1, processed: 1, created_at: 1 });

// Find responses for a specific event
CalendarInvites.index({ eventUid: 1, attendeeEmail: 1 });

// Rate limiting: find recent responses from an IP
CalendarInvites.index({ ip: 1, created_at: 1 });

// Rate limiting: find recent responses for an attendee/event combo
CalendarInvites.index({ eventUid: 1, attendeeEmail: 1, created_at: 1 });

CalendarInvites.plugin(mongooseCommonPlugin, {
  object: 'calendar_invite',
  omitExtraFields: ['tokenHash', 'ip', 'userAgent'],
  defaultLocale: i18n.config.defaultLocale
});

module.exports = mongoose.model('CalendarInvites', CalendarInvites);
