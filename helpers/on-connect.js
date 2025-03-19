/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');
const POP3Server = require('wildduck/lib/pop3/server');
const { IMAPServer } = require('wildduck/imap-core');

const SMTPError = require('#helpers/smtp-error');
const DenylistError = require('#helpers/denylist-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const env = require('#config/env');
const isAllowlisted = require('#helpers/is-allowlisted');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const refineAndLogError = require('#helpers/refine-and-log-error');

const HOSTNAME = os.hostname();

// eslint-disable-next-line complexity
async function onConnect(session, fn) {
  this.logger.debug('CONNECT', { session });

  if (this.isClosing) return fn(new ServerShutdownError());

  const isPOP = this.server instanceof POP3Server;
  const isIMAP = this.server instanceof IMAPServer;

  try {
    // this is used for setting Date header if missing on SMTP submission
    session.arrivalDate = new Date();

    // this is used for sending bounces for MX server
    session.arrivalDateFormatted = session.arrivalDate
      .toISOString()
      .split('T')[0];

    // this is used for greylisting and in other places
    session.arrivalTime = session.arrivalDate.getTime();

    // lookup the client hostname
    try {
      const [clientHostname] = await this.resolver.reverse(
        session.remoteAddress
      );
      if (isFQDN(clientHostname)) {
        // do we need this still (?)
        let domain = clientHostname.toLowerCase().trim();
        try {
          domain = punycode.toASCII(domain);
        } catch {
          // ignore punycode conversion errors
        }

        session.resolvedClientHostname = domain;
        session.resolvedRootClientHostname = parseRootDomain(
          session.resolvedClientHostname
        );
      }
    } catch (err) {
      //
      // NOTE: the native Node.js DNS module would throw an error previously
      //       <https://github.com/nodejs/node/issues/3112#issuecomment-1452548779>
      //
      if (env.NODE_ENV !== 'production') this.logger.debug(err, { session });
    }

    // check against hard-coded denylist
    let isDenylisted = false;

    if (
      session.resolvedClientHostname &&
      config.denylist.has(session.resolvedClientHostname)
    )
      isDenylisted = session.resolvedClientHostname;
    else if (
      session.resolvedRootClientHostname &&
      config.denylist.has(session.resolvedRootClientHostname)
    )
      isDenylisted = session.resolvedRootClientHostname;
    else if (config.denylist.has(session.remoteAddress))
      isDenylisted = session.remoteAddress;

    if (isDenylisted && !isPOP && !isIMAP) {
      const err = new DenylistError(
        `The value ${isDenylisted} is denylisted by ${config.urls.web} ; To request removal, you must visit ${config.urls.web}/denylist?q=${isDenylisted} ;`,
        550,
        isDenylisted
      );
      throw err;
    }

    //
    // check if the connecting remote IP address is allowlisted
    //
    session.isAllowlisted = false;
    if (!isDenylisted) {
      if (
        session.resolvedClientHostname &&
        session.resolvedRootClientHostname
      ) {
        // check the root domain
        session.isAllowlisted = await isAllowlisted(
          session.resolvedRootClientHostname,
          this.client,
          this.resolver
        );
        if (session.isAllowlisted) {
          session.allowlistValue = session.resolvedRootClientHostname;
        } else if (
          session.resolvedRootClientHostname !== session.resolvedClientHostname
        ) {
          // if differed, check the sub-domain
          session.isAllowlisted = await isAllowlisted(
            session.resolvedClientHostname,
            this.client,
            this.resolver
          );

          if (session.isAllowlisted)
            session.allowlistValue = session.resolvedClientHostname;
        }
      }

      if (!session.isAllowlisted) {
        session.isAllowlisted = await isAllowlisted(
          session.remoteAddress,
          this.client,
          this.resolver
        );
        if (session.isAllowlisted)
          session.allowlistValue = session.remoteAddress;
      }
    }
  } catch (err) {
    return fn(refineAndLogError(err, session, false, this));
  }

  // safeguard in case we recursively connect to our own server
  // (this should NOT happen, and can result in OOM/CPU issues)
  if (session.resolvedRootClientHostname === env.WEB_HOST) {
    const err = new TypeError(
      `${HOSTNAME} detected recursive connection from ${session.resolvedClientHostname} (${session.remoteAddress})`
    );
    err.isCodeBug = true;
    err.session = session;
    logger.fatal(err);
  }

  try {
    // TODO: we need to use rate limiting concept here where it's rolling as opposed to fix
    // NOTE: do not change this prefix unless you also change it in `helpers/on-close.js`
    const prefix = `concurrent_${this.constructor.name.toLowerCase()}_${
      config.env
    }`;
    const key = `${prefix}:${session.remoteAddress}`;
    const count = await this.client.incr(key);
    await this.client.pexpire(key, config.socketTimeout);

    // NOTE if more than 50 connections open in 3m then alert admins
    if (count >= 50 && session.isAllowlisted) {
      const err = new TypeError(
        `${HOSTNAME} detected 50+ connections from ${
          session.resolvedRootClientHostname ||
          session.resolvedClientHostname ||
          session.remoteAddress
        } (${session.allowlistValue})`
      );
      err.isCodeBug = true;
      err.session = session;
      logger.fatal(err);
    }

    //
    // NOTE: we do not check in onConnect for denylist/silent/backscatter in MX server
    //       because we need to let users know of a given email/sender that was rejected
    //       so we need to store a log for it with subject, RCPT TO, MAIL FROM, etc
    //       and if we were to throw an error here if someone was denylisted for instance,
    //       then the connection would not proceed to onRcptTo, onMailFrom, etc
    //       and therefore it would not be possible to store an error log for this case
    //
    //       additionally, we do not check against denylist/silent/backscatter for SMTP server
    //       because AUTH is required for a user to access the SMTP server anyways
    //

    //
    // TODO: we need to do this for all other cloud providers (e.g. via a maintained list)
    //       <https://github.com/MISP/misp-warninglists>
    //       <https://github.com/dalisoft/awesome-hosting?tab=readme-ov-file#web-services-platform>
    //
    // NOTE: due to high amount of connections from AWS spammers on IMAP/POP3 we are preventing connection abuse
    //
    const isAWS =
      session.resolvedRootClientHostname &&
      ['amazonaws.com', 'amazonses.com'].includes(
        session.resolvedRootClientHostname
      );

    if (session.isAllowlisted && !isAWS) return fn();

    //
    // NOTE: until onConnect is available for IMAP and POP3 servers
    //       we leverage the existing SMTP helper in the interim
    //       <https://github.com/nodemailer/wildduck/issues/540>
    //       <https://github.com/nodemailer/wildduck/issues/721>
    //       (see this same comment in `helpers/on-auth.js`)
    //

    // NOTE: auth is handled for POP3/IMAP in onAuth so we don't throw concurrency issue here
    if (isPOP || isIMAP) return fn();

    // do not allow more than 10 concurrent connections using constructor
    if (count > 10) {
      // const err = new TypeError(
      //   `${HOSTNAME} detected 10+ connections from ${
      //     session.resolvedClientHostname || session.remoteAddress
      //   }`
      // );
      // err.isCodeBug = true;
      // err.session = session;
      // logger.fatal(err);
      throw new SMTPError(
        `Too many concurrent connections from ${session.remoteAddress}`,
        { responseCode: 421, ignoreHook: true }
      );
    }

    fn();
  } catch (err) {
    fn(refineAndLogError(err, session, false, this));
  }
}

module.exports = onConnect;
