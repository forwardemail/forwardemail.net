/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pMap = require('p-map');
const parseUserAgent = require('#helpers/parse-user-agent');

/**
 * Parse a user-agent string into a human-readable short description.
 * Uses ua-parser-js for detection (handles frozen iOS UA automatically)
 * and leverages Client Hints headers (when available) to resolve the real
 * OS version on Chromium browsers where the UA string is frozen at macOS 10.15.7.
 *
 * @param {string} ua - Raw user-agent string
 * @param {Object} [meta] - Session metadata containing client hints
 * @param {string} [meta.ch_platform] - Sec-CH-UA-Platform value (e.g. "macOS")
 * @param {string} [meta.ch_platform_version] - Sec-CH-UA-Platform-Version value (e.g. "15.5.0")
 * @returns {{ browser: string, os: string, short: string }}
 */
function parseUA(ua, meta = {}) {
  const parsed = parseUserAgent(ua, meta);
  return {
    browser:
      parsed.browser_label === 'Unknown'
        ? parsed.client_app_label
        : parsed.browser_label,
    os: parsed.os_label,
    short: parsed.short
  };
}

/**
 * List all active sessions for a user with metadata.
 *
 * @param {Object} ctx - Koa context (needs ctx.client for Redis, ctx.sessionId)
 * @param {Object} user - User document (needs user.sessions array)
 * @returns {Promise<Array>} Array of session objects
 */
async function listUserSessions(ctx, user) {
  if (
    !ctx.client ||
    !Array.isArray(user.sessions) ||
    user.sessions.length === 0
  )
    return [];

  const sessions = await pMap(
    user.sessions,
    async (id) => {
      try {
        const value = await ctx.client.get(`koa:sess:${id}`);
        if (!value) return null;

        const json = JSON.parse(value);
        // Only include sessions that belong to this user
        if (json?.passport?.user !== user.id) return null;
        // Exclude admin impersonation sessions
        if (json._admin_impersonation) return null;

        const meta = json._meta || {};
        const ua = parseUA(meta.ua, meta);

        return {
          id,
          is_current: id === ctx.sessionId,
          ip: meta.ip || 'Unknown',
          ua_raw: meta.ua || '',
          ua_short: ua.short,
          browser: ua.browser,
          os: ua.os,
          created_at: meta.created_at || null,
          last_active: meta.last_active || null
        };
      } catch {
        return null;
      }
    },
    { concurrency: 10 }
  );

  // Filter out null entries (expired/invalid sessions) and sort current first
  return sessions.filter(Boolean).sort((a, b) => {
    if (a.is_current) return -1;
    if (b.is_current) return 1;
    // Most recently active first
    return (b.last_active || '').localeCompare(a.last_active || '');
  });
}

// Export parseUA for testing
listUserSessions.parseUA = parseUA;
module.exports = listUserSessions;
