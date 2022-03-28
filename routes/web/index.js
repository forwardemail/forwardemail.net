const process = require('process');

const Router = require('@koa/router');
const render = require('koa-views-render');
const { boolean } = require('boolean');

const admin = require('./admin');
const auth = require('./auth');
const myAccount = require('./my-account');
const otp = require('./otp');
const config = require('#config');
const policies = require('#helpers/policies');
const { web } = require('#controllers');

const router = new Router();

// status page crawlers often send `HEAD /` requests
router.get('/', (ctx, next) => {
  if (ctx.method === 'HEAD') {
    ctx.body = 'OK';
    return;
  }

  return next();
});

// report URI support (not locale specific)
router.post('/report', web.report);

const localeRouter = new Router({ prefix: '/:locale' });

localeRouter
  .get('/', web.auth.homeOrDomains)
  .post('/', web.myAccount.retrieveDomains, web.onboard)
  // recipient verification
  .get('/v/:text', web.recipientVerification)
  .get('/dashboard', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/my-account'));
  })
  .get('/features', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/pricing'));
  })
  .get(
    '/pricing',
    web.myAccount.retrieveDomains,
    web.myAccount.sortedDomains,
    render('pricing')
  )
  .get('/faq', web.myAccount.retrieveDomains, web.onboard, web.faq)
  .post(
    '/faq',
    web.myAccount.retrieveDomains,
    web.onboard,
    web.auth.parseReturnOrRedirectTo,
    web.faq
  )
  .get('/api', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/email-forwarding-api'));
  })
  .get('/email-forwarding-api', web.myAccount.retrieveDomains, web.api)
  .get('/help', render('help'))
  .get('/about', render('about'))
  .get(
    '/domain-registration',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('domain-registration')
  )
  .get(
    '/free-disposable-addresses',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('free-disposable-addresses')
  )
  .get(
    '/reserved-email-addresses',
    web.reservedEmailAddresses,
    web.myAccount.retrieveDomains,
    web.onboard,
    render('reserved-email-addresses')
  )
  .get(
    '/free-email-webhooks',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('free-email-webhooks')
  )
  .get(
    '/email-forwarding-regex-pattern-filter',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('email-forwarding-regex-pattern-filter')
  )
  .get(
    '/guides/port-25-blocked-by-isp-workaround',
    web.myAccount.retrieveDomains,
    web.onboard,
    render('guides/port-25-blocked-by-isp-workaround')
  )
  .get('/donate', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/'));
  })
  .get('/terms', render('terms'))
  .get('/privacy', render('privacy'))
  .get('/open-startup', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/'));
  })
  .get('/404', render('404'))
  .get('/500', render('500'))
  .post('/help', policies.ensureCaptcha, web.help)
  .get('/forgot-password', policies.ensureLoggedOut, render('forgot-password'))
  .post('/forgot-password', policies.ensureLoggedOut, web.auth.forgotPassword)
  .get(
    '/reset-password/:token',
    policies.ensureLoggedOut,
    render('reset-password')
  )
  .post(
    '/reset-password/:token',
    policies.ensureLoggedOut,
    web.auth.resetPassword
  )
  .get(
    config.verifyRoute,
    policies.ensureLoggedIn,
    web.auth.parseReturnOrRedirectTo,
    web.auth.verify
  )
  .post(
    config.verifyRoute,
    policies.ensureLoggedIn,
    web.auth.parseReturnOrRedirectTo,
    web.auth.verify
  )
  .get('/logout', web.auth.logout)
  .get(
    config.loginRoute,
    web.auth.parseReturnOrRedirectTo,
    web.auth.registerOrLogin
  )
  .post(config.loginRoute, web.auth.login)
  .get(
    '/register',
    policies.ensureLoggedOut,
    web.auth.parseReturnOrRedirectTo,
    web.auth.registerOrLogin
  )
  .post('/register', policies.ensureLoggedOut, web.auth.register);

localeRouter.use(myAccount.routes());
localeRouter.use(admin.routes());

if (boolean(process.env.AUTH_OTP_ENABLED)) localeRouter.use(otp.routes());

router.use(auth.routes());
router.use(localeRouter.routes());

module.exports = router;
