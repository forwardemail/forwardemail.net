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

const AttachmentStorage = require('wildduck/lib/attachment-storage');
const Axe = require('axe');
const Indexer = require('wildduck/imap-core/lib/indexer/indexer');
const Lock = require('ioredfour');
const MessageHandler = require('wildduck/lib/message-handler');
const RateLimiter = require('async-ratelimiter');
const bytes = require('bytes');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { IMAPServer } = require('wildduck/imap-core');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const IMAPError = require('#helpers/imap-error');
const IMAPNotifier = require('#helpers/imap-notifier');
const Messages = require('#models/messages');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const SocketError = require('#helpers/socket-error');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const imap = require('#helpers/imap');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const validateAlias = require('#helpers/validate-alias');
const validateDomain = require('#helpers/validate-domain');

// TODO: future items
// - [ ] contacts
// - [ ] calendar
// - [ ] rewrite onOpen to use cursor instead of distinct
// - [ ] remove setImmediate from SMTP server
// - [ ] remove or enforce maxTimeMS for all imap handlers
// - [ ] projection on all handlers (instead of returning entire document)
// - [ ] allow aliases to configure retention in the future (default is 0)
// - [ ] delete old threads over time
//       <https://github.com/nodemailer/wildduck/issues/515>

// TODO: urgent items
// - [ ] fix rate limiting in helpers/on-auth (should only rate limit if user failed to auth)
// - [ ] IMAP server needs onConnect to block spammers from denylist <https://github.com/nodemailer/wildduck/issues/540>
// - [ ] enforce billing for IMAP support
// - [ ] when users delete their account then delete all Emails, Messages, Attachments, Threads, and Mailboxes in the system (make this both a job and hook on delete)
// - [ ] auto expunge in bree job when message gets a Deleted flag
// - [ ] message.exp needs to be deleted after time (message.rtime) via background job
// - [ ] cleanup journal items (e.g. expire after 30d or something)

// TODO: other items
// - [ ] axe should parse out streams

const IMAP_COMMANDS = new Set([
  'APPEND',
  'COPY',
  'CREATE',
  'DELETE',
  'EXPUNGE',
  'FETCH',
  'GETQUOTAROOT',
  'GETQUOTA',
  'LIST',
  'LSUB',
  'MOVE',
  'OPEN',
  'RENAME',
  'SEARCH',
  'STATUS',
  'STORE',
  'SUBSCRIBE',
  'UNSUBSCRIBE'
]);

class IMAP {
  constructor(options = {}, secure = env.IMAP_PORT === 2993) {
    this.client = options.client;
    this.subscriber = options.subscriber;
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

    this.logger =
      config.env === 'development' ? logger : new Axe({ silent: true });

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

      enableCompression: false,
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

    server.lock = new Lock({
      redis: this.client,
      namespace: 'mail'
    });

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

    //
    // NOTE: it is using a lock under `wildduck` prefix
    // (to override set `this.attachmentStorage.storage.lock = new Lock(...)`)
    //
    this.attachmentStorage = new AttachmentStorage({
      gridfs: Messages.db,
      options: {
        type: 'gridstore',
        bucket: 'attachments',
        decodeBase64: true
      },
      redis: this.client
    });
    this.attachmentStorage.updateManyPromise = pify(
      this.attachmentStorage.updateMany
    );
    this.attachmentStorage.deleteManyPromise = pify(
      this.attachmentStorage.deleteMany
    );

    this.indexer = new Indexer({ attachmentStorage: this.attachmentStorage });
    this.indexer.storeNodeBodiesPromise = pify(this.indexer.storeNodeBodies);

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

    this.server = server;
    this.refreshSession = this.refreshSession.bind(this);
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async refreshSession(session, command) {
    if (!command) throw new Error('Command required');
    command = command.toUpperCase().trim();
    if (!IMAP_COMMANDS.has(command)) throw new Error('Invalid command');

    // check if server is in the process of shutting down
    if (this.server._closeTimeout) throw new ServerShutdownError();

    // check if socket is still connected
    const socket = (session.socket && session.socket._parent) || session.socket;
    if (!socket || socket?.destroyed || socket?.readyState !== 'open')
      throw new SocketError();

    if (!isSANB(session?.user?.domain_id))
      throw new IMAPError('Domain does not exist on session');

    if (!isSANB(session?.user?.alias_id))
      throw new IMAPError('Alias does not exist on session');

    const [domain, alias] = await Promise.all([
      Domains.findById(session.user.domain_id)
        .populate(
          'members.user',
          `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
        .lean()
        .exec(),
      Aliases.findById(session.user.alias_id)
        .populate(
          'user',
          // TODO: we can remove `smtpLimit` (?)
          `id ${config.userFields.isBanned} ${config.userFields.smtpLimit}`
        )
        .lean()
        .exec()
    ]);

    // validate domain (in case tampered with during session)
    validateDomain(domain, session.user.domain_name);

    // validate alias (in case tampered with during session)
    validateAlias(alias, session.user.domain_name, session.user.alias_name);

    return { domain, alias };
  }

  async listen(port = env.IMAP_PORT, host = '::', ...args) {
    await pify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    await pify(this.server.close).bind(this.server);
  }
}

module.exports = IMAP;
