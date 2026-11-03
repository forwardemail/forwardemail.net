/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A session signed in with Google or GitHub ends once the user revokes this
// application's access at the provider.
//
// Neither provider tells us about a revocation, so a session started by
// either one remembers which provider and account it came from, and every
// few minutes asks the provider whether that grant is still alive (a refresh
// token exchange for Google, the user endpoint for GitHub). When the answer
// is that it was revoked, the tokens are cleared and every session the user
// signed in to with that provider ends.
//
// Only a grant this server saw alive and then refused is taken for a
// revocation: a token that was already refused when first checked (a Google
// refresh token that expired unused, while Google signs the user in with the
// consent given before) ends nothing, nor does a failed or unclear check (a
// network error, an outage at the provider), nor a session whose account was
// since disconnected or linked to another account at the provider (those
// sessions are no longer checked, as before).
//
// Sessions signed in with a password or a passkey are not affected. It is
// off on self-hosted installs unless AUTH_OAUTH_REVOCATION_CHECK=true, as
// their OAuth apps may be in Google's "Testing" status, whose refresh tokens
// expire after 7 days.
//

const crypto = require('node:crypto');

const undici = require('undici');
const { boolean } = require('boolean');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const readLimitedBody = require('#helpers/read-limited-body');
const Users = require('#models/users');

const PROVIDERS = new Set(['google', 'github']);

const DEFAULT_URLS = {
  google: 'https://oauth2.googleapis.com/token',
  github: 'https://api.github.com/user'
};

// how long the provider's answer is trusted for
const CHECK_INTERVAL = ms('5m');
// how soon a check that failed is tried again
const RETRY_INTERVAL = ms('1m');
// how long a token refused before it was ever seen alive is left alone (it
// stays refused; a sign in checks again)
const STALE_INTERVAL = ms('1d');
const REQUEST_TIMEOUT = ms('10s');
// how long a grant seen alive is remembered (longer than a session lasts,
// 30 days, and renewed at every check)
const SEEN_TTL = ms('60d');

function isEnabled() {
  // (@ladjs/env parses "true" and "false" into booleans, "1" into a number)
  const value = env.AUTH_OAUTH_REVOCATION_CHECK;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number' || isSANB(value)) return boolean(value);
  return !config.isSelfHosted;
}

function getSeenKey(provider, user) {
  return `oauth_grant_seen:${provider}:${user.id}`;
}

// (a hash, so the token itself is not kept in Redis)
function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

async function rememberSeen(ctx, provider, user, token) {
  try {
    await ctx.client.set(
      getSeenKey(provider, user),
      hashToken(token),
      'PX',
      SEEN_TTL
    );
  } catch (err) {
    ctx.logger.fatal(err);
  }
}

async function wasSeen(ctx, provider, user, token) {
  try {
    return (
      (await ctx.client.get(getSeenKey(provider, user))) === hashToken(token)
    );
  } catch (err) {
    ctx.logger.fatal(err);
    return false;
  }
}

// (the token whose loss means the grant is gone)
function getTokenField(provider) {
  return provider === 'google'
    ? config.passport.fields.googleRefreshToken
    : config.passport.fields.githubAccessToken;
}

function getProfileIdField(provider) {
  return config.passport.fields[`${provider}ProfileID`];
}

function getCacheKey(provider, user) {
  return `oauth_grant:${provider}:${user.id}`;
}

