/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Store Tests
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

const {
  MemorySieveStore,
  MemoryVacationStore
} = require('../../helpers/sieve/store');

describe('Sieve Store', () => {
  let store;
  const aliasId = 'test-alias-123';

  beforeEach(() => {
    store = new MemorySieveStore();
  });

  describe('Basic CRUD operations', () => {
    it('should store a script', async () => {
      const script = await store.putScript(aliasId, 'test', 'keep;');
      assert.strictEqual(script.name, 'test');
      assert.strictEqual(script.content, 'keep;');
      assert.strictEqual(script.is_active, false);
    });

    it('should retrieve a stored script', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      const script = await store.getScript(aliasId, 'test');
      assert.strictEqual(script.name, 'test');
      assert.strictEqual(script.content, 'keep;');
    });

    it('should return null for non-existent script', async () => {
      const script = await store.getScript(aliasId, 'nonexistent');
      assert.strictEqual(script, null);
    });

    it('should update existing script', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      await store.putScript(aliasId, 'test', 'discard;');
      const script = await store.getScript(aliasId, 'test');
      assert.strictEqual(script.content, 'discard;');
    });

    it('should preserve active status on update', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      await store.setActive(aliasId, 'test');
      await store.putScript(aliasId, 'test', 'discard;');
      const script = await store.getScript(aliasId, 'test');
      assert.strictEqual(script.is_active, true);
    });

    it('should delete a script', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      const deleted = await store.deleteScript(aliasId, 'test');
      assert.strictEqual(deleted, true);
      const script = await store.getScript(aliasId, 'test');
      assert.strictEqual(script, null);
    });

    it('should return false when deleting non-existent script', async () => {
      const deleted = await store.deleteScript(aliasId, 'nonexistent');
      assert.strictEqual(deleted, false);
    });

    it('should throw when deleting active script', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      await store.setActive(aliasId, 'test');
      await assert.rejects(async () => {
        await store.deleteScript(aliasId, 'test');
      });
    });
  });

  describe('List operations', () => {
    it('should list all scripts', async () => {
      await store.putScript(aliasId, 'script1', 'keep;');
      await store.putScript(aliasId, 'script2', 'discard;');
      const scripts = await store.listScripts(aliasId);
      assert.strictEqual(scripts.length, 2);
      assert.ok(scripts.some((s) => s.name === 'script1'));
      assert.ok(scripts.some((s) => s.name === 'script2'));
    });

    it('should return empty array for alias with no scripts', async () => {
      const scripts = await store.listScripts(aliasId);
      assert.deepStrictEqual(scripts, []);
    });

    it('should include active status in list', async () => {
      await store.putScript(aliasId, 'script1', 'keep;');
      await store.putScript(aliasId, 'script2', 'discard;');
      await store.setActive(aliasId, 'script1');
      const scripts = await store.listScripts(aliasId);
      const script1 = scripts.find((s) => s.name === 'script1');
      const script2 = scripts.find((s) => s.name === 'script2');
      assert.strictEqual(script1.is_active, true);
      assert.strictEqual(script2.is_active, false);
    });
  });

  describe('Active script management', () => {
    it('should set a script as active', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      await store.setActive(aliasId, 'test');
      const script = await store.getScript(aliasId, 'test');
      assert.strictEqual(script.is_active, true);
    });

    it('should get active script', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      await store.setActive(aliasId, 'test');
      const script = await store.getActiveScript(aliasId);
      assert.strictEqual(script.name, 'test');
    });

    it('should return null when no active script', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      const script = await store.getActiveScript(aliasId);
      assert.strictEqual(script, null);
    });

    it('should deactivate previous active script', async () => {
      await store.putScript(aliasId, 'script1', 'keep;');
      await store.putScript(aliasId, 'script2', 'discard;');
      await store.setActive(aliasId, 'script1');
      await store.setActive(aliasId, 'script2');
      const script1 = await store.getScript(aliasId, 'script1');
      const script2 = await store.getScript(aliasId, 'script2');
      assert.strictEqual(script1.is_active, false);
      assert.strictEqual(script2.is_active, true);
    });

    it('should deactivate all scripts when name is empty', async () => {
      await store.putScript(aliasId, 'test', 'keep;');
      await store.setActive(aliasId, 'test');
      await store.setActive(aliasId, '');
      const script = await store.getActiveScript(aliasId);
      assert.strictEqual(script, null);
    });

    it('should throw when activating non-existent script', async () => {
      await assert.rejects(async () => {
        await store.setActive(aliasId, 'nonexistent');
      });
    });
  });

  describe('Rename operations', () => {
    it('should rename a script', async () => {
      await store.putScript(aliasId, 'old-name', 'keep;');
      const result = await store.renameScript(aliasId, 'old-name', 'new-name');
      assert.strictEqual(result, true);
      const oldScript = await store.getScript(aliasId, 'old-name');
      const newScript = await store.getScript(aliasId, 'new-name');
      assert.strictEqual(oldScript, null);
      assert.strictEqual(newScript.name, 'new-name');
      assert.strictEqual(newScript.content, 'keep;');
    });

    it('should return false when renaming non-existent script', async () => {
      const result = await store.renameScript(
        aliasId,
        'nonexistent',
        'new-name'
      );
      assert.strictEqual(result, false);
    });

    it('should throw when target name already exists', async () => {
      await store.putScript(aliasId, 'script1', 'keep;');
      await store.putScript(aliasId, 'script2', 'discard;');
      await assert.rejects(async () => {
        await store.renameScript(aliasId, 'script1', 'script2');
      });
    });

    it('should preserve active status on rename', async () => {
      await store.putScript(aliasId, 'old-name', 'keep;');
      await store.setActive(aliasId, 'old-name');
      await store.renameScript(aliasId, 'old-name', 'new-name');
      const script = await store.getScript(aliasId, 'new-name');
      assert.strictEqual(script.is_active, true);
    });
  });

  describe('Clear operations', () => {
    it('should clear all scripts for an alias', async () => {
      await store.putScript(aliasId, 'script1', 'keep;');
      await store.putScript(aliasId, 'script2', 'discard;');
      await store.clearScripts(aliasId);
      const scripts = await store.listScripts(aliasId);
      assert.deepStrictEqual(scripts, []);
    });

    it('should not affect other aliases', async () => {
      const otherAliasId = 'other-alias-456';
      await store.putScript(aliasId, 'script1', 'keep;');
      await store.putScript(otherAliasId, 'script2', 'discard;');
      await store.clearScripts(aliasId);
      const scripts = await store.listScripts(otherAliasId);
      assert.strictEqual(scripts.length, 1);
    });
  });

  describe('Script validation', () => {
    it('should reject invalid scripts', async () => {
      await assert.rejects(async () => {
        await store.putScript(aliasId, 'test', 'invalid script {{{');
      });
    });

    it('should extract capabilities', async () => {
      const script = await store.putScript(
        aliasId,
        'test',
        'require "fileinto"; fileinto "INBOX.test";'
      );
      assert.ok(script.required_capabilities.includes('fileinto'));
    });
  });

  describe('Script metadata', () => {
    it('should store description', async () => {
      const script = await store.putScript(aliasId, 'test', 'keep;', {
        description: 'Test script'
      });
      assert.strictEqual(script.description, 'Test script');
    });

    it('should store created_by', async () => {
      const script = await store.putScript(aliasId, 'test', 'keep;', {
        created_by: 'managesieve'
      });
      assert.strictEqual(script.created_by, 'managesieve');
    });

    it('should include timestamps', async () => {
      const script = await store.putScript(aliasId, 'test', 'keep;');
      assert.ok(script.created_at instanceof Date);
      assert.ok(script.updated_at instanceof Date);
    });
  });
});

