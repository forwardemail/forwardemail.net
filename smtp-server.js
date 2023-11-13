/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const Axe = require('axe');
const RateLimiter = require('async-ratelimiter');
const bytes = require('bytes');
const ms = require('ms');
const pify = require('pify');
const { SMTPServer } = require('smtp-server');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const onAuth = require('#helpers/on-auth');
const smtp = require('#helpers/smtp');

const MAX_BYTES = bytes(env.SMTP_MESSAGE_MAX_SIZE);

function onClose(session) {
  // ignore unauthenticated sessions
  if (!session?.user?.alias_id) return;
  // decrease # connections for this alias (or domain if using catch-all)
  const key = `connections_${config.env}:${
    session.user.alias_id || session.user.domain_id
  }`;
  this.client
    .pipeline()
    .decr(key)
    .pexpire(key, ms('1h'))
    .exec()
    .then()
    .catch((err) => logger.fatal(err));
}

class SMTP {
  //
  // NOTE: we port forward 25, 587, and 2525 -> 2587 (and 2587 is itself available)
  // NOTE: we port forward 465 -> 2465 (and 2465 is itself available)
  // NOTE: on IPv6 we cannot port forward 25, 587, 2525, and 465 since ufw not support REDIRECT for ipv6
  //       therefore we use socat in a systemd service that's always running
  //       (this is still a more lightweight approach than having multiple processes running to cover all the ports)
  //
  constructor(options = {}, secure = env.SMTP_PORT === 2465) {
    this.client = options.client;
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

    // setup our smtp server which listens for incoming email
    // TODO: <https://github.com/nodemailer/smtp-server/issues/177>
    this.server = new SMTPServer({
      // <https://github.com/nodemailer/smtp-server/pull/192>
      authRequiredMessage: config.authRequiredMessage,

      //
      // most of these options mirror the FE forwarding server options
      //
      size: MAX_BYTES,
      onData: smtp.onData.bind(this),
      onConnect: smtp.onConnect.bind(this),
      onClose: onClose.bind(this),
      onAuth: onAuth.bind(this),
      onMailFrom: smtp.onMailFrom.bind(this),
      onRcptTo: smtp.onRcptTo.bind(this),
      // NOTE: we don't need to set a value for maxClients
      //       since we have rate limiting enabled by IP
      // maxClients: Infinity, // default is Infinity
      // allow 3m to process bulk RCPT TO
      socketTimeout: ms('180s'),
      // default closeTimeout is 30s
      closeTimeout: ms('30s'),
      // <https://github.com/nodemailer/smtp-server/issues/177>
      disableReverseLookup: true,
      logger: this.logger,

      disabledCommands: secure ? ['STARTTLS'] : [],
      secure,
      needsUpgrade: secure,
      authMethods: ['PLAIN', 'LOGIN'], // XOAUTH2, CRAM-MD5

      // just in case smtp-server changes default and patch semver bump (unlikely but safeguard)
      allowInsecureAuth:
        config.env === 'production' ? false : env.SMTP_ALLOW_INSECURE_AUTH,
      authOptional: false,

      // keys
      ...(config.env === 'production'
        ? {
            key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
            cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
            ca: fs.readFileSync(env.WEB_SSL_CA_PATH)
          }
        : {})
    });

    // override logger
    this.server.logger = this.logger;

    // kind of hacky but I filed a GH issue
    // <https://github.com/nodemailer/smtp-server/issues/135>
    this.server.address = this.server.server.address.bind(this.server.server);

    this.server.on('error', (err) => {
      logger.error(err);
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
