const Boom = require('@hapi/boom');

function ensureDomainAdmin(ctx, next) {
  if (ctx.state.domain.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));
}

module.exports = ensureDomainAdmin;
