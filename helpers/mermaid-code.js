/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const env = require('#config/env');
const { encrypt, decryptStrict } = require('#helpers/encrypt-decrypt');

//
// Mermaid diagrams are rendered server-side from the encrypted `code` query
// parameter of `/mermaid.png`.  Other features hand out values encrypted with
// the shared helper key (some of them user-chosen strings), so codes use their
// own key derived from it with domain separation.  Otherwise any such value
// could be replayed as a diagram of an attacker's choosing.
//
function getMermaidKey() {
  if (!env.HELPER_ENCRYPTION_KEY) throw new TypeError('Encryption key missing');
  // HMAC-SHA256 output is the 32 bytes AES-256-GCM needs
  return crypto
    .createHmac('sha256', env.HELPER_ENCRYPTION_KEY)
    .update('mermaid')
    .digest();
}

function encryptMermaidCode(code) {
  return encrypt(code, undefined, getMermaidKey());
}

function decryptMermaidCode(value) {
  return decryptStrict(value, getMermaidKey());
}

module.exports = { encryptMermaidCode, decryptMermaidCode };
