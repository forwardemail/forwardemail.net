const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const Aliases = require('#models/aliases');

// NOTE: this endpoint is not supported by API to prevent abuse
async function resendVerification(ctx) {
  ctx.state.alias = await Aliases.findById(ctx.state.alias._id);

  if (!isSANB(ctx.request.body.recipient)) {
    ctx.throw(Boom.badRequest(ctx.translateError('ALIAS_DOES_NOT_EXIST')));
    return;
  }

  //
  // NOTE: no validation is currently done for existence of `recipient` in `recipients`
  //      nor `verified_recipients` or `pending_recipients`
  //
  ctx.state.alias.pending_recipients =
    ctx.state.alias.pending_recipients.filter(
      (recipient) => recipient !== ctx.request.body.recipient
    );
  ctx.state.alias.locale = ctx.locale;
  ctx.state.alias.is_update = true;

  try {
    ctx.state.alias = await ctx.state.alias.save();
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = resendVerification;
