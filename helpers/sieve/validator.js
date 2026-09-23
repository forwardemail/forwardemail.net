/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Script Validator
 *
 * This module provides comprehensive validation for Sieve scripts including:
 * - Syntax validation
 * - Security checks
 * - Best practice recommendations
 * - Capability verification
 */

const { parse, validate } = require('./parser');
const { SieveSecurityValidator } = require('./security');
const {
  CORE_CAPABILITIES,
  SUPPORTED_CAPABILITIES,
  getCapability,
  validateSieveCapabilities
} = require('./capabilities');

/**
 * Comprehensive Sieve script validator
 */
class SieveValidator {
  /**
   * Create a new validator
   * @param {Object} options - Validator options
   */
  constructor(options = {}) {
    this.options = {
      strictMode: options.strictMode || false,
      allowedCapabilities:
        options.allowedCapabilities || SUPPORTED_CAPABILITIES,
      securityConfig: options.securityConfig || {},
      ...options
    };

    this.securityValidator = new SieveSecurityValidator(
      this.options.securityConfig
    );
  }

  /**
   * Perform full validation of a Sieve script
   * @param {string} script - The Sieve script to validate
   * @param {Object} context - Validation context (userId, domain, etc.)
   * @returns {Object} Comprehensive validation result
   */
  validateFull(script, context = {}) {
    const result = {
      valid: true,
      syntax: { valid: true, errors: [] },
      security: {
        valid: true,
        errors: [],
        warnings: [],
        issues: []
      },
      capabilities: {
        valid: true,
        declared: [],
        required: [],
        unsupported: [],
        errors: []
      },
      recommendations: [],
      stats: {}
    };

    // Sanitize the script first
    const sanitizedScript = this.securityValidator.sanitize(script);

    // Check if sanitization changed the script
    if (sanitizedScript !== script) {
      result.recommendations.push({
        type: 'sanitization',
        message:
          'Script contained control characters that were removed for security'
      });
    }

    // Syntax validation
    try {
      const syntaxResult = validate(sanitizedScript);
      if (!syntaxResult.valid) {
        result.valid = false;
        result.syntax.valid = false;
        result.syntax.errors = syntaxResult.errors;
        return result;
      }
    } catch (err) {
      result.valid = false;
      result.syntax.valid = false;
      result.syntax.errors = [
        {
          message: err.message,
          location: err.location
        }
      ];
      return result;
    }

    // Parse the script for further analysis
    let ast;
    try {
      ast = parse(sanitizedScript);
    } catch (err) {
      result.valid = false;
      result.syntax.valid = false;
      result.syntax.errors = [
        {
          message: err.message,
          location: err.location
        }
      ];
      return result;
    }

    // Capability validation
    const capabilityResult = validateSieveCapabilities(ast);
    result.capabilities = capabilityResult;

    const allowedCapabilities = new Set(
      this.options.allowedCapabilities.map((capability) =>
        getCapability(capability)
      )
    );
    const disabledCapabilities = capabilityResult.declared.filter(
      (capability) =>
        !allowedCapabilities.has(capability) &&
        !CORE_CAPABILITIES.includes(capability)
    );
    for (const capability of disabledCapabilities) {
      result.capabilities.unsupported.push({
        feature: capability,
        reason: 'capability is disabled by this validator configuration'
      });
      result.capabilities.errors.push(
        `Unsupported Sieve feature "${capability}": capability is disabled by this validator configuration`
      );
    }

    result.capabilities.valid = result.capabilities.errors.length === 0;
    if (!result.capabilities.valid) {
      result.valid = false;
    }

    // Security validation
    const securityResult = this.securityValidator.validate(
      sanitizedScript,
      context
    );
    result.security.valid = securityResult.valid;
    result.security.errors = securityResult.errors;
    result.security.warnings = securityResult.warnings;
    result.security.issues = securityResult.securityIssues;
    result.stats = securityResult.stats;

    if (!securityResult.valid) {
      result.valid = false;
    }

    // Add recommendations based on analysis
    this.addRecommendations(ast, result);

    return result;
  }

  /**
   * Quick syntax-only validation
   * @param {string} script - The Sieve script
   * @returns {Object} Syntax validation result
   */
  validateSyntax(script) {
    try {
      const result = validate(script);
      return result;
    } catch (err) {
      return {
        valid: false,
        errors: [
          {
            message: err.message,
            location: err.location
          }
        ]
      };
    }
  }

