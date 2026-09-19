/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const test = require('ava');

const config = require('#config');
const isStorageAvailable = require('#helpers/is-storage-available');

function asProduction(fn) {
  const { env } = config;
  config.env = 'production';
  try {
    return fn();
  } finally {
    config.env = env;
  }
}

test('outside production the storage is always available', (t) => {
  t.not(config.env, 'production');
  t.true(isStorageAvailable(path.join(os.tmpdir(), 'missing', 'x.sqlite')));
});

test('in production an unmounted or empty storage directory is not available', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-available-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const storage = path.join(dir, 'storage_do_1');

  asProduction(() => {
    // the mount point does not even exist
    t.false(isStorageAvailable(path.join(storage, 'x.sqlite')));

    // an unmounted mount point: an empty directory on the parent's device
    fs.mkdirSync(storage);
    t.false(isStorageAvailable(path.join(storage, 'x.sqlite')));

    // a freshly formatted (empty) volume mounted in its place looks the
    // same apart from `lost+found`
    fs.mkdirSync(path.join(storage, 'lost+found'));
    t.false(isStorageAvailable(path.join(storage, 'x.sqlite')));

    // a plain directory that holds mailboxes is in use
    fs.writeFileSync(path.join(storage, 'other.sqlite'), '');
    t.true(isStorageAvailable(path.join(storage, 'x.sqlite')));
  });
});

test('in production a mount point is available', (t) => {
  // procfs is a mount point on every Linux host
  if (!fs.existsSync('/proc/self')) {
    t.pass();
    return;
  }

  asProduction(() => {
    t.true(isStorageAvailable('/proc/x.sqlite'));
  });
});
