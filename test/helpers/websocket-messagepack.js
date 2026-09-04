/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const {
  isRecoverableMessagePackError,
  unpackMessagePack
} = require('#helpers/unpack-messagepack');

test('drops a truncated MessagePack frame without throwing', (t) => {
  // msgpack str16 header followed by too few bytes
  const result = t.notThrows(() =>
    unpackMessagePack(
      new (require('msgpackr').Unpackr)(),
      Buffer.from([0xda, 0, 4, 1]),
      { warn() {} }
    )
  );
  t.is(result, undefined);
});

test('recognizes only known incomplete-frame decoder errors as recoverable', (t) => {
  t.true(isRecoverableMessagePackError(new Error('Unexpected end of buffer')));
  t.true(isRecoverableMessagePackError(new Error('Unexpected end of data')));
  t.false(isRecoverableMessagePackError(new Error('Unknown extension type')));
});
