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

const MessageHandler = require('@forwardemail/wildduck/lib/message-handler');
const RateLimiter = require('async-ratelimiter');
const bytes = require('@forwardemail/bytes');
const mongoose = require('mongoose');
const pRetry = require('p-retry');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const ms = require('ms');
const { IMAPServer } = require('@forwardemail/wildduck/imap-core');

const Aliases = require('#models/aliases');
const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const Indexer = require('#helpers/indexer');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const imap = require('#helpers/imap');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const refreshSession = require('#helpers/refresh-session');

//
// TODO: handle translation of the folder names (similar to wildduck)
// TODO: send welcome email to user in their sqlite dbs
// TODO: when user deletes account then also purge sqlite databases and backups

// TODO: search filters like has:attachment
// TODO: run validate() on all docs before 'update' and 'insert'
// TODO: mx server forwarding (e.g. can forward to another mailserver such as gmail)
// TODO: enforce maxDownload and maxUpload
// TODO: each R2 bucket seems like it's 18 TB max?
// TODO: use error.cause instead of `original_error` or some other stuff
//       <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause>

// TODO: future items
// - [ ] contacts
// - [ ] remove setImmediate from SMTP server
// - [ ] remove or enforce maxTimeMS for all imap handlers
// - [ ] projection on all handlers (instead of returning entire document)
// - [ ] allow aliases to configure retention in the future (default is 0)

// TODO: urgent items
// - [ ] when users delete their account then delete all Emails, Messages, Attachments, Threads, and Mailboxes in the system (make this both a job and hook on delete)
// - [ ] auto expunge in bree job when message gets a Deleted flag
// - [ ] message.exp needs to be deleted after time (message.rtime) via background job
// - [ ] mailboxes with retention not 0 need all messages purged after that time
// - [ ] messages expunged need removed after retention time

// TODO: other items
// - [ ] axe should parse out streams

