/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const test = require('ava');

const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

test('basic v2 encryption and decryption', (t) => {
  const original = 'test@example.com';
  const encrypted = encrypt(original);
  const decrypted = decrypt(encrypted);
  t.is(decrypted, original, 'decrypted text should match original');
});

test('no visible text prefix (pure base64)', (t) => {
  const encrypted = encrypt('test@example.com');
  t.false(encrypted.startsWith('v2:'), 'should not have v2: prefix');
  t.false(encrypted.startsWith('v3:'), 'should not have v3: prefix');
  const base64Regex = /^[A-Za-z\d+/]+=*$/;
  t.regex(encrypted, base64Regex, 'should be pure base64');
});

test('magic byte is 0x02', (t) => {
  const encrypted = encrypt('test@example.com');
  const data = Buffer.from(encrypted, 'base64');
  t.is(data[0], 0x02, 'first byte should be 0x02');
});

test('backwards compatibility with legacy AES-256-CBC format', (t) => {
  const encryptionKey = crypto.randomBytes(32);
  const iv = Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    Buffer.from(iv, 'binary')
  );
  let enc = cipher.update('test@example.com', 'utf8', 'hex');
  enc += cipher.final('hex');
  const legacyFormat = `${iv}-${enc}`;

  const decrypted = decrypt(legacyFormat, encryptionKey);
  t.is(decrypted, 'test@example.com', 'should decrypt legacy format');
});

test('IV uniqueness (different ciphertext each time)', (t) => {
  const original = 'test@example.com';
  const encrypted1 = encrypt(original);
  const encrypted2 = encrypt(original);

  t.not(encrypted1, encrypted2, 'encrypted values should be different');
  t.is(decrypt(encrypted1), original, 'first encryption should decrypt');
  t.is(decrypt(encrypted2), original, 'second encryption should decrypt');
});

test('long email address', (t) => {
  const longEmail =
    'very.long.email.address.with.many.dots@subdomain.example.com';
  const encrypted = encrypt(longEmail);
  const decrypted = decrypt(encrypted);
  t.is(decrypted, longEmail, 'long email should decrypt correctly');
});

test('throws error for empty text', (t) => {
  const error = t.throws(() => encrypt(''), {
    instanceOf: TypeError
  });
  t.is(error.message, 'Text value missing');
});

test('throws error for garbage input', (t) => {
  t.throws(() => decrypt('garbage-!@#$-input'), {
    instanceOf: Error
  });
});

test('throws error for very short input', (t) => {
  t.throws(() => decrypt('A'), {
    instanceOf: Error
  });
});

test('base64 is more efficient than hex', (t) => {
  const encrypted = encrypt('test@example.com');
  const decoded = Buffer.from(encrypted, 'base64');
  const hexSize = decoded.length * 2;
  const base64Size = encrypted.length;

  t.true(base64Size < hexSize, 'base64 should be smaller than hex encoding');
});

test('TXT record fits in 255 bytes', (t) => {
  const email = 'test@example.com';
  const encrypted = encrypt(email);
  const txtRecord = `forward-email=${encrypted}`;

  t.true(
    txtRecord.length <= 255,
    `TXT record should fit in 255 bytes, got ${txtRecord.length}`
  );
});

test('handles 0x02 collision gracefully', (t) => {
  const fakeV2 = Buffer.from([0x02, 0x00, 0x00, 0x00]).toString('base64');

  t.throws(() => decrypt(fakeV2), {
    instanceOf: Error
  });
});

test('maximum email length (~147 chars)', (t) => {
  const longEmail = 'a'.repeat(135) + '@example.com';
  const encrypted = encrypt(longEmail);
  const txtRecord = `forward-email=${encrypted}`;

  t.true(
    txtRecord.length <= 255,
    `TXT record should fit in 255 bytes, got ${txtRecord.length}`
  );

  const decrypted = decrypt(encrypted);
  t.is(decrypted, longEmail, 'long email should decrypt correctly');
});

test('v3 version detection (not yet implemented)', (t) => {
  const fakeV3 = Buffer.concat([
    Buffer.from([0x03]),
    Buffer.from('fake v3 data')
  ]).toString('base64');

  t.throws(() => decrypt(fakeV3), {
    instanceOf: Error
  });
});

test('invalid base64 handled gracefully', (t) => {
  const invalidBase64 = 'invalid-!@#$-base64';

  t.throws(() => decrypt(invalidBase64), {
    instanceOf: Error
  });
});

test('minimum length check for v2 format', (t) => {
  const shortData = Buffer.from([0x02, 0x00, 0x00]).toString('base64');

  t.throws(() => decrypt(shortData), {
    instanceOf: Error
  });
});

test('tampering detection via auth tag', (t) => {
  const encrypted = encrypt('test@example.com');
  const data = Buffer.from(encrypted, 'base64');

  // eslint-disable-next-line no-bitwise
  data[data.length - 1] ^= 0xff;
  const tampered = data.toString('base64');

  t.throws(() => decrypt(tampered), {
    instanceOf: Error
  });
});

test('recursion prevention with legacy key', (t) => {
  t.throws(() => decrypt('invalid-data-that-fails-all-formats'), {
    instanceOf: Error
  });
});

test('chacha fallback detection', (t) => {
  const iv = crypto.randomBytes(12);
  const authTag = crypto.randomBytes(16);
  const ciphertext = crypto.randomBytes(20);
  const fakeChaCha = Buffer.concat([iv, authTag, ciphertext]).toString('hex');

  t.throws(() => decrypt(fakeChaCha), {
    instanceOf: Error
  });
});
