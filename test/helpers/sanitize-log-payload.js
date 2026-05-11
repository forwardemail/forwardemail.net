/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const safeStringify = require('fast-safe-stringify');

const sanitizeLogPayload = require('#helpers/sanitize-log-payload');
const {
  getDocByteSize,
  MAX_DOC_BYTES
} = require('#helpers/sanitize-log-payload');

test('small payload passes through unchanged', (t) => {
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
  t.is(result.err.message, 'test error');
  t.is(result.message, 'Something went wrong');
  t.is(result.meta.level, 'error');
});

test('large meta.results array is truncated', (t) => {
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
  t.true(Array.isArray(result.meta.results));
  // Should be truncated to MAX_ARRAY_LENGTH (5) + 1 truncation notice
  t.true(result.meta.results.length <= 7);
});

test('meta.app.os.cpus is removed', (t) => {
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
  t.is(result.meta.app.os.cpus, undefined);
  t.is(result.meta.app.os.platform, 'linux');
});

test('duplicate meta.err is removed when identical to top-level err', (t) => {
  const payload = {
    err: { message: 'connection timeout', name: 'TimeoutError' },
    message: 'timeout',
    meta: {
      level: 'error',
      err: { message: 'connection timeout', name: 'TimeoutError' }
    }
  };
  const result = sanitizeLogPayload(payload);
  t.is(result.meta.err, undefined);
});

test('non-duplicate meta.err is preserved', (t) => {
  const payload = {
    err: { message: 'connection timeout', name: 'TimeoutError' },
    message: 'timeout',
    meta: {
      level: 'error',
      err: { message: 'different error', name: 'OtherError' }
    }
  };
  const result = sanitizeLogPayload(payload);
  t.is(result.meta.err.message, 'different error');
});

test('oversized string values are truncated', (t) => {
  const payload = {
    err: { message: 'x'.repeat(500000), name: 'Error' },
    message: 'big error',
    meta: { level: 'error' }
  };
  const result = sanitizeLogPayload(payload);
  const errMsgBytes = Buffer.byteLength(result.err.message, 'utf8');
  // MAX_FIELD_BYTES is 256 KB
  t.true(errMsgBytes <= 256 * 1024 + 100);
  t.true(result.err.message.includes('[truncated from'));
});

test('massive payload triggers aggressive fallback', (t) => {
  // Create a payload that exceeds MAX_DOC_BYTES (12 MB)
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
  t.true(size < MAX_DOC_BYTES);
  t.is(result.meta._sanitized, true);
});

test('getDocByteSize returns correct size', (t) => {
  const obj = { err: { message: 'hello' }, meta: { level: 'info' } };
  const size = getDocByteSize(obj);
  const expected = Buffer.byteLength(safeStringify(obj), 'utf8');
  t.is(size, expected);
});

test('getDocByteSize works with toObject method', (t) => {
  const obj = {
    err: { message: 'hello' },
    meta: { level: 'info' },
    toObject() {
      return { err: this.err, meta: this.meta };
    }
  };
  const size = getDocByteSize(obj);
  const expected = Buffer.byteLength(
    safeStringify({ err: obj.err, meta: obj.meta }),
    'utf8'
  );
  t.is(size, expected);
});

test('circular references are handled gracefully', (t) => {
  const meta = { level: 'error' };
  meta.self = meta; // circular

  const payload = {
    err: { message: 'circular', name: 'Error' },
    message: 'circular test',
    meta
  };
  // Should not throw
  const result = sanitizeLogPayload(payload);
  t.truthy(result.meta);
  t.is(result.meta.level, 'error');
});

test('err.bounces array is truncated', (t) => {
  const bounces = [];
  for (let i = 0; i < 50; i++) {
    bounces.push({
      message: `Bounce ${i}`,
      recipient: `user${i}@example.com`,
      stack: 'Error: bounce\n    at somewhere'
    });
  }

  const payload = {
    err: { message: 'delivery failed', name: 'Error', bounces },
    message: 'bounce error',
    meta: { level: 'error' }
  };
  const result = sanitizeLogPayload(payload);
  t.true(Array.isArray(result.err.bounces));
  t.true(result.err.bounces.length <= 7);
});

test('result stays under MAX_DOC_BYTES for realistic large payload', (t) => {
  // Simulate a realistic oversized log payload with rejectedErrors
  const rejectedErrors = [];
  for (let i = 0; i < 200; i++) {
    rejectedErrors.push({
      message: `SMTP error ${i}: ${'x'.repeat(5000)}`,
      name: 'SMTPError',
      responseCode: 550,
      stack: `Error: SMTP error\n${'    at handler (file.js:100)\n'.repeat(50)}`
    });
  }

  const payload = {
    err: {
      message: 'Failed to send email',
      name: 'Error',
      responseCode: 550,
      bounces: rejectedErrors.slice(0, 50)
    },
    message: 'email send failure',
    meta: {
      level: 'error',
      results: rejectedErrors,
      session: {
        envelope: {
          mailFrom: { address: 'sender@example.com' },
          rcptTo: [{ address: 'recipient@example.com' }]
        },
        headers: { 'x-custom': 'a'.repeat(100000) }
      },
      app: {
        hostname: 'mx1.forwardemail.net',
        name: 'forward-email',
        os: {
          cpus: Array.from({ length: 16 }, () => ({
            model: 'Intel Xeon',
            speed: 2400
          })),
          platform: 'linux'
        }
      }
    }
  };

  const result = sanitizeLogPayload(payload);
  const size = Buffer.byteLength(safeStringify(result), 'utf8');
  t.true(size < MAX_DOC_BYTES, `Expected < ${MAX_DOC_BYTES}, got ${size}`);
});

test('null and undefined values are handled', (t) => {
  const payload = {
    err: null,
    message: undefined,
    meta: null
  };
  const result = sanitizeLogPayload(payload);
  t.is(result.err, null);
  t.is(result.message, undefined);
  t.is(result.meta, null);
});

test('MAX_DOC_BYTES is 12 MB', (t) => {
  t.is(MAX_DOC_BYTES, 12 * 1024 * 1024);
});
