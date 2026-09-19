/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const Aliases = require('#models/aliases');
const config = require('#config');
const isStorageAvailable = require('#helpers/is-storage-available');
const logger = require('#helpers/logger');
const { releaseRekeyLock } = require('#helpers/rekey-lock');

//
// Fields that only exist for the lifetime of one asynchronous rekey
//
const REKEY_STATE_FIELDS = [
  'rekey_started_at',
  'rekey_previous_tokens',
  'rekey_id',
  'rekey_processing',
  'rekey_claimed_at',
  'rekey_swap_ino',
  'rekey_swapped_at'
];

//
// The live SQLite file still uses the previous password, so restore the
// persisted token snapshot and clear the rekey state in one atomic update.
//
// Only tokens that can validate a password (they carry a salt and a hash)
// are restored: a legacy alias, one whose snapshot was never persisted, or
// one whose snapshot was stripped of those fields keeps its current tokens
// instead of ending up with tokens no password can match.
//
const USABLE_SNAPSHOT = {
  $filter: {
    input: { $ifNull: ['$rekey_previous_tokens', []] },
    as: 'token',
    cond: {
      $and: [
        { $eq: [{ $type: '$$token.salt' }, 'string'] },
        { $eq: [{ $type: '$$token.hash' }, 'string'] }
      ]
    }
  }
};

const ROLLBACK_PIPELINE = [
  {
    $set: {
      is_rekey: false,
      tokens: {
        $cond: [
          { $gt: [{ $size: USABLE_SNAPSHOT }, 0] },
          USABLE_SNAPSHOT,
          '$tokens'
        ]
      }
    }
  },
  {
    $unset: REKEY_STATE_FIELDS
  }
];

//
// The live SQLite file already uses the new password, so only the rollback
// snapshot is discarded and authentication is re-enabled.
//
const FINALIZE_UPDATE = {
  $set: { is_rekey: false },
  $unset: Object.fromEntries(REKEY_STATE_FIELDS.map((field) => [field, 1]))
};

//
// Once the alias is open for authentication again, no cached credential may
// survive from before the rotation: `clearAuthCache` removes every cached
// entry of the alias fleet-wide (the cache lives in Redis), and the rekey
// lock is released so cache hits are allowed again.
//
async function reopenAuthentication(client, aliasId, rekeyId) {
  try {
    // lazy-loaded to avoid a require cycle (on-auth -> get-database -> ...)
    const onAuth = require('#helpers/on-auth');
    if (typeof onAuth.clearAuthCache === 'function')
      await onAuth.clearAuthCache(client, String(aliasId));
  } catch (err) {
    logger.debug(err);
  }

  await releaseRekeyLock(client, aliasId, rekeyId);
}

//
// Roll back the rekey matched by `filter` (which is always scoped to
// `is_rekey: true`).  Unless `allowSwapped` is set, an alias whose rekeyed
// file may already have been renamed over the live database is never rolled
// back here because its previous tokens can no longer decrypt the mailbox
// (see `resolveSwapState`).
//
// A caller that still holds the pre-rotation token set (the controller that
// started the rotation) passes it as `tokens`; it is restored as is, even
// when empty (an alias that had no password yet gets none back).  Every
// other caller restores the persisted snapshot.
//
// Returns the matched alias (pre-update) or `null` when nothing matched.
//
async function rollbackRekey(
  client,
  aliasId,
  { filter = {}, rekeyId, allowSwapped = false, tokens } = {}
) {
  const alias = await Aliases.findOneAndUpdate(
    {
      ...filter,
      _id: aliasId,
      is_rekey: true,
      ...(allowSwapped ? {} : { rekey_swap_ino: { $exists: false } })
    },
    Array.isArray(tokens)
      ? {
          $set: { is_rekey: false, tokens },
          $unset: Object.fromEntries(
            REKEY_STATE_FIELDS.map((field) => [field, 1])
          )
        }
      : ROLLBACK_PIPELINE
  )
    .select('_id')
    .lean()
    .exec();

  if (!alias) return null;

  await reopenAuthentication(client, aliasId, rekeyId);

  return alias;
}

//
// Finalize the rekey matched by `filter`: the mailbox is already encrypted
// with the new password, so keep the new tokens and re-enable authentication.
//
// Returns the matched alias (pre-update) or `null` when nothing matched.
//
async function finalizeRekey(client, aliasId, { filter = {}, rekeyId } = {}) {
  const alias = await Aliases.findOneAndUpdate(
    {
      ...filter,
      _id: aliasId,
      is_rekey: true
    },
    FINALIZE_UPDATE
  )
    .select('_id')
    .lean()
    .exec();

  if (!alias) return null;

  await reopenAuthentication(client, aliasId, rekeyId);

  return alias;
}

