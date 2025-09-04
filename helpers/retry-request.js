/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const timers = require('node:timers/promises');
const undici = require('undici');
const ms = require('ms');

const TimeoutError = require('./timeout-error');
const isRetryableError = require('./is-retryable-error');

const config = require('#config');

async function retryRequest(url, opts = {}, count = 1) {
  try {
    opts.timeout = opts.timeout || ms('30s');
    opts.retries = opts.retries || 2;

    // exponential retry backoff (2, 4, 8)
    opts.calculateDelay = (count) => Math.round(1000 * 2 ** count);

    opts.throwOnError = true;

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
      const err = new undici.errors.ResponseStatusCodeError(
        `Response status code ${response.statusCode}`,
        response.statusCode,
        response.headers,
        body
      );
      err.url = url;
      err.options = opts;
      err.count = count;
      throw err;
    }

    response.signal = opts.signal;
    return response;
  } catch (err) {
    if (count >= opts.retries || !isRetryableError(err)) throw err;
    const ms = opts.calculateDelay(count);
    if (ms) await timers.setTimeout(ms);
    return retryRequest(url, opts, count + 1);
  } finally {
    if (opts.dispatcher) opts.dispatcher.destroy();
  }
}

module.exports = retryRequest;
