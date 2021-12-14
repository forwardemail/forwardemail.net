const Boom = require('@hapi/boom');

const config = require('../../../config');

function ensureNotBanned(ctx, next) {
  if (ctx.state.user[config.userFields.isBanned])
    return ctx.throw(Boom.forbidden(ctx.translateError('ACCOUNT_BANNED')));
  return next();
}

module.exports = ensureNotBanned;