  /**
   * Check if a script uses specific capabilities
   * @param {string} script - The Sieve script
   * @returns {Object} Capability analysis
   */
  analyzeCapabilities(script) {
    try {
      const ast = parse(script);
      const capabilityResult = validateSieveCapabilities(ast);
      const { required } = capabilityResult;

      return {
        valid: capabilityResult.valid,
        required,
        declared: capabilityResult.declared,
        supported: required.filter((cap) =>
          this.options.allowedCapabilities
            .map((capability) => getCapability(capability))
            .includes(cap)
        ),
        unsupported: capabilityResult.unsupported
      };
    } catch (err) {
      return {
        valid: false,
        error: err.message
      };
    }
  }

  /**
   * Add recommendations based on script analysis
   * @param {Object} ast - The parsed AST
   * @param {Object} result - The result object to add recommendations to
   */
  addRecommendations(ast, result) {
    if (!ast || !ast.commands) {
      return;
    }

    const hasRequire = ast.commands.some((cmd) => cmd.type === 'Require');
    const { required: usedCapabilities } = validateSieveCapabilities(ast);

    // Check for missing require statements
    if (usedCapabilities.length > 0 && !hasRequire) {
      result.recommendations.push({
        type: 'missing_require',
        message: `Script uses capabilities that should be declared with require: ${usedCapabilities.join(
          ', '
        )}`
      });
    }

    // Check for overly broad rules
    const hasBroadRules = this.hasBroadRules(ast);
    if (hasBroadRules) {
      result.recommendations.push({
        type: 'broad_rules',
        message:
          'Script contains rules that match all messages (e.g., "if true"). Consider adding more specific conditions.'
      });
    }

    // Check for vacation without proper configuration
    const vacationIssues = this.checkVacationConfiguration(ast);
    if (vacationIssues.length > 0) {
      result.recommendations.push(...vacationIssues);
    }
  }

  /**
   * Detect capabilities used in the script
   * @param {Object} ast - The parsed AST
   * @returns {string[]} List of used capabilities
   */
  detectUsedCapabilities(ast) {
    return validateSieveCapabilities(ast).required;
  }

  /**
   * Check if script has overly broad rules
   * @param {Object} ast - The parsed AST
   * @returns {boolean} True if broad rules found
   */
  hasBroadRules(ast) {
    const checkCommands = (commands) => {
      for (const cmd of commands) {
        if (
          (cmd.type === 'if' || cmd.type === 'elsif') && // Check for "if true" pattern
          cmd.test &&
          cmd.test.type === 'true'
        ) {
          return true;
        }

        if (cmd.then && checkCommands(cmd.then)) {
          return true;
        }

        if (cmd.else && checkCommands(cmd.else)) {
          return true;
        }
      }

      return false;
    };

    return checkCommands(ast.commands);
  }

  /**
   * Check vacation configuration for issues
   * @param {Object} ast - The parsed AST
   * @returns {Object[]} List of vacation-related recommendations
   */
  checkVacationConfiguration(ast) {
    const recommendations = [];

    const checkCommands = (commands) => {
      for (const cmd of commands) {
        if (cmd.type === 'vacation') {
          // Check for missing subject
          if (!cmd.subject) {
            recommendations.push({
              type: 'vacation_no_subject',
              message:
                'Vacation auto-reply has no subject. Consider adding a subject for clarity.'
            });
          }

          // Check for missing from address
          if (!cmd.from) {
            recommendations.push({
              type: 'vacation_no_from',
              message:
                'Vacation auto-reply has no :from address. The default sender address will be used.'
            });
          }

          // Check for very short interval
          if (cmd.seconds && cmd.seconds < 3600) {
            recommendations.push({
              type: 'vacation_short_interval',
              message:
                'Vacation interval is less than 1 hour. This may result in excessive auto-replies.'
            });
          }
        }

        if (cmd.then) {
          checkCommands(cmd.then);
        }

        if (cmd.else) {
          checkCommands(cmd.else);
        }
      }
    };

    checkCommands(ast.commands);
    return recommendations;
  }

