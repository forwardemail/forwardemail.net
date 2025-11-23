/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const mongoose = require('mongoose');

const utils = require('../utils');

const createPassword = require('#helpers/create-password');
const isValidPassword = require('#helpers/is-valid-password');
const pbkdf2 = require('#helpers/pbkdf2');
const config = require('#config');

test.before(utils.setupMongoose);

test('createPassword generates argon2 hash for new passwords', async (t) => {
  const result = await createPassword('TestPassword123!@#');
  t.true(typeof result === 'object');
  t.true(typeof result.password === 'string');
  t.true(typeof result.salt === 'string');
  t.true(typeof result.hash === 'string');
  t.is(result.password, 'TestPassword123!@#');
  // argon2 hashes start with $argon2
  t.true(result.hash.startsWith('$argon2'));
});

test('createPassword generates random password when none provided', async (t) => {
  const result = await createPassword();
  t.true(typeof result === 'object');
  t.true(typeof result.password === 'string');
  t.true(typeof result.salt === 'string');
  t.true(typeof result.hash === 'string');
  t.is(result.password.length, 24);
  t.true(result.hash.startsWith('$argon2'));
});

test('isValidPassword validates new argon2 passwords', async (t) => {
  const password = 'TestPassword123!@#';
  const { salt, hash } = await createPassword(password);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid = await isValidPassword(tokens, password, mockAlias);
  t.true(isValid);
});

test('isValidPassword rejects invalid password for argon2', async (t) => {
  const password = 'TestPassword123!@#';
  const { salt, hash } = await createPassword(password);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid = await isValidPassword(
    tokens,
    'WrongPassword123!@#',
    mockAlias
  );
  t.false(isValid);
});

test('isValidPassword validates legacy pbkdf2 passwords', async (t) => {
  const password = 'TestPassword123!@#';

  // create legacy pbkdf2 hash
  const salt = 'a'.repeat(64); // 32 bytes hex encoded
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = Buffer.from(rawHash, 'binary').toString(
    config.passportLocalMongoose.encoding
  );

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid = await isValidPassword(tokens, password, mockAlias);
  t.true(isValid);
});

test('isValidPassword migrates pbkdf2 to argon2 on successful validation', async (t) => {
  const password = 'TestPassword123!@#';

  // create legacy pbkdf2 hash
  const salt = 'a'.repeat(64); // 32 bytes hex encoded
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = Buffer.from(rawHash, 'binary').toString(
    config.passportLocalMongoose.encoding
  );

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  // verify old hash works
  const isValid = await isValidPassword(tokens, password, mockAlias);
  t.true(isValid);

  // check that migration occurred
  t.true(tokens[0].has_pbkdf2_migration);
  t.true(tokens[0].hash.startsWith('$argon2'));

  // verify new hash works
  const isValidAfterMigration = await isValidPassword(
    tokens,
    password,
    mockAlias
  );
  t.true(isValidAfterMigration);
});

test('isValidPassword skips pbkdf2 check when has_pbkdf2_migration is true', async (t) => {
  const password = 'TestPassword123!@#';
  const { salt, hash } = await createPassword(password);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: true
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid = await isValidPassword(tokens, password, mockAlias);
  t.true(isValid);
});

test('isValidPassword handles multiple tokens and finds correct one', async (t) => {
  const password1 = 'TestPassword123!@#';
  const password2 = 'AnotherPassword456$%^';

  const token1 = await createPassword(password1);
  const token2 = await createPassword(password2);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt: token1.salt,
      hash: token1.hash,
      has_pbkdf2_migration: false
    },
    {
      _id: new mongoose.Types.ObjectId(),
      salt: token2.salt,
      hash: token2.hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid1 = await isValidPassword(tokens, password1, mockAlias);
  t.true(isValid1);

  const isValid2 = await isValidPassword(tokens, password2, mockAlias);
  t.true(isValid2);

  const isInvalid = await isValidPassword(
    tokens,
    'WrongPassword789&*()',
    mockAlias
  );
  t.false(isInvalid);
});

