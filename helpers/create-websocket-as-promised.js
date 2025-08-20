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
const logger = require('#helpers/logger');
const parseError = require('#helpers/parse-error');
const recursivelyParse = require('#helpers/recursively-parse');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { encoder, decoder } = require('#helpers/encoder-decoder');

const DEFAULT = {
  maxReconnectionDelay: 3000,
  minReconnectionDelay: 500, // 1000 + Math.random() * 4000,
  minUptime: 1000,
  reconnectionDelayGrowFactor: 1, // 1.3,
  connectionTimeout: 1000,
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
    this._connect();
  } catch (err) {
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
    if (this._ws.readyState !== ReconnectingWebSocket.CONNECTING) {
      this._ws.close(code, reason);
    }

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
    await pWaitFor(
      async () => {
        try {
          await wsp.open();
          return true;
        } catch (err) {
          logger.fatal(err);
          return false;
        }
      },
      {
        timeout: ms('15s')
      }
    );
  }

  const result = await wsp.sendRequest(data, {
    timeout:
      typeof data.timeout === 'number' &&
      Number.isFinite(data.timeout) &&
      data.timeout > 0
        ? data.timeout
        : config.env === 'production'
        ? //
          // TODO: we should revise this later in future
          //       (no wsp.request methds should take longer than 1m)
          //       (any long-running jobs should have emails sent once completed)
          //
          ms('10m') // <--- TODO: we should not have 10m in future (should be 30-60s max)
        : config.env === 'test'
        ? ms('1m')
        : ms('10s'),
    requestId
  });

  if (result?.err) throw parseError(result.err);

  return result;
}

function createWebSocketAsPromised(options = {}) {
  //
  // <https://github.com/websockets/ws/issues/2050>
  // <https://github.com/vitalets/websocket-as-promised>
  // <https://github.com/pladaria/reconnecting-websocket>
  // <https://github.com/websockets/ws/issues/1818>
  // <https://github.com/pladaria/reconnecting-websocket/issues/135#issuecomment-643144398>
  // <https://github.com/partykit/partykit/issues/536>
  //
  const protocol =
    options.protocol || config.env === 'production' ? 'wss' : 'ws';

  const auth = `${encrypt(
    Array.isArray(env.API_SECRETS) ? env.API_SECRETS[0] : env.API_SECRETS
  )}:`;
  const host = options.host || env.SQLITE_HOST;
  const port = options.port || env.SQLITE_PORT;
  const url = `${protocol}://${host}:${port}`;

  logger.info('initial url', { url });

  // TODO: implement round robin URL provider
  // <https://github.com/pladaria/reconnecting-websocket#update-url>
  const wsp = new WebSocketAsPromised(url, {
    // createWebSocket(url) {
    createWebSocket() {
      logger.info('creating url', { url });
      // TODO: prevent duplicate RWS instances
      // <https://github.com/vitalets/websocket-as-promised/issues/6#issuecomment-1089790824>
      // return new partysocket.WebSocket(url, [], {
      const rws = new ReconnectingWebSocket(url, [], {
        // <https://github.com/pladaria/reconnecting-websocket#available-options>
        // <https://github.com/pladaria/reconnecting-websocket/issues/138#issuecomment-698206018>
        WebSocket: createWebSocketClass({
          maxPayload: 0, // disable max payload size
          auth,
          rejectUnauthorized: config.env !== 'production',
          // <https://github.com/nodejs/node/issues/8871>
          perMessageDeflate: false
          // headers: {
          //   authorization: 'Basic ' + Buffer.from(auth).toString('base64')
          // }
        }),
        ...DEFAULT
      });

      // bind overriden prototype functions until PR's merged
      // (see above)
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
    //
    // NOTE: we don't need this because ReconnectingWebSocket returns `event.data`
    //       but if we were to use ws directly then we would need to uncomment this
    //       <https://github.com/vitalets/websocket-as-promised#usage-with-ws>
    //
    // <https://github.com/partykit/partykit/issues/538>
    // extractMessageData: (event) => event
    // extractMessageData: (event) => event.data
  });

  //
  // bind event listeners
  //
  for (const event of [
    // 'onOpen',
    // 'onSend',
    // 'onMessage',
    // 'onUnpackedMessage',
    // 'onResponse',
    // 'onClose',
    'onError'
  ]) {
    wsp[event].addListener((...args) => {
      //
      // NOTE: we can't use `args` without stripping `_req` and other props like `_ws`
      //       to prevent leaking of sensitive data like headers with basic auth ,etc
      //
      // logger[event === 'onError' ? 'error' : 'debug'](event, { args });
      logger.debug(event, { args });
    });
  }

  // <https://github.com/vitalets/websocket-as-promised/issues/46>
  wsp.request = async function (data, retries = 3) {
    try {
      // TODO: we could probably remove this validation
      if (typeof data?.action !== 'string') {
        throw new TypeError('Action missing from payload');
      }

      // TODO: we could probably remove this validation
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

      // attempt to send the request 3x
      // (e.g. in case connection disconnected and no response was made)
      const response =
        retries === 0
          ? await sendRequest(wsp, requestId, data)
          : await pRetry(() => sendRequest(wsp, requestId, data), {
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
      // - no such index
      // - no such rowid
      // - no such column
      // - no such module
      // - no such table
      // + more by running this command:
      //
      // `rg '"no such ' -uuu node_modules/better-sqlite3`
      //
      if (
        !data.migrate_check && // <-- this causes parse payload function to clear migrate_check cache on the alias
        err.code === 'SQLITE_ERROR' &&
        (err.message.includes('no such ') ||
          err.message.includes('has no column named '))
      ) {
        data.migrate_check = true;
        return wsp.request(data, 0); // no retries
      }

      err.isCodeBug = true;
      logger.fatal(err);
      throw refineAndLogError(err, data?.session);
      //
      // TODO: we need to pass client and resolver
      //       (maybe we do a global.client and global.resolver or something down the road?)
      //       (otherwise having to pass client and resolver throughout the codebase is a nightmare)
      //       (and we could just opt for an approach more like mongoose with a global)
      //
      // throw refineAndLogError(err, data?.session, false, { client, resolver });
    }
  };

  wsp.onOpen.addListener(() => {
    // <https://github.com/vitalets/websocket-as-promised/issues/2#issuecomment-618241047>
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

  wsp.onClose.addListener(
    () => {
      if (wsp._interval) {
        clearInterval(wsp._interval);
      }
    }
    // }, { once: true }
  );

  return wsp;
}

module.exports = createWebSocketAsPromised;
