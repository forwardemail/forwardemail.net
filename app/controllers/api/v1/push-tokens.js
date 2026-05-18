/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');

const Aliases = require('#models/aliases');
const PushTokens = require('#models/push-tokens');
const isPrivateHost = require('#helpers/is-private-host');

const { PLATFORMS } = PushTokens;

//
// Input validation constants
//
const MAX_TOKEN_LENGTH = 4096;
const MAX_DEVICE_NAME_LENGTH = 255;
const MAX_TOKENS_PER_ALIAS = 15;
const TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

// APNs device tokens are 64-char hex (32 bytes) on modern iOS,
// but older devices may produce longer tokens.
const APNS_TOKEN_REGEX = /^[\da-f]{64,200}$/i;

// FCM tokens are opaque strings, typically ~150-250 chars
const FCM_TOKEN_MIN_LENGTH = 32;

// UnifiedPush endpoints must be valid HTTPS URLs
const UNIFIED_PUSH_URL_REGEX = /^https:\/\/.+/i;

/**
 * Validate a URL is safe for outbound requests (not SSRF).
 * Uses the shared isPrivateHost helper which covers:
 *   - All RFC 1918 private ranges (10.x, 172.16-31.x, 192.168.x)
 *   - Loopback (127.x), link-local (169.254.x), CGNAT (100.64-127.x)
 *   - IPv6 private (::1, fc00::/7, fe80::/10)
 *   - IPv4-mapped IPv6 (::ffff:127.0.0.1)
 *   - Multicast (224.0.0.0/4), reserved (240.0.0.0/4)
 *   - Cloud metadata hostnames (metadata, instance-data)
 *   - Reserved TLDs (localhost, local, internal, test) via config.testDomains
 *
 * @param {object} ctx - Koa context (for translateError)
 * @param {string} urlString - The URL to validate
 * @throws {Error} if the URL targets a private/reserved address
 */
function validateUrlNotPrivate(ctx, urlString) {
  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_INVALID_URL'));
  }

  if (parsed.protocol !== 'https:') {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_HTTPS_REQUIRED'));
  }

  // Use the shared isPrivateHost helper (covers all private/reserved ranges,
  // cloud metadata hostnames, and reserved TLDs)
  if (isPrivateHost(parsed.hostname)) {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_PRIVATE_URL'));
  }

  // Block URLs with credentials
  if (parsed.username || parsed.password) {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_URL_CREDENTIALS'));
  }

  // Block non-standard ports commonly used for internal services
  if (parsed.port && !['443', ''].includes(parsed.port)) {
    throw Boom.badRequest(
      ctx.translateError('PUSH_TOKEN_URL_NONSTANDARD_PORT')
    );
  }
}

/**
 * Validate the token value based on platform.
 * Throws Boom.badRequest on invalid input.
 */
function validateToken(ctx, platform, token) {
  if (!isSANB(token)) {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_REQUIRED'));
  }

  if (token.length > MAX_TOKEN_LENGTH) {
    throw Boom.badRequest(
      ctx.translateError('PUSH_TOKEN_MAX_LENGTH', MAX_TOKEN_LENGTH)
    );
  }

  switch (platform) {
    case 'apns': {
      if (!APNS_TOKEN_REGEX.test(token)) {
        throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_APNS_INVALID'));
      }

      break;
    }

    case 'fcm': {
      if (token.length < FCM_TOKEN_MIN_LENGTH) {
        throw Boom.badRequest(
          ctx.translateError('PUSH_TOKEN_FCM_TOO_SHORT', FCM_TOKEN_MIN_LENGTH)
        );
      }

      // FCM tokens should only contain URL-safe base64 chars and colons
      if (!/^[\w:_-]+$/i.test(token)) {
        throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_FCM_INVALID'));
      }

      break;
    }

    case 'unified-push': {
      if (!UNIFIED_PUSH_URL_REGEX.test(token)) {
        throw Boom.badRequest(
          ctx.translateError('PUSH_TOKEN_UNIFIED_PUSH_INVALID')
        );
      }

      // SSRF prevention: validate the endpoint doesn't target private IPs
      validateUrlNotPrivate(ctx, token);
      break;
    }

    case 'web-push': {
      // Web Push subscriptions are JSON-encoded PushSubscription objects
      let parsed;
      try {
        parsed = JSON.parse(token);
      } catch {
        throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_WEB_PUSH_JSON'));
      }

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_WEB_PUSH_OBJECT'));
      }

      if (!parsed.endpoint || typeof parsed.endpoint !== 'string') {
        throw Boom.badRequest(
          ctx.translateError('PUSH_TOKEN_WEB_PUSH_ENDPOINT')
        );
      }

      if (!parsed.keys || typeof parsed.keys !== 'object') {
        throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_WEB_PUSH_KEYS'));
      }

      // SSRF prevention on the endpoint URL
      validateUrlNotPrivate(ctx, parsed.endpoint);
      break;
    }

    default: {
      throw Boom.badRequest(
        ctx.translateError('PUSH_TOKEN_UNSUPPORTED_PLATFORM', platform)
      );
    }
  }
}

