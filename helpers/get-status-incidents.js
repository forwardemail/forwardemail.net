/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const ms = require('ms');
const undici = require('undici');
const { Octokit } = require('@octokit/core');

const env = require('#config/env');
const logger = require('#helpers/logger');

// GitHub repository for status page
const STATUS_REPO_OWNER = 'forwardemail';
const STATUS_REPO_NAME = 'status.forwardemail.net';

// Redis cache keys
const CACHE_KEY_INCIDENTS = 'event_feed:status_incidents';
const CACHE_KEY_SUMMARY = 'event_feed:status_summary';

// Cache duration - 6 hours to match X posts and reduce API calls
const CACHE_DURATION = env.X_API_CACHE_DURATION
  ? ms(env.X_API_CACHE_DURATION)
  : ms('6h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// Retry configuration for non-blocking retries
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

// Create Octokit instance with authentication (if token is available)
// Authenticated requests get 5,000 requests/hour vs 60/hour unauthenticated
let octokit = null;
function getOctokit() {
  if (!octokit) {
    octokit = new Octokit({
      auth: env.GITHUB_OCTOKIT_TOKEN || undefined
    });
  }

  return octokit;
}

/**
 * Sleep for a given number of milliseconds (non-blocking)
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Parse a GitHub issue into a status incident object
 * @param {Object} issue - GitHub issue object
 * @returns {Object} - Parsed incident object
 */
function parseIncident(issue) {
  // Extract service name from title (format: "🛑 service is down" or "service is down")
  let serviceName = issue.title || '';
  serviceName = serviceName.replace(/^🛑\s*/, '').replace(/\s+is\s+down$/i, '');

  // Determine status from issue state
  const isResolved = issue.state === 'closed';

  // Calculate duration if resolved
  let duration = null;
  if (isResolved && issue.created_at && issue.closed_at) {
    const start = new Date(issue.created_at);
    const end = new Date(issue.closed_at);
    duration = end - start; // Duration in milliseconds
  }

  return {
    id: issue.number,
    title: issue.title,
    serviceName,
    status: isResolved ? 'resolved' : 'ongoing',
    createdAt: new Date(issue.created_at).toISOString(),
    updatedAt: new Date(issue.updated_at).toISOString(),
    closedAt: issue.closed_at ? new Date(issue.closed_at).toISOString() : null,
    duration,
    body: issue.body || '',
    url: issue.html_url,
    labels: (issue.labels || []).map((l) => l.name)
  };
}

/**
 * Fetch issues from GitHub with retry logic
 * Uses Octokit for authenticated requests (5,000 req/hour vs 60/hour)
 * @param {string} state - Issue state filter: 'all', 'open', 'closed'
 * @param {number} perPage - Number of issues per page
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Array>} - Array of issue objects from GitHub API
 */
async function fetchIssuesWithRetry(state, perPage, retryCount = 0) {
  try {
    const client = getOctokit();
    const response = await client.request('GET /repos/{owner}/{repo}/issues', {
      owner: STATUS_REPO_OWNER,
      repo: STATUS_REPO_NAME,
      state,
      labels: 'status',
      per_page: perPage,
      sort: 'created',
      direction: 'desc',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data;
  } catch (err) {
    // Check if error is retryable (network errors, rate limits, server errors)
    const isRetryable =
      err.status === 403 || // Rate limit
      err.status === 429 || // Too many requests
      err.status === 500 || // Server error
      err.status === 502 || // Bad gateway
      err.status === 503 || // Service unavailable
      err.status === 504 || // Gateway timeout
      err.message === 'fetch failed' ||
      err.code === 'ECONNRESET' ||
      err.code === 'ETIMEDOUT' ||
      err.code === 'ENOTFOUND' ||
      err.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      err.code === 'UND_ERR_SOCKET';

    if (isRetryable && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount] || RETRY_DELAYS.at(-1);
      logger.debug(
        `Status incidents fetch failed, retrying in ${delay}ms (attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`,
        { extra: { error: err.message, status: err.status } }
      );
      await sleep(delay);
      return fetchIssuesWithRetry(state, perPage, retryCount + 1);
    }

    // Log the error with context
    logger.error(err, {
      extra: {
        message: 'Status incidents fetch failed after retries',
        retryCount,
        status: err.status
      }
    });

    throw err;
  }
}

/**
 * Fetch status page incidents from GitHub issues
 * Uses Redis for caching to share cache across all processes
 * Uses Octokit for authenticated requests to avoid rate limiting
 * @param {Object} options - Options for fetching
 * @param {Object} options.client - Redis client (required for caching)
 * @param {number} options.count - Number of incidents to fetch (default: 50)
 * @param {string} options.state - Issue state filter: 'all', 'open', 'closed' (default: 'all')
 * @param {boolean} options.forceRefresh - Force refresh cache
 * @returns {Promise<Array>} - Array of parsed incidents
 */
async function getStatusIncidents(options = {}) {
  const { client, count = 50, state = 'all', forceRefresh = false } = options;

  // Try to get from Redis cache first
  if (client && !forceRefresh) {
    try {
      const cached = await client.get(CACHE_KEY_INCIDENTS);
      if (cached) {
        const incidents = JSON.parse(cached);
        logger.debug('Returning status incidents from Redis cache', {
          extra: { count: incidents.length }
        });
        return incidents.slice(0, count);
      }
    } catch (err) {
      logger.warn('Failed to read status incidents from Redis cache', {
        extra: { error: err.message }
      });
    }
  }

  // Check if GitHub token is configured
  if (!env.GITHUB_OCTOKIT_TOKEN) {
    logger.warn(
      'GITHUB_OCTOKIT_TOKEN not configured, GitHub API requests will be rate limited (60/hour)'
    );
  }

  try {
    const perPage = Math.min(count, 100);

    // Fetch issues using Octokit with retry logic
    const issues = await fetchIssuesWithRetry(state, perPage);

    // Parse all issues into incidents
    const incidents = issues.map((issue) => parseIncident(issue));

    // Store in Redis cache
    if (client && incidents.length > 0) {
      try {
        await client.set(
          CACHE_KEY_INCIDENTS,
          JSON.stringify(incidents),
          'EX',
          CACHE_TTL_SECONDS
        );
        logger.info(
          `Cached ${incidents.length} status incidents in Redis (TTL: ${CACHE_TTL_SECONDS}s)`
        );
      } catch (err) {
        logger.warn('Failed to cache status incidents in Redis', {
          extra: { error: err.message }
        });
      }
    }

    logger.info(`Fetched ${incidents.length} status incidents from GitHub API`);

    return incidents.slice(0, count);
  } catch (err) {
    logger.error(err, {
      extra: { message: 'Failed to fetch status incidents' }
    });

    return [];
  }
}

/**
 * Fetch the summary.json from the status page for uptime data
 * Uses Redis for caching to share cache across all processes
 * @param {Object} options - Options for fetching
 * @param {Object} options.client - Redis client (required for caching)
 * @param {boolean} options.forceRefresh - Force refresh cache
 * @returns {Promise<Array>} - Array of service status summaries
 */
async function getStatusSummary(options = {}) {
  const { client, forceRefresh = false } = options;

  // Try to get from Redis cache first
  if (client && !forceRefresh) {
    try {
      const cached = await client.get(CACHE_KEY_SUMMARY);
      if (cached) {
        const summary = JSON.parse(cached);
        logger.debug('Returning status summary from Redis cache');
        return summary;
      }
    } catch (err) {
      logger.warn('Failed to read status summary from Redis cache', {
        extra: { error: err.message }
      });
    }
  }

  try {
    const url =
      'https://raw.githubusercontent.com/forwardemail/status.forwardemail.net/master/history/summary.json';

    const response = await undici.request(url, {
      method: 'GET',
      headers: {
        'user-agent': 'ForwardEmail/1.0'
      },
      headersTimeout: ms('30s'),
      bodyTimeout: ms('30s')
    });

    if (response.statusCode !== 200) {
      throw new Error(`Failed to fetch summary.json: ${response.statusCode}`);
    }

    const summary = await response.body.json();

    // Store in Redis cache
    if (client) {
      try {
        await client.set(
          CACHE_KEY_SUMMARY,
          JSON.stringify(summary),
          'EX',
          CACHE_TTL_SECONDS
        );
        logger.info(
          `Cached status summary in Redis (TTL: ${CACHE_TTL_SECONDS}s)`
        );
      } catch (err) {
        logger.warn('Failed to cache status summary in Redis', {
          extra: { error: err.message }
        });
      }
    }

    return summary;
  } catch (err) {
    logger.error(err, { extra: { message: 'Failed to fetch status summary' } });
    return [];
  }
}

/**
 * Clear the incidents cache from Redis
 * @param {Object} client - Redis client
 */
async function clearCache(client) {
  if (client) {
    try {
      await client.del(CACHE_KEY_INCIDENTS);
      await client.del(CACHE_KEY_SUMMARY);
      logger.info('Cleared status incidents cache from Redis');
    } catch (err) {
      logger.warn('Failed to clear status incidents cache from Redis', {
        extra: { error: err.message }
      });
    }
  }
}

module.exports = getStatusIncidents;
module.exports.clearCache = clearCache;
module.exports.parseIncident = parseIncident;
module.exports.getStatusSummary = getStatusSummary;
module.exports.CACHE_KEY_INCIDENTS = CACHE_KEY_INCIDENTS;
module.exports.CACHE_KEY_SUMMARY = CACHE_KEY_SUMMARY;
module.exports.CACHE_DURATION = CACHE_DURATION;
module.exports.CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;
