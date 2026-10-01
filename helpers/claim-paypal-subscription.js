/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

//
// A PayPal subscription may only be assigned to one account.  Checking the
// database first and saving the account later leaves a window where two
// requests (e.g. two accounts returning from the same checkout, or the
// redirect and the webhook) both pass the check, so the first account to
// claim the subscription ID in Redis keeps it.  The claim outlives the
// request that saves the account, after which the database check applies.
//
const CLAIM_TTL = ms('1h');

/**
 * @param   {object}  client Redis client
 * @param   {string}  subscriptionId PayPal subscription ID
 * @param   {string}  userId The account the subscription is assigned to
 * @returns {Promise<boolean>} Whether the account may be assigned it
 */
async function claimPayPalSubscription(client, subscriptionId, userId) {
  if (!client || typeof client.set !== 'function')
    throw new TypeError('Redis client missing');
  if (!isSANB(subscriptionId) || !isSANB(userId))
    throw new TypeError('Subscription and user ID required');

  const key = `paypal_subscription_claim:${subscriptionId}`;
  const result = await client.set(key, userId, 'PX', CLAIM_TTL, 'NX');
  if (result === 'OK') return true;
  return (await client.get(key)) === userId;
}

module.exports = claimPayPalSubscription;
