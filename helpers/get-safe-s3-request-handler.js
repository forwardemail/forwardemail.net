/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dns = require('node:dns');
const http = require('node:http');
const https = require('node:https');
const net = require('node:net');
const process = require('node:process');

const config = require('#config');
const isPrivateHost = require('#helpers/is-private-host');

//
// Custom (customer supplied) S3 endpoints are validated when they are saved,
// but the hostname that is validated is not necessarily the hostname that is
// connected to, and the answer DNS gives at save time is not necessarily the
// answer it gives at connect time (DNS rebinding, a record changed later).
//
// This checks the address at the moment the socket is opened instead: every
// address the endpoint resolves to must be public, otherwise the connection
// fails before any request is sent.  The request stays on the original
// hostname, so TLS verification and SNI are unaffected.
//
// NOTE: loopback is allowed in the test environment only, where the suite
//       runs a local S3 stand-in on 127.0.0.1.
//
function isBlockedAddress(address) {
  if (config.env === 'test' && /^(127\.|::1$|::ffff:127\.)/.test(address))
    return false;
  return isPrivateHost(address);
}

function safeLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err);
    if (
      !Array.isArray(addresses) ||
      addresses.length === 0 ||
      addresses.some((a) => isBlockedAddress(a.address))
    ) {
      const error = new Error(
        `Connection to ${hostname} blocked: it resolves to a non-public address`
      );
      error.code = 'EPRIVATEADDRESS';
      return callback(error);
    }

    if (options && options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
}

//
// Node never calls `lookup` for an IP literal, so a literal is checked when
// the connection is created instead.
//
function blockedLiteral(options) {
  const host = String(options.host || options.hostname || '').replace(
    /^\[|]$/g,
    ''
  );
  if (!net.isIP(host) || !isBlockedAddress(host)) return null;
  const error = new Error(
    `Connection to ${host} blocked: it is a non-public address`
  );
  error.code = 'EPRIVATEADDRESS';
  return error;
}

class SafeHttpAgent extends http.Agent {
  createConnection(options, callback) {
    const error = blockedLiteral(options);
    if (error) {
      // defer so the error is emitted after the request attached listeners
      const socket = new net.Socket();
      process.nextTick(() => socket.destroy(error));
      return socket;
    }

    return super.createConnection(options, callback);
  }
}

class SafeHttpsAgent extends https.Agent {
  createConnection(options, callback) {
    const error = blockedLiteral(options);
    if (error) {
      const socket = new net.Socket();
      process.nextTick(() => socket.destroy(error));
      return socket;
    }

    return super.createConnection(options, callback);
  }
}

//
// Returns the options object accepted by the S3Client `requestHandler`
// setting (it is passed through to the SDK's NodeHttpHandler).
//
function getSafeS3RequestHandler({
  connectionTimeout = 10_000,
  idleTimeout = 120_000
} = {}) {
  return {
    // A customer endpoint that accepts the connection and never answers must
    // not hold a domain save (or a backup) open forever. socketTimeout is the
    // time the socket may sit idle (the SDK's requestTimeout only logs a
    // warning unless told otherwise, and would cut long uploads besides), so a
    // large upload that keeps sending is never interrupted.
    connectionTimeout,
    socketTimeout: idleTimeout,
    httpAgent: new SafeHttpAgent({ keepAlive: true, lookup: safeLookup }),
    httpsAgent: new SafeHttpsAgent({ keepAlive: true, lookup: safeLookup })
  };
}

module.exports = getSafeS3RequestHandler;
module.exports.safeLookup = safeLookup;
