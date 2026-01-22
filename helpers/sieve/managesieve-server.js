/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 *
 * ManageSieve Server Implementation (RFC 5804)
 *
 * This module implements the ManageSieve protocol for remote management
 * of Sieve scripts. Scripts are stored per-alias via the SieveScripts model.
 *
 * Authentication returns an alias context, and all script operations
 * are performed on that alias's scripts.
 *
 * It supports:
 * - AUTHENTICATE (PLAIN, LOGIN)
 * - CAPABILITY
 * - HAVESPACE
 * - PUTSCRIPT
 * - LISTSCRIPTS
 * - SETACTIVE
 * - GETSCRIPT
 * - DELETESCRIPT
 * - RENAMESCRIPT
 * - CHECKSCRIPT
 * - LOGOUT
 * - STARTTLS
 */

const { Buffer } = require('node:buffer');
const { EventEmitter } = require('node:events');
const net = require('node:net');
const tls = require('node:tls');
const { validate } = require('./parser');

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

// ManageSieve response codes
const RESPONSE = {
  OK: 'OK',
  NO: 'NO',
  BYE: 'BYE'
};

// Default configuration
const DEFAULT_CONFIG = {
  port: 4190,
  host: '0.0.0.0',
  maxScriptSize: 1024 * 1024, // 1MB
  maxScripts: 100,
  implementation: 'Forward-Email-ManageSieve',
  version: '1.0'
};

/**
 * ManageSieve Server
 */
class ManageSieveServer extends EventEmitter {
  /**
   * Create a new ManageSieve server
   * @param {Object} options - Server options
   * @param {Object} options.store - Script storage backend
   * @param {Function} options.authenticate - Authentication function
   * @param {Object} options.tls - TLS options
   * @param {Object} options.logger - Logger instance
   */
  constructor(options = {}) {
    super();

    this.config = { ...DEFAULT_CONFIG, ...options };
    this.store = options.store;
    this.authenticate = options.authenticate;
    this.tlsOptions = options.tls;
    this.logger = options.logger || console;
    this.server = null;
    this.connections = new Set();
  }

  /**
   * Start the ManageSieve server
   * @returns {Promise<void>}
   */
  async start() {
    return new Promise((resolve, reject) => {
      const serverOptions = this.tlsOptions
        ? { ...this.tlsOptions }
        : undefined;

      this.server = serverOptions
        ? tls.createServer(serverOptions, (socket) =>
            this.handleConnection(socket)
          )
        : net.createServer((socket) => this.handleConnection(socket));

      this.server.on('error', (error) => {
        this.logger.error('ManageSieve server error:', error);
        reject(error);
      });

      this.server.listen(this.config.port, this.config.host, () => {
        this.logger.info(
          `ManageSieve server listening on ${this.config.host}:${this.config.port}`
        );
        resolve();
      });
    });
  }

  /**
   * Start the server on a specific port (alias for start with port override)
   * @param {number} port - Port to listen on
   * @returns {Promise<void>}
   */
  async listen(port) {
    if (port) {
      this.config.port = port;
    }

    return this.start();
  }

  /**
   * Close the server (alias for stop)
   * @returns {Promise<void>}
   */
  async close() {
    return this.stop();
  }

