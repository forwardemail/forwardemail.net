/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const { readKey, generateKey } = require('openpgp');
const WKDClient = require('@openpgp/wkd-client');

//
// Helper: perform a raw WKD lookup (without caching layer)
// to test real-world WKD endpoints directly
//
async function rawWKDLookup(email) {
  const wkd = new WKDClient();
  const binaryKey = await wkd.lookup({ email });
  return readKey({ binaryKey });
}

//
// Helper: generate a sign-only PGP key (no encryption subkey)
//
async function generateSignOnlyKey(email) {
  const { publicKey } = await generateKey({
    type: 'ecc',
    curve: 'ed25519',
    userIDs: [{ name: 'Sign Only Test', email }],
    format: 'object',
    subkeys: []
  });
  return publicKey;
}

//
// Helper: generate a standard PGP key with encryption subkey
//
async function generateEncryptionKey(email) {
  const { publicKey } = await generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIDs: [{ name: 'Encryption Test', email }],
    format: 'object'
  });
  return publicKey;
}

// ─── Encryption capability validation tests ─────────────────────────

test('sign-only key: getEncryptionKey() throws', async (t) => {
  const key = await generateSignOnlyKey('signonly@test.example');
  const err = await t.throwsAsync(() => key.getEncryptionKey());
  t.true(
    err.message.includes('Could not find valid encryption key packet'),
    'should indicate no encryption key found'
  );
});

test('sign-only key: getSigningKey() succeeds', async (t) => {
  const key = await generateSignOnlyKey('signonly@test.example');
  const sigKey = await key.getSigningKey();
  t.truthy(sigKey, 'signing key should be found');
  t.truthy(sigKey.getKeyID(), 'signing key should have a key ID');
});

test('encryption-capable key: getEncryptionKey() succeeds', async (t) => {
  const key = await generateEncryptionKey('encrypt@test.example');
  const encKey = await key.getEncryptionKey();
  t.truthy(encKey, 'encryption key should be found');
  t.truthy(encKey.getKeyID(), 'encryption key should have a key ID');
});

test('encryption-capable key: getSigningKey() succeeds', async (t) => {
  const key = await generateEncryptionKey('encrypt@test.example');
  const sigKey = await key.getSigningKey();
  t.truthy(sigKey, 'signing key should be found');
});

test('sign-only key has zero subkeys', async (t) => {
  const key = await generateSignOnlyKey('signonly@test.example');
  t.is(key.subkeys.length, 0, 'sign-only key should have no subkeys');
});

test('encryption-capable key has at least one subkey', async (t) => {
  const key = await generateEncryptionKey('encrypt@test.example');
  t.true(
    key.subkeys.length > 0,
    'encryption-capable key should have at least one subkey'
  );
});

// ─── WKD lookup: forwardemail.net ────────────────────────────────────

test.serial(
  'WKD lookup for support@forwardemail.net returns a valid key',
  async (t) => {
    const key = await rawWKDLookup('support@forwardemail.net');
    t.truthy(key, 'should return a key');
    t.truthy(key.getKeyID(), 'key should have a key ID');
    const userIDs = key.getUserIDs();
    t.true(userIDs.length > 0, 'key should have at least one user ID');
    t.true(
      userIDs.some((uid) => uid.includes('forwardemail.net')),
      'user ID should reference forwardemail.net'
    );
  }
);

test.serial(
  'WKD key for support@forwardemail.net has encryption capability',
  async (t) => {
    const key = await rawWKDLookup('support@forwardemail.net');
    const encKey = await key.getEncryptionKey();
    t.truthy(encKey, 'should have an encryption-capable subkey');
  }
);

// ─── WKD lookup: kernel.org ──────────────────────────────────────────

test.serial(
  'WKD lookup for torvalds@kernel.org returns a valid key',
  async (t) => {
    const key = await rawWKDLookup('torvalds@kernel.org');
    t.truthy(key, 'should return a key');
    const userIDs = key.getUserIDs();
    t.true(userIDs.length > 0, 'key should have at least one user ID');
    t.true(
      userIDs.some(
        (uid) =>
          uid.includes('torvalds@kernel.org') ||
          uid.includes('torvalds@linux-foundation.org')
      ),
      'user ID should reference torvalds'
    );
  }
);

