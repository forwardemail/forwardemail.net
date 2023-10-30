/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');
const { WebSocketServer } = require('ws');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { decrypt } = require('#helpers/encrypt-decrypt');

class SQLite {
  constructor(options = {}) {
    this.client = options.client;
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

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws, request) => {
      ws.isAlive = true;

      ws.on('error', (err) => console.error(err));

      ws.on('pong', () => {
        this.isAlive = true;
      });

      ws.on('message', (data) => {
        console.log('message', { data, request });
      });
    });

    const interval = setInterval(() => {
      for (const ws of wss.clients) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      }
    }, 30000);

    wss.on('close', () => {
      clearInterval(interval);
    });

    function authenticate(request, socket, head, fn) {
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
    }

    function onSocketError(err) {
      console.error(err);
    }

    server.on('upgrade', (request, socket, head) => {
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

        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      });
    });

    this.server = server;
    this.wss = wss;

    // bind listen/close to this
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async listen(port = env.SQLITE_WEBSOCKET_PORT, host = '::', ...args) {
    await promisify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    await promisify(this.server.close).bind(this.server);
  }
}

module.exports = SQLite;
