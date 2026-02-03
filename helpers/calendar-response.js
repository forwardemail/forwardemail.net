/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Calendar Response Helper
 **
 * Generates and parses encrypted tokens for calendar invite response links.
 * These tokens allow attendees to Accept/Decline/Tentative invitations
 * without requiring authentication.
 *
 * Token format (encrypted payload):
 * {
 *   eventUid: string,       // iCalendar UID of the event
 *   organizerEmail: string, // Email of the event organizer
 *   attendeeEmail: string,  // Email of the attendee responding
 *   expiresAt: number,      // Unix timestamp when token expires
 *   v: number               // Token version for future compatibility
 * }
 */

const crypto = require('node:crypto');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');
const config = require('#config');

// Token expiration time (30 days)
const TOKEN_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;

// Current token version
const TOKEN_VERSION = 1;

/**
 * Generate an encrypted token for a calendar response link
 *
 * @param {Object} options
 * @param {string} options.eventUid - The iCalendar UID of the event
 * @param {string} options.organizerEmail - The organizer's email address
 * @param {string} options.attendeeEmail - The attendee's email address
 * @returns {string} Encrypted token (URL-safe)
 */
function generateToken({ eventUid, organizerEmail, attendeeEmail }) {
  if (!eventUid) throw new TypeError('eventUid is required');
  if (!organizerEmail) throw new TypeError('organizerEmail is required');
  if (!attendeeEmail) throw new TypeError('attendeeEmail is required');

  const payload = {
    eventUid,
    organizerEmail: organizerEmail.toLowerCase().trim(),
    attendeeEmail: attendeeEmail.toLowerCase().trim(),
    expiresAt: Date.now() + TOKEN_EXPIRATION_MS,
    v: TOKEN_VERSION
  };

  // Encrypt the payload (uses AES-256-GCM with base64url encoding)
  return encrypt(JSON.stringify(payload));
}

/**
 * Parse and validate an encrypted token
 *
 * @param {string} token - The encrypted token
 * @returns {Object} Parsed token payload
 * @throws {Error} If token is invalid or expired
 */
function parseToken(token) {
  if (!token) throw new TypeError('Token is required');

  let payload;
  try {
    const decrypted = decrypt(token);
    payload = JSON.parse(decrypted);
  } catch {
    const error = new Error('Invalid token');
    error.code = 'INVALID_TOKEN';
    throw error;
  }

  // Validate required fields
  if (!payload.eventUid || !payload.organizerEmail || !payload.attendeeEmail) {
    const error = new Error('Invalid token payload');
    error.code = 'INVALID_TOKEN';
    throw error;
  }

  // Check expiration
  if (!payload.expiresAt || Date.now() > payload.expiresAt) {
    const error = new Error('Token has expired');
    error.code = 'TOKEN_EXPIRED';
    throw error;
  }

  return {
    eventUid: payload.eventUid,
    organizerEmail: payload.organizerEmail.toLowerCase().trim(),
    attendeeEmail: payload.attendeeEmail.toLowerCase().trim(),
    expiresAt: new Date(payload.expiresAt),
    version: payload.v || 1
  };
}

/**
 * Generate a hash of the token for storage (to prevent replay attacks)
 *
 * @param {string} token - The encrypted token
 * @returns {string} SHA-256 hash of the token
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Convert a response type to PARTSTAT value
 *
 * @param {string} response - Response type ('accept', 'decline', 'tentative')
 * @returns {string} PARTSTAT value ('ACCEPTED', 'DECLINED', 'TENTATIVE')
 */
function responseToPartstat(response) {
  const map = {
    accept: 'ACCEPTED',
    decline: 'DECLINED',
    tentative: 'TENTATIVE'
  };

  const partstat = map[response?.toLowerCase()];
  if (!partstat) {
    throw new TypeError(`Invalid response type: ${response}`);
  }

  return partstat;
}

/**
 * Generate response links for an event invitation
 *
 * @param {Object} options
 * @param {string} options.eventUid - The iCalendar UID of the event
 * @param {string} options.organizerEmail - The organizer's email address
 * @param {string} options.attendeeEmail - The attendee's email address
 * @returns {Object} Object with accept, decline, and tentative URLs
 */
function generateResponseLinks({ eventUid, organizerEmail, attendeeEmail }) {
  const token = generateToken({ eventUid, organizerEmail, attendeeEmail });
  const baseUrl = config.urls.web;

  return {
    accept: `${baseUrl}/calendar/respond/accept/${token}`,
    decline: `${baseUrl}/calendar/respond/decline/${token}`,
    tentative: `${baseUrl}/calendar/respond/tentative/${token}`
  };
}

module.exports = {
  generateToken,
  parseToken,
  hashToken,
  responseToPartstat,
  generateResponseLinks,
  TOKEN_EXPIRATION_MS,
  TOKEN_VERSION
};
