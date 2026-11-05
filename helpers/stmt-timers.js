/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const { boolean } = require('boolean');
const ms = require('ms');

const env = require('#config/env');

//
// Optional timing of the SQL statements that `parsePayload` runs for the
// generic `stmt` action (the SQL is built by the IMAP/API workers, so the
// sqlite worker's CPU profile only shows `all`/`get`/`run`, never which query).
//
// Off by default.  Turn on with:
//
//   SQLITE_STMT_TIMERS=true
//   SQLITE_STMT_SLOW_MS=50          (log any single statement slower than this)
//   SQLITE_STMT_TALLY_INTERVAL=1m   (how often the per-query-shape tally logs)
//
// What is logged:
// - `[SLOW_STMT]` per statement over the threshold: pid, op, duration, rows,
//   alias id and the SQL text.
// - `[STMT_TALLY]` once per interval: the top query shapes by total time, so a
//   cheap query that runs thousands of times shows up as well as a slow one.
//
// SECURITY: only the SQL text is ever logged.  Bind values hold mail content
// and are never read here.  The SQL is parameterized (`$p1`), and it is cut to
// MAX_SQL_LENGTH characters.
//

const MAX_SQL_LENGTH = 300;
const MAX_TALLY_KEYS = 500;
const TOP_N = 10;

function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function parseInterval(value, fallback) {
  if (!value) return fallback;
  try {
    const parsed = typeof value === 'number' ? value : ms(String(value));
    return toPositiveNumber(parsed, fallback);
  } catch {
    return fallback;
  }
}

function normalizeSql(sql) {
  const text = typeof sql === 'string' ? sql : String(sql ?? '');
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return collapsed.length > MAX_SQL_LENGTH
    ? `${collapsed.slice(0, MAX_SQL_LENGTH)}...`
    : collapsed;
}

function countRows(op, data) {
  if (op === 'all') return Array.isArray(data) ? data.length : 0;
  if (op === 'get') return data === undefined || data === null ? 0 : 1;
  return typeof data?.changes === 'number' ? data.changes : 0;
}

class StmtTimers {
  constructor(options = {}) {
    this.enabled =
      options.enabled === undefined
        ? boolean(env.SQLITE_STMT_TIMERS)
        : Boolean(options.enabled);
    this.slowMs = toPositiveNumber(
      options.slowMs ?? env.SQLITE_STMT_SLOW_MS,
      50
    );
    this.intervalMs = parseInterval(
      options.intervalMs ?? env.SQLITE_STMT_TALLY_INTERVAL,
      ms('1m')
    );
    this.log = options.log || console.warn;
    this.now = options.now || (() => performance.now());
    this.tally = new Map(); // sql -> { count, totalMs, maxMs, rows }
    this.interval = null;

    if (this.enabled && options.autoFlush !== false) {
      this.interval = setInterval(() => this.flush(), this.intervalMs);
      // never keep the process alive for logging
      this.interval.unref();
    }
  }

  //
  // returns a start mark, or 0 when disabled (so callers pay nothing)
  //
  start() {
    return this.enabled ? this.now() : 0;
  }

  //
  // record one finished statement: `sql` is the prepared text, `op` is
  // run|get|all, `data` is what the statement returned
  //
  record({ started, sql, op, data, aliasId }) {
    if (!this.enabled || !started) return;
    const duration = this.now() - started;
    const key = normalizeSql(sql);
    const rows = countRows(op, data);

    let entry = this.tally.get(key);
    if (!entry) {
      // bound memory: a flood of distinct SQL must not grow the map forever
      if (this.tally.size >= MAX_TALLY_KEYS) {
        this.tally.set('(other)', this.tally.get('(other)') || blank());
        entry = this.tally.get('(other)');
      } else {
        entry = blank();
        this.tally.set(key, entry);
      }
    }

    entry.count++;
    entry.totalMs += duration;
    entry.rows += rows;
    if (duration > entry.maxMs) entry.maxMs = duration;

    if (duration >= this.slowMs) {
      this.log(
        '[SLOW_STMT] pid=%d op=%s duration=%dms rows=%d alias=%s sql=%s',
        process.pid,
        op,
        Math.round(duration),
        rows,
        aliasId,
        key
      );
    }
  }

  //
  // log the busiest query shapes of this interval, then start over
  //
  flush() {
    if (this.tally.size === 0) return;
    const top = [...this.tally.entries()]
      .sort((a, b) => b[1].totalMs - a[1].totalMs)
      .slice(0, TOP_N);
    const totalMs = [...this.tally.values()].reduce(
      (sum, entry) => sum + entry.totalMs,
      0
    );
    const totalCount = [...this.tally.values()].reduce(
      (sum, entry) => sum + entry.count,
      0
    );
    this.tally = new Map();

    this.log(
      '[STMT_TALLY] pid=%d window=%s statements=%d total=%dms top=%s',
      process.pid,
      ms(this.intervalMs),
      totalCount,
      Math.round(totalMs),
      JSON.stringify(
        top.map(([sql, entry]) => ({
          sql,
          count: entry.count,
          total_ms: Math.round(entry.totalMs),
          max_ms: Math.round(entry.maxMs),
          rows: entry.rows
        }))
      )
    );
  }

  close() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
}

function blank() {
  return { count: 0, totalMs: 0, maxMs: 0, rows: 0 };
}

module.exports = new StmtTimers();
module.exports.StmtTimers = StmtTimers;
module.exports.normalizeSql = normalizeSql;
