/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * DANE TLS Wrapper — Post-handshake certificate verification for DANE/TLSA.
 *
 * Node.js does NOT call `checkServerIdentity` when `rejectUnauthorized` is
 * false. Since DANE-EE (usage=3) requires accepting self-signed certificates
 * that match TLSA records, we cannot use `rejectUnauthorized: true`.
 *
 * This module provides a function that wraps a nodemailer transporter's
 * `sendMail` method to inject DANE certificate verification into the TLS
 * handshake callback by temporarily monkey-patching `tls.connect`.
 *
 * The wrapper:
 *   1. Intercepts the `tls.connect()` call made by nodemailer's
 *      `_upgradeConnection` method during STARTTLS
 *   2. Wraps the callback to call the DANE verifier with the peer cert
 *   3. On verification failure: destroys the socket with a DANE error
 *      (nodemailer sees this as a TLS/socket error)
 *   4. On verification success: calls the original callback normally
 *   5. Restores `tls.connect` immediately (single-use, single-threaded)
 *
 * This is safe because Node.js is single-threaded and the monkey-patch
 * is scoped to a single STARTTLS upgrade. The original `tls.connect`
 * is restored before the patched version is even called.
 *
 * References:
 *   - RFC 7672 Section 3.1.1 (DANE-EE skips PKIX validation)
 *   - RFC 6698 Section 3 (TLSA certificate verification)
 *   - Node.js TLS docs (checkServerIdentity skipped when !rejectUnauthorized)
 *
 * @module helpers/dane-tls-wrapper
 */

const crypto = require('node:crypto');
const tlsModule = require('node:tls');

/**
 * Apply DANE post-handshake verification to a nodemailer transporter.
 *
 * Wraps `transporter.sendMail` to temporarily monkey-patch `tls.connect`
 * during the STARTTLS upgrade. The patched `tls.connect` verifies the
 * server certificate against TLSA records via the provided `daneVerifier`.
 *
 * @param {object} transporter - nodemailer transporter instance
 * @param {object} tlsOptions - the TLS options object passed to nodemailer
 *   (must have `_daneVerifier` and `_daneHostname` set)
 */
function applyDaneTlsWrapper(transporter) {
  const origSendMail = transporter.sendMail.bind(transporter);
  transporter.sendMail = function (...args) {
    const origTlsConnect = tlsModule.connect;

    tlsModule.connect = function (opts, callback) {
      // Restore tls.connect immediately — this patch is single-use.
      // Node.js is single-threaded, so no other code can call
      // tls.connect between now and when our wrapper executes.
      tlsModule.connect = origTlsConnect;

      // Extract and remove DANE properties from options
      const daneVerifier = opts._daneVerifier;
      const daneHostname = opts._daneHostname;
      delete opts._daneVerifier;
      delete opts._daneHostname;

      if (!daneVerifier) {
        // No DANE verifier — passthrough to original tls.connect
        return origTlsConnect.call(tlsModule, opts, callback);
      }

      // Wrap the callback to inject DANE verification
      const wrappedCallback = function () {
        try {
          // TLS handshake is complete — get the peer certificate
          const peerCert = socket.getPeerCertificate(true);

          if (peerCert && peerCert.raw) {
            // Convert to X509Certificate for the DANE verifier
            // (provides .publicKey, .raw, etc.)
            let certObj;
            try {
              certObj = new crypto.X509Certificate(peerCert.raw);
            } catch {
              certObj = peerCert;
            }

            // Call the DANE verifier (same signature as checkServerIdentity)
            // Returns undefined on success, Error on failure
            const error = daneVerifier(daneHostname, certObj);
            if (error) {
              // DANE verification failed — destroy the TLS socket.
              // nodemailer will see this as a socket error via _onSocketError.
              socket.destroy(error);
              return;
            }
          } else {
            // No peer certificate available — fail DANE verification
            const err = new Error(
              `DANE verification failed for ${daneHostname}: ` +
                'no peer certificate available'
            );
            err.code = 'DANE_VERIFICATION_FAILED';
            err.category = 'dane';
            socket.destroy(err);
            return;
          }
        } catch (err) {
          // daneVerifier threw an exception — treat as verification failure
          if (!err.code) err.code = 'DANE_VERIFICATION_FAILED';
          if (!err.category) err.category = 'dane';
          socket.destroy(err);
          return;
        }

        // DANE verification passed — call the original callback
        // so nodemailer proceeds with EHLO, MAIL FROM, etc.
        if (callback) {
          callback();
        }
      };

      const socket = origTlsConnect.call(tlsModule, opts, wrappedCallback);
      return socket;
    };

    return origSendMail(...args);
  };
}

/**
 * Prepare TLS options for DANE verification.
 *
 * Sets `rejectUnauthorized` to false (required for DANE-EE with self-signed
 * certs) and stores the DANE verifier and hostname as custom properties on
 * the TLS options object.
 *
 * @param {object} tlsOptions - the TLS options object to modify
 * @param {function} daneVerifier - the DANE verifier function from mx-connect
 * @param {string} hostname - the MX hostname for verification
 */
function prepareDaneTlsOptions(tlsOptions, daneVerifier, hostname) {
  //
  // RFC 7672 Section 3.1.1: DANE-EE does not require PKIX validation.
  // Must be false to allow self-signed certs that match TLSA records.
  //
  tlsOptions.rejectUnauthorized = false;

  //
  // Store the verifier and hostname for the tls.connect wrapper.
  // These are passed as custom properties on the TLS options object,
  // which nodemailer copies into the tls.connect() call options.
  // The wrapper reads and removes them before passing to real tls.connect.
  //
  tlsOptions._daneVerifier = daneVerifier;
  tlsOptions._daneHostname = hostname;
}

module.exports = { applyDaneTlsWrapper, prepareDaneTlsOptions };
