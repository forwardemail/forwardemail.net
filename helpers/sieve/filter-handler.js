/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Filter Handler
 *
 * This module integrates Sieve script execution with the mail processing
 * pipeline. It handles:
 * - Loading active scripts for aliases (each alias can have its own Sieve scripts)
 * - Executing scripts against incoming messages
 * - Applying filter actions (fileinto, redirect, reject, etc.)
 * - Vacation auto-reply handling
 *
 * Scripts are stored per-alias via the SieveScripts model (app/models/sieve-scripts.js)
 */

const { parse } = require('./parser');
const SieveEngine = require('./engine');

// Use a no-op logger in test environments where the full config isn't available
let logger;
try {
  logger = require('#helpers/logger');
} catch {
  logger = {
    debug() {},
    info() {},
    warn() {},
    error() {}
  };
}

// Supported capabilities for engine creation
const SUPPORTED_CAPABILITIES = [
  'fileinto',
  'reject',
  'ereject',
  'envelope',
  // 'encoded-character', // Not implemented - requires parser changes
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

/**
 * Create a new Sieve engine instance
 * @param {Object} options - Engine options
 * @returns {SieveEngine} Engine instance
 */
function createEngine(options = {}) {
  return new SieveEngine({
    capabilities: SUPPORTED_CAPABILITIES,
    ...options
  });
}

/**
 * Sieve Filter Handler
 */
class SieveFilterHandler {
  /**
   * Create a new filter handler
   * @param {Object} options - Handler options
   * @param {Object} options.store - Script storage backend
   * @param {Object} options.logger - Logger instance
   * @param {Function} options.sendMail - Function to send mail
   * @param {Object} options.vacationStore - Store for vacation response tracking
   */
  constructor(options = {}) {
    this.store = options.store;
    this.logger = options.logger || console;
    this.sendMail = options.sendMail;
    this.vacationStore = options.vacationStore;
    this.engine = createEngine({ logger: this.logger });
  }

  /**
   * Process a message through Sieve filters
   * @param {string} aliasId - Alias ID (scripts are per-alias)
   * @param {Object} message - The email message
   * @param {Object} context - Processing context
   * @returns {Promise<Object>} Filter result with actions
   */
  async processMessage(aliasId, message, context = {}) {
    // Get active script for alias
    const script = await this.store.getActiveScript(aliasId);

    if (!script) {
      // No active script, use implicit keep
      return {
        actions: [{ type: 'keep', flags: [] }],
        filtered: false
      };
    }

    try {
      // Parse and execute the script
      const ast = parse(script.content);
      const result = await this.engine.execute(ast, message, {
        ...context,
        environment: {
          domain: context.domain || '',
          host: context.host || '',
          location: 'MDA',
          name: 'Forward Email',
          phase: 'during',
          remoteHost: context.remoteHost || '',
          remoteIp: context.remoteIp || '',
          version: '1.0'
        }
      });

      // Log successful script execution with action summary
      logger.info('sieve script processed', {
        ignore_hook: true,
        sieve: {
          aliasId,
          scriptName: script.name,
          actionCount: result.actions.length,
          actions: result.actions.map((a) => a.type)
        }
      });

      return {
        actions: result.actions,
        variables: result.variables,
        flags: result.flags,
        filtered: true
      };
    } catch (err) {
      // Log script execution error
      logger.error('sieve script error', {
        ignore_hook: false,
        err,
        sieve: {
          aliasId,
          scriptName: script.name,
          error: err.message
        }
      });

      // On error, fall back to implicit keep
      return {
        actions: [{ type: 'keep', flags: [] }],
        filtered: false,
        error: err.message
      };
    }
  }

  /**
   * Execute a Sieve script directly (without fetching from store)
   * @param {string} scriptContent - The Sieve script content
   * @param {Object} message - The email message
   * @param {Object} context - Processing context
   * @returns {Promise<Object>} Filter result in integration format
   */
  async executeScript(scriptContent, message, context = {}) {
    try {
      // Parse and execute the script
      const ast = parse(scriptContent);
      const engineResult = await this.engine.execute(ast, message, {
        ...context,
        environment: {
          domain: context.domain || '',
          host: context.host || '',
          location: 'MDA',
          name: 'Forward Email',
          phase: 'during',
          remoteHost: context.remoteHost || '',
          remoteIp: context.remoteIp || '',
          version: '1.0'
        }
      });

      // Convert engine result to integration format
      const result = {
        fileinto: [],
        redirect: [],
        vacation: null,
        discard: false,
        reject: null,
        flags: engineResult.flags || [],
        headerChanges: [],
        notifications: [],
        implicitKeep: engineResult.implicitKeep !== false
      };

      // Process actions from engine result
      for (const action of engineResult.actions) {
        switch (action.type) {
          case 'fileinto': {
            // Map special-use attribute to folder name if specified (RFC 8579)
            let folder = action.mailbox;
            if (action.specialuse) {
              const specialUseMap = {
                '\\Archive': 'Archive',
                '\\Drafts': 'Drafts',
                '\\Flagged': 'Flagged',
                '\\Junk': 'Junk',
                '\\Sent': 'Sent',
                '\\Trash': 'Trash',
                '\\All': 'All Mail',
                '\\Important': 'Important'
              };
              folder = specialUseMap[action.specialuse] || action.mailbox;
            }

            result.fileinto.push({
              folder,
              flags: action.flags || [],
              create: action.create || false,
              copy: action.copy || false,
              specialuse: action.specialuse || null
            });
            break;
          }

          case 'redirect': {
            result.redirect.push({
              address: action.address,
              copy: action.copy || false
            });
            break;
          }

          case 'discard': {
            result.discard = true;
            break;
          }

          case 'reject':
          case 'ereject': {
            result.reject = {
              message: action.message,
              type: action.type
            };
            break;
          }

          case 'vacation': {
            result.vacation = {
              subject: action.subject,
              message: action.message,
              from: action.from,
              addresses: action.addresses || [],
              days: action.days || 7,
              seconds: action.seconds,
              mime: action.mime || false,
              handle: action.handle
            };
            break;
          }

          case 'addheader': {
            result.headerChanges.push({
              action: 'add',
              name: action.name,
              value: action.value,
              last: action.last || false
            });
            break;
          }

          case 'deleteheader': {
            result.headerChanges.push({
              action: 'delete',
              name: action.name,
              index: action.index,
              matchType: action.matchType,
              values: action.values
            });
            break;
          }

          case 'notify': {
            // Add notification to result for integration to handle
            result.notifications.push({
              method: action.method,
              message: action.message,
              from: action.from,
              importance: action.importance || 'normal',
              options: action.options || {}
            });
            logger.info('sieve notify action', {
              ignore_hook: true,
              sieve: {
                action: 'notify',
                method: action.method,
                importance: action.importance
              }
            });
            break;
          }

          case 'keep': {
            // Keep is implicit, just merge flags
            if (action.flags && action.flags.length > 0) {
              for (const flag of action.flags) {
                if (!result.flags.includes(flag)) {
                  result.flags.push(flag);
                }
              }
            }

            break;
          }

          default: {
            logger.warn('sieve unknown action type', {
              ignore_hook: true,
              sieve: { actionType: action.type }
            });
          }
        }
      }

      return result;
    } catch (err) {
      // Log script execution error
      logger.error('sieve script execution error', {
        ignore_hook: false,
        err,
        sieve: {
          error: err.message
        }
      });

      // Re-throw to let caller handle
      throw err;
    }
  }

  /**
   * Apply filter actions to a message
   * @param {Object} result - Filter result from processMessage
   * @param {Object} message - The original message
   * @param {Object} context - Processing context
   * @returns {Promise<Object>} Applied actions result
   */
  async applyActions(result, message, context = {}) {
    const applied = {
      kept: false,
      filed: [],
      redirected: [],
      rejected: false,
      discarded: false,
      vacation: null,
      headerChanges: []
    };

    for (const action of result.actions) {
      switch (action.type) {
        case 'keep': {
          applied.kept = true;
          applied.flags = action.flags;
          logger.info('sieve action keep', {
            ignore_hook: true,
            sieve: { action: 'keep', flags: action.flags }
          });
          break;
        }

        case 'fileinto': {
          // Merge action flags with global flags from result
          const fileFlags = [...(action.flags || [])];
          if (result.flags) {
            for (const flag of result.flags) {
              if (!fileFlags.includes(flag)) {
                fileFlags.push(flag);
              }
            }
          }

          applied.filed.push({
            mailbox: action.mailbox,
            flags: fileFlags,
            create: action.create
          });
          logger.info('sieve action fileinto', {
            ignore_hook: true,
            sieve: {
              action: 'fileinto',
              mailbox: action.mailbox,
              flags: fileFlags,
              copy: action.copy
            }
          });
          // With :copy, implicit keep is preserved
          if (action.copy) {
            applied.kept = true;
          }

          break;
        }

        case 'redirect': {
          applied.redirected.push({
            address: action.address
          });
          logger.info('sieve action redirect', {
            ignore_hook: true,
            sieve: {
              action: 'redirect',
              address: action.address,
              copy: action.copy
            }
          });
          // With :copy, implicit keep is preserved
          if (action.copy) {
            applied.kept = true;
          }

          break;
        }

        case 'discard': {
          applied.discarded = true;
          applied.kept = false;
          logger.info('sieve action discard', {
            ignore_hook: true,
            sieve: { action: 'discard' }
          });
          break;
        }

        case 'reject':
        case 'ereject': {
          applied.rejected = true;
          applied.rejectMessage = action.message;
          applied.kept = false;
          logger.info('sieve action reject', {
            ignore_hook: true,
            sieve: {
              action: action.type,
              message: action.message
            }
          });
          break;
        }

        case 'vacation': {
          // Handle vacation auto-reply
          applied.vacation = await this.handleVacation(
            action,
            message,
            context
          );
          logger.info('sieve action vacation', {
            ignore_hook: true,
            sieve: {
              action: 'vacation',
              subject: action.subject,
              days: action.days
            }
          });
          break;
        }

        case 'addheader': {
          applied.headerChanges.push({
            action: 'add',
            name: action.name,
            value: action.value,
            last: action.last
          });
          logger.info('sieve action addheader', {
            ignore_hook: true,
            sieve: {
              action: 'addheader',
              name: action.name
            }
          });
          break;
        }

        case 'deleteheader': {
          applied.headerChanges.push({
            action: 'delete',
            name: action.name,
            index: action.index,
            matchType: action.matchType,
            values: action.values
          });
          logger.info('sieve action deleteheader', {
            ignore_hook: true,
            sieve: {
              action: 'deleteheader',
              name: action.name
            }
          });
          break;
        }

        case 'notify': {
          // Handle notification (implementation depends on notification service)
          logger.info('sieve action notify', {
            ignore_hook: true,
            sieve: {
              action: 'notify',
              method: action.method,
              importance: action.importance
            }
          });
          break;
        }

        default: {
          logger.warn('sieve unknown action', {
            ignore_hook: false,
            session: context.session,
            sieve: {
              action: action.type,
              script: context.scriptName || 'unknown',
              alias: context.aliasId || 'unknown'
            }
          });
        }
      }
    }

    // If nothing explicitly kept or filed, and not discarded/rejected/redirected, keep in INBOX
    // Redirect without copy cancels implicit keep
    if (
      !applied.kept &&
      applied.filed.length === 0 &&
      applied.redirected.length === 0 &&
      !applied.discarded &&
      !applied.rejected
    ) {
      applied.kept = true;
    }

    return applied;
  }

  /**
   * Handle vacation auto-reply
   * @param {Object} action - Vacation action
   * @param {Object} message - The original message
   * @param {Object} context - Processing context
   * @returns {Promise<Object|null>} Vacation response info or null
   */
  async handleVacation(action, message, context) {
    // Get sender address - prefer headers.from for vacation checks
    // as envelope.from may be different (e.g., bounce address)
    const from =
      message.headers?.from || message.envelope?.from || message.from;

    if (!from) {
      return null;
    }

    // Parse sender address
    const senderMatch = from.match(/<([^>]+)>/) || [null, from];
    const senderAddress = senderMatch[1]?.toLowerCase();

    if (!senderAddress) {
      return null;
    }

    // Check if we should respond (RFC 5230 requirements)
    if (!this.shouldSendVacation(message, senderAddress, context)) {
      return null;
    }

    // Check vacation response tracking
    const vacationKey = this.getVacationKey(
      context.userId,
      senderAddress,
      action.handle
    );

    const interval = action.seconds || (action.days || 7) * 86_400;

    if (this.vacationStore) {
      const lastResponse = await this.vacationStore.get(vacationKey);
      if (lastResponse) {
        const elapsed = (Date.now() - lastResponse) / 1000;
        if (elapsed < interval) {
          return null; // Already responded within interval
        }
      }
    }

    // Build vacation response
    const response = {
      to: senderAddress,
      from: action.from || context.userAddress,
      subject:
        action.subject || `Re: ${message.headers?.subject || 'Your message'}`,
      inReplyTo: message.headers?.['message-id'],
      references: message.headers?.['message-id'],
      autoSubmitted: 'auto-replied',
      body: action.message,
      mime: action.mime
    };

    // Record the response
    if (this.vacationStore) {
      await this.vacationStore.set(vacationKey, Date.now());
    }

    // Send the vacation response
    if (this.sendMail) {
      try {
        await this.sendMail(response);
      } catch (err) {
        this.logger.error('Failed to send vacation response:', err);
        return null;
      }
    }

    return response;
  }

  /**
   * Check if vacation response should be sent
   * @param {Object} message - The message
   * @param {string} senderAddress - Sender address
   * @param {Object} context - Processing context
   * @returns {boolean} True if should send
   */
  shouldSendVacation(message, senderAddress, context) {
    const headers = message.headers || {};

    // Don't respond to messages from ourselves
    if (
      context.userAddresses &&
      context.userAddresses.includes(senderAddress)
    ) {
      return false;
    }

    // Don't respond to bulk mail
    const precedence = headers.precedence?.toLowerCase();
    if (
      precedence === 'bulk' ||
      precedence === 'list' ||
      precedence === 'junk'
    ) {
      return false;
    }

    // Don't respond to auto-submitted messages
    const autoSubmitted = headers['auto-submitted']?.toLowerCase();
    if (autoSubmitted && autoSubmitted !== 'no') {
      return false;
    }

    // Don't respond to mailing lists
    if (
      headers['list-id'] ||
      headers['list-unsubscribe'] ||
      headers['x-mailing-list']
    ) {
      return false;
    }

    // Don't respond to bounces (null sender)
    if (!senderAddress || senderAddress === '' || senderAddress === '<>') {
      return false;
    }

    // Don't respond to common no-reply addresses
    const noReplyPatterns = [
      /^no-?reply@/i,
      /^do-?not-?reply@/i,
      /^mailer-?daemon@/i,
      /^postmaster@/i,
      /^bounce/i
    ];

    for (const pattern of noReplyPatterns) {
      if (pattern.test(senderAddress)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate vacation tracking key
   * @param {string} userId - User ID
   * @param {string} senderAddress - Sender address
   * @param {string} handle - Optional handle
   * @returns {string} Tracking key
   */
  getVacationKey(userId, senderAddress, handle) {
    const parts = ['vacation', userId, senderAddress];
    if (handle) {
      parts.push(handle);
    }

    return parts.join(':');
  }

  /**
   * Convert filter result to WildDuck-compatible format
   * @param {Object} result - Filter result
   * @returns {Object} WildDuck filter result
   */
  toWildDuckFormat(result) {
    const actions = [];

    if (result.kept) {
      actions.push({
        action: 'keep',
        mailbox: 'INBOX',
        flags: result.flags || []
      });
    }

    for (const filed of result.filed || []) {
      actions.push({
        action: 'move',
        mailbox: filed.mailbox,
        flags: filed.flags || [],
        create: filed.create
      });
    }

    for (const redirected of result.redirected || []) {
      actions.push({
        action: 'forward',
        address: redirected.address
      });
    }

    if (result.discarded) {
      actions.push({ action: 'discard' });
    }

    if (result.rejected) {
      actions.push({
        action: 'reject',
        message: result.rejectMessage
      });
    }

    return {
      actions,
      headerChanges: result.headerChanges || [],
      vacation: result.vacation
    };
  }
}

/**
 * Simple in-memory vacation response store
 */
class MemoryVacationStore {
  constructor() {
    this.responses = new Map();
  }

  async get(key) {
    return this.responses.get(key);
  }

  async set(key, value) {
    this.responses.set(key, value);
  }

  async delete(key) {
    this.responses.delete(key);
  }

  async clear() {
    this.responses.clear();
  }
}

/**
 * Redis-based vacation response store
 */
class RedisVacationStore {
  /**
   * Create a new Redis vacation store
   * @param {Object} options - Store options
   * @param {Object} options.client - Redis client
   * @param {number} options.ttl - TTL in seconds (default: 30 days)
   */
  constructor(options = {}) {
    this.client = options.client;
    this.ttl = options.ttl || 30 * 24 * 60 * 60;
    this.prefix = options.prefix || 'sieve:vacation:';
  }

  async get(key) {
    const value = await this.client.get(this.prefix + key);
    return value ? Number.parseInt(value, 10) : null;
  }

  async set(key, value) {
    await this.client.setex(this.prefix + key, this.ttl, String(value));
  }

  async delete(key) {
    await this.client.del(this.prefix + key);
  }
}

module.exports = {
  SieveFilterHandler,
  MemoryVacationStore,
  RedisVacationStore
};
