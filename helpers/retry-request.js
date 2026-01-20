/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const timers = require('node:timers/promises');
const undici = require('undici');
const ms = require('ms');

const TimeoutError = require('./timeout-error');
const isRetryableError = require('./is-retryable-error');
const logger = require('./logger');

const config = require('#config');

async function retryRequest(url, opts = {}, count = 1) {
  try {
    opts.timeout = opts.timeout || ms('30s');
    opts.retries = opts.retries || 2;

    // exponential retry backoff (2, 4, 8)
    opts.calculateDelay = (count) => Math.round(1000 * 2 ** count);

    // throwOnError was removed in undici v7
    // <https://github.com/nodejs/undici/issues/4698>
    // opts.throwOnError = true;

    const abortController = new AbortController();
    opts.signal = abortController.signal;

    const t = setTimeout(() => {
      if (!abortController?.signal?.aborted)
        abortController.abort(
          new TimeoutError(`${url} took longer than ${opts.timeout}ms`)
        );
    }, opts.timeout);

    if (opts.resolver)
      opts.dispatcher = new undici.Agent({
        // TODO: should we change defaults here; if so, change elsewhere too
        // headersTimeout: ms(DURATION),
        // connectTimeout: ms(DURATION),
        // bodyTimeout: ms(DURATION),
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
                  opts.resolver
                    .lookup(hostname, options)
                    .then((result) => {
                      fn(null, result?.address, result?.family);
                    })
                    .catch((err) => fn(err));
                }
              }
            })
      });

    const response = await undici.request(url, opts);
    clearTimeout(t);

    // <https://github.com/nodejs/undici/issues/3353#issuecomment-2184635954>
    // the error code is between 200-400 (e.g. 302 redirect)
    // in order to mirror the behavior of `throwOnError` we will re-use the undici errors
    // <https://github.com/nodejs/undici/issues/2093>
    if (response.statusCode !== 200) {
      // still need to consume body even if an error occurs
      const body = await response.body.text();
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
    err.requestContext = {
      url: typeof url === 'string' ? url : url?.toString?.(),
      method: opts.method || 'GET',
      timeout: opts.timeout,
      retryCount: count,
      maxRetries: opts.retries
    };

    // Log fetch failures with full context for debugging
    if (
      err.message === 'fetch failed' ||
      err.name === 'TypeError' ||
      err.code?.startsWith?.('UND_ERR')
    ) {
      logger.error(err, {
        url: err.requestContext?.url,
        method: err.requestContext?.method,
        cause: err.underlyingCause,
        retryCount: count
      });
    }

    if (count >= opts.retries || !isRetryableError(err)) throw err;
    const ms = opts.calculateDelay(count);
    if (ms) await timers.setTimeout(ms);
    return retryRequest(url, opts, count + 1);
  } finally {
    // if (opts.dispatcher) opts.dispatcher.destroy();
  }
}

module.exports = retryRequest;
