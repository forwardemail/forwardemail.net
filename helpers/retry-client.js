/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const timers = require('node:timers/promises');
const undici = require('undici');
const ms = require('ms');

const TimeoutError = require('./timeout-error');
const isRetryableError = require('./is-retryable-error');

class RetryClient extends undici.Client {
  constructor(opts) {
    super(opts);

    const timeout =
      typeof opts?.timeout === 'number' ? opts.timeout : ms('60s');
    const retries = typeof opts?.retries === 'number' ? opts.retries : 3;

    // exponential retry backoff (2, 4, 8)
    const calculateDelay =
      typeof opts?.calculateDelay === 'function'
        ? opts.calculateDelay
        : (count) => Math.round(1000 * 2 ** count);

    this._request = this.request;

    this.request = async (options, count = 1) => {
      try {
        // throwOnError was removed in undici v7
        // <https://github.com/nodejs/undici/issues/4698>
        // options.throwOnError = true;
        const abortController = new AbortController();
        options.signal = abortController.signal;

        const t = setTimeout(() => {
          if (!abortController?.signal?.aborted)
            abortController.abort(
              new TimeoutError(`Request took longer than ${timeout}ms`)
            );
        }, timeout);

        if (options.resolver)
          options.dispatcher = new undici.Agent({
            // TODO: should we change defaults here; if so, change elsewhere too
            // headersTimeout: ms(DURATION),
            // connectTimeout: ms(DURATION),
            // bodyTimeout: ms(DURATION),
            connect: {
              lookup(hostname, options, fn) {
                options.resolver
                  .lookup(hostname, options)
                  .then((result) => {
                    fn(null, result?.address, result?.family);
                  })
                  .catch((err) => fn(err));
              }
            }
          });

        const response = await this._request(options);
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
          err.options = options;
          err.count = count;
          throw err;
        }

        response.signal = options.signal;
        return response;
      } catch (err) {
        if (count >= retries || !isRetryableError(err)) throw err;
        const ms = calculateDelay(count);
        if (ms) await timers.setTimeout(ms);
        return this.request(options, count + 1);
      } finally {
        // if (options.dispatcher) options.dispatcher.destroy();
      }
    };
  }
}

module.exports = RetryClient;
