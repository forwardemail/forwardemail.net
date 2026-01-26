/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Engine Tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const { parse } = require('../../helpers/sieve/parser');
const SieveEngine = require('../../helpers/sieve/engine');

// Supported capabilities for engine creation
const SUPPORTED_CAPABILITIES = [
  'fileinto',
  'reject',
  'ereject',
  'envelope',
  'encoded-character',
  'comparator-i;ascii-casemap',
  'comparator-i;octet',
  'copy',
  'body',
  'vacation',
  'vacation-seconds',
  'variables',
  'imap4flags',
  'relational',
  'editheader',
  'date',
  'index',
  'regex',
  'enotify',
  'environment'
];

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

  describe('Variables extension', () => {
    it('should set and use variable', async () => {
      const script = `
        require "variables";
        set "folder" "Archive";
        require "fileinto";
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
});
