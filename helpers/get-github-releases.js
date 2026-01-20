/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const ms = require('ms');
const { Octokit } = require('@octokit/core');

const env = require('#config/env');
const logger = require('#helpers/logger');

// Redis cache key for GitHub releases
const CACHE_KEY = 'event_feed:github_releases';

// Cache duration - 6 hours to match X posts and reduce API calls
const CACHE_DURATION = env.X_API_CACHE_DURATION
  ? ms(env.X_API_CACHE_DURATION)
  : ms('6h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// Default repository
const DEFAULT_REPO = 'forwardemail/forwardemail.net';

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
 * Parse a GitHub release into a standardized format
 * @param {Object} release - Release object from GitHub API
 * @returns {Object} - Parsed release object
 */
function parseRelease(release) {
  if (!release || !release.id) {
    return null;
  }

  return {
    id: release.id,
    tagName: release.tag_name,
    name: release.name || release.tag_name,
    body: release.body || '',
    htmlUrl: release.html_url,
    tarballUrl: release.tarball_url,
    zipballUrl: release.zipball_url,
    draft: release.draft,
    prerelease: release.prerelease,
    createdAt: release.created_at,
    publishedAt: release.published_at,
    author: release.author
      ? {
          login: release.author.login,
          avatarUrl: release.author.avatar_url,
          htmlUrl: release.author.html_url
        }
      : null,
    assets: (release.assets || []).map((asset) => ({
      id: asset.id,
      name: asset.name,
      size: asset.size,
      downloadCount: asset.download_count,
      browserDownloadUrl: asset.browser_download_url,
      contentType: asset.content_type
    }))
  };
}

/**
 * Fetch releases from GitHub with retry logic
 * Uses Octokit for authenticated requests (5,000 req/hour vs 60/hour)
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} perPage - Number of releases per page
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Array>} - Array of release objects from GitHub API
 */
async function fetchReleasesWithRetry(owner, repo, perPage, retryCount = 0) {
  try {
    const client = getOctokit();
    const response = await client.request(
      'GET /repos/{owner}/{repo}/releases',
      {
        owner,
        repo,
        per_page: perPage,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

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
        `GitHub releases fetch failed, retrying in ${delay}ms (attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`,
        { extra: { error: err.message, status: err.status } }
      );
      await sleep(delay);
      return fetchReleasesWithRetry(owner, repo, perPage, retryCount + 1);
    }

    // Log the error with context
    logger.error(err, {
      extra: {
        message: 'GitHub releases fetch failed after retries',
        owner,
        repo,
        retryCount,
        status: err.status
      }
    });

    throw err;
  }
}

/**
 * Fetch releases from a GitHub repository
 * Uses Redis for caching to share cache across all processes
 * Uses Octokit for authenticated requests to avoid rate limiting
 * @param {Object} options - Options for fetching releases
 * @param {Object} options.client - Redis client (required for caching)
 * @param {string} options.repo - Repository in format 'owner/repo' (default: forwardemail/forwardemail.net)
 * @param {number} options.count - Number of releases to fetch (max 100)
 * @param {boolean} options.forceRefresh - Force refresh cache
 * @returns {Promise<Array>} - Array of parsed release objects
 */
async function getGitHubReleases(options = {}) {
  const {
    client,
    repo = DEFAULT_REPO,
    count = 30,
    forceRefresh = false
  } = options;

  // Try to get from Redis cache first
  if (client && !forceRefresh) {
    try {
      const cached = await client.get(CACHE_KEY);
      if (cached) {
        const releases = JSON.parse(cached);
        logger.debug('Returning GitHub releases from Redis cache', {
          extra: { count: releases.length }
        });
        return releases.slice(0, count);
      }
    } catch (err) {
      logger.warn('Failed to read GitHub releases from Redis cache', {
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
    const [owner, repoName] = repo.split('/');
    const perPage = Math.min(count, 100);

    // Fetch releases using Octokit with retry logic
    const data = await fetchReleasesWithRetry(owner, repoName, perPage);

    if (!Array.isArray(data)) {
      logger.warn('GitHub API returned unexpected data format', {
        extra: { data }
      });
      return [];
    }

    // Parse releases, excluding drafts
    const releases = [];
    for (const release of data) {
      if (release.draft) continue; // Skip drafts
      const parsed = parseRelease(release);
      if (parsed) {
        releases.push(parsed);
      }
    }

    // Store in Redis cache
    if (client && releases.length > 0) {
      try {
        await client.set(
          CACHE_KEY,
          JSON.stringify(releases),
          'EX',
          CACHE_TTL_SECONDS
        );
        logger.info(
          `Cached ${releases.length} GitHub releases in Redis (TTL: ${CACHE_TTL_SECONDS}s)`
        );
      } catch (err) {
        logger.warn('Failed to cache GitHub releases in Redis', {
          extra: { error: err.message }
        });
      }
    }

    logger.info(`Fetched ${releases.length} GitHub releases from ${repo}`);

    return releases.slice(0, count);
  } catch (err) {
    logger.error(err, {
      extra: { message: 'Failed to fetch GitHub releases' }
    });
    return [];
  }
}

/**
 * Clear the releases cache from Redis
 * @param {Object} client - Redis client
 */
async function clearCache(client) {
  if (client) {
    try {
      await client.del(CACHE_KEY);
      logger.info('Cleared GitHub releases cache from Redis');
    } catch (err) {
      logger.warn('Failed to clear GitHub releases cache from Redis', {
        extra: { error: err.message }
      });
    }
  }
}

module.exports = getGitHubReleases;
module.exports.parseRelease = parseRelease;
module.exports.clearCache = clearCache;
module.exports.CACHE_KEY = CACHE_KEY;
module.exports.CACHE_DURATION = CACHE_DURATION;
module.exports.CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;