  /**
   * Format validation errors for display
   * @param {Object} result - Validation result
   * @returns {string} Formatted error message
   */
  formatErrors(result) {
    const lines = [];

    if (!result.syntax.valid) {
      lines.push('Syntax Errors:');
      for (const error of result.syntax.errors) {
        if (error.location) {
          lines.push(`  Line ${error.location.start.line}: ${error.message}`);
        } else {
          lines.push(`  ${error.message}`);
        }
      }
    }

    if (!result.capabilities.valid) {
      const unsupported = result.capabilities.unsupported.map((entry) =>
        typeof entry === 'string' ? entry : `${entry.feature}: ${entry.reason}`
      );
      lines.push('Unsupported Capabilities:', `  ${unsupported.join(', ')}`);
    }

    if (!result.security.valid) {
      lines.push('Security Errors:');
      for (const error of result.security.errors) {
        lines.push(`  ${error.type}: ${error.message}`);
      }
    }

    if (result.security.warnings.length > 0) {
      lines.push('Warnings:');
      for (const warn of result.security.warnings) {
        lines.push(`  ${warn.type}: ${warn.message}`);
      }
    }

    if (result.recommendations.length > 0) {
      lines.push('Recommendations:');
      for (const rec of result.recommendations) {
        lines.push(`  ${rec.message}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate a human-readable report
   * @param {Object} result - Validation result
   * @returns {string} Human-readable report
   */
  generateReport(result) {
    const lines = [];

    lines.push(
      '=== Sieve Script Validation Report ===',
      '',
      `Status: ${result.valid ? 'VALID' : 'INVALID'}`,
      '',
      '--- Syntax ---',
      `Valid: ${result.syntax.valid ? 'Yes' : 'No'}`
    );
    if (result.syntax.errors.length > 0) {
      for (const error of result.syntax.errors) {
        lines.push(`Error: ${error.message}`);
      }
    }

    lines.push(
      '',
      '--- Capabilities ---',
      `Required: ${result.capabilities.required.join(', ') || 'None'}`
    );
    if (result.capabilities.unsupported.length > 0) {
      const unsupported = result.capabilities.unsupported.map((entry) =>
        typeof entry === 'string' ? entry : `${entry.feature}: ${entry.reason}`
      );
      lines.push(`Unsupported: ${unsupported.join(', ')}`);
    }

    lines.push(
      '',
      '--- Security ---',
      `Valid: ${result.security.valid ? 'Yes' : 'No'}`
    );
    if (result.security.errors.length > 0) {
      lines.push('Errors:');
      for (const error of result.security.errors) {
        lines.push(`  - ${error.message}`);
      }
    }

    if (result.security.warnings.length > 0) {
      lines.push('Warnings:');
      for (const warn of result.security.warnings) {
        lines.push(`  - ${warn.message}`);
      }
    }

    if (result.security.issues.length > 0) {
      lines.push('Security Issues:');
      for (const issue of result.security.issues) {
        lines.push(`  - [${issue.severity.toUpperCase()}] ${issue.message}`);
      }
    }

    lines.push(
      '',
      '--- Statistics ---',
      `Rules: ${result.stats.ruleCount || 0}`,
      `Redirects: ${result.stats.redirectCount || 0}`,
      `Vacation actions: ${result.stats.vacationCount || 0}`,
      `Max nesting depth: ${result.stats.nestingDepth || 0}`,
      ''
    );

    // Recommendations
    if (result.recommendations.length > 0) {
      lines.push('--- Recommendations ---');
      for (const rec of result.recommendations) {
        lines.push(`- ${rec.message}`);
      }
    }

    return lines.join('\n');
  }
}

/**
 * Create a validator with default options
 * @param {Object} options - Validator options
 * @returns {SieveValidator} Validator instance
 */
function createValidator(options = {}) {
  return new SieveValidator(options);
}

/**
 * Quick validation function
 * @param {string} script - The Sieve script
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateScript(script, options = {}) {
  const validator = createValidator(options);
  return validator.validateFull(script, options.context || {});
}

/**
 * Sanitize a Sieve script
 * @param {string} script - The script to sanitize
 * @returns {string} Sanitized script
 */
function sanitizeScript(script) {
  const validator = new SieveSecurityValidator();
  return validator.sanitize(script);
}

module.exports = {
  SieveValidator,
  createValidator,
  validateScript,
  sanitizeScript
};
