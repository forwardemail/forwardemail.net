/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');

//
// Changes that give or take away a way to sign in (a passkey signs in with
// neither the password nor two-factor) ask for the current password, the
// same as setting up or disabling two-factor does: a session someone else
// got hold of for a moment must not be able to keep a way back in.
// (accounts without a password, signed up with Google or GitHub, have
// nothing to confirm)
//
async function confirmCurrentPassword(ctx) {
  if (!ctx.state.user[config.userFields.hasSetPassword]) return;
  const password = ctx.request.body?.password;
  if (!isSANB(password))
    throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));
  const { user } = await ctx.state.user.authenticate(password);
  if (!user) throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));
}

module.exports = confirmCurrentPassword;
