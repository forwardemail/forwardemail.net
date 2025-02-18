/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const auth = require('basic-auth');
const parseLogs = require('parse-logs');

const env = require('#config/env');
const Logs = require('#models/logs');
const policies = require('#helpers/policies');

const API_RESTRICTED_SYMBOL = Symbol.for(env.API_RESTRICTED_SYMBOL);

async function parseLog(ctx) {
  try {
    const log = ctx[API_RESTRICTED_SYMBOL]
      ? ctx.request.body
      : parseLogs(ctx.request);

    if (log.ignore_hook) {
      ctx.body = 'OK';
      return;
    }

    //
    // if it utilized restricted basic auth middleware
    // then we can assume it's a trusted server (e.g. bree/smtp)
    //
    if (!ctx[API_RESTRICTED_SYMBOL]) log.is_restricted = false;

    // set the user if they're logged in
    if (ctx.isAuthenticated()) log.user = ctx.state.user._id;

    // store the log
    await Logs.create(log);

    ctx.logger.info('log created', { log, ignore_hook: true });

    ctx.body = 'OK';
  } catch (err) {
    if (err.is_duplicate_log) {
      ctx.logger.warn(err, { ignore_hook: true });
    } else {
      ctx.logger.error(err);
    }

    //
    // NOTE: koa-better-error-handler uses `err.status`
    // TODO: but we should modify it so that it uses `ctx.status` too if non-200)
    //
    err.status = 400;
    throw err;
  }
}

async function checkToken(ctx, next) {
  try {
    await policies.ensureApiToken(ctx, next);
  } catch (err) {
    const credentials = auth(ctx.req);
    if (typeof credentials !== 'undefined') ctx.logger.error(err);
    if (next) return next();
  }
}

module.exports = { parseLog, checkToken };