describe('Vacation Store', () => {
  let store;
  const aliasId = 'test-alias-123';

  beforeEach(() => {
    store = new MemoryVacationStore();
  });

  describe('Response tracking', () => {
    it('should allow first response', async () => {
      const shouldSend = await store.shouldSendResponse(
        aliasId,
        'sender@example.com',
        86400
      );
      assert.strictEqual(shouldSend, true);
    });

    it('should block duplicate response within interval', async () => {
      await store.recordResponse(aliasId, 'sender@example.com');
      const shouldSend = await store.shouldSendResponse(
        aliasId,
        'sender@example.com',
        86400
      );
      assert.strictEqual(shouldSend, false);
    });

    it('should allow response after interval', async () => {
      // Record a response with a past timestamp (simulate time passing)
      const key = `${aliasId}:sender@example.com`;
      store.responses.set(key, new Date(Date.now() - 100000));
      const shouldSend = await store.shouldSendResponse(
        aliasId,
        'sender@example.com',
        60 // 60 second interval
      );
      assert.strictEqual(shouldSend, true);
    });

    it('should track different recipients separately', async () => {
      await store.recordResponse(aliasId, 'sender1@example.com');
      const shouldSend = await store.shouldSendResponse(
        aliasId,
        'sender2@example.com',
        86400
      );
      assert.strictEqual(shouldSend, true);
    });

    it('should be case-insensitive for recipients', async () => {
      await store.recordResponse(aliasId, 'Sender@Example.COM');
      const shouldSend = await store.shouldSendResponse(
        aliasId,
        'sender@example.com',
        86400
      );
      assert.strictEqual(shouldSend, false);
    });
  });

  describe('Clear operations', () => {
    it('should clear responses for an alias', async () => {
      await store.recordResponse(aliasId, 'sender1@example.com');
      await store.recordResponse(aliasId, 'sender2@example.com');
      await store.clearResponses(aliasId);
      const shouldSend = await store.shouldSendResponse(
        aliasId,
        'sender1@example.com',
        86400
      );
      assert.strictEqual(shouldSend, true);
    });

    it('should not affect other aliases', async () => {
      const otherAliasId = 'other-alias-456';
      await store.recordResponse(aliasId, 'sender@example.com');
      await store.recordResponse(otherAliasId, 'sender@example.com');
      await store.clearResponses(aliasId);
      const shouldSend = await store.shouldSendResponse(
        otherAliasId,
        'sender@example.com',
        86400
      );
      assert.strictEqual(shouldSend, false);
    });
  });
});
