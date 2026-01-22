/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Email Filtering Module
 *
 * This module provides RFC 5228 compliant Sieve email filtering support
 * for Forward Email, including:
 * - Sieve script parsing
 * - Script execution engine
 * - ManageSieve protocol server (RFC 5804)
 */

const SieveEngine = require('./engine');
const {
  parse,
  validate,
  getRequiredCapabilities,
  requiresCapability
} = require('./parser');
const {
  SieveSecurityValidator,
  SieveRateLimiter,
  SieveAuditLogger,
  MemoryRateLimitStore,
  MemoryAuditStore
} = require('./security');
const { SieveValidator } = require('./validator');
const SieveScriptChecker = require('./script-checker');
const SieveFilterHandler = require('./filter-handler');
const ManageSieveServer = require('./managesieve-server');
const { MemorySieveStore } = require('./store');
const { SieveIntegration, createSieveIntegration } = require('./integration');

// Supported capabilities
const SUPPORTED_CAPABILITIES = [
  // Core (RFC 5228)
  'fileinto',
  'reject',
  'ereject',
  'envelope',
  'encoded-character',
  'comparator-i;ascii-casemap',
  'comparator-i;octet',
  // Copy (RFC 3894)
  'copy',
  // Body (RFC 5173)
  'body',
  // Vacation (RFC 5230)
  'vacation',
  'vacation-seconds',
  // Variables (RFC 5229)
  'variables',
  // IMAP4 Flags (RFC 5232)
  'imap4flags',
  // Relational (RFC 5231)
  'relational',
  // Edit Header (RFC 5293)
  'editheader',
  // Date (RFC 5260)
  'date',
  // Index (RFC 5260)
  'index',
  // Regex (draft-ietf-sieve-regex)
  'regex',
  // Notify (RFC 5435)
  'enotify',
  // Environment (RFC 5183)
  'environment'
];

/**
 * Execute a Sieve script against a message
 * @param {string} script - The Sieve script
 * @param {Object} message - The email message
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} Execution result
 */
async function executeScript(script, message, options = {}) {
  const ast = parse(script);
  const engine = new SieveEngine({
    capabilities: SUPPORTED_CAPABILITIES,
    ...options
  });
  return engine.execute(ast, message, options.context || {});
}

/**
 * Validate a Sieve script and check capabilities
 * @param {string} script - The Sieve script
 * @returns {Object} Validation result
 */
function validateScript(script) {
  const result = validate(script);

  if (!result.valid) {
    return result;
  }

  // Check for unsupported capabilities
  const ast = parse(script);
  const required = getRequiredCapabilities(ast);
  const unsupported = required.filter(
    (cap) => !SUPPORTED_CAPABILITIES.includes(cap)
  );

  if (unsupported.length > 0) {
    return {
      valid: false,
      errors: [
        {
          message: `Unsupported capabilities: ${unsupported.join(', ')}`,
          line: 1,
          column: 1
        }
      ]
    };
  }

  return {
    valid: true,
    errors: [],
    capabilities: required
  };
}

module.exports = {
  // Parser exports
  parse,
  validate,
  getRequiredCapabilities,
  requiresCapability,

  // Engine exports
  SieveEngine,
  executeScript,
  validateScript,

  // Security exports
  SieveSecurityValidator,
  SieveRateLimiter,
  SieveAuditLogger,
  MemoryRateLimitStore,
  MemoryAuditStore,

  // Validation exports
  SieveValidator,

  // Script checker exports
  SieveScriptChecker,

  // Filter handler exports
  SieveFilterHandler,

  // ManageSieve server exports
  ManageSieveServer,

  // Store exports
  MemorySieveStore,

  // Integration exports
  SieveIntegration,
  createSieveIntegration,

  // Constants
  SUPPORTED_CAPABILITIES
};
