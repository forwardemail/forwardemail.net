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

// Redis cache key for GitHub releases
const CACHE_KEY = 'event_feed:github_releases';

// Cache duration - 6 hours to match X posts and reduce API calls
const CACHE_DURATION = env.X_API_CACHE_DURATION
  ? ms(env.X_API_CACHE_DURATION)
  : ms('6h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Default repositories to fetch releases from
const DEFAULT_REPOS = [
  'forwardemail/forwardemail.net',
  'forwardemail/mail.forwardemail.net'
];

/**
 * Parse a GitHub release into a standardized format
 * @param {Object} release - Release object from GitHub API
 * @param {string} repo - Repository name (owner/repo)
 * @returns {Object} - Parsed release object
 */
function parseRelease(release, repo) {
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
    repo,
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
 * Fetch releases from a single GitHub repository
 * @param {string} repo - Repository in format 'owner/repo'
 * @param {number} count - Number of releases to fetch (max 100)
 * @returns {Promise<Array>} - Array of parsed release objects
 */
async function fetchReleasesFromRepo(repo, count) {
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
      new Error(`GitHub API error: ${response.status} ${response.statusText}`),
      { extra: { errorText, repo } }
    );
    return [];
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    logger.warn('GitHub API returned unexpected data format', {
      extra: { data, repo }
    });
    return [];
  }

  // Parse releases, excluding drafts
  const releases = [];
  for (const release of data) {
    if (release.draft) continue; // Skip drafts
    const parsed = parseRelease(release, repo);
    if (parsed) {
      releases.push(parsed);
    }
  }

  return releases;
}

/**
 * Fetch releases from one or more GitHub repositories
 * Uses Redis for caching to share cache across all processes
 * @param {Object} options - Options for fetching releases
 * @param {Object} options.client - Redis client (required for caching)
 * @param {string|string[]} options.repos - Repository or repositories in format 'owner/repo'
 * @param {string} options.repo - Single repository (deprecated, use repos)
 * @param {number} options.count - Number of releases to return (max 100)
 * @param {boolean} options.forceRefresh - Force refresh cache
 * @returns {Promise<Array>} - Array of parsed release objects sorted by date
 */
async function getGitHubReleases(options = {}) {
  const { client, repos, repo, count = 30, forceRefresh = false } = options;

  // Determine which repos to fetch from
  // Support both `repo` (single string) and `repos` (array) for backwards compat
  let repoList;
  if (repos) {
    repoList = Array.isArray(repos) ? repos : [repos];
  } else if (repo) {
    repoList = [repo];
  } else {
    repoList = DEFAULT_REPOS;
  }

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
    // Fetch releases from all repos in parallel
    const results = await Promise.all(
      repoList.map((r) => fetchReleasesFromRepo(r, count))
    );

    // Merge and sort by published date (newest first)
    const releases = results
      .flat()
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt) -
          new Date(a.publishedAt || a.createdAt)
      );

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

    logger.info(
      `Fetched ${releases.length} GitHub releases from ${repoList.join(', ')}`
    );

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
module.exports.fetchReleasesFromRepo = fetchReleasesFromRepo;
module.exports.clearCache = clearCache;
module.exports.CACHE_KEY = CACHE_KEY;
module.exports.CACHE_DURATION = CACHE_DURATION;
module.exports.CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;
module.exports.DEFAULT_REPOS = DEFAULT_REPOS;
