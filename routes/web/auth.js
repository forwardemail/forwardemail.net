/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const base64url = require('base64url');
const isSANB = require('is-string-and-not-blank');
const {
  SessionChallengeStore
} = require('@forwardemail/passport-fido2-webauthn');

const config = require('#config');
const invalidateOtherSessions = require('#helpers/invalidate-other-sessions');
const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');
const { Users } = require('#models');

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

      await user.save();
      // Refresh ctx.state.user with updated fields
      ctx.state.user = user.toObject();
      // Invalidate all other sessions (kicks out the attacker)
      invalidateOtherSessions(ctx)
        .then()
        .catch((err) => ctx.logger.fatal(err));
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
  .post('/:provider/ok', web.auth.catchError, callbackCheck, callbackRedirect)
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