//
// Decide whether the rekeyed copy of an interrupted rekey was renamed over
// the live database.  Only a process on the SQLite host can answer this:
// the worker records the copy's inode right before the rename and a rename
// preserves the inode, so the live file carrying that inode proves the swap
// happened (the tokens in MongoDB are then the only ones that can decrypt
// the mailbox), while any other inode proves it did not.
//
//   { swapped: true|false, known: true }   when the file could be inspected
//   { swapped: false, known: false }       when no swap was ever recorded
//   { swapped: null, known: false }        when the file could not be read
//
function resolveSwapState(alias, storagePath) {
  if (!alias.rekey_swap_ino) return { swapped: false, known: false };

  try {
    const stats = fs.statSync(storagePath, { bigint: true });
    return {
      swapped: stats.ino.toString() === String(alias.rekey_swap_ino),
      known: true
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      //
      // While the storage volume is not available nothing can be concluded
      // from a missing file.  The same holds when the volume is there but
      // the mailbox of an alias that is known to hold data is not: the file
      // is lost or misplaced, and both a rollback and a finalize could lock
      // the user out once it is back.
      //
      if (
        !isStorageAvailable(storagePath) ||
        (typeof alias.storage_used === 'number' && alias.storage_used > 0)
      )
        return { swapped: null, known: false };

      // No live database file at all: nothing was swapped over it.  The
      // previous tokens are as good as any (there is no mailbox to open).
      return { swapped: false, known: true };
    }

    logger.error('Unable to inspect database file for rekey recovery', {
      err,
      alias_id: alias._id,
      storagePath
    });
    return { swapped: null, known: false };
  }
}

//
// Recover an interrupted rekey.
//
// `storagePath` must be passed by callers running on the SQLite host so the
// swap state can be resolved from the live file.  A caller without access to
// the file (the scheduled job on the bree host) must never recover an alias
// that has a swap recorded: both a wrong finalize and a wrong rollback lock
// the user out of the mailbox, so those are left to the worker.
//
// Returns { recovered, swapped }.
//
async function recoverRekey(client, alias, { filter = {}, storagePath } = {}) {
  let swapped = false;

  if (alias.rekey_swap_ino) {
    if (!storagePath) return { recovered: false, swapped: null };

    const state = resolveSwapState(alias, storagePath);
    if (state.swapped === null) return { recovered: false, swapped: null };
    swapped = state.swapped;
  }

  const recovered = swapped
    ? await finalizeRekey(client, alias._id, {
        filter,
        rekeyId: alias.rekey_id
      })
    : await rollbackRekey(client, alias._id, {
        filter,
        rekeyId: alias.rekey_id,
        // the swap was recorded but the file proves it never happened
        allowSwapped: Boolean(alias.rekey_swap_ino)
      });

  return { recovered: Boolean(recovered), swapped };
}

//
// Redis lists holding rekey jobs.
//
// The sqlite-server pushes a job to the queue; the (single) sqlite-worker
// atomically moves it to the processing list while it runs it (BLMOVE) and
// removes it from there when it is done.  A job therefore always sits in
// exactly one of the two lists until its outcome is recorded in MongoDB, so a
// worker that is killed mid-rekey (e.g. SIGKILL during a long VACUUM) finds
// the job again on startup and simply runs it again.
//
const REKEY_QUEUE = `rekey_queue:${config.env}`;
const REKEY_PROCESSING_LIST = `rekey_processing:${config.env}`;

//
// Whether `payload` (a parsed queue item) is the job of the given rekey.
// Legacy jobs without a `rekey_id` are matched by alias.
//
function isRekeyJob(payload, { aliasId, rekeyId }) {
  if (payload?.action !== 'rekey') return false;
  if (rekeyId) return payload.rekey_id === rekeyId;
  return (
    !payload.rekey_id && payload?.session?.user?.alias_id === String(aliasId)
  );
}

//
// Find the job of a rekey in the queue or in the processing list (i.e. it is
// pending or running, not stuck).  Returns the parsed job (which carries the
// retry schedule of a job that hit a transient error: `rekey_attempts` and
// `rekey_not_before`) or `null`.  The lists only ever hold a handful of
// jobs, so scanning them is cheap.
//
async function findRekeyJob(client, { aliasId, rekeyId }) {
  for (const list of [REKEY_QUEUE, REKEY_PROCESSING_LIST]) {
    const items = await client.lrange(list, 0, -1);
    for (const item of items) {
      let payload;
      try {
        payload = JSON.parse(item);
      } catch {
        continue;
      }

      if (isRekeyJob(payload, { aliasId, rekeyId })) return payload;
    }
  }

  return null;
}

async function isRekeyQueued(client, { aliasId, rekeyId }) {
  return Boolean(await findRekeyJob(client, { aliasId, rekeyId }));
}

//
// Make an interrupted rekey claimable again so its job can be run from the
// start (the job is idempotent: it removes any stale copy before VACUUM INTO
// and re-records the swap).  Only valid once the file was proven to still
// use the previous password (`resolveSwapState`).
//
// Returns `true` when the alias is (still) in rekey state for this operation.
//
async function releaseRekeyClaim(aliasId, { rekeyId, claimedAt } = {}) {
  const result = await Aliases.updateOne(
    {
      _id: aliasId,
      is_rekey: true,
      ...(rekeyId ? { rekey_id: rekeyId } : { rekey_id: { $exists: false } }),
      // compare-and-set on the claim that was observed: a claim taken since
      // (the job started running after all) is left untouched
      ...(claimedAt === undefined
        ? {}
        : {
            rekey_claimed_at: claimedAt
              ? new Date(claimedAt)
              : { $exists: false }
          })
    },
    {
      $set: { rekey_processing: false },
      $unset: { rekey_claimed_at: 1, rekey_swap_ino: 1, rekey_swapped_at: 1 }
    }
  );

  return result.matchedCount === 1;
}

module.exports = {
  FINALIZE_UPDATE,
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE,
  REKEY_STATE_FIELDS,
  ROLLBACK_PIPELINE,
  finalizeRekey,
  findRekeyJob,
  isRekeyJob,
  isRekeyQueued,
  recoverRekey,
  releaseRekeyClaim,
  resolveSwapState,
  rollbackRekey
};
