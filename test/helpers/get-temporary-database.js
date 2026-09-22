/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The temporary mailbox of an alias (`<id>-tmp.sqlite`, where inbound mail
// waits while the live mailbox cannot be written): opened once, kept in the
// server's cache, shared by concurrent openers, guarded against another
// worker initializing the same file, and refused during a shutdown.
//

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const DatabaseLRUMap = require('#helpers/database-lru-map');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const getPathToDatabase = require('#helpers/get-path-to-database');
const getTemporaryDatabase = require('#helpers/get-temporary-database');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach((t) => {
  const aliasId = new mongoose.Types.ObjectId().toString();
  t.context.session = {
    user: {
      alias_id: aliasId,
      storage_location: 'storage_do_1',
      domain_name: 'example.com'
    }
  };
  const storagePath = getPathToDatabase({
    id: aliasId,
    storage_location: 'storage_do_1'
  });
  t.context.tmpPath = path.join(
    path.dirname(storagePath),
    `${aliasId}-tmp.sqlite`
  );
  // the parts of the SQLite server the helper uses
  t.context.server = {
    isClosing: false,
    client: new Redis({ keyPrefix: randomUUID() }),
    temporaryDatabaseMap: new DatabaseLRUMap({ maxSize: 10 })
  };
});

test.afterEach.always((t) => {
  t.context.server.temporaryDatabaseMap.destroy();
  t.context.server.client.disconnect();
  for (const suffix of ['', '-wal', '-shm', '-journal'])
    fs.rmSync(`${t.context.tmpPath}${suffix}`, { force: true });
});

test('opens the temporary mailbox once and serves it from the cache', async (t) => {
  const { server, session, tmpPath } = t.context;
  const aliasId = session.user.alias_id;

  const db = await getTemporaryDatabase.call(server, session);
  t.true(db.open);
  t.true(fs.existsSync(tmpPath));
  t.is(db.name, tmpPath);
  t.true(
    db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .pluck()
      .all()
      .includes('TemporaryMessages')
  );
  // a small, ephemeral store: a 2 MB page cache and no fsync per commit
  t.is(db.pragma('cache_size', { simple: true }), -2048);
  // 1 = NORMAL
  t.is(db.pragma('synchronous', { simple: true }), 1);

  // cached, and the same handle comes back
  t.is(server.temporaryDatabaseMap.get(aliasId), db);
  t.is(await getTemporaryDatabase.call(server, session), db);
  // nothing was left locked behind
  t.is(await server.client.get(`db_tmp_open_lock:${aliasId}`), null);
});

test('a handle closed elsewhere is replaced instead of returned', async (t) => {
  const { server, session } = t.context;
  const aliasId = session.user.alias_id;

  const first = await getTemporaryDatabase.call(server, session);
  first.close();
  t.false(first.open);
  t.is(server.temporaryDatabaseMap.get(aliasId), first);

  const second = await getTemporaryDatabase.call(server, session);
  t.not(second, first);
  t.true(second.open);
  t.is(server.temporaryDatabaseMap.get(aliasId), second);
});

test('concurrent openers share one handle', async (t) => {
  const { server, session } = t.context;
  const handles = await Promise.all(
    Array.from({ length: 5 }, () => getTemporaryDatabase.call(server, session))
  );
  t.true(handles.every((db) => db === handles[0]));
  t.true(handles[0].open);
});

test('is refused while the server is shutting down', async (t) => {
  const { server, session, tmpPath } = t.context;
  server.isClosing = true;
  await t.throwsAsync(getTemporaryDatabase.call(server, session), {
    instanceOf: ServerShutdownError
  });
  t.false(fs.existsSync(tmpPath));
});

test('waits for another worker that is initializing the same mailbox', async (t) => {
  const { server, session, tmpPath } = t.context;
  const aliasId = session.user.alias_id;

  // the file does not exist yet and another worker holds the lock
  await server.client.set(`db_tmp_open_lock:${aliasId}`, 'other', 'PX', 5000);
  const err = await t.throwsAsync(getTemporaryDatabase.call(server, session));
  t.is(err.code, 'SQLITE_BUSY');
  t.false(fs.existsSync(tmpPath));
  t.is(server.temporaryDatabaseMap.get(aliasId), undefined);

  // once the other worker is done the lock is gone and the open goes through
  await server.client.del(`db_tmp_open_lock:${aliasId}`);
  const db = await getTemporaryDatabase.call(server, session);
  t.true(db.open);

  // an existing file is safe to open concurrently: the lock is not needed
  server.temporaryDatabaseMap.evict(aliasId);
  db.close();
  await server.client.set(`db_tmp_open_lock:${aliasId}`, 'other', 'PX', 5000);
  const again = await getTemporaryDatabase.call(server, session);
  t.true(again.open);
  t.is(await server.client.get(`db_tmp_open_lock:${aliasId}`), 'other');
});

test('a file that cannot be keyed leaves no handle behind', async (t) => {
  const { server, session, tmpPath } = t.context;
  const aliasId = session.user.alias_id;

  // not a database at all
  fs.writeFileSync(tmpPath, 'this is not a database'.repeat(100));
  const err = await t.throwsAsync(getTemporaryDatabase.call(server, session));
  t.is(err.code, 'SQLITE_NOTADB');
  t.is(server.temporaryDatabaseMap.get(aliasId), undefined);
  t.is(await server.client.get(`db_tmp_open_lock:${aliasId}`), null);

  // the file was not held open: it can be replaced and opened afresh
  fs.rmSync(tmpPath);
  const db = await getTemporaryDatabase.call(server, session);
  t.true(db.open);
});
