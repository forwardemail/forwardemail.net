/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const zlib = require('node:zlib');

const safeStringify = require('fast-safe-stringify');

//
// Storage Optimization Helpers
//
// This module provides efficient encoding/decoding for SQLite storage:
//
// 1. Attachment bodies (Buffer type):
//    - Old format: hex-encoded string (2x size) - TEXT column
//    - Old format: raw Buffer (1x size) - BLOB column without compression
//    - New format: brotli-compressed Buffer with magic header (stored as BLOB)
//      - Magic header "FEBR" (Forward Email BRotli) indicates compression
//
// 2. Metadata (Mixed/Array types like mimeTree, headers, envelope):
//    - Old format: JSON string
//    - New format: brotli-compressed Buffer (stored as BLOB via bufferAsNative)
//
// All functions are backwards-compatible and auto-detect the format on read.
//

// Brotli compression options optimized for speed (level 4 is a good balance)
const BROTLI_COMPRESS_OPTIONS = {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4
  }
};

// Magic header for brotli-compressed attachment bodies
// "FEBR" = Forward Email BRotli (0x46 0x45 0x42 0x52)
// This is unlikely to appear at the start of:
// - Old hex strings (only contain 0-9, a-f)
// - Old raw attachment data (typically starts with content bytes)
const ATTACHMENT_MAGIC = Buffer.from('FEBR');

/**
 * Check if a value is an old hex-encoded string
 * Hex strings only contain lowercase a-f and 0-9, and have even length
 */
function isOldHexFormat(value) {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length % 2 !== 0
  ) {
    return false;
  }

  return /^[\da-f]+$/.test(value);
}

/**
 * Check if a value is an old JSON string
 * JSON strings start with { or [ for objects/arrays
 */
function isOldJsonFormat(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  const firstChar = value[0];
  return firstChar === '{' || firstChar === '[';
}

/**
 * Check if a buffer has the brotli magic header
 */
function hasBrotliMagic(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < ATTACHMENT_MAGIC.length) {
    return false;
  }

  return buf.subarray(0, ATTACHMENT_MAGIC.length).equals(ATTACHMENT_MAGIC);
}

/**
 * Encode attachment body for storage with brotli compression
 * Uses a magic header to indicate compression
 *
 * @param {Buffer} body - The attachment body
 * @returns {Buffer} - Compressed buffer with magic header, or original if compression doesn't help
 */
function encodeAttachmentBody(body) {
  // Handle mongoose Binary objects (from toObject())
  // Binary has a .buffer property containing the actual Buffer
  if (
    body &&
    typeof body === 'object' &&
    body.constructor?.name === 'Binary' &&
    Buffer.isBuffer(body.buffer)
  ) {
    body = body.buffer;
  }

  if (!Buffer.isBuffer(body)) {
    return body;
  }

  // Try to compress with brotli
  const compressed = zlib.brotliCompressSync(body, BROTLI_COMPRESS_OPTIONS);

  // Only use compression if it actually saves space
  // (need to account for the 4-byte magic header)
  if (compressed.length + ATTACHMENT_MAGIC.length < body.length) {
    // Compression helped - use compressed format with magic header
    const result = Buffer.allocUnsafe(
      ATTACHMENT_MAGIC.length + compressed.length
    );
    ATTACHMENT_MAGIC.copy(result, 0);
    compressed.copy(result, ATTACHMENT_MAGIC.length);
    return result;
  }

  // Compression didn't help - store uncompressed (no magic header)
  return body;
}

/**
 * Decode attachment body from storage
 * Handles old hex format, old native BLOB, and new compressed format
 *
 * @param {Buffer|string} value - The stored value
 * @returns {Buffer|null} - The decoded attachment body
 */
function decodeAttachmentBody(value) {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return null;
  }

  // Handle Uint8Array (from WebSocket/msgpackr)
  if (value instanceof Uint8Array && !Buffer.isBuffer(value)) {
    value = Buffer.from(value);
  }

  // Check for new compressed format with magic header
  if (Buffer.isBuffer(value) && hasBrotliMagic(value)) {
    try {
      return zlib.brotliDecompressSync(value.subarray(ATTACHMENT_MAGIC.length));
    } catch {
      // If decompression fails, return as-is (shouldn't happen)
      return value;
    }
  }

  // Old format: raw Buffer without magic header (backwards compatibility)
  if (Buffer.isBuffer(value)) {
    return value;
  }

  // Old format: hex-encoded string
  if (isOldHexFormat(value)) {
    return Buffer.from(value, 'hex');
  }

  // Unknown format - return as-is
  return value;
}

/**
 * Encode metadata (mimeTree, headers, envelope, etc.) for storage
 * Uses brotli compression for significant space savings
 *
 * @param {*} data - The data to encode (object, array, etc.)
 * @returns {Buffer} - Brotli-compressed JSON as Buffer (stored as native BLOB)
 */
function encodeMetadata(data) {
  if (data === null || data === undefined) {
    return null;
  }

  // Convert to JSON string
  const json = safeStringify(data);

  // Compress with brotli
  const compressed = zlib.brotliCompressSync(
    Buffer.from(json, 'utf8'),
    BROTLI_COMPRESS_OPTIONS
  );

  return compressed;
}

/**
 * Decode metadata from storage
 * Handles both old JSON format and new brotli-compressed format
 *
 * @param {Buffer|string} value - The stored value
 * @param {Function} recursivelyParse - Function to recursively parse JSON (handles Buffers, Dates, etc.)
 * @returns {*} - The decoded data
 */
function decodeMetadata(value, recursivelyParse) {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle Uint8Array (from WebSocket/msgpackr)
  if (value instanceof Uint8Array && !Buffer.isBuffer(value)) {
    value = Buffer.from(value);
  }

  // Old format: JSON string
  if (isOldJsonFormat(value)) {
    return recursivelyParse(value);
  }

  // New format: brotli-compressed Buffer
  if (Buffer.isBuffer(value)) {
    try {
      const decompressed = zlib.brotliDecompressSync(value);
      const json = decompressed.toString('utf8');
      return recursivelyParse(json);
    } catch {
      // If decompression fails, it might be raw data
      // Try parsing as JSON in case it's uncompressed
      try {
        return recursivelyParse(value.toString('utf8'));
      } catch {
        // Return as-is if all parsing fails
        return value;
      }
    }
  }

  // String that's not JSON - might be compressed data stored as string somehow
  if (typeof value === 'string') {
    try {
      return recursivelyParse(value);
    } catch {
      return value;
    }
  }

  // Unknown format - return as-is
  return value;
}

/**
 * Check if an attachment body needs migration (is in old hex format)
 *
 * @param {*} value - The stored value
 * @returns {boolean} - True if migration is needed
 */
function attachmentNeedsMigration(value) {
  // Only old hex format needs migration
  // Native Buffers (with or without magic header) are already in the correct format
  return isOldHexFormat(value);
}

/**
 * Check if metadata needs migration (is in old JSON format)
 *
 * @param {*} value - The stored value
 * @returns {boolean} - True if migration is needed
 */
function metadataNeedsMigration(value) {
  return isOldJsonFormat(value);
}

module.exports = {
  encodeAttachmentBody,
  decodeAttachmentBody,
  encodeMetadata,
  decodeMetadata,
  attachmentNeedsMigration,
  metadataNeedsMigration,
  isOldHexFormat,
  isOldJsonFormat,
  hasBrotliMagic,
  ATTACHMENT_MAGIC
};
