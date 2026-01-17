/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const ms = require('ms');
const undici = require('undici');

const logger = require('#helpers/logger');

// Redis cache key for GitHub releases
const CACHE_KEY = 'event_feed:github_releases';

// Cache duration - 6 hours to match X posts and reduce API calls
const CACHE_DURATION = ms('6h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Default repository
const DEFAULT_REPO = 'forwardemail/forwardemail.net';

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
 * Fetch releases from a GitHub repository
 * Uses Redis for caching to share cache across all processes
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

  try {
    const url = `${GITHUB_API_BASE}/repos/${repo}/releases?per_page=${Math.min(
      count,
      100
    )}`;

    const response = await undici.fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ForwardEmail/1.0',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        ),
        { extra: { errorText, repo } }
      );
      return [];
    }

    const data = await response.json();

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
