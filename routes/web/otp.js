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
  .post(config.otpRouteLoginPath, web.auth.loginOtp, rateLimit(30, 'otp login'))
  .get('/setup', render('otp/setup'))
  .post('/setup', rateLimit(10, 'otp setup'), web.otp.setup)
  .post('/disable', rateLimit(10, 'otp disable'), web.otp.disable)
  .post('/recovery', rateLimit(10, 'otp recovery'), web.otp.recovery)
  .get('/keys', render('otp/keys'))
  .post('/keys', rateLimit(10, 'otp keys'), web.auth.recoveryKey);

module.exports = router;
