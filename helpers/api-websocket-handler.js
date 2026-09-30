/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const http = require('node:http');
const url = require('node:url');

const WebSocket = require('ws');
const basicAuth = require('basic-auth');
const ipaddr = require('ipaddr.js');
const ms = require('ms');
const safeStringify = require('fast-safe-stringify');

const Users = require('#models/users');
const config = require('#config');
const ensureApiTokenEnabled = require('#helpers/ensure-api-token-enabled');
const getAccessibleAliasId = require('#helpers/get-accessible-alias-id');
const getIpBucket = require('#helpers/get-ip-bucket');
const onAuth = require('#helpers/on-auth');
const { encoder, decoder } = require('#helpers/encoder-decoder');
const {
  CLOSE_CODE_REVOKED,
  getRedisTime,
  getSubjects,
  isRevokedSince
} = require('#helpers/credential-revocation');
const logger = require('#helpers/logger');
const {
  checkForNewMailAppRelease,
  POLL_INTERVAL: RELEASE_POLL_INTERVAL
} = require('#helpers/get-mail-app-releases');

const WS_PATH = '/v1/ws';

// published by every alias password rotation (IMAP, POP3 and SMTP close
// their sessions on it too)
const AUTH_RESET_CHANNEL = 'sqlite_auth_reset';

function httpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const OBJECT_ID_REGEX = /^[\da-f]{24}$/i;

// an email address, or an API token
const MAX_USERNAME_LENGTH = 320;
// the longest password the shared login accepts (helpers/on-auth.js)
const MAX_PASSWORD_LENGTH = 128;

function hasControlCharacters(value) {
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code < 0x20 || code === 0x7f) return true;
  }

  return false;
}

//
// The first message of a `?auth=message` connection:
//
//   {"event":"auth","username":"alias@example.com","password":"..."}
//   {"event":"auth","username":"<API token>","password":"","alias_id":"..."}
//
// Only a JSON text frame with exactly this shape is accepted (the frame size
// is capped by MAX_INCOMING_PAYLOAD); anything else closes the connection.
//
function parseAuthMessage(data, isBinary) {
  if (isBinary) return null;
  let message;
  try {
    message = JSON.parse(data.toString('utf8'));
  } catch {
    return null;
  }

  if (
    !message ||
    typeof message !== 'object' ||
    Array.isArray(message) ||
    message.event !== 'auth'
  )
    return null;

  const { username, password = '', alias_id: aliasId } = message;
  if (
    typeof username !== 'string' ||
    username.length === 0 ||
    username.length > MAX_USERNAME_LENGTH ||
    hasControlCharacters(username)
  )
    return null;
  if (typeof password !== 'string' || password.length > MAX_PASSWORD_LENGTH)
    return null;
  if (
    aliasId !== undefined &&
    (typeof aliasId !== 'string' || !OBJECT_ID_REGEX.test(aliasId))
  )
    return null;

  return { name: username, pass: password, aliasId };
}

//
// Close codes of a `?auth=message` connection (an HTTP status cannot be sent
// once the connection is open).  Clients do not retry 4400, 4401 and 4403.
//
const CLOSE_CODES = {
  400: 4400, // malformed first message
  401: 4401, // wrong credentials
  403: 4403, // the account or API token may not connect to this alias
  404: 4403, // (an alias the API token cannot reach is not disclosed)
  408: 4408, // no first message in time
  429: 4429 // too many connections or failed attempts; retry later
};
// anything else (database, Redis, shutdown): try again later
const CLOSE_CODE_TRY_AGAIN = 1013;

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

// `?auth=message` connections: the first message must arrive this soon (a
// client sends it as soon as the connection opens), and until it is checked
// the connection is only counted, never sent anything
const AUTH_MESSAGE_TIMEOUT_MS = ms('5s');
// waiting connections per IPv4 address or IPv6 /64, and per IPv6 /48 (one
// client can easily hold many /64s)
const MAX_PENDING_PER_IP = 5;
const MAX_PENDING_PER_IPV6_48 = 20;
// when all are taken, the oldest one that has not sent its first message
// yet is dropped for a new one
const MAX_PENDING_TOTAL = 1000;

