/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Extensions
 *
 * This module implements various Sieve extensions:
 * - vacation (RFC 5230) - Auto-reply functionality
 * - vacation-seconds (RFC 6131) - Sub-day vacation intervals
 * - variables (RFC 5229) - Variable support
 * - imap4flags (RFC 5232) - IMAP flag manipulation
 * - body (RFC 5173) - Body content tests
 * - relational (RFC 5231) - Relational comparisons
 * - date (RFC 5260) - Date/time tests
 * - editheader (RFC 5293) - Header manipulation
 * - enotify (RFC 5435) - Notification support
 * - environment (RFC 5183) - Environment tests
 * - copy (RFC 3894) - Copy modifier for redirect/fileinto
 * - regex (draft-ietf-sieve-regex) - Regular expression matching
 */

/**
 * Extension registry and metadata
 */
const EXTENSIONS = {
  // Core extensions
  fileinto: {
    rfc: 'RFC 5228',
    description: 'File messages into mailboxes',
    commands: ['fileinto'],
    tests: []
  },
  reject: {
    rfc: 'RFC 5228',
    description: 'Reject messages with an error',
    commands: ['reject'],
    tests: []
  },
  ereject: {
    rfc: 'RFC 5429',
    description: 'Extended reject with SMTP-level rejection',
    commands: ['ereject'],
    tests: []
  },
  envelope: {
    rfc: 'RFC 5228',
    description: 'Test envelope addresses',
    commands: [],
    tests: ['envelope']
  },

  // Copy extension (RFC 3894)
  copy: {
    rfc: 'RFC 3894',
    description: 'Copy modifier for redirect and fileinto',
    commands: [],
    tests: [],
    modifiers: [':copy']
  },

  // Body extension (RFC 5173)
  body: {
    rfc: 'RFC 5173',
    description: 'Test message body content',
    commands: [],
    tests: ['body'],
    transforms: [':raw', ':content', ':text']
  },

  // Vacation extension (RFC 5230)
  vacation: {
    rfc: 'RFC 5230',
    description: 'Auto-reply/vacation response',
    commands: ['vacation'],
    tests: [],
    tags: [':days', ':subject', ':from', ':addresses', ':mime', ':handle']
  },

  // Vacation-seconds extension (RFC 6131)
  'vacation-seconds': {
    rfc: 'RFC 6131',
    description: 'Sub-day vacation intervals',
    commands: [],
    tests: [],
    tags: [':seconds'],
    requires: ['vacation']
  },

  // Variables extension (RFC 5229)
  variables: {
    rfc: 'RFC 5229',
    description: 'Variable support in Sieve',
    commands: ['set'],
    tests: ['string'],
    modifiers: [
      ':lower',
      ':upper',
      ':lowerfirst',
      ':upperfirst',
      ':quotewildcard',
      ':length'
    ]
  },

  // IMAP4 Flags extension (RFC 5232)
  imap4flags: {
    rfc: 'RFC 5232',
    description: 'IMAP flag manipulation',
    commands: ['setflag', 'addflag', 'removeflag'],
    tests: ['hasflag'],
    tags: [':flags']
  },

  // Relational extension (RFC 5231)
  relational: {
    rfc: 'RFC 5231',
    description: 'Relational comparisons',
    commands: [],
    tests: [],
    matchTypes: [':count', ':value'],
    operators: ['gt', 'ge', 'lt', 'le', 'eq', 'ne']
  },

  // Date extension (RFC 5260)
  date: {
    rfc: 'RFC 5260',
    description: 'Date and time tests',
    commands: [],
    tests: ['date', 'currentdate'],
    tags: [':zone', ':originalzone'],
    dateParts: [
      'year',
      'month',
      'day',
      'date',
      'julian',
      'hour',
      'minute',
      'second',
      'time',
      'iso8601',
      'std11',
      'zone',
      'weekday'
    ]
  },

  // Index extension (RFC 5260)
  index: {
    rfc: 'RFC 5260',
    description: 'Index into header fields',
    commands: [],
    tests: [],
    tags: [':index', ':last']
  },

  // Edit Header extension (RFC 5293)
  editheader: {
    rfc: 'RFC 5293',
    description: 'Add and delete headers',
    commands: ['addheader', 'deleteheader'],
    tests: [],
    tags: [':last', ':index']
  },

  // Notify extension (RFC 5435)
  enotify: {
    rfc: 'RFC 5435',
    description: 'Send notifications',
    commands: ['notify'],
    tests: ['valid_notify_method', 'notify_method_capability'],
    tags: [':method', ':from', ':importance', ':options', ':message']
  },

  // Environment extension (RFC 5183)
  environment: {
    rfc: 'RFC 5183',
    description: 'Test environment variables',
    commands: [],
    tests: ['environment'],
    items: [
      'domain',
      'host',
      'location',
      'name',
      'phase',
      'remote-host',
      'remote-ip',
      'version'
    ]
  },

  // Regex extension (draft-ietf-sieve-regex)
  regex: {
    rfc: 'draft-ietf-sieve-regex',
    description: 'Regular expression matching',
    commands: [],
    tests: [],
    matchTypes: [':regex']
  },

  // Subaddress extension (RFC 5233)
  subaddress: {
    rfc: 'RFC 5233',
    description: 'Test user+detail addressing',
    commands: [],
    tests: [],
    addressParts: [':user', ':detail']
  },

  // Ihave extension (RFC 5463)
  ihave: {
    rfc: 'RFC 5463',
    description: 'Test for extension availability',
    commands: [],
    tests: ['ihave'],
    controls: ['error']
  },

  // Duplicate extension (RFC 7352)
  duplicate: {
    rfc: 'RFC 7352',
    description: 'Detect duplicate deliveries',
    commands: [],
    tests: ['duplicate'],
    tags: [':handle', ':header', ':uniqueid', ':seconds', ':last']
  },

  // Special-use extension (RFC 8579)
  'special-use': {
    rfc: 'RFC 8579',
    description: 'Deliver to special-use mailboxes',
    commands: [],
    tests: ['specialuse_exists'],
    tags: [':specialuse'],
    flags: [
      String.raw`\Junk`,
      String.raw`\Trash`,
      String.raw`\Drafts`,
      String.raw`\Sent`,
      String.raw`\Archive`,
      String.raw`\Flagged`,
      String.raw`\Important`
    ]
  },

  // FCC extension (RFC 8580)
  fcc: {
    rfc: 'RFC 8580',
    description: 'File carbon copy',
    commands: [],
    tests: [],
    tags: [':fcc']
  },

  // Mailbox extension (RFC 5490)
  mailbox: {
    rfc: 'RFC 5490',
    description: 'Mailbox existence tests',
    commands: [],
    tests: ['mailboxexists'],
    tags: [':create']
  },

  // Mailbox metadata extensions (RFC 5490)
  mboxmetadata: {
    rfc: 'RFC 5490',
    description: 'Mailbox metadata tests',
    commands: [],
    tests: ['metadata', 'metadataexists']
  },

  // Server metadata extensions (RFC 5490)
  servermetadata: {
    rfc: 'RFC 5490',
    description: 'Server metadata tests',
    commands: [],
    tests: ['servermetadata', 'servermetadataexists']
  },

  // Include extension (RFC 6609)
  include: {
    rfc: 'RFC 6609',
    description: 'Include other scripts',
    commands: ['include', 'return'],
    tests: [],
    tags: [':personal', ':global', ':optional', ':once'],
    variables: ['global']
  },

  // Encoded character extension (RFC 5228)
  'encoded-character': {
    rfc: 'RFC 5228',
    description: 'Support for encoded characters in strings',
    commands: [],
    tests: []
  },

  // Spamtest extension (RFC 5235)
  spamtest: {
    rfc: 'RFC 5235',
    description: 'Spam score tests',
    commands: [],
    tests: ['spamtest'],
    tags: [':percent']
  },

  // Virustest extension (RFC 5235)
  virustest: {
    rfc: 'RFC 5235',
    description: 'Virus scan tests',
    commands: [],
    tests: ['virustest']
  },

  // MIME extension (RFC 5703)
  mime: {
    rfc: 'RFC 5703',
    description: 'MIME part tests and manipulation',
    commands: ['foreverypart', 'break', 'replace', 'enclose', 'extracttext'],
    tests: ['header', 'address', 'exists'],
    tags: [':mime', ':type', ':subtype', ':contenttype', ':param', ':anychild']
  },

  // Comparator extension (RFC 4790)
  'comparator-i;ascii-numeric': {
    rfc: 'RFC 4790',
    description: 'Numeric string comparison',
    commands: [],
    tests: []
  }
};

