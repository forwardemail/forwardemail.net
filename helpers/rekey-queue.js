/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const logger = require('#helpers/logger');
const {
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE
} = require('#helpers/rekey-recovery');

//
// Reliable rekey queue (see helpers/rekey-recovery.js for the two lists).
//
// `takeRekeyJob` must be called on a Redis connection that is dedicated to
// it: it blocks the connection for up to `timeoutSeconds`, and every other
// command sent on the same connection would wait behind it.
//

// BLMOVE needs Redis >= 6.2 (Valkey and Redis 7 both have it).  Older
// servers get a BLPOP + RPUSH fallback: the job is briefly in neither list,
// so a worker killed in that instant loses it -- exactly what happened on
// every kill before the processing list existed, never worse.
let blmoveSupported = true;

function isUnknownCommandError(err) {
  return /unknown command/i.test(err?.message || '');
}

//
// Wait up to `timeoutSeconds` for the next job of `queue` and move it
// atomically to `processingList`.  Resolves with the job (a string) or
// `null` on timeout.  (Clones are queued the same way, see
// helpers/clone-queue.js.)
//
async function takeJob(blockingClient, queue, processingList, timeoutSeconds) {
  if (blmoveSupported) {
    try {
      return await blockingClient.blmove(
        queue,
        processingList,
        'LEFT',
        'RIGHT',
        timeoutSeconds
      );
    } catch (err) {
      if (!isUnknownCommandError(err)) throw err;
      blmoveSupported = false;
      logger.warn(
        'Redis does not support BLMOVE (requires 6.2+), rekey and clone jobs are taken with BLPOP instead'
      );
    }
  }

  const result = await blockingClient.blpop(queue, timeoutSeconds);
  if (!result) return null;
  const [, payloadStr] = result;
  await blockingClient.rpush(processingList, payloadStr);
  return payloadStr;
}

function takeRekeyJob(blockingClient, timeoutSeconds = 5) {
  return takeJob(
    blockingClient,
    REKEY_QUEUE,
    REKEY_PROCESSING_LIST,
    timeoutSeconds
  );
}

// The job's outcome was recorded: it may leave the processing list.
async function finishRekeyJob(client, payloadStr) {
  await client.lrem(REKEY_PROCESSING_LIST, -1, payloadStr);
}

// Put a job back at the head of the queue (it runs next).
async function requeueRekeyJob(client, payloadStr) {
  await client.lpush(REKEY_QUEUE, payloadStr);
}

// Append a new job to the queue.
async function enqueueRekeyJob(client, payloadStr) {
  await client.rpush(REKEY_QUEUE, payloadStr);
}

module.exports = {
  enqueueRekeyJob,
  finishRekeyJob,
  requeueRekeyJob,
  takeJob,
  takeRekeyJob
};
