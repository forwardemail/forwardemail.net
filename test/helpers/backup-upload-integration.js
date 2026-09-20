/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const source = fs.readFileSync(
  path.join(__dirname, '../../helpers/worker.js'),
  'utf8'
);

test('routes every SQLite S3 multipart upload through the shared limiter', (t) => {
  const initialize = source.indexOf('const backupUploadLimiter');
  const throttle = source.indexOf('createThrottleStream(', initialize);
  const limiter = source.indexOf('limiter: backupUploadLimiter', throttle);
  const upload = source.indexOf('const upload = new Upload(', limiter);

  t.true(initialize > -1);
  t.true(throttle > initialize);
  t.true(limiter > throttle);
  t.true(upload > limiter);
});

//
// A backup never holds the mailbox in memory (a page copy for SQLite, an
// archive streamed with back-pressure otherwise), so the free memory it
// waits for is the worker's fixed reserve.  Waiting for a multiple of the
// mailbox size made every backup of a large mailbox fail on a busy host.
//
test('backup waits for the fixed memory reserve, not a multiple of the mailbox', (t) => {
  const start = source.indexOf('async function backup(payload)');
  const end = source.indexOf('async function vacuum(payload)');
  t.true(start > -1);
  t.true(end > start);
  const backup = source.slice(start, end);

  t.true(backup.includes('os.freemem() > workerConfig.MIN_FREE_MEM'));
  t.false(backup.includes('os.freemem() > spaceRequired'));

  // the archive formats stream through the throttle
  t.is(
    backup.split('createArchiveThrottle(archive, { output })').length - 1,
    2
  );
  t.true(backup.includes('await throttle.append('));
  t.true(backup.includes('await throttle.write('));
});
