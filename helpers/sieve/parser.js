/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Parser - Parses Sieve scripts into an Abstract Syntax Tree (AST)
 */

const fs = require('node:fs');
const path = require('node:path');

// Try to load pre-generated parser, fall back to generating on-the-fly
let parser;
const generatedParserPath = path.join(__dirname, 'parser-generated.js');

try {
  // First try to load the pre-generated parser (created by `nps buildSieve`)
  parser = require('./parser-generated.js');
} catch (err) {
  // If pre-generated parser doesn't exist, try to generate on-the-fly
  // This requires peggy to be installed
  try {
    const peggy = require('peggy');
    const grammarPath = path.join(__dirname, 'grammar.pegjs');
    const grammar = fs.readFileSync(grammarPath, 'utf8');
    parser = peggy.generate(grammar, {
      output: 'parser',
      format: 'commonjs'
    });
  } catch {
    // Neither pre-generated parser nor peggy available
    // Throw a clear error message
    throw new Error(
      `Sieve parser not available. The pre-generated parser (${generatedParserPath}) ` +
        `was not found and peggy is not installed for on-the-fly generation. ` +
        `Please run 'nps buildSieve' or 'npm run build' to generate the parser. ` +
        `Original error: ${err.message}`
    );
  }
}

/**
 * Parse a Sieve script into an AST
 * @param {string} script - The Sieve script to parse
 * @returns {Object} The Abstract Syntax Tree
 * @throws {Error} If the script has syntax errors
 */
function parse(script) {
  if (typeof script !== 'string') {
    throw new TypeError('Script must be a string');
  }

  try {
    return parser.parse(script);
  } catch (err) {
    // Enhance error message with location info
    const error = new Error(
      `Sieve syntax error at line ${err.location?.start?.line || '?'}, ` +
        `column ${err.location?.start?.column || '?'}: ${err.message}`
    );
    error.location = err.location;
    error.expected = err.expected;
    error.found = err.found;
    error.name = 'SieveSyntaxError';
    throw error;
  }
}

/**
 * Validate a Sieve script without returning the AST
 * @param {string} script - The Sieve script to validate
 * @returns {Object} Validation result with success flag and any errors
 */
function validate(script) {
  try {
    parse(script);
    return {
      valid: true,
      errors: []
    };
  } catch (err) {
    return {
      valid: false,
      errors: [
        {
          message: err.message,
          line: err.location?.start?.line,
          column: err.location?.start?.column
        }
      ]
    };
  }
}

/**
 * Extract required capabilities from a parsed AST
 * @param {Object} ast - The parsed AST
 * @returns {string[]} List of required capabilities
 */
function getRequiredCapabilities(ast) {
  const capabilities = new Set();

  if (!ast || !ast.commands) {
    return [];
  }

  for (const command of ast.commands) {
    if (command.type === 'Require') {
      for (const cap of command.capabilities) {
        capabilities.add(cap);
      }
    }
  }

  return [...capabilities];
}

/**
 * Check if a script uses a specific capability
 * @param {Object} ast - The parsed AST
 * @param {string} capability - The capability to check for
 * @returns {boolean} True if the capability is required
 */
function requiresCapability(ast, capability) {
  return getRequiredCapabilities(ast).includes(capability);
}

module.exports = {
  parse,
  validate,
  getRequiredCapabilities,
  requiresCapability
};
