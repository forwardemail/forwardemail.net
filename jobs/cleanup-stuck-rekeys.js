/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { findRekeyJob, rollbackRekey } = require('#helpers/rekey-recovery');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  REKEY_PROCESSING_STALE_THRESHOLD,
  REKEY_QUEUED_MAX_AGE,
  REKEY_STALE_THRESHOLD
} = require('#helpers/sqlite-worker-config');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

//
// Backstop for rekeys the sqlite-worker did not settle.
//
// The sqlite-worker owns rekey recovery (helpers/recover-rekeys.js): it runs
// on the SQLite host, can inspect the live database file, and re-runs
// interrupted jobs from the reliable queue.  This job runs on the bree host,
// cannot see the file, and therefore only acts where the outcome is certain:
//
//   - a rekey that was never claimed and whose job no longer exists anywhere
//     (or has been queued for an unreasonably long time, beyond the retry
//     schedule of a job that keeps hitting a transient error) is lost: the
//     live file still uses the previous password, restore the previous
//     tokens
//   - a rekey claimed a very long time ago (the worker has been down for a
//     day) with no swap recorded: the live file still uses the previous
//     password, restore the previous tokens
//   - a rekey claimed a very long time ago WITH a swap recorded: only the
//     file can tell whether the rename happened, and both a wrong finalize
//     and a wrong rollback lock the user out -- alert the admins instead
//
async function notifyOwner(alias) {
  const ownerEmail = alias.user?.email;
  if (!ownerEmail) return;

  const locale = alias.user?.locale || i18n.config.defaultLocale;
  const username = `${alias.name}@${alias.domain?.name || 'unknown'}`;

  await email({
    template: 'alert',
    message: {
      to: ownerEmail,
      cc: config.alertsEmail,
      subject: i18n.translate(
        'ALIAS_REKEY_INTERRUPTED_SUBJECT',
        locale,
        username
      )
    },
    locals: {
      message: i18n.translate('ALIAS_REKEY_INTERRUPTED', locale, username),
      locale
    }
  });
}

async function alertAdmins(alias) {
  // once per alias per day
  const acquired = await client.set(
    `rekey_stuck_alert:${config.env}:${alias._id}`,
    new Date().toISOString(),
    'PX',
    ms('1d'),
    'NX'
  );
  if (!acquired) return;

  const username = `${alias.name}@${alias.domain?.name || 'unknown'}`;
  await email({
    template: 'alert',
    message: {
      to: config.alertsEmail,
      subject: `Rekey of ${username} (${alias._id}) needs the sqlite-worker`
    },
    locals: {
      message:
        `<p>The password rotation <code>${
          alias.rekey_id || 'legacy'
        }</code> of <span class="notranslate text-monospace font-weight-bold">${username}</span> (started ${
          alias.rekey_started_at
            ? new Date(alias.rekey_started_at).toISOString()
            : 'unknown'
        }) recorded a file swap at ${
          alias.rekey_swapped_at
            ? new Date(alias.rekey_swapped_at).toISOString()
            : 'unknown'
        }, but has not been settled since.</p>` +
        `<p>Only the sqlite-worker can settle it (it must inspect the live database file). Please make sure the sqlite-worker process is running on the SQLite host; it recovers this rotation automatically on startup and in its periodic sweep.</p>`
    }
  });
}

(async () => {
  await setupMongoose(logger);

  try {
    const now = Date.now();

    const aliases = await Aliases.find({ is_rekey: true })
      .select(
        'name domain user rekey_started_at +rekey_id +rekey_processing +rekey_claimed_at +rekey_swap_ino +rekey_swapped_at'
      )
      .populate('domain', 'name')
      .populate('user', 'email locale')
      .lean()
      .exec();

    let cleared = 0;

    for (const alias of aliases) {
      try {
        const aliasId = alias._id.toString();
        const rekeyId = alias.rekey_id;
        const startedAt = alias.rekey_started_at
          ? new Date(alias.rekey_started_at).getTime()
          : 0;

        //
        // A recorded swap (a rekey's copy or a reset's fresh mailbox is, or
        // is about to be, the live file) is never decided from here: only
        // the file can tell, and the sqlite-worker settles it.  Alert once
        // it has been left alone for far longer than any rotation takes.
        //
        if (alias.rekey_swap_ino) {
          const swappedAt = alias.rekey_swapped_at
            ? new Date(alias.rekey_swapped_at).getTime()
            : startedAt;
          if (now - swappedAt >= REKEY_PROCESSING_STALE_THRESHOLD)
            await alertAdmins(alias);
          continue;
        }

        if (alias.rekey_processing) {
          const claimedAt = alias.rekey_claimed_at
            ? new Date(alias.rekey_claimed_at).getTime()
            : startedAt;

          // the worker is (or recently was) working on it
          if (now - claimedAt < REKEY_PROCESSING_STALE_THRESHOLD) continue;
        } else {
          const job = await findRekeyJob(client, { aliasId, rekeyId });

          // scheduled to run again after a transient error: not stuck
          if (job && Number(job.rekey_not_before) > now) continue;

          const maxAge = job ? REKEY_QUEUED_MAX_AGE : REKEY_STALE_THRESHOLD;
          if (now - startedAt < maxAge) continue;
        }

        //
        // No swap was ever recorded, so the live SQLite file still uses the
        // previous password: restore the persisted token snapshot and clear
        // the rekey state atomically before authentication is re-enabled.
        //
        // The rollback is a compare-and-set on the claim state observed
        // above: a rekey the worker claimed (or re-claimed) in the meantime
        // is left alone.
        //
        const rolledBack = await rollbackRekey(client, alias._id, {
          filter: {
            ...(rekeyId
              ? { rekey_id: rekeyId }
              : { rekey_id: { $exists: false } }),
            ...(alias.rekey_processing
              ? {
                  rekey_processing: true,
                  rekey_claimed_at: alias.rekey_claimed_at
                    ? new Date(alias.rekey_claimed_at)
                    : { $exists: false }
                }
              : { rekey_processing: { $ne: true } })
          },
          rekeyId
        });

        if (!rolledBack) continue;

        cleared++;
        await notifyOwner(alias);
        logger.warn('Cleared stuck rekey', {
          alias_id: alias._id,
          rekey_id: rekeyId,
          rekey_started_at: alias.rekey_started_at,
          rekey_processing: alias.rekey_processing
        });
      } catch (err) {
        logger.error('Failed to clear stuck rekey', {
          err,
          alias_id: alias._id
        });
      }
    }

    if (cleared === 0) logger.info('No stuck rekey operations found');
    else logger.warn(`Cleared ${cleared} stuck rekey operations`);
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
