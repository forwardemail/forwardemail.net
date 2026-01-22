/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Sieve Integration Helper
 *
 * This module integrates Sieve filtering into Forward Email's mail processing pipeline.
 * It hooks into the message delivery flow to apply user-defined Sieve scripts before
 * messages are stored to mailboxes.
 *
 * Integration points:
 * - parse-payload.js: Before storing incoming messages to INBOX
 * - on-data-mx.js: For forwarding decisions
 *
 * @see RFC 5228 - Sieve: An Email Filtering Language
 */

const { Buffer } = require('node:buffer');

const mongoose = require('mongoose');
const { simpleParser } = require('mailparser');
const SieveEngine = require('./engine');
const { SieveFilterHandler } = require('./filter-handler');
const {
  SieveSecurityValidator,
  SieveRateLimiter,
  SieveAuditLogger,
  checkDenylist
} = require('./security');

// Use no-op logger/config in test environments where the full config isn't available
let config;
let logger;
try {
  config = require('#config');
} catch {
  config = {};
}

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

// Default Sieve configuration
const DEFAULT_CONFIG = {
  maxScriptSize: 1024 * 1024, // 1MB (matches Dovecot default)
  maxScriptCount: 15,
  maxRedirectsPerScript: 5,
  maxRedirectsPerDay: 100,
  maxVacationsPerHour: 10,
  allowedRedirectDomains: [], // Empty = allow all (can be restricted per-domain)
  protectedHeaders: [
    'received',
    'dkim-signature',
    'domainkey-signature',
    'arc-seal',
    'arc-message-signature',
    'arc-authentication-results',
    'authentication-results',
    'return-path',
    'delivered-to',
    'x-original-to'
  ],
  enabledExtensions: [
    // Core extensions (RFC 5228)
    'fileinto',
    'reject',
    'ereject',
    'envelope',
    // 'encoded-character', // Not implemented - requires parser changes
    'comparator-i;ascii-casemap',
    'comparator-i;octet',
    // Common extensions
    'copy',
    'body',
    'vacation',
    'vacation-seconds',
    'variables',
    'imap4flags',
    'relational',
    'comparator-i;ascii-numeric',
    // Advanced extensions
    'editheader',
    'date',
    'index',
    'regex',
    'enotify',
    'environment',
    // Mailbox extensions
    'mailbox',
    'special-use',
    // Utility extensions
    'duplicate',
    'ihave',
    'subaddress'
    // NOT IMPLEMENTED (require external dependencies):
    // - mboxmetadata, servermetadata (require IMAP METADATA extension)
    // - include (security risk, requires global script storage)
    // - extracttext, foreverypart, mime, replace, enclose (complex MIME manipulation)
  ]
};

/**
 * Sieve Integration Manager
 *
 * Manages Sieve script execution for incoming mail.
 */
class SieveIntegration {
  /**
   * Create a new SieveIntegration instance
   * @param {Object} options - Configuration options
   * @param {Object} options.store - Sieve script store instance
   * @param {Object} options.client - Redis client for rate limiting
   * @param {Object} options.resolver - DNS resolver for denylist checking
   * @param {Object} options.config - Override default configuration
   */
  constructor(options = {}) {
    this.store = options.store;
    this.client = options.client;
    this.resolver = options.resolver;
    this.config = { ...DEFAULT_CONFIG, ...options.config };

    // Initialize security components
    this.securityValidator = new SieveSecurityValidator({
      maxScriptSize: this.config.maxScriptSize,
      maxRedirects: this.config.maxRedirectsPerScript,
      allowedRedirectDomains: this.config.allowedRedirectDomains,
      protectedHeaders: this.config.protectedHeaders,
      allowedExtensions: this.config.enabledExtensions
    });

    this.rateLimiter = new SieveRateLimiter({
      client: this.client,
      maxRedirectsPerDay: this.config.maxRedirectsPerDay,
      maxVacationsPerHour: this.config.maxVacationsPerHour
    });

    this.auditLogger = new SieveAuditLogger({
      logger
    });

    // Initialize engine with enabled extensions
    this.engine = new SieveEngine({
      extensions: this.config.enabledExtensions
    });
  }

