/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Runtime Enforcement Tests for Sieve Engine
 *
 * These tests verify that protectedHeaders and redirect domain restrictions
 * are enforced at runtime after variable interpolation, preventing bypass
 * attacks that evade static analysis (FWD-01-004, FWD-01-008).
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const { parse } = require(path.join(__dirname, '../../helpers/sieve/parser'));
const SieveEngine = require(path.join(__dirname, '../../helpers/sieve/engine'));

const PROTECTED_HEADERS = new Set([
  'from',
  'to',
  'cc',
  'subject',
  'date',
  'message-id',
  'received',
  'dkim-signature'
]);

async function executeScript(script, options = {}) {
  const ast = parse(script);
  const engine = new SieveEngine({
    protectedHeaders: PROTECTED_HEADERS,
    allowedRedirectDomains: options.allowedRedirectDomains || ['allowed.com'],
    redirectDomainBlacklist: options.redirectDomainBlacklist || ['evil.com'],
    ...options
  });
  return engine.execute(ast, {
    from: 'sender@test.com',
    to: 'user@test.com',
    headers: { from: 'sender@test.com', to: 'user@test.com', subject: 'Test' }
  });
}

describe('Sieve Runtime Enforcement - Protected Headers (FWD-01-004)', () => {
  it('blocks addheader with direct protected header name', async () => {
    const result = await executeScript(
      'require "editheader";\naddheader "From" "spoofed@evil.com";'
    );
    const hasAddheader = result.actions.some((a) => a.type === 'addheader');
    assert.strictEqual(
      hasAddheader,
      false,
      'addheader for protected header "From" should be blocked'
    );
  });

  it('blocks addheader via variable substitution bypass', async () => {
    const result = await executeScript(
      // eslint-disable-next-line no-template-curly-in-string
      'require ["variables", "editheader"];\nset "x" "from";\naddheader "${x}" "spoofed@evil.com";'
    );
    const hasAddheader = result.actions.some((a) => a.type === 'addheader');
    assert.strictEqual(
      hasAddheader,
      false,
      'addheader via variable bypass should be blocked'
    );
  });

  it('blocks deleteheader via variable substitution bypass', async () => {
    const result = await executeScript(
      // eslint-disable-next-line no-template-curly-in-string
      'require ["variables", "editheader"];\nset "x" "subject";\ndeleteheader "${x}";'
    );
    const hasDeleteheader = result.actions.some(
      (a) => a.type === 'deleteheader'
    );
    assert.strictEqual(
      hasDeleteheader,
      false,
      'deleteheader via variable bypass should be blocked'
    );
  });

  it('blocks addheader with case-insensitive protected header', async () => {
    const result = await executeScript(
      'require "editheader";\naddheader "DKIM-Signature" "forged";'
    );
    const hasAddheader = result.actions.some((a) => a.type === 'addheader');
    assert.strictEqual(
      hasAddheader,
      false,
      'addheader for "DKIM-Signature" should be blocked (case-insensitive)'
    );
  });

  it('allows addheader for non-protected headers', async () => {
    const result = await executeScript(
      'require "editheader";\naddheader "X-Custom-Header" "value";'
    );
    const hasAddheader = result.actions.some((a) => a.type === 'addheader');
    assert.strictEqual(
      hasAddheader,
      true,
      'addheader for non-protected header should be allowed'
    );
  });

  it('allows deleteheader for non-protected headers', async () => {
    const result = await executeScript(
      'require "editheader";\ndeleteheader "X-Spam-Score";'
    );
    const hasDeleteheader = result.actions.some(
      (a) => a.type === 'deleteheader'
    );
    assert.strictEqual(
      hasDeleteheader,
      true,
      'deleteheader for non-protected header should be allowed'
    );
  });
});

describe('Sieve Runtime Enforcement - Redirect Domain (FWD-01-008)', () => {
  it('blocks redirect to non-whitelisted domain', async () => {
    const result = await executeScript('redirect "attacker@evil.com";');
    const hasRedirect = result.actions.some((a) => a.type === 'redirect');
    assert.strictEqual(
      hasRedirect,
      false,
      'redirect to blacklisted domain should be blocked'
    );
  });

  it('blocks redirect via variable substitution bypass', async () => {
    const result = await executeScript(
      // eslint-disable-next-line no-template-curly-in-string
      'require "variables";\nset "x" "attacker@evil.com";\nredirect "${x}";'
    );
    const hasRedirect = result.actions.some((a) => a.type === 'redirect');
    assert.strictEqual(
      hasRedirect,
      false,
      'redirect via variable bypass to blacklisted domain should be blocked'
    );
  });

  it('allows redirect to whitelisted domain', async () => {
    const result = await executeScript('redirect "user@allowed.com";');
    const hasRedirect = result.actions.some((a) => a.type === 'redirect');
    assert.strictEqual(
      hasRedirect,
      true,
      'redirect to allowed domain should succeed'
    );
  });

  it('allows redirect when no domain restrictions configured', async () => {
    const result = await executeScript('redirect "anyone@anywhere.com";', {
      allowedRedirectDomains: null,
      redirectDomainBlacklist: null
    });
    const hasRedirect = result.actions.some((a) => a.type === 'redirect');
    assert.strictEqual(
      hasRedirect,
      true,
      'redirect should be allowed when no restrictions configured'
    );
  });
});
