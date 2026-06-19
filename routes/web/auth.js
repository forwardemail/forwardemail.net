/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
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
const emailHelper = require('#helpers/email');
const getUbuntuMembersMap = require('#helpers/get-ubuntu-members-map');
const invalidateOtherSessions = require('#helpers/invalidate-other-sessions');
const logger = require('#helpers/logger');
const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const rateLimit = require('#helpers/rate-limit');
const syncUbuntuUser = require('#helpers/sync-ubuntu-user');
const web = require('#controllers/web');
const { Domains, Users } = require('#models');

const store = new SessionChallengeStore();

const storeChallenge = promisify(store.challenge).bind(store);

const router = new Router({ prefix: '/auth' });

function callbackCheck(ctx, next) {
  return (ctx.method === 'POST' ||
    (ctx.method === 'GET' && ctx.params.provider !== 'webauthn')) &&
    ctx.passport &&
    ctx.passport.authenticate
    ? ctx.passport.authenticate(ctx.params.provider, {
        ...config.passportCallbackOptions,
        // webauthn shouldn't redirect or flash errors
        ...(ctx.params.provider === 'webauthn'
          ? { failureRedirect: false, failureFlash: false }
          : {}),
        successReturnToOrRedirect: false
      })(ctx, next)
    : next();
}

async function callbackRedirect(ctx, next) {
  if (!ctx.passport) return next();

  //
  // NOTE: passkeys work with OTP, so if user has OTP enabled then set to true
  //
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
  .get('/:provider/ok', web.auth.catchError, callbackCheck, callbackRedirect)
  .post('/ubuntu', (ctx, next) =>
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
