/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const getAttributes = require('#helpers/get-attributes');
const config = require('#config');

// Mock headers object that mimics mailsplit headers
function createMockHeaders(replyToValue, fromValue = 'sender@example.com') {
  const lines = [`From: ${fromValue}`];
  if (replyToValue) lines.push(`Reply-To: ${replyToValue}`);
  lines.push(''); // trailing CRLF

  return {
    headers: Buffer.from(lines.join('\r\n')),
    _normalizeHeader(key) {
      return key.toLowerCase();
    },
    libmime: {
      decodeWords(str) {
        return str;
      }
    }
  };
}

// Minimal session object for non-aligned (isAligned=false) tests
function createMockSession(opts = {}) {
  return {
    resolvedClientHostname: opts.clientHostname || 'mail.example.com',
    resolvedRootClientHostname: opts.rootClientHostname || 'example.com',
    remoteAddress: opts.remoteAddress || '192.0.2.1',
    originalFromAddress: opts.fromAddress || 'sender@example.com',
    originalFromAddressDomain: opts.fromDomain || 'example.com',
    originalFromAddressRootDomain: opts.fromRootDomain || 'example.com',
    envelope: {
      mailFrom: {
        address: opts.mailFrom || 'sender@example.com'
      }
    }
  };
}

// Stub resolver (not used in non-aligned mode)
const stubResolver = { resolve() {} };

// =============================================================================
// Reserved TLD filtering in Reply-To
// =============================================================================

test('filters Reply-To with .invalid TLD (e.g. devnull@localhost.invalid)', async (t) => {
  const headers = createMockHeaders(
    '"DO NOT REPLY" <devnull@localhost.invalid>'
  );
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  // localhost.invalid should NOT appear in attributes
  t.false(attrs.some((a) => a.includes('invalid')));
  t.false(attrs.some((a) => a.includes('localhost.invalid')));
  t.false(attrs.some((a) => a.includes('devnull')));
});

test('filters Reply-To with .test TLD', async (t) => {
  const headers = createMockHeaders('noreply@something.test');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('.test')));
  t.false(attrs.some((a) => a.includes('something.test')));
});

test('filters Reply-To with .localhost TLD', async (t) => {
  const headers = createMockHeaders('test@app.localhost');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('localhost')));
});

test('filters Reply-To with .example TLD', async (t) => {
  const headers = createMockHeaders('user@mail.example');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  // .example TLD should be filtered; note example.com is a real domain (different from .example TLD)
  t.false(attrs.includes('mail.example'));
  t.false(attrs.includes('user@mail.example'));
});

test('filters Reply-To with .local TLD', async (t) => {
  const headers = createMockHeaders('admin@server.local');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('.local')));
});

test('filters Reply-To with .onion TLD', async (t) => {
  const headers = createMockHeaders('user@hidden.onion');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('.onion')));
});

test('filters Reply-To with .internal TLD', async (t) => {
  const headers = createMockHeaders('svc@app.internal');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('.internal')));
});

test('filters Reply-To with .alt TLD', async (t) => {
  const headers = createMockHeaders('user@something.alt');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('.alt')));
});

// =============================================================================
// Noreply domain filtering in Reply-To (existing behavior)
// =============================================================================

test('filters Reply-To with noreply.com domain', async (t) => {
  const headers = createMockHeaders('bounce@noreply.com');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('noreply.com')));
});

test('filters Reply-To with no-reply.net domain', async (t) => {
  const headers = createMockHeaders('bounce@no-reply.net');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.false(attrs.some((a) => a.includes('no-reply.net')));
});

// =============================================================================
// Legitimate Reply-To addresses should NOT be filtered
// =============================================================================

test('does NOT filter Reply-To with normal .com domain', async (t) => {
  const headers = createMockHeaders('support@company.com');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.true(attrs.includes('support@company.com'));
  t.true(attrs.includes('company.com'));
});

test('does NOT filter Reply-To with normal .org domain', async (t) => {
  const headers = createMockHeaders('admin@nonprofit.org');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.true(attrs.includes('admin@nonprofit.org'));
  t.true(attrs.includes('nonprofit.org'));
});

test('does NOT filter Reply-To with normal .net domain', async (t) => {
  const headers = createMockHeaders('info@service.net');
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  t.true(attrs.includes('info@service.net'));
  t.true(attrs.includes('service.net'));
});

// =============================================================================
// No Reply-To header at all
// =============================================================================

test('works when no Reply-To header is present', async (t) => {
  const headers = createMockHeaders(null);
  const session = createMockSession();
  const attrs = await getAttributes(headers, session, stubResolver);
  // Should still have session-level attributes
  t.true(attrs.includes('192.0.2.1'));
  t.true(attrs.includes('example.com'));
});

// =============================================================================
// config.testDomains coverage
// =============================================================================

test('config.testDomains includes all RFC 2606 reserved TLDs', (t) => {
  for (const tld of ['example', 'invalid', 'localhost', 'test']) {
    t.true(
      config.testDomains.includes(tld),
      `config.testDomains should include RFC 2606 TLD: ${tld}`
    );
  }
});

test('config.testDomains includes non-routable TLDs', (t) => {
  for (const tld of ['local', 'onion', 'internal', 'alt']) {
    t.true(
      config.testDomains.includes(tld),
      `config.testDomains should include non-routable TLD: ${tld}`
    );
  }
});
