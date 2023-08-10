const Boom = require('@hapi/boom');
const parseErr = require('parse-err');

const i18n = require('#helpers/i18n');
const createSession = require('#helpers/create-session');

async function removeEmail(ctx, next) {
  if (!['pending', 'queued', 'deferred'].includes(ctx.state.email.status))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_EMAIL_STATUS'))
    );

  // NOTE: save() will automatically remove from `rejectedErrors` any already `accepted`
  const err = Boom.notFound(i18n.translateError('EMAIL_REMOVED'));
  ctx.state.email.rejectedErrors.push(
    ...ctx.state.email.envelope.to.map((recipient) => {
      const error = parseErr(err);
      error.recipient = recipient;
      return error;
    })
  );

  // NOTE: we leave it up to the pre-save hook to determine the "status"
  ctx.state.email.is_locked = false;
  ctx.state.email.locked_by = undefined;
  ctx.state.email.locked_at = undefined;
  ctx.state.email = await ctx.state.email.save();

  ctx.logger.info('email removed', {
    session: createSession(ctx.state.email),
    user: ctx.state.email.user,
    email: ctx.state.email._id,
    domains: [ctx.state.email.domain],
    ignore_hook: false
  });

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  const redirectTo = ctx.state.l('/my-account/emails');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = removeEmail;
