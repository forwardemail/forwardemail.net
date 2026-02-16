/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const crypto = require('node:crypto');

const ms = require('ms');
const undici = require('undici');

const env = require('#config/env');
const logger = require('#helpers/logger');

// Redis cache key for mail app releases
const CACHE_KEY = 'mail_app:github_releases';

// Redis key for the last known release fingerprint (tag + assets + body hash)
const LAST_RELEASE_KEY = 'mail_app:last_release_fingerprint';

// Redis key for a pending release tag that has been detected but has no
// assets yet (e.g. the release was just created and the CI workflow is
// still building).  We hold off broadcasting until assets appear.
const PENDING_RELEASE_KEY = 'mail_app:pending_release_tag';

// Poll interval — 15 minutes (respects GitHub API rate limit of 60 req/hr
// for unauthenticated requests; this uses at most 4 req/hr)
const POLL_INTERVAL = env.MAIL_APP_RELEASE_POLL_INTERVAL
  ? ms(env.MAIL_APP_RELEASE_POLL_INTERVAL)
  : ms('15m');

// Cache TTL — aligned with poll interval
const CACHE_TTL_SECONDS = Math.ceil(POLL_INTERVAL / 1000);

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Repository to monitor for releases
// <https://github.com/forwardemail/mail.forwardemail.net>
const MAIL_APP_REPO = 'forwardemail/mail.forwardemail.net';

/**
 * Parse a GitHub release into a standardized format
 * @param {Object} release - Release object from GitHub API
 * @returns {Object|null} - Parsed release object or null
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
 * Fetch the latest release from the mail app repository.
 * Uses Redis for caching to share state across all processes and
 * to respect GitHub API rate limits.
 *
 * @param {Object} options - Options
 * @param {Object} options.client - Redis client (required for caching)
 * @param {boolean} options.forceRefresh - Force refresh cache
 * @returns {Promise<Object|null>} - Latest parsed release or null
 */
async function getLatestMailAppRelease(options = {}) {
  const { client, forceRefresh = false } = options;

  // Try Redis cache first
  if (client && !forceRefresh) {
    try {
      const cached = await client.get(CACHE_KEY);
      if (cached) {
        const release = JSON.parse(cached);
        logger.debug('Returning mail app release from Redis cache');
        return release;
      }
    } catch (err) {
      logger.warn('Failed to read mail app release from Redis cache', {
        extra: { error: err.message }
      });
    }
  }

  try {
    // Fetch only the latest release (single API call, minimal rate limit impact)
    const url = `${GITHUB_API_BASE}/repos/${MAIL_APP_REPO}/releases/latest`;

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ForwardEmail/1.0',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Use GitHub token if available for higher rate limits (5000 req/hr)
    if (env.GITHUB_OCTOKIT_TOKEN) {
      headers.Authorization = `Bearer ${env.GITHUB_OCTOKIT_TOKEN}`;
    }

    const response = await undici.fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      // 404 means no releases exist yet — not an error
      if (response.status === 404) {
        logger.debug('No releases found for mail app repository');
        return null;
      }

      const errorText = await response.text();
      logger.error(
        new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        ),
        { extra: { errorText, repo: MAIL_APP_REPO } }
      );
      return null;
    }

    const data = await response.json();

    // Skip drafts
    if (data.draft) {
      return null;
    }

    const release = parseRelease(data);

    // Store in Redis cache
    if (client && release) {
      try {
        await client.set(
          CACHE_KEY,
          JSON.stringify(release),
          'EX',
          CACHE_TTL_SECONDS
        );
        logger.debug(
          `Cached mail app release in Redis (TTL: ${CACHE_TTL_SECONDS}s)`
        );
      } catch (err) {
        logger.warn('Failed to cache mail app release in Redis', {
          extra: { error: err.message }
        });
      }
    }

    return release;
  } catch (err) {
    logger.error(err, {
      extra: { message: 'Failed to fetch mail app release' }
    });
    return null;
  }
}

