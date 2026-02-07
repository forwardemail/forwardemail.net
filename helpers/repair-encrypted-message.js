/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const { Buffer } = require('node:buffer');

/**
 * Repairs corrupted multipart/encrypted messages by extracting the encrypted
 * payload from the raw message and injecting it into the mimeTree.
 * This handles messages with empty encrypted.asc bodies from Feb 2-6, 2026.
 *
 * @param {Object} mimeTree - The parsed MIME tree structure
 * @param {Buffer|String} raw - The raw RFC 822 message
 * @returns {Object} - Repaired mimeTree (or original if no repair needed)
 */
function repairEncryptedMessage(mimeTree, raw) {
  if (!mimeTree || typeof mimeTree !== 'object') {
    return mimeTree;
  }

  // Check if this is a multipart/encrypted message
  if (
    mimeTree.contentType !== 'multipart/encrypted' ||
    !Array.isArray(mimeTree.childNodes) ||
    mimeTree.childNodes.length < 2
  ) {
    return mimeTree;
  }

  // Find the encrypted.asc part (usually the second part, index 1)
  const encryptedPartIndex = mimeTree.childNodes.findIndex(
    (part) =>
      part &&
      typeof part === 'object' &&
      part.filename === 'encrypted.asc' &&
      part.contentType === 'application/octet-stream'
  );

  if (encryptedPartIndex === -1) {
    // No encrypted.asc part found
    return mimeTree;
  }

  const encryptedPart = mimeTree.childNodes[encryptedPartIndex];

  // Skip if already has substantial content (> 500 bytes)
  if (encryptedPart.size > 0 && encryptedPart.size > 500) {
    return mimeTree;
  }

  // Extract encrypted payload from raw message
  const extractedPayload = extractEncryptedPayloadFromRaw(raw);

  if (!extractedPayload) {
    // Could not extract payload, return original
    return mimeTree;
  }

  // Update the mimeTree with correct payload
  const payloadBuffer = Buffer.isBuffer(extractedPayload)
    ? extractedPayload
    : Buffer.from(extractedPayload);

  encryptedPart.size = payloadBuffer.length;
  encryptedPart.sizeEstimated = false;
  encryptedPart.content = payloadBuffer;

  return mimeTree;
}

/**
 * Extracts the encrypted payload from a raw RFC 822 message.
 * Handles multipart/encrypted messages where the second MIME part
 * contains the encrypted PGP message block.
 *
 * @param {Buffer|String} raw - The raw RFC 822 message
 * @returns {String|null} - The encrypted payload or null if not found
 */
function extractEncryptedPayloadFromRaw(raw) {
  if (!raw) {
    return null;
  }

  const rawStr = Buffer.isBuffer(raw) ? raw.toString('binary') : raw;

  // Find multipart/encrypted boundary
  const boundaryMatch = rawStr.match(
    /content-type:\s*multipart\/encrypted[^\r\n]*boundary\s*=\s*"?([^"\r\n;]+)/i
  );

  if (!boundaryMatch) {
    return null;
  }

  const boundary = boundaryMatch[1];
  const parts = rawStr.split(`--${boundary}`);

  // Need at least 3 parts: preamble, first part, second part, epilogue
  if (parts.length < 3) {
    return null;
  }

  // Second part (index 2) is typically the encrypted payload
  let encryptedContent = parts[2];

  // Remove the part headers (everything before first blank line)
  const headerEndMatch = encryptedContent.match(/\r?\n\r?\n/);
  if (headerEndMatch) {
    const headerEndIndex = encryptedContent.indexOf(headerEndMatch[0]);
    encryptedContent = encryptedContent.slice(
      Math.max(0, headerEndIndex + headerEndMatch[0].length)
    );
  }

  // Remove trailing boundary and anything after
  const trailingBoundaryMatch = encryptedContent.match(/\r?\n--/);
  if (trailingBoundaryMatch) {
    const boundaryIndex = encryptedContent.indexOf(trailingBoundaryMatch[0]);
    encryptedContent = encryptedContent.slice(0, Math.max(0, boundaryIndex));
  }

  // Trim trailing whitespace but preserve the PGP message structure
  encryptedContent = encryptedContent.replace(/[\r\n]*$/, '');

  // Verify it looks like a PGP message
  if (
    encryptedContent.trim() &&
    encryptedContent.includes('BEGIN PGP MESSAGE')
  ) {
    return encryptedContent;
  }

  return null;
}

module.exports = {
  repairEncryptedMessage,
  extractEncryptedPayloadFromRaw
};
