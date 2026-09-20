/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const test = require('ava');

const checkDiskSpace = require('#helpers/check-disk-space');
const workerConfig = require('#helpers/sqlite-worker-config');
const {
  assertRekeyDiskSpace,
  getMailboxSize,
  getRekeySpaceRequired
} = require('#helpers/rekey-disk-space');

test.beforeEach((t) => {
  t.context.dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rekey-disk-'));
  t.context.storagePath = path.join(t.context.dir, 'alias.sqlite');
});

test.afterEach.always((t) => {
  fs.rmSync(t.context.dir, { recursive: true, force: true });
});

test('getMailboxSize > counts the main file and its WAL', async (t) => {
  const { storagePath } = t.context;

  // no mailbox yet
  t.is(await getMailboxSize(storagePath), 0);

  fs.writeFileSync(storagePath, Buffer.alloc(4096));
  t.is(await getMailboxSize(storagePath), 4096);

  // the WAL holds committed pages not yet in the main file
  fs.writeFileSync(`${storagePath}-wal`, Buffer.alloc(1024));
  // the shared memory index is not data
  fs.writeFileSync(`${storagePath}-shm`, Buffer.alloc(32768));
  t.is(await getMailboxSize(storagePath), 4096 + 1024);
});

test('getRekeySpaceRequired > a multiple of the mailbox with a floor', (t) => {
  const { REKEY_DISK_MULTIPLIER, REKEY_MIN_FREE_DISK } = workerConfig;
  t.is(REKEY_DISK_MULTIPLIER, 3);
  t.is(REKEY_MIN_FREE_DISK, 1024 * 1024 * 1024);

  // small mailboxes only need the floor
  t.is(getRekeySpaceRequired(0), REKEY_MIN_FREE_DISK);
  t.is(getRekeySpaceRequired(1024), REKEY_MIN_FREE_DISK);

  // large ones need room for the copy and its VACUUM
  const size = 5 * 1024 * 1024 * 1024;
  t.is(getRekeySpaceRequired(size), size * REKEY_DISK_MULTIPLIER);

  t.throws(() => getRekeySpaceRequired(-1), { instanceOf: TypeError });
  t.throws(() => getRekeySpaceRequired('1GB'), { instanceOf: TypeError });
  t.throws(() => getRekeySpaceRequired(Number.NaN), { instanceOf: TypeError });
});

test.serial(
  'assertRekeyDiskSpace > passes when the volume has room',
  async (t) => {
    const { storagePath } = t.context;
    fs.writeFileSync(storagePath, Buffer.alloc(8192));
    fs.writeFileSync(`${storagePath}-wal`, Buffer.alloc(4096));

    const { free } = await checkDiskSpace(storagePath);
    // a floor this test volume certainly satisfies
    const minFreeDisk = workerConfig.REKEY_MIN_FREE_DISK;
    workerConfig.REKEY_MIN_FREE_DISK = 1;
    t.teardown(() => {
      workerConfig.REKEY_MIN_FREE_DISK = minFreeDisk;
    });

    const result = await assertRekeyDiskSpace(storagePath);
    t.is(result.mailboxSize, 8192 + 4096);
    t.is(result.required, (8192 + 4096) * workerConfig.REKEY_DISK_MULTIPLIER);
    t.true(result.free > 0);
    t.true(Math.abs(result.free - free) < 1024 * 1024 * 1024);

    // a reset does not copy the mailbox
    const reset = await assertRekeyDiskSpace(storagePath, { mailboxSize: 0 });
    t.is(reset.mailboxSize, 0);
    t.is(reset.required, 1);
  }
);

test.serial(
  'assertRekeyDiskSpace > refuses when the volume lacks room',
  async (t) => {
    const { storagePath } = t.context;
    fs.writeFileSync(storagePath, Buffer.alloc(8192));

    // no volume has this much room
    const minFreeDisk = workerConfig.REKEY_MIN_FREE_DISK;
    workerConfig.REKEY_MIN_FREE_DISK = Number.MAX_SAFE_INTEGER;
    t.teardown(() => {
      workerConfig.REKEY_MIN_FREE_DISK = minFreeDisk;
    });

    const err = await t.throwsAsync(assertRekeyDiskSpace(storagePath), {
      instanceOf: TypeError
    });
    t.regex(err.message, /^Needed .+ but only .+ was available$/);
    t.is(err.mailboxSize, 8192);
    t.is(err.spaceRequired, Number.MAX_SAFE_INTEGER);
    t.true(err.freeDiskSpace >= 0);

    // the caller shapes the error (the worker retries the job later)
    class Retryable extends Error {}
    const retryable = await t.throwsAsync(
      assertRekeyDiskSpace(storagePath, {
        createError: (message) => new Retryable(message)
      }),
      { instanceOf: Retryable }
    );
    t.is(retryable.mailboxSize, 8192);
  }
);
