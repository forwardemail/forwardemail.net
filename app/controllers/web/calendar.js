/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const ICAL = require('ical.js');
const ms = require('ms');

const getGitHubReleases = require('#helpers/get-github-releases');
const getStatusIncidents = require('#helpers/get-status-incidents');
const getXPosts = require('#helpers/get-x-posts');
const logger = require('#helpers/logger');

// Cache for generated calendar
let calendarCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = ms('1m'); // Regenerate every minute as requested

/**
 * Re-fold an ICS string so that no content line exceeds 75 octets
 * (excluding the CRLF line ending).  The ical.js library has a bug
 * where multi-byte UTF-8 characters can push a folded line to 76
 * octets.  This function unfolds first, then re-folds correctly by
 * counting bytes (Buffer.byteLength) instead of characters.
 *
 * @param {string} ics - The raw ICS string produced by ical.js
 * @returns {string} - The re-folded ICS string
 */
function refoldICS(ics) {
  // 1. Split into CRLF-terminated raw lines
  const rawLines = ics.split('\r\n');

  // 2. Unfold: merge continuation lines (starting with SPACE or TAB)
  //    back into their parent logical line.
  const logical = [];
  for (const raw of rawLines) {
    if (raw.length > 0 && (raw[0] === ' ' || raw[0] === '\t')) {
      // Continuation – append without the leading whitespace
      if (logical.length > 0) {
        logical[logical.length - 1] += raw.slice(1);
      } else {
        logical.push(raw);
      }
    } else {
      logical.push(raw);
    }
  }

  // 3. Re-fold each logical line at 75 *octets*
  const folded = [];
  for (const line of logical) {
    const bytes = Buffer.byteLength(line, 'utf8');
    if (bytes <= 75) {
      folded.push(line);
      continue;
    }

    // Walk character-by-character, accumulating byte length
    let currentLine = '';
    let currentBytes = 0;
    for (const ch of line) {
      const chBytes = Buffer.byteLength(ch, 'utf8');

      // On continuation lines the leading SPACE counts toward the 75
      const limit = 75;

      if (currentBytes + chBytes > limit) {
        // Emit the current line
        folded.push(currentLine);
        // Start a new continuation line with leading SPACE
        currentLine = ' ' + ch;
        currentBytes = 1 + chBytes; // 1 for the SPACE
      } else {
        currentLine += ch;
        currentBytes += chBytes;
      }
    }

    // Emit the last segment
    if (currentLine.length > 0) {
      folded.push(currentLine);
    }
  }

  return folded.join('\r\n');
}

/**
 * Create a VEVENT component for an X post
 * @param {Object} post - Parsed X post object
 * @returns {ICAL.Component} - VEVENT component
 */
function createXPostEvent(post) {
  const vevent = new ICAL.Component('vevent');

  // Generate a unique UID based on tweet ID
  vevent.addPropertyWithValue('uid', `xpost-${post.id}@forwardemail.net`);

  // Set timestamps
  const dtstart = ICAL.Time.fromJSDate(new Date(post.createdAt), true);
  vevent.addPropertyWithValue(
    'dtstamp',
    ICAL.Time.fromJSDate(new Date(), true)
  );
  vevent.addPropertyWithValue('dtstart', dtstart);

  // X posts are point-in-time events, set duration to 0
  vevent.addPropertyWithValue('dtend', dtstart);

  // Set summary (title) - truncate if too long
  let summary = post.text.split('\n')[0];
  if (summary.length > 75) {
    summary = summary.slice(0, 72) + '...';
  }

  vevent.addPropertyWithValue('summary', `@fwdemail: ${summary}`);

  // Set description with full text and link
  let description = post.text;
  description += `\n\nView on X: ${post.link}`;
  if (post.media && post.media.length > 0) {
    description += `\n\nMedia: ${post.media.length} attachment(s)`;
  }

  vevent.addPropertyWithValue('description', description);

  // Set URL
  vevent.addPropertyWithValue('url', post.link);

  // Set categories
  vevent.addPropertyWithValue('categories', 'X Post,Social Media');

  // Set status
  vevent.addPropertyWithValue('status', 'CONFIRMED');

  return vevent;
}

/**
 * Create a VEVENT component for a status incident
 * @param {Object} incident - Parsed status incident object
 * @returns {ICAL.Component} - VEVENT component
 */
