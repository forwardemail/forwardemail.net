/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const path = require('node:path');
const process = require('node:process');
const punycode = require('node:punycode');
const { promisify } = require('node:util');
const { Buffer } = require('node:buffer');

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const { mkdirp } = require('mkdirp');
const PQueue = require('p-queue').default;

const config = require('#config');
const BoundedMap = require('#helpers/bounded-map');
const logger = require('#helpers/logger');
const IMAPError = require('#helpers/imap-error');
const { decrypt } = require('#helpers/encrypt-decrypt');

// dynamically import sqlite-regex
let sqliteRegex;
let sqliteRegexError;

import('sqlite-regex')
  .then((obj) => {
    sqliteRegex = obj;
  })
  .catch((err) => {
    // the extension is optional (see the load below); an import that fails
    // must not keep every open waiting for it forever
    sqliteRegexError = err;
  });

const pbkdf2 = promisify(crypto.pbkdf2);

//
// The key of a mailbox is derived from its password with PBKDF2-SHA256
// (`kdf_iter` rounds, 64007 by default, salted with the first 16 bytes of the
// file), and `db.key()` derives it on the event loop: about 50ms per open,
// during which no request of any alias on the process runs.  A SQLite
// server opens mailboxes all the time (each delivery opens a temporary
// mailbox, each sync and each request for a mailbox not in its cache opens
// one, in whichever process the request reached), so the derivations alone
// kept it busy and every request waited behind them ([SLOW_REQUEST]).
//
// So the key is derived on the thread pool instead and given to SQLite as
// is ("raw:" key and salt), which then opens the file in a few ms.  SQLite
// keeps the salt, so the password still opens it, after writes and VACUUM
// as well, and a new file gets that salt.  A file that is not encrypted, or
// one the key does not open (e.g. made with other KDF settings) is keyed
// with the password as before.
//
// - The salt is read by SQLite, through its own file handle (keyed first
//   with a raw key, which it does not derive).  Never open and close the
//   file here: closing any descriptor of a file drops every lock the process
//   holds on it, SQLite's included, after which another process can delete
//   the WAL of a connection still open and its writes are lost.
//   <https://www.sqlite.org/howtocorrupt.html#_posix_advisory_locks_canceled_by_a_separate_thread_doing_close_>
// - Opens of one file share one derivation, and at most two run at once, so
//   the thread pool (4 threads, shared with file and DNS work) keeps room.
// - A key is kept for DERIVED_KEY_TTL after it is derived, for the opens
//   that follow (a delivery, then the client that syncs it), and at most
//   DERIVED_KEYS_MAX at a time.  It is the same for the same file, password,
//   salt and rounds, so a kept one is never out of date: a rekeyed or
//   replaced file has another password or salt, and so another entry.  That
//   a key does not open its file is kept the same way, so the password is
//   not derived twice per open.
// - It is given through `db.key()`, never in SQL text, which SQLITE_VERBOSE
//   would log.
//
const SQLITE_HEADER = Buffer.from('SQLite format 3\0');
const NO_KEY = Buffer.from(`raw:${'0'.repeat(64)}`);
const DERIVED_KEY_TTL = ms('1m');
// (that a key does not open a file, which holds no secret, for longer)
const FAILED_KEY_TTL = ms('1h');
const DERIVED_KEYS_MAX = 1000;
const CACHE_KEY_SECRET = crypto.randomBytes(32);
const derivedKeys = new BoundedMap(DERIVED_KEYS_MAX);
const derivations = new PQueue({ concurrency: 2 });

// keep a derivation (or `false`, a key the file does not take) until
// DERIVED_KEY_TTL after it settles (one that fails is not kept)
function keepDerivedKey(cacheKey, derivation) {
  const entry = { derivation, expires: Number.POSITIVE_INFINITY };
  derivedKeys.set(cacheKey, entry);
  derivation.then(
    (key) => {
      entry.expires = Date.now() + (key ? DERIVED_KEY_TTL : FAILED_KEY_TTL);
    },
    () => {
      if (derivedKeys.get(cacheKey) === entry) derivedKeys.delete(cacheKey);
    }
  );
}

