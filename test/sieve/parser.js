/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Parser Tests
 */

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
    assert.strictEqual(ifCmd.test.mimeParam, 'charset');
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
