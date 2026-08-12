/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Integration Unit Tests
 *
 * These are node:test unit tests for pure helpers on SieveIntegration that
 * do not require database connectivity (compare test/sieve/mx-integration.js).
 * For full integration tests with the database, see test/sieve/integration.js
 * (AVA), which needs the complete MX/IMAP/SQLite harness.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Buffer } = require('node:buffer');

const { SieveIntegration } = require('../../helpers/sieve/integration');

// A long boundary of the shape Microsoft Exchange Online generates. Real
// Exchange boundaries are long enough that the `boundary=` parameter is
// routinely folded onto an RFC 5322 continuation line, which is what makes
// the folded variant below the common case rather than an edge case.
const BOUNDARY = '_004_AS8P194MB1974EXAMPLEBOUNDARY_';

const IMAGE_BODY =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YA';

/**
 * Build a multipart/related message with an inline image part.
 *
 * @param {Object} options
 * @param {boolean} options.folded - fold the top-level boundary parameter
 *   onto a continuation line (Exchange Online style) instead of keeping the
 *   whole Content-Type on one physical line
 * @returns {Buffer} raw message
 */
function createRelatedMessage({ folded }) {
  const topContentType = folded
    ? `Content-Type: multipart/related;\r\n` +
      `\tboundary="${BOUNDARY}";\r\n` +
      `\ttype="multipart/alternative"`
    : `Content-Type: multipart/related; boundary="${BOUNDARY}"; type="multipart/alternative"`;

  return Buffer.from(
    `From: sender@example.com\r\n` +
      `To: recipient@example.com\r\n` +
      `Subject: Test\r\n` +
      `MIME-Version: 1.0\r\n` +
      `${topContentType}\r\n` +
      `\r\n` +
      `--${BOUNDARY}\r\n` +
      `Content-Type: text/plain; charset="utf-8"\r\n` +
      `\r\n` +
      `Hello.\r\n` +
      `--${BOUNDARY}\r\n` +
      `Content-Type: image/png; name="logo.png"\r\n` +
      `Content-Transfer-Encoding: base64\r\n` +
      `Content-ID: <img1>\r\n` +
      `Content-Disposition: inline; filename="logo.png"\r\n` +
      `\r\n` +
      `${IMAGE_BODY}\r\n` +
      `--${BOUNDARY}--\r\n`,
    'utf8'
  );
}

