/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const _ = require('lodash');
const isHTML = require('is-html');
const isSANB = require('is-string-and-not-blank');
const previewEmail = require('preview-email');
const { dkimSign } = require('mailauth/lib/dkim/sign');
const { isEmail } = require('validator');
const { readKey } = require('openpgp/dist/node/openpgp.js');

const WKD = require('./wkd');
const encryptMessage = require('./encrypt-message');
const getTransporter = require('./get-transporter');
const isMessageEncrypted = require('./is-message-encrypted');
const isRetryableError = require('./is-retryable-error');
const isSSLError = require('./is-ssl-error');
const isTLSError = require('./is-tls-error');
const logger = require('./logger');
const shouldThrow = require('./should-throw');
const combineErrors = require('./combine-errors');
const { decrypt } = require('./encrypt-decrypt');
const createSession = require('./create-session');

const config = require('#config');

//
// TODO: when emails are sent we need to store the `raw` (w/DKIM-Signature) per `accepted`
// TODO: similarly we need to store this for rejectedErrors so we can see details of error raw message (and end users can too)
//

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
    !isEmail(envelope.to, { allow_ip_domain: true, ignore_max_length: true })
  )
    throw new TypeError('Envelope to missing or not a single email');

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
  let pgp = false;
  if (!isEncrypted) {
    try {
      if (!publicKey) {
        const wkd = new WKD(resolver, client);

        // TODO: pending PR in wkd-client package
        // <https://github.com/openpgpjs/wkd-client/issues/3>
        // <https://github.com/openpgpjs/wkd-client/pull/4>
        const binaryKey = await wkd.lookup({
          email: envelope.to
        });

        //
        // TODO: we may not want to do isHTML check (?) see comment in GH discussion
        //

        // TODO: this is a temporary fix until the PR noted in `helpers/wkd.js` is merged
        // <https://github.com/sindresorhus/is-html/blob/bc57478683406b11aac25c4a7df78b66c42cc27c/index.js#L1-L11>
        const str = new TextDecoder().decode(binaryKey);
        if (str && isHTML(str))
          throw new Error('Invalid WKD lookup HTML result');

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
          const signResult = await dkimSign(encryptedUnsignedMessage, {
            canonicalization: 'relaxed/relaxed',
            algorithm: 'rsa-sha256',
            signTime: new Date(),
            signatureData: domain
              ? [
                  {
                    signingDomain: domain.name,
                    selector: domain.dkim_key_selector,
                    privateKey: decrypt(domain.dkim_private_key),
                    algorithm: 'rsa-sha256',
                    canonicalization: 'relaxed/relaxed'
                  }
                ]
              : [config.signatureData]
          });

          if (signResult.errors.length > 0) {
            const err = combineErrors(
              signResult.errors.map((error) => error.err)
            );
            // we may want to remove cyclical reference
            // for (const error of signResult.errors) {
            //   delete error.err;
            // }
            err.signResult = signResult;
            throw err;
          }

          const signatures = Buffer.from(signResult.signatures, 'utf8');
          raw = Buffer.concat(
            [signatures, encryptedUnsignedMessage],
            signatures.length + encryptedUnsignedMessage.length
          );
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
  let mxLastError;

  try {
    const {
      truthSource,
      mx,
      requireTLS,
      ignoreTLS,
      opportunisticTLS,
      tls,
      transporter
    } = await getTransporter({
      target,
      port,
      resolver,
      logger,
      cache,
      client
    });

    session.truthSource = truthSource;
    session.mx = _.omit(mx, ['socket']);
    session.requireTLS = requireTLS;
    session.ignoreTLS = ignoreTLS;
    session.opportunisticTLS = opportunisticTLS;
    session.tls = tls;

    // TODO: handle transporter cleanup
    // TODO: handle mx socket close

    const info = await transporter.sendMail({
      envelope,
      raw
    });

    info.pgp = pgp;

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
          envelope,
          raw
        });

        info.pgp = pgp;

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
