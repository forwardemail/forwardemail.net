/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const process = require('node:process');
const { promisify } = require('node:util');
const Boom = require('@hapi/boom');
const MessageHandler = require('@zone-eu/wildduck/lib/message-handler');

const { boolean } = require('boolean');
const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const { WebSocketServer } = require('ws');
const { mkdirp } = require('mkdirp');

const AttachmentStorage = require('#helpers/attachment-storage');
const DatabaseLRUMap = require('#helpers/database-lru-map');
const IMAPNotifier = require('#helpers/imap-notifier');
const Indexer = require('#helpers/indexer');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
const env = require('#config/env');
const getTLSOptions = require('#helpers/get-tls-options');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const isTimeoutError = require('#helpers/is-timeout-error');
const logger = require('#helpers/logger');
const parsePayload = require('#helpers/parse-payload');
const refreshSession = require('#helpers/refresh-session');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { encoder } = require('#helpers/encoder-decoder');

//
// Event loop lag monitor: detects when the event loop is blocked > 100ms
// Logs with worker PID so we can correlate with pm2 instance
//
let _lagPrev = Date.now();
setInterval(() => {
  const now = Date.now();
  const lag = now - _lagPrev - 1000;
  _lagPrev = now;
  if (lag > 100) {
    console.warn(
      '[EVENT_LOOP_LAG] pid=%d lag=%dms inflight=%d',
      process.pid,
      lag,
      parsePayload.getInFlight()
    );
  }
}, 1000).unref();

class SQLite {
  constructor(options = {}) {
    this.client = options.client;
    this.subscriber = options.subscriber;
    this.resolver = createTangerine(this.client, logger);

    //
    // NOTE: backup and rekey jobs are handled by the dedicated sqlite-worker
    // process via Redis Pub/Sub. No piscina pool is needed in cluster workers.
    //

    // start server with either http or https
    const server =
      config.env === 'production'
        ? https.createServer({
            //
            // Hardened TLS configuration
            // Enforces cipher suite order, only allows AEAD ciphers with
            // forward secrecy, and excludes weak signature algorithms.
            //
            ...getTLSOptions(),
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH)
          })
        : http.createServer();

    //
    // in-memory database map for re-using open database connection instances
    // (uses LRU eviction to prevent unbounded memory growth)
    //
    this.databaseMap = new DatabaseLRUMap();

    //
    // Separate LRU for temporary databases (smaller capacity, shorter TTL)
    // Temp DBs hold queued messages during main-DB unavailability and are
    // accessed infrequently, so a smaller cache_size (2MB) and shorter idle
    // TTL (2min) prevent wasted memory while still avoiding re-open overhead.
    //
    this.temporaryDatabaseMap = new DatabaseLRUMap({
      maxSize: 500,
      idleTTL: ms('2m')
    });

    // Unique worker ID for filtering self-published Redis broadcast messages
    // (prevents local clients from receiving the same broadcast twice)
    this.workerId = `${process.pid}:${Date.now()}`;

    //
    // bind helpers so we can re-use IMAP helper commands
    // (mirrored from `imap-server.js`)
    //
    // override logger
    this.logger = logger;
    server.logger = logger;
    server.loggelf = (...args) => logger.debug(...args);

    this.attachmentStorage = new AttachmentStorage();

    this.indexer = new Indexer({ attachmentStorage: this.attachmentStorage });

    // override message handler to provider our own `indexer`
    this.prepareMessage = (options) => {
      return MessageHandler.prototype.prepareMessageAsync.call(
        {
          indexer: this.indexer,
          normalizeSubject: MessageHandler.prototype.normalizeSubject,
          generateIndexedHeaders:
            MessageHandler.prototype.generateIndexedHeaders
        },
        options
      );
    };

    //
    // the notifier is utilized in the IMAP connection (see `wildduck/imap-core/lib/imap-connection.js`)
    // in order to `getUpdates` and send them over the socket (e.g. `EXIST`, `EXPUNGE`, `FETCH`)
    // <https://github.com/nodemailer/wildduck/issues/509>
    //
    server.notifier = new IMAPNotifier({
      publisher: this.client
      // NOTE: we do not supply `subscriber` option since it's not IMAP
    });

