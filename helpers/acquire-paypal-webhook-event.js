/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const PAYPAL_WEBHOOK_EVENT_TTL = ms('7d');

/**
 * Return a non-sensitive Redis key for a PayPal webhook event ID.
 *
 * @param   {string} eventId Verified PayPal event ID
 * @returns {string}
 */
function getPayPalWebhookEventKey(eventId) {
  if (!isSANB(eventId)) throw new TypeError('PayPal webhook event ID missing');

  return `paypal_webhook_event:${crypto
    .createHash('sha256')
    .update(eventId)
    .digest('hex')}`;
}

/**
 * Atomically reserve a verified PayPal webhook event for processing.
 *
 * The reservation intentionally remains for the full replay-protection window
 * if downstream processing fails. Retrying a partially handled event can
 * repeat irreversible billing, dispute, or account actions. Redis failures
 * are propagated so PayPal receives a retryable delivery failure instead of
 * silently processing an event without replay protection.
 *
 * @param   {object}  client Redis-compatible client
 * @param   {string}  eventId Verified PayPal event ID
 * @returns {Promise<boolean>} Whether this delivery should be processed
 */
async function acquirePayPalWebhookEvent(client, eventId) {
  if (!client || typeof client.set !== 'function')
    throw new TypeError(
      'Redis client missing for PayPal webhook deduplication'
    );

  const result = await client.set(
    getPayPalWebhookEventKey(eventId),
    '1',
    'PX',
    PAYPAL_WEBHOOK_EVENT_TTL,
    'NX'
  );

  return result === 'OK';
}

module.exports = acquirePayPalWebhookEvent;
module.exports.getPayPalWebhookEventKey = getPayPalWebhookEventKey;
module.exports.PAYPAL_WEBHOOK_EVENT_TTL = PAYPAL_WEBHOOK_EVENT_TTL;
