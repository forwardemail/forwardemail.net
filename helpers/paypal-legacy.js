/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { promisify } = require('node:util');

const pRetry = require('p-retry');
const paypal = require('paypal-rest-sdk');
const superagent = require('superagent');
const ms = require('ms');

const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const config = require('#config');
const { paypalRestSdkConfigLegacy } = require('#config/payments');

const { PAYPAL_ENDPOINT } = config.payments;

//
// NOTE: paypal access tokens only live for 30s so it's
//       kind of pointless to even consider re-using them
//
async function paypalAgentLegacy() {
  const paypalLegacy = Object.create(paypal);
  paypalLegacy.configure(paypalRestSdkConfigLegacy);

  const token = await pRetry(() => promisify(paypalLegacy.generateToken)(), {
    retries: 2,
    minTimeout: ms('5s'),
    async onFailedAttempt(error) {
      if (isRetryableError(error)) {
        logger.fatal(error);
        return;
      }

      throw error;
    }
  });
  return superagent
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
    .retry(2); // retry 2+ times, so 3x 10s = 30s total
}

module.exports = { paypalAgentLegacy };
