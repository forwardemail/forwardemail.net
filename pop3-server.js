/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const fs = require('node:fs');
const os = require('node:os');

const Axe = require('axe');
const Lock = require('ioredfour');
const MessageHandler = require('wildduck/lib/message-handler');
const POP3Server = require('wildduck/lib/pop3/server');
const RateLimiter = require('async-ratelimiter');
const pify = require('pify');

const AttachmentStorage = require('#helpers/attachment-storage');
const POP3Notifier = require('#helpers/imap-notifier');
const Indexer = require('#helpers/indexer');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const pop3 = require('#helpers/pop3');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const refreshSession = require('#helpers/refresh-session');

//
// TODO: we need to wrap top and add to parse-payload for all handlers
//
class POP3 {
  constructor(
    options = {},
    secure = env.POP3_PORT === 995 || env.POP3_PORT === 2995
  ) {
    this.client = options.client;
    this.subscriber = options.subscriber;
    this.wsp = options.wsp;

    this.resolver = createTangerine(this.client, logger);

    //
    // NOTE: hard-coded values for now (switch to env later)
    //       (current limit is 10 failed login attempts per hour)
    //
    this.rateLimiter = new RateLimiter({
      db: this.client,
      max: config.smtpLimitMessages,
      duration: config.smtpLimitDuration,
      namespace: config.smtpLimitNamespace
    });

    this.logger = config.env === 'test' ? new Axe({ silent: true }) : logger;

    const server = new POP3Server({
      secure,
      secured: false,
      disableSTARTTLS: secure,
      ignoreSTARTTLS: !secure,
      useProxy: false,
      ignoredHosts: [],
      // TODO: submit PR to add ability to customize version string
      disableVersionString: true,
      id: {
        name: os.hostname(),
        version: config.pkg.version,
        //
        // NOTE: version and vendor not used right now since `disableVersionString`
        //       and existing WildDuck POP3 server doesn't let you customize version string (yet)
        //
        vendor: config.pkg.author
      },
      logger: this.logger,

      // <https://github.com/nodemailer/wildduck/issues/635>
      // <https://github.com/nodemailer/wildduck/blob/b9349f6e8315873668d605e6567ced2d7b1c0c80/imap-core/lib/imap-server.js#L413-L419>
      SNICallback(servername, cb) {
        cb(null, server.secureContext.get(servername));
      },

      ...(config.env === 'production'
        ? {
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH),
            ecdhCurve: 'auto'
          }
        : {})
    });

    // override logger
    server.logger = this.logger;
    server.loggelf = (...args) => this.logger.debug(...args);

    server.onAuth = onAuth.bind(this);
    server.onListMessages = pop3.onListMessages.bind(this);
    server.onFetchMessage = pop3.onFetchMessage.bind(this);
    server.onUpdate = pop3.onUpdate.bind(this);

    // kind of hacky but I filed a GH issue
    // <https://github.com/nodemailer/smtp-server/issues/135>
    server.address = server.server.address.bind(server.server);

    server.on('error', (err) => {
      logger.error(err);
    });

    // lock for read/writes
    this.lock = new Lock({
      redis: this.client,
      namespace: config.imapLockNamespace
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
    // the notifier is utilized in the POP3 connection (see `wildduck/imap-core/lib/imap-connection.js`)
    // in order to `getUpdates` and send them over the socket (e.g. `EXIST`, `EXPUNGE`, `FETCH`)
    // <https://github.com/nodemailer/wildduck/issues/509>
    //
    server.notifier = new POP3Notifier({
      publisher: this.client,
      subscriber: this.subscriber
    });

    this.server = server;
    this.refreshSession = refreshSession.bind(this);
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async listen(port = env.POP3_PORT, host = '::', ...args) {
    await pify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    await pify(this.server.close).bind(this.server)();
  }
}

module.exports = POP3;
