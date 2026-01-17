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

// Redis cache key for X posts
const CACHE_KEY = 'event_feed:x_posts';

// Cache duration is configurable via environment variable
// Default to 6 hours to minimize API costs (10 requests = $0.03)
// At 6h cache: ~4 requests/day = ~$0.01/day = ~$0.36/month
const CACHE_DURATION = env.X_API_CACHE_DURATION
  ? ms(env.X_API_CACHE_DURATION)
  : ms('6h');

// Cache duration in seconds for Redis
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// X API v2 base URL
const X_API_BASE = 'https://api.x.com/2';

/**
 * Parse a tweet from X API v2 response format
 * @param {Object} tweet - Tweet object from X API v2
 * @param {Object} includes - Includes object containing expanded data
 * @returns {Object|null} - Parsed tweet object or null if invalid
 */
function parseTweet(tweet, includes = {}) {
  if (!tweet || !tweet.id) {
    return null;
  }

  // Skip retweets (they have referenced_tweets with type 'retweeted')
  if (tweet.referenced_tweets) {
    const isRetweet = tweet.referenced_tweets.some(
      (ref) => ref.type === 'retweeted'
    );
    if (isRetweet) {
      return null;
    }
  }

  // Find the user in includes
  const users = includes.users || [];
  const user = users.find((u) => u.id === tweet.author_id) || {};

  // Find media in includes
  const media = includes.media || [];
  const tweetMedia = [];

  if (tweet.attachments && tweet.attachments.media_keys) {
    for (const mediaKey of tweet.attachments.media_keys) {
      const mediaItem = media.find((m) => m.media_key === mediaKey);
      if (mediaItem) {
        tweetMedia.push({
          type: mediaItem.type,
          url: mediaItem.url || mediaItem.preview_image_url,
          width: mediaItem.width,
          height: mediaItem.height
        });
      }
    }
  }

  // Extract URLs from entities
  const urls = [];
  if (tweet.entities && tweet.entities.urls) {
    for (const url of tweet.entities.urls) {
      // Skip t.co links that are just media links
      if (url.expanded_url && !url.expanded_url.includes('twitter.com/')) {
        urls.push({
          url: url.url,
          expandedUrl: url.expanded_url,
          displayUrl: url.display_url,
          title: url.title,
          description: url.description
        });
      }
    }
  }

  // Get public metrics
  const metrics = tweet.public_metrics || {};

  return {
    id: tweet.id,
    text: tweet.text,
    createdAt: tweet.created_at,
    link: `https://x.com/${user.username || 'fwdemail'}/status/${tweet.id}`,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      profileImageUrl: user.profile_image_url
    },
    media: tweetMedia,
    urls,
    metrics: {
      likes: metrics.like_count || 0,
      retweets: metrics.retweet_count || 0,
      replies: metrics.reply_count || 0,
      quotes: metrics.quote_count || 0
    },
    conversationId: tweet.conversation_id,
    lang: tweet.lang
  };
}

/**
 * Fetch posts from X/Twitter using the official X API v2
 * Uses Redis for caching to share cache across all processes
 * @param {Object} options - Options for fetching posts
 * @param {Object} options.client - Redis client (required)
 * @param {number} options.count - Number of posts to fetch (max 100)
 * @param {boolean} options.forceRefresh - Force refresh cache
 * @returns {Promise<Array>} - Array of parsed tweet objects
 */
async function getXPosts(options = {}) {
  const { client, count = 20, forceRefresh = false } = options;

  // Try to get from Redis cache first
  if (client && !forceRefresh) {
    try {
      const cached = await client.get(CACHE_KEY);
      if (cached) {
        const posts = JSON.parse(cached);
        logger.debug('Returning X posts from Redis cache', {
          extra: { count: posts.length }
        });
        return posts.slice(0, count);
      }
    } catch (err) {
      logger.warn('Failed to read X posts from Redis cache', {
        extra: { error: err.message }
      });
    }
  }

  // Check if X API bearer token is configured
  if (!env.X_API_BEARER_TOKEN) {
    logger.warn('X_API_BEARER_TOKEN not configured, skipping X posts fetch');
    return [];
  }

  // Check if X user ID is configured
  // IMPORTANT: Convert to string to prevent JavaScript number precision loss
  // Large integers like Twitter IDs lose precision when parsed as numbers
  const userId = String(env.X_USER_ID || '1347581552339914756'); // Default to @fwdemail

  try {
    // Build the API URL with query parameters
    const params = new URLSearchParams({
      max_results: String(Math.min(count, 100)),
      exclude: 'retweets,replies',
      'tweet.fields':
        'created_at,public_metrics,entities,attachments,conversation_id,lang',
      'user.fields': 'name,username,profile_image_url',
      'media.fields': 'type,url,preview_image_url,width,height',
      expansions: 'author_id,attachments.media_keys'
    });

    const url = `${X_API_BASE}/users/${userId}/tweets?${params.toString()}`;

    const response = await undici.fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.X_API_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        new Error(`X API error: ${response.status} ${response.statusText}`),
        { extra: { errorText, userId } }
      );
      return [];
    }

    const data = await response.json();

    // Log the response structure for debugging
    logger.debug('X API response received', {
      extra: {
        hasData: Boolean(data.data),
        dataLength: data.data?.length,
        hasErrors: Boolean(data.errors),
        errorCount: data.errors?.length,
        meta: data.meta
      }
    });

    // Check for API errors in the response
    if (data.errors && data.errors.length > 0) {
      logger.error(new Error('X API returned errors'), {
        extra: { errors: data.errors }
      });
      return [];
    }

    if (!data.data || !Array.isArray(data.data)) {
      logger.warn('X API returned no tweets', {
        extra: {
          hasData: Boolean(data.data),
          dataType: typeof data.data,
          keys: Object.keys(data)
        }
      });
      return [];
    }

    // Parse tweets
    const tweets = [];
    for (const tweet of data.data) {
      const parsed = parseTweet(tweet, data.includes || {});
      if (parsed) {
        tweets.push(parsed);
      }
    }

    // Store in Redis cache
    if (client && tweets.length > 0) {
      try {
        await client.set(
          CACHE_KEY,
          JSON.stringify(tweets),
          'EX',
          CACHE_TTL_SECONDS
        );
        logger.info(
          `Cached ${tweets.length} X posts in Redis (TTL: ${CACHE_TTL_SECONDS}s)`
        );
      } catch (err) {
        logger.warn('Failed to cache X posts in Redis', {
          extra: { error: err.message }
        });
      }
    }

    logger.info(`Fetched ${tweets.length} X posts from API`);

    return tweets.slice(0, count);
  } catch (err) {
    logger.error(err, { extra: { message: 'Failed to fetch X posts' } });
    return [];
  }
}

// Export cache key and duration for reference
module.exports = getXPosts;
module.exports.parseTweet = parseTweet;
module.exports.CACHE_KEY = CACHE_KEY;
module.exports.CACHE_DURATION = CACHE_DURATION;
module.exports.CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;