function createIncidentEvent(incident) {
  const vevent = new ICAL.Component('vevent');

  // Generate a unique UID based on incident ID
  vevent.addPropertyWithValue(
    'uid',
    `incident-${incident.id}@forwardemail.net`
  );

  // Set timestamps
  const dtstart = ICAL.Time.fromJSDate(new Date(incident.createdAt), true);
  vevent.addPropertyWithValue(
    'dtstamp',
    ICAL.Time.fromJSDate(new Date(), true)
  );
  vevent.addPropertyWithValue('dtstart', dtstart);

  // Set end time if resolved, otherwise use start time
  if (incident.closedAt) {
    const dtend = ICAL.Time.fromJSDate(new Date(incident.closedAt), true);
    vevent.addPropertyWithValue('dtend', dtend);
  } else {
    // Ongoing incident - set end to now
    vevent.addPropertyWithValue(
      'dtend',
      ICAL.Time.fromJSDate(new Date(), true)
    );
  }

  // Set summary with status prefix
  const statusPrefix = incident.status === 'resolved' ? '✓' : '🛑';
  vevent.addPropertyWithValue(
    'summary',
    `${statusPrefix} ${incident.serviceName}: ${incident.status}`
  );

  // Set description
  let description = incident.title;
  if (incident.body) {
    description += `\n\n${incident.body}`;
  }

  if (incident.duration) {
    const durationMins = Math.round(incident.duration / 60000);
    description += `\n\nDuration: ${durationMins} minutes`;
  }

  description += `\n\nView details: ${incident.url}`;
  vevent.addPropertyWithValue('description', description);

  // Set URL
  vevent.addPropertyWithValue('url', incident.url);

  // Set categories
  vevent.addPropertyWithValue('categories', 'Status Incident,Infrastructure');

  // Set status based on incident state
  vevent.addPropertyWithValue(
    'status',
    incident.status === 'resolved' ? 'CONFIRMED' : 'TENTATIVE'
  );

  // Set color/priority for ongoing incidents
  if (incident.status !== 'resolved') {
    vevent.addPropertyWithValue('priority', '1');
  }

  return vevent;
}

/**
 * Create a VEVENT component for a GitHub release
 * @param {Object} release - Parsed GitHub release object
 * @returns {ICAL.Component} - VEVENT component
 */
function createReleaseEvent(release) {
  const vevent = new ICAL.Component('vevent');

  // Generate a unique UID based on release ID
  vevent.addPropertyWithValue('uid', `release-${release.id}@forwardemail.net`);

  // Set timestamps
  const releaseDate = new Date(release.publishedAt || release.createdAt);
  const dtstart = ICAL.Time.fromJSDate(releaseDate, true);
  vevent.addPropertyWithValue(
    'dtstamp',
    ICAL.Time.fromJSDate(new Date(), true)
  );
  vevent.addPropertyWithValue('dtstart', dtstart);

  // Releases are point-in-time events
  vevent.addPropertyWithValue('dtend', dtstart);

  // Set summary (title)
  const prereleasePrefix = release.prerelease ? '[Pre-release] ' : '';
  const title = release.name || `Release ${release.tagName}`;
  vevent.addPropertyWithValue('summary', `${prereleasePrefix}${title}`);

  // Set description with release notes
  let description = `Version: ${release.tagName}\n\n`;
  if (release.body) {
    description += release.body;
  }

  description += `\n\nView release: ${release.htmlUrl}`;
  description += `\nDownload: ${release.zipballUrl}`;

  vevent.addPropertyWithValue('description', description);

  // Set URL
  vevent.addPropertyWithValue('url', release.htmlUrl);

  // Set categories
  const categories = release.prerelease
    ? 'GitHub Release,Pre-release,Software Update'
    : 'GitHub Release,Software Update';
  vevent.addPropertyWithValue('categories', categories);

  // Set status
  vevent.addPropertyWithValue('status', 'CONFIRMED');

  return vevent;
}

/**
 * Generate the combined calendar with X posts, status incidents, and GitHub releases
 * @param {Object} client - Redis client for caching (optional)
 * @returns {Promise<string>} - ICS calendar string
 */