  /**
   * Process an incoming message through Sieve filtering
   *
   * @param {Object} params - Processing parameters
   * @param {string} params.aliasId - Alias ID to get scripts for
   * @param {string} params.aliasAddress - Full email address of the alias
   * @param {Buffer} params.raw - Raw message content
   * @param {Object} params.envelope - SMTP envelope (from, to)
   * @param {Object} params.session - Session information
   * @returns {Promise<Object>} Processing result with actions to take
   */
  async processMessage({ aliasId, aliasAddress, raw, envelope, session }) {
    const result = {
      // Default action is to keep the message in INBOX
      action: 'keep',
      folder: 'INBOX',
      flags: [],
      reject: null,
      redirects: [],
      vacation: null,
      discarded: false,
      scriptExecuted: false,
      errors: [],
      // Header modifications (editheader extension)
      headerChanges: [],
      modifiedRaw: null,
      // Notifications (enotify extension)
      notifications: [],
      // Duplicate tracking info
      duplicateId: null,
      isDuplicate: false
    };

    try {
      if (!this.store || typeof this.store.getActiveScript !== 'function') {
        return result;
      }

      // Get active script for this alias
      const script = await this.store.getActiveScript(aliasId);

      if (!script) {
        // No active script, use default behavior (keep in INBOX)
        return result;
      }

      result.scriptExecuted = true;

      // Parse the message for Sieve processing
      const message = await this.parseMessageForSieve(raw, envelope);

      // Create filter handler
      const filterHandler = new SieveFilterHandler({
        store: this.store,
        rateLimiter: this.rateLimiter,
        auditLogger: this.auditLogger,
        aliasId,
        aliasAddress
      });

      // Create Redis-based duplicate cache for persistent duplicate detection
      const duplicateCache = this.client
        ? await this.createDuplicateCache(aliasId)
        : null;

      // Execute the Sieve script with environment context
      const filterResult = await filterHandler.executeScript(
        script.content,
        message,
        {
          aliasId,
          aliasAddress,
          session,
          duplicateCache,
          // Environment info from session for RFC 5183
          domain: aliasAddress.split('@')[1] || '',
          host: session?.resolvedClientHostname || '',
          remoteHost: session?.resolvedClientHostname || '',
          remoteIp: session?.remoteAddress || ''
        }
      );

      // Map filter result to integration result
      if (filterResult.discard) {
        result.action = 'discard';
        result.discarded = true;
        // Log discard action for user debugging
        logger.info('sieve discarded', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'discard',
            script: script.name,
            alias: aliasAddress
          }
        });
      } else if (filterResult.reject) {
        result.action = 'reject';
        result.reject = filterResult.reject;
        // Log reject action for user debugging
        logger.info('sieve rejected', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'reject',
            script: script.name,
            alias: aliasAddress,
            reason: filterResult.reject.message || filterResult.reject
          }
        });
      } else {
        result.action = 'keep';
      }

      // Set folder (fileinto action)
      if (filterResult.fileinto && filterResult.fileinto.length > 0) {
        // Use the first fileinto destination as primary folder
        result.folder = filterResult.fileinto[0].folder;
        // Additional fileinto destinations for copies
        result.additionalFolders = filterResult.fileinto
          .slice(1)
          .map((f) => f.folder);
        // Log fileinto action for user debugging
        logger.info('sieve fileinto', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'fileinto',
            script: script.name,
            alias: aliasAddress,
            folder: result.folder,
            additionalFolders: result.additionalFolders
          }
        });
      }

      // Set flags (imap4flags)
      if (filterResult.flags && filterResult.flags.length > 0) {
        result.flags = filterResult.flags;
        // Log flags action for user debugging
        logger.info('sieve flags', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'setflag',
            script: script.name,
            alias: aliasAddress,
            flags: result.flags
          }
        });
      }

      // Handle redirects
      if (filterResult.redirect && filterResult.redirect.length > 0) {
        // Check denylist for all redirect addresses first
        const redirectAddresses = filterResult.redirect.map((r) => r.address);
        const denylistResult = await checkDenylist(
          redirectAddresses,
          this.client,
          this.resolver
        );

        // Check rate limits for redirects
        for (const redirect of filterResult.redirect) {
          // Check if this address is denylisted
          const isDenied = denylistResult.deniedAddresses.find(
            (d) => d.address === redirect.address
          );
          if (isDenied) {
            result.errors.push({
              type: 'denylist',
              message: `Redirect address is denylisted: ${redirect.address}`,
              address: redirect.address,
              reason: isDenied.reason
            });
            // Log denylist block for user debugging
            logger.warn('sieve redirect blocked by denylist', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'redirect',
                script: script.name,
                alias: aliasAddress,
                redirectTo: redirect.address,
                blocked: true,
                reason: isDenied.reason
              }
            });
            continue;
          }

          const rateLimitCheck = await this.rateLimiter.checkRedirect(aliasId);
          if (rateLimitCheck.allowed) {
            result.redirects.push({
              address: redirect.address,
              copy: redirect.copy || false
            });
            await this.rateLimiter.recordRedirect(aliasId, redirect.address);
            this.auditLogger.logRedirect(
              aliasId,
              redirect.address,
              aliasAddress
            );
            // Log redirect action for user debugging
            logger.info('sieve redirect', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'redirect',
                script: script.name,
                alias: aliasAddress,
                redirectTo: redirect.address,
                copy: redirect.copy || false
              }
            });
          } else {
            result.errors.push({
              type: 'rate_limit',
              message: `Redirect rate limit exceeded: ${rateLimitCheck.remaining} remaining`
            });
            // Log rate limit for user debugging
            logger.warn('sieve redirect rate limited', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'redirect',
                script: script.name,
                alias: aliasAddress,
                redirectTo: redirect.address,
                rateLimitRemaining: rateLimitCheck.remaining
              }
            });
          }
        }
      }

      // Handle vacation auto-reply
      if (filterResult.vacation) {
        const vacationCheck = await this.rateLimiter.checkVacation(aliasId);
        if (vacationCheck.allowed) {
          result.vacation = filterResult.vacation;
          this.auditLogger.logVacation(
            aliasId,
            envelope.from,
            filterResult.vacation.subject
          );
          // Log vacation action for user debugging
          logger.info('sieve vacation', {
            ignore_hook: false,
            session,
            sieve: {
              action: 'vacation',
              script: script.name,
              alias: aliasAddress,
              subject: filterResult.vacation.subject,
              recipient: envelope.from
            }
          });
        } else {
          result.errors.push({
            type: 'rate_limit',
            message: `Vacation rate limit exceeded: ${vacationCheck.remaining} remaining`
          });
          // Log rate limit for user debugging
          logger.warn('sieve vacation rate limited', {
            ignore_hook: false,
            session,
            sieve: {
              action: 'vacation',
              script: script.name,
              alias: aliasAddress,
              rateLimitRemaining: vacationCheck.remaining
            }
          });
        }
      }

      // Handle header changes (editheader extension)
      if (filterResult.headerChanges && filterResult.headerChanges.length > 0) {
        result.headerChanges = filterResult.headerChanges;
        // Apply header changes to raw message
        result.modifiedRaw = await this.applyHeaderChanges(
          raw,
          filterResult.headerChanges
        );
        // Log header changes for user debugging
        logger.info('sieve editheader', {
          ignore_hook: false,
          session,
          sieve: {
            action: 'editheader',
            script: script.name,
            alias: aliasAddress,
            changes: filterResult.headerChanges.map((c) => ({
              action: c.action,
              name: c.name
            }))
          }
        });
      }

      // Handle notifications (enotify extension)
      if (filterResult.notifications && filterResult.notifications.length > 0) {
        for (const notification of filterResult.notifications) {
          try {
            await this.sendNotification(notification, {
              aliasId,
              aliasAddress,
              envelope,
              session
            });
            result.notifications.push({
              ...notification,
              sent: true
            });
            // Log notification for user debugging
            logger.info('sieve notify sent', {
              ignore_hook: false,
              session,
              sieve: {
                action: 'notify',
                script: script.name,
                alias: aliasAddress,
                method: notification.method,
                importance: notification.importance
              }
            });
          } catch (err) {
            result.notifications.push({
              ...notification,
              sent: false,
              error: err.message
            });
            result.errors.push({
              type: 'notification_error',
              message: `Failed to send notification: ${err.message}`,
              method: notification.method
            });
            logger.error('sieve notify failed', {
              ignore_hook: false,
              session,
              err,
              sieve: {
                action: 'notify',
                script: script.name,
                alias: aliasAddress,
                method: notification.method
              }
            });
          }
        }
      }

      // Log script execution summary
      this.auditLogger.logScriptExecution(aliasId, script.name, result.action);
      logger.info('sieve executed', {
        ignore_hook: false,
        session,
        sieve: {
          script: script.name,
          alias: aliasAddress,
          result: result.action,
          folder: result.folder,
          flags: result.flags,
          redirectCount: result.redirects.length,
          hasVacation: Boolean(result.vacation),
          headerChangeCount: result.headerChanges.length,
          notificationCount: result.notifications.length,
          errorCount: result.errors.length
        }
      });
    } catch (err) {
      logger.error('sieve execution error', {
        ignore_hook: false,
        session,
        err,
        sieve: {
          alias: aliasAddress,
          error: err.message
        }
      });
      result.errors.push({
        type: 'execution_error',
        message: err.message
      });
      // On error, fall back to default behavior (keep in INBOX)
    }

    return result;
  }

  /**
   * Parse a raw message into a format suitable for Sieve processing
   *
   * @param {Buffer} raw - Raw message content
   * @param {Object} envelope - SMTP envelope
   * @returns {Promise<Object>} Parsed message object
   */
  async parseMessageForSieve(raw, envelope) {
    const parsed = await simpleParser(raw);

    // Build headers object
    const headers = {};
    if (parsed.headers) {
      for (const [key, value] of parsed.headers) {
        const lowerKey = key.toLowerCase();
        if (headers[lowerKey]) {
          if (Array.isArray(headers[lowerKey])) {
            headers[lowerKey].push(value);
          } else {
            headers[lowerKey] = [headers[lowerKey], value];
          }
        } else {
          headers[lowerKey] = value;
        }
      }
    }

    // Ensure common headers exist
    if (!headers.from && parsed.from) {
      headers.from = parsed.from.text || parsed.from.value?.[0]?.address;
    }

    if (!headers.to && parsed.to) {
      headers.to =
        parsed.to.text || parsed.to.value?.map((v) => v.address).join(', ');
    }

    if (!headers.subject && parsed.subject) {
      headers.subject = parsed.subject;
    }

    if (!headers.date && parsed.date) {
      headers.date = parsed.date.toISOString();
    }

    return {
      headers,
      envelope: {
        from: envelope.from || parsed.from?.value?.[0]?.address || '',
        to: envelope.to || parsed.to?.value?.map((v) => v.address) || []
      },
      body: {
        text: parsed.text || '',
        html: parsed.html || ''
      },
      size: Buffer.byteLength(raw),
      raw
    };
  }

  /**
   * Validate a Sieve script before saving
   *
   * @param {string} content - Script content
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateScript(content, options = {}) {
    return this.securityValidator.validateScript(content, {
      ...options,
      maxSize: this.config.maxScriptSize
    });
  }

  /**
   * Create a Redis-based duplicate cache for persistent duplicate detection (RFC 7352)
   *
   * @param {string} aliasId - Alias ID for namespacing
   * @returns {Promise<Object>} Duplicate cache object with has/add methods
   */
  async createDuplicateCache(aliasId) {
    const { client } = this;
    const prefix = `sieve:duplicate:${aliasId}:`;
    const defaultTtl = 7 * 24 * 60 * 60; // 7 days default TTL

    return {
      /**
       * Check if a key exists in the duplicate cache
       * @param {string} key - The duplicate key
       * @returns {Promise<boolean>} True if duplicate
       */
      async has(key) {
        if (!client) return false;
        const exists = await client.exists(prefix + key);
        return exists === 1;
      },

      /**
       * Add a key to the duplicate cache
       * @param {string} key - The duplicate key
       * @param {number} seconds - TTL in seconds (from :seconds tag)
       */
      async add(key, seconds) {
        if (!client) return;
        const ttl = seconds || defaultTtl;
        await client.set(prefix + key, '1', 'EX', ttl);
      }
    };
  }

  /**
   * Apply header changes to raw message (editheader extension)
   *
   * @param {Buffer} raw - Original raw message
   * @param {Array} changes - Array of header changes
   * @returns {Promise<Buffer>} Modified raw message
   */
  async applyHeaderChanges(raw, changes) {
    if (!changes || changes.length === 0) {
      return raw;
    }

    const rawStr = raw.toString('utf8');
    // Split into headers and body at first double CRLF
    const headerEndIndex = rawStr.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) {
      // No body separator found, treat entire message as headers
      return raw;
    }

    let headerSection = rawStr.slice(0, headerEndIndex);
    const bodySection = rawStr.slice(headerEndIndex);

    // Parse existing headers into array of {name, value} objects
    const headerLines = headerSection.split('\r\n');
    const headers = [];
    let currentHeader = null;

    for (const line of headerLines) {
      if (line.startsWith(' ') || line.startsWith('\t')) {
        // Continuation of previous header
        if (currentHeader) {
          currentHeader.value += '\r\n' + line;
        }
      } else {
        // New header
        if (currentHeader) {
          headers.push(currentHeader);
        }

        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          currentHeader = {
            name: line.slice(0, colonIndex),
            value: line.slice(colonIndex + 1)
          };
        } else {
          currentHeader = null;
        }
      }
    }

    if (currentHeader) {
      headers.push(currentHeader);
    }

    // Apply changes
    for (const change of changes) {
      if (change.action === 'add') {
        const newHeader = {
          name: change.name,
          value: ' ' + change.value
        };
        if (change.last) {
          // Add at end of headers
          headers.push(newHeader);
        } else {
          // Add at beginning of headers
          headers.unshift(newHeader);
        }
      } else if (change.action === 'delete') {
        // Find and remove matching headers
        const nameLower = change.name.toLowerCase();
        let matchCount = 0;
        for (let i = headers.length - 1; i >= 0; i--) {
          if (headers[i].name.toLowerCase() === nameLower) {
            // Check if specific index is requested
            if (change.index !== undefined) {
              matchCount++;
              if (matchCount === change.index) {
                headers.splice(i, 1);
                break;
              }
            } else if (change.values && change.values.length > 0) {
              // Check if value matches
              const headerValue = headers[i].value.trim();
              const matches = change.values.some((v) => {
                if (change.matchType === 'is') {
                  return headerValue.toLowerCase() === v.toLowerCase();
                }

                if (change.matchType === 'contains') {
                  return headerValue.toLowerCase().includes(v.toLowerCase());
                }

                if (change.matchType === 'matches') {
                  // Simple glob matching
                  const regex = new RegExp(
                    '^' +
                      v
                        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                        .replace(/\\\*/g, '.*')
                        .replace(/\\\?/g, '.') +
                      '$',
                    'i'
                  );
                  return regex.test(headerValue);
                }

                return false;
              });
              if (matches) {
                headers.splice(i, 1);
              }
            } else {
              // Delete all matching headers
              headers.splice(i, 1);
            }
          }
        }
      }
    }

    // Rebuild header section
    headerSection = headers.map((h) => h.name + ':' + h.value).join('\r\n');

    return Buffer.from(headerSection + bodySection, 'utf8');
  }

  /**
   * Send a notification (enotify extension)
   *
   * @param {Object} notification - Notification details
   * @param {Object} context - Context information
   * @returns {Promise<void>}
   */
  async sendNotification(notification, context) {
    const { method, message, from, importance } = notification;

    // Parse the notification method URI
    const methodMatch = method.match(/^([a-z]+):(.+)$/i);
    if (!methodMatch) {
      throw new Error(`Invalid notification method: ${method}`);
    }

    const [, scheme, target] = methodMatch;

    switch (scheme.toLowerCase()) {
      case 'mailto': {
        // Send email notification
        // Access Emails model via mongoose connection to avoid circular dependency
        const conn = mongoose.connections.find(
          (c) => c[Symbol.for('connection.name')] === 'MONGO_URI'
        );
        if (!conn || !conn.models || !conn.models.Emails) {
          throw new Error(
            'Email notification not available - Emails model not loaded'
          );
        }

        const { Emails } = conn.models;

        // Parse mailto URI
        const emailTarget = target.split('?')[0];
        const subjectMatch =
          message || `Notification from ${context.aliasAddress}`;

        await Emails.queue({
          info: {
            message: `From: ${
              from || context.aliasAddress
            }\r\nTo: ${emailTarget}\r\nSubject: ${subjectMatch}\r\nX-Sieve-Notify: true\r\nX-Sieve-Importance: ${
              importance || 'normal'
            }\r\n\r\n${message || 'You have received a notification.'}`,
            envelope: {
              from: from || context.aliasAddress,
              to: [emailTarget]
            }
          },
          user: { id: context.session?.user?.alias_user_id || context.aliasId },
          is_bounce: false
        });
        break;
      }

      case 'xmpp': {
        // XMPP notifications not implemented - log and skip
        logger.warn('sieve notify xmpp not implemented', {
          ignore_hook: true,
          sieve: { method, target }
        });
        throw new Error('XMPP notifications are not implemented');
      }

      default: {
        throw new Error(`Unsupported notification scheme: ${scheme}`);
      }
    }
  }

  /**
   * Get supported Sieve capabilities
   *
   * @returns {Object} Capabilities object
   */
  getCapabilities() {
    return {
      capabilities: this.config.enabledExtensions,
      limits: {
        max_script_size: this.config.maxScriptSize,
        max_script_count: this.config.maxScriptCount,
        max_redirects_per_script: this.config.maxRedirectsPerScript,
        max_redirects_per_day: this.config.maxRedirectsPerDay,
        max_vacations_per_hour: this.config.maxVacationsPerHour
      }
    };
  }
}

