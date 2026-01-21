/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const config = require('#config');
const logger = require('#helpers/logger');

// Common email client patterns for detection
const EMAIL_CLIENT_PATTERNS = [
  // Desktop clients
  { pattern: /betterbird/i, name: 'Betterbird' },
  { pattern: /outlook/i, name: 'Outlook' },
  { pattern: /apple.?mail/i, name: 'Apple Mail' },
  { pattern: /mail\.app/i, name: 'Apple Mail' },
  { pattern: /darwin.*mail/i, name: 'Apple Mail' },
  { pattern: /em client/i, name: 'eM Client' },
  { pattern: /mailbird/i, name: 'Mailbird' },
  { pattern: /postbox/i, name: 'Postbox' },
  { pattern: /the\.?bat/i, name: 'The Bat!' },
  { pattern: /claws.?mail/i, name: 'Claws Mail' },
  { pattern: /evolution/i, name: 'Evolution' },
  { pattern: /kmail/i, name: 'KMail' },
  { pattern: /mutt/i, name: 'Mutt' },
  { pattern: /alpine/i, name: 'Alpine' },
  { pattern: /sylpheed/i, name: 'Sylpheed' },
  { pattern: /mailmate/i, name: 'MailMate' },
  { pattern: /airmail/i, name: 'Airmail' },
  { pattern: /spark/i, name: 'Spark' },
  { pattern: /canary/i, name: 'Canary Mail' },
  { pattern: /newton/i, name: 'Newton Mail' },
  { pattern: /mailspring/i, name: 'Mailspring' },
  { pattern: /nylas/i, name: 'Nylas Mail' },
  { pattern: /geary/i, name: 'Geary' },
  { pattern: /trojita/i, name: 'Trojitá' },
  { pattern: /betterbird/i, name: 'Betterbird' },

  // Mobile clients
  { pattern: /k-?9/i, name: 'K-9 Mail' },
  { pattern: /fairemail/i, name: 'FairEmail' },
  { pattern: /aquamail/i, name: 'AquaMail' },
  { pattern: /bluemail/i, name: 'BlueMail' },
  { pattern: /nine/i, name: 'Nine' },
  { pattern: /protonmail/i, name: 'ProtonMail' },
  { pattern: /tutanota/i, name: 'Tutanota' },
  { pattern: /edison/i, name: 'Edison Mail' },

  // Webmail (when accessed via IMAP)
  { pattern: /roundcube/i, name: 'Roundcube' },
  { pattern: /rainloop/i, name: 'RainLoop' },
  { pattern: /horde/i, name: 'Horde' },
  { pattern: /squirrelmail/i, name: 'SquirrelMail' },
  { pattern: /zimbra/i, name: 'Zimbra' },

  // Libraries/automation
  { pattern: /imaplib/i, name: 'Python imaplib' },
  { pattern: /nodemailer/i, name: 'Nodemailer' },
  { pattern: /javamail/i, name: 'JavaMail' },
  { pattern: /mailcore/i, name: 'MailCore' },
  { pattern: /fetchmail/i, name: 'Fetchmail' },
  { pattern: /getmail/i, name: 'getmail' },
  { pattern: /offlineimap/i, name: 'OfflineIMAP' },
  { pattern: /isync|mbsync/i, name: 'isync/mbsync' },
  { pattern: /davmail/i, name: 'DavMail' },

  // Apple clients (macOS/iOS) - must be before generic calendar/contacts patterns
  { pattern: /macos/i, name: 'macOS' },
  { pattern: /ios\/\d/i, name: 'iOS' },
  { pattern: /dataaccessd/i, name: 'iOS Data Access' },
  { pattern: /calendaragent/i, name: 'Calendar Agent' },
  { pattern: /accountsd/i, name: 'macOS Accounts' },
  { pattern: /contactsd/i, name: 'macOS Contacts' },

  // CalDAV/CardDAV clients
  { pattern: /caldavsynchronizer/i, name: 'CalDAV Synchronizer' },
  { pattern: /caldav/i, name: 'CalDAV Client' },
  { pattern: /carddav/i, name: 'CardDAV Client' },
  { pattern: /davx5/i, name: 'DAVx5' },
  { pattern: /baikal/i, name: 'Baïkal' },
  { pattern: /busycal/i, name: 'BusyCal' },
  { pattern: /fantastical/i, name: 'Fantastical' },
  { pattern: /gnome.?calendar/i, name: 'GNOME Calendar' },
  { pattern: /contacts/i, name: 'Contacts' },
  { pattern: /addressbook/i, name: 'Address Book' },
  { pattern: /calendar/i, name: 'Calendar' },
  { pattern: /reminders/i, name: 'Reminders' }
];

