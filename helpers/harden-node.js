/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Runtime hardening for the Node.js v18 line this project is locked to.
//
// Node.js v18 is end-of-life and gets no security releases, so this module
// applies from JavaScript the parts of later Node.js security fixes that
// reach APIs used with third-party input (the Brotli decoder fix,
// CVE-2026-111497, cannot be applied this way: see `refuse-unsafe-encoding` for
// where third-party Brotli is refused instead):
//
// 1. TLS hostnames (CVE-2026-106069, CVE-2026-106072): a host that only
//    becomes an IP address after IDNA normalization (`127.1`, `0x7f.0.0.1`,
//    `2130706433`, fullwidth digits) is rejected instead of being matched
//    against the certificate's DNS names, since the resolver may connect to a
//    different address than the one the certificate check saw.
//
//    A non-ASCII host is checked as its ASCII form (CVE-2026-48618), so a
//    Unicode full stop cannot hide a label from a wildcard certificate.
//
//    A certificate whose subjectAltName extension could not be read is not
//    matched by its common name instead (Node.js `crypto: harden X.509
//    conversion and formatting`).
//
// 2. Compromised CAs (Node.js `tls: reject chains containing blocked public
//    keys`, NSS 3.131.1): a chain through one of the eMudhra/emSign
//    intermediates whose private keys were reported compromised in October
//    2026, or through one of the three emSign roots removed with them, fails
//    with `CERT_REVOKED`.
//
// 3. DNS (CVE-2026-105482, CVE-2026-48930): a name with a NUL byte is
//    rejected before it reaches c-ares or getaddrinfo, which would otherwise
//    look up only the part before the NUL (`dns.lookup` is covered too, and
//    so every connection that does not bring its own `lookup`).
//
// 4. TLS clients: a resumed session skips the hostname check, and v18 can
//    resume a session made for another host (CVE-2026-58040,
//    CVE-2026-48934), so client connections always make a full handshake;
//    and a server may not renegotiate, which can crash undici 7.12.0
//    (CVE-2026-87018). A connection made with its own `checkServerIdentity`
//    still gets the non-canonical IP check of 1. and the check of 2. first.
//
// 5. TLS servers (`tls.createServer`, `https.createServer`): a client that
//    stalls its handshake holds the memory OpenSSL allocated for it for 120
//    seconds by default (fixed in OpenSSL 3.0.21), so a server without its
//    own `handshakeTimeout` gets `tlsHandshakeTimeout` (30 seconds).
//
// 6. HTTP servers: a pipelined request queued behind another one never got
//    its response closed when the client went away (fixed in 24.16.0), so a
//    stream piped to it was never destroyed; and a
//    `Connection` value with a tab in it (`close<TAB>`) was not read as
//    "close" (fixed in llhttp 9.4.2), so a request whose `Connection` header
//    asks to close now closes the connection.
//
// 7. HTTP clients: aborting a request whose response had already fully
//    arrived on a keep-alive socket raised an error nothing listened for
//    (fixed in 24.22.0; such a socket now goes back to the agent, as there
//    is nothing left to cancel); and an HTTP/2 server could grow a session's
//    `originSet` without bound with ORIGIN frames (CVE-2026-48619).
//
// `config/env` loads this, and every entry point (web.js, api.js, imap.js,
// …, and the jobs) loads `config/env` before anything else, or reaches it
// through `#config` or the logger before it connects anywhere. The wrappers
// take effect when called, so a module loaded earlier is covered as well,
// unless it kept its own reference to an original function.
//

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
const dns = require('node:dns');
const dnsPromises = require('node:dns/promises');
const { syncBuiltinESMExports } = require('node:module');
const net = require('node:net');
const process = require('node:process');
const http = require('node:http');
const http2 = require('node:http2');
const https = require('node:https');
const tls = require('node:tls');
const { domainToASCII } = require('node:url');

const kHardened = Symbol.for('forwardemail.harden-node');