/**
 * Vacation Extension Implementation
 */
class VacationExtension {
  constructor(options = {}) {
    this.minDays = options.minDays || 1;
    this.maxDays = options.maxDays || 365;
    this.minSeconds = options.minSeconds || 0;
    this.maxSeconds = options.maxSeconds || 31_536_000; // 1 year
    this.defaultDays = options.defaultDays || 7;
  }

  /**
   * Validate vacation action parameters
   * @param {Object} action - Vacation action
   * @returns {Object} Validation result
   */
  validate(action) {
    const errors = [];

    // Validate days
    if (
      action.days !== undefined &&
      (action.days < this.minDays || action.days > this.maxDays)
    ) {
      errors.push(`Days must be between ${this.minDays} and ${this.maxDays}`);
    }

    // Validate seconds
    if (
      action.seconds !== undefined &&
      (action.seconds < this.minSeconds || action.seconds > this.maxSeconds)
    ) {
      errors.push(
        `Seconds must be between ${this.minSeconds} and ${this.maxSeconds}`
      );
    }

    // Validate message
    if (!action.message || action.message.trim() === '') {
      errors.push('Vacation message is required');
    }

    // Validate from address if provided
    if (action.from) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(action.from)) {
        errors.push('Invalid from address');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get effective interval in seconds
   * @param {Object} action - Vacation action
   * @returns {number} Interval in seconds
   */
  getInterval(action) {
    if (action.seconds !== undefined) {
      return action.seconds;
    }

    const days = action.days === undefined ? this.defaultDays : action.days;
    return days * 86_400;
  }
}

/**
 * Variables Extension Implementation
 */
class VariablesExtension {
  constructor() {
    this.variables = new Map();
    this.matchVariables = new Map();
  }

