/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');
const striptags = require('striptags');

const config = require('#config');
const getGitHubReleases = require('#helpers/get-github-releases');
const getStatusIncidents = require('#helpers/get-status-incidents');
const getXPosts = require('#helpers/get-x-posts');
const logger = require('#helpers/logger');
const { developerDocs } = require('#config/utilities');

// Cache for event feed data
let eventFeedCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = ms('5m'); // Cache for 5 minutes

// Time window for "recent" events (72 hours)
const RECENT_WINDOW = ms('72h');

/**
 * Get all events (X posts, status incidents, developer docs, GitHub releases) sorted by date
 * @param {Object} client - Redis client for caching (optional)
 * @returns {Promise<Array>} - Array of event objects
 */
async function getAllEvents(client) {
  const now = Date.now();

  // Return cached data if still valid
  if (eventFeedCache && now - cacheTimestamp < CACHE_DURATION) {
    return eventFeedCache;
  }

  const events = [];

  // Add developer docs
  for (const doc of developerDocs) {
    events.push({
      type: 'article',
      title: doc.title,
      description: doc.description,
      date: new Date(doc.mtime),
      publishedDate: new Date(doc.ctime),
      link: `${config.urls.web}${doc.slug}`,
      slug: doc.slug,
      icon: doc.icon || 'fa fa-file-alt',
      category: 'Developer Articles',
      image: doc.ogImage
        ? `${config.urls.web}${doc.ogImage}`
        : `${config.urls.web}${doc.slug}.png`
    });
  }

  // Fetch X posts, status incidents, and GitHub releases in parallel
  // Pass Redis client for caching
  const [xPosts, incidents, releases] = await Promise.all([
    getXPosts({ client, count: 30 }).catch((err) => {
      logger.error(err, { extra: { message: 'Failed to fetch X posts' } });
      return [];
    }),
    getStatusIncidents({ client, count: 100 }).catch((err) => {
      logger.error(err, { extra: { message: 'Failed to fetch incidents' } });
      return [];
    }),
    getGitHubReleases({ client, count: 30 }).catch((err) => {
      logger.error(err, {
        extra: { message: 'Failed to fetch GitHub releases' }
      });
      return [];
    })
  ]);

  // Add X posts
  for (const post of xPosts) {
    // Create a title from the first line or first 100 chars
    let title = post.text.split('\n')[0];
    if (title.length > 100) {
      title = title.slice(0, 97) + '...';
    }

    title = striptags(title);

    events.push({
      type: 'xpost',
      title: `@fwdemail: ${title}`,
      description: post.text,
      date: new Date(post.createdAt),
      publishedDate: new Date(post.createdAt),
      link: post.link,
      icon: 'fab fa-x-twitter',
      category: 'X Posts',
      user: post.user,
      media: post.media,
      metrics: post.metrics,
      urls: post.urls
    });
  }

  // Add status incidents
  for (const incident of incidents) {
    const statusPrefix = incident.status === 'resolved' ? '✓' : '🛑';
    const statusClass =
      incident.status === 'resolved' ? 'text-success' : 'text-danger';

    events.push({
      type: 'incident',
      title: `${statusPrefix} ${incident.title}`,
      description: incident.body || incident.title,
      date: new Date(incident.createdAt),
      publishedDate: new Date(incident.createdAt),
      closedDate: incident.closedAt ? new Date(incident.closedAt) : null,
      link: incident.url,
      icon:
        incident.status === 'resolved'
          ? 'fa fa-check-circle'
          : 'fa fa-exclamation-circle',
      category: 'Status Incidents',
      status: incident.status,
      statusClass,
      duration: incident.duration,
      serviceName: incident.serviceName,
      labels: incident.labels
    });
  }

  // Add GitHub releases
  for (const release of releases) {
    const prereleasePrefix = release.prerelease ? '[Pre-release] ' : '';
    const title = release.name || `Release ${release.tagName}`;

    // Create a description from release body (first 200 chars)
    let description = release.body || `Release ${release.tagName}`;
    if (description.length > 200) {
      description = description.slice(0, 197) + '...';
    }

    description = striptags(description);

    events.push({
      type: 'release',
      title: `${prereleasePrefix}${title}`,
      description,
      fullBody: release.body,
      date: new Date(release.publishedAt || release.createdAt),
      publishedDate: new Date(release.publishedAt || release.createdAt),
      link: release.htmlUrl,
      icon: 'fab fa-github',
      category: 'GitHub Releases',
      tagName: release.tagName,
      prerelease: release.prerelease,
      author: release.author,
      assets: release.assets,
      tarballUrl: release.tarballUrl,
      zipballUrl: release.zipballUrl
    });
  }

  // Sort all events by date (newest first)
  events.sort((a, b) => b.date - a.date);

  // Update cache
  eventFeedCache = events;
  cacheTimestamp = now;

  return events;
}