function replace(target, key, value) {
  const descriptor = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: descriptor ? descriptor.enumerable : true,
    writable: true,
    value
  });
}

// (keeps e.g. `util.promisify.custom` and the `customPromisifyArgs` symbol
//  of `dns.lookup`, so `util.promisify(dns.lookup)` still resolves to
//  `{ address, family }`)
function copySymbols(from, to) {
  for (const key of Object.getOwnPropertySymbols(from)) {
    Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
  }

  return to;
}

//
// 1. and 2. TLS
//
const originalCheckServerIdentity = tls.checkServerIdentity;

//
// SHA-256 of the DER SubjectPublicKeyInfo of each blocked CA (the list
// Node.js, Go and Electron ship, plus the three emSign roots NSS 3.131.1
// removed in the same incident)
//
const BLOCKED_SPKI_SHA256 = new Set([
  // C=US, O=eMudhra Inc, CN=EM DV TLS CA - G3C
  '49dd353dc2b919a3770645117d0e60c16115e7d1bc259eefe734b00ea434fe5f',
  // C=US, O=eMudhra Inc, CN=EM EV TLS CA - G3C
  '5c0660a2b164910d8ff589c18e14552e9e0ec237dcefe2cb736d41a4811f81a0',
  // C=US, O=eMudhra Inc, CN=EM OV TLS CA - G3C
  '63ecefee431d49523bc1136c4e72d0206a477086caf606cd5cf025686c109cf8',
  // C=US, O=eMudhra Inc, CN=EM OV CS CA - G3C
  '92c063d67e8f14db71d288e11266ffdaf69cbf115f7bab14f3bc2f68d25e0e30',
  // C=NL, O=eMudhra BV, CN=EM DV TLS CA - G3B
  'ebed6475c2c2d80fcb199f3fe8dd6e6b3ce60b77eb15d4e42c3dec0c6f5b5105',
  // C=NL, O=eMudhra BV, CN=EM OV CS CA - G3B
  'ec4ffa1ad0ac88081314b7aaffef6a91f97cd57291bb5ba686c5415f5eb4f6b6',
  // C=NL, O=eMudhra BV, CN=EM OV TLS CA - G3B
  '43bffa19d6ef651451f6841e019931e96f6f2eaeff28ab4b6f1ce4576de2717b',
  // C=NL, O=eMudhra BV, CN=EM EV TLS CA - G3B
  'e0254c7fcdc265e2f0f8a428dabb75ab4ae039b4872d62f5ee57f0877d5a8a41',
  // C=IN, OU=emSign PKI, O=eMudhra Technologies Limited, CN=emSign ECC Root CA - G3
  '8d417db2dd8bf5e3084d1e3f196d583849d81bdd4c00c70b9d39369e96b8c782',
  // C=US, OU=emSign PKI, O=eMudhra Inc, CN=emSign Root CA - C1
  'b7408b4d2be0238ba37004dd34e276c6019bd2f24c9db7d4980f5f6c359a4bcc',
  // C=US, OU=emSign PKI, O=eMudhra Inc, CN=emSign ECC Root CA - C3
  'eabc185c4e82d942b1a5978ba3c0181487d6b3b9974e5c49f72f6d0bd9637150'
]);

// (certificate DER → SPKI hash; peers present the same few CA certificates
//  over and over, so this saves parsing them on every handshake)
const spkiCache = new Map();
const SPKI_CACHE_SIZE = 1024;

function getSpkiHash(raw) {
  const key = crypto.createHash('sha256').update(raw).digest('hex');
  let hash = spkiCache.get(key);
  if (hash) return hash;
  hash = crypto
    .createHash('sha256')
    .update(
      new crypto.X509Certificate(raw).publicKey.export({
        type: 'spki',
        format: 'der'
      })
    )
    .digest('hex');
  if (spkiCache.size >= SPKI_CACHE_SIZE) spkiCache.clear();
  spkiCache.set(key, hash);
  return hash;
}

