/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const Aliases = require('#models/aliases');
const config = require('#config');
const email = require('#helpers/email');
const getPathToDatabase = require('#helpers/get-path-to-database');
const getRekeyTmpPath = require('#helpers/get-rekey-tmp-path');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const {
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE,
  isRekeyQueued,
  recoverRekey,
  releaseRekeyClaim,
  resolveSwapState
} = require('#helpers/rekey-recovery');
const {
  REKEY_STALE_THRESHOLD,
  REKEY_SWAP_GRACE
} = require('#helpers/sqlite-worker-config');

//
// Rekey recovery as run by the sqlite-worker (the only process that runs
// rekeys and the only one that can inspect the live database file).
//
// Exactly one sqlite-worker runs fleet-wide (ecosystem-sqlite.json: fork
// mode, one instance).  Every rekey is therefore in one of these states:
//
//   - running in this process              -> left alone (`activeKeys`)
//   - waiting in the queue                 -> left alone, the poll loop runs it
//   - sitting in the processing list but
//     not running here                     -> its worker died: run it again
//                                             (or finalize it if the swap
//                                             already happened)
//   - claimed, but no job exists anywhere  -> its worker died before the
//                                             reliable queue existed: settle
//                                             it from the file's state
//   - unclaimed, no job, older than the
//     stale threshold                      -> lost (e.g. Redis lost the job):
//                                             restore the previous tokens
//
// None of this depends on how long a rekey takes.
//

const REKEY_ALIAS_FIELDS =
  'name domain user storage_location storage_used rekey_started_at +rekey_id +rekey_processing +rekey_claimed_at +rekey_swap_ino +rekey_swapped_at';

// key identifying one rekey operation (legacy jobs have no `rekey_id`)
function getRekeyKey({ rekeyId, aliasId }) {
  return rekeyId || `alias:${aliasId}`;
}

//
// Whether the alias recorded a swap so recently that the worker which
// recorded it may still be about to rename the copy (see REKEY_SWAP_GRACE).
//
function isSwapInProgress(alias) {
  if (!alias.rekey_swap_ino || !alias.rekey_swapped_at) return false;
  return (
    Date.now() - new Date(alias.rekey_swapped_at).getTime() < REKEY_SWAP_GRACE
  );
}

function getAliasStoragePath(alias) {
  return getPathToDatabase({
    id: alias._id.toString(),
    storage_location: alias.storage_location
  });
}

async function notifyRekeyRecovered(alias, swapped) {
  const ownerEmail = alias.user?.email;
  if (!ownerEmail) return;

  const locale = alias.user?.locale || i18n.config.defaultLocale;
  const username = `${alias.name}@${alias.domain?.name || 'unknown'}`;

  try {
    await email({
      template: 'alert',
      message: {
        to: ownerEmail,
        ...(swapped ? {} : { cc: config.alertsEmail }),
        subject: i18n.translate(
          swapped
            ? 'ALIAS_REKEY_READY_SUBJECT'
            : 'ALIAS_REKEY_INTERRUPTED_SUBJECT',
          locale,
          username
        )
      },
      locals: {
        message: i18n.translate(
          swapped ? 'ALIAS_REKEY_READY' : 'ALIAS_REKEY_INTERRUPTED',
          locale,
          username
        ),
        locale
      }
    });
  } catch (err) {
    logger.fatal(err, { alias_id: alias._id });
  }
}

//
// Settle one interrupted rekey from the state of the live file.  Returns
// `true` when the alias was finalized or rolled back.
//
async function settleRekey(client, alias) {
  const filter = alias.rekey_id
    ? { rekey_id: alias.rekey_id }
    : { rekey_id: { $exists: false } };
  const storagePath = getAliasStoragePath(alias);

  const { recovered, swapped } = await recoverRekey(client, alias, {
    filter,
    storagePath
  });

  if (!recovered) return false;

  // a rolled back rekey may have left its (never swapped) copy behind,
  // together with the journal of a VACUUM that was cut short
  if (!swapped && alias.rekey_id) {
    const tmp = getRekeyTmpPath(storagePath, { rekey_id: alias.rekey_id });
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
      try {
        fs.rmSync(`${tmp}${suffix}`, { force: true });
      } catch (err) {
        logger.debug(err);
      }
    }
  }

  await notifyRekeyRecovered(alias, swapped);
  logger.warn(
    swapped ? 'Finalized interrupted rekey' : 'Rolled back interrupted rekey',
    {
      alias_id: alias._id,
      rekey_id: alias.rekey_id,
      rekey_started_at: alias.rekey_started_at,
      rekey_swapped_at: alias.rekey_swapped_at
    }
  );
  return true;
}

