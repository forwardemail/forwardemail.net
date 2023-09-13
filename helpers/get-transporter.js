const { callbackify } = require('node:util');
const { isIP } = require('node:net');
const punycode = require('node:punycode');

const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pify = require('pify');

const config = require('#config');
const env = require('#config/env');
const isNodemailerError = require('#helpers/is-nodemailer-error');
const isSSLError = require('#helpers/is-ssl-error');
const isTLSError = require('#helpers/is-tls-error');
const parseRootDomain = require('#helpers/parse-root-domain');

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

// <https://github.com/MicrosoftDocs/OfficeDocs-Support/blob/public/Exchange/ExchangeOnline/email-delivery/send-receive-emails-socketerror.md#cant-send-or-receive-email-when-using-tls-11-or-tls-10>
const OUTLOOK_HOSTS = new Set([
  'outlook.com',
  'outlook.co.uk',
  'microsoft.com',
  'hotmail.co.uk',
  'hotmail.com',
  'live.com',
  'msn.com'
]);

// eslint-disable-next-line complexity
async function getTransporter(connectionMap = new Map(), options = {}, err) {
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
  } = options;

  //
  // NOTE: in the future we should support duplicate errors possibly re-using the same connection
  //       (right now the below logic will create a new connection for every smtp error that retries)
  //

  const key = `${target}:${port}`;

  if (!err && connectionMap.has(key)) {
    const pool = connectionMap.get(key);
    logger.info(`pool found: ${key}`);
    return pool;
  }

  // otherwise lookup the MX records to determine if target != end resulting MX host
  //
  // NOTE: this is very rudimentary and will only attempt to re-use the pool for
  //       the first FQDN and lowest priority exchange found (which is acceptable and covers majority of use cases)
  //
  if (!isIP(target) && isFQDN(target)) {
    try {
      const list = await resolver.resolve(punycode.toASCII(target), 'MX');
      if (list && list.length > 0) {
        const sorted = list
          .filter(
            (o) =>
              _.isObject(o) && isFQDN(o.exchange) && Number.isFinite(o.priority)
          )
          .sort((a, b) => a.priority - b.priority);
        if (sorted.length > 0) {
          const rootDomain = parseRootDomain(sorted[0].exchange);
          if (
            config.truthSources.has(parseRootDomain(rootDomain)) &&
            connectionMap.has(`${sorted[0].exchange}:${port}`)
          ) {
            const pool = connectionMap.get(`${sorted[0].exchange}:${port}`);
            logger.info(
              `pool discovered: ${key} (${sorted[0].exchange}:${port})`
            );
            return pool;
          }
        }
      }
    } catch (err) {
      logger.warn(err);
    }
  }

  // <https://github.com/zone-eu/mx-connect#configuration-options>
  const mx = await asyncMxConnect({
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
      enabled: true,
      logger(results) {
        logger[results.success ? 'info' : 'error']('MTA-STS', {
          results
        });
      },
      cache
    }
  });

  //
  // if the SMTP response was from trusted root host and it was rejected for spam
  // then denylist the sender (probably a low-reputation domain name spammer)
  //
  let truthSource = false;
  // if (config.truthSources.has(parseRootDomain(target)))
  //   truthSource = parseRootDomain(target);
  if (
    _.isObject(mx) &&
    isSANB(mx.hostname) &&
    isFQDN(mx.hostname) &&
    config.truthSources.has(parseRootDomain(mx.hostname))
  )
    truthSource = parseRootDomain(mx.hostname);

  const isPooling = typeof err === 'undefined' && truthSource;

  if (isPooling) {
    mx.socket.once('close', () => {
      logger.info(`pool closed: ${mx.hostname}:${port}`);
      // remove the socket from the available pool
      if (connectionMap.has(`${mx.hostname}:${port}`))
        connectionMap.delete(`${mx.hostname}:${port}`);
    });
  }

  const requireTLS = Boolean(
    Boolean(mx.policyMatch && mx.policyMatch.mode === 'enforce') ||
      (truthSource && OUTLOOK_HOSTS.has(truthSource))
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

  // TODO: can we remove this (?)
  if (isFQDN(mx.hostname)) tls.servername = mx.hostname;

  // <https://github.com/nodemailer/nodemailer/issues/1517>
  // <https://gist.github.com/andris9/a13d9b327ea81d620ea89926d2097921>
  if (!mx.socket && !isIP(mx.host)) {
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
      (isNodemailerError(err) ||
        isSSLError(err) ||
        isTLSError(err) ||
        err.code === 'ECONNRESET')
  );

  const opportunisticTLS = Boolean(!requireTLS && !ignoreTLS);

  // TODO: may need to pass custom `getSocket` option if `isPooling`

  const transporter = nodemailer.createTransport({
    ...transporterConfig,
    pool: isPooling,
    ...(isPooling
      ? { maxConnections: 1, rateDelta: ms('1s'), rateLimit: 5 }
      : {}),
    secure: false,
    secured: false,
    logger: true, // NOTE: we remap this to our own logger below
    host: mx.host,
    port: mx.port,
    connection: mx.socket,
    name: localHostname,
    requireTLS,
    ignoreTLS,
    opportunisticTLS,
    tls
  });

  // remap because shared logger does not use logger properly
  transporter.logger = logger;

  const pool = {
    truthSource,
    mx,
    requireTLS,
    ignoreTLS,
    opportunisticTLS,
    tls,
    transporter
  };

  if (!err && isPooling && isFQDN(mx.hostname)) {
    connectionMap.set(`${mx.hostname}:${port}`, pool);
    logger.info(`pool created: ${mx.hostname}:${port}`);
  }

  return pool;
}

module.exports = getTransporter;
