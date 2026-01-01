/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const zlib = require('node:zlib');

const test = require('ava');

const {
  encodeAttachmentBody,
  decodeAttachmentBody,
  encodeMetadata,
  decodeMetadata,
  attachmentNeedsMigration,
  metadataNeedsMigration,
  isOldHexFormat,
  isOldJsonFormat
} = require('#helpers/msgpack-helpers');

const recursivelyParse = require('#helpers/recursively-parse');

//
// isOldHexFormat tests
//
test('isOldHexFormat returns true for valid hex strings', (t) => {
  t.true(isOldHexFormat('48656c6c6f'));
  t.true(isOldHexFormat('0123456789abcdef'));
  t.true(isOldHexFormat('deadbeef'));
});

test('isOldHexFormat returns false for non-hex strings', (t) => {
  t.false(isOldHexFormat('ABCDEF')); // uppercase
  t.false(isOldHexFormat('ghijkl')); // non-hex chars
});

test('isOldHexFormat returns false for non-strings', (t) => {
  t.false(isOldHexFormat(null));
  t.false(isOldHexFormat(undefined));
  t.false(isOldHexFormat(123));
  t.false(isOldHexFormat(Buffer.from('test')));
  t.false(isOldHexFormat({}));
});

test('isOldHexFormat returns false for empty string', (t) => {
  t.false(isOldHexFormat(''));
});

test('isOldHexFormat returns false for odd-length hex strings', (t) => {
  t.false(isOldHexFormat('abc')); // Odd length
  t.false(isOldHexFormat('12345')); // Odd length
});

//
// isOldJsonFormat tests
//
test('isOldJsonFormat returns true for JSON object strings', (t) => {
  t.true(isOldJsonFormat('{"key":"value"}'));
  t.true(isOldJsonFormat('{}'));
});

test('isOldJsonFormat returns true for JSON array strings', (t) => {
  t.true(isOldJsonFormat('[1,2,3]'));
  t.true(isOldJsonFormat('[]'));
});

test('isOldJsonFormat returns false for non-JSON strings', (t) => {
  t.false(isOldJsonFormat('plain text'));
  t.false(isOldJsonFormat(''));
  t.false(isOldJsonFormat('123'));
});

test('isOldJsonFormat returns false for non-strings', (t) => {
  t.false(isOldJsonFormat(null));
  t.false(isOldJsonFormat(undefined));
  t.false(isOldJsonFormat(123));
  t.false(isOldJsonFormat(Buffer.from('test')));
});

//
// encodeAttachmentBody tests
//
test('encodeAttachmentBody returns Buffer as-is', (t) => {
  const buffer = Buffer.from('Hello World');
  const encoded = encodeAttachmentBody(buffer);
  t.true(Buffer.isBuffer(encoded));
  t.deepEqual(encoded, buffer);
});

test('encodeAttachmentBody passes through non-Buffer values', (t) => {
  t.is(encodeAttachmentBody(null), null);
  t.is(encodeAttachmentBody(undefined), undefined);
  t.is(encodeAttachmentBody('string'), 'string');
});

//
// decodeAttachmentBody tests
//
test('decodeAttachmentBody handles native BLOB (Buffer)', (t) => {
  const buffer = Buffer.from('Hello World');
  const decoded = decodeAttachmentBody(buffer);
  t.true(Buffer.isBuffer(decoded));
  t.deepEqual(decoded, buffer);
});

test('decodeAttachmentBody handles old hex format', (t) => {
  const original = Buffer.from('Hello World');
  const hexEncoded = original.toString('hex');
  const decoded = decodeAttachmentBody(hexEncoded);
  t.true(Buffer.isBuffer(decoded));
  t.deepEqual(decoded, original);
});

test('decodeAttachmentBody handles null/undefined', (t) => {
  t.is(decodeAttachmentBody(null), null);
  t.is(decodeAttachmentBody(undefined), null);
});

test('attachmentNeedsMigration returns true for hex format', (t) => {
  t.true(attachmentNeedsMigration('48656c6c6f'));
  t.false(attachmentNeedsMigration(Buffer.from('Hello')));
  t.false(attachmentNeedsMigration(null));
});

//
// encodeMetadata tests
//
test('encodeMetadata compresses JSON with brotli', (t) => {
  const data = { key: 'value', array: [1, 2, 3] };
  const encoded = encodeMetadata(data);
  t.true(Buffer.isBuffer(encoded));

  // Verify it's brotli-compressed by decompressing
  const decompressed = zlib.brotliDecompressSync(encoded);
  const parsed = JSON.parse(decompressed.toString('utf8'));
  t.deepEqual(parsed, data);
});

test('encodeMetadata handles null/undefined', (t) => {
  t.is(encodeMetadata(null), null);
  t.is(encodeMetadata(undefined), null);
});

test('encodeMetadata achieves significant compression', (t) => {
  // Create a realistic mimeTree-like object with repetitive data
  const mimeTree = {
    childNodes: [
      {
        part: '1',
        type: 'text/plain',
        encoding: 'quoted-printable',
        size: 1234,
        lineCount: 50,
        body: false
      },
      {
        part: '2',
        type: 'text/html',
        encoding: 'quoted-printable',
        size: 5678,
        lineCount: 200,
        body: false
      }
    ],
    headers: {
      from: [{ address: 'sender@example.com', name: 'Sender Name' }],
      to: [{ address: 'recipient@example.com', name: 'Recipient Name' }],
      subject: 'Test Email Subject'
    }
  };

  const jsonSize = JSON.stringify(mimeTree).length;
  const encoded = encodeMetadata(mimeTree);
  const compressedSize = encoded.length;

  // Brotli should achieve at least 30% compression on this data
  t.true(
    compressedSize < jsonSize * 0.7,
    `Expected ${compressedSize} < ${jsonSize * 0.7}`
  );
});

