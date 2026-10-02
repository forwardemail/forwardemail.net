/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const timers = require('node:timers/promises');
const dns = require('node:dns');
const undici = require('undici');
const ms = require('ms');
const isSANB = require('is-string-and-not-blank');

const TimeoutError = require('./timeout-error');
const isRetryableError = require('./is-retryable-error');
const logger = require('./logger');
const isPrivateHost = require('#helpers/is-private-host');
const readLimitedBody = require('#helpers/read-limited-body');

const config = require('#config');

async function retryRequest(url, opts = {}, count = 1) {
  const ownsDispatcher = !opts.dispatcher && Boolean(opts.resolver);
  let timer;

  try {
    // Validate URL before making request to prevent ERR_INVALID_URL errors
    // This can happen when redirects have malformed Location headers
    try {
      const parsedUrl = new URL(url);
      // Ensure the URL has a valid hostname (not just protocol)
      if (!parsedUrl.hostname) {
        const err = new TypeError(`Invalid URL: missing hostname`);
        err.code = 'ERR_INVALID_URL';
        err.input = url;
        throw err;
      }
    } catch (urlErr) {
      // Re-throw with additional context
      urlErr.requestContext = {
        url: String(url),
        method: opts.method || 'GET',
        retryCount: count
      };
      throw urlErr;
    }

    opts.timeout = opts.timeout || ms('30s');
    opts.retries = opts.retries || 2;

    // exponential retry backoff (2, 4, 8)
    opts.calculateDelay = (count) => Math.round(1000 * 2 ** count);

    // throwOnError was removed in undici v7
    // <https://github.com/nodejs/undici/issues/4698>
    // opts.throwOnError = true;

    const abortController = new AbortController();
    opts.signal = abortController.signal;

    timer = setTimeout(() => {
      if (!abortController?.signal?.aborted)
        abortController.abort(
          new TimeoutError(`${url} took longer than ${opts.timeout}ms`)
        );
    }, opts.timeout);

    if (ownsDispatcher)
      opts.dispatcher = new undici.Agent({
        // TODO: should we change defaults here; if so, change elsewhere too
        // headersTimeout: ms(DURATION),
        // connectTimeout: ms(DURATION),
        // bodyTimeout: ms(DURATION),
        //
        //
        // NOTE: there is a bug in tangerine where if we supply
        //       a custom resolver in self-hosted mode then
        //       it causes an uncaught exception it appears
        //       (TypeError: Cannot read properties of undefined (reading 'length'))
        //
        //       That bug is specific to routing resolution through the custom
        //       Tangerine resolver. It is NOT a reason to skip the private-address
        //       validation itself: without a validating connect-time lookup the
        //       DNS-rebinding TOCTOU between the `isPrivateHostResolved` pre-check
        //       and the TCP connection is left open (the pre-check reads Tangerine's
        //       Redis cache while a plain Agent uses the system resolver, so the two
        //       can disagree without any timing race). In self-hosted mode we
        //       therefore resolve via the system resolver instead, but always
        //       validate the resolved address before connecting.
        //
        connect: {
          lookup(hostname, options, fn) {
            const validate = (err, address, family) => {
              if (err) return fn(err);
              //
              // NOTE: Node >= 20 connects with `autoSelectFamily` and calls
              //       this with `options.all`, in which case the lookup
              //       returns an array of `{ address, family }` entries
              //       (every entry is checked, not only the first one)
              //
              const addresses = Array.isArray(address)
                ? address
                : [{ address, family }];
              if (
                addresses.length === 0 ||
                addresses.some((a) => !isSANB(a?.address))
              ) {
                const err = new Error(`No address found for ${hostname}`);
                err.code = 'ENOTFOUND';
                fn(err);
                return;
              }

              //
              // prevent DNS rebinding attacks by validating the
              // resolved IP at connect time against private ranges
              // (mitigates TOCTOU gap between isPrivateHostResolved
              // pre-check and the actual TCP connection)
              //
              const privateAddress =
                config.env === 'test'
                  ? null
                  : addresses.find((a) => isPrivateHost(a.address));
              if (privateAddress) {
                const err = new Error(
                  `Resolved IP ${privateAddress.address} is a private/reserved address`
                );
                err.code = 'EPRIVATEADDR';
                fn(err);
                return;
              }

              if (options?.all) return fn(null, addresses);
              fn(null, addresses[0].address, addresses[0].family);
            };

            if (config.isSelfHosted) {
              dns.lookup(hostname, options, validate);
              return;
            }

            opts.resolver
              .lookup(hostname, options)
              .then((result) =>
                Array.isArray(result)
                  ? validate(null, result)
                  : validate(null, result?.address, result?.family)
              )
              .catch((err) => fn(err));
          }
        }
      });

    const response = await undici.request(url, opts);

    // <https://github.com/nodejs/undici/issues/3353#issuecomment-2184635954>
    // the error code is between 200-400 (e.g. 302 redirect)
    // in order to mirror the behavior of `throwOnError` we will re-use the undici errors
    // <https://github.com/nodejs/undici/issues/2093>
    if (response.statusCode !== 200) {
      // still need to consume body even if an error occurs
      // (bounded, as the host may not be ours, e.g. a webhook URL)
      const body = await readLimitedBody(response.body, { limit: 64 * 1024 });
      // ResponseStatusCodeError was removed in undici v7 and replaced with ResponseError
      // <https://github.com/nodejs/undici/pull/4473>
      const err = new undici.errors.ResponseError(
        `Response status code ${response.statusCode}`,
        response.statusCode,
        { headers: response.headers, body }
      );
      err.url = url;
      err.options = opts;
      err.count = count;
      throw err;
    }

    response.signal = opts.signal;
    return response;
  } catch (err) {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }

    //
    // Enhanced error logging for fetch failures
    // This helps diagnose "TypeError: fetch failed" errors by logging
    // the underlying cause (e.g., DNS resolution, TLS, connection issues)
    //
    // <https://github.com/nodejs/undici/issues/1248>
    // <https://github.com/nodejs/node/issues/48318>
    //
    if (err.cause) {
      err.underlyingCause = {
        message: err.cause.message,
        code: err.cause.code,
        name: err.cause.name,
        ...(err.cause.hostname ? { hostname: err.cause.hostname } : {}),
        ...(err.cause.address ? { address: err.cause.address } : {}),
        ...(err.cause.port ? { port: err.cause.port } : {}),
        ...(err.cause.syscall ? { syscall: err.cause.syscall } : {}),
        ...(err.cause.errno ? { errno: err.cause.errno } : {})
      };
    }

    // Add request context to the error for better debugging
    // Only add if not already set (e.g., from URL validation)
    if (!err.requestContext) {
      err.requestContext = {
        url: typeof url === 'string' ? url : String(url || ''),
        method: opts.method || 'GET',
        timeout: opts.timeout,
        retryCount: count,
        maxRetries: opts.retries,
        redirectCount: opts.redirectCount || 0
      };
    }

    const retryable = isRetryableError(err);

    // Preserve error-level logging for terminal failures while allowing
    // expected in-budget retries to remain diagnostic-only.
    if (
      err.message === 'fetch failed' ||
      err.name === 'TypeError' ||
      err.code?.startsWith?.('UND_ERR')
    ) {
      const log =
        retryable && count < opts.retries ? logger.warn : logger.error;
      log(err, {
        url: err.requestContext?.url,
        method: err.requestContext?.method,
        cause: err.underlyingCause,
        retryCount: count
      });
    }

    if (count >= opts.retries || !retryable) {
      // Destroy per-request dispatcher on terminal failure to prevent
      // socket/fd leak (the response body won't be consumed on error).
      if (ownsDispatcher && opts.dispatcher) {
        opts.dispatcher.destroy();
        opts.dispatcher = undefined;
      }

      throw err;
    }

    // Only a resolver-created Agent belongs to this invocation.  A caller may
    // deliberately share its dispatcher across requests (e.g. Launchpad).
    if (ownsDispatcher && opts.dispatcher) {
      opts.dispatcher.destroy();
      opts.dispatcher = undefined;
    }

    const ms = opts.calculateDelay(count);
    if (ms) await timers.setTimeout(ms);
    return retryRequest(url, opts, count + 1);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

module.exports = retryRequest;
