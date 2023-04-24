const Boom = require('@hapi/boom');
const auth = require('basic-auth');

const env = require('#config/env');

const API_RESTRICTED_SYMBOL = Symbol.for(env.API_RESTRICTED_SYMBOL);

async function restricted(ctx, next) {
  const credentials = auth(ctx.req);

  if (
    typeof credentials === 'undefined' ||
    typeof credentials.name !== 'string' ||
    !credentials.name
  )
    throw Boom.unauthorized(ctx.translateError('INVALID_API_CREDENTIALS'));

  if (!env.API_SECRETS.includes(credentials.name))
    throw Boom.unauthorized(ctx.translateError('INVALID_API_TOKEN'));

  ctx[API_RESTRICTED_SYMBOL] = true;

  if (next) return next();
}

module.exports = restricted;
