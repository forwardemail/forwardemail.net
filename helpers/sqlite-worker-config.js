/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

//
// NOTE: exactly one `sqlite-worker` process runs fleet-wide (see
//       ecosystem-sqlite.json: fork mode, 1 instance, on the SQLite host).
//       Rekey recovery relies on that: when the worker starts, every rekey
//       that is still claimed belongs to a process that no longer exists,
//       and while it runs a claimed rekey it is not processing is dead.
//
module.exports = {
  // One upload at a time per worker keeps BACKUP_MAX_BANDWIDTH enforceable.
  MAX_CONCURRENCY: 1,
  MIN_FREE_MEM: 1024 * 1024 * 1024, // 1 GB

  //
  // An unclaimed rekey (queued but never picked up by the worker) is only
  // rolled back once it is this old AND no longer sits in the Redis queue.
  // A queued job is left alone until REKEY_QUEUED_MAX_AGE, which covers the
  // longest a job plausibly waits behind other work (the worker runs one
  // job at a time and a backup of the largest mailbox takes well under an
  // hour) plus the complete retry schedule of a job that keeps hitting a
  // transient error: REKEY_MAX_ATTEMPTS attempts, each of which may spend
  // several minutes waiting (free memory, the swap lock, the quiesce) on
  // top of the backoff below -- about two and a half hours of backoff plus
  // up to ~8 minutes per attempt.  Past that the worker is evidently not
  // running, and the alias (whose authentication is blocked while
  // `is_rekey` is set) is released with its previous password rather than
  // left locked out.
  //
  REKEY_STALE_THRESHOLD: ms('15m'),
  REKEY_QUEUED_MAX_AGE: ms('8h'),

  //
  // A rekey claimed by the worker is considered dead after this long, measured
  // from `rekey_claimed_at`.  The sqlite-worker itself recovers dead claims
  // immediately (startup + periodic sweep); this cap is a last resort for the
  // scheduled job on the bree host when the worker has been down for a day.
  // It is far beyond any plausible VACUUM INTO + VACUUM + integrity checks of
  // even a 100 GB mailbox, so a slow but live rekey is never rolled back.
  //
  REKEY_PROCESSING_STALE_THRESHOLD: ms('24h'),

  //
  // How long the worker waits for stale connections in other processes to
  // close (their -wal/-shm files to disappear) before aborting a file swap,
  // and how often it re-broadcasts the cache eviction while waiting.
  //
  REKEY_QUIESCE_TIMEOUT: ms('60s'),
  REKEY_QUIESCE_INTERVAL: ms('3s'),

  // How long the worker waits for another file swap (e.g. an inline VACUUM
  // migration in a sqlite cluster worker) of the same alias to finish.
  REKEY_SWAP_LOCK_WAIT: ms('2m'),

  //
  // A mailbox reset (helpers/reset-mailbox.js) and the corruption recovery
  // of helpers/get-database.js replace the live file from inside a request
  // of the sqlite server, so their waits must stay well within the caller's
  // WebSocket timeout (one minute).  A reset that cannot prove exclusivity
  // in time fails with a retryable error and leaves the mailbox untouched;
  // a recovery that cannot leaves the file alone for the next request.
  //
  RESET_SWAP_LOCK_WAIT: ms('10s'),
  RESET_QUIESCE_TIMEOUT: ms('20s'),
  RECOVERY_QUIESCE_TIMEOUT: ms('15s'),

  // Interval of the in-process sweep that recovers dead claims and rekeys
  // that were swapped but never finalized.
  REKEY_SWEEP_INTERVAL: ms('5m'),

  //
  // A worker records the swap (`rekey_swapped_at`) and renames the copy over
  // the live file within seconds.  Recovery leaves a swap recorded more
  // recently than this alone: the live file not (yet) carrying the recorded
  // inode does not prove that the rename will not happen a moment later.
  //
  REKEY_SWAP_GRACE: ms('2m'),

  //
  // How long a stopping worker waits for its in-flight jobs.  It must stay
  // below pm2's `kill_timeout` for the worker (65s in ecosystem-sqlite.json,
  // after which pm2 sends SIGKILL) so that a worker which drained in time
  // exits cleanly and hands its worker lease over right away.
  //
  SHUTDOWN_DRAIN_TIMEOUT: ms('55s'),

  //
  // A rekey that hits a transient condition (storage not mounted, MongoDB or
  // Redis unavailable, another swap of the same alias, a stale connection
  // that will not close, low memory or disk) is run again from the start
  // after an exponential backoff instead of being failed.  With these values
  // the backoff alone spans a little over two hours before the rekey is
  // failed and the previous password restored.
  //
  REKEY_MAX_ATTEMPTS: 12,
  REKEY_RETRY_BASE_DELAY: ms('1m'),
  REKEY_RETRY_MAX_DELAY: ms('15m')
};
