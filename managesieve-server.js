/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const fs = require('node:fs');
const net = require('node:net');
const tls = require('node:tls');
const pify = require('pify');
const { Aliases, SieveScripts } = require('#models');
const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const onConnect = require('#helpers/on-connect');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { validate: validateSieve } = require('#helpers/sieve');
const createTangerine = require('#helpers/create-tangerine');

const onConnectPromise = pify(onConnect);

//
// ManageSieve Server Implementation (RFC 5804)
// Runs on port 4190 alongside IMAP server
//
// Protocol commands:
// - CAPABILITY - List server capabilities
// - AUTHENTICATE - SASL authentication (PLAIN)
// - STARTTLS - Upgrade to TLS
// - LOGOUT - End session
// - LISTSCRIPTS - List user's scripts
// - GETSCRIPT - Download a script
// - PUTSCRIPT - Upload/create a script
// - SETACTIVE - Activate a script
// - DELETESCRIPT - Delete a script
// - RENAMESCRIPT - Rename a script
// - CHECKSCRIPT - Validate script syntax
// - HAVESPACE - Check if space available for script
// - NOOP - Keep connection alive
//

// Sieve capabilities that are FULLY INTEGRATED and tested
// Only advertise capabilities that actually work end-to-end
const SIEVE_CAPABILITIES = [
  'fileinto',
  'reject',
  'ereject',
  'envelope',
  'body',
  'vacation',
  'vacation-seconds',
  'variables',
  'relational',
  'comparator-i;ascii-numeric',
  'imap4flags',
  'copy',
  'date',
  'index',
  'editheader',
  'enotify',
  'regex',
  'subaddress',
  'ihave',
  'duplicate',
  'special-use',
  'mailbox',
  'environment'
  // NOT ADVERTISED (not fully integrated):
  // - encoded-character (RFC 5228): requires parser changes for ${hex:} and ${unicode:} syntax
  // - fcc (RFC 8580): requires Sent folder integration
  // - include (RFC 6609): security risk, requires global script storage
  // - mboxmetadata (RFC 5490): requires IMAP METADATA extension
  // - servermetadata (RFC 5490): requires IMAP METADATA extension
];

// SASL mechanisms supported
const SASL_MECHANISMS = ['PLAIN'];

// ManageSieve response codes
const RESPONSE = {
  OK: 'OK',
  NO: 'NO',
  BYE: 'BYE'
};

class ManageSieveServer {
  constructor(options = {}) {
    this.options = options;
    this.client = options.client; // Redis client
    this.wsp = options.wsp; // WebSocket client for SQLite server
    this.logger = options.logger || logger;

    // DNS resolver for domain verification
    this.resolver = createTangerine(this.client, this.logger);

    // Server configuration
    this.maxScriptSize = config.managesieve.maxScriptSize;
    this.maxScriptCount = config.managesieve.maxScripts;
    this.maxScriptNameLength = config.managesieve.maxScriptNameLength;

    // TLS configuration
    // Note: secure=true means implicit TLS (start encrypted)
    // secure=false means STARTTLS (start plain, upgrade to TLS)
    // Both modes need TLS options for encryption
    this.secure = options.secure !== false;
    this.tlsOptions = null;

    // Load TLS options if certificates are available
    // This is needed for both implicit TLS and STARTTLS modes
    if (env.WEB_SSL_KEY_PATH && env.WEB_SSL_CERT_PATH) {
      this.tlsOptions = {
        key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
        cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
        ...(env.WEB_SSL_CA_PATH
          ? { ca: fs.readFileSync(env.WEB_SSL_CA_PATH) }
          : {})
      };
    }

    // Create server
    if (this.secure && this.tlsOptions) {
      this.server = tls.createServer(this.tlsOptions, (socket) =>
        this.handleConnection(socket)
      );
    } else {
      this.server = net.createServer((socket) => this.handleConnection(socket));
    }

    // Track connections
    this.connections = new Set();

    // Server events
    this.server.on('error', (error) => {
      this.logger.error(error, { component: 'ManageSieve' });
    });

    this.server.on('close', () => {
      this.logger.info('ManageSieve server closed', {
        component: 'ManageSieve'
      });
    });
  }

  //
  // Start listening on configured port
  //
  listen(port, _host) {
    return new Promise((resolve, reject) => {
      const listenPort = port || env.MANAGESIEVE_PORT || 4190;
      const listenHost = '::'; // host || env.MANAGESIEVE_HOST || '::';

      this.server.listen(listenPort, '::', () => {
        this.logger.info(
          `ManageSieve server listening on ${listenHost}:${listenPort}`,
          { component: 'ManageSieve' }
        );
        resolve(this.server);
      });

      this.server.once('error', reject);
    });
  }

