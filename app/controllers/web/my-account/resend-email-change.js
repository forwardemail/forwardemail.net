/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const _ = require('#helpers/lodash');

const emailHelper = require('#helpers/email');
const config = require('#config');

async function resendEmailChange(ctx) {
  // if no email change request exists throw an error
  if (!ctx.state.user[config.userFields.changeEmailNewAddress])
    throw Boom.badRequest(ctx.translateError('EMAIL_CHANGE_DOES_NOT_EXIST'));

  //
  // Send the same link again while it is still valid (only its expiry is
  // extended).  A new token on every resend made every link sent before it
  // invalid, so the link in an earlier (or delayed) email failed and the
  // change stayed pending.
  //
  const previous = {
    token: ctx.state.user[config.userFields.changeEmailToken],
    expiresAt: ctx.state.user[config.userFields.changeEmailTokenExpiresAt]
  };
  const isValid =
    typeof previous.token === 'string' &&
    previous.token.length > 0 &&
    previous.expiresAt &&
    new Date(previous.expiresAt).getTime() > Date.now();

  ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = dayjs()
    .add(config.changeEmailTokenTimeoutMs, 'milliseconds')
    .toDate();
  if (!isValid)
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
    // put the pending change back as it was (a link already sent stays valid)
    try {
      ctx.state.user[config.userFields.changeEmailToken] = isValid
        ? previous.token
        : undefined;
      ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = isValid
        ? previous.expiresAt
        : undefined;
      if (!isValid)
        ctx.state.user[config.userFields.changeEmailNewAddress] = undefined;
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
