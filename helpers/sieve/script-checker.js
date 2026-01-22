/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Script Checker
 *
 * User-facing utility for validating and analyzing Sieve scripts.
 * Provides detailed feedback on syntax, security, and best practices.
 */

const { SieveValidator, sanitizeScript } = require('./validator');

// Supported capabilities - duplicated to avoid circular dependency
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

/**
 * Script checker for user-facing validation
 */
class SieveScriptChecker {
  /**
   * Create a new script checker
   * @param {Object} options - Checker options
   */
  constructor(options = {}) {
    this.options = {
      allowedCapabilities:
        options.allowedCapabilities || SUPPORTED_CAPABILITIES,
      securityConfig: options.securityConfig || {},
      ...options
    };

    this.validator = new SieveValidator(this.options);
  }

  /**
   * Check a Sieve script and return user-friendly results
   * @param {string} script - The Sieve script to check
   * @param {Object} context - Additional context
   * @returns {Object} Check results
   */
  check(script, context = {}) {
    const result = {
      success: true,
      script,
      sanitizedScript: null,
      errors: [],
      warnings: [],
      info: [],
      capabilities: [],
      analysis: null
    };

    // Empty script check
    if (!script || script.trim() === '') {
      result.success = false;
      result.errors.push({
        code: 'EMPTY_SCRIPT',
        message: 'Script is empty',
        suggestion: 'Provide a valid Sieve script'
      });
      return result;
    }

    // Sanitize the script
    result.sanitizedScript = sanitizeScript(script);
    if (result.sanitizedScript !== script) {
      result.warnings.push({
        code: 'SANITIZED',
        message:
          'Script contained potentially dangerous characters that were removed',
        suggestion:
          'Review the sanitized script to ensure it still works as intended'
      });
    }

    // Perform full validation
    const validationResult = this.validator.validateFull(
      result.sanitizedScript,
      context
    );

    // Process syntax errors
    if (!validationResult.syntax.valid) {
      result.success = false;
      for (const error of validationResult.syntax.errors) {
        result.errors.push({
          code: 'SYNTAX_ERROR',
          message: error.message,
          location: error.location,
          suggestion: this.getSyntaxSuggestion(error)
        });
      }
    }

    // Process capability errors
    if (!validationResult.capabilities.valid) {
      result.success = false;
      result.errors.push({
        code: 'UNSUPPORTED_CAPABILITY',
        message: `Unsupported capabilities: ${validationResult.capabilities.unsupported.join(
          ', '
        )}`,
        suggestion: `Remove or replace the unsupported capabilities. Supported: ${this.options.allowedCapabilities.join(
          ', '
        )}`
      });
    }

    // Process security errors
    if (!validationResult.security.valid) {
      result.success = false;
      for (const error of validationResult.security.errors) {
        result.errors.push({
          code: `SECURITY_${error.type.toUpperCase()}`,
          message: error.message,
          suggestion: this.getSecuritySuggestion(error)
        });
      }
    }

    // Process security warnings
    for (const warn of validationResult.security.warnings) {
      result.warnings.push({
        code: `WARN_${warn.type.toUpperCase()}`,
        message: warn.message,
        suggestion: this.getWarningSuggestion(warn)
      });
    }

    // Process recommendations
    for (const rec of validationResult.recommendations) {
      result.info.push({
        code: `INFO_${rec.type.toUpperCase()}`,
        message: rec.message
      });
    }

    // Add capability info
    result.capabilities = validationResult.capabilities.required;

    // Add analysis
    result.analysis = {
      ruleCount: validationResult.stats.ruleCount || 0,
      redirectCount: validationResult.stats.redirectCount || 0,
      vacationCount: validationResult.stats.vacationCount || 0,
      nestingDepth: validationResult.stats.nestingDepth || 0,
      editheaderCount: validationResult.stats.editheaderCount || 0
    };

    return result;
  }

  /**
   * Get a suggestion for a syntax error
   * @param {Object} err - The syntax error
   * @returns {string} Suggestion text
   */
  getSyntaxSuggestion(error) {
    const message = error.message.toLowerCase();

    if (message.includes('require')) {
      return 'Ensure require statements are at the beginning of the script and list capabilities as strings';
    }

    if (message.includes('if') || message.includes('condition')) {
      return 'Check the condition syntax. Example: if header :contains "Subject" "test" { ... }';
    }

    if (message.includes('string')) {
      return 'Strings must be enclosed in double quotes. Example: "value"';
    }

    if (message.includes('semicolon') || message.includes(';')) {
      return 'Commands must end with a semicolon (;)';
    }

    if (
      message.includes('brace') ||
      message.includes('{') ||
      message.includes('}')
    ) {
      return 'Ensure all opening braces { have matching closing braces }';
    }

    return 'Check the Sieve syntax documentation for the correct format';
  }