  //
  // Gracefully close server
  //
  close() {
    return new Promise((resolve) => {
      // Close all active connections
      for (const conn of this.connections) {
        try {
          conn.socket.end();
        } catch {
          // Ignore errors during close
        }
      }

      this.server.close(() => {
        resolve();
      });
    });
  }

  //
  // Handle new client connection
  //
  async handleConnection(socket) {
    const session = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      socket,
      authenticated: false,
      user: null,
      alias: null,
      domain: null,
      tlsStarted: this.secure,
      buffer: '',
      // Properties for onConnect/onAuth compatibility
      remoteAddress: socket.remoteAddress,
      localAddress: socket.localAddress,
      localPort: socket.localPort,
      isClosing: false
    };

    this.connections.add(session);

    this.logger.info('ManageSieve connection established', {
      component: 'ManageSieve',
      sessionId: session.id,
      remoteAddress: socket.remoteAddress
    });

    // Check if server is shutting down
    if (this.isClosing) {
      this.send(session, `${RESPONSE.BYE} "Server shutting down"`);
      socket.end();
      return;
    }

    // Send greeting immediately to comply with RFC 5804
    // The server MUST send capabilities upon connection
    this.sendCapabilities(session);

    // Run onConnect checks asynchronously (rate limiting, denylist, etc.)
    // This is done after greeting to prevent DNS/Redis delays from blocking the greeting
    // Similar to how IMAP/POP3 handle onConnect in onAuth instead of blocking connection
    onConnectPromise
      .call(this, session)
      .then(() => {
        this.logger.debug('ManageSieve onConnect completed', {
          component: 'ManageSieve',
          sessionId: session.id
        });
      })
      .catch((err) => {
        // Handle connection rejection - close the connection
        const error = refineAndLogError(err, session, false, this);
        this.logger.warn('ManageSieve connection rejected after greeting', {
          component: 'ManageSieve',
          sessionId: session.id,
          remoteAddress: socket.remoteAddress,
          error: error.message
        });
        this.send(session, `${RESPONSE.BYE} "${error.message}"`);
        socket.end();
      });

    // Handle data
    socket.on('data', (data) => {
      session.buffer += data.toString('utf8');
      this.processBuffer(session);
    });

