/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

function ensureDomainAdmin(ctx, next) {
  if (ctx.state.domain.group === 'admin') {
    if (typeof next !== 'function') return;
    return next();
  }

  // if no `ctx.state.domain.group` property exists, then we can try to find it
  if (
    ctx.state.domain &&
    !ctx.state.domain.group &&
    Array.isArray(ctx.state.domain.members)
  ) {
    const member = ctx.state.domain.members.find((m) => {
      if (typeof m.user !== 'object') return false;
      if (typeof m.user.id === 'string') return m.user.id === ctx.state.user.id;
      if (typeof m.user.toString === 'function')
        return m.user.toString() === ctx.state.user.id;
      return false;
    });
    if (member && member.group === 'admin') {
      if (typeof next !== 'function') return;
      return next();
    }
  }

  const err = Boom.badRequest(ctx.translateError('IS_NOT_ADMIN'));
  if (typeof next !== 'function') throw err;
  ctx.throw(err);
}

module.exports = ensureDomainAdmin;
