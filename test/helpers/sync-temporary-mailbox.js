/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const mongoose = require('mongoose');
const test = require('ava');
const { ReplyError } = require('ioredis');
const { SqliteError } = require('better-sqlite3-multiple-ciphers');

const utils = require('../utils');

const IMAPError = require('#helpers/imap-error');
const Messages = require('#models/messages');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { isServiceError } = require('#helpers/sync-temporary-mailbox');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

function thrown(fn) {
  try {
    fn();
  } catch (err) {
    return err;
  }

  throw new Error('Nothing was thrown');
}

function withCode(message, code) {
  return Object.assign(new Error(message), { code });
}

//
// Errors an append of one message from the temporary mailbox can end with,
// and whether each is of the mailbox or a service (the sync stops and tries
// the message again later) or of the message (it is passed over for 10
// minutes).  Each is refined as the append refines it before it is checked.
//
const SERVICE = [
  ['a Redis reply error', () => new ReplyError('LOADING Redis is loading')],
  ['a closed Redis connection', () => new Error('Connection is closed.')],
  [
    'a MongoDB network error',
    () => new mongoose.mongo.MongoNetworkError('connection timed out')
  ],
  [
    'a connection that is not open',
    () => new TypeError('The database connection is not open')
  ],
  [
    'a connection busy with another query',
    () => new TypeError('This database connection is busy executing a query')
  ],
  [
    'a disk that is full',
    () => withCode('ENOSPC: no space left on device, write', 'ENOSPC')
  ],
  ['the server shutting down', () => new ServerShutdownError()],
  [
    'a handle closed under getDatabase',
    () => new TypeError('database connection is not open')
  ],
  ['a connection reset', () => withCode('read ECONNRESET', 'ECONNRESET')],
  [
    'memory that ran out',
    () => withCode('ENOMEM: Cannot allocate memory', 'ENOMEM')
  ]
];
for (const code of [
  'SQLITE_BUSY',
  'SQLITE_BUSY_SNAPSHOT',
  'SQLITE_LOCKED',
  'SQLITE_IOERR_SHORT_READ',
  'SQLITE_FULL',
  'SQLITE_PROTOCOL',
  'SQLITE_CORRUPT',
  'SQLITE_NOTADB',
  'SQLITE_CANTOPEN',
  'SQLITE_READONLY',
  'SQLITE_NOMEM'
])
  SERVICE.push([code, () => new SqliteError('database error', code)]);

const MESSAGE = [
  ['a document that does not validate', () => new Messages({}).validateSync()],
  [
    'a date that does not cast',
    () => new Messages({ hdate: 'garbage' }).validateSync(['hdate'])
  ],
  [
    'a CastError',
    () => new mongoose.Error.CastError('Date', 'garbage', 'hdate')
  ],
  ['an invalid date', () => thrown(() => new Date('x').toISOString())],
  ['a TypeError that names a timeout', () => thrown(() => null.timeout)],
  ['a DOMException', () => thrown(() => structuredClone(() => {}))],
  ['a DOMException of atob', () => thrown(() => atob('***'))],
  [
    'an AbortError',
    () =>
      Object.assign(new Error('The operation was aborted'), {
        name: 'AbortError'
      })
  ],
  [
    'a stack overflow',
    () =>
      thrown(function f() {
        f();
      })
  ],
  [
    'a header that names a timeout',
    () => new Error('Invalid header "X-Timeout: 5"')
  ],
  [
    'a parse that took long',
    () => new Error('Parsing took longer than expected')
  ],
  [
    'a quota error for an alias that says timeout',
    () =>
      new IMAPError(
        'Mailbox quota for news@timeout.com would be exceeded by message size',
        { imapResponse: 'OVERQUOTA' }
      )
  ],
  [
    'an error about a folder named "Timeout"',
    () =>
      new IMAPError('Mailbox "Timeout" could not be created', {
        imapResponse: 'CANNOT'
      })
  ],
  [
    'a message too big',
    () => new SqliteError('string or blob too big', 'SQLITE_TOOBIG')
  ],
  [
    'a read outside a buffer',
    () => thrown(() => Buffer.alloc(1).readUInt32BE(10))
  ],
  [
    'a string too long',
    () =>
      withCode(
        'Cannot create a string longer than 0x1fffffe8 characters',
        'ERR_STRING_TOO_LONG'
      )
  ]
];
for (const code of [
  'SQLITE_CONSTRAINT_UNIQUE',
  'SQLITE_CONSTRAINT_NOTNULL',
  'SQLITE_MISMATCH',
  'SQLITE_ERROR',
  'SQLITE_RANGE'
])
  MESSAGE.push([code, () => new SqliteError('database error', code)]);

for (const [rows, kind, expected] of [
  [SERVICE, 'the mailbox or a service', true],
  [MESSAGE, 'the message', false]
]) {
  for (const [name, createError] of rows) {
    test(`${name} is an error of ${kind}`, (t) => {
      const err = refineAndLogError(
        createError(),
        { user: { alias_id: new mongoose.Types.ObjectId().toString() } },
        true
      );
      t.is(isServiceError(err), expected);
    });
  }
}
