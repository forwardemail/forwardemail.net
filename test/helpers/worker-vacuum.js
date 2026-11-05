/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The sqlite-worker `vacuum` job (helpers/worker.js) on a real alias: a
// mailbox created before auto_vacuum was set in the right order, with most
// of its mail deleted, is compacted and converted in place, and the alias'
// storage used follows.
//

const fs = require('node:fs');
const os = require('node:os');
const process = require('node:process');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const Database = require('better-sqlite3-multiple-ciphers');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const logger = require('#helpers/logger');
const openDatabaseHandle = require('#helpers/open-database-handle');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { getRekeyLockKey } = require('#helpers/rekey-lock');
const { listIndexes, vacuum } = require('#helpers/worker');

const imapSharedConfig = sharedConfig('IMAP');

test.before(utils.setupMongoose);
test.before((t) => {
  t.context.client = new Redis(imapSharedConfig.redis, logger);
});
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  t.context.client.disconnect();
});
test.beforeEach(utils.setupFactories);

async function createAlias(t) {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: createTangerine(t.context.client, logger),
      has_smtp: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  const pass = await alias.createToken();
  return {
    alias,
    session: {
      user: {
        alias_id: alias.id,
        alias_name: alias.name,
        domain_name: domain.name,
        password: encrypt(pass),
        storage_location: alias.storage_location
      }
    },
    pass
  };
}

test('the vacuum job compacts and converts a legacy mailbox in place', async (t) => {
  const { client } = t.context;
  const { alias, session, pass } = await createAlias(t);
  const dbFilePath = getPathToDatabase(alias);
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  t.teardown(() => {
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${dbFilePath}${suffix}`, { force: true });
  });

  // a mailbox as created before the fix (auto_vacuum=NONE), 90% deleted
  {
    const db = new Database(dbFilePath);
    db.pragma("cipher='chacha20'");
    db.key(Buffer.from(pass));
    db.pragma('journal_mode=WAL');
    db.exec('CREATE TABLE "Messages" ("_id" TEXT PRIMARY KEY, "body" TEXT)');
    const insert = db.prepare('INSERT INTO "Messages" VALUES (?, ?)');
    db.transaction(() => {
      for (let i = 0; i < 3000; i++) insert.run(`m${i}`, 'x'.repeat(4000));
    })();
    db.exec('DELETE FROM "Messages" WHERE rowid % 10 != 0');
    db.pragma('wal_checkpoint(TRUNCATE)');
    t.is(db.pragma('auto_vacuum', { simple: true }), 0);
    db.close();
  }

  const before = fs.statSync(dbFilePath).size;
  await client.del(`vacuum_check:${alias.id}`, `storage_debounce:${alias.id}`);

  await vacuum({ action: 'vacuum', session });

  const after = fs.statSync(dbFilePath).size;
  t.true(after < before / 4, `${after} < ${before / 4}`);

  const db = await openDatabaseHandle(dbFilePath, session);
  t.teardown(() => db.open && db.close());
  t.is(db.pragma('auto_vacuum', { simple: true }), 1);
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');
  t.is(db.prepare('SELECT count(*) FROM "Messages"').pluck().get(), 300);

  // checked again tomorrow, recorded as converted, storage used follows
  const pttl = await client.pttl(`vacuum_check:${alias.id}`);
  t.true(pttl > ms('23h') && pttl <= ms('1d'));
  await pWaitFor(
    async () => {
      const doc = await Aliases.findById(alias._id).lean();
      return doc.has_auto_vacuum_migration === true && doc.storage_used > 0;
    },
    { timeout: ms('10s') }
  );
  const doc = await Aliases.findById(alias._id).lean();
  t.is(doc.storage_used, after);
});

test('the vacuum job leaves a missing or empty mailbox alone', async (t) => {
  const { alias, session } = await createAlias(t);
  const dbFilePath = getPathToDatabase(alias);
  t.false(fs.existsSync(dbFilePath));
  await t.notThrowsAsync(vacuum({ action: 'vacuum', session }));
  t.false(fs.existsSync(dbFilePath));
});

test('a mailbox already at auto_vacuum=FULL is recorded and not reopened', async (t) => {
  const { client } = t.context;
  const { alias, session } = await createAlias(t);
  const dbFilePath = getPathToDatabase(alias);
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  t.teardown(() => {
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${dbFilePath}${suffix}`, { force: true });
  });

  // created with the fixed pragma order
  {
    const db = await openDatabaseHandle(dbFilePath, session);
    db.exec('CREATE TABLE "Messages" ("_id" TEXT PRIMARY KEY, "body" TEXT)');
    t.is(db.pragma('auto_vacuum', { simple: true }), 1);
    db.close();
  }

  await client.del(`vacuum_check:${alias.id}`);
  await vacuum({ action: 'vacuum', session });

  const doc = await Aliases.findById(alias._id).lean();
  t.true(doc.has_auto_vacuum_migration);
  t.truthy(await client.get(`vacuum_check:${alias.id}`));
});

