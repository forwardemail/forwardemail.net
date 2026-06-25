/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Channel = require('chnl');
// <https://github.com/pladaria/reconnecting-websocket/issues/195>
const ReconnectingWebSocket = require('@opensumi/reconnecting-websocket');
const WebSocketAsPromised = require('websocket-as-promised');
const mongoose = require('mongoose');
const ms = require('ms');
const pRetry = require('p-retry');
const pWaitFor = require('p-wait-for');
const revHash = require('rev-hash');
const { WebSocket } = require('ws');

const config = require('#config');
const env = require('#config/env');
const isRetryableError = require('#helpers/is-retryable-error');
const isTimeoutError = require('#helpers/is-timeout-error');
const logger = require('#helpers/logger');
const parseError = require('#helpers/parse-error');
const parseSqlitePortRange = require('#helpers/parse-sqlite-port-range');
const recursivelyParse = require('#helpers/recursively-parse');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { encoder, decoder } = require('#helpers/encoder-decoder');

const DEFAULT = {
  maxReconnectionDelay: 3000,
  minReconnectionDelay: 500, // 1000 + Math.random() * 4000,
  minUptime: 1000,
  reconnectionDelayGrowFactor: 1, // 1.3,
  connectionTimeout: 5000,
  maxRetries: Number.POSITIVE_INFINITY,
  maxEnqueuedMessages: Number.POSITIVE_INFINITY,
  startClosed: false,
  debug: !env.AXE_SILENT
};

// <https://github.com/vitalets/websocket-as-promised/pull/49>
WebSocketAsPromised.prototype._handleClose = function (event) {
  try {
    this._onClose.dispatchAsync(event);
    this._closing.resolve(event);
    const error = new Error(
      `WebSocket closed with reason: ${event.reason || event.message} (${
        event.code
      }).`
    );
    if (this._opening.isPending) {
      this._opening.reject(error);
    }

    this._cleanup(error);
  } catch (err) {
    console.error(
      '[ERROR:wsp-client] handleClose error',
      JSON.stringify({
        errName: err?.name,
        errMessage: err?.message?.slice(0, 500),
        eventCode: event?.code,
        eventReason: event?.reason
      })
    );
    logger.fatal(err, { event });
  }
};

// override to support @opensumi/reconnecting-websockets used under the hood
WebSocketAsPromised.prototype._createWS = function () {
  try {
    if (this._ws) {
      this._ws.reconnect();
    } else {
      this._ws = this._options.createWebSocket(this._url);
      this._wsSubscription = new Channel.Subscription([
        {
          channel: this._ws,
          event: 'open',
          listener: (e) => this._handleOpen(e)
        },
        {
          channel: this._ws,
          event: 'message',
          listener: (e) => this._handleMessage(e)
        },
        {
          channel: this._ws,
          event: 'error',
          listener: (e) => this._handleError(e)
        },
        {
          channel: this._ws,
          event: 'close',
          listener: (e) => this._handleClose(e)
        }
      ]).on();
    }
  } catch (err) {
    logger.fatal(err);
  }
};

// since we're using reconnecting websockets we shouldn't destroy the websocket but reconnect it
WebSocketAsPromised.prototype._cleanupWS = function () {
  // do nothing
};