  /**
   * Get a suggestion for a security error
   * @param {Object} err - The security error
   * @returns {string} Suggestion text
   */
  getSecuritySuggestion(error) {
    switch (error.type) {
      case 'control_character': {
        return 'Remove any invisible or control characters from your script';
      }

      case 'redirect_limit': {
        return 'Reduce the number of redirect actions in your script';
      }

      case 'redirect_domain_not_whitelisted': {
        return 'Only redirect to approved email domains';
      }

      case 'redirect_domain_blacklisted': {
        return 'The redirect destination is not allowed';
      }

      case 'protected_header_modification': {
        return 'Cannot modify security-sensitive headers like From, DKIM-Signature, etc.';
      }

      case 'header_injection': {
        return 'Header values cannot contain newline characters';
      }

      case 'vacation_message_too_large': {
        return 'Reduce the length of your vacation auto-reply message';
      }

      case 'vacation_subject_too_long': {
        return 'Shorten the vacation auto-reply subject line';
      }

      case 'nesting_limit': {
        return 'Simplify your script by reducing the depth of nested conditions';
      }

      case 'rule_limit': {
        return 'Reduce the number of rules in your script';
      }

      case 'regex_too_long': {
        return 'Simplify your regular expression patterns';
      }

      default: {
        return 'Review the security requirements and adjust your script';
      }
    }
  }

  /**
   * Get a suggestion for a warning
   * @param {Object} warn - The warning
   * @returns {string} Suggestion text
   */
  getWarningSuggestion(warn) {
    switch (warn.type) {
      case 'redirect_without_copy': {
        return 'Add :copy to your redirect to keep a local copy: redirect :copy "address@example.com";';
      }

      case 'external_redirect': {
        return 'Be careful when redirecting to external addresses. Ensure this is intentional.';
      }

      case 'vacation_interval_too_short': {
        return 'Consider using a longer interval to avoid sending too many auto-replies';
      }

      case 'vacation_spam_indicators': {
        return 'Your vacation message contains phrases commonly found in spam. Consider revising.';
      }

      case 'potential_redos': {
        return 'Simplify your regular expression to avoid performance issues';
      }

      default: {
        return 'Review this warning and adjust your script if needed';
      }
    }
  }

  /**
   * Format check results as a human-readable string
   * @param {Object} result - Check results
   * @returns {string} Formatted output
   */
  formatResults(result) {
    const lines = [];

    if (result.success) {
      lines.push('✓ Script is valid');
    } else {
      lines.push('✗ Script has errors');
    }

    lines.push('');

    if (result.errors.length > 0) {
      lines.push('ERRORS:');
      for (const error of result.errors) {
        lines.push(`  ✗ ${error.message}`);
        if (error.location) {
          lines.push(
            `    Line ${error.location.start.line}, Column ${error.location.start.column}`
          );
        }

        if (error.suggestion) {
          lines.push(`    Suggestion: ${error.suggestion}`);
        }
      }

      lines.push('');
    }

    if (result.warnings.length > 0) {
      lines.push('WARNINGS:');
      for (const warn of result.warnings) {
        lines.push(`  ⚠ ${warn.message}`);
        if (warn.suggestion) {
          lines.push(`    Suggestion: ${warn.suggestion}`);
        }
      }

      lines.push('');
    }

    if (result.info.length > 0) {
      lines.push('RECOMMENDATIONS:');
      for (const info of result.info) {
        lines.push(`  ℹ ${info.message}`);
      }

      lines.push('');
    }

    if (result.capabilities.length > 0) {
      lines.push(`CAPABILITIES USED: ${result.capabilities.join(', ')}`, '');
    }

    if (result.analysis) {
      lines.push(
        'ANALYSIS:',
        `  Rules: ${result.analysis.ruleCount}`,
        `  Redirects: ${result.analysis.redirectCount}`,
        `  Vacation actions: ${result.analysis.vacationCount}`,
        `  Max nesting: ${result.analysis.nestingDepth}`
      );
    }

    return lines.join('\n');
  }

  /**
   * Format check results as JSON for API responses
   * @param {Object} result - Check results
   * @returns {Object} JSON-friendly result
   */
  formatJSON(result) {
    return {
      valid: result.success,
      errors: result.errors,
      warnings: result.warnings,
      recommendations: result.info,
      capabilities: result.capabilities,
      stats: result.analysis
    };
  }

