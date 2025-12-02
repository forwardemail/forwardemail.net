/**
 * Session Touch Middleware
 *
 * This middleware "touches" the session on every authenticated request
 * to keep it alive and prevent automatic expiration for active users.
 *
 * Without this, sessions only reset TTL when modified, not when accessed.
 * This is especially important when not using rolling sessions.
 *
 * Usage:
 *   const sessionTouch = require('./helpers/session-touch');
 *   app.use(sessionTouch);
 */

const isBot = require('isbot');

async function sessionTouch(ctx, next) {
  // Skip for bots
  if (isBot(ctx.get('user-agent'))) {
    return next();
  }

  // Skip if no session
  if (!ctx.session || !ctx.state.user) {
    return next();
  }

  // Touch the session by setting a timestamp
  // This forces the session to be considered "modified"
  // and resets the TTL in Redis
  ctx.session._lastActivity = Date.now();

  return next();
}

module.exports = sessionTouch;
