/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Axe = require('axe');
const Cabin = require('cabin');
const cuid = require('cuid');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const superagent = require('superagent');

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const _ = require('lodash');

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const mongoose = require('mongoose');

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
let structuredClone = require('@ungap/structured-clone');

if (structuredClone) structuredClone = structuredClone.default;

const loggerConfig = require('../config/logger');
const isCodeBug = require('./is-code-bug');

const silentSymbol = Symbol.for('axe.silent');
const connectionNameSymbol = Symbol.for('connection.name');

// wrapper for browser condition
const hasMixin = _ && typeof _ === 'object' && typeof _.mixin === 'function';
if (hasMixin) {
  // <https://stackoverflow.com/a/41978063>
  _.mixin({
    deeply(map) {
      // <https://stackoverflow.com/a/48032359>
      const deeplyArray = function (obj, fn) {
        return obj.map(function (x) {
          return _.isPlainObject(x) ? _.deeply(map)(x, fn) : x;
        });
      };

      return function (obj, fn) {
        if (_.isArray(obj)) return deeplyArray(obj, fn);

        return map(
          _.mapValues(obj, function (v) {
            return _.isPlainObject(v)
              ? _.deeply(map)(v, fn)
              : _.isArray(v)
              ? deeplyArray(v, fn)
              : v;
          }),
          fn
        );
      };
    }
  });
}

const logger = new Axe(loggerConfig);

const REDACTED_FIELDS = new Set([
  'body',
  'data',
  'password',
  'new_password',
  'pass',
  'passkeys',
  'token',
  'tokens',
  'hash',
  'hashes',
  'salt',
  'tls',
  'ssl',
  'key',
  'cert',
  'ca',
  'dhparam',
  'private_key',
  'dkim_private_key',
  'raw'
]);

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

  // wrapper for browser condition
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
          mongoose.isObjectIdOrHexString(log.meta.user.id)
        )
          log.user = new mongoose.Types.ObjectId(log.meta.user.id);
        else if (
          typeof log.meta.user === 'object' &&
          mongoose.isObjectIdOrHexString(log.meta.user)
        )
          log.user = log.meta.user;

        // domains
        if (Array.isArray(log.meta.domains)) {
          const domains = [];
          for (const d of log.meta.domains) {
            if (typeof d === 'object' && mongoose.isObjectIdOrHexString(d))
              domains.push(d);
          }

          if (domains.length > 0) log.domains = domains;
        }

        // email
        if (
          typeof log.meta.email === 'object' &&
          typeof log.meta.email.id === 'string' &&
          mongoose.isObjectIdOrHexString(log.meta.email.id)
        )
          log.email = new mongoose.Types.ObjectId(log.meta.email.id);
        else if (
          typeof log.meta.email === 'object' &&
          mongoose.isObjectIdOrHexString(log.meta.email)
        )
          log.email = log.meta.email;
      }

      return conn.models.Logs.create(log)
        .then()
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
      .send(safeStringify({ err, message, meta }))
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
  // eslint-disable-next-line complexity
  logger.pre(level, function (err, message, meta) {
    //
    // NOTE: we delete `err.response` from object since PayPal adds it
    // (otherwise we get a cyclic dependency BSONError error)
    //
    // node_modules/.pnpm/paypal-rest-sdk@1.8.1/node_modules/paypal-rest-sdk/lib/client.js
    // 122-                    name: 'Invalid JSON Response Received, JSON Parse Error.'
    // 123-                };
    // 124:                err.response = response;
    // 125-                err.httpStatusCode = res.statusCode;
    // 126-                response = null;
    // --
    // 131-                // response contains the full json description of the error
    // 132-                // that PayPal returns and information link
    // 133:                err.response = response;
    // 134-                if (process.env.PAYPAL_DEBUG) {
    // 135-                    err.response_stringified = JSON.stringify(response);
    //
    if (err && err.httpStatusCode) delete err.response;

    // clone the data so that we don't mutate it
    // <https://nodejs.org/api/globals.html#structuredclonevalue-options>
    // <https://github.com/ungap/structured-clone>
    if (typeof err === 'object') err = parseErr(err);

    //
    // NOTE: we can't use `superjson` because they don't export CJS right now
    //       <https://github.com/blitz-js/superjson/issues/268#issuecomment-1863659516>
    //
    if (typeof message === 'object' && structuredClone) {
      // clone the data so that we don't mutate it
      // <https://nodejs.org/api/globals.html#structuredclonevalue-options>
      // <https://github.com/ungap/structured-clone>
      message = structuredClone(message, {
        // avoid throwing
        lossy: true,
        // avoid throwing *and* looks for toJSON
        json: true
      });
    }

    if (typeof meta === 'object' && structuredClone) {
      // clone the data so that we don't mutate it
      // <https://nodejs.org/api/globals.html#structuredclonevalue-options>
      // <https://github.com/ungap/structured-clone>
      meta = structuredClone(meta, {
        // avoid throwing
        lossy: true,
        // avoid throwing *and* looks for toJSON
        json: true
      });
    }

    // add `isCodeBug` parsing here to `err` (safeguard)
    if (typeof err === 'object') err.isCodeBug = isCodeBug(err);

    //
    // TODO: merge this into axe
    //
    // safeguard to redact sensitive fields
    //
    // wrapper for browser condition
    if (hasMixin) {
      err = _.deeply(_.mapValues)(err, function (val, key) {
        if (REDACTED_FIELDS.has(key)) {
          return 'REDACTED';
        }

        return val;
      });
    }

    const hash = meta && meta.app && meta.app.hash;
    // wrapper for browser condition
    if (hasMixin) {
      meta = _.deeply(_.mapValues)(meta, function (val, key) {
        if (REDACTED_FIELDS.has(key)) {
          return 'REDACTED';
        }

        return val;
      });
    }

    if (hash) meta.app.hash = hash;

    if (
      (meta && meta.ignore_hook === true) ||
      (err && err.is_duplicate_log === true) ||
      (err && err.ignoreHook === true)
    )
      meta[silentSymbol] = true;

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
