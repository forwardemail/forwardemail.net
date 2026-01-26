/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * Sieve Execution Engine - Executes parsed Sieve ASTs against email messages
 */

/**
 * Parse email address(es) from a header value
 * @param {string} value - Header value containing email addresses
 * @returns {Object[]} Array of parsed address objects
 */
function parseAddresses(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }

  const results = [];

  // Split by comma to handle multiple addresses
  const parts = value.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }

    // Try to match "Name" <email> or Name <email> format
    const angleMatch = trimmed.match(/^(?:"?([^"<>]*)"?\s*)?<([^<>]+)>$/);
    if (angleMatch) {
      const email = angleMatch[2].trim();
      const atIndex = email.indexOf('@');
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
      const atIndex = email.indexOf('@');
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

// Default supported capabilities
const DEFAULT_CAPABILITIES = new Set([
  'fileinto',
  'reject',
  'ereject',
  'envelope',
  // 'encoded-character', // Not implemented - requires parser changes
  'comparator-i;ascii-casemap',
  'comparator-i;octet'
]);

// Extended capabilities that can be enabled
const EXTENDED_CAPABILITIES = new Set([
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
  'environment',
  'include',
  'mailbox',
  'special-use',
  'duplicate',
  'ihave',
  'subaddress',
  'comparator-i;ascii-numeric',
  'mboxmetadata',
  'servermetadata',
  'extlists'
]);

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
    this.capabilities = new Set([
      ...DEFAULT_CAPABILITIES,
      ...(options.capabilities || [])
    ]);
    this.logger = options.logger || console;
    this.extensions = new Map();

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
    // Accept core tests (RFC 5228 Section 5) even though they don't need require
    // This provides compatibility with scripts that incorrectly require them
    return (
      this.capabilities.has(capability) ||
      EXTENDED_CAPABILITIES.has(capability) ||
      CORE_TESTS.has(capability)
    );
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
      enabledCapabilities: new Set()
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
    const headers = {};

    // Normalize headers to lowercase keys
    if (message.headers) {
      for (const [key, value] of Object.entries(message.headers)) {
        headers[key.toLowerCase()] = value;
      }
    }

    return {
      headers,

      size: message.size > 0 ? message.size : 0,
      envelope: {
        from: message.envelope?.from || message.from || '',
        to: message.envelope?.to || message.to || ''
      },
      body: message.body || '',
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

          state.enabledCapabilities.add(capability);
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
        // Merge command flags with current state flags
        const keepFlags = [...state.flags, ...(command.flags || [])];
        state.actions.push({
          type: 'keep',
          flags: keepFlags
        });
        state.implicitKeep = false;
        break;
      }

      case 'Fileinto': {
        // Merge command flags with current state flags
        const fileintoFlags = [...state.flags, ...(command.flags || [])];
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
        state.actions.push({
          type: 'redirect',
          address: this.interpolateVariables(command.address, state),
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
        state.actions.push({
          type: 'reject',
          message: this.interpolateVariables(command.message, state)
        });
        state.implicitKeep = false;
        break;
      }

      case 'Ereject': {
        state.actions.push({
          type: 'ereject',
          message: this.interpolateVariables(command.message, state)
        });
        state.implicitKeep = false;
        break;
      }

      case 'Set': {
        this.executeSet(command, state);
        break;
      }

      case 'Setflag': {
        this.executeSetflag(command, state);
        break;
      }

      case 'Addflag': {
        this.executeAddflag(command, state);
        break;
      }

      case 'Removeflag': {
        this.executeRemoveflag(command, state);
        break;
      }

      case 'Vacation': {
        await this.executeVacation(command, state);
        break;
      }

      case 'Addheader': {
        state.actions.push({
          type: 'addheader',
          name: this.interpolateVariables(command.name, state),
          value: this.interpolateVariables(command.value, state),
          last: command.last || false
        });
        break;
      }

      case 'Deleteheader': {
        state.actions.push({
          type: 'deleteheader',
          name: this.interpolateVariables(command.name, state),
          index: command.index,
          matchType: command.matchType,
          comparator: command.comparator,
          values: command.values.map((v) => this.interpolateVariables(v, state))
        });
        break;
      }

      case 'Notify': {
        state.actions.push({
          type: 'notify',
          method: command.method,
          from: command.from,
          importance: command.importance,
          options: command.options,
          message: this.interpolateVariables(command.message || '', state)
        });
        break;
      }

      default: {
        this.logger.warn(`Unknown command type: ${command.type}`);
      }
    }
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
        if (state.stopped) {
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
            if (state.stopped) {
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
        if (state.stopped) {
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
   * @param {Object} test - The header test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateHeaderTest(test, state) {
    const { headers, keys, matchType, comparator } = test;
    const { message } = state;

    for (const headerName of headers) {
      const headerValue = message.headers[headerName.toLowerCase()];
      if (headerValue === undefined) {
        continue;
      }

      const values = Array.isArray(headerValue) ? headerValue : [headerValue];
      for (const value of values) {
        // Coerce value to string to prevent TypeError on non-string header values
        const stringValue =
          value === null || value === undefined ? '' : String(value);
        for (const key of keys) {
          const interpolatedKey = this.interpolateVariables(key, state);
          if (
            this.matchString(
              stringValue,
              interpolatedKey,
              matchType,
              comparator
            )
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Evaluate an address test
   * @param {Object} test - The address test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateAddressTest(test, state) {
    const { headers, keys, matchType, comparator, addressPart } = test;
    const { message } = state;

    for (const headerName of headers) {
      const headerValue = message.headers[headerName.toLowerCase()];
      if (headerValue === undefined) {
        continue;
      }

      const parsed = parseAddresses(headerValue);
      for (const addr of parsed) {
        const testValue = this.extractAddressPart(addr, addressPart);

        for (const key of keys) {
          const interpolatedKey = this.interpolateVariables(key, state);
          if (
            this.matchString(testValue, interpolatedKey, matchType, comparator)
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Evaluate an envelope test
   * @param {Object} test - The envelope test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateEnvelopeTest(test, state) {
    const { parts, keys, matchType, comparator, addressPart } = test;
    const { envelope } = state.message;

    for (const part of parts) {
      let value;
      if (part.toLowerCase() === 'from') {
        value = envelope.from;
      } else if (part.toLowerCase() === 'to') {
        value = envelope.to;
      } else {
        continue;
      }

      const parsed = parseAddresses(value);
      for (const addr of parsed) {
        const testValue = this.extractAddressPart(addr, addressPart);

        for (const key of keys) {
          const interpolatedKey = this.interpolateVariables(key, state);
          if (
            this.matchString(testValue, interpolatedKey, matchType, comparator)
          ) {
            return true;
          }
        }
      }
    }

    return false;
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
        // Extract detail part after the '+' delimiter
        const plusIndex = localpart.indexOf('+');
        return plusIndex >= 0 ? localpart.slice(plusIndex + 1) : '';
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
    const { headers } = test;
    const { message } = state;

    for (const headerName of headers) {
      if (message.headers[headerName.toLowerCase()] === undefined) {
        return false;
      }
    }

    return true;
  }

  /**
   * Evaluate a body test (RFC 5173)
   * @param {Object} test - The body test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateBodyTest(test, state) {
    const { keys, matchType, comparator } = test;
    let body = state.message.body || '';

    // Handle body as object with text/html properties (from SieveIntegration)
    if (typeof body === 'object' && body !== null) {
      body = body.text || body.html || '';
    }

    for (const key of keys) {
      const interpolatedKey = this.interpolateVariables(key, state);
      if (this.matchString(body, interpolatedKey, matchType, comparator)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Evaluate a date test (RFC 5260)
   * @param {Object} test - The date test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateDateTest(test, state) {
    const { header, datePart, keys, matchType, comparator, zone } = test;
    const headerValue = state.message.headers[header.toLowerCase()];

    if (!headerValue) {
      return false;
    }

    // Coerce to string for Date parsing (handles objects, numbers, etc.)
    const dateString =
      typeof headerValue === 'string' ? headerValue : String(headerValue);
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const partValue = this.extractDatePart(date, datePart, zone);

    for (const key of keys) {
      const interpolatedKey = this.interpolateVariables(key, state);
      if (this.matchString(partValue, interpolatedKey, matchType, comparator)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Evaluate a currentdate test (RFC 5260)
   * @param {Object} test - The currentdate test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateCurrentdateTest(test, state) {
    const { datePart, keys, matchType, comparator, zone } = test;
    const date = new Date();
    const partValue = this.extractDatePart(date, datePart, zone);

    for (const key of keys) {
      const interpolatedKey = this.interpolateVariables(key, state);
      if (this.matchString(partValue, interpolatedKey, matchType, comparator)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Extract a date part from a date
   * @param {Date} date - The date
   * @param {string} part - The part to extract
   * @param {string} zone - Optional timezone
   * @returns {string} The extracted part
   */
  extractDatePart(date, part, zone) {
    // Apply timezone if specified
    let d = date;
    if (zone) {
      // Simple timezone offset handling
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
        return String(
          Math.floor(
            (d.getTime() - new Date(d.getUTCFullYear(), 0, 0).getTime()) /
              86_400_000
          )
        );
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
        return '+0000';
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
    const { flags, matchType, comparator } = test;
    const currentFlags = [...state.flags];

    for (const flag of flags) {
      const interpolatedFlag = this.interpolateVariables(flag, state);
      for (const currentFlag of currentFlags) {
        if (
          this.matchString(currentFlag, interpolatedFlag, matchType, comparator)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Evaluate a string test (RFC 5229)
   * @param {Object} test - The string test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateStringTest(test, state) {
    const { source, keys, matchType, comparator } = test;

    for (const src of source) {
      const interpolatedSrc = this.interpolateVariables(src, state);
      for (const key of keys) {
        const interpolatedKey = this.interpolateVariables(key, state);
        if (
          this.matchString(
            interpolatedSrc,
            interpolatedKey,
            matchType,
            comparator
          )
        ) {
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
    const { name, keys, matchType, comparator } = test;
    const envValue = this.getEnvironmentValue(name, state);

    for (const key of keys) {
      const interpolatedKey = this.interpolateVariables(key, state);
      if (this.matchString(envValue, interpolatedKey, matchType, comparator)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get an environment value
   * @param {string} name - Environment variable name
   * @param {Object} state - Execution state
   * @returns {string} Environment value
   */
  getEnvironmentValue(name, state) {
    const env = state.context.environment || {};

    switch (name.toLowerCase()) {
      case 'domain': {
        return env.domain || '';
      }

      case 'host': {
        return env.host || '';
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

      case 'remote-host': {
        return env.remoteHost || '';
      }

      case 'remote-ip': {
        return env.remoteIp || '';
      }

      case 'version': {
        return env.version || '1.0';
      }

      default: {
        return '';
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
    // Normalize values based on comparator
    // Ensure values are strings to prevent TypeError on .toLowerCase()
    let normalizedValue =
      value === null || value === undefined ? '' : String(value);
    let normalizedPattern =
      pattern === null || pattern === undefined ? '' : String(pattern);

    if (comparator === 'i;ascii-casemap' || !comparator) {
      normalizedValue = normalizedValue.toLowerCase();
      normalizedPattern = normalizedPattern.toLowerCase();
    }

    // Handle relational match types
    if (typeof matchType === 'object' && matchType.type) {
      return this.relationalMatch(
        normalizedValue,
        normalizedPattern,
        matchType
      );
    }

    switch (matchType) {
      case 'is': {
        return normalizedValue === normalizedPattern;
      }

      case 'contains': {
        return normalizedValue.includes(normalizedPattern);
      }

      case 'matches': {
        return this.globMatch(normalizedValue, normalizedPattern);
      }

      case 'regex': {
        try {
          const regex = new RegExp(pattern, 'i');
          return regex.test(value);
        } catch {
          return false;
        }
      }

      default: {
        return normalizedValue === normalizedPattern;
      }
    }
  }

  /**
   * Perform relational matching
   * @param {string} value - The value
   * @param {string} pattern - The pattern
   * @param {Object} matchType - The match type with operator
   * @returns {boolean} Match result
   */
  relationalMatch(value, pattern, matchType) {
    const { type, operator } = matchType;

    if (type === 'count') {
      // Count comparison - compare number of values
      const count = value ? 1 : 0;
      const target = Number.parseInt(pattern, 10) || 0;
      return this.compareRelational(count, target, operator);
    }

    if (type === 'value') {
      // Value comparison
      const numberValue = Number.parseFloat(value);
      const numberPattern = Number.parseFloat(pattern);

      if (!Number.isNaN(numberValue) && !Number.isNaN(numberPattern)) {
        return this.compareRelational(numberValue, numberPattern, operator);
      }

      // Fall back to string comparison
      return this.compareRelational(value, pattern, operator);
    }

    return false;
  }

  /**
   * Compare values using relational operator
   * @param {*} a - First value
   * @param {*} b - Second value
   * @param {string} operator - Relational operator
   * @returns {boolean} Comparison result
   */
  compareRelational(a, b, operator) {
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

  /**
   * Match using Sieve glob pattern
   * @param {string} value - The value to match
   * @param {string} pattern - The glob pattern
   * @returns {boolean} True if matched
   */
  globMatch(value, pattern) {
    // Convert Sieve glob pattern to regex
    let regexPattern = '';
    let i = 0;

    while (i < pattern.length) {
      const char = pattern[i];

      if (char === '*') {
        regexPattern += '.*';
      } else if (char === '?') {
        regexPattern += '.';
      } else if (char === '\\' && i + 1 < pattern.length) {
        // Escape sequence
        i++;
        regexPattern += '\\' + pattern[i];
      } else if (/[$()+.[\]^{|}]/.test(char)) {
        // Escape regex special characters
        regexPattern += '\\' + char;
      } else {
        regexPattern += char;
      }

      i++;
    }

    try {
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(value);
    } catch {
      return false;
    }
  }

  /**
   * Interpolate variables in a string (RFC 5229)
   * @param {string} str - The string with variable references
   * @param {Object} state - Execution state
   * @returns {string} Interpolated string
   */
  interpolateVariables(string_, state) {
    if (!string_ || !state.enabledCapabilities.has('variables')) {
      return string_;
    }

    // Ensure string_ is actually a string to prevent TypeError on .replaceAll()
    const str = typeof string_ === 'string' ? string_ : String(string_);

    return str.replaceAll(/\${([^}]+)}/g, (match, varName) => {
      const value = state.variables.get(varName.toLowerCase());
      return value === undefined ? '' : value;
    });
  }

  /**
   * Execute a set command (RFC 5229)
   * @param {Object} command - The set command
   * @param {Object} state - Execution state
   */
  executeSet(command, state) {
    let value = this.interpolateVariables(command.value, state);

    // Ensure value is a string before applying modifiers
    if (value === null || value === undefined) {
      value = '';
    } else if (typeof value !== 'string') {
      value = String(value);
    }

    // Apply modifiers
    for (const modifier of command.modifiers || []) {
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
          value = String(value.length);
          break;
        }

        default: {
          // Unknown modifier, ignore
          break;
        }
      }
    }

    state.variables.set(command.name.toLowerCase(), value);
  }

  /**
   * Execute a setflag command (RFC 5232)
   * @param {Object} command - The setflag command
   * @param {Object} state - Execution state
   */
  executeSetflag(command, state) {
    state.flags.clear();
    for (const flag of command.flags) {
      state.flags.add(this.interpolateVariables(flag, state));
    }
  }

  /**
   * Execute an addflag command (RFC 5232)
   * @param {Object} command - The addflag command
   * @param {Object} state - Execution state
   */
  executeAddflag(command, state) {
    for (const flag of command.flags) {
      state.flags.add(this.interpolateVariables(flag, state));
    }
  }

  /**
   * Execute a removeflag command (RFC 5232)
   * @param {Object} command - The removeflag command
   * @param {Object} state - Execution state
   */
  executeRemoveflag(command, state) {
    for (const flag of command.flags) {
      state.flags.delete(this.interpolateVariables(flag, state));
    }
  }

  /**
   * Execute a vacation command (RFC 5230)
   * @param {Object} command - The vacation command
   * @param {Object} state - Execution state
   */
  async executeVacation(command, state) {
    state.actions.push({
      type: 'vacation',
      days: command.days || 7,
      seconds: command.seconds,
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
      message: this.interpolateVariables(command.message, state)
    });
  }

  /**
   * Evaluate a duplicate test (RFC 7352)
   * @param {Object} test - The duplicate test
   * @param {Object} state - Execution state
   * @returns {Promise<boolean>} Test result
   */
  async evaluateDuplicateTest(test, state) {
    // Get the unique ID for duplicate detection
    let uniqueId;

    if (test.uniqueid) {
      // Use explicit unique ID from script
      uniqueId = this.interpolateVariables(test.uniqueid, state);
    } else if (test.header) {
      // Use specified header value
      const headerValue = state.message.headers[test.header.toLowerCase()];
      // Coerce to string to handle non-string header values
      uniqueId =
        headerValue === null || headerValue === undefined
          ? ''
          : String(headerValue);
    } else {
      // Default: use Message-ID header
      const messageId = state.message.headers['message-id'];
      uniqueId =
        messageId === null || messageId === undefined ? '' : String(messageId);
    }

    if (!uniqueId) {
      return false;
    }

    const handle = test.handle || 'default';
    const key = `${handle}:${uniqueId}`;
    const seconds = test.seconds || 7 * 24 * 60 * 60; // Default 7 days

    // Use Redis-based cache if available (passed from integration)
    if (state.context && state.context.duplicateCache) {
      const cache = state.context.duplicateCache;
      const isDuplicate = await cache.has(key);

      // Mark as seen (if :last is not specified)
      // With :last, we only mark after returning the result
      if (!test.last && !isDuplicate) {
        await cache.add(key, seconds);
      } else if (test.last) {
        // With :last, always update the timestamp
        await cache.add(key, seconds);
      }

      return isDuplicate;
    }

    // Fallback to in-memory cache for testing
    if (!state.duplicateCache) {
      state.duplicateCache = new Set();
    }

    if (state.duplicateCache.has(key)) {
      return true;
    }

    // Mark as seen (if :last is not specified)
    if (!test.last) {
      state.duplicateCache.add(key);
    }

    return false;
  }

  /**
   * Evaluate an ihave test (RFC 5463)
   * @param {Object} test - The ihave test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateIhaveTest(test, state) {
    // Check if all requested capabilities are available
    for (const capability of test.capabilities) {
      if (!this.hasCapability(capability)) {
        return false;
      }
    }

    // Enable the capabilities for use
    for (const capability of test.capabilities) {
      state.enabledCapabilities.add(capability);
    }

    return true;
  }

  /**
   * Evaluate a mailboxexists test (RFC 5490)
   * @param {Object} test - The mailboxexists test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateMailboxexistsTest(test, state) {
    // In a real implementation, this would check if the mailbox exists
    // For now, we assume standard mailboxes exist
    const standardMailboxes = new Set([
      'INBOX',
      'Drafts',
      'Sent',
      'Trash',
      'Junk',
      'Archive'
    ]);

    for (const mailbox of test.mailboxes) {
      const interpolated = this.interpolateVariables(mailbox, state);
      // Check if it's a standard mailbox or assume it exists
      // In production, this would query the IMAP server
      if (!standardMailboxes.has(interpolated)) {
        // For non-standard mailboxes, we optimistically return true
        // The actual mailbox creation will happen during fileinto
      }
    }

    return true;
  }

  /**
   * Evaluate a specialuse_exists test (RFC 8579)
   * @param {Object} test - The specialuse_exists test
   * @param {Object} state - Execution state
   * @returns {boolean} Test result
   */
  evaluateSpecialuseexistsTest(test, state) {
    // Map of special-use attributes to standard mailbox names
    const specialUseMap = {
      '\\Archive': 'Archive',
      '\\Drafts': 'Drafts',
      '\\Flagged': 'Flagged',
      '\\Junk': 'Junk',
      '\\Sent': 'Sent',
      '\\Trash': 'Trash',
      '\\All': 'All Mail',
      '\\Important': 'Important'
    };

    // Check if all requested special-use attributes are available
    for (const attr of test.attributes) {
      const interpolated = this.interpolateVariables(attr, state);
      if (!specialUseMap[interpolated]) {
        return false;
      }
    }

    return true;
  }
}

module.exports = SieveEngine;
