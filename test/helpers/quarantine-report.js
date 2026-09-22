/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const test = require('ava');

const config = require('#config');
const quarantineReport = require('#helpers/quarantine-report');
const workerConfig = require('#helpers/sqlite-worker-config');

const ALERT = Date.parse('2026-09-21T11:29:39.877Z');

// the stats of a file that was left alone for weeks before it was found
function oldStats() {
  return {
    size: 331_776,
    mtimeMs: Date.parse('2026-07-27T11:42:35.758Z'),
    birthtimeMs: Date.parse('2026-07-27T11:15:27.516Z')
  };
}

test('describes a file that was damaged long before the alert', (t) => {
  const lines = quarantineReport({
    stats: oldStats(),
    companions: [],
    now: ALERT,
    processStartedAt: ALERT - ms('2d')
  });

  t.deepEqual(lines, [
    'Size: 331,776 bytes, within the 352,256 bytes an initialized empty mailbox can take: the file held little or no mail.',
    'Last written 56 days before this alert (2026-07-27T11:42:35.758Z), created 2026-07-27T11:15:27.516Z.',
    'The file has not been written to since before this process started (2026-09-19T11:29:39.877Z).',
    'No -wal, -shm or -journal file was next to it: no connection to it was open.',
    'The quarantined file is kept until 2026-09-28T11:29:39.877Z (jobs/cleanup-sqlite.js) and removed after that.'
  ]);
});

test('describes a file that was written by the running process', (t) => {
  const lines = quarantineReport({
    stats: {
      size: config.INITIAL_DB_SIZE,
      mtimeMs: ALERT - ms('30s'),
      birthtimeMs: ALERT - ms('3m')
    },
    companions: ['-journal'],
    now: ALERT,
    processStartedAt: ALERT - ms('1h')
  });

  t.is(
    lines[0],
    'Size: 352,256 bytes, within the 352,256 bytes an initialized empty mailbox can take: the file held little or no mail.'
  );
  t.is(
    lines[1],
    `Last written less than a minute before this alert (${new Date(
      ALERT - ms('30s')
    ).toISOString()}), created ${new Date(ALERT - ms('3m')).toISOString()}.`
  );
  t.is(
    lines[2],
    `The file was written to after this process started (${new Date(
      ALERT - ms('1h')
    ).toISOString()}).`
  );
  t.is(lines[3], 'Moved with it: -journal.');
  t.is(
    lines[4],
    `The quarantined file is kept until ${new Date(
      ALERT + workerConfig.QUARANTINE_RETENTION
    ).toISOString()} (jobs/cleanup-sqlite.js) and removed after that.`
  );
});

test('sizes a file that held data and rounds the age', (t) => {
  const lines = quarantineReport({
    stats: { size: 10_485_760, mtimeMs: ALERT - ms('90m'), birthtimeMs: 0 },
    now: ALERT
  });

  t.is(
    lines[0],
    'Size: 10,485,760 bytes, more than the 352,256 bytes an initialized empty mailbox can take: the file held data.'
  );
  // (no birth time on this filesystem, no process to compare with)
  t.is(
    lines[1],
    `Last written 2 hours before this alert (${new Date(
      ALERT - ms('90m')
    ).toISOString()}).`
  );
  t.is(
    lines[2],
    'No -wal, -shm or -journal file was next to it: no connection to it was open.'
  );
  t.is(lines.length, 4);
});

test('accepts Date values and never fails on missing ones', (t) => {
  const lines = quarantineReport({
    stats: {
      size: 4096,
      mtime: new Date(ALERT - ms('1d')),
      birthtime: new Date(ALERT - ms('2d'))
    },
    now: new Date(ALERT),
    processStartedAt: new Date(ALERT - ms('3d'))
  });
  t.is(lines.length, 5);
  t.regex(lines[1], /^Last written 1 day before this alert/);
  t.regex(lines[2], /^The file was written to after this process started/);

  // nothing known about the file at all
  const bare = quarantineReport({ now: ALERT, retention: 0 });
  t.deepEqual(bare, [
    'No -wal, -shm or -journal file was next to it: no connection to it was open.'
  ]);
  t.true(Array.isArray(quarantineReport()));
  t.true(Array.isArray(quarantineReport({ stats: null, companions: null })));
});
