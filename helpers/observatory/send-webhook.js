/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const undici = require('undici');
const pRetry = require('p-retry');

const pkg = require('../../package.json');

const config = require('#config');
const logger = require('#helpers/logger');

// Shared dispatcher (same pattern as get-domain-categorization.js)
const dispatcher = new undici.Agent().compose(
  undici.interceptors.redirect({ maxRedirections: 3 })
);

/**
 * Generate HMAC-SHA256 signature for webhook payload verification.
 *
 * @param {string} payload  - JSON stringified body
 * @param {string} secret   - Signing secret (user's API token)
 * @returns {string} Hex-encoded HMAC signature
 */
function generateSignature(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Send a webhook notification to a user-configured URL.
 *
 * Includes an HMAC-SHA256 signature in the X-Observatory-Signature header
 * so the receiver can verify the payload authenticity.
 *
 * Retries up to 3 times with exponential backoff on failure.
 *
 * @param {Object} options
 * @param {string}   options.url         - Webhook endpoint URL
 * @param {string}   options.secret      - HMAC signing secret
 * @param {Object}   options.payload     - JSON payload to send
 * @param {number}   [options.timeout]   - Request timeout in ms (default: 10000)
 * @param {number}   [options.retries]   - Number of retries (default: 3)
 * @returns {Promise<{success: boolean, statusCode?: number, error?: string}>}
 */
async function sendWebhook(options) {
  const { url, secret, payload, timeout = 10_000, retries = 3 } = options;

  const body = JSON.stringify(payload);
  const signature = generateSignature(body, secret);

  const attempt = async () => {
    const abortController = new AbortController();
    const timer = setTimeout(() => {
      if (!abortController.signal.aborted) abortController.abort();
    }, timeout);

    try {
      const response = await undici.request(url, {
        method: 'POST',
        signal: abortController.signal,
        dispatcher,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `${pkg.name}/${pkg.version} (+${config.urls.web})`,
          'X-Observatory-Signature': `sha256=${signature}`,
          'X-Observatory-Event': payload.alert_type || 'unknown'
        },
        body
      });

      clearTimeout(timer);

      // Consume body to prevent socket hang
      try {
        if (typeof response.body?.dump === 'function') {
          await response.body.dump();
        }
      } catch {
        // ignore
      }

      // 2xx = success, anything else is a failure worth retrying
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return { success: true, statusCode: response.statusCode };
      }

      throw new Error(`Webhook returned status ${response.statusCode}`);
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  try {
    const result = await pRetry(attempt, {
      retries,
      minTimeout: 1000,
      maxTimeout: 10_000,
      onFailedAttempt(err) {
        logger.debug('Webhook delivery attempt failed', {
          url,
          attempt: err.attemptNumber,
          retriesLeft: err.retriesLeft,
          error: err.message
        });
      }
    });

    return result;
  } catch (err) {
    logger.error('Webhook delivery failed after retries', {
      url,
      error: err.message
    });

    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = {
  sendWebhook,
  generateSignature
};