/**
 * Resolve the alias ID from the request context.
 *
 * Supports two authentication modes:
 *   1. Alias auth — alias credentials in Basic Auth
 *      After alias auth, ctx.state.user (and ctx.state.session.user)
 *      is the onAuth user object with alias_id, alias_name, etc.
 *   2. API token auth — requires alias_id in request body/query
 *      After API token auth, ctx.state.user is the User model.
 *      The alias_id MUST belong to the authenticated user.
 *
 * @returns {{ aliasId: string, userId: string }}
 */
async function resolveAliasAndUser(ctx, bodyAliasId) {
  if (!ctx.state.user) {
    throw Boom.unauthorized(ctx.translateError('PUSH_TOKEN_AUTH_REQUIRED'));
  }

  // Alias auth: the onAuth user object has alias_id set
  if (ctx.state.user.alias_id) {
    return {
      aliasId: ctx.state.user.alias_id,
      userId: ctx.state.user.alias_user_id || ctx.state.user.id
    };
  }

  // API token auth: user is a User model, alias_id must be in body/query
  if (!bodyAliasId) {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_ALIAS_ID_REQUIRED'));
  }

  if (!mongoose.isValidObjectId(bodyAliasId)) {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_ALIAS_ID_INVALID'));
  }

  // IDOR prevention: verify the alias belongs to the authenticated user
  const userId = (ctx.state.user._id || ctx.state.user.id).toString();
  const alias = await Aliases.findOne({
    _id: bodyAliasId,
    user: userId
  })
    .select('_id user')
    .lean()
    .exec();

  if (!alias) {
    throw Boom.notFound(ctx.translateError('PUSH_TOKEN_ALIAS_NOT_FOUND'));
  }

  return {
    aliasId: alias._id.toString(),
    userId
  };
}

/**
 * Transform a push token document for API response.
 */
function toJSON(doc) {
  return {
    id: (doc._id || doc.id).toString(),
    alias: doc.alias.toString(),
    platform: doc.platform,
    token: doc.token,
    device_name: doc.device_name || '',
    last_used_at: doc.last_used_at || null,
    failure_count: doc.failure_count || 0,
    expires_at: doc.expires_at,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    object: 'push_token'
  };
}

/**
 * POST /v1/push-tokens
 *
 * Register a new push token or update an existing one (upsert).
 * If a token with the same (alias, platform, token) already exists,
 * the existing record is refreshed (expiry extended, failure_count reset).
 */