describe('Sieve Integration (unit)', () => {
  describe('applyReplaceActions boundary detection (RFC 5322 folding)', () => {
    // The image is the second child part, which maps to split segment 2
    // (segment 0 is the preamble/top-level headers, segment 1 is text/plain).
    const replaceActions = [
      { partIndex: 2, replacement: '[image removed by filter]', mime: false }
    ];

    it('should apply replace when the top-level boundary is folded', () => {
      const integration = new SieveIntegration({});
      const raw = createRelatedMessage({ folded: true });
      const result = integration.applyReplaceActions(raw, replaceActions);

      // applyReplaceActions() locates the boundary with
      //   /content-type:[^\r\n]*boundary="?([^"\s;]+)"?/i
      // and [^\r\n]* cannot cross a line break. RFC 5322 Section 2.2.3 allows
      // header field bodies to be folded onto continuation lines, and Exchange
      // Online does exactly that for multipart/related because its boundary
      // strings are long. The match therefore returns null and the function
      // silently returns the message unchanged, so replace becomes a no-op for
      // this very common class of message.
      assert.notStrictEqual(
        Buffer.compare(raw, result),
        0,
        'expected replace to rewrite the MIME part, but the message came back ' +
          'byte-identical because the boundary regex cannot match a folded ' +
          'Content-Type header'
      );
      assert.ok(
        result.toString('utf8').includes('[image removed by filter]'),
        'expected the replacement text to be present in the rewritten message'
      );
      assert.ok(
        !result.toString('utf8').includes(IMAGE_BODY),
        'expected the original image body to be gone after replace'
      );
    });

    it('should apply replace when the top-level boundary is not folded', () => {
      // Control: identical message, boundary on a single physical line. This
      // passes today, which is what isolates folding specifically as the
      // trigger for the failure above.
      const integration = new SieveIntegration({});
      const raw = createRelatedMessage({ folded: false });
      const result = integration.applyReplaceActions(raw, replaceActions);

      assert.notStrictEqual(Buffer.compare(raw, result), 0);
      assert.ok(result.toString('utf8').includes('[image removed by filter]'));
      assert.ok(!result.toString('utf8').includes(IMAGE_BODY));
    });
  });

  describe('parseMimeTree header unfolding (RFC 5322 Section 2.2.3)', () => {
    it('should unfold header continuation lines instead of creating bogus keys', async () => {
      const integration = new SieveIntegration({});
      const raw = Buffer.from(
        `From: sender@example.com\r\n` +
          `To: recipient@example.com\r\n` +
          `Subject: Test\r\n` +
          `MIME-Version: 1.0\r\n` +
          `Content-Type: multipart/related; boundary="${BOUNDARY}"\r\n` +
          `\r\n` +
          `--${BOUNDARY}\r\n` +
          `Content-Type: image/png; name="logo.png"\r\n` +
          `Content-ID: <img1>\r\n` +
          `Content-Disposition: inline; filename="logo.png";\r\n` +
          `\tcreation-date="Mon, 21 Jul 2026 10:00:00 GMT"\r\n` +
          `\r\n` +
          `${IMAGE_BODY}\r\n` +
          `--${BOUNDARY}--\r\n`,
        'utf8'
      );

      const parts = await integration.parseMimeTree(raw);
      const imagePart = parts.find((part) =>
        String(part.contentType).startsWith('image/')
      );
      assert.ok(imagePart, 'expected to find the image/png part');

      // parseMimeTree() splits chunk.getHeaders() on /\r?\n/ and treats every
      // physical line as a complete header, doing line.indexOf(':') per line.
      // A folded continuation line therefore becomes its own header, and the
      // colon inside the timestamp ("10:00:00") is misread as the separator,
      // yielding a bogus key of `creation-date="mon, 21 jul 2026 10`.
      //
      // Note this does not by itself break :type extraction: the
      // content-disposition value keeps its leading `inline` token, which
      // precedes the fold. It will however corrupt any read of a folded
      // parameter.
      const bogusKeys = Object.keys(imagePart.headers).filter((name) =>
        name.startsWith('creation-date=')
      );
      assert.deepStrictEqual(
        bogusKeys,
        [],
        `expected no bogus header key from the folded continuation line, got ${JSON.stringify(
          bogusKeys
        )}`
      );
      assert.ok(
        imagePart.headers['content-disposition'].includes('creation-date'),
        'expected the folded continuation line to be joined onto the ' +
          'content-disposition value'
      );
    });
  });

  describe('engine construction from configured extensions', () => {
    it('should pass configured enabledExtensions through to the engine', () => {
      // NOTE: this documents a latent configuration trap, not a live defect.
      // The engine built here is currently DEAD CODE: processMessage()
      // constructs a fresh SieveFilterHandler and executes scripts through
      // *its* engine, which is built by createEngine() with a correctly-keyed
      // `capabilities` option. SieveIntegration's `this.engine` is assigned in
      // the constructor and never read again.
      //
      // The mismatch is still worth fixing, because anyone who later wires
      // `this.engine` up will silently get none of the configured extensions:
      // the constructor passes `extensions:` while SieveEngine's constructor
      // reads only `options.capabilities`, so the configured list is dropped
      // and capabilities fall back to the bare DEFAULT_CAPABILITIES set.
      const integration = new SieveIntegration({});
      assert.ok(
        integration.config.enabledExtensions.includes('mime'),
        'precondition: mime is in the default enabledExtensions list'
      );

      assert.ok(
        integration.engine.capabilities.has('mime'),
        'expected the engine to receive the configured enabledExtensions, but ' +
          'SieveIntegration passes them as `extensions` while SieveEngine ' +
          'reads only `capabilities`, so the list is silently discarded'
      );
    });
  });
});
