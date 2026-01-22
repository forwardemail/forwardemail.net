/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Script Storage
 *
 * This module provides storage backends for Sieve scripts.
 * The primary storage is via the SieveScripts model in app/models/sieve-scripts.js
 * which ties scripts to user aliases.
 *
 * Storage backends:
 * - MemorySieveStore: In-memory storage for testing
 */

const { validate, getRequiredCapabilities, parse } = require('./parser');

/**
 * In-memory Sieve script store (for testing)
 */
class MemorySieveStore {
  constructor() {
    this.scripts = new Map();
  }

  /**
   * Get alias scripts map
   * @param {string} aliasId - Alias ID
   * @returns {Map} Alias's scripts
   */
  getAliasScripts(aliasId) {
    if (!this.scripts.has(aliasId)) {
      this.scripts.set(aliasId, new Map());
    }

    return this.scripts.get(aliasId);
  }

  /**
   * Store a script
   * @param {string} aliasId - Alias ID
   * @param {string} name - Script name
   * @param {string} content - Script content
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Stored script
   */
  async putScript(aliasId, name, content, options = {}) {
    const validation = validate(content);
    if (!validation.valid) {
      throw new Error(`Invalid script: ${validation.errors[0].message}`);
    }

    const aliasScripts = this.getAliasScripts(aliasId);
    const existing = aliasScripts.get(name);

    const script = {
      name,
      content,
      is_active: existing?.is_active || false,
      required_capabilities: getRequiredCapabilities(parse(content)),
      description: options.description || existing?.description || '',
      created_at: existing?.created_at || new Date(),
      updated_at: new Date(),
      created_by: options.created_by || 'api',
      last_modified_by: options.last_modified_by || 'api'
    };

    aliasScripts.set(name, script);
    return script;
  }

  /**
   * Get a script
   * @param {string} aliasId - Alias ID
   * @param {string} name - Script name
   * @returns {Promise<Object|null>} Script or null
   */
  async getScript(aliasId, name) {
    const aliasScripts = this.getAliasScripts(aliasId);
    return aliasScripts.get(name) || null;
  }

  /**
   * Get the active script
   * @param {string} aliasId - Alias ID
   * @returns {Promise<Object|null>} Active script or null
   */
  async getActiveScript(aliasId) {
    const aliasScripts = this.getAliasScripts(aliasId);

    for (const script of aliasScripts.values()) {
      if (script.is_active) {
        return script;
      }
    }

    return null;
  }

  /**
   * List all scripts
   * @param {string} aliasId - Alias ID
   * @returns {Promise<Object[]>} List of scripts
   */
  async listScripts(aliasId) {
    const aliasScripts = this.getAliasScripts(aliasId);
    return [...aliasScripts.values()].map((s) => ({
      name: s.name,
      is_active: s.is_active,
      description: s.description,
      created_at: s.created_at,
      updated_at: s.updated_at
    }));
  }

  /**
   * Set the active script
   * @param {string} aliasId - Alias ID
   * @param {string} name - Script name (empty to deactivate all)
   * @returns {Promise<boolean>} Success
   */
  async setActive(aliasId, name) {
    const aliasScripts = this.getAliasScripts(aliasId);

    // Deactivate all scripts
    for (const script of aliasScripts.values()) {
      script.is_active = false;
    }

    // Activate the specified script
    if (name) {
      const script = aliasScripts.get(name);
      if (!script) {
        throw new Error('Script not found');
      }

      script.is_active = true;
    }

    return true;
  }

  /**
   * Delete a script
   * @param {string} aliasId - Alias ID
   * @param {string} name - Script name
   * @returns {Promise<boolean>} Success
   */
  async deleteScript(aliasId, name) {
    const aliasScripts = this.getAliasScripts(aliasId);
    const script = aliasScripts.get(name);

    if (!script) {
      return false;
    }

    if (script.is_active) {
      throw new Error('Cannot delete active script');
    }

    aliasScripts.delete(name);
    return true;
  }

  /**
   * Rename a script
   * @param {string} aliasId - Alias ID
   * @param {string} oldName - Old script name
   * @param {string} newName - New script name
   * @returns {Promise<boolean>} Success
   */
  async renameScript(aliasId, oldName, newName) {
    const aliasScripts = this.getAliasScripts(aliasId);
    const script = aliasScripts.get(oldName);

    if (!script) {
      return false;
    }

    if (aliasScripts.has(newName)) {
      throw new Error('Script with new name already exists');
    }

    script.name = newName;
    script.updated_at = new Date();
    aliasScripts.delete(oldName);
    aliasScripts.set(newName, script);
    return true;
  }

  /**
   * Clear all scripts for an alias
   * @param {string} aliasId - Alias ID
   * @returns {Promise<void>}
   */
  async clearScripts(aliasId) {
    this.scripts.delete(aliasId);
  }
}

/**
 * In-memory vacation response store (for testing)
 */
class MemoryVacationStore {
  constructor() {
    this.responses = new Map();
  }

  /**
   * Check if a vacation response was recently sent
   * @param {string} aliasId - Alias ID
   * @param {string} recipient - Recipient address
   * @param {number} minInterval - Minimum interval in seconds
   * @returns {Promise<boolean>} True if response should be sent
   */
  async shouldSendResponse(aliasId, recipient, minInterval) {
    const key = `${aliasId}:${recipient.toLowerCase()}`;
    const lastSent = this.responses.get(key);
    if (!lastSent) {
      return true;
    }

    const elapsed = (Date.now() - lastSent.getTime()) / 1000;
    return elapsed >= minInterval;
  }

  /**
   * Record a vacation response
   * @param {string} aliasId - Alias ID
   * @param {string} recipient - Recipient address
   * @returns {Promise<void>}
   */
  async recordResponse(aliasId, recipient) {
    const key = `${aliasId}:${recipient.toLowerCase()}`;
    this.responses.set(key, new Date());
  }

  /**
   * Clear vacation responses for an alias
   * @param {string} aliasId - Alias ID
   * @returns {Promise<void>}
   */
  async clearResponses(aliasId) {
    for (const key of this.responses.keys()) {
      if (key.startsWith(`${aliasId}:`)) {
        this.responses.delete(key);
      }
    }
  }
}

module.exports = {
  MemorySieveStore,
  MemoryVacationStore
};
