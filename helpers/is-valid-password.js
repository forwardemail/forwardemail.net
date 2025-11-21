/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const argon2 = require('@node-rs/argon2');
const mongoose = require('mongoose');

//
// NOTE: scmp and tsse appear to be identical
//       <https://github.com/freewil/scmp/issues/18>
//       <https://github.com/simonepri/tsse/issues/5>
//
// const scmp = require('scmp');
// const tsse = require('tsse');

const pbkdf2 = require('./pbkdf2');

const config = require('#config');
const logger = require('#helpers/logger');

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) {
  throw new Error('Mongoose connection does not exist');
}

function timingSafeCompare(a, b) {
  if (a.length !== b.length) {
    // To make this timing-safe, we can compare the hash of the user-provided
    // value with itself, which will take a constant amount of time.
    crypto.timingSafeEqual(a, a);
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

async function isValidPassword(tokens = [], password, instance) {
  if (
    typeof tokens !== 'object' ||
    !Array.isArray(tokens) ||
    tokens.length === 0 ||
    !password ||
    typeof password !== 'string'
  )
    return false;

  let match = false;
  let matchedToken = null;

  for (const token of tokens) {
    if (
      typeof token !== 'object' ||
      !token.salt ||
      !token.hash ||
      typeof token.salt !== 'string' ||
      typeof token.hash !== 'string'
    )
      continue;

    //
    // if the token has already been migrated to argon2, skip pbkdf2 check
    //
    if (token.has_pbkdf2_migration === true) {
      try {
        const isValid = await argon2.verify(token.hash, password);
        if (isValid) {
          match = true;
          matchedToken = token;
          break;
        }
      } catch {
        // argon2 verification failed, continue to next token
        continue;
      }
    } else {
      //
      // try argon2 first (new format)
      //
      try {
        const isValid = await argon2.verify(token.hash, password);
        if (isValid) {
          match = true;
          matchedToken = token;
          break;
        }
      } catch {
        // argon2 verification failed, try pbkdf2 (old format)
      }

      //
      // fallback to pbkdf2 for backwards compatibility
      //
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
        matchedToken = token;
        break;
      }
    }
  }

  //
  // if match found and token needs migration, perform live migration
  // and automatically save if model instance is provided
  //
  if (match && matchedToken && matchedToken.has_pbkdf2_migration !== true) {
    try {
      // check if hash is argon2 format (starts with $argon2)
      const isArgon2Hash = matchedToken.hash.startsWith('$argon2');
      if (isArgon2Hash) {
        // already argon2, just mark as migrated
        matchedToken.has_pbkdf2_migration = true;
      } else {
        // this is a pbkdf2 hash, perform migration
        const newHash = await argon2.hash(password, config.argon2);
        matchedToken.hash = newHash;
        matchedToken.has_pbkdf2_migration = true;
      }

      // if model instance provided, save the migration
      if (instance) {
        try {
          if (!mongoose.isObjectIdOrHexString(instance._id))
            throw new TypeError(
              'instance._id was not an ObjectId nor hex string'
            );
          if (typeof instance.object !== 'string')
            throw new TypeError('instance.object was undefined');
          if (instance.object === 'domain') {
            // enforce schema and require all required paths (dummyproof while we migrate)
            if (
              !tokens.every((token) => token.user && token.salt && token.hash)
            )
              throw new TypeError('token missing user, salt, or hash');
            // TODO: this migration needs improved/safeguarded since we don't use __v version key
            //       (e.g. if we detect `__v` then query for equality and increase it by 1 as well)
            await conn.models.Domains.findOneAndUpdate(
              {
                _id: instance._id,
                tokens: { $size: tokens.length }
              },
              {
                $set: {
                  tokens
                }
              }
            );
          } else if (instance.object === 'alias') {
            // enforce schema and require all required paths (dummyproof while we migrate)
            if (!tokens.every((token) => token.salt && token.hash))
              throw new TypeError('token missing user, salt, or hash');
            // TODO: this migration needs improved/safeguarded since we don't use __v version key
            //       (e.g. if we detect `__v` then query for equality and increase it by 1 as well)
            await conn.models.Aliases.findOneAndUpdate(
              {
                _id: instance._id,
                tokens: { $size: tokens.length }
              },
              {
                $set: {
                  tokens
                }
              }
            );
          } else {
            throw new TypeError(
              'instance.object must be equal to "domain" or "alias"'
            );
          }
        } catch (err) {
          // log error but don't fail authentication
          // the migration will be retried on next authentication
          logger.fatal(err);
          const _err = new TypeError('Failed to save argon2 migration');
          _err.err = err;
          console.error(_err);
        }
      }
    } catch {
      // migration failed, but authentication succeeded
      // caller can retry migration later
    }
  }

  return match;
}

module.exports = isValidPassword;
