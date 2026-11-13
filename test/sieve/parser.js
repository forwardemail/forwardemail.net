/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Parser Tests
 */

const process = require('node:process');
const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  parse,
  validate,
  getRequiredCapabilities,
  requiresCapability
} = require('../../helpers/sieve/parser');

describe('Sieve Parser', () => {
  describe('Basic parsing', () => {
    it('should parse empty script', () => {
      const ast = parse('');
      assert.strictEqual(ast.type, 'Script');
      assert.deepStrictEqual(ast.commands, []);
    });

    it('should parse require statement', () => {
      const ast = parse('require "fileinto";');
      assert.strictEqual(ast.commands.length, 1);
      assert.strictEqual(ast.commands[0].type, 'Require');
      assert.deepStrictEqual(ast.commands[0].capabilities, ['fileinto']);
    });

    it('should parse multiple require capabilities', () => {
      const ast = parse('require ["fileinto", "vacation", "imap4flags"];');
      assert.strictEqual(ast.commands.length, 1);
      assert.deepStrictEqual(ast.commands[0].capabilities, [
        'fileinto',
        'vacation',
        'imap4flags'
      ]);
    });

    it('should parse keep action', () => {
      const ast = parse('keep;');
      assert.strictEqual(ast.commands.length, 1);
      assert.strictEqual(ast.commands[0].type, 'Keep');
    });

    it('should parse discard action', () => {
      const ast = parse('discard;');
      assert.strictEqual(ast.commands.length, 1);
      assert.strictEqual(ast.commands[0].type, 'Discard');
    });

    it('should parse stop action', () => {
      const ast = parse('stop;');
      assert.strictEqual(ast.commands.length, 1);
      assert.strictEqual(ast.commands[0].type, 'Stop');
    });

    it('should parse fileinto action', () => {
      const ast = parse('require "fileinto"; fileinto "INBOX.spam";');
      assert.strictEqual(ast.commands.length, 2);
      assert.strictEqual(ast.commands[1].type, 'Fileinto');
      assert.strictEqual(ast.commands[1].mailbox, 'INBOX.spam');
    });

    it('should parse fileinto with copy', () => {
      const ast = parse(
        'require ["fileinto", "copy"]; fileinto :copy "Archive";'
      );
      const fileinto = ast.commands[1];
      assert.strictEqual(fileinto.type, 'Fileinto');
      assert.strictEqual(fileinto.copy, true);
      assert.strictEqual(fileinto.mailbox, 'Archive');
    });

    it('should parse redirect action', () => {
      const ast = parse('redirect "user@example.com";');
      assert.strictEqual(ast.commands.length, 1);
      assert.strictEqual(ast.commands[0].type, 'Redirect');
      assert.strictEqual(ast.commands[0].address, 'user@example.com');
    });

    it('should parse redirect with copy', () => {
      const ast = parse('require "copy"; redirect :copy "backup@example.com";');
      const redirect = ast.commands[1];
      assert.strictEqual(redirect.type, 'Redirect');
      assert.strictEqual(redirect.copy, true);
    });

    it('should parse reject action', () => {
      const ast = parse('require "reject"; reject "Message rejected";');
      assert.strictEqual(ast.commands[1].type, 'Reject');
      assert.strictEqual(ast.commands[1].message, 'Message rejected');
    });
  });

  describe('If statements', () => {
    it('should parse simple if statement', () => {
      const script = `
        if header :contains "subject" "test" {
          discard;
        }
      `;
      const ast = parse(script);
      assert.strictEqual(ast.commands.length, 1);
      assert.strictEqual(ast.commands[0].type, 'If');
      assert.strictEqual(ast.commands[0].test.type, 'HeaderTest');
      assert.strictEqual(ast.commands[0].block.length, 1);
    });

    it('should parse if-elsif-else statement', () => {
      const script = `
        if header :is "from" "boss@example.com" {
          fileinto "Important";
        } elsif header :is "from" "spam@example.com" {
          discard;
        } else {
          keep;
        }
      `;
      const ast = parse(script);
      const ifCmd = ast.commands[0];
      assert.strictEqual(ifCmd.type, 'If');
      assert.strictEqual(ifCmd.elsif.length, 1);
      assert.ok(ifCmd.else);
    });
  });

  describe('Test parsing', () => {
    it('should parse header test with :is', () => {
      const script = 'if header :is "subject" "Hello" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'HeaderTest');
      assert.strictEqual(test.matchType, 'is');
      assert.deepStrictEqual(test.headers, ['subject']);
      assert.deepStrictEqual(test.keys, ['Hello']);
    });

    it('should parse header test with :contains', () => {
      const script = 'if header :contains "subject" "urgent" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.matchType, 'contains');
    });

    it('should parse header test with :matches', () => {
      const script = 'if header :matches "subject" "*urgent*" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.matchType, 'matches');
    });

    it('should parse address test', () => {
      const script = 'if address :domain :is "from" "example.com" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'AddressTest');
      assert.strictEqual(test.addressPart, 'domain');
      assert.deepStrictEqual(test.headers, ['from']);
    });

    it('should parse envelope test', () => {
      const script =
        'require "envelope"; if envelope :is "from" "sender@example.com" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[1];
      assert.strictEqual(test.type, 'EnvelopeTest');
    });

    it('should parse size test :over', () => {
      const script = 'if size :over 100K { discard; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'SizeTest');
      assert.strictEqual(test.over, 102400);
    });

    it('should parse size test :under', () => {
      const script = 'if size :under 1M { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.under, 1048576);
    });

    it('should parse exists test', () => {
      const script = 'if exists "X-Custom-Header" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'ExistsTest');
      assert.deepStrictEqual(test.headers, ['X-Custom-Header']);
    });

    it('should parse allof test', () => {
      const script = `
        if allof (
          header :contains "subject" "test",
          size :under 100K
        ) {
          keep;
        }
      `;
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'AllofTest');
      assert.strictEqual(test.tests.length, 2);
    });

    it('should parse anyof test', () => {
      const script = `
        if anyof (
          header :is "from" "user1@example.com",
          header :is "from" "user2@example.com"
        ) {
          keep;
        }
      `;
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'AnyofTest');
      assert.strictEqual(test.tests.length, 2);
    });

    it('should parse not test', () => {
      const script = 'if not header :contains "subject" "spam" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.type, 'NotTest');
      assert.strictEqual(test.test.type, 'HeaderTest');
    });

    it('should parse true test', () => {
      const script = 'if true { keep; }';
      const ast = parse(script);
      assert.strictEqual(ast.commands[0].test.type, 'TrueTest');
    });

    it('should parse false test', () => {
      const script = 'if false { discard; }';
      const ast = parse(script);
      assert.strictEqual(ast.commands[0].test.type, 'FalseTest');
    });
  });

  describe('Extension parsing', () => {
    it('should parse vacation action', () => {
      const script = `
        require "vacation";
        vacation :days 7 :subject "Out of Office" "I am on vacation.";
      `;
      const ast = parse(script);
      const vacation = ast.commands[1];
      assert.strictEqual(vacation.type, 'Vacation');
      assert.strictEqual(vacation.days, 7);
      assert.strictEqual(vacation.subject, 'Out of Office');
      assert.strictEqual(vacation.message, 'I am on vacation.');
    });

    it('should parse vacation with addresses', () => {
      const script = `
        require "vacation";
        vacation :addresses ["me@example.com", "alias@example.com"] "Away";
      `;
      const ast = parse(script);
      const vacation = ast.commands[1];
      assert.deepStrictEqual(vacation.addresses, [
        'me@example.com',
        'alias@example.com'
      ]);
    });

    it('should parse set command', () => {
      const script = `
        require "variables";
        set "greeting" "Hello";
      `;
      const ast = parse(script);
      const setCmd = ast.commands[1];
      assert.strictEqual(setCmd.type, 'Set');
      assert.strictEqual(setCmd.name, 'greeting');
      assert.strictEqual(setCmd.value, 'Hello');
    });

    it('should parse set with modifiers', () => {
      const script = `
        require "variables";
        set :lower "name" "JOHN";
      `;
      const ast = parse(script);
      const setCmd = ast.commands[1];
      assert.deepStrictEqual(setCmd.modifiers, ['lower']);
    });

    it('should parse setflag command', () => {
      const script = `
        require "imap4flags";
        setflag "\\\\Seen";
      `;
      const ast = parse(script);
      const setflag = ast.commands[1];
      assert.strictEqual(setflag.type, 'Setflag');
      assert.deepStrictEqual(setflag.flags, ['\\Seen']);
    });

    it('should parse addflag command', () => {
      const script = `
        require "imap4flags";
        addflag ["\\\\Flagged", "important"];
      `;
      const ast = parse(script);
      const addflag = ast.commands[1];
      assert.strictEqual(addflag.type, 'Addflag');
    });

    it('should parse hasflag test', () => {
      const script = `
        require "imap4flags";
        if hasflag "\\\\Flagged" { keep; }
      `;
      const ast = parse(script);
      const { test } = ast.commands[1];
      assert.strictEqual(test.type, 'HasflagTest');
    });

    it('should parse body test', () => {
      const script = `
        require "body";
        if body :contains "unsubscribe" { fileinto "Lists"; }
      `;
      const ast = parse(script);
      const { test } = ast.commands[1];
      assert.strictEqual(test.type, 'BodyTest');
      assert.strictEqual(test.bodyTransform, 'text');
    });

    it('should parse addheader command', () => {
      const script = `
        require "editheader";
        addheader "X-Processed" "true";
      `;
      const ast = parse(script);
      const addheader = ast.commands[1];
      assert.strictEqual(addheader.type, 'Addheader');
      assert.strictEqual(addheader.name, 'X-Processed');
      assert.strictEqual(addheader.value, 'true');
    });

    it('should parse deleteheader command', () => {
      const script = `
        require "editheader";
        deleteheader "X-Spam-Score";
      `;
      const ast = parse(script);
      const deleteheader = ast.commands[1];
      assert.strictEqual(deleteheader.type, 'Deleteheader');
      assert.strictEqual(deleteheader.name, 'X-Spam-Score');
    });
  });

  describe('Validation', () => {
    it('should validate valid script', () => {
      const result = validate('require "fileinto"; fileinto "Archive";');
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(result.errors, []);
    });

    it('should validate invalid script', () => {
      const result = validate('invalid syntax here');
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.length > 0);
    });
  });

  describe('Capability extraction', () => {
    it('should extract required capabilities', () => {
      const ast = parse(
        'require ["fileinto", "vacation"]; fileinto "Archive";'
      );
      const caps = getRequiredCapabilities(ast);
      assert.deepStrictEqual(caps, ['fileinto', 'vacation']);
    });

    it('should check for capability', () => {
      const ast = parse('require "vacation"; vacation "Away";');
      assert.strictEqual(requiresCapability(ast, 'vacation'), true);
      assert.strictEqual(requiresCapability(ast, 'fileinto'), false);
    });
  });

  describe('Comment handling', () => {
    it('should parse script with hash comments', () => {
      const script = `
        # This is a comment
        require "fileinto";
        # Another comment
        fileinto "Archive";
      `;
      const ast = parse(script);
      assert.strictEqual(ast.commands.length, 2);
    });

    it('should parse script with bracket comments', () => {
      const script = `
        /* Multi-line
           comment */
        require "fileinto";
        fileinto /* inline comment */ "Archive";
      `;
      const ast = parse(script);
      assert.strictEqual(ast.commands.length, 2);
    });
  });

  describe('String handling', () => {
    it('should parse escaped quotes in strings', () => {
      const script = 'reject "Message with \\"quotes\\"";';
      const ast = parse(script);
      assert.strictEqual(ast.commands[0].message, 'Message with "quotes"');
    });

    it('should parse string list', () => {
      const script =
        'if header :is ["from", "sender"] "test@example.com" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.deepStrictEqual(test.headers, ['from', 'sender']);
    });
  });

  describe('Comparator', () => {
    it('should parse comparator tag', () => {
      const script =
        'if header :comparator "i;octet" :is "subject" "Test" { keep; }';
      const ast = parse(script);
      const { test } = ast.commands[0];
      assert.strictEqual(test.comparator, 'i;octet');
    });
  });

  describe('Complex scripts', () => {
    it('should parse complex filtering script', () => {
      const script = `
        require ["fileinto", "vacation", "imap4flags"];

        # Vacation auto-reply
        vacation :days 7 :subject "Out of Office"
          "I am currently out of the office.";

        # Spam filtering
        if header :contains "X-Spam-Flag" "YES" {
          fileinto "Junk";
          stop;
        }

        # Mailing lists
        if exists "List-Id" {
          if header :contains "List-Id" "dev-list" {
            fileinto "Lists.Dev";
          } elsif header :contains "List-Id" "announce" {
            fileinto "Lists.Announce";
          } else {
            fileinto "Lists.Other";
          }
          stop;
        }

        # Important senders
        if address :domain :is "from" "company.com" {
          addflag "\\\\Flagged";
        }

        # Default: keep in inbox
        keep;
      `;

      const ast = parse(script);
      assert.strictEqual(ast.type, 'Script');
      assert.ok(ast.commands.length > 0);
    });
  });
});

