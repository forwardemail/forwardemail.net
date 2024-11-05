/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const WKDClient = require('@openpgp/wkd-client');
const ms = require('ms');
const undici = require('undici');

const TimeoutError = require('./timeout-error');
const config = require('#config');

const DURATION = config.env === 'test' ? '5s' : '2s';

//
// NOTE: this uses `fetch` which is OK because
//       as of Node v18 it uses Undici fetch under the hood
//
//       HOWEVER there's no default timeout in this implementation
//       <https://github.com/openpgpjs/wkd-client/issues/6>
//
// <https://github.com/nodejs/undici/issues/421#issuecomment-1491441971>
// <https://keys.openpgp.org/about/api#rate-limiting>
//
// Undici had a core bug with arrayBuffer() memory leak
// <https://github.com/nodejs/undici/issues/3435>
//
// TODO: pending PR in wkd-client package
// <https://github.com/openpgpjs/wkd-client/issues/3>
// <https://github.com/openpgpjs/wkd-client/pull/4>
//
function WKD(resolver) {
  const _wkd = new WKDClient();
  _wkd._fetch = async (url) => {
    const abortController = new AbortController();
    const t = setTimeout(() => {
      if (!abortController?.signal?.aborted)
        abortController.abort(
          new TimeoutError(`${url} took longer than ${DURATION}`)
        );
    }, ms(DURATION));
    const response = await undici.fetch(url, {
      signal: abortController.signal,
      dispatcher: new undici.Agent({
        headersTimeout: ms(DURATION),
        connectTimeout: ms(DURATION),
        bodyTimeout: ms(DURATION),
        connect: {
          lookup(hostname, options, fn) {
            resolver
              .lookup(hostname, options)
              .then((result) => {
                fn(null, result?.address, result?.family);
              })
              .catch((err) => fn(err));
          }
        }
      })
    });
    clearTimeout(t);
    return response;
  };

  return _wkd;
}

module.exports = WKD;
