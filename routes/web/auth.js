/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const process = require('node:process');
const querystring = require('node:querystring');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const base64url = require('base64url');
const isSANB = require('is-string-and-not-blank');
const {
  SessionChallengeStore
} = require('@forwardemail/passport-fido2-webauthn');

const config = require('#config');
const completeWebauthnAuthentication = require('#helpers/complete-webauthn-authentication');
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const invalidateOtherSessions = require('#helpers/invalidate-other-sessions');
const clearUnverifiedSignIns = require('#helpers/clear-unverified-sign-ins');
const logger = require('#helpers/logger');
const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const rateLimit = require('#helpers/rate-limit');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');
const { UBUNTU_CLAIMED_ID } = require('#helpers/passport-verified-email');
const web = require('#controllers/web');
const { Domains, Users } = require('#models');

const store = new SessionChallengeStore();

const storeChallenge = promisify(store.challenge).bind(store);

const router = new Router({ prefix: '/auth' });

//
// Ubuntu SSO only ever talks to Ubuntu One.
//
// passport-openid takes the OpenID provider from the request: an
// `openid_identifier` starts discovery at any URL, and an assertion names
// its own `claimed_id` and `op_endpoint`, which the server then fetches and
// asks to confirm the assertion (with `request`, outside every SSRF check).
// So anyone could make the server fetch any URL, and run a provider of
// their own that asserts any email address and signs in to that account.
//
// Initiation therefore never takes an identifier (it always starts at
// login.ubuntu.com), and a callback must name Ubuntu One as its provider,
// with an Ubuntu One identity, before passport sees it.
//
const UBUNTU_NS = 'http://specs.openid.net/auth/2.0';
const UBUNTU_OP_ENDPOINT = 'https://login.ubuntu.com/+openid';
// (a field name no request can have, so passport-openid never reads one)
const NO_IDENTIFIER_FIELD = Symbol('no OpenID identifier');

function pinUbuntuProvider(ctx, next) {
  if (
    isSANB(ctx.params.provider) &&
    ctx.params.provider.toLowerCase() !== 'ubuntu'
  )
    return next();

  const invalid = () => Boom.badRequest(ctx.translateError('INVALID_PROVIDER'));

  // (passport-ubuntu adds a POST body to the URL, so the URL of a POST must
  //  not carry parameters of its own)
  if (ctx.method === 'POST' && ctx.querystring) throw invalid();

  // (passport-openid reads an identifier from the body first, whatever the
  //  method, then from the query; and from now on reads none at all)
  const body =
    ctx.request.body && typeof ctx.request.body === 'object'
      ? ctx.request.body
      : {};
  const query = ctx.query || {};
  if (Object.hasOwn(body, 'openid_identifier')) throw invalid();
  if (Object.hasOwn(query, 'openid_identifier')) throw invalid();
  const strategy = ctx.passport?._strategy?.('ubuntu');
  if (strategy) strategy._identifierField = NO_IDENTIFIER_FIELD;

  const isCallback = ctx.path.endsWith('/ok');
  if (!isCallback) {
    // (nothing from the request is used to start signing in)
    if (
      [...Object.keys(body), ...Object.keys(query)].some((key) =>
        key.startsWith('openid')
      )
    )
      throw invalid();
    return next();
  }

  const params = ctx.method === 'POST' ? body : query;
  const keys = Object.keys(params);

  const mode = params['openid.mode'];
  if (mode === undefined || mode === 'cancel') return next();

  for (const key of keys) {
    if (key.startsWith('openid') && typeof params[key] !== 'string')
      throw invalid();
  }

  const claimedId = params['openid.claimed_id'];
  const returnTo = params['openid.return_to'];
  if (
    params['openid.ns'] !== UBUNTU_NS ||
    params['openid.op_endpoint'] !== UBUNTU_OP_ENDPOINT ||
    typeof claimedId !== 'string' ||
    !UBUNTU_CLAIMED_ID.test(claimedId) ||
    params['openid.identity'] !== claimedId ||
    typeof returnTo !== 'string' ||
    (isSANB(process.env.UBUNTU_CALLBACK_URL) &&
      !returnTo.startsWith(process.env.UBUNTU_CALLBACK_URL))
  )
    throw invalid();

  return next();
}

