/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');

const workerConfig = require('#helpers/sqlite-worker-config');
const {
  leftoverCompanionFiles,
  removeStaleSwapArtifact
} = require('#helpers/sqlite-file-utils');

test.beforeEach((t) => {
  t.context.dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sqlite-file-utils-'));
  t.context.id = new mongoose.Types.ObjectId().toString();
});

test.afterEach.always((t) => {
  fs.rmSync(t.context.dir, { recursive: true, force: true });
});

// a file (or directory) in the mailbox directory, last written at `mtime`
function place(t, name, { mtime, directory = false } = {}) {
  const filePath = path.join(t.context.dir, name);
  if (directory) fs.mkdirSync(filePath);
  else fs.writeFileSync(filePath, 'x');
  if (mtime) fs.utimesSync(filePath, mtime, mtime);
  return filePath;
}

test('leftoverCompanionFiles ignores an empty rollback journal', (t) => {
  const live = path.join(t.context.dir, `${t.context.id}.sqlite`);
  fs.writeFileSync(live, 'x');
  t.deepEqual(leftoverCompanionFiles(live), []);
  fs.writeFileSync(`${live}-journal`, '');
  t.deepEqual(leftoverCompanionFiles(live), []);
  fs.writeFileSync(`${live}-journal`, 'x');
  t.deepEqual(leftoverCompanionFiles(live), ['-journal']);
  fs.writeFileSync(`${live}-wal`, '');
  fs.writeFileSync(`${live}-shm`, '');
  t.deepEqual(leftoverCompanionFiles(live), ['-wal', '-shm', '-journal']);
});

test('a quarantined mailbox is removed once its retention is over', async (t) => {
  const { id } = t.context;
  const now = Date.now();
  const kept = now - workerConfig.QUARANTINE_RETENTION + ms('1h');
  const expired = now - workerConfig.QUARANTINE_RETENTION - ms('1h');

  // aged by the time of the quarantine in the name, whatever the mtime says
  const recent = place(t, `${id}.sqlite.quarantine-${kept}`, {
    mtime: new Date(now - ms('30d'))
  });
  const old = place(t, `${id}.sqlite.quarantine-${expired}`, {
    mtime: new Date(now)
  });
  const oldWal = place(t, `${id}.sqlite.quarantine-${expired}-wal`);
  const oldShm = place(t, `${id}.sqlite.quarantine-${expired}-shm`);

  t.false(await removeStaleSwapArtifact(recent, { now }));
  t.true(fs.existsSync(recent));

  // a dry run only reports
  t.true(await removeStaleSwapArtifact(old, { now, dryRun: true }));
  t.true(fs.existsSync(old));

  for (const file of [old, oldWal, oldShm]) {
    t.true(await removeStaleSwapArtifact(file, { now }));
    t.false(fs.existsSync(file));
  }

  // gone in the meantime: nothing to report
  t.false(await removeStaleSwapArtifact(old, { now }));
});

test('artifacts of interrupted file swaps are removed once they are a day old', async (t) => {
  const { id } = t.context;
  const now = Date.now();
  const fresh = new Date(now - ms('23h'));
  const stale = new Date(now - ms('25h'));

  const freshCopy = place(t, `${id}-${randomUUID()}-backup.sqlite`, {
    mtime: fresh
  });
  const staleCopy = place(t, `${id}-${randomUUID()}-backup.sqlite`, {
    mtime: stale
  });
  const staleWal = place(t, `${staleCopy.split('/').pop()}-wal`, {
    mtime: stale
  });
  const staleJournal = place(t, `${staleCopy.split('/').pop()}-journal`, {
    mtime: stale
  });
  const staleVacuum = place(t, `${id}.sqlite.vacuum-tmp-12345`, {
    mtime: stale
  });
  const staleMutex = place(t, `${id}.sqlite.lock.stale-${randomUUID()}`, {
    mtime: stale,
    directory: true
  });

  t.false(await removeStaleSwapArtifact(freshCopy, { now }));
  t.true(fs.existsSync(freshCopy));

  for (const file of [
    staleCopy,
    staleWal,
    staleJournal,
    staleVacuum,
    staleMutex
  ]) {
    t.true(await removeStaleSwapArtifact(file, { now }));
    t.false(fs.existsSync(file));
  }
});

test('the live mailbox, its companions, its mutex and its backups are never touched', async (t) => {
  const { id } = t.context;
  const now = Date.now();
  const ancient = new Date(now - ms('400d'));

  const untouchable = [
    place(t, `${id}.sqlite`, { mtime: ancient }),
    place(t, `${id}.sqlite-wal`, { mtime: ancient }),
    place(t, `${id}.sqlite-shm`, { mtime: ancient }),
    place(t, `${id}.sqlite-journal`, { mtime: ancient }),
    place(t, `${id}.sqlite.lock`, { mtime: ancient, directory: true }),
    place(t, `${id}-tmp.sqlite`, { mtime: ancient }),
    place(t, `${id}.sqlite.gz`, { mtime: ancient }),
    place(t, `${id}-backup.sqlite`, { mtime: ancient }),
    place(t, `${id}.sqlite.quarantine-notanumber`, { mtime: ancient }),
    place(t, `not-an-id.sqlite.quarantine-1`, { mtime: ancient })
  ];

  for (const file of untouchable) {
    t.is(await removeStaleSwapArtifact(file, { now }), null);
    t.true(fs.existsSync(file));
  }
});