  /**
   * Set a variable
   * @param {string} name - Variable name
   * @param {string} value - Variable value
   * @param {string[]} modifiers - Value modifiers
   */
  set(name, value, modifiers = []) {
    let result = value;

    for (const modifier of modifiers) {
      result = this.applyModifier(result, modifier);
    }

    this.variables.set(name.toLowerCase(), result);
  }

  /**
   * Get a variable value
   * @param {string} name - Variable name
   * @returns {string} Variable value or empty string
   */
  get(name) {
    // Check for match variables (${1}, ${2}, etc.)
    const matchNumber = name.match(/^(\d+)$/);
    if (matchNumber) {
      return this.matchVariables.get(Number.parseInt(matchNumber[1], 10)) || '';
    }

    return this.variables.get(name.toLowerCase()) || '';
  }

  /**
   * Set match variables from a regex match
   * @param {RegExpMatchArray} match - Regex match result
   */
  setMatchVariables(match) {
    this.matchVariables.clear();

    if (match) {
      for (const [i, element] of match.entries()) {
        this.matchVariables.set(i, element || '');
      }
    }
  }

  /**
   * Apply a modifier to a value
   * @param {string} value - The value
   * @param {string} modifier - The modifier
   * @returns {string} Modified value
   */
  applyModifier(value, modifier) {
    switch (modifier) {
      case 'lower': {
        return value.toLowerCase();
      }

      case 'upper': {
        return value.toUpperCase();
      }

      case 'lowerfirst': {
        return value.charAt(0).toLowerCase() + value.slice(1);
      }

      case 'upperfirst': {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }

      case 'quotewildcard': {
        return value.replaceAll(/[*?\\]/g, String.raw`\$&`);
      }

      case 'length': {
        return String(value.length);
      }

      default: {
        return value;
      }
    }
  }

  /**
   * Interpolate variables in a string
   * @param {string} str - String with variable references
   * @returns {string} Interpolated string
   */
  interpolate(string_) {
    return string_.replaceAll(/\${([^}]+)}/g, (match, varName) =>
      this.get(varName)
    );
  }

  /**
   * Clear all variables
   */
  clear() {
    this.variables.clear();
    this.matchVariables.clear();
  }
}

/**
 * IMAP4 Flags Extension Implementation
 */
class Imap4FlagsExtension {
  constructor() {
    this.flags = new Set();
    this.variableFlags = new Map();
  }

  /**
   * Standard IMAP flags
   */
  static STANDARD_FLAGS = [
    String.raw`\Seen`,
    String.raw`\Answered`,
    String.raw`\Flagged`,
    String.raw`\Deleted`,
    String.raw`\Draft`,
    String.raw`\Recent`
  ];

