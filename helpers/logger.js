const Axe = require('axe');
const Cabin = require('cabin');
const safeStringify = require('fast-safe-stringify');
const cuid = require('cuid');
const superagent = require('superagent');
// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const mongoose = require('mongoose');

const loggerConfig = require('../config/logger');

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const Logs = require('#models/log');

const logger = new Axe(loggerConfig);

const ERR_NOT_CONNECTED_NAMES = new Set([
  'MongoPoolClosedError',
  'MongoExpiredSessionError',
  'MongoNotConnectedError'
]);

// <https://github.com/cabinjs/axe/#send-logs-to-http-endpoint>
async function hook(err, message, meta) {
  //
  // return early if we wish to ignore this
  // (this prevents recursion; see end of this fn)
  //
  if (meta.ignore_hook) return;

  try {
    // eslint-disable-next-line no-undef
    if (typeof window !== 'object') {
      const log = await Logs.create(
        // eslint-disable-next-line prefer-object-spread
        Object.assign(
          {
            err,
            message,
            meta
          },
          // parse `user` from `meta` object if this was associated with a specific user
          meta && meta.user && meta.user.id
            ? { user: new mongoose.Types.ObjectId(meta.user.id) }
            : {}
        )
      );
      logger.info('log created', { log, ignore_hook: true });
      return;
    }

    // eslint-disable-next-line no-undef
    if (typeof window.API_URL !== 'string')
      throw new Error('API URL was not in the window global');

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

    const response = await request
      .type('application/json')
      .retry(3)
      .send(safeStringify({ err, message, meta }));

    logger.info('log sent over HTTP', { response, ignore_hook: true });
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
    logger.fatal(err, { ignore_hook: true });
  }
}

for (const level of ['error', 'fatal']) {
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