/**
 * Compute a fingerprint for a release that captures its tag, body, and
 * the set of attached assets.  This allows detection of changes to an
 * existing release — for example when a GitHub Actions `release.yml`
 * workflow uploads build assets after the release is initially published.
 *
 * The fingerprint is a short SHA-256 hex digest of a deterministic string
 * built from the tag name, body text, and sorted asset names + sizes.
 *
 * @param {Object} release - Parsed release object
 * @returns {string} - Hex fingerprint
 */
function computeReleaseFingerprint(release) {
  const parts = [
    release.tagName || '',
    release.body || '',
    release.prerelease ? '1' : '0',
    ...(release.assets || []).map((a) => `${a.name}:${a.size}`).sort()
  ];
  return crypto.createHash('sha256').update(parts.join('\n')).digest('hex');
}

/**
 * Check whether the latest release is new or has been updated since the
 * last check.  Uses a content-based fingerprint (tag + body + assets)
 * stored in Redis so that both brand-new releases AND post-publish
 * changes (e.g. assets added by a CI workflow) trigger a notification.
 *
 * **Asset gating**: When a new tag is detected but the release has no
 * assets yet (common when a GitHub Actions `release.yml` workflow is
 * still building), the tag is stored in Redis as "pending" and the
 * function returns `null`.  On subsequent polls, once assets appear
 * the pending flag is cleared and the release is returned for broadcast.
 * This avoids sending a notification before the downloadable artifacts
 * are actually available.
 *
 * This function is designed to be called on a timer by the API server.
 * It is idempotent — only the first call after a release is ready will
 * return a non-null value.
 *
 * @param {Object} options - Options
 * @param {Object} options.client - Redis client (required)
 * @returns {Promise<Object|null>} - The new/updated release, or null if unchanged
 */
async function checkForNewMailAppRelease(options = {}) {
  const { client } = options;

  if (!client) {
    logger.warn('Redis client required for mail app release checking');
    return null;
  }

  const release = await getLatestMailAppRelease({
    client,
    forceRefresh: true
  });

  if (!release) return null;

  const hasAssets = Array.isArray(release.assets) && release.assets.length > 0;

  try {
    const fingerprint = computeReleaseFingerprint(release);
    const lastFingerprint = await client.get(LAST_RELEASE_KEY);

    // If this is the very first check, store the fingerprint but don't
    // treat it as "new" (avoids a spurious notification on first deploy)
    if (lastFingerprint === null) {
      await client.set(LAST_RELEASE_KEY, fingerprint);
      logger.info(
        `Initialized mail app release tracker at ${
          release.tagName
        } (${fingerprint.slice(0, 12)})`
      );
      return null;
    }

    // Same fingerprint — nothing changed
    if (lastFingerprint === fingerprint) {
      // Even if the fingerprint hasn't changed, check whether we are
      // still waiting for assets on a pending release (shouldn't happen
      // normally, but handles edge cases)
      return null;
    }

    // --- Fingerprint changed — decide whether to broadcast or defer ---

    const pendingTag = await client.get(PENDING_RELEASE_KEY);

    if (!hasAssets) {
      // New release detected but no assets yet — mark as pending and
      // wait for the CI workflow to upload build artifacts
      await client.set(PENDING_RELEASE_KEY, release.tagName);
      logger.info(
        `New mail app release ${release.tagName} detected but has no assets yet — deferring broadcast`
      );
      return null;
    }

    // Assets are present.  If this tag was previously pending, clear it.
    if (pendingTag) {
      await client.del(PENDING_RELEASE_KEY);
      logger.info(
        `Assets now available for pending release ${release.tagName} — broadcasting`
      );
    }

    // Update stored fingerprint and return the release for broadcast
    await client.set(LAST_RELEASE_KEY, fingerprint);
    logger.info(
      `Mail app release change detected: ${
        release.tagName
      } (${fingerprint.slice(0, 12)}, was: ${lastFingerprint.slice(0, 12)})`
    );

    return release;
  } catch (err) {
    logger.error(err, {
      extra: { message: 'Failed to check for new mail app release' }
    });
    return null;
  }
}

module.exports = checkForNewMailAppRelease;
module.exports.checkForNewMailAppRelease = checkForNewMailAppRelease;
module.exports.POLL_INTERVAL = POLL_INTERVAL;
