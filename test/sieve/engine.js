/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Engine Tests
 */

const { Buffer } = require('node:buffer');
const { describe, it } = require('node:test');
const assert = require('node:assert');

const { parse } = require('../../helpers/sieve/parser');
const SieveEngine = require('../../helpers/sieve/engine');
const { SUPPORTED_CAPABILITIES } = require('../../helpers/sieve/capabilities');

// Helper to execute a script
async function executeScript(script, message, options = {}) {
  const ast = parse(script);
  const engine = new SieveEngine({
    capabilities: SUPPORTED_CAPABILITIES,
    ...options
  });
  return engine.execute(ast, message, options.context || {});
}

// Helper to create a test message
function createMessage(overrides = {}) {
  return {
    headers: {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      'content-type': 'text/plain',
      ...overrides.headers
    },
    envelope: {
      from: overrides.envelope?.from || 'sender@example.com',
      to: overrides.envelope?.to || 'recipient@example.com'
    },
    size: overrides.size > 0 ? overrides.size : 1024,
    body: overrides.body || 'This is the message body.',
    date: overrides.date || new Date()
  };
}

describe('Sieve Engine', () => {
  describe('Basic actions', () => {
    it('should execute keep action', async () => {
      const result = await executeScript('keep;', createMessage());
      assert.ok(result.actions.some((a) => a.type === 'keep'));
    });

    it('should execute discard action', async () => {
      const result = await executeScript('discard;', createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
      assert.ok(!result.actions.some((a) => a.type === 'keep'));
    });

    it('should execute stop action', async () => {
      const result = await executeScript('stop; discard;', createMessage());
      // Stop should prevent discard from executing
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });

    it('should execute fileinto action', async () => {
      const script = 'require "fileinto"; fileinto "Archive";';
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Archive');
    });

    it('should execute fileinto with copy', async () => {
      const script = 'require ["fileinto", "copy"]; fileinto :copy "Archive";';
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.copy, true);
      // With copy, implicit keep should still apply
      assert.ok(result.actions.some((a) => a.type === 'keep'));
    });

    it('should execute redirect action', async () => {
      const script = 'redirect "other@example.com";';
      const result = await executeScript(script, createMessage());
      const redirect = result.actions.find((a) => a.type === 'redirect');
      assert.ok(redirect);
      assert.strictEqual(redirect.address, 'other@example.com');
    });

    it('should execute reject action', async () => {
      const script = 'require "reject"; reject "Not accepted";';
      const result = await executeScript(script, createMessage());
      const reject = result.actions.find((a) => a.type === 'reject');
      assert.ok(reject);
      assert.strictEqual(reject.message, 'Not accepted');
    });
  });

  describe('Implicit keep', () => {
    it('should apply implicit keep when no action specified', async () => {
      const result = await executeScript('', createMessage());
      assert.ok(result.actions.some((a) => a.type === 'keep'));
    });

    it('should not apply implicit keep after discard', async () => {
      const result = await executeScript('discard;', createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'keep'));
    });

    it('should not apply implicit keep after fileinto without copy', async () => {
      const script = 'require "fileinto"; fileinto "Archive";';
      const result = await executeScript(script, createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'keep'));
    });
  });

  describe('Header tests', () => {
    it('should match header with :is', async () => {
      const script = `
        if header :is "subject" "Test Subject" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match header case insensitively by default', async () => {
      const script = `
        if header :is "subject" "test subject" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match header with :contains', async () => {
      const script = `
        if header :contains "subject" "Subject" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match header with :matches wildcards', async () => {
      const script = `
        if header :matches "subject" "Test*" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match header with multiple headers', async () => {
      const script = `
        if header :is ["from", "sender"] "sender@example.com" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match header with multiple keys', async () => {
      const script = `
        if header :is "from" ["user1@example.com", "sender@example.com"] {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
    it('should select first header with :index 1', async () => {
      const script = `
        require "index";
        if header :index 1 :contains "Received" "server1" {
          discard;
        }
      `;
      const message = createMessage({
        headers: {
          received: [
            'from server1 by mx1',
            'from server2 by mx2',
            'from server3 by mx3'
          ]
        }
      });
      const result = await executeScript(script, message);
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
    it('should select last header with :index 1 :last', async () => {
      const script = `
        require "index";
        if header :index 1 :last :contains "Received" "server3" {
          discard;
        }
      `;
      const message = createMessage({
        headers: {
          received: [
            'from server1 by mx1',
            'from server2 by mx2',
            'from server3 by mx3'
          ]
        }
      });
      const result = await executeScript(script, message);
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
    it('should NOT match when :index 1 :last does not contain value', async () => {
      const script = `
        require "index";
        if header :index 1 :last :contains "Received" "server1" {
          discard;
        }
      `;
      const message = createMessage({
        headers: {
          received: [
            'from server1 by mx1',
            'from server2 by mx2',
            'from server3 by mx3'
          ]
        }
      });
      const result = await executeScript(script, message);
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });
    it('should select second-to-last with :index 2 :last', async () => {
      const script = `
        require "index";
        if header :index 2 :last :contains "Received" "server2" {
          discard;
        }
      `;
      const message = createMessage({
        headers: {
          received: [
            'from server1 by mx1',
            'from server2 by mx2',
            'from server3 by mx3'
          ]
        }
      });
      const result = await executeScript(script, message);
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
    it('should return false when :index is out of range', async () => {
      const script = `
        require "index";
        if header :index 10 :contains "Received" "server" {
          discard;
        }
      `;
      const message = createMessage({
        headers: {
          received: ['from server1 by mx1', 'from server2 by mx2']
        }
      });
      const result = await executeScript(script, message);
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });
    it('should work with ARC-Authentication-Results and :index :last', async () => {
      const script = `
        require "index";
        if header :index 1 :last :contains "ARC-Authentication-Results" "dmarc=pass" {
          keep;
          stop;
        }
        if header :index 1 :contains "ARC-Authentication-Results" "dmarc=fail" {
          fileinto "Junk";
        }
      `;
      const message = createMessage({
        headers: {
          'arc-authentication-results': [
            'i=1; mx.microsoft.com; dmarc=fail action=none',
            'i=2; mx.forwardemail.net; dmarc=pass action=none'
          ]
        }
      });
      const result = await executeScript(script, message);
      // Last ARC header has dmarc=pass so keep+stop should trigger
      assert.ok(result.actions.some((a) => a.type === 'keep'));
      assert.ok(!result.actions.some((a) => a.type === 'fileinto'));
    });
    it('should work with single-value header and :index 1', async () => {
      const script = `
        require "index";
        if header :index 1 :contains "subject" "Test" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Address tests', () => {
    it('should match address with :all', async () => {
      const script = `
        if address :all :is "from" "sender@example.com" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match address with :localpart', async () => {
      const script = `
        if address :localpart :is "from" "sender" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match address with :domain', async () => {
      const script = `
        if address :domain :is "from" "example.com" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Envelope tests', () => {
    it('should match envelope from', async () => {
      const script = `
        require "envelope";
        if envelope :is "from" "sender@example.com" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Size tests', () => {
    it('should match size :over', async () => {
      const script = `
        if size :over 500 {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage({ size: 1024 }));
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match size :under', async () => {
      const script = `
        if size :under 2000 {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage({ size: 1024 }));
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should match size with K suffix', async () => {
      const script = `
        if size :over 1K {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage({ size: 2048 }));
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Exists tests', () => {
    it('should match existing header', async () => {
      const script = `
        if exists "subject" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should not match missing header', async () => {
      const script = `
        if exists "X-Missing-Header" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Boolean tests', () => {
    it('should always match true test', async () => {
      const script = `
        if true {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should never match false test', async () => {
      const script = `
        if false {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Logical tests', () => {
    it('should invert result with not test', async () => {
      const script = `
        if not header :is "subject" "Wrong Subject" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should require all conditions with allof', async () => {
      const script = `
        if allof (
          header :contains "subject" "Test",
          size :under 2000
        ) {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should fail allof if any condition fails', async () => {
      const script = `
        if allof (
          header :contains "subject" "Test",
          size :over 10000
        ) {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });

    it('should match anyof if any condition matches', async () => {
      const script = `
        if anyof (
          header :is "subject" "Wrong",
          header :is "from" "sender@example.com"
        ) {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should fail anyof if all conditions fail', async () => {
      const script = `
        if anyof (
          header :is "subject" "Wrong",
          header :is "from" "wrong@example.com"
        ) {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('If-elsif-else', () => {
    it('should execute correct branch', async () => {
      const script = `
        require "fileinto";
        if header :is "from" "vip@example.com" {
          fileinto "VIP";
        } elsif header :is "from" "sender@example.com" {
          fileinto "Known";
        } else {
          fileinto "Unknown";
        }
      `;
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.strictEqual(fileinto.mailbox, 'Known');
    });

    it('should execute else when condition fails', async () => {
      const script = `
        require "fileinto";
        if header :is "from" "vip@example.com" {
          fileinto "VIP";
        } else {
          fileinto "Regular";
        }
      `;
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.strictEqual(fileinto.mailbox, 'Regular');
    });
  });

  // RFC 5051 (see `toUnicodeCasemap` in helpers/sieve/engine.js)
  describe('i;unicode-casemap comparator', () => {
    const engine = new SieveEngine({ capabilities: SUPPORTED_CAPABILITIES });
    const match = (
      value,
      key,
      matchType = 'is',
      comparator = 'i;unicode-casemap'
    ) => engine.matchString(value, key, matchType, comparator);

    it('ignores case, of accented and Greek letters too', () => {
      assert.ok(match('été', 'ÉTÉ'));
      assert.ok(match('Straße', 'STRASSE'));
      assert.ok(match('ΟΔΟΣ', 'οδος'));
      assert.ok(match('οδος', 'οδοσ'));
      assert.ok(match('Rapport été 2026', 'ÉTÉ', 'contains'));
      assert.ok(!match('été', 'ete'));
    });

    it('matches an accent written as one character or two', () => {
      assert.ok(match('café', 'CAFÉ'));
      assert.ok(match('café', 'caf?', 'matches'));
      assert.ok(match('café', 'caf?', 'matches'));
      assert.ok(match('가', '?', 'matches'));
    });

    it('keeps fullwidth "？", "＊" and "＼" in a :matches key literal', () => {
      assert.ok(match('ですか？', '*ですか？', 'matches'));
      assert.ok(!match('ですかX', '*ですか？', 'matches'));
      assert.ok(!match('aXb', 'a＊b', 'matches'));
      assert.ok(match('a＊b', 'a＊b', 'matches'));
    });

    it('reads the comparator name in any case (RFC 4790 section 3.1)', () => {
      assert.ok(match('Hello', 'HELLO', 'is', 'I;Unicode-Casemap'));
      assert.ok(match('Hello', 'HELLO', 'is', 'I;ASCII-CASEMAP'));
      assert.ok(!match('Hello', 'HELLO', 'is', 'I;OCTET'));
    });

    it('orders values case folded for relational tests', () => {
      assert.ok(match('apple', 'BANANA', { type: 'value', operator: 'lt' }));
      assert.ok(match('ÉTÉ', 'été', { type: 'value', operator: 'eq' }));
    });

    it('sets match variables when a value matches only once folded', async () => {
      const result = await executeScript(
        `require ["variables", "fileinto", "comparator-i;unicode-casemap"];
         if header :comparator "i;unicode-casemap" :matches "subject" "*STRASSE*" {
           fileinto "\${1}";
         }`,
        createMessage({ headers: { subject: 'An der Straße 1' } })
      );
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'AN DER ');
    });
  });

  describe('Variables extension', () => {
    it('should set and use variable', async () => {
      const script = `
        require ["variables", "fileinto"];
        set "folder" "Archive";
        fileinto "\${folder}";
      `;
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.strictEqual(fileinto.mailbox, 'Archive');
    });

    it('should apply :lower modifier', async () => {
      const script = `
        require "variables";
        set :lower "name" "JOHN";
      `;
      const result = await executeScript(script, createMessage());
      assert.strictEqual(result.variables.name, 'john');
    });

    it('should apply :upper modifier', async () => {
      const script = `
        require "variables";
        set :upper "name" "john";
      `;
      const result = await executeScript(script, createMessage());
      assert.strictEqual(result.variables.name, 'JOHN');
    });

    it('should apply :length modifier', async () => {
      const script = `
        require "variables";
        set :length "len" "hello";
      `;
      const result = await executeScript(script, createMessage());
      assert.strictEqual(result.variables.len, '5');
    });
  });

  describe('IMAP4 flags extension', () => {
    it('should set flags with setflag', async () => {
      const script = `
        require "imap4flags";
        setflag "\\\\Seen";
        keep;
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.flags.includes('\\Seen'));
    });

    it('should add flags with addflag', async () => {
      const script = `
        require "imap4flags";
        setflag "\\\\Seen";
        addflag "\\\\Flagged";
        keep;
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.flags.includes('\\Seen'));
      assert.ok(result.flags.includes('\\Flagged'));
    });

    it('should remove flags with removeflag', async () => {
      const script = `
        require "imap4flags";
        setflag ["\\\\Seen", "\\\\Flagged"];
        removeflag "\\\\Seen";
        keep;
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.flags.includes('\\Seen'));
      assert.ok(result.flags.includes('\\Flagged'));
    });

    it('should apply flags to fileinto', async () => {
      const script = `
        require ["fileinto", "imap4flags"];
        fileinto :flags "\\\\Seen" "Archive";
      `;
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.deepStrictEqual(fileinto.flags, ['\\Seen']);
    });
  });

  describe('Body extension', () => {
    it('should match body with :contains', async () => {
      const script = `
        require "body";
        if body :contains "message body" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should not match when content not found', async () => {
      const script = `
        require "body";
        if body :contains "not in body" {
          discard;
        }
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.actions.some((a) => a.type === 'discard'));
    });
  });

  describe('Vacation extension', () => {
    it('should record vacation action', async () => {
      const script = `
        require "vacation";
        vacation :days 7 :subject "Out of Office" "I am away.";
      `;
      const result = await executeScript(script, createMessage());
      const vacation = result.actions.find((a) => a.type === 'vacation');
      assert.ok(vacation);
      assert.strictEqual(vacation.days, 7);
      assert.strictEqual(vacation.subject, 'Out of Office');
      assert.strictEqual(vacation.message, 'I am away.');
    });
  });

  describe('Edit header extension', () => {
    it('should record addheader action', async () => {
      const script = `
        require "editheader";
        addheader "X-Processed" "true";
      `;
      const result = await executeScript(script, createMessage());
      const addheader = result.actions.find((a) => a.type === 'addheader');
      assert.ok(addheader);
      assert.strictEqual(addheader.name, 'X-Processed');
      assert.strictEqual(addheader.value, 'true');
    });

    it('should record deleteheader action', async () => {
      const script = `
        require "editheader";
        deleteheader "X-Spam-Score";
      `;
      const result = await executeScript(script, createMessage());
      const deleteheader = result.actions.find(
        (a) => a.type === 'deleteheader'
      );
      assert.ok(deleteheader);
      assert.strictEqual(deleteheader.name, 'X-Spam-Score');
    });
  });

  describe('Complex scripts', () => {
    it('should handle complex spam filtering script', async () => {
      const script = `
        require ["fileinto", "imap4flags"];

        # Check for spam
        if header :contains "X-Spam-Flag" "YES" {
          fileinto "Junk";
          stop;
        }

        # Check for mailing lists
        if exists "List-Id" {
          fileinto "Lists";
          stop;
        }

        # Mark messages from boss as important
        if address :is "from" "boss@example.com" {
          addflag "\\\\Flagged";
        }

        # Default: keep
        keep;
      `;

      const message = createMessage({
        headers: {
          from: 'boss@example.com',
          to: 'me@example.com',
          subject: 'Important'
        }
      });

      const result = await executeScript(script, message);
      assert.ok(result.actions.some((a) => a.type === 'keep'));
      assert.ok(result.flags.includes('\\Flagged'));
    });

    it('should handle nested if statements', async () => {
      const script = `
        require "fileinto";
        if header :contains "from" "example.com" {
          if header :contains "subject" "urgent" {
            fileinto "Urgent";
          } else {
            fileinto "Normal";
          }
        }
      `;

      const message = createMessage({
        headers: {
          from: 'user@example.com',
          subject: 'urgent request'
        }
      });

      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.strictEqual(fileinto.mailbox, 'Urgent');
    });
  });
});

describe('Core Sieve tests (RFC 5228 Section 5)', () => {
  describe('Handling incorrectly required core tests', () => {
    it('should accept "address" in require statement', async () => {
      // Per RFC 5228, "address" is a core test that doesn't need require
      // but some scripts incorrectly include it. We should accept it.
      const script = `
        require ["fileinto", "address"];
        if address :domain "from" "gmail.com" {
          fileinto "Gmail";
        }
      `;
      const message = createMessage({
        headers: { from: 'user@gmail.com' }
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Gmail');
    });

    it('should accept "header" in require statement', async () => {
      const script = `
        require ["fileinto", "header"];
        if header :contains "subject" "test" {
          fileinto "Test";
        }
      `;
      const message = createMessage({
        headers: { subject: 'This is a test message' }
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Test');
    });

    it('should accept "exists" in require statement', async () => {
      const script = `
        require ["fileinto", "exists"];
        if exists "X-Custom-Header" {
          fileinto "Custom";
        }
      `;
      const message = createMessage({
        headers: { 'x-custom-header': 'value' }
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Custom');
    });

    it('should accept "size" in require statement', async () => {
      const script = `
        require ["fileinto", "size"];
        if size :over 500 {
          fileinto "Large";
        }
      `;
      const message = createMessage({ size: 1024 });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Large');
    });

    it('should accept "true" in require statement', async () => {
      const script = `
        require ["fileinto", "true"];
        if true {
          fileinto "Always";
        }
      `;
      const result = await executeScript(script, createMessage());
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Always');
    });

    it('should accept "false" in require statement', async () => {
      const script = `
        require ["fileinto", "false"];
        if false {
          fileinto "Never";
        }
      `;
      const result = await executeScript(script, createMessage());
      // Should not fileinto since condition is false
      assert.ok(!result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should accept "not" in require statement', async () => {
      const script = `
        require ["fileinto", "not"];
        if not header :is "subject" "spam" {
          fileinto "NotSpam";
        }
      `;
      const message = createMessage({
        headers: { subject: 'Hello' }
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'NotSpam');
    });

    it('should accept "allof" in require statement', async () => {
      const script = `
        require ["fileinto", "allof"];
        if allof (
          header :contains "from" "example.com",
          header :contains "subject" "important"
        ) {
          fileinto "Important";
        }
      `;
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          subject: 'important message'
        }
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Important');
    });

    it('should accept "anyof" in require statement', async () => {
      const script = `
        require ["fileinto", "anyof"];
        if anyof (
          header :contains "from" "spam.com",
          header :contains "subject" "urgent"
        ) {
          fileinto "Flagged";
        }
      `;
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          subject: 'urgent request'
        }
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Flagged');
    });

    it('should accept multiple core tests in require statement', async () => {
      const script = `
        require ["fileinto", "address", "header", "exists", "size"];
        if allof (
          address :domain "from" "gmail.com",
          header :contains "subject" "test",
          exists "to",
          size :under 10000
        ) {
          fileinto "Matched";
        }
      `;
      const message = createMessage({
        headers: {
          from: 'user@gmail.com',
          to: 'me@example.com',
          subject: 'test message'
        },
        size: 1024
      });
      const result = await executeScript(script, message);
      const fileinto = result.actions.find((a) => a.type === 'fileinto');
      assert.ok(fileinto);
      assert.strictEqual(fileinto.mailbox, 'Matched');
    });
  });

  describe('User-reported issue: address :domain filter not working', () => {
    it('should correctly filter gmail.com messages with :domain', async () => {
      // This is the exact script from the user report
      const script = `
        require ["fileinto", "address"];

        if address :domain "from" "gmail.com"
        {
            fileinto "System";
            stop;
        }
      `;

      // Test with gmail.com sender
      const gmailMessage = createMessage({
        headers: { from: 'test@gmail.com' }
      });
      const gmailResult = await executeScript(script, gmailMessage);
      const gmailFileinto = gmailResult.actions.find(
        (a) => a.type === 'fileinto'
      );
      assert.ok(gmailFileinto, 'Gmail message should be filed');
      assert.strictEqual(
        gmailFileinto.mailbox,
        'System',
        'Gmail message should go to System folder'
      );

      // Test with non-gmail sender
      const otherMessage = createMessage({
        headers: { from: 'test@yahoo.com' }
      });
      const otherResult = await executeScript(script, otherMessage);
      const otherFileinto = otherResult.actions.find(
        (a) => a.type === 'fileinto'
      );
      assert.ok(
        !otherFileinto,
        'Non-Gmail message should not be filed to System'
      );
      assert.ok(
        otherResult.actions.some((a) => a.type === 'keep'),
        'Non-Gmail message should be kept in inbox'
      );
    });

    it('should handle various From header formats', async () => {
      const script = `
        require ["fileinto", "address"];
        if address :domain "from" "gmail.com" {
          fileinto "Gmail";
        }
      `;

      // Test bare email
      let result = await executeScript(
        script,
        createMessage({ headers: { from: 'user@gmail.com' } })
      );
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));

      // Test with display name
      result = await executeScript(
        script,
        createMessage({ headers: { from: 'John Doe <user@gmail.com>' } })
      );
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));

      // Test with quoted display name
      result = await executeScript(
        script,
        createMessage({ headers: { from: '"John Doe" <user@gmail.com>' } })
      );
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });
  });

  describe('Non-string header value handling (TypeError prevention)', () => {
    it('should handle null header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "subject" "test" {
          fileinto "Test";
        }
      `;

      // Test with null header value
      const message = createMessage({
        headers: { from: 'user@example.com', subject: null }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should not match
      assert.ok(!result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle undefined header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-custom" "value" {
          fileinto "Custom";
        }
      `;

      // Test with undefined header value (header doesn't exist)
      const message = createMessage({
        headers: { from: 'user@example.com' }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should not match
      assert.ok(!result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle numeric header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-priority" "1" {
          fileinto "Priority";
        }
      `;

      // Test with numeric header value (some parsers might return numbers)
      const message = createMessage({
        headers: { from: 'user@example.com', 'x-priority': 1 }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match since String(1) === '1'
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle object header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "from" "test" {
          fileinto "Test";
        }
      `;

      // Test with object header value (malformed parsed header)
      const message = createMessage({
        headers: { from: { address: 'test@example.com', name: 'Test' } }
      });
      const result = await executeScript(script, message);
      // Should not throw - object will be converted to string "[object Object]"
      // and should not match "test"
      assert.ok(!result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle array header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "received" "google" {
          fileinto "Google";
        }
      `;

      // Test with array header value (multiple Received headers)
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          received: ['from google.com', 'from example.com']
        }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match the first element
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle empty string header values', async () => {
      const script = `
        require ["fileinto"];
        if header :is "subject" "" {
          fileinto "NoSubject";
        }
      `;

      // Test with empty string header value
      const message = createMessage({
        headers: { from: 'user@example.com', subject: '' }
      });
      const result = await executeScript(script, message);
      // Should match empty string
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle boolean header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-spam" "true" {
          fileinto "Spam";
        }
      `;

      // Test with boolean header value
      const message = createMessage({
        headers: { from: 'user@example.com', 'x-spam': true }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match since String(true) === 'true'
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle Date object header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "date" "2024" {
          fileinto "Dated";
        }
      `;

      // Test with Date object header value (some parsers might return Date objects)
      const message = createMessage({
        headers: { from: 'user@example.com', date: new Date('2024-01-15') }
      });
      const result = await executeScript(script, message);
      // Should not throw - Date will be converted to string
      assert.ok(!result.error);
    });

    it('should handle nested object header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "from" "example" {
          fileinto "Nested";
        }
      `;

      // Test with nested object header value
      const message = createMessage({
        headers: {
          from: { address: 'test@example.com', parsed: { local: 'test' } }
        }
      });
      const result = await executeScript(script, message);
      // Should not throw - object will be converted to "[object Object]"
      assert.ok(!result.error);
    });

    it('should handle mixed array header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-mixed" "string" {
          fileinto "Mixed";
        }
      `;

      // Test with mixed array (strings, numbers, objects)
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          'x-mixed': ['string value', 123, { key: 'value' }, null, undefined]
        }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match the first string element
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle Symbol header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-symbol" "Symbol" {
          fileinto "Symbol";
        }
      `;

      // Test with Symbol header value (edge case)
      const message = createMessage({
        headers: { from: 'user@example.com', 'x-symbol': Symbol('test') }
      });
      const result = await executeScript(script, message);
      // Should not throw - Symbol will be converted to "Symbol(test)"
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle BigInt header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-bigint" "12345" {
          fileinto "BigInt";
        }
      `;

      // Test with BigInt header value
      const message = createMessage({
        headers: { from: 'user@example.com', 'x-bigint': BigInt(12345) }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match since String(BigInt(12345)) === '12345'
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle function header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-func" "test" {
          fileinto "Function";
        }
      `;

      // Test with function header value (extreme edge case)
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          'x-func'() {
            return 'test';
          }
        }
      });
      const result = await executeScript(script, message);
      // Should not throw - function will be converted to its string representation
      // The assertion is just that it doesn't throw, not that it matches
      assert.ok(!result.error);
    });

    it('should handle NaN header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-nan" "NaN" {
          fileinto "NaN";
        }
      `;

      // Test with NaN header value
      const message = createMessage({
        headers: { from: 'user@example.com', 'x-nan': Number.NaN }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match since String(NaN) === 'NaN'
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle Infinity header values without throwing TypeError', async () => {
      const script = `
        require ["fileinto"];
        if header :contains "x-inf" "Infinity" {
          fileinto "Infinity";
        }
      `;

      // Test with Infinity header value
      const message = createMessage({
        headers: { from: 'user@example.com', 'x-inf': Number.POSITIVE_INFINITY }
      });
      const result = await executeScript(script, message);
      // Should not throw, and should match since String(Infinity) === 'Infinity'
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });
  });

  describe('Variables extension with non-string values', () => {
    it('should handle set command with non-string interpolated values', async () => {
      const script = `
        require ["fileinto", "variables"];
        set "myvar" "test";
        if header :contains "subject" "\${myvar}" {
          fileinto "Variables";
        }
      `;

      const message = createMessage({
        headers: { from: 'user@example.com', subject: 'this is a test message' }
      });
      const result = await executeScript(script, message);
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });

    it('should handle set command modifiers without throwing TypeError', async () => {
      const script = `
        require ["fileinto", "variables"];
        set :lower "myvar" "TEST";
        if string :is "\${myvar}" "test" {
          fileinto "Lower";
        }
      `;

      const message = createMessage({
        headers: { from: 'user@example.com' }
      });
      const result = await executeScript(script, message);
      assert.ok(result.actions.some((a) => a.type === 'fileinto'));
    });
  });

  describe('Date test with non-string header values', () => {
    it('should handle date test with object header value', async () => {
      const script = `
        require ["fileinto", "date"];
        if date :is "date" "year" "2024" {
          fileinto "2024";
        }
      `;

      // Test with object header value that has a toString method
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          date: { toString: () => 'Mon, 15 Jan 2024 12:00:00 GMT' }
        }
      });
      const result = await executeScript(script, message);
      // Should not throw
      assert.ok(!result.error);
    });

    it('should handle date test with numeric timestamp header value', async () => {
      const script = `
        require ["fileinto", "date"];
        if date :is "date" "year" "2024" {
          fileinto "2024";
        }
      `;

      // Test with numeric timestamp
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          date: 1705320000000 // Jan 15, 2024
        }
      });
      const result = await executeScript(script, message);
      // Should not throw - number will be converted to string for Date parsing
      assert.ok(!result.error);
    });
  });

  describe('Duplicate test with non-string header values', () => {
    it('should handle duplicate test with object message-id', async () => {
      const script = `
        require ["fileinto", "duplicate"];
        if duplicate {
          fileinto "Duplicate";
        }
      `;

      // Test with object message-id
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          'message-id': { id: '<test@example.com>', raw: '<test@example.com>' }
        }
      });
      const result = await executeScript(script, message);
      // Should not throw
      assert.ok(!result.error);
    });

    it('should handle duplicate test with numeric message-id', async () => {
      const script = `
        require ["fileinto", "duplicate"];
        if duplicate {
          fileinto "Duplicate";
        }
      `;
      // Test with numeric message-id
      const message = createMessage({
        headers: {
          from: 'user@example.com',
          'message-id': 12345
        }
      });
      const result = await executeScript(script, message);
      // Should not throw
      assert.ok(!result.error);
    });
  });

  describe('Notify alias for enotify', () => {
    it('should accept require "notify" as alias for enotify', async () => {
      const script = `
        require "notify";
        notify :method "mailto:admin@example.com" :message "Alert";
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.error);
      const notify = result.actions.find((a) => a.type === 'notify');
      assert.ok(notify);
      assert.strictEqual(notify.method, 'mailto:admin@example.com');
    });

    it('should accept require "enotify" and produce notify action', async () => {
      const script = `
        require "enotify";
        notify :method "mailto:user@example.com" :message "Test";
      `;
      const result = await executeScript(script, createMessage());
      assert.ok(!result.error);
      const notify = result.actions.find((a) => a.type === 'notify');
      assert.ok(notify);
    });
  });

  describe('MIME tree manipulation (RFC 5703)', () => {
    // Helper to create a message with MIME parts
    function createMimeMessage(parts) {
      return {
        ...createMessage(),
        mimeParts: parts
      };
    }

    describe('foreverypart command', () => {
      it('should iterate over all MIME parts', async () => {
        const script = `
          require ["mime", "variables"];
          set "count" "0";
          foreverypart {
            set "count" "\${count}1";
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'Hello',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/html',
            headers: {},
            body: '<p>World</p>',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'image/png',
            headers: {},
            body: 'binary',
            encoding: 'base64',
            charset: false
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        // count should be "0111" (initial "0" + "1" for each of 3 parts)
        assert.strictEqual(result.variables.count, '0111');
      });

      it('should support :name tag for named loops', async () => {
        const script = `
          require ["mime", "variables"];
          set "x" "";
          foreverypart :name "outer" {
            set "x" "\${x}A";
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/plain',
            headers: {},
            body: 'b',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.x, 'AA');
      });

      it('should handle empty mimeParts gracefully', async () => {
        const script = `
          require ["mime", "variables"];
          set "x" "none";
          foreverypart {
            set "x" "found";
          }
        `;
        const message = createMimeMessage([]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.x, 'none');
      });

      it('should handle missing mimeParts (undefined)', async () => {
        const script = `
          require ["mime", "variables"];
          set "x" "none";
          foreverypart {
            set "x" "found";
          }
        `;
        const message = createMessage();
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.x, 'none');
      });
    });

    describe('break command', () => {
      it('should exit foreverypart loop early', async () => {
        const script = `
          require ["mime", "variables"];
          set "count" "0";
          foreverypart {
            set "count" "\${count}1";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/plain',
            headers: {},
            body: 'b',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/plain',
            headers: {},
            body: 'c',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        // Should only iterate once due to break
        assert.strictEqual(result.variables.count, '01');
      });

      it('should exit named loop with break :name', async () => {
        const script = `
          require ["mime", "variables"];
          set "x" "";
          foreverypart :name "outer" {
            set "x" "\${x}A";
            break :name "outer";
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/plain',
            headers: {},
            body: 'b',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.x, 'A');
      });
    });

    describe('extracttext command', () => {
      it('should extract text from text/plain part', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            extracttext "content";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'Hello World',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.content, 'Hello World');
      });

      it('should strip HTML tags from text/html parts', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            extracttext "content";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/html',
            headers: {},
            body: '<p>Hello <b>World</b></p>',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.content, 'Hello World');
      });

      it('should decode base64 content', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            extracttext "content";
            break;
          }
        `;
        // "Hello Base64" in base64
        const b64 = require('node:buffer')
          .Buffer.from('Hello Base64')
          .toString('base64');
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: b64,
            encoding: 'base64',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.content, 'Hello Base64');
      });

      it('should decode quoted-printable content', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            extracttext "content";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'Hello=20World=21',
            encoding: 'quoted-printable',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.content, 'Hello World!');
      });

      it('should limit output with :first N', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            extracttext :first 5 "content";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'Hello World',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.content, 'Hello');
      });

      it('should return empty string for non-text parts', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            extracttext "content";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'image/png',
            headers: {},
            body: 'binarydata',
            encoding: 'base64',
            charset: false
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.content, '');
      });
    });

    describe('replace command', () => {
      it('should produce replace action with part index', async () => {
        const script = `
          require ["mime", "variables"];
          foreverypart {
            replace "New content";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'Old content',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        const replace = result.actions.find((a) => a.type === 'replace');
        assert.ok(replace);
        assert.strictEqual(replace.partIndex, 0);
        assert.strictEqual(replace.replacement, 'New content');
      });
    });

    describe('enclose command', () => {
      it('should reject enclose because delivery is unavailable', async () => {
        const script = `
          require "mime";
          foreverypart {
            enclose :subject "Wrapped" "This message has been enclosed.";
            break;
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'content',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        await assert.rejects(
          executeScript(script, message),
          /Sieve enclose is not supported/
        );
      });
    });

    describe(':mime tag on header tests', () => {
      it('should test current part headers with :mime tag', async () => {
        const script = `
          require ["mime", "variables"];
          set "found" "no";
          foreverypart {
            if header :mime :contains "content-type" "text/html" {
              set "found" "yes";
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: { 'content-type': 'text/plain; charset=utf8' },
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/html',
            headers: { 'content-type': 'text/html; charset=utf8' },
            body: '<p>b</p>',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.found, 'yes');
      });

      it('should extract type with :type tag', async () => {
        const script = `
          require ["mime", "variables"];
          set "found" "no";
          foreverypart {
            if header :mime :type :is "content-type" "image" {
              set "found" "yes";
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: { 'content-type': 'text/plain' },
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'image/jpeg',
            headers: { 'content-type': 'image/jpeg' },
            body: 'binary',
            encoding: 'base64',
            charset: false
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.found, 'yes');
      });

      it('should extract subtype with :subtype tag', async () => {
        const script = `
          require ["mime", "variables"];
          set "found" "no";
          foreverypart {
            if header :mime :subtype :is "content-type" "html" {
              set "found" "yes";
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: { 'content-type': 'text/plain' },
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/html',
            headers: { 'content-type': 'text/html' },
            body: '<p>b</p>',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.found, 'yes');
      });

      it('should extract contenttype with :contenttype tag', async () => {
        const script = `
          require ["mime", "variables"];
          set "found" "no";
          foreverypart {
            if header :mime :contenttype :is "content-type" "text/html" {
              set "found" "yes";
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: { 'content-type': 'text/plain; charset=utf8' },
            body: 'a',
            encoding: '',
            charset: 'utf8'
          },
          {
            contentType: 'text/html',
            headers: { 'content-type': 'text/html; charset=utf8' },
            body: '<p>b</p>',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.found, 'yes');
      });

      it('should extract param with :param tag', async () => {
        const script = `
          require ["mime", "variables"];
          set "found" "no";
          foreverypart {
            if header :mime :param "charset" :is "content-type" "utf8" {
              set "found" "yes";
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: { 'content-type': 'text/plain; charset=utf8' },
            body: 'a',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        assert.strictEqual(result.variables.found, 'yes');
      });
    });

    describe('Security limits', () => {
      it('should enforce max parts iteration limit', async () => {
        const script = `
          require ["mime", "variables"];
          set "count" "0";
          foreverypart {
            set "count" "\${count}1";
          }
        `;
        // Create 150 parts (exceeds default limit of 100)
        const parts = Array.from({ length: 150 }, (_, i) => ({
          contentType: 'text/plain',
          headers: { 'content-type': 'text/plain' },
          body: `Part ${i}`,
          encoding: '',
          charset: 'utf8'
        }));
        const message = createMimeMessage(parts);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        // Should stop at 100 iterations
        assert.strictEqual(result.variables.count.length - 1, 100);
      });

      it('should enforce max foreverypart nesting depth', async () => {
        const script = `
          require ["mime", "variables"];
          set "depth" "0";
          foreverypart {
            set "depth" "1";
            foreverypart {
              set "depth" "2";
              foreverypart {
                set "depth" "3";
                foreverypart {
                  set "depth" "4";
                }
              }
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'text/plain',
            headers: {},
            body: 'a',
            encoding: '',
            charset: 'utf8'
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);
        // Depth 4 should not execute (max depth is 3)
        assert.strictEqual(result.variables.depth, '3');
      });
    });

    describe('header :mime structured access (RFC 5703 Section 4.1)', () => {
      // These tests use `discard` (not `keep`) as the observable action
      // inside the `if` block: Sieve applies an *implicit* keep whenever no
      // other terminating action ran, so asserting on a 'keep' action would
      // false-pass even if the condition never matched. `discard` only ever
      // appears if the condition actually evaluated true.
      it('should read :type from Content-Disposition when that header is requested, not Content-Type', async () => {
        const script = `
          require "mime";
          foreverypart {
            if header :mime :type :is "Content-Disposition" "inline" {
              discard;
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'image/png',
            headers: {
              'content-disposition': 'inline; filename="image.png"'
            },
            body: 'binarydata',
            encoding: 'base64',
            charset: false
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);

        // Content-Disposition is "inline", so per RFC 5703 4.1 :type on that
        // header should evaluate to "inline" and this test should match.
        // Currently getMimeStructuredValue() ignores the requested header
        // name and always parses `part.contentType` ("image/png") instead,
        // so :type evaluates to "image" and this never matches.
        assert.ok(
          result.actions.some((a) => a.type === 'discard'),
          'expected :type on "Content-Disposition" to read the disposition ' +
            '("inline"), but the engine always parses Content-Type regardless ' +
            'of which header was requested'
        );
      });

      it('should return blank (not Content-Type) for :type on a header that has no type/subtype concept', async () => {
        const script = `
          require "mime";
          foreverypart {
            if header :mime :type :is "Content-ID" "" {
              discard;
            }
          }
        `;
        const message = createMimeMessage([
          {
            contentType: 'image/png',
            headers: {
              'content-id': '<abc123@example.com>'
            },
            body: 'binarydata',
            encoding: 'base64',
            charset: false
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);

        // Per RFC 5703 4.1: "for other MIME headers, uses a blank string for
        // the test" - :type on Content-ID (which has no type/subtype) should
        // be "". Currently it evaluates to "image" (from part.contentType)
        // instead, so this never matches either.
        assert.ok(
          result.actions.some((a) => a.type === 'discard'),
          'expected :type on "Content-ID" to be blank per RFC 5703 4.1, but ' +
            'the engine returns the Content-Type major type instead'
        );
      });

      it('should read :param from Content-Disposition when that header is requested, not Content-Type', async () => {
        const script = `
          require "mime";
          foreverypart {
            if header :mime :param "filename" :matches "Content-Disposition" "image*.png" {
              discard;
            }
          }
        `;
        const message = createMimeMessage([
          {
            // Deliberately different filename in Content-Type's "name" vs.
            // Content-Disposition's "filename" param, so the test can only
            // pass if :param actually reads from Content-Disposition.
            contentType: 'image/png; name="not-this-one.txt"',
            headers: {
              'content-type': 'image/png; name="not-this-one.txt"',
              'content-disposition': 'inline; filename="image001.png"'
            },
            body: 'binarydata',
            encoding: 'base64',
            charset: false
          }
        ]);
        const result = await executeScript(script, message);
        assert.ok(!result.error);

        // getMimeStructuredValue()'s 'param' branch unconditionally reads
        // part.headers['content-type'], regardless of which header name was
        // passed to :param. So this currently fails to find "filename" on
        // Content-Disposition at all.
        assert.ok(
          result.actions.some((a) => a.type === 'discard'),
          'expected :param "filename" to read from the requested header ' +
            "(Content-Disposition), but the engine always reads Content-Type's " +
            'parameters instead'
        );
      });
    });
  });
});

describe('Sieve Engine - RFC conformance of tests and actions', () => {
  // the mailboxes a run files into, in order
  const filed = (result) =>
    result.actions.filter((a) => a.type === 'fileinto').map((a) => a.mailbox);

  it('counts header fields, addresses and strings for :count (RFC 5231)', async () => {
    const message = createMessage({
      headers: {
        to: 'a@example.com, b@example.com',
        cc: 'c@example.com',
        received: ['from a by b; Mon, 1 Jan 2024 00:00:00 +0000', 'from c'],
        subject: 'Hi'
      }
    });
    const result = await executeScript(
      `require ["relational", "comparator-i;ascii-numeric", "fileinto", "variables"];
      if address :count "ge" :comparator "i;ascii-numeric" ["to", "cc"] "3" { fileinto "ThreeAddresses"; }
      if address :count "ge" :comparator "i;ascii-numeric" "to" "3" { fileinto "WrongAddresses"; }
      if header :count "ge" :comparator "i;ascii-numeric" "received" "3" { fileinto "WrongFields"; }
      if header :count "ge" :comparator "i;ascii-numeric" ["received", "subject"] "3" { fileinto "ThreeFields"; }
      if header :count "eq" :comparator "i;ascii-numeric" "x-missing" "0" { fileinto "NoField"; }
      if string :count "eq" :comparator "i;ascii-numeric" ["a", "", "b"] "2" { fileinto "TwoStrings"; }`,
      message
    );
    assert.deepStrictEqual(filed(result), [
      'ThreeAddresses',
      'ThreeFields',
      'NoField',
      'TwoStrings'
    ]);
  });

  it('compares :value in the order of the comparator (RFC 4790, RFC 5231)', async () => {
    const message = createMessage({ headers: { 'x-n': '10' } });
    const result = await executeScript(
      `require ["relational", "comparator-i;ascii-numeric", "fileinto"];
      if header :value "gt" :comparator "i;ascii-numeric" "x-n" "9" { fileinto "Numeric"; }
      if header :value "gt" :comparator "i;ascii-casemap" "x-n" "9" { fileinto "Text"; }
      if header :value "gt" "x-n" "9" { fileinto "NoComparator"; }
      if header :is :comparator "i;ascii-numeric" "x-n" "010" { fileinto "Equal"; }
      if header :value "lt" :comparator "i;ascii-numeric" "x-n" "none" { fileinto "Infinity"; }`,
      message
    );
    // ("10" sorts before "9" as text; without a comparator written two
    // numbers compare as numbers, as they always have here)
    assert.deepStrictEqual(filed(result), [
      'Numeric',
      'NoComparator',
      'Equal',
      'Infinity'
    ]);
  });

  it('compares numbers past what a double holds by their digits with i;ascii-numeric (RFC 4790)', async () => {
    const result = await executeScript(
      `require ["relational", "comparator-i;ascii-numeric", "fileinto"];
      if header :value "gt" :comparator "i;ascii-numeric" "x-n" "99999999999999999998" { fileinto "Greater"; }
      if header :value "eq" :comparator "i;ascii-numeric" "x-n" "100000000000000000000" { fileinto "Equal"; }
      if header :value "gt" :comparator "i;ascii-numeric" "x-m" "9007199254740992" { fileinto "PastSafe"; }
      if header :value "lt" :comparator "i;ascii-numeric" "x-m" "99999999999999999999" { fileinto "Less"; }`,
      createMessage({
        headers: { 'x-n': '99999999999999999999', 'x-m': '9007199254740993' }
      })
    );
    assert.deepStrictEqual(filed(result), ['Greater', 'PastSafe', 'Less']);
  });

  //
  // Only two numbers both past what a double holds compare by their digits:
  // a value with a space, sign or dot before it compares as a number (it
  // has no digits first, and was put after every number)
  //
  it('compares a large number with a small or signed one as numbers', async () => {
    const cases = [
      [' 5', 'lt', '99999999999999999999', true],
      ['+5', 'lt', '99999999999999999999', true],
      ['-0', 'lt', '99999999999999999999', true],
      ['-5', 'lt', '99999999999999999999', true],
      ['.5', 'lt', '99999999999999999999', true],
      ['-99999999999999999999', 'lt', '5', true],
      ['99999999999999999999', 'gt', '-5', true],
      [' 100000000000000000000', 'eq', '100000000000000000000', true],
      ['100000000000000000000', 'eq', '+100000000000000000000', true],
      [' 99999999999999999999', 'eq', '99999999999999999999', true],
      ['+99999999999999999999', 'gt', '99999999999999999998', true],
      ['12345678901234567890.9', 'eq', '12345678901234567890', true],
      ['9007199254740993', 'gt', '9007199254740991.5', true],
      ['9007199254740993', 'gt', '5', true],
      ['abc', 'gt', '99999999999999999999', true],
      ['5', 'gt', '99999999999999999999', false],
      ['7.5', 'ge', '10', false]
    ];
    const result = await executeScript(
      [
        'require ["relational", "comparator-i;ascii-numeric", "variables", "fileinto"];',
        ...cases.map(
          ([value, operator, key], i) =>
            `set "v${i}" "${value}"; if string :value "${operator}" :comparator "i;ascii-numeric" "\${v${i}}" "${key}" { fileinto "${i}"; }`
        )
      ].join('\n'),
      createMessage()
    );
    assert.deepStrictEqual(
      filed(result),
      cases.flatMap((test, i) => (test[3] ? [String(i)] : []))
    );
  });

  //
  // Without a comparator written, two numbers of 309 digits or more are both
  // Infinity as doubles: they were neither equal nor in any order
  //
  it('compares two numbers too large for a double without a comparator', async () => {
    const nines = '9'.repeat(400);
    const cases = [
      [nines, 'eq', nines, true],
      [nines, 'ne', nines, false],
      [nines, 'gt', '9'.repeat(399), true],
      [`0${nines}`, 'eq', nines, true],
      [`1${nines}`, 'le', nines, false],
      [nines, 'gt', '5', true],
      [`-${nines}`, 'lt', `-${'9'.repeat(399)}`, true],
      [`-${nines}`, 'eq', `-${nines}`, true],
      [`-${nines}`, 'lt', nines, true]
    ];
    const result = await executeScript(
      [
        'require ["relational", "variables", "fileinto"];',
        ...cases.map(
          ([value, operator, key], i) =>
            `set "v${i}" "${value}"; if string :value "${operator}" "\${v${i}}" "${key}" { fileinto "${i}"; }`
        )
      ].join('\n'),
      createMessage()
    );
    assert.deepStrictEqual(
      filed(result),
      cases.flatMap((test, i) => (test[3] ? [String(i)] : []))
    );
  });

  it('sets match variables from :matches and :regex (RFC 5229)', async () => {
    const message = createMessage({
      headers: { subject: 'Mail from Bob Smith' }
    });
    const result = await executeScript(
      `require ["variables", "regex"];
      if header :matches "subject" "* from *" { set "who" "\${2}"; set "all" "\${0}"; set "none" "\${3}"; }
      if header :regex "subject" "^mail (from) (.*)$" { set "regex" "\${1}-\${2}"; }`,
      message
    );
    assert.strictEqual(result.variables.who, 'Bob Smith');
    assert.strictEqual(result.variables.all, 'Mail from Bob Smith');
    assert.strictEqual(result.variables.none, '');
    assert.strictEqual(result.variables.regex, 'from-Bob Smith');
  });

  it('reads a backslash in :matches as making the next character literal', async () => {
    const message = createMessage({
      headers: { subject: 'ad', 'x-a': 'a1', 'x-q': 'what?' },
      body: 'first line\nsecond line'
    });
    const result = await executeScript(
      `require ["fileinto", "body"];
      if header :matches "subject" "a\\\\d" { fileinto "Literal"; }
      if header :matches "x-a" "a\\\\d" { fileinto "Digit"; }
      if header :matches "x-q" "what\\\\?" { fileinto "Question"; }
      if body :matches "first*second*" { fileinto "Lines"; }`,
      message
    );
    assert.deepStrictEqual(filed(result), ['Literal', 'Question', 'Lines']);
  });

  it('matches :regex with the case of the comparator', async () => {
    const result = await executeScript(
      `require ["fileinto", "regex"];
      if header :regex :comparator "i;octet" "subject" "^TEST" { fileinto "Octet"; }
      if header :regex "subject" "^TEST" { fileinto "Casemap"; }`,
      createMessage({ headers: { subject: 'test subject' } })
    );
    assert.deepStrictEqual(filed(result), ['Casemap']);
  });

  it('matches envelope senders, recipients and subaddresses as the RFCs say', async () => {
    const message = {
      ...createMessage({
        headers: { to: 'user@example.com, list+@example.com' }
      }),
      // (the delivery gives the recipient as a list)
      envelope: { from: '', to: ['user+tag@example.com'] }
    };
    const result = await executeScript(
      `require ["envelope", "subaddress", "relational", "comparator-i;ascii-numeric", "fileinto"];
      if envelope :is "from" "" { fileinto "NullSender"; }
      if envelope :count "eq" :comparator "i;ascii-numeric" "from" "0" { fileinto "NoSender"; }
      if envelope :detail "to" "tag" { fileinto "Detail"; }
      if address :detail :is "to" "" { fileinto "EmptyDetail"; }
      if address :detail :count "eq" :comparator "i;ascii-numeric" "to" "2" { fileinto "Counted"; }`,
      message
    );
    // (user@example.com has no detail, which no key matches)
    assert.deepStrictEqual(filed(result), [
      'NullSender',
      'NoSender',
      'Detail',
      'EmptyDetail',
      'Counted'
    ]);
  });

  it('finds the addresses in groups and next to comments (RFC 5228 5.1)', async () => {
    const result = await executeScript(
      `require "fileinto";
      if address :is "to" "b@example.org" { fileinto "Group"; }
      if address :is "cc" "c@example.org" { fileinto "Comment"; }
      if address :is "to" "team" { fileinto "GroupName"; }`,
      createMessage({
        headers: {
          to: 'team: a@example.org, b@example.org;',
          cc: 'c@example.org (Carol)'
        }
      })
    );
    assert.deepStrictEqual(filed(result), ['Group', 'Comment']);
  });

  it('does not see properties of objects as headers', async () => {
    const result = await executeScript(
      `require "fileinto";
      if exists "constructor" { fileinto "Constructor"; }
      if header :contains "__proto__" "" { fileinto "Proto"; }`,
      createMessage()
    );
    assert.deepStrictEqual(filed(result), []);
  });

  it('fails an environment test for an item that does not exist (RFC 5183)', async () => {
    const result = await executeScript(
      `require ["environment", "fileinto"];
      if environment :is "vnd.unknown" "" { fileinto "Unknown"; }
      if environment :is "location" "MDA" { fileinto "Location"; }`,
      createMessage()
    );
    assert.deepStrictEqual(filed(result), ['Location']);
  });

  it('extracts the date parts of RFC 5260', async () => {
    const message = createMessage({
      headers: {
        date: 'Tue, 1 Jul 2003 10:52:37 +0200',
        received: 'from a by b; Wed, 2 Jul 2003 01:00:00 -0500'
      }
    });
    const result = await executeScript(
      `require ["date", "variables"];
      if date :matches :originalzone "date" "iso8601" "*" { set "iso" "\${0}"; }
      if date :matches :zone "+0000" "date" "std11" "*" { set "std11" "\${0}"; }
      if date :matches :zone "+0000" "date" "julian" "*" { set "julian" "\${0}"; }
      if date :matches :originalzone "date" "zone" "*" { set "zone" "\${0}"; }
      if date :matches :zone "+0000" "received" "date" "*" { set "received" "\${0}"; }
      if date :matches :zone "-0500" "date" "hour" "*" { set "hour" "\${0}"; }
      if currentdate :matches :zone "+0530" "zone" "*" { set "now" "\${0}"; }`,
      message
    );
    assert.strictEqual(result.variables.iso, '2003-07-01T10:52:37+02:00');
    assert.strictEqual(
      result.variables.std11,
      'Tue, 01 Jul 2003 08:52:37 +0000'
    );
    assert.strictEqual(result.variables.julian, '52821');
    assert.strictEqual(result.variables.zone, '+0200');
    assert.strictEqual(result.variables.received, '2003-07-02');
    assert.strictEqual(result.variables.hour, '03');
    assert.strictEqual(result.variables.now, '+0530');
  });

  it('matches body :raw, :content and :text (RFC 5173)', async () => {
    const raw = Buffer.from(
      [
        'From: a@example.com',
        'Content-Type: multipart/alternative; boundary="b"',
        '',
        '--b',
        'Content-Type: text/plain; charset=iso-8859-1',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from('Grüße', 'latin1').toString('base64'),
        '--b',
        'Content-Type: text/html',
        '',
        '<b>Hello</b>',
        '--b--',
        ''
      ].join('\r\n')
    );
    const message = {
      ...createMessage(),
      raw,
      body: { text: 'Grüße', html: '<b>Hello</b>' },
      mimeParts: [
        {
          contentType: 'multipart/alternative',
          multipart: 'alternative',
          headers: {},
          body: '',
          parentIndex: -1
        },
        {
          contentType: 'text/plain',
          charset: 'iso-8859-1',
          encoding: 'base64',
          headers: {},
          body: Buffer.from('Grüße', 'latin1').toString('base64'),
          parentIndex: 0
        },
        {
          contentType: 'text/html',
          encoding: '',
          headers: {},
          body: '<b>Hello</b>',
          parentIndex: 0
        }
      ]
    };
    const result = await executeScript(
      `require ["body", "fileinto"];
      if body :raw :contains "R3L832U=" { fileinto "Raw"; }
      if body :raw :contains "Grüße" { fileinto "RawDecoded"; }
      if body :content "text/plain" :contains "Grüße" { fileinto "Plain"; }
      if body :content "text/plain" :contains "Hello" { fileinto "PlainHtml"; }
      if body :content "text" :contains "<b>" { fileinto "Html"; }
      if body :content "multipart" :contains "text/plain" { fileinto "Multipart"; }
      if body :text :contains "Grüße" { fileinto "Text"; }`,
      message
    );
    assert.deepStrictEqual(filed(result), ['Raw', 'Plain', 'Html', 'Text']);
  });

  it('handles flags as RFC 5232 says', async () => {
    const result = await executeScript(
      `require ["imap4flags", "fileinto", "variables", "relational", "comparator-i;ascii-numeric"];
      addflag "\\\\Seen \\\\Flagged";
      addflag ["\\\\seen", "", "\\\\Recent"];
      if hasflag :count "eq" :comparator "i;ascii-numeric" "2" { fileinto "Two"; }
      removeflag "\\\\SEEN";
      keep :flags "\\\\Answered";
      setflag "fv" "\\\\Draft Work";
      if hasflag :is "fv" "work" { fileinto :flags "\${fv}" "FromVariable"; }`,
      createMessage()
    );
    assert.deepStrictEqual(filed(result), ['Two', 'FromVariable']);
    assert.deepStrictEqual(
      result.actions.find((a) => a.type === 'keep').flags,
      ['\\Answered']
    );
    assert.deepStrictEqual(
      result.actions.find((a) => a.mailbox === 'FromVariable').flags,
      ['\\Draft', 'Work']
    );
    assert.deepStrictEqual(result.flags, ['\\Flagged']);
  });

  //
  // (RFC 5429 section 2.4 and RFC 5230 section 4.7 make these errors, but
  // failing them lost every other action of scripts that ran before: the
  // sender gets one response, the first reject or else the first vacation)
  //
  it('responds once to a script that rejects twice or rejects and replies (RFC 5429, RFC 5230)', async () => {
    for (const [script, expected] of [
      [
        'require "reject"; reject "a"; reject "b";',
        [{ type: 'reject', message: 'a' }]
      ],
      [
        'require ["reject", "vacation"]; vacation "away"; reject "no";',
        [{ type: 'reject', message: 'no' }]
      ],
      [
        'require ["reject", "vacation"]; reject "no"; vacation "away";',
        [{ type: 'reject', message: 'no' }]
      ],
      [
        'require "vacation"; vacation :subject "A" "a"; vacation :subject "B" "b";',
        [
          { type: 'vacation', message: 'a' },
          { type: 'keep', message: undefined }
        ]
      ]
    ]) {
      const result = await executeScript(script, createMessage());
      assert.deepStrictEqual(
        result.actions.map(({ type, message }) => ({ type, message })),
        expected,
        script
      );
    }
  });

  it('shows header changes to later tests (RFC 5293)', async () => {
    const message = createMessage({
      headers: { 'x-foo': ['one', 'two', 'three'] }
    });
    const result = await executeScript(
      `require ["editheader", "fileinto", "index"];
      addheader "X-A" "1";
      if header :is "x-a" "1" { fileinto "Added"; }
      deleteheader "subject";
      if exists "subject" { fileinto "StillThere"; }
      deleteheader :index 1 "x-foo";
      if header :index 1 "x-foo" "two" { fileinto "FirstDeleted"; }
      deleteheader :index 1 "x-foo" "zzz";
      if header :index 1 "x-foo" "two" { fileinto "NotMatched"; }`,
      message
    );
    assert.deepStrictEqual(filed(result), [
      'Added',
      'FirstDeleted',
      'NotMatched'
    ]);
  });

  it('accepts a mailto URI with its recipient in a to field (RFC 6068)', async () => {
    const result = await executeScript(
      'require "enotify"; notify "mailto:?to=a@example.com&subject=x";',
      createMessage()
    );
    assert.ok(result.actions.some((a) => a.type === 'notify'));
  });

  it('reads the text of HTML with long runs of "<" quickly', async () => {
    const start = Date.now();
    await executeScript(
      'require "body"; if body :contains "x" { keep; }',
      createMessage({
        body: { text: '', html: '<a' + '<'.repeat(200_000) }
      })
    );
    assert.ok(Date.now() - start < 2000, `took ${Date.now() - start}ms`);
  });

  it('skips a notify to a method that is not supported (RFC 5435)', async () => {
    const result = await executeScript(
      'require ["enotify", "fileinto"]; notify :method "xmpp:a@example.com" :message "m"; fileinto "A";',
      createMessage()
    );
    assert.deepStrictEqual(
      result.actions.map((a) => a.type),
      ['fileinto']
    );
  });

  it('visits only the parts in the outer part in nested foreverypart loops', async () => {
    const message = {
      ...createMessage(),
      mimeParts: [
        {
          contentType: 'multipart/mixed',
          multipart: 'mixed',
          headers: {},
          parentIndex: -1
        },
        {
          contentType: 'multipart/alternative',
          multipart: 'alternative',
          headers: {},
          parentIndex: 0
        },
        { contentType: 'text/plain', headers: {}, parentIndex: 1 },
        { contentType: 'text/html', headers: {}, parentIndex: 1 },
        { contentType: 'application/octet-stream', headers: {}, parentIndex: 0 }
      ]
    };
    const result = await executeScript(
      `require ["foreverypart", "variables"];
      set "n" "";
      foreverypart { foreverypart { set "n" "\${n}x"; } }
      foreverypart { if true { break; set "n" "after"; } }`,
      message
    );
    // (4 parts in the message, 2 in the alternative part, none in the rest)
    assert.strictEqual(result.variables.n, 'xxxxxx');
  });

  it('counts a duplicate only from deliveries before, once the script ran (RFC 7352)', async () => {
    const stored = new Map();
    const duplicateCache = {
      has: async (key) => stored.has(key),
      add: async (key, seconds) => stored.set(key, seconds)
    };
    const script = `require ["duplicate", "fileinto"];
      if duplicate { fileinto "D1"; }
      if duplicate { fileinto "D2"; }
      if duplicate :seconds 0 :handle "zero" { fileinto "Zero"; }`;
    const message = createMessage({ headers: { 'message-id': '<a@b>' } });
    const first = await executeScript(script, message, {
      context: { duplicateCache }
    });
    assert.deepStrictEqual(filed(first), []);
    assert.deepStrictEqual([...stored.keys()], ['default:<a@b>']);
    const second = await executeScript(script, message, {
      context: { duplicateCache }
    });
    assert.deepStrictEqual(filed(second), ['D1', 'D2']);

    // (a run that fails stores nothing)
    stored.clear();
    await assert.rejects(
      executeScript(
        'require ["duplicate", "ihave"]; if duplicate { keep; } error "a";',
        message,
        { context: { duplicateCache } }
      )
    );
    assert.strictEqual(stored.size, 0);
  });

  it('does not enable variables with ihave (RFC 5463)', async () => {
    const result = await executeScript(
      `require ["ihave", "fileinto"];
      if ihave "variables" { fileinto "Variables"; }
      if ihave "fileinto" { fileinto "Fileinto"; }`,
      createMessage()
    );
    assert.deepStrictEqual(filed(result), ['Fileinto']);
  });

  it('reads only the parameter named with :param (RFC 5703)', async () => {
    const message = {
      ...createMessage(),
      mimeParts: [
        {
          contentType: 'application/pdf',
          headers: {
            'content-disposition': 'attachment; filename="report.pdf"'
          },
          parentIndex: -1
        }
      ]
    };
    const result = await executeScript(
      `require ["foreverypart", "mime", "fileinto"];
      foreverypart {
        if header :mime :param "name" "content-disposition" "*" { fileinto "Name"; }
        if header :mime :param "filename" "content-disposition" "report.pdf" { fileinto "Filename"; }
      }`,
      message
    );
    assert.deepStrictEqual(filed(result), ['Filename']);
  });

  it('applies :encodeurl and counts :length in characters', async () => {
    const result = await executeScript(
      `require ["variables", "enotify"];
      set :encodeurl "url" "a b&c*";
      set :length "length" "é\u{1F600}";`,
      createMessage()
    );
    assert.strictEqual(result.variables.url, 'a%20b%26c%2A');
    assert.strictEqual(result.variables.length, '2');
  });

  it('extracts text in its charset (RFC 5703)', async () => {
    const message = {
      ...createMessage(),
      mimeParts: [
        {
          contentType: 'text/plain',
          charset: 'iso-8859-1',
          encoding: 'base64',
          headers: {},
          body: Buffer.from('Grüße', 'latin1').toString('base64'),
          parentIndex: -1
        }
      ]
    };
    const result = await executeScript(
      `require ["foreverypart", "extracttext", "variables"];
      foreverypart { extracttext "text"; }`,
      message
    );
    assert.strictEqual(result.variables.text, 'Grüße');
  });
});

describe('Match keys and the work a run does once', () => {
  // ("İ" is two characters once lower case, so the key matches the value only
  // as the comparator sees it, and the match variables are of that value)
  it('sets the match variables of a value that lower case makes longer', async () => {
    const result = await executeScript(
      // eslint-disable-next-line no-template-curly-in-string
      'require ["variables", "fileinto"];\nif header :matches "subject" "*" { set "a" "1"; }\nif header :matches "subject" "i\u0307*" { fileinto "[${0}][${1}]"; }',
      createMessage({ headers: { subject: 'İstanbul' } })
    );
    assert.deepStrictEqual(
      result.actions.filter((a) => a.type === 'fileinto').map((a) => a.mailbox),
      ['[i\u0307stanbul][stanbul]']
    );
  });

  //
  // A large body made i;unicode-casemap for each test used up
  // MAX_MATCH_TIME within 20 tests, and the script failed
  //
  it('makes a large body i;unicode-casemap once for many tests', async () => {
    const tests = Array.from(
      { length: 20 },
      (_, i) =>
        `if body :text :comparator "i;unicode-casemap" :contains "nééedle${i}" { fileinto "B${i}"; }`
    ).join('\n');
    const result = await executeScript(
      `require ["fileinto", "body"];\n${tests}\nfileinto "Reached";`,
      createMessage({
        body: 'Ünïcödé text with some words and accents été café straße\r\n'.repeat(
          150_000
        )
      })
    );
    assert.deepStrictEqual(
      result.actions.filter((a) => a.type === 'fileinto').map((a) => a.mailbox),
      ['Reached']
    );
  });

  //
  // i;unicode-casemap can make a value three times as long: a run keeps two
  // large values normalized, and none for i;octet, which does not change it
  //
  it('keeps at most two large values normalized at a time', async () => {
    const engine = new SieveEngine({ capabilities: SUPPORTED_CAPABILITIES });
    const kept = [];
    const getNormalized = engine.getNormalized.bind(engine);
    engine.getNormalized = (state, comparator, value) => {
      const normalized = getNormalized(state, comparator, value);
      kept.push(
        [state.normalized]
          .flat()
          .filter(Boolean)
          .map((entry) => `${entry.comparator} ${entry.normalized.length}`)
      );
      return normalized;
    };

    await engine.execute(
      parse(`require ["body", "comparator-i;unicode-casemap"];
      if body :text :comparator "i;unicode-casemap" :contains "x" { keep; }
      if header :comparator "i;unicode-casemap" :contains "subject" "x" { keep; }
      if body :text :comparator "i;octet" :contains "x" { keep; }
      if header :comparator "i;unicode-casemap" :contains "subject" "y" { keep; }
      if header :comparator "i;unicode-casemap" :contains "x-long" "x" { keep; }
      if body :text :comparator "i;unicode-casemap" :contains "y" { keep; }`),
      createMessage({
        headers: { subject: 'Ü'.repeat(2000), 'x-long': 'ü'.repeat(1500) },
        body: '\u0390'.repeat(2000)
      })
    );
    assert.deepStrictEqual(kept, [
      ['i;unicode-casemap 6000'],
      ['i;unicode-casemap 2000', 'i;unicode-casemap 6000'],
      ['i;unicode-casemap 2000', 'i;unicode-casemap 6000'],
      ['i;unicode-casemap 2000', 'i;unicode-casemap 6000'],
      ['i;unicode-casemap 1500', 'i;unicode-casemap 2000'],
      ['i;unicode-casemap 6000', 'i;unicode-casemap 1500']
    ]);
  });

  //
  // With one value kept, tests that read the raw and the text body in turn
  // made each again: 100 of them on an 8MB message used up MAX_MATCH_TIME
  //
  it('keeps the raw and the text body normalized for tests that read both', async () => {
    const tests = Array.from(
      { length: 400 },
      (_, i) =>
        `if allof (body :raw :contains "fox", body :text :contains "fox") { fileinto "F${i}"; }`
    ).join('\n');
    const body =
      'The quick brown fox jumps over the lazy dog 0123456789\r\n'.repeat(
        75_000
      );
    const result = await executeScript(
      `require ["fileinto", "body"];\n${tests}\nfileinto "Reached";`,
      {
        ...createMessage({ body: body.replaceAll('\r\n', '\n') }),
        raw: `Subject: Test\r\n\r\n${body}`
      }
    );
    const filed = result.actions
      .filter((a) => a.type === 'fileinto')
      .map((a) => a.mailbox);
    assert.strictEqual(filed.length, 401);
    assert.strictEqual(filed.at(-1), 'Reached');
  });

  //
  // The matchers of a test are made again each time it runs: a key of 100
  // wildcards in loops of 9,900 iterations was compiled for each one, and
  // used up MAX_MATCH_TIME
  //
  it('compiles a :matches or :regex key once a run', async () => {
    const tests = [
      `if header :matches "subject" "${'*a?'.repeat(100)}" { keep; }`,
      `if header :regex "subject" "${'(a|b)c'.repeat(50)}" { keep; }`
    ].join(' ');
    const mimeParts = Array.from({ length: 99 }, () => ({
      contentType: 'text/plain',
      headers: { 'content-type': 'text/plain' },
      body: 'x'
    }));
    const engine = new SieveEngine({ capabilities: SUPPORTED_CAPABILITIES });
    const compiled = [];
    const compileGlob = engine.compileGlob.bind(engine);
    engine.compileGlob = (pattern, ...arguments_) => {
      compiled.push(pattern);
      return compileGlob(pattern, ...arguments_);
    };

    const result = await engine.execute(
      parse(
        `require ["mime", "foreverypart", "regex"];\nforeverypart { foreverypart { ${tests} } }`
      ),
      { ...createMessage(), mimeParts }
    );
    assert.deepStrictEqual(
      result.actions.map((a) => a.type),
      ['keep']
    );
    // (the :regex key is kept as the :matches key is, see the next test)
    assert.strictEqual(compiled.length, 1);
  });

  // (100 RE2 objects for keys of 64KB took 774MB)
  it('keeps at most 100 compiled keys of up to 1024 characters', async () => {
    const engine = new SieveEngine({ capabilities: SUPPORTED_CAPABILITIES });
    let compiled;
    const getCompiled = engine.getCompiled.bind(engine);
    engine.getCompiled = (state, ...arguments_) => {
      compiled = state.compiled;
      return getCompiled(state, ...arguments_);
    };

    const keys = Array.from({ length: 150 }, (_, i) => `"*k${i}?"`);
    await engine.execute(
      parse(`require ["regex", "variables"];
      set "long" "${'?'.repeat(1025)}";
      if header :matches "subject" "\${long}" { keep; }
      if header :matches "subject" [${keys.join(', ')}] { keep; }
      if header :regex "subject" [${keys.join(', ')}] { keep; }`),
      createMessage()
    );
    assert.strictEqual(compiled.size, 100);
    assert.ok([...compiled.keys()].every((key) => key.length < 1024));
  });

  // (the keys of hasflag are match keys, RFC 5232 section 4)
  it('hasflag matches :matches patterns and variables in its keys', async () => {
    const result = await executeScript(
      `require ["imap4flags", "variables", "fileinto"];
      set "x" "foo";
      addflag "foo";
      if allof (hasflag :matches "f*", hasflag "\${x}") { fileinto "H"; }`,
      createMessage()
    );
    assert.ok(
      result.actions.some((a) => a.type === 'fileinto' && a.mailbox === 'H')
    );
  });

  //
  // A script can hold thousands of tests: the body is made plain text, each
  // part decoded and each address header parsed once a run, not once a test
  //
  it('converts the body and parses addresses once however many tests read them', async () => {
    const engine = new SieveEngine({ capabilities: SUPPORTED_CAPABILITIES });
    const calls = { htmlToText: 0, decodePartContent: 0 };
    for (const name of Object.keys(calls)) {
      const fn = engine[name].bind(engine);
      engine[name] = (...args) => {
        calls[name]++;
        return fn(...args);
      };
    }

    const tests = Array.from({ length: 50 }, () =>
      [
        'if body :text :is "x" { keep; }',
        'if body :content "text" :contains "x" { keep; }',
        'if address :is "to" "x@example.com" { keep; }'
      ].join('\n')
    ).join('\n');
    const message = {
      ...createMessage(),
      body: { text: '', html: '<p>hello</p>' },
      mimeParts: ['one', 'two'].map((text) => ({
        contentType: 'text/plain',
        encoding: 'base64',
        headers: {},
        body: Buffer.from(text).toString('base64'),
        parentIndex: -1
      }))
    };
    const state = await engine.execute(
      parse(`require ["body"];\n${tests}`),
      message,
      {}
    );
    assert.ok(state);
    assert.strictEqual(calls.htmlToText, 1);
    assert.strictEqual(calls.decodePartContent, 2);
  });
});
