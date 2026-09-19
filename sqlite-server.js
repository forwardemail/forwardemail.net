/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const { promisify } = require('node:util');
const { randomUUID } = require('node:crypto');

const Boom = require('@hapi/boom');
const MessageHandler = require('@zone-eu/wildduck/lib/message-handler');

const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const { WebSocket, WebSocketServer } = require('ws');
const { mkdirp } = require('mkdirp');

const { isValidApiSecret } = require('#helpers/api-secrets');
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
    // Separate LRU for temporary databases.
    // Temp DBs hold queued messages during main-DB unavailability.
    // A longer idle TTL (10min) avoids repeated SQLCipher key derivation
    // (~100-200ms per open) when the same alias receives multiple messages
    // in quick succession while the main DB is unavailable.
    //
    this.temporaryDatabaseMap = new DatabaseLRUMap({
      maxSize: 1000,
      idleTTL: ms('10m')
    });

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

    //
    // Stream part of a response (e.g. a batch of compiled FETCH lines, see
    // helpers/imap/on-fetch.js) to the IMAP connection of `session` and
    // wait until the process that owns it acknowledges the batch (it sends
    // the uuid back), which bounds the amount of data in flight.
    //
    // The connection lives in exactly one process: the one whose socket
    // carried the request (`session.ws`, attached by parsePayload).  The
    // batch is written to that socket only.  Every other client used to
    // receive (and decode, and discard) each batch as well, which turned a
    // 10 MB flush into 10 MB times the number of connected processes --
    // IMAP, POP3, MX, SMTP, API, CalDAV, CardDAV, ManageSieve -- on every
    // large FETCH, and again every five seconds until the owner replied.
    //
    // The owning socket can be gone by the time a batch is ready (the IMAP
    // process reconnected or was restarted while the FETCH ran, and the
    // session may live on a new socket of that process): only then is the
    // batch offered to every connected client, until one acknowledges it.
    //
    this.wss.broadcast = async (session, payload) => {
      const uuid = randomUUID();
      const packed = encoder.pack({
        uuid,
        session_id: session.id,
        alias_id: session.user.alias_id,
        payload
      });

      const targets = () => {
        const ws = session?.ws;
        if (
          ws &&
          ws.readyState === WebSocket.OPEN &&
          ws.isAlive !== false &&
          this.wss.clients.has(ws)
        )
          return [ws];

        return [...this.wss.clients].filter((client) => client.isAlive);
      };

      //
      // NOTE: redis pub/sub seemed to add +1-2ms overhead from testing
      //
      await pWaitFor(
        async () => {
          if (this.uuidsReceived.has(uuid)) return true;

          for (const client of targets()) {
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

        if (!isValidApiSecret(decrypt(credentials.name)))
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
      });

      ws.on('pong', function () {
        // logger.debug('pong from %s', request.socket.remoteAddress);
        this.isAlive = true;
      });

      ws.on('message', (data) => {
        ws.isAlive = true;

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
      clearInterval(this.uuidCleanupInterval);
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

    //
    // Subscribe to cross-worker cache eviction broadcasts.
    // When one worker recovers a corrupt database (deletes + recreates),
    // or the sqlite-worker is about to swap a rekeyed/vacuumed file over
    // the live database, it publishes the alias_id to 'db_cache_evict'.
    // All other workers must drop their cached handle so they reopen a
    // fresh one on the next request instead of reusing a broken handle
    // (or writing to an inode that is about to be replaced).
    //
    // The handle may be mid-query right now, in which case closing it
    // throws; `evictAndClose` then closes it the moment the request that
    // is using it releases its reference, so the -wal/-shm files of the
    // old inode are guaranteed to disappear and a pending file swap can
    // proceed instead of aborting.
    //
    //
    // `sqlite_auth_reset` is published the moment an alias password rotation
    // (rekey) or a mailbox reset starts.  Dropping the cached handle right
    // away (instead of only when the worker is about to swap the file)
    // means no handle of this process can write to the live file while the
    // worker copies it, so nothing is lost with the swap.
    //
    this.subscriber.subscribe('db_cache_evict', 'sqlite_auth_reset');
    this.subscriber.on('message', (channel, aliasId) => {
      if (channel !== 'db_cache_evict' && channel !== 'sqlite_auth_reset')
        return;

      // a rotation announced itself: the next request re-checks the gate
      if (typeof parsePayload.forgetRekeyState === 'function')
        parsePayload.forgetRekeyState(aliasId);

      if (!this.databaseMap) return;
      if (typeof this.databaseMap.evictAndClose === 'function') {
        this.databaseMap.evictAndClose(aliasId);
        return;
      }

      const cachedDb = this.databaseMap.getRaw
        ? this.databaseMap.getRaw(aliasId)
        : undefined;
      if (cachedDb) {
        // evict() removes from map WITHOUT triggering the async close path
        this.databaseMap.evict(aliasId);
        // Close the corrupt handle to release the file descriptor
        try {
          if (cachedDb.open) cachedDb.close();
        } catch {}
      }
    });

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

    //
    // UUID cleanup interval: clear stale UUIDs that were never ACK'd
    // (e.g. due to disconnected clients or timeouts). Runs every 60s
    // and clears the entire set since any UUID older than 5m would have
    // already timed out in pWaitFor. This prevents unbounded Set growth.
    //
    this.uuidCleanupInterval = setInterval(() => {
      if (this.uuidsReceived.size > 0) {
        this.uuidsReceived.clear();
      }
    }, ms('1m'));

    await promisify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    this.subscriber.unsubscribe('sqlite_auth_response');
    this.subscriber.unsubscribe('db_cache_evict', 'sqlite_auth_reset');
    clearInterval(this.wsInterval);
    clearInterval(this.uuidCleanupInterval);

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
