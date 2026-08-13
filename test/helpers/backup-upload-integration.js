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
