const Router = require('@koa/router');
const render = require('koa-views-render');
const { boolean } = require('boolean');

const config = require('../../config');
const { policies } = require('../../helpers');
const { web } = require('../../app/controllers');

const admin = require('./admin');
const auth = require('./auth');
const myAccount = require('./my-account');
const otp = require('./otp');

const router = new Router();

// status page crawlers often send `HEAD /` requests
router.head('/', ctx => {
  ctx.body = 'OK';
});

const localeRouter = new Router({ prefix: '/:locale' });

localeRouter
  .get('/', web.auth.homeOrDomains)
  .get('/dashboard', ctx => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/my-account'));
  })
  .get('/about', render('about'))
  .get('/free-disposable-addresses', render('free-disposable-addresses'))
  .get('/domain-registration', render('domain-registration'))
  .get('/reserved-email-addresses', render('reserved-email-addresses'))
  .get(
    '/features',
    web.myAccount.retrieveDomains,
    web.myAccount.sortedDomains,
    render('features')
  )
  .get('/faq', web.myAccount.retrieveDomains, web.faq)
  .post('/faq', web.myAccount.retrieveDomains, web.faq)
  .get('/donate', render('donate'))
  .get('/404', render('404'))
  .get('/500', render('500'))
  .get('/terms', render('terms'))
  .get('/privacy', render('privacy'))
  .get('/help', render('help'))
  .post('/help', web.help)
  .get('/forgot-password', render('forgot-password'))
  .post('/forgot-password', web.auth.forgotPassword)
  .get('/reset-password/:token', render('reset-password'))
  .post('/reset-password/:token', web.auth.resetPassword)
  .get(
    config.verificationPath,
    policies.ensureLoggedIn,
    web.auth.parseReturnOrRedirectTo,
    web.auth.verify
  )
  .post(
    config.verificationPath,
    policies.ensureLoggedIn,
    web.auth.parseReturnOrRedirectTo,
    web.auth.verify
  )
  .get('/logout', web.auth.logout)
  .get('/login', web.auth.parseReturnOrRedirectTo, web.auth.registerOrLogin)
  .post('/login', web.auth.login)
  .get('/register', web.auth.parseReturnOrRedirectTo, web.auth.registerOrLogin)
  .post('/register', web.auth.register);

localeRouter.use(myAccount.routes());
localeRouter.use(admin.routes());

if (boolean(process.env.AUTH_OTP_ENABLED)) localeRouter.use(otp.routes());

router.use(auth.routes());
router.use(localeRouter.routes());

module.exports = router;