describe('Sieve Parser - MIME Commands (RFC 5703)', () => {
  it('should parse foreverypart command', () => {
    const ast = parse('require "mime"; foreverypart { discard; }');
    const cmd = ast.commands.find((c) => c.type === 'Foreverypart');
    assert.ok(cmd);
    assert.ok(Array.isArray(cmd.block));
    assert.strictEqual(cmd.block[0].type, 'Discard');
  });

  it('should parse foreverypart with :name tag', () => {
    const ast = parse('require "mime"; foreverypart :name "loop1" { keep; }');
    const cmd = ast.commands.find((c) => c.type === 'Foreverypart');
    assert.ok(cmd);
    assert.strictEqual(cmd.name, 'loop1');
  });

  it('should parse break command', () => {
    const ast = parse('require "mime"; foreverypart { break; }');
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    assert.ok(fep);
    assert.strictEqual(fep.block[0].type, 'Break');
  });

  it('should parse break with :name tag', () => {
    const ast = parse(
      'require "mime"; foreverypart :name "x" { break :name "x"; }'
    );
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const brk = fep.block[0];
    assert.strictEqual(brk.type, 'Break');
    assert.strictEqual(brk.name, 'x');
  });

  it('should parse extracttext command', () => {
    const ast = parse(
      'require ["mime", "variables"]; foreverypart { extracttext "myvar"; }'
    );
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const ext = fep.block[0];
    assert.strictEqual(ext.type, 'Extracttext');
    assert.strictEqual(ext.name, 'myvar');
  });

  it('should parse extracttext with :first modifier', () => {
    const ast = parse(
      'require ["mime", "variables"]; foreverypart { extracttext :first 100 "myvar"; }'
    );
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const ext = fep.block[0];
    assert.strictEqual(ext.type, 'Extracttext');
    assert.strictEqual(ext.first, 100);
    assert.strictEqual(ext.name, 'myvar');
  });

  it('should parse replace command', () => {
    const ast = parse(
      'require "mime"; foreverypart { replace "new content"; }'
    );
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const rep = fep.block[0];
    assert.strictEqual(rep.type, 'Replace');
    assert.strictEqual(rep.replacement, 'new content');
  });

  it('should parse enclose command', () => {
    const ast = parse(
      'require "mime"; foreverypart { enclose :subject "Wrapped" "wrapper text"; }'
    );
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const enc = fep.block[0];
    assert.strictEqual(enc.type, 'Enclose');
    assert.strictEqual(enc.subject, 'Wrapped');
  });

  it('should parse header test with :mime tag', () => {
    const script =
      'require "mime"; foreverypart { if header :mime :contains "content-type" "text/html" { discard; } }';
    const ast = parse(script);
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    assert.ok(fep);
    const ifCmd = fep.block[0];
    assert.strictEqual(ifCmd.type, 'If');
    assert.ok(ifCmd.test.mime);
  });

  it('should parse exists test with :mime tag (RFC 5703 Section 4.3)', () => {
    const script =
      'require "mime"; foreverypart { if exists :mime "Content-ID" { discard; } }';

    // Currently throws:
    //   Sieve syntax error at line 1, column X: Expected "#", ")", ",",
    //   "/*", or [ \t\n\r] but "\"" found.
    // The grammar's `exists` rule lacks a `:mime` branch, even though
    // `header` (see 'should parse header test with :mime tag' above)
    // supports it. Per RFC 5703 4.3:
    //   Usage: exists [":mime"] [":anychild"] <header-names: string-list>
    const ast = parse(script);
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    assert.ok(fep);
    const ifCmd = fep.block[0];
    assert.strictEqual(ifCmd.type, 'If');
    assert.strictEqual(ifCmd.test.type, 'ExistsTest');
    assert.ok(
      ifCmd.test.mime,
      'expected exists test to accept :mime like header/address do'
    );
    assert.deepStrictEqual(ifCmd.test.headers, ['Content-ID']);
  });

  it('should parse header test with :type tag', () => {
    const script =
      'require "mime"; foreverypart { if header :mime :type :is "content-type" "text" { discard; } }';
    const ast = parse(script);
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const ifCmd = fep.block[0];
    assert.strictEqual(ifCmd.test.mimeType, 'type');
  });

  it('should parse header test with :subtype tag', () => {
    const script =
      'require "mime"; foreverypart { if header :mime :subtype :is "content-type" "html" { discard; } }';
    const ast = parse(script);
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const ifCmd = fep.block[0];
    assert.strictEqual(ifCmd.test.mimeType, 'subtype');
  });

  it('should parse header test with :param tag', () => {
    const script =
      'require "mime"; foreverypart { if header :mime :param "charset" :is "content-type" "utf-8" { discard; } }';
    const ast = parse(script);
    const fep = ast.commands.find((c) => c.type === 'Foreverypart');
    const ifCmd = fep.block[0];
    assert.ok(ifCmd.test.mimeParam);
    assert.deepStrictEqual(ifCmd.test.mimeParam, ['charset']);
  });

  it('should parse notify command (alias for enotify)', () => {
    const ast = parse(
      'require "notify"; notify :method "mailto:a@b.com" :message "hi";'
    );
    const cmd = ast.commands.find((c) => c.type === 'Notify');
    assert.ok(cmd);
    assert.strictEqual(cmd.method, 'mailto:a@b.com');
    assert.strictEqual(cmd.message, 'hi');
  });

  it('should parse header test with :index tag', () => {
    const script =
      'require "index"; if header :index 3 :contains "Received" "mx" { discard; }';
    const ast = parse(script);
    const ifCmd = ast.commands.find((c) => c.type === 'If');
    assert.strictEqual(ifCmd.test.index, 3);
    assert.strictEqual(ifCmd.test.last, false);
  });

  it('should parse header test with :index and :last tags', () => {
    const script =
      'require "index"; if header :index 1 :last :contains "ARC-Authentication-Results" "dmarc=pass" { keep; }';
    const ast = parse(script);
    const ifCmd = ast.commands.find((c) => c.type === 'If');
    assert.strictEqual(ifCmd.test.index, 1);
    assert.strictEqual(ifCmd.test.last, true);
    assert.strictEqual(ifCmd.test.matchType, 'contains');
  });

  it('should parse header test with :last before :index', () => {
    const script =
      'require "index"; if header :last :index 2 :is "Received" "test" { discard; }';
    const ast = parse(script);
    const ifCmd = ast.commands.find((c) => c.type === 'If');
    assert.strictEqual(ifCmd.test.index, 2);
    assert.strictEqual(ifCmd.test.last, true);
  });
});

