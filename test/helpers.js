/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// const crypto = require('node:crypto');

const test = require('ava');
const Redis = require('ioredis-mock');

const createTangerine = require('#helpers/create-tangerine');
// const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

// <https://github.com/luin/ioredis/issues/1179>
Redis.Command.setArgumentTransformer('set', (args) => {
  if (typeof args[1] === 'object') args[1] = JSON.stringify(args[1]);
  return args;
});

Redis.Command.setReplyTransformer('get', (value) => {
  if (value && typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {}
  }

  return value;
});

test('throws error', (t) => {
  const err = t.throws(createTangerine);
  t.is(err.message, 'Client required');
});

test('creates instance', async (t) => {
  const client = new Redis();
  client.setMaxListeners(0);
  const tangerine = createTangerine(client);
  await tangerine.resolve('forwardemail.net');
  const result = await client.get('tangerine:a:forwardemail.net');
  t.true(result !== null);
  t.true(result.answers.length > 0);
  t.true(result.answers[0].name === 'forwardemail.net');
});

/*
test('encrypt and decrypt with aes-256-cbc', (t) => {
  const text = 'thisisan@email.com';
  const algorithm = 'aes-256-cbc';

  const encryptionKey = crypto.randomBytes(16).toString('hex');

  const encryptedText = encrypt(text, 16, encryptionKey, algorithm);
  t.truthy(encryptedText, 'encrypted text should be generated');

  const decryptedText = decrypt(encryptedText, encryptionKey, algorithm);
  t.is(decryptedText, text, 'decrypted text should match original text');
});

test('encrypt and decrypt with chacha20-poly1305', (t) => {
  const text = 'thisisan@email.com';
  const algorithm = 'chacha20-poly1305';

  const encryptionKey = crypto.randomBytes(16).toString('hex');

  const encryptedText = encrypt(text, 12, encryptionKey, algorithm);
  t.truthy(encryptedText, 'encrypted text should be generated');

  const decryptedText = decrypt(encryptedText, encryptionKey, algorithm);
  t.is(decryptedText, text, 'decrypted text should match original text');
});
*/