// Browser patterns for detection
const BROWSER_PATTERNS = [
  { pattern: /edg(?:e|a|ios)?\/(\d+)/i, name: 'Edge', versionIndex: 1 },
  { pattern: /opr\/(\d+)/i, name: 'Opera', versionIndex: 1 },
  { pattern: /opera.*version\/(\d+)/i, name: 'Opera', versionIndex: 1 },
  { pattern: /vivaldi\/(\d+)/i, name: 'Vivaldi', versionIndex: 1 },
  { pattern: /brave\/(\d+)/i, name: 'Brave', versionIndex: 1 },
  { pattern: /firefox\/(\d+)/i, name: 'Firefox', versionIndex: 1 },
  { pattern: /fxios\/(\d+)/i, name: 'Firefox', versionIndex: 1 },
  {
    pattern: /safari\/(\d+)/i,
    name: 'Safari',
    versionIndex: 1,
    excludePattern: /chrome|chromium|crios|edg/i
  },
  {
    pattern: /chrome\/(\d+)/i,
    name: 'Chrome',
    versionIndex: 1,
    excludePattern: /edg|opr|brave|vivaldi/i
  },
  { pattern: /chromium\/(\d+)/i, name: 'Chromium', versionIndex: 1 },
  { pattern: /crios\/(\d+)/i, name: 'Chrome', versionIndex: 1 },
  { pattern: /msie\s(\d+)/i, name: 'Internet Explorer', versionIndex: 1 },
  { pattern: /trident.*rv:(\d+)/i, name: 'Internet Explorer', versionIndex: 1 },
  {
    pattern: /samsung.*browser\/(\d+)/i,
    name: 'Samsung Browser',
    versionIndex: 1
  },
  { pattern: /ucbrowser\/(\d+)/i, name: 'UC Browser', versionIndex: 1 },
  { pattern: /yabrowser\/(\d+)/i, name: 'Yandex Browser', versionIndex: 1 }
];

// OS patterns for detection - order matters for correct matching
const OS_PATTERNS = [
  { pattern: /windows nt 10\.0/i, name: 'Windows', version: '10/11' },
  { pattern: /windows nt 6\.3/i, name: 'Windows', version: '8.1' },
  { pattern: /windows nt 6\.2/i, name: 'Windows', version: '8' },
  { pattern: /windows nt 6\.1/i, name: 'Windows', version: '7' },
  { pattern: /windows nt 6\.0/i, name: 'Windows', version: 'Vista' },
  { pattern: /windows nt 5\.1/i, name: 'Windows', version: 'XP' },
  { pattern: /windows/i, name: 'Windows', version: '' },
  // iOS/iPadOS must come before macOS since they contain "Mac OS X" in UA
  { pattern: /iphone.*os (\d+)[._](\d+)/i, name: 'iOS', versionIndex: [1, 2] },
  { pattern: /iphone os (\d+)/i, name: 'iOS', versionIndex: 1 },
  { pattern: /ipad.*os (\d+)[._](\d+)/i, name: 'iPadOS', versionIndex: [1, 2] },
  { pattern: /ipad.*os (\d+)/i, name: 'iPadOS', versionIndex: 1 },
  { pattern: /mac os x (\d+)[._](\d+)/i, name: 'macOS', versionIndex: [1, 2] },
  { pattern: /macintosh|mac os/i, name: 'macOS', version: '' },
  { pattern: /android (\d+)/i, name: 'Android', versionIndex: 1 },
  { pattern: /android/i, name: 'Android', version: '' },
  { pattern: /linux/i, name: 'Linux', version: '' },
  { pattern: /ubuntu/i, name: 'Ubuntu', version: '' },
  { pattern: /fedora/i, name: 'Fedora', version: '' },
  { pattern: /debian/i, name: 'Debian', version: '' },
  { pattern: /centos/i, name: 'CentOS', version: '' },
  { pattern: /red hat/i, name: 'Red Hat', version: '' },
  { pattern: /freebsd/i, name: 'FreeBSD', version: '' },
  { pattern: /openbsd/i, name: 'OpenBSD', version: '' },
  { pattern: /chromeos/i, name: 'Chrome OS', version: '' },
  { pattern: /cros/i, name: 'Chrome OS', version: '' }
];

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
 * Parse user agent string to extract browser information
 * @param {string} ua - User agent string
 * @returns {Object} - { browser, browser_version }
 */
