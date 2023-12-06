/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const env = require('#config/env');

//
// inspiration from the following gist, except we swapped ":" for "-" to be more URL-friendly
// https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb?permalink_comment_id=3771967#gistcomment-3771967
//
// NOTE: in the future we could use GCM <https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81>
//
function encrypt(
  text,
  ivLength = 16,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'aes-256-cbc'
) {
  const iv = ivLength
    ? Buffer.from(crypto.randomBytes(ivLength))
        .toString('hex')
        .slice(0, ivLength)
    : null;
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv ? iv + '-' + encrypted.toString('hex') : encrypted.toString('hex');
}

function decrypt(
  text,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'aes-256-cbc'
) {
  const textParts = text.includes('-') ? text.split('-') : [];
  const iv = Buffer.from(textParts.shift() || '', 'binary');
  const encryptedText = Buffer.from(textParts.join('-'), 'hex');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
