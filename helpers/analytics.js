/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const config = require('#config');
const logger = require('#helpers/logger');
const parseUserAgent = require('#helpers/parse-user-agent');

// Referrer source categorization
const REFERRER_SOURCES = {
  search: [
    'google',
    'bing',
    'yahoo',
    'duckduckgo',
    'baidu',
    'yandex',
    'ecosia',
    'qwant',
    'startpage',
    'searx',
    'brave'
  ],
  social: [
    'facebook',
    'twitter',
    'x.com',
    'linkedin',
    'reddit',
    'instagram',
    'pinterest',
    'tiktok',
    'youtube',
    'tumblr',
    'mastodon',
    'threads',
    'bluesky',
    'discord',
    'slack',
    'telegram',
    'whatsapp'
  ],
  email: [
    'mail.google',
    'outlook.live',
    'mail.yahoo',
    'protonmail',
    'tutanota',
    'fastmail',
    'zoho',
    'icloud',
    'aol'
  ],
  news: [
    'news.ycombinator',
    'hackernews',
    'lobste.rs',
    'slashdot',
    'techmeme',
    'techcrunch',
    'theverge',
    'arstechnica',
    'wired'
  ]
};

/**
 * Parse user agent string to extract browser information.
 * @param {string} ua User-agent string.
 * @param {Object} [meta] Optional Client Hints metadata.
 * @returns {Object} Browser name and full version.
 */
function parseBrowser(ua, meta) {
  const { browser, browser_version } = parseUserAgent(ua, meta);
  return { browser, browser_version };
}

/**
 * Parse user agent string to extract operating-system information.
 * @param {string} ua User-agent string.
 * @param {Object} [meta] Optional Client Hints metadata.
 * @returns {Object} Operating-system name and full version.
 */
function parseOS(ua, meta) {
  const { os, os_version } = parseUserAgent(ua, meta);
  return { os, os_version };
}

/**
 * Parse user agent string to extract a normalized device type.
 * @param {string} ua User-agent string.
 * @param {Object} [meta] Optional Client Hints metadata.
 * @returns {string} desktop, mobile, tablet, or unknown.
 */
function parseDeviceType(ua, meta) {
  return parseUserAgent(ua, meta).device_type;
}

/**
 * Parse user agent string to extract an email client.
 * @param {string} ua User-agent string.
 * @param {Object} [meta] Optional Client Hints metadata.
 * @returns {string} Email client name or Unknown.
 */
function parseEmailClient(ua, meta) {
  return parseUserAgent(ua, meta).client_app;
}

/**
 * Categorize referrer source
 * @param {string} referrer - Referrer domain
 * @returns {string} - 'search', 'social', 'email', 'news', 'referral', or 'direct'
 */
function categorizeReferrer(referrer) {
  if (!isSANB(referrer)) return 'direct';

  const lowerRef = referrer.toLowerCase();

  for (const [category, domains] of Object.entries(REFERRER_SOURCES)) {
    for (const domain of domains) {
      if (lowerRef.includes(domain)) {
        return category;
      }
    }
  }

  return 'referral';
}

/**
 * Extract domain from referrer URL
 * @param {string} referrer - Full referrer URL
 * @returns {string} - Domain only
 */
function extractReferrerDomain(referrer) {
  if (!isSANB(referrer)) return '';

  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    // If not a valid URL, return as-is (might already be a domain)
    return referrer.split('/')[0];
  }
}

/**
 * Generate a daily rotating session hash for unique visitor tracking
 * This is NOT a persistent identifier - it rotates daily
 * @param {string} ip - IP address (used only for hashing, not stored)
 * @param {string} ua - User agent string
 * @returns {string} - Session hash
 */
function generateSessionHash(ip, ua) {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const salt = config.helperEncryptionKey || 'analytics-salt';
  const data = `${date}:${ip || ''}:${ua || ''}:${salt}`;
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
}