    // Handle close
    socket.on('close', () => {
      this.connections.delete(session);
      this.logger.info('ManageSieve connection closed', {
        component: 'ManageSieve',
        sessionId: session.id
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      this.logger.error(error, {
        component: 'ManageSieve',
        sessionId: session.id
      });
    });

    // Set timeout (5 minutes idle)
    socket.setTimeout(5 * 60 * 1000);
    socket.on('timeout', () => {
      this.send(session, `${RESPONSE.BYE} "Connection timed out"`);
      socket.end();
    });
  }

  //
  // Process incoming data buffer
  //
  async processBuffer(session) {
    // If we're waiting for literal data, handle it first
    if (session.pendingLiteral) {
      const { size, callback } = session.pendingLiteral;
      if (session.buffer.length >= size) {
        const content = session.buffer.slice(0, size);
        session.buffer = session.buffer.slice(size);
        session.pendingLiteral = null;
        await callback(content);
        // Continue processing remaining buffer
        await this.processBuffer(session);
      }

      return;
    }

    // ManageSieve uses CRLF line endings
    const crlfIndex = session.buffer.indexOf('\r\n');
    if (crlfIndex === -1) {
      return; // Wait for complete line
    }

    const line = session.buffer.slice(0, crlfIndex);
    session.buffer = session.buffer.slice(crlfIndex + 2);

    if (line.length > 0) {
      await this.processCommand(session, line);
    }

    // Continue processing remaining buffer
    if (session.buffer.length > 0) {
      await this.processBuffer(session);
    }
  }

  //
  // Process a single command
  //
  async processCommand(session, line) {
    this.logger.info(`ManageSieve command: ${line}`, {
      component: 'ManageSieve',
      sessionId: session.id
    });

    // Parse command and arguments
    const match = line.match(/^(\w+)(?:\s+(.*))?$/i);
    if (!match) {
      this.send(session, `${RESPONSE.NO} "Invalid command"`);
      return;
    }

    const command = match[1].toUpperCase();
    const args = match[2] || '';

    try {
      switch (command) {
        case 'CAPABILITY': {
          this.sendCapabilities(session);
          break;
        }

        case 'AUTHENTICATE': {
          await this.handleAuthenticate(session, args);
          break;
        }

        case 'STARTTLS': {
          await this.handleStartTLS(session);
          break;
        }

        case 'LOGOUT': {
          this.handleLogout(session);
          break;
        }

        case 'LISTSCRIPTS': {
          await this.handleListScripts(session);
          break;
        }

        case 'GETSCRIPT': {
          await this.handleGetScript(session, args);
          break;
        }

        case 'PUTSCRIPT': {
          await this.handlePutScript(session, args);
          break;
        }

        case 'SETACTIVE': {
          await this.handleSetActive(session, args);
          break;
        }

        case 'DELETESCRIPT': {
          await this.handleDeleteScript(session, args);
          break;
        }

        case 'RENAMESCRIPT': {
          await this.handleRenameScript(session, args);
          break;
        }

        case 'CHECKSCRIPT': {
          await this.handleCheckScript(session, args);
          break;
        }

        case 'HAVESPACE': {
          await this.handleHaveSpace(session, args);
          break;
        }

        case 'NOOP': {
          this.send(session, `${RESPONSE.OK} "NOOP completed"`);
          break;
        }

        default: {
          this.send(session, `${RESPONSE.NO} "Unknown command: ${command}"`);
        }
      }
    } catch (err) {
      this.logger.error(err, {
        component: 'ManageSieve',
        sessionId: session.id,
        command
      });
      this.send(session, `${RESPONSE.NO} "Internal server error"`);
    }
  }

  //
  // Send capabilities to client
  //
  sendCapabilities(session) {
    const capabilities = [
      '"IMPLEMENTATION" "Forward Email ManageSieve v1.0.0"',
      `"SASL" "${SASL_MECHANISMS.join(' ')}"`,
      `"SIEVE" "${SIEVE_CAPABILITIES.join(' ')}"`,
      `"MAXREDIRECTS" "${config.managesieve.maxRedirects}"`,
      '"NOTIFY" "mailto"',
      '"VERSION" "1.0"'
    ];

    // Add STARTTLS if not already secure
    if (!session.tlsStarted && this.tlsOptions) {
      capabilities.push('"STARTTLS"');
    }

    for (const cap of capabilities) {
      this.send(session, cap);
    }

    this.send(session, `${RESPONSE.OK} "Capability completed"`);
  }

  //
  // Handle AUTHENTICATE command
  //
  async handleAuthenticate(session, args) {
    if (session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Already authenticated"`);
      return;
    }

    // Parse mechanism
    const match = args.match(/^"?([\w-]+)"?(?:\s+"?([^"]*)"?)?$/i);
    if (!match) {
      this.send(session, `${RESPONSE.NO} "Invalid AUTHENTICATE syntax"`);
      return;
    }

    const mechanism = match[1].toUpperCase();
    const initialResponse = match[2];

    if (!SASL_MECHANISMS.includes(mechanism)) {
      this.send(
        session,
        `${RESPONSE.NO} "Unsupported mechanism: ${mechanism}"`
      );
      return;
    }

    if (mechanism === 'PLAIN') {
      await this.handlePlainAuth(session, initialResponse);
    }
  }

  //
  // Handle PLAIN authentication
  //
  async handlePlainAuth(session, initialResponse) {
    const authData = initialResponse;

    // If no initial response, request it
    if (!authData) {
      this.send(session, '""');
      // Wait for client response (simplified - in production use proper async handling)
      return;
    }

    // Decode base64 PLAIN auth: \0username\0password
    let decoded;
    try {
      decoded = Buffer.from(authData, 'base64').toString('utf8');
    } catch {
      this.send(session, `${RESPONSE.NO} "Invalid base64 encoding"`);
      return;
    }

    const parts = decoded.split('\0');
    if (parts.length < 3) {
      this.send(session, `${RESPONSE.NO} "Invalid PLAIN auth format"`);
      return;
    }

    // PLAIN format: [authzid]\0authcid\0passwd
    const username = parts[1] || parts[0];
    const password = parts[2];

    if (!username || !password) {
      this.send(session, `${RESPONSE.NO} "Missing credentials"`);
      return;
    }

    // Authenticate using Forward Email's onAuth helper (with proper callback pattern)
    try {
      const authResult = await new Promise((resolve, reject) => {
        onAuth.call(
          {
            wsp: this.wsp,
            client: this.client,
            logger: this.logger,
            resolver: this.resolver,
            server: this.server,
            constructor: { name: 'ManageSieveServer' }
          },
          { username, password },
          session,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (!authResult || !authResult.user) {
        this.send(session, `${RESPONSE.NO} "Authentication failed"`);
        return;
      }

      // Get alias and domain info
      const alias = await Aliases.findById(authResult.user.alias_id).populate(
        'domain'
      );
      if (!alias) {
        this.send(session, `${RESPONSE.NO} "Alias not found"`);
        return;
      }

      // Check if IMAP is enabled - Sieve requires IMAP
      if (!alias.has_imap) {
        this.send(
          session,
          `${RESPONSE.NO} "Sieve requires IMAP to be enabled for this alias"`
        );
        return;
      }

      // Check if domain is verified (has_txt_record: true)
      if (!alias.domain.has_txt_record) {
        this.send(
          session,
          `${RESPONSE.NO} "Domain must be verified before using Sieve"`
        );
        return;
      }

      // Check if domain is on a plan that supports Sieve (enhanced_protection or team)
      if (!['enhanced_protection', 'team'].includes(alias.domain.plan)) {
        this.send(
          session,
          `${RESPONSE.NO} "Sieve requires Enhanced Protection or Team plan"`
        );
        return;
      }

      // Check if alias is domain-wide (catch-all) - not allowed for Sieve
      if (alias.name === '*' || alias.name.startsWith('*@')) {
        this.send(
          session,
          `${RESPONSE.NO} "Sieve scripts not allowed for catch-all aliases"`
        );
        return;
      }

      session.authenticated = true;
      session.user = authResult.user;
      session.alias = alias;
      session.domain = alias.domain;

      this.logger.info('ManageSieve authentication successful', {
        component: 'ManageSieve',
        sessionId: session.id,
        alias: alias.name,
        domain: alias.domain.name
      });

      this.send(session, `${RESPONSE.OK} "Authentication successful"`);
    } catch (err) {
      // Handle specific error types
      const error = refineAndLogError(err, session, false, this);
      this.logger.warn('ManageSieve authentication failed', {
        component: 'ManageSieve',
        sessionId: session.id,
        error: error.message
      });
      this.send(session, `${RESPONSE.NO} "${error.message}"`);
    }
  }

  //
  // Handle STARTTLS command
  //
  async handleStartTLS(session) {
    if (session.tlsStarted) {
      this.send(session, `${RESPONSE.NO} "TLS already active"`);
      return;
    }

    if (!this.tlsOptions) {
      this.send(session, `${RESPONSE.NO} "TLS not available"`);
      return;
    }

    this.send(session, `${RESPONSE.OK} "Begin TLS negotiation"`);

    // Upgrade connection to TLS
    const tlsSocket = new tls.TLSSocket(session.socket, {
      ...this.tlsOptions,
      isServer: true
    });

    session.socket = tlsSocket;
    session.tlsStarted = true;
    session.buffer = '';

    // Re-attach event handlers
    tlsSocket.on('data', (data) => {
      session.buffer += data.toString('utf8');
      this.processBuffer(session);
    });

    tlsSocket.on('error', (error) => {
      this.logger.error(error, {
        component: 'ManageSieve',
        sessionId: session.id
      });
    });
  }

  //
  // Handle LOGOUT command
  //
  handleLogout(session) {
    this.send(session, `${RESPONSE.OK} "Logout completed"`);
    this.send(session, `${RESPONSE.BYE} "Goodbye"`);
    session.socket.end();
  }

  //
  // Handle LISTSCRIPTS command
  //
  async handleListScripts(session) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    const scripts = await SieveScripts.find({
      alias: session.alias._id
    }).sort({ name: 1 });

    for (const script of scripts) {
      const activeMarker = script.is_active ? ' ACTIVE' : '';
      this.send(session, `"${this.escapeString(script.name)}"${activeMarker}`);
    }

    this.send(session, `${RESPONSE.OK} "LISTSCRIPTS completed"`);
  }

  //
  // Handle GETSCRIPT command
  //
  async handleGetScript(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    const scriptName = this.parseString(args);
    if (!scriptName) {
      this.send(session, `${RESPONSE.NO} "Missing script name"`);
      return;
    }

    const script = await SieveScripts.findOne({
      alias: session.alias._id,
      name: scriptName
    });

    if (!script) {
      this.send(session, `${RESPONSE.NO} "Script not found"`);
      return;
    }

    // Send script content with literal syntax
    const content = script.content || '';
    this.send(session, `{${Buffer.byteLength(content, 'utf8')}}`);
    this.send(session, content);
    this.send(session, `${RESPONSE.OK} "GETSCRIPT completed"`);
  }

  //
  // Handle PUTSCRIPT command
  //
  async handlePutScript(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    // Parse: "scriptname" {size+}
    const match = args.match(/^"([^"]+)"\s+{(\d+)\+?}$/);
    if (!match) {
      this.send(session, `${RESPONSE.NO} "Invalid PUTSCRIPT syntax"`);
      return;
    }

    const scriptName = match[1];
    const scriptSize = Number.parseInt(match[2], 10);

    // Validate script name
    if (scriptName.length > this.maxScriptNameLength) {
      this.send(session, `${RESPONSE.NO} "Script name too long"`);
      return;
    }

    if (!/^[\w.+-]+$/.test(scriptName)) {
      this.send(session, `${RESPONSE.NO} "Invalid characters in script name"`);
      return;
    }

    // Check script size
    if (scriptSize > this.maxScriptSize) {
      this.send(
        session,
        `${RESPONSE.NO} (QUOTA/MAXSIZE) "Script too large (max ${this.maxScriptSize} bytes)"`
      );
      return;
    }

    // Check script count
    const scriptCount = await SieveScripts.countDocuments({
      alias: session.alias._id
    });

    const existingScript = await SieveScripts.findOne({
      alias: session.alias._id,
      name: scriptName
    });

    if (!existingScript && scriptCount >= this.maxScriptCount) {
      this.send(
        session,
        `${RESPONSE.NO} (QUOTA) "Maximum script count (${this.maxScriptCount}) reached"`
      );
      return;
    }

    // Set up pending literal to read script content
    session.pendingLiteral = {
      size: scriptSize,
      callback: async (content) => {
        // Validate script syntax
        try {
          const validation = validateSieve(content);
          if (!validation.valid) {
            throw new Error(validation.errors[0]?.message || 'Invalid script');
          }
        } catch (err) {
          this.send(session, `${RESPONSE.NO} "Syntax error: ${err.message}"`);
          return;
        }

        // Save script
        try {
          if (existingScript) {
            existingScript.content = content;
            await existingScript.save();
          } else {
            await SieveScripts.create({
              alias: session.alias._id,
              user: session.alias.user,
              domain: session.domain._id,
              name: scriptName,
              content,
              is_active: false
            });
          }

          this.send(session, `${RESPONSE.OK} "PUTSCRIPT completed"`);
        } catch (err) {
          this.logger.error(err, {
            component: 'ManageSieve',
            sessionId: session.id
          });
          this.send(session, `${RESPONSE.NO} "Failed to save script"`);
        }
      }
    };

    // Try to process if data is already in buffer
    await this.processBuffer(session);
  }

  //
  // Handle SETACTIVE command
  //
  async handleSetActive(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    const scriptName = this.parseString(args);

    // Empty string means deactivate all scripts
    if (scriptName === '') {
      await SieveScripts.updateMany(
        { alias: session.alias._id },
        { is_active: false }
      );
      this.send(session, `${RESPONSE.OK} "All scripts deactivated"`);
      return;
    }

    const script = await SieveScripts.findOne({
      alias: session.alias._id,
      name: scriptName
    });

    if (!script) {
      this.send(session, `${RESPONSE.NO} "Script not found"`);
      return;
    }

    // Deactivate all other scripts and activate this one
    await SieveScripts.updateMany(
      { alias: session.alias._id },
      { is_active: false }
    );

    script.is_active = true;
    await script.save();

    this.send(session, `${RESPONSE.OK} "SETACTIVE completed"`);
  }

  //
  // Handle DELETESCRIPT command
  //
  async handleDeleteScript(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    const scriptName = this.parseString(args);
    if (!scriptName) {
      this.send(session, `${RESPONSE.NO} "Missing script name"`);
      return;
    }

    const script = await SieveScripts.findOne({
      alias: session.alias._id,
      name: scriptName
    });

    if (!script) {
      this.send(session, `${RESPONSE.NO} "Script not found"`);
      return;
    }

    if (script.is_active) {
      this.send(session, `${RESPONSE.NO} "Cannot delete active script"`);
      return;
    }

    await script.deleteOne();
    this.send(session, `${RESPONSE.OK} "DELETESCRIPT completed"`);
  }

  //
  // Handle RENAMESCRIPT command
  //
  async handleRenameScript(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    // Parse: "oldname" "newname"
    const match = args.match(/^"([^"]+)"\s+"([^"]+)"$/);
    if (!match) {
      this.send(session, `${RESPONSE.NO} "Invalid RENAMESCRIPT syntax"`);
      return;
    }

    const oldName = match[1];
    const newName = match[2];

    // Validate new name
    if (newName.length > this.maxScriptNameLength) {
      this.send(session, `${RESPONSE.NO} "New script name too long"`);
      return;
    }

    if (!/^[\w.+-]+$/.test(newName)) {
      this.send(
        session,
        `${RESPONSE.NO} "Invalid characters in new script name"`
      );
      return;
    }

    const script = await SieveScripts.findOne({
      alias: session.alias._id,
      name: oldName
    });

    if (!script) {
      this.send(session, `${RESPONSE.NO} "Script not found"`);
      return;
    }

    // Check if new name already exists
    const existing = await SieveScripts.findOne({
      alias: session.alias._id,
      name: newName
    });

    if (existing) {
      this.send(
        session,
        `${RESPONSE.NO} "Script with new name already exists"`
      );
      return;
    }

    script.name = newName;
    await script.save();

    this.send(session, `${RESPONSE.OK} "RENAMESCRIPT completed"`);
  }

  //
  // Handle CHECKSCRIPT command
  //
  async handleCheckScript(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    // Parse literal: {size+}
    const match = args.match(/^{(\d+)\+?}$/);
    if (!match) {
      this.send(session, `${RESPONSE.NO} "Invalid CHECKSCRIPT syntax"`);
      return;
    }

    const scriptSize = Number.parseInt(match[1], 10);

    if (scriptSize > this.maxScriptSize) {
      this.send(session, `${RESPONSE.NO} (QUOTA/MAXSIZE) "Script too large"`);
      return;
    }

    // Set up pending literal to read script content
    session.pendingLiteral = {
      size: scriptSize,
      callback: (content) => {
        // Validate script syntax
        try {
          const validation = validateSieve(content);
          if (!validation.valid) {
            throw new Error(validation.errors[0]?.message || 'Invalid script');
          }

          this.send(session, `${RESPONSE.OK} "Script is valid"`);
        } catch (err) {
          this.send(session, `${RESPONSE.NO} "Syntax error: ${err.message}"`);
        }
      }
    };

    // Try to process if data is already in buffer
    await this.processBuffer(session);
  }

  //
  // Handle HAVESPACE command
  //
  async handleHaveSpace(session, args) {
    if (!session.authenticated) {
      this.send(session, `${RESPONSE.NO} "Not authenticated"`);
      return;
    }

    // Parse: "scriptname" size
    const match = args.match(/^"([^"]+)"\s+(\d+)$/);
    if (!match) {
      this.send(session, `${RESPONSE.NO} "Invalid HAVESPACE syntax"`);
      return;
    }

    const scriptName = match[1];
    const scriptSize = Number.parseInt(match[2], 10);

    // Check size limit
    if (scriptSize > this.maxScriptSize) {
      this.send(
        session,
        `${RESPONSE.NO} (QUOTA/MAXSIZE) "Script too large (max ${this.maxScriptSize} bytes)"`
      );
      return;
    }

    // Check script count (only if this is a new script)
    const existingScript = await SieveScripts.findOne({
      alias: session.alias._id,
      name: scriptName
    });

    if (!existingScript) {
      const scriptCount = await SieveScripts.countDocuments({
        alias: session.alias._id
      });

      if (scriptCount >= this.maxScriptCount) {
        this.send(
          session,
          `${RESPONSE.NO} (QUOTA) "Maximum script count (${this.maxScriptCount}) reached"`
        );
        return;
      }
    }

    this.send(session, `${RESPONSE.OK} "Space available"`);
  }

  //
  // Send data to client
  //
  send(session, data) {
    try {
      session.socket.write(`${data}\r\n`);
    } catch (err) {
      this.logger.error(err, {
        component: 'ManageSieve',
        sessionId: session.id
      });
    }
  }

  //
  // Parse quoted string from arguments
  //
  parseString(args) {
    const match = args.match(/^"([^"]*)"$/);
    return match ? match[1] : null;
  }

  //
  // Escape string for ManageSieve protocol
  //
  escapeString(string_) {
    return string_.replaceAll('\\', '\\\\').replaceAll('"', String.raw`\"`);
  }
}

module.exports = ManageSieveServer;
