/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Security Module
 *
 * This module provides comprehensive security measures for Sieve scripts
 * to prevent abuse, hijacking, and malicious behavior. It addresses:
 *
 * - CVE-2023-26430: Control character injection
 * - Email hijacking via malicious redirects
 * - Header manipulation attacks
 * - Vacation/auto-reply abuse for spam
 * - Resource exhaustion attacks
 * - Extension bypass attempts
 */

const { Buffer } = require('node:buffer');
const { parse } = require('./parser');

// Use defaults in test environments where the full config isn't available
let config;
let isDenylisted;
try {
  config = require('#config');
} catch {
  config = { denylist: new Set() };
}

try {
  isDenylisted = require('#helpers/is-denylisted');
} catch {
  isDenylisted = null;
}

// Core Sieve tests (RFC 5228 Section 5) - these are always available
// and don't need to be declared with "require", but some scripts
// incorrectly include them. We accept them silently for compatibility.
const CORE_TESTS = new Set([
  'address',
  'allof',
  'anyof',
  'exists',
  'false',
  'header',
  'not',
  'size',
  'true'
]);

/**
 * Default security configuration
 */
const DEFAULT_SECURITY_CONFIG = {
  // Script limits
  maxScriptSize: 1024 * 1024, // 1MB
  maxScriptCount: 100,
  maxRulesPerScript: 500,
  maxNestingDepth: 10,

  // Redirect restrictions
  maxRedirectsPerScript: 10,
  maxRedirectsPerDay: 100,
  allowExternalRedirects: true,
  redirectDomainWhitelist: null, // Null = allow all, array = whitelist
  redirectDomainBlacklist: [
    // Common disposable email domains that could be used for hijacking
  ],

  // Vacation restrictions
  minVacationInterval: 86_400, // 1 day in seconds
  maxVacationMessageSize: 10_240, // 10KB
  maxVacationSubjectLength: 200,
  vacationRateLimitPerHour: 50,

  // Header restrictions
  protectedHeaders: [
    'from',
    'sender',
    'return-path',
    'dkim-signature',
    'arc-seal',
    'arc-message-signature',
    'arc-authentication-results',
    'authentication-results',
    'received',
    'received-spf',
    'message-id',
    'date',
    'mime-version',
    'content-type',
    'content-transfer-encoding'
  ],

  // Extension whitelist (null = allow all configured extensions)
  allowedExtensions: null,

  // Regex restrictions
  maxRegexLength: 500,
  regexTimeout: 1000, // Ms

  // Audit settings
  enableAuditLog: true,
  notifyOnScriptChange: true
};

/**
 * Security validator for Sieve scripts
 */
