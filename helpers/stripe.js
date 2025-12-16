/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');

const Stripe = require('stripe');

const env = require('#config/env');
const logger = require('#helpers/logger');
const isRetryableError = require('#helpers/is-retryable-error');

const MAX_RETRY_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

class RetryHttpClient {
  constructor() {
    this.baseHttpClient = Stripe.createNodeHttpClient();
  }

  // eslint-disable-next-line max-params
  async makeRequest(
    host,
    port,
    path,
    method,
    headers,
    requestData,
    protocol,
    timeout
  ) {
    const startTime = Date.now();
    let attempt = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      attempt++;

      try {
        const response = await this.baseHttpClient.makeRequest(
          host,
          port,
          path,
          method,
          headers,
          requestData,
          protocol,
          timeout
        );

        const statusCode = response.getStatusCode();

        // If not a 429, return immediately
        if (statusCode !== 429) {
          return response;
        }

        // Check if we've exceeded the 2-hour retry window
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= MAX_RETRY_DURATION) {
          logger.error('Stripe 429 retry duration exceeded (2 hours)', {
            path,
            method,
            attempt,
            elapsedTime
          });
          return response;
        }

        // Calculate exponential backoff delay (capped at 60 seconds)
        const delay = Math.min(2 ** attempt * 1000, 60_000);

        logger.warn('Stripe 429 rate limit hit. Retrying...', {
          path,
          method,
          attempt,
          delay,
          elapsedTime
        });

        await setTimeout(delay);
      } catch (err) {
        // Check if this is a retryable error
        const shouldRetry = err.statusCode === 429 || isRetryableError(err);

        if (!shouldRetry) {
          throw err;
        }

        // Check if we've exceeded the 2-hour retry window
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= MAX_RETRY_DURATION) {
          logger.error(
            'Stripe retry duration exceeded (2 hours) after exception',
            {
              path,
              method,
              attempt,
              elapsedTime,
              error: err.message
            }
          );
          throw err;
        }

        // Calculate exponential backoff delay (capped at 60 seconds)
        const delay = Math.min(2 ** attempt * 1000, 60_000);

        logger.warn('Stripe retryable error. Retrying...', {
          path,
          method,
          attempt,
          delay,
          elapsedTime,
          error: err.message,
          statusCode: err.statusCode
        });

        await setTimeout(delay);
      }
    }
  }

  getClientName() {
    return this.baseHttpClient.getClientName();
  }
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  httpClient: new RetryHttpClient(),
  maxNetworkRetries: 0
});

module.exports = stripe;
