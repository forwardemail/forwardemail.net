/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Buffer } = require('node:buffer');

const SieveEngine = require('../../helpers/sieve/engine');
const { SieveIntegration } = require('../../helpers/sieve/integration');
const { validateScript } = require('../../helpers/sieve');
const { parse } = require('../../helpers/sieve/parser');

const logger = {
  debug() {},
  info() {},
  warn() {},
  error() {}
};

function createMimeMessage() {
  return {
    headers: {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Sieve MIME test'
    },
    envelope: {
      from: 'sender@example.com',
      to: 'recipient@example.com'
    },
    mimeParts: [
      {
        contentType: 'multipart/alternative',
        headers: {
          'content-type': 'multipart/alternative; boundary="unit-test-boundary"'
        },
        body: '',
        multipart: true
      },
      {
        contentType: 'text/plain',
        headers: { 'content-type': 'text/plain; charset=utf-8' },
        body: 'Original plain text',
        multipart: false
      },
      {
        contentType: 'text/html',
        headers: { 'content-type': 'text/html; charset=utf-8' },
        body: '<p>Original HTML</p>',
        multipart: false
      }
    ]
  };
}

function createMultipartMessage({ foldedBoundary }) {
  const boundary = 'unit-test-boundary';
  const contentType = foldedBoundary
    ? 'Content-Type: multipart/alternative;\r\n boundary="unit-test-boundary"'
    : 'Content-Type: multipart/alternative; boundary="unit-test-boundary"';

  return Buffer.from(
    `From: sender@example.com\r\n` +
      `To: recipient@example.com\r\n` +
      `Subject: Sieve MIME test\r\n` +
      `MIME-Version: 1.0\r\n` +
      `${contentType}\r\n` +
      `\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: text/plain;\r\n` +
      ` charset=utf-8;\r\n` +
      ` format=flowed\r\n` +
      `Content-Disposition: inline;\r\n` +
      ` filename="example.txt"\r\n` +
      `\r\n` +
      `Original plain text\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n` +
      `\r\n` +
      `<p>Original HTML</p>\r\n` +
      `--${boundary}--\r\n`
  );
}

describe('Sieve RFC 5703 integration regressions', () => {
  it('accepts explicit command declarations alongside the mime umbrella', async () => {
    const script = `
      require ["foreverypart", "mime", "replace"];
      foreverypart {
        replace "Replacement text";
      }
    `;
    const validation = validateScript(script);
    const engine = new SieveEngine({ logger });
    const result = await engine.execute(parse(script), createMimeMessage());

    assert.strictEqual(validation.valid, true);
    assert.deepStrictEqual(
      result.actions.filter((action) => action.type === 'replace'),
      [
        {
          type: 'replace',
          partIndex: 1,
          replacement: 'Replacement text',
          mime: false,
          subject: null,
          from: null
        },
        {
          type: 'replace',
          partIndex: 2,
          replacement: 'Replacement text',
          mime: false,
          subject: null,
          from: null
        }
      ]
    );
  });

  it('retains mime as a compatible umbrella for RFC 5703 commands', async () => {
    const script = `
      require "mime";
      foreverypart {
        replace "Replacement text";
      }
    `;
    const engine = new SieveEngine({ logger });
    const result = await engine.execute(parse(script), createMimeMessage());

    assert.strictEqual(
      result.actions.filter((action) => action.type === 'replace').length,
      2
    );
  });

  it('rejects unrequired RFC 5703 commands when they execute', async () => {
    const engine = new SieveEngine({ logger });

    await assert.rejects(
      engine.execute(parse('foreverypart { keep; }'), createMimeMessage()),
      /Capability "foreverypart" must be declared with require\./
    );
    await assert.rejects(
      engine.execute(
        parse('require "foreverypart"; foreverypart { replace "text"; }'),
        createMimeMessage()
      ),
      /Capability "replace" must be declared with require\./
    );
    await assert.rejects(
      engine.execute(
        parse(
          'require ["foreverypart", "variables"]; foreverypart { extracttext "text"; }'
        ),
        createMimeMessage()
      ),
      /Capability "extracttext" must be declared with require\./
    );
    await assert.rejects(
      engine.execute(parse('enclose "message/rfc822";'), createMimeMessage()),
      /Capability "enclose" must be declared with require\./
    );
  });

  it('replaces a MIME part when the top-level boundary is folded', () => {
    const integration = new SieveIntegration();
    const raw = createMultipartMessage({ foldedBoundary: true });
    const result = integration
      .applyReplaceActions(raw, [
        { partIndex: 1, replacement: 'Replacement text' }
      ])
      .toString();

    assert.match(
      result,
      /Content-Type: multipart\/alternative;\r\n boundary="unit-test-boundary"/
    );
    assert.match(result, /\r\n\r\nReplacement text\r\n--unit-test-boundary/);
    assert.doesNotMatch(result, /Original plain text/);
    assert.match(result, /<p>Original HTML<\/p>/);
  });

  it('replaces a MIME part when the top-level boundary is unfolded', () => {
    const integration = new SieveIntegration();
    const raw = createMultipartMessage({ foldedBoundary: false });
    const result = integration
      .applyReplaceActions(raw, [
        { partIndex: 1, replacement: 'Replacement text' }
      ])
      .toString();

    assert.match(result, /\r\n\r\nReplacement text\r\n--unit-test-boundary/);
    assert.doesNotMatch(result, /Original plain text/);
  });

  it('unfolds MIME-part header continuation lines before storing headers', async () => {
    const integration = new SieveIntegration();
    const parts = await integration.parseMimeTree(
      createMultipartMessage({ foldedBoundary: true })
    );
    const plainTextPart = parts.find(
      (part) =>
        part.headers['content-disposition'] === 'inline; filename="example.txt"'
    );

    assert.ok(plainTextPart);
    assert.strictEqual(
      plainTextPart.headers['content-type'],
      'text/plain; charset=utf-8; format=flowed'
    );
    assert.strictEqual(
      plainTextPart.headers['content-disposition'],
      'inline; filename="example.txt"'
    );
  });
});
