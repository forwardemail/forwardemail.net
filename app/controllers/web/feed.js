/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const striptags = require('striptags');

const config = require('#config');
const getGitHubReleases = require('#helpers/get-github-releases');
const getStatusIncidents = require('#helpers/get-status-incidents');
const getXPosts = require('#helpers/get-x-posts');
const logger = require('#helpers/logger');
const { developerDocs } = require('#config/utilities');

const author = {
  name: `${config.appName} Team`,
  email: config.email.message.from,
  link: config.urls.web
};

// Cache for generated feeds
let feedCache = {
  atom1: null,
  rss: null,
  json: null,
  timestamp: 0
};
const FEED_CACHE_DURATION = ms('10m'); // Regenerate feeds every 10 minutes

// dynamically import feed
let Feed;
import('feed').then((obj) => {
  Feed = obj.Feed;
  // Generate initial feed (without Redis client - will fetch fresh data)
  generateFeed(null).catch((err) => logger.error(err));
});

/**
 * Convert X post to feed item format
 * @param {Object} post - Parsed X post object
 * @returns {Object} - Feed item object
 */
function xPostToFeedItem(post) {
  // Create a description with the post text and any media
  let description = post.text;

  // Add links if present
  if (post.urls && post.urls.length > 0) {
    for (const url of post.urls) {
      if (url.url && url.expandedUrl) {
        description = description.replace(
          url.url,
          `<a href="${url.expandedUrl}">${
            url.displayUrl || url.expandedUrl
          }</a>`
        );
      }
    }
  }

  // Add media thumbnails to description
  if (post.media && post.media.length > 0) {
    description += '<br><br>';
    for (const m of post.media) {
      if (m.type === 'photo') {
        description += `<img src="${m.url}" alt="Post image" style="max-width:500px;"><br>`;
      } else if (m.type === 'video' && m.url) {
        description += `<a href="${post.link}"><img src="${m.url}" alt="Video thumbnail" style="max-width:500px;"></a><br>`;
      }
    }
  }

  // Create a title from the first line or first 100 chars
  let title = post.text.split('\n')[0];
  if (title.length > 100) {
    title = title.slice(0, 97) + '...';
  }

  // Remove any HTML from title
  title = striptags(title);

  return {
    title: `@fwdemail: ${title}`,
    category: [{ name: 'X Posts', domain: 'https://x.com/fwdemail' }],
    id: post.link,
    link: post.link,
    description,
    author: [
      {
        name: post.user.name,
        link: `https://x.com/${post.user.username}`
      }
    ],
    date: new Date(post.createdAt),
    published: new Date(post.createdAt),
    image: post.media?.[0]?.url || post.user.profileImageUrl
  };
}

/**
 * Convert status incident to feed item format
 * @param {Object} incident - Parsed status incident object
 * @returns {Object} - Feed item object
 */
function incidentToFeedItem(incident) {
  // Create description with incident details
  let description = incident.body || incident.title;

  // Add duration if resolved
  if (incident.duration) {
    const durationMins = Math.round(incident.duration / 60000);
    description += `<br><br><strong>Duration:</strong> ${durationMins} minutes`;
  }

  // Add status
  const statusText =
    incident.status === 'resolved' ? '✓ Resolved' : '🛑 Ongoing';
  description += `<br><strong>Status:</strong> ${statusText}`;

  // Add link to incident
  description += `<br><br><a href="${incident.url}">View incident details →</a>`;

  // Create title with status prefix
  const statusPrefix = incident.status === 'resolved' ? '✓' : '🛑';
  const title = `${statusPrefix} ${incident.title}`;

  return {
    title,
    category: [
      { name: 'Status Incidents', domain: 'https://status.forwardemail.net' }
    ],
    id: incident.url,
    link: incident.url,
    description,
    author: [author],
    date: new Date(incident.createdAt),
    published: new Date(incident.createdAt)
  };
}

/**
 * Convert GitHub release to feed item format
 * @param {Object} release - Parsed GitHub release object
 * @returns {Object} - Feed item object
 */
function releaseToFeedItem(release) {
  // Create description with release notes
  let description = release.body || `Release ${release.tagName}`;

  // Convert markdown-style links and formatting to HTML
  description = description
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  // Add download links if assets are present
  if (release.assets && release.assets.length > 0) {
    description += '<br><br><strong>Downloads:</strong><ul>';
    for (const asset of release.assets) {
      description += `<li><a href="${asset.browserDownloadUrl}">${
        asset.name
      }</a> (${Math.round(asset.size / 1024)} KB)</li>`;
    }

    description += '</ul>';
  }

  // Add source code links
  description += `<br><a href="${release.tarballUrl}">Download source (tar.gz)</a> | `;
  description += `<a href="${release.zipballUrl}">Download source (zip)</a>`;

  // Create title
  const title = release.name || `Release ${release.tagName}`;
  const prereleasePrefix = release.prerelease ? '[Pre-release] ' : '';

  return {
    title: `${prereleasePrefix}${title}`,
    category: [
      {
        name: 'GitHub Releases',
        domain: 'https://github.com/forwardemail/forwardemail.net/releases'
      }
    ],
    id: release.htmlUrl,
    link: release.htmlUrl,
    description,
    author: release.author
      ? [
          {
            name: release.author.login,
            link: release.author.htmlUrl
          }
        ]
      : [author],
    date: new Date(release.publishedAt || release.createdAt),
    published: new Date(release.publishedAt || release.createdAt)
  };
}