class SieveSecurityValidator {
  /**
   * Create a new security validator
   * @param {Object} config - Security configuration
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  /**
   * Perform comprehensive security validation on a Sieve script
   * @param {string} script - The Sieve script to validate
   * @param {Object} context - Additional context (userId, domain, etc.)
   * @returns {Object} Validation result with warnings and errors
   */
  validate(script, context = {}) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      securityIssues: [],
      stats: {
        redirectCount: 0,
        vacationCount: 0,
        editheaderCount: 0,
        nestingDepth: 0,
        ruleCount: 0
      }
    };

    // Check script size
    if (Buffer.byteLength(script, 'utf8') > this.config.maxScriptSize) {
      result.valid = false;
      result.errors.push({
        type: 'size_limit',
        message: `Script exceeds maximum size of ${this.config.maxScriptSize} bytes`
      });
      return result;
    }

    // Check for control character injection (CVE-2023-26430)
    const controlCharResult = this.checkControlCharacters(script);
    if (!controlCharResult.valid) {
      result.valid = false;
      result.errors.push(...controlCharResult.errors);
      result.securityIssues.push({
        type: 'control_character_injection',
        severity: 'critical',
        message: 'Script contains potentially malicious control characters'
      });
      return result;
    }

    // Parse the script
    let ast;
    try {
      ast = parse(script);
    } catch (err) {
      result.valid = false;
      result.errors.push({
        type: 'parse_error',
        message: err.message,
        location: err.location
      });
      return result;
    }

    // Validate extensions
    const extensionResult = this.validateExtensions(ast);
    if (!extensionResult.valid) {
      result.valid = false;
      result.errors.push(...extensionResult.errors);
    }

    // Analyze script for security issues
    this.analyzeScript(ast, result, context);

    // Check redirect limits
    if (result.stats.redirectCount > this.config.maxRedirectsPerScript) {
      result.valid = false;
      result.errors.push({
        type: 'redirect_limit',
        message: `Script exceeds maximum of ${this.config.maxRedirectsPerScript} redirects`
      });
    }

    // Check nesting depth
    if (result.stats.nestingDepth > this.config.maxNestingDepth) {
      result.valid = false;
      result.errors.push({
        type: 'nesting_limit',
        message: `Script exceeds maximum nesting depth of ${this.config.maxNestingDepth}`
      });
    }

    // Check rule count
    if (result.stats.ruleCount > this.config.maxRulesPerScript) {
      result.valid = false;
      result.errors.push({
        type: 'rule_limit',
        message: `Script exceeds maximum of ${this.config.maxRulesPerScript} rules`
      });
    }

    return result;
  }

  /**
   * Check for control character injection (CVE-2023-26430)
   * @param {string} script - The script to check
   * @returns {Object} Result with valid flag and errors
   */
  checkControlCharacters(script) {
    const result = { valid: true, errors: [] };

    // Check for control characters (0x00-0x1F except tab, newline, carriage return)
    // Also check for DEL (0x7F)
    // eslint-disable-next-line no-control-regex
    const controlCharRegex = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
    const matches = script.match(controlCharRegex);

    if (matches) {
      result.valid = false;
      const positions = [];
      let match;
      // eslint-disable-next-line no-control-regex
      const regex = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
      while ((match = regex.exec(script)) !== null) {
        positions.push({
          position: match.index,
          charCode: script.codePointAt(match.index)
        });
      }

      result.errors.push({
        type: 'control_character',
        message: `Script contains ${matches.length} illegal control character(s)`,
        positions
      });
    }

    return result;
  }

  /**
   * Validate that only allowed extensions are used
   * @param {Object} ast - The parsed AST
   * @returns {Object} Result with valid flag and errors
   */
  validateExtensions(ast) {
    const result = { valid: true, errors: [] };

    if (!this.config.allowedExtensions) {
      return result; // All extensions allowed
    }

    const requiredExtensions = this.extractRequiredExtensions(ast);
    const disallowed = requiredExtensions.filter(
      (ext) =>
        !this.config.allowedExtensions.includes(ext) && !CORE_TESTS.has(ext)
    );

    if (disallowed.length > 0) {
      result.valid = false;
      result.errors.push({
        type: 'disallowed_extension',
        message: `Script uses disallowed extension(s): ${disallowed.join(
          ', '
        )}`,
        extensions: disallowed
      });
    }

    return result;
  }

  /**
   * Extract required extensions from AST
   * @param {Object} ast - The parsed AST
   * @returns {string[]} List of required extensions
   */
  extractRequiredExtensions(ast) {
    const extensions = [];

    if (ast && ast.commands) {
      for (const cmd of ast.commands) {
        if ((cmd.type || '').toLowerCase() === 'require') {
          if (Array.isArray(cmd.capabilities)) {
            extensions.push(...cmd.capabilities);
          } else if (cmd.capabilities) {
            extensions.push(cmd.capabilities);
          }
        }
      }
    }

    return extensions;
  }

  /**
   * Analyze script for security issues
   * @param {Object} ast - The parsed AST
   * @param {Object} result - The result object to populate
   * @param {Object} context - Additional context
   */
  analyzeScript(ast, result, context) {
    if (!ast || !ast.commands) {
      return;
    }

    this.analyzeCommands(ast.commands, result, context, 0);
  }

  /**
   * Recursively analyze commands
   * @param {Array} commands - Commands to analyze
   * @param {Object} result - The result object
   * @param {Object} context - Additional context
   * @param {number} depth - Current nesting depth
   */
  analyzeCommands(commands, result, context, depth) {
    result.stats.nestingDepth = Math.max(result.stats.nestingDepth, depth);

    for (const cmd of commands) {
      result.stats.ruleCount++;

      const cmdType = (cmd.type || '').toLowerCase();

      switch (cmdType) {
        case 'redirect': {
          this.analyzeRedirect(cmd, result, context);
          break;
        }

        case 'vacation': {
          this.analyzeVacation(cmd, result);
          break;
        }

        case 'addheader':
        case 'deleteheader': {
          this.analyzeEditheader(cmd, result, context);
          break;
        }

        case 'if':
        case 'elsif': {
          // Check for regex in conditions
          this.analyzeCondition(cmd.test, result, context);
          // Recurse into block/then/else blocks (AST uses 'block' for main branch)
          if (cmd.block) {
            this.analyzeCommands(cmd.block, result, context, depth + 1);
          }

          if (cmd.then) {
            this.analyzeCommands(cmd.then, result, context, depth + 1);
          }

          if (cmd.elsif && Array.isArray(cmd.elsif)) {
            for (const elsifCmd of cmd.elsif) {
              this.analyzeCommands([elsifCmd], result, context, depth + 1);
            }
          }

          if (cmd.else) {
            this.analyzeCommands(cmd.else, result, context, depth + 1);
          }

          break;
        }

        default: {
          break;
        }
      }
    }
  }

  /**
   * Analyze redirect command for security issues
   * @param {Object} cmd - The redirect command
   * @param {Object} result - The result object
   * @param {Object} context - Additional context
   */
  analyzeRedirect(cmd, result, context) {
    result.stats.redirectCount++;

    const address = cmd.address || '';

    // Check for external redirects
    if (!this.config.allowExternalRedirects && context.userDomain) {
      const domain = this.extractDomain(address);
      if (domain && domain !== context.userDomain) {
        result.securityIssues.push({
          type: 'external_redirect',
          severity: 'high',
          message: `Redirect to external domain: ${domain}`,
          address
        });
        result.warnings.push({
          type: 'external_redirect',
          message: `Redirect to external address: ${address}`
        });
      }
    }

    // Check domain whitelist
    if (this.config.redirectDomainWhitelist) {
      const domain = this.extractDomain(address);
      if (domain && !this.config.redirectDomainWhitelist.includes(domain)) {
        result.valid = false;
        result.errors.push({
          type: 'redirect_domain_not_whitelisted',
          message: `Redirect domain not in whitelist: ${domain}`,
          address
        });
      }
    }

    // Check domain blacklist
    if (this.config.redirectDomainBlacklist) {
      const domain = this.extractDomain(address);
      if (domain && this.config.redirectDomainBlacklist.includes(domain)) {
        result.valid = false;
        result.errors.push({
          type: 'redirect_domain_blacklisted',
          message: `Redirect domain is blacklisted: ${domain}`,
          address
        });
      }
    }

    // Check against global denylist (synchronous check against config.denylist Set)
    if (config && config.denylist) {
      const domain = this.extractDomain(address);
      const addressLower = address.toLowerCase().trim();

      // Check if address or domain is in the denylist
      if (
        config.denylist.has(addressLower) ||
        (domain && config.denylist.has(domain))
      ) {
        result.valid = false;
        result.errors.push({
          type: 'redirect_address_denylisted',
          message: `Redirect address is denylisted: ${address}`,
          address
        });
      }
    }

    // Store address for async denylist check during execution
    if (!result.redirectAddresses) {
      result.redirectAddresses = [];
    }

    result.redirectAddresses.push(address);

    // Check for suspicious patterns (all mail forwarding)
    if (cmd.copy !== true) {
      result.warnings.push({
        type: 'redirect_without_copy',
        message:
          'Redirect without :copy flag will prevent local delivery. Consider using :copy to keep a local copy.',
        address
      });
    }
  }

  /**
   * Analyze vacation command for abuse potential
   * @param {Object} cmd - The vacation command
   * @param {Object} result - The result object
   * @param {Object} context - Additional context
   */
  analyzeVacation(cmd, result) {
    result.stats.vacationCount++;

    // Check vacation interval
    const interval = cmd.seconds || cmd.days * 86_400 || 604_800; // Default 7 days
    if (interval < this.config.minVacationInterval) {
      result.warnings.push({
        type: 'vacation_interval_too_short',
        message: `Vacation interval (${interval}s) is below minimum (${this.config.minVacationInterval}s). This may cause excessive auto-replies.`
      });
    }

    // Check message size
    const message = cmd.reason || cmd.message || '';
    if (message.length > this.config.maxVacationMessageSize) {
      result.valid = false;
      result.errors.push({
        type: 'vacation_message_too_large',
        message: `Vacation message exceeds maximum size of ${this.config.maxVacationMessageSize} characters`
      });
    }

    // Check subject length
    const subject = cmd.subject || '';
    if (subject.length > this.config.maxVacationSubjectLength) {
      result.valid = false;
      result.errors.push({
        type: 'vacation_subject_too_long',
        message: `Vacation subject exceeds maximum length of ${this.config.maxVacationSubjectLength} characters`
      });
    }

    // Check for potential spam indicators in vacation message
    const spamIndicators = this.checkSpamIndicators(message);
    if (spamIndicators.length > 0) {
      result.warnings.push({
        type: 'vacation_spam_indicators',
        message: `Vacation message contains potential spam indicators: ${spamIndicators.join(
          ', '
        )}`
      });
    }

    // Check vacation addresses against denylist
    const addresses = cmd.addresses || [];
    if (config && config.denylist) {
      for (const address of addresses) {
        const addressLower = address.toLowerCase().trim();
        const domain = this.extractDomain(address);

        if (
          config.denylist.has(addressLower) ||
          (domain && config.denylist.has(domain))
        ) {
          result.valid = false;
          result.errors.push({
            type: 'vacation_address_denylisted',
            message: `Vacation address is denylisted: ${address}`,
            address
          });
        }
      }
    }

    // Store addresses for async denylist check during execution
    if (!result.vacationAddresses) {
      result.vacationAddresses = [];
    }

    result.vacationAddresses.push(...addresses);
  }

  /**
   * Analyze editheader commands for header manipulation attacks
   * @param {Object} cmd - The editheader command
   * @param {Object} result - The result object
   * @param {Object} context - Additional context
   */
  analyzeEditheader(cmd, result, _context) {
    result.stats.editheaderCount++;

    const headerName = (
      cmd.headerName ||
      cmd.fieldName ||
      cmd.name ||
      ''
    ).toLowerCase();

    // Check if trying to modify protected headers
    if (this.config.protectedHeaders.includes(headerName)) {
      result.valid = false;
      result.errors.push({
        type: 'protected_header_modification',
        message: `Cannot modify protected header: ${headerName}`,
        header: headerName
      });
      result.securityIssues.push({
        type: 'header_manipulation',
        severity: 'critical',
        message: `Attempt to modify protected header: ${headerName}`,
        header: headerName
      });
    }

    // Check for header injection in value
    if (cmd.value && (cmd.value.includes('\r') || cmd.value.includes('\n'))) {
      result.valid = false;
      result.errors.push({
        type: 'header_injection',
        message:
          'Header value contains newline characters (potential header injection)',
        header: headerName
      });
      result.securityIssues.push({
        type: 'header_injection',
        severity: 'critical',
        message: 'Potential header injection attack detected',
        header: headerName
      });
    }
  }

  /**
   * Analyze conditions for regex complexity
   * @param {Object} test - The test condition
   * @param {Object} result - The result object
   * @param {Object} context - Additional context
   */
  analyzeCondition(test, result) {
    if (!test) {
      return;
    }

    // Check regex patterns
    if (test.matchType === ':regex' && test.keyList) {
      for (const pattern of test.keyList) {
        if (pattern.length > this.config.maxRegexLength) {
          result.valid = false;
          result.errors.push({
            type: 'regex_too_long',
            message: `Regex pattern exceeds maximum length of ${this.config.maxRegexLength} characters`
          });
        }

        // Check for ReDoS patterns
        const redosResult = this.checkReDoS(pattern);
        if (redosResult.vulnerable) {
          result.warnings.push({
            type: 'potential_redos',
            message: `Regex pattern may be vulnerable to ReDoS: ${redosResult.reason}`,
            pattern
          });
        }
      }
    }

    // Recurse into nested tests
    if (test.tests) {
      for (const subtest of test.tests) {
        this.analyzeCondition(subtest, result);
      }
    }

    if (test.test) {
      this.analyzeCondition(test.test, result);
    }
  }

  /**
   * Check for potential ReDoS patterns
   * @param {string} pattern - The regex pattern
   * @returns {Object} Result with vulnerable flag and reason
   */
  checkReDoS(pattern) {
    // Simple heuristics for ReDoS detection
    // More sophisticated analysis would require a dedicated library

    // Check for nested quantifiers
    if (
      /(\+|\*|{[\d,]+}).*(\+|\*|{[\d,]+})/.test(pattern) && // Check if they're in a group
      /\([^)]*(\+|\*)[^)]*\)(\+|\*)/.test(pattern)
    ) {
      return {
        vulnerable: true,
        reason: 'Nested quantifiers in group'
      };
    }

    // Check for overlapping alternations
    if (/\([^)]*\|[^)]*\)(\+|\*)/.test(pattern)) {
      return {
        vulnerable: true,
        reason: 'Quantified alternation'
      };
    }

    return { vulnerable: false };
  }

  /**
   * Check for spam indicators in text
   * @param {string} text - The text to check
   * @returns {string[]} List of detected indicators
   */
  checkSpamIndicators(text) {
    const indicators = [];
    const lowerText = text.toLowerCase();

    const spamPatterns = [
      { pattern: /\b(buy|purchase|order)\s+now\b/i, name: 'buy now' },
      { pattern: /\b(click|visit)\s+here\b/i, name: 'click here' },
      { pattern: /\bfree\s+(gift|money|offer)\b/i, name: 'free offer' },
      { pattern: /\b(winner|won|congratulations)\b/i, name: 'winner claim' },
      {
        pattern: /\b(bitcoin|crypto|investment)\b/i,
        name: 'crypto/investment'
      },
      {
        pattern: /\b(password|credential|login)\s+(reset|verify)\b/i,
        name: 'credential phishing'
      }
    ];

    for (const { pattern, name } of spamPatterns) {
      if (pattern.test(lowerText)) {
        indicators.push(name);
      }
    }

    return indicators;
  }

  /**
   * Extract domain from email address
   * @param {string} address - The email address
   * @returns {string|null} The domain or null
   */
  extractDomain(address) {
    const match = address.match(/@([^@>]+)>?$/);
    return match ? match[1].toLowerCase() : null;
  }

  /**
   * Sanitize a Sieve script by removing dangerous content
   * @param {string} script - The script to sanitize
   * @returns {string} The sanitized script
   */
  sanitize(script) {
    // Remove control characters (except tab, newline, carriage return)
    let sanitized = script.replaceAll(
      // eslint-disable-next-line no-control-regex
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ''
    );

    // Normalize line endings
    sanitized = sanitized.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

    return sanitized;
  }
}

