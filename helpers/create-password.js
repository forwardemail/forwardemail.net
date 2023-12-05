/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const cryptoRandomString = require('crypto-random-string');
const isSANB = require('is-string-and-not-blank');

const zxcvbn = require('./zxcvbn');
const pbkdf2 = require('./pbkdf2');

const config = require('#config');
const phrases = require('#config/phrases');

const randomBytes = promisify(crypto.randomBytes);

async function createPassword(existingPassword, userInputs = []) {
  if (typeof existingPassword === 'string') {
    if (!isSANB(existingPassword)) {
      const err = Boom.badRequest(phrases.INVALID_PASSWORD_STRENGTH);
      err.no_translate = true;
      throw err;
    }

    const { score, feedback } = zxcvbn(existingPassword, userInputs);

    if (score < 3) {
      let message = phrases.INVALID_PASSWORD_STRENGTH;
      if (typeof feedback === 'object') {
        if (isSANB(feedback?.warning)) message += ` ${feedback.warning}.`;
        if (isSANB(feedback?.suggestions))
          message += ` ${feedback.suggestions}.`;
      }

      message = message.replace('..', '.');

      const err = Boom.badRequest(message);
      err.no_translate = true;
      throw err;
    }
  } else {
    existingPassword = undefined;
  }

  const password =
    existingPassword ||
    (await cryptoRandomString.async({
      length: 24
    }));
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
