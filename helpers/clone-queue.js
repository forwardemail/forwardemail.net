/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const { takeJob } = require('#helpers/rekey-queue');

//
// Reliable clone queue (see #575 and `clone` in helpers/worker.js).
//
// Like rekeys (helpers/rekey-queue.js), a clone job is a Redis list item
// that is moved to a processing list while the sqlite-worker runs it, and
// only removed from there once it is done, so a job survives a worker that
// is stopped or dies while the job waits or runs: the next worker puts what
// was left in the processing list back in the queue before it takes any
// (see `recoverCloneJobs`, and sqlite-worker.js).
//
const CLONE_QUEUE = `sqlite_clone_queue:${config.env}`;
const CLONE_PROCESSING_LIST = `sqlite_clone_processing:${config.env}`;

// (set on both aliases of a clone while it is started, before its job is
// queued, to `<original id>:<clone id>`, see clone-alias.js)
function getCloneStartingKey(aliasId) {
  return `clone_starting:${aliasId}`;
}

// Append a new job to the queue.
async function enqueueCloneJob(client, payloadStr) {
  await client.rpush(CLONE_QUEUE, payloadStr);
}

// (`blockingClient` must be a connection of its own, see takeRekeyJob)
function takeCloneJob(blockingClient, timeoutSeconds = 5) {
  return takeJob(
    blockingClient,
    CLONE_QUEUE,
    CLONE_PROCESSING_LIST,
    timeoutSeconds
  );
}

// The job is done: it may leave the processing list.
async function finishCloneJob(client, payloadStr) {
  await client.lrem(CLONE_PROCESSING_LIST, -1, payloadStr);
}

// Put a job back at the head of the queue (it runs next).
async function requeueCloneJob(client, payloadStr) {
  await client.lpush(CLONE_QUEUE, payloadStr);
}

//
// Put every job left in the processing list back at the head of the queue,
// in the order they were taken.  Only run while no clone runs (when the
// worker starts: exactly one runs, see helpers/sqlite-worker-lease.js).
//
async function recoverCloneJobs(client) {
  let count = 0;
  while (await client.rpoplpush(CLONE_PROCESSING_LIST, CLONE_QUEUE)) count++;
  return count;
}

//
// The clone that copies the mailbox of an alias, or into it, while it is
// started, waits or runs (`{ alias_id, clone_alias_id }`), or `undefined`.
//
// Until it is done neither alias may get a new password (the copy is
// encrypted with the password both had, see generate-alias-password.js) or
// have IMAP turned on or off (see update-alias.js), and the original may not
// be deleted (see remove-alias.js).
//
async function getPendingClone(client, aliasId) {
  const id = String(aliasId);
  const [starting, queued, processing] = await Promise.all([
    client.get(getCloneStartingKey(id)),
    client.lrange(CLONE_QUEUE, 0, -1),
    client.lrange(CLONE_PROCESSING_LIST, 0, -1)
  ]);

  if (typeof starting === 'string' && starting.includes(':')) {
    const [sourceId, cloneId] = starting.split(':');
    return { alias_id: sourceId, clone_alias_id: cloneId };
  }

  for (const item of [...processing, ...queued]) {
    let payload;
    try {
      payload = JSON.parse(item);
    } catch {
      continue;
    }

    const sourceId = String(payload?.session?.user?.alias_id);
    const cloneId = String(payload?.clone_alias_id);
    if (sourceId === id || cloneId === id)
      return { alias_id: sourceId, clone_alias_id: cloneId };
  }
}

module.exports = {
  CLONE_PROCESSING_LIST,
  CLONE_QUEUE,
  enqueueCloneJob,
  finishCloneJob,
  getCloneStartingKey,
  getPendingClone,
  recoverCloneJobs,
  requeueCloneJob,
  takeCloneJob
};