//
// The first certificate of the chain `getPeerCertificate(true)` returns that
// is blocked (or that cannot be read, so that it cannot be used to slip past
// the check), else null
//
function getBlockedCertificate(cert) {
  const seen = new Set();
  for (
    let current = cert;
    current && typeof current === 'object' && !seen.has(current);
    current = current.issuerCertificate
  ) {
    seen.add(current);
    if (!Buffer.isBuffer(current.raw)) continue;
    try {
      if (BLOCKED_SPKI_SHA256.has(getSpkiHash(current.raw))) return current;
    } catch {
      return current;
    }
  }

  return null;
}

function unfqdn(host) {
  return host.replace(/\.$/, '');
}

// (as `net.isIP()` sees the host, it is not an IP address, but URL host
//  parsing and the system resolver read it as one)
function isNonCanonicalIP(hostname) {
  const host = unfqdn(String(hostname));
  return net.isIP(host) === 0 && net.isIP(unfqdn(domainToASCII(host))) !== 0;
}

function createAltnameError(reason, host, cert) {
  const err = new Error(
    `Hostname/IP does not match certificate's altnames: ${reason}`
  );
  err.code = 'ERR_TLS_CERT_ALTNAME_INVALID';
  err.reason = reason;
  err.host = host;
  err.cert = cert;
  return err;
}

// (the DER encoding of the subjectAltName extension's OID, 2.5.29.17)
const SUBJECT_ALT_NAME_OID = Buffer.from([0x06, 0x03, 0x55, 0x1d, 0x11]);

//
// Node.js v18 leaves `subjectaltname` out when the extension is present but
// cannot be converted, and `checkServerIdentity` then matches the common name
// as if the certificate had no subjectAltName at all
//
function hasUnreadableAltNames(cert) {
  return (
    Boolean(cert) &&
    typeof cert.subjectaltname !== 'string' &&
    Buffer.isBuffer(cert.raw) &&
    cert.raw.includes(SUBJECT_ALT_NAME_OID)
  );
}

// (the checks every connection gets, whatever checks the name after them)
function getConnectionError(host, cert) {
  if (isNonCanonicalIP(host))
    return createAltnameError('Host is a non-canonical IP address', host, cert);

  const blocked = getBlockedCertificate(cert);
  if (blocked) {
    const err = new Error('certificate revoked');
    err.code = 'CERT_REVOKED';
    err.cert = blocked;
    return err;
  }
}

function checkServerIdentity(hostname, cert) {
  const host = String(hostname);
  const err = getConnectionError(host, cert);
  if (err) return err;

  if (hasUnreadableAltNames(cert))
    return createAltnameError(
      "Certificate's subjectAltName could not be read",
      host,
      cert
    );

  //
  // (CVE-2026-48618: v18 splits the host on "." only, so a Unicode full stop
  //  keeps "foo\u3002bar" in one label and "foo\u3002bar.example.com" matches
  //  "*.example.com", though a URL with that host, as fetch and https see it,
  //  goes to foo.bar.example.com; a non-ASCII host is checked as its ASCII
  //  form)
  //
  if (net.isIP(host) === 0 && [...host].some((c) => c.codePointAt(0) > 0x7f)) {
    const ascii = domainToASCII(host);
    if (!ascii)
      return createAltnameError('Host is not a valid domain name', host, cert);
    return originalCheckServerIdentity(ascii, cert);
  }

  return originalCheckServerIdentity(hostname, cert);
}

//
// 4. TLS clients
//
const originalTlsConnect = tls.connect;

