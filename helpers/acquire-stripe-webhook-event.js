/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

//
// Stripe retries an event for up to three days, and a signed event can be
// sent again by anyone who captured it within the signature tolerance, so
// each event ID is only processed once (the same as PayPal webhook events,
// see acquire-paypal-webhook-event.js).
//
const STRIPE_WEBHOOK_EVENT_TTL = ms('7d');

/**
 * Return a non-sensitive Redis key for a Stripe webhook event ID.
 *
 * @param   {string} eventId Verified Stripe event ID
 * @returns {string}
 */
function getStripeWebhookEventKey(eventId) {
  if (!isSANB(eventId)) throw new TypeError('Stripe webhook event ID missing');

  return `stripe_webhook_event:${crypto
    .createHash('sha256')
    .update(eventId)
    .digest('hex')}`;
}

/**
 * Atomically reserve a verified Stripe webhook event for processing.
 *
 * The reservation is kept when processing fails, since retrying a partially
 * handled event could repeat billing or account actions (failures are
 * emailed to admins).  Redis failures are thrown so Stripe gets a failed
 * delivery and retries it, rather than the event being processed without
 * replay protection.
 *
 * @param   {object}  client Redis-compatible client
 * @param   {string}  eventId Verified Stripe event ID
 * @returns {Promise<boolean>} Whether this delivery should be processed
 */
async function acquireStripeWebhookEvent(client, eventId) {
  if (!client || typeof client.set !== 'function')
    throw new TypeError(
      'Redis client missing for Stripe webhook deduplication'
    );

  const result = await client.set(
    getStripeWebhookEventKey(eventId),
    '1',
    'PX',
    STRIPE_WEBHOOK_EVENT_TTL,
    'NX'
  );

  return result === 'OK';
}

module.exports = acquireStripeWebhookEvent;
module.exports.getStripeWebhookEventKey = getStripeWebhookEventKey;
module.exports.STRIPE_WEBHOOK_EVENT_TTL = STRIPE_WEBHOOK_EVENT_TTL;