//
// Called once a sign in with a provider succeeded.
//
async function markOAuthSession(ctx, provider) {
  if (
    !isEnabled() ||
    !PROVIDERS.has(provider) ||
    !ctx.session ||
    !ctx.isAuthenticated()
  )
    return;
  // (the signed in user object leaves out the provider fields)
  const field = getProfileIdField(provider);
  const tokenField = getTokenField(provider);
  const user = await Users.findOne({ id: ctx.state.user.id })
    .select(`id ${field} ${tokenField}`)
    .lean();
  const profileId = user?.[field];
  if (!isSANB(profileId)) return;
  ctx.session.oauth = { provider, profile_id: profileId };

  // (the grant may be new: the next request asks the provider about it)
  if (ctx.client)
    await ctx.client
      .del(getCacheKey(provider, user))
      .catch((err) => ctx.logger.fatal(err));

  // (the grant this sign in replaced was revoked: the sessions it signed in
  // end now, before they could be checked with the new grant)
  const replaced = replacedGrants.get(ctx.state.user);
  if (
    !replaced ||
    replaced.provider !== provider ||
    !isSANB(user[tokenField]) ||
    !ctx.client
  )
    return;

  // (whether the token it replaced was seen alive, before this sign in)
  const replacedWasSeen =
    isSANB(replaced.token) &&
    replaced.profileId === profileId &&
    replaced.token !== user[tokenField] &&
    (await wasSeen(ctx, provider, user, replaced.token));

  // (a token issued at this sign in is alive)
  if (replaced.issued === user[tokenField])
    await rememberSeen(ctx, provider, user, user[tokenField]);

  if (!replacedWasSeen) return;

  // (in the background, so signing in does not wait for the provider)
  (async () => {
    const state = await checkGrant(ctx.passport, provider, {
      ...user,
      [tokenField]: replaced.token
    });
    if (state !== 'revoked') return;
    ctx.logger.warn('OAuth access was revoked, ending its sessions', {
      provider,
      user_id: user.id
    });
    await endOAuthSessions(ctx, user, provider, {
      profileId,
      clearTokens: false
    });
  })().catch((err) => ctx.logger.fatal(err));
}

async function readJson(body) {
  try {
    return JSON.parse(await readLimitedBody(body, { limit: 64 * 1024 }));
  } catch {
    return null;
  }
}

