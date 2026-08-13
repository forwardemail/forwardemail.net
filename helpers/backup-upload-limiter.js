/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');

const config = require('#config');
const logger = require('#helpers/logger');
const parseBandwidth = require('#helpers/parse-bandwidth');

//
// Atomically reserve a byte-duration slot in a Redis-backed leaky bucket.
// Redis TIME makes every sqlite-worker, including workers on different hosts,
// use one clock and one aggregate upload timeline.
//
const RESERVE_UPLOAD_SCRIPT = `
local timestamp = redis.call('TIME')
local now = (tonumber(timestamp[1]) * 1000) + math.floor(tonumber(timestamp[2]) / 1000)
local previous = tonumber(redis.call('GET', KEYS[1]) or '0')
local start = math.max(now, previous)
local duration = math.max(1, math.ceil((tonumber(ARGV[1]) * 1000) / tonumber(ARGV[2])))
local next = start + duration
local ttl = math.max(1000, (next - now) + 1000)
redis.call('SET', KEYS[1], next, 'PX', ttl)
return start - now
`;

class BackupUploadLimiter {
  constructor(options = {}) {
    this.client = options.client;
    this.bytesPerSecond = parseBandwidth(options.bytesPerSecond);
    this.key = options.key || `backup_upload:${config.env}`;
    this.sleep = options.sleep || setTimeout;
    this.now = options.now || Date.now;
    this.localNext = 0;
  }

  async reserve(bytes) {
    if (!Number.isSafeInteger(bytes) || bytes <= 0) return;

    let delay;
    try {
      if (!this.client) throw new TypeError('Redis client is unavailable');

      delay = Number(
        await this.client.eval(
          RESERVE_UPLOAD_SCRIPT,
          1,
          this.key,
          bytes,
          this.bytesPerSecond
        )
      );

      if (!Number.isSafeInteger(delay) || delay < 0) {
        throw new TypeError('Backup upload limiter returned an invalid delay');
      }
    } catch (err) {
      // Backups may wait, but they must never become unbounded if Redis is
      // unavailable. Keep each process at the configured cap until Redis
      // returns; this is intentionally bounded rather than fail-open.
      logger.error(err, {
        msg: 'Backup upload limiter using per-process fallback',
        key: this.key
      });
      delay = this.reserveLocal(bytes);
    }

    if (delay > 0) await this.sleep(delay);
  }

  reserveLocal(bytes) {
    const now = this.now();
    const start = Math.max(now, this.localNext);
    const duration = Math.max(
      1,
      Math.ceil((bytes * 1000) / this.bytesPerSecond)
    );
    this.localNext = start + duration;
    return start - now;
  }
}

module.exports = BackupUploadLimiter;
module.exports.RESERVE_UPLOAD_SCRIPT = RESERVE_UPLOAD_SCRIPT;
