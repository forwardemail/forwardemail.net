const { callbackify } = require('node:util');
const { isIP } = require('node:net');

const RE2 = require('re2');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pify = require('pify');
const previewEmail = require('preview-email');
const zoneMTABounces = require('zone-mta/lib/bounces');
const { boolean } = require('boolean');

const config = require('#config');
const env = require('#config/env');
const getErrorCode = require('#helpers/get-error-code');
const isCodeBug = require('#helpers/is-code-bug');
const isNodemailerError = require('#helpers/is-nodemailer-error');
const logger = require('#helpers/logger');

const asyncMxConnect = pify(mxConnect);

const transporterConfig = {
  debug: config.env !== 'test',
  direct: true,
  transactionLog: config.env !== 'test',
  connectionTimeout: ms('180s'),
  greetingTimeout: ms('180s'),
  socketTimeout: ms('180s'),
  dnsTimeout: ms('30s')
};

const REGEX_TLS_ERR = new RE2(
  /disconnected\s+before\s+secure\s+tls\s+connection\s+was\s+established/im
);

const REGEX_SSL_ERR = new RE2(
  /ssl routines|ssl23_get_server_hello|\/deps\/openssl|ssl3_check/im
);

const REGEX_SPOOFING = new RE2(/spoof|impersonation|impersonate/im);

const REGEX_LOCAL_POLICY = new RE2(
  /^local policy$|^local policy[.!;,]+|[.!;,]+local policy[.!;,]+|\s+local policy\s+|^local policy\s+|\s+local policy$|\s+local policy[.!;,]+/im
);

const REGEX_SPAM = new RE2(
  /^spam$|^spam[.!;,]+|[.!;,]+spam[.!;,]+|\s+spam\s+|^spam\s+|\s+spam$|\s+spam[.!;,]+/im
);

const REGEX_VIRUS = new RE2(
  /^virus$|^virus[.!;,]+|[.!;,]+virus[.!;,]+|\s+virus\s+|^virus\s+|\s+virus$|\s+virus[.!;,]+/im
);

const REGEX_DENYLIST = new RE2(
  /^denylist$|^denylist[.!;,]+|[.!;,]+denylist[.!;,]+|\s+denylist\s+|^denylist\s+|\s+denylist$|\s+denylist[.!;,]+/im
);

const REGEX_BLACKLIST = new RE2(
  /^blacklist$|^blacklist[.!;,]+|[.!;,]+blacklist[.!;,]+|\s+blacklist\s+|^blacklist\s+|\s+blacklist$|\s+blacklist[.!;,]+/im
);

const APPLE_HOSTS = new Set(['apple.com', 'icloud.com', 'me.com', 'mac.com']);

const MAIL_RETRY_ERROR_CODES = new Set([
  'ECONNRESET',
  'ESOCKET',
  'ECONNECTION',
  'ETIMEDOUT',
  'EDNS',
  'EPROTOCOL'
]);

function isTLSError(err) {
  return boolean(
    (typeof err.code === 'string' && err.code === 'ETLS') ||
      (typeof err.message === 'string' && REGEX_TLS_ERR.test(err.message)) ||
      err.cert ||
      (typeof err.code === 'string' && err.code.startsWith('ERR_TLS_'))
  );
}

function isSSLError(err) {
  return boolean(
    (typeof err.code === 'string' && err.code.startsWith('ERR_SSL_')) ||
      (typeof err.message === 'string' && REGEX_SSL_ERR.test(err.message)) ||
      (typeof err.library === 'string' && err.library === 'SSL routines')
  );
}

