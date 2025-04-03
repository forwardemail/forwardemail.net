/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const ratelimit = require('@ladjs/koa-simple-ratelimit');

const logger = require('./logger');
const _ = require('#helpers/lodash');
const config = require('#config');

// defaults to 10 requests per day
function rateLimit(max = 10, context, duration = ms('1d')) {
  if (!_.isFinite(max)) throw new Error('Max must be finite');
  if (!isSANB(duration) && !_.isFinite(duration))
    throw new Error(
      'Duration must be a string to be parsed with ms() or a finite Number'
    );
  return (ctx, next) => {
    if (ctx.isAuthenticated() && ctx.state.user.group === 'admin')
      return next();

    const affix = isSANB(context)
      ? context
      : `${ctx.hostname} ${ctx.method} ${ctx.pathWithoutLocale}`;

    const prefix = _.snakeCase(`limit ${config.env} ${affix}`);

    return ratelimit({
      db: ctx.client,
      max,
      duration,
      prefix,
      logger,
      ...config.rateLimit
    })(ctx, next);
  };
}

module.exports = rateLimit;
