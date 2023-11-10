/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');
const { promisify } = require('node:util');

const cryptoRandomString = require('crypto-random-string');

const pbkdf2 = require('./pbkdf2');

const config = require('#config');

const randomBytes = promisify(crypto.randomBytes);

async function createPassword() {
  const password = await cryptoRandomString.async({
    length: 24
  });
  const buffer = await randomBytes(config.passportLocalMongoose.saltlen);
  const salt = buffer.toString(config.passportLocalMongoose.encoding);
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
  return { password, salt, hash };
}

module.exports = createPassword;