//
// decodeMetadata tests
//
test('decodeMetadata handles brotli-compressed Buffer', (t) => {
  const data = { key: 'value', nested: { array: [1, 2, 3] } };
  const encoded = encodeMetadata(data);
  const decoded = decodeMetadata(encoded, recursivelyParse);
  t.deepEqual(decoded, data);
});

test('decodeMetadata handles old JSON object format', (t) => {
  const data = { key: 'value', array: [1, 2, 3] };
  const jsonString = JSON.stringify(data);
  const decoded = decodeMetadata(jsonString, recursivelyParse);
  t.deepEqual(decoded, data);
});

test('decodeMetadata handles old JSON array format', (t) => {
  const data = ['flag1', 'flag2', 'flag3'];
  const jsonString = JSON.stringify(data);
  const decoded = decodeMetadata(jsonString, recursivelyParse);
  t.deepEqual(decoded, data);
});

test('decodeMetadata handles null/undefined', (t) => {
  t.is(decodeMetadata(null, recursivelyParse), null);
  t.is(decodeMetadata(undefined, recursivelyParse), undefined);
});

test('metadataNeedsMigration returns true for JSON format', (t) => {
  t.true(metadataNeedsMigration('{"key":"value"}'));
  t.true(metadataNeedsMigration('[1,2,3]'));
  t.false(metadataNeedsMigration(Buffer.from('compressed')));
  t.false(metadataNeedsMigration(null));
});

//
// Round-trip tests
//
test('roundtrip: attachment body encoding/decoding', (t) => {
  const original = Buffer.from(
    'Binary attachment data with special chars: \u0000\u0001\u0002'
  );
  const encoded = encodeAttachmentBody(original);
  const decoded = decodeAttachmentBody(encoded);
  t.deepEqual(decoded, original);
});

test('roundtrip: metadata encoding/decoding', (t) => {
  const original = {
    mimeTree: {
      childNodes: [{ type: 'text/plain', body: false }]
    },
    flags: ['\\Seen', '\\Flagged'],
    count: 42
  };
  const encoded = encodeMetadata(original);
  const decoded = decodeMetadata(encoded, recursivelyParse);
  t.deepEqual(decoded, original);
});

//
// Backwards compatibility tests
//
test('backwards compat: decode old hex attachment', (t) => {
  // Simulate old hex-encoded attachment
  const original = Buffer.from('Old attachment data');
  const oldFormat = original.toString('hex');
  const decoded = decodeAttachmentBody(oldFormat);
  t.deepEqual(decoded, original);
});

test('backwards compat: decode old JSON metadata', (t) => {
  // Simulate old JSON-encoded metadata
  const original = { flags: ['\\Seen'], headers: { subject: 'Test' } };
  const oldFormat = JSON.stringify(original);
  const decoded = decodeMetadata(oldFormat, recursivelyParse);
  t.deepEqual(decoded, original);
});

//
// Edge cases
//
test('encodeMetadata handles complex nested structures', (t) => {
  const complex = {
    level1: {
      level2: {
        level3: {
          array: [1, 2, { nested: true }],
          string: 'test value'
        }
      }
    }
  };
  const encoded = encodeMetadata(complex);
  const decoded = decodeMetadata(encoded, recursivelyParse);
  t.deepEqual(decoded, complex);
});

test('encodeMetadata handles empty objects and arrays', (t) => {
  t.deepEqual(decodeMetadata(encodeMetadata({}), recursivelyParse), {});
  t.deepEqual(decodeMetadata(encodeMetadata([]), recursivelyParse), []);
});

test('decodeAttachmentBody handles empty buffer', (t) => {
  const empty = Buffer.alloc(0);
  const decoded = decodeAttachmentBody(empty);
  t.deepEqual(decoded, empty);
});

//
// Storage efficiency tests
//
test('native BLOB with compression is smaller than hex encoding', (t) => {
  const buffer = Buffer.alloc(1000);
  buffer.fill(0xab);

  const hexEncoded = buffer.toString('hex');
  const nativeBlob = encodeAttachmentBody(buffer);

  // Hex is 2x the size (2000 bytes)
  t.is(hexEncoded.length, 2000);

  // Native BLOB with brotli compression should be much smaller
  // (repetitive data compresses very well)
  t.true(nativeBlob.length < hexEncoded.length);
  t.true(nativeBlob.length < buffer.length); // Compression helped

  // Verify it can be decoded back
  const decoded = decodeAttachmentBody(nativeBlob);
  t.true(decoded.equals(buffer));
});

test('brotli compression saves significant space on metadata', (t) => {
  const mimeTree = {
    childNodes: [
      { part: '1', type: 'text/plain', encoding: 'quoted-printable' },
      { part: '2', type: 'text/html', encoding: 'quoted-printable' }
    ],
    headers: {
      from: [{ address: 'test@example.com', name: 'Test User' }],
      to: [{ address: 'recipient@example.com', name: 'Recipient' }],
      subject: 'Test Subject Line'
    }
  };

  const jsonSize = JSON.stringify(mimeTree).length;
  const compressed = encodeMetadata(mimeTree);

  // Should save at least 30%
  const savings = ((jsonSize - compressed.length) / jsonSize) * 100;
  t.true(savings > 30, `Expected > 30% savings, got ${savings.toFixed(1)}%`);
});