    // this.wss = new WebSocketServer({ noServer: true, perMessageDeflate: true });
    this.wss = new WebSocketServer({
      noServer: true,
      // Limit max payload to 256 MB to prevent OOM from malicious frames
      maxPayload: 256 * 1024 * 1024
    });
    //
    // Non-blocking broadcast: fire-and-forget to all local WebSocket clients
    // and publish to Redis for cross-worker delivery. This replaces the old
    // pWaitFor loop that blocked the event loop for up to 5 minutes waiting
    // for a UUID ACK that might never arrive (disconnected IMAP client).
    //
    this.wss.broadcast = (session, payload) => {
      const t0 = boolean(env.SQLITE_DEBUG_TIMERS) ? Date.now() : 0;
      const packed = encoder.pack({
        session_id: session.id,
        alias_id: session.user.alias_id,
        payload
      });
      // Send to all local WebSocket clients (fire-and-forget)
      let localSent = 0;
      for (const client of this.wss.clients) {
        if (!client.isAlive || client.readyState !== 1) continue;
        try {
          client.send(packed);
          localSent++;
        } catch (err) {
          logger.error(err);
        }
      }

      // Publish to Redis for cross-worker delivery in PM2 cluster
      try {
        const envelope = encoder.pack({
          workerId: this.workerId,
          data: packed
        });
        this.client.publish('wss_broadcast', envelope);
      } catch (err) {
        logger.error(err);
      }

      if (boolean(env.SQLITE_DEBUG_TIMERS)) {
        console.log('broadcast', {
          duration_ms: Date.now() - t0,
          local_clients: localSent,
          session_id: session.id,
          alias_id: session.user.alias_id
        });
      }
    };

    this.server = server;
    this.refreshSession = refreshSession.bind(this);

    function authenticate(request, socket, head, fn) {
      try {
        const credentials = auth(request);

        if (
          typeof credentials === 'undefined' ||
          typeof credentials.name !== 'string' ||
          !credentials.name
        )
          return fn(
            Boom.unauthorized(
              i18n.translateError(
                'INVALID_API_CREDENTIALS',
                i18n.config.defaultLocale
              )
            )
          );

        if (!env.API_SECRETS.includes(decrypt(credentials.name)))
          return fn(
            Boom.unauthorized(
              i18n.translateError(
                'INVALID_API_TOKEN',
                i18n.config.defaultLocale
              )
            )
          );

        fn();
      } catch (err) {
        err.isCodeBug = true;
        fn(err);
      }
    }

    function onSocketError(err) {
      logger.error(err);
    }

