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
const RateLimiter = require('async-ratelimiter');
const _ = require('lodash');
const bytes = require('bytes');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const pify = require('pify');
const safeStringify = require('fast-safe-stringify');
const { IMAPServer } = require('wildduck/imap-core');

const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const Indexer = require('#helpers/indexer');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const imap = require('#helpers/imap');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const refreshSession = require('#helpers/refresh-session');

//
// TODO: run migration for existing IMAP db storage in Mongo -> SQLite temp mailboxes
//
// TODO: handle translation of the folder names (similar to wildduck)
// TODO: send welcome email to user in their sqlite dbs
// TODO: alias bootstrap progress bars for storage, pooled, etc
// TODO: when user deletes account then also purge sqlite databases and backups
// TODO: alert user they have new email if messages detected > 24 hours ago

// TODO: search filters like has:attachment
// TODO: run validate() on all docs before 'update' and 'insert'
// TODO: mx server forwarding (e.g. can forward to another mailserver such as gmail)
// TODO: auto-reply/vacation responder
// TODO: enforce maxDownload and maxUpload
// TODO: enforce 10-15 max connections per alias
// TODO: each R2 bucket seems like it's 18 TB max?
// TODO: use error.cause instead of `original_error` or some other stuff
//       <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause>

// TODO: future items
// - [ ] contacts
// - [ ] calendar
// - [ ] remove setImmediate from SMTP server
// - [ ] remove or enforce maxTimeMS for all imap handlers
// - [ ] projection on all handlers (instead of returning entire document)
// - [ ] allow aliases to configure retention in the future (default is 0)
// - [ ] delete old threads over time
//       <https://github.com/nodemailer/wildduck/issues/515>

// TODO: urgent items
// - [ ] when users delete their account then delete all Emails, Messages, Attachments, Threads, and Mailboxes in the system (make this both a job and hook on delete)
// - [ ] auto expunge in bree job when message gets a Deleted flag
// - [ ] message.exp needs to be deleted after time (message.rtime) via background job
// - [ ] mailboxes with retention not 0 need all messages purged after that time
// - [ ] messages expunged need removed after retention time
// - [ ] cleanup journal items (e.g. expire after 30d or something)

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

    this.logger = config.env === 'test' ? new Axe({ silent: true }) : logger;

    const server = new IMAPServer({
      secure,
      secured: false,
      disableSTARTTLS: secure,
      ignoreSTARTTLS: !secure,
      useProxy: false,
      ignoredHosts: [],
      id: {
        name: os.hostname(),
        version: config.pkg.version,
        vendor: config.pkg.author
      },
      logger: this.logger,
      maxMessage: bytes('50MB'),

      // NOTE: we don't need this since we have custom logic
      // settingsHandler: imap.settingsHandler.bind(this)

      enableCompression: true,
      skipFetchLog: false,

      // NOTE: a default `SNICallback` function is created already
      // <https://github.com/nodemailer/wildduck/blob/b9349f6e8315873668d605e6567ced2d7b1c0c80/imap-core/lib/imap-server.js#L413-L419>
      // SNICallback: function

      logoutMessages: ['Logging out'],

      ...(config.env === 'production'
        ? {
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
          }
        : {})
    });

    // override logger
    server.logger = this.logger;
    server.loggelf = (...args) => this.logger.debug(...args);

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
    // the notifier is utilized in the IMAP connection (see `wildduck/imap-core/lib/imap-connection.js`)
    // in order to `getUpdates` and send them over the socket (e.g. `EXIST`, `EXPUNGE`, `FETCH`)
    // <https://github.com/nodemailer/wildduck/issues/509>
    //
    server.notifier = new IMAPNotifier({
      publisher: this.client,
      subscriber: this.subscriber
    });

    this.subscriber.on('message', (channel, id) => {
      if (channel !== 'sqlite_auth_request' && channel !== 'sqlite_auth_reset')
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

        if (channel === 'sqlite_auth_request') {
          const connections = [...this.server.connections];
          const matches = connections.filter(
            (c) => c?.session?.user?.alias_id === id
          );
          // if no matches found then timer will run out since no response
          // (e.g. if this IMAP server doesn't have a connection maybe another does)
          if (matches.length === 0) return;

          // sort by desc date find the first match
          const sorted = _.sortBy(
            matches,
            (c) => c?.session?.arrivalDate
          ).reverse();

          // error if no password was on the object (for debugging)
          if (!isSANB(sorted[0].session.user.password)) {
            const err = new TypeError(
              'IMAP connection session did not have password'
            );
            err.matches = matches;
            err.sorted = sorted;
            throw err;
          }

          // find the most recent connection if any and broadcast that
          this.client.publish(
            'sqlite_auth_response',
            safeStringify(sorted[0].session.user)
          );
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

  async listen(port = env.IMAP_PORT, host = '::', ...args) {
    this.subscriber.subscribe('sqlite_auth_request');
    this.subscriber.subscribe('sqlite_auth_reset');
    await pify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    this.subscriber.unsubscribe('sqlite_auth_request');
    this.subscriber.unsubscribe('sqlite_auth_reset');
    await pify(this.server.close).bind(this.server)();
  }
}

module.exports = IMAP;
