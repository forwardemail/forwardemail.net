/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const tls = require('node:tls');

const RateLimiter = require('async-ratelimiter');
const bytes = require('@forwardemail/bytes');
const ms = require('ms');
const pify = require('pify');
const { SMTPServer } = require('smtp-server');

const _ = require('#helpers/lodash');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
const env = require('#config/env');
const isLockingError = require('#helpers/is-locking-error');
const isMongoError = require('#helpers/is-mongo-error');
const isRedisError = require('#helpers/is-redis-error');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const onClose = require('#helpers/on-close');
const onConnect = require('#helpers/on-connect');
const onData = require('#helpers/on-data');
const onMailFrom = require('#helpers/on-mail-from');
const onRcptTo = require('#helpers/on-rcpt-to');

const MAX_BYTES = bytes(env.SMTP_MESSAGE_MAX_SIZE);

// Force enable TLS 1.0 (if node_args approach is not used, safety net)
if (env.SMTP_TLS_MIN_VERSION === 'TLSv1') {
  tls.DEFAULT_MIN_VERSION = 'TLSv1';
}

class SMTP {
  constructor(
    options = {},
    secure = env.SMTP_PORT === 465 ||
      env.SMTP_PORT === 2465 ||
      env.SMTP_PORT === 2455
  ) {
    this.client = options.client;

    const resolver = createTangerine(this.client, logger);

    this.resolver = resolver;

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

    // setup our smtp server which listens for incoming email
    // TODO: <https://github.com/nodemailer/smtp-server/issues/177>
    this.server = new SMTPServer({
      // <https://github.com/nodemailer/smtp-server/pull/222>
      resolver,

      // <https://github.com/nodemailer/smtp-server/pull/192>
      authRequiredMessage: config.authRequiredMessage,

      //
      // TODO: customize `heloResponse`
      // <https://github.com/nodemailer/smtp-server/commit/7c8279f4c2ea3d19d27efaa54d8378f12de3f986>
      //

      //
      // most of these options mirror the FE forwarding server options
      //
      hideENHANCEDSTATUSCODES: false,
      hideDSN: false,
      size: MAX_BYTES,
      onData: onData.bind(this),
      onConnect: onConnect.bind(this),
      onClose: onClose.bind(this),
      onAuth: onAuth.bind(this),
      onMailFrom: onMailFrom.bind(this),
      onRcptTo: onRcptTo.bind(this),
      // NOTE: we don't need to set a value for maxClients
      //       since we have rate limiting enabled by IP
      // maxClients: Infinity, // default is Infinity
      // allow 3m to process bulk RCPT TO
      socketTimeout: config.socketTimeout,
      // <https://brooker.co.za/blog/2024/05/09/nagle.html>
      // <https://nodejs.org/api/net.html#netcreateserveroptions-connectionlistener>
      noDelay: true,
      // default closeTimeout is 30s
      closeTimeout: ms('30s'),
      // <https://github.com/nodemailer/smtp-server/issues/177>
      disableReverseLookup: true,
      logger: this.logger,

      disabledCommands: secure ? ['STARTTLS'] : [],
      secure,
      needsUpgrade: secure,
      authMethods: ['PLAIN', 'LOGIN'], // XOAUTH2, CRAM-MD5

      // just in case smtp-server changes default and patch semver bump (unlikely but safeguard )
      allowInsecureAuth:
        config.env === 'production' ? false : env.SMTP_ALLOW_INSECURE_AUTH,
      authOptional: false,

      // <https://github.com/nodemailer/wildduck/issues/563>
      // hide8BITMIME: true,

      // Enable REQUIRETLS support (RFC 8689)
      //
      // NOTE: REQUIRETLS is now enabled in production to support
      //       security vendors that require this extension
      //
      hideREQUIRETLS: false,

      // keys and TLS options together
      ...(config.env === 'production'
        ? {
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH),
            ...(env.SMTP_TLS_MIN_VERSION
              ? { minVersion: env.SMTP_TLS_MIN_VERSION }
              : {}),
            ...(env.SMTP_TLS_MAX_VERSION
              ? { maxVersion: env.SMTP_TLS_MAX_VERSION }
              : {})
          }
        : {
            ...(env.SMTP_TLS_MIN_VERSION
              ? { minVersion: env.SMTP_TLS_MIN_VERSION }
              : {}),
            ...(env.SMTP_TLS_MAX_VERSION
              ? { maxVersion: env.SMTP_TLS_MAX_VERSION }
              : {})
          }),

      // override with any options passed (useful for testing)
      ..._.omit(options, ['client'])
    });

    // override logger
    this.server.logger = this.logger;

    // kind of hacky but I filed a GH issue
    // <https://github.com/nodemailer/smtp-server/issues/135>
    this.server.address = this.server.server.address.bind(this.server.server);

    this.server.on('error', (err) => {
      err.is_server_error = true;
      if (
        !isRetryableError(err) ||
        isRedisError(err) ||
        isMongoError(err) ||
        isLockingError(err)
      )
        logger.error(err);
      else logger.debug(err);
    });

    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  async listen(port = env.SMTP_PORT, host = '::', ...args) {
    await pify(this.server.listen).bind(this.server)(port, host, ...args);
  }

  async close() {
    await pify(this.server.close).bind(this.server);
  }
}

module.exports = SMTP;