/**
 * Generate the combined feed with developer docs, X posts, status incidents, and GitHub releases
 * @param {Object} client - Redis client for caching (optional)
 */
async function generateFeed(client) {
  if (!Feed) return;

  const f = new Feed({
    title: `${config.appName} Blog`,
    description: `Stay up to date on ${config.appName} product updates, news, releases, status incidents, and alerts.`,
    id: config.urls.web,
    link: config.urls.web,
    language: 'en',
    image: `${config.urls.web}/img/apple-touch-icon.png`,
    favicon: `${config.urls.web}/favicon.ico`,
    copyright: `Copyright ${dayjs().format(
      'YYYY'
    )} Forward Email LLC. All rights reserved.`,
    updated: new Date(),
    generator: 'forward-email',
    feedLinks: {
      json: `${config.urls.web}/blog/feed/json`,
      atom: `${config.urls.web}/blog/feed/atom`,
      rss: `${config.urls.web}/blog/feed/rss`
    },
    author
  });

  f.addCategory('Developer Articles');
  f.addCategory('X Posts');
  f.addCategory('Status Incidents');
  f.addCategory('GitHub Releases');

  // Collect all items with their dates for sorting
  const allItems = [];

  // Add developer docs
  for (const doc of developerDocs) {
    allItems.push({
      type: 'doc',
      date: doc.mtime,
      item: {
        title: doc.title,
        category: [
          { name: 'Developer Articles', domain: `${config.urls.web}/blog/docs` }
        ],
        id: `${config.urls.web}${doc.slug}`,
        link: `${config.urls.web}${doc.slug}`,
        description: doc.description,
        author: [author],
        date: new Date(doc.mtime),
        published: new Date(doc.ctime),
        image: `${config.urls.web}${doc.slug}.png`
      }
    });
  }

  // Fetch X posts, status incidents, and GitHub releases in parallel
  // Pass Redis client for caching
  const [xPosts, incidents, releases] = await Promise.all([
    getXPosts({ client, count: 20 }).catch((err) => {
      logger.error(err, { extra: { message: 'Failed to fetch X posts' } });
      return [];
    }),
    getStatusIncidents({ client, count: 50 }).catch((err) => {
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
    try {
      const feedItem = xPostToFeedItem(post);
      allItems.push({
        type: 'xpost',
        date: new Date(post.createdAt),
        item: feedItem
      });
    } catch (err) {
      logger.error(err, {
        extra: { message: 'Failed to convert X post to feed item' }
      });
    }
  }

  // Add status incidents
  for (const incident of incidents) {
    try {
      const feedItem = incidentToFeedItem(incident);
      allItems.push({
        type: 'incident',
        date: new Date(incident.createdAt),
        item: feedItem
      });
    } catch (err) {
      logger.error(err, {
        extra: { message: 'Failed to convert incident to feed item' }
      });
    }
  }

  // Add GitHub releases
  for (const release of releases) {
    try {
      const feedItem = releaseToFeedItem(release);
      allItems.push({
        type: 'release',
        date: new Date(release.publishedAt || release.createdAt),
        item: feedItem
      });
    } catch (err) {
      logger.error(err, {
        extra: { message: 'Failed to convert release to feed item' }
      });
    }
  }

  // Sort all items by date (newest first)
  allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Add sorted items to feed
  for (const { item } of allItems) {
    f.addItem(item);
  }

  // Update cache
  feedCache = {
    atom1: f.atom1(),
    rss: f.rss2(),
    json: f.json1(),
    timestamp: Date.now()
  };
}

/**
 * Refresh feed if cache is stale
 * @param {Object} client - Redis client for caching (optional)
 */
async function refreshFeedIfNeeded(client) {
  const now = Date.now();
  if (now - feedCache.timestamp > FEED_CACHE_DURATION) {
    await generateFeed(client);
  }
}

async function feed(ctx, next) {
  // Ensure Feed is loaded
  if (!Feed) {
    throw Boom.clientTimeout(ctx.translateError('WEBSITE_OUTAGE'));
  }

  // Refresh feed if needed, passing Redis client for caching
  await refreshFeedIfNeeded(ctx.client);

  // Check if feeds are generated
  if (!feedCache.atom1 || !feedCache.rss || !feedCache.json) {
    throw Boom.clientTimeout(ctx.translateError('WEBSITE_OUTAGE'));
  }

  switch (ctx.pathWithoutLocale) {
    case '/blog/feed/atom': {
      ctx.type = 'application/atom+xml';
      ctx.body = feedCache.atom1;
      break;
    }

    case '/blog/feed/rss': {
      ctx.type = 'application/rss+xml';
      ctx.body = feedCache.rss;
      break;
    }

    case '/blog/feed/json': {
      ctx.type = 'application/json';
      ctx.body = feedCache.json;
      break;
    }

    default: {
      return next();
    }
  }
}

module.exports = feed;
