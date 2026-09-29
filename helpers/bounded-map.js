/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A Map that holds at most `limit` entries, dropping the oldest one when a
// new key is added past it. Used as an in-memory cache (e.g. a Tangerine DNS
// cache, whose default Map keeps every answer of the run) so a job that
// resolves hundreds of thousands of names does not keep all the answers.
//
class BoundedMap extends Map {
  constructor(limit = 10_000) {
    super();
    this.limit = Math.max(1, Number(limit) || 1);
  }

  set(key, value) {
    if (!this.has(key) && this.size >= this.limit)
      this.delete(this.keys().next().value);
    return super.set(key, value);
  }
}

module.exports = BoundedMap;
