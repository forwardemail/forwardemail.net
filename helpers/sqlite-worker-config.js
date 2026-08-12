/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

module.exports = {
  // One upload at a time per worker keeps BACKUP_MAX_BANDWIDTH enforceable.
  MAX_CONCURRENCY: 1,
  MIN_FREE_MEM: 1024 * 1024 * 1024, // 1 GB
  REKEY_STALE_THRESHOLD: ms('15m')
};