// failed authentications (either way) per IP before further attempts are
// refused for the rest of the window; alias passwords are also limited by
// the shared login
const MAX_AUTH_FAILURES_PER_IP = 10;
const AUTH_FAILURE_WINDOW_MS = ms('10m');

// a closed connection whose client does not finish the close handshake
const CLOSE_GRACE_MS = ms('2s');
// (a connection that never authenticated is dropped sooner)
const PENDING_CLOSE_GRACE_MS = 500;

// the IPv6 /48 a /64 bucket belongs to (null for IPv4)
function getWideBucket(ip) {
  if (typeof ip !== 'string' || !ip.endsWith('::/64')) return null;
  return ip.split(':').slice(0, 3).join(':') + '::/48';
}

// With WS_TRUST_PROXY, the address the (one) trusted proxy in front of the
// API saw: the last X-Forwarded-For entry, which that proxy appended.  The
// first entries are whatever the client sent, so they are never used.
function getRemoteAddress(request) {
  const socketAddress = request.socket.remoteAddress;
  if (!config.WS_TRUST_PROXY) return socketAddress;
  const header = request.headers['x-forwarded-for'];
  if (typeof header !== 'string') return socketAddress;
  const last = header.split(',').at(-1).trim();
  return ipaddr.isValid(last) ? last : socketAddress;
}

