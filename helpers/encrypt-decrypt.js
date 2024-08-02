/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const env = require('#config/env');

// <https://dev.to/vapourisation/east-encryption-in-typescript-3948>
function splitEncryptedText(encryptedText) {
  return {
    encryptedDataString: encryptedText.slice(56, -32),
    ivString: encryptedText.slice(0, 24),
    assocDataString: encryptedText.slice(24, 56),
    tagString: encryptedText.slice(-32)
  };
}

//
// inspiration from the following gist, except we swapped ":" for "-" to be more URL-friendly
// https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb?permalink_comment_id=3771967#gistcomment-3771967
//
// NOTE: in the future we could use GCM <https://gist.github.com/rjz/15baffeab434b8125ca4d783f4116d81>
//
function encrypt(
  text,
  ivLength = 12,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'chacha20-poly1305'
) {
  if (!text) throw new Error('Text value missing');

  if (algorithm === 'aes-256-cbc') {
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
    return iv
      ? iv + '-' + encrypted.toString('hex')
      : encrypted.toString('hex');
  }

  const iv = crypto.randomBytes(ivLength);
  const assocData = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv, {
    ...(algorithm === 'chacha20-poly1305' ? { authTagLength: 16 } : {})
  });

  if (algorithm === 'chacha20-poly1305')
    cipher.setAAD(assocData, { plaintextLength: Buffer.byteLength(text) });

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return (
    iv.toString('hex') +
    assocData.toString('hex') +
    encrypted.toString('hex') +
    tag.toString('hex')
  );

  /*
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(
    algorithm,
    encryptionKey,
    iv,
    algorithm === 'chacha20-poly1305' ? { authTagLength: 16 } : undefined
  );

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf-8')
    cipher.final()
  ]);

  if (algorithm === 'chacha20-poly1305') {
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
  }

  return Buffer.concat([iv, encrypted]).toString('hex');
  */
}

function decrypt(
  text,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'chacha20-poly1305'
) {
  if (!text) throw new TypeError('Text value missing');

  try {
    const { encryptedDataString, ivString, assocDataString, tagString } =
      splitEncryptedText(text);

    const iv = Buffer.from(ivString, 'hex');
    const encryptedText = Buffer.from(encryptedDataString, 'hex');
    const tag = Buffer.from(tagString, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv, {
      authTagLength: 16
    });
    decipher.setAAD(Buffer.from(assocDataString, 'hex'), {
      plaintextLength: encryptedDataString.length
    });
    decipher.setAuthTag(Buffer.from(tag));

    const decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]).toString();
  } catch (err) {
    // for backwards compatibility, let's use the same logic previously to
    // extract the IV from the prefix as `<iv>-<data>`
    if (
      err.message.includes('Invalid initialization vector') ||
      err.message.includes(
        'Unsupported state or unable to authenticate data'
      ) ||
      err.message.includes('Unsupported state')
    ) {
      try {
        // legacy fallback for chacha20-poly1305 before AAD and such
        const data = Buffer.from(text, 'hex');

        const ivLength = algorithm === 'chacha20-poly1305' ? 12 : 16;
        const iv = data.slice(0, ivLength);

        const authTagLength = algorithm === 'chacha20-poly1305' ? 16 : 0;
        const authTag =
          algorithm === 'chacha20-poly1305'
            ? data.slice(ivLength, ivLength + authTagLength)
            : null;

        const encrypted = data.slice(ivLength + authTagLength);

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
        if (
          err.message.includes('Invalid initialization vector') ||
          err.message.includes(
            'Unsupported state or unable to authenticate data'
          ) ||
          err.message.includes('Unsupported state')
        ) {
          // legacy aes-256-cbc
          const textParts = text.includes('-') ? text.split('-') : [];
          const iv = Buffer.from(textParts.shift() || '', 'binary');
          const encryptedText = Buffer.from(textParts.join('-'), 'hex');
          const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
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

    throw err;
  }
}

module.exports = { encrypt, decrypt };
