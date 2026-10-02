/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

// undici.fetch needs String.prototype.toWellFormed (not in Node 18)
// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

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

// WKD servers may redirect (e.g. openpgpkey.example.com -> keys host), but a
// long chain is never legitimate.
const MAX_REDIRECTS = 3;

// (a key is a few KB; certified keys with many signatures are larger)
const MAX_WKD_RESPONSE_BYTES = 1024 * 1024;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

//
// Returns true when a hostname must not be fetched.  Test mode bypasses the
// check so tests can use local WKD servers; it is exposed on the exported
// function so tests can exercise the per-hop validation.
//
async function isPrivateTarget(hostname, resolver) {
  if (env.NODE_ENV === 'test') return false;
  return isPrivateHostResolved(hostname, resolver);
}

async function assertSafeTarget(url, resolver) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw Boom.badRequest(i18n.translateError('INVALID_LOCALHOST_URL', 'en'));
  }

  // Only plain web URLs are valid WKD locations.
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:')
    throw Boom.badRequest(i18n.translateError('INVALID_LOCALHOST_URL', 'en'));

  // Uses async DNS resolution (and canonical IP-literal checks) to prevent
  // requests to private/internal hosts.
  if (await WKD.isPrivateTarget(parsedUrl.hostname, resolver))
    throw Boom.badRequest(i18n.translateError('INVALID_LOCALHOST_URL', 'en'));
}

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
    // Block requests to private/internal hosts (SSRF prevention).
    // Every hop of a redirect chain is validated here before any connection
    // is made, including in self-hosted mode where the validating
    // connect-time lookup below is not installed.
    await assertSafeTarget(url, resolver);

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
                      result?.address &&
                      (await WKD.isPrivateTarget(result.address, resolver))
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
      //
      // Redirects are followed manually so that each target is validated
      // before it is fetched.  The automatic redirect handling in fetch would
      // connect to any location a remote server returns, and the validating
      // connect-time lookup is never invoked for IP-literal hosts
      // (e.g. a redirect to http://169.254.169.254/).
      //
      let currentUrl = url;
      let response;
      for (let redirects = 0; ; redirects++) {
        response = await undici.fetch(currentUrl, {
          signal: abortController.signal,
          dispatcher,
          redirect: 'manual',
          // WKD keys are served as raw binary (application/octet-stream); ask
          // well-behaved servers not to compress at all.
          headers: { 'accept-encoding': 'identity' }
        });

        if (!REDIRECT_STATUSES.has(response.status)) break;

        const location = response.headers.get('location');

        try {
          await response.body?.cancel();
        } catch {}

        if (!location) {
          const err = new Error('WKD redirect without a location header');
          err.code = 'EWKDREDIRECT';
          throw err;
        }

        if (redirects >= MAX_REDIRECTS) {
          const err = new Error(
            `WKD lookup exceeded ${MAX_REDIRECTS} redirects`
          );
          err.code = 'EWKDREDIRECT';
          throw err;
        }

        currentUrl = new URL(location, currentUrl).href;
        await assertSafeTarget(currentUrl, resolver);
      }

      //
      // A compressed WKD response is never legitimate. `undici.fetch`
      // auto-decompresses a chained `Content-Encoding` header, and a
      // malicious WKD server can nest thousands of gzip layers to burn CPU
      // and memory (GHSA-g9mf-h72j-4rw9). The upstream fix ships in undici
      // >=7.18.2, which requires Node 20 (undici >=7.13.0 needs the `File`
      // global), so it cannot be taken on Node 18. The decompression work
      // accrues while the body is consumed, so reject before reading it.
      //
      const contentEncoding = response.headers.get('content-encoding');
      if (
        contentEncoding &&
        contentEncoding.trim().toLowerCase() !== 'identity'
      ) {
        try {
          await response.body?.cancel();
        } catch {}

        // (the catch block below destroys the dispatcher and logs context)
        const err = new Error(
          `Refusing compressed WKD response (content-encoding: ${contentEncoding})`
        );
        err.code = 'EWKDCOMPRESSED';
        throw err;
      }

      //
      // The body is read here (the WKD client would buffer all of it with
      // `arrayBuffer()`), up to a limit far above any key and within the
      // same timeout, so a remote server cannot make us buffer without limit.
      //
      const chunks = [];
      let size = 0;
      if (response.body) {
        const reader = response.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > MAX_WKD_RESPONSE_BYTES) {
            try {
              await reader.cancel();
            } catch {}

            const err = new Error(
              `WKD response is larger than ${MAX_WKD_RESPONSE_BYTES} bytes`
            );
            err.code = 'EWKDTOOLARGE';
            throw err;
          }

          chunks.push(value);
        }
      }

      clearTimeout(t);
      dispatcher.close();
      // (a response with a null body status cannot be given a body)
      return new undici.Response(
        [204, 205, 304].includes(response.status)
          ? null
          : Buffer.concat(chunks),
        {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        }
      );
    } catch (err) {
      clearTimeout(t);
      dispatcher.destroy();
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

WKD.isPrivateTarget = isPrivateTarget;

module.exports = WKD;
