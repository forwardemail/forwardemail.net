const auth = require('basic-auth');
const parseLogs = require('parse-logs');

const Logs = require('#models/log');
const policies = require('#helpers/policies');

const ERR_NOT_CONNECTED_NAMES = new Set([
  'MongoPoolClosedError',
  'MongoExpiredSessionError',
  'MongoNotConnectedError'
]);

//
// TODO: integrate logging into the other servers
//       and leverage the user's API key for logging
//
async function parseLog(ctx) {
  ctx.body = 'OK';
  try {
    const log = parseLogs(ctx.request);

    // log to context that we received log in the request
    ctx.logger[log.meta.level](
      log.err || log.message,
      Object.assign(
        log.meta,
        // prevent double recursive log
        { ignore_hook: true }
      )
    );

    // set the user if they're logged in
    if (ctx.isAuthenticated()) log.user = ctx.state.user._id;

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