// <https://github.com/vitalets/websocket-as-promised/issues/47>
// <https://github.com/pladaria/reconnecting-websocket/issues/198>
function handleError(event) {
  try {
    this._debug('error event', event.message);
    //
    // Transport-level error from the underlying (reconnecting) WebSocket.
    // This is where low-level connect/TLS failures surface: ECONNREFUSED
    // (nothing listening / firewall drop), ETIMEDOUT, UNABLE_TO_VERIFY_LEAF_SIGNATURE
    // / ERR_TLS_CERT_ALTNAME_INVALID (cert/host mismatch), etc.
    //
    console.error(
      '[ERROR:sqlite-client] ws transport error',
      JSON.stringify({
        url: this.url || this._url,
        errName: event?.error?.name || event?.name,
        errMessage: (event?.error?.message || event?.message || '')?.slice(
          0,
          500
        ),
        errCode: event?.error?.code || event?.code
      })
    );
    // this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
    this._disconnect(
      undefined,
      event.message === 'TIMEOUT' ? 'timeout' : event.message
    );
    if (this.onerror) {
      this.onerror(event);
    }

    this._debug('exec error listeners');
    // eslint-disable-next-line unicorn/no-array-for-each
    this._listeners.error.forEach((listener) =>
      this._callEventListener(event, listener)
    );
    if (this._shouldReconnect) {
      this._connect();
    }
  } catch (err) {
    console.error(
      '[ERROR:wsp-client] handleError error',
      JSON.stringify({
        errName: err?.name,
        errMessage: err?.message?.slice(0, 500),
        eventMessage: event?.message
      })
    );
    logger.fatal(err, { event });
  }
}

// <https://github.com/pladaria/reconnecting-websocket/issues/197>
function disconnect(code, reason) {
  try {
    if (code === undefined) {
      code = 1000;
    }

    this._clearTimeouts();
    if (!this._ws) {
      return;
    }

    this._removeListeners();
    // Attach a no-op error handler to prevent uncaught exceptions
    // from in-flight connection attempts after listeners are removed
    this._ws.addEventListener('error', () => {});
    // Close the underlying WebSocket in any state (including CONNECTING)
    // to ensure in-flight connection attempts are aborted
    try {
      this._ws.close(code, reason);
    } catch {}

    this._handleClose(new CloseEvent(code, reason, this));
  } catch (err) {
    logger.fatal(err);
  }
}

// <https://github.com/pladaria/reconnecting-websocket/issues/199>
function _getNextDelay() {
  const {
    reconnectionDelayGrowFactor = DEFAULT.reconnectionDelayGrowFactor,
    minReconnectionDelay = DEFAULT.minReconnectionDelay,
    maxReconnectionDelay = DEFAULT.maxReconnectionDelay
  } = this._options;
  let delay = 0;
  if (this._retryCount > 0) {
    delay =
      minReconnectionDelay *
      reconnectionDelayGrowFactor ** (this._retryCount - 1);
    if (delay > maxReconnectionDelay) {
      delay = maxReconnectionDelay;
    }
  } else {
    // -1 `_retryCount` indicates it's reconnecting so wait
    delay = 1000;
  }

  this._debug('next delay', delay);
  return delay;
}

ReconnectingWebSocket.prototype._debug = () => {};
// ReconnectingWebSocket.prototype._debug = (...args) => {
// logger.debug(...args);
// if (config.env === 'development')
//   logger.debug('reconnectingwebsocket', { args });

// <https://github.com/partykit/partykit/tree/main/packages/partysocket>
// <https://github.com/partykit/partykit/issues/536>
// const partysocket = require('partysocket');
// partysocket.WebSocket.prototype._debug = (...args) =>
//   logger.debug('partysocket', { args });

class Event {
  constructor(type, target) {
    this.target = target;
    this.type = type;
  }
}

class CloseEvent extends Event {
  constructor(code = 1000, reason = '', target) {
    super('close', target);
    this.code = code;
    this.reason = reason;
  }
}

// <https://github.com/pladaria/reconnecting-websocket/issues/138#issuecomment-698206018>
function createWebSocketClass(options) {
  return class extends WebSocket {
    constructor(url, protocols) {
      super(url, protocols, options);
    }
  };
}