  /**
   * Set flags (replace all)
   * @param {string[]} flags - Flags to set
   * @param {string} variableName - Optional variable name
   */
  setflag(flags, variableName = null) {
    const normalizedFlags = flags.map((f) => this.normalizeFlag(f));

    if (variableName) {
      this.variableFlags.set(variableName, new Set(normalizedFlags));
    } else {
      this.flags = new Set(normalizedFlags);
    }
  }

  /**
   * Add flags
   * @param {string[]} flags - Flags to add
   * @param {string} variableName - Optional variable name
   */
  addflag(flags, variableName = null) {
    const normalizedFlags = flags.map((f) => this.normalizeFlag(f));
    const target = variableName
      ? this.variableFlags.get(variableName) || new Set()
      : this.flags;

    for (const flag of normalizedFlags) {
      target.add(flag);
    }

    if (variableName && !this.variableFlags.has(variableName)) {
      this.variableFlags.set(variableName, target);
    }
  }

  /**
   * Remove flags
   * @param {string[]} flags - Flags to remove
   * @param {string} variableName - Optional variable name
   */
  removeflag(flags, variableName = null) {
    const normalizedFlags = flags.map((f) => this.normalizeFlag(f));
    const target = variableName
      ? this.variableFlags.get(variableName)
      : this.flags;

    if (target) {
      for (const flag of normalizedFlags) {
        target.delete(flag);
      }
    }
  }