// (`tls.connect(options)`, `tls.connect(port, host, options)` and
//  `tls.connect(path, options)` all take the options as the one object)
function tlsConnect(...args) {
  let index = args.findIndex((arg) => arg !== null && typeof arg === 'object');
  if (index === -1) {
    // (options go before the callback, if there is one)
    index = args.findIndex((arg) => typeof arg === 'function');
    if (index === -1) index = args.length;
    args.splice(index, 0, {});
  }

  const { session, ...options } = args[index];
  // (`secureOptions` is not used when a `secureContext` is given, so the
  //  option is set on that context instead)
  if (typeof options.secureContext?.context?.setOptions === 'function')
    options.secureContext.context.setOptions(
      crypto.constants.SSL_OP_NO_RENEGOTIATION
    );
  else
    options.secureOptions =
      // eslint-disable-next-line no-bitwise
      (options.secureOptions || 0) | crypto.constants.SSL_OP_NO_RENEGOTIATION;

  const custom = options.checkServerIdentity;
  if (custom === originalCheckServerIdentity)
    options.checkServerIdentity = checkServerIdentity;
  else if (typeof custom === 'function' && custom !== checkServerIdentity)
    options.checkServerIdentity = function (hostname, cert) {
      return (
        getConnectionError(String(hostname), cert) ||
        Reflect.apply(custom, this, [hostname, cert])
      );
    };

  args[index] = options;
  return Reflect.apply(originalTlsConnect, this, args);
}

//
// 3. DNS
//
function createNullByteError(argument, value) {
  const err = new TypeError(
    `The argument '${argument}' must be a string without null bytes. Received ${JSON.stringify(
      value
    )}`
  );
  err.code = 'ERR_INVALID_ARG_VALUE';
  return err;
}

function hasNullByte(value) {
  return typeof value === 'string' && value.includes('\0');
}

// (the error goes to the callback rather than being thrown, since e.g.
//  `net.connect()` calls `dns.lookup()` where a throw is not expected)
function guardCallback(fn, argument) {
  return copySymbols(fn, function (name, ...args) {
    if (hasNullByte(name)) {
      const err = createNullByteError(argument, name);
      const callback = args.at(-1);
      if (typeof callback !== 'function') throw err;
      process.nextTick(callback, err);
      return;
    }

    return fn.call(this, name, ...args);
  });
}

function guardPromise(fn, argument) {
  return copySymbols(fn, function (name, ...args) {
    if (hasNullByte(name))
      return Promise.reject(createNullByteError(argument, name));
    return fn.call(this, name, ...args);
  });
}

const RESOLVE_METHODS = [
  'resolve',
  'resolve4',
  'resolve6',
  'resolveAny',
  'resolveCaa',
  'resolveCname',
  'resolveMx',
  'resolveNaptr',
  'resolveNs',
  'resolvePtr',
  'resolveSoa',
  'resolveSrv',
  'resolveTxt'
];

function hardenDns() {
  const targets = [
    [dns, guardCallback],
    [dns.Resolver.prototype, guardCallback],
    [dnsPromises, guardPromise],
    [dnsPromises.Resolver.prototype, guardPromise]
  ];
  for (const [target, guard] of targets) {
    for (const method of RESOLVE_METHODS) {
      if (typeof target[method] === 'function')
        replace(target, method, guard(target[method], 'hostname'));
    }

    if (typeof target.reverse === 'function')
      replace(target, 'reverse', guard(target.reverse, 'ip'));
  }

  replace(dns, 'lookup', guardCallback(dns.lookup, 'hostname'));
  replace(dnsPromises, 'lookup', guardPromise(dnsPromises.lookup, 'hostname'));

  // (`setLocalAddress` is on the base class both resolvers share)
  for (const Resolver of [dns.Resolver, dnsPromises.Resolver]) {
    const base = Object.getPrototypeOf(Resolver.prototype);
    const { setLocalAddress } = base;
    if (
      typeof setLocalAddress !== 'function' ||
      setLocalAddress[kHardened] === true
    )
      continue;
    const guarded = function (ipv4, ipv6) {
      if (hasNullByte(ipv4)) throw createNullByteError('ipv4', ipv4);
      if (hasNullByte(ipv6)) throw createNullByteError('ipv6', ipv6);
      return setLocalAddress.call(this, ipv4, ipv6);
    };

    guarded[kHardened] = true;
    replace(base, 'setLocalAddress', guarded);
  }
}

//
// 5. TLS servers
//
const exported = { tlsHandshakeTimeout: 30_000 };

