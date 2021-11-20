const Boom = require('@hapi/boom');

function ensureAliasAdmin(ctx, next) {
  if (ctx.state.alias.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));
}

module.exports = ensureAliasAdmin;
