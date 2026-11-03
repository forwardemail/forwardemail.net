/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Execution Engine - Executes parsed Sieve ASTs against email messages
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');

const RE2 = require('re2');
const {
  CORE_CAPABILITIES,
  SUPPORTED_CAPABILITIES,
  getCapability,
  isSupportedCapability
} = require('./capabilities');
const {
  MAX_EXPANDED_LENGTH,
  MAX_STORED_LENGTH,
  interpolate,
  isBareReference,
  truncate
} = require('./variable-references');

// characters a glob keeps literally that a regex reads as syntax
const GLOB_SPECIAL_CHARACTERS = new Set([
  '$',
  '(',
  ')',
  '*',
  '+',
  '.',
  '?',
  '[',
  '\\',
  ']',
  '^',
  '{',
  '|',
  '}'
]);

// RFC 4790 i;ascii-numeric: the number a string starts with, without its
// leading zeros, or "" for a string that does not start with a digit (which
// is greater than every number)
function toAsciiNumber(value) {
  let end = 0;
  while (end < value.length && value[end] >= '0' && value[end] <= '9') end++;
  if (end === 0) return '';
  let start = 0;
  while (start < end - 1 && value[start] === '0') start++;
  return value.slice(start, end);
}

// how a comparator sees a value: i;ascii-casemap (the default) ignores case,
// i;ascii-numeric reads the number it starts with, and a value that is not
// a string is compared as one ('' for none)
function getNormalizer(comparator) {
  const isCaseInsensitive = comparator === 'i;ascii-casemap' || !comparator;
  const isNumeric = comparator === 'i;ascii-numeric';
  return (value) => {
    const string_ = value === null || value === undefined ? '' : String(value);
    if (isNumeric) return toAsciiNumber(string_);
    return isCaseInsensitive ? string_.toLowerCase() : string_;
  };
}

// (i;ascii-casemap orders strings with ASCII letters made upper case)
function toAsciiUpperCase(value) {
  return value.replaceAll(/[a-z]+/g, (letters) => letters.toUpperCase());
}