test.serial(
  'WKD key for torvalds@kernel.org has encryption capability',
  async (t) => {
    const key = await rawWKDLookup('torvalds@kernel.org');
    const encKey = await key.getEncryptionKey();
    t.truthy(encKey, 'should have an encryption-capable subkey');
  }
);

test.serial(
  'WKD lookup for gregkh@kernel.org returns a valid key',
  async (t) => {
    const key = await rawWKDLookup('gregkh@kernel.org');
    t.truthy(key, 'should return a key');
    const userIDs = key.getUserIDs();
    t.true(
      userIDs.some((uid) => uid.includes('gregkh@kernel.org')),
      'user ID should reference gregkh'
    );
  }
);

// ─── WKD lookup: protonmail.com ──────────────────────────────────────

test.serial(
  'WKD lookup for info@protonmail.com returns a valid key',
  async (t) => {
    const key = await rawWKDLookup('info@protonmail.com');
    t.truthy(key, 'should return a key');
    const encKey = await key.getEncryptionKey();
    t.truthy(encKey, 'protonmail key should have encryption capability');
  }
);

// ─── WKD lookup: domains with no WKD ────────────────────────────────

test.serial('WKD lookup for test@example.com throws (no WKD)', async (t) => {
  await t.throwsAsync(() => rawWKDLookup('test@example.com'), {
    message: /not found|failed|enotfound|econnrefused|fetch failed/i
  });
});

test.serial('WKD lookup for user@gmail.com throws (no WKD)', async (t) => {
  await t.throwsAsync(() => rawWKDLookup('user@gmail.com'), {
    message: /not found|failed|enotfound|econnrefused|fetch failed/i
  });
});

test.serial(
  'WKD lookup for nonexistent@nonexistent-domain-xyz123.example throws',
  async (t) => {
    await t.throwsAsync(
      () => rawWKDLookup('nonexistent@nonexistent-domain-xyz123.example'),
      { message: /not found|failed|enotfound|econnrefused|fetch failed/i }
    );
  }
);

// ─── Simulated send-email.js flow ────────────────────────────────────
// These tests simulate the patched logic in helpers/send-email.js
// where after WKD lookup, we validate encryption capability

test('simulated flow: encryption-capable key proceeds to encrypt', async (t) => {
  const key = await generateEncryptionKey('encrypt@test.example');

  // Simulate the patched logic
  let publicKey = key;
  try {
    await publicKey.getEncryptionKey();
  } catch {
    publicKey = undefined;
  }

  t.truthy(publicKey, 'publicKey should remain set for encryption-capable key');
});

test('simulated flow: sign-only key is skipped (publicKey set to undefined)', async (t) => {
  const key = await generateSignOnlyKey('signonly@test.example');

  // Simulate the patched logic
  let publicKey = key;
  try {
    await publicKey.getEncryptionKey();
  } catch {
    publicKey = undefined;
  }

  t.is(publicKey, undefined, 'publicKey should be undefined for sign-only key');
});

test('simulated flow: real WKD key from forwardemail.net passes validation', async (t) => {
  const key = await rawWKDLookup('support@forwardemail.net');

  // Simulate the patched logic
  let publicKey = key;
  try {
    await publicKey.getEncryptionKey();
  } catch {
    publicKey = undefined;
  }

  t.truthy(
    publicKey,
    'forwardemail.net WKD key should pass encryption capability check'
  );
});

// ─── Edge cases ──────────────────────────────────────────────────────

test('readKey from binary then getEncryptionKey on sign-only key', async (t) => {
  // Generate sign-only key, export to binary, re-import, then check
  const { publicKey } = await generateKey({
    type: 'ecc',
    curve: 'ed25519',
    userIDs: [{ name: 'Binary Test', email: 'binary@test.example' }],
    format: 'object',
    subkeys: []
  });

  const binaryKey = publicKey.write();
  const reimported = await readKey({ binaryKey });

  await t.throwsAsync(() => reimported.getEncryptionKey(), {
    message: /Could not find valid encryption key packet/
  });
});

test('readKey from binary then getEncryptionKey on encryption-capable key', async (t) => {
  // Generate encryption-capable key, export to binary, re-import, then check
  const { publicKey } = await generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIDs: [{ name: 'Binary Test', email: 'binary@test.example' }],
    format: 'object'
  });

  const binaryKey = publicKey.write();
  const reimported = await readKey({ binaryKey });

  const encKey = await reimported.getEncryptionKey();
  t.truthy(encKey, 'reimported key should have encryption capability');
});
