const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const parseLoginSuccessRedirect = require('#helpers/parse-login-success-redirect');
const web = require('#controllers/web');

const router = new Router({ prefix: '/auth' });

router
  .param('provider', (provider, ctx, next) => {
    if (!ctx.passport || !isSANB(provider)) return next();
    if (!ctx.passport.config.providers[provider.toLowerCase()])
      return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PROVIDER')));
    return next();
  })
  .get(
    '/:provider',
    web.auth.catchError,
    web.auth.parseReturnOrRedirectTo,
    (ctx, next) =>
      ctx.passport
        ? ctx.passport.authenticate(
            ctx.params.provider,
            config.passport[ctx.params.provider]
          )(ctx, next)
        : next()
  )
  .get(
    '/:provider/ok',
    web.auth.catchError,
    (ctx, next) =>
      ctx.passport
        ? ctx.passport.authenticate(ctx.params.provider, {
            ...config.passportCallbackOptions,
            successReturnToOrRedirect: false
          })(ctx, next)
        : next(),
    async (ctx, next) => {
      if (!ctx.passport) return next();

      const redirectTo = await parseLoginSuccessRedirect(ctx);

      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  )
  .get('/google/consent', web.auth.catchError, (ctx, next) =>
    ctx.passport
      ? ctx.passport.authenticate('google', {
          accessType: 'offline',
          prompt: 'consent', // See google strategy in passport helper
          scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
          ]
        })(ctx, next)
      : next()
  );

module.exports = router;
