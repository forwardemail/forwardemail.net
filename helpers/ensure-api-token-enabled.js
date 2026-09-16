/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const config = require('#config');
const phrases = require('#config/phrases');

/**
 * Reject an API-token authentication attempt when the token was explicitly
 * disabled by its owner. This deliberately runs after a token lookup so the
 * caller receives an actionable error instead of a generic invalid-token
 * response.
 *
 * @param   {object} user User found for an API token
 * @param   {object} [ctx] Koa context when available
 * @returns {object} The user when its API token remains enabled
 * @throws  {Error} Unauthorized API-token-disabled error
 */
function ensureApiTokenEnabled(user, ctx) {
  if (!user?.[config.userFields.apiTokenDisabled]) return user;

  const message =
    typeof ctx?.translateError === 'function'
      ? ctx.translateError('API_TOKEN_DISABLED')
      : phrases.API_TOKEN_DISABLED;
  const err = Boom.unauthorized(message);
  // WebSocket authentication uses `statusCode` directly instead of Koa's
  // Boom error serializer, so retain this status for that shared path too.
  err.statusCode = err.output.statusCode;
  throw err;
}

module.exports = ensureApiTokenEnabled;
