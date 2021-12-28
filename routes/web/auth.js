const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const { boolean } = require('boolean');

const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const passport = require('#helpers/passport');
const config = require('#config');
const web = require('#controllers/web');

const router = new Router({ prefix: '/auth' });

router
  .param('provider', (provider, ctx, next) => {
    if (!boolean(process.env[`AUTH_${provider.toUpperCase()}_ENABLED`])) {
      return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PROVIDER')));
    }

    return next();
  })
  .get(
    '/:provider',
    web.auth.catchError,
    web.auth.parseReturnOrRedirectTo,
    (ctx, next) => {
      passport.authenticate(
        ctx.params.provider,
        config.passport[ctx.params.provider]
      )(ctx, next);
    }
  )
  .get(
    '/:provider/ok',
    web.auth.catchError,
    (ctx, next) => {
      return passport.authenticate(ctx.params.provider, {
        ...config.passportCallbackOptions,
        successReturnToOrRedirect: false
      })(ctx, next);
    },
    async (ctx) => {
      const redirectTo = await parseLoginSuccessRedirect(ctx);

      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  );

if (boolean(process.env.AUTH_GOOGLE_ENABLED)) {
  router.get(
    '/google/consent',
    web.auth.catchError,
    passport.authenticate('google', {
      accessType: 'offline',
      prompt: 'consent', // See google strategy in passport helper
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    })
  );
}

module.exports = router;
