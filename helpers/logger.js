const Axe = require('axe');
const Cabin = require('cabin');
const cuid = require('cuid');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const superagent = require('superagent');

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const mongoose = require('mongoose');

const loggerConfig = require('../config/logger');
const isCodeBug = require('./is-code-bug');

const silentSymbol = Symbol.for('axe.silent');
const connectionNameSymbol = Symbol.for('connection.name');

const logger = new Axe(loggerConfig);

//
// NOTE: if you update the two constants below,
//       then also update `app/models/log.js` similar usage
//
const IGNORED_CONTENT_TYPES = [
  'application/javascript; charset=utf-8',
  'application/manifest+json',
  'font',
  'image',
  'text/css'
];
// const NODEMAILER_LOGGER_COMPONENTS = new Set([
//   'smtp-transport',
//   'sendmail',
//   'OAuth2',
//   'smtp-connection',
//   'stream-transport',
//   'json-transport',
//   'mail',
//   'ses-transport',
//   'smtp-pool'
// ]);

// <https://github.com/cabinjs/axe/#send-logs-to-http-endpoint>
// eslint-disable-next-line complexity
async function hook(err, message, meta) {
  //
  // if it was not `error` or `fatal` then we must have the symbol set
  // in order for this log to get saved and stored
  //
  if (
    meta.level !== 'error' &&
    meta.level !== 'fatal' &&
    typeof meta.ignore_hook !== 'boolean'
  )
    return;

  //
  // return early if we wish to ignore this
  // (this prevents recursion; see end of this fn)
  //
  if (meta.ignore_hook === true || (err && err.ignoreHook === true)) return;

  //
  // if it was a duplicate error then ignore it
  //
  if (err && err.is_duplicate_log) return;

  // add `isCodeBug` parsing here to `err` (safeguard)
  if (typeof err === 'object') err.isCodeBug = isCodeBug(err);

  if (mongoose) {
    try {
      const conn = mongoose.connections.find(
        (conn) => conn[connectionNameSymbol] === 'LOGS_MONGO_URI'
      );
      if (!conn) throw new Error('Mongoose connection does not exist');
      if (!conn.models || !conn.models.Logs || !conn.models.Logs.create)
        throw new Error('Mongoose logs model not yet initialized');

      const log = { err, message, meta };

      if (typeof log.meta === 'object') {
        // user
        if (
          typeof log.meta.user === 'object' &&
          typeof log.meta.user.id === 'string' &&
          mongoose.Types.ObjectId.isValid(log.meta.user.id)
        )
          log.user = new mongoose.Types.ObjectId(log.meta.user.id);
        else if (
          typeof log.meta.user === 'object' &&
          mongoose.Types.ObjectId.isValid(log.meta.user)
        )
          log.user = log.meta.user;

        // domains
        if (Array.isArray(log.meta.domains)) {
          const domains = [];
          for (const d of log.meta.domains) {
            if (typeof d === 'object' && mongoose.Types.ObjectId.isValid(d))
              domains.push(d);
          }

          if (domains.length > 0) log.domains = domains;
        }

        // email
        if (
          typeof log.meta.email === 'object' &&
          typeof log.meta.email.id === 'string' &&
          mongoose.Types.ObjectId.isValid(log.meta.email.id)
        )
          log.email = new mongoose.Types.ObjectId(log.meta.email.id);
        else if (
          typeof log.meta.email === 'object' &&
          mongoose.Types.ObjectId.isValid(log.meta.email)
        )
          log.email = log.meta.email;
      }

      return conn.models.Logs.create(log)
        .then((log) => logger.info('log created', { log, ignore_hook: true }))
        .catch((err) => {
          //
          // NOTE: this allows us to log mongodb timeout issues (e.g. due to slow queries)
          //
          // we should try to create and log the error that occurred
          // but we should indicate that we should ignore the next log hook
          if (meta.ignore_next_hook) logger.error(err, { ignore_hook: true });
          else logger.error(err, { ignore_next_hook: true });
        });
    } catch (err) {
      logger.error(err, { ignore_hook: true });
    }

    return;
  }

  try {
    // eslint-disable-next-line no-undef
    if (typeof window !== 'object' || typeof window.API_URL !== 'string')
      throw new Error('API URL was not in the window global');

    // TODO: replace this with undici on server side
    const request = superagent
      // eslint-disable-next-line no-undef
      .post(`${window.API_URL}/v1/log`)
      // if the meta object already contained a request ID then re-use it
      // otherwise generate one that gets re-used in the API log request
      // (which normalizes server/browser request id formatting)
      .set(
        'X-Request-Id',
        meta && meta.request && meta.request.id ? meta.request.id : cuid()
      )
      .set('X-Axe-Version', logger.config.version)
      .timeout(5000);

    // eslint-disable-next-line no-undef
    if (typeof window.API_TOKEN === 'string') request.auth(window.API_TOKEN);

    return request
      .type('application/json')
      .retry(3)
      .send(safeStringify({ err: parseErr(err), message, meta }))
      .then((response) =>
        logger.info('log sent over HTTP', { response, ignore_hook: true })
      )
      .catch((err) => logger.error(err, { ignore_hook: true }));
  } catch (err) {
    logger.error(err, { ignore_hook: true });
  }
}

//
// set the silent symbol in axe to true for successful asset responses
//
for (const level of logger.config.levels) {
  logger.pre(level, function (err, message, meta) {
    if (
      meta.is_http &&
      meta.response &&
      meta.response.status_code &&
      // ignore common assets for successful requests
      // (we want to see in the console the ones that errored, e.g. 5xx)
      meta.response.status_code < 400 &&
      // ignore common assets that were not modified (cached)
      (meta.response.status_code === 304 ||
        // ignore common assets like images and fonts
        (meta.response.headers &&
          meta.response.headers['content-type'] &&
          IGNORED_CONTENT_TYPES.some((c) =>
            meta.response.headers['content-type'].startsWith(c)
          )) ||
        // ignore JavaScript and CSS source map files
        (meta.request &&
          meta.request.url &&
          meta.response.headers &&
          meta.response.headers['content-type'] &&
          meta.response.headers['content-type'].startsWith(
            'application/json'
          ) &&
          (meta.request.url.endsWith('.css.map') ||
            meta.request.url.endsWith('.js.map'))))
    )
      meta[silentSymbol] = true;
    //
    // TODO: we want to ignore nodemailer transport shared logger
    // note that this list of constants was found from using ripgrep
    // (e.g. we ran `rg "component" node_modules/nodemailer` to get the list)
    // <https://github.com/nodemailer/nodemailer/issues/1489>
    //
    // if (
    //   isSANB(meta.component) &&
    //   NODEMAILER_LOGGER_COMPONENTS.has(meta.component)
    // )
    //   meta[silentSymbol] = true;
    return [err, message, meta];
  });

  logger.post(level, hook);
}

// setup our Cabin instance
const cabin = new Cabin({ logger });

// set the user if we're logged in
// eslint-disable-next-line no-undef
if (typeof window === 'object' && typeof window.USER === 'object')
  // eslint-disable-next-line no-undef
  cabin.setUser(window.USER);

module.exports = cabin;
