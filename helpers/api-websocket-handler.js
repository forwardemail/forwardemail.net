/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const url = require('node:url');

const WebSocket = require('ws');
const basicAuth = require('basic-auth');
const ms = require('ms');
const safeStringify = require('fast-safe-stringify');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const isEmail = require('#helpers/is-email');
const isValidPassword = require('#helpers/is-valid-password');
const { encoder, decoder } = require('#helpers/encoder-decoder');
const logger = require('#helpers/logger');

const WS_PATH = '/v1/ws';

//
// Security constants
//

// Max connections per alias (prevents resource exhaustion)
const MAX_CONNECTIONS_PER_ALIAS = 10;

// Keep-alive interval (30s) — terminates dead connections
const KEEP_ALIVE_INTERVAL = ms('30s');

// Rate limit: max connection attempts per IP per minute
const MAX_CONNECT_ATTEMPTS_PER_MINUTE = 30;

// Maximum incoming frame size (1 KB) — clients should only send pong frames,
// not data; this prevents abuse via large payloads
const MAX_INCOMING_PAYLOAD = 1024;

// Maximum number of total concurrent connections across all aliases
const MAX_TOTAL_CONNECTIONS = 10000;

class ApiWebSocketHandler {
  constructor(options = {}) {
    const { server, client } = options;

    if (!server) throw new Error('HTTP server is required');
    if (!client) throw new Error('Redis client is required');

    this.server = server;
    this.client = client;

    // Map<aliasId, Set<WebSocket>>
    this.clients = new Map();

    // Total connection count for global limit enforcement
    this.totalConnections = 0;

    // Rate limit tracking: Map<ip, { count, resetAt }>
    this.connectAttempts = new Map();

    // Create WebSocket server with noServer mode and security limits
    this.wss = new WebSocket.WebSocketServer({
      noServer: true,
      maxPayload: MAX_INCOMING_PAYLOAD,
      // Disable per-message deflate to prevent CRIME/BREACH-style attacks
      // and reduce memory usage per connection
      perMessageDeflate: false
    });

    // Create a dedicated Redis subscriber for pub/sub
    this.subscriber = client.duplicate();
    this.subscriber.setMaxListeners(0);

    // Bind methods
    this._onUpgrade = this._onUpgrade.bind(this);
    this._onConnection = this._onConnection.bind(this);
    this._onSubscriberMessage = this._onSubscriberMessage.bind(this);

    // Set up event listeners
    this.server.on('upgrade', this._onUpgrade);
    this.wss.on('connection', this._onConnection);

    // Subscribe to WebSocket notification channel
    this.subscriber.subscribe(config.WS_REDIS_CHANNEL_NAME);
    // Use messageBuffer to receive binary msgpackr data from Redis
    this.subscriber.on('messageBuffer', this._onSubscriberMessage);

    // Keep-alive interval — terminates unresponsive connections
    this._keepAliveInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        if (ws.isAlive === false) {
          logger.debug('WebSocket keep-alive timeout, terminating', {
            aliasId: ws.aliasId
          });
          ws.terminate();
          continue;
        }

        ws.isAlive = false;
        ws.ping();
      }
    }, KEEP_ALIVE_INTERVAL);

    // Cleanup stale rate limit entries every minute
    this._cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [ip, data] of this.connectAttempts) {
        if (now >= data.resetAt) {
          this.connectAttempts.delete(ip);
        }
      }
    }, ms('1m'));
  }

  /**
   * Check rate limit for connection attempts.
   * Uses in-memory tracking per IP with a sliding window.
   *
   * @param {string} ip - Client IP address
   * @returns {boolean} true if allowed, false if rate limited
   */
  _checkRateLimit(ip) {
    const now = Date.now();
    const data = this.connectAttempts.get(ip);

    if (!data || now >= data.resetAt) {
      this.connectAttempts.set(ip, {
        count: 1,
        resetAt: now + ms('1m')
      });
      return true;
    }

    data.count++;
    if (data.count > MAX_CONNECT_ATTEMPTS_PER_MINUTE) {
      return false;
    }

    return true;
  }

  /**
   * Authenticate the WebSocket upgrade request using Basic Auth.
   * Supports both:
   *   1. API token auth (username=token, password empty) — requires alias_id query param
   *   2. Alias auth (username=alias@domain.com, password=generated_password)
   *
   * This mirrors the dual-auth pattern used across all API endpoints
   * (see helpers/ensure-api-token-or-alias-auth.js).
   *
   * @param {http.IncomingMessage} request
   * @returns {Promise<Object>} - { aliasId } on success
   */
  async _authenticate(request) {
    const creds = basicAuth(request);

    if (!creds || !creds.name) {
      const err = new Error('Authentication required');
      err.statusCode = 401;
      throw err;
    }

    //
    // Mode 1: API token auth (password is empty)
    //
    if (!creds.pass || creds.pass === '') {
      const user = await Users.findOne({
        [config.userFields.apiToken]: creds.name
      })
        .lean()
        .exec();

      if (!user) {
        const err = new Error('Invalid API token');
        err.statusCode = 401;
        throw err;
      }

      // For API token auth, the client must specify which alias to subscribe to
      const { query } = url.parse(request.url, true);
      if (!query.alias_id) {
        const err = new Error(
          'alias_id query parameter is required for API token authentication'
        );
        err.statusCode = 400;
        throw err;
      }

      // Verify the alias belongs to this user (direct ownership)
      const alias = await Aliases.findOne({
        id: query.alias_id,
        user: user._id
      })
        .lean()
        .exec();

      if (alias) {
        return { aliasId: alias.id.toString() };
      }

      // Fallback: check if user is a domain admin/member for this alias
      const aliasById = await Aliases.findOne({
        id: query.alias_id
      })
        .lean()
        .exec();

      if (!aliasById) {
        const err = new Error('Alias not found');
        err.statusCode = 404;
        throw err;
      }

      const domain = await Domains.findOne({
        _id: aliasById.domain,
        'members.user': user._id
      })
        .lean()
        .exec();

      if (!domain) {
        const err = new Error('Alias not found');
        err.statusCode = 404;
        throw err;
      }

      return { aliasId: aliasById.id.toString() };
    }

    //
    // Mode 2: Alias auth (username@domain.com:password)
    //
    if (!isEmail(creds.name)) {
      const err = new Error('Invalid alias email format');
      err.statusCode = 401;
      throw err;
    }

    const [name, domainName] = creds.name.split('@');

    const domain = await Domains.findOne({
      name: domainName,
      has_smtp: true
    })
      .lean()
      .exec();

    if (!domain) {
      const err = new Error('Domain not found');
      err.statusCode = 401;
      throw err;
    }

    const alias = await Aliases.findOne({
      name: name.toLowerCase(),
      domain: domain._id
    })
      .select('+tokens.hash +tokens.salt')
      .exec();

    if (!alias) {
      const err = new Error('Alias not found');
      err.statusCode = 401;
      throw err;
    }

    const isValid = await isValidPassword(alias.tokens, creds.pass);

    if (!isValid) {
      const err = new Error('Invalid password');
      err.statusCode = 401;
      throw err;
    }

    return { aliasId: alias.id.toString() };
  }

  /**
   * Handle HTTP upgrade requests.
   *
   * Security checks performed in order:
   *   1. Path validation (only /v1/ws)
   *   2. Global connection limit
   *   3. Per-IP rate limiting
   *   4. Authentication (API token or alias auth)
   *   5. Per-alias connection limit
   */
  async _onUpgrade(request, socket, head) {
    const { pathname, query } = url.parse(request.url, true);

    // Only handle upgrades for our WebSocket endpoint
    if (pathname !== WS_PATH) {
      return;
    }

    // Destroy socket on any error to prevent resource leaks
    socket.on('error', (err) => {
      logger.debug('WebSocket upgrade socket error', { error: err.message });
      socket.destroy();
    });

    // Get client IP (trust X-Forwarded-For behind reverse proxy)
    const ip =
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.socket.remoteAddress;

    // Check global connection limit
    if (this.totalConnections >= MAX_TOTAL_CONNECTIONS) {
      logger.warn('WebSocket global connection limit reached', {
        total: this.totalConnections
      });
      socket.write(
        'HTTP/1.1 503 Service Unavailable\r\nRetry-After: 60\r\n\r\n'
      );
      socket.destroy();
      return;
    }

    // Check per-IP rate limit for connection attempts
    if (!this._checkRateLimit(ip)) {
      logger.debug('WebSocket rate limited', { ip });
      socket.write('HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n');
      socket.destroy();
      return;
    }

    try {
      const { aliasId } = await this._authenticate(request);

      // Check max connections per alias
      const existing = this.clients.get(aliasId);
      if (existing && existing.size >= MAX_CONNECTIONS_PER_ALIAS) {
        logger.debug('WebSocket per-alias connection limit reached', {
          aliasId,
          count: existing.size
        });
        socket.write(
          'HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n'
        );
        socket.destroy();
        return;
      }

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        ws.aliasId = aliasId;
        ws.connectedAt = Date.now();
        ws.isAlive = true;
        // Store whether the client wants msgpackr binary frames
        ws.useMsgpackr = query.msgpackr === 'true';
        this.wss.emit('connection', ws, request);
      });
    } catch (err) {
      const statusCode = err.statusCode || 401;
      const message = err.message || 'Unauthorized';
      logger.debug('WebSocket auth failed', { ip, error: message });
      socket.write(
        `HTTP/1.1 ${statusCode} ${
          http.STATUS_CODES[statusCode] || message
        }\r\n\r\n`
      );
      socket.destroy();
    }
  }

  /**
   * Send a payload to a WebSocket client, respecting its encoding preference.
   *
   * @param {WebSocket} ws - The WebSocket client
   * @param {Object} payload - The payload object to send
   */
  _send(ws, payload) {
    if (ws.readyState !== WebSocket.OPEN) return;
    if (ws.useMsgpackr) {
      // Send binary msgpackr frame
      ws.send(encoder.pack(payload));
    } else {
      // Send JSON text frame
      ws.send(safeStringify(payload));
    }
  }

  /**
   * Handle new WebSocket connections.
   *
   * Security measures:
   *   - Clients are read-only subscribers; any incoming data messages are ignored
   *   - Connections are tracked per alias for targeted delivery
   *   - Keep-alive pong handling prevents stale connections
   */
  _onConnection(ws) {
    const { aliasId } = ws;

    // Track the connection
    if (!this.clients.has(aliasId)) {
      this.clients.set(aliasId, new Set());
    }

    this.clients.get(aliasId).add(ws);
    this.totalConnections++;

    // Handle pong for keep-alive
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    //
    // SECURITY: Ignore all incoming data messages from clients.
    // This is a read-only notification channel — clients cannot publish,
    // send commands, or interact with the server beyond maintaining
    // the connection. Any data frames received are silently discarded.
    //
    ws.on('message', () => {
      // Intentionally ignored — this is a server-to-client push channel only.
      // Logging is omitted to prevent log flooding from malicious clients.
    });

    // Handle close — clean up tracking
    ws.on('close', () => {
      const aliasConnections = this.clients.get(aliasId);
      if (aliasConnections) {
        aliasConnections.delete(ws);
        if (aliasConnections.size === 0) {
          this.clients.delete(aliasId);
        }
      }

      this.totalConnections = Math.max(0, this.totalConnections - 1);
    });

    // Handle errors
    ws.on('error', (err) => {
      logger.debug('WebSocket client error', { aliasId, error: err.message });
    });

    // Send a welcome/connected event so the client knows auth succeeded
    // and which alias this subscription is for
    this._send(ws, {
      event: 'connected',
      aliasId
    });
  }

  /**
   * Handle Redis pub/sub messages and broadcast to connected WebSocket clients.
   *
   * Messages are published to Redis as msgpackr-encoded Buffers for efficiency.
   * On receipt, the handler decodes the Buffer, extracts the aliasId, and
   * forwards the payload to each connected client using that client's
   * preferred encoding (msgpackr binary or JSON text).
   *
   * Only messages published to the WS_REDIS_CHANNEL_NAME channel are processed.
   * The aliasId in the payload determines which connected clients receive the message.
   * This ensures strict channel isolation — a client subscribed to alias A
   * will never receive notifications for alias B.
   *
   * @param {Buffer} channel - Redis channel name as Buffer
   * @param {Buffer} message - msgpackr-encoded message Buffer
   */
  _onSubscriberMessage(channel, message) {
    if (channel.toString() !== config.WS_REDIS_CHANNEL_NAME) return;

    try {
      const { aliasId, payload } = decoder.unpack(message);
      if (!aliasId || !payload) return;

      const aliasConnections = this.clients.get(aliasId);
      if (!aliasConnections || aliasConnections.size === 0) return;

      for (const ws of aliasConnections) {
        this._send(ws, payload);
      }
    } catch (err) {
      logger.error('Error processing WebSocket broadcast message', err);
    }
  }

  /**
   * Reset rate limit tracking (useful for testing).
   */
  resetRateLimits() {
    this.connectAttempts.clear();
  }

  /**
   * Gracefully close all connections and clean up resources.
   */
  async close() {
    clearInterval(this._keepAliveInterval);
    clearInterval(this._cleanupInterval);

    // Send a close frame to all connected clients before terminating
    for (const ws of this.wss.clients) {
      try {
        ws.close(1001, 'Server shutting down');
      } catch {
        ws.terminate();
      }
    }

    // Unsubscribe and disconnect the Redis subscriber
    try {
      await this.subscriber.unsubscribe(config.WS_REDIS_CHANNEL_NAME);
      this.subscriber.disconnect();
    } catch (err) {
      logger.debug('Error closing WebSocket subscriber', err);
    }

    // Remove the upgrade listener from the HTTP server
    this.server.removeListener('upgrade', this._onUpgrade);

    // Close the WebSocket server
    await new Promise((resolve) => {
      this.wss.close(resolve);
    });

    this.totalConnections = 0;
    this.clients.clear();
  }
}

module.exports = ApiWebSocketHandler;
