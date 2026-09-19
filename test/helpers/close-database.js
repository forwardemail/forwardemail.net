/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const sinon = require('sinon');

const closeDatabase = require('#helpers/close-database');

test.beforeEach((t) => {
  t.context.db = {
    open: true,
    inTransaction: false,
    pragma: sinon.stub(),
    close: sinon.stub()
  };
});

test('closeDatabase > returns immediately if db.open is false', async (t) => {
  const db = { open: false, pragma: sinon.stub(), close: sinon.stub() };
  await closeDatabase(db);
  t.false(db.pragma.called);
  t.false(db.close.called);
});

test('closeDatabase > calls optimize and close on healthy db', async (t) => {
  const { db } = t.context;
  await closeDatabase(db);
  t.true(db.pragma.calledWith('analysis_limit=400'));
  t.true(db.pragma.calledWith('optimize'));
  t.true(db.close.calledOnce);
});

test('closeDatabase > does NOT call wal_checkpoint (event-loop safety)', async (t) => {
  const { db } = t.context;
  await closeDatabase(db);
  // wal_checkpoint was removed — it caused catastrophic event-loop blocking
  // when the LRU sweep closed many databases in a single tick.
  // wal_autocheckpoint handles checkpointing automatically during writes.
  const checkpointCalls = db.pragma
    .getCalls()
    .filter((c) => c.args[0] && c.args[0].includes('wal_checkpoint'));
  t.is(checkpointCalls.length, 0);
});

test('closeDatabase > handles close() throwing', async (t) => {
  const { db } = t.context;
  db.close.throws(new Error('close failed'));
  await closeDatabase(db);
  t.true(db.close.calledOnce);
});

test('closeDatabase > still closes when optimize throws', async (t) => {
  const { db } = t.context;
  // e.g. SQLITE_BUSY past the busy timeout or SQLITE_FULL during ANALYZE
  db.pragma.withArgs('optimize').throws(new Error('database is locked'));
  await closeDatabase(db);
  t.true(db.pragma.calledWith('optimize'));
  t.true(db.close.calledOnce);
});

test('closeDatabase > skips optimize on read-only handles', async (t) => {
  const { db } = t.context;
  db.readonly = true;
  await closeDatabase(db);
  t.false(db.pragma.calledWith('optimize'));
  t.true(db.close.calledOnce);
});

test('closeDatabase > waits for inTransaction to clear', async (t) => {
  const { db } = t.context;
  db.inTransaction = true;
  // Simulate transaction completing after 50ms
  setTimeout(() => {
    db.inTransaction = false;
  }, 50);
  await closeDatabase(db);
  t.true(db.close.calledOnce);
});

test('closeDatabase > closes even if inTransaction never clears (30s timeout)', async (t) => {
  t.timeout(35000);
  const { db } = t.context;
  db.inTransaction = true;
  // Never clears - should timeout after 30s and still attempt close
  await closeDatabase(db);
  t.true(db.close.calledOnce);
});
