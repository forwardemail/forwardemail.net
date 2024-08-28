/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');

const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const env = require('#config/env');
const isAllowlisted = require('#helpers/is-allowlisted');
const parseRootDomain = require('#helpers/parse-root-domain');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onConnect(session, fn) {
  this.logger.debug('CONNECT', { session });

  if (this.isClosing) return fn(new ServerShutdownError());

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

    //
    // check if the connecting remote IP address is allowlisted
    //
    session.isAllowlisted = false;
    if (session.resolvedClientHostname && session.resolvedRootClientHostname) {
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
      if (session.isAllowlisted) session.allowlistValue = session.remoteAddress;
    }
  } catch (err) {
    return fn(refineAndLogError(err, session, false, this));
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
  // NOTE: we return early here because we do not want to limit concurrent connections from allowlisted values
  //
  //
  if (session.isAllowlisted) return fn();

  //
  // do not allow more than 10 concurrent connections using constructor
  //
  try {
    // NOTE: do not change this prefix unless you also change it in `helpers/on-close.js`
    const prefix = `concurrent_${this.constructor.name.toLowerCase()}_${
      config.env
    }`;
    const key = `${prefix}:${session.remoteAddress}`;
    const count = await this.client.incr(key);
    await this.client.pexpire(key, config.socketTimeout);
    if (count >= 10)
      throw new SMTPError(
        `Too many concurrent connections from ${session.remoteAddress}`,
        { responseCode: 421, ignoreHook: true }
      );
    fn();
  } catch (err) {
    fn(refineAndLogError(err, session, false, this));
  }
}

module.exports = onConnect;
