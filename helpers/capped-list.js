/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A list that counts everything pushed to it but keeps only the first `limit`
// items. Job reports use it so the rows kept for an email (and the email
// itself, which is rendered and CSS-inlined in memory) stay the same size
// however many matches a run finds; the count still reports all of them.
//
class CappedList {
  constructor(limit = 500) {
    this.limit = Math.max(0, Number(limit) || 0);
    this.items = [];
    this.count = 0;
  }

  push(item) {
    this.count++;
    if (this.items.length < this.limit) this.items.push(item);
    return this.count;
  }

  get omitted() {
    return this.count - this.items.length;
  }

  get length() {
    return this.count;
  }
}

module.exports = CappedList;
