/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

//
// NOTE: scmp and tsse appear to be identical
//       <https://github.com/freewil/scmp/issues/18>
//       <https://github.com/simonepri/tsse/issues/5>
//
// const scmp = require('scmp');
// const tsse = require('tsse');

const pbkdf2 = require('./pbkdf2');

const config = require('#config');

function timingSafeCompare(a, b) {
  if (a.length !== b.length) {
    // To make this timing-safe, we can compare the hash of the user-provided
    // value with itself, which will take a constant amount of time.
    crypto.timingSafeEqual(a, a);
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

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

    const rawHash = await pbkdf2({
      password,
      salt: token.salt,
      iterations: config.passportLocalMongoose.iterations,
      keylen: config.passportLocalMongoose.keylen,
      digestAlgorithm: config.passportLocalMongoose.digestAlgorithm
    });

    // const scmpResult = scmp(
    const scmpResult = timingSafeCompare(
      rawHash,
      Buffer.from(token.hash, config.passportLocalMongoose.encoding)
    );
    if (scmpResult) {
      match = true;
      break;
    }
  }

  return match;
}

module.exports = isValidPassword;
