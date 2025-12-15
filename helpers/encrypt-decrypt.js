/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const env = require('#config/env');

//
// Encryption format versions (magic byte in first position):
// - 0x02: AES-256-GCM with proper IV handling and base64url encoding (current, quantum-vulnerable)
// - 0x03: XWing (X25519 + ML-KEM-768) hybrid (future, quantum-resistant) - COMMENTED OUT
// - legacy: Broken AES-256-CBC with hex encoding (backwards compat only, detected by '-' separator)
// - chacha: ChaCha20-Poly1305 (backwards compat only, detected by fallback)
//
// Format: BASE64URL(version_byte + IV + authTag + ciphertext)
// This uses magic byte for version detection (industry standard approach)
// Base64url encoding for URL safety (RFC 4648 Section 5)
//

const VERSION_V2 = 0x02;
const VERSION_V3 = 0x03; // Reserved for future quantum-resistant implementation

//
// V2: Fixed AES-256-GCM implementation
// - Magic byte version detection (no text prefix)
// - Proper IV generation (no hex conversion bug)
// - Authenticated encryption (GCM mode)
// - Base64url encoding for URL safety (+ -> -, / -> _, no padding)
// - 1-byte version header
// - 12-byte IV (GCM recommended)
// - 16-byte auth tag
//
function encryptV2(text, encryptionKey = env.HELPER_ENCRYPTION_KEY) {
  if (!text) throw new TypeError('Text value missing');
  if (!encryptionKey) throw new TypeError('Encryption key missing');

  const algorithm = 'aes-256-gcm';
  const ivLength = 12; // GCM recommended IV length

  // Generate proper random IV (no hex conversion bug)
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );

  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  // Combine: version byte (1) + IV (12 bytes) + authTag (16 bytes) + ciphertext
  // Then base64url encode for URL safety (RFC 4648 Section 5)
  // (encodes to save space vs hex (33% overhead vs 100%))
  const combined = Buffer.concat([
    Buffer.from([VERSION_V2]),
    iv,
    authTag,
    encrypted
  ]);

  // Use base64url encoding (RFC 4648) for URL safety
  // Replace + with -, / with _, and remove padding =
  return combined
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function decryptV2(data, encryptionKey = env.HELPER_ENCRYPTION_KEY) {
  if (!data) throw new TypeError('Data value missing');
  if (!encryptionKey) throw new TypeError('Encryption key missing');

  const algorithm = 'aes-256-gcm';
  const ivLength = 12;
  const authTagLength = 16;

  // Data should already be a Buffer with version byte removed
  // Check minimum length
  if (data.length < ivLength + authTagLength + 1) {
    throw new Error('Data too short for v2 format');
  }

  // Extract components
  const iv = data.slice(0, ivLength);
  const authTag = data.slice(ivLength, ivLength + authTagLength);
  const encrypted = data.slice(ivLength + authTagLength);

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

//
// V3: Quantum-resistant hybrid encryption (COMMENTED OUT - NOT YET IMPLEMENTED)
//
// To enable v3:
// 1. Install: npm install @noble/post-quantum
// 2. Uncomment the code below
// 3. Change encrypt() to use encryptV3() instead of encryptV2()
//

/*
// Uncomment to enable v3 quantum-resistant encryption
// const { XWing } = require('@noble/post-quantum/hybrids.js');

function encryptV3(
  text,
  encryptionKey = env.HELPER_ENCRYPTION_KEY
) {
  if (!text) throw new TypeError('Text value missing');
  if (!encryptionKey) throw new TypeError('Encryption key missing');

  // Derive XWing keypair from encryption key (deterministic)
  const seed = crypto.hkdfSync(
    'sha256',
    Buffer.from(encryptionKey),
    Buffer.from('forward-email-v3'),
    Buffer.from('xwing-keypair'),
    64 // XWing needs 64-byte seed
  );

  const recipientKeys = XWing.keygen(seed);

  // Encapsulate to get shared secret
  const { cipherText: kemCiphertext, sharedSecret } = XWing.encapsulate(recipientKeys.publicKey);

  // Use shared secret as AES-256-GCM key
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', sharedSecret, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine: version byte + kemCiphertext + IV + authTag + encrypted
  // XWing ciphertext is 1216 bytes
  const combined = Buffer.concat([
    Buffer.from([VERSION_V3]),
    kemCiphertext,
    iv,
    authTag,
    encrypted
  ]);

  return combined.toString('base64');
}

function decryptV3(
  data,
  encryptionKey = env.HELPER_ENCRYPTION_KEY
) {
  if (!data) throw new TypeError('Data value missing');
  if (!encryptionKey) throw new TypeError('Encryption key missing');

  const kemCiphertextLength = 1216; // XWing ciphertext size
  const ivLength = 12;
  const authTagLength = 16;

  // Check minimum length
  if (data.length < kemCiphertextLength + ivLength + authTagLength + 1) {
    throw new Error('Data too short for v3 format');
  }

  // Extract KEM ciphertext
  const kemCiphertext = data.slice(0, kemCiphertextLength);

  // Derive secret key from encryption key
  const seed = crypto.hkdfSync(
    'sha256',
    Buffer.from(encryptionKey),
    Buffer.from('forward-email-v3'),
    Buffer.from('xwing-keypair'),
    64
  );

  const recipientKeys = XWing.keygen(seed);

  // Decapsulate to get shared secret
  const sharedSecret = XWing.decapsulate(kemCiphertext, recipientKeys.secretKey);

  // Extract IV, authTag, ciphertext
  let offset = kemCiphertextLength;
  const iv = data.slice(offset, offset + ivLength);
  offset += ivLength;
  const authTag = data.slice(offset, offset + authTagLength);
  offset += authTagLength;
  const encrypted = data.slice(offset);

  // Decrypt with shared secret
  const decipher = crypto.createDecipheriv('aes-256-gcm', sharedSecret, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
*/

//
// Legacy AES-256-CBC decryption (backwards compatibility)
// This is the broken implementation from the original code
// DO NOT use for new encryptions
//
function decryptLegacyAES(
  text,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'aes-256-cbc'
) {
  if (!text) throw new TypeError('Text value missing');

  const textParts = text.includes('-') ? text.split('-') : [];

  // Original broken implementation used 'binary' encoding
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

//
// ChaCha20-Poly1305 decryption (backwards compatibility)
// This was rolled back due to bugs but some data may still use it
//
function decryptChaCha(text, encryptionKey = env.HELPER_ENCRYPTION_KEY) {
  if (!text) throw new TypeError('Text value missing');

  const data = Buffer.from(text, 'hex');

  const ivLength = 12;
  const iv = data.slice(0, ivLength);

  const authTagLength = 16;
  const authTag = data.slice(ivLength, ivLength + authTagLength);

  const encrypted = data.slice(ivLength + authTagLength);

  const decipher = crypto.createDecipheriv(
    'chacha20-poly1305',
    encryptionKey,
    iv,
    { authTagLength: 16 }
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

//
// Main encrypt function - uses latest version (v2 for now, v3 when ready)
//
function encrypt(
  text,
  // eslint-disable-next-line no-unused-vars
  ivLength = 16, // Kept for backwards compat but ignored
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  // eslint-disable-next-line no-unused-vars
  algorithm = 'aes-256-cbc' // Kept for backwards compat but ignored
) {
  // Use v2 for now
  // To enable v3: uncomment v3 functions above and change to encryptV3()
  return encryptV2(text, encryptionKey);
}

//
// Main decrypt function - handles all versions with robust error handling
// Detection strategy:
// 1. Check for '-' separator → Legacy AES format
// 2. Try to decode base64 and check magic byte → v2/v3
// 3. Fallback to ChaCha → Legacy ChaCha format
// 4. Fallback to legacy key → Try with old encryption key
//
// Edge cases handled:
// - 0x02 collision: If legacy ChaCha happens to start with 0x02, v2 decryption
//   will fail (auth tag verification), and we fall back to ChaCha
// - Invalid base64: Buffer.from() doesn't throw, but GCM auth tag will catch garbage
// - Very short text: Check minimum length before attempting v2/v3
// - Legacy key recursion: Use flag to prevent infinite recursion
//
function decrypt(
  text,
  encryptionKey = env.HELPER_ENCRYPTION_KEY,
  algorithm = 'aes-256-cbc', // Kept for backwards compat
  triedLegacyKey = false // Internal flag to prevent recursion
) {
  if (!text) throw new TypeError('Text value missing');

  // Legacy format detection: has '-' separator AND looks like legacy structure
  // Legacy format: <iv>-<hex>, so exactly 2 parts when split by '-'
  // The second part must be valid hex (only 0-9a-f)
  // Base64url uses A-Za-z0-9-_ so it will have non-hex chars
  const hasLegacySeparator = text.includes('-');
  const parts = hasLegacySeparator ? text.split('-') : [];
  const secondPartIsHex = parts.length === 2 && /^[\da-f]+$/i.test(parts[1]);
  const looksLikeLegacy =
    hasLegacySeparator &&
    parts.length === 2 &&
    !text.includes('_') &&
    secondPartIsHex;

  if (looksLikeLegacy) {
    try {
      return decryptLegacyAES(text, encryptionKey, algorithm);
    } catch {
      // If legacy AES fails, try legacy key
      if (
        !triedLegacyKey &&
        env.HELPER_ENCRYPTION_KEY_LEGACY &&
        encryptionKey !== env.HELPER_ENCRYPTION_KEY_LEGACY
      ) {
        try {
          return decrypt(
            text,
            env.HELPER_ENCRYPTION_KEY_LEGACY,
            algorithm,
            true
          );
        } catch {
          // Legacy key also failed, fall through to try new formats
        }
      }
      // If legacy decryption failed, fall through to try new formats
      // (handles edge case where base64url token looks like legacy)
    }
  }

  // New format detection: handle both base64url (new) and base64 (old) formats
  // First, fix corrupted tokens: base64 never contains spaces, so space = corrupted +
  let base64Text = text.replace(/ /g, '+');

  // Check if it looks like base64url (has - or _ but no + or /)
  const isBase64Url =
    (base64Text.includes('-') || base64Text.includes('_')) &&
    !base64Text.includes('+') &&
    !base64Text.includes('/');

  if (isBase64Url) {
    // Convert from base64url to base64 (RFC 4648 Section 5)
    base64Text = base64Text.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64Text.length % 4) {
      base64Text += '=';
    }
  }
  // Otherwise assume standard base64 (old format) and use as-is

  // Note: Buffer.from(text, 'base64') never throws, even for invalid base64
  // It will just return garbage data, which will fail auth tag verification
  const data = Buffer.from(base64Text, 'base64');

  // Check minimum length for v2/v3 format
  // v2: 1 byte version + 12 bytes IV + 16 bytes authTag + min 1 byte ciphertext = 30 bytes
  // v3: 1 byte version + 1216 bytes KEM + 12 bytes IV + 16 bytes authTag + min 1 byte = 1246 bytes
  if (data.length >= 30) {
    const version = data[0];

    if (version === VERSION_V2) {
      // Try v2 decryption
      try {
        return decryptV2(data.slice(1), encryptionKey);
      } catch {
        // V2 decryption failed (could be 0x02 collision with legacy format)
        // Fall through to try legacy formats
      }
    } else if (version === VERSION_V3) {
      // Try v3 decryption (if implemented)
      try {
        // Uncomment when v3 is implemented
        // return decryptV3(data.slice(1), encryptionKey);
        throw new Error('V3 encryption not yet implemented');
      } catch {
        // V3 decryption failed
        // Fall through to try legacy formats
      }
    }
  }

  // Try ChaCha20-Poly1305 (legacy format without separator)
  try {
    return decryptChaCha(text, encryptionKey);
  } catch {
    // ChaCha failed, try legacy key
    if (
      !triedLegacyKey &&
      env.HELPER_ENCRYPTION_KEY_LEGACY &&
      encryptionKey !== env.HELPER_ENCRYPTION_KEY_LEGACY
    ) {
      return decrypt(text, env.HELPER_ENCRYPTION_KEY_LEGACY, algorithm, true);
    }

    throw new Error('Decryption failed for all supported formats');
  }
}

module.exports = { encrypt, decrypt };
