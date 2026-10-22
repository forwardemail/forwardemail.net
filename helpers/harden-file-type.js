/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { createRequire } = require('node:module');

//
// Spam Scanner checks every attachment of an outbound message with file-type.
// In the version this project locks (file-type 16.5.4, CommonJS), the ASF
// parser loops forever on a sub-header with a size under 24 bytes
// (GHSA-5v7r-6r5c-r473): one attachment sent by any customer held the SMTP or
// API process for good.
//
// So that copy is told apart from an ASF file here (after any ID3 tags, which
// file-type skips first), stopping at such a sub-header, and every other file
// is left to file-type.
//
// This only applies when the file-type Spam Scanner loads can be required as
// CommonJS and exposes `fromBuffer` (the locked 16.5.4). A newer, ESM-only
// file-type cannot be required here and does not have this bug, so nothing is
// changed and Spam Scanner runs exactly as it would without this helper.
// Anything unexpected is caught and left alone, so this can never break a scan.
//
const ASF_HEADER = Buffer.from([
  0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11, 0xa6, 0xd9
]);
const ASF_STREAM_PROPERTIES = Buffer.from([
  0x91, 0x07, 0xdc, 0xb7, 0xb7, 0xa9, 0xcf, 0x11, 0x8e, 0xe6, 0x00, 0xc0, 0x0c,
  0x20, 0x53, 0x65
]);
const ASF_AUDIO = Buffer.from([
  0x40, 0x9e, 0x69, 0xf8, 0x4d, 0x5b, 0xcf, 0x11, 0xa8, 0xfd, 0x00, 0x80, 0x5f,
  0x5c, 0x44, 0x2b
]);
const ASF_VIDEO = Buffer.from([
  0xc0, 0xef, 0x19, 0xbc, 0x4d, 0x5b, 0xcf, 0x11, 0xa8, 0xfd, 0x00, 0x80, 0x5f,
  0x5c, 0x44, 0x2b
]);
const ID3 = Buffer.from('ID3');
const kHardened = Symbol.for('forwardemail.harden-file-type');

function startsWith(buffer, offset, bytes) {
  return (
    buffer.length >= offset + bytes.length &&
    buffer.subarray(offset, offset + bytes.length).equals(bytes)
  );
}

// where file-type reads the file from, after the ID3 tags it skips; the ID3
// size is a "synchsafe" integer read exactly as file-type's uint32SyncSafeToken
// does (only the last byte masked), so the ASF check cannot be stepped over
// with a crafted size
function getStart(buffer) {
  let offset = 0;
  while (startsWith(buffer, offset, ID3) && buffer.length >= offset + 10) {
    const length =
      // eslint-disable-next-line no-bitwise
      (buffer[offset + 6] << 21) |
      // eslint-disable-next-line no-bitwise
      (buffer[offset + 7] << 14) |
      // eslint-disable-next-line no-bitwise
      (buffer[offset + 8] << 7) |
      // eslint-disable-next-line no-bitwise
      (buffer[offset + 9] & 0x7f);
    if (offset + 10 + length > buffer.length) return -1;
    offset += 10 + length;
  }

  return offset;
}

// the type file-type gives an ASF file, as file-type finds it
function getAsfType(buffer, start) {
  let position = start + 30;
  while (position + 24 < buffer.length) {
    const id = buffer.subarray(position, position + 16);
    const size = Number(buffer.readBigUInt64LE(position + 16));
    position += 24;
    if (id.equals(ASF_STREAM_PROPERTIES)) {
      if (startsWith(buffer, position, ASF_AUDIO))
        return { ext: 'asf', mime: 'audio/x-ms-asf' };
      if (startsWith(buffer, position, ASF_VIDEO))
        return { ext: 'asf', mime: 'video/x-ms-asf' };
      break;
    }

    // (where file-type would step back, and loop forever)
    if (!(size >= 24)) break;
    position += size - 24;
  }

  return { ext: 'asf', mime: 'application/vnd.ms-asf' };
}

function toBuffer(input) {
  if (Buffer.isBuffer(input)) return input;
  if (input instanceof Uint8Array)
    return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  if (input instanceof ArrayBuffer) return Buffer.from(input);
}

function hardenFileType() {
  let fileType;
  try {
    // The exact file-type instance Spam Scanner loaded with
    // `require('file-type')` -- taken from its own module so the resolution
    // matches spamscanner's (pnpm nests the locked 16.5.4 under it, which a
    // realpath-based require could miss and pick a hoisted copy instead).
    // If Spam Scanner is not loaded yet, or file-type cannot be required as
    // CommonJS (e.g. a newer ESM-only build, which does not have this bug),
    // this throws or returns nothing and the scan is left untouched.
    const spamscannerPath = require.resolve('spamscanner');
    const spamscanner = require.cache[spamscannerPath];
    fileType =
      spamscanner && typeof spamscanner.require === 'function'
        ? spamscanner.require('file-type')
        : createRequire(spamscannerPath)('file-type');
  } catch {
    return;
  }

  if (
    !fileType ||
    typeof fileType.fromBuffer !== 'function' ||
    fileType.fromBuffer[kHardened]
  )
    return;

  const { fromBuffer } = fileType;
  async function guardedFromBuffer(input) {
    try {
      const buffer = toBuffer(input);
      if (buffer) {
        const start = getStart(buffer);
        if (start !== -1 && startsWith(buffer, start, ASF_HEADER))
          return getAsfType(buffer, start);
      }
    } catch {
      // (fall through to the original on anything unexpected)
    }

    return Reflect.apply(fromBuffer, this, [input]);
  }

  guardedFromBuffer[kHardened] = true;
  try {
    fileType.fromBuffer = guardedFromBuffer;
  } catch {}
}

try {
  hardenFileType();
} catch {}

module.exports = hardenFileType;
