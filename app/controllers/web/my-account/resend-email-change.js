const Boom = require('@hapi/boom');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');

const emailHelper = require('#helpers/email');
const config = require('#config');

async function resendEmailChange(ctx) {
  // if no email change request exists throw an error
  if (!ctx.state.user[config.userFields.changeEmailNewAddress])
    throw ctx.throw(
      Boom.badRequest(ctx.translateError('EMAIL_CHANGE_DOES_NOT_EXIST'))
    );

  // reset the reset token and expiry
  ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = dayjs()
    .add(config.changeEmailTokenTimeoutMs, 'milliseconds')
    .toDate();
  ctx.state.user[config.userFields.changeEmailToken] =
    await cryptoRandomString.async({
      length: 32
    });

  // save the user
  ctx.state.user = await ctx.state.user.save();

  try {
    await emailHelper({
      template: 'change-email',
      message: {
        to: ctx.state.user[config.userFields.changeEmailNewAddress]
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
    ctx.logger.fatal(err);
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
  else ctx.body = { reloadPage: true };
}

module.exports = resendEmailChange;
