/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Shared TLS configuration for all Forward Email servers.
 *
 * This module provides a hardened TLS configuration that:
 * - Enforces server cipher suite preference order (honorCipherOrder)
 * - Restricts cipher suites to those with forward secrecy (ECDHE/DHE)
 * - Excludes RSA key exchange (no forward secrecy)
 * - Excludes ARIA ciphers
 * - Excludes weak hash functions (SHA-1, SHA-224) from signature algorithms
 * - Uses secure ECDH curves
 *
 * Two profiles are available:
 * - 'strict' (default): Passes internet.nl tests. Only AEAD + forward secrecy.
 *   Use for all public-facing ports tested by internet.nl (25, 443, 465, 587, 993, 995, 4190).
 *
 * - 'compat': For backward-compatible legacy SMTP ports (TLS 1.0/1.1).
 *   Adds CBC ciphers with forward secrecy for older clients that cannot
 *   negotiate AEAD suites. Still excludes RSA key exchange.
 *   Use for legacy ports (2455, 2555) where SMTP_TLS_MIN_VERSION=TLSv1.
 *
 * References:
 * - https://internet.nl (Dutch Internet Standards Platform)
 * - https://wiki.mozilla.org/Security/Server_Side_TLS
 * - https://ssl-config.mozilla.org/
 * - NCSC TLS Guidelines (NL): https://english.ncsc.nl/publications/publications/2021/january/19/it-security-guidelines-for-transport-layer-security-2.1
 * - Stalwart mail server: ECDHE-only, AEAD-only, TLS 1.2+ (strict)
 * - Dovecot: !kRSA, TLS 1.2+ (strict)
 * - WildDuck/nodemailer/smtp-server: TLS 1.0+, Node.js defaults (permissive)
 * - Haraka: TLS 1.0+, explicit cipher list with CBC + RSA KEX (permissive)
 */

//
// TLS 1.2 cipher suites ordered by security level:
//
// "Good" (ECDHE + AEAD):
//   - ECDHE-ECDSA-AES256-GCM-SHA384
//   - ECDHE-RSA-AES256-GCM-SHA384
//   - ECDHE-ECDSA-AES128-GCM-SHA256
//   - ECDHE-RSA-AES128-GCM-SHA256
//   - ECDHE-ECDSA-CHACHA20-POLY1305
//   - ECDHE-RSA-CHACHA20-POLY1305
//
// "Sufficient" (DHE + AEAD):
//   - DHE-RSA-AES256-GCM-SHA384
//   - DHE-RSA-AES128-GCM-SHA256
//   - DHE-RSA-CHACHA20-POLY1305
//
// TLS 1.3 cipher suites are always enabled and not affected by the
// `ciphers` option (they are controlled separately by OpenSSL).
//

//
// Strict cipher list: Only AEAD + forward secrecy.
// This is what internet.nl requires to pass.
// Matches Stalwart, Dovecot, and Mozilla intermediate profile.
//
const CIPHERS = [
  // ECDHE + AES-GCM (Good - forward secrecy + AEAD)
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  // ECDHE + CHACHA20-POLY1305 (Good - forward secrecy + AEAD)
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-RSA-CHACHA20-POLY1305',
  // DHE + AES-GCM (Sufficient - forward secrecy + AEAD)
  'DHE-RSA-AES256-GCM-SHA384',
  'DHE-RSA-AES128-GCM-SHA256',
  // DHE + CHACHA20-POLY1305 (Sufficient - forward secrecy + AEAD)
  'DHE-RSA-CHACHA20-POLY1305'
].join(':');

