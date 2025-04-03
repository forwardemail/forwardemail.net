/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const previewEmail = require('preview-email');
const { readKey } = require('openpgp/dist/node/openpgp.js');

const WKD = require('./wkd');
const createSession = require('./create-session');
const encryptMessage = require('./encrypt-message');
const getTransporter = require('./get-transporter');
const isEmail = require('./is-email');
const isMessageEncrypted = require('./is-message-encrypted');
const isRetryableError = require('./is-retryable-error');
const isSSLError = require('./is-ssl-error');
const isTLSError = require('./is-tls-error');
const logger = require('./logger');
const shouldThrow = require('./should-throw');
const signMessage = require('./sign-message');
const _ = require('#helpers/lodash');

const config = require('#config');

async function getPGPResults({
  session,
  envelope,
  raw,
  publicKey,
  resolver,
  client,
  email,
  domain
}) {
  // check if the message was encrypted already
  let isEncrypted = false;
  try {
    isEncrypted = isMessageEncrypted(raw);
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err, { session });
  }

  //
  // NOTE: This is basically a fallback in case the message was not encrypted already to the recipient(s))
  //       (e.g. when it arrives at the destination mail server, it is already encrypted)
  //
  let finalRaw;
  let pgp = false;

  if (
    !isEncrypted &&
    (email || (!email && session?.dmarc?.policy !== 'reject'))
  ) {
    try {
      if (!publicKey) {
        const wkd = new WKD(resolver, client);

        // TODO: pending PR in wkd-client package
        // <https://github.com/openpgpjs/wkd-client/issues/3>
        // <https://github.com/openpgpjs/wkd-client/pull/4>
        const binaryKey = await wkd.lookup({
          email: envelope.to
        });

        logger.info('binaryKey', { binaryKey });

        publicKey = await readKey({
          binaryKey
        });
      }

      if (publicKey) {
        try {
          const encryptedUnsignedMessage = await encryptMessage(
            publicKey,
            raw,
            false
          );

          finalRaw = await signMessage(encryptedUnsignedMessage, domain);
          pgp = true;
        } catch (err) {
          logger.fatal(
            err,
            email
              ? {
                  user: email.user,
                  email: email._id,
                  domains: [email.domain],
                  session: createSession(email)
                }
              : undefined
          );
        }
      }
    } catch (err) {
      logger.debug(
        err,
        email
          ? {
              user: email.user,
              email: email._id,
              domains: [email.domain],
              session: createSession(email)
            }
          : undefined
      );
    }
  }

  // if no PGP then we need to still sign with DKIM
  if (!pgp || !finalRaw) finalRaw = await signMessage(raw, domain);

  return { finalRaw, pgp };
}

