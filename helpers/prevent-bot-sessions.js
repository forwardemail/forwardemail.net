/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isbot = require('isbot');

/**
 * Prevent Bot Sessions Middleware
 *
 * This middleware wraps ctx.session with a Proxy that prevents
 * any properties from being set for bot requests. This ensures
 * that even if code throughout the application tries to set
 * session properties for bots, they will be silently ignored.
 *
 * This is more robust than just setting ctx.sessionSave = false
 * because it prevents the session object from being modified at all.
 *
 * Usage:
 *   const preventBotSessions = require('./helpers/prevent-bot-sessions');
 *   app.use(preventBotSessions);
 */

function preventBotSessions(ctx, next) {
  // Check if this is a bot
  const isBot = isbot(ctx.get('User-Agent'));

  if (isBot) {
    // Prevent session from being saved
    ctx.sessionSave = false;

    // Wrap ctx.session with a Proxy that ignores all writes
    // This prevents any middleware from modifying the session
    const originalSessionGetter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(ctx),
      'session'
    )?.get;

    if (originalSessionGetter) {
      Object.defineProperty(ctx, 'session', {
        get() {
          const session = originalSessionGetter.call(this);

          // Return a Proxy that ignores all writes
          return new Proxy(session || {}, {
            set(_target, _property, _value) {
              // Silently ignore writes for bots
              return true;
            },
            deleteProperty(_target, _property) {
              // Silently ignore deletes for bots
              return true;
            },
            get(target, property) {
              // Allow reads
              return target[property];
            }
          });
        },
        set(_value) {
          // Ignore session assignment for bots
        }
      });
    }
  }

  return next();
}

module.exports = preventBotSessions;
