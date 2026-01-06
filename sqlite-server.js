/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const path = require('node:path');
const { promisify } = require('node:util');
const { randomUUID } = require('node:crypto');

const Boom = require('@hapi/boom');
const MessageHandler = require('@forwardemail/wildduck/lib/message-handler');
const Piscina = require('piscina');
const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const { WebSocketServer } = require('ws');
const { mkdirp } = require('mkdirp');

const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const Indexer = require('#helpers/indexer');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const parsePayload = require('#helpers/parse-payload');
const refreshSession = require('#helpers/refresh-session');
const { decrypt } = require('#helpers/encrypt-decrypt');
const { encoder } = require('#helpers/encoder-decoder');

class SQLite {
  constructor(options = {}) {
    this.client = options.client;
    this.subscriber = options.subscriber;
    this.resolver = createTangerine(this.client, logger);

    // worker pool threads
    // <https://github.com/piscinajs/piscina?tab=readme-ov-file#constructor-new-piscinaoptions>
    const piscina = new Piscina({
      filename: path.resolve(__dirname, 'helpers', 'worker.js'),
      maxQueue: 'auto', // maxThreads^2 = 4
      idleTimeout: ms('10s'),
      // if we left it unset, then `maxThreads` would be `48`
      // for EACH process in Node.js in production sqlite
      // > os.availableParallelism * 1.5
      // 48
      // (conditionally for when we detect we're in PM2)
      // (otherwise the tests take super long to run, e.g. in CI)
      maxThreads: 1 // config.env === 'test' ? 1 : 2
    });

    this.piscina = piscina;

    // start server with either http or https
    const server =
      config.env === 'production'
        ? https.createServer({
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH),
            ecdhCurve: 'auto'
          })
        : http.createServer();

    // in-memory database map for re-using open database connection instances
    this.databaseMap = new Map();
    this.temporaryDatabaseMap = new Map();

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
      maxPayload: 0 // disable max payload size
    });

    this.wss.broadcast = async (session, payload) => {
      const uuid = randomUUID();
      const packed = encoder.pack({
        uuid,
        session_id: session.id,
        alias_id: session.user.alias_id,
        payload
      });

      //
      // TODO: wss.broadcast should write to socket
      //       of ALL connected clients where
      //       selected mailbox and alias id are matching
      //

      //
      // NOTE: redis pub/sub seemed to add +1-2ms overhead from testing
      //
      // NOTE: an existing websocket connection
      //       (e.g. IMAP server could get restarted)
      //       and so we can't just iterate over the current
      //       we have to continously iterate over all clients
      //       (sending the data every 5s until we get a response)
      //
      await pWaitFor(
        async () => {
          if (this.uuidsReceived.has(uuid)) return true;

          for (const client of this.wss.clients) {
            if (!client.isAlive) continue;
            if (this.uuidsReceived.has(uuid)) break;

            try {
              client.send(packed);
            } catch (err) {
              err.client = client;
              err.payload = payload;
              logger.fatal(err);
            }
          }

          try {
            await pWaitFor(() => this.uuidsReceived.has(uuid), {
              timeout: ms('10s'),
              interval: 1
            });
            return true;
          } catch (err) {
            if (isRetryableError(err)) return false;
            throw err;
          }
        },
        {
          timeout: ms('5m'),
          interval: ms('5s')
        }
      );

      this.uuidsReceived.delete(uuid);

      // TODO: do interval cleanup
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

    this.uuidsReceived = new Set();

    this.wss.on('connection', (ws, request) => {
      ws.isAlive = true;
      logger.debug('connection from %s', request.socket.remoteAddress);

      ws.on('error', (err) => logger.error(err, { ws, request }));

      ws.on('ping', function () {
        // logger.debug('ping from %s', request.socket.remoteAddress);
        this.isAlive = true;
      });

      ws.on('pong', function () {
        // logger.debug('pong from %s', request.socket.remoteAddress);
        this.isAlive = true;
      });

      ws.on('message', (data) => {
        this.isAlive = true;

        if (!data) return;

        // return early for ping/pong
        if (data.length === 4 && data.toString() === 'ping') {
          logger.debug('ping from %s', request.socket.remoteAddress);
          return;
        }

        // TODO: we could use redis instead
        // return early for uuid from wss.broadcast
        if (data.length === 36) {
          const uuid = data.toString();
          this.uuidsReceived.add(uuid);
          return;
        }

        parsePayload
          .call(this, data, ws)
          .then()
          .catch((err) => {
            err.isCodeBug = isCodeBug(err);
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

    this.wsInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        /*
        if (ws.isAlive === false) {
          // <https://github.com/websockets/ws/issues/1142#issuecomment-1279826041>
          // return ws.close();
          return ws.terminate();
        }

        ws.isAlive = false;
        */
        ws.ping();
      }
    }, ms('45s'));

    await promisify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    this.subscriber.unsubscribe('sqlite_auth_response');
    clearInterval(this.wsInterval);

    // destroy worker pool
    if (this.piscina) {
      await this.piscina.destroy();
    }

    // clear notifier timers
    if (this.server.notifier && this.server.notifier.publishTimers) {
      for (const data of this.server.notifier.publishTimers.values()) {
        if (data.timeout) clearTimeout(data.timeout);
      }

      this.server.notifier.publishTimers.clear();
    }

    // close websocket connections
    // if (this.wss && this.wss.clients) {
    //   for (const ws of this.wss.clients) {
    //     ws.terminate();
    //     ws.isAlive = false;
    //   }
    // }

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