class ApiWebSocketHandler {
  constructor(options = {}) {
    const { server, client, resolver, instance } = options;

    if (!server) throw new Error('HTTP server is required');
    if (!client) throw new Error('Redis client is required');

    this.server = server;
    this.client = client;
    this.resolver = resolver || null;
    // API server instance: alias credentials are checked with the same
    // login as the rest of the API (helpers/on-auth.js), which carries the
    // brute-force limits and the banned/disabled/rekey checks
    this.instance = instance || null;

    // Map<aliasId, Set<WebSocket>>
    this.clients = new Map();

    // Total connection count for global limit enforcement
    this.totalConnections = 0;

    // Unauthenticated connection tracking: Map<ip, Set<WebSocket>>
    // These clients only receive broadcast events (e.g. newRelease)
    this.unauthClients = new Map();

    // `?auth=message` connections waiting for their first message:
    // Map<ip, Set<WebSocket>> and the total across addresses
    this.pendingClients = new Map();
    this.pendingCount = 0;
    // Map<IPv6 /48, count> and all waiting connections, oldest first
    this.pendingWide = new Map();
    this.pendingQueue = new Set();
    this.authMessageTimeoutMs = AUTH_MESSAGE_TIMEOUT_MS;
    this.maxPendingTotal = MAX_PENDING_TOTAL;

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
    this.subscriber.subscribe(config.WS_REDIS_CHANNEL_NAME, AUTH_RESET_CHANNEL);
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
        // (not before a `?auth=message` connection is authenticated)
        if (ws.readyState === WebSocket.OPEN && !ws.pendingAuth) {
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
   * Fixed one-minute window shared across workers: the expiry is only set
   * when the window starts (refreshing it on every attempt would keep a
   * shared address that reconnects now and then locked out for good).
   *
   * @param {string} ip - Client IP address
   * @returns {Promise<boolean>} true if allowed, false if rate limited
   */
  async _checkRateLimit(ip) {
    try {
      const key = `ws_rate:${config.env}:${ip}`;
      const results = await this.client
        .multi()
        .set(key, 0, 'PX', RATE_LIMIT_TTL_MS, 'NX')
        .incr(key)
        .exec();

      // results is [[err, ok], [err, count]]
      const count = results?.[1]?.[1];
      if (typeof count !== 'number') return true;
      return count <= MAX_CONNECT_ATTEMPTS_PER_MINUTE;
    } catch (err) {
      logger.fatal(err);
      // Allow connection on Redis failure to avoid blocking all clients
      return true;
    }
  }

  /**
   * Failed authentications per IP (fixed window, shared across workers).
   * Redis errors do not block authentication (the shared login keeps its
   * own limits for alias passwords).
   */
  async _isAuthLocked(ip) {
    try {
      const count = await this.client.get(`ws_auth_fail:${config.env}:${ip}`);
      return Number(count) >= MAX_AUTH_FAILURES_PER_IP;
    } catch (err) {
      logger.fatal(err);
      return false;
    }
  }

  async _recordAuthFailure(ip) {
    try {
      const key = `ws_auth_fail:${config.env}:${ip}`;
      await this.client
        .multi()
        .set(key, 0, 'PX', AUTH_FAILURE_WINDOW_MS, 'NX')
        .incr(key)
        .exec();
    } catch (err) {
      logger.fatal(err);
    }
  }

  /**
   * Authenticate the WebSocket upgrade request using Basic Auth.
   * Supports both:
   *   1. API token auth (username=token, password empty) — requires alias_id query param
   *   2. Alias auth (username=alias@domain.com, password=generated_password)
   *
   * Both apply the same account checks as the rest of the API: API tokens
   * must be enabled, the email verified and the account not banned; alias
   * credentials go through the shared login (helpers/on-auth.js).
   *
   * @param {http.IncomingMessage} request
   * @param {string} remoteAddress
   * @returns {Promise<Object>} - { aliasId, subjects } on success
   */
  async _authenticate(request, remoteAddress) {
    // Authentication material must be supplied only through Authorization.
    // URLs are routinely retained in access logs, browser history, proxies,
    // metrics, and referrer chains, so accepting token or password query
    // parameters would disclose reusable credentials.
    const creds = basicAuth(request);
    if (!creds || !creds.name) throw httpError('Authentication required', 401);

    // For API token auth, the client must specify which alias to subscribe to
    const { query } = url.parse(request.url, true);
    return this._checkCredentials(
      { name: creds.name, pass: creds.pass, aliasId: query.alias_id },
      remoteAddress
    );
  }

  /**
   * Check credentials from the Authorization header or the first message.
   *
   * @param {Object} creds - { name, pass, aliasId }
   * @param {string} remoteAddress
   * @returns {Promise<Object>} - { aliasId, subjects } on success
   */
  async _checkCredentials(
    { name, pass, aliasId: requestedAliasId },
    remoteAddress
  ) {
    if (
      typeof name !== 'string' ||
      !name ||
      name.length > MAX_USERNAME_LENGTH ||
      (pass !== undefined && typeof pass !== 'string')
    )
      throw httpError('Invalid credentials', 401);

    //
    // Mode 1: API token auth (password is empty)
    //
    if (!pass) {
      const user = await Users.findOne({
        [config.userFields.apiToken]: name
      })
        .lean()
        .exec();

      if (!user) throw httpError('Invalid API token', 401);
      ensureApiTokenEnabled(user);
      if (!user[config.userFields.hasVerifiedEmail])
        throw httpError('Email verification required', 403);
      if (user[config.userFields.isBanned])
        throw httpError('Account banned', 403);

      if (
        typeof requestedAliasId !== 'string' ||
        !OBJECT_ID_REGEX.test(requestedAliasId)
      )
        throw httpError(
          'alias_id is required for API token authentication',
          400
        );

      // the alias must belong to the user or to a domain they administer
      const userId = user._id.toString();
      const aliasId = await getAccessibleAliasId(userId, requestedAliasId);
      if (!aliasId) throw httpError('Alias not found', 404);

      return {
        aliasId,
        subjects: getSubjects({
          aliasIds: [aliasId],
          accountIds: [userId],
          tokenIds: [userId]
        })
      };
    }

    //
    // Mode 2: Alias auth (username@domain.com:password)
    //
    if (!this.instance)
      throw httpError('Alias authentication unavailable', 503);

    let result;
    try {
      result = await new Promise((resolve, reject) => {
        onAuth.call(
          this.instance,
          { username: name, password: pass },
          { id: randomUUID(), remoteAddress },
          (err, value) => {
            if (err) reject(err);
            else resolve(value);
          }
        );
      });
    } catch (err) {
      // failed-attempt limits of the shared login are not wrong credentials
      if (err.isRateLimited) throw httpError('Too many attempts', 429);
      // on-auth leaves `response` unset for transient failures (database,
      // Redis, shutdown) so clients retry instead of prompting
      if (err.response !== 'NO') throw httpError('Service unavailable', 503);
      throw httpError('Invalid credentials', 401);
    }

    const user = result?.user;
    // credentials that do not name one alias (a domain-wide password)
    if (!user?.alias_id) throw httpError('Invalid credentials', 401);

    const aliasId = user.alias_id.toString();
    return {
      aliasId,
      subjects: getSubjects({
        aliasIds: [aliasId],
        accountIds: [user.alias_user_id]
      }),
      // when on-auth checked them (earlier than now for a cached login)
      authAt: Number.isSafeInteger(result.authAt) ? result.authAt : null
    };
  }

  // The earliest time the credentials behind a result were checked at.
  static _checkedSince(authStartedAt, result) {
    return Number.isSafeInteger(result?.authAt)
      ? Math.min(authStartedAt, result.authAt)
      : authStartedAt;
  }

  /**
   * Close a socket, and drop it if the client does not finish the close
   * handshake (so a closed connection cannot hold its slot).
   */
  _closeSocket(ws, code, reason) {
    if (ws.readyState === WebSocket.OPEN) ws.close(code, reason);
    const timer = setTimeout(
      () => {
        if (ws.readyState !== WebSocket.CLOSED) ws.terminate();
      },
      ws.pendingAuth ? PENDING_CLOSE_GRACE_MS : CLOSE_GRACE_MS
    );
    timer.unref?.();
  }

  /**
   * The first message of a `?auth=message` connection.  Exactly one attempt
   * per connection; nothing is sent to the client before it succeeds.
   */
  async _onAuthMessage(ws, data, isBinary) {
    ws.authAttempted = true;
    clearTimeout(ws.authTimer);

    const creds = parseAuthMessage(data, isBinary);
    if (!creds) {
      this._closeSocket(ws, CLOSE_CODES[400], 'Invalid authentication message');
      return;
    }

    // the check is bounded too, so a slow dependency cannot hold the slot
    ws.authTimer = setTimeout(() => {
      this._closeSocket(ws, CLOSE_CODE_TRY_AGAIN, 'Please try again');
    }, AUTH_TIMEOUT_MS);

    let result;
    let authStartedAt;
    try {
      if (await this._isAuthLocked(ws.ip))
        throw httpError('Too many failed attempts', 429);

      // the time the credentials are checked at (see _verifyNotRevoked)
      try {
        authStartedAt = await getRedisTime(this.client);
      } catch (err) {
        logger.error(err);
        throw httpError('Service unavailable', 503);
      }

      result = await this._checkCredentials(creds, ws.remoteAddress);
    } catch (err) {
      const statusCode = err.statusCode || 401;
      if ([401, 403, 404].includes(statusCode))
        await this._recordAuthFailure(ws.ip);
      logger.debug('WebSocket auth failed', { ip: ws.ip, error: err.message });
      this._closeSocket(
        ws,
        CLOSE_CODES[statusCode] || CLOSE_CODE_TRY_AGAIN,
        http.STATUS_CODES[statusCode] || 'Please try again'
      );
      return;
    } finally {
      clearTimeout(ws.authTimer);
    }

    // closed (by the client, a timeout or shutdown) while checking
    if (ws.readyState !== WebSocket.OPEN) return;

    // from here to the socket being registered is synchronous
    const existing = this.clients.get(result.aliasId);
    if (existing && existing.size >= MAX_CONNECTIONS_PER_ALIAS) {
      this._closeSocket(ws, CLOSE_CODES[429], 'Too many connections');
      return;
    }

    this._untrack(ws);
    ws.pendingAuth = false;
    ws.aliasId = result.aliasId;
    ws.subjects = result.subjects;
    ws.authStartedAt = ApiWebSocketHandler._checkedSince(authStartedAt, result);
    // no events until the revocation check passes
    ws.verified = false;
    this._track(ws);
    this._verifyNotRevoked(ws);
  }

  /**
   * Room for one more waiting connection: when all are taken, the oldest
   * one that has not sent its first message is dropped (a client sends it
   * as soon as the connection opens, so only an idle one is dropped).
   *
   * @returns {boolean} false when every waiting connection is being checked
   */
  _makePendingRoom() {
    if (this.pendingCount < this.maxPendingTotal) return true;
    for (const ws of this.pendingQueue) {
      if (ws.authAttempted) continue;
      clearTimeout(ws.authTimer);
      // untracked now so the slot is free right away
      this._untrack(ws);
      ws.authAttempted = true;
      ws.terminate();
      return true;
    }

    return false;
  }

  /**
   * Track a socket under its current state (authenticated, waiting for its
   * first message, or broadcast-only).
   */
  _track(ws) {
    let map;
    let key;
    if (ws.aliasId) {
      map = this.clients;
      key = ws.aliasId;
    } else if (ws.pendingAuth) {
      map = this.pendingClients;
      key = ws.ip;
      this.pendingCount++;
      this.pendingQueue.add(ws);
      const wide = getWideBucket(ws.ip);
      if (wide)
        this.pendingWide.set(wide, (this.pendingWide.get(wide) || 0) + 1);
    } else {
      map = this.unauthClients;
      key = ws.ip;
    }

    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(ws);
  }

  _untrack(ws) {
    let map;
    let key;
    if (ws.aliasId) {
      map = this.clients;
      key = ws.aliasId;
    } else if (ws.pendingAuth) {
      map = this.pendingClients;
      key = ws.ip;
    } else {
      map = this.unauthClients;
      key = ws.ip;
    }

    const set = map.get(key);
    if (!set || !set.delete(ws)) return;
    if (set.size === 0) map.delete(key);
    if (map === this.pendingClients) {
      this.pendingCount = Math.max(0, this.pendingCount - 1);
      this.pendingQueue.delete(ws);
      const wide = getWideBucket(ws.ip);
      if (wide) {
        const count = (this.pendingWide.get(wide) || 1) - 1;
        if (count > 0) this.pendingWide.set(wide, count);
        else this.pendingWide.delete(wide);
      }
    }
  }

  /**
   * Close the sockets whose credentials changed (a password or API token
   * change on this or another API server; see
   * helpers/credential-revocation.js).
   */
  _revoke({ subjects } = {}) {
    const revoked = new Set(Array.isArray(subjects) ? subjects : []);
    if (revoked.size === 0) return;

    for (const ws of this.wss.clients) {
      if (!ws.aliasId) continue;
      if (!(ws.subjects || []).some((subject) => revoked.has(subject)))
        continue;

      // stop delivery right away (the close handshake takes a moment)
      ws.verified = false;
      this._closeSocket(ws, CLOSE_CODE_REVOKED, 'Credentials changed');
    }
  }

  /**
   * A socket is registered before this runs, so a revocation published from
   * now on closes it (see _revoke); this closes it if the credentials were
   * changed after they were checked but before it was registered.  Events
   * and the `connected` event are only sent once it passes.
   */
  async _verifyNotRevoked(ws) {
    let revoked;
    try {
      revoked = await isRevokedSince(
        this.client,
        ws.subjects,
        ws.authStartedAt
      );
    } catch (err) {
      logger.error(err, { extra: { message: 'WebSocket revocation check' } });
      this._closeSocket(ws, 1011, 'Please reconnect');
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) return;
    if (revoked) {
      this._closeSocket(ws, CLOSE_CODE_REVOKED, 'Credentials changed');
      return;
    }

    ws.verified = true;
    this._send(ws, { event: 'connected', aliasId: ws.aliasId });
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
    const remoteAddress = getRemoteAddress(request);
    // per address, or per /64 for IPv6 (one client can hold a whole /64)
    const ip = getIpBucket(remoteAddress);

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

    // Query-string credentials are deliberately unsupported.  They leak into
    // routine request logging and browser history.  `alias_id`, `msgpackr`
    // and `auth` remain non-secret routing/format parameters.
    if (query.token || query.username || query.password) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
      return;
    }

    // If an Authorization header is supplied, authentication must succeed;
    // it must never fall through to the unauthenticated broadcast-only path.
    // (any Authorization header counts, so a malformed or non-Basic header
    // is refused with 401 instead of quietly connecting as broadcast-only)
    const hasCredentials = Boolean(request.headers.authorization);

    // `?auth=message`: browsers cannot set headers on a WebSocket handshake,
    // so they send the credentials as the first message instead
    const wantsMessageAuth = query.auth !== undefined;
    if (
      (wantsMessageAuth && query.auth !== 'message') ||
      (wantsMessageAuth && hasCredentials)
    ) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
      return;
    }

    if (wantsMessageAuth) {
      const pending = this.pendingClients.get(ip);
      const wide = getWideBucket(ip);
      if (
        (pending && pending.size >= MAX_PENDING_PER_IP) ||
        (wide &&
          (this.pendingWide.get(wide) || 0) >= MAX_PENDING_PER_IPV6_48) ||
        !this._makePendingRoom()
      ) {
        socket.write(
          'HTTP/1.1 429 Too Many Requests\r\nRetry-After: 60\r\n\r\n'
        );
        socket.destroy();
        return;
      }

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        ws.aliasId = null;
        ws.pendingAuth = true;
        ws.authAttempted = false;
        ws.ip = ip;
        ws.remoteAddress = remoteAddress;
        ws.connectedAt = Date.now();
        ws.isAlive = true;
        ws.useMsgpackr = query.msgpackr === 'true';
        this.wss.emit('connection', ws, request);
      });
      return;
    }

    if (hasCredentials) {
      // --- Authenticated path ---
      try {
        if (await this._isAuthLocked(ip))
          throw httpError('Too many failed attempts', 429);

        // the time the credentials are checked at (see _verifyNotRevoked)
        let authStartedAt;
        try {
          authStartedAt = await getRedisTime(this.client);
        } catch (err) {
          logger.error(err);
          throw httpError('Service unavailable', 503);
        }

        // Wrap authentication in a timeout to prevent hanging auth
        let authTimer;
        let result;
        try {
          result = await Promise.race([
            this._authenticate(request, remoteAddress),
            new Promise((_, reject) => {
              authTimer = setTimeout(() => {
                reject(httpError('Authentication timed out', 504));
              }, AUTH_TIMEOUT_MS);
            })
          ]);
        } catch (err) {
          if ([401, 403, 404].includes(err.statusCode || 401))
            await this._recordAuthFailure(ip);
          throw err;
        } finally {
          clearTimeout(authTimer);
        }

        const { aliasId, subjects } = result;

        // the client went away while authenticating
        if (socket.destroyed) return;

        // limits are checked again now that authentication is done (other
        // handshakes may have completed in the meantime); from here to the
        // socket being registered is synchronous
        if (this.totalConnections >= MAX_TOTAL_CONNECTIONS) {
          socket.write(
            'HTTP/1.1 503 Service Unavailable\r\nRetry-After: 60\r\n\r\n'
          );
          socket.destroy();
          return;
        }

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
          ws.subjects = subjects;
          ws.authStartedAt = ApiWebSocketHandler._checkedSince(
            authStartedAt,
            result
          );
          // no events until the revocation check passes
          ws.verified = false;
          ws.ip = ip;
          ws.connectedAt = Date.now();
          ws.isAlive = true;
          ws.useMsgpackr = query.msgpackr === 'true';
          this.wss.emit('connection', ws, request);
          this._verifyNotRevoked(ws);
        });
      } catch (err) {
        const statusCode = err.statusCode || 401;
        logger.debug('WebSocket auth failed', { ip, error: err.message });
        if (!socket.destroyed) {
          socket.write(
            `HTTP/1.1 ${statusCode} ${
              http.STATUS_CODES[statusCode] || 'Unauthorized'
            }\r\n\r\n`
          );
          socket.destroy();
        }
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
    this._track(ws);
    this.totalConnections++;

    // a `?auth=message` connection has this long to send its first message
    if (ws.pendingAuth) {
      ws.authTimer = setTimeout(() => {
        if (ws.pendingAuth && !ws.authAttempted)
          this._closeSocket(ws, CLOSE_CODES[408], 'Authentication timed out');
      }, this.authMessageTimeoutMs);
    }

    // Handle pong for keep-alive
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    //
    // Ignore all incoming data messages from clients, except the first
    // message of a `?auth=message` connection (its credentials).
    // This is a read-only notification channel — clients cannot publish,
    // send commands, or interact with the server beyond maintaining
    // the connection. Any other data frames are silently discarded.
    //
    ws.on('message', (data, isBinary) => {
      if (ws.pendingAuth && !ws.authAttempted)
        this._onAuthMessage(ws, data, isBinary).catch((err) => {
          logger.error(err, { extra: { message: 'WebSocket auth message' } });
          this._closeSocket(ws, CLOSE_CODE_TRY_AGAIN, 'Please try again');
        });
      // Anything else is intentionally ignored (and not logged, to prevent
      // log flooding from malicious clients).
    });

    // Handle close — clean up tracking (whatever state it is in by then)
    ws.on('close', () => {
      clearTimeout(ws.authTimer);
      this._untrack(ws);
      this.totalConnections = Math.max(0, this.totalConnections - 1);
    });

    // Handle errors
    ws.on('error', (err) => {
      logger.debug('WebSocket client error', {
        aliasId: ws.aliasId,
        error: err.message
      });
    });

    // Send a welcome event to broadcast-only clients; authenticated clients
    // get theirs (with their aliasId) from _verifyNotRevoked
    if (!ws.aliasId && !ws.pendingAuth) {
      this._send(ws, {
        event: 'connected',
        broadcastOnly: true
      });
    }
  }

  /**
   * Handle Redis pub/sub messages and fan out each per-alias event to active
   * WebSocket clients.
   *
   * `sendNotification` already started push delivery before publishing this
   * same immutable payload to Redis. This subscriber therefore owns only the
   * WebSocket half of dual delivery and cannot suppress, duplicate, or delay
   * push when an alias has zero connected sockets. Messages are msgpackr-
   * encoded Buffers and are forwarded using each client's preferred encoding.
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
    const name = channel.toString();

    // an alias password was rotated
    if (name === AUTH_RESET_CHANNEL) {
      const aliasId = message.toString();
      if (!/^[\da-f]{24}$/i.test(aliasId)) return;
      this._revoke({ subjects: getSubjects({ aliasIds: [aliasId] }) });
      onAuth.clearAuthCache(this.client, aliasId).catch((err) => {
        logger.debug('clearAuthCache error', { err });
      });
      return;
    }

    if (name !== config.WS_REDIS_CHANNEL_NAME) return;

    try {
      const decoded = decoder.unpack(message);
      if (decoded?.revoke) {
        this._revoke(decoded.revoke);
        return;
      }

      const { aliasId, payload, broadcast } = decoded;
      if (!payload) return;

      // Broadcast mode — send to every connected client
      if (broadcast) {
        for (const ws of this.wss.clients) {
          if (ws.pendingAuth || (ws.aliasId && !ws.verified)) continue;
          this._send(ws, payload);
        }

        return;
      }

      // Per-alias mode
      if (!aliasId) return;

      const aliasConnections = this.clients.get(aliasId);
      if (!aliasConnections || aliasConnections.size === 0) return;

      for (const ws of aliasConnections) {
        if (!ws.verified) continue;
        this._send(ws, payload);
      }
    } catch (err) {
      logger.error('Error processing realtime notification message', err);
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
      await this.subscriber.unsubscribe(
        config.WS_REDIS_CHANNEL_NAME,
        AUTH_RESET_CHANNEL
      );
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
    this.pendingClients.clear();
    this.pendingCount = 0;
  }
}

module.exports = ApiWebSocketHandler;
