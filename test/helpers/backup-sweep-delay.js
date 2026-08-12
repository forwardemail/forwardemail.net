/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const getBackupSweepDelay = require('#helpers/backup-sweep-delay');
const {
  BACKUP_SWEEP_INTERVAL,
  BACKUP_SWEEP_JITTER
} = require('#helpers/backup-sweep-delay');

test('uses a daily interval with one hour of jitter', (t) => {
  t.is(BACKUP_SWEEP_INTERVAL, 86_400_000);
  t.is(BACKUP_SWEEP_JITTER, 3_600_000);
});

test('returns a delay within the jittered range', (t) => {
  for (let index = 0; index < 100; index++) {
    const delay = getBackupSweepDelay();
    t.true(delay >= BACKUP_SWEEP_INTERVAL);
    t.true(delay < BACKUP_SWEEP_INTERVAL + BACKUP_SWEEP_JITTER);
  }
});
