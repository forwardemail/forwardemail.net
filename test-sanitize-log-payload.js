/**
 * Standalone test for helpers/sanitize-log-payload.js
 * Run with: node test-sanitize-log-payload.js
 */

const { Buffer } = require('node:buffer');
const assert = require('node:assert');
const safeStringify = require('fast-safe-stringify');

const sanitizeLogPayload = require('./helpers/sanitize-log-payload');
const {
  getDocByteSize,
  MAX_DOC_BYTES
} = require('./helpers/sanitize-log-payload');

console.log('=== Test 1: Small payload passes through unchanged ===');
{
  const payload = {
    err: {
      message: 'test error',
      name: 'Error',
      stack: 'Error: test\n    at foo'
    },
    message: 'Something went wrong',
    meta: { level: 'error', app: { hostname: 'mx1.forwardemail.net' } }
  };
  const result = sanitizeLogPayload(payload);
  assert.strictEqual(result.err.message, 'test error');
  assert.strictEqual(result.message, 'Something went wrong');
  assert.strictEqual(result.meta.level, 'error');
  console.log('  PASS');
}

console.log('=== Test 2: Large meta.results array is truncated ===');
{
  const largeResults = [];
  for (let i = 0; i < 100; i++) {
    largeResults.push({
      rejectedErrors: [{ message: 'x'.repeat(1000), stack: 'y'.repeat(2000) }],
      envelope: { from: 'a@b.com', to: ['c@d.com'] },
      response: 'z'.repeat(500)
    });
  }

  const payload = {
    err: { message: 'send failed', name: 'Error' },
    message: 'email delivery error',
    meta: { level: 'error', results: largeResults }
  };
  const result = sanitizeLogPayload(payload);
  // Should be truncated to MAX_ARRAY_LENGTH (5) + 1 truncation notice
  assert(Array.isArray(result.meta.results));
  assert(
    result.meta.results.length <= 7,
    `Expected <= 7, got ${result.meta.results.length}`
  );
  console.log('  PASS');
}

console.log('=== Test 3: meta.app.os.cpus is removed ===');
{
  const cpus = [];
  for (let i = 0; i < 16; i++) {
    cpus.push({
      model: 'Intel Xeon',
      speed: 2400,
      times: { user: 1000, nice: 0, sys: 500, idle: 8000, irq: 0 }
    });
  }

  const payload = {
    err: { message: 'test', name: 'Error' },
    message: 'test log',
    meta: {
      level: 'error',
      app: { hostname: 'mx1', os: { cpus, platform: 'linux', arch: 'x64' } }
    }
  };
  const result = sanitizeLogPayload(payload);
  assert.strictEqual(result.meta.app.os.cpus, undefined);
  assert.strictEqual(result.meta.app.os.platform, 'linux');
  console.log('  PASS');
}

console.log('=== Test 4: Duplicate meta.err is removed ===');
{
  const payload = {
    err: { message: 'connection timeout', name: 'TimeoutError' },
    message: 'timeout',
    meta: {
      level: 'error',
      err: { message: 'connection timeout', name: 'TimeoutError' }
    }
  };
  const result = sanitizeLogPayload(payload);
  assert.strictEqual(result.meta.err, undefined);
  console.log('  PASS');
}

console.log('=== Test 5: Oversized string values are truncated ===');
{
  const payload = {
    err: { message: 'x'.repeat(500000), name: 'Error' },
    message: 'big error',
    meta: { level: 'error' }
  };
  const result = sanitizeLogPayload(payload);
  const errMsgBytes = Buffer.byteLength(result.err.message, 'utf8');
  assert(
    errMsgBytes <= 256 * 1024 + 100,
    `Expected <= ~256KB, got ${errMsgBytes}`
  );
  assert(result.err.message.includes('[truncated from'));
  console.log('  PASS');
}

console.log('=== Test 6: Massive payload triggers aggressive fallback ===');
{
  // Create a payload that's over 12 MB even after normal sanitization
  // Each field is 260000 bytes * 50 = 13MB which exceeds MAX_DOC_BYTES (12MB)
  const hugeObj = {};
  for (let i = 0; i < 50; i++) {
    hugeObj[`field_${i}`] = 'x'.repeat(260000);
  }

  const payload = {
    err: { message: 'big error', name: 'Error' },
    message: 'massive log',
    meta: { level: 'error', ...hugeObj }
  };
  const result = sanitizeLogPayload(payload);
  const size = Buffer.byteLength(safeStringify(result), 'utf8');
  assert(size < MAX_DOC_BYTES, `Expected < ${MAX_DOC_BYTES}, got ${size}`);
  assert.strictEqual(result.meta._sanitized, true);
  console.log('  PASS');
}

console.log('=== Test 7: getDocByteSize works correctly ===');
{
  const obj = { err: { message: 'hello' }, meta: { level: 'info' } };
  const size = getDocByteSize(obj);
  const expected = Buffer.byteLength(safeStringify(obj), 'utf8');
  assert.strictEqual(size, expected);
  console.log('  PASS');
}

console.log('=== Test 8: Circular references are handled ===');
{
  const meta = { level: 'error' };
  meta.self = meta; // circular

  const payload = {
    err: { message: 'circular', name: 'Error' },
    message: 'circular test',
    meta
  };
  // Should not throw
  const result = sanitizeLogPayload(payload);
  assert(result.meta);
  assert.strictEqual(result.meta.level, 'error');
  console.log('  PASS');
}

console.log('\n✅ All tests passed!');
