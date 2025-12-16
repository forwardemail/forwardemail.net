/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');
const { promisify } = require('node:util');

const paypal = require('paypal-rest-sdk');
const superagent = require('superagent');
const ms = require('ms');

const config = require('#config');
const logger = require('#helpers/logger');
const isRetryableError = require('#helpers/is-retryable-error');
const { paypalRestSdkConfig } = require('#config/payments');

const { PAYPAL_ENDPOINT } = config.payments;
const MAX_RETRY_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

paypal.configure(paypalRestSdkConfig);

//
// Enhanced retry wrapper for PayPal requests
//
function withRetry(agent) {
  const originalMethods = {
    get: agent.get.bind(agent),
    post: agent.post.bind(agent),
    put: agent.put.bind(agent),
    patch: agent.patch.bind(agent),
    del: agent.del.bind(agent),
    delete: agent.delete.bind(agent)
  };

  async function retryRequest(method, ...args) {
    const startTime = Date.now();
    let attempt = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      attempt++;

      try {
        const request = originalMethods[method](...args);
        const response = await request;
        return response;
      } catch (err) {
        // Check if this is a 429 or retryable error
        const is429 =
          err.status === 429 ||
          err.statusCode === 429 ||
          (err.response && err.response.status === 429);

        const shouldRetry = is429 || isRetryableError(err);

        if (!shouldRetry) {
          throw err;
        }

        // Check if we've exceeded the 2-hour retry window
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= MAX_RETRY_DURATION) {
          logger.error('PayPal retry duration exceeded (2 hours)', {
            method,
            attempt,
            elapsedTime,
            error: err.message,
            status: err.status || err.statusCode
          });
          throw err;
        }

        // Calculate exponential backoff delay (capped at 60 seconds)
        const delay = Math.min(2 ** attempt * 1000, 60_000);

        logger.warn('PayPal retryable error. Retrying...', {
          method,
          attempt,
          delay,
          elapsedTime,
          error: err.message,
          status: err.status || err.statusCode
        });

        await setTimeout(delay);
      }
    }
  }

  // Wrap all HTTP methods with retry logic
  agent.get = (...args) => retryRequest('get', ...args);
  agent.post = (...args) => retryRequest('post', ...args);
  agent.put = (...args) => retryRequest('put', ...args);
  agent.patch = (...args) => retryRequest('patch', ...args);
  agent.del = (...args) => retryRequest('del', ...args);
  agent.delete = (...args) => retryRequest('delete', ...args);

  return agent;
}

//
// NOTE: paypal access tokens only live for 30s so it's
//       kind of pointless to even consider re-using them
//
async function paypalAgent() {
  const token = await promisify(paypal.generateToken)();
  const agent = superagent
    .agent()
    .use((req) => {
      if (req.url.indexOf('/') === 0) req.url = `${PAYPAL_ENDPOINT}${req.url}`;
      else throw new Error('URL must start with /');
      return req;
    })
    .set('Prefer', 'return=representation')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .timeout(ms('10s'))
    .retry(0); // Disable superagent's built-in retry, use our custom logic

  return withRetry(agent);
}

module.exports = { paypalAgent, paypal };
