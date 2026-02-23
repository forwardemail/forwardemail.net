/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// const os = require('node:os');
const punycode = require('node:punycode');
const { isIP } = require('node:net');

const isFQDN = require('is-fqdn');
const POP3Server = require('@zone-eu/wildduck/lib/pop3/server');
const { IMAPServer } = require('@zone-eu/wildduck/imap-core');

const SMTPError = require('#helpers/smtp-error');
const DenylistError = require('#helpers/denylist-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const env = require('#config/env');
const isAllowlisted = require('#helpers/is-allowlisted');
// const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const refineAndLogError = require('#helpers/refine-and-log-error');

/**
 * OPTIMIZATION: Helper function to process and normalize hostnames
 * Extracted to avoid code duplication (lines 166-176 and 239-249)
 * @param {string} hostname - The hostname to process
 * @returns {object|null} - Processed hostname data or null if invalid
 */
function processHostname(hostname) {
  if (!hostname || !isFQDN(hostname)) return null;

  let domain = hostname.toLowerCase().trim();
  try {
    domain = punycode.toASCII(domain);
  } catch {
    // Ignore punycode conversion errors
    return null;
  }

  return {
    domain,
    rootDomain: parseRootDomain(domain)
  };
}

// const HOSTNAME = os.hostname();

/**
 * Parse client IP from SMTP EHLO message
 * Expected format: EHLO [192.168.1.100] or EHLO [::1]
 * @param {string} hostNameAppearsAs - The EHLO hostname
 * @returns {string|null} - Extracted IP address or null
 */
function parseIpFromEhlo(hostNameAppearsAs) {
  if (!hostNameAppearsAs || typeof hostNameAppearsAs !== 'string') return null;

  // Match IP in brackets: [192.168.1.100] or [::1]
  const match = hostNameAppearsAs.match(/^\[([^\]]+)]$/);
  if (!match) return null;

  const ip = match[1];
  // Validate it's a valid IP address
  if (isIP(ip)) return ip;

  return null;
}

/**
 * Parse client IP from IMAP/POP3 ID command
 * Expected format from RFC 2971 ID command: contains "client-ip" parameter
 * The clientId might be a string like: "name" "SnappyMail" "version" "2.x" "client-ip" "192.168.1.100"
 * @param {string|object} clientId - The client ID from session
 * @returns {string|null} - Extracted IP address or null
 */
function parseIpFromClientId(clientId) {
  if (!clientId) return null;

  let idString = '';

  // Handle if clientId is an object
  if (typeof clientId === 'object') {
    // Check if it has a client-ip property
    if (clientId['client-ip']) {
      const ip = clientId['client-ip'];
      if (isIP(ip)) return ip;
    }

    // Try to convert to string for parsing
    try {
      idString = JSON.stringify(clientId);
    } catch {
      return null;
    }
  } else if (typeof clientId === 'string') {
    idString = clientId;
  } else {
    return null;
  }

  // Try to extract client-ip from string format
  // Match patterns like: "client-ip" "192.168.1.100" or 'client-ip' '192.168.1.100'
  const patterns = [
    /"client-ip"\s+"([^"]+)"/i,
    /'client-ip'\s+'([^']+)'/i,
    /client-ip[:\s]+([^\s,}"']+)/i
  ];

  for (const pattern of patterns) {
    const match = idString.match(pattern);
    if (match && match[1]) {
      const ip = match[1].trim();
      if (isIP(ip)) return ip;
    }
  }

  return null;
}

/**
 * Check if the connecting server is in the CLIENT_IP_PASSTHROUGH_HOSTS list
 * @param {string} remoteAddress - The remote IP address
 * @param {string} resolvedClientHostname - The resolved hostname
 * @param {string} resolvedRootClientHostname - The resolved root hostname
 * @returns {boolean} - True if the server is trusted for IP passthrough
 */
