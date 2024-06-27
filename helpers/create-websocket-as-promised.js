/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

// <https://github.com/pladaria/reconnecting-websocket/issues/195>
const ReconnectingWebSocket = require('@opensumi/reconnecting-websocket');
const WebSocketAsPromised = require('websocket-as-promised');
const mongoose = require('mongoose');
const ms = require('ms');
const pRetry = require('p-retry');
const revHash = require('rev-hash');
const { WebSocket } = require('ws');

const config = require('#config');
const env = require('#config/env');
const isTimeoutError = require('#helpers/is-timeout-error');
const logger = require('#helpers/logger');
const parseError = require('#helpers/parse-error');
const recursivelyParse = require('#helpers/recursively-parse');
const refineAndLogError = require('#helpers/refine-and-log-error');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { encoder, decoder } = require('#helpers/encoder-decoder');

// <https://github.com/partykit/partykit/tree/main/packages/partysocket>
// <https://github.com/partykit/partykit/issues/536>
// const partysocket = require('partysocket');
// partysocket.WebSocket.prototype._debug = (...args) =>
//   logger.debug('partysocket', { args });

ReconnectingWebSocket.prototype._debug = () => {
  // if (config.env === 'development')
  //   logger.debug('reconnectingwebsocket', { args });
};

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

// <https://github.com/pladaria/reconnecting-websocket/issues/197>
ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
  if (code === undefined) {
    code = 1000;
  }

  this._clearTimeouts();
  if (!this._ws) {
    return;
  }

  this._removeListeners();
  try {
    if (this._ws.readyState !== ReconnectingWebSocket.CONNECTING) {
      this._ws.close(code, reason);
    }

    this._handleClose(new CloseEvent(code, reason, this));
  } catch (err) {
    logger.fatal(err);
  }
};

// <https://github.com/pladaria/reconnecting-websocket/issues/138#issuecomment-698206018>
function createWebSocketClass(options) {
  return class extends WebSocket {
    constructor(url, protocols) {
      super(url, protocols, options);
    }
  };
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
  const auth = `${encrypt(env.API_SECRETS[0])}:`;
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
      return new ReconnectingWebSocket(url, [], {
        // <https://github.com/pladaria/reconnecting-websocket#available-options>
        // <https://github.com/pladaria/reconnecting-websocket/issues/138#issuecomment-698206018>
        WebSocket: createWebSocketClass({
          maxPayload: 0, // disable max payload size
          auth,
          rejectUnauthorized: config.env !== 'production'
          // perMessageDeflate: false,
          // headers: {
          //   authorization: 'Basic ' + Buffer.from(auth).toString('base64')
          // }
        }),
        debug: config.env === 'development'
      });
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
  // if (config.env === 'development') {
  //   for (const event of [
  //     'onOpen',
  //     'onSend',
  //     'onMessage',
  //     'onUnpackedMessage',
  //     'onResponse',
  //     'onClose',
  //     'onError'
  //   ]) {
  //     wsp[event].addListener((...args) =>
  //       logger[event === 'onError' ? 'error' : 'debug'](event, { args })
  //     );
  //   }
  // }

  // <https://github.com/vitalets/websocket-as-promised/issues/46>
  wsp.request = async function (data, retries = 2) {
    try {
      // TODO: we could probably remove this validation
      if (typeof data?.action !== 'string')
        throw new TypeError('Action missing from payload');

      // TODO: we could probably remove this validation
      if (
        data.action !== 'tmp' &&
        data.action !== 'size' &&
        (typeof data?.session?.user?.alias_id !== 'string' ||
          !mongoose.isObjectIdOrHexString(data.session.user.alias_id))
      )
        throw new TypeError('Alias ID missing from session');

      // will retry by default up to 10x with exponential backoff
      // (for initial connection)
      if (!wsp.isOpened) {
        await pRetry(() => wsp.open(), {
          retries: config.env === 'production' ? 9 : 1, // in case the default in node-retry changes
          onFailedAttempt(err) {
            err.isCodeBug = true;
            // <https://github.com/vitalets/websocket-as-promised/issues/47>
            logger.fatal(err);
          }
        });
      }

      // helper for debugging
      if (config.env !== 'production') data.stack = new Error('stack').stack;

      const requestId = data?.session?.user?.alias_id
        ? `${revHash(data.session.user.alias_id)}:${revHash(randomUUID())}`
        : `${data.action}:${randomUUID()}`;

      // attempt to send the request 3x
      // (e.g. in case connection disconnected and no response was made)
      const response = await pRetry(
        () => {
          data.sent_at = Date.now();
          return wsp.sendRequest(data, {
            timeout:
              typeof data.timeout === 'number' &&
              Number.isFinite(data.timeout) &&
              data.timeout > 0
                ? data.timeout
                : ms('5m'),
            requestId
          });
        },
        {
          retries,
          onFailedAttempt(err) {
            if (isTimeoutError(err)) {
              logger.error(err, { data });
              return;
            }

            throw err;
          }
        }
      );

      if (
        !response.id ||
        (!response.err && typeof response.data === 'undefined')
      ) {
        const err = new TypeError('Response was invalid');
        err._response = response;
        logger.fatal(err);
        throw err;
      }

      if (response.err) throw parseError(response.err);
      return recursivelyParse(response.data, true);
    } catch (err) {
      err.isCodeBug = true;
      err.wsData = data;
      throw refineAndLogError(err);
    }
  };

  // <https://github.com/vitalets/websocket-as-promised/issues/2#issuecomment-618241047>
  wsp._interval = setInterval(() => {
    if (wsp.isOpened) wsp.send('ping');
  }, ms('60s'));

  wsp.onClose.addListener(
    () => {
      if (wsp._interval) clearInterval(wsp._interval);
    },
    { once: true }
  );

  return wsp;
}

module.exports = createWebSocketAsPromised;
