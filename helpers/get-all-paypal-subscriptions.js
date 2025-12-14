/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const logger = require('./logger');

/**
 * Get all PayPal subscriptions with pagination
 * @param {Object} agent - PayPal agent instance
 * @param {Object} options - Query options
 * @param {string} options.planIds - Comma-separated plan IDs to filter
 * @param {string} options.statuses - Comma-separated subscription statuses
 * @param {string} options.createdAfter - ISO 8601 date string
 * @param {string} options.createdBefore - ISO 8601 date string
 * @param {number} options.pageSize - Items per page (1-20, default 10)
 * @returns {Promise<Array>} Array of all subscriptions
 */
async function getAllPayPalSubscriptions(agent, options = {}) {
  const subscriptions = [];
  let page = 1;
  const pageSize = options.pageSize || 20; // Use max page size for efficiency
  let hasMore = true;

  while (hasMore) {
    try {
      const queryParams = new URLSearchParams({
        page,
        page_size: pageSize
      });

      // Add optional filters
      if (options.planIds) queryParams.append('plan_ids', options.planIds);
      if (options.statuses) queryParams.append('statuses', options.statuses);
      if (options.createdAfter)
        queryParams.append('created_after', options.createdAfter);
      if (options.createdBefore)
        queryParams.append('created_before', options.createdBefore);

      logger.info(
        `Fetching PayPal subscriptions page ${page} with page_size ${pageSize}`
      );

      const { body } = await agent.get(
        `/v1/billing/subscriptions?${queryParams.toString()}`
      );

      if (body.subscriptions && body.subscriptions.length > 0) {
        subscriptions.push(...body.subscriptions);
        logger.info(
          `Retrieved ${body.subscriptions.length} subscriptions from page ${page}`
        );

        // Check if there are more pages
        // PayPal returns a 'links' array with 'rel' values including 'next' if there are more pages
        const nextLink = body.links?.find((link) => link.rel === 'next');
        hasMore = Boolean(nextLink);
        page++;
      } else {
        hasMore = false;
      }
    } catch (err) {
      // If we get a 404 or the page is empty, we've reached the end
      if (err.status === 404 || err.status === 400) {
        logger.info(
          `Reached end of PayPal subscriptions at page ${page} (status: ${err.status})`
        );
        hasMore = false;
      } else {
        throw err;
      }
    }
  }

  logger.info(
    `Retrieved total of ${subscriptions.length} PayPal subscriptions`
  );
  return subscriptions;
}

module.exports = getAllPayPalSubscriptions;
