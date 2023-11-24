/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

//
// NOTE: scmp and tsse appear to be identical
//       <https://github.com/freewil/scmp/issues/18>
//       <https://github.com/simonepri/tsse/issues/5>
//
const scmp = require('scmp');
// const tsse = require('tsse');

const pbkdf2 = require('./pbkdf2');

const config = require('#config');

async function isValidPassword(tokens = [], password) {
  if (
    typeof tokens !== 'object' ||
    !Array.isArray(tokens) ||
    tokens.length === 0 ||
    !password ||
    typeof password !== 'string'
  )
    return false;

  let match = false;
  for (const token of tokens) {
    if (
      typeof token !== 'object' ||
      !token.salt ||
      !token.hash ||
      typeof token.salt !== 'string' ||
      typeof token.hash !== 'string'
    )
      continue;

    // eslint-disable-next-line no-await-in-loop
    const rawHash = await pbkdf2({
      password,
      salt: token.salt,
      iterations: config.passportLocalMongoose.iterations,
      keylen: config.passportLocalMongoose.keylen,
      digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
    });

    if (
      scmp(
        rawHash,
        Buffer.from(token.hash, config.passportLocalMongoose.encoding)
      )
    ) {
      match = true;
      break;
    }
  }

  return match;
}

module.exports = isValidPassword;
