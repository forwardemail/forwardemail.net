/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const argon2 = require('@node-rs/argon2');
const cryptoRandomString = require('crypto-random-string');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const phrases = require('#config/phrases');

let zxcvbn;

const randomBytes = promisify(crypto.randomBytes);

async function createPassword(existingPassword, userInputs = []) {
  if (typeof existingPassword === 'string') {
    if (!isSANB(existingPassword)) {
      const err = Boom.badRequest(phrases.INVALID_PASSWORD_STRENGTH);
      err.no_translate = true;
      throw err;
    }

    //
    // do not allow sqlite restricted characters (easier than having to escape everywhere)
    // (e.g. `"` and `'`)
    // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/78>
    //
    if (existingPassword.includes("'") || existingPassword.includes('"')) {
      const err = Boom.badRequest(phrases.INVALID_PASSWORD_CHARACTERS);
      err.no_translate = true;
      throw err;
    }

    if (!zxcvbn) zxcvbn = require('./zxcvbn');
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

  //
  // use argon2 for domain and alias tokens (quantum-resistant)
  // <https://github.com/ranisalt/node-argon2>
  //
  const hash = await argon2.hash(password, config.argon2);

  // generate a random salt for backwards compatibility checking
  const buffer = await randomBytes(config.passportLocalMongoose.saltlen);
  const salt = buffer.toString(config.passportLocalMongoose.encoding);

  return { password, salt, hash, has_pbkdf2_migration: true };
}

module.exports = createPassword;
