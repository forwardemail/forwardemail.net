/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const WKDClient = require('@openpgp/wkd-client');
const isHTML = require('is-html');
const ms = require('ms');
const undici = require('undici');

const { isPrivateHostResolved } = require('./is-private-host');
const TimeoutError = require('./timeout-error');
const i18n = require('./i18n');
const logger = require('./logger');
const { encoder, decoder } = require('./encoder-decoder');

const config = require('#config');
const env = require('#config/env');

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
function WKD(resolver, client) {
  const _wkd = new WKDClient();
  _wkd._fetch = async (url) => {
    // Block requests to private/internal hosts (SSRF prevention)
    // Uses async DNS resolution to prevent DNS rebinding attacks
    // (bypassed in test mode so tests can use local WKD lookups)
    {
      const parsedUrl = new URL(url);
      if (
        env.NODE_ENV !== 'test' &&
        (await isPrivateHostResolved(parsedUrl.hostname))
      )
        throw Boom.badRequest(
          i18n.translateError('INVALID_LOCALHOST_URL', 'en')
        );
    }

    const abortController = new AbortController();
    const t = setTimeout(() => {
      if (!abortController?.signal?.aborted)
        abortController.abort(
          new TimeoutError(`${url} took longer than ${DURATION}`)
        );
    }, ms(DURATION));
    const dispatcher = new undici.Agent({
      headersTimeout: ms(DURATION),
      connectTimeout: ms(DURATION),
      bodyTimeout: ms(DURATION),
      //
      //
      // TODO: there is a bug in tangerine where if we supply
      //       a custom resolver in self-hosted mode then
      //       it causes an uncaught exception it appears
      //
      //
      // TODO: an uncaught exception occurs here in self hosting sometimes (?)
      // TypeError: Cannot read properties of undefined (reading 'length')
      // (which means it occurs in tangerine under the hood)
      //
      ...(config.isSelfHosted
        ? {}
        : {
            connect: {
              lookup(hostname, options, fn) {
                resolver
                  .lookup(hostname, options)
                  .then(async (result) => {
                    // FWD-01-006: Validate resolved IP at connection time
                    // to prevent TOCTOU DNS rebinding attacks
                    if (
                      env.NODE_ENV !== 'test' &&
                      result?.address &&
                      (await isPrivateHostResolved(result.address))
                    ) {
                      fn(
                        new Error(
                          `Resolved IP ${result.address} is a private address`
                        )
                      );
                      return;
                    }

                    // Handle both Node 18 (address, family) and Node 20+
                    // (all:true expects [{address, family}] array) formats
                    if (options.all) {
                      fn(null, [
                        { address: result?.address, family: result?.family }
                      ]);
                    } else {
                      fn(null, result?.address, result?.family);
                    }
                  })
                  .catch((err) => fn(err));
              }
            }
          })
    });
    try {
      const response = await undici.fetch(url, {
        signal: abortController.signal,
        dispatcher
        // TODO: may need `dispatcher.destroy()`, but not sure since we use `undici.fetch` vs `undici.request`
      });
      clearTimeout(t);
      return response;
    } catch (err) {
      clearTimeout(t);
      //
      // Enhanced error logging for WKD fetch failures
      // Log the underlying cause for "TypeError: fetch failed" errors
      // <https://github.com/nodejs/undici/issues/1248>
      //
      if (err.cause) {
        err.underlyingCause = {
          message: err.cause.message,
          code: err.cause.code,
          name: err.cause.name,
          ...(err.cause.hostname ? { hostname: err.cause.hostname } : {}),
          ...(err.cause.address ? { address: err.cause.address } : {}),
          ...(err.cause.port ? { port: err.cause.port } : {}),
          ...(err.cause.syscall ? { syscall: err.cause.syscall } : {})
        };
      }

      err.wkdContext = {
        url,
        timeout: DURATION
      };

      // Log fetch failures with context for debugging
      if (err.message === 'fetch failed' || err.name === 'TypeError') {
        logger.error(err, {
          url,
          cause: err.underlyingCause
        });
      }

      throw err;
    }
  };

  // override lookup so we can implement caching
  const { lookup } = _wkd;
  // <https://github.com/openpgpjs/wkd-client/blob/1d7a5ff05479e25cf39c62687d66863093403c4c/src/wkd.js#L33-L48>
  _wkd.lookup = async function (options) {
    // safeguard
    if (typeof options?.email !== 'string')
      throw new TypeError('Invalid email for WKD lookup');

    // redis key
    const key = `wkd:${options.email}`;

    // check cache value
    let cache = await client.getBuffer(key);

    // if cache is `"false"` it indicates none
    // if cache is a string then we can decode it
    if (cache) {
      if (cache.equals(Buffer.from('false')))
        throw Boom.notFound('WKD key not found, try again in 30m');
      return decoder.unpack(cache);
    }

    try {
      cache = await lookup.call(this, options);

      //
      // TODO: we may not want to do isHTML check (?) see comment in GH discussion
      //

      // TODO: this is a temporary fix until the PR noted in `helpers/wkd.js` is merged
      // <https://github.com/sindresorhus/is-html/blob/bc57478683406b11aac25c4a7df78b66c42cc27c/index.js#L1-L11>
      const str = new TextDecoder().decode(cache);
      if (str && isHTML(str)) throw new Error('Invalid WKD lookup HTML result');

      client
        .set(key, encoder.pack(cache), 'PX', ms('1h'))
        .then()
        .catch((err) => logger.fatal(err));
      return cache;
    } catch (err) {
      await client.set(key, Buffer.from('false'), 'PX', ms('1h'));
      throw err;
    }
  };

  return _wkd;
}

module.exports = WKD;