class IMAP {
  constructor(
    options = {},
    secure = env.IMAP_PORT === 993 || env.IMAP_PORT === 2993
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

    this.logger = logger;

    const server = new IMAPServer({
      aps: {
        enabled: env.APPLE_KEY_PATH && env.APPLE_KEY_ID && env.APPLE_TEAM_ID
      },
      secure,
      secured: false,
      disableSTARTTLS: secure,
      ignoreSTARTTLS: !secure,
      useProxy: false,
      socketTimeout: config.socketTimeout,
      ignoredHosts: [],
      id: {
        name: os.hostname(),
        version: config.pkg.version,
        vendor: config.pkg.author
      },
      logger: this.logger,
      maxMessage: bytes(env.SMTP_MESSAGE_MAX_SIZE),

      // NOTE: we don't need this since we have custom logic
      // settingsHandler: imap.settingsHandler.bind(this)

      enableCompression: true,
      skipFetchLog: false,

      // <https://github.com/nodemailer/wildduck/issues/635>
      // <https://github.com/nodemailer/wildduck/blob/b9349f6e8315873668d605e6567ced2d7b1c0c80/imap-core/lib/imap-server.js#L413-L419>
      SNICallback(servername, cb) {
        cb(null, server.secureContext.get(servername));
      },

      logoutMessages: ['Logging out'],

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
    server.loggelf = () => {}; // (...args) => this.logger.debug(...args);

    server.onAuth = onAuth.bind(this);
    server.onAppend = imap.onAppend.bind(this);
    server.onCopy = imap.onCopy.bind(this);
    server.onCreate = imap.onCreate.bind(this);
    server.onDelete = imap.onDelete.bind(this);
    server.onExpunge = imap.onExpunge.bind(this);
    server.onFetch = imap.onFetch.bind(this);
    server.onGetQuota = imap.onGetQuota.bind(this);
    server.onGetQuotaRoot = imap.onGetQuotaRoot.bind(this);
    server.onList = imap.onList.bind(this);
    server.onLsub = imap.onLsub.bind(this);
    server.onMove = imap.onMove.bind(this);
    server.onOpen = imap.onOpen.bind(this);
    server.onRename = imap.onRename.bind(this);
    server.onSearch = imap.onSearch.bind(this);
    server.onStatus = imap.onStatus.bind(this);
    server.onStore = imap.onStore.bind(this);
    server.onSubscribe = imap.onSubscribe.bind(this);
    server.onUnsubscribe = imap.onUnsubscribe.bind(this);
    server.onXAPPLEPUSHSERVICE = imap.onXAPPLEPUSHSERVICE.bind(this);

    // kind of hacky but I filed a GH issue
    // <https://github.com/nodemailer/smtp-server/issues/135>
    server.address = server.server.address.bind(server.server);

    server.on('error', (err) => {
      logger.error(err);
    });

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

    // every hour attempt to run a backup on the connected users
    // (initial auth may attempt to backup, but could fail)
    this.backupConnections = this.backupConnections.bind(this);
    setTimeout(() => {
      this.backupConnections();
    }, ms('1h'));

    // listen for websocket write stream
    this.wsp.onUnpackedMessage.addListener(async (data) => {
      try {
        if (
          typeof data === 'object' &&
          typeof data.uuid === 'string' &&
          typeof data.session_id === 'string' &&
          typeof data.alias_id === 'string' &&
          data.payload !== undefined
        ) {
          for (const connection of this.server.connections) {
            // extra safeguard to use two sources of truth (session ID + alias ID)
            if (
              connection?.id !== data.session_id ||
              connection?.session?.user?.alias_id !== data.alias_id
            )
              continue;

            if (Array.isArray(data.payload)) {
              for (const payload of data.payload) {
                connection.session.writeStream.write(payload);
              }
            } else {
              connection.session.writeStream.write(data.payload);
            }

            // attempt to send the request 3x

            await pRetry(
              async () => {
                await pWaitFor(
                  async () => {
                    try {
                      await this.wsp.open();
                      return true;
                    } catch (err) {
                      logger.debug(err);
                      return false;
                    }
                  },
                  { timeout: ms('15s') }
                );

                this.wsp.send(data.uuid);
              },
              {
                retries: 2,
                onFailedAttempt(err) {
                  logger.error(err);

                  if (isRetryableError(err)) {
                    return;
                  }

                  throw err;
                }
              }
            );
            break;
          }
        }
      } catch (err) {
        logger.fatal(err);
      }
    });

    //
    // the notifier is utilized in the IMAP connection (see `wildduck/imap-core/lib/imap-connection.js`)
    // in order to `getUpdates` and send them over the socket (e.g. `EXIST`, `EXPUNGE`, `FETCH`)
    // <https://github.com/nodemailer/wildduck/issues/509>
    //
    server.notifier = new IMAPNotifier({
      publisher: this.client,
      subscriber: this.subscriber
    });

    this.subscriber.on('message', async (channel, id) => {
      if (
        // channel !== 'sqlite_auth_request' &&
        channel !== 'sqlite_auth_reset' &&
        channel !== 'pgp_reload'
      )
        return;
      try {
        if (typeof id !== 'string' || !mongoose.isObjectIdOrHexString(id))
          throw new TypeError('Alias ID missing');

        if (channel === 'sqlite_auth_reset') {
          for (const connection of this.server.connections) {
            if (connection?.session?.user?.alias_id !== id) continue;
            connection.clearNotificationListener();
            connection.send('* BYE Password was changed');
            setImmediate(() => connection.close());
          }

          return;
        }

        /*
        if (channel === 'sqlite_auth_request') {
          for (const connection of this.server.connections) {
            if (connection?.session?.user?.alias_id === id) {
              // find the most recent connection if any and broadcast that
              this.client.publish(
                'sqlite_auth_response',
                safeStringify(connection.session.user)
              );
              break;
            }
          }

          return;
        }
        */

        if (channel === 'pgp_reload') {
          const alias = await Aliases.findOne({ id })
            .select('has_pgp public_key')
            .lean()
            .exec();
          if (alias) {
            for (const connection of this.server.connections) {
              if (connection?.session?.user?.alias_id !== id) continue;
              connection.session.user.alias_has_pgp = alias.has_pgp;
              connection.session.user.alias_public_key = alias.public_key;
            }
          }

          return;
        }

        throw new TypeError(`Unknown channel ${channel}`);
      } catch (err) {
        this.logger.error(err);
      }
    });

    this.server = server;
    this.refreshSession = refreshSession.bind(this);
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async backupConnections() {
    try {
      if (!this?.server?.connections || this.server.connections.size === 0) {
        setTimeout(() => {
          this.backupConnections();
        }, ms('1h'));
        return;
      }

      const ids = new Set();

      for (const connection of this.server.connections) {
        if (!connection?.session?.user?.alias_id) continue;
        if (ids.has(connection.session.user.alias_id)) continue;
        ids.add(connection.session.user.alias_id);

        try {
          // iterate in series with delay
          // to prevent piscina worker flooding

          await this.wsp.request({
            action: 'backup',
            backup_at: new Date().toISOString(),
            session: { user: connection.session.user }
          });

          await ms('1s');
        } catch (err) {
          this.logger.debug(err, { session: connection.session.user });
        }
      }

      setTimeout(() => {
        this.backupConnections();
      }, ms('1h'));
    } catch (err) {
      this.logger.fatal(err);
    }
  }

  async listen(port = env.IMAP_PORT, host = '::', ...args) {
    // this.subscriber.subscribe('sqlite_auth_request');
    this.subscriber.subscribe('sqlite_auth_reset');
    await pify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    // this.subscriber.unsubscribe('sqlite_auth_request');
    this.subscriber.unsubscribe('sqlite_auth_reset');
    await pify(this.server.close).bind(this.server)();
  }
}

module.exports = IMAP;
