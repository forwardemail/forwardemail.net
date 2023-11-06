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
const Indexer = require('wildduck/imap-core/lib/indexer/indexer');
const Lock = require('ioredfour');
const MessageHandler = require('wildduck/lib/message-handler');
const RateLimiter = require('async-ratelimiter');
const bytes = require('bytes');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { IMAPServer } = require('wildduck/imap-core');

const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const imap = require('#helpers/imap');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const refreshSession = require('#helpers/refresh-session');

// TODO: send welcome email to user in their sqlite dbs
// TODO: restore locales, then run through pages, then mandarin
// TODO: alias storage, pooled, etc
// TODO: alias has to either have at least one recipient or has_imap everywhere (including via API)
// TODO: alias.has_imap validation on IMAP connection
// TODO: when user deletes account then also purge sqlite databases and backups
// TODO: automated job to detect files on block storage and R2 that don't correspond to actual aliases
// TODO: use `session.db` and `session.wsp` everywhere (rewrite everything for less args)

// TODO: addEntries when MX server writes for temporary storage (e.g. alert existing IMAP connections)

// TODO: search filters like has:attachment
// TODO: run validate() on all docs before 'update' and 'insert'
// TODO: mx server forwarding (e.g. can forward to another mailserver such as gmail)
// TODO: auto-reply/vacation responder
// TODO: enforce maxDownload and maxUpload
// TODO: enforce 10-15 max connections per alias
// TODO: when user generates new password, if any existing were found, then prompt them to enter current password, complete captcha, and type out "I understand this message" and check a checkbox
// TODO: each R2 bucket seems like it's 18 TB max?

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
// - [ ] IMAP server needs onConnect to block spammers from denylist <https://github.com/nodemailer/wildduck/issues/540>
// - [ ] enforce billing for IMAP support
// - [ ] when users delete their account then delete all Emails, Messages, Attachments, Threads, and Mailboxes in the system (make this both a job and hook on delete)
// - [ ] auto expunge in bree job when message gets a Deleted flag
// - [ ] message.exp needs to be deleted after time (message.rtime) via background job
// - [ ] cleanup journal items (e.g. expire after 30d or something)

// TODO: other items
// - [ ] axe should parse out streams

// eslint-disable-next-line max-params
async function storeNodeBodies(db, wsp, session, maildata, mimeTree) {
  mimeTree.attachmentMap = {};
  for (const node of maildata.nodes) {
    // eslint-disable-next-line no-await-in-loop
    const attachment = await this.attachmentStorage.create(
      db,
      wsp,
      session,
      node
    );
    mimeTree.attachmentMap[node.attachmentId] = attachment.hash;
    const attachmentInfo =
      maildata.attachments &&
      maildata.attachments.find((a) => a.id === node.attachmentId);
    if (attachmentInfo && node.body) attachmentInfo.size = node.body.length;
  }

  return true;
}

class IMAP {
  constructor(options = {}, secure = env.IMAP_PORT === 2993) {
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

    //
    // NOTE: it is using a lock under `wildduck` prefix
    // (to override set `this.attachmentStorage.storage.lock = new Lock(...)`)
    //
    this.attachmentStorage = new AttachmentStorage();

    this.indexer = new Indexer({ attachmentStorage: this.attachmentStorage });
    this.indexer.storeNodeBodies = storeNodeBodies.bind(this.indexer);

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
    this.refreshSession = refreshSession.bind(this);
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async listen(port = env.IMAP_PORT, host = '::', ...args) {
    await pify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    await pify(this.server.close).bind(this.server)();
  }
}

module.exports = IMAP;
