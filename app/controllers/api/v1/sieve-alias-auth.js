/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');

/**
 * Middleware to load alias and domain from session for alias-auth Sieve routes
 * This allows Sieve routes to work with both:
 * 1. API token auth (uses retrieveDomain + retrieveAlias middleware)
 * 2. Alias auth (uses aliasAuth + this middleware)
 *
 * Sets ctx.state.alias and ctx.state.domain from ctx.state.session.user
 */
async function sieveAliasAuth(ctx, next) {
  // Check if we already have alias from retrieveAlias middleware (API token auth)
  if (ctx.state.alias) {
    return next();
  }

  // Get alias info from session (set by aliasAuth -> setupAuthSession)
  const { session } = ctx.state;

  if (!session?.user?.alias_id) {
    throw Boom.unauthorized(ctx.translateError('AUTHENTICATION_REQUIRED'));
  }

  // Load alias and domain in parallel
  const [alias, domain] = await Promise.all([
    Aliases.findById(session.user.alias_id)
      .populate('user', 'id email')
      .populate('domain', 'id name')
      .lean()
      .exec(),
    Domains.findById(session.user.domain_id).lean().exec()
  ]);

  if (!alias) {
    throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));
  }

  if (!domain) {
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
  }

  // Set state for Sieve controller
  ctx.state.alias = alias;
  ctx.state.domain = domain;

  // Set user from populated alias.user for Sieve controller (needed for getUserDomains)
  ctx.state.user = alias.user;

  // Set alias.group for permission checks (alias auth means user owns the alias)
  ctx.state.alias.group = 'admin';

  return next();
}

module.exports = sieveAliasAuth;
