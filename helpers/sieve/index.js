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
const {
  CORE_CAPABILITIES,
  SUPPORTED_CAPABILITIES,
  validateSieveCapabilities
} = require('./capabilities');

/**
 * Execute a Sieve script against a message
 * @param {string} script - The Sieve script
 * @param {Object} message - The email message
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} Execution result
 */
async function executeScript(script, message, options = {}) {
  const ast = parse(script);
  const capabilityResult = validateSieveCapabilities(ast);
  if (!capabilityResult.valid) {
    throw new Error(capabilityResult.errors.join('; '));
  }

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

  const ast = parse(script);
  const capabilityResult = validateSieveCapabilities(ast);
  if (!capabilityResult.valid) {
    return {
      valid: false,
      errors: capabilityResult.errors.map((message) => ({
        message,
        line: 1,
        column: 1
      }))
    };
  }

  return {
    valid: true,
    errors: [],
    capabilities: capabilityResult.required
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
  SUPPORTED_CAPABILITIES,
  CORE_TESTS: CORE_CAPABILITIES
};
