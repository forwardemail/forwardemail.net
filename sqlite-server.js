/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const Lock = require('ioredfour');
const MessageHandler = require('wildduck/lib/message-handler');
const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pify = require('pify');
const { WebSocketServer } = require('ws');

const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const Indexer = require('#helpers/indexer');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const parsePayload = require('#helpers/parse-payload');
const refreshSession = require('#helpers/refresh-session');
const wspServer = require('#helpers/wsp-server');
const { decrypt } = require('#helpers/encrypt-decrypt');

class SQLite {
  constructor(options = {}) {
    this.client = options.client;
    this.subscriber = options.subscriber;
    this.resolver = createTangerine(this.client, logger);

    // start server with either http or https
    const server =
      config.env === 'production'
        ? https.createServer({
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH),
            // perfect forward secrecy
            // <https://github.com/nodemailer/wildduck/issues/541>
            dhparam:
              isSANB(env.WEB_SSL_DHPARAM_PATH) &&
              env.WEB_SSL_DHPARAM_PATH.toLowerCase() !== 'auto'
                ? fs.readFileSync(env.WEB_SSL_DHPARAM_PATH)
                : 'auto'
          })
        : http.createServer();

    //
    // bind helpers so we can re-use IMAP helper commands
    // (mirrored from `imap-server.js`)
    //
    // override logger
    this.logger = logger;
    server.logger = logger;
    server.loggelf = (...args) => logger.debug(...args);

    //
    // NOTE: it is using a lock under `wildduck` prefix
    // (to override set `this.attachmentStorage.storage.lock = new Lock(...)`)
    //
    this.attachmentStorage = new AttachmentStorage();

    this.indexer = new Indexer({ attachmentStorage: this.attachmentStorage });

    // promisified version of prepare message from wildduck message handler
    this.prepareMessage = pify(
      MessageHandler.prototype.prepareMessage.bind({
        indexer: this.indexer,
        normalizeSubject: MessageHandler.prototype.normalizeSubject,
        generateIndexedHeaders: MessageHandler.prototype.generateIndexedHeaders
      })
    );

    //
    // the notifier is utilized in the IMAP connection (see `wildduck/imap-core/lib/imap-connection.js`)
    // in order to `getUpdates` and send them over the socket (e.g. `EXIST`, `EXPUNGE`, `FETCH`)
    // <https://github.com/nodemailer/wildduck/issues/509>
    //
    server.notifier = new IMAPNotifier({
      publisher: this.client,
      subscriber: this.subscriber
    });

    this.lock = new Lock({
      redis: this.client,
      namespace: 'imap_lock'
    });

    //
    // in test/development listen for locking and releasing
    // <https://github.com/nodemailer/ioredfour/blob/0bc1035c34c548b2d3058352c588dc20422cfb96/lib/ioredfour.js#L48-L49>
    //
    // if (config.env === 'development') {
    //   this.lock._redisSubscriber.on('message', (channel, message) => {
    //     logger.debug('lock message received', { channel, message });
    //   });
    // }

    // this.wss = new WebSocketServer({ noServer: true, perMessageDeflate: true });
    this.wss = new WebSocketServer({
      noServer: true,
      maxPayload: 0 // disable max payload size
    });
    this.server = server;
    this.refreshSession = refreshSession.bind(this);
    this.wsp = wspServer;

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
              i18n.translateError('INVALID_API_CREDENTIALS', 'en')
            )
          );

        if (!env.API_SECRETS.includes(decrypt(credentials.name)))
          return fn(
            Boom.unauthorized(i18n.translateError('INVALID_API_TOKEN', 'en'))
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
      logger.debug('connection from %s', request.socket.remoteAddress);

      ws.on('error', (err) => logger.error(err, { ws, request }));

      ws.on('pong', function () {
        // logger.debug('pong from %s', request.socket.remoteAddress);
        this.isAlive = true;
      });

      ws.on('message', function () {
        this.isAlive = true;
      });

      ws.on('message', (data) => {
        parsePayload.call(this, data, ws);
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
    this.subscriber.subscribe('sqlite_auth_response');

    this.wsInterval = setInterval(() => {
      for (const ws of this.wss.clients) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      }
    }, ms('35s'));

    await promisify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    this.subscriber.unsubscribe('sqlite_auth_response');
    clearInterval(this.wsInterval);

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