/**
 * Rate limiter for Sieve actions
 */
class SieveRateLimiter {
  /**
   * Create a new rate limiter
   * @param {Object} client - Redis client instance
   * @param {Object} config - Rate limit configuration
   */
  constructor(client, config = {}) {
    this.client = client;
    this.config = {
      redirectsPerDay: config.redirectsPerDay || 100,
      vacationsPerHour: config.vacationsPerHour || 50,
      scriptChangesPerHour: config.scriptChangesPerHour || 20,
      ...config
    };
  }

  /**
   * Check if a redirect action is allowed
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Result with allowed flag and remaining count
   */
  async checkRedirect(userId) {
    const key = `sieve:redirect:${userId}`;
    const windowMs = 24 * 60 * 60 * 1000; // 24 hours
    return this.checkLimit(key, this.config.redirectsPerDay, windowMs);
  }

  /**
   * Check if a vacation response is allowed
   * @param {string} userId - The user ID
   * @param {string} recipientHash - Hash of recipient address (optional, for per-recipient tracking)
   * @returns {Promise<Object>} Result with allowed flag
   */
  async checkVacation(userId, _recipientHash) {
    // Use a global key for total vacation limit per user
    // Note: _recipientHash reserved for future per-recipient tracking
    const key = `sieve:vacation:${userId}`;
    const windowMs = 60 * 60 * 1000; // 1 hour
    return this.checkLimit(key, this.config.vacationsPerHour, windowMs);
  }

