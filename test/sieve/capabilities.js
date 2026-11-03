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
const { validateScript } = require('../../helpers/sieve/validator');
const { SieveFilterHandler } = require('../../helpers/sieve/filter-handler');
const { ManageSieveServer } = require('../../helpers/sieve/managesieve-server');

describe('Sieve capability contract', () => {
  it('advertises only capabilities with executable delivery behavior', () => {
    assert.deepStrictEqual(SUPPORTED_CAPABILITIES, [
      'body',
      'comparator-i;ascii-casemap',
      'comparator-i;ascii-numeric',
      'comparator-i;octet',
      'copy',
      'date',
      'duplicate',
      'editheader',
      'encoded-character',
      'enotify',
      'envelope',
      'ereject',
      'environment',
      'extracttext',
      'fileinto',
      'foreverypart',
      'ihave',
      'imap4flags',
      'index',
      'mailbox',
      'mime',
      'redirect',
      'reject',
      'relational',
      'regex',
      'replace',
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
    assert.match(capabilities, /encoded-character/);
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

  it('requires the RFC 5703 capabilities for MIME commands', () => {
    const result = validateSieveCapabilities(
      parse('foreverypart { replace "Replacement text"; }')
    );

    assert.strictEqual(result.valid, false);
    assert.deepStrictEqual(result.required, ['foreverypart', 'replace']);
    assert.match(result.errors.join('\n'), /"foreverypart"/);
    assert.match(result.errors.join('\n'), /"replace"/);
  });

  it('accepts the RFC 5703 capability names and mime as an umbrella', () => {
    for (const script of [
      'require ["foreverypart", "replace"]; foreverypart { replace "x"; }',
      'require "mime"; foreverypart { replace "x"; }',
      'require ["foreverypart", "extracttext", "variables"]; foreverypart { extracttext "x"; }'
    ]) {
      assert.strictEqual(
        validateSieveCapabilities(parse(script)).valid,
        true,
        script
      );
    }
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

  it('accepts redirect without a require declaration', async () => {
    const script = 'redirect "recipient@example.com";';
    const result = validateSieveCapabilities(parse(script));

    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.required, []);

    const handler = new SieveFilterHandler({
      logger: { debug() {}, error() {}, info() {}, warn() {} }
    });
    const executed = await handler.executeScript(script, {
      body: '',
      headers: {},
      size: 0
    });
    assert.deepStrictEqual(executed.redirect, [
      { address: 'recipient@example.com', copy: false }
    ]);
  });

  it('still requires copy for redirect :copy', () => {
    const result = validateSieveCapabilities(
      parse('redirect :copy "recipient@example.com";')
    );

    assert.strictEqual(result.valid, false);
    assert.deepStrictEqual(result.required, ['copy']);
    assert.match(result.errors[0], /uses :copy but it is not declared/);
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
      'require ["mime"]; enclose "Forwarded message";',
      'require ["mboxmetadata"]; if metadata "INBOX" "/private/comment" "x" { keep; }',
      'if valid_ext_list "addrbook" { keep; }'
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

/* eslint-disable no-template-curly-in-string */
describe('Sieve capability checks (RFC conformance)', () => {
  const check = (script) => validateSieveCapabilities(parse(script));

  it('needs no require for redirect (RFC 5228 section 4.2)', () => {
    assert.strictEqual(check('redirect "a@example.com";').valid, true);
    // (still accepted for older scripts)
    assert.strictEqual(
      check('require "redirect"; redirect "a@example.com";').valid,
      true
    );
  });

  it('needs require only for comparators other than i;octet and i;ascii-casemap (RFC 5228 section 2.7.3)', () => {
    assert.strictEqual(
      check(
        'if header :comparator "i;octet" :contains "Subject" "MAKE MONEY FAST" { discard; }'
      ).valid,
      true
    );

    let result = check(
      'if header :comparator "i;ascii-numeric" "X-N" "1" { discard; }'
    );
    assert.strictEqual(result.valid, false);
    assert.match(result.errors.join('\n'), /comparator-i;ascii-numeric/);

    assert.strictEqual(
      check(
        'require "comparator-i;ascii-numeric"; if header :comparator "i;ascii-numeric" "X-N" "1" { discard; }'
      ).valid,
      true
    );

    result = check('if header :comparator "i;bogus" "X-N" "1" { discard; }');
    assert.strictEqual(result.valid, false);

    result = check(
      'require "editheader"; deleteheader :comparator "i;bogus" "X-A" "v";'
    );
    assert.strictEqual(result.valid, false);
  });

  it('does not need index for the :last of duplicate (RFC 7352)', () => {
    assert.strictEqual(
      check('require "duplicate"; if duplicate :last { discard; }').valid,
      true
    );
  });

  it('needs index for :index of header, address and date (RFC 5260)', () => {
    for (const script of [
      'if header :index 1 "received" "x" { keep; }',
      'if address :index 1 "from" "x" { keep; }',
      'require "date"; if date :index 1 "received" "year" "2020" { keep; }'
    ]) {
      assert.match(check(script).errors.join('\n'), /"index"/, script);
    }
  });

  it('needs subaddress for :user and :detail of envelope (RFC 5233)', () => {
    const result = check(
      'require "envelope"; if envelope :detail "to" "x" { keep; }'
    );
    assert.strictEqual(result.valid, false);
    assert.match(result.errors.join('\n'), /"subaddress"/);
  });

  it('accepts vacation-seconds alone for vacation (RFC 6131 section 2)', () => {
    assert.strictEqual(
      check('require "vacation-seconds"; vacation :seconds 60 "x";').valid,
      true
    );
  });

  it('accepts mailboxexists with the mailbox capability (RFC 5490)', () => {
    assert.strictEqual(
      check('require "mailbox"; if mailboxexists "Archive" { keep; }').valid,
      true
    );
    assert.strictEqual(
      check('if mailboxexists "Archive" { keep; }').valid,
      false
    );
  });

  it('needs enotify for its tests and for :encodeurl (RFC 5435)', () => {
    for (const script of [
      'if valid_notify_method "mailto:" { keep; }',
      'if notify_method_capability "xmpp:a@b.c" "online" "yes" { keep; }',
      'require "variables"; set :encodeurl "a" "b c";'
    ]) {
      assert.match(check(script).errors.join('\n'), /"enotify"/, script);
    }

    assert.strictEqual(
      check(
        'require ["enotify", "variables"]; set :encodeurl "a" "b c"; if valid_notify_method "mailto:" { notify "mailto:a@b.c"; }'
      ).valid,
      true
    );
  });

  it('treats only valid references as variables (RFC 5229 section 3)', () => {
    assert.strictEqual(
      check('if header :contains "subject" "${doh!} ${} ${a b}" { keep; }')
        .valid,
      true
    );
    assert.strictEqual(
      check('if header :contains "subject" "${a}" { keep; }').valid,
      false
    );
  });

  it('rejects references to unknown namespaces (RFC 5229 section 3)', () => {
    const result = check(
      'require "variables"; if string "${foo.bar}" "" { keep; }'
    );
    assert.strictEqual(result.valid, false);
    assert.match(result.errors.join('\n'), /unknown namespace/);
  });

  it('accepts encoded characters, which stay literal without require (RFC 5228 section 2.4.2.4)', () => {
    assert.strictEqual(
      check('if header :contains "subject" "${hex:24} ${unicode:40}" { keep; }')
        .valid,
      true
    );
    assert.strictEqual(
      check(
        'require "encoded-character"; if header :contains "Subject" "$${hex:24 24}" { discard; }'
      ).valid,
      true
    );
    // (a decoded reference is expanded, so it needs variables)
    assert.strictEqual(
      check(
        'require "encoded-character"; if header :contains "Subject" "${hex:24}{a}" { discard; }'
      ).valid,
      false
    );
  });

  describe('ihave (RFC 5463)', () => {
    it('leaves extensions tested with ihave to run time', () => {
      for (const script of [
        'require "ihave"; if ihave "fileinto" { fileinto "x"; }',
        'require "ihave"; if not ihave "fileinto" { error "no fileinto"; } fileinto "x";',
        'require "ihave"; if ihave "foo" { foo "bar"; }'
      ]) {
        assert.strictEqual(check(script).valid, true, script);
      }
    });

    it('allows unknown tests only after ihave', () => {
      assert.strictEqual(
        check('require "ihave"; if allof (ihave "foo", foo "x") { keep; }')
          .valid,
        true
      );
      const result = check(
        'require "ihave"; if foo "x" { keep; } if ihave "foo" { keep; }'
      );
      assert.strictEqual(result.valid, false);
      assert.match(result.errors.join('\n'), /"foo": unknown test/);
    });

    it('still checks extensions used before ihave', () => {
      const result = check(
        'require "ihave"; fileinto "x"; foo "bar"; if ihave "fileinto" { keep; }'
      );
      assert.strictEqual(result.valid, false);
      assert.match(result.errors.join('\n'), /"fileinto"/);
      assert.match(result.errors.join('\n'), /"foo": unknown command/);
    });

    it('does not let ihave enable variables or encoded-character', () => {
      assert.strictEqual(
        check('require "ihave"; if ihave "variables" { set "a" "b"; }').valid,
        false
      );
    });

    it('needs ihave for the error command', () => {
      const result = check('error "no";');
      assert.strictEqual(result.valid, false);
      assert.match(result.errors.join('\n'), /"ihave"/);
    });
  });
});
/* eslint-enable no-template-curly-in-string */

describe('Sieve validator recommendations', () => {
  it('finds "if true" rules and vacation settings in nested blocks', () => {
    const result = validateScript(
      'require ["vacation", "vacation-seconds"];\nif true { if header :is "x" "y" {} elsif true { vacation :seconds 60 "away"; } }'
    );
    const types = result.recommendations.map((rec) => rec.type);
    assert.ok(types.includes('broad_rules'), types.join(', '));
    assert.ok(types.includes('vacation_no_subject'), types.join(', '));
    assert.ok(types.includes('vacation_no_from'), types.join(', '));
    assert.ok(types.includes('vacation_short_interval'), types.join(', '));
  });

  // (a name of a property of objects is not a capability)
  it('rejects require "constructor" without throwing', () => {
    for (const name of ['constructor', '__proto__', 'toString']) {
      assert.strictEqual(
        validateSieveCapabilities(parse(`require "${name}";`)).valid,
        false
      );
    }
  });
});