test('isValidPassword handles mixed pbkdf2 and argon2 tokens', async (t) => {
  const password1 = 'TestPassword123!@#';
  const password2 = 'AnotherPassword456$%^';

  // create legacy pbkdf2 hash
  const salt1 = 'a'.repeat(64);
  const rawHash1 = await pbkdf2({
    password: password1,
    salt: salt1,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash1 = Buffer.from(rawHash1, 'binary').toString(
    config.passportLocalMongoose.encoding
  );

  // create new argon2 hash
  const token2 = await createPassword(password2);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt: salt1,
      hash: hash1,
      has_pbkdf2_migration: false
    },
    {
      _id: new mongoose.Types.ObjectId(),
      salt: token2.salt,
      hash: token2.hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  // verify both work
  const isValid1 = await isValidPassword(tokens, password1, mockAlias);
  t.true(isValid1);
  t.true(tokens[0].has_pbkdf2_migration);
  t.true(tokens[0].hash.startsWith('$argon2'));

  const isValid2 = await isValidPassword(tokens, password2, mockAlias);
  t.true(isValid2);
  t.true(tokens[1].has_pbkdf2_migration);
  t.true(tokens[1].hash.startsWith('$argon2'));
});

test('isValidPassword returns false for empty tokens array', async (t) => {
  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens: []
  };

  const isValid = await isValidPassword([], 'TestPassword123!@#', mockAlias);
  t.false(isValid);
});

test('isValidPassword returns false for invalid token structure', async (t) => {
  const tokens = [
    {
      // missing salt
      hash: 'somehash'
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid = await isValidPassword(
    tokens,
    'TestPassword123!@#',
    mockAlias
  );
  t.false(isValid);
});

test('isValidPassword returns false for non-string password', async (t) => {
  const { salt, hash } = await createPassword('TestPassword123!@#');

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  const isValid = await isValidPassword(tokens, 12345, mockAlias);
  t.false(isValid);
});

test('backwards compatibility: existing pbkdf2 tokens continue to work', async (t) => {
  const password = 'LegacyPassword123!@#';

  // simulate existing pbkdf2 token from database
  const salt = 'b'.repeat(64);
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = Buffer.from(rawHash, 'binary').toString(
    config.passportLocalMongoose.encoding
  );

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash
      // has_pbkdf2_migration not set (undefined), simulating old token
    }
  ];

  const mockAlias = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens
  };

  // should still validate successfully
  const isValid = await isValidPassword(tokens, password, mockAlias);
  t.true(isValid);

  // and should have migrated
  t.true(tokens[0].has_pbkdf2_migration);
  t.true(tokens[0].hash.startsWith('$argon2'));
});

test('createPassword rejects weak passwords', async (t) => {
  const error = await t.throwsAsync(async () => {
    await createPassword('weak');
  });
  t.truthy(error);
});

test('createPassword rejects passwords with restricted characters', async (t) => {
  const error1 = await t.throwsAsync(async () => {
    await createPassword('TestPassword"123');
  });
  t.truthy(error1);

  const error2 = await t.throwsAsync(async () => {
    await createPassword("TestPassword'123");
  });
  t.truthy(error2);
});

test('isValidPassword handles save errors gracefully', async (t) => {
  const password = 'TestPassword123!@#';

  // create a legacy pbkdf2 token
  const salt = Buffer.from('test-salt-12345678901234567890', 'utf8').toString(
    'hex'
  );
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = rawHash.toString(config.passportLocalMongoose.encoding);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  // create a mock model instance that throws on save
  const mockInstance = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens,
    async save() {
      throw new Error('Database error');
    },
    logger: {
      error() {} // mock logger
    }
  };

  // should still return true even if save fails
  const isValid = await isValidPassword(tokens, password, mockInstance);
  t.true(isValid);
  t.true(tokens[0].has_pbkdf2_migration, 'migration flag should still be set');
  t.true(tokens[0].hash.startsWith('$argon2'), 'hash should still be migrated');
});

test('isValidPassword works without model instance (backward compatibility)', async (t) => {
  const password = 'TestPassword123!@#';

  // create a legacy pbkdf2 token
  const salt = Buffer.from('test-salt-12345678901234567890', 'utf8').toString(
    'hex'
  );
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = rawHash.toString(config.passportLocalMongoose.encoding);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  // call without model instance (old behavior)
  const isValid = await isValidPassword(tokens, password);
  t.true(isValid);
  t.true(
    tokens[0].has_pbkdf2_migration,
    'migration flag should be set in-memory'
  );
  t.true(
    tokens[0].hash.startsWith('$argon2'),
    'hash should be migrated in-memory'
  );
});

test('isValidPassword does not call save when no migration needed', async (t) => {
  const password = 'TestPassword123!@#';
  const { salt, hash } = await createPassword(password);

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: true // already migrated
    }
  ];

  let saveCalled = false;
  const mockInstance = {
    _id: new mongoose.Types.ObjectId(),
    object: 'alias',
    tokens,
    async save() {
      saveCalled = true;
    }
  };

  const isValid = await isValidPassword(tokens, password, mockInstance);
  t.true(isValid);
  t.false(saveCalled, 'save() should not be called when already migrated');
});

test('isValidPassword works with domain model', async (t) => {
  const password = 'TestPassword123!@#';

  // create legacy pbkdf2 hash
  const salt = 'c'.repeat(64);
  const rawHash = await pbkdf2({
    password,
    salt,
    iterations: config.passportLocalMongoose.iterations,
    keylen: config.passportLocalMongoose.keylen,
    digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
  });
  const hash = Buffer.from(rawHash, 'binary').toString(
    config.passportLocalMongoose.encoding
  );

  const tokens = [
    {
      _id: new mongoose.Types.ObjectId(),
      salt,
      hash,
      has_pbkdf2_migration: false
    }
  ];

  const mockDomain = {
    _id: new mongoose.Types.ObjectId(),
    object: 'domain',
    tokens
  };

  // verify old hash works
  const isValid = await isValidPassword(tokens, password, mockDomain);
  t.true(isValid);

  // check that migration occurred
  t.true(tokens[0].has_pbkdf2_migration);
  t.true(tokens[0].hash.startsWith('$argon2'));
});
