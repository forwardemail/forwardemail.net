/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const { Buffer } = require('node:buffer');

const ms = require('ms');
const { Octokit } = require('@octokit/rest');
const undici = require('undici');

const env = require('#config/env');
const logger = require('#helpers/logger');

// Status page repository
const STATUS_OWNER = 'forwardemail';
const STATUS_REPO = 'status.forwardemail.net';

// Redis cache keys
const CACHE_KEY_INCIDENTS = 'event_feed:status_incidents';
const CACHE_KEY_SUMMARY = 'event_feed:status_summary';

// Cache duration - 5 minutes for timely status updates
const CACHE_DURATION = env.X_API_CACHE_DURATION
  ? ms(env.X_API_CACHE_DURATION)
  : ms('5m');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// Authenticated Octokit instance (5000 req/hr vs 60 req/hr unauthenticated)
const octokit = env.GITHUB_OCTOKIT_TOKEN
  ? new Octokit({ auth: env.GITHUB_OCTOKIT_TOKEN })
  : null;

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
 * Uses authenticated Octokit to avoid rate limiting (5000 req/hr)
 * Falls back to unauthenticated requests if no token is configured
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
        if (!Array.isArray(incidents))
          throw new TypeError('Cached status incidents must be an array');

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
    let issues;

    if (octokit) {
      // Authenticated request via Octokit (5000 req/hr)
      const response = await octokit.issues.listForRepo({
        owner: STATUS_OWNER,
        repo: STATUS_REPO,
        state,
        creator: 'titanism',
        per_page: Math.min(count, 100),
        sort: 'created',
        direction: 'desc'
      });
      issues = response.data;
    } else {
      // Fallback to unauthenticated request (60 req/hr)
      const url = new URL(
        `https://api.github.com/repos/${STATUS_OWNER}/${STATUS_REPO}/issues`
      );
      url.searchParams.set('state', state);
      url.searchParams.set('creator', 'titanism');
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

      issues = await response.body.json();
    }

    // GitHub may return a non-array error payload through a proxy or a stale
    // cache layer.  Do not let that turn an optional event-feed refresh into a
    // recurring application error.
    if (!Array.isArray(issues))
      throw new TypeError('GitHub status incidents response must be an array');

    // Parse all issues into incidents
    const incidents = issues
      .filter((issue) => issue && typeof issue === 'object')
      .map((issue) => parseIncident(issue));

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
    err.isCodeBug = false;
    logger.warn(err, {
      extra: { message: 'Failed to fetch status incidents' }
    });

    return [];
  }
}

/**
 * Fetch the summary.json from the status page for uptime data
 * Uses authenticated requests to avoid rate limiting on raw.githubusercontent.com
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
        if (!Array.isArray(summary))
          throw new TypeError('Cached status summary must be an array');

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
    let summary;

    if (octokit) {
      // Authenticated request via Octokit repos.getContent
      const response = await octokit.repos.getContent({
        owner: STATUS_OWNER,
        repo: STATUS_REPO,
        path: 'history/summary.json',
        ref: 'master'
      });

      if (response.data && response.data.content) {
        const content = Buffer.from(response.data.content, 'base64').toString(
          'utf8'
        );
        summary = JSON.parse(content);
      } else {
        throw new Error('summary.json response missing content field');
      }
    } else {
      // Fallback to unauthenticated raw.githubusercontent.com
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

      summary = await response.body.json();
    }

    if (!Array.isArray(summary))
      throw new TypeError('GitHub status summary response must be an array');

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
    err.isCodeBug = false;
    logger.warn(err, { extra: { message: 'Failed to fetch status summary' } });
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
