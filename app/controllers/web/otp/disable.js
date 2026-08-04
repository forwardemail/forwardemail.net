/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { authenticator } = require('otplib');

const config = require('#config');

// allow last and current totp passcode
authenticator.options = {
  window: 1
};

async function disable(ctx) {
  const { body } = ctx.request;

  const redirectTo = ctx.state.l('/my-account/security');

  if (!ctx.state.user[config.passport.fields.otpEnabled])
    throw Boom.badRequest(ctx.translateError('TWO_FACTOR_REQUIRED'));

  if (ctx.state.user[config.userFields.hasSetPassword]) {
    if (!isSANB(body.password))
      throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

    const { user } = await ctx.state.user.authenticate(body.password);
    if (!user) throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));
  }

  //
  // require a valid OTP passcode or recovery key to disable 2FA
  // (prevents an attacker with only the password from stripping 2FA)
  //
  const secret = ctx.state.user[config.passport.fields.otpToken];
  const recoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  if (isSANB(body.token)) {
    const isValid = authenticator.checkDelta(body.token, secret);
    if (isValid !== 0 && isValid !== -1)
      throw Boom.badRequest(ctx.translateError('INVALID_OTP_PASSCODE'));
  } else if (isSANB(body.recovery_key)) {
    if (
      !Array.isArray(recoveryKeys) ||
      recoveryKeys.length === 0 ||
      !recoveryKeys.includes(body.recovery_key)
    )
      throw Boom.badRequest(ctx.translateError('INVALID_RECOVERY_KEY'));

    // consume the used recovery key
    ctx.state.user[config.userFields.otpRecoveryKeys] = recoveryKeys.filter(
      (key) => key !== body.recovery_key
    );
  } else {
    throw Boom.badRequest(ctx.translateError('INVALID_OTP_PASSCODE'));
  }

  ctx.state.user[config.passport.fields.otpEnabled] = false;
  ctx.state.user[config.passport.fields.otpToken] = undefined;
  ctx.state.user[config.userFields.otpRecoveryKeys] = undefined;
  await ctx.state.user.save();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = disable;
