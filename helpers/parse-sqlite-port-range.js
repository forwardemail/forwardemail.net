/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const env = require('#config/env');

//
// Parse the SQLite worker port topology from a single source of truth:
// `SQLITE_PORT_RANGE` (e.g. "3456:3465").
//
// Both the SQLite server (sqlite.js) and the client connection pool
// (helpers/create-websocket-as-promised.js) MUST derive the base port and
// worker count from the SAME value, otherwise the firewall, the listeners,
// and the client connections can silently diverge (e.g. SQLITE_PORT=2483 while
// SQLITE_PORT_RANGE=3456:3465), which breaks cross-server connectivity.
//
// Returns: { basePort: number, endPort: number, workerCount: number }
//
// Resolution order:
//   1. Parse "start:end" from `rangeString` (defaults to env.SQLITE_PORT_RANGE).
//      workerCount is derived as (end - start + 1).
//   2. If the range is missing/malformed, fall back to the legacy single-port
//      model: basePort = env.SQLITE_PORT, workerCount = env.SQLITE_WORKER_COUNT
//      (or 1). This keeps tests and single-port setups working.
//
function parseSqlitePortRange(rangeString = env.SQLITE_PORT_RANGE) {
  if (typeof rangeString === 'string' && rangeString.includes(':')) {
    const parts = rangeString.split(':');
    const start = Number.parseInt(parts[0], 10);
    const end = Number.parseInt(parts[1], 10);

    if (
      Number.isInteger(start) &&
      Number.isInteger(end) &&
      start > 0 &&
      end >= start
    ) {
      return {
        basePort: start,
        endPort: end,
        workerCount: end - start + 1
      };
    }
  }

  // Fallback: legacy single-port model
  const basePort = Number.parseInt(env.SQLITE_PORT, 10) || 3456;
  const workerCount = Number.parseInt(env.SQLITE_WORKER_COUNT, 10) || 1;
  return {
    basePort,
    endPort: basePort + workerCount - 1,
    workerCount
  };
}

module.exports = parseSqlitePortRange;
