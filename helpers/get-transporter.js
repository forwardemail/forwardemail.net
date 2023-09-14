const crypto = require('node:crypto');
const punycode = require('node:punycode');
const { callbackify } = require('node:util');
const { isIP } = require('node:net');

const Axe = require('axe');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pify = require('pify');

const SMTPError = require('./smtp-error');
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
// list of hosts that only allow up to 10 concurrenct connections per IP
//
// NOTE: we limit it to 5 per IP address (which means we should only have 5 max threads)
//
const CONCURRENT_HOSTS = new Set([
  'aol.com',
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
    cache,
    client
  } = options;

  const now = new Date();

  // check against rate limit for the `target`
  /*
  const isTargetBlocklisted = client
    ? await client.get(
        _.toLower(`target_blocklisted:${localAddress}:${target}:${port}`)
      )
    : false;

  if (isTargetBlocklisted && boolean(isTargetBlocklisted))
    throw new CustomError('Try again later', 421);
  */

  //
  // NOTE: in the future we should support duplicate errors possibly re-using the same connection
  //       (right now the below logic will create a new connection for every smtp error that retries)
  //

  const key = _.toLower(`${target}:${port}`);

  // if the pool expires in < 1 minute then start a new connection
  let poolExpires = false;
  if (!err && connectionMap.has(key)) {
    const pool = connectionMap.get(key);
    logger.info(`pool discovered: ${key}`);
    // check if pool closed, socket destroyed/not writable, or expires in < 1m
    if (pool?.transporter?._closed === true) {
      poolExpires = true;
      logger.info(`pool transporter closed: ${key}`);
    } else if (pool?.mx?.socket?.destroyed || !pool?.mx?.socket?.writable) {
      poolExpires = true;
      logger.info(`pool mx socket destroyed or not writable: ${key}`);
    } else if (pool.expires < now.getTime() + ms('1m')) {
      poolExpires = true;
      logger.info(`pool expires soon: ${key}`);
    }

    if (!poolExpires) return pool;
  }

  //
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
          const newKey = _.toLower(`${sorted[0].exchange}:${port}`);
          if (
            config.truthSources.has(rootDomain) &&
            connectionMap.has(newKey)
          ) {
            const pool = connectionMap.get(newKey);
            logger.info(`pool discovered: ${key} (${newKey})`);

            // check if pool closed, socket destroyed/not writable, or expires in < 1m
            if (pool?.transporter?._closed === true) {
              poolExpires = true;
              logger.info(`pool transporter closed: ${key} (${newKey})`);
            } else if (
              pool?.mx?.socket?.destroyed ||
              !pool?.mx?.socket?.writable
            ) {
              poolExpires = true;
              logger.info(
                `pool mx socket destroyed or not writable: ${key} (${newKey})`
              );
            } else if (pool.expires < now.getTime() + ms('1m')) {
              poolExpires = true;
              logger.info(`pool expires soon: ${key} (${newKey})`);
            }

            if (!poolExpires) return pool;
          }

          if (CONCURRENT_HOSTS.has(rootDomain)) {
            const count = await client.incrby(
              _.toLower(
                `target_concurrency:${localAddress}:${rootDomain}:${port}`
              ),
              0
            );
            if (count >= 5)
              throw new SMTPError('Try again later', { responseCode: 421 });
          }
        }
      }
    } catch (err) {
      logger.warn(err);
    }
  }

  // if it is one of the concurrent hosts then we can only permit 5 max connections at once
  if (CONCURRENT_HOSTS.has(target.toLowerCase())) {
    const count = await client.incrby(
      _.toLower(`target_concurrency:${localAddress}:${target}:${port}`),
      0
    );
    if (count >= 5)
      throw new SMTPError('Try again later', { responseCode: 421 });
  }

  let mx = {
    host: target,
    port
  };

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
    // NOTE: there is probably a better way to do this
    //
    // set helper identifier used for closing connections and connection management
    //
    mx.id = crypto.randomUUID();

    // if it is one of the concurrent hosts then increase the counter by 1 and set PX to 1 hour
    if (
      CONCURRENT_HOSTS.has(target.toLowerCase()) &&
      // extra check here so we don't incrby 2
      (!mx ||
        !mx.hostname ||
        !CONCURRENT_HOSTS.has(parseRootDomain(mx.hostname)))
    ) {
      await client.incr(
        _.toLower(`target_concurrency:${localAddress}:${target}:${port}`)
      );
      await client.pexpire(
        _.toLower(`target_concurrency:${localAddress}:${target}:${port}`),
        ms('5m')
      );
    }

    if (
      mx &&
      mx.hostname &&
      CONCURRENT_HOSTS.has(parseRootDomain(mx.hostname))
    ) {
      const rootDomain = parseRootDomain(mx.hostname);
      await client.incr(
        _.toLower(`target_concurrency:${localAddress}:${rootDomain}:${port}`)
      );
      await client.pexpire(
        _.toLower(`target_concurrency:${localAddress}:${rootDomain}:${port}`),
        ms('5m')
      );
    }
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

  const isPooling = typeof err === 'undefined' && truthSource;

  if (isPooling && mx && mx.socket) {
    mx.socket.once('close', async () => {
      logger.info(`pool closed: ${mx.hostname}:${port}`);
      // remove the socket from the available pool
      if (
        connectionMap.has(`${mx.hostname}:${port}`) &&
        connectionMap.get(`${mx.hostname}:${port}`).mx.id === mx.id
      )
        connectionMap.delete(`${mx.hostname}:${port}`);
      const rootDomain = parseRootDomain(mx.hostname);
      try {
        // decrement the counter for both target and mx.hostname
        if (CONCURRENT_HOSTS.has(rootDomain)) {
          await client.decr(
            _.toLower(
              `target_concurrency:${localAddress}:${rootDomain}:${port}`
            )
          );
          await client.pexpire(
            _.toLower(
              `target_concurrency:${localAddress}:${rootDomain}:${port}`
            ),
            ms('5m')
          );
        }

        if (
          target.toLowerCase() !== rootDomain &&
          CONCURRENT_HOSTS.has(target.toLowerCase())
        ) {
          await client.decr(
            _.toLower(`target_concurrency:${localAddress}:${target}:${port}`)
          );
          await client.pexpire(
            _.toLower(`target_concurrency:${localAddress}:${target}:${port}`),
            ms('5m')
          );
        }
      } catch (err) {
        logger.fatal(err);
      }
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

  // TODO: may need to pass custom `getSocket` option if `isPooling`

  const transporter = nodemailer.createTransport({
    ...transporterConfig,
    pool: isPooling,
    ...(isPooling
      ? {} // { maxConnections: 1 } // , rateDelta: ms('1s'), rateLimit: 2 }
      : {}),
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
    transporter,
    expires: now.getTime() + ms('10m')
  };

  if (!err && isPooling && isFQDN(mx.hostname)) {
    connectionMap.set(`${mx.hostname}:${port}`, pool);
    logger.info(`pool created: ${mx.hostname}:${port}`);
    // after 10m close the pool
    setTimeout(() => {
      // close the transporter
      transporter.close();
      // remove the socket from the available pool
      if (
        connectionMap.has(`${mx.hostname}:${port}`) &&
        connectionMap.get(`${mx.hostname}:${port}`).mx.id === mx.id
      )
        connectionMap.delete(`${mx.hostname}:${port}`);
    }, now.getTime() + ms('10m') - Date.now());
  }

  return pool;
}

module.exports = getTransporter;