async function sendRequest(wsp, requestId, data) {
  data.sent_at = Date.now();

  if (!wsp.isOpened) {
    try {
      await pWaitFor(
        async () => {
          try {
            await wsp.open();
            return true;
          } catch (err) {
            console.error(
              '[ERROR:sqlite-client] wsp.open() failed (will retry)',
              JSON.stringify({
                errName: err?.name,
                errMessage: (err?.message || String(err))?.slice(0, 500),
                errCode: err?.code
              })
            );
            logger.fatal(err);
            return false;
          }
        },
        {
          timeout: ms('15s')
        }
      );
    } catch (err) {
      // pWaitFor timed out: the worker never opened within 15s. This is the
      // classic symptom of an unreachable/blocked worker port or a rejected
      // TLS handshake — log loudly before rethrowing.
      console.error(
        '[ERROR:sqlite-client] wsp.open() timed out after 15s',
        JSON.stringify({
          errName: err?.name,
          errMessage: (err?.message || String(err))?.slice(0, 500)
        })
      );
      throw err;
    }
  }

  const result = await wsp.sendRequest(data, {
    timeout:
      typeof data.timeout === 'number' &&
      Number.isFinite(data.timeout) &&
      data.timeout > 0
        ? data.timeout
        : config.env === 'production'
        ? ms('1m')
        : config.env === 'test'
        ? ms('1m')
        : ms('10s'),
    requestId
  });

  if (result?.err) throw parseError(result.err);

  return result;
}

//
// Simple FNV-1a hash for consistent worker routing.
// Returns a non-negative 32-bit integer.
//
function fnv1aHash(str) {
  let hash = 2_166_136_261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise, unicorn/prefer-code-point
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16_777_619); // FNV prime
  }

  // eslint-disable-next-line no-bitwise
  return hash >>> 0; // ensure unsigned
}

//
// Create a single WebSocketAsPromised instance connected to a specific URL.
//
function createSingleWsp(url, auth, workerIndex) {
  // protocol is the scheme of the URL (ws: or wss:) for diagnostic logging
  const protocol = url.startsWith('wss') ? 'wss' : 'ws';
  const wsp = new WebSocketAsPromised(url, {
    createWebSocket() {
      logger.info('creating url', { url });
      const rws = new ReconnectingWebSocket(url, [], {
        WebSocket: createWebSocketClass({
          maxPayload: 0, // disable max payload size
          auth,
          rejectUnauthorized: config.env !== 'production',
          perMessageDeflate: false
        }),
        ...DEFAULT
      });

      // bind overriden prototype functions until PR's merged
      rws._handleError = handleError.bind(rws);
      rws._disconnect = disconnect.bind(rws);
      rws._getNextDelay = _getNextDelay.bind(rws);

      return rws;
    },
    packMessage: (data) => encoder.pack(data),
    unpackMessage: (data) => decoder.unpack(data),
    attachRequestId(data, id) {
      return {
        id,
        ...data
      };
    },
    extractRequestId(data) {
      return data && data.id;
    }
  });

  // bind event listeners
  for (const event of ['onError']) {
    wsp[event].addListener((...args) => {
      logger.debug(event, { args });
    });
  }

  //
  // Rich connection diagnostics for both ws and wss pool members. These make
  // open/close/error states visible per worker (url + index + protocol) so a
  // failing handshake (TLS cert/host mismatch, ECONNREFUSED, firewall drop,
  // auth 401) can be diagnosed directly from the logs.
  //
  wsp.onError.addListener((err) => {
    console.error(
      '[ERROR:sqlite-client] wsp error',
      JSON.stringify({
        url,
        workerIndex,
        protocol,
        errName: err?.name,
        errMessage: (err?.message || String(err))?.slice(0, 500),
        errCode: err?.code
      })
    );
  });

  wsp.onOpen.addListener(() => {
    console.log(
      '[INFO:sqlite-client] wsp open',
      JSON.stringify({ url, workerIndex, protocol })
    );
  });

  wsp.onClose.addListener((event) => {
    console.error(
      '[ERROR:sqlite-client] wsp close',
      JSON.stringify({
        url,
        workerIndex,
        protocol,
        code: event?.code,
        reason:
          typeof event?.reason === 'string'
            ? event.reason.slice(0, 200)
            : undefined,
        wasClean: event?.wasClean
      })
    );
  });

  wsp.onOpen.addListener(() => {
    if (!wsp._interval) {
      wsp._interval = setInterval(() => {
        try {
          wsp._ws._ws.ping();
        } catch (err) {
          logger.warn(err);
        }
      }, ms('5s'));
    }
  });

  wsp.onClose.addListener(() => {
    if (wsp._interval) {
      clearInterval(wsp._interval);
      wsp._interval = null;
    }
  });

  return wsp;
}

