/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const env = require('#config/env');

console.log('env.HELPER_ENCRYPTION_KEY', env.HELPER_ENCRYPTION_KEY);

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
  if (!text) throw new Error('Text value missing');

  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(
    algorithm,
    encryptionKey,
    iv,
    algorithm === 'chacha20-poly1305' ? { authTagLength: 16 } : undefined
  );

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  if (algorithm === 'chacha20-poly1305') {
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
  }

  return Buffer.concat([iv, encrypted]).toString('hex');
}

function decrypt(
  text,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'aes-256-cbc'
) {
  if (!text) throw new TypeError('Text value missing');

  const data = Buffer.from(text, 'hex');

  const ivLength = algorithm === 'chacha20-poly1305' ? 12 : 16;
  const iv = data.slice(0, ivLength);

  const authTagLength = algorithm === 'chacha20-poly1305' ? 16 : 0;
  const authTag =
    algorithm === 'chacha20-poly1305'
      ? data.slice(ivLength, ivLength + authTagLength)
      : null;

  const encrypted = data.slice(ivLength + authTagLength);

  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      encryptionKey,
      iv,
      algorithm === 'chacha20-poly1305' ? { authTagLength: 16 } : undefined
    );

    if (algorithm === 'chacha20-poly1305') {
      decipher.setAuthTag(authTag);
    }

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  } catch (err) {
    // for backwards compatibility, let's use the same logic previously to
    // extract the IV from the prefix as `<iv>-<data>`
    if (err.message.includes('Invalid initialization vector')) {
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

    throw err;
  }
}

module.exports = { encrypt, decrypt };
