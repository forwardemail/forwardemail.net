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
