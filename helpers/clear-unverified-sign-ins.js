/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

//
// Anyone can create an account for an email address they do not own (e.g.
// through the API or the home page form), and add an API token to it.  When
// the owner of the address later takes the account over by proving they
// control the address (a password reset or an OAuth login), everything that
// grants access and was set before then is removed, so whoever created the
// account cannot keep using it.  Passkeys and two-factor can only be added
// once the address is verified, but they are cleared too in case an older
// account has them.
//
// The user document is changed but not saved (the caller saves it, and the
// model generates a fresh API token and two-factor secret on save).
//
function clearUnverifiedSignIns(user) {
  if (user[config.userFields.hasVerifiedEmail]) return user;
  user.passkeys = [];
  user[config.passport.fields.otpEnabled] = false;
  user[config.passport.fields.otpToken] = undefined;
  user[config.userFields.otpRecoveryKeys] = [];
  user[config.userFields.apiToken] = undefined;
  return user;
}

module.exports = clearUnverifiedSignIns;
