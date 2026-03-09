/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * DANE TLS Wrapper — Post-handshake certificate verification for DANE/TLSA.
 *
 * ## Problem
 *
 * Node.js does NOT call `checkServerIdentity` when `rejectUnauthorized` is
 * false.  Since DANE-EE (usage 3) requires accepting self-signed certificates
 * that match TLSA records, we must set `rejectUnauthorized: false` — which
 * means the normal TLS identity check is skipped entirely.
 *
 * ## Solution
 *
 * This module installs a **single, persistent** wrapper around `tls.connect`
 * that performs DANE verification after the TLS handshake completes.  The
 * wrapper is concurrency-safe because each connection's DANE verifier is
 * stored on its own unique TLS options object (set by `prepareDaneTlsOptions`),
 * so concurrent connections never interfere with each other.
 *
 * For connections that do not require DANE (i.e. the options object does not
 * contain `_daneVerifier`), the wrapper is a transparent passthrough to the
 * original `tls.connect` — one `typeof` check, zero behavioral change.
 *
 * ## DANE-TA Chain Verification (RFC 7672 §3.1.2)
 *
 * DANE-TA (usage 2) requires matching TLSA records against CA certificates
 * in the chain, not just the leaf.  The wrapper extracts the full chain via
 * `socket.getPeerCertificate(true)` and passes it to `verifyCertAgainstTlsa`
 * from `@forwardemail/mx-connect` for proper DANE-TA verification.
 *
 * ## Security Properties
 *
 *   - **Fail-closed**: any exception during verification destroys the socket.
 *     The only code path that allows a connection through is explicit
 *     verification success (`daneVerifier` returns falsy).
 *   - **Type-guarded**: the wrapper checks `typeof _daneVerifier === 'function'`
 *     (not just truthiness), preventing injection of non-function values.
 *   - **Chain-depth limited**: `MAX_CHAIN_DEPTH` (20) prevents DoS via
 *     crafted certificate chains with deeply nested `issuerCertificate` refs.
 *   - **Cycle-safe**: fingerprint-based deduplication prevents infinite loops
 *     from self-referencing issuer chains.
 *   - **Input-validated**: `prepareDaneTlsOptions` throws `TypeError` on
 *     invalid arguments.
 *
 * ## Why String Keys (not Symbols)
 *
 * Nodemailer's `_upgradeConnection` copies TLS options via `Object.keys()`,
 * which does **not** include Symbol properties.  We therefore use underscore-
 * prefixed string keys (`_daneVerifier`, `_daneHostname`, `_daneTlsaRecords`)
 * with strict `typeof === 'function'` validation in the wrapper.
 *
 * ## Future Work
 *
 * The global `tls.connect` wrapper can be eliminated entirely if nodemailer
 * exposes a hook for custom TLS upgrade logic in `SMTPConnection`.  See the
 * companion patch for nodemailer (Approach C) that adds a `customTlsUpgrade`
 * option.  Alternatively, rewrite `get-transporter.js` to use
 * `SMTPConnection` directly (the TODO at line 220–222 of get-transporter.js).
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7672#section-3.1.1} DANE-EE
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7672#section-3.1.2} DANE-TA
 * @see {@link https://datatracker.ietf.org/doc/html/rfc6698#section-3} TLSA verification
 * @module helpers/dane-tls-wrapper
 */

const crypto = require('node:crypto');
const tls = require('node:tls');

// ---------------------------------------------------------------------------
// Module-scope resolution of verifyCertAgainstTlsa (avoids require() in the
// TLS handshake callback hot path).  If mx-connect is unavailable, DANE-TA
// chain verification gracefully degrades to leaf-only verification.
// ---------------------------------------------------------------------------
let _verifyCertAgainstTlsa;
try {
  const mxConnect = require('@forwardemail/mx-connect');
  if (
    mxConnect.dane &&
    typeof mxConnect.dane.verifyCertAgainstTlsa === 'function'
  ) {
    _verifyCertAgainstTlsa = mxConnect.dane.verifyCertAgainstTlsa;
  }
} catch {
  // mx-connect not available — DANE-TA chain verification disabled
}

// ---------------------------------------------------------------------------
// Capture the original tls.connect before any other module can patch it.
// ---------------------------------------------------------------------------
const _originalTlsConnect = tls.connect;

let _wrapperInstalled = false;

/**
 * Maximum certificate chain depth.  Real-world chains are 2–4 certs;
 * 20 is generous while preventing pathological cases.
 * @type {number}
 */
const MAX_CHAIN_DEPTH = 20;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Extract the full certificate chain from a TLS socket.
 *
 * Walks the `issuerCertificate` linked list returned by
 * `socket.getPeerCertificate(true)` and converts each certificate to an
 * `X509Certificate` instance.
 *
 * @param {tls.TLSSocket} socket
 * @returns {{ leaf: crypto.X509Certificate|null, chain: crypto.X509Certificate[] }}
 */
function extractCertificateChain(socket) {
  const peerCert = socket.getPeerCertificate(true);
  if (!peerCert || !peerCert.raw) {
    return { leaf: null, chain: [] };
  }

  const chain = [];
  const seen = new Set();
  let current = peerCert;

  while (current && current.raw && chain.length < MAX_CHAIN_DEPTH) {
    const fp = current.fingerprint256 || current.fingerprint;
    if (fp && seen.has(fp)) break;
    if (fp) seen.add(fp);

    try {
      chain.push(new crypto.X509Certificate(current.raw));
    } catch {
      // Construction failure for the leaf → caller sees leaf === null.
      // Construction failure for an intermediate → truncated chain (fail-closed
      // for DANE-TA if the matching CA cert was beyond this point).
      break;
    }

    const issuer = current.issuerCertificate;
    if (!issuer || issuer === current) break;
    current = issuer;
  }

  return {
    leaf: chain.length > 0 ? chain[0] : null,
    chain
  };
}

/**
 * Create a DANE verification error with standard properties.
 *
 * @param {string} message
 * @param {string} hostname
 * @returns {Error}
 */
function createDaneError(message, hostname) {
  const err = new Error(`DANE verification failed for ${hostname}: ${message}`);
  err.code = 'DANE_VERIFICATION_FAILED';
  err.category = 'dane';
  return err;
}

/**
 * Perform DANE verification on a TLS socket.
 *
 * Returns `undefined` **only** on explicit success.  All other paths return
 * an `Error` (fail-closed).
 *
 * @param {tls.TLSSocket} socket
 * @param {Function}       daneVerifier  — `checkServerIdentity` signature
 * @param {string}         hostname
 * @param {Array}          [tlsaRecords] — raw TLSA records for chain verification
 * @returns {Error|undefined}
 */
function performDaneVerification(socket, daneVerifier, hostname, tlsaRecords) {
  const { leaf, chain } = extractCertificateChain(socket);

  if (!leaf) {
    return createDaneError('no peer certificate available', hostname);
  }

  // ------------------------------------------------------------------
  // 1.  DANE-EE (usage 3): verify the leaf certificate.
  // ------------------------------------------------------------------
  const verifyError = daneVerifier(hostname, leaf);

  if (!verifyError) {
    return undefined; // ← the only success path for leaf-only check
  }

  // ------------------------------------------------------------------
  // 2.  DANE-TA (usage 2): fall back to full-chain verification.
  //     mx-connect's createDaneVerifier does not pass the chain to
  //     verifyCertAgainstTlsa, so we call it directly here.
  // ------------------------------------------------------------------
  if (
    chain.length > 1 &&
    Array.isArray(tlsaRecords) &&
    tlsaRecords.length > 0 &&
    typeof _verifyCertAgainstTlsa === 'function'
  ) {
    try {
      const result = _verifyCertAgainstTlsa(leaf, tlsaRecords, chain);
      if (result && result.valid === true) {
        return undefined; // ← success via chain match
      }
    } catch {
      // Fall through — return the original leaf-only error (fail-closed).
    }
  }

  // ------------------------------------------------------------------
  // 3.  Verification failed — return a proper Error.
  // ------------------------------------------------------------------
  if (verifyError instanceof Error) {
    return verifyError;
  }

  return createDaneError(String(verifyError.message || verifyError), hostname);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Install the global `tls.connect` wrapper (idempotent).
 *
 * The wrapper is a transparent passthrough for all non-DANE connections.
 * Only calls whose `opts` object contains a `_daneVerifier` **function**
 * trigger DANE verification.
 */
function installDaneWrapper() {
  if (_wrapperInstalled) return;
  _wrapperInstalled = true;

  tls.connect = function (opts, callback) {
    // Read DANE properties from the per-connection options object.
    const daneVerifier = opts && opts._daneVerifier;
    const daneHostname = opts && opts._daneHostname;
    const tlsaRecords = opts && opts._daneTlsaRecords;

    // Remove custom properties before passing to the real tls.connect.
    if (opts) {
      delete opts._daneVerifier;
      delete opts._daneHostname;
      delete opts._daneTlsaRecords;
    }

    // SECURITY: only a real function triggers the DANE path.
    if (typeof daneVerifier !== 'function') {
      return _originalTlsConnect.call(tls, opts, callback);
    }

    // Wrap the handshake callback to inject DANE verification.
    const wrappedCallback = function () {
      try {
        const error = performDaneVerification(
          socket,
          daneVerifier,
          daneHostname,
          tlsaRecords
        );

        if (error) {
          socket.destroy(error);
          return;
        }

        // Verification passed — hand control back to nodemailer.
        if (typeof callback === 'function') {
          callback();
        }
      } catch (err) {
        // Fail-closed: unexpected exception → destroy socket.
        if (!err.code) err.code = 'DANE_VERIFICATION_FAILED';
        if (!err.category) err.category = 'dane';
        socket.destroy(err);
      }
    };

    const socket = _originalTlsConnect.call(tls, opts, wrappedCallback);
    return socket;
  };
}

/**
 * Prepare TLS options for DANE verification.
 *
 * Sets `rejectUnauthorized` to `false` (required for DANE-EE with self-signed
 * certs) and stores the DANE verifier, hostname, and TLSA records as custom
 * properties on the TLS options object.  Nodemailer copies all TLS option
 * keys (via `Object.keys`) into the `tls.connect()` call, where the global
 * wrapper reads and removes them.
 *
 * Also installs the global wrapper on first call (idempotent).
 *
 * @param {object}   tlsOptions   — the `tls` object passed to nodemailer
 * @param {Function} daneVerifier — verifier from mx-connect
 * @param {string}   hostname     — MX hostname
 * @param {Array}    [tlsaRecords] — raw TLSA records for DANE-TA
 * @throws {TypeError} on invalid arguments
 */
function prepareDaneTlsOptions(
  tlsOptions,
  daneVerifier,
  hostname,
  tlsaRecords
) {
  if (!tlsOptions || typeof tlsOptions !== 'object') {
    throw new TypeError('tlsOptions must be an object');
  }

  if (typeof daneVerifier !== 'function') {
    throw new TypeError('daneVerifier must be a function');
  }

  if (typeof hostname !== 'string' || hostname.length === 0) {
    throw new TypeError('hostname must be a non-empty string');
  }

  installDaneWrapper();

  // RFC 7672 §3.1.1 — DANE-EE does not require PKIX validation.
  tlsOptions.rejectUnauthorized = false;

  tlsOptions._daneVerifier = daneVerifier;
  tlsOptions._daneHostname = hostname;
  if (Array.isArray(tlsaRecords)) {
    tlsOptions._daneTlsaRecords = tlsaRecords;
  }
}

module.exports = { prepareDaneTlsOptions };
