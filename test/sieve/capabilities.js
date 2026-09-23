/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const assert = require('node:assert');
const { describe, it } = require('node:test');

const { parse } = require('../../helpers/sieve/parser');
const {
  SUPPORTED_CAPABILITIES,
  validateSieveCapabilities
} = require('../../helpers/sieve/capabilities');
const SieveEngine = require('../../helpers/sieve/engine');
const { SieveFilterHandler } = require('../../helpers/sieve/filter-handler');
const { ManageSieveServer } = require('../../helpers/sieve/managesieve-server');

describe('Sieve capability contract', () => {
  it('advertises only capabilities with executable delivery behavior', () => {
    assert.deepStrictEqual(SUPPORTED_CAPABILITIES, [
      'body',
      'comparator-i;ascii-casemap',
      'comparator-i;octet',
      'copy',
      'date',
      'duplicate',
      'editheader',
      'enotify',
      'envelope',
      'ereject',
      'environment',
      'fileinto',
      'ihave',
      'imap4flags',
      'index',
      'mailbox',
      'mime',
      'redirect',
      'reject',
      'relational',
      'regex',
      'special-use',
      'subaddress',
      'vacation',
      'vacation-seconds',
      'variables'
    ]);

    const server = new ManageSieveServer();
    const capabilities = server.getCapabilities().join('\n');
    assert.match(capabilities, /"SIEVE"/);
    assert.match(capabilities, /redirect/);
    assert.match(capabilities, /mailbox/);
    assert.doesNotMatch(capabilities, /enclose/);
    assert.doesNotMatch(capabilities, /encoded-character/);
  });

  it('requires each used capability to be declared explicitly', () => {
    const result = validateSieveCapabilities(
      parse('if body :contains "test" { fileinto "Inbox"; }')
    );

    assert.strictEqual(result.valid, false);
    assert.deepStrictEqual(result.required, ['body', 'fileinto']);
    assert.match(result.errors.join('\n'), /"body"/);
    assert.match(result.errors.join('\n'), /"fileinto"/);
  });

  it('requires the generic mime capability for MIME commands', () => {
    const result = validateSieveCapabilities(
      parse('foreverypart { replace "Replacement text"; }')
    );

    assert.strictEqual(result.valid, false);
    assert.deepStrictEqual(result.required, ['mime']);
    assert.match(result.errors.join('\n'), /"mime"/);
  });

  it('accepts declared, supported fileinto and body operations', () => {
    const result = validateSieveCapabilities(
      parse(
        'require ["body", "fileinto"]; if body :contains "test" { fileinto "Inbox"; }'
      )
    );

    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.required, ['body', 'fileinto']);
  });

  it('accepts the legacy notify declaration as the enotify capability', () => {
    const result = validateSieveCapabilities(
      parse('require ["notify"]; notify :method "mailto:user@example.com";')
    );

    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.declared, ['enotify']);
    assert.deepStrictEqual(result.required, ['enotify']);
  });

  it('returns an executable redirect result without queueing mail', async () => {
    const handler = new SieveFilterHandler({
      logger: { debug() {}, error() {}, info() {}, warn() {} }
    });
    const result = await handler.executeScript(
      'require ["copy", "redirect"]; redirect :copy "recipient@example.com";',
      { body: '', headers: {}, size: 0 }
    );

    assert.deepStrictEqual(result.redirect, [
      { address: 'recipient@example.com', copy: true }
    ]);
    assert.strictEqual(result.discard, false);
    assert.strictEqual(result.reject, null);
  });

  it('accepts special-use standard-folder checks', () => {
    const result = validateSieveCapabilities(
      parse(
        'require ["special-use"]; if specialuse_exists ["\\\\Archive"] { keep; }'
      )
    );

    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.required, ['special-use']);
  });

  it('rejects parsed features that have no end-to-end delivery implementation', () => {
    for (const script of [
      'require ["mailbox"]; if mailboxexists "Archive" { keep; }',
      'require ["mime"]; enclose "Forwarded message";',
      'require ["foreverypart", "mime", "replace"]; keep;',
      `require ["variables"]; set "value" "${String.fromCodePoint(
        36
      )}{hex:41}";`
    ]) {
      const result = validateSieveCapabilities(parse(script));
      assert.strictEqual(result.valid, false, script);
    }
  });

  it('does not make unavailable capabilities executable by engine options', async () => {
    const engine = new SieveEngine({ capabilities: ['enclose'] });
    assert.strictEqual(engine.hasCapability('enclose'), false);

    await assert.rejects(
      engine.execute(
        parse('require ["enclose"]; enclose "Forwarded message";'),
        {
          headers: {},
          body: '',
          size: 0
        }
      ),
      /Unsupported capability: enclose/
    );
  });
});