  /**
   * Get example scripts for common use cases
   * @returns {Object} Example scripts by category
   */
  static getExamples() {
    return {
      basic: {
        name: 'Basic Filtering',
        description: 'Simple filter to move emails to a folder',
        script: `require ["fileinto"];

# Move newsletters to a folder
if header :contains "List-Id" "" {
  fileinto "Newsletters";
  stop;
}

# Keep everything else in inbox
keep;`
      },

      spam: {
        name: 'Spam Filtering',
        description: 'Filter spam based on headers and content',
        script: `require ["fileinto", "imap4flags"];

# Mark and file obvious spam
if anyof (
  header :contains "X-Spam-Flag" "YES",
  header :contains "X-Spam-Status" "Yes"
) {
  addflag "\\\\Seen";
  fileinto "Junk";
  stop;
}

# Reject emails with suspicious subjects
if header :matches "Subject" ["*FREE MONEY*", "*URGENT*", "*ACT NOW*"] {
  fileinto "Junk";
  stop;
}`
      },

      vacation: {
        name: 'Vacation Auto-Reply',
        description: 'Automatic out-of-office reply',
        script: `require ["vacation"];

vacation :days 1
  :subject "Out of Office"
  :from "me@example.com"
  "Thank you for your email. I am currently out of the office
and will respond when I return.

Best regards";`
      },

      redirect: {
        name: 'Email Forwarding',
        description: 'Forward emails while keeping a copy',
        script: `require ["copy"];

# Forward all emails to another address, keeping a local copy
redirect :copy "backup@example.com";`
      },

      organization: {
        name: 'Email Organization',
        description: 'Organize emails into folders by sender',
        script: `require ["fileinto", "imap4flags"];

# Work emails
if address :domain :is "From" "company.com" {
  fileinto "Work";
  stop;
}

# Family emails
if address :is "From" ["mom@example.com", "dad@example.com"] {
  addflag "$family";
  fileinto "Family";
  stop;
}

# Social media notifications
if anyof (
  address :domain :is "From" "facebook.com",
  address :domain :is "From" "twitter.com",
  address :domain :is "From" "linkedin.com"
) {
  fileinto "Social";
  stop;
}`
      },

      priority: {
        name: 'Priority Handling',
        description: 'Handle high-priority emails differently',
        script: `require ["fileinto", "imap4flags"];

# VIP senders - flag as important
if address :is "From" ["boss@company.com", "ceo@company.com"] {
  addflag "\\\\Flagged";
  keep;
  stop;
}

# High priority header
if header :is "X-Priority" "1" {
  addflag "\\\\Flagged";
  keep;
  stop;
}`
      }
    };
  }

  /**
   * Get documentation for Sieve syntax
   * @returns {Object} Documentation object
   */
  static getDocumentation() {
    return {
      overview: `Sieve is a language for filtering email messages at the time of delivery.
It is designed to be simple, extensible, and implementation-independent.`,

      commands: {
        keep: {
          syntax: 'keep;',
          description: 'Keep the message in the inbox (default action)'
        },
        discard: {
          syntax: 'discard;',
          description: 'Silently delete the message'
        },
        fileinto: {
          syntax: 'fileinto "FolderName";',
          description: 'Move the message to a specific folder',
          requires: 'fileinto'
        },
        redirect: {
          syntax: 'redirect "address@example.com";',
          description: 'Forward the message to another address'
        },
        reject: {
          syntax: 'reject "Reason message";',
          description: 'Reject the message with an error',
          requires: 'reject'
        },
        stop: {
          syntax: 'stop;',
          description: 'Stop processing further rules'
        },
        vacation: {
          syntax: 'vacation :days 7 :subject "Subject" "Message body";',
          description: 'Send an automatic vacation reply',
          requires: 'vacation'
        }
      },

      tests: {
        header: {
          syntax: 'header :contains "Header-Name" "value"',
          description: 'Test if a header contains/matches a value'
        },
        address: {
          syntax: 'address :is "From" "sender@example.com"',
          description: 'Test email addresses in headers'
        },
        size: {
          syntax: 'size :over 1M',
          description: 'Test message size'
        },
        exists: {
          syntax: 'exists "Header-Name"',
          description: 'Test if a header exists'
        },
        allof: {
          syntax: 'allof (test1, test2)',
          description: 'All tests must match (AND)'
        },
        anyof: {
          syntax: 'anyof (test1, test2)',
          description: 'Any test must match (OR)'
        },
        not: {
          syntax: 'not test',
          description: 'Negate a test'
        }
      },

      matchTypes: {
        ':is': 'Exact match',
        ':contains': 'Substring match',
        ':matches': 'Wildcard match (* and ?)'
      },

      addressParts: {
        ':localpart':
          'The part before @ (e.g., "user" from "user@example.com")',
        ':domain': 'The part after @ (e.g., "example.com")',
        ':all': 'The entire address (default)'
      }
    };
  }
}

/**
 * Create a script checker instance
 * @param {Object} options - Checker options
 * @returns {SieveScriptChecker} Checker instance
 */
function createChecker(options = {}) {
  return new SieveScriptChecker(options);
}

/**
 * Quick check function
 * @param {string} script - The script to check
 * @param {Object} options - Check options
 * @returns {Object} Check results
 */
function checkScript(script, options = {}) {
  const checker = createChecker(options);
  return checker.check(script, options.context || {});
}

module.exports = {
  SieveScriptChecker,
  createChecker,
  checkScript
};
