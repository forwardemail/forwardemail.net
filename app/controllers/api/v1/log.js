const auth = require('basic-auth');
const parseLogs = require('parse-logs');

const env = require('#config/env');
const Logs = require('#models/log');
const policies = require('#helpers/policies');

const API_RESTRICTED_SYMBOL = Symbol.for(env.API_RESTRICTED_SYMBOL);
const ERR_NOT_CONNECTED_NAMES = new Set([
  'MongoPoolClosedError',
  'MongoExpiredSessionError',
  'MongoNotConnectedError'
]);

async function parseLog(ctx) {
  ctx.body = 'OK';
  try {
    const log = ctx[API_RESTRICTED_SYMBOL]
      ? ctx.request.body
      : parseLogs(ctx.request);

    //
    // if it utilized restricted basic auth middleware
    // then we can assume it's a trusted server (e.g. bree/smtp)
    // TODO: we can have prompts to upgrade for buttons "Allow Email" if user on free)
    // TODO: weekly digest email + dashboard + visual charts + real-time metric counters
    // TODO: 1d log retention for users on enhanced plan
    // TODO: 30d log retention for users on team plan
    // TODO: ensure err.isCodeBug is not rendered to user
    //
    if (ctx[API_RESTRICTED_SYMBOL]) {
      // TODO: lookup the domain by verification_record and store domain id
    } else if (ctx.isAuthenticated()) {
      // set the user if they're logged in
      log.user = ctx.state.user._id;
    }

    // store the log
    try {
      const _log = await Logs.create(log);
      ctx.logger.info('log created', { log: _log, ignore_hook: true });
    } catch (err) {
      // if it was a duplicate log then return early
      if (err.is_duplicate_log) return;
      // if @ladjs/graceful was disconnected mongo/mongoose then we can't write to db
      if (
        err &&
        (ERR_NOT_CONNECTED_NAMES.has(err.name) ||
          (err.errors &&
            err.errors._id &&
            err.errors._id.reason &&
            err.errors._id.reason.name &&
            ERR_NOT_CONNECTED_NAMES.has(err.errors._id.reason.name)))
      )
        return;
      ctx.logger.fatal(err, { ignore_hook: true });
    }
  } catch (err) {
    ctx.logger.error(err);
  }
}

async function checkToken(ctx, next) {
  try {
    await policies.ensureApiToken(ctx, next);
  } catch (err) {
    const credentials = auth(ctx.req);
    if (typeof credentials !== 'undefined') ctx.logger.error(err);
    return next();
  }
}

module.exports = { parseLog, checkToken };
