/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const { decrypt } = require('#helpers/encrypt-decrypt');

function parseMermaidQuery(ctx) {
  if (!isSANB(ctx.query.code))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
  if (ctx.query.theme !== 'dark' && ctx.query.theme !== 'default')
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  try {
    return { code: decrypt(ctx.query.code), theme: ctx.query.theme };
  } catch {
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
  }
}

module.exports = parseMermaidQuery;