setInterval(() => {
  const now = Date.now();
  for (const [cacheKey, entry] of derivedKeys) {
    if (entry.expires <= now) derivedKeys.delete(cacheKey);
  }
}, DERIVED_KEY_TTL).unref();

// resolves with the key ("raw:" key and salt) and its entry, or nothing to
// key with the password
async function getDerivedKey(db, password) {
  let iterations;
  let salt;
  try {
    iterations = Number(db.pragma('kdf_iter', { simple: true }));
    db.key(NO_KEY);
    salt = Buffer.from(
      db.prepare("SELECT sqlite3mc_codec_data('cipher_salt')").pluck().get(),
      'hex'
    );
  } catch {
    return;
  }

  if (
    !Number.isSafeInteger(iterations) ||
    iterations <= 0 ||
    salt.length !== 16 ||
    salt.equals(SQLITE_HEADER) ||
    salt.every((byte) => byte === 0)
  )
    return;

  // (keyed per process, so the entry gives nothing to guess passwords by)
  const cacheKey = crypto
    .createHmac('sha256', CACHE_KEY_SECRET)
    .update(`${db.name}\0${iterations}\0`)
    .update(salt)
    .update(password)
    .digest('hex');
  let derivation = derivedKeys.get(cacheKey)?.derivation;
  if (!derivation) {
    derivation = derivations.add(() =>
      pbkdf2(password, salt, iterations, 32, 'sha256')
    );
    keepDerivedKey(cacheKey, derivation);
  }

  try {
    const key = await derivation;
    if (key)
      return {
        key: Buffer.from(`raw:${key.toString('hex')}${salt.toString('hex')}`),
        cacheKey
      };
  } catch {}
}

