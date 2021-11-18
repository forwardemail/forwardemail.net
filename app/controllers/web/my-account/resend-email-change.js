const Boom = require('@hapi/boom');

const config = require('../../../../config');
const emailHelper = require('../../../../helpers/email');

async function resendEmailChange(ctx) {
  try {
    await emailHelper({
      template: 'change-email',
      message: {
        to: body.email
      },
      locals: {
        user: _.pick(ctx.state.user, [
          config.userFields.changeEmailTokenExpiresAt,
          config.userFields.changeEmailNewAddress,
          config.passportLocalMongoose.usernameField
        ]),
        link: `${config.urls.web}/my-account/change-email/${
          ctx.state.user[config.userFields.changeEmailToken]
        }`
      }
    });
  } catch (err) {
    ctx.logger.error(err);
    // reset if there was an error
    try {
      ctx.state.user[config.userFields.changeEmailToken] = null;
      ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = null;
      ctx.state.user[config.userFields.changeEmailNewAddress] = null;
      ctx.state.user = await ctx.state.user.save();
    } catch (err) {
      ctx.logger.error(err);
    }

    throw Boom.badRequest(ctx.translateError('EMAIL_FAILED_TO_SEND'));
  }

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('EMAIL_CHANGE_SENT'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
}