  /**
   * Check if a script change is allowed
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Result with allowed flag
   */
  async checkScriptChange(userId) {
    const key = `sieve:script:${userId}`;
    const windowMs = 60 * 60 * 1000; // 1 hour
    return this.checkLimit(key, this.config.scriptChangesPerHour, windowMs);
  }

  /**
   * Generic rate limit check
   * @param {string} key - The rate limit key
   * @param {number} limit - Maximum allowed count
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Promise<Object>} Result with allowed flag and remaining count
   */
  async checkLimit(key, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get current count from Redis
    const raw = await this.client.get(key);
    const data = raw ? JSON.parse(raw) : { count: 0, timestamps: [] };

    // Remove expired timestamps
    data.timestamps = data.timestamps.filter((ts) => ts > windowStart);
    data.count = data.timestamps.length;

    const allowed = data.count < limit;

    if (allowed) {
      // Record this action
      data.timestamps.push(now);
      data.count = data.timestamps.length;
      const ttlSeconds = Math.ceil(windowMs / 1000);
      await this.client.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    }

    // Calculate remaining AFTER the action is recorded
    const remaining = Math.max(0, limit - data.count);

    return {
      allowed,
      remaining,
      limit,
      resetAt:
        data.timestamps.length > 0
          ? data.timestamps[0] + windowMs
          : now + windowMs
    };
  }