async function generateCalendar(client) {
  // Create the root VCALENDAR component
  const vcalendar = new ICAL.Component('vcalendar');

  // Set calendar properties
  vcalendar.addPropertyWithValue('version', '2.0');
  vcalendar.addPropertyWithValue('prodid', '-//Forward Email//Calendar//EN');
  vcalendar.addPropertyWithValue('calscale', 'GREGORIAN');
  vcalendar.addPropertyWithValue('method', 'PUBLISH');
  vcalendar.addPropertyWithValue('x-wr-calname', 'Forward Email Updates');
  vcalendar.addPropertyWithValue(
    'x-wr-caldesc',
    'X posts, status incidents, and releases from Forward Email'
  );

  // Fetch X posts, status incidents, and GitHub releases in parallel
  // Pass Redis client for caching
  const [xPosts, incidents, releases] = await Promise.all([
    getXPosts({ client, count: 50 }).catch((err) => {
      logger.error(err, { extra: { message: 'Failed to fetch X posts' } });
      return [];
    }),
    getStatusIncidents({ client, count: 100 }).catch((err) => {
      logger.error(err, { extra: { message: 'Failed to fetch incidents' } });
      return [];
    }),
    getGitHubReleases({ client, count: 50 }).catch((err) => {
      logger.error(err, {
        extra: { message: 'Failed to fetch GitHub releases' }
      });
      return [];
    })
  ]);

  // Add X posts as events
  for (const post of xPosts) {
    try {
      const vevent = createXPostEvent(post);
      vcalendar.addSubcomponent(vevent);
    } catch (err) {
      logger.error(err, {
        extra: { message: 'Failed to create X post event', postId: post.id }
      });
    }
  }

  // Add status incidents as events
  for (const incident of incidents) {
    try {
      const vevent = createIncidentEvent(incident);
      vcalendar.addSubcomponent(vevent);
    } catch (err) {
      logger.error(err, {
        extra: {
          message: 'Failed to create incident event',
          incidentId: incident.id
        }
      });
    }
  }

  // Add GitHub releases as events
  for (const release of releases) {
    try {
      const vevent = createReleaseEvent(release);
      vcalendar.addSubcomponent(vevent);
    } catch (err) {
      logger.error(err, {
        extra: {
          message: 'Failed to create release event',
          releaseId: release.id
        }
      });
    }
  }

  // Get the raw ICS output from ical.js
  let icsOutput = vcalendar.toString();

  // Inject REFRESH-INTERVAL and X-PUBLISHED-TTL right after METHOD:PUBLISH
  // These are required for Apple Calendar and Outlook subscription refresh.
  // REFRESH-INTERVAL is the RFC 7986 standard property.
  // X-PUBLISHED-TTL is the legacy property for older clients.
  // ical.js does not support these properties natively, so we inject them.
  icsOutput = icsOutput.replace(
    'METHOD:PUBLISH\r\n',
    'METHOD:PUBLISH\r\nREFRESH-INTERVAL;VALUE=DURATION:PT1H\r\nX-PUBLISHED-TTL:PT1H\r\n'
  );

  // Re-fold the entire ICS output to fix ical.js multi-byte folding bug.
  // ical.js folds at 75 characters but RFC 5545 requires 75 *octets*.
  // Multi-byte UTF-8 characters (emoji, CJK, etc.) cause lines to exceed
  // the 75-octet limit.  Apple Calendar is strict about this.
  icsOutput = refoldICS(icsOutput);

  // Ensure the file ends with a CRLF
  if (!icsOutput.endsWith('\r\n')) {
    icsOutput += '\r\n';
  }

  return icsOutput;
}

/**
 * Refresh calendar if cache is stale
 * @param {Object} client - Redis client for caching (optional)
 * @returns {Promise<string>} - ICS calendar string
 */
async function getCalendar(client) {
  const now = Date.now();
  if (calendarCache && now - cacheTimestamp < CACHE_DURATION) {
    return calendarCache;
  }

  const calendar = await generateCalendar(client);
  calendarCache = calendar;
  cacheTimestamp = now;
  return calendar;
}

/**
 * Express/Koa middleware to serve the calendar.ics file
 */
async function calendar(ctx) {
  try {
    // Pass Redis client for caching
    const icsContent = await getCalendar(ctx.client);

    ctx.type = 'text/calendar; charset=utf-8';
    ctx.set('Content-Disposition', 'attachment; filename="calendar.ics"');
    ctx.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    ctx.body = icsContent;
  } catch (err) {
    logger.error(err, { extra: { message: 'Failed to generate calendar' } });
    ctx.throw(500, 'Failed to generate calendar');
  }
}

module.exports = calendar;
module.exports.generateCalendar = generateCalendar;
module.exports.getCalendar = getCalendar;