// (`createServer([options][, listener])`: options are the first argument
//  when it is not the listener)
function withHandshakeTimeout(createServer) {
  return copySymbols(createServer, function (...args) {
    if (typeof args[0] === 'function') args.unshift({});
    else if (args[0] === undefined || args[0] === null) args[0] = {};
    if (typeof args[0] === 'object' && args[0].handshakeTimeout === undefined)
      args[0] = { ...args[0], handshakeTimeout: exported.tlsHandshakeTimeout };
    return Reflect.apply(createServer, this, args);
  });
}

//
// 6. HTTP servers
//
// (the tokens of a request's Connection header, as stored after trimming)
function asksToClose(req) {
  return String(req.headers?.connection || '')
    .split(',')
    .some((token) => token.trim().toLowerCase() === 'close');
}

// (the responses of a connection still queued behind another one)
const kQueuedResponses = Symbol('queued responses');

function closeQueuedResponse(res) {
  if (res.socket || res.destroyed) return;
  res.destroy();
  // (as Node.js marks it, so `stream.finished` and `pipeline` see it)
  res._closed = true;
  res.emit('close');
}

function withRequestFixes(emit) {
  return function (event, req, res, ...args) {
    if (event === 'request' && req && res) {
      // (a response queued behind another, still without a socket, is
      //  closed when the connection is, as on patched lines)
      if (!res.socket && req.socket) {
        const { socket } = req;
        let queued = socket[kQueuedResponses];
        if (!queued) {
          queued = new Set();
          socket[kQueuedResponses] = queued;
          socket.once('close', () => {
            for (const response of queued) closeQueuedResponse(response);
            queued.clear();
          });
        }

        // (once the response has its socket, or is done, Node.js closes it)
        queued.add(res);
        const forget = () => queued.delete(res);
        res.once('socket', forget);
        res.once('finish', forget);
        res.once('close', forget);
      }

      // (the parser kept a connection open when `close` was followed by a
      //  tab; the stored header has it trimmed, so it is honored here)
      if (res.shouldKeepAlive && asksToClose(req)) res.shouldKeepAlive = false;
    }

    return Reflect.apply(emit, this, [event, req, res, ...args]);
  };
}

//
// 7. HTTP clients
//
const originalDestroy = http.ClientRequest.prototype.destroy;
function destroy(err) {
  // (nothing is left to cancel, and the socket is going back to the agent)
  if (!this.destroyed && this.writableFinished && this.res?.complete) {
    this.destroyed = true;
    this.res._dump();
    return this;
  }

  return Reflect.apply(originalDestroy, this, [err]);
}

const MAX_ORIGINS = 128;
const originalHttp2Connect = http2.connect;
function http2Connect(...args) {
  const session = Reflect.apply(originalHttp2Connect, this, args);
  session.on('origin', () => {
    if (session.originSet && session.originSet.length > MAX_ORIGINS)
      session.destroy(new Error('Too many origins'));
  });
  return session;
}

function harden() {
  replace(tls, 'checkServerIdentity', checkServerIdentity);
  replace(tls, 'connect', copySymbols(originalTlsConnect, tlsConnect));
  for (const Server of [http.Server, https.Server])
    replace(Server.prototype, 'emit', withRequestFixes(Server.prototype.emit));
  replace(http.ClientRequest.prototype, 'destroy', destroy);
  replace(http2, 'connect', copySymbols(originalHttp2Connect, http2Connect));
  replace(tls, 'createServer', withHandshakeTimeout(tls.createServer));
  replace(https, 'createServer', withHandshakeTimeout(https.createServer));
  hardenDns();
  // (so ESM imports of the modules above see the same functions)
  syncBuiltinESMExports();
}

if (!globalThis[kHardened]) {
  harden();
  globalThis[kHardened] = Object.assign(exported, {
    BLOCKED_SPKI_SHA256,
    isNonCanonicalIP
  });
}

module.exports = globalThis[kHardened];