//
// NOTE: on all invocations of db.close() we run the pragma command "optimize"
// <https://phiresky.github.io/blog/2020/sqlite-performance-tuning/#more-things-that-must-be-run-manually>
// <https://www.sqlite.org/pragma.html#pragma_optimize>
//
async function setupPragma(
  db,
  session,
  cipher = 'chacha20',
  useDerivedKey = true
) {
  // safeguards
  if (!db.open) throw new TypeError('Database is not open');
  if (db.memory) throw new TypeError('Memory database');

  // NOTE: if you change anything in here change backup in sqlite-server
  db.pragma(`cipher='${cipher}'`);
  const password = decrypt(session.user.password);
  const derived =
    cipher === 'chacha20' && useDerivedKey && typeof db.key === 'function'
      ? await getDerivedKey(db, password)
      : undefined;
  // (the handle can be closed while the key was derived)
  if (!db.open) throw new TypeError('Database is not open');
  // (checked below, as the password is, by the first read of the file)
  if (derived) db.key(derived.key);
  else if (typeof db.key === 'function') db.key(Buffer.from(password));
  // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/78>
  // <https://www.zetetic.net/sqlcipher/sqlcipher-api/#example-2-raw-key-data-without-key-derivation>
  else db.pragma(`key="${password}"`);
  try {
    //
    // A read-only handle cannot rewrite the database header, so switching a
    // rollback-journal file (e.g. a freshly rekeyed VACUUM INTO copy) into
    // WAL mode throws SQLITE_READONLY.  Querying the journal mode still reads
    // page 1, so an invalid password surfaces as SQLITE_NOTADB either way.
    //
    if (db.readonly) {
      db.pragma('journal_mode');
    } else {
      //
      // auto_vacuum must be set before anything writes the database header.
      // On a new, empty file `journal_mode=WAL` writes page 1, after which
      // auto_vacuum can only change through a full VACUUM; setting it
      // afterwards (as this function used to) silently left every new
      // mailbox at auto_vacuum=NONE, so deleted mail never gave its space
      // back.  On an existing file this only records the mode for the next
      // VACUUM (see helpers/compact-database.js).  It stays inside this try
      // so a wrong key or legacy cipher reaches the fallback below.
      // <https://www.sqlite.org/pragma.html#pragma_auto_vacuum>
      //
      db.pragma('auto_vacuum=FULL');
      db.pragma('journal_mode=WAL');
    }
  } catch (err) {
    // a key the file does not take: the password decides, as before
    // (the errors a wrong key gives, as for the legacy cipher below; others,
    //  e.g. SQLITE_BUSY, are the same with either key and are thrown)
    if (
      derived &&
      (err.code === 'SQLITE_NOTADB' || err.code === 'SQLITE_ERROR')
    ) {
      keepDerivedKey(derived.cacheKey, Promise.resolve(false));
      return setupPragma(db, session, cipher, false);
    }

    // legacy fallback
    if (
      cipher === 'chacha20' &&
      (err.code === 'SQLITE_NOTADB' || err.code === 'SQLITE_ERROR')
    )
      return setupPragma(db, session, 'aes256cbc');
    // invalid password
    if (err.code === 'SQLITE_NOTADB') {
      const _err = new IMAPError(
        `Invalid password, please try again or go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          session.user.domain_name
        )}/aliases and click "Generate Password"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );
      _err.code = err.code;
      _err.original_error = err;
      throw _err;
    }

    throw err;
  }

  // overwrite deleted content with zeros
  // <https://www.sqlite.org/pragma.html#pragma_secure_delete>
  db.pragma('secure_delete=ON');

  // (auto_vacuum=FULL is set above, before journal_mode=WAL)

  // <https://litestream.io/tips/#busy-timeout>
  db.pragma(`busy_timeout=${config.busyTimeout}`);

  // <https://litestream.io/tips/#synchronous-pragma>
  // NOTE: FULL ensures durability on process crash (not just power loss).
  // With WAL mode, FULL syncs at every commit which prevents corruption
  // when a worker is OOM-killed mid-transaction.
  db.pragma('synchronous=FULL');
  // db.pragma('synchronous=EXTRA');

  //
  // Performance tuning PRAGMAs for high-concurrency WAL workloads
  //

  // Page cache per connection (negative = KiB).
  // With DATABASE_MAP_MAX_SIZE=1000 and 5 cluster workers, 64 MB per DB
  // caused 25 GB+ RSS (400 active DBs × 64 MB = 25.6 GB).  Configurable
  // via SQLITE_CACHE_SIZE_KB env var (default 16384 = 16 MB).
  const cacheSizeKB = Number(process.env.SQLITE_CACHE_SIZE_KB) || 16384;
  db.pragma(`cache_size=-${cacheSizeKB}`);

  // Limit WAL file growth to 256 MB
  // Prevents unbounded WAL growth when checkpointing is deferred
  db.pragma('journal_size_limit=268435456');

  // NOTE: mmap disabled to prevent virtual memory accumulation
  // when opening/closing hundreds of unique databases per minute.
  // The kernel page cache handles read caching instead.
  db.pragma('mmap_size=0');

  //
  // Auto-checkpoint every 1000 pages (default).
  // We rely on this instead of per-query PASSIVE checkpoints
  // to avoid SQLITE_BUSY_SNAPSHOT under concurrent readers.
  //
  db.pragma('wal_autocheckpoint=1000');

  // db.pragma(`user_version="1"`);

  // may want to set locking mode to exclusive down the road (more involved with locking though)
  // <https://www.sqlite.org/pragma.html#pragma_locking_mode>

  // <https://s3.amazonaws.com/bizzabo.file.upload/XTUmoCXSCfit8PqUs2AT_B%20Johnson%20-%20Building%20Production%20Applications%20Using%20Go%20%26%20SQLite.pdf>
  db.pragma('foreign_keys=ON');

  // <https://www.sqlite.org/pragma.html#pragma_case_sensitive_like>
  // db.pragma('case_sensitive_like=true');

  // <https://www.sqlite.org/pragma.html#pragma_encoding>
  db.pragma(`encoding='UTF-8'`);

  if (db.readonly) db.pragma('query_only=true');

  //
  // Applications that use long-lived database connections
  // should run "PRAGMA optimize=0x10002;" when the connection
  // is first opened, and then also run "PRAGMA optimize;"
  // periodically, perhaps once per day or once per hour.
  //
  // <https://www.sqlite.org/pragma.html#pragma_optimize>
  //
  // (optimize may run ANALYZE, which attempts to write to a read-only handle)
  //
  // Without `analysis_limit` the 0x10002 mask runs a full ANALYZE of any
  // table with a new index or that grew tenfold, which on a large mailbox
  // blocks the open (and every request waiting on it) for seconds; 400 rows
  // per index is the value SQLite recommends (as `closeDatabase` uses too)
  // <https://www.sqlite.org/lang_analyze.html#approx>
  //
  if (!db.readonly) {
    db.pragma('analysis_limit=400');
    db.pragma('optimize=0x10002;');
  }

  //
  // load regex extension for REGEX support
  //
  // NOTE: an open of a live database holds that database's file mutex while
  //       this runs (see helpers/open-database-handle.js), so the wait for
  //       the dynamic import is bounded: without the extension only REGEXP
  //       in IMAP SEARCH is unavailable, a hung open would block the mailbox
  //
  try {
    if (!sqliteRegex && !sqliteRegexError)
      await pWaitFor(() => Boolean(sqliteRegex || sqliteRegexError), {
        timeout: ms('10s')
      });
    if (sqliteRegexError) throw sqliteRegexError;
    db.loadExtension(sqliteRegex.getLoadablePath());
  } catch (err) {
    // <https://github.com/asg017/sqlite-regex/issues/14>
    err.isCodeBug = true;
    logger.fatal(err);
    if (err.message.includes('sqlite-regex-linux-arm64'))
      logger.error(
        new Error(
          '************ Please see https://github.com/asg017/sqlite-regex/issues/14 -- you can most likely ignore this warning unless you are using REGEXP in IMAP SEARCH command ***********'
        )
      );
  }

  //
  // <https://utelle.github.io/SQLite3MultipleCiphers/>
  //
  // > Additionally, the SQL command ATTACH supports the KEY keyword to allow
  //   to attach an encrypted database file to the current database connection:
  //
  // `ATTACH [DATABASE] <db-file-expression> AS <schema-name> [KEY <passphrase>]`
  //

  // TODO: compression, e.g. https://github.com/phiresky/sqlite-zstd
  // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#loadextensionpath-entrypoint---this>
  // db.loadExtension(...);

  // ensure we don't use memory and instead use disk for tmp storage
  // (otherwise 10 GB sqlite file will take up +10 GB memory)
  db.pragma('temp_store=1;');

  //
  // NOTE: if we don't set this then we get the following error for VACUUM commands:
  //
  // err.code = 'SQLITE_FULL'
  // err.message = 'database or disk full'
  //
  // <https://stackoverflow.com/a/23251896>
  // <https://www.sqlite.org/tempfiles.html#temporary_file_storage_locations>
  // SQLITE_TMPDIR=/mnt/storage_location/tmp
  // pragma temp_store_directory='/mnt/storage_location/tmp'
  //
  // NOTE: this method is deprecated so we use SQLITE_TMPDIR instead (but keep here as a safeguard)
  //
  try {
    const tempStoreDirectory = path.join(path.dirname(db.name), '/tmp');
    await mkdirp(tempStoreDirectory);
    db.pragma(`temp_store_directory='${tempStoreDirectory}'`);
  } catch (err) {
    logger.error(err);
  }
}

module.exports = setupPragma;
