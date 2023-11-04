/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');
const { boolean } = require('boolean');

const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const env = require('#config/env');
const parseRootDomain = require('#helpers/parse-root-domain');
const refineAndLogError = require('#helpers/refine-and-log-error');

async function onConnect(session, fn) {
  this.logger.debug('CONNECT', { session });

  if (this.server._closeTimeout) return fn(new ServerShutdownError());

  // this is used for setting Date header if missing on SMTP submission
  session.arrivalDate = new Date();

  // lookup the client hostname
  try {
    const [clientHostname] = await this.resolver.reverse(session.remoteAddress);
    if (isFQDN(clientHostname)) {
      // do we need this still (?)
      let domain = clientHostname.toLowerCase().trim();
      try {
        domain = punycode.toASCII(domain);
      } catch {
        // ignore punycode conversion errors
      }

      session.resolvedClientHostname = domain;
    }
  } catch (err) {
    //
    // NOTE: the native Node.js DNS module would throw an error previously
    //       <https://github.com/nodejs/node/issues/3112#issuecomment-1452548779>
    //
    if (env.NODE_ENV !== 'production') this.logger.debug(err, { session });
  }

  try {
    // get root domain if available
    let rootDomain;
    if (session.resolvedClientHostname)
      rootDomain = parseRootDomain(session.resolvedClientHostname);

    // check if allowlisted
    const result = await this.client.get(
      `allowlist:${rootDomain || session.remoteAddress}`
    );

    if (!boolean(result)) {
      //
      // prevent connections from backscatter, silent ban, and denylist
      //
      const arr = [
        `backscatter:${session.remoteAddress}`,
        `denylist:${session.remoteAddress}`,
        `silent:${session.remoteAddress}`
      ];

      if (rootDomain)
        arr.push(
          `backscatter:${rootDomain}`,
          `denylist:${rootDomain}`,
          `silent:${rootDomain}`
        );

      const results = await this.client.mget(arr);

      if (results.some((result) => boolean(result))) {
        throw new SMTPError(
          `The ${rootDomain ? 'domain' : 'IP'} ${
            rootDomain || session.remoteAddress
          } is denylisted by ${
            config.urls.web
          }. To request removal, you must visit ${config.urls.web}/denylist?q=${
            rootDomain || session.remoteAddress
          }.`,
          { ignoreHook: true }
        );
      }
    }

    fn();
  } catch (err) {
    fn(refineAndLogError(err, session));
  }
}

module.exports = onConnect;