//
// The order of two values for a comparator (RFC 4790, used by RFC 5231
// :value and :count): -1, 0 or 1. i;octet and i;ascii-casemap compare the
// UTF-8 octets, i;ascii-numeric the numbers the values start with.
//
function compareValues(a, b, comparator) {
  if (comparator === 'i;ascii-numeric') {
    const x = toAsciiNumber(a);
    const y = toAsciiNumber(b);
    if (x === y) return 0;
    if (x === '') return 1;
    if (y === '') return -1;
    if (x.length !== y.length) return x.length < y.length ? -1 : 1;
    return x < y ? -1 : 1;
  }

  if (comparator === 'i;ascii-casemap' || !comparator) {
    a = toAsciiUpperCase(a);
    b = toAsciiUpperCase(b);
  }

  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

// the value of a header by name, only if the message has it (a header named
// "constructor" or "__proto__" is not one of an object's own properties)
function getHeader(headers, name) {
  const key = String(name).toLowerCase();
  return headers && Object.hasOwn(headers, key) ? headers[key] : undefined;
}

// (a value that is not a string is compared as one, '' for none)
function toHeaderString(value) {
  return value === null || value === undefined ? '' : String(value);
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// the offsets of the zone names of RFC 2822 (section 4.3), in minutes
const ZONES = {
  UT: 0,
  GMT: 0,
  Z: 0,
  EST: -300,
  EDT: -240,
  CST: -360,
  CDT: -300,
  MST: -420,
  MDT: -360,
  PST: -480,
  PDT: -420
};

//
// The date-time of a header field (RFC 5260, section 4): the whole field, or
// what follows its last ";" (as in Received), in RFC 2822 form
// ("[Tue, ]1 Jul 2003 10:52:37 +0200"), or in ISO 8601 form. Returns the
// time and the zone it was written in (minutes east of UTC), or null.
//
function parseDateTime(value) {
  const string_ = toHeaderString(value);
  const semicolon = string_.lastIndexOf(';');
  for (const text of semicolon === -1
    ? [string_]
    : [string_.slice(semicolon + 1), string_]) {
    const match =
      /^\s*(?:[a-z]{3}\s*,\s*)?(\d{1,2})\s+([a-z]{3})\s+(\d{2,4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([+-]\d{4}|[a-z]{1,5})?/i.exec(
        text
      );
    if (match) {
      const month = MONTHS.findIndex(
        (m) => m.toLowerCase() === match[2].toLowerCase()
      );
      let year = Number(match[3]);
      // (two and three digit years, RFC 2822 section 4.3)
      if (match[3].length === 2) year += year < 50 ? 2000 : 1900;
      else if (match[3].length === 3) year += 1900;
      const day = Number(match[1]);
      const zoneName = (match[7] || '').toUpperCase();
      const zone = /^[+-]/.test(zoneName)
        ? (zoneName[0] === '-' ? -1 : 1) *
          (Number(zoneName.slice(1, 3)) * 60 + Number(zoneName.slice(3)))
        : ZONES[zoneName] || 0;
      const local = Date.UTC(
        year,
        month,
        day,
        Number(match[4]),
        Number(match[5]),
        Number(match[6] || 0)
      );
      // (a month, day or time out of range is not a date)
      if (
        month !== -1 &&
        Number(match[4]) < 24 &&
        Number(match[5]) < 60 &&
        Number(match[6] || 0) < 61 &&
        new Date(local).getUTCDate() === day
      )
        return { time: local - zone * 60_000, zone };
    }

    const iso =
      /^\s*\d{4}-\d{2}-\d{2}t\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(z|[+-]\d{2}:?\d{2})\s*$/i.exec(
        text
      );
    if (iso) {
      const time = Date.parse(text.trim());
      if (!Number.isNaN(time)) {
        const z = iso[1].toUpperCase().replace(':', '');
        const zone =
          z === 'Z'
            ? 0
            : (z[0] === '-' ? -1 : 1) *
              (Number(z.slice(1, 3)) * 60 + Number(z.slice(3)));
        return { time, zone };
      }
    }
  }

  return null;
}

// the characters of an IMAP flag (an atom, RFC 3501), "\" before a system flag
const FLAG_REGEX = /^\\?[!#$&'+,\-./\w:;<=>?@[^`|}~]+$/;

//
// A list of flags as the flags in it (RFC 5232, section 2): each string is a
// space-separated list, empty and invalid flags and \Recent (which cannot be
// set) are left out, and flags are the same whatever their case
//
function splitFlags(list) {
  const flags = new Map();
  for (const string_ of list || []) {
    for (const flag of toHeaderString(string_).split(/\s+/)) {
      const key = flag.toLowerCase();
      if (FLAG_REGEX.test(flag) && key !== '\\recent' && !flags.has(key))
        flags.set(key, flag);
    }
  }

  return [...flags.values()];
}

// the special-use attributes of the mailboxes every account keeps (RFC 6154;
// see REQUIRED_PATHS in helpers/ensure-default-mailboxes.js)
const DEFAULT_SPECIAL_USE = new Set(['\\drafts', '\\sent', '\\trash']);

// whether an envelope sender is the null reverse-path ("" or "<>")
function isNullPath(value) {
  if (Array.isArray(value)) value = value[0];
  const string_ = toHeaderString(value).trim();
  return string_ === '' || string_ === '<>';
}

// whether a match type is RFC 5231 :count
function isCount(matchType) {
  return typeof matchType === 'object' && matchType?.type === 'count';
}

//
// A Sieve glob as a regex: "*" for any run of characters and "?" for one,
// "\" making the character after it literal (RFC 5228, section 2.7.1). With
// `capture`, each wildcard is a group of as little as it can match, for the
// match variables of RFC 5229 (only the first nine are read).
//
function globToRegexSource(pattern, capture) {
  let source = '';
  let wildcards = 0;
  for (let i = 0; i < pattern.length; i++) {
    let char = pattern[i];
    if (char === '*' || char === '?') {
      wildcards++;
      if (char === '?') source += capture && wildcards <= 9 ? '(.)' : '.';
      else source += capture && wildcards <= 9 ? '(.*?)' : '.*';
      continue;
    }

    if (char === '\\' && i + 1 < pattern.length) char = pattern[++i];
    source += GLOB_SPECIAL_CHARACTERS.has(char) ? `\\${char}` : char;
  }

  return `^${source}$`;
}

//
// Split at each comma followed by an even number of double quotes (one not in
// a quoted name), as /,(?=(?:[^"]*"[^"]*")*[^"]*$)/ did, but in one pass: the
// lookahead read the rest of the value again at every comma, so a header of
// many addresses took minutes for any address test (also used to split the
// parameters of a MIME header at ";")
//
function splitAddressList(value, separator = ',') {
  let quotesAfter = 0;
  for (const element of value) {
    if (element === '"') quotesAfter++;
  }

  const parts = [];
  let from = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === '"') {
      quotesAfter--;
    } else if (char === separator && quotesAfter % 2 === 0) {
      parts.push(value.slice(from, i));
      from = i + 1;
    }
  }

  parts.push(value.slice(from));
  return parts;
}

//
// "Name" <address> or Name <address>, as /^(?:"?([^"<>]*)"?\s*)?<([^<>]+)>$/
// matched it (the same captures), without its backtracking: a long run of
// spaces in an address took seconds for every ten thousand
//
function matchAngleAddress(str) {
  const open = str.indexOf('<');
  if (open === -1 || str.includes('<', open + 1)) return null;
  const close = str.indexOf('>');
  if (close !== str.length - 1 || close < open + 2) return null;
  const prefix = str.slice(0, open);
  const first = prefix.indexOf('"');
  let name = prefix;
  if (first !== -1) {
    const second = prefix.indexOf('"', first + 1);
    if (second === -1) {
      // (one quote: before the name, or after it and before spaces)
      if (first === 0) name = prefix.slice(1);
      else if (prefix.slice(first + 1).trim() === '')
        name = prefix.slice(0, first);
      else return null;
    } else if (
      first === 0 &&
      !prefix.includes('"', second + 1) &&
      prefix.slice(second + 1).trim() === ''
    ) {
      name = prefix.slice(1, second);
    } else {
      return null;
    }
  }

  return [str, name, str.slice(open + 1, close)];
}

//
// An address without its comments, "(...)" outside a quoted name, which the
// address test never acts on (RFC 5228, section 5.1)
//
function withoutComments(str) {
  if (!str.includes('(')) return str;
  let out = '';
  let depth = 0;
  let quoted = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '\\' && (quoted || depth > 0)) {
      if (depth === 0) out += str.slice(i, i + 2);
      i++;
    } else if (depth === 0 && char === '"') {
      quoted = !quoted;
      out += char;
    } else if (!quoted && char === '(') {
      depth++;
    } else if (depth > 0 && char === ')') {
      depth--;
    } else if (depth === 0) {
      out += char;
    }
  }

  return out;
}

//
// The addresses of a group ("Team: a@example.com, b@example.com;") without
// its name and closing ";": the address test acts on the addresses in a
// group but never on the group name (RFC 5228, section 5.1)
//
function withoutGroupSyntax(str) {
  const colon = str.indexOf(':');
  if (colon !== -1 && !/["<@]/.test(str.slice(0, colon)))
    str = str.slice(colon + 1);
  const trimmed = str.trimEnd();
  return trimmed.endsWith(';') ? trimmed.slice(0, -1) : str;
}

/**
 * Parse email address(es) from a header value
 * @param {string} value - Header value containing email addresses
 * @returns {Object[]} Array of parsed address objects
 */
function parseAddresses(value) {
  // (a header given more than once, or an envelope "to" given as a list)
  if (Array.isArray(value)) return value.flatMap((v) => parseAddresses(v));

  if (!value || typeof value !== 'string') {
    return [];
  }

  const results = [];

  // Split by comma to handle multiple addresses
  const parts = splitAddressList(value);

  for (const part of parts) {
    const trimmed = withoutGroupSyntax(withoutComments(part)).trim();
    if (!trimmed) {
      continue;
    }

    // Try to match "Name" <email> or Name <email> format
    const angleMatch = matchAngleAddress(trimmed);
    if (angleMatch) {
      const email = angleMatch[2].trim();
      const atIndex = email.lastIndexOf('@');
      if (atIndex > 0) {
        results.push({
          name: angleMatch[1] ? angleMatch[1].trim() : '',
          address: email,
          local: email.slice(0, atIndex),
          domain: email.slice(atIndex + 1)
        });
        continue;
      }
    }

    // Try to match bare email format
    const bareMatch = trimmed.match(/^([^@\s]+@[^@\s]+)$/);
    if (bareMatch) {
      const email = bareMatch[1];
      const atIndex = email.lastIndexOf('@');
      results.push({
        name: '',
        address: email,
        local: email.slice(0, atIndex),
        domain: email.slice(atIndex + 1)
      });
    }
  }

  return results;
}

/**
 * Sieve Execution Engine
 */
class SieveEngine {
  /**
   * Create a new Sieve engine
   * @param {Object} options - Engine options
   * @param {Set<string>} options.capabilities - Additional capabilities to enable
   * @param {Object} options.logger - Logger instance
   */
  constructor(options = {}) {
    this.capabilities = new Set(
      (options.capabilities || SUPPORTED_CAPABILITIES)
        .map((capability) => getCapability(capability))
        .filter((capability) => SUPPORTED_CAPABILITIES.includes(capability))
    );
    this.logger = options.logger || console;
    this.extensions = new Map();

    // Runtime enforcement of protected headers (prevents variable substitution bypass)
    this.protectedHeaders = [...(options.protectedHeaders || [])].map((h) =>
      h.toLowerCase()
    );

    // Runtime enforcement of redirect domain restrictions
    this.allowedRedirectDomains = options.allowedRedirectDomains || [];
    this.redirectDomainBlacklist = options.redirectDomainBlacklist || [];

    // Register built-in extensions
    this.registerBuiltinExtensions();
  }

  /**
   * Register built-in extension handlers
   */
  registerBuiltinExtensions() {
    // Variables extension state
    this.extensions.set('variables', {
      variables: new Map()
    });

    // IMAP4 flags extension state
    this.extensions.set('imap4flags', {
      flags: new Set()
    });
  }

  /**
   * Check if a capability is supported
   * @param {string} capability - The capability to check
   * @returns {boolean} True if supported
   */
  hasCapability(capability) {
    const value = getCapability(capability);
    return (
      isSupportedCapability(value) &&
      (this.capabilities.has(value) || CORE_CAPABILITIES.includes(value))
    );
  }

  /**
   * Check whether a declared capability enables an RFC 5703 command: its
   * own ("foreverypart" for break), or "mime", which scripts have used for
   * all of them
   *
   * @param {Object} state - Execution state
   * @param {string} capability - RFC 5703 command capability
   * @returns {boolean} Whether the capability is enabled for this script
   */
  hasEnabledMimeCapability(state, capability) {
    return (
      state.enabledCapabilities.has('mime') ||
      state.enabledCapabilities.has(
        capability === 'break' ? 'foreverypart' : capability
      )
    );
  }

  /**
   * Require an RFC 5703 command capability at execution time.
   *
   * @param {Object} state - Execution state
   * @param {string} capability - RFC 5703 command capability
   * @throws {Error} If the capability was not declared with require
   */
  requireEnabledMimeCapability(state, capability) {
    if (!this.hasEnabledMimeCapability(state, capability)) {
      throw new Error(
        `MIME command "${capability}" requires "${
          capability === 'break' ? 'foreverypart' : capability
        }" to be declared with require.`
      );
    }
  }

  /**
   * Execute a Sieve script against a message
   * @param {Object} ast - The parsed Sieve AST
   * @param {Object} message - The email message
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Execution result with actions
   */
  async execute(ast, message, context = {}) {
    // Initialize execution state
    const state = {
      actions: [],
      implicitKeep: true,
      stopped: false,
      variables: new Map(),
      flags: new Set(),
      message: this.normalizeMessage(message),
      context,
      enabledCapabilities: new Set(),
      // MIME part iteration state (RFC 5703)
      mimeParts: message.mimeParts || [],
      currentPartIndex: -1,
      partIterStack: [],
      breakSignal: null,
      // Instruction counter for CPU abuse prevention
      instructionCount: 0,
      // (see MAX_EXPANDED_LENGTH)
      expandedLength: 0,
      // (see SieveEngine.MAX_MATCH_TIME)
      matchTime: 0,
      // (see MAX_STORED_LENGTH)
      storedLength: 0,
      // (every currentdate test of a run is at the same time, RFC 5260)
      now: new Date(),
      // the IDs of duplicate tests to store once the script has run
      duplicateWrites: new Map(),
      // the strings the last :matches or :regex that matched captured
      matchVariables: []
    };

    // Process require statements first
    await this.processRequires(ast, state);

    // Execute commands
    for (const command of ast.commands) {
      if (state.stopped) {
        break;
      }

      await this.executeCommand(command, state);
    }

    // (RFC 7352 section 3: only once the script has run without error)
    if (state.duplicateWrites.size > 0 && context.duplicateCache) {
      for (const [key, seconds] of state.duplicateWrites) {
        await context.duplicateCache.add(key, seconds);
      }
    }

    // Handle implicit keep
    // Per RFC 5228, implicit keep is cancelled by any action that disposes of the message
    // The :copy flag preserves implicit keep
    const hasCancellingAction = state.actions.some(
      (a) =>
        a.type === 'keep' ||
        (a.type === 'fileinto' && !a.copy) ||
        (a.type === 'redirect' && !a.copy) ||
        a.type === 'discard' ||
        a.type === 'reject' ||
        a.type === 'ereject'
    );

    if (state.implicitKeep && !hasCancellingAction) {
      state.actions.push({
        type: 'keep',
        flags: [...state.flags]
      });
    }

    return {
      actions: state.actions,
      variables: Object.fromEntries(state.variables),
      flags: [...state.flags],
      implicitKeep: state.implicitKeep && !hasCancellingAction
    };
  }

  /**
   * Normalize message object for consistent access
   * @param {Object} message - Raw message object
   * @returns {Object} Normalized message
   */
  normalizeMessage(message) {
    // (no prototype: a header named "__proto__" or "constructor" is a header)
    const headers = Object.create(null);

    // Normalize headers to lowercase keys
    if (message.headers) {
      for (const [key, value] of Object.entries(message.headers)) {
        headers[key.toLowerCase()] = value;
      }
    }

    return {
      headers,

      size: message.size > 0 ? message.size : 0,
      // (an envelope without a sender has the null reverse-path)
      envelope: message.envelope
        ? {
            from: message.envelope.from || '',
            to: message.envelope.to || ''
          }
        : { from: message.from || '', to: message.to || '' },
      body: message.body || '',
      raw: message.raw,
      date: message.date || new Date()
    };
  }

  /**
   * Process require statements and validate capabilities
   * @param {Object} ast - The AST
   * @param {Object} state - Execution state
   */
  async processRequires(ast, state) {
    for (const command of ast.commands) {
      if (command.type === 'Require') {
        for (const capability of command.capabilities) {
          if (!this.hasCapability(capability)) {
            throw new Error(`Unsupported capability: ${capability}`);
          }

          state.enabledCapabilities.add(getCapability(capability));
        }
      }
    }
  }

  /**
   * Execute a single command
   * @param {Object} command - The command to execute
   * @param {Object} state - Execution state
   */
  async executeCommand(command, state) {
    // (see MAX_ACTIONS)
    if (state.actions.length > SieveEngine.MAX_ACTIONS)
      throw new Error('Sieve script exceeded the number of actions');

    switch (command.type) {
      case 'Require': {
        // Already processed
        break;
      }

      case 'If': {
        await this.executeIf(command, state);
        break;
      }

      case 'Stop': {
        state.stopped = true;
        break;
      }

      case 'Keep': {
        state.actions.push({
          type: 'keep',
          flags: this.getActionFlags(command, state)
        });
        state.implicitKeep = false;
        break;
      }

      case 'Fileinto': {
        const fileintoFlags = this.getActionFlags(command, state);
        state.actions.push({
          type: 'fileinto',
          mailbox: this.interpolateVariables(command.mailbox, state),
          copy: command.copy || false,
          create: command.create || false,
          specialuse: command.specialuse || null,
          flags: fileintoFlags
        });
        if (!command.copy) {
          state.implicitKeep = false;
        }

        break;
      }

      case 'Redirect': {
        const resolvedAddress = this.interpolateVariables(
          command.address,
          state
        );

        // Runtime enforcement of redirect domain restrictions
        // (prevents bypass via variable substitution)
        const addrDomain = resolvedAddress.match(/@([^@>]+)>?$/);
        if (addrDomain) {
          const domain = addrDomain[1].toLowerCase();
          if (
            this.allowedRedirectDomains.length > 0 &&
            !this.allowedRedirectDomains.includes(domain)
          ) {
            this.logger.warn(
              `Blocked redirect to non-whitelisted domain: ${domain}`
            );
            break;
          }

          if (this.redirectDomainBlacklist.includes(domain)) {
            this.logger.warn(
              `Blocked redirect to blacklisted domain: ${domain}`
            );
            break;
          }
        }

        state.actions.push({
          type: 'redirect',
          address: resolvedAddress,
          copy: command.copy || false
        });
        if (!command.copy) {
          state.implicitKeep = false;
        }

        break;
      }

      case 'Discard': {
        state.actions.push({ type: 'discard' });
        state.implicitKeep = false;
        break;
      }

      case 'Reject': {
        this.checkReject(state);
        state.actions.push({
          type: 'reject',
          message: this.interpolateVariables(command.message, state)
        });
        state.implicitKeep = false;
        break;
      }

      case 'Ereject': {
        this.checkReject(state);
        state.actions.push({
          type: 'ereject',
          message: this.interpolateVariables(command.message, state)
        });
        state.implicitKeep = false;
        break;
      }

      case 'Set': {
        this.runTimed(state, () => this.executeSet(command, state));
        break;
      }

      case 'Setflag': {
        this.runTimed(state, () => this.executeSetflag(command, state));
        break;
      }

      case 'Addflag': {
        this.runTimed(state, () => this.executeAddflag(command, state));
        break;
      }

      case 'Removeflag': {
        this.runTimed(state, () => this.executeRemoveflag(command, state));
        break;
      }

      case 'Vacation': {
        await this.executeVacation(command, state);
        break;
      }

      case 'Addheader': {
        const addHeaderName = this.interpolateVariables(command.name, state);

        // Runtime enforcement of protected headers
        // (prevents bypass via variable substitution)
        if (this.protectedHeaders.includes(addHeaderName.toLowerCase())) {
          this.logger.warn(
            `Blocked addheader for protected header: ${addHeaderName}`
          );
          break;
        }

        const addHeaderValue = this.interpolateVariables(command.value, state);
        state.actions.push({
          type: 'addheader',
          name: addHeaderName,
          value: addHeaderValue,
          last: command.last || false
        });
        // (later tests see the change, RFC 5293 section 7)
        this.editHeader(state, addHeaderName, (values) =>
          command.last
            ? [...values, addHeaderValue]
            : [addHeaderValue, ...values]
        );
        break;
      }

      case 'Deleteheader': {
        const delHeaderName = this.interpolateVariables(command.name, state);

        // Runtime enforcement of protected headers
        // (prevents bypass via variable substitution)
        if (this.protectedHeaders.includes(delHeaderName.toLowerCase())) {
          this.logger.warn(
            `Blocked deleteheader for protected header: ${delHeaderName}`
          );
          break;
        }

        const patterns = (command.values || []).map((v) =>
          this.interpolateVariables(v, state)
        );
        state.actions.push({
          type: 'deleteheader',
          name: delHeaderName,
          index: command.index,
          last: command.last || false,
          matchType: command.matchType,
          comparator: command.comparator,
          values: patterns
        });
        // (later tests see the change, RFC 5293 sections 5 and 7)
        this.runTimed(state, () => {
          const matchers = patterns.map((pattern) =>
            this.createMatcher(
              pattern,
              command.matchType || 'is',
              command.comparator || 'i;ascii-casemap'
            )
          );
          this.editHeader(state, delHeaderName, (values) => {
            const position = command.last
              ? values.length - command.index
              : command.index - 1;
            return values.filter(
              (value, i) =>
                (command.index && i !== position) ||
                (matchers.length > 0 && !matchers.some((match) => match(value)))
            );
          });
        });
        break;
      }

      case 'Notify': {
        const method = this.interpolateVariables(command.method || '', state);
        // (a method that is not supported or not valid is a runtime error,
        // RFC 5435 section 3.2; mailto is the one there is)
        if (!this.isValidNotifyMethod(method))
          throw new Error(`Sieve notify method is not supported: ${method}`);
        state.actions.push({
          type: 'notify',
          method,
          from: command.from
            ? this.interpolateVariables(command.from, state)
            : command.from,
          importance: command.importance
            ? this.interpolateVariables(command.importance, state)
            : command.importance,
          options: (command.options || []).map((option) =>
            this.interpolateVariables(option, state)
          ),
          message: this.interpolateVariables(command.message || '', state)
        });
        break;
      }

      // (RFC 5463 section 5: the script fails, and the message is kept)
      case 'Error': {
        throw new Error(
          `Sieve script error: ${this.interpolateVariables(
            command.message,
            state
          )}`
        );
      }

      // (a command only an ihave block can hold, run without its capability)
      case 'UnknownCommand': {
        throw new Error(`Unsupported Sieve command: ${command.name}`);
      }

      case 'Foreverypart': {
        this.requireEnabledMimeCapability(state, 'foreverypart');
        await this.executeForeverypart(command, state);
        break;
      }

      case 'Break': {
        this.requireEnabledMimeCapability(state, 'break');
        // Signal break to the nearest enclosing foreverypart loop
        state.breakSignal = command.name || true;
        break;
      }

      case 'Extracttext': {
        this.requireEnabledMimeCapability(state, 'extracttext');
        this.runTimed(state, () => this.executeExtracttext(command, state));
        break;
      }

      case 'Replace': {
        this.requireEnabledMimeCapability(state, 'replace');
        this.executeReplace(command, state);
        break;
      }

      case 'Enclose': {
        throw new Error('Sieve enclose is not supported');
      }

      default: {
        this.logger.warn(`Unknown command type: ${command.type}`);
      }
    }
  }

  /**
   * Change the values of a header of the message, so later tests see it
   * (RFC 5293, section 7)
   * @param {Object} state - Execution state
   * @param {string} name - The header name
   * @param {Function} edit - (values) => new values
   */
  editHeader(state, name, edit) {
    const { headers } = state.message;
    const key = String(name).toLowerCase();
    const current = getHeader(headers, key);
    const values = edit(
      current === undefined
        ? []
        : [current].flat().map((v) => toHeaderString(v))
    );
    if (values.length === 0) delete headers[key];
    else headers[key] = values.length === 1 ? values[0] : values;
  }

  /**
   * Whether a notification method is a mailto URI with an address
   * (RFC 5436)
   * @param {string} uri - The method
   * @returns {boolean} Whether it can be used
   */
  isValidNotifyMethod(uri) {
    const match = /^mailto:([^?]*)(?:\?(.*))?$/is.exec(uri);
    if (!match) return false;
    try {
      // (the addresses of the path and of any "to" field, RFC 6068)
      const to = [decodeURIComponent(match[1])];
      for (const field of (match[2] || '').split('&')) {
        const equals = field.indexOf('=');
        if (equals !== -1 && field.slice(0, equals).toLowerCase() === 'to')
          to.push(decodeURIComponent(field.slice(equals + 1)));
      }

      return parseAddresses(to.join(',')).length > 0;
    } catch {
      return false;
    }
  }

  /**
   * The flags a keep or fileinto stores: those of its :flags, which replace
   * the internal variable for this copy (RFC 5232, section 5), or the
   * internal variable's
   * @param {Object} command - The keep or fileinto command
   * @param {Object} state - Execution state
   * @returns {string[]} The flags
   */
  getActionFlags(command, state) {
    const flags =
      command.flags?.length > 0
        ? this.getFlags(command.flags, state)
        : [...state.flags];
    this.checkFlagLimit(state, flags.length);
    return flags;
  }

  /**
   * A reject or ereject may be used once, and not with vacation (RFC 5429,
   * section 2.4); a script that does is stopped as for any error
   * @param {Object} state - Execution state
   * @throws {Error} If the script already rejects or replies
   */
  checkReject(state) {
    if (
      state.actions.some(
        (a) =>
          a.type === 'reject' || a.type === 'ereject' || a.type === 'vacation'
      )
    )
      throw new Error(
        'A Sieve script may reject a message once, and not with vacation'
      );
  }

  /**
   * Execute an if/elsif/else command
   * @param {Object} command - The if command
   * @param {Object} state - Execution state
   */
  async executeIf(command, state) {
    const testResult = await this.evaluateTest(command.test, state);

    if (testResult) {
      for (const cmd of command.block) {
        if (state.stopped || state.breakSignal) {
          break;
        }

        await this.executeCommand(cmd, state);
      }

      return;
    }

    // Try elsif branches
    if (command.elsif && command.elsif.length > 0) {
      for (const elsif of command.elsif) {
        const elsifResult = await this.evaluateTest(elsif.test, state);
        if (elsifResult) {
          for (const cmd of elsif.block) {
            if (state.stopped || state.breakSignal) {
              break;
            }

            await this.executeCommand(cmd, state);
          }

          return;
        }
      }
    }

    // Try else branch
    if (command.else && command.else.length > 0) {
      for (const cmd of command.else) {
        if (state.stopped || state.breakSignal) {
          break;
        }

        await this.executeCommand(cmd, state);
      }
    }
  }

  /**
   * Evaluate a test
   * @param {Object} test - The test to evaluate
   * @param {Object} state - Execution state
   * @returns {Promise<boolean>} Test result
   */
  async evaluateTest(test, state) {
    try {
      return await this.evaluateTestType(test, state);
    } finally {
      // (the time matching took since it was last counted, see getKeyMatchers)
      const { countMatchTime } = state;
      state.countMatchTime = null;
      if (countMatchTime) countMatchTime();
    }
  }

  /**
   * Evaluate a test (see evaluateTest)
   * @param {Object} test - The test
   * @param {Object} state - Execution state
   * @returns {Promise<boolean>} Test result
   */
  async evaluateTestType(test, state) {
    switch (test.type) {
      case 'TrueTest': {
        return true;
      }

      case 'FalseTest': {
        return false;
      }

      case 'NotTest': {
        return !(await this.evaluateTest(test.test, state));
      }

      case 'AllofTest': {
        for (const t of test.tests) {
          if (!(await this.evaluateTest(t, state))) {
            return false;
          }
        }

        return true;
      }

      case 'AnyofTest': {
        for (const t of test.tests) {
          if (await this.evaluateTest(t, state)) {
            return true;
          }
        }

        return false;
      }

      case 'HeaderTest': {
        return this.evaluateHeaderTest(test, state);
      }

      case 'AddressTest': {
        return this.evaluateAddressTest(test, state);
      }

      case 'EnvelopeTest': {
        return this.evaluateEnvelopeTest(test, state);
      }

      case 'SizeTest': {
        return this.evaluateSizeTest(test, state);
      }

      case 'ExistsTest': {
        return this.evaluateExistsTest(test, state);
      }

      case 'BodyTest': {
        return this.evaluateBodyTest(test, state);
      }

      case 'DateTest': {
        return this.evaluateDateTest(test, state);
      }

      case 'CurrentdateTest': {
        return this.evaluateCurrentdateTest(test, state);
      }

      case 'HasflagTest': {
        return this.evaluateHasflagTest(test, state);
      }

      case 'StringTest': {
        return this.evaluateStringTest(test, state);
      }

      case 'EnvironmentTest': {
        return this.evaluateEnvironmentTest(test, state);
      }

      case 'DuplicateTest': {
        return this.evaluateDuplicateTest(test, state);
      }

      case 'IhaveTest': {
        return this.evaluateIhaveTest(test, state);
      }

      case 'MailboxexistsTest': {
        return this.evaluateMailboxexistsTest(test, state);
      }

      case 'MetadataTest': {
        // Metadata extension not fully supported - always return false
        return false;
      }

      case 'MetadataexistsTest': {
        // Metadata extension not fully supported - always return false
        return false;
      }

      case 'SpecialuseexistsTest': {
        return this.evaluateSpecialuseexistsTest(test, state);
      }

      // (RFC 5435 section 4: mailto is the method there is)
      case 'ValidNotifyMethodTest': {
        return test.uris.every((uri) =>
          this.isValidNotifyMethod(this.interpolateVariables(uri, state))
        );
      }

      // (RFC 5435 section 5: whether the recipient is online is not known)
      case 'NotifyMethodCapabilityTest': {
        const uri = this.interpolateVariables(test.uri, state);
        const capability = this.interpolateVariables(test.capability, state);
        return this.matchValues(
          this.isValidNotifyMethod(uri) && capability.toLowerCase() === 'online'
            ? ['maybe']
            : [],
          test,
          state
        );
      }

      // (a test only an ihave block can hold, run without its capability)
      case 'UnknownTest': {
        throw new Error(`Unsupported Sieve test: ${test.name}`);
      }

      case 'ValidextlistTest': {
        // External lists not supported - always return false
        return false;
      }

      default: {
        this.logger.warn(`Unknown test type: ${test.type}`);
        return false;
      }
    }
  }

  /**
   * Evaluate a header test
   * When the :mime tag is present (RFC 5703), tests against the current
   * MIME part's headers instead of the top-level message headers.
   * The :type, :subtype, :contenttype, and :param tags provide
   * structured access to Content-Type fields.
   *
   * @param {Object} test - The header test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateHeaderTest(test, state) {
    const { headers } = test;

    // RFC 5703: :mime tag redirects header lookup to current MIME part
    if (test.mime) {
      return this.evaluateMimeHeaderTest(test, state);
    }

    return this.matchValues(
      this.getFieldValues(state.message.headers, headers, test),
      test,
      state
    );
  }

  /**
   * The values of the named header fields, in the order of the header list,
   * or with :index only the field it names (RFC 5260, section 6: the fields
   * of all the names are counted together, from the last one with :last)
   * @param {Object} headers - Header values by lowercase name
   * @param {string[]} names - The header names
   * @param {Object} test - The test (its index and last)
   * @returns {string[]} The values
   */
  getFieldValues(headers, names, test) {
    const values = [];
    for (const name of names) {
      const value = getHeader(headers, name);
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) values.push(toHeaderString(v));
      } else {
        values.push(toHeaderString(value));
      }
    }

    if (!test.index) return values;
    const position = test.last ? values.length - test.index : test.index - 1;
    return position >= 0 && position < values.length ? [values[position]] : [];
  }

  /**
   * Whether any value matches any key, or with :count (RFC 5231) whether
   * the number of values does
   * @param {string[]} values - The values from the message
   * @param {Object} test - The test (its keys, match type and comparator)
   * @param {Object} state - Execution state
   * @param {number} [count] - The number to compare for :count
   * @returns {boolean} Test result
   */
  matchValues(values, test, state, count = values.length) {
    const { keys, matchType, comparator } = test;
    const getMatcher = this.getKeyMatchers(keys, matchType, comparator, state);
    if (isCount(matchType)) values = [String(count)];
    for (const value of values) {
      for (let i = 0; i < keys.length; i++) {
        if (getMatcher(i)(value)) return true;
      }
    }

    return false;
  }

  /**
   * Evaluate a header test with :mime tag against the current MIME part
   * Supports :type, :subtype, :contenttype, :param, and :anychild tags
   * per RFC 5703 Section 4.
   *
   * @param {Object} test - The header test with mime tags
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateMimeHeaderTest(test, state) {
    const { headers } = test;

    // (outside foreverypart the message itself, RFC 5703 section 4.2)
    const partsToCheck = test.anychild
      ? this.getDescendantParts(state)
      : [this.getCurrentMimePart(state) || this.getMessagePart(state)];
    const values = [];

    for (const checkPart of partsToCheck) {
      for (const headerName of headers) {
        // Handle :type, :subtype, :contenttype, :param structured access
        if (test.mimeType === 'param') {
          // (each parameter named, RFC 5703 section 4.1)
          const names = Array.isArray(test.mimeParam)
            ? test.mimeParam
            : [test.mimeParam];
          for (const name of names) {
            const value = this.getMimeStructuredValue(
              checkPart,
              'param',
              name,
              headerName
            );
            if (value !== undefined && value !== null) values.push(value);
          }

          continue;
        }

        const headerValue = test.mimeType
          ? this.getMimeStructuredValue(
              checkPart,
              test.mimeType,
              null,
              headerName
            )
          : getHeader(checkPart.headers, headerName);

        if (headerValue === undefined || headerValue === null) {
          continue;
        }

        if (Array.isArray(headerValue)) {
          for (const value of headerValue) values.push(toHeaderString(value));
        } else {
          values.push(toHeaderString(headerValue));
        }
      }
    }

    return this.matchValues(values, test, state);
  }

  /**
   * Get structured MIME value based on :type/:subtype/:contenttype/:param tags
   * Per RFC 5703 §4.1:
   *   - For Content-Type: :type = major type, :subtype = subtype
   *   - For Content-Disposition: :type = disposition value (e.g. "inline"/"attachment")
   *   - For other headers: :type/:subtype return blank string
   *   - :param extracts parameters from the header actually being tested
   *
   * @param {Object} part - MIME part
   * @param {string} mimeType - One of 'type', 'subtype', 'contenttype', 'param'
   * @param {string} mimeParam - Parameter name (for :param)
   * @param {string} headerName - The header being tested
   * @returns {string|undefined} The extracted value
   */
  getMimeStructuredValue(part, mimeType, mimeParam, headerName) {
    const normalizedHeader = (headerName || '').toLowerCase().trim();
    const ct = (part.contentType || '').toLowerCase();
    const first = (value) =>
      toHeaderString(Array.isArray(value) ? value[0] : value);
    const cd = first(getHeader(part.headers, 'content-disposition'));

    switch (mimeType) {
      case 'type': {
        if (normalizedHeader === 'content-type') {
          // Major type (e.g., "text" from "text/plain")
          const slashIdx = ct.indexOf('/');
          return slashIdx > 0 ? ct.slice(0, slashIdx) : ct;
        }

        if (normalizedHeader === 'content-disposition') {
          // Disposition value (e.g., "inline" or "attachment")
          const semi = cd.indexOf(';');
          return (semi > 0 ? cd.slice(0, semi) : cd).trim().toLowerCase();
        }

        // Other headers: blank string per RFC 5703
        return '';
      }

      case 'subtype': {
        if (normalizedHeader === 'content-type') {
          const slashIdx2 = ct.indexOf('/');
          return slashIdx2 > 0 ? ct.slice(slashIdx2 + 1) : '';
        }

        // :subtype is only meaningful for Content-Type
        return '';
      }

      case 'contenttype': {
        if (normalizedHeader === 'content-type') {
          return ct;
        }

        // (for Content-Disposition the same as :type, RFC 5703 section 4.1)
        if (normalizedHeader === 'content-disposition') {
          const semi = cd.indexOf(';');
          return (semi > 0 ? cd.slice(0, semi) : cd).trim().toLowerCase();
        }

        // other headers: blank string
        return '';
      }

      case 'param': {
        if (!mimeParam || !part.headers) {
          return undefined;
        }

        // Extract parameter from the header actually being tested (a whole
        // parameter name: "name" is not the end of "filename")
        const rawHeader = first(getHeader(part.headers, normalizedHeader));
        const wanted = String(mimeParam).toLowerCase();
        for (const parameter of splitAddressList(rawHeader, ';').slice(1)) {
          const equals = parameter.indexOf('=');
          if (equals === -1) continue;
          if (parameter.slice(0, equals).trim().toLowerCase() !== wanted)
            continue;
          const value = parameter.slice(equals + 1).trim();
          return value.length > 1 &&
            value.startsWith('"') &&
            value.endsWith('"')
            ? value.slice(1, -1)
            : value;
        }

        return undefined;
      }

      default: {
        return undefined;
      }
    }
  }

  /**
   * Get all descendant parts from current position (for :anychild)
   * @param {Object} state - Execution state
   * @returns {Object[]} Array of descendant MIME parts
   */
  getDescendantParts(state) {
    const parts = state.mimeParts;
    const idx = state.currentPartIndex;
    // (outside foreverypart the message and every part in it)
    if (idx < 0 || state.partIterStack.length === 0) {
      return parts.length > 0 ? parts : [this.getMessagePart(state)];
    }

    if (idx >= parts.length) {
      return [];
    }

    // (parts given without the part they are in keep the flat approximation:
    // the current part and all the parts after it)
    if (!Number.isInteger(parts[idx].parentIndex)) return parts.slice(idx);

    //
    // The current part and its descendants (RFC 5703 :anychild): the parts
    // right after it, in tree order, whose chain of parents reaches it. All
    // the parts after it also held its siblings, and in a foreverypart loop
    // made every part test every part after it.
    //
    const descendants = [parts[idx]];
    for (let i = idx + 1; i < parts.length; i++) {
      let parent = parts[i].parentIndex;
      while (Number.isInteger(parent) && parent > idx)
        parent = parts[parent].parentIndex;
      if (parent !== idx) break;
      descendants.push(parts[i]);
    }

    return descendants;
  }

  /**
   * Evaluate an address test
   * @param {Object} test - The address test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateAddressTest(test, state) {
    const { headers, addressPart } = test;
    const addresses = [];
    //
    // (each header value is parsed once a run, however many tests read it,
    // and the time counts against MAX_MATCH_TIME: a script can hold
    // thousands of tests, and a header can be large)
    //
    this.runTimed(state, () => {
      state.parsedAddresses ||= new Map();
      for (const source of this.getHeaderSources(test, state)) {
        for (const value of this.getFieldValues(source, headers, test)) {
          let parsed = state.parsedAddresses.get(value);
          if (!parsed) {
            parsed = parseAddresses(value);
            state.parsedAddresses.set(value, parsed);
          }

          for (const address of parsed) addresses.push(address);
        }
      }
    });

    return this.matchValues(
      this.getAddressParts(addresses, addressPart),
      test,
      state,
      // (:count counts the addresses, RFC 5231 section 4.2)
      addresses.length
    );
  }

  /**
   * The headers a test with :mime and :anychild (RFC 5703, section 4.2)
   * looks at: those of the message without :mime; with it, those of the
   * current part (the message itself outside foreverypart) and with
   * :anychild those of the parts in it too
   * @param {Object} test - The test
   * @param {Object} state - Execution state
   * @returns {Object[]} Header objects
   */
  getHeaderSources(test, state) {
    if (!test.mime) return [state.message.headers];
    const parts = test.anychild
      ? this.getDescendantParts(state)
      : [this.getCurrentMimePart(state) || this.getMessagePart(state)];
    return parts.map((part) => part.headers || {});
  }

  /**
   * The address part of each address that has it (an address without a
   * detail has no :detail, RFC 5233 section 4)
   * @param {Object[]} addresses - Parsed addresses
   * @param {string} addressPart - The address part
   * @returns {string[]} The values
   */
  getAddressParts(addresses, addressPart) {
    const values = [];
    for (const address of addresses) {
      const value = this.extractAddressPart(address, addressPart);
      if (value !== null) values.push(value);
    }

    return values;
  }

  /**
   * Evaluate an envelope test
   * @param {Object} test - The envelope test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateEnvelopeTest(test, state) {
    const { parts, addressPart } = test;
    const { envelope } = state.message;
    const values = [];
    let count = 0;

    for (const part of parts) {
      const name = part.toLowerCase();
      if (name !== 'from' && name !== 'to') continue;
      const value = envelope[name];

      //
      // The null reverse-path is matched as the empty string whatever the
      // address part (RFC 5228, section 5.4), and counts as no address
      // (RFC 5231, section 4.2)
      //
      if (name === 'from' && isNullPath(value)) {
        values.push('');
        continue;
      }

      const addresses = parseAddresses(value);
      count += addresses.length;
      for (const v of this.getAddressParts(addresses, addressPart))
        values.push(v);
    }

    return this.matchValues(values, test, state, count);
  }

  /**
   * Extract address part from parsed address
   * @param {Object} addr - Parsed address object
   * @param {string} addressPart - Part to extract
   * @returns {string} Extracted part
   */
  extractAddressPart(addr, addressPart) {
    // Email-addresses library returns { address: 'local@domain', local: 'local', domain: 'domain' }
    const email = addr.address || '';
    const localpart =
      addr.local || (email.includes('@') ? email.split('@')[0] : email);

    switch (addressPart) {
      case 'localpart': {
        return localpart;
      }

      case 'domain': {
        return addr.domain || (email.includes('@') ? email.split('@')[1] : '');
      }

      // Subaddress extension (RFC 5233)
      case 'user': {
        // Extract user part before the '+' delimiter
        const plusIndex = localpart.indexOf('+');
        return plusIndex >= 0 ? localpart.slice(0, plusIndex) : localpart;
      }

      case 'detail': {
        // Extract detail part after the '+' delimiter (none without it,
        // which no key matches; "" for "user+@", RFC 5233 section 4)
        const plusIndex = localpart.indexOf('+');
        return plusIndex >= 0 ? localpart.slice(plusIndex + 1) : null;
      }

      default: {
        return email;
      }
    }
  }

  /**
   * Evaluate a size test
   * @param {Object} test - The size test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateSizeTest(test, state) {
    const messageSize = state.message.size;

    if (test.over !== undefined) {
      return messageSize > test.over;
    }

    if (test.under !== undefined) {
      return messageSize < test.under;
    }

    return false;
  }

  /**
   * Evaluate an exists test
   * @param {Object} test - The exists test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateExistsTest(test, state) {
    // (with :mime the headers of the current part, and with :anychild of
    // the parts in it too, RFC 5703 section 4.3)
    const sources = this.getHeaderSources(test, state);
    return test.headers.every((name) =>
      sources.some((headers) => getHeader(headers, name) !== undefined)
    );
  }

  /**
   * Evaluate a body test (RFC 5173)
   * @param {Object} test - The body test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateBodyTest(test, state) {
    // (the time it takes to get the body counts against MAX_MATCH_TIME)
    let values;
    this.runTimed(state, () => {
      values = this.getBodyValues(test.bodyTransform, state);
    });
    return this.matchValues(values, test, state);
  }

  /**
   * The body a body test matches (RFC 5173 section 5): :raw the body as it
   * was sent, :content each part of the named content types decoded to text
   * (not across parts), and :text (the default) the text of the message
   * @param {string|Object} transform - 'raw', 'text' or {type: 'content'}
   * @param {Object} state - Execution state
   * @returns {string[]} The values
   */
  getBodyValues(transform, state) {
    const { message } = state;
    // (converted once a run, however many tests read it: HTML made plain
    // and parts decoded can take long, and a script can hold many tests)
    const getText = () => {
      state.bodyText ??= this.getBodyText(message);
      return state.bodyText;
    };

    if (transform === 'raw' && message.raw) {
      if (state.rawBody === undefined) {
        const raw = Buffer.isBuffer(message.raw)
          ? message.raw
          : Buffer.from(String(message.raw));
        let start = raw.indexOf('\r\n\r\n');
        start = start === -1 ? raw.indexOf('\n\n') + 2 : start + 4;
        state.rawBody = start < 2 ? '' : raw.subarray(start).toString();
      }

      return [state.rawBody];
    }

    if (typeof transform === 'object' && transform?.type === 'content') {
      const types = transform.contentTypes.map((type) =>
        this.interpolateVariables(type, state).toLowerCase()
      );
      const values = [];
      for (const part of state.mimeParts.length > 0
        ? state.mimeParts
        : [{ ...this.getMessagePart(state), text: getText() }]) {
        const contentType = (part.contentType || 'text/plain').toLowerCase();
        const type = contentType.split('/')[0];
        if (
          !types.some(
            (t) =>
              t === '' || t === contentType || (!t.includes('/') && t === type)
          )
        )
          continue;

        // (multipart parts are searched only in their prologue and epilogue,
        // which are not kept)
        if (part.multipart || type === 'multipart') continue;
        state.decodedParts ||= new Map();
        let text = state.decodedParts.get(part);
        if (text === undefined) {
          text = this.decodePartContent(part);
          state.decodedParts.set(part, text);
        }

        if (text === null) continue;
        // (a message/rfc822 part is searched only in its header)
        if (contentType === 'message/rfc822') {
          const end = text.search(/\r?\n\r?\n/);
          if (end !== -1) text = text.slice(0, end);
        }

        values.push(text);
      }

      return values;
    }

    return [getText()];
  }

  /**
   * The text of a message (the :text body transform, RFC 5173 section 5.3)
   * @param {Object} message - The normalized message
   * @returns {string} The text
   */
  getBodyText(message) {
    const { body } = message;
    if (body && typeof body === 'object')
      return body.text || (body.html ? this.htmlToText(body.html) : '');
    return toHeaderString(body);
  }

  /**
   * Evaluate a date test (RFC 5260)
   * @param {Object} test - The date test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateDateTest(test, state) {
    const { header, datePart } = test;

    // (only the first field of the name, or the one :index names, RFC 5260
    // sections 4 and 6; the test fails without a valid date in it)
    const [field] = this.getFieldValues(state.message.headers, [header], test);
    const parsed = field === undefined ? null : parseDateTime(field);
    const values = parsed
      ? [
          this.extractDatePart(
            parsed.time,
            datePart,
            test.originalZone
              ? parsed.zone
              : this.getZone(test.zone, parsed.time, state)
          )
        ]
      : [];

    return this.matchValues(values, test, state);
  }

  /**
   * Evaluate a currentdate test (RFC 5260)
   * @param {Object} test - The currentdate test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateCurrentdateTest(test, state) {
    const { datePart } = test;
    // (every currentdate test of a run is at the same time, section 5)
    const time = state.now.getTime();
    return this.matchValues(
      [
        this.extractDatePart(
          time,
          datePart,
          this.getZone(test.zone, time, state)
        )
      ],
      test,
      state
    );
  }

  /**
   * The offset in minutes of the zone of a :zone argument ("+hhmm" or
   * "-hhmm"), or without one of the local time zone (RFC 5260, section 4.1)
   * @param {string|null} zone - The :zone argument
   * @param {number} time - The time (for the offset of the local zone then)
   * @param {Object} state - Execution state
   * @returns {number} Minutes east of UTC
   */
  getZone(zone, time, state) {
    const match = zone
      ? /^([+-])(\d{2})(\d{2})$/.exec(this.interpolateVariables(zone, state))
      : null;
    if (!match) return -new Date(time).getTimezoneOffset();
    const minutes = Number(match[2]) * 60 + Number(match[3]);
    return match[1] === '-' ? -minutes : minutes;
  }

  /**
   * A date part (RFC 5260, section 4.2) of a time in a zone
   * @param {number} time - Milliseconds since the epoch
   * @param {string} part - The date part
   * @param {number} zone - The zone, in minutes east of UTC
   * @returns {string} The date part
   */
  extractDatePart(time, part, zone) {
    const d = new Date(time + zone * 60_000);
    const pad = (n, length = 2) => String(n).padStart(length, '0');
    const date = `${pad(d.getUTCFullYear(), 4)}-${pad(
      d.getUTCMonth() + 1
    )}-${pad(d.getUTCDate())}`;
    const clock = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
      d.getUTCSeconds()
    )}`;
    const offset = Math.abs(zone);
    const sign = zone < 0 ? '-' : '+';
    const hours = pad(Math.floor(offset / 60));
    const minutes = pad(offset % 60);

    switch (String(part).toLowerCase()) {
      case 'year': {
        return pad(d.getUTCFullYear(), 4);
      }

      case 'month': {
        return pad(d.getUTCMonth() + 1);
      }

      case 'day': {
        return pad(d.getUTCDate());
      }

      case 'date': {
        return date;
      }

      case 'julian': {
        // (the Modified Julian Day: days since 1858-11-17)
        return String(Math.floor(d.getTime() / 86_400_000) + 40_587);
      }

      case 'hour': {
        return pad(d.getUTCHours());
      }

      case 'minute': {
        return pad(d.getUTCMinutes());
      }

      case 'second': {
        return pad(d.getUTCSeconds());
      }

      case 'time': {
        return clock;
      }

      case 'iso8601': {
        return `${date}T${clock}${sign}${hours}:${minutes}`;
      }

      case 'std11': {
        return `${WEEKDAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${
          MONTHS[d.getUTCMonth()]
        } ${pad(d.getUTCFullYear(), 4)} ${clock} ${sign}${hours}${minutes}`;
      }

      case 'zone': {
        return `${sign}${hours}${minutes}`;
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
   * Evaluate a hasflag test (RFC 5232)
   * @param {Object} test - The hasflag test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateHasflagTest(test, state) {
    const names =
      test.variables || (test.variableName ? [test.variableName] : null);

    // (the flags of the variables named, or of the internal variable; :count
    // counts the flags of each, RFC 5232 section 4)
    const values = names
      ? names.flatMap((name) => this.getFlagVariable(state, name))
      : [...state.flags];

    //
    // (the keys are match keys, not flags: they are split at spaces, but kept
    // as written, so a :matches pattern or a variable is not dropped as an
    // invalid flag before it is expanded, RFC 5232 section 4)
    //
    return this.matchValues(
      values,
      {
        ...test,
        keys: (test.flags || []).flatMap((key) =>
          toHeaderString(key).split(/\s+/).filter(Boolean)
        )
      },
      state
    );
  }

  /**
   * Evaluate a string test (RFC 5229)
   * @param {Object} test - The string test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateStringTest(test, state) {
    const { source, keys, matchType, comparator } = test;

    // (:count counts the strings that are not empty, RFC 5229 section 5)
    if (isCount(matchType)) {
      const values = source.map((src) =>
        this.interpolateVariables(src, state, 'bare')
      );
      return this.matchValues(
        values,
        test,
        state,
        values.filter((value) => value !== '').length
      );
    }

    const getMatcher = this.getKeyMatchers(keys, matchType, comparator, state);

    // (a source the same as one before cannot match where it did not)
    const tested = new Set();
    for (const src of source) {
      if (tested.has(src)) continue;
      tested.add(src);
      const interpolatedSrc = this.interpolateVariables(src, state, 'bare');
      for (let i = 0; i < keys.length; i++) {
        if (getMatcher(i)(interpolatedSrc)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Evaluate an environment test (RFC 5183)
   * @param {Object} test - The environment test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateEnvironmentTest(test, state) {
    const { name } = test;
    const value = this.getEnvironmentValue(name, state);
    // (the test fails for an item that does not exist, RFC 5183 section 4)
    return this.matchValues(value === undefined ? [] : [value], test, state);
  }

  /**
   * Get an environment value
   * @param {string} name - Environment variable name
   * @param {Object} state - Execution state
   * @returns {string|undefined} Environment value (none for an item that
   * is unknown or not available)
   */
  getEnvironmentValue(name, state) {
    const env = state.context.environment || {};

    switch (name.toLowerCase()) {
      case 'domain': {
        return env.domain || undefined;
      }

      case 'host': {
        return env.host || undefined;
      }

      case 'location': {
        return env.location || 'MDA';
      }

      case 'name': {
        return env.name || 'Forward Email';
      }

      case 'phase': {
        return env.phase || 'during';
      }

      // (the empty string when the name of the client is not known)
      case 'remote-host': {
        return env.remoteHost || '';
      }

      case 'remote-ip': {
        return env.remoteIp || undefined;
      }

      case 'version': {
        return env.version || '1.0';
      }

      default: {
        return undefined;
      }
    }
  }

  /**
   * Match a string against a pattern
   * @param {string} value - The value to match
   * @param {string} pattern - The pattern to match against
   * @param {string|Object} matchType - The match type
   * @param {string} comparator - The comparator to use
   * @returns {boolean} True if matched
   */
  matchString(value, pattern, matchType, comparator) {
    return this.createMatcher(pattern, matchType, comparator)(value);
  }

  /**
   * Make a function that matches values against one pattern, which is
   * normalized (and compiled, for :matches and :regex) once for all of them.
   * For :matches and :regex the function has `capture(value)`, the strings
   * of a value that matched for the match variables (RFC 5229 section 3.2).
   * @param {string} pattern - The pattern to match against
   * @param {string|Object} matchType - The match type
   * @param {string} comparator - The comparator to use
   * @returns {Function} (value) => true if matched
   */
  createMatcher(pattern, matchType, comparator) {
    const normalize = getNormalizer(comparator);
    const normalizedPattern = normalize(pattern);
    const isCaseInsensitive = comparator === 'i;ascii-casemap' || !comparator;

    // (each matcher takes the value, and may be given it normalized already)

    // Relational match types compare in the order of the comparator (RFC
    // 5231); for :count the value is the number of values
    if (typeof matchType === 'object' && matchType.type) {
      return (value) =>
        this.compareRelational(
          compareValues(toHeaderString(value), String(pattern), comparator),
          matchType.operator
        );
    }

    // (i;ascii-numeric has equality and order only, RFC 4790 section 9.1)
    if (
      comparator === 'i;ascii-numeric' &&
      (matchType === 'contains' ||
        matchType === 'matches' ||
        matchType === 'regex')
    )
      return () => false;

    switch (matchType) {
      case 'contains': {
        return (value, normalized = normalize(value)) =>
          normalized.includes(normalizedPattern);
      }

      case 'matches': {
        const regex = this.compileGlob(normalizedPattern);
        const matcher = (value, normalized = normalize(value)) =>
          regex !== null && regex.test(normalized);
        // (the value with its own case: the pattern ignores it as the
        // comparator does)
        matcher.capture = (value) =>
          this.compileGlob(normalizedPattern, true, isCaseInsensitive)?.exec(
            toHeaderString(value)
          );
        return matcher;
      }

      case 'regex': {
        let regex = null;
        try {
          // use RE2 to prevent ReDoS from user-supplied patterns (with the
          // case of the comparator, and "." matching any character as in
          // POSIX regular expressions)
          regex = new RE2(pattern, isCaseInsensitive ? 'is' : 's');
        } catch {}

        const matcher = (value) => {
          if (regex === null) return false;
          try {
            return regex.test(toHeaderString(value));
          } catch {
            return false;
          }
        };

        matcher.capture = (value) => regex?.exec(toHeaderString(value));
        return matcher;
      }

      // ('is' and anything else)
      default: {
        return (value, normalized = normalize(value)) =>
          normalized === normalizedPattern;
      }
    }
  }

  /**
   * The keys of a test, each expanded and made into a matcher at most once,
   * when first needed, in the order they are tried (variables cannot change
   * during a test; expanding a key again for every header value made a
   * message with many headers count each key once per value against
   * MAX_EXPANDED_LENGTH, and compiled it again for each). A value is
   * normalized once for all the keys, and the time spent counts against
   * MAX_MATCH_TIME (read every 1024 values, and after each compile). A key
   * of :matches or :regex that matches sets the match variables.
   * @param {string[]} keys - The keys of the test
   * @param {string|Object} matchType - The match type
   * @param {string} comparator - The comparator to use
   * @param {Object} state - Execution state
   * @returns {Function} (index) => matcher for keys[index]
   */
  getKeyMatchers(keys, matchType, comparator, state) {
    const matchers = [];
    const normalize =
      matchType === 'regex' ? () => undefined : getNormalizer(comparator);
    const captures = state.enabledCapabilities.has('variables');
    let last = performance.now();
    let calls = 0;
    let hasValue = false;
    let lastValue;
    let lastNormalized;

    const countTime = () => {
      const now = performance.now();
      this.addWorkTime(state, last);
      last = now;
    };

    // (the rest is counted when the test ends, see evaluateTest)
    state.countMatchTime = countTime;

    return (index) => {
      if (!matchers[index]) {
        const matcher = this.createMatcher(
          this.interpolateVariables(keys[index], state),
          matchType,
          comparator
        );
        countTime();
        matchers[index] = (value) => {
          if (!hasValue || value !== lastValue) {
            lastValue = value;
            lastNormalized = normalize(value);
            hasValue = true;
          }

          calls++;
          if (calls % 1024 === 0) countTime();
          const matched = matcher(value, lastNormalized);
          if (matched && captures && matcher.capture) {
            this.setMatchVariables(state, matcher.capture(value));
            countTime();
          }

          return matched;
        };
      }

      return matchers[index];
    };
  }

  /**
   * Set the match variables ${0} to ${9} (RFC 5229 section 3.2) from what
   * a :matches or :regex matched: ${0} the whole, then each wildcard or group
   * @param {Object} state - Execution state
   * @param {Array|null} match - The result of exec
   */
  setMatchVariables(state, match) {
    if (!match) return;
    state.matchVariables = [];
    for (let i = 0; i < match.length && i <= 9; i++) {
      state.matchVariables.push(truncate(match[i] ?? ''));
    }
  }

  /**
   * Count the time since `start` against MAX_MATCH_TIME
   * @param {Object} state - Execution state
   * @param {number} start - performance.now() when the work started
   * @throws {Error} If the time is used up
   */
  addWorkTime(state, start) {
    state.matchTime = (state.matchTime || 0) + (performance.now() - start);
    if (state.matchTime > SieveEngine.MAX_MATCH_TIME)
      throw new Error('Sieve script exceeded the time it may run');
  }

  /**
   * Run a command that works on its own, counting its time against
   * MAX_MATCH_TIME (setting variables and flags, extracting text: in nested
   * foreverypart loops they run thousands of times)
   * @param {Object} state - Execution state
   * @param {Function} fn - The work
   */
  runTimed(state, fn) {
    const start = performance.now();
    try {
      fn();
    } finally {
      this.addWorkTime(state, start);
    }
  }

  /**
   * Whether the order of two values (-1, 0 or 1, see compareValues) is the
   * relation of a relational match (RFC 5231)
   * @param {number} order - The order of the value from the message and the key
   * @param {string} operator - Relational operator
   * @returns {boolean} Comparison result
   */
  compareRelational(order, operator) {
    switch (String(operator).toLowerCase()) {
      case 'gt': {
        return order > 0;
      }

      case 'ge': {
        return order >= 0;
      }

      case 'lt': {
        return order < 0;
      }

      case 'le': {
        return order <= 0;
      }

      case 'eq': {
        return order === 0;
      }

      case 'ne': {
        return order !== 0;
      }

      default: {
        return false;
      }
    }
  }

  /**
   * Compile a Sieve glob pattern
   * @param {string} pattern - The glob pattern
   * @param {boolean} [capture] - Whether each wildcard is a group
   * @param {boolean} [ignoreCase] - Whether to ignore case
   * @returns {RE2|null} The regex (null if it does not compile)
   */
  compileGlob(pattern, capture = false, ignoreCase = false) {
    try {
      // use RE2 to prevent ReDoS from user-supplied glob patterns ("*" and
      // "?" match line breaks too)
      return new RE2(
        globToRegexSource(pattern, capture),
        ignoreCase ? 'is' : 's'
      );
    } catch {
      return null;
    }
  }

  /**
   * Interpolate variables in a string (RFC 5229)
   * @param {string} str - The string with variable references
   * @param {Object} state - Execution state
   * @returns {string} Interpolated string
   */
  interpolateVariables(string_, state, uncounted) {
    if (!string_ || !state.enabledCapabilities.has('variables')) {
      return string_;
    }

    // Ensure string_ is actually a string to prevent TypeError on .replaceAll()
    const str = typeof string_ === 'string' ? string_ : String(string_);

    // (a name of digits is a match variable, RFC 5229 section 3.2)
    const result = interpolate(str, (varName) =>
      /^\d+$/.test(varName)
        ? state.matchVariables?.[Number(varName)]
        : state.variables.get(varName.toLowerCase())
    );

    //
    // (the strings this makes count against MAX_EXPANDED_LENGTH, except
    // a string without a reference, which is the script's own; "all" for
    // the value of a set, which counts as stored instead, see setVariable;
    // and "bare" for a lone "${name}" as the source of a string test, which
    // makes no string, so the text of the parts of a message, tested part by
    // part, cannot use up the limit and skip the user's filter)
    //
    if (
      result !== str &&
      uncounted !== 'all' &&
      !(uncounted === 'bare' && isBareReference(str))
    ) {
      state.expandedLength = (state.expandedLength || 0) + result.length;
      if (state.expandedLength > MAX_EXPANDED_LENGTH)
        throw new Error(
          'Sieve script exceeded the total length of expanded variables'
        );
    }

    return result;
  }

  /**
   * Store a variable, counting the length of all of them as they are now
   * against MAX_STORED_LENGTH (setting one again replaces its length)
   * @param {Object} state - Execution state
   * @param {string} name - The variable name (lowercase)
   * @param {string} value - The value
   * @throws {Error} If the variables would be too long together
   */
  setVariable(state, name, value) {
    const previous = state.variables.get(name);
    state.storedLength =
      (state.storedLength || 0) +
      value.length -
      (typeof previous === 'string' ? previous.length : 0);
    if (state.storedLength > MAX_STORED_LENGTH)
      throw new Error('Sieve script exceeded the total length of variables');
    state.variables.set(name, value);
  }

  /**
   * Execute a set command (RFC 5229)
   * @param {Object} command - The set command
   * @param {Object} state - Execution state
   */
  executeSet(command, state) {
    let value = this.interpolateVariables(command.value, state, 'all');

    // Ensure value is a string before applying modifiers
    if (value === null || value === undefined) {
      value = '';
    } else if (typeof value !== 'string') {
      value = String(value);
    }

    this.setVariable(
      state,
      command.name.toLowerCase(),
      truncate(this.applyModifiers(value, command.modifiers))
    );
  }

  /**
   * Apply the modifiers of set or extracttext, in the order of their
   * precedence (RFC 5229 section 4.1; the parser sorts them)
   * @param {string} value - The value
   * @param {string[]} [modifiers] - The modifiers
   * @returns {string} The value modified
   */
  applyModifiers(value, modifiers) {
    for (const modifier of modifiers || []) {
      switch (modifier) {
        case 'lower': {
          value = value.toLowerCase();
          break;
        }

        case 'upper': {
          value = value.toUpperCase();
          break;
        }

        case 'lowerfirst': {
          value = value.charAt(0).toLowerCase() + value.slice(1);
          break;
        }

        case 'upperfirst': {
          value = value.charAt(0).toUpperCase() + value.slice(1);
          break;
        }

        case 'quotewildcard': {
          value = value.replaceAll(/[*?\\]/g, String.raw`\$&`);
          break;
        }

        case 'length': {
          // (in characters, not UTF-16 code units)
          value = String([...value].length);
          break;
        }

        // (RFC 5435 section 6: all but the unreserved characters of a URI)
        case 'encodeurl': {
          // (a lone surrogate, which cannot be encoded, as U+FFFD)
          value = encodeURIComponent(Buffer.from(value).toString()).replaceAll(
            /[!'()*]/g,
            (char) => `%${char.codePointAt(0).toString(16).toUpperCase()}`
          );
          break;
        }

        default: {
          // Unknown modifier, ignore
          break;
        }
      }
    }

    return value;
  }

  /**
   * The flags of a setflag, addflag or removeflag command, or of :flags
   * (RFC 5232): its strings expanded and split into flags
   * @param {string[]} list - The list of flags
   * @param {Object} state - Execution state
   * @returns {string[]} The flags
   */
  getFlags(list, state) {
    return splitFlags(
      list.map((flag) => this.interpolateVariables(flag, state))
    );
  }

  /**
   * The flags held in a variable (RFC 5232, section 3)
   * @param {Object} state - Execution state
   * @param {string} name - The variable name
   * @returns {string[]} The flags
   */
  getFlagVariable(state, name) {
    return splitFlags([state.variables.get(String(name).toLowerCase())]);
  }

  /**
   * Change the flags of the variable a command names, or of the internal
   * variable (RFC 5232, section 3)
   * @param {Object} command - The setflag, addflag or removeflag command
   * @param {Object} state - Execution state
   * @param {Function} change - (current flags, flags of the command) => flags
   */
  changeFlags(command, state, change) {
    const flags = this.getFlags(command.flags, state);
    if (command.variableName) {
      if (!state.enabledCapabilities.has('variables'))
        throw new Error(
          'A flag variable requires "variables" to be declared with require'
        );
      const name = String(command.variableName).toLowerCase();
      const value = change(this.getFlagVariable(state, name), flags);
      this.checkFlagLimit(state, value.length);
      this.setVariable(state, name, value.join(' '));
      return;
    }

    const value = change([...state.flags], flags);
    this.checkFlagLimit(state, value.length);
    state.flags = new Set(value);
  }

  /**
   * Execute a setflag command (RFC 5232)
   * @param {Object} command - The setflag command
   * @param {Object} state - Execution state
   */
  executeSetflag(command, state) {
    this.changeFlags(command, state, (current, flags) => flags);
  }

  /**
   * @param {Object} state - Execution state
   * @param {number} [count] - The number of flags (those set by default)
   * @throws {Error} If there are more flags than MAX_FLAGS
   */
  checkFlagLimit(state, count = state.flags.size) {
    if (count > SieveEngine.MAX_FLAGS)
      throw new Error('Sieve script exceeded the number of flags');
  }

  /**
   * Execute an addflag command (RFC 5232)
   * @param {Object} command - The addflag command
   * @param {Object} state - Execution state
   */
  executeAddflag(command, state) {
    this.changeFlags(command, state, (current, flags) =>
      splitFlags([...current, ...flags])
    );
  }

  /**
   * Execute a removeflag command (RFC 5232)
   * @param {Object} command - The removeflag command
   * @param {Object} state - Execution state
   */
  executeRemoveflag(command, state) {
    this.changeFlags(command, state, (current, flags) => {
      const removed = new Set(flags.map((flag) => flag.toLowerCase()));
      return current.filter((flag) => !removed.has(flag.toLowerCase()));
    });
  }

  /**
   * Execute a vacation command (RFC 5230)
   * @param {Object} command - The vacation command
   * @param {Object} state - Execution state
   */
  async executeVacation(command, state) {
    // (a second vacation fails the script, RFC 5230 section 4.7, as one
    // with reject does, RFC 5429 section 2.4)
    if (
      state.actions.some((a) =>
        ['vacation', 'reject', 'ereject'].includes(a.type)
      )
    )
      throw new Error(
        'A Sieve script may reply once with vacation, and not with reject'
      );

    // (no default here: without :days or :seconds the delivery uses the
    // default period, and 0 means as often as allowed, RFC 6131)
    state.actions.push({
      type: 'vacation',
      days: command.days ?? null,
      seconds: command.seconds ?? null,
      subject: command.subject
        ? this.interpolateVariables(command.subject, state)
        : null,
      from: command.from
        ? this.interpolateVariables(command.from, state)
        : null,
      addresses: command.addresses.map((a) =>
        this.interpolateVariables(a, state)
      ),
      mime: command.mime || false,
      handle: command.handle
        ? this.interpolateVariables(command.handle, state)
        : null,
      message: this.interpolateVariables(command.message, state),
      // (the arguments as written, which tell one vacation from another
      // when there is no :handle, RFC 5230 section 4.2)
      tracking: [command.subject, command.from, command.mime, command.message]
    });
  }

  /**
   * Evaluate a duplicate test (RFC 7352)
   * @param {Object} test - The duplicate test
   * @param {Object} state - Execution state
   * @returns {Promise<boolean>} Test result
   */
  async evaluateDuplicateTest(test, state) {
    // Get the unique ID for duplicate detection: the explicit one, or the
    // (first) value of the header named or of Message-ID
    const uniqueId = test.uniqueid
      ? this.interpolateVariables(test.uniqueid, state)
      : toHeaderString(
          [
            getHeader(state.message.headers, test.header || 'message-id')
          ].flat()[0]
        );

    if (!uniqueId) {
      return false;
    }

    // (see MAX_DUPLICATE_TESTS)
    state.duplicateTests = (state.duplicateTests || 0) + 1;
    if (state.duplicateTests > SieveEngine.MAX_DUPLICATE_TESTS)
      throw new Error('Sieve script exceeded the number of duplicate tests');

    const handle = test.handle
      ? this.interpolateVariables(test.handle, state)
      : 'default';
    let key = `${handle}:${uniqueId}`;
    // (a long ID, such as a Message-ID the sender made 1MB long, is stored as
    // its hash; a shorter one as it was)
    if (key.length > 256)
      key = `sha256:${crypto.createHash('sha256').update(key).digest('hex')}`;

    // (an ID tracked for no time is never a duplicate, RFC 7352 section 3.3)
    if (
      test.seconds !== undefined &&
      test.seconds !== null &&
      Number(test.seconds) <= 0
    )
      return false;

    // Default 7 days, at most MAX_DUPLICATE_SECONDS, in whole seconds
    const seconds = Math.min(
      Math.max(Math.trunc(Number(test.seconds)) || 7 * 24 * 60 * 60, 1),
      SieveEngine.MAX_DUPLICATE_SECONDS
    );

    // (only deliveries before this one count, not tests of this run; the ID
    // is stored once the script has run without error, RFC 7352 section 3)
    const cache = state.context?.duplicateCache;
    const isDuplicate = cache ? Boolean(await cache.has(key)) : false;

    // (with :last the period starts again at each delivery, without it at
    // the first one)
    if (test.last || !isDuplicate) state.duplicateWrites.set(key, seconds);

    return isDuplicate;
  }

  /**
   * Evaluate an ihave test (RFC 5463)
   * @param {Object} test - The ihave test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateIhaveTest(test, state) {
    // Check if all requested capabilities are available (never those that
    // change how a script is read, RFC 5463 section 4)
    for (const capability of test.capabilities) {
      const name = getCapability(capability);
      if (
        name === 'variables' ||
        name === 'encoded-character' ||
        !this.hasCapability(name)
      ) {
        return false;
      }
    }

    // Enable the capabilities for use
    for (const capability of test.capabilities) {
      state.enabledCapabilities.add(getCapability(capability));
    }

    return true;
  }

  /**
   * Evaluate a mailboxexists test (RFC 5490)
   * @param {Object} test - The mailboxexists test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  async evaluateMailboxexistsTest(test, state) {
    // (true only if every mailbox exists, RFC 5490 section 3.1; without a
    // way to look them up, none does)
    const exists = state.context?.mailboxExists;
    if (typeof exists !== 'function') return false;
    for (const mailbox of test.mailboxes) {
      if (!(await exists(this.interpolateVariables(mailbox, state))))
        return false;
    }

    return true;
  }

  /**
   * Evaluate a specialuse_exists test (RFC 8579)
   * @param {Object} test - The specialuse_exists test
   * @param {Object} state - Execution state
   * @returns {Promise<boolean>} Test result
   */
  async evaluateSpecialuseexistsTest(test, state) {
    const attributes = test.attributes.map((attribute) =>
      this.interpolateVariables(attribute, state)
    );
    const mailbox = test.mailbox
      ? this.interpolateVariables(test.mailbox, state)
      : null;

    // (looked up in the mailboxes when the delivery can, RFC 8579 section 3)
    const exists = state.context?.specialUseExists;
    if (typeof exists === 'function')
      return Boolean(await exists(attributes, mailbox));

    // (otherwise the special-use mailboxes every account has)
    return (
      mailbox === null &&
      attributes.every((attribute) =>
        DEFAULT_SPECIAL_USE.has(String(attribute).toLowerCase())
      )
    );
  }

  // =========================================================================
  // RFC 5703 - MIME Part Iteration and Manipulation
  // =========================================================================

  //
  // The time (in ms) one run may spend matching (making the matchers of keys
  // and testing values with them) and setting variables and flags or
  // extracting text, as Pigeonhole's sieve_max_cpu_time (30s by default)
  // does. Keys and values multiply (a long variable named as each source of
  // a string test, against many keys, took minutes for every message), and so
  // do nested foreverypart loops; a script past it is stopped and the message
  // kept, as for any error. (Waiting on lookups is not counted.)
  // Far shorter than Pigeonhole's: Pigeonhole runs each delivery in a process
  // of its own, while here a run holds the process that stores the mail of
  // many aliases (and one test is not interrupted, so they all wait on it).
  //
  static MAX_MATCH_TIME = 2000;

  //
  // Every keep and fileinto keeps a copy of the flags: thousands of flags and
  // of actions ran the delivery process out of memory (far more than any
  // script needs, and a script past them is stopped as for any error)
  //
  static MAX_FLAGS = 1000;
  static MAX_ACTIONS = 10_000;

  //
  // Every duplicate test stores its ID in Redis for :seconds: 2,000 of them
  // with 1MB IDs and a period of decades stored GBs for every message (an ID
  // is now hashed when long; RFC 7352 lets a period be limited)
  //
  static MAX_DUPLICATE_TESTS = 1000;
  static MAX_DUPLICATE_SECONDS = 30 * 24 * 60 * 60;

  /**
   * Security limits for MIME operations
   */
  static MIME_LIMITS = {
    maxPartsIteration: 100,
    maxExtractedTextSize: 102_400, // 100KB
    maxForeverypartDepth: 3,
    maxInstructionsPerScript: 10_000
  };

  /**
   * Increment instruction counter and check CPU limit
   * @param {Object} state - Execution state
   * @throws {Error} If instruction limit exceeded
   */
  checkInstructionLimit(state) {
    state.instructionCount++;
    if (
      state.instructionCount > SieveEngine.MIME_LIMITS.maxInstructionsPerScript
    ) {
      throw new Error(
        'Sieve script exceeded maximum instruction count (possible infinite loop)'
      );
    }
  }

  /**
   * Execute a foreverypart loop (RFC 5703 Section 3)
   * Iterates over each MIME part in the message, executing the block
   * with the current part context set for each iteration.
   *
   * @param {Object} command - The foreverypart command
   * @param {Object} state - Execution state
   */
  async executeForeverypart(command, state) {
    // Enforce nesting depth limit
    if (
      state.partIterStack.length >= SieveEngine.MIME_LIMITS.maxForeverypartDepth
    ) {
      this.logger.warn(
        'foreverypart nesting depth exceeded, skipping inner loop'
      );
      return;
    }

    const parts = state.mimeParts;
    if (!parts || parts.length === 0) {
      return;
    }

    //
    // The parts to visit, depth first: all of them, or in a loop inside
    // another only the parts inside the outer loop's part (RFC 5703 section
    // 3; parts given without the part they are in are all visited)
    //
    const outer = state.partIterStack.length > 0 ? state.currentPartIndex : -1;
    const indexes = [];
    for (
      let i = 0;
      i < parts.length &&
      indexes.length < SieveEngine.MIME_LIMITS.maxPartsIteration;
      i++
    ) {
      if (outer !== -1 && Number.isInteger(parts[i].parentIndex)) {
        let parent = parts[i].parentIndex;
        while (Number.isInteger(parent) && parent > outer)
          parent = parts[parent].parentIndex;
        if (i <= outer || parent !== outer) continue;
      }

      indexes.push(i);
    }

    // Push current iteration context onto stack
    state.partIterStack.push({
      name: command.name || null,
      previousPartIndex: state.currentPartIndex
    });

    try {
      for (const i of indexes) {
        this.checkInstructionLimit(state);

        state.currentPartIndex = i;
        state.breakSignal = null;

        // Execute the block commands for this part
        for (const cmd of command.block) {
          if (state.stopped || state.breakSignal) {
            break;
          }

          await this.executeCommand(cmd, state);
        }

        // Handle break signal
        if (state.breakSignal) {
          // Named break: only break if name matches or it's unnamed
          if (
            state.breakSignal === true ||
            state.breakSignal === command.name
          ) {
            state.breakSignal = null;
            break;
          }

          // Named break for outer loop: propagate
          break;
        }

        if (state.stopped) {
          break;
        }
      }
    } finally {
      // Restore previous iteration context
      const ctx = state.partIterStack.pop();
      state.currentPartIndex = ctx.previousPartIndex;
    }
  }

  /**
   * Execute an extracttext command (RFC 5703 Section 7)
   * Extracts the text content of the current MIME part and stores it
   * in the named variable.
   *
   * @param {Object} command - The extracttext command
   * @param {Object} state - Execution state
   */
  executeExtracttext(command, state) {
    // extracttext requires variables extension
    if (!state.enabledCapabilities.has('variables')) {
      this.logger.warn('extracttext requires variables extension');
      return;
    }

    // (outside a foreverypart loop the variable is set to "", RFC 5703
    // section 7)
    const part = this.getCurrentMimePart(state);
    if (!part) {
      this.setVariable(state, command.name.toLowerCase(), '');
      return;
    }

    // (a part is converted once a run, however many loops reach it; kept at
    // the most that is ever stored, so :first below gives the same text)
    state.extractedTexts ||= new Map();
    let text = state.extractedTexts.get(part);
    if (text === undefined) {
      text = this.extractTextFromPart(part).slice(
        0,
        SieveEngine.MIME_LIMITS.maxExtractedTextSize
      );
      state.extractedTexts.set(part, text);
    }

    // Apply :first N character limit
    if (command.first && command.first > 0) {
      text = text.slice(0, command.first);
    }

    // Enforce maximum extracted text size
    if (text.length > SieveEngine.MIME_LIMITS.maxExtractedTextSize) {
      text = text.slice(0, SieveEngine.MIME_LIMITS.maxExtractedTextSize);
    }

    this.setVariable(
      state,
      command.name.toLowerCase(),
      truncate(this.applyModifiers(text, command.modifiers))
    );
  }

  /**
   * Extract text content from a MIME part: the text of a text part, HTML
   * made plain, and "" for other parts or one that cannot be decoded
   * @param {Object} part - The MIME part object
   * @returns {string} Extracted text content
   */
  extractTextFromPart(part) {
    if (part.multipart || !String(part.contentType || '').startsWith('text/'))
      return '';
    const content = this.decodePartContent(part) || '';
    return part.contentType === 'text/html'
      ? this.htmlToText(content)
      : content;
  }

  /**
   * The content of a part as text, its transfer encoding and charset
   * decoded (RFC 5173 section 5.2, RFC 5703 section 7), or null when they
   * are unknown. The body of a part is kept with one character per octet.
   * @param {Object} part - The MIME part object
   * @returns {string|null} The text
   */
  decodePartContent(part) {
    if (typeof part.text === 'string') return part.text;
    const body = toHeaderString(part.body);
    let bytes;
    switch (String(part.encoding || '').toLowerCase()) {
      case 'base64': {
        bytes = Buffer.from(body, 'base64');
        break;
      }

      case 'quoted-printable': {
        bytes = Buffer.from(
          body
            .replaceAll(/=\r?\n/g, '')
            .replaceAll(/=([\dA-Fa-f]{2})/g, (_, hex) =>
              String.fromCodePoint(Number.parseInt(hex, 16))
            ),
          'latin1'
        );
        break;
      }

      case '':
      case '7bit':
      case '8bit':
      case 'binary': {
        // (a body given as text already, not as octets)
        if (/[\u0100-\uFFFF]/.test(body)) return body;
        bytes = Buffer.from(body, 'latin1');
        break;
      }

      default: {
        return null;
      }
    }

    try {
      return new TextDecoder(part.charset || 'utf8').decode(bytes);
    } catch {
      return null;
    }
  }

  /**
   * Convert HTML to plain text (basic tag stripping)
   * @param {string} html - HTML content
   * @returns {string} Plain text
   */
  htmlToText(html) {
    return (
      html
        .replaceAll(/<br\s*\/?>/gi, '\n')
        .replaceAll(/<\/p>/gi, '\n\n')
        .replaceAll(/<\/div>/gi, '\n')
        .replaceAll(/<\/li>/gi, '\n')
        // (a tag is the shortest run from '<' to '>', not crossing another '<':
        // with '[^>]*' a long run of '<' took minutes)
        .replaceAll(/<[^<>]*>/g, '')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll(/\n{3,}/g, '\n\n')
        .trim()
    );
  }

  /**
   * Execute a replace command (RFC 5703 Section 5)
   * Replaces the body of the current MIME part.
   * Produces an action record for the integration layer to apply.
   *
   * @param {Object} command - The replace command
   * @param {Object} state - Execution state
   */
  executeReplace(command, state) {
    // (outside foreverypart the whole message is replaced, and inside it the
    // current part, a multipart one with all the parts in it; RFC 5703
    // section 5)
    const part = this.getCurrentMimePart(state);

    state.actions.push({
      type: 'replace',
      partIndex: part ? state.currentPartIndex : null,
      replacement: this.interpolateVariables(command.replacement, state),
      mime: command.mime || false,
      subject: command.subject
        ? this.interpolateVariables(command.subject, state)
        : null,
      from: command.from ? this.interpolateVariables(command.from, state) : null
    });
  }

  /**
   * Execute an enclose command (RFC 5703 Section 6)
   * Wraps the entire message as an attachment inside a new MIME message.
   * Produces an action record for the integration layer to apply.
   *
   * @param {Object} command - The enclose command
   * @param {Object} state - Execution state
   */
  executeEnclose(command, state) {
    state.actions.push({
      type: 'enclose',
      value: this.interpolateVariables(command.value, state),
      subject: command.subject
        ? this.interpolateVariables(command.subject, state)
        : null,
      headers: (command.headers || []).map((h) =>
        this.interpolateVariables(h, state)
      )
    });
  }

  /**
   * Get the current MIME part (for use by :mime tagged tests)
   * @param {Object} state - Execution state
   * @returns {Object|null} Current MIME part or null
   */
  getCurrentMimePart(state) {
    if (state.partIterStack.length === 0 || state.currentPartIndex < 0) {
      return null;
    }

    return state.mimeParts[state.currentPartIndex] || null;
  }

  /**
   * The message itself as a MIME part: the first part of the tree, or
   * (for a message given without one) its headers
   * @param {Object} state - Execution state
   * @returns {Object} The part
   */
  getMessagePart(state) {
    if (state.mimeParts.length > 0) return state.mimeParts[0];
    const contentType = toHeaderString(
      [getHeader(state.message.headers, 'content-type')].flat()[0]
    );
    return {
      headers: state.message.headers,
      contentType:
        contentType.split(';')[0].trim().toLowerCase() || 'text/plain'
    };
  }
}

module.exports = SieveEngine;