// eslint-disable-next-line complexity
async function shouldThrowError(err, session) {
  // handle programmer mistakes
  err.isCodeBug = isCodeBug(err);

  // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
  err.responseCode = getErrorCode(err);

  if (err.isCodeBug) {
    logger.fatal(err, { session });
    throw err;
  }

  // log the error
  logger.warn(err, { session });

  // if it was a nodemailer/smtp-server specific
  // connection error then return early (so it will retry)
  if (isNodemailerError(err)) return;

  // return early if no response (we're going to retry sending)
  if (!isSANB(err.response)) return;

  //
  // otherwise there was a response from SMTP server we're sending to, so parse it and throw
  //

  //
  // parse the bounce error if any
  //
  // {
  //   action: 'reject',
  //   message: 'Message Sender Blocked By Receiving Server',
  //   category: 'block',
  //   code: 554,
  //   status: '5.7.1',
  //   line: 526
  // }

  // set bounce info on the error object (useful for debugging)
  err.bounceInfo = zoneMTABounces.check(err.response);

  //
  // NOTE: if the bounce checked was Unknown and no category
  //       then check if it was a virus, denylist, blacklist, or spam response message
  //       <https://github.com/zone-eu/zone-mta/blob/83c613fa3edbf35df5182b3c5a4b39bf3f50a97b/lib/bounces.js#L100-L106>
  //
  if (
    err.bounceInfo.message === 'Unknown' ||
    (err.bounceInfo.action === 'reject' &&
      isSANB(err.bounceInfo.category) &&
      ['policy', 'message', 'block', 'other'].includes(err.bounceInfo.category))
  ) {
    if (REGEX_VIRUS.test(err.response)) err.bounceInfo.category = 'virus';
    else if (REGEX_SPAM.test(err.response)) err.bounceInfo.category = 'spam';
  }

  //
  // if it was apple (icloud.com, me.com, or mac.com)
  // then note that this error [CS01] Message rejected due to local policy
  // indicates that spam was detected and so treat it as spam not policy
  //
  if (
    APPLE_HOSTS.has(err.target) &&
    err.response.includes(
      '554 5.7.1 [CS01] Message rejected due to local policy.'
    )
  )
    err.bounceInfo.category = 'spam';

  if (
    err.target === 'qq.com' &&
    err.response.includes('550 Mail content denied')
  )
    err.bounceInfo.category = 'spam';

  if (err.bounceInfo.category === 'policy' && REGEX_SPOOFING.test(err.response))
    err.bounceInfo.category = 'spam';

  // log fatal error if block, spam, or blacklist
  if (
    isSANB(err.bounceInfo.category) &&
    ['virus', 'block', 'spam', 'blacklist'].includes(err.bounceInfo.category)
  )
    logger.fatal(err, { session });

  //
  // dmarc failures shouldn't occur since we check them on our side
  //
  if (isSANB(err.bounceInfo.category) && err.bounceInfo.category === 'dmarc')
    err.responseCode = 421;

  //
  // denylist the sender if it was detected to be a virus
  // <https://github.com/zone-eu/zone-mta/pull/314
  //
  if (
    isSANB(err.bounceInfo.category) &&
    (['virus', 'spam'].includes(err.bounceInfo.category) ||
      (err.bounceInfo.category === 'policy' &&
        REGEX_SPOOFING.test(err.response)))
  ) {
    // if it was a virus then throw the error as 554
    // (set err.responseCode to 554 if it was < 500)
    if (typeof err.responseCode !== 'number' || err.responseCode < 500)
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err.responseCode = err.bounceInfo.category === 'virus' ? 554 : 550;
  } else if (
    err.responseCode >= 500 &&
    ((isSANB(err.bounceInfo.action) &&
      ['defer', 'slowdown'].includes(err.bounceInfo.action)) ||
      (isSANB(err.bounceInfo.category) &&
        [
          'block',
          'blacklist',
          'capacity',
          'network',
          'protocol',
          'policy'
        ].includes(err.bounceInfo.category) &&
        (err.bounceInfo.category !== 'policy' ||
          !REGEX_SPOOFING.test(err.response))) ||
      REGEX_DENYLIST.test(err.response) ||
      REGEX_BLACKLIST.test(err.response) ||
      (REGEX_LOCAL_POLICY.test(err.response) &&
        !REGEX_SPOOFING.test(err.response)))
  ) {
    //
    // we want to retry messages with 421
    // if the action was "defer" or "slowdown"
    // or if the category was "block", "blacklist", "capacity", "network", "protocol", or "policy"
    // or if it was detected to be denylist, blacklist, or local policy issue
    //
    // (this is the magic that lets us fix our IP's being listed as false positive denylists in advance)
    // (and allows messages to retry and then would succeed once we get delisted)
    //
    // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
    err.responseCode = 421;
  }

  throw err;
}

//
// TODO: when emails are sent we need to store the `raw` (w/DKIM-Signature) per `accepted`
// TODO: similarly we need to store this for rejectedErrors so we can see details of error raw message (and end users can too)
//

