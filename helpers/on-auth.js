/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const POP3Server = require('wildduck/lib/pop3/server');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pify = require('pify');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const { IMAPServer } = require('wildduck/imap-core');

const SMTPError = require('./smtp-error');
const ServerShutdownError = require('./server-shutdown-error');
const SocketError = require('./socket-error');
const email = require('./email');
const parseRootDomain = require('./parse-root-domain');
const refineAndLogError = require('./refine-and-log-error');
const validateAlias = require('./validate-alias');
const validateDomain = require('./validate-domain');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const env = require('#config/env');
const getQueryResponse = require('#helpers/get-query-response');
const i18n = require('#helpers/i18n');
const isValidPassword = require('#helpers/is-valid-password');
const onConnect = require('#helpers/on-connect');
const { encrypt } = require('#helpers/encrypt-decrypt');

const onConnectPromise = pify(onConnect);

async function onAuth(auth, session, fn) {
  this.logger.debug('AUTH', { auth, session });

  // TODO: credit system + domain billing rules (assigned billing manager -> person who gets credits deducted)
  // TODO: salt/hash/deprecate legacy API token + remove from API docs page
  // TODO: replace usage of config.recordPrefix with config.paidPrefix and config.freePrefix

  try {
    //
    // NOTE: until onConnect is available for IMAP and POP3 servers
    //       we leverage the existing SMTP helper in the interim
    //       <https://github.com/nodemailer/wildduck/issues/540>
    //       <https://github.com/nodemailer/wildduck/issues/721>
    //       (see this same comment in `helpers/on-connect.js`)
    //
    if (this.server instanceof IMAPServer || this.server instanceof POP3Server)
      await onConnectPromise.call(this, session);

    // check if server is in the process of shutting down
    if (this.isClosing) throw new ServerShutdownError();

    // NOTE: WildDuck POP3 server uses naming of `_closingTimeout` instead of `_closeTimeout`
    if (this.server._closingTimeout) throw new ServerShutdownError();

    // NOTE: WildDuck POP3 doesn't expose socket on session yet (also see similar comment in onAuth helper)
    // check if socket is still connected (only applicable for IMAP and POP3 servers)
    if (this.server instanceof IMAPServer) {
      const socket =
        (session.socket && session.socket._parent) || session.socket;
      if (!socket || socket?.destroyed || socket?.readyState !== 'open')
        throw new SocketError();
    }

    // NOTE: this is only required for WildDuck servers (IMAP/POP3)
    // override session.getQueryResponse (safeguard)
    if (this.server instanceof IMAPServer || this.server instanceof POP3Server)
      session.getQueryResponse = getQueryResponse;

    // username must be a valid email address
    if (
      typeof auth.username !== 'string' ||
      !isSANB(auth.username) ||
      !isEmail(auth.username.trim()) ||
      // <https://react.email/docs/integrations/nodemailer>
      auth.username === 'my_user' ||
      // <https://nodemailer.com/about/#example>
      auth.username === 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM'
    )
      throw new SMTPError(
        `Invalid username, please enter a valid email address (e.g. "alias@example.com"); use one of your domain's aliases at ${config.urls.web}/my-account/domains`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    let [name, domainName] = auth.username.trim().toLowerCase().split('@');

    // allow users to send/receive using "+" filter
    if (name && name.includes('+')) name = name.split('+')[0];

    domainName = punycode.toUnicode(domainName);

    // password must be valid
    if (
      typeof auth.password !== 'string' ||
      !isSANB(auth.password) ||
      auth.password.length > 128 ||
      // <https://react.email/docs/integrations/nodemailer>
      auth.password === 'my_password' ||
      // <https://nodemailer.com/about/#example>
      auth.password === 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
    )
      throw new SMTPError(
        `Invalid password, please try again or go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domainName
        )}/aliases and click "Generate Password"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    // trim password in-memory
    auth.password = auth.password.trim();

    const verifications = [];
    try {
      const records = await this.resolver.resolveTxt(domainName);
      for (const record_ of records) {
        const record = record_.join('').trim(); // join chunks together
        if (record.startsWith(config.paidPrefix))
          verifications.push(record.replace(config.paidPrefix, '').trim());
      }
    } catch (err) {
      this.logger.debug(err, { session, resolver: this.resolver });
    }

    if (verifications.length === 0)
      throw new SMTPError(
        `Domain is missing TXT verification record, go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domainName
        )} and click "Verify"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    if (verifications.length > 1)
      throw new SMTPError(
        `Domain has more than one TXT verification record, go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domainName
        )} and click "Verify"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    const domain = await Domains.findOne({
      name: domainName,
      verification_record: verifications[0],
      plan: { $in: ['enhanced_protection', 'team', 'enterprise'] }
    })
      .populate(
        'members.user',
        `id group plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} timezone`
      )
      .select('+tokens.hash +tokens.salt')
      .lean()
      .exec();

    // validate domain
    validateDomain(domain, domainName);

    let alias;
    if (name !== '*')
      alias = await Aliases.findOne({
        name,
        domain: domain._id
      })
        .populate(
          'user',
          `id ${config.userFields.isBanned} ${config.userFields.smtpLimit} email ${config.lastLocaleField} timezone`
        )
        .select('+tokens.hash +tokens.salt +is_rekey')
        .lean()
        .exec();

    // validate alias (will throw an error if !alias)
    if (
      alias ||
      this.server instanceof IMAPServer ||
      this.server instanceof POP3Server
    )
      validateAlias(alias, domain.name, name);

    //
    // validate the `auth.password` provided
    //

    // IMAP/POP3/CalDAV/CardDAV/API servers can only validate against aliases
    if (
      this.server instanceof IMAPServer ||
      this.server instanceof POP3Server ||
      (alias && this?.constructor?.name === 'CalDAV') ||
      (alias && this?.constructor?.name === 'CardDAV') ||
      (alias && this?.constructor?.name === 'API')
    ) {
      if (
        alias &&
        typeof alias.is_rekey === 'boolean' &&
        alias.is_rekey === true
      )
        throw new SMTPError(
          'Alias is undergoing a rekey operation, please try again once completed',
          {
            responseCode: 535,
            ignoreHook: true,
            imapResponse: 'AUTHENTICATIONFAILED'
          }
        );

      if (
        (alias && !Array.isArray(alias.tokens)) ||
        alias?.tokens?.length === 0
      )
        throw new SMTPError(
          `Alias does not have a generated password yet, go to ${
            config.urls.web
          }/my-account/domains/${punycode.toASCII(
            domain.name
          )}/aliases and click "Generate Password"`,
          {
            responseCode: 535,
            ignoreHook: true,
            imapResponse: 'AUTHENTICATIONFAILED'
          }
        );
    } else if (
      alias &&
      ((!Array.isArray(alias.tokens) && !Array.isArray(domain.tokens)) ||
        (alias?.tokens?.length === 0 && domain?.tokens?.length === 0))
    )
      // SMTP servers can validate against both alias and domain-wide tokens
      throw new SMTPError(
        `Alias does not have a generated password yet, go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domain.name
        )}/aliases and click "Generate Password"`,
        {
          responseCode: 535,
          ignoreHook: true,
          imapResponse: 'AUTHENTICATIONFAILED'
        }
      );

    //
    // rate limiting (checks if we have had more than 5 failed auth attempts in a row)
    //
    if (
      // do not rate limit IP addresses corresponding to our servers
      !session.resolvedClientHostname ||
      parseRootDomain(session.resolvedClientHostname) !== env.WEB_HOST
    ) {
      const count = await this.client.incrby(
        `auth_limit_${config.env}:${session.remoteAddress}`,
        0
      );
      if (count >= config.smtpLimitAuth) {
        throw new SMTPError(
          `You have exceeded the maximum number of failed authentication attempts. Please try again later or contact us at ${config.supportEmail}`,
          // { ignoreHook: true },
          {
            imapResponse: 'CONTACTADMIN'
          }
        );
      }
    }

    // ensure that the token is valid
    let isValid = false;
    if (alias && Array.isArray(alias.tokens) && alias.tokens.length > 0)
      isValid = await isValidPassword(alias.tokens, auth.password);

    //
    // NOTE: this is only applicable to SMTP servers (outbound mail)
    //       we allow users to use a generated token for the domain
    //
    if (
      !(this.server instanceof IMAPServer) &&
      !(this.server instanceof POP3Server) &&
      !isValid &&
      Array.isArray(domain.tokens) &&
      domain.tokens.length > 0
    )
      isValid = await isValidPassword(domain.tokens, auth.password);

    if (!isValid) {
      // increase failed counter by 1 iff new password was used
      const key = `auth_limit_${config.env}:${session.remoteAddress}`;
      const attemptsKey = `auth_attempts_${config.env}:${session.remoteAddress}`;
      const hash = revHash(auth.password);

      let previousPasswordHashes = await this.client.get(attemptsKey);
      if (isSANB(previousPasswordHashes)) {
        try {
          previousPasswordHashes = JSON.parse(previousPasswordHashes);
        } catch (err) {
          this.logger.fatal(err, { session, resolver: this.resolver });
        }
      }

      if (!Array.isArray(previousPasswordHashes)) previousPasswordHashes = [];

      if (!previousPasswordHashes.includes(hash)) {
        previousPasswordHashes.push(hash);
        await this.client
          .pipeline()
          .incrby(key, 1)
          .pexpire(key, config.smtpLimitAuthDuration)
          .set(
            attemptsKey,
            safeStringify(previousPasswordHashes),
            'PX',
            config.smtpLimitAuthDuration
          )
          .exec();
      }

      throw new SMTPError(
        `Invalid password, please try again or go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domainName
        )}/aliases and click "Generate Password"`,
        {
          responseCode: 535,
          imapResponse: 'AUTHENTICATIONFAILED',
          ignoreHook: true
        }
      );
    }

    // Clear authentication limit for this IP address
    await this.client.del(`auth_limit_${config.env}:${session.remoteAddress}`);

    // this also ensures that at least one admin has a verified email address
    const obj = await Domains.getToAndMajorityLocaleByDomain(domain);

    const to = [];

    // set default locale for translation for the session
    let locale = i18n.config.defaultLocale;
    locale =
      alias && alias.user[config.lastLocaleField]
        ? alias.user[config.lastLocaleField]
        : obj.locale;

    if (alias && alias.user.email) {
      to.push(alias.user.email);
    } else {
      to.push(...obj.to);
    }

    //
    // if we're on CalDAV server then as a weekly courtesy
    // if the user does not have SMTP enabled on the domain then
    // alert them by email to inform them they need to enable SMTP
    // (otherwise calendar invites will not be sent out automatically)
    //
    if (alias && this?.constructor?.name === 'CalDAV' && !domain.has_smtp) {
      this.client
        .get(`caldav_smtp_check:${domain.id}`)
        .then(async (cache) => {
          if (cache) return;
          try {
            await this.client.set(
              `caldav_smtp_check:${domain.id}`,
              true,
              'PX',
              ms('7d')
            );
            await email({
              template: 'alert',
              message: {
                to,
                bcc: config.email.message.from,
                subject: i18n.translate(
                  'CALDAV_SMTP_NOT_ENABLED_SUBJECT',
                  locale,
                  domain.name
                )
              },
              locals: {
                message: i18n.translate(
                  'CALDAV_SMTP_NOT_ENABLED_MESSAGE',
                  locale,
                  `${
                    config.urls.web
                  }/${locale}/my-account/domains/${punycode.toASCII(
                    domain.name
                  )}/verify-smtp`,
                  domain.name
                ),
                locale
              }
            });
          } catch (err) {
            this.logger.fatal(err, { session, resolver: this.resolver });
            // backoff for 30m for the next retry
            this.client
              .set(`caldav_smtp_check:${domain.id}`, true, 'PX', ms('30m'))
              .then()
              .catch((err) =>
                this.logger.fatal(err, { session, resolver: this.resolver })
              );
          }
        })
        .catch((err) =>
          this.logger.fatal(err, { session, resolver: this.resolver })
        );
    }

    //
    // if we're on IMAP/POP3/CalDAV/CardDAV/API server then as a weekly courtesy
    // if the user does not have IMAP storage enabled then
    // alert them by email to inform them they need to enable IMAP
    // (otherwise they're not going to have any mail received)
    //
    if (
      alias &&
      !alias.has_imap &&
      !_.isDate(alias.imap_not_enabled_sent_at) &&
      (this.server instanceof IMAPServer ||
        this.server instanceof POP3Server ||
        this?.constructor?.name === 'CalDAV' ||
        this?.constructor?.name === 'CardDAV' ||
        this?.constructor?.name === 'API' ||
        this?.constructor?.name === 'IMAP' ||
        this?.constructor?.name === 'POP3')
    ) {
      this.client
        .get(`imap_check:${alias.id}`)
        .then(async (cache) => {
          try {
            // TODO: we can remove imap_check cache check in future
            //       (this is for legacy compat for those that were sent in past 7d)
            if (cache) {
              await Aliases.findByIdAndUpdate(alias._id, {
                $set: {
                  imap_not_enabled_sent_at: new Date()
                }
              });
              return;
            }

            await email({
              template: 'alert',
              message: {
                to,
                subject: i18n.translate(
                  'IMAP_NOT_ENABLED_SUBJECT',
                  locale,
                  `${alias.name}@${domain.name}`
                )
              },
              locals: {
                message: i18n.translate(
                  'IMAP_NOT_ENABLED_MESSAGE',
                  locale,
                  `${alias.name}@${domain.name}`,
                  `${config.urls.web}/${locale}/my-account/domains/${
                    domain.name
                  }/aliases?q=${encodeURIComponent(
                    `${alias.name}@${domain.name}`
                  )}`,
                  `${alias.name}@${domain.name}`
                ),
                locale
              }
            });

            await Aliases.findByIdAndUpdate(alias._id, {
              $set: {
                imap_not_enabled_sent_at: new Date()
              }
            });
          } catch (err) {
            this.logger.fatal(err, { session, resolver: this.resolver });
            // backoff for 30m for the next retry
            this.client
              .set(`imap_check:${alias.id}`, true, 'PX', ms('30m'))
              .then()
              .catch((err) =>
                this.logger.fatal(err, { session, resolver: this.resolver })
              );
          }
        })
        .catch((err) =>
          this.logger.fatal(err, { session, resolver: this.resolver })
        );

      // throw an error
      throw new SMTPError(
        `Alias does not have IMAP enabled, go to ${
          config.urls.web
        }/my-account/domains/${punycode.toASCII(
          domain.name
        )}/aliases and click "Edit" to enable IMAP storage`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );
    }

    // if any of the domain admins are admins then don't rate limit concurrent connections
    const adminExists = domain.members.some((m) => {
      return m.group === 'admin' && m?.user?.group === 'admin';
    });

    //
    // NOTE: this connection rate limiting is ONLY applied for IMAP and SMTP servers
    //       (see `imap-notifier.js`'s releaseConnection function)
    //       (and `onClose` handler of SMTP)
    //
    // ensure we don't have more than 60 connections per alias
    // (or per domain if we're using a catch-all)
    //
    // NOTE: this is only for non-DAV and non POP3 servers
    //       (it doesn't apply to POP3 until this is GH issue is resolved)
    //       <https://github.com/nodemailer/wildduck/issues/629>
    //
    if (
      this?.constructor?.name !== 'CalDAV' &&
      this?.constructor?.name !== 'CardDAV' &&
      this?.constructor?.name !== 'API' &&
      this?.constructor?.name !== 'POP3' &&
      this.server &&
      !(this.server instanceof POP3Server) // not needed but keeping here anyways
    ) {
      const key = `concurrent_${this.constructor.name.toLowerCase()}_${
        config.env
      }:${alias ? alias.id : domain.id}`;
      const count = await this.client.incrby(key, 0);
      if (count < 0) await this.client.del(key); // safeguard
      else if (!adminExists && count > 60) {
        // alert owner by email
        this.client
          .get(`concurrent_check:${alias ? alias.id : domain.id}`)
          .then(async (cache) => {
            if (cache) return;
            try {
              await this.client.set(
                `concurrent_check:${alias ? alias.id : domain.id}`,
                true,
                'PX',
                ms('7d')
              );
              await email({
                template: 'alert',
                message: {
                  to,
                  bcc: config.email.message.from,
                  subject: i18n.translate(
                    'CONCURRENCY_EXCEEDED_SUBJECT',
                    locale,
                    alias ? `${alias.name}@${domain.name}` : domain.name
                  )
                },
                locals: {
                  message: i18n.translate(
                    'CONCURRENCY_EXCEEDED_MESSAGE',
                    locale,
                    alias ? `${alias.name}@${domain.name}` : domain.name
                  ),
                  locale
                }
              });
            } catch (err) {
              this.logger.fatal(err, { session, resolver: this.resolver });
              // backoff for 30m for the next retry
              this.client
                .set(
                  `concurrent_check:${alias ? alias.id : domain.id}`,
                  true,
                  'PX',
                  ms('30m')
                )
                .then()
                .catch((err) =>
                  this.logger.fatal(err, { session, resolver: this.resolver })
                );
            }
          })
          .catch((err) =>
            this.logger.fatal(err, { session, resolver: this.resolver })
          );
        throw new SMTPError('Too many concurrent connections', {
          responseCode: 421
        });
      }

      // TODO: we need to use rate limiting concept here where it's rolling as opposed to fix
      // increase counter for alias by 1 (with ttl safeguard)
      await this.client
        .pipeline()
        .incr(key)
        .pexpire(key, config.socketTimeout)
        .exec();
    }

    // prepare user object for `session.user`
    // <https://github.com/nodemailer/wildduck/issues/510>
    let timeZone = 'America/Chicago';
    if (alias?.user?.timezone) {
      timeZone = alias.user.timezone;
    } else {
      const adminMember = domain.members.find(
        (m) => m.group === 'admin' && m?.user?.timezone
      );
      if (adminMember) timeZone = adminMember.timezone;
    }

    const user = {
      // support domain-wide catch-all by conditionally checking `alias` below:
      id: alias ? alias.id : domain.id,
      username: alias
        ? `${alias.name}@${domain.name}`
        : auth.username.trim().toLowerCase(),
      ...(alias
        ? {
            alias_id: alias.id,
            alias_name: alias.name,
            storage_location: alias.storage_location
          }
        : {}),
      [config.lastLocaleField]:
        alias && alias.user && alias.user[config.lastLocaleField]
          ? alias.user[config.lastLocaleField]
          : i18n.config.defaultLocale,
      domain_id: domain.id,
      domain_name: domain.name,
      // safeguard to encrypt in-memory
      password: encrypt(auth.password),
      //
      // NOTE: if `has_pgp` or `public_key` gets updated then
      //       they will be refreshed automatically via websockets
      //       (see update alias controller)
      //
      // NOTE: these fields will refresh in `refreshSession` helper
      //
      // pgp support
      ...(alias && alias.has_pgp
        ? {
            alias_has_pgp: alias.has_pgp,
            alias_public_key: alias.public_key
          }
        : {}),
      // NOTE: this field will refresh in `refreshSession` helper
      locale,
      // NOTE: this field will refresh in `refreshSession` helper
      owner_full_email: to,
      // NOTE: this gets updated every time user logs in a browser and loads a page
      timezone: timeZone
    };

    // this response object sets `session.user` to have `domain` and `alias`
    // <https://github.com/nodemailer/smtp-server/blob/a570d0164e4b4ef463eeedd80cadb37d5280e9da/lib/sasl.js#L235>
    fn(null, { user });

    //
    // if we're on IMAP or POP3 server then sync messages with user
    //
    if (
      alias &&
      alias.has_imap &&
      (this.server instanceof IMAPServer ||
        this.server instanceof POP3Server) &&
      this.wsp
    ) {
      // sync with tmp db
      this.wsp
        .request(
          {
            action: 'sync',
            session: { user }
          },
          0
        )
        .then((sync) => {
          this.logger.debug('tmp db sync complete', { sync, session });
        })
        .catch((err) =>
          this.logger.fatal(err, { session, resolver: this.resolver })
        );

      // daily backup (run in background)
      this.wsp
        .request(
          {
            action: 'backup',
            backup_at: new Date().toISOString(),
            session: { user }
          },
          0
        )
        .then((backup) => {
          this.logger.debug('backup complete', { backup, session });
        })
        .catch((err) => this.logger.debug(err, { session }));
    }
  } catch (err) {
    //
    // NOTE: if err.response === 'NO' then WildDuck POP3 will return error message too
    //       similarly if `error.response` is set then IMAP will return that instead of TEMPFAIL
    //
    // NOTE: we should actually share error message if it was not a code bug
    //       (otherwise it won't be intuitive to users if they're late on payment)
    //       (and we now do this via "ALERT" `imapResponse` code set in refineAndLogError
    //
    // <https://github.com/nodemailer/smtp-server/blob/a570d0164e4b4ef463eeedd80cadb37d5280e9da/lib/sasl.js#L189-L222>
    // <https://github.com/nodemailer/wildduck/issues/726>
    const error = refineAndLogError(
      err,
      session,
      this.server instanceof IMAPServer,
      this
    );
    error.response = 'NO';
    fn(error);
  }
}

module.exports = onAuth;