/**
 * Extract UTM parameters from URL or query object
 * @param {Object|string} query - Query parameters object or URL string
 * @returns {Object} - UTM parameters
 */
function extractUTMParams(query) {
  const params = {};

  if (typeof query === 'string') {
    try {
      const url = new URL(query, 'http://localhost');
      query = Object.fromEntries(url.searchParams);
    } catch {
      return params;
    }
  }

  if (query && typeof query === 'object') {
    if (isSANB(query.utm_source))
      params.utm_source = query.utm_source.slice(0, 100);
    if (isSANB(query.utm_medium))
      params.utm_medium = query.utm_medium.slice(0, 100);
    if (isSANB(query.utm_campaign))
      params.utm_campaign = query.utm_campaign.slice(0, 100);
    if (isSANB(query.utm_content))
      params.utm_content = query.utm_content.slice(0, 100);
    if (isSANB(query.utm_term)) params.utm_term = query.utm_term.slice(0, 100);
  }

  return params;
}

/**
 * Track an analytics event
 * Uses ignore_hook: false pattern to store in the database
 *
 * @param {Object} options - Event options
 * @param {string} options.event_type - Type of event ('auth', 'session', 'pageview', 'api_call')
 * @param {string} options.service - Service type ('smtp', 'imap', 'pop3', 'api', 'web', 'caldav', 'carddav', 'mx')
 * @param {string} [options.ip] - IP address (used for session hash only, NOT stored)
 * @param {string} [options.ua] - User agent string (parsed, raw NOT stored)
 * @param {Object} [options.client_hints] - Optional User-Agent Client Hints
 * @param {string} [options.referrer] - Referrer URL
 * @param {string} [options.pathname] - Page path
 * @param {Object} [options.query] - Query parameters (for UTM extraction)
 * @param {string} [options.user_id] - User ObjectId
 * @param {string} [options.domain_id] - Domain ObjectId

 * @param {boolean} [options.success] - Whether the event was successful
 * @param {string} [options.error_code] - Error code if not successful
 * @param {number} [options.duration] - Duration in milliseconds
 */
async function trackEvent(options) {
  try {
    const {
      event_type,
      service,
      ip,
      ua,
      client_hints,
      referrer,
      pathname,
      query,
      user_id,
      domain_id,
      success = true,
      error_code,
      duration,
      is_landing_page = false
    } = options;

    // Parse the user agent once for consistent browser, OS, device, and client fields.
    const {
      browser,
      browser_version,
      os,
      os_version,
      device_type,
      client_app,
      client_app_version
    } = parseUserAgent(ua, client_hints);

    // Process referrer
    const referrer_domain = extractReferrerDomain(referrer);
    const referrer_source = categorizeReferrer(referrer_domain);

    // Extract UTM parameters
    const utmParams = extractUTMParams(query);

    // Generate session hash (daily rotating, not persistent)
    const session_hash = generateSessionHash(ip, ua);

    // Build event data
    const eventData = {
      event_type,
      service,
      session_hash,
      browser,
      browser_version,
      os,
      os_version,
      device_type,
      client_app: client_app === 'Unknown' ? undefined : client_app,
      client_app_version: client_app_version || undefined,
      referrer: referrer_domain || undefined,
      referrer_source:
        referrer_source === 'direct' ? undefined : referrer_source,
      pathname,
      is_landing_page: is_landing_page || undefined,
      success,
      error_code,
      duration,
      hostname: require('node:os').hostname(),
      ...utmParams
    };

    // Add user reference if provided
    if (user_id && mongoose.isObjectIdOrHexString(user_id)) {
      eventData.user = new mongoose.Types.ObjectId(user_id);
    }

    // Add domain reference if provided
    if (domain_id && mongoose.isObjectIdOrHexString(domain_id)) {
      eventData.domain = new mongoose.Types.ObjectId(domain_id);
    }

    // Remove undefined values
    for (const key of Object.keys(eventData)) {
      if (eventData[key] === undefined) {
        delete eventData[key];
      }
    }

    // Log the event using the existing logger with ignore_hook: false
    // This will trigger the hook to save to the database
    logger.info('analytics:event', {
      ignore_hook: false,
      analytics: eventData
    });
  } catch (err) {
    // Don't let analytics errors affect the main application
    logger.debug('Analytics tracking error', { err, ignore_hook: true });
  }
}

