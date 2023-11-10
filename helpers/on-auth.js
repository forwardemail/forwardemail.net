/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { IMAPServer } = require('wildduck/imap-core');
const { isEmail } = require('validator');

const SMTPError = require('./smtp-error');
const ServerShutdownError = require('./server-shutdown-error');
const SocketError = require('./socket-error');
const parseRootDomain = require('./parse-root-domain');
const refineAndLogError = require('./refine-and-log-error');
const validateAlias = require('./validate-alias');
const validateDomain = require('./validate-domain');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const env = require('#config/env');
const onConnect = require('#helpers/smtp/on-connect');
const { encrypt } = require('#helpers/encrypt-decrypt');

const onConnectPromise = pify(onConnect);

// eslint-disable-next-line complexity
async function onAuth(auth, session, fn) {
  this.logger.debug('AUTH', { auth, session });

  // TODO: credit system + domain billing rules (assigned billing manager -> person who gets credits deducted)
  // TODO: salt/hash/deprecate legacy API token + remove from API docs page
  // TODO: replace usage of config.recordPrefix with config.paidPrefix and config.freePrefix

  //
  // TODO: add support for domain-wide tokens (right now it's only alias-specific)
  // `auth.username` must be an alias that exists in the system
  // `auth.password` must be domain-wide or alias-specific generated token
  // (password visible only once to user upon creation)
  //
  try {
    //
    // NOTE: until onConnect is available for IMAP server
    //       we leverage the existing SMTP helper in the interim
    //       <https://github.com/nodemailer/wildduck/issues/540>
    //
    if (this.server instanceof IMAPServer)
      await onConnectPromise.call(this, session);

    // check if server is in the process of shutting down
    if (this.server._closeTimeout) throw new ServerShutdownError();

    // check if socket is still connected (only applicable for IMAP)
    if (this.server instanceof IMAPServer) {
      const socket =
        (session.socket && session.socket._parent) || session.socket;
      if (!socket || socket?.destroyed || socket?.readyState !== 'open')
        throw new SocketError();
    }

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

    domainName = punycode.toUnicode(domainName);

    // password must be a 24 character long generated string
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
        `Invalid password, please try again or go to ${config.urls.web}/my-account/domains/${domainName}/aliases and click "Generate Password"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    const verifications = [];
    try {
      const records = await this.resolver.resolveTxt(domainName);
      for (const record_ of records) {
        const record = record_.join('').trim(); // join chunks together
        if (record.startsWith(config.paidPrefix))
          verifications.push(record.replace(config.paidPrefix, '').trim());
      }
    } catch (err) {
      this.logger.error(err, { session });
    }

    if (verifications.length === 0)
      throw new SMTPError(
        `Domain is missing TXT verification record, go to ${config.urls.web}/my-account/domains/${domainName} and click "Verify"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    if (verifications.length > 1)
      throw new SMTPError(
        `Domain has more than one TXT verification record, go to ${config.urls.web}/my-account/domains/${domainName} and click "Verify"`,
        {
          responseCode: 535,
          ignoreHook: true
        }
      );

    const domain = await Domains.findOne({
      name: domainName,
      verification_record: verifications[0],
      plan: { $ne: 'free' }
    })
      .populate(
        'members.user',
        `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
      )
      .lean()
      .exec();

    // validate domain
    validateDomain(domain, domainName);

    const alias = await Aliases.findOne({
      name,
      domain: domain._id
    })
      .populate(
        'user',
        `id ${config.userFields.isBanned} ${config.userFields.smtpLimit}`
      )
      .select('+tokens.hash +tokens.salt')
      .lean()
      .exec();

    // validate alias
    validateAlias(alias, domain, name);

    // validate the `auth.password` provided
    if (!Array.isArray(alias.tokens) || alias.tokens.length === 0)
      throw new SMTPError(
        `Alias does not have a generated password yet, go to ${config.urls.web}/my-account/domains/${domain.name}/aliases and click "Generate Password"`,
        {
          responseCode: 535,
          ignoreHook: true
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
      if (count >= config.smtpLimitAuth)
        throw new SMTPError(
          `You have exceeded the maximum number of failed authentication attempts. Please try again later or contact us at ${config.supportEmail}`
          // { ignoreHook: true }
        );
    }

    // ensure that the token is valid
    const isValid = await Aliases.isValidPassword(
      alias.tokens,
      auth.password.trim()
    );

    if (!isValid) {
      // increase failed counter by 1
      await this.client.incrby(
        `auth_limit_${config.env}:${session.remoteAddress}`,
        1
      );
      await this.client.pexpire(
        `auth_limit_${config.env}:${session.remoteAddress}`,
        config.smtpLimitAuthDuration
      );
      throw new SMTPError(
        `Invalid password, please try again or go to ${config.urls.web}/my-account/domains/${domainName}/aliases and click "Generate Password"`,
        {
          responseCode: 535
          // ignoreHook: true
        }
      );
    }

    // Clear authentication limit for this IP address
    await this.client.del(`auth_limit_${config.env}:${session.remoteAddress}`);

    // prepare user object for `session.user`
    const user = {
      // <https://github.com/nodemailer/wildduck/issues/510>
      id: alias.id,
      username: `${alias.name}@${domain.name}`,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      // TODO: we probably don't need to encrypt but just a safeguard
      //       (the `helpers/logger` already strips `session.user.password` from logs)
      password: encrypt(auth.password.trim()),
      storage_location: alias.storage_location
    };

    // this response object sets `session.user` to have `domain` and `alias`
    // <https://github.com/nodemailer/smtp-server/blob/a570d0164e4b4ef463eeedd80cadb37d5280e9da/lib/sasl.js#L235>
    fn(null, { user });
  } catch (err) {
    //
    // NOTE: we should actually share error message if it was not a code bug
    //       (otherwise it won't be intuitive to users if they're late on payment)
    //
    // <https://github.com/nodemailer/smtp-server/blob/a570d0164e4b4ef463eeedd80cadb37d5280e9da/lib/sasl.js#L189-L222>
    fn(refineAndLogError(err, session, this.server instanceof IMAPServer));
  }
}

module.exports = onAuth;