  /**
   * Record a redirect action
   * @param {string} userId - The user ID
   * @param {string} address - The redirect address
   */
  async recordRedirect(userId, _address) {
    // Note: _address reserved for future per-address tracking
    const result = await this.checkRedirect(userId);
    return result;
  }

  /**
   * Record a vacation response
   * @param {string} userId - The user ID
   * @param {string} recipient - The recipient address
   */
  async recordVacation(userId, recipient) {
    const recipientHash = this.hashString(recipient);
    return this.checkVacation(userId, recipientHash);
  }

  /**
   * Simple string hash
   * @param {string} str - String to hash
   * @returns {string} Hash
   */
  hashString(string_) {
    let hash = 0;
    for (let i = 0; i < string_.length; i++) {
      const char = string_.codePointAt(i);
      // eslint-disable-next-line no-bitwise
      hash = (hash << 5) - hash + char;
      // eslint-disable-next-line no-bitwise
      hash &= hash;
    }

    return Math.abs(hash).toString(36);
  }
}

/**
 * Audit logger for Sieve operations
 */
class SieveAuditLogger {
  /**
   * Create a new audit logger
   * @param {Object} options - Logger options
   */
  constructor(options = {}) {
    this.store = options.store;
    this.logger = options.logger || console;
    this.notifier = options.notifier;
  }

