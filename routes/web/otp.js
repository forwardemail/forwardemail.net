const Router = require('@koa/router');
const render = require('koa-views-render');

const config = require('#config');
const policies = require('#helpers/policies');
const web = require('#controllers/web');

const router = new Router({ prefix: config.otpRoutePrefix });

router
  .use(policies.ensureLoggedIn)
  .get(config.otpRouteLoginPath, (ctx, next) => {
    if (!ctx.passport || !ctx.passport.config.providers.otp) return next();
    return ctx.render('otp/login');
  })
  .post(config.otpRouteLoginPath, web.auth.loginOtp)
  .get('/setup', render('otp/setup'))
  .post('/setup', web.otp.setup)
  .post('/disable', web.otp.disable)
  .post('/recovery', web.otp.recovery)
  .get('/keys', render('otp/keys'))
  .post('/keys', web.auth.recoveryKey);

module.exports = router;