//
// Resolves to "active", "revoked" or "unknown".
//
async function checkGrant(passport, provider, user) {
  const options = passport?.config?.strategies?.[provider] || {};
  const token = user[getTokenField(provider)];
  if (!isSANB(token)) return 'revoked';

  try {
    if (provider === 'google') {
      const { statusCode, body } = await undici.request(
        options.tokenURL || DEFAULT_URLS.google,
        {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: options.clientID || '',
            client_secret: options.clientSecret || '',
            grant_type: 'refresh_token',
            refresh_token: token
          }).toString(),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT)
        }
      );
      const json = await readJson(body);
      if (statusCode === 200 && isSANB(json?.access_token)) return 'active';
      // (the refresh token was revoked, or expired)
      if (
        (statusCode === 400 || statusCode === 401) &&
        json?.error === 'invalid_grant'
      )
        return 'revoked';
      return 'unknown';
    }

    const { statusCode, body } = await undici.request(
      options.userProfileURL || DEFAULT_URLS.github,
      {
        method: 'GET',
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${token}`,
          'user-agent': 'forwardemail.net'
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT)
      }
    );
    const json = await readJson(body);
    if (statusCode === 401) return 'revoked';
    if (statusCode === 200 && json && json.id !== undefined) {
      // (a token for some other GitHub account)
      return String(json.id) === String(user[getProfileIdField(provider)])
        ? 'active'
        : 'revoked';
    }

    return 'unknown';
  } catch (err) {
    logger.warn(err, { provider, user_id: user.id });
    return 'unknown';
  }
}

//
// Ends every session of the user that was signed in with the provider
// account, other than the current one (which the caller signs out, or keeps
// when it was just signed in with a new grant).
//
async function endOAuthSessions(
  ctx,
  user,
  provider,
  { profileId, clearTokens, token }
) {
  const { sessions } =
    (await Users.findOne({ id: user.id }).select('sessions').lean()) || {};
  const ended = [];
  const ids = (Array.isArray(sessions) ? sessions : []).filter(
    (id) => isSANB(id) && id !== ctx.sessionId
  );
  // (read in one round trip)
  let values = [];
  // (whether every session was read, and every one to end ended)
  let isComplete = true;
  try {
    if (ids.length > 0)
      values = await ctx.client.mget(ids.map((id) => `koa:sess:${id}`));
  } catch (err) {
    isComplete = false;
    ctx.logger.fatal(err);
  }

  const toDelete = [];
  for (const [i, id] of ids.entries()) {
    const value = values[i];
    if (value === undefined) continue;
    if (value === null) {
      ended.push(id);
      continue;
    }

    try {
      const session = JSON.parse(value);
      if (
        session?.oauth?.provider === provider &&
        session.oauth.profile_id === profileId
      ) {
        toDelete.push(`koa:sess:${id}`);
        ended.push(id);
      }
    } catch (err) {
      // (a session that cannot be read is not one that signs in)
      ctx.logger.fatal(err);
    }
  }

  if (toDelete.length > 0) {
    try {
      await ctx.client.del(...toDelete);
    } catch (err) {
      isComplete = false;
      ctx.logger.fatal(err);
      // (those that were not deleted stay listed)
      for (const key of toDelete) {
        const index = ended.indexOf(key.slice('koa:sess:'.length));
        if (index !== -1) ended.splice(index, 1);
      }
    }
  }

  if (clearTokens && ctx.sessionId) ended.push(ctx.sessionId);
  await Users.updateOne({ id: user.id }, { $pullAll: { sessions: ended } });

  //
  // (the dead tokens are cleared, the account stays linked: signing in with
  // the provider again asks for consent and stores new ones) (only while the
  // revoked token is still the stored one: a sign in meanwhile stored a new
  // one, which is kept) (and only when every session was ended: one that
  // was not is checked again with the token, and ended then)
  //
  if (clearTokens && isComplete && isSANB(token))
    await Users.updateOne(
      { id: user.id, [getTokenField(provider)]: token },
      {
        $unset: {
          [config.passport.fields[`${provider}AccessToken`]]: 1,
          [config.passport.fields[`${provider}RefreshToken`]]: 1
        }
      }
    );
}

//
// The token a sign in replaced, by the signed in user object it returned
// (see `rememberReplacedGrants`).
//
const replacedGrants = new WeakMap();
const kPatched = Symbol('rememberReplacedGrants');

//
// A sign in with the provider stores a new token over the one before. When
// access was revoked and the user signed in again before any of the old
// sessions made a request, those sessions would only ever be checked with
// the new token, so the one it replaces is kept to be checked at sign in.
//
function rememberReplacedGrants(passport) {
  if (
    !passport ||
    typeof passport.updateAndSaveUser !== 'function' ||
    passport.updateAndSaveUser[kPatched]
  )
    return;

  const updateAndSaveUser = passport.updateAndSaveUser.bind(passport);

  // (the arguments of updateAndSaveUser in @ladjs/passport: the provider
  // first, the user sixth and the callback last)
  const wrapped = (...args) => {
    const [provider] = args;
    const user = args[5];
    const done = args[7];
    const previous =
      PROVIDERS.has(provider) && user ? user[getTokenField(provider)] : null;
    const profileId = user ? user[getProfileIdField(provider)] : null;
    // (the token the provider gave at this sign in, if any: the refresh
    // token for Google, the access token for GitHub)
    const issued = provider === 'google' ? args[2] : args[1];
    return updateAndSaveUser(...args.slice(0, 7), (err, result, ...rest) => {
      if (
        !err &&
        result &&
        typeof result === 'object' &&
        PROVIDERS.has(provider)
      )
        replacedGrants.set(result, {
          provider,
          profileId,
          token: isSANB(previous) ? previous : null,
          issued: isSANB(issued) ? issued : null
        });
      done(err, result, ...rest);
    });
  };

  wrapped[kPatched] = true;
  passport.updateAndSaveUser = wrapped;
}

//
// Asks the provider whether the grant is alive and keeps the answer:
// "active" (seen alive), "stale" (refused, but never seen alive: an expired
// token, not a revocation), "unknown" (no answer, tried again shortly) or
// "revoked:<token hash>" (seen alive, now refused).
//
function checkInBackground(ctx, provider, user, token) {
  const key = getCacheKey(provider, user);
  (async () => {
    let state = await checkGrant(ctx.passport, provider, user);

    //
    // (a sign in stored another token while the provider was asked: the
    // answer is about the old one and is dropped; the sign in cleared the
    // answer kept before, so the new token is asked about next, and what is
    // kept now is left as it is)
    //
    const current = await Users.findOne({ id: user.id })
      .select(getTokenField(provider))
      .lean();
    if (current?.[getTokenField(provider)] !== token) return;

    if (state === 'active') await rememberSeen(ctx, provider, user, token);
    else if (state === 'revoked')
      state = (await wasSeen(ctx, provider, user, token))
        ? `revoked:${hashToken(token)}`
        : 'stale';
    await ctx.client.set(
      key,
      state,
      'PX',
      state === 'unknown'
        ? RETRY_INTERVAL
        : state === 'stale'
        ? STALE_INTERVAL
        : CHECK_INTERVAL
    );
  })().catch((err) => ctx.logger.fatal(err));
}

async function checkOAuthSession(ctx, next) {
  const marker = ctx.session?.oauth;
  if (
    !isEnabled() ||
    !marker ||
    typeof marker !== 'object' ||
    !ctx.isAuthenticated() ||
    ctx.session._admin_impersonation
  )
    return next();

  const { provider } = marker;
  const { user } = ctx.state;
  if (!PROVIDERS.has(provider)) {
    delete ctx.session.oauth;
    return next();
  }

  //
  // (the provider was disconnected here, or the account is now linked to
  // another account at the provider: there is nothing to check this session
  // with, and it carries on as before; a revocation seen by another session
  // already ended this one) (and a GitHub token that expires, from a GitHub
  // App with expiring tokens, cannot tell an expiry from a revocation)
  //
  const token = user[getTokenField(provider)];
  if (
    user[getProfileIdField(provider)] !== marker.profile_id ||
    !isSANB(token) ||
    (provider === 'github' &&
      isSANB(user[config.passport.fields.githubRefreshToken]))
  ) {
    delete ctx.session.oauth;
    return next();
  }

  //
  // The provider is asked in the background, so no request waits for it:
  // the answer is kept in Redis, and a revocation is acted on at the next
  // request of any of the sessions.
  //
  let revoked = false;
  if (ctx.client) {
    const key = getCacheKey(provider, user);
    let state = null;
    try {
      state = await ctx.client.get(key);
      if (!state) {
        // (one request asks the provider, the others carry on meanwhile)
        const claimed = await ctx.client.set(
          key,
          'checking',
          'PX',
          REQUEST_TIMEOUT + ms('5s'),
          'NX'
        );
        if (claimed) checkInBackground(ctx, provider, user, token);
      }
    } catch (err) {
      ctx.logger.fatal(err);
    }

    revoked =
      typeof state === 'string' &&
      state.startsWith('revoked:') &&
      state === `revoked:${hashToken(token)}`;
  }

  if (!revoked) return next();

  ctx.logger.warn('OAuth access was revoked, ending its sessions', {
    provider,
    user_id: user.id
  });

  try {
    await endOAuthSessions(ctx, user, provider, {
      profileId: marker.profile_id,
      clearTokens: true,
      token
    });
  } catch (err) {
    ctx.logger.fatal(err);
  }

  // (a new, signed out session: protected pages ask to sign in again)
  ctx.logout();
  delete ctx.session.oauth;
  if (typeof ctx.regenerateSession === 'function') {
    await ctx.regenerateSession();
  }

  return next();
}

module.exports = {
  CHECK_INTERVAL,
  PROVIDERS,
  checkGrant,
  checkOAuthSession,
  markOAuthSession,
  rememberReplacedGrants
};
