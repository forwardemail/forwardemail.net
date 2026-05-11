/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
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

  // Perform timing-safe comparison against all API secrets
  // to prevent timing-based token enumeration attacks
  let isValid = false;
  const providedBuf = Buffer.from(credentials.name);

  for (const secret of env.API_SECRETS) {
    const secretBuf = Buffer.from(secret);
    if (
      providedBuf.length === secretBuf.length &&
      crypto.timingSafeEqual(providedBuf, secretBuf)
    ) {
      isValid = true;
    }
  }

  if (!isValid)
    throw Boom.unauthorized(ctx.translateError('INVALID_API_TOKEN'));

  ctx[API_RESTRICTED_SYMBOL] = true;

  if (next) return next();
}

module.exports = restricted;