// eslint-disable-next-line complexity
async function sendEmail(
  {
    session,
    cache,
    target,
    port = 25,
    envelope,
    raw,
    resolver,
    client,
    publicKey
  },
  email,
  domain
) {
  if (
    !_.isObject(envelope) ||
    typeof envelope.to !== 'string' ||
    !isEmail(envelope.to)
  )
    throw new TypeError('Envelope to missing or not a single email');

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

  const [pgpResults, transporterResults] = await Promise.all([
    getPGPResults({
      session,
      envelope,
      raw,
      publicKey,
      resolver,
      client,
      email,
      domain
    }),
    getTransporter({
      target,
      port,
      resolver,
      logger,
      cache,
      client
    })
  ]);

  const {
    truthSource,
    mx,
    requireTLS,
    ignoreTLS,
    opportunisticTLS,
    tls,
    transporter
  } = transporterResults;

  //
  // NOTE: Proton Mail rewrites messages, so we shouldn't use PGP for them
  //       and should email the users separately regarding this
  //
  // https://github.com/ProtonMail/proton-bridge/issues/26
  // https://github.com/ProtonMail/proton-bridge/issues/216
  // https://proton.me/support/email-has-failed-its-domains-authentication-requirements-warning
  // https://news.ycombinator.com/item?id=36639530
  // https://proton.me/support/what-is-difference-between-proton-domains
  // - proton.me
  // - protonmail.ch
  // - protonmail.com
  // - pm.me
  // - + supports custom domains since we use truthSource (resolved MX server)
  //
  if (pgpResults.pgp && truthSource === 'protonmail.ch') {
    pgpResults.finalRaw = await signMessage(raw, domain);
    pgpResults.pgp = false;
    // TODO: email users one-time per month regarding this issue
  }

  const ignoreMXHosts = [];
  let mxLastError;

  session.truthSource = truthSource;
  session.mx = _.omit(mx, ['socket']);
  session.requireTLS = requireTLS;
  session.ignoreTLS = ignoreTLS;
  session.opportunisticTLS = opportunisticTLS;
  session.tls = tls;

  try {
    // TODO: handle transporter cleanup
    // TODO: handle mx socket close
    const info = await transporter.sendMail({
      // if auto response then MAIL FROM should be <> (empty)
      envelope:
        email && email.is_bounce
          ? {
              ...envelope,
              from: ''
            }
          : envelope,
      raw: pgpResults.finalRaw,
      //
      //       > It is RECOMMENDED that the NOTIFY=NEVER
      //         parameter of the RCPT command be specified if the SMTP server
      //         supports the DSN option
      //
      //       <https://www.nodemailer.com/smtp/dsn/>
      //       <https://github.com/nodemailer/nodemailer/issues/1708>
      //
      ...(email && email.is_bounce
        ? {
            dsn: {
              notify: 'never'
            }
          }
        : {})
    });
    info.pgp = pgpResults.pgp;
    return info;
  } catch (err) {
    // delete `err.cert` for security
    err.isTLSError = isTLSError(err);
    delete err.cert;

    // NOTE: this is important to keep here
    mxLastError = err;

    err.target = target;
    err.port = port;
    err.envelope = envelope;
    err.truthSource = session.truthSource; // necessary for bounce parsing

    // TODO: clean this up (shouldn't be mirrored to `err` probably?)
    err.mx = session.mx;
    err.requireTLS = session.requireTLS;
    err.ignoreTLS = session.ignoreTLS;
    err.opportunisticTLS = session.opportunisticTLS;
    err.tls = session.tls;

    await shouldThrow(err, session);

    //
    // NOTE: this is handled because `MAIL_RETRY_ERROR_CODES` has `ECONNRESET`
    //       https://github.com/zone-eu/zone-mta/blob/5daa48eea4aa05e724eb2ab80fd3a957e6cc8c6c/lib/sender.js#L1140
    //
    if (isRetryableError(err) && isSANB(session?.mx?.host)) {
      ignoreMXHosts.push(session.mx.host);
    } else if (
      !isRetryableError(err) &&
      session.requireTLS &&
      isTLSError(err)
    ) {
      //
      // NOTE: if MTA-STS was enforced and it was TLS error then throw if not a retry code
      // (safeguard is here for keeping retry codes in conditional in case this moves around)
      //
      err.message = `421 TLS is required due to MTA-STS policy${
        isSANB(err.reason) ? ` (${err.reason})` : ''
      }`;
      err.responseCode = 421;
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
    if (isSSLError(err) || isTLSError(err) || isRetryableError(err)) {
      const { truthSource, mx, requireTLS, ignoreTLS, tls, transporter } =
        await getTransporter(
          {
            ignoreMXHosts,
            mxLastError,
            target,
            port,
            resolver,
            logger,
            cache,
            client
          },
          err
        );

      session.truthSource = truthSource;
      session.mx = _.omit(mx, ['socket']);
      session.requireTLS = requireTLS;
      session.ignoreTLS = ignoreTLS;
      session.opportunisticTLS = requireTLS;
      session.tls = tls;

      // TODO: handle transporter cleanup
      // TODO: handle mx socket close
      try {
        const info = await transporter.sendMail({
          // if auto response then MAIL FROM should be <> (empty)
          envelope:
            email && email.is_bounce
              ? {
                  ...envelope,
                  from: ''
                }
              : envelope,
          raw: pgpResults.finalRaw,
          //
          //       > It is RECOMMENDED that the NOTIFY=NEVER
          //         parameter of the RCPT command be specified if the SMTP server
          //         supports the DSN option
          //
          //       <https://www.nodemailer.com/smtp/dsn/>
          //       <https://github.com/nodemailer/nodemailer/issues/1708>
          //
          ...(email && email.is_bounce
            ? {
                dsn: {
                  notify: 'never'
                }
              }
            : {})
        });
        info.pgp = pgpResults.pgp;
        return info;
      } catch (err) {
        // delete `err.cert` for security
        err.isTLSError = isTLSError(err);
        delete err.cert;

        err.target = target;
        err.port = port;
        err.envelope = envelope;

        // TODO: clean this up (shouldn't be mirrored to `err` probably?)
        err.truthSource = session.truthSource;
        err.mx = session.mx;
        err.requireTLS = session.requireTLS;
        err.ignoreTLS = session.ignoreTLS;
        err.opportunisticTLS = session.opportunisticTLS;
        err.tls = session.tls;

        err.mxLastError = mxLastError;
        err.ignoreMXHosts = ignoreMXHosts;

        await shouldThrow(err, session);

        //
        // retry if code, tls, or ssl error
        //
        if (isTLSError(err) || isSSLError(err) || isRetryableError(err))
          err.responseCode = 421;

        throw err;
      }
    }

    throw err;
  }
}

module.exports = sendEmail;