function parseBrowser(ua) {
  if (!isSANB(ua)) return { browser: 'Unknown', browser_version: '' };

  for (const {
    pattern,
    name,
    versionIndex,
    excludePattern
  } of BROWSER_PATTERNS) {
    if (excludePattern && excludePattern.test(ua)) continue;
    const match = ua.match(pattern);
    if (match) {
      return {
        browser: name,
        browser_version: match[versionIndex] || ''
      };
    }
  }

  return { browser: 'Unknown', browser_version: '' };
}

/**
 * Parse user agent string to extract OS information
 * @param {string} ua - User agent string
 * @returns {Object} - { os, os_version }
 */
function parseOS(ua) {
  if (!isSANB(ua)) return { os: 'Unknown', os_version: '' };

  for (const { pattern, name, version, versionIndex } of OS_PATTERNS) {
    const match = ua.match(pattern);
    if (match) {
      let osVersion = version || '';
      if (versionIndex) {
        osVersion = Array.isArray(versionIndex)
          ? versionIndex
              .map((i) => match[i])
              .filter(Boolean)
              .join('.')
          : match[versionIndex] || '';
      }

      return { os: name, os_version: osVersion };
    }
  }

  return { os: 'Unknown', os_version: '' };
}

/**
 * Parse user agent string to extract device type
 * @param {string} ua - User agent string
 * @returns {string} - 'desktop', 'mobile', 'tablet', or 'unknown'
 */
function parseDeviceType(ua) {
  if (!isSANB(ua)) return 'unknown';

  const lowerUA = ua.toLowerCase();

  // Check for tablets first (they often include mobile keywords)
  if (/ipad|tablet|playbook|silk|kindle|nexus\s*(?:7|9|10)/i.test(lowerUA)) {
    return 'tablet';
  }

  // Check for mobile devices
  if (
    /mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|opera mobi/i.test(
      lowerUA
    )
  ) {
    return 'mobile';
  }

  // Check for Android without mobile (likely tablet)
  if (/android/i.test(lowerUA) && !/mobile/i.test(lowerUA)) {
    return 'tablet';
  }

  // Default to desktop for everything else
  return 'desktop';
}

/**
 * Parse user agent string to extract email client
 * @param {string} ua - User agent string
 * @returns {string} - Client app name or 'Unknown'
 */
function parseEmailClient(ua) {
  if (!isSANB(ua)) return 'Unknown';

  for (const { pattern, name } of EMAIL_CLIENT_PATTERNS) {
    if (pattern.test(ua)) {
      return name;
    }
  }

  return 'Unknown';
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

    // Parse user agent
    const { browser, browser_version } = parseBrowser(ua);
    const { os, os_version } = parseOS(ua);
    const device_type = parseDeviceType(ua);
    const client_app = parseEmailClient(ua);

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
  parseIMAPClientId,
  categorizeReferrer,
  extractReferrerDomain,
  generateSessionHash,
  extractUTMParams,
  EMAIL_CLIENT_PATTERNS,
  BROWSER_PATTERNS,
  OS_PATTERNS,
  REFERRER_SOURCES
};
