/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

function ensureAliasAdmin(ctx, next) {
  if (ctx.state.alias.group === 'admin') return next();
  throw Boom.badRequest(ctx.translateError('IS_NOT_ADMIN'));
}

module.exports = ensureAliasAdmin;
