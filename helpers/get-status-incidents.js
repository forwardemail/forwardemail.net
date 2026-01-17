/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const ms = require('ms');
const undici = require('undici');

const env = require('#config/env');
const logger = require('#helpers/logger');

// GitHub API base URL for status page incidents
const GITHUB_API_BASE =
  'https://api.github.com/repos/forwardemail/status.forwardemail.net';

// Redis cache keys
const CACHE_KEY_INCIDENTS = 'event_feed:status_incidents';
const CACHE_KEY_SUMMARY = 'event_feed:status_summary';

// Cache duration - 6 hours to match X posts and reduce API calls
const CACHE_DURATION = env.X_API_CACHE_DURATION
  ? ms(env.X_API_CACHE_DURATION)
  : ms('6h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

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
 * Fetch status page incidents from GitHub issues
 * Uses Redis for caching to share cache across all processes
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

  try {
    const url = new URL(`${GITHUB_API_BASE}/issues`);
    url.searchParams.set('state', state);
    url.searchParams.set('labels', 'status');
    url.searchParams.set('per_page', String(Math.min(count, 100)));
    url.searchParams.set('sort', 'created');
    url.searchParams.set('direction', 'desc');

    const response = await undici.request(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'ForwardEmail/1.0',
        'x-github-api-version': '2022-11-28'
      },
      headersTimeout: ms('30s'),
      bodyTimeout: ms('30s')
    });

    if (response.statusCode !== 200) {
      const body = await response.body.text();
      throw new Error(
        `GitHub API returned status ${response.statusCode}: ${body}`
      );
    }

    const issues = await response.body.json();

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