/**
 * Get recent events count and breakdown for navbar badge
 * @param {Object} client - Redis client for caching (optional)
 * @param {Date|null} sinceDate - Only count events after this date (for session-based tracking)
 * @returns {Promise<Object>} - Object with counts
 */
async function getRecentEventsStats(client, sinceDate = null) {
  const events = await getAllEvents(client);
  const now = Date.now();
  const cutoffDate = sinceDate || new Date(now - RECENT_WINDOW);

  // Filter events that are newer than the cutoff date
  const recentEvents = events.filter((e) => e.date > cutoffDate);

  // Count by type
  const xPostsCount = recentEvents.filter((e) => e.type === 'xpost').length;
  const releasesCount = recentEvents.filter((e) => e.type === 'release').length;
  const incidentsCount = recentEvents.filter(
    (e) => e.type === 'incident'
  ).length;
  const articlesCount = recentEvents.filter((e) => e.type === 'article').length;

  // Also get total events count for grey badge
  const totalEvents = events.length;

  return {
    total: recentEvents.length,
    totalEvents,
    xPosts: xPostsCount,
    releases: releasesCount,
    incidents: incidentsCount,
    articles: articlesCount
  };
}

/**
 * Build tooltip text for navbar badge
 * @param {Object} stats - Stats object from getRecentEventsStats
 * @param {boolean} isNew - Whether these are new events (since last visit)
 * @param {Function} t - Translation function
 * @returns {string} - Tooltip text
 */
function buildBadgeTooltip(stats, isNew, t) {
  if (stats.total === 0 && isNew) {
    return t('No new updates');
  }

  const parts = [];

  if (stats.releases > 0) {
    parts.push(
      stats.releases === 1 ? t('1 release') : t('%d releases', stats.releases)
    );
  }

  if (stats.incidents > 0) {
    parts.push(
      stats.incidents === 1
        ? t('1 status update')
        : t('%d status updates', stats.incidents)
    );
  }

  if (stats.xPosts > 0) {
    parts.push(
      stats.xPosts === 1 ? t('1 X post') : t('%d X posts', stats.xPosts)
    );
  }

  if (stats.articles > 0) {
    parts.push(
      stats.articles === 1 ? t('1 article') : t('%d articles', stats.articles)
    );
  }

  const breakdown = parts.length > 0 ? `: ${parts.join(', ')}` : '';

  if (isNew) {
    const totalText =
      stats.total === 1
        ? t('1 new update in 72h')
        : t('%d new updates in 72h', stats.total);
    return `${totalText}${breakdown}`;
  }

  // For grey badge (total events)
  const totalText =
    stats.totalEvents === 1
      ? t('1 total event')
      : t('%d total events', stats.totalEvents);
  return totalText;
}

/**
 * Event Feed page controller
 */
async function eventFeed(ctx, next) {
  try {
    // Pass Redis client for caching
    const events = await getAllEvents(ctx.client);

    // Group events by type for filtering
    const xPosts = events.filter((e) => e.type === 'xpost');
    const incidents = events.filter((e) => e.type === 'incident');
    const articles = events.filter((e) => e.type === 'article');
    const releases = events.filter((e) => e.type === 'release');

    // Get filter from query string
    const filter = ctx.query.filter || 'all';

    let filteredEvents = events;
    switch (filter) {
      case 'xposts': {
        filteredEvents = xPosts;

        break;
      }

      case 'incidents': {
        filteredEvents = incidents;

        break;
      }

      case 'articles': {
        filteredEvents = articles;

        break;
      }

      case 'releases': {
        filteredEvents = releases;

        break;
      }
      // No default
    }

    // Update session to mark that user has viewed the event feed
    // This is used to determine whether to show the navbar badge
    if (ctx.session) {
      ctx.session.eventFeedLastVisit = new Date().toISOString();
    }

    ctx.state.events = filteredEvents;
    ctx.state.allEvents = events;
    ctx.state.xPostsCount = xPosts.length;
    ctx.state.incidentsCount = incidents.length;
    ctx.state.articlesCount = articles.length;
    ctx.state.releasesCount = releases.length;
    ctx.state.currentFilter = filter;

    // Set page metadata
    ctx.state.meta = {
      title: `Event Feed - ${config.appName}`,
      description: `Stay up to date with ${config.appName} news, X posts, status incidents, releases, and developer articles.`
    };

    return next();
  } catch (err) {
    logger.error(err, { extra: { message: 'Failed to load event feed' } });
    ctx.throw(500, ctx.translateError('UNKNOWN_ERROR'));
  }
}

module.exports = eventFeed;
module.exports.getAllEvents = getAllEvents;
module.exports.getRecentEventsStats = getRecentEventsStats;
module.exports.buildBadgeTooltip = buildBadgeTooltip;
module.exports.RECENT_WINDOW = RECENT_WINDOW;