    this.server.on('upgrade', (request, socket, head) => {
      logger.debug('upgrade from %s', request.socket.remoteAddress);
      socket.on('error', onSocketError);

      authenticate(request, socket, head, (err) => {
        if (err) {
          socket.write(
            `HTTP/1.1 ${err?.output?.statusCode || 401} ${
              err?.output?.payload?.error || 'Unauthorized'
            }\r\n\r\n`
          );
          socket.destroy();
          return;
        }

        socket.removeListener('error', onSocketError);

        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit('connection', ws, request);
        });
      });
    });

    this.wss.on('connection', (ws, request) => {
      ws.isAlive = true;
      ws.missedPongs = 0;
      logger.debug('connection from %s', request.socket.remoteAddress);
      ws.on('error', (err) => {
        console.error(
          '[ERROR:sqlite-server] ws error',
          JSON.stringify({
            remoteAddress: request?.socket?.remoteAddress,
            errName: err?.name,
            errMessage: err?.message?.slice(0, 500),
            errCode: err?.code
          })
        );
        logger.error(err, { ws, request });
      });
      ws.on('ping', function () {
        // logger.debug('ping from %s', request.socket.remoteAddress);
        this.isAlive = true;
        this.missedPongs = 0;
      });
      ws.on('pong', function () {
        // logger.debug('pong from %s', request.socket.remoteAddress);
        this.isAlive = true;
        this.missedPongs = 0;
      });
      ws.on('message', (data) => {
        ws.isAlive = true;
        if (!data) return;
        // return early for ping/pong
        if (data.length === 4 && data.toString() === 'ping') {
          logger.debug('ping from %s', request.socket.remoteAddress);
          return;
        }

        const t0 = boolean(env.SQLITE_DEBUG_TIMERS) ? Date.now() : 0;
        parsePayload
          .call(this, data, ws)
          .then(() => {
            if (boolean(env.SQLITE_DEBUG_TIMERS)) {
              console.log('parsePayload complete', {
                duration_ms: Date.now() - t0
              });
            }
          })
          .catch((err) => {
            // skip logging for timeout/transient errors (e.g. backup queue full)
            if (err.ignoreHook || isTimeoutError(err)) return;
            err.isCodeBug = isCodeBug(err);
            console.error(
              '[ERROR:sqlite-server] parsePayload error',
              JSON.stringify({
                remoteAddress: request?.socket?.remoteAddress,
                errName: err?.name,
                errMessage: err?.message?.slice(0, 500),
                errCode: err?.code,
                action: err?.payload?.action,
                aliasId: err?.payload?.session?.user?.alias_id,
                aliasName: err?.payload?.session?.user?.alias_name,
                domainName: err?.payload?.session?.user?.domain_name,
                storageLocation: err?.payload?.session?.user?.storage_location
              })
            );
            this.logger.fatal(err);
          });
      });
    });

    this.wss.on('close', () => {
      clearInterval(this.wsInterval);
    });

    // bind listen/close to this
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async listen(port = env.SQLITE_PORT, host = '::', ...args) {
    //
    // ensure that /tmp dir's exist in each /mnt folder
    // (e.g. `/mnt/storage_do_1/tmp`)
    //
    if (isSANB(env.SQLITE_TMPDIR)) await mkdirp(env.SQLITE_TMPDIR);

    // TODO: all subscribe/unsubscribe calls need `await`'ed
    this.subscriber.subscribe('sqlite_auth_response');

    // Subscribe to cross-worker broadcast channel for PM2 cluster
    this.subscriber.subscribe('wss_broadcast');
    this.subscriber.on('messageBuffer', (channel, message) => {
      if (channel.toString() !== 'wss_broadcast') return;
      // Decode envelope to check workerId — skip self-published messages
      // (local clients already received the broadcast directly)
      try {
        const envelope = encoder.unpack(message);
        if (envelope.workerId === this.workerId) return;
        // Forward the inner packed payload to all local WebSocket clients
        for (const client of this.wss.clients) {
          if (!client.isAlive || client.readyState !== 1) continue;
          try {
            client.send(envelope.data);
          } catch (err) {
            logger.error(err);
          }
        }
      } catch (err) {
        logger.error(err);
      }
    });

    this.wsInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        //
        // Graceful dead-connection cleanup:
        // Terminate only after 3 consecutive missed pongs (~135s).
        // This avoids reconnect storms from aggressive termination
        // while still reclaiming half-open TCP connections.
        //
        if (ws.isAlive === false) {
          ws.missedPongs = (ws.missedPongs || 0) + 1;
          if (ws.missedPongs >= 3) {
            ws.terminate();
            continue;
          }
        } else {
          ws.missedPongs = 0;
        }

        ws.isAlive = false;
        ws.ping();
      }
    }, ms('45s'));

    await promisify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    this.subscriber.unsubscribe('sqlite_auth_response');
    this.subscriber.unsubscribe('wss_broadcast');
    clearInterval(this.wsInterval);

    // clear notifier timers
    if (this.server.notifier && this.server.notifier.publishTimers) {
      for (const data of this.server.notifier.publishTimers.values()) {
        if (data.timeout) clearTimeout(data.timeout);
      }

      this.server.notifier.publishTimers.clear();
    }

    // Gracefully close all cached database connections
    if (this.databaseMap) {
      await this.databaseMap.closeAll();
    }

    if (this.temporaryDatabaseMap) {
      await this.temporaryDatabaseMap.closeAll();
    }

    // close server
    try {
      await promisify(this.wss.close).bind(this.wss)();
    } catch (err) {
      logger.fatal(err);
    }

    await promisify(this.server.close).bind(this.server)();
  }
}

module.exports = SQLite;
