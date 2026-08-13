/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Transform } = require('node:stream');

class ThrottleStream extends Transform {
  constructor(bytesPerSecond, options = {}) {
    if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
      throw new TypeError('bytesPerSecond must be a positive number');
    }

    const burstWindow = options.burstWindow || 100;
    super({ highWaterMark: options.highWaterMark || 64 * 1024 });

    this.bytesPerSecond = Math.floor(bytesPerSecond);
    this.tokenCapacity = Math.max(
      1,
      Math.floor((this.bytesPerSecond * burstWindow) / 1000)
    );
    this.tokens = 0;
    this.lastRefill = Date.now();
    this.timer = null;
    this.limiter = options.limiter;
  }

  refillTokens() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    if (elapsed <= 0) return;
    this.tokens = Math.min(
      this.tokenCapacity,
      this.tokens + (this.bytesPerSecond * elapsed) / 1000
    );
    this.lastRefill = now;
  }

  schedule(callback) {
    const missingTokens = Math.max(1, this.tokenCapacity - this.tokens);
    const delay = Math.max(
      1,
      Math.ceil((missingTokens / this.bytesPerSecond) * 1000)
    );
    this.timer = setTimeout(() => {
      this.timer = null;
      callback();
    }, delay);
  }

  async pushChunk(chunk, offset, callback) {
    this.refillTokens();
    if (this.tokens <= 0) {
      this.schedule(() => {
        this.pushChunk(chunk, offset, callback).catch(callback);
      });
      return;
    }

    const length = Math.min(Math.floor(this.tokens), chunk.length - offset);
    if (length <= 0) {
      this.schedule(() => {
        this.pushChunk(chunk, offset, callback).catch(callback);
      });
      return;
    }

    this.tokens -= length;
    if (this.limiter) await this.limiter.reserve(length);
    this.push(chunk.subarray(offset, offset + length));

    const nextOffset = offset + length;
    if (nextOffset === chunk.length) {
      callback();
      return;
    }

    this.schedule(() => {
      this.pushChunk(chunk, nextOffset, callback).catch(callback);
    });
  }

  _transform(chunk, encoding, callback) {
    this.pushChunk(chunk, 0, callback).catch(callback);
  }

  _destroy(error, callback) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    callback(error);
  }
}

function createThrottleStream(bytesPerSecond, options) {
  return new ThrottleStream(bytesPerSecond, options);
}

module.exports = createThrottleStream;
module.exports.ThrottleStream = ThrottleStream;
