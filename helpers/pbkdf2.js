/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

function pbkdf2(options) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      options.password,
      options.salt,
      options.iterations,
      options.keylen,
      options.digestAlgorithm,
      (err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      }
    );
  });
}

module.exports = pbkdf2;