function isTrustedPassthroughHost(
  remoteAddress,
  resolvedClientHostname,
  resolvedRootClientHostname
) {
  if (env.CLIENT_IP_PASSTHROUGH_HOSTS.length === 0) return false;

  // Check if the remote IP is in the list
  // NOTE: remoteAddress may be undefined if the socket was destroyed before
  //       the session was fully initialized (e.g. ManageSieve connections that
  //       close immediately), so we guard against that here.
  if (
    remoteAddress &&
    env.CLIENT_IP_PASSTHROUGH_HOSTS.includes(remoteAddress.toLowerCase())
  ) {
    return true;
  }

  // Check if the resolved hostname is in the list
  if (
    resolvedClientHostname &&
    env.CLIENT_IP_PASSTHROUGH_HOSTS.includes(
      resolvedClientHostname.toLowerCase()
    )
  ) {
    return true;
  }

  // Check if the resolved root hostname is in the list
  if (
    resolvedRootClientHostname &&
    env.CLIENT_IP_PASSTHROUGH_HOSTS.includes(
      resolvedRootClientHostname.toLowerCase()
    )
  ) {
    return true;
  }

  return false;
}

async function onConnect(session, fn) {
  this.logger.debug('CONNECT', { session });
  if (this.isClosing) return fn(new ServerShutdownError());
  // Guard against sessions where the socket was destroyed before the remote
  // address could be determined (e.g. a ManageSieve connection that closes
  // immediately during TLS negotiation). Without remoteAddress we cannot
  // perform meaningful rate-limiting, denylist, or allowlist checks, so we
  // simply accept the connection and let subsequent handlers deal with it.
  if (!session.remoteAddress) return fn();
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
      // OPTIMIZATION: Use helper function to process hostname
      const processed = processHostname(clientHostname);
      if (processed) {
        session.resolvedClientHostname = processed.domain;
        session.resolvedRootClientHostname = processed.rootDomain;
      }
    } catch (err) {
      //
      // NOTE: the native Node.js DNS module would throw an error previously
      //       <https://github.com/nodejs/node/issues/3112#issuecomment-1452548779>
      //
      if (env.NODE_ENV !== 'production') this.logger.debug(err, { session });
    }

    //
    // Client IP Passthrough Logic
    // Parse the real client IP from trusted passthrough hosts
    //
    if (
      isTrustedPassthroughHost(
        session.remoteAddress,
        session.resolvedClientHostname,
        session.resolvedRootClientHostname
      )
    ) {
      let parsedClientIp = null;

      // For WildDuck (IMAP/POP3) instances, parse from session.clientId
      if ((isPOP || isIMAP) && session.clientId) {
        parsedClientIp = parseIpFromClientId(session.clientId);
        if (parsedClientIp) {
          this.logger.debug('Parsed client IP from clientId', {
            clientId: session.clientId,
            parsedIp: parsedClientIp
          });
        }
      }
      // For SMTP instances, parse from session.hostNameAppearsAs
      else if (!isPOP && !isIMAP && session.hostNameAppearsAs) {
        parsedClientIp = parseIpFromEhlo(session.hostNameAppearsAs);
        if (parsedClientIp) {
          this.logger.debug('Parsed client IP from EHLO', {
            hostNameAppearsAs: session.hostNameAppearsAs,
            parsedIp: parsedClientIp
          });
        }
      }

      // If we successfully parsed a client IP, update the session
      if (parsedClientIp) {
        // Store original values
        session._remoteAddress = session.remoteAddress;
        session._resolvedClientHostname = session.resolvedClientHostname;
        session._resolvedRootClientHostname =
          session.resolvedRootClientHostname;

        // Update session.remoteAddress with the parsed client IP
        session.remoteAddress = parsedClientIp;
        delete session.resolvedClientHostname;
        delete session.resolvedRootClientHostname;

        // Resolve the hostname for the new client IP
        try {
          const [newClientHostname] = await this.resolver.reverse(
            parsedClientIp
          );
          // OPTIMIZATION: Use helper function to process hostname
          const processed = processHostname(newClientHostname);
          if (processed) {
            session.resolvedClientHostname = processed.domain;
            session.resolvedRootClientHostname = processed.rootDomain;
            this.logger.debug('Resolved hostname for passthrough IP', {
              parsedIp: parsedClientIp,
              resolvedHostname: processed.domain
            });
          } else {
            // If not a valid FQDN, clear the resolved hostname
            session.resolvedClientHostname = undefined;
            session.resolvedRootClientHostname = undefined;
          }
        } catch (err) {
          // If reverse DNS fails, clear the resolved hostname
          session.resolvedClientHostname = undefined;
          session.resolvedRootClientHostname = undefined;
          if (env.NODE_ENV !== 'production')
            this.logger.debug(err, { session });
        }

        this.logger.info('Client IP passthrough applied', {
          originalIp: session._remoteAddress,
          originalHostname: session._resolvedClientHostname,
          newIp: session.remoteAddress,
          newHostname: session.resolvedClientHostname
        });
      }
    }

    // OPTIMIZATION: Check against hard-coded denylist using array iteration
    // This is cleaner and slightly faster than multiple if-else statements
    let isDenylisted = false;

    const denylistCheckValues = [
      session.resolvedClientHostname,
      session.resolvedRootClientHostname,
      session.remoteAddress
    ].filter(Boolean);

    for (const value of denylistCheckValues) {
      if (config.denylist.has(value)) {
        isDenylisted = value;
        break;
      }
    }

    if (isDenylisted && !isPOP && !isIMAP) {
      const err = new DenylistError(
        `The value ${isDenylisted} is denylisted by ${
          config.urls.web
        } ; To request removal, you must visit ${
          config.urls.web
        }/denylist?q=${encodeURIComponent(isDenylisted)} ;`,
        550,
        isDenylisted
      );
      throw err;
    }

    //
    // OPTIMIZATION: Early exit for denylisted IMAP/POP3 connections
    // Skip allowlist checks if already denylisted (saves 30-150ms)
    //
    session.isAllowlisted = false;
    if (!isDenylisted) {
      //
      // OPTIMIZATION: Parallel allowlist checks
      // Check all values in parallel instead of sequentially
      // This reduces worst-case time from 30-150ms to 10-50ms
      //
      const allowlistCheckValues = [];
      const allowlistCheckLabels = [];

      // Add root domain check
      if (session.resolvedRootClientHostname) {
        allowlistCheckValues.push(session.resolvedRootClientHostname);
        allowlistCheckLabels.push('rootDomain');
      }

      // Add subdomain check (only if different from root)
      if (
        session.resolvedClientHostname &&
        session.resolvedClientHostname !== session.resolvedRootClientHostname
      ) {
        allowlistCheckValues.push(session.resolvedClientHostname);
        allowlistCheckLabels.push('clientHostname');
      }

      // Add IP address check (remoteAddress is always defined here due to the
      // early-exit guard above, but we keep the conditional for safety)
      if (session.remoteAddress) {
        allowlistCheckValues.push(session.remoteAddress);
        allowlistCheckLabels.push('remoteAddress');
      }

      // Run all checks in parallel
      const allowlistChecks = allowlistCheckValues.map((value) =>
        isAllowlisted(value, this.client, this.resolver).catch(() => false)
      );

      const results = await Promise.all(allowlistChecks);

      // Find first match
      const allowlistIndex = results.findIndex(Boolean);
      if (allowlistIndex !== -1) {
        session.isAllowlisted = true;
        session.allowlistValue = allowlistCheckValues[allowlistIndex];
      }
    }
  } catch (err) {
    return fn(refineAndLogError(err, session, false, this));
  }

  // safeguard in case we recursively connect to our own server
  // (this should NOT happen, and can result in OOM/CPU issues)
  // if (session.resolvedRootClientHostname === env.WEB_HOST) {
  //   const err = new TypeError(
  //     `${HOSTNAME} detected recursive connection from ${session.resolvedClientHostname} (${session.remoteAddress})`
  //   );
  //   err.isCodeBug = true;
  //   err.session = session;
  //   logger.fatal(err);
  // }

  try {
    // TODO: we need to use rate limiting concept here where it's rolling as opposed to fix
    // NOTE: do not change this prefix unless you also change it in `helpers/on-close.js`
    const prefix = `concurrent_${this.constructor.name.toLowerCase()}_${
      config.env
    }`;
    const key = `${prefix}:${session.remoteAddress}`;
    //
    // OPTIMIZATION: Redis pipelining
    // Batch incr and pexpire into one pipeline (reduces 2 round-trips to 1)
    // This saves 10-20ms per connection
    //
    const [[, count]] = await this.client
      .pipeline()
      .incr(key)
      .pexpire(key, config.socketTimeout)
      .exec();

    // NOTE if more than 200 connections open in 3m then alert admins
    // if (count >= 200 && session.isAllowlisted) {
    //   const err = new TypeError(
    //     `${HOSTNAME} detected 50+ connections from ${
    //       session.resolvedRootClientHostname ||
    //       session.resolvedClientHostname ||
    //       session.remoteAddress
    //     } (${session.allowlistValue})`
    //   );
    //   err.isCodeBug = true;
    //   err.session = session;
    //   logger.fatal(err);
    // }

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