/* eslint-disable no-template-curly-in-string */
describe('Sieve Parser - RFC conformance', () => {
  // the test of the first "if" of a script
  const testOf = (script) =>
    parse(script).commands.find((c) => c.type === 'If').test;
  const last = (script) => parse(script).commands.at(-1);

  describe('lexical rules (RFC 5228 section 2.4)', () => {
    it('drops the backslash of an undefined escape', () => {
      assert.deepStrictEqual(
        testOf('if header :contains "subject" "a\\qb\\.c" { keep; }').keys,
        ['aqb.c']
      );
    });

    it('ends a multi-line string only at a line holding a single "."', () => {
      const cmd = last('require "reject";\nreject text:\nHello.\nWorld\n.\n;');
      assert.strictEqual(cmd.message, 'Hello.\nWorld\n');
    });

    it('removes dot-stuffing from multi-line strings', () => {
      const cmd = last('require "reject";\nreject text:\n..line\n.foo\n.\n;');
      assert.strictEqual(cmd.message, '.line\n.foo\n');
    });

    it('keeps blank lines, indentation and "#" in multi-line strings', () => {
      const cmd = last(
        'require "reject";\nreject text: # comment\n\n  # not a comment\n.\n;'
      );
      assert.strictEqual(cmd.message, '\n  # not a comment\n');
    });

    it('accepts "text:" in any case', () => {
      assert.strictEqual(
        last('require "reject";\nreject TEXT:\nx\n.\n;').message,
        'x\n'
      );
    });

    it('rejects a bracket comment after "text:"', () => {
      assert.throws(
        () => parse('require "reject";\nreject text: /* c */\nx\n.\n;'),
        /Sieve syntax error/
      );
    });

    it('does not take a command name from the start of a longer word', () => {
      assert.throws(() => parse('iftrue { keep; }'), /Unknown command/);
    });

    it('rejects unknown tagged arguments instead of reading them as strings', () => {
      for (const script of [
        'if header :containz "subject" { keep; }',
        'require "fileinto"; fileinto :bogus;',
        'require "editheader"; deleteheader :bogus "X-A";'
      ]) {
        assert.throws(() => parse(script), /Sieve syntax error/, script);
      }
    });
  });

  describe('tagged arguments (RFC 5228 section 2.6)', () => {
    it('accepts tagged arguments in any order', () => {
      let test = testOf(
        'if address :is :domain "from" "example.com" { keep; }'
      );
      assert.strictEqual(test.addressPart, 'domain');
      assert.strictEqual(test.matchType, 'is');

      test = testOf(
        'if address :comparator "i;octet" :contains :localpart "from" "x" { keep; }'
      );
      assert.strictEqual(test.comparator, 'i;octet');
      assert.strictEqual(test.matchType, 'contains');
      assert.strictEqual(test.addressPart, 'localpart');

      test = testOf(
        'require "envelope"; if envelope :comparator "i;ascii-casemap" :all "from" "x" { keep; }'
      );
      assert.strictEqual(test.addressPart, 'all');

      assert.strictEqual(
        testOf('require "body"; if body :contains :raw "x" { keep; }')
          .bodyTransform,
        'raw'
      );
      assert.strictEqual(
        testOf(
          'require "date"; if date :is :zone "+0100" "date" "year" "2020" { keep; }'
        ).zone,
        '+0100'
      );
      assert.strictEqual(
        testOf(
          'require "date"; if currentdate :is :zone "+0100" "year" "2020" { keep; }'
        ).zone,
        '+0100'
      );
      assert.strictEqual(
        testOf(
          'require "environment"; if environment :comparator "i;octet" :is "domain" "x" { keep; }'
        ).comparator,
        'i;octet'
      );

      const fileinto = last(
        'require ["fileinto", "copy", "imap4flags", "mailbox"]; fileinto :flags "\\\\Seen" :create :copy "x";'
      );
      assert.deepStrictEqual(fileinto.flags, ['\\Seen']);
      assert.strictEqual(fileinto.copy, true);
      assert.strictEqual(fileinto.create, true);

      const deleteheader = last(
        'require "editheader"; deleteheader :comparator "i;octet" :contains "X-A" "v";'
      );
      assert.strictEqual(deleteheader.matchType, 'contains');
      assert.strictEqual(deleteheader.comparator, 'i;octet');
    });

    it('does not read a tag as the variable list of hasflag', () => {
      const test = testOf(
        'require "imap4flags"; if hasflag :comparator "i;ascii-casemap" :is "\\\\Seen" { keep; }'
      );
      assert.strictEqual(test.matchType, 'is');
      assert.strictEqual(test.variableName, null);
      assert.strictEqual(test.variables, null);
      assert.deepStrictEqual(test.flags, ['\\Seen']);

      const withVariables = testOf(
        'require ["imap4flags", "variables"]; if hasflag ["a", "b"] "\\\\Seen" { keep; }'
      );
      assert.deepStrictEqual(withVariables.variables, ['a', 'b']);
      assert.strictEqual(withVariables.variableName, 'a');
    });

    it('rejects repeated and conflicting tagged arguments when saved', () => {
      for (const script of [
        'if header :is :contains "subject" "x" { keep; }',
        'if header :comparator "i;octet" :comparator "i;octet" "subject" "x" { keep; }',
        'if address :all :domain "from" "x" { keep; }',
        'require "vacation"; vacation :subject "a" :subject "b" "x";',
        // RFC 6131 section 2
        'require "vacation-seconds"; vacation :days 1 :seconds 3600 "x";',
        // RFC 5260 section 4.1
        'require "date"; if date :zone "+0100" :originalzone "date" "year" "2020" { keep; }',
        // RFC 7352 section 3
        'require "duplicate"; if duplicate :header "message-id" :uniqueid "x" { discard; }'
      ]) {
        assert.throws(
          () => parse(script, { strict: true }),
          /Duplicate or conflicting tagged argument/,
          script
        );
        // (a script saved before runs, the last tag winning)
        assert.doesNotThrow(() => parse(script), script);
      }

      assert.strictEqual(
        validate('require "vacation"; vacation :days 1 :days 2 "x";').valid,
        false
      );
      const vacation = last(
        'require "vacation-seconds"; vacation :days 1 :seconds 3600 "x";'
      );
      assert.strictEqual(vacation.seconds, 3600);
    });
  });

  // (a require after other commands, or in a block, is refused when saved;
  // a script saved before this was checked still runs, the require a no-op
  // where it is, as every top-level one is read first)
  describe('require (RFC 5228 section 3.2)', () => {
    it('refuses require after another command or inside a block when saved', () => {
      for (const script of [
        'keep;\nrequire "fileinto";\nfileinto "x";',
        'if true { require "fileinto"; }',
        'keep; require "fileinto"; fileinto "A";',
        'if true { require "vnd.dovecot.pipe"; } keep;',
        'if true { require ["include"]; keep; }'
      ]) {
        assert.strictEqual(validate(script).valid, false, script);
        assert.throws(() => parse(script, { strict: true }), /require/, script);
        assert.ok(parse(script), script);
      }

      assert.strictEqual(
        validate('require "fileinto";\nrequire ["variables"];\nkeep;').valid,
        true
      );
    });
  });

  describe('index (RFC 5260 section 6)', () => {
    it('parses :index and :last on address and date', () => {
      const address = testOf(
        'require "index"; if address :index 2 :last "from" "a@b.c" { keep; }'
      );
      assert.strictEqual(address.index, 2);
      assert.strictEqual(address.last, true);

      const date = testOf(
        'require ["date", "relational", "index"];\nif date :value "gt" :index 2 :zone "-0500" "received" "iso8601" "2007-02-26T09:00:00-05:00" { keep; }'
      );
      assert.strictEqual(date.index, 2);
      assert.strictEqual(date.last, false);
      assert.strictEqual(date.zone, '-0500');
      assert.deepStrictEqual(date.matchType, { type: 'value', operator: 'gt' });
    });

    it('rejects :last without :index and an :index of 0 when saved', () => {
      assert.throws(
        () =>
          parse('require "index"; if header :last "received" "x" { keep; }', {
            strict: true
          }),
        /:last requires :index/
      );
      // (ignored in a script saved before)
      assert.strictEqual(
        testOf('require "index"; if header :last "received" "x" { keep; }')
          .last,
        true
      );
      assert.throws(
        () =>
          parse(
            'require "index"; if header :index 0 "received" "x" { keep; }',
            {
              strict: true
            }
          ),
        /:index must be 1 or more/
      );
    });
  });

  describe('editheader (RFC 5293)', () => {
    it('parses deleteheader :index with :last', () => {
      const cmd = last(
        'require "editheader"; deleteheader :index 1 :last "X-A";'
      );
      assert.strictEqual(cmd.index, 1);
      assert.strictEqual(cmd.last, true);
      assert.strictEqual(cmd.name, 'X-A');
      assert.deepStrictEqual(cmd.values, []);
    });

    it('rejects deleteheader :last without :index when saved', () => {
      assert.throws(
        () =>
          parse('require "editheader"; deleteheader :last "X-A";', {
            strict: true
          }),
        /:last requires :index/
      );
    });
  });

  describe('variables (RFC 5229)', () => {
    it('parses :lowerfirst and :upperfirst', () => {
      assert.deepStrictEqual(
        last('require "variables"; set :lowerfirst "a" "ABC";').modifiers,
        ['lowerfirst']
      );
      assert.deepStrictEqual(
        last('require "variables"; set :upperfirst "a" "abc";').modifiers,
        ['upperfirst']
      );
    });

    it('orders modifiers by precedence', () => {
      assert.deepStrictEqual(
        last('require "variables"; set :upperfirst :lower "b" "juMBlEd";')
          .modifiers,
        ['lower', 'upperfirst']
      );
      assert.deepStrictEqual(
        last(
          'require ["variables", "enotify"]; set :length :encodeurl :quotewildcard "b" "a*";'
        ).modifiers,
        ['quotewildcard', 'encodeurl', 'length']
      );
    });

    it('rejects two modifiers of the same precedence when saved', () => {
      assert.throws(
        () =>
          parse('require "variables"; set :lower :upper "b" "x";', {
            strict: true
          }),
        /Duplicate or conflicting tagged argument/
      );
      assert.deepStrictEqual(
        last('require "variables"; set :lower :upper "b" "x";').modifiers,
        ['lower', 'upper']
      );
    });

    it('rejects names that are not identifiers when saved', () => {
      for (const name of ['1', 'a-b', 'ns.x', '${a}', '']) {
        assert.throws(
          () =>
            parse(`require "variables"; set "${name}" "x";`, { strict: true }),
          /Invalid variable name/,
          name
        );
        assert.strictEqual(
          validate(`require "variables"; set "${name}" "x";`).valid,
          false,
          name
        );
        // (a script saved before names were checked still runs)
        assert.doesNotThrow(
          () => parse(`require "variables"; set "${name}" "x";`),
          name
        );
      }
    });
  });

  describe('encoded-character (RFC 5228 section 2.4.2.4)', () => {
    const keysOf = (value) =>
      testOf(
        `require "encoded-character"; if header :contains "subject" "${value}" { keep; }`
      ).keys[0];

    it('decodes hex and unicode encodings', () => {
      assert.strictEqual(keysOf('$${hex:24 24}'), '$$$');
      assert.strictEqual(keysOf('${hex: 40 }'), '@');
      assert.strictEqual(keysOf('${HEX: 40}'), '@');
      assert.strictEqual(keysOf('${hex:4${hex:30}}'), '${hex:40}');
      assert.strictEqual(keysOf('${unicode:40}'), '@');
      assert.strictEqual(keysOf('${UnICoDE:0000040}'), '@');
      assert.strictEqual(keysOf('${hex:C3 A9}${unicode:e9}'), 'éé');
    });

    it('leaves malformed encodings as they are', () => {
      for (const value of [
        '${hex:40',
        '${hex:400}',
        '${ unicode:40}',
        '${Unicode:Cool}',
        '${hex:}'
      ]) {
        assert.strictEqual(keysOf(value), value);
      }
    });

    it('rejects code points that are not Unicode scalar values', () => {
      for (const value of ['${unicode:200000}', '${Unicode:DF01}']) {
        assert.throws(() => keysOf(value), /Invalid Unicode value/, value);
      }
    });

    it('checks the names of variables after decoding', () => {
      const cmd = last(
        'require ["encoded-character", "variables"]; set "${hex:61}" "x";'
      );
      assert.strictEqual(cmd.name, 'a');
      assert.throws(
        () =>
          parse(
            'require ["encoded-character", "variables"]; set "${hex:2d}" "x";',
            { strict: true }
          ),
        /Invalid variable name: "-"/
      );
      assert.strictEqual(
        last(
          'require ["encoded-character", "mime", "variables"]; foreverypart { extracttext "${unicode:62}"; }'
        ).block[0].name,
        'b'
      );
    });

    it('leaves encodings literal without require', () => {
      assert.deepStrictEqual(
        testOf('if header :contains "subject" "${hex:40}" { keep; }').keys,
        ['${hex:40}']
      );
    });
  });

  describe('relational (RFC 5231)', () => {
    it('accepts relational operators in any case', () => {
      assert.deepStrictEqual(
        testOf('require "relational"; if header :value "GT" "x" "5" { keep; }')
          .matchType,
        { type: 'value', operator: 'gt' }
      );
    });
  });

  describe('MIME (RFC 5703)', () => {
    it('parses :mime and :anychild on address', () => {
      const test = testOf(
        'require "mime"; if address :mime :anychild :all "from" "a@b.c" { keep; }'
      );
      assert.strictEqual(test.mime, true);
      assert.strictEqual(test.anychild, true);
    });

    it('parses a :param list', () => {
      assert.deepStrictEqual(
        testOf(
          'require "mime"; if header :mime :param ["charset", "name"] "content-type" "x" { keep; }'
        ).mimeParam,
        ['charset', 'name']
      );
    });

    it('rejects :anychild without :mime when saved', () => {
      for (const script of [
        'require "mime"; if header :anychild "content-type" "x" { keep; }',
        'require "mime"; if exists :anychild "x" { keep; }'
      ]) {
        assert.throws(
          () => parse(script, { strict: true }),
          /:anychild requires :mime/,
          script
        );
        assert.doesNotThrow(() => parse(script), script);
      }
    });

    it('parses extracttext modifiers', () => {
      const cmd = last(
        'require ["mime", "variables"]; foreverypart { extracttext :first 5 :upper "x"; }'
      ).block[0];
      assert.deepStrictEqual(cmd.modifiers, ['upper']);
      assert.strictEqual(cmd.first, 5);
    });

    it('rejects break and extracttext outside a matching foreverypart', () => {
      for (const script of [
        'require "mime"; break;',
        'require "mime"; foreverypart :name "a" { break :name "b"; }',
        'require ["mime", "variables"]; extracttext "x";'
      ]) {
        assert.throws(
          () => parse(script),
          /outside of foreverypart|no enclosing foreverypart/,
          script
        );
      }

      assert.doesNotThrow(() =>
        parse(
          'require "mime"; foreverypart :name "a" { foreverypart { break :name "a"; } }'
        )
      );
    });
  });

  describe('enotify (RFC 5435)', () => {
    it('takes the method as a positional argument', () => {
      const cmd = last(
        'require "enotify"; notify :importance "1" :message "hi" "mailto:a@b.c";'
      );
      assert.strictEqual(cmd.method, 'mailto:a@b.c');
      assert.strictEqual(cmd.importance, '1');
      assert.strictEqual(cmd.message, 'hi');
    });

    it('rejects a missing method and an invalid importance when saved', () => {
      assert.throws(
        () =>
          parse('require "enotify"; notify :message "x";', { strict: true }),
        /notify requires a method/
      );
      assert.throws(
        () =>
          parse('require "enotify"; notify :importance "9" "mailto:a@b.c";', {
            strict: true
          }),
        /:importance must be/
      );
      // (a script saved before runs, see engine.js)
      assert.strictEqual(
        last('require "enotify"; notify :message "x";').method,
        null
      );
    });

    it('reads the importance words of draft versions', () => {
      for (const [word, number] of [
        ['high', '1'],
        ['Normal', '2'],
        ['low', '3']
      ]) {
        assert.strictEqual(
          last(
            `require "enotify"; notify :importance "${word}" "mailto:a@b.c";`
          ).importance,
          number
        );
        assert.strictEqual(
          validate(
            `require "enotify"; notify :importance "${word}" "mailto:a@b.c";`
          ).valid,
          true
        );
      }
    });

    it('parses valid_notify_method and notify_method_capability', () => {
      const valid = testOf(
        'require "enotify"; if valid_notify_method ["mailto:", "xmpp:"] { keep; }'
      );
      assert.strictEqual(valid.type, 'ValidNotifyMethodTest');
      assert.deepStrictEqual(valid.uris, ['mailto:', 'xmpp:']);

      const test = testOf(
        'require "enotify"; if notify_method_capability :contains "xmpp:a@b.c" "Online" "yes" { keep; }'
      );
      assert.strictEqual(test.type, 'NotifyMethodCapabilityTest');
      assert.strictEqual(test.uri, 'xmpp:a@b.c');
      assert.strictEqual(test.capability, 'Online');
      assert.strictEqual(test.matchType, 'contains');
      assert.deepStrictEqual(test.keys, ['yes']);
    });
  });

  describe('ihave (RFC 5463)', () => {
    it('parses unknown commands when ihave is required', () => {
      const ast = parse('require "ihave"; if ihave "foo" { foo :bar "x" 1; }');
      assert.deepStrictEqual(
        ast.commands[1].block.map((c) => [c.type, c.name]),
        [['UnknownCommand', 'foo']]
      );
    });

    it('rejects unknown commands without ihave', () => {
      assert.throws(() => parse('foo "bar";'), /Unknown command "foo"/);
    });

    it('parses unknown tests when ihave is required', () => {
      const ast = parse(
        'require "ihave"; if ihave "foo" { if anyof (not foo :bar "x" 2, baz ["a"] (true, false)) { keep; } }'
      );
      const { test } = ast.commands[1].block[0];
      assert.strictEqual(test.tests[0].test.type, 'UnknownTest');
      assert.strictEqual(test.tests[0].test.name, 'foo');
      assert.strictEqual(test.tests[1].type, 'UnknownTest');
      assert.strictEqual(test.tests[1].name, 'baz');
    });

    it('rejects unknown tests without ihave', () => {
      assert.throws(
        () => parse('if foo "bar" { keep; }'),
        /Unknown test "foo"/
      );
      // (a known test with bad arguments stays a syntax error)
      assert.throws(
        () => parse('require "ihave"; if header :bogus "a" "b" { keep; }'),
        /Sieve syntax error/
      );
    });

    it('parses the error command', () => {
      const cmd = last(
        'require "ihave"; if not ihave "foo" { error "need foo"; }'
      ).block[0];
      assert.strictEqual(cmd.type, 'Error');
      assert.strictEqual(cmd.message, 'need foo');
    });
  });

  describe('special-use (RFC 8579)', () => {
    it('parses specialuse_exists without a mailbox', () => {
      const test = testOf(
        'require "special-use"; if specialuse_exists "\\\\Junk" { keep; }'
      );
      assert.strictEqual(test.mailbox, null);
      assert.deepStrictEqual(test.attributes, ['\\Junk']);
    });

    it('parses specialuse_exists with a mailbox', () => {
      const test = testOf(
        'require "special-use"; if specialuse_exists "Spam" ["\\\\Junk"] { keep; }'
      );
      assert.strictEqual(test.mailbox, 'Spam');
      assert.deepStrictEqual(test.attributes, ['\\Junk']);
    });
  });
});
/* eslint-enable no-template-curly-in-string */