test('a job queued before a password change is dropped quietly', async (t) => {
  const { alias, session } = await createAlias(t);
  const dbFilePath = getPathToDatabase(alias);
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  t.teardown(() => {
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${dbFilePath}${suffix}`, { force: true });
  });

  {
    const db = await openDatabaseHandle(dbFilePath, session);
    db.exec('CREATE TABLE "Messages" ("_id" TEXT PRIMARY KEY, "body" TEXT)');
    db.close();
  }

  const fatal = [];
  const { fatal: original } = logger;
  logger.fatal = (...args) => {
    fatal.push(args);
  };

  t.teardown(() => {
    logger.fatal = original;
  });

  await t.notThrowsAsync(
    vacuum({
      action: 'vacuum',
      session: {
        user: { ...session.user, password: encrypt('not-the-password') }
      }
    })
  );
  t.is(fatal.length, 0);
});

//
// The `listIndexes` job builds the message list indexes of a mailbox too
// large for the SQLite server to build them (see helpers/get-database.js),
// under the mailbox's VACUUM lock, and never alongside a VACUUM, a rotation
// or with a password changed since it was queued.
//
const LIST_INDEXES_SQL = `SELECT "name" FROM "sqlite_master" WHERE "type" = 'index' AND "name" IN ('Messages_mailbox_created_at', 'Messages_created_at') ORDER BY "name"`;

async function createMailboxWithoutListIndexes(t) {
  const { alias, session } = await createAlias(t);
  const dbFilePath = getPathToDatabase(alias);
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  t.teardown(() => {
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${dbFilePath}${suffix}`, { force: true });
  });

  const db = await openDatabaseHandle(dbFilePath, session);
  db.exec(
    'CREATE TABLE "Messages" ("_id" TEXT PRIMARY KEY, "mailbox" TEXT, "created_at" TEXT)'
  );
  const insert = db.prepare('INSERT INTO "Messages" VALUES (?, ?, ?)');
  for (let i = 0; i < 100; i++)
    insert.run(`m${i}`, `box${i % 3}`, new Date(i * 1000).toISOString());
  db.close();
  return { alias, session, dbFilePath };
}

async function getListIndexes(dbFilePath, session) {
  const db = await openDatabaseHandle(dbFilePath, session);
  try {
    return db.prepare(LIST_INDEXES_SQL).pluck().all();
  } finally {
    db.close();
  }
}

test('the list index job builds the message list indexes and frees the lock', async (t) => {
  const { client } = t.context;
  const { alias, session, dbFilePath } = await createMailboxWithoutListIndexes(
    t
  );

  await listIndexes({ action: 'list_indexes', session });
  t.deepEqual(await getListIndexes(dbFilePath, session), [
    'Messages_created_at',
    'Messages_mailbox_created_at'
  ]);
  t.is(await client.get(`vacuum_lock:${alias.id}`), null);
});

for (const [name, getKey] of [
  ['the VACUUM lock', (alias) => `vacuum_lock:${alias.id}`],
  ['a rotation', (alias) => getRekeyLockKey(alias.id)],
  ['a file swap', (alias) => `db_swap_lock:${alias.id}`]
]) {
  test(`the list index job leaves a mailbox alone while ${name} holds it`, async (t) => {
    const { client } = t.context;
    const { alias, session, dbFilePath } =
      await createMailboxWithoutListIndexes(t);
    const key = getKey(alias);
    await client.set(key, 'another-process', 'PX', ms('1m'));
    t.teardown(() => client.del(key));

    await listIndexes({ action: 'list_indexes', session });
    t.deepEqual(await getListIndexes(dbFilePath, session), []);
    t.is(await client.get(key), 'another-process');
    if (name !== 'the VACUUM lock')
      t.is(await client.get(`vacuum_lock:${alias.id}`), null);
  });
}

//
// A build that outlasts its lock does not free the lock another holder took
// meanwhile (it was released by an owner shared by the whole process, so one
// taken again in this process looked like its own).
//
test('a list index build does not free a lock another holder took meanwhile', async (t) => {
  const { client } = t.context;
  const { alias, session, dbFilePath } = await createMailboxWithoutListIndexes(
    t
  );
  const lockKey = `vacuum_lock:${alias.id}`;
  const other = `${os.hostname()}:${process.pid}`;
  t.teardown(() => client.del(lockKey));

  // (the lock is taken by another holder in this process while it builds)
  const { mget } = client;
  client.mget = async function (...args) {
    await client.set(lockKey, other, 'PX', ms('1m'));
    return mget.apply(this, args);
  };

  t.teardown(() => {
    client.mget = mget;
  });

  const db = await openDatabaseHandle(dbFilePath, session);
  const statements = getDatabase.getMissingListIndexes(db);
  db.close();
  t.true(
    await getDatabase.createIndexesInThread(
      dbFilePath,
      session,
      statements,
      client
    )
  );
  t.deepEqual(await getListIndexes(dbFilePath, session), [
    'Messages_created_at',
    'Messages_mailbox_created_at'
  ]);
  t.is(await client.get(lockKey), other);
});

test('a list index job queued before a password change is dropped quietly', async (t) => {
  const { session, dbFilePath } = await createMailboxWithoutListIndexes(t);
  const fatal = [];
  const { fatal: original } = logger;
  logger.fatal = (...args) => {
    fatal.push(args);
  };

  t.teardown(() => {
    logger.fatal = original;
  });

  await t.notThrowsAsync(
    listIndexes({
      action: 'list_indexes',
      session: {
        user: { ...session.user, password: encrypt('not-the-password') }
      }
    })
  );
  t.is(fatal.length, 0);
  t.deepEqual(await getListIndexes(dbFilePath, session), []);
});
