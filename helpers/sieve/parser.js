/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Parser - Parses Sieve scripts into an Abstract Syntax Tree (AST)
 */

const { Buffer } = require('node:buffer');
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

function syntaxError(message, location) {
  const error = new Error(
    `Sieve syntax error at line ${location?.start?.line || '?'}, ` +
      `column ${location?.start?.column || '?'}: ${message}`
  );
  error.location = location;
  error.name = 'SieveSyntaxError';
  return error;
}

//
// Encoded characters (RFC 5228 section 2.4.2.4): "${hex:" with pairs of
// hex digits or "${unicode:" with code points, separated by blanks. A
// sequence that does not have this form is left as it is.
//
const ENCODED_CHARACTERS = /\${(hex|unicode):([\t\n\r \da-f]*)}/gi;

function decodeEncodedCharacters(str, location) {
  if (!str.includes('${')) return str;
  const chunks = [];
  let copied = 0;
  for (const match of str.matchAll(ENCODED_CHARACTERS)) {
    const values = match[2].trim().split(/[\t\n\r ]+/);
    const hex = match[1].toLowerCase() === 'hex';
    if (values[0] === '' || (hex && values.some((v) => v.length > 2))) continue;

    chunks.push(Buffer.from(str.slice(copied, match.index)));
    for (const value of values) {
      const code = Number.parseInt(value, 16);
      if (hex) {
        chunks.push(Buffer.from([code]));
        continue;
      }

      if (code > 0x10_ff_ff || (code >= 0xd8_00 && code <= 0xdf_ff))
        throw syntaxError(
          `Invalid Unicode value in encoded character: ${value}`,
          location
        );
      chunks.push(Buffer.from(String.fromCodePoint(code)));
    }

    copied = match.index + match[0].length;
  }

  if (copied === 0) return str;
  chunks.push(Buffer.from(str.slice(copied)));
  // (octets of "${hex:...}" may be parts of UTF-8 characters)
  return Buffer.concat(chunks).toString('utf8');
}

// replace each string in the AST (except node types) with `fn(string)`
function mapStrings(value, fn, location) {
  if (typeof value === 'string') return fn(value, location);
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries())
      value[i] = mapStrings(item, fn, location);
    return value;
  }

  for (const key of Object.keys(value)) {
    if (key !== 'type' && key !== 'location')
      value[key] = mapStrings(value[key], fn, value.location || location);
  }

  return value;
}

// unknown tests only when "ihave" may enable them (RFC 5463)
function checkTest(test, context) {
  if (test.type === 'UnknownTest' && !context.ihave)
    throw syntaxError(`Unknown test "${test.name}"`, test.location);
  for (const child of test.tests || []) checkTest(child, context);
  if (test.test) checkTest(test.test, context);
}

//
// Checks of where commands may be (that the grammar does not express):
// require only first (RFC 5228 section 3.2), break and extracttext only in
// foreverypart (RFC 5703 sections 3 and 7), names of variables to set that
// are identifiers (RFC 5229 section 4), and unknown commands and tests only
// when "ihave" may enable them (RFC 5463). Where a require is and the names
// of variables are only checked when a script is saved: scripts saved before
// these checks ran with them (a require after other commands is a no-op
// where it is, as every top-level one is read first).
//
function checkCommands(commands, context) {
  for (const command of commands) {
    switch (command.type) {
      case 'Require': {
        if (context.strict && (!context.topLevel || context.afterRequire))
          throw syntaxError(
            'require must come before any other command',
            command.location
          );
        break;
      }

      case 'Break': {
        if (context.loops.length === 0)
          throw syntaxError('break outside of foreverypart', command.location);
        if (command.name !== null && !context.loops.includes(command.name))
          throw syntaxError(
            `break has no enclosing foreverypart named "${command.name}"`,
            command.location
          );
        break;
      }

      case 'UnknownCommand': {
        if (!context.ihave)
          throw syntaxError(
            `Unknown command "${command.name}"`,
            command.location
          );
        break;
      }

      // (RFC 5229 section 4, RFC 5703 section 7)
      case 'Set':
      case 'Extracttext': {
        if (command.type === 'Extracttext' && context.loops.length === 0)
          throw syntaxError(
            'extracttext outside of foreverypart',
            command.location
          );
        if (context.strict && !/^[a-z_]\w*$/i.test(command.name))
          throw syntaxError(
            `Invalid variable name: "${command.name}"`,
            command.location
          );
        break;
      }

      default: {
        break;
      }
    }

    if (command.type !== 'Require' && context.topLevel)
      context.afterRequire = true;

    const inner = { ...context, topLevel: false };
    if (command.type === 'If') {
      checkTest(command.test, context);
      checkCommands(command.block, inner);
      for (const branch of command.elsif) {
        checkTest(branch.test, context);
        checkCommands(branch.block, inner);
      }

      if (command.else) checkCommands(command.else, inner);
    } else if (command.type === 'Foreverypart') {
      checkCommands(command.block, {
        ...inner,
        loops: [...context.loops, command.name]
      });
    }
  }
}

/**
 * Parse a Sieve script into an AST
 * @param {string} script - The Sieve script to parse
 * @param {Object} [options] - Options
 * @param {boolean} [options.strict] - Also refuse what only RFCs forbid
 * (conflicting tags, names of variables that are not identifiers, notify
 * without a method, require after other commands): a script is checked so when it is saved, while one
 * saved before these checks still runs as it did
 * @returns {Object} The Abstract Syntax Tree
 * @throws {Error} If the script has syntax errors
 */
function parse(script, options = {}) {
  if (typeof script !== 'string') {
    throw new TypeError('Script must be a string');
  }

  const strict = Boolean(options.strict);
  let ast;
  try {
    ast = parser.parse(script, { strict });
  } catch (err) {
    // Enhance error message with location info
    const error = syntaxError(err.message, err.location);
    error.expected = err.expected;
    error.found = err.found;
    throw error;
  }

  const required = new Set(
    getRequiredCapabilities(ast).map((capability) => capability.toLowerCase())
  );
  // (before variables are expanded, RFC 5229 section 3.1, and before the
  // names of variables are checked)
  if (required.has('encoded-character'))
    mapStrings(ast, decodeEncodedCharacters, ast.location);

  checkCommands(ast.commands, {
    strict,
    topLevel: true,
    afterRequire: false,
    loops: [],
    ihave: required.has('ihave')
  });

  return ast;
}

/**
 * Validate a Sieve script without returning the AST (strictly, as when it
 * is saved)
 * @param {string} script - The Sieve script to validate
 * @returns {Object} Validation result with success flag and any errors
 */
function validate(script) {
  try {
    parse(script, { strict: true });
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
