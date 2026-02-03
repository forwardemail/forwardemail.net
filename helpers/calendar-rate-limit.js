/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Calendar Rate Limit Helper
 **
 * Provides Redis-based rate limiting for calendar invite responses
 * to prevent spam and abuse.
 *
 * Rate limits:
 * - Response cooldown: 5 seconds between responses (same attendee/event)
 * - Per-attendee-per-event: 10 responses per hour
 * - Per-IP: 50 responses per hour
 */

const ms = require('ms');

// Rate limit constants
const RESPONSE_COOLDOWN_MS = ms('5s');
const ATTENDEE_EVENT_LIMIT = 10; // per hour
const IP_LIMIT = 50; // per hour
const RATE_LIMIT_WINDOW_MS = ms('1h');

// Redis key prefixes
const KEY_PREFIX = 'calendar:response:';
const COOLDOWN_PREFIX = `${KEY_PREFIX}cooldown:`;
const ATTENDEE_EVENT_PREFIX = `${KEY_PREFIX}attendee:`;
const IP_PREFIX = `${KEY_PREFIX}ip:`;
const LAST_RESPONSE_PREFIX = `${KEY_PREFIX}last:`;

/**
 * Check if a response is rate limited
 *
 * @param {Object} client - Redis client
 * @param {Object} options
 * @param {string} options.eventUid - Event UID
 * @param {string} options.attendeeEmail - Attendee email
 * @param {string} options.ip - IP address
 * @returns {Promise<Object>} { limited: boolean, reason?: string, retryAfter?: number }
 */
async function checkRateLimit(client, { eventUid, attendeeEmail, ip }) {
  if (!client) {
    // If no Redis client, skip rate limiting (for testing)
    return { limited: false };
  }

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Check cooldown (5 second minimum between responses)
  const cooldownKey = `${COOLDOWN_PREFIX}${eventUid}:${attendeeEmail}`;
  const lastResponseTime = await client.get(cooldownKey);
  if (
    lastResponseTime &&
    now - Number.parseInt(lastResponseTime, 10) < RESPONSE_COOLDOWN_MS
  ) {
    const retryAfter =
      RESPONSE_COOLDOWN_MS - (now - Number.parseInt(lastResponseTime, 10));
    return {
      limited: true,
      reason: 'Please wait a few seconds before responding again',
      retryAfter: Math.ceil(retryAfter / 1000)
    };
  }

  // Check per-attendee-per-event limit (10 per hour)
  const attendeeEventKey = `${ATTENDEE_EVENT_PREFIX}${eventUid}:${attendeeEmail}`;
  const attendeeEventCount = await client.zcount(
    attendeeEventKey,
    windowStart,
    '+inf'
  );
  if (attendeeEventCount >= ATTENDEE_EVENT_LIMIT) {
    return {
      limited: true,
      reason: 'Too many responses for this event. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
    };
  }

  // Check per-IP limit (50 per hour)
  if (ip) {
    const ipKey = `${IP_PREFIX}${ip}`;
    const ipCount = await client.zcount(ipKey, windowStart, '+inf');
    if (ipCount >= IP_LIMIT) {
      return {
        limited: true,
        reason:
          'Too many requests from your IP address. Please try again later.',
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
      };
    }
  }

  return { limited: false };
}

/**
 * Record a response for rate limiting
 *
 * @param {Object} client - Redis client
 * @param {Object} options
 * @param {string} options.eventUid - Event UID
 * @param {string} options.attendeeEmail - Attendee email
 * @param {string} options.ip - IP address
 * @param {string} options.response - Response type (ACCEPTED, DECLINED, TENTATIVE)
 * @returns {Promise<void>}
 */
async function recordResponse(
  client,
  { eventUid, attendeeEmail, ip, response }
) {
  if (!client) return;

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const expireSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) + 60; // Add 60s buffer

  // Use pipeline for atomic operations
  const pipeline = client.pipeline();

  // Set cooldown
  const cooldownKey = `${COOLDOWN_PREFIX}${eventUid}:${attendeeEmail}`;
  pipeline.set(
    cooldownKey,
    now.toString(),
    'EX',
    Math.ceil(RESPONSE_COOLDOWN_MS / 1000) + 1
  );

  // Add to per-attendee-per-event sorted set
  const attendeeEventKey = `${ATTENDEE_EVENT_PREFIX}${eventUid}:${attendeeEmail}`;
  pipeline.zadd(attendeeEventKey, now, now.toString());
  pipeline.zremrangebyscore(attendeeEventKey, '-inf', windowStart); // Cleanup old entries
  pipeline.expire(attendeeEventKey, expireSeconds);

  // Add to per-IP sorted set
  if (ip) {
    const ipKey = `${IP_PREFIX}${ip}`;
    pipeline.zadd(ipKey, now, `${now}:${eventUid}`);
    pipeline.zremrangebyscore(ipKey, '-inf', windowStart); // Cleanup old entries
    pipeline.expire(ipKey, expireSeconds);
  }

  // Store last response type (for duplicate detection)
  const lastResponseKey = `${LAST_RESPONSE_PREFIX}${eventUid}:${attendeeEmail}`;
  pipeline.set(lastResponseKey, response, 'EX', expireSeconds);

  await pipeline.exec();
}

/**
 * Check if this is a duplicate response (same response type as last time)
 *
 * @param {Object} client - Redis client
 * @param {Object} options
 * @param {string} options.eventUid - Event UID
 * @param {string} options.attendeeEmail - Attendee email
 * @param {string} options.response - Response type (ACCEPTED, DECLINED, TENTATIVE)
 * @returns {Promise<boolean>} True if this is a duplicate
 */
async function isDuplicateResponse(
  client,
  { eventUid, attendeeEmail, response }
) {
  if (!client) return false;

  const lastResponseKey = `${LAST_RESPONSE_PREFIX}${eventUid}:${attendeeEmail}`;
  const lastResponse = await client.get(lastResponseKey);

  return lastResponse === response;
}

module.exports = {
  checkRateLimit,
  recordResponse,
  isDuplicateResponse,
  RESPONSE_COOLDOWN_MS,
  ATTENDEE_EVENT_LIMIT,
  IP_LIMIT,
  RATE_LIMIT_WINDOW_MS
};
