/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Module = require('node:module');

const test = require('ava');

//
// Inject a logger stub so we can assert on debug/error routing without a real
// pino logger. Mirrors the stubbing pattern used by test/helpers/database-lru-map.js.
//
const loggerCalls = { debug: [], info: [], warn: [], error: [], fatal: [] };
const loggerStub = {
  debug(...args) {
    loggerCalls.debug.push(args);
  },
  info(...args) {
    loggerCalls.info.push(args);
  },
  warn(...args) {
    loggerCalls.warn.push(args);
  },
  error(...args) {
    loggerCalls.error.push(args);
  },
  fatal(...args) {
    loggerCalls.fatal.push(args);
  }
};

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request === '#helpers/logger') return 'close-db-logger-stub';
  return originalResolveFilename.call(this, request, ...args);
};

require.cache['close-db-logger-stub'] = {
  id: 'close-db-logger-stub',
  filename: 'close-db-logger-stub',
  loaded: true,
  exports: loggerStub
};

const closeDatabase = require('../../helpers/close-database');

const { isTransientCloseError, TRANSIENT_CLOSE_CODES } = closeDatabase;

//
// Minimal fake of a better-sqlite3 Database that records pragma/close calls and
// can be told to throw a specific error from a specific pragma. This simulates
// the production scenario where another process (the legacy listener or a
// fallback-rerouted worker) is mid-write on the same file and `PRAGMA optimize`
// reads a torn page.
//
function createFakeDb(options = {}) {
  const calls = { pragma: [], closed: false };
  return {
    open: true,
    inTransaction: false,
    calls,
    pragma(stmt) {
      calls.pragma.push(stmt);
      if (
        options.throwOnOptimize &&
        typeof stmt === 'string' &&
        stmt.includes('optimize')
      ) {
        throw options.throwOnOptimize;
      }
    },
    close() {
      if (options.throwOnClose) throw options.throwOnClose;
      calls.closed = true;
      this.open = false;
    }
  };
}

function sqliteError(code, message) {
  const err = new Error(message || code);
  err.code = code;
  return err;
}

test.beforeEach(() => {
  for (const key of Object.keys(loggerCalls)) loggerCalls[key].length = 0;
});

test('isTransientCloseError classifies SQLITE_IOERR_SHORT_READ by code', (t) => {
  t.true(isTransientCloseError(sqliteError('SQLITE_IOERR_SHORT_READ')));
  t.true(isTransientCloseError(sqliteError('SQLITE_NOTADB')));
  t.true(isTransientCloseError(sqliteError('SQLITE_BUSY')));
  t.true(isTransientCloseError(sqliteError('SQLITE_LOCKED')));
  t.true(isTransientCloseError(sqliteError('SQLITE_CORRUPT')));
});

test('isTransientCloseError classifies by message when code is absent', (t) => {
  t.true(isTransientCloseError(new Error('disk I/O error')));
  t.true(
    isTransientCloseError(new Error('SQLITE_IOERR_SHORT_READ: short read'))
  );
  t.true(isTransientCloseError(new Error('file is not a database')));
});

test('isTransientCloseError returns false for unrelated errors', (t) => {
  t.false(isTransientCloseError(new Error('some logic bug')));
  t.false(isTransientCloseError(sqliteError('SQLITE_CONSTRAINT')));
  t.false(isTransientCloseError(null));
  t.false(isTransientCloseError(undefined));
});

test('TRANSIENT_CLOSE_CODES includes the production short-read code', (t) => {
  t.true(TRANSIENT_CLOSE_CODES.has('SQLITE_IOERR_SHORT_READ'));
});

test('PRAGMA optimize SQLITE_IOERR_SHORT_READ is swallowed and db still closes', async (t) => {
  // This is the exact production scenario from the pm2 logs:
  // _sweepIdle -> closeDatabase -> db.pragma('optimize') -> SQLITE_IOERR_SHORT_READ
  const db = createFakeDb({
    throwOnOptimize: sqliteError('SQLITE_IOERR_SHORT_READ', 'disk I/O error')
  });

  await t.notThrowsAsync(() => closeDatabase(db));

  // optimize was attempted...
  t.true(db.calls.pragma.includes('optimize'));
  // ...but the failure did not prevent a clean close...
  t.true(db.calls.closed);
  t.false(db.open);
  // ...and it was logged at debug (not error), so it stops spamming error logs.
  t.is(loggerCalls.error.length, 0);
  t.true(loggerCalls.debug.length > 0);
});

test('non-transient optimize error is logged as error but db still closes', async (t) => {
  const db = createFakeDb({
    throwOnOptimize: sqliteError('SQLITE_CONSTRAINT', 'unexpected')
  });

  await t.notThrowsAsync(() => closeDatabase(db));

  t.true(db.calls.closed);
  t.false(db.open);
  // unexpected errors are surfaced via logger.error
  t.true(loggerCalls.error.length > 0);
});

test('transient error thrown by db.close() is swallowed', async (t) => {
  const db = createFakeDb({
    throwOnClose: sqliteError('SQLITE_IOERR_SHORT_READ', 'disk I/O error')
  });

  await t.notThrowsAsync(() => closeDatabase(db));

  // optimize ran cleanly; close threw transiently and was swallowed at debug.
  t.true(db.calls.pragma.includes('optimize'));
  t.is(loggerCalls.error.length, 0);
  t.true(loggerCalls.debug.length > 0);
});

test('already-closed db is a no-op', async (t) => {
  const db = createFakeDb();
  db.open = false;

  await t.notThrowsAsync(() => closeDatabase(db));

  t.deepEqual(db.calls.pragma, []);
  t.false(db.calls.closed);
});

test('null/undefined db is a no-op (no throw)', async (t) => {
  await t.notThrowsAsync(() => closeDatabase(null));
  await t.notThrowsAsync(() => closeDatabase(undefined));
  t.pass();
});