  /**
   * Stop the ManageSieve server
   * @returns {Promise<void>}
   */
  async stop() {
    // Close all connections
    for (const conn of this.connections) {
      conn.socket.end();
    }

    this.connections.clear();

    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.logger.info('ManageSieve server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Handle a new connection
   * @param {net.Socket} socket - The client socket
   */
  handleConnection(socket) {
    const connection = new ManageSieveConnection(socket, this);
    this.connections.add(connection);

    socket.on('close', () => {
      this.connections.delete(connection);
    });

    connection.start();
  }

  /**
   * Get server capabilities
   * @returns {string[]} List of capabilities
   */
  getCapabilities() {
    const caps = [
      `"IMPLEMENTATION" "${this.config.implementation}"`,
      `"VERSION" "${this.config.version}"`,
      '"SASL" "PLAIN LOGIN"',
      `"SIEVE" "${SUPPORTED_CAPABILITIES.join(' ')}"`,
      '"MAXREDIRECTS" "10"',
      '"NOTIFY" "mailto"',
      '"LANGUAGE" "en"'
    ];

    if (this.tlsOptions && !this.config.secure) {
      caps.push('"STARTTLS"');
    }

    return caps;
  }
}

/**
 * ManageSieve Connection Handler
 */
class ManageSieveConnection {
  /**
   * Create a new connection handler
   * @param {net.Socket} socket - The client socket
   * @param {ManageSieveServer} server - The server instance
   */
  constructor(socket, server) {
    this.socket = socket;
    this.server = server;
    this.logger = server.logger;
    this.authenticated = false;
    this.user = null;
    this.buffer = '';
    this.expectingLiteral = false;
    this.literalSize = 0;
    this.literalData = '';
    this.currentCommand = null;
  }

  /**
   * Start handling the connection
   */
  start() {
    this.socket.setEncoding('utf8');

    // Send greeting
    this.sendCapabilities();
    this.send(RESPONSE.OK, 'ManageSieve ready');

    this.socket.on('data', (data) => this.handleData(data));
    this.socket.on('error', (error) => {
      this.logger.error('ManageSieve connection error:', error);
    });
    this.socket.on('close', () => {
      this.logger.info('ManageSieve connection closed');
    });
  }

  /**
   * Handle incoming data
   * @param {string} data - The incoming data
   */
  handleData(data) {
    this.buffer += data;

    // Handle literal data
    if (this.expectingLiteral) {
      this.handleLiteralData();
      return;
    }

    // Process complete lines
    let lineEnd;
    while ((lineEnd = this.buffer.indexOf('\r\n')) !== -1) {
      const line = this.buffer.slice(0, lineEnd);
      this.buffer = this.buffer.slice(lineEnd + 2);

      // Check for literal
      const literalMatch = line.match(/{(\d+)\+?}$/);
      if (literalMatch) {
        this.expectingLiteral = true;
        this.literalSize = Number.parseInt(literalMatch[1], 10);
        this.literalData = '';
        this.currentCommand = line.slice(0, literalMatch.index).trim();
        this.handleLiteralData();
      } else {
        this.processCommand(line);
      }
    }
  }

  /**
   * Handle literal data collection
   */
  handleLiteralData() {
    const needed = this.literalSize - this.literalData.length;
    const available = this.buffer.length;

    if (available >= needed) {
      this.literalData += this.buffer.slice(0, needed);
      this.buffer = this.buffer.slice(needed);

      // Skip trailing CRLF if present
      if (this.buffer.startsWith('\r\n')) {
        this.buffer = this.buffer.slice(2);
      }

      this.expectingLiteral = false;
      this.processCommandWithLiteral(this.currentCommand, this.literalData);
      this.currentCommand = null;
      this.literalData = '';
      this.literalSize = 0;
    } else {
      this.literalData += this.buffer;
      this.buffer = '';
    }
  }

  /**
   * Process a command
   * @param {string} line - The command line
   */
  processCommand(line) {
    const parts = this.parseLine(line);
    if (parts.length === 0) {
      return;
    }

    const command = parts[0].toUpperCase();
    const args = parts.slice(1);

    this.logger.info(`ManageSieve command: ${command}`, { args });

    switch (command) {
      case 'CAPABILITY': {
        this.handleCapability();
        break;
      }

      case 'AUTHENTICATE': {
        this.handleAuthenticate(args);
        break;
      }

      case 'STARTTLS': {
        this.handleStartTLS();
        break;
      }

      case 'HAVESPACE': {
        this.handleHaveSpace(args);
        break;
      }

      case 'LISTSCRIPTS': {
        this.handleListScripts();
        break;
      }

      case 'SETACTIVE': {
        this.handleSetActive(args);
        break;
      }

      case 'GETSCRIPT': {
        this.handleGetScript(args);
        break;
      }

      case 'DELETESCRIPT': {
        this.handleDeleteScript(args);
        break;
      }

      case 'RENAMESCRIPT': {
        this.handleRenameScript(args);
        break;
      }

      case 'CHECKSCRIPT': {
        // Will be handled with literal
        break;
      }

      case 'PUTSCRIPT': {
        // Will be handled with literal
        break;
      }

      case 'LOGOUT': {
        this.handleLogout();
        break;
      }

      case 'NOOP': {
        this.send(RESPONSE.OK, 'NOOP completed');
        break;
      }

      default: {
        this.send(RESPONSE.NO, `Unknown command: ${command}`);
      }
    }
  }

  /**
   * Process a command with literal data
   * @param {string} commandLine - The command line
   * @param {string} literal - The literal data
   */
  processCommandWithLiteral(commandLine, literal) {
    const parts = this.parseLine(commandLine);
    if (parts.length === 0) {
      return;
    }

    const command = parts[0].toUpperCase();
    const args = parts.slice(1);

    switch (command) {
      case 'PUTSCRIPT': {
        this.handlePutScript(args, literal);
        break;
      }

      case 'CHECKSCRIPT': {
        this.handleCheckScript(literal);
        break;
      }

      case 'AUTHENTICATE': {
        this.handleAuthenticateResponse(args, literal);
        break;
      }

      default: {
        this.send(RESPONSE.NO, `Unexpected literal for command: ${command}`);
      }
    }
  }

  /**
   * Parse a command line into parts
   * @param {string} line - The command line
   * @returns {string[]} Parsed parts
   */
  parseLine(line) {
    const parts = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
        inQuote = !inQuote;
      } else if (char === ' ' && !inQuote) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      parts.push(current);
    }

    // Remove quotes from quoted strings
    return parts.map((p) => {
      if (p.startsWith('"') && p.endsWith('"')) {
        return p.slice(1, -1).replaceAll(String.raw`\"`, '"');
      }

      return p;
    });
  }