/**
 * Create a Sieve integration instance with Forward Email configuration
 *
 * @param {Object} options - Options
 * @param {Object} options.store - Sieve script store
 * @param {Object} options.client - Redis client
 * @param {Object} options.resolver - DNS resolver for denylist checking
 * @returns {SieveIntegration} Integration instance
 */
function createSieveIntegration(options = {}) {
  // Merge with config from environment/config file
  const sieveConfig = {
    maxScriptSize: config.sieve?.maxScriptSize || DEFAULT_CONFIG.maxScriptSize,
    maxScriptCount:
      config.sieve?.maxScriptCount || DEFAULT_CONFIG.maxScriptCount,
    maxRedirectsPerScript:
      config.sieve?.maxRedirectsPerScript ||
      DEFAULT_CONFIG.maxRedirectsPerScript,
    maxRedirectsPerDay:
      config.sieve?.maxRedirectsPerDay || DEFAULT_CONFIG.maxRedirectsPerDay,
    maxVacationsPerHour:
      config.sieve?.maxVacationsPerHour || DEFAULT_CONFIG.maxVacationsPerHour,
    allowedRedirectDomains:
      config.sieve?.allowedRedirectDomains ||
      DEFAULT_CONFIG.allowedRedirectDomains,
    protectedHeaders:
      config.sieve?.protectedHeaders || DEFAULT_CONFIG.protectedHeaders,
    enabledExtensions:
      config.sieve?.enabledExtensions || DEFAULT_CONFIG.enabledExtensions
  };

  const store = options.store || getDefaultSieveStore();

  return new SieveIntegration({
    store,
    client: options.client,
    resolver: options.resolver,
    config: sieveConfig
  });
}

function getDefaultSieveStore() {
  try {
    const conn = mongoose.connections.find(
      (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
    );
    if (
      conn &&
      conn.models &&
      conn.models.SieveScripts &&
      typeof conn.models.SieveScripts.getActiveScript === 'function'
    ) {
      return conn.models.SieveScripts;
    }
  } catch {}

  return null;
}

module.exports = {
  SieveIntegration,
  createSieveIntegration
};