function callbackCheck(ctx, next) {
  if (
    ctx.params.provider === 'webauthn' &&
    ctx.method === 'POST' &&
    ctx.passport &&
    ctx.passport.authenticate
  ) {
    return ctx.passport.authenticate(
      'webauthn',
      {
        ...config.passportCallbackOptions,
        failureFlash: false,
        failureRedirect: false,
        successReturnToOrRedirect: false
      },
      async (err, user) => {
        if (err) throw err;
        await completeWebauthnAuthentication(ctx, user);
        // A custom Passport callback must resume Koa's route middleware.
        // Otherwise callbackRedirect is never reached and Koa returns 404
        // despite the session having been successfully authenticated.
        return next();
      }
    )(ctx, next);
  }

  return (ctx.method === 'POST' ||
    (ctx.method === 'GET' && ctx.params.provider !== 'webauthn')) &&
    ctx.passport &&
    ctx.passport.authenticate
    ? ctx.passport.authenticate(ctx.params.provider, {
        ...config.passportCallbackOptions,
        successReturnToOrRedirect: false
      })(ctx, next)
    : next();
}

async function callbackRedirect(ctx, next) {
  if (!ctx.passport) return next();

  //
  // NOTE: passkeys work with OTP, so if user has OTP enabled then set to true
  //
  if (ctx.params.provider === 'webauthn' && !ctx.state.webauthnAuthenticated) {
    throw Boom.unauthorized(ctx.translateError('INVALID_WEBAUTHN_KEY'));
  }

  if (
    ctx.params.provider === 'webauthn' &&
    ctx.isAuthenticated() &&
    ctx.state.user[config.passport.fields.otpEnabled]
  ) {
    ctx.session.otp = 'passkey';
    await ctx.saveSession();
  }

  //
  // OAuth pre-account takeover protection:
  // If an attacker pre-registers with the victim's email (unverified),
  // then the victim logs in via OAuth, @ladjs/passport links the OAuth
  // profile to the attacker's existing account.  To mitigate this, when
  // an OAuth login occurs on an account that has never verified its email,
  // we mark the email as verified (the OAuth provider verified it),
  // clear any password the attacker may have set, invalidate all other
  // sessions, and clear any outstanding reset tokens.
  //
  const oauthProviders = new Set(['apple', 'google', 'github', 'ubuntu']);
  if (
    ctx.isAuthenticated() &&
    oauthProviders.has(ctx.params.provider) &&
    !ctx.state.user[config.userFields.hasVerifiedEmail]
  ) {
    const user = await Users.findById(ctx.state.user._id);
    if (user) {
      // (passkeys, two-factor and the API token, see clear-unverified-sign-ins.js)
      clearUnverifiedSignIns(user);
      user[config.userFields.hasVerifiedEmail] = true;
      user[config.userFields.resetToken] = undefined;
      user[config.userFields.resetTokenExpiresAt] = undefined;
      // Clear the attacker's password so they can no longer log in
      if (user[config.userFields.hasSetPassword]) {
        user[config.userFields.hasSetPassword] = false;
        // setPassword with a random value to invalidate the old hash
        await user.setPassword(crypto.randomBytes(32).toString('hex'));
      }

      // Clear any API token the attacker may have obtained before the victim
      // logged in via OAuth; the pre('validate') hook regenerates a fresh one
      // on save, so the attacker's token can no longer be used
      user[config.userFields.apiToken] = undefined;

      await user.save();
      // Refresh ctx.state.user with updated fields
      ctx.state.user = user.toObject();
      // Invalidate all other sessions (kicks out the attacker). awaited so the
      // attacker's sessions are destroyed before the response is returned; a
      // redis failure is logged but must not break the login.
      try {
        await invalidateOtherSessions(ctx);
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }
  }

  //
  // Ubuntu SSO post-login sync retry:
  // The pre-save hook in users.js already attempts syncUbuntuUser during
  // login, but it can fail silently (transient Launchpad API timeout,
  // stale cached map, etc.). If the user has Ubuntu SSO credentials but
  // is not yet a member of any Ubuntu team domain, retry with a fresh map.
  // This prevents the redirect loop when they later try to add the domain.
  //
  if (
    ctx.params.provider === 'ubuntu' &&
    ctx.isAuthenticated() &&
    isSANB(ctx.state.user[config.passport.fields.ubuntuProfileID]) &&
    isSANB(ctx.state.user[config.passport.fields.ubuntuUsername])
  ) {
    try {
      const ubuntuDomains = Object.keys(config.ubuntuTeamMapping);
      const existingMembership = await Domains.findOne({
        name: { $in: ubuntuDomains },
        plan: 'team',
        has_txt_record: true,
        'members.user': ctx.state.user._id
      })
        .lean()
        .exec();

      if (!existingMembership) {
        const map = await getUbuntuMembersMap();
        const user = await Users.findById(ctx.state.user._id);
        if (user) {
          await syncUbuntuUser(user, map);
          user.last_ubuntu_sync = new Date();
          await user.save();
        }
      }
    } catch (err) {
      logger.fatal(err);
      // Email admins with full error details so sync failures are visible
      const ubuntuUsername =
        ctx.state.user[config.passport.fields.ubuntuUsername];
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Ubuntu SSO post-login sync failed for ${ubuntuUsername}`
        },
        locals: {
          message:
            `<p>Ubuntu SSO post-login sync failed for user ` +
            `<strong>${ctx.state.user.email}</strong> ` +
            `(Launchpad username: <code>${ubuntuUsername}</code>).</p>` +
            `<p><strong>Error:</strong> ${err.message}</p>` +
            `<pre><code>${err.stack}</code></pre>`
        }
      })
        .then()
        .catch((err) => logger.fatal(err));
    }
  }

  const redirectTo = await parseLoginSuccessRedirect(ctx);

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

router
  .param('provider', (provider, ctx, next) => {
    if (!ctx.passport || !isSANB(provider)) return next();
    if (
      !ctx.passport.config ||
      !ctx.passport.config.providers ||
      !ctx.passport.config.providers[provider.toLowerCase()]
    )
      throw Boom.badRequest(ctx.translateError('INVALID_PROVIDER'));
    return next();
  })
  .get(
    '/:provider',
    web.auth.catchError,
    pinUbuntuProvider,
    web.auth.parseReturnOrRedirectTo,
    (ctx, next) =>
      ctx.params.provider !== 'webauthn' &&
      ctx.passport &&
      ctx.passport.authenticate
        ? ctx.passport.authenticate(
            ctx.params.provider,
            config.passport[ctx.params.provider] ||
              (ctx.params.provider === 'google'
                ? { accessType: 'offline' }
                : undefined)
          )(ctx, next)
        : next()
  )
  .get(
    '/:provider/ok',
    web.auth.catchError,
    pinUbuntuProvider,
    callbackCheck,
    callbackRedirect
  )
  .post('/ubuntu', pinUbuntuProvider, (ctx, next) =>
    ctx.passport.authenticate('ubuntu')(ctx, next)
  )
  .post(
    '/:provider/ok',
    web.auth.catchError,
    // Fix for Ubuntu SSO: koa-bodyparser parses the OpenID POST body with
    // qs.parse({ allowDots: true }), which converts flat dotted keys like
    // "openid.sreg.fullname" into nested objects. The passport-ubuntu strategy
    // expects flat keys. Re-parse using querystring (which preserves dots in keys)
    // from the raw body string that koa-bodyparser provides.
    (ctx, next) => {
      if (
        ctx.params.provider === 'ubuntu' &&
        ctx.request.rawBody &&
        typeof ctx.request.rawBody === 'string'
      ) {
        ctx.request.body = querystring.parse(ctx.request.rawBody);
      }

      return next();
    },
    pinUbuntuProvider,
    callbackCheck,
    callbackRedirect
  )
  .get('/google/consent', web.auth.catchError, (ctx, next) =>
    ctx.passport && ctx.passport.authenticate
      ? ctx.passport.authenticate('google', {
          accessType: 'offline',
          prompt: 'consent', // See google strategy in passport helper
          scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
          ]
        })(ctx, next)
      : next()
  )
  .post(
    '/webauthn/challenge',
    rateLimit(50, 'webauthn challenge'),
    async (ctx) => {
      if (!ctx.passport.config.providers.webauthn)
        throw Boom.badRequest(ctx.translateError('INVALID_PROVIDER'));
      const challenge = await storeChallenge(ctx);
      await ctx.saveSession();
      // this should be XHR/json request (not HTML)
      if (ctx.accepts('html')) {
        ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
        if (ctx.isAuthenticated())
          ctx.redirect(ctx.state.l('/my-account/security'));
        else ctx.redirect(ctx.state.l('/login'));
      } else {
        ctx.body = { challenge: base64url.encode(challenge) };
      }
    }
  );

module.exports = router;