//
// Put every job left in the processing list by a dead worker back at the
// head of the queue, unless its rekey already swapped the file (then the
// only thing left to do is to finalize the alias).
//
// Jobs that belong to a rekey currently running in this process are skipped
// (this also runs periodically while jobs are in flight).
//
async function requeueInterruptedRekeys(client, { activeKeys } = {}) {
  const items = await client.lrange(REKEY_PROCESSING_LIST, 0, -1);
  const seen = new Set();

  for (const item of items) {
    let payload;
    try {
      payload = JSON.parse(item);
    } catch {
      logger.warn('Dropping unparseable rekey job', { item });
      await client.lrem(REKEY_PROCESSING_LIST, -1, item);
      continue;
    }

    const aliasId = payload?.session?.user?.alias_id;
    const rekeyId = payload?.rekey_id;
    const key = getRekeyKey({ rekeyId, aliasId });

    if (
      payload?.action !== 'rekey' ||
      typeof aliasId !== 'string' ||
      (rekeyId !== undefined && typeof rekeyId !== 'string')
    ) {
      logger.warn('Dropping invalid rekey job', { payload });
      await client.lrem(REKEY_PROCESSING_LIST, -1, item);
      continue;
    }

    // running right now in this process
    if (activeKeys?.has(key)) continue;

    // a duplicate of a job handled earlier in this pass
    if (seen.has(key)) {
      await client.lrem(REKEY_PROCESSING_LIST, -1, item);
      continue;
    }

    seen.add(key);

    let alias;
    try {
      alias = await Aliases.findOne({
        _id: aliasId,
        is_rekey: true,
        ...(rekeyId ? { rekey_id: rekeyId } : { rekey_id: { $exists: false } })
      })
        .select(REKEY_ALIAS_FIELDS)
        .populate('domain', 'name')
        .populate('user', 'email locale')
        .lean()
        .exec();
    } catch (err) {
      logger.error('Failed to load alias of interrupted rekey', {
        err,
        alias_id: aliasId,
        rekey_id: rekeyId
      });
      continue;
    }

    // the operation is over (already settled or superseded): drop the job
    if (!alias) {
      await client.lrem(REKEY_PROCESSING_LIST, -1, item);
      continue;
    }

    if (alias.rekey_swap_ino) {
      const state = resolveSwapState(alias, getAliasStoragePath(alias));

      // the file could not be inspected: keep the job and try again later
      if (state.swapped === null) continue;

      if (state.swapped) {
        // the rename happened, only the bookkeeping is missing
        await settleRekey(client, alias);
        await client.lrem(REKEY_PROCESSING_LIST, -1, item);
        continue;
      }

      // the rename may still be about to happen: look again later
      if (isSwapInProgress(alias)) continue;
    }

    //
    // The live file still uses the previous password: run the job again.
    // Its claim (and any recorded-but-never-performed swap) is released
    // first so the job can claim the operation, then the job moves to the
    // head of the queue so it is the next thing the worker does.
    //
    // The release is a compare-and-set on the claim observed above: if the
    // job started running in the meantime (a fresh claim) nothing is touched
    // and the job is left in the processing list.
    //
    const released = await releaseRekeyClaim(alias._id, {
      rekeyId,
      claimedAt: alias.rekey_claimed_at || null
    });
    if (!released) continue;

    await client.lpush(REKEY_QUEUE, item);
    await client.lrem(REKEY_PROCESSING_LIST, -1, item);

    logger.warn('Re-queued interrupted rekey', {
      alias_id: alias._id,
      rekey_id: rekeyId
    });
  }
}

//
// Settle every rekey that has no job anywhere and is not running here.
//
async function recoverAbandonedRekeys(client, { activeKeys } = {}) {
  const now = Date.now();
  const aliases = await Aliases.find({ is_rekey: true })
    .select(REKEY_ALIAS_FIELDS)
    .populate('domain', 'name')
    .populate('user', 'email locale')
    .lean()
    .exec();

  for (const alias of aliases) {
    try {
      const aliasId = alias._id.toString();
      const rekeyId = alias.rekey_id;

      if (activeKeys?.has(getRekeyKey({ rekeyId, aliasId }))) continue;

      // pending or running: the queue takes care of it
      if (await isRekeyQueued(client, { aliasId, rekeyId })) continue;

      if (alias.rekey_processing) {
        //
        // Claimed, but no job anywhere and not running here: the claim
        // belongs to a run that died (or whose job Redis lost).  A very
        // fresh claim is left alone all the same, and so is a swap that
        // was recorded moments ago (the rename may still follow).
        //
        const claimedAt = alias.rekey_claimed_at
          ? new Date(alias.rekey_claimed_at).getTime()
          : alias.rekey_started_at
          ? new Date(alias.rekey_started_at).getTime()
          : 0;
        if (now - claimedAt < REKEY_STALE_THRESHOLD) continue;
        if (isSwapInProgress(alias)) continue;
      } else {
        //
        // Never claimed and no job: the job was lost.  Give the controller
        // time to finish queueing (or to roll a failed request back itself)
        // before treating a fresh rekey as lost.
        //
        const startedAt = alias.rekey_started_at
          ? new Date(alias.rekey_started_at).getTime()
          : 0;
        if (now - startedAt < REKEY_STALE_THRESHOLD) continue;
      }

      await settleRekey(client, alias);
    } catch (err) {
      logger.error('Failed to recover rekey', { err, alias_id: alias._id });
    }
  }
}

//
// Full recovery pass: run on startup and periodically while the worker runs.
//
async function recoverRekeys(client, { activeKeys } = {}) {
  await requeueInterruptedRekeys(client, { activeKeys });
  await recoverAbandonedRekeys(client, { activeKeys });
}

module.exports = {
  REKEY_ALIAS_FIELDS,
  getRekeyKey,
  isSwapInProgress,
  recoverAbandonedRekeys,
  recoverRekeys,
  requeueInterruptedRekeys,
  settleRekey
};