  /**
   * Log a script creation event
   * @param {string} userId - The user ID
   * @param {string} scriptName - The script name
   * @param {Object} metadata - Additional metadata
   */
  async logScriptCreated(userId, scriptName, metadata = {}) {
    await this.log('script_created', userId, {
      scriptName,
      ...metadata
    });
  }

  /**
   * Log a script update event
   * @param {string} userId - The user ID
   * @param {string} scriptName - The script name
   * @param {Object} metadata - Additional metadata
   */
  async logScriptUpdated(userId, scriptName, metadata = {}) {
    await this.log('script_updated', userId, {
      scriptName,
      ...metadata
    });

    // Notify user if enabled
    if (this.notifier) {
      await this.notifier.notifyScriptChange(userId, scriptName, 'updated');
    }
  }

  /**
   * Log a script deletion event
   * @param {string} userId - The user ID
   * @param {string} scriptName - The script name
   */
  async logScriptDeleted(userId, scriptName) {
    await this.log('script_deleted', userId, { scriptName });
  }

  /**
   * Log a script activation event
   * @param {string} userId - The user ID
   * @param {string} scriptName - The script name
   */
  async logScriptActivated(userId, scriptName) {
    await this.log('script_activated', userId, { scriptName });
  }

  /**
   * Log a script execution event
   * @param {string} userId - The user ID
   * @param {string} scriptName - The script name
   * @param {string} action - The action taken (keep, discard, reject, etc.)
   * @param {Object} options - Log options (session, ignore_hook)
   */
  async logScriptExecution(userId, scriptName, action, options = {}) {
    await this.log(
      'script_execution',
      userId,
      {
        scriptName,
        action
      },
      options
    );
  }

