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
const {
  checkForNewMailAppRelease,
  POLL_INTERVAL: RELEASE_POLL_INTERVAL
} = require('#helpers/get-mail-app-releases');

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

// Rate limit TTL in milliseconds (60s window)
const RATE_LIMIT_TTL_MS = 60_000;

// Maximum incoming frame size (1 KB) — clients should only send pong frames,
// not data; this prevents abuse via large payloads
const MAX_INCOMING_PAYLOAD = 1024;

// Maximum number of total concurrent connections across all aliases
const MAX_TOTAL_CONNECTIONS = 10000;

// Max unauthenticated connections per IP (prevents abuse from anonymous clients
// that only receive broadcast events like newRelease)
const MAX_UNAUTHENTICATED_PER_IP = 3;

// Maximum outbound send buffer before terminating slow consumers (1 MB)
const MAX_SEND_BUFFER = 1024 * 1024;

// Authentication timeout (prevents hanging auth from blocking resources)
const AUTH_TIMEOUT_MS = ms('10s');

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

    // Unauthenticated connection tracking: Map<ip, Set<WebSocket>>
    // These clients only receive broadcast events (e.g. newRelease)
    this.unauthClients = new Map();

    // Pre-serialize ping payloads to avoid re-encoding per client
    this._pingJsonFrame = safeStringify({ event: 'ping' });
    this._pingMsgpackFrame = encoder.pack({ event: 'ping' });

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
    // Uses pre-serialized ping frames and inline backpressure checks
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
        // Protocol-level ping for server-side dead-connection detection
        ws.ping();
        // Application-level ping for browser clients using pre-serialized frames
        if (ws.readyState === WebSocket.OPEN) {
          if (ws.bufferedAmount >= MAX_SEND_BUFFER) {
            logger.debug('WebSocket slow consumer on ping, terminating', {
              aliasId: ws.aliasId
            });
            ws.terminate();
            continue;
          }

          ws.send(
            ws.useMsgpackr ? this._pingMsgpackFrame : this._pingJsonFrame
          );
        }
      }
    }, KEEP_ALIVE_INTERVAL);

    //
    // Mail app release poller
    // Polls GitHub releases for forwardemail/mail.forwardemail.net every
    // RELEASE_POLL_INTERVAL (default 15m).  When a new release is detected,
    // a `newRelease` event is broadcast to ALL connected WebSocket clients.
    // This enables push notifications for app updates on Android, iOS,
    // webmail, and desktop clients.
    //
    this._releasePollerInterval = setInterval(() => {
      this._pollForNewRelease();
    }, RELEASE_POLL_INTERVAL);

    // Run the first check shortly after startup (5 s delay to let
    // connections establish and Redis become ready)
    this._releasePollerTimeout = setTimeout(() => {
      this._pollForNewRelease();
    }, ms('5s'));
  }

  /**
   * Check rate limit for connection attempts using Redis.
   * Uses pipeline().incr().pexpire().exec() for atomic, cross-worker counting.
   *
   * @param {string} ip - Client IP address
   * @returns {Promise<boolean>} true if allowed, false if rate limited
   */
  async _checkRateLimit(ip) {
    const key = `ws_rate:${config.env}:${ip}`;
    const results = await this.client
      .pipeline()
      .incr(key)
      .pexpire(key, RATE_LIMIT_TTL_MS)
      .exec();

    // results is [[err, count], [err, ok]]
    const count = results[0][1];
    return count <= MAX_CONNECT_ATTEMPTS_PER_MINUTE;
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
    // Prefer the standard Authorization header, but fall back to query
    // parameters for browser WebSocket clients that cannot set custom
    // headers on the upgrade request.
    let creds = basicAuth(request);

    if (!creds || !creds.name) {
      const { query } = url.parse(request.url, true);
      if (query.username) {
        creds = { name: query.username, pass: query.password || '' };
      } else if (query.token) {
        // API token via query param (password-less; alias_id required)
        creds = { name: query.token, pass: '' };
      }
    }

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
   * Authentication is optional.  When credentials are provided the client
   * is authenticated and receives both per-alias events and broadcast
   * events.  When no credentials are provided the connection is still
   * accepted but the client only receives broadcast events (e.g.
   * `newRelease`).  All other security measures (rate limiting,
   * connection caps, keep-alive, read-only channel) apply equally to
   * both authenticated and unauthenticated clients.
   *
   * Security checks performed in order:
   *   1. Path validation (only /v1/ws)
   *   2. Global connection limit
   *   3. Per-IP rate limiting (Redis-backed, shared across workers)
   *   4. Authentication (optional — API token or alias auth, with timeout)
   *   5. Per-alias connection limit (authenticated) or per-IP
   *      unauthenticated connection limit
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

    // Get client IP — only trust X-Forwarded-For when WS_TRUST_PROXY is enabled
    const ip = config.WS_TRUST_PROXY
      ? request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        request.socket.remoteAddress
      : request.socket.remoteAddress;

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

    // Check per-IP rate limit for connection attempts (Redis-backed)
    if (!(await this._checkRateLimit(ip))) {
      logger.debug('WebSocket rate limited', { ip });
      socket.write('HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n');
      socket.destroy();
      return;
    }

    // Determine whether the client supplied credentials
    const creds = basicAuth(request);
    // If the client sent an Authorization header (or token/username query
    // params) we treat it as an authenticated request.  If auth fails the
    // client receives a 401 — it does NOT fall through to the
    // unauthenticated broadcast-only path.
    const hasCredentials = Boolean(
      (creds && creds.name) || query.token || query.username
    );

    if (hasCredentials) {
      // --- Authenticated path ---
      try {
        // Wrap authentication in a timeout to prevent hanging auth
        let authTimer;
        const { aliasId } = await Promise.race([
          this._authenticate(request),
          new Promise((_, reject) => {
            authTimer = setTimeout(() => {
              const err = new Error('Authentication timed out');
              err.statusCode = 504;
              reject(err);
            }, AUTH_TIMEOUT_MS);
          })
        ]).finally(() => {
          clearTimeout(authTimer);
        });

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
          ws.ip = ip;
          ws.connectedAt = Date.now();
          ws.isAlive = true;
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
    } else {
      // --- Unauthenticated path (broadcast-only) ---
      // Enforce per-IP limit for unauthenticated connections
      const existing = this.unauthClients.get(ip);
      if (existing && existing.size >= MAX_UNAUTHENTICATED_PER_IP) {
        logger.debug('WebSocket per-IP unauthenticated limit reached', {
          ip,
          count: existing.size
        });
        socket.write(
          'HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n'
        );
        socket.destroy();
        return;
      }

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        // No aliasId — this client only receives broadcast events
        ws.aliasId = null;
        ws.ip = ip;
        ws.connectedAt = Date.now();
        ws.isAlive = true;
        ws.useMsgpackr = query.msgpackr === 'true';
        this.wss.emit('connection', ws, request);
      });
    }
  }

  /**
   * Send a payload to a WebSocket client, respecting its encoding preference.
   * Terminates slow consumers whose send buffer exceeds MAX_SEND_BUFFER.
   *
   * @param {WebSocket} ws - The WebSocket client
   * @param {Object} payload - The payload object to send
   */
  _send(ws, payload) {
    if (ws.readyState !== WebSocket.OPEN) return;

    // Backpressure: evict slow consumers before they exhaust server memory
    if (ws.bufferedAmount >= MAX_SEND_BUFFER) {
      logger.debug('WebSocket slow consumer, terminating', {
        aliasId: ws.aliasId,
        bufferedAmount: ws.bufferedAmount
      });
      ws.terminate();
      return;
    }

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
   *   - Authenticated connections are tracked per alias for targeted delivery
   *   - Unauthenticated connections are tracked per IP for limit enforcement
   *   - Keep-alive pong handling prevents stale connections
   */
  _onConnection(ws) {
    const { aliasId, ip } = ws;

    if (aliasId) {
      // Authenticated client — track per alias
      if (!this.clients.has(aliasId)) {
        this.clients.set(aliasId, new Set());
      }

      this.clients.get(aliasId).add(ws);
    } else {
      // Unauthenticated client — track per IP
      if (!this.unauthClients.has(ip)) {
        this.unauthClients.set(ip, new Set());
      }

      this.unauthClients.get(ip).add(ws);
    }

    this.totalConnections++;

    // Handle pong for keep-alive
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    //
    // Ignore all incoming data messages from clients.
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
      if (aliasId) {
        const aliasConnections = this.clients.get(aliasId);
        if (aliasConnections) {
          aliasConnections.delete(ws);
          if (aliasConnections.size === 0) {
            this.clients.delete(aliasId);
          }
        }
      } else if (ip) {
        const ipConnections = this.unauthClients.get(ip);
        if (ipConnections) {
          ipConnections.delete(ws);
          if (ipConnections.size === 0) {
            this.unauthClients.delete(ip);
          }
        }
      }

      this.totalConnections = Math.max(0, this.totalConnections - 1);
    });

    // Handle errors
    ws.on('error', (err) => {
      logger.debug('WebSocket client error', { aliasId, error: err.message });
    });

    // Send a welcome event
    // Authenticated clients receive their aliasId; unauthenticated clients
    // receive a confirmation that they are connected in broadcast-only mode
    if (aliasId) {
      this._send(ws, {
        event: 'connected',
        aliasId
      });
    } else {
      this._send(ws, {
        event: 'connected',
        broadcastOnly: true
      });
    }
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
   *
   * Two delivery modes are supported:
   *   1. **Per-alias** (default): The `aliasId` in the payload determines which
   *      connected clients receive the message.  This ensures strict channel
   *      isolation — a client subscribed to alias A will never receive
   *      notifications for alias B.
   *   2. **Broadcast**: When `broadcast` is `true` in the payload, the message
   *      is sent to ALL connected clients regardless of alias.  This is used
   *      for global events such as `newRelease`.
   *
   * @param {Buffer} channel - Redis channel name as Buffer
   * @param {Buffer} message - msgpackr-encoded message Buffer
   */
  _onSubscriberMessage(channel, message) {
    if (channel.toString() !== config.WS_REDIS_CHANNEL_NAME) return;

    try {
      const decoded = decoder.unpack(message);
      const { aliasId, payload, broadcast } = decoded;
      if (!payload) return;

      // Broadcast mode — send to every connected client
      if (broadcast) {
        for (const ws of this.wss.clients) {
          this._send(ws, payload);
        }

        return;
      }

      // Per-alias mode
      if (!aliasId) return;

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
   * Broadcast a payload to ALL connected WebSocket clients via Redis pub/sub.
   * Used for global events that are not scoped to a single alias
   * (e.g. `newRelease`).
   *
   * @param {Object} payload - The payload object to broadcast
   */
  _broadcast(payload) {
    try {
      const packed = encoder.pack({
        broadcast: true,
        payload
      });
      this.client.publishBuffer(config.WS_REDIS_CHANNEL_NAME, packed);
    } catch (err) {
      logger.error('Error broadcasting WebSocket message', err);
    }
  }

  /**
   * Poll GitHub for new releases of the mail app
   * (https://github.com/forwardemail/mail.forwardemail.net).
   * If a new release is detected, broadcast a `newRelease` event to all
   * connected WebSocket clients.
   */
  async _pollForNewRelease() {
    try {
      const release = await checkForNewMailAppRelease({
        client: this.client
      });

      if (!release) return;

      logger.info(`Broadcasting newRelease event: ${release.tagName}`);

      this._broadcast({
        event: 'newRelease',
        timestamp: Date.now(),
        release: {
          tagName: release.tagName,
          name: release.name,
          body: release.body,
          htmlUrl: release.htmlUrl,
          prerelease: release.prerelease,
          publishedAt: release.publishedAt,
          author: release.author,
          assets: release.assets
        }
      });
    } catch (err) {
      logger.error(err, {
        extra: { message: 'Failed to poll for new mail app release' }
      });
    }
  }

  /**
   * Gracefully close all connections and clean up resources.
   */
  async close() {
    clearInterval(this._keepAliveInterval);
    clearInterval(this._releasePollerInterval);
    clearTimeout(this._releasePollerTimeout);

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
    this.unauthClients.clear();
  }
}

module.exports = ApiWebSocketHandler;