// eslint-disable-next-line complexity
async function sendEmail({
  session,
  cache,
  target,
  port = 25,
  envelope,
  raw,
  localAddress,
  localHostname,
  resolver
}) {
  //
  // if we're in development mode then use preview-email to render queue processing
  //
  if (config.env === 'development') {
    await previewEmail(raw, {
      ...config.previewEmailOptions,
      returnHTML: false
    });
    // return early with consistent `info` object (mirrored from FE)
    return {
      accepted: envelope.to,
      rejected: [],
      rejectedErrors: []
    };
  }

  const ignoreMXHosts = [];
  let mxLastError = false;
  let transporter;
  let mx;

  try {
    // <https://github.com/zone-eu/mx-connect#configuration-options>
    mx = await asyncMxConnect({
      target,
      port,
      localAddress,
      localHostname,
      // the default in mx-connect is 300s (5 min)
      // <https://github.com/zone-eu/mx-connect/blob/f9e20ceff5a4a7cfb85fba58ca2f040aaa7c2358/lib/get-connection.js#L6>
      // maxConnectTime: ms('5m'),
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
            session,
            results
          });
        },
        cache
      }
    });

    session.requireTLS = Boolean(
      mx.policyMatch && mx.policyMatch.mode === 'enforce'
    );

    //
    // attempt to send the email with TLS
    //
    const tls = {
      // TODO: add SSL keys below
      // ...(config.ssl
      //   ? {
      //       dhparam: config.ssl.dhparam,
      //       key: config.ssl.key,
      //       cert: config.ssl.cert,
      //       ca: config.ssl.ca
      //     }
      //   : {}),
      minVersion: session.requireTLS ? 'TLSv1.2' : 'TLSv1',
      rejectUnauthorized: session.requireTLS
    };

    if (isFQDN(mx.hostname)) tls.servername = mx.hostname;

    // <https://github.com/nodemailer/nodemailer/issues/1517>
    // <https://gist.github.com/andris9/a13d9b327ea81d620ea89926d2097921>
    if (!mx.socket && !isIP(mx.host)) {
      try {
        const [host] = await resolver.resolve(mx.host);
        if (isIP(host)) mx.host = host;
      } catch (err) {
        logger.error(err, { session });
      }
    }

    transporter = nodemailer.createTransport({
      ...transporterConfig,
      opportunisticTLS: !session.requireTLS,
      secure: false,
      secured: false,
      logger,
      requireTLS: session.requireTLS,
      host: mx.host,
      port: mx.port,
      name: localHostname,
      ...(mx.socket ? { connection: mx.socket } : {}),
      tls
    });

    const info = await transporter.sendMail({
      envelope,
      raw
    });

    return info;
  } catch (err) {
    err.target = target;
    err.envelope = envelope;
    err.mx = _.omit(mx, ['socket']);
    await shouldThrowError(err, session);

    //
    // NOTE: this is handled because `MAIL_RETRY_ERROR_CODES` has `ECONNRESET`
    //       https://github.com/zone-eu/zone-mta/blob/5daa48eea4aa05e724eb2ab80fd3a957e6cc8c6c/lib/sender.js#L1140
    //
    if (err.code && MAIL_RETRY_ERROR_CODES.has(err.code)) {
      ignoreMXHosts.push(mx.host);
      mxLastError = err;
      session.mxLastError = mxLastError;
    } else if (
      session.requireTLS &&
      (!err.code || !MAIL_RETRY_ERROR_CODES.has(err.code)) &&
      isTLSError(err)
    ) {
      //
      // NOTE: if MTA-STS was enforced and it was TLS error then throw if not a retry code
      // (safeguard is here for keeping retry codes in conditional in case this moves around)
      //
      logger.fatal(new Error('TLS is required due to MTA-STS policy'), {
        err,
        session
      });
      err.response = `421 TLS is required due to MTA-STS policy${
        isSANB(err.reason) ? ` (${err.reason})` : ''
      }`;
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err.responseCode = 421;
      err.category = 'policy';
      throw err;
    }

    // this error will indicate it is a TLS issue, so we should retry as plain
    // if it doesn't have all these properties per this link then its not TLS
    //
    // ✖  error     Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames: Host: mx.example.com. is not in the cert's altnames: DNS:test1.example.com, DNS:test2.example.com
    //     at Object.checkServerIdentity (tls.js:288:12)
    //     at TLSSocket.onConnectSecure (_tls_wrap.js:1483:27)
    //     at TLSSocket.emit (events.js:311:20)
    //     at TLSSocket._finishInit (_tls_wrap.js:916:8)
    //     at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:686:12)
    //   reason: "Host: mx.example.com. is not in the cert's altnames: DNS:test1.example.com, DNS:test2.example.com",
    //   host: 'mx.example.com',
    //   cert: ...,
    //   ...
    //
    // <https://github.com/nodejs/node/blob/1f9761f4cc027315376cd669ceed2eeaca865d76/lib/tls.js#L287>
    //
    //
    if (
      (err.code &&
        Number.parseInt(err.code, 10) >= 400 &&
        Number.parseInt(err.code, 10) < 500) ||
      isSSLError(err) ||
      isTLSError(err) ||
      isNodemailerError(err) ||
      (err.code && MAIL_RETRY_ERROR_CODES.has(err.code))
    ) {
      // this is required since custom port forwarding would be recursive otherwise
      mx = await asyncMxConnect({
        ignoreMXHosts,
        mxLastError,
        target,
        port,
        localAddress,
        localHostname,
        // the default in mx-connect is 300s (5 min)
        // <https://github.com/zone-eu/mx-connect/blob/f9e20ceff5a4a7cfb85fba58ca2f040aaa7c2358/lib/get-connection.js#L6>
        // maxConnectTime: ms('5m')
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
              session,
              results
            });
          },
          cache
        }
      });

      // in case cache changes
      session.requireTLS = Boolean(
        mx.policyMatch && mx.policyMatch.mode === 'enforce'
      );

      //
      // the email failed likely due to SSL/TLS issue
      // so we're going to retry but with SSL/TLS disabled
      // (we still want to try opportunistic TLS if and only if there was not a TLS error)
      //
      // TODO: add SSL keys below
      const tls = {
        // ...(config.ssl
        //   ? {
        //       dhparam: config.ssl.dhparam,
        //       key: config.ssl.key,
        //       cert: config.ssl.cert,
        //       ca: config.ssl.ca
        //     }
        //   : {}),
        minVersion: session.requireTLS ? 'TLSv1.2' : 'TLSv1',
        // ignore self-signed cert warnings if we are forwarding to a custom port
        // (since a lot of sysadmins generate self-signed certs or forget to renew)
        rejectUnauthorized: session.requireTLS && mx.port === 25
      };

      if (isFQDN(mx.hostname)) tls.servername = mx.hostname;

      // <https://github.com/nodemailer/nodemailer/issues/1517>
      // <https://gist.github.com/andris9/a13d9b327ea81d620ea89926d2097921>
      if (!mx.socket && !isIP(mx.host)) {
        try {
          const [host] = await resolver.resolve(mx.host);
          if (isIP(host)) mx.host = host;
        } catch (err) {
          logger.error(err, { session });
        }
      }

      // if there was a TLS, SSL, or ECONNRESET then attempt to ignore STARTTLS
      session.ignoreTLS =
        !session.requireTLS &&
        (isNodemailerError(err) ||
          isSSLError(err) ||
          isTLSError(err) ||
          err.code === 'ECONNRESET');

      transporter = nodemailer.createTransport({
        ...transporterConfig,
        opportunisticTLS: !session.requireTLS,
        secure: false,
        secured: false,
        logger,
        host: mx.host,
        port: mx.port,
        name: localHostname,
        requireTLS: session.requireTLS,
        ignoreTLS: session.ignoreTLS,
        ...(mx.socket ? { connection: mx.socket } : {}),
        tls
      });

      try {
        const info = await transporter.sendMail({
          envelope,
          raw
        });

        return info;
      } catch (err) {
        err.target = target;
        err.envelope = envelope;
        err.mx = _.omit(mx, ['socket']);
        await shouldThrowError(err, session);

        //
        // retry if code, tls, or ssl error
        //
        if (
          (err.code && MAIL_RETRY_ERROR_CODES.has(err.code)) ||
          isTLSError(err) ||
          isSSLError(err) ||
          isNodemailerError(err)
        ) {
          // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
          err.responseCode = 421;
        }

        throw err;
      }
    }

    throw err;
  }
}

module.exports = sendEmail;
