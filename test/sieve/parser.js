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