function createWebSocketAsPromised(options = {}) {
  const protocol =
    options.protocol || (config.env === 'production' ? 'wss' : 'ws');

  const auth = `${encrypt(
    Array.isArray(env.API_SECRETS) ? env.API_SECRETS[0] : env.API_SECRETS
  )}:`;
  const host = options.host || env.SQLITE_HOST;

  //
  // Derive the base port and worker count from a SINGLE source of truth:
  // SQLITE_PORT_RANGE (e.g. "3456:3465"), matching the SQLite server
  // (sqlite.js) and the UFW allowlist. Using SQLITE_PORT here instead would
  // silently diverge from the firewall/listeners when the two differ
  // (e.g. legacy SQLITE_PORT=2483 vs SQLITE_PORT_RANGE=3456:3465).
  //
  // When an explicit port is provided (e.g. tests), honor it and default to a
  // single worker unless workerCount is also explicitly provided.
  //
  let basePort;
  let workerCount;
  if (options.port) {
    basePort = Number.parseInt(options.port, 10);
    workerCount = Number.parseInt(options.workerCount || '1', 10);
  } else {
    const range = parseSqlitePortRange();
    basePort = range.basePort;
    workerCount = Number.parseInt(options.workerCount || range.workerCount, 10);
  }

  //
  // Create a pool of WebSocket connections — one per SQLite worker.
  // Each worker listens on basePort + instanceId (0, 1, 2, ...).
  //
  const pool = [];
  for (let i = 0; i < workerCount; i++) {
    const port = basePort + i;
    const url = `${protocol}://${host}:${port}`;
    logger.info('creating wsp pool member', { url, index: i, workerCount });
    console.log(
      '[INFO:sqlite-client] pool member created',
      JSON.stringify({ url, host, port, workerIndex: i, workerCount, protocol })
    );
    const member = createSingleWsp(url, auth, i);
    // stamp routing metadata so request-time logs can show the exact
    // client->server target (host:port/index) for each connection
    member._routeUrl = url;
    member._routeHost = host;
    member._routePort = port;
    member._routeIndex = i;
    pool.push(member);
  }

  //
  // Only the range workers participate in consistent-hashing affinity and
  // round-robin. The optional legacy member (below) is appended AFTER this
  // count so it never alters alias->worker affinity or receives primary load;
  // it is used exclusively as a fallback connection (see getWorkerForAlias).
  //
  const routingCount = pool.length;

  //
  // Backward-compatibility for rolling deploys: when SQLITE_LEGACY_PORT_ENABLED
  // is true and the legacy single SQLITE_PORT is OUTSIDE the range, add one
  // extra pool member pointing at the legacy port (where worker instance 0 also
  // listens). This lets clients still reach a live worker on the old endpoint
  // while the fleet migrates, without disturbing steady-state routing.
  //
  const legacyPort = Number.parseInt(env.SQLITE_PORT, 10);
  const legacyEnabled =
    !options.port && Boolean(env.SQLITE_LEGACY_PORT_ENABLED);
  const legacyInRange =
    Number.isInteger(legacyPort) &&
    legacyPort >= basePort &&
    legacyPort <= basePort + workerCount - 1;
  if (legacyEnabled && Number.isInteger(legacyPort) && !legacyInRange) {
    const legacyUrl = `${protocol}://${host}:${legacyPort}`;
    const legacyIndex = pool.length;
    logger.info('creating wsp legacy pool member', {
      url: legacyUrl,
      index: legacyIndex
    });
    console.log(
      '[INFO:sqlite-client] legacy pool member created',
      JSON.stringify({
        url: legacyUrl,
        host,
        port: legacyPort,
        workerIndex: legacyIndex,
        protocol,
        legacy: true
      })
    );
    const legacyMember = createSingleWsp(legacyUrl, auth, legacyIndex);
    legacyMember._routeUrl = legacyUrl;
    legacyMember._routeHost = host;
    legacyMember._routePort = legacyPort;
    legacyMember._routeIndex = legacyIndex;
    legacyMember._isLegacy = true;
    pool.push(legacyMember);
  }

  //
  // Select the target worker for a given alias_id using consistent hashing.
  //
  // IMPORTANT: Always prefer the affinity target even when it is momentarily
  // reconnecting. The underlying ReconnectingWebSocket reconnects with infinite
  // retries (500ms–3000ms delay), so a closed readyState is transient.
  // sendRequest() already calls pWaitFor(() => wsp.open(), {timeout: 15s}),
  // which is the correct place to wait for reconnection. Falling back to a
  // different worker breaks affinity and risks opening the same SQLite DB on
  // two workers simultaneously (WAL contention / corruption).
  //
  // We only fall back when the target's ReconnectingWebSocket has permanently
  // given up (_shouldReconnect === false), which should never happen with
  // maxRetries: Infinity but is kept as a defensive measure.
  //
  function getWorkerForAlias(aliasId) {
    if (pool.length === 1) return pool[0];

    // Hash only across the range workers (routingCount), never the optional
    // trailing legacy member, so affinity is unaffected by its presence.
    const targetIndex = fnv1aHash(aliasId) % routingCount;
    const target = pool[targetIndex];

    // Determine if the target is still willing to reconnect. The inner _ws is
    // the ReconnectingWebSocket instance; _shouldReconnect is false only after
    // an explicit close() call (not during normal reconnection cycles).
    const rws = target._ws?._ws; // WebSocketAsPromised._ws = RWS instance
    const willReconnect = !rws || rws._shouldReconnect !== false;

    // Fast path: target is open or will reconnect — always use it.
    if (target.isOpened || target.isOpening || willReconnect) {
      if (env.SQLITE_VERBOSE_ROUTING) {
        console.log(
          '[INFO:sqlite-client] routing alias to worker',
          JSON.stringify({
            aliasId,
            workerIndex: targetIndex,
            port: target._routePort,
            url: target._routeUrl,
            via: 'affinity',
            isOpened: target.isOpened,
            isOpening: target.isOpening,
            willReconnect
          })
        );
      }

      return target;
    }

    // Target permanently closed — fall back to any connected worker.
    // This should be rare (only during graceful shutdown of a specific worker).
    for (const [i, wsp] of pool.entries()) {
      if (i === targetIndex) continue;
      if (wsp.isOpened || wsp.isOpening) {
        logger.warn('worker affinity fallback (target permanently closed)', {
          aliasId,
          targetIndex,
          targetPort: target._routePort,
          fallbackIndex: i,
          fallbackPort: wsp._routePort,
          fallbackUrl: wsp._routeUrl
        });
        return wsp;
      }
    }

    // All disconnected — return the target anyway (sendRequest will wait)
    logger.warn('no connected worker, awaiting target', {
      aliasId,
      targetIndex,
      port: target._routePort,
      url: target._routeUrl,
      poolSize: pool.length
    });
    return target;
  }

  //
  // Create a proxy object that exposes the same interface as a single wsp
  // but routes requests to the appropriate worker based on alias_id.
  //
  const wspPool = {
    // Expose pool for graceful shutdown
    _pool: pool,

    // For compatibility with code that checks wsp.isOpened
    get isOpened() {
      return pool.some((w) => w.isOpened);
    },

    // For compatibility with onUnpackedMessage listener (used by IMAP server for push notifications)
    onUnpackedMessage: {
      addListener(fn) {
        for (const w of pool) {
          w.onUnpackedMessage.addListener(fn);
        }
      },
      removeListener(fn) {
        for (const w of pool) {
          w.onUnpackedMessage.removeListener(fn);
        }
      }
    },

    // Open all pool connections
    async open() {
      await Promise.all(pool.map((w) => w.open()));
    },

    // Close all pool connections
    close() {
      for (const w of pool) {
        try {
          w.close();
        } catch (err) {
          logger.fatal(err);
        }
      }
    },

    // Send raw data to a specific worker (used for push notification ACKs)
    send(data) {
      // Send to all workers since we don't know which one sent the push
      for (const w of pool) {
        if (w.isOpened) {
          try {
            w.send(data);
          } catch (err) {
            logger.warn(err);
          }
        }
      }
    },

    // The main request method with worker affinity routing
    async request(data, retries = 3) {
      try {
        if (typeof data?.action !== 'string') {
          throw new TypeError('Action missing from payload');
        }

        if (
          data.action !== 'tmp' &&
          data.action !== 'size' &&
          (typeof data?.session?.user?.alias_id !== 'string' ||
            !mongoose.isObjectIdOrHexString(data.session.user.alias_id))
        ) {
          throw new TypeError('Alias ID missing from session');
        }

        // helper for debugging
        if (config.env !== 'production') {
          data.stack = new Error('stack').stack;
        }

        const requestId = data?.session?.user?.alias_id
          ? `${revHash(data.session.user.alias_id)}:${revHash(randomUUID())}`
          : `${data.action}:${randomUUID()}`;

        //
        // Route to the correct worker based on alias_id.
        // For actions without alias_id (tmp, size), use round-robin.
        //
        const targetWsp = data?.session?.user?.alias_id
          ? getWorkerForAlias(data.session.user.alias_id)
          : pool[Math.floor(Math.random() * routingCount)];

        // Log the resolved client->server target for this request so the
        // exact worker (host:port/index) handling each action is visible.
        // Gated behind SQLITE_VERBOSE_ROUTING since it fires per-request.
        if (env.SQLITE_VERBOSE_ROUTING) {
          console.log(
            '[INFO:sqlite-client] request routed',
            JSON.stringify({
              action: data.action,
              aliasId: data?.session?.user?.alias_id,
              requestId,
              target: targetWsp?._routeUrl,
              targetPort: targetWsp?._routePort,
              targetIndex: targetWsp?._routeIndex,
              via: data?.session?.user?.alias_id ? 'affinity' : 'round-robin',
              isOpened: targetWsp?.isOpened
            })
          );
        }

        // attempt to send the request 3x
        const response =
          retries === 0
            ? await sendRequest(targetWsp, requestId, data)
            : await pRetry(() => sendRequest(targetWsp, requestId, data), {
                retries,
                minTimeout: config.busyTimeout / 2,
                maxTimeout: config.busyTimeout,
                factor: 1,
                onFailedAttempt(error) {
                  if (isRetryableError(error)) return;

                  throw error;
                }
              });

        if (
          !response.id ||
          (!response.err && typeof response.data === 'undefined')
        ) {
          const error = new TypeError('Response was invalid');
          error._response = response;
          logger.fatal(error);
          throw error;
        }

        if (response.err) {
          throw parseError(response.err);
        }

        return recursivelyParse(response.data, true);
      } catch (err) {
        //
        // NOTE: we permit up to one retry on table issues
        //       (this is mainly for local development since we use /tmp storage and it might get cleared)
        //
        if (
          !data.migrate_check &&
          err.code === 'SQLITE_ERROR' &&
          (err.message.includes('no such ') ||
            err.message.includes('has no column named '))
        ) {
          data.migrate_check = true;
          return wspPool.request(data, 0); // no retries
        }

        // don't mark timeout/transient errors or errors with ignoreHook as code bugs
        if (err.ignoreHook || isTimeoutError(err)) {
          err.isCodeBug = false;
        } else {
          err.isCodeBug = true;
          console.error(
            '[ERROR:wsp-client] request error',
            JSON.stringify({
              errName: err?.name,
              errMessage: err?.message?.slice(0, 500),
              errCode: err?.code,
              action: data?.action,
              aliasId: data?.session?.user?.alias_id,
              aliasName: data?.session?.user?.alias_name,
              domainName: data?.session?.user?.domain_name,
              storageLocation: data?.session?.user?.storage_location
            })
          );
          logger.fatal(err);
        }

        throw refineAndLogError(err, data?.session);
      }
    }
  };

  return wspPool;
}

module.exports = createWebSocketAsPromised;
