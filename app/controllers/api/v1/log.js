const auth = require('basic-auth');
const parseLogs = require('parse-logs');

const env = require('#config/env');
const Logs = require('#models/logs');
const policies = require('#helpers/policies');

const API_RESTRICTED_SYMBOL = Symbol.for(env.API_RESTRICTED_SYMBOL);

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
    // TODO: 1d log retention for users on enhanced plan (domain.plan or user.plan)
    // TODO: 30d log retention for users on team plan (domain.plan or user.plan)
    // TODO: ensure err.isCodeBug is not rendered to user
    //
    if (ctx[API_RESTRICTED_SYMBOL]) {
      log.is_restricted = true;
      // TODO: if there were any dns errors then run background job for cleanup on those
      // TODO: lookup the domain by verification_record and store domain id
      //
      // log.domains = [ domain._id, ... ]
      //
      // parse by either:
      //
      // meta.err.bounces[x].address
      //
      // (OR)
      //
      // meta.session.envelope.rcptTo[x].address <-- needs check SRS reversed
      //
      // TODO: we should also store dkim, dmarc, spf, etc info that we do for webhooks here
      //
    } else if (ctx.isAuthenticated()) {
      // set the user if they're logged in
      log.user = ctx.state.user._id;
    }

    // store the log
    Logs.create(log)
      .then((log) => ctx.logger.info('log created', { log, ignore_hook: true }))
      .catch((err) => ctx.logger.fatal(err, { ignore_hook: true }));
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
