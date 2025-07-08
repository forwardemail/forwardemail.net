/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const timers = require('node:timers/promises');

const isRetryableError = require('./is-retryable-error');

/**
 * Enhanced retry function specifically for PayPal operations
 * Supports additional status codes like 404 which are common with PayPal's infrastructure delays
 *
 * @param {Function} operation - The async operation to retry (should return a promise)
 * @param {Object} options - Retry options
 * @param {number} options.retries - Number of retries (default: 3)
 * @param {Array<number>} options.additionalStatusCodes - Additional HTTP status codes to retry (default: [404])
 * @param {Function} options.calculateDelay - Function to calculate delay between retries
 * @param {number} count - Current retry count (internal use)
 * @returns {Promise} - Result of the operation
 */
async function retryPayPalRequest(operation, options = {}, count = 1) {
  try {
    // Set defaults
    options.retries = options.retries || 3;
    options.additionalStatusCodes = options.additionalStatusCodes || [404];
    options.calculateDelay =
      options.calculateDelay || ((count) => Math.round(1000 * 2 ** count));

    // Execute the operation
    return await operation();
  } catch (err) {
    // Check if we should retry
    const shouldRetry =
      count < options.retries &&
      (isRetryableError(err) ||
        (typeof err.status === 'number' &&
          options.additionalStatusCodes.includes(err.status)) ||
        (err.statusCode &&
          options.additionalStatusCodes.includes(err.statusCode)) ||
        (err.response &&
          err.response.status &&
          options.additionalStatusCodes.includes(err.response.status)));

    if (!shouldRetry) {
      // Add retry information to the error for debugging
      err.retryCount = count - 1;
      err.maxRetries = options.retries;
      throw err;
    }

    // Calculate delay and wait
    const delay = options.calculateDelay(count);
    if (delay > 0) {
      await timers.setTimeout(delay);
    }

    // Retry the operation
    return retryPayPalRequest(operation, options, count + 1);
  }
}

module.exports = retryPayPalRequest;