//
// A script is followed as deep as it goes: by the parser, which places each
// test by counting the lines before it (a few thousand "not" tests in a row,
// with comments between them, took seconds to parse), and by the engine when
// a message comes in (whose stack they overflowed).  So tests and blocks are
// only nested so deep, counted together.
//
describe('Sieve Parser - nesting', () => {
  // `levels` of tests around "true", and of blocks around "keep"
  const tests = (levels, open = 'anyof(', close = ')') =>
    `${open.repeat(levels)}true${close.repeat(levels)}`;
  const blocks = (levels, open = 'if true {') =>
    `${open.repeat(levels)} keep; ${'}'.repeat(levels)}`;
  const tooDeep = /Tests or blocks are nested too deep/;

  it('parses tests and blocks nested deeper than RFC 5228 asks for', () => {
    // (section 2.10.7: 15 levels of blocks and of lists of tests; here each
    // block is under 15 lists, and each list is negated)
    const ast = parse(blocks(15, `if ${tests(15, 'not anyof(')} {`));
    let command = ast.commands[0];
    for (let i = 1; i < 15; i++) command = command.block[0];
    assert.strictEqual(command.block[0].type, 'Keep');
    let { test } = command;
    for (let i = 0; i < 15; i++) {
      assert.strictEqual(test.type, 'NotTest');
      test = test.test.tests[0];
    }

    assert.strictEqual(test.type, 'TrueTest');
  });

  it('parses 64 levels and refuses more', () => {
    for (const [nested, most] of [
      // (a test of `levels` tests around "true")
      [(levels) => `if ${tests(levels)} { keep; }`, 63],
      [(levels) => `if ${tests(levels, 'not ', '')} { keep; }`, 63],
      [(levels) => blocks(levels), 64],
      [(levels) => blocks(levels, 'foreverypart {'), 64],
      // (what an unknown command or test holds is not kept, but is read)
      [(levels) => `require "ihave"; ${blocks(levels, 'x {')}`, 64],
      [(levels) => `require "ihave"; if ${tests(levels, 'x(')} { keep; }`, 63]
    ]) {
      assert.strictEqual(parse(nested(most)).type, 'Script');
      assert.throws(() => parse(nested(most + 1)), tooDeep);
    }
  });

  it('counts how deep, not how many', () => {
    const test = tests(60, 'not ', '');
    const ast = parse(
      `if anyof(${`${test}, `.repeat(50)}true) { ${blocks(60)} }\r\n`.repeat(5)
    );
    assert.strictEqual(ast.commands.length, 5);
    assert.strictEqual(ast.commands[4].test.tests.length, 51);
  });

  it('refuses a script nested deeper without following it', () => {
    // (as many as fit in a stored script, with comments between them)
    const script = `if ${'not /*xxxxxxxxxxxxxxxx*/ '.repeat(
      2500
    )}true { keep; }`;
    assert.ok(script.length < 65_536);
    const started = process.cpuUsage();
    assert.throws(() => parse(script), tooDeep);
    assert.ok(process.cpuUsage(started).user < 500_000);
    const result = validate(script);
    assert.strictEqual(result.valid, false);
    assert.match(result.errors[0].message, tooDeep);
  });
});