  /**
   * Check if flags are set
   * @param {string[]} flags - Flags to check
   * @param {string} variableName - Optional variable name
   * @param {string} matchType - Match type (is, contains, matches)
   * @returns {boolean} True if flags match
   */
  hasflag(flags, variableName = null, matchType = 'is') {
    const target = variableName
      ? this.variableFlags.get(variableName) || new Set()
      : this.flags;

    const targetFlags = [...target];

    for (const flag of flags) {
      const normalizedFlag = this.normalizeFlag(flag);

      for (const targetFlag of targetFlags) {
        if (this.matchFlag(targetFlag, normalizedFlag, matchType)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get current flags
   * @param {string} variableName - Optional variable name
   * @returns {string[]} Current flags
   */
  getFlags(variableName = null) {
    const target = variableName
      ? this.variableFlags.get(variableName)
      : this.flags;

    return target ? [...target] : [];
  }

  /**
   * Normalize a flag name
   * @param {string} flag - Flag name
   * @returns {string} Normalized flag
   */
  normalizeFlag(flag) {
    // System flags start with backslash
    if (flag.startsWith('\\')) {
      // Capitalize system flags properly
      const name = flag.slice(1).toLowerCase();
      return '\\' + name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Keywords are case-insensitive
    return flag.toLowerCase();
  }

  /**
   * Match a flag against a pattern
   * @param {string} flag - Flag to match
   * @param {string} pattern - Pattern to match against
   * @param {string} matchType - Match type
   * @returns {boolean} True if matched
   */
  matchFlag(flag, pattern, matchType) {
    const normalizedFlag = flag.toLowerCase();
    const normalizedPattern = pattern.toLowerCase();

    switch (matchType) {
      case 'is': {
        return normalizedFlag === normalizedPattern;
      }

      case 'contains': {
        return normalizedFlag.includes(normalizedPattern);
      }

      case 'matches': {
        // Simple glob matching
        const regexPattern = normalizedPattern
          .replaceAll(/[$()+.[\]^{|}]/g, String.raw`\$&`)
          .replaceAll('*', '.*')
          .replaceAll('?', '.');
        return new RegExp(`^${regexPattern}$`).test(normalizedFlag);
      }

      default: {
        return normalizedFlag === normalizedPattern;
      }
    }
  }

  /**
   * Clear all flags
   */
  clear() {
    this.flags.clear();
    this.variableFlags.clear();
  }
}

/**
 * Body Extension Implementation
 */
class BodyExtension {
  /**
   * Extract body content based on transform
   * @param {Object} message - The message
   * @param {string|Object} transform - Body transform
   * @returns {string} Extracted content
   */
  extractContent(message, transform) {
    const body = message.body || '';
    const parts = message.parts || [];

    if (transform === 'raw') {
      return body;
    }

    if (transform === 'text') {
      // Extract text content
      return this.extractTextContent(body, parts);
    }

    if (typeof transform === 'object' && transform.type === 'content') {
      // Extract content of specific MIME types
      return this.extractMimeContent(parts, transform.contentTypes);
    }

    return body;
  }

  /**
   * Extract text content from message
   * @param {string} body - Raw body
   * @param {Object[]} parts - MIME parts
   * @returns {string} Text content
   */
  extractTextContent(body, parts) {
    // If we have parsed parts, look for text/plain
    for (const part of parts) {
      if (
        part.contentType === 'text/plain' ||
        part.contentType?.startsWith('text/plain')
      ) {
        return part.content || '';
      }
    }

    // Fall back to stripping HTML from body
    return body
      .replaceAll(/<[^>]*>/g, '')
      .replaceAll('&nbsp;', ' ')
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"');
  }

  /**
   * Extract content of specific MIME types
   * @param {Object[]} parts - MIME parts
   * @param {string[]} contentTypes - Content types to extract
   * @returns {string} Extracted content
   */
  extractMimeContent(parts, contentTypes) {
    const contents = [];

    for (const part of parts) {
      for (const type of contentTypes) {
        if (part.contentType === type || part.contentType?.startsWith(type)) {
          contents.push(part.content || '');
        }
      }
    }

    return contents.join('\n');
  }

  /**
   * Test body content
   * @param {Object} message - The message
   * @param {Object} test - Body test parameters
   * @returns {boolean} Test result
   */
  test(message, test) {
    const content = this.extractContent(message, test.bodyTransform);
    const { keys, matchType, comparator } = test;

    for (const key of keys) {
      if (this.matchContent(content, key, matchType, comparator)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Match content against a pattern
   * @param {string} content - Content to match
   * @param {string} pattern - Pattern to match against
   * @param {string} matchType - Match type
   * @param {string} comparator - Comparator
   * @returns {boolean} True if matched
   */
  matchContent(content, pattern, matchType, comparator) {
    let normalizedContent = content;
    let normalizedPattern = pattern;

    if (comparator === 'i;ascii-casemap' || !comparator) {
      normalizedContent = content.toLowerCase();
      normalizedPattern = pattern.toLowerCase();
    }

    switch (matchType) {
      case 'is': {
        return normalizedContent === normalizedPattern;
      }

      case 'contains': {
        return normalizedContent.includes(normalizedPattern);
      }

      case 'matches': {
        const regexPattern = normalizedPattern
          .replaceAll(/[$()+.[\]^{|}]/g, String.raw`\$&`)
          .replaceAll('*', '.*')
          .replaceAll('?', '.');
        return new RegExp(regexPattern).test(normalizedContent);
      }

      case 'regex': {
        try {
          return new RegExp(pattern, 'i').test(content);
        } catch {
          return false;
        }
      }

      default: {
        return normalizedContent === normalizedPattern;
      }
    }
  }
}

/**
 * Relational Extension Implementation
 */
class RelationalExtension {
  /**
   * Compare values using relational operator
   * @param {*} value - First value
   * @param {*} pattern - Second value
   * @param {string} operator - Relational operator
   * @param {string} type - Comparison type (count or value)
   * @returns {boolean} Comparison result
   */
  compare(value, pattern, operator, type) {
    if (type === 'count') {
      // Count comparison
      const count = Array.isArray(value) ? value.length : value ? 1 : 0;
      const target = Number.parseInt(pattern, 10) || 0;
      return this.compareValues(count, target, operator);
    }

    // Value comparison
    const numberValue = Number.parseFloat(value);
    const numberPattern = Number.parseFloat(pattern);

    if (!Number.isNaN(numberValue) && !Number.isNaN(numberPattern)) {
      return this.compareValues(numberValue, numberPattern, operator);
    }

    // String comparison
    return this.compareValues(String(value), String(pattern), operator);
  }

  /**
   * Compare two values with an operator
   * @param {*} a - First value
   * @param {*} b - Second value
   * @param {string} operator - Operator
   * @returns {boolean} Result
   */
  compareValues(a, b, operator) {
    switch (operator) {
      case 'gt': {
        return a > b;
      }

      case 'ge': {
        return a >= b;
      }

      case 'lt': {
        return a < b;
      }

      case 'le': {
        return a <= b;
      }

      case 'eq': {
        return a === b;
      }

      case 'ne': {
        return a !== b;
      }

      default: {
        return false;
      }
    }
  }
}

/**
 * Date Extension Implementation
 */
class DateExtension {
  /**
   * Extract a date part
   * @param {Date} date - The date
   * @param {string} part - Part to extract
   * @param {string} zone - Optional timezone
   * @returns {string} Extracted part
   */
  extractPart(date, part, zone) {
    let d = date;

    // Apply timezone offset if specified
    if (zone) {
      const match = zone.match(/^([+-])(\d{2}):?(\d{2})$/);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = Number.parseInt(match[2], 10);
        const minutes = Number.parseInt(match[3], 10);
        const offset = sign * (hours * 60 + minutes) * 60 * 1000;
        d = new Date(date.getTime() + offset);
      }
    }

    switch (part.toLowerCase()) {
      case 'year': {
        return String(d.getUTCFullYear());
      }

      case 'month': {
        return String(d.getUTCMonth() + 1).padStart(2, '0');
      }

      case 'day': {
        return String(d.getUTCDate()).padStart(2, '0');
      }

      case 'date': {
        return d.toISOString().split('T')[0];
      }

      case 'julian': {
        const start = new Date(d.getUTCFullYear(), 0, 0);
        const diff = d - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return String(Math.floor(diff / oneDay));
      }

      case 'hour': {
        return String(d.getUTCHours()).padStart(2, '0');
      }

      case 'minute': {
        return String(d.getUTCMinutes()).padStart(2, '0');
      }

      case 'second': {
        return String(d.getUTCSeconds()).padStart(2, '0');
      }

      case 'time': {
        return d.toISOString().split('T')[1].slice(0, 8);
      }

      case 'iso8601': {
        return d.toISOString();
      }

      case 'std11': {
        return d.toUTCString();
      }

      case 'zone': {
        return zone || '+0000';
      }

      case 'weekday': {
        return String(d.getUTCDay());
      }

      default: {
        return '';
      }
    }
  }

  /**
   * Parse a date from a header value
   * @param {string} value - Header value
   * @returns {Date|null} Parsed date or null
   */
  parseDate(value) {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}

/**
 * Subaddress Extension Implementation (RFC 5233)
 * Handles user+detail addressing (plus addressing)
 */
class SubaddressExtension {
  constructor(options = {}) {
    this.separator = options.separator || '+';
  }

  /**
   * Extract user part from address
   * @param {string} address - Email address
   * @returns {string} User part (before separator)
   */
  extractUser(address) {
    const localPart = address.split('@')[0] || '';
    const sepIndex = localPart.indexOf(this.separator);
    return sepIndex === -1 ? localPart : localPart.slice(0, sepIndex);
  }

  /**
   * Extract detail part from address
   * @param {string} address - Email address
   * @returns {string} Detail part (after separator)
   */
  extractDetail(address) {
    const localPart = address.split('@')[0] || '';
    const sepIndex = localPart.indexOf(this.separator);
    return sepIndex === -1 ? '' : localPart.slice(sepIndex + 1);
  }
}

/**
 * Duplicate Extension Implementation (RFC 7352)
 * Detects duplicate message deliveries
 */
class DuplicateExtension {
  constructor(options = {}) {
    this.store = options.store || new Map();
    this.defaultSeconds = options.defaultSeconds || 7 * 24 * 60 * 60; // 7 days
  }

  /**
   * Check if message is a duplicate
   * @param {Object} message - Message object
   * @param {Object} options - Duplicate test options
   * @returns {boolean} True if duplicate
   */
  isDuplicate(message, options = {}) {
    const uniqueId = this.getUniqueId(message, options);
    if (!uniqueId) {
      return false;
    }

    const handle = options.handle || 'default';
    const key = `${handle}:${uniqueId}`;
    const seconds = options.seconds || this.defaultSeconds;
    const now = Date.now();

    const existing = this.store.get(key);
    if (
      existing && // Check if within time window
      now - existing.timestamp < seconds * 1000
    ) {
      if (options.last) {
        // Update timestamp for :last
        this.store.set(key, { timestamp: now });
      }

      return true;
    }

    // Not a duplicate, record it
    this.store.set(key, { timestamp: now });
    return false;
  }

  /**
   * Get unique ID for duplicate detection
   * @param {Object} message - Message object
   * @param {Object} options - Options
   * @returns {string|null} Unique ID
   */
  getUniqueId(message, options) {
    if (options.uniqueid) {
      return options.uniqueid;
    }

    if (options.header) {
      const headers = message.headers || {};
      return headers[options.header.toLowerCase()];
    }

    // Default: use Message-ID header
    const headers = message.headers || {};
    return headers['message-id'];
  }

  /**
   * Clean up expired entries
   * @param {number} maxAge - Maximum age in seconds
   */
  cleanup(maxAge) {
    const now = Date.now();
    const maxAgeMs = (maxAge || this.defaultSeconds) * 1000;

    for (const [key, value] of this.store.entries()) {
      if (now - value.timestamp > maxAgeMs) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Special-Use Extension Implementation (RFC 8579)
 * Handles special-use mailbox flags
 */
class SpecialUseExtension {
  constructor() {
    this.specialUseFlags = new Map([
      [String.raw`\Junk`, 'Junk'],
      [String.raw`\Trash`, 'Trash'],
      [String.raw`\Drafts`, 'Drafts'],
      [String.raw`\Sent`, 'Sent'],
      [String.raw`\Archive`, 'Archive'],
      [String.raw`\Flagged`, 'Flagged'],
      [String.raw`\Important`, 'Important'],
      [String.raw`\All`, 'All']
    ]);
  }

  /**
   * Get mailbox name for special-use flag
   * @param {string} flag - Special-use flag
   * @returns {string|null} Mailbox name
   */
  getMailboxForFlag(flag) {
    return this.specialUseFlags.get(flag) || null;
  }

  /**
   * Check if a special-use mailbox exists
   * @param {string} flag - Special-use flag
   * @param {Function} mailboxExists - Function to check mailbox existence
   * @returns {boolean} True if exists
   */
  async specialuseExists(flag, mailboxExists) {
    const mailbox = this.getMailboxForFlag(flag);
    if (!mailbox) {
      return false;
    }

    return mailboxExists(mailbox);
  }
}

/**
 * Include Extension Implementation (RFC 6609)
 * Handles script inclusion
 */
class IncludeExtension {
  constructor(options = {}) {
    this.maxIncludes = options.maxIncludes || 10;
    this.maxNestingDepth = options.maxNestingDepth || 5;
    this.scriptLoader = options.scriptLoader || null;
  }

  /**
   * Load and include a script
   * @param {string} scriptName - Name of script to include
   * @param {Object} options - Include options
   * @param {Object} context - Execution context
   * @returns {Object|null} Parsed script or null
   */
  async include(scriptName, options, context) {
    if (!this.scriptLoader) {
      throw new Error('Script loader not configured');
    }

    // Check nesting depth
    const depth = context.includeDepth || 0;
    if (depth >= this.maxNestingDepth) {
      throw new Error(
        `Maximum include nesting depth (${this.maxNestingDepth}) exceeded`
      );
    }

    // Check include count
    const includeCount = context.includeCount || 0;
    if (includeCount >= this.maxIncludes) {
      throw new Error(`Maximum include count (${this.maxIncludes}) exceeded`);
    }

    // Check if already included with :once
    if (options.once) {
      const included = context.includedScripts || new Set();
      if (included.has(scriptName)) {
        return null; // Already included
      }
    }

    // Load script
    const location = options.personal ? 'personal' : 'global';
    const script = await this.scriptLoader(scriptName, location);

    if (!script && !options.optional) {
      throw new Error(`Script not found: ${scriptName}`);
    }

    return script;
  }
}

/**
 * Ihave Extension Implementation (RFC 5463)
 * Tests for extension availability
 */
class IhaveExtension {
  constructor(options = {}) {
    this.availableExtensions = new Set(
      options.extensions || Object.keys(EXTENSIONS)
    );
  }

  /**
   * Test if extensions are available
   * @param {string[]} extensions - Extensions to test
   * @returns {boolean} True if all available
   */
  ihave(extensions) {
    return extensions.every((ext) => this.availableExtensions.has(ext));
  }
}

module.exports = {
  EXTENSIONS,
  VacationExtension,
  VariablesExtension,
  Imap4FlagsExtension,
  BodyExtension,
  RelationalExtension,
  DateExtension,
  SubaddressExtension,
  DuplicateExtension,
  SpecialUseExtension,
  IncludeExtension,
  IhaveExtension
};