//
// Compat cipher list: Adds CBC ciphers with forward secrecy for
// backward compatibility with older SMTP servers/clients that
// cannot negotiate AEAD cipher suites (e.g. TLS 1.0/1.1 only clients).
//
// This list is modeled after WildDuck and Haraka cipher lists, but
// with RSA key exchange removed (no forward secrecy).
//
// Cipher ordering:
//   1. AEAD ciphers with ECDHE (best)
//   2. AEAD ciphers with DHE (good)
//   3. CBC ciphers with ECDHE + SHA-256/SHA-384 (TLS 1.2 CBC)
//   4. CBC ciphers with DHE + SHA-256 (TLS 1.2 CBC)
//   5. CBC ciphers with ECDHE + SHA-1 (TLS 1.0/1.1 compat)
//   6. CBC ciphers with DHE + SHA-1 (TLS 1.0/1.1 compat)
//
// NOTE: RSA key exchange is still excluded (no forward secrecy).
// NOTE: 3DES is excluded (too weak, CVE-2016-2183 Sweet32).
// NOTE: ARIA is excluded (internet.nl marks as "phase out").
//
const COMPAT_CIPHERS = [
  // === AEAD ciphers with forward secrecy (preferred) ===
  // ECDHE + AES-GCM
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  // ECDHE + CHACHA20-POLY1305
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-RSA-CHACHA20-POLY1305',
  // DHE + AES-GCM
  'DHE-RSA-AES256-GCM-SHA384',
  'DHE-RSA-AES128-GCM-SHA256',
  // DHE + CHACHA20-POLY1305
  'DHE-RSA-CHACHA20-POLY1305',

  // === CBC ciphers with forward secrecy + SHA-256/SHA-384 MACs ===
  // (TLS 1.2 CBC - for clients that support TLS 1.2 but not AEAD)
  'ECDHE-ECDSA-AES256-SHA384',
  'ECDHE-RSA-AES256-SHA384',
  'ECDHE-ECDSA-AES128-SHA256',
  'ECDHE-RSA-AES128-SHA256',
  'DHE-RSA-AES256-SHA256',
  'DHE-RSA-AES128-SHA256',

  // === CBC ciphers with forward secrecy + SHA-1 MACs ===
  // (TLS 1.0/1.1 compat - for very old SMTP clients/servers)
  // NOTE: SHA-1 in HMAC-SHA1 for record MAC is NOT the same as SHA-1
  // in signatures; HMAC-SHA1 is still considered secure for MAC usage.
  'ECDHE-ECDSA-AES256-SHA',
  'ECDHE-RSA-AES256-SHA',
  'ECDHE-ECDSA-AES128-SHA',
  'ECDHE-RSA-AES128-SHA',
  'DHE-RSA-AES256-SHA',
  'DHE-RSA-AES128-SHA'
].join(':');

//
// Signature algorithms for TLS 1.2 key exchange.
// Excludes SHA-1 and SHA-224 which are considered outdated.
//
// internet.nl flags SHA-224 as "phase out" for the hash function
// used in key exchange signatures.
//
const SIGALGS = [
  // ECDSA signature algorithms
  'ecdsa_secp256r1_sha256',
  'ecdsa_secp384r1_sha384',
  'ecdsa_secp521r1_sha512',
  // RSA-PSS signature algorithms (preferred over PKCS#1 v1.5)
  'rsa_pss_rsae_sha256',
  'rsa_pss_rsae_sha384',
  'rsa_pss_rsae_sha512',
  // RSA PKCS#1 v1.5 signature algorithms (fallback)
  'rsa_pkcs1_sha256',
  'rsa_pkcs1_sha384',
  'rsa_pkcs1_sha512'
].join(':');

/**
 * Get hardened TLS options suitable for all Forward Email servers.
 *
 * @param {object} [overrides] - Optional overrides for specific use cases
 * @param {string} [overrides.minVersion] - Minimum TLS version (default: 'TLSv1.2')
 * @param {string} [overrides.maxVersion] - Maximum TLS version (default: undefined, allows highest)
 * @param {string} [overrides.ciphers] - Override cipher string
 * @param {string} [overrides.profile] - 'strict' (default) or 'compat' for legacy TLS support
 * @param {boolean} [overrides.honorCipherOrder] - Override cipher order enforcement
 * @returns {object} TLS options object
 */
function getTLSOptions(overrides = {}) {
  // Determine which cipher profile to use
  const profile = overrides.profile || 'strict';
  const isCompat = profile === 'compat';

  // Remove 'profile' from overrides so it doesn't get spread into the result
  const { profile: _profile, ...rest } = overrides;

  return {
    //
    // Enforce server cipher suite preference order.
    // This ensures the server picks the most secure cipher
    // rather than letting the client choose.
    //
    honorCipherOrder: true,

    //
    // Only allow cipher suites with:
    // - Forward secrecy (ECDHE or DHE key exchange)
    // - AEAD encryption (GCM or CHACHA20-POLY1305) in strict mode
    // - AEAD + CBC in compat mode (still requires forward secrecy)
    //
    // This always excludes:
    // - RSA key exchange (no forward secrecy) - "insufficient" per internet.nl
    // - ARIA ciphers - "phase out" per internet.nl
    // - DSS authentication - deprecated
    // - 3DES - weak (Sweet32 attack)
    //
    ciphers: isCompat ? COMPAT_CIPHERS : CIPHERS,

    //
    // Restrict signature algorithms to exclude SHA-1 and SHA-224.
    // internet.nl flags SHA-224 as an outdated hash function for
    // key exchange signatures.
    //
    sigalgs: SIGALGS,

    //
    // Use automatic ECDH curve selection.
    // This allows the server to use the most appropriate curve
    // based on the client's capabilities.
    //
    ecdhCurve: 'auto',

    //
    // Minimum TLS version (TLS 1.2 by default).
    // TLS 1.0 and 1.1 are deprecated and should not be used
    // unless explicitly required for backward compatibility.
    //
    minVersion: 'TLSv1.2',

    // Apply any overrides (minVersion, maxVersion, etc.)
    ...rest
  };
}

// Export the function and constants for testing
module.exports = getTLSOptions;
module.exports.CIPHERS = CIPHERS;
module.exports.COMPAT_CIPHERS = COMPAT_CIPHERS;
module.exports.SIGALGS = SIGALGS;