async function create(ctx) {
  const { platform, token, device_name, alias_id } = ctx.request.body || {};

  // Validate platform
  if (!isSANB(platform) || !PLATFORMS.includes(platform)) {
    throw Boom.badRequest(
      ctx.translateError('PUSH_TOKEN_PLATFORM_REQUIRED', PLATFORMS.join(', '))
    );
  }

  // Validate token
  validateToken(ctx, platform, token);

  // Validate device_name: must be a string if provided
  if (device_name !== undefined && device_name !== null) {
    if (typeof device_name !== 'string') {
      throw Boom.badRequest(
        ctx.translateError('PUSH_TOKEN_DEVICE_NAME_INVALID')
      );
    }

    if (device_name.length > MAX_DEVICE_NAME_LENGTH) {
      throw Boom.badRequest(
        ctx.translateError(
          'PUSH_TOKEN_DEVICE_NAME_MAX_LENGTH',
          MAX_DEVICE_NAME_LENGTH
        )
      );
    }
  }

  const { aliasId, userId } = await resolveAliasAndUser(ctx, alias_id);

  const normalizedToken = platform === 'apns' ? token.toLowerCase() : token;

  // Check if this is an update to an existing token (not a new registration)
  const existingToken = await PushTokens.findOne({
    alias: aliasId,
    platform,
    token: normalizedToken
  })
    .select('_id')
    .lean()
    .exec();

  // Enforce per-alias token limit only for new registrations
  if (!existingToken) {
    const activeCount = await PushTokens.countDocuments({
      alias: aliasId,
      expires_at: { $gt: new Date() }
    }).exec();

    if (activeCount >= MAX_TOKENS_PER_ALIAS) {
      throw Boom.badRequest(
        ctx.translateError('PUSH_TOKEN_LIMIT_EXCEEDED', MAX_TOKENS_PER_ALIAS)
      );
    }
  }

  // Upsert: create or refresh the token
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  const doc = await PushTokens.findOneAndUpdate(
    {
      alias: aliasId,
      platform,
      token: normalizedToken
    },
    {
      $set: {
        user: userId,
        device_name: typeof device_name === 'string' ? device_name : '',
        failure_count: 0,
        expires_at: expiresAt
      },
      $setOnInsert: {
        alias: aliasId,
        platform,
        token: normalizedToken
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .lean()
    .exec();

  ctx.status = 201;
  ctx.body = toJSON(doc);
}

/**
 * GET /v1/push-tokens
 *
 * List all push tokens for the authenticated alias/user.
 * Supports optional ?platform= filter.
 */
async function list(ctx) {
  const { alias_id } = ctx.query || {};
  const { aliasId } = await resolveAliasAndUser(ctx, alias_id);

  const conditions = {
    alias: aliasId,
    expires_at: { $gt: new Date() }
  };

  // Optional platform filter — only allow known values
  if (ctx.query.platform && PLATFORMS.includes(ctx.query.platform)) {
    conditions.platform = ctx.query.platform;
  }

  // eslint-disable-next-line unicorn/no-array-callback-reference
  const tokens = await PushTokens.find(conditions)
    .sort({ created_at: -1 })
    .lean()
    .exec();

  ctx.body = tokens.map((t) => toJSON(t));
}

/**
 * DELETE /v1/push-tokens/:id
 *
 * Remove a specific push token by ID.
 * Only the owning alias can delete their own tokens.
 */
async function remove(ctx) {
  const { id } = ctx.params;

  if (!mongoose.isValidObjectId(id)) {
    throw Boom.badRequest(ctx.translateError('PUSH_TOKEN_INVALID_ID'));
  }

  const doc = await PushTokens.findById(id).lean().exec();

  if (!doc) {
    throw Boom.notFound(ctx.translateError('PUSH_TOKEN_NOT_FOUND'));
  }

  // Authorization: resolve the caller's alias and verify ownership
  const { alias_id } = ctx.request.body || ctx.query || {};
  const { aliasId } = await resolveAliasAndUser(ctx, alias_id);

  if (doc.alias.toString() !== aliasId.toString()) {
    throw Boom.forbidden(ctx.translateError('PUSH_TOKEN_FORBIDDEN'));
  }

  await PushTokens.deleteOne({ _id: id }).exec();

  ctx.status = 204;
  ctx.body = '';
}

/**
 * DELETE /v1/push-tokens
 *
 * Remove all push tokens for the authenticated alias.
 * Useful for logout/account-deletion flows.
 */
async function removeAll(ctx) {
  const { alias_id } = ctx.request.body || ctx.query || {};
  const { aliasId } = await resolveAliasAndUser(ctx, alias_id);

  const result = await PushTokens.deleteMany({ alias: aliasId }).exec();

  ctx.body = {
    deleted_count: result.deletedCount,
    object: 'push_token_deletion'
  };
}

module.exports = {
  create,
  list,
  remove,
  removeAll,
  // Exported for testing
  _test: { validateToken, resolveAliasAndUser, toJSON, validateUrlNotPrivate },
  MAX_TOKENS_PER_ALIAS
};