  /**
   * Send capabilities to client
   */
  sendCapabilities() {
    for (const cap of this.server.getCapabilities()) {
      this.socket.write(cap + '\r\n');
    }
  }

  /**
   * Send a response
   * @param {string} status - Response status
   * @param {string} message - Response message
   */
  send(status, message) {
    this.socket.write(`${status} "${message}"\r\n`);
  }

  /**
   * Send a literal response
   * @param {string} data - The literal data
   */
  sendLiteral(data) {
    this.socket.write(`{${data.length}}\r\n${data}\r\n`);
  }

  /**
   * Handle CAPABILITY command
   */
  handleCapability() {
    this.sendCapabilities();
    this.send(RESPONSE.OK, 'Capability completed');
  }

  /**
   * Handle AUTHENTICATE command
   * @param {string[]} args - Command arguments
   */
  handleAuthenticate(args) {
    if (args.length === 0) {
      this.send(RESPONSE.NO, 'Missing authentication mechanism');
      return;
    }

    const mechanism = args[0].toUpperCase();

    if (mechanism === 'PLAIN') {
      if (args.length > 1) {
        // Initial response provided
        this.processPlainAuth(args[1]);
      } else {
        // Request initial response
        this.socket.write('\r\n');
      }
    } else if (mechanism === 'LOGIN') {
      // Request username
      this.socket.write('"Username:"\r\n');
    } else {
      this.send(RESPONSE.NO, `Unsupported mechanism: ${mechanism}`);
    }
  }

  /**
   * Handle authentication response
   * @param {string[]} args - Command arguments
   * @param {string} response - Authentication response
   */
  handleAuthenticateResponse(args, response) {
    const mechanism = args[0]?.toUpperCase();

    if (mechanism === 'PLAIN') {
      this.processPlainAuth(response);
    }
  }

  /**
   * Process PLAIN authentication
   * @param {string} data - Base64 encoded credentials
   */
  async processPlainAuth(data) {
    try {
      const decoded = Buffer.from(data, 'base64').toString('utf8');
      const parts = decoded.split('\0');

      if (parts.length < 3) {
        this.send(RESPONSE.NO, 'Invalid credentials format');
        return;
      }

      const username = parts[1];
      const password = parts[2];

      const result = await this.server.authenticate(username, password);

      // Handle both { success: true, user: {...} } and direct user object formats
      if (result && (result.success || result.id || result.username)) {
        this.authenticated = true;
        this.user = result.user || result;
        this.send(RESPONSE.OK, 'Authentication successful');
      } else {
        this.send(RESPONSE.NO, 'Authentication failed');
      }
    } catch (err) {
      this.logger.error('Authentication error:', err);
      this.send(RESPONSE.NO, 'Authentication error');
    }
  }

  /**
   * Handle STARTTLS command
   */
  handleStartTLS() {
    if (!this.server.tlsOptions) {
      this.send(RESPONSE.NO, 'STARTTLS not available');
      return;
    }

    this.send(RESPONSE.OK, 'Begin TLS negotiation');

    const tlsSocket = new tls.TLSSocket(this.socket, {
      ...this.server.tlsOptions,
      isServer: true
    });

    tlsSocket.on('secure', () => {
      this.socket = tlsSocket;
      this.sendCapabilities();
    });
  }

  /**
   * Handle HAVESPACE command
   * @param {string[]} args - Command arguments
   */
  handleHaveSpace(args) {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    if (args.length < 2) {
      this.send(RESPONSE.NO, 'Missing arguments');
      return;
    }

    const size = Number.parseInt(args[1], 10);

    if (size > this.server.config.maxScriptSize) {
      this.send(RESPONSE.NO, '(QUOTA/MAXSIZE) Script too large');
      return;
    }

    this.send(RESPONSE.OK, 'Space available');
  }

