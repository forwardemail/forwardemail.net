const Boom = require('@hapi/boom');

const config = require('../../../../config');

async function cancelEmailChange(ctx) {
  // if no email change request exists throw an error
  if (!ctx.state.user[config.userFields.changeEmailToken])
    throw ctx.throw(
      Boom.badRequest(ctx.translateError('EMAIL_CHANGE_DOES_NOT_EXIST'))
    );

  ctx.state.user[config.userFields.changeEmailToken] = undefined;
  ctx.state.user[config.userFields.changeEmailNewAddress] = undefined;
  ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = undefined;

  delete ctx.state.user[config.userFields.changeEmailToken];
  delete ctx.state.user[config.userFields.changeEmailNewAddress];
  delete ctx.state.user[config.userFields.changeEmailTokenExpiresAt];

  ctx.state.user = await ctx.state.user.save();

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('EMAIL_CHANGE_CANCELLED'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = cancelEmailChange;
