/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const BackupUploadLimiter = require('#helpers/backup-upload-limiter');

test('uses one Redis key for backup reservations across workers', async (t) => {
  const calls = [];
  const delays = [];
  const client = {
    async eval(...args) {
      calls.push(args);
      return calls.length === 1 ? 0 : 25;
    }
  };

  const first = new BackupUploadLimiter({
    client,
    bytesPerSecond: '1KB/s',
    key: 'backup_upload:test',
    sleep: async (delay) => delays.push(delay)
  });
  const second = new BackupUploadLimiter({
    client,
    bytesPerSecond: '1KB/s',
    key: 'backup_upload:test',
    sleep: async (delay) => delays.push(delay)
  });

  await first.reserve(1000);
  await second.reserve(1000);

  t.is(calls.length, 2);
  t.is(calls[0][1], 1);
  t.is(calls[0][2], 'backup_upload:test');
  t.is(calls[0][3], 1000);
  t.is(calls[0][4], 1000);
  t.is(calls[1][2], calls[0][2]);
  t.deepEqual(delays, [25]);
});

test('keeps uploads bounded when Redis is unavailable', async (t) => {
  const delays = [];
  const limiter = new BackupUploadLimiter({
    client: {
      async eval() {
        throw new Error('Redis unavailable');
      }
    },
    bytesPerSecond: '1KB/s',
    key: 'backup_upload:test',
    now: () => 0,
    sleep: async (delay) => delays.push(delay)
  });

  await limiter.reserve(1000);
  await limiter.reserve(1000);

  t.deepEqual(delays, [1000]);
});