  /**
   * Log a redirect action
   * @param {string} userId - The user ID
   * @param {string} toAddress - Redirect destination
   * @param {string} fromAddress - Original recipient
   * @param {Object} options - Log options (session, ignore_hook)
   */
  async logRedirect(userId, toAddress, fromAddress, options = {}) {
    await this.log(
      'redirect',
      userId,
      {
        fromAddress,
        toAddress
      },
      options
    );
  }

  /**
   * Log a vacation response
   * @param {string} userId - The user ID
   * @param {string} recipient - Vacation recipient
   * @param {string} subject - Vacation subject
   * @param {Object} options - Log options (session, ignore_hook)
   */
  async logVacation(userId, recipient, subject, options = {}) {
    await this.log(
      'vacation',
      userId,
      {
        recipient,
        subject
      },
      options
    );
  }

  /**
   * Log a security event
   * @param {string} userId - The user ID
   * @param {string} eventType - Type of security event
   * @param {Object} details - Event details
   */
  async logSecurityEvent(userId, eventType, details) {
    await this.log('security', userId, {
      eventType,
      ...details
    });

    // Always notify on security events
    if (this.notifier) {
      await this.notifier.notifySecurityEvent(userId, eventType, details);
    }
  }

  /**
   * Generic log method
   * @param {string} action - The action type
   * @param {string} userId - The user ID
   * @param {Object} data - Additional data
   * @param {Object} options - Log options (session, ignore_hook)
   */
  async log(action, userId, data = {}, options = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      ...data
    };

    // Log to console/logger with session and ignore_hook
    this.logger.info('Sieve audit:', {
      ignore_hook: options.ignore_hook ?? true,
      session: options.session,
      ...entry
    });

    // Store if store is available
    if (this.store) {
      await this.store.addAuditEntry(userId, entry);
    }
  }

  /**
   * Get audit log for a user
   * @param {string} userId - The user ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Audit entries
   */
  async getAuditLog(userId, options = {}) {
    if (!this.store) {
      return [];
    }

    return this.store.getAuditEntries(userId, options);
  }
}

/**
 * In-memory rate limit store for testing
 * Uses ioredis-mock compatible interface
 */
class MemoryRateLimitStore {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.data.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key, value, ttlMs) {
    this.data.set(key, {
      value,
      expiry: ttlMs ? Date.now() + ttlMs : null
    });
  }

  async delete(key) {
    this.data.delete(key);
  }
}

/**
 * In-memory audit store for testing
 * Uses ioredis-mock compatible interface
 */
class MemoryAuditStore {
  constructor(options = {}) {
    this.data = new Map();
    this.maxEntries = options.maxEntriesPerUser || 1000;
  }

  async addAuditEntry(userId, entry) {
    const entries = this.data.get(userId) || [];
    entries.unshift(entry);
    if (entries.length > this.maxEntries) {
      entries.pop();
    }

    this.data.set(userId, entries);
  }

  async getAuditEntries(userId, options = {}) {
    let entries = this.data.get(userId) || [];
    if (options.action) {
      entries = entries.filter((e) => e.action === options.action);
    }

    if (options.limit) {
      entries = entries.slice(0, options.limit);
    }

    return entries;
  }
}

module.exports = {
  SieveSecurityValidator,
  SieveRateLimiter,
  SieveAuditLogger,
  MemoryRateLimitStore,
  MemoryAuditStore,
  // Async denylist checking function for use during script execution
  async checkDenylist(addresses, client, resolver) {
    if (!isDenylisted || !client) {
      return { allowed: true, deniedAddresses: [] };
    }

    const deniedAddresses = [];

    for (const address of addresses) {
      try {
        await isDenylisted(address, client, resolver);
      } catch (err) {
        if (err.name === 'DenylistError') {
          deniedAddresses.push({ address, reason: err.message });
        } else {
          throw err;
        }
      }
    }

    return {
      allowed: deniedAddresses.length === 0,
      deniedAddresses
    };
  }
};
