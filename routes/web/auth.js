/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { promisify } = require('node:util');

const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const base64url = require('base64url');
const isSANB = require('is-string-and-not-blank');
const {
  SessionChallengeStore
} = require('@forwardemail/passport-fido2-webauthn');

const config = require('#config');
const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

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
      return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PROVIDER')));
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
            config.passport[ctx.params.provider]
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
        return ctx.throw(
          Boom.badRequest(ctx.translateError('INVALID_PROVIDER'))
        );
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