/**
 * Track authentication event for SMTP/IMAP/POP3/CalDAV/CardDAV
 * @param {Object} options - Auth event options
 */
function trackAuth(options) {
  return trackEvent({
    event_type: 'auth',
    ...options
  });
}

/**
 * Track web page view
 * @param {Object} ctx - Koa context
 * @param {Object} options - Additional options
 * @param {boolean} [options.is_landing_page=false] - Whether this is a landing page
 * @param {string} [options.pathWithoutLocale] - Path without locale prefix for consistent storage
 */
function trackPageView(ctx, options = {}) {
  return trackEvent({
    event_type: 'pageview',
    service: 'web',
    ip: ctx.ip,
    ua: ctx.get('user-agent'),
    client_hints: {
      ch_platform: ctx.get('sec-ch-ua-platform'),
      ch_platform_version: ctx.get('sec-ch-ua-platform-version')
    },
    referrer: ctx.get('referer') || ctx.get('referrer'),
    // Use pathWithoutLocale if provided for consistent pathname storage
    // This ensures /en/faq, /de/faq, /zh/faq all map to /faq
    pathname: options.pathWithoutLocale || ctx.pathWithoutLocale || ctx.path,
    query: ctx.query,
    user_id: ctx.state?.user?.id,
    success: ctx.status < 400,
    is_landing_page: options.is_landing_page || false
  });
}

/**
 * Track API call
 * @param {Object} ctx - Koa context
 */
function trackAPICall(ctx) {
  return trackEvent({
    event_type: 'api_call',
    service: 'api',
    ip: ctx.ip,
    ua: ctx.get('user-agent'),
    client_hints: {
      ch_platform: ctx.get('sec-ch-ua-platform'),
      ch_platform_version: ctx.get('sec-ch-ua-platform-version')
    },
    pathname: ctx.path,
    user_id: ctx.state?.user?.id,
    success: ctx.status < 400,
    error_code: ctx.status >= 400 ? String(ctx.status) : undefined
  });
}

/**
 * Parse IMAP client ID object to a User-Agent-like string
 * IMAP clients send identification via the ID command (RFC 2971)
 * which contains fields like name, version, vendor, etc.
 *
 * @param {Object} clientId - IMAP client ID object from session.clientId
 * @returns {string} - User-Agent-like string for analytics parsing
 */
function parseIMAPClientId(clientId) {
  if (!clientId || typeof clientId !== 'object') return '';

  // Build a User-Agent-like string from IMAP ID fields
  // Common fields: name, version, vendor, os, os-version, support-url
  const parts = [];

  // Add name and version (most important)
  if (clientId.name) {
    let nameVersion = clientId.name;
    if (clientId.version) {
      nameVersion += `/${clientId.version}`;
    }

    parts.push(nameVersion);
  }

  // Add vendor if different from name
  if (clientId.vendor && clientId.vendor !== clientId.name) {
    parts.push(`(${clientId.vendor})`);
  }

  // Add OS information
  if (clientId.os) {
    let osInfo = clientId.os;
    if (clientId['os-version']) {
      osInfo += ` ${clientId['os-version']}`;
    }

    parts.push(osInfo);
  }

  return parts.join(' ');
}

module.exports = {
  trackEvent,
  trackAuth,
  trackPageView,
  trackAPICall,
  parseBrowser,
  parseOS,
  parseDeviceType,
  parseEmailClient,
  parseUserAgent,
  parseIMAPClientId,
  categorizeReferrer,
  extractReferrerDomain,
  generateSessionHash,
  extractUTMParams,
  REFERRER_SOURCES
};
