/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');
const render = require('koa-views-render');

const config = require('#config');
const policies = require('#helpers/policies');
const web = require('#controllers/web');
const rateLimit = require('#helpers/rate-limit');

const router = new Router({ prefix: config.otpRoutePrefix });

router
  .use(policies.ensureLoggedIn)
  .get(config.otpRouteLoginPath, (ctx, next) => {
    if (
      !ctx.passport ||
      !ctx.passport.config ||
      !ctx.passport.config.providers ||
      !ctx.passport.config.providers.otp
    )
      return next();
    return ctx.render('otp/login');
  })
  .post(config.otpRouteLoginPath, rateLimit(30, 'otp login'), web.auth.loginOtp)
  //
  // NOTE: login, recovery, and keys are the second factor itself so they must
  //       stay reachable after only the password step, but setup shows the
  //       recovery keys and the OTP secret, so it requires the second factor
  //
  // (and only once the email is verified, see ensure-verified-email.js)
  .get(
    '/setup',
    policies.ensureOtp,
    web.myAccount.ensureVerifiedEmail,
    web.otp.setup,
    render('otp/setup')
  )
  .post(
    '/setup',
    policies.ensureOtp,
    web.myAccount.ensureVerifiedEmail,
    rateLimit(10, 'otp setup'),
    web.otp.setup
  )
  .post('/disable', rateLimit(10, 'otp disable'), web.otp.disable)
  .post('/recovery', rateLimit(10, 'otp recovery'), web.otp.recovery)
  .get('/keys', render('otp/keys'))
  .post('/keys', rateLimit(10, 'otp keys'), web.auth.recoveryKey);

module.exports = router;
