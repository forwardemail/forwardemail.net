/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { fork } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const Database = require('better-sqlite3-multiple-ciphers');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const config = require('#config');
const getPathToDatabase = require('#helpers/get-path-to-database');
const getRekeyTmpPath = require('#helpers/get-rekey-tmp-path');
const logger = require('#helpers/logger');
const setupPragma = require('#helpers/setup-pragma');
const { acquireRekeyLock, getRekeyLockKey } = require('#helpers/rekey-lock');
const { encrypt } = require('#helpers/encrypt-decrypt');
const workerConfig = require('#helpers/sqlite-worker-config');
const { rekey } = require('#helpers/worker');

const OLD_PASSWORD = 'correct horse battery staple';
const NEW_PASSWORD = 'staple battery horse correct';
const OLD_TOKENS = [{ description: 'old', salt: 'old-salt', hash: 'old-hash' }];
const NEW_TOKENS = [{ description: 'new', salt: 'new-salt', hash: 'new-hash' }];
const STORAGE_LOCATION = 'storage_do_1';

const imapSharedConfig = sharedConfig('IMAP');

test.before(async (t) => {
  await utils.setupMongoose();
  t.context.client = new Redis(imapSharedConfig.redis, logger);
  // a rekey waits (for minutes) for free memory before it starts, which is
  // not what these tests are about and would stall them on a small runner
  t.context.minFreeMem = workerConfig.MIN_FREE_MEM;
  workerConfig.MIN_FREE_MEM = 0;
});

test.after.always(async (t) => {
  workerConfig.MIN_FREE_MEM = t.context.minFreeMem;
  t.context.client.disconnect();
  await utils.teardownMongoose();
});

//
// A writer in another process, the way a sqlite cluster worker serving an
// in-flight request behaves: it opens the live mailbox through the shared
// file mutex, commits a row, closes the handle, and repeats until told to
// stop (or until the mailbox no longer opens with its password, i.e. the
// swap happened).  It reports every commit over IPC.
//
const WRITER_SOURCE = `
const { setTimeout } = require('node:timers/promises');
const process = require('node:process');
const openDatabaseHandle = require(process.argv[2]);
const [storagePath, password] = process.argv.slice(3);
const session = { user: { password, domain_name: 'example.com' } };
let stop = false;
let committed = 0;
process.on('message', (message) => {
  if (message === 'stop') stop = true;
});
(async () => {
  while (!stop) {
    let db;
    try {
      db = await openDatabaseHandle(storagePath, session, {
        lock: { timeoutMs: 60000 }
      });
    } catch (err) {
      if (err.code === 'SQLITE_NOTADB' || err.code === 'SQLITE_BUSY') break;
      throw err;
    }

    try {
      db.prepare('INSERT INTO rekey_test (value) VALUES (?)').run(
        'writer ' + committed
      );
      committed++;
      process.send({ committed });
    } finally {
      db.close();
    }

    await setTimeout(5);
  }

  process.send({ done: true, committed });
  process.exit(0);
})();
`;