  /**
   * Handle PUTSCRIPT command
   * @param {string[]} args - Command arguments
   * @param {string} script - The script content
   */
  async handlePutScript(args, script) {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    if (args.length === 0) {
      this.send(RESPONSE.NO, 'Missing script name');
      return;
    }

    const name = args[0];

    // Validate script
    const validation = validate(script);
    if (!validation.valid) {
      const error = validation.errors[0];
      this.send(
        RESPONSE.NO,
        `Script error at line ${error.line}: ${error.message}`
      );
      return;
    }

    try {
      const userId = this.user.id || this.user;
      await this.server.store.putScript(userId, name, script);
      this.send(RESPONSE.OK, 'Script stored');
    } catch (err) {
      this.logger.error('Error storing script:', err);
      this.send(RESPONSE.NO, 'Error storing script');
    }
  }

  /**
   * Handle LISTSCRIPTS command
   */
  async handleListScripts() {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    try {
      const userId = this.user.id || this.user;
      const scripts = await this.server.store.listScripts(userId);

      for (const script of scripts) {
        const active = script.is_active ? ' ACTIVE' : '';
        this.socket.write(`"${script.name}"${active}\r\n`);
      }

      this.send(RESPONSE.OK, 'Listscripts completed');
    } catch (err) {
      this.logger.error('Error listing scripts:', err);
      this.send(RESPONSE.NO, 'Error listing scripts');
    }
  }

  /**
   * Handle SETACTIVE command
   * @param {string[]} args - Command arguments
   */
  async handleSetActive(args) {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    const name = args[0] || '';

    try {
      const userId = this.user.id || this.user;
      await this.server.store.setActive(userId, name);
      this.send(RESPONSE.OK, name ? 'Script activated' : 'Script deactivated');
    } catch (err) {
      this.logger.error('Error setting active script:', err);
      this.send(RESPONSE.NO, 'Error setting active script');
    }
  }

  /**
   * Handle GETSCRIPT command
   * @param {string[]} args - Command arguments
   */
  async handleGetScript(args) {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    if (args.length === 0) {
      this.send(RESPONSE.NO, 'Missing script name');
      return;
    }

    const name = args[0];

    try {
      const userId = this.user.id || this.user;
      const script = await this.server.store.getScript(userId, name);

      if (!script) {
        this.send(RESPONSE.NO, 'Script not found');
        return;
      }

      this.sendLiteral(script.content);
      this.send(RESPONSE.OK, 'Getscript completed');
    } catch (err) {
      this.logger.error('Error getting script:', err);
      this.send(RESPONSE.NO, 'Error getting script');
    }
  }

  /**
   * Handle DELETESCRIPT command
   * @param {string[]} args - Command arguments
   */
  async handleDeleteScript(args) {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    if (args.length === 0) {
      this.send(RESPONSE.NO, 'Missing script name');
      return;
    }

    const name = args[0];

    try {
      const userId = this.user.id || this.user;
      const deleted = await this.server.store.deleteScript(userId, name);

      if (!deleted) {
        this.send(RESPONSE.NO, 'Script not found or is active');
        return;
      }

      this.send(RESPONSE.OK, 'Script deleted');
    } catch (err) {
      this.logger.error('Error deleting script:', err);
      this.send(RESPONSE.NO, 'Error deleting script');
    }
  }

  /**
   * Handle RENAMESCRIPT command
   * @param {string[]} args - Command arguments
   */
  async handleRenameScript(args) {
    if (!this.authenticated) {
      this.send(RESPONSE.NO, 'Not authenticated');
      return;
    }

    if (args.length < 2) {
      this.send(RESPONSE.NO, 'Missing arguments');
      return;
    }

    const oldName = args[0];
    const newName = args[1];

    try {
      const userId = this.user.id || this.user;
      const renamed = await this.server.store.renameScript(
        userId,
        oldName,
        newName
      );

      if (!renamed) {
        this.send(RESPONSE.NO, 'Script not found or name already exists');
        return;
      }

      this.send(RESPONSE.OK, 'Script renamed');
    } catch (err) {
      this.logger.error('Error renaming script:', err);
      this.send(RESPONSE.NO, 'Error renaming script');
    }
  }

  /**
   * Handle CHECKSCRIPT command
   * @param {string} script - The script to check
   */
  handleCheckScript(script) {
    const validation = validate(script);

    if (validation.valid) {
      this.send(RESPONSE.OK, 'Script is valid');
    } else {
      const error = validation.errors[0];
      this.send(
        RESPONSE.NO,
        `Script error at line ${error.line}: ${error.message}`
      );
    }
  }

  /**
   * Handle LOGOUT command
   */
  handleLogout() {
    this.send(RESPONSE.OK, 'Logout completed');
    this.socket.end();
  }
}

module.exports = {
  ManageSieveServer,
  ManageSieveConnection
};
