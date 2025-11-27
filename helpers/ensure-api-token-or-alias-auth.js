/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const basicAuth = require('basic-auth');

const policies = require('#helpers/policies');
const aliasAuth = require('#controllers/api/v1/alias-auth');

/**
 * Dual authentication middleware that supports both API token and alias credentials
 * - If password is empty/not provided: treats username as API token
 * - If password is provided: treats username as alias email and validates with alias password
 *
 * @param {Object} ctx - Koa context
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
async function ensureApiTokenOrAliasAuth(ctx, next) {
  const creds = basicAuth(ctx.req);

  if (!creds || !creds.name) {
    return ctx.throw(
      Boom.unauthorized(
        ctx.translate
          ? ctx.translate('AUTHENTICATION_REQUIRED')
          : 'Authentication required. Use either API token or alias credentials.'
      )
    );
  }

  // If password is empty/not provided, treat as API token
  // (this maintains backward compatibility with existing API token auth)
  if (!creds.pass || creds.pass === '') {
    ctx.logger.debug('Using API token authentication');
    return policies.ensureApiToken(ctx, next);
  }

  // If password is provided, treat as alias credentials
  // (username should be in alias@domain.com format)
  ctx.logger.debug('Using alias authentication', {
    username: creds.name
  });
  return aliasAuth(ctx, next);
}

module.exports = ensureApiTokenOrAliasAuth;
