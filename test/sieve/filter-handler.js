/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Filter Handler Tests
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

const { MemorySieveStore } = require('../../helpers/sieve/store');
const {
  SieveFilterHandler,
  MemoryVacationStore
} = require('../../helpers/sieve/filter-handler');

// Helper to create a test message
function createMessage(overrides = {}) {
  return {
    headers: {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      'message-id': '<test-123@example.com>',
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

describe('Sieve Filter Handler', () => {
  let store;
  let handler;
  let vacationStore;
  let sentMails;

  beforeEach(() => {
    store = new MemorySieveStore();
    vacationStore = new MemoryVacationStore();
    sentMails = [];

    handler = new SieveFilterHandler({
      store,
      vacationStore,
      async sendMail(mail) {
        sentMails.push(mail);
      },
      logger: {
        info() {},
        warn() {},
        error() {},
        debug() {}
      }
    });
  });

  describe('Basic processing', () => {
    it('should return implicit keep when no script', async () => {
      const result = await handler.processMessage('user-1', createMessage());
      assert.strictEqual(result.filtered, false);
      assert.ok(result.actions.some((a) => a.type === 'keep'));
    });

    it('should execute active script', async () => {
      await store.putScript('user-1', 'test', 'discard;');
      await store.setActive('user-1', 'test');
      const result = await handler.processMessage('user-1', createMessage());
      assert.strictEqual(result.filtered, true);
      assert.ok(result.actions.some((a) => a.type === 'discard'));
    });

    it('should ignore inactive scripts', async () => {
      await store.putScript('user-1', 'test', 'discard;');
      // Not activated
      const result = await handler.processMessage('user-1', createMessage());
      assert.strictEqual(result.filtered, false);
      assert.ok(result.actions.some((a) => a.type === 'keep'));
    });

    it('should handle script errors gracefully', async () => {
      // Store a script that will fail at runtime (unsupported capability)
      await store.putScript('user-1', 'test', 'require "unsupported"; keep;');
      await store.setActive('user-1', 'test');
      const result = await handler.processMessage('user-1', createMessage());
      assert.strictEqual(result.filtered, false);
      assert.ok(result.error);
      assert.ok(result.actions.some((a) => a.type === 'keep'));
    });
  });

  describe('Apply actions', () => {
    it('should handle keep action', async () => {
      const result = { actions: [{ type: 'keep', flags: ['\\Seen'] }] };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.kept, true);
      assert.deepStrictEqual(applied.flags, ['\\Seen']);
    });

    it('should handle fileinto action', async () => {
      const result = {
        actions: [
          { type: 'fileinto', mailbox: 'Archive', flags: [], copy: false }
        ]
      };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.filed.length, 1);
      assert.strictEqual(applied.filed[0].mailbox, 'Archive');
      assert.strictEqual(applied.kept, false);
    });

    it('should handle fileinto with copy', async () => {
      const result = {
        actions: [
          { type: 'fileinto', mailbox: 'Archive', flags: [], copy: true }
        ]
      };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.filed.length, 1);
      assert.strictEqual(applied.kept, true); // Copy preserves implicit keep
    });

    it('should handle redirect action', async () => {
      const result = {
        actions: [
          { type: 'redirect', address: 'other@example.com', copy: false }
        ]
      };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.redirected.length, 1);
      assert.strictEqual(applied.redirected[0].address, 'other@example.com');
      assert.strictEqual(applied.kept, false);
    });

    it('should handle discard action', async () => {
      const result = { actions: [{ type: 'discard' }] };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.discarded, true);
      assert.strictEqual(applied.kept, false);
    });

    it('should handle reject action', async () => {
      const result = {
        actions: [{ type: 'reject', message: 'Not accepted' }]
      };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.rejected, true);
      assert.strictEqual(applied.rejectMessage, 'Not accepted');
      assert.strictEqual(applied.kept, false);
    });

    it('should handle header changes', async () => {
      const result = {
        actions: [
          {
            type: 'addheader',
            name: 'X-Processed',
            value: 'true',
            last: false
          },
          { type: 'deleteheader', name: 'X-Spam-Score' }
        ]
      };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.headerChanges.length, 2);
      assert.strictEqual(applied.headerChanges[0].action, 'add');
      assert.strictEqual(applied.headerChanges[1].action, 'delete');
    });

    it('should handle multiple actions', async () => {
      const result = {
        actions: [
          { type: 'fileinto', mailbox: 'Archive', flags: [], copy: true },
          { type: 'redirect', address: 'backup@example.com', copy: true },
          { type: 'addheader', name: 'X-Processed', value: 'true' }
        ]
      };
      const applied = await handler.applyActions(result, createMessage());
      assert.strictEqual(applied.filed.length, 1);
      assert.strictEqual(applied.redirected.length, 1);
      assert.strictEqual(applied.headerChanges.length, 1);
      assert.strictEqual(applied.kept, true);
    });
  });

  describe('Vacation handling', () => {
    it('should send auto-reply', async () => {
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            subject: 'Out of Office',
            message: 'I am away.',
            addresses: [],
            from: null,
            mime: false,
            handle: null
          }
        ]
      };

      const context = {
        userId: 'user-1',
        userAddress: 'me@example.com'
      };

      await handler.applyActions(result, createMessage(), context);
      assert.strictEqual(sentMails.length, 1);
      assert.strictEqual(sentMails[0].to, 'sender@example.com');
      assert.strictEqual(sentMails[0].subject, 'Out of Office');
      assert.strictEqual(sentMails[0].body, 'I am away.');
    });

    it('should not reply to bulk mail', async () => {
      sentMails.length = 0; // Reset for this test
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            message: 'Away',
            addresses: []
          }
        ]
      };

      const message = createMessage({
        headers: {
          from: 'list@example.com',
          precedence: 'bulk'
        }
      });

      await handler.applyActions(result, message, { userId: 'user-1' });
      assert.strictEqual(sentMails.length, 0);
    });

    it('should not reply to mailing lists', async () => {
      sentMails.length = 0; // Reset for this test
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            message: 'Away',
            addresses: []
          }
        ]
      };

      const message = createMessage({
        headers: {
          from: 'list@example.com',
          'list-id': '<dev.example.com>'
        }
      });

      await handler.applyActions(result, message, { userId: 'user-1' });
      assert.strictEqual(sentMails.length, 0);
    });

    it('should not reply to auto-submitted messages', async () => {
      sentMails.length = 0; // Reset for this test
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            message: 'Away',
            addresses: []
          }
        ]
      };

      const message = createMessage({
        headers: {
          from: 'system@example.com',
          'auto-submitted': 'auto-generated'
        }
      });

      await handler.applyActions(result, message, { userId: 'user-1' });
      assert.strictEqual(sentMails.length, 0);
    });

    it('should not reply to no-reply addresses', async () => {
      sentMails.length = 0; // Reset for this test
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            message: 'Away',
            addresses: []
          }
        ]
      };

      const message = createMessage({
        headers: {
          from: 'noreply@example.com'
        }
      });

      await handler.applyActions(result, message, { userId: 'user-1' });
      assert.strictEqual(sentMails.length, 0);
    });

    it('should respect interval', async () => {
      sentMails.length = 0; // Reset for this test
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            message: 'Away',
            addresses: []
          }
        ]
      };

      const context = {
        userId: 'user-1',
        userAddress: 'me@example.com'
      };

      // First reply should be sent
      await handler.applyActions(result, createMessage(), context);
      assert.strictEqual(sentMails.length, 1);

      // Second reply within interval should not be sent
      await handler.applyActions(result, createMessage(), context);
      assert.strictEqual(sentMails.length, 1);
    });

    it('should set correct headers', async () => {
      const result = {
        actions: [
          {
            type: 'vacation',
            days: 7,
            subject: 'OOO',
            message: 'Away',
            addresses: []
          }
        ]
      };

      await handler.applyActions(result, createMessage(), {
        userId: 'user-1',
        userAddress: 'me@example.com'
      });

      const mail = sentMails[0];
      assert.strictEqual(mail.autoSubmitted, 'auto-replied');
      assert.strictEqual(mail.inReplyTo, '<test-123@example.com>');
    });
  });

  describe('WildDuck format conversion', () => {
    it('should convert keep action', () => {
      const result = {
        kept: true,
        flags: ['\\Seen'],
        filed: [],
        redirected: [],
        headerChanges: []
      };

      const wildDuck = handler.toWildDuckFormat(result);
      assert.strictEqual(wildDuck.actions.length, 1);
      assert.strictEqual(wildDuck.actions[0].action, 'keep');
      assert.strictEqual(wildDuck.actions[0].mailbox, 'INBOX');
    });

    it('should convert fileinto action', () => {
      const result = {
        kept: false,
        filed: [{ mailbox: 'Archive', flags: ['\\Seen'], create: true }],
        redirected: [],
        headerChanges: []
      };

      const wildDuck = handler.toWildDuckFormat(result);
      assert.strictEqual(wildDuck.actions.length, 1);
      assert.strictEqual(wildDuck.actions[0].action, 'move');
      assert.strictEqual(wildDuck.actions[0].mailbox, 'Archive');
      assert.strictEqual(wildDuck.actions[0].create, true);
    });

    it('should convert redirect action', () => {
      const result = {
        kept: false,
        filed: [],
        redirected: [{ address: 'other@example.com' }],
        headerChanges: []
      };

      const wildDuck = handler.toWildDuckFormat(result);
      assert.strictEqual(wildDuck.actions.length, 1);
      assert.strictEqual(wildDuck.actions[0].action, 'forward');
      assert.strictEqual(wildDuck.actions[0].address, 'other@example.com');
    });

    it('should convert discard action', () => {
      const result = {
        kept: false,
        discarded: true,
        filed: [],
        redirected: [],
        headerChanges: []
      };

      const wildDuck = handler.toWildDuckFormat(result);
      assert.strictEqual(wildDuck.actions.length, 1);
      assert.strictEqual(wildDuck.actions[0].action, 'discard');
    });

    it('should convert reject action', () => {
      const result = {
        kept: false,
        rejected: true,
        rejectMessage: 'Not accepted',
        filed: [],
        redirected: [],
        headerChanges: []
      };

      const wildDuck = handler.toWildDuckFormat(result);
      assert.strictEqual(wildDuck.actions.length, 1);
      assert.strictEqual(wildDuck.actions[0].action, 'reject');
      assert.strictEqual(wildDuck.actions[0].message, 'Not accepted');
    });
  });

  describe('Integration', () => {
    it('should handle full filtering workflow', async () => {
      // Setup script
      const script = `
        require ["fileinto", "imap4flags"];

        if header :contains "subject" "spam" {
          fileinto "Junk";
          stop;
        }

        if address :domain :is "from" "important.com" {
          addflag "\\\\Flagged";
          fileinto "Important";
          stop;
        }

        keep;
      `;

      await store.putScript('user-1', 'main', script);
      await store.setActive('user-1', 'main');

      // Test spam message
      const spamMessage = createMessage({
        headers: { subject: 'This is spam' }
      });
      const spamResult = await handler.processMessage('user-1', spamMessage);
      const spamApplied = await handler.applyActions(spamResult, spamMessage);
      assert.strictEqual(spamApplied.filed.length, 1);
      assert.strictEqual(spamApplied.filed[0].mailbox, 'Junk');

      // Test important message
      const importantMessage = createMessage({
        headers: { from: 'ceo@important.com', subject: 'Meeting' }
      });
      const importantResult = await handler.processMessage(
        'user-1',
        importantMessage
      );
      const importantApplied = await handler.applyActions(
        importantResult,
        importantMessage
      );
      assert.strictEqual(importantApplied.filed.length, 1);
      assert.strictEqual(importantApplied.filed[0].mailbox, 'Important');
      assert.ok(importantApplied.filed[0].flags.includes('\\Flagged'));

      // Test regular message
      const regularMessage = createMessage({
        headers: { from: 'friend@example.com', subject: 'Hello' }
      });
      const regularResult = await handler.processMessage(
        'user-1',
        regularMessage
      );
      const regularApplied = await handler.applyActions(
        regularResult,
        regularMessage
      );
      assert.strictEqual(regularApplied.kept, true);
      assert.strictEqual(regularApplied.filed.length, 0);
    });
  });
});
