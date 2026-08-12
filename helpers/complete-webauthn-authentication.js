/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

async function completeWebauthnAuthentication(ctx, user) {
  if (!user)
    throw Boom.unauthorized(ctx.translateError('INVALID_WEBAUTHN_KEY'));

  await ctx.login(user);
  ctx.state.webauthnAuthenticated = true;
}

module.exports = completeWebauthnAuthentication;
