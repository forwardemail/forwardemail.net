/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const config = require('#config');
const workerConfig = require('#helpers/sqlite-worker-config');

//
// The lines of the "Database backup fix" alert that describe the mailbox
// file the corruption recovery of helpers/get-database.js just quarantined,
// so that the alert can be triaged without a shell on the server: whether
// the damage is new or old (the file's last write against the alert and
// against the start of the process that found it), how much mail the file
// could have held (its size against INITIAL_DB_SIZE, the most an initialized
// empty mailbox takes, which is also what the recovery replaces without
// asking the owner), what was next to it, and how long the quarantined copy
// is kept.
//
// Everything is derived from the arguments (no clock is read), and a
// missing or odd value leaves its line out rather than failing the alert.
//

function toTime(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
}

function iso(time) {
  return new Date(time).toISOString();
}

// "56 days", "2 hours", "less than a minute"
function ago(delta) {
  return delta < ms('1m') ? 'less than a minute' : ms(delta, { long: true });
}

function quarantineReport({
  stats,
  companions = [],
  now,
  processStartedAt,
  initialDbSize = config.INITIAL_DB_SIZE,
  retention = workerConfig.QUARANTINE_RETENTION
} = {}) {
  const lines = [];
  const at = toTime(now) ?? Date.now();

  const size = stats && Number.isFinite(stats.size) ? stats.size : null;
  if (size !== null) {
    const bytes = `${size.toLocaleString('en-US')} bytes`;
    const initial = `${initialDbSize.toLocaleString('en-US')} bytes`;
    lines.push(
      size > initialDbSize
        ? `Size: ${bytes}, more than the ${initial} an initialized empty mailbox can take: the file held data.`
        : `Size: ${bytes}, within the ${initial} an initialized empty mailbox can take: the file held little or no mail.`
    );
  }

  const mtime = toTime(stats && (stats.mtimeMs ?? stats.mtime));
  if (mtime !== null) {
    const birthtime = toTime(stats && (stats.birthtimeMs ?? stats.birthtime));
    lines.push(
      `Last written ${ago(at - mtime)} before this alert (${iso(mtime)})${
        birthtime !== null && birthtime > 0 ? `, created ${iso(birthtime)}` : ''
      }.`
    );

    const started = toTime(processStartedAt);
    if (started !== null)
      lines.push(
        mtime < started
          ? `The file has not been written to since before this process started (${iso(
              started
            )}).`
          : `The file was written to after this process started (${iso(
              started
            )}).`
      );
  }

  lines.push(
    Array.isArray(companions) && companions.length > 0
      ? `Moved with it: ${companions.join(', ')}.`
      : 'No -wal, -shm or -journal file was next to it: no connection to it was open.'
  );

  if (Number.isFinite(retention) && retention > 0)
    lines.push(
      `The quarantined file is kept until ${iso(
        at + retention
      )} (jobs/cleanup-sqlite.js) and removed after that.`
    );

  return lines;
}

module.exports = quarantineReport;
