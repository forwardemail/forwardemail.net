/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');
const crypto = require('node:crypto');

//
// Read-through cache with a cross-process single-flight lock.
//
// A plain "read redis, and on a miss compute + write redis" cache stampedes:
// when the key is cold (first hit after a deploy, or a TTL expiry under load)
// every concurrent request — across every web/api worker — runs the expensive
// compute at once. For the mail-app release that is N simultaneous calls to the
// GitHub API; for the FAQ it is N simultaneous markdown parses. This wraps the
// compute in a redis `SET NX PX` lock released by a compare-and-delete Lua
// script — the same acquire/release idiom the database-open helpers
// (get-database.js, get-temporary-database.js) use — so exactly one caller
// computes a cold key and the rest either wait for its result or fall back,
// never piling on.
//
// Fails open: if redis is unavailable at any step the compute still runs, so a
// redis outage degrades to the pre-cache behaviour rather than an error.
//

// A lock held only long enough to compute. Well above the bounded compute times
// (a ~10s-capped GitHub fetch, a sub-second markdown parse) so a live holder's
// lock does not expire mid-flight. Even if it did (a long GC pause, a stalled
// event loop), release is a compare-and-delete keyed on this call's token, so a
// slow holder can never drop a lock another worker has since re-acquired.
const DEFAULT_LOCK_TTL_MS = 30_000;

// Release the lock only if we still own it. Same Lua idiom (and wording) as
// helpers/get-database.js and helpers/get-temporary-database.js; a plain DEL
// would drop another worker's lock if ours had expired and been re-acquired.
const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
// How long a contended 'wait' caller polls for the holder's result before
// giving up and computing itself (holder slow or dead).
const DEFAULT_WAIT_MS = 5_000;
const DEFAULT_POLL_MS = 150;

/**
 * @param {Object} client - redis client (ioredis-compatible); may be falsy
 * @param {Object} opts
 * @param {string} opts.cacheKey - redis key holding the JSON-encoded value
 * @param {number} opts.ttlSeconds - cache TTL for a freshly computed value
 * @param {Function} opts.compute - async () => value; a null/undefined result
 *   is returned but never cached (so a failed fetch is not memoised)
 * @param {Function} [opts.shouldCache] - predicate; a computed value is cached
 *   only when it returns true (default: any non-null value). Lets a caller
 *   avoid memoising an empty/negative result while still returning it.
 * @param {string} [opts.lockKey] - redis key for the lock (defaults to
 *   `${cacheKey}:lock`)
 * @param {number} [opts.lockTtlMs]
 * @param {'wait'|'skip'} [opts.contended] - what a caller does when another
 *   worker holds the lock: 'wait' polls for the result (default), 'skip'
 *   returns null immediately so the caller can use its own fallback
 * @param {number} [opts.waitMs] - max time a 'wait' caller polls
 * @param {number} [opts.pollMs]
 * @param {boolean} [opts.forceRefresh] - skip the read and recompute (still
 *   single-flighted); used by the background poller
 * @param {Object} [opts.logger]
 * @returns {Promise<*>}
 */
async function singleFlightCache(client, opts) {
  const {
    cacheKey,
    ttlSeconds,
    compute,
    shouldCache,
    lockKey = `${cacheKey}:lock`,
    lockTtlMs = DEFAULT_LOCK_TTL_MS,
    contended = 'wait',
    waitMs = DEFAULT_WAIT_MS,
    pollMs = DEFAULT_POLL_MS,
    forceRefresh = false,
    logger
  } = opts;

  // No redis: nothing to share or lock against, so just compute.
  if (!client) return compute();

  const readCache = async () => {
    const raw = await client.get(cacheKey);
    if (raw === null || raw === undefined) return undefined;
    let value;
    if (typeof raw === 'string') {
      try {
        value = JSON.parse(raw);
      } catch {
        // A corrupt entry is treated as a miss and overwritten on recompute.
        return undefined;
      }
    } else {
      // A get reply transformer (ioredis supports them, and the test mock uses
      // one) can hand back an already-parsed object rather than the raw string.
      value = raw;
    }

    // `shouldCache` also defines what a valid cached value is: an entry that
    // fails it (an empty or malformed result, or one written by older code) is
    // treated as a miss and recomputed, rather than served. This keeps the
    // read side in step with the write side, which refuses to cache such a
    // value in the first place.
    if (typeof shouldCache === 'function' && !shouldCache(value)) {
      return undefined;
    }

    return value;
  };

  const writeCache = async (value) => {
    if (value === null || value === undefined) return;
    if (typeof shouldCache === 'function' && !shouldCache(value)) return;
    try {
      await client.set(cacheKey, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      if (logger)
        logger.warn('single-flight cache write failed', {
          extra: { error: err.message, cacheKey }
        });
    }
  };

  // 1) fast path — a warm cache serves without touching the lock
  if (!forceRefresh) {
    try {
      const hit = await readCache();
      if (hit !== undefined) return hit;
    } catch (err) {
      if (logger)
        logger.warn('single-flight cache read failed', {
          extra: { error: err.message, cacheKey }
        });
      // redis unreachable — compute without caching
      return compute();
    }
  }

  // 2) contend for the right to compute
  const token = crypto.randomUUID();
  let acquired = false;
  try {
    acquired =
      (await client.set(lockKey, token, 'PX', lockTtlMs, 'NX')) === 'OK';
  } catch (err) {
    if (logger)
      logger.warn('single-flight lock failed', {
        extra: { error: err.message, lockKey }
      });
    // redis lock unavailable — fail open (compute, still cache the result)
    const value = await compute();
    await writeCache(value);
    return value;
  }

  if (!acquired) {
    if (contended === 'skip') return null;
    // wait for the holder to populate the cache
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      await setTimeout(pollMs);
      let value;
      try {
        value = await readCache();
      } catch {
        value = undefined;
      }

      if (value !== undefined) return value;
    }
    // holder is slow or dead — compute ourselves rather than error (no lock held)
  }

  try {
    // The holder may have finished between the read above and the lock, so look
    // once more before paying for a compute (skipped on a forced refresh, whose
    // whole point is to recompute).
    if (!forceRefresh) {
      const again = await readCache();
      if (again !== undefined) return again;
    }

    const value = await compute();
    await writeCache(value);
    return value;
  } finally {
    if (acquired) {
      try {
        // release only if the lock is still ours (see RELEASE_LOCK_SCRIPT)
        await client.eval(RELEASE_LOCK_SCRIPT, 1, lockKey, token);
      } catch {
        // The lock's own TTL will release it; nothing to do.
      }
    }
  }
}

module.exports = singleFlightCache;