function startWriter(t, storagePath) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rekey-writer-'));
  const script = path.join(dir, 'writer.js');
  fs.writeFileSync(script, WRITER_SOURCE);
  const child = fork(
    script,
    [
      path.join(__dirname, '../../helpers/open-database-handle.js'),
      storagePath,
      encrypt(OLD_PASSWORD)
    ],
    {
      cwd: path.join(__dirname, '../..'),
      stdio: ['ignore', 'ignore', 'inherit', 'ipc']
    }
  );
  const writer = { child, committed: 0, done: false, exitCode: null };
  child.on('message', (message) => {
    if (typeof message.committed === 'number')
      writer.committed = message.committed;
    if (message.done) writer.done = true;
  });
  child.on('exit', (code) => {
    writer.exitCode = code;
    writer.done = true;
  });
  t.teardown(() => {
    if (writer.exitCode === null) child.kill('SIGKILL');
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return writer;
}

//
// Persist the state the controller leaves behind when it queues a rekey,
// create the live encrypted mailbox and build the queue payload.
//
async function setupRekey(t, overrides = {}) {
  const aliasId = new mongoose.Types.ObjectId();
  const domainId = new mongoose.Types.ObjectId();
  const rekeyId = randomUUID();

  await Aliases.collection.insertOne({
    _id: aliasId,
    id: aliasId.toString(),
    domain: domainId,
    user: new mongoose.Types.ObjectId(),
    name: 'alias',
    storage_location: STORAGE_LOCATION,
    is_rekey: true,
    tokens: NEW_TOKENS,
    rekey_previous_tokens: OLD_TOKENS,
    rekey_id: rekeyId,
    rekey_started_at: new Date(),
    rekey_processing: false,
    ...overrides
  });

  await acquireRekeyLock(t.context.client, aliasId, rekeyId);

  const storagePath = getPathToDatabase({
    id: aliasId.toString(),
    storage_location: STORAGE_LOCATION
  });

  const session = {
    user: {
      id: aliasId.toString(),
      username: 'alias@example.com',
      alias_id: aliasId.toString(),
      alias_name: 'alias',
      domain_id: domainId.toString(),
      domain_name: 'example.com',
      password: encrypt(OLD_PASSWORD),
      storage_location: STORAGE_LOCATION,
      locale: 'en',
      owner_full_email: 'owner@example.com'
    }
  };

  const db = new Database(storagePath);
  await setupPragma(db, session);
  db.exec('CREATE TABLE Mailboxes (_id TEXT PRIMARY KEY, path TEXT)');
  db.exec('CREATE TABLE rekey_test (id INTEGER PRIMARY KEY, value TEXT)');
  const insert = db.prepare('INSERT INTO rekey_test (value) VALUES (?)');
  for (let i = 0; i < 500; i++) insert.run(`message ${i} ${'x'.repeat(200)}`);
  db.pragma('user_version=42');
  db.close();

  const payload = {
    id: randomUUID(),
    action: 'rekey',
    rekey_id: rekeyId,
    new_password: encrypt(NEW_PASSWORD),
    session
  };

  await t.context.client.set(`reset_check:${aliasId}`, true, 'PX', 30000);

  t.teardown(() => {
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${storagePath}${suffix}`, { force: true });
    fs.rmSync(getRekeyTmpPath(storagePath, payload), { force: true });
  });

  return { aliasId, domainId, rekeyId, storagePath, payload };
}

async function openWith(storagePath, password) {
  const db = new Database(storagePath, { fileMustExist: true });
  await setupPragma(db, {
    user: { password: encrypt(password), domain_name: 'example.com' }
  });
  return db;
}

async function assertOpensWith(t, storagePath, password) {
  const db = await openWith(storagePath, password);
  try {
    t.is(db.pragma('integrity_check', { simple: true }), 'ok');
    t.is(db.pragma('user_version', { simple: true }), 42);
    t.is(db.prepare('SELECT count(*) AS c FROM rekey_test').get().c, 500);
  } finally {
    db.close();
  }
}

async function assertDoesNotOpenWith(t, storagePath, password) {
  const db = new Database(storagePath, { fileMustExist: true });
  try {
    const err = await t.throwsAsync(
      setupPragma(db, {
        user: { password: encrypt(password), domain_name: 'example.com' }
      })
    );
    t.is(err.code, 'SQLITE_NOTADB');
  } finally {
    db.close();
  }
}

test.serial(
  'rekey rotates the mailbox password and finalizes the alias',
  async (t) => {
    t.timeout(120000);
    const { aliasId, rekeyId, storagePath, payload } = await setupRekey(t);

    await t.notThrowsAsync(rekey(payload));

    // the live database can only be decrypted with the new password
    await assertOpensWith(t, storagePath, NEW_PASSWORD);
    await assertDoesNotOpenWith(t, storagePath, OLD_PASSWORD);

    // no leftovers next to the live database
    t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));
    t.false(fs.existsSync(`${storagePath}-wal`));
    t.false(fs.existsSync(`${storagePath}-shm`));

    // the alias keeps the new tokens and every rekey field is cleared
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    for (const field of [
      'rekey_started_at',
      'rekey_previous_tokens',
      'rekey_id',
      'rekey_processing',
      'rekey_claimed_at',
      'rekey_swap_ino',
      'rekey_swapped_at'
    ])
      t.false(field in alias, `${field} should be cleared`);

    // the auth cache guard and the reset rate limit are released
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
    t.is(await t.context.client.get(`reset_check:${aliasId}`), null);
    t.is(rekeyId.length, 36);
  }
);

test.serial(
  'rekey backs off while another connection is still writing, then restores the previous tokens once the retries are used up',
  async (t) => {
    t.timeout(300000);
    const { aliasId, rekeyId, storagePath, payload } = await setupRekey(t);

    // simulate a stale handle in another process that keeps -wal/-shm alive
    const stale = await openWith(storagePath, OLD_PASSWORD);
    stale.prepare('INSERT INTO rekey_test (value) VALUES (?)').run('stale');

    try {
      // a transient condition: the job is retried later, nothing is touched
      const retry = await t.throwsAsync(rekey(payload));
      t.true(retry.isRekeyRetryable);
      t.is(retry.attempts, 1);
      t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));
      const pending = await Aliases.collection.findOne({ _id: aliasId });
      t.true(pending.is_rekey);
      t.false(pending.rekey_processing);
      t.is(pending.rekey_id, rekeyId);
      t.deepEqual(pending.tokens, NEW_TOKENS);
      t.is(await t.context.client.get(getRekeyLockKey(aliasId)), rekeyId);

      // the last attempt fails for good (the user is told to try again)
      const err = await t.throwsAsync(
        rekey({ ...payload, rekey_attempts: workerConfig.REKEY_MAX_ATTEMPTS })
      );
      t.is(err.code, 'SQLITE_BUSY');
      t.falsy(err.isRekeyRetryable);
    } finally {
      stale.close();
    }

    // the live database is untouched and still uses the previous password
    const db = await openWith(storagePath, OLD_PASSWORD);
    try {
      t.is(db.prepare('SELECT count(*) AS c FROM rekey_test').get().c, 501);
    } finally {
      db.close();
    }

    await assertDoesNotOpenWith(t, storagePath, NEW_PASSWORD);
    t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));

    // the previous tokens (which still decrypt the mailbox) are restored
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, OLD_TOKENS);
    t.false('rekey_swapped_at' in alias);
    t.false('rekey_swap_ino' in alias);
    t.false('rekey_claimed_at' in alias);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'rekey succeeds when a stale copy from a killed attempt is left behind',
  async (t) => {
    t.timeout(120000);
    const { storagePath, payload } = await setupRekey(t);

    // a previous attempt of the same operation died after VACUUM INTO
    fs.writeFileSync(getRekeyTmpPath(storagePath, payload), 'garbage');

    await t.notThrowsAsync(rekey(payload));
    await assertOpensWith(t, storagePath, NEW_PASSWORD);
    t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));
  }
);

test.serial(
  'rekey starts over when a request committed to the live mailbox after the snapshot was taken',
  async (t) => {
    t.timeout(120000);
    const { aliasId, rekeyId, storagePath, payload } = await setupRekey(t);
    const tmp = getRekeyTmpPath(storagePath, payload);

    // a request that was already in flight when the rotation started still
    // holds a handle to the live mailbox (its own -wal/-shm files stay
    // until it closes the handle)
    const inFlight = await openWith(storagePath, OLD_PASSWORD);

    const run = rekey(payload).then(
      () => null,
      (err) => err
    );

    // the snapshot (VACUUM INTO) has been taken once the copy exists
    await pWaitFor(() => fs.existsSync(tmp), { timeout: ms('60s') });

    // the request commits after the snapshot, then closes its handle (the
    // last connection to close checkpoints the commit into the live file)
    inFlight
      .prepare('INSERT INTO rekey_test (value) VALUES (?)')
      .run('after the snapshot');
    inFlight.close();

    // the swap is aborted and the rekey is scheduled to run again
    const retry = await run;
    t.truthy(retry);
    t.true(retry.isRekeyRetryable);
    t.is(retry.attempts, 1);
    t.regex(retry.message, /changed after the snapshot was taken/);

    // nothing was swapped: the live mailbox still uses the previous
    // password and holds the commit
    const live = await openWith(storagePath, OLD_PASSWORD);
    try {
      t.is(live.prepare('SELECT count(*) AS c FROM rekey_test').get().c, 501);
    } finally {
      live.close();
    }

    await assertDoesNotOpenWith(t, storagePath, NEW_PASSWORD);
    t.false(fs.existsSync(tmp));
    const pending = await Aliases.collection.findOne({ _id: aliasId });
    t.true(pending.is_rekey);
    t.false(pending.rekey_processing);
    t.is(pending.rekey_id, rekeyId);
    t.deepEqual(pending.tokens, NEW_TOKENS);

    // the retry takes a fresh snapshot, which includes the commit
    await t.notThrowsAsync(rekey({ ...payload, rekey_attempts: 1 }));
    const rekeyed = await openWith(storagePath, NEW_PASSWORD);
    try {
      t.is(
        rekeyed.prepare('SELECT count(*) AS c FROM rekey_test').get().c,
        501
      );
      t.is(
        rekeyed
          .prepare('SELECT value FROM rekey_test ORDER BY id DESC LIMIT 1')
          .pluck()
          .get(),
        'after the snapshot'
      );
    } finally {
      rekeyed.close();
    }

    await assertDoesNotOpenWith(t, storagePath, OLD_PASSWORD);
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'rekey never loses a commit of a writer in another process, however the commit is timed',
  async (t) => {
    t.timeout(ms('5m'));
    const { aliasId, storagePath, payload } = await setupRekey(t);

    // a mailbox large enough for the snapshot (VACUUM INTO) to take a
    // moment, so that commits land in every phase of an attempt
    {
      const db = await openWith(storagePath, OLD_PASSWORD);
      try {
        db.exec('CREATE TABLE bulk (id INTEGER PRIMARY KEY, value TEXT)');
        const insert = db.prepare('INSERT INTO bulk (value) VALUES (?)');
        db.transaction(() => {
          for (let i = 0; i < 40_000; i++) insert.run('x'.repeat(500));
        })();
      } finally {
        db.close();
      }
    }

    const writer = startWriter(t, storagePath);
    await pWaitFor(() => writer.committed > 0 || writer.done, {
      timeout: ms('60s')
    });
    t.false(writer.done);

    //
    // Rekey while the writer keeps committing: every attempt must notice a
    // commit it could lose (around the snapshot, at our own close, or
    // before the swap) and start over rather than swap.  Attempts are run
    // back to back here (the worker would space them out).
    //
    const outcomes = [];
    for (let attempt = 0; attempt < 5; attempt++) {
      const err = await rekey({ ...payload, rekey_attempts: attempt }).then(
        () => null,
        (err_) => err_
      );
      outcomes.push(err);
      if (!err) break;
      t.true(err.isRekeyRetryable, `retryable: ${err.message}`);
      t.true(writer.committed > 0);
    }

    // the writer is still going (it only stops on NOTADB, i.e. a swap it
    // must never see while it is writing)
    t.false(writer.done);
    t.true(
      outcomes.some(Boolean),
      'a concurrent writer must make at least one attempt start over'
    );

    // the writer stops; whatever it committed must survive the rotation
    writer.child.send('stop');
    await pWaitFor(() => writer.exitCode !== null, { timeout: ms('60s') });
    t.is(writer.exitCode, 0);
    t.true(writer.done);
    const { committed } = writer;
    t.true(committed > 0);

    let finished = false;
    for (
      let attempt = 0;
      attempt < workerConfig.REKEY_MAX_ATTEMPTS;
      attempt++
    ) {
      const err = await rekey({ ...payload, rekey_attempts: attempt }).then(
        () => null,
        (err_) => err_
      );
      if (!err) {
        finished = true;
        break;
      }

      t.true(err.isRekeyRetryable, `retryable: ${err.message}`);
    }

    t.true(finished);

    const rekeyed = await openWith(storagePath, NEW_PASSWORD);
    try {
      t.is(rekeyed.pragma('integrity_check', { simple: true }), 'ok');
      t.is(
        rekeyed.prepare('SELECT count(*) AS c FROM rekey_test').get().c,
        500 + committed
      );
      // every single commit, in order
      const values = rekeyed
        .prepare(
          "SELECT value FROM rekey_test WHERE value LIKE 'writer %' ORDER BY id"
        )
        .pluck()
        .all();
      t.deepEqual(
        values,
        Array.from({ length: committed }, (_, i) => `writer ${i}`)
      );
    } finally {
      rekeyed.close();
    }

    await assertDoesNotOpenWith(t, storagePath, OLD_PASSWORD);
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'rekey skips a job that is already claimed or no longer current',
  async (t) => {
    t.timeout(120000);
    const { aliasId, storagePath, payload } = await setupRekey(t, {
      rekey_processing: true,
      rekey_claimed_at: new Date()
    });

    await t.notThrowsAsync(rekey(payload));

    // nothing happened
    await assertOpensWith(t, storagePath, OLD_PASSWORD);
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.true(alias.is_rekey);
    t.true(alias.rekey_processing);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.is(config.env, 'test');
  }
);

test.serial(
  'rekey finalizes an alias whose mailbox does not exist yet',
  async (t) => {
    t.timeout(120000);
    const { aliasId, storagePath, payload } = await setupRekey(t);
    fs.rmSync(storagePath, { force: true });

    await t.notThrowsAsync(rekey(payload));

    t.false(fs.existsSync(storagePath));
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'rekey never finalizes an alias whose mailbox is missing but reported as holding data',
  async (t) => {
    t.timeout(120000);
    const { aliasId, rekeyId, storagePath, payload } = await setupRekey(t, {
      storage_used: 4096
    });
    fs.rmSync(storagePath, { force: true });

    // the file is lost or misplaced: the rekey waits for it instead of
    // discarding the only password that can decrypt it once it is back
    const retry = await t.throwsAsync(rekey(payload));
    t.true(retry.isRekeyRetryable);
    t.is(retry.attempts, 1);
    t.regex(retry.message, /is missing although the alias reports/);
    t.false(fs.existsSync(storagePath));
    const pending = await Aliases.collection.findOne({ _id: aliasId });
    t.true(pending.is_rekey);
    t.false(pending.rekey_processing);
    t.is(pending.rekey_id, rekeyId);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), rekeyId);

    // once the retries are used up the previous password is restored
    const err = await t.throwsAsync(
      rekey({ ...payload, rekey_attempts: workerConfig.REKEY_MAX_ATTEMPTS })
    );
    t.falsy(err.isRekeyRetryable);
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, OLD_TOKENS);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'rekey finalizes an alias whose mailbox is an empty file',
  async (t) => {
    t.timeout(120000);
    const { aliasId, storagePath, payload } = await setupRekey(t);
    fs.writeFileSync(storagePath, '');
    fs.writeFileSync(`${storagePath}-wal`, 'stale frames');

    await t.notThrowsAsync(rekey(payload));

    // the unfinished mailbox and its companions are gone: the next open
    // creates a fresh one with the new password
    t.false(fs.existsSync(storagePath));
    t.false(fs.existsSync(`${storagePath}-wal`));
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
  }
);

test.serial(
  'rekey finalizes a mailbox that already uses the new password',
  async (t) => {
    t.timeout(120000);
    const { aliasId, storagePath, payload } = await setupRekey(t);

    // a previous run swapped the file but died before finalizing
    {
      const db = await openWith(storagePath, OLD_PASSWORD);
      db.pragma('journal_mode=DELETE');
      db.rekey(Buffer.from(NEW_PASSWORD));
      db.prepare('VACUUM').run();
      db.close();
    }

    await t.notThrowsAsync(rekey(payload));

    await assertOpensWith(t, storagePath, NEW_PASSWORD);
    t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), null);
  }
);

test.serial(
  'rekey fails safely when the mailbox opens with neither password',
  async (t) => {
    t.timeout(120000);
    const { aliasId, storagePath, payload } = await setupRekey(t);

    // encrypted with a password nobody knows anymore
    {
      const db = await openWith(storagePath, OLD_PASSWORD);
      db.pragma('journal_mode=DELETE');
      db.rekey(Buffer.from('unknown password'));
      db.prepare('VACUUM').run();
      db.close();
    }

    const err = await t.throwsAsync(rekey(payload));
    t.is(err.code, 'SQLITE_NOTADB');

    // nothing was changed on disk and the previous tokens are restored
    t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.false(alias.is_rekey);
    t.deepEqual(alias.tokens, OLD_TOKENS);
  }
);

test.serial(
  'rekey treats a transient condition as retryable and releases its claim',
  async (t) => {
    t.timeout(300000);
    const { aliasId, rekeyId, storagePath, payload } = await setupRekey(t);

    // another swap of the same alias is in progress (e.g. an inline VACUUM
    // migration in a sqlite cluster worker holds the Redis swap lock) for
    // longer than the worker is willing to wait
    const swapLockKey = `db_swap_lock:${aliasId}`;
    await t.context.client.set(swapLockKey, 'someone-else', 'PX', 600000);
    t.teardown(() => t.context.client.del(swapLockKey));

    const err = await t.throwsAsync(rekey({ ...payload, rekey_attempts: 3 }));
    t.true(err.isRekeyRetryable);
    t.is(err.attempts, 4);

    // nothing about the mailbox changed and the operation is claimable again
    await assertOpensWith(t, storagePath, OLD_PASSWORD);
    t.false(fs.existsSync(getRekeyTmpPath(storagePath, payload)));
    const alias = await Aliases.collection.findOne({ _id: aliasId });
    t.true(alias.is_rekey);
    t.false(alias.rekey_processing);
    t.is(alias.rekey_id, rekeyId);
    t.false('rekey_claimed_at' in alias);
    t.deepEqual(alias.tokens, NEW_TOKENS);
    // the auth guard stays in place for the retry
    t.is(await t.context.client.get(getRekeyLockKey(aliasId)), rekeyId);
    t.true(workerConfig.REKEY_MAX_ATTEMPTS > 4);
  }
);

test.serial('rekey rejects an operation ID that is not a UUID', async (t) => {
  const { aliasId, payload } = await setupRekey(t);
  const err = await t.throwsAsync(rekey({ ...payload, rekey_id: '../../etc' }));
  t.is(err.message, 'Invalid rekey payload');
  const alias = await Aliases.collection.findOne({ _id: aliasId });
  t.true(alias.is_rekey);
  t.false(alias.rekey_processing);
});
