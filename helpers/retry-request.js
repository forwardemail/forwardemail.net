const undici = require('undici');
const delay = require('delay');
const ms = require('ms');

const isRetryableError = require('./is-retryable-error');

async function retryRequest(url, opts = {}, count = 1) {
  try {
    opts.timeout = opts.timeout || ms('30s');
    opts.retries = opts.retries || 3;

    // exponential retry backoff (2, 4, 8)
    opts.calculateDelay = (count) => Math.round(1000 * 2 ** count);

    opts.throwOnError = true;
    opts.signal = AbortSignal.timeout(opts.timeout);

    const response = await undici.request(url, opts);
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

    return response;
  } catch (err) {
    if (count >= opts.retries || !isRetryableError(err)) throw err;
    const ms = opts.calculateDelay(count);
    if (ms) await delay(ms);
    return retryRequest(url, opts, count + 1);
  }
}

module.exports = retryRequest;
