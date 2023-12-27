/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { callbackify } = require('node:util');
const { isIP } = require('node:net');

const Axe = require('axe');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pify = require('pify');

const isSSLError = require('./is-ssl-error');
const isSocketError = require('./is-socket-error');
const isTLSError = require('./is-tls-error');
const parseRootDomain = require('./parse-root-domain');

const env = require('#config/env');
const config = require('#config');

const asyncMxConnect = pify(mxConnect);
const maxConnectTime = ms('1m');

const transporterConfig = {
  debug: config.env !== 'test',
  transactionLog: config.env !== 'test',
  // mirrors the queue configuration 60s timeout
  connectionTimeout: config.smtpQueueTimeout,
  greetingTimeout: config.smtpQueueTimeout,
  socketTimeout: config.smtpQueueTimeout,
  dnsTimeout: config.smtpQueueTimeout
};

//
// list of hosts that only allow up to 10 concurrent connections per IP
//
/*
const CONCURRENT_HOSTS = new Set([
  'aol.com',
  'cox.net',
  'comcast.net',
  'centurylink.net',
  'centurytel.net',
  'embarqmail.com',
  'frontier.com',
  'frontiernet.net',
  'gallatinriver.net',
  'infinitummail.com',
  'netscape.net',
  'optimum.net',
  'optonline.net',
  'prodigy.net.mx',
  'q.com',
  'rocketmail.com',
  'suddenlink.net',
  'verizon.net',
  'yahoo.co.in',
  'yahoo.co.uk',
  'yahoo.com',
  'yahoo.com.mx',
  'ymail.com',
  'yahoodns.net'
]);
*/

// <https://github.com/MicrosoftDocs/OfficeDocs-Support/blob/public/Exchange/ExchangeOnline/email-delivery/send-receive-emails-socketerror.md#cant-send-or-receive-email-when-using-tls-11-or-tls-10>
const OUTLOOK_HOSTS = new Set([
  'outlook.com',
  'outlook.co.uk',
  'microsoft.com',
  'hotmail.co.uk',
  'hotmail.com',
  'hotmail.fr',
  'live.co.za',
  'live.com',
  'msn.com'
]);

// eslint-disable-next-line complexity
async function getTransporter(options = {}, err) {
  const {
    ignoreMXHosts,
    mxLastError,
    target,
    port,
    localAddress,
    localHostname,
    resolver,
    logger,
    cache
    // client
  } = options;

  let mx = {
    host: target,
    port
  };

  //
  // TODO: rewrite to use SMTPConnection object instead of nodemailer
  //       <https://github.com/nodemailer/nodemailer/issues/1575>
  //

  // this is required since custom port forwarding would be recursive otherwise
  if (env.NODE_ENV === 'test' || port === 25) {
    // <https://github.com/zone-eu/mx-connect#configuration-options>
    mx = await asyncMxConnect({
      ignoreMXHosts,
      mxLastError,
      target,
      port,
      localAddress,
      localHostname,
      // the default in mx-connect is 300s (5 min)
      // <https://github.com/zone-eu/mx-connect/blob/f9e20ceff5a4a7cfb85fba58ca2f040aaa7c2358/lib/get-connection.js#L6>
      maxConnectTime,
      dnsOptions: {
        // NOTE: if we merge code then this will need adjusted
        blockLocalAddresses: env.NODE_ENV !== 'test',
        // <https://github.com/zone-eu/mx-connect/pull/4>
        resolve: callbackify(resolver.resolve.bind(resolver))
      },
      mtaSts: {
        enabled: config.env !== 'test',
        logger(results) {
          logger[results.success ? 'info' : 'error']('MTA-STS', {
            results
          });
        },
        cache
      }
    });
  }

  //
  // if the SMTP response was from trusted root host and it was rejected for spam
  // then denylist the sender (probably a low-reputation domain name spammer)
  //
  let truthSource = false;
  if (
    mx &&
    isSANB(mx.hostname) &&
    isFQDN(mx.hostname) &&
    config.truthSources.has(parseRootDomain(mx.hostname))
  )
    truthSource = parseRootDomain(mx.hostname);

  const requireTLS = Boolean(
    Boolean(mx.policyMatch && mx.policyMatch.mode === 'enforce') ||
      (truthSource && OUTLOOK_HOSTS.has(truthSource)) ||
      (truthSource && truthSource === 'google.com')
  );

  //
  // attempt to send the email with TLS
  //
  const tls = {
    minVersion: requireTLS ? 'TLSv1.2' : 'TLSv1',
    // ignore self-signed cert warnings if we are forwarding to a custom port
    // (since a lot of sysadmins generate self-signed certs or forget to renew)
    rejectUnauthorized: requireTLS && mx.port === 25
  };

  if (isFQDN(mx.hostname)) tls.servername = mx.hostname;

  // <https://github.com/nodemailer/nodemailer/issues/1517>
  // <https://gist.github.com/andris9/a13d9b327ea81d620ea89926d2097921>
  if (!mx.socket && !isIP(mx.host) && isFQDN(mx.host)) {
    try {
      const [host] = await resolver.resolve(mx.host);
      if (isIP(host)) mx.host = host;
    } catch (err) {
      logger.error(err);
    }
  }

  // if there was a TLS, SSL, or ECONNRESET then attempt to ignore STARTTLS
  const ignoreTLS = Boolean(
    !requireTLS &&
      err &&
      (isSocketError(err) ||
        isSSLError(err) ||
        isTLSError(err) ||
        err.code === 'ECONNRESET')
  );

  const opportunisticTLS = Boolean(!requireTLS && !ignoreTLS);

  const transporter = nodemailer.createTransport({
    ...transporterConfig,
    secure: false,
    secured: false,
    logger: new Axe({ silent: true }),
    name: localHostname,
    requireTLS,
    ignoreTLS,
    opportunisticTLS,
    tls,
    host: mx.host,
    port: mx.port,
    ...(mx.socket ? { connection: mx.socket } : {})
  });

  const pool = {
    truthSource,
    mx,
    requireTLS,
    ignoreTLS,
    opportunisticTLS,
    tls,
    transporter
  };

  return pool;
}

module.exports = getTransporter;
