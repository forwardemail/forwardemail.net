/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

//
// Whether whoever holds the address of the account proved it: the address is
// verified, and not only counted as verified for a paid plan (anyone can sign
// up with an address they do not own and pay for a plan; see
// emailProofPending in app/models/users.js)
//
function isEmailProven(user) {
  return Boolean(
    user?.[config.userFields.hasVerifiedEmail] &&
      !user[config.userFields.emailProofPending]
  );
}

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
  // (an address only counted as verified for a paid plan was never proven,
  // see isEmailProven above; the callers prove it now)
  if (isEmailProven(user)) return user;
  user[config.userFields.emailProofPending] = undefined;
  user.passkeys = [];
  user[config.passport.fields.otpEnabled] = false;
  user[config.passport.fields.otpToken] = undefined;
  user[config.userFields.otpRecoveryKeys] = [];
  user[config.userFields.apiToken] = undefined;
  return user;
}

module.exports = clearUnverifiedSignIns;
module.exports.isEmailProven = isEmailProven;
