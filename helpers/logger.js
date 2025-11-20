/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Axe = require('axe');
const cuid = require('cuid');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const superagent = require('superagent');

//
// NOTE: we can't use `rfdc` because it's really not much faster than what we're doing
//       <https://github.com/davidmarkclements/rfdc/issues/50>
//
//
// NOTE: we can't use `structuredClone` or `@ungap/structured-clone` since they throw `DataCloneError`
//

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const mongoose = require('mongoose');

const loggerConfig = require('../config/logger');

const _ = require('./lodash');
const isCodeBug = require('./is-code-bug');
const isErrorConstructorName = require('./is-error-constructor-name');
const isMongoError = require('./is-mongo-error');
const isSSLError = require('./is-ssl-error');
const isSocketError = require('./is-socket-error');
const isTLSError = require('./is-tls-error');

const silentSymbol = Symbol.for('axe.silent');
const connectionNameSymbol = Symbol.for('connection.name');

// wrapper for browser condition
const hasMixin = mongoose && _ && _.mixin;

if (hasMixin) {
  // <https://stackoverflow.com/a/41978063>
  _.mixin(_, {
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
  'raw',

  // IMAP/POP3 specific
  'socket',
  'writeStream',
  'formatResponse',
  'getQueryResponse',
  'matchSearchQuery',
  'isUTF8Enabled',
  'db',
  'stream',

  // application specific
  'otp_recovery_keys',
  'api_token',
  'otp_token',
  'verification_pin',

  // redis object specific
  'auth',

  // oauth specific
  'google_access_token',
  'google_refresh_token',
  'github_access_token'
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

  // silent messages should be ignored from sending upstream
  if (meta[silentSymbol]) return;

  //
  // return early if we wish to ignore this
  // (this prevents recursion; see end of this fn)
  //
  if (meta.ignore_hook === true || (err && err.ignoreHook === true)) return;

  // return early on WS unknown error
  if (
    err &&
    ((err._message &&
      err._message.startsWith('WebSocket closed with reason: undefined')) ||
      (err.message &&
        err.message.startsWith('WebSocket closed with reason: undefined')))
  )
    // 1000 + 1006
    return;

  //
  // if it was a duplicate error then ignore it
  //
  if (err && err.is_duplicate_log) return;

  // write ECONNRESET
  // read ECONNRESET
  if (err && err.message === 'write ECONNRESET') return;
  if (err && err.message === 'read ECONNRESET') return;

  // unique hash (already exists)
  if (err.message === 'Hash is not unique.') return;

  // wrapper for non-browser condition
  if (mongoose && hasMixin) {
    // if it was SSL/TLS/socket error then ignore it
    if (isTLSError(err) || isSSLError(err) || isSocketError(err)) return;

    try {
      const conn = mongoose.connections.find(
        (conn) => conn[connectionNameSymbol] === 'JOURNALS_MONGO_URI'
      );
      if (!conn) throw new Error('Mongoose connection does not exist');
      if (!conn.models || !conn.models.Logs || !conn.models.Logs.create)
        throw new Error('Mongoose logs model not yet initialized');

      //
      // if there is a `meta.resolver` property
      // (which is a shared tangerine resolver instance)
      // then leverage that as the `resolver` property and delete it from `meta`
      //
      let resolver;
      if (
        meta.resolver &&
        meta.resolver.constructor &&
        meta.resolver.constructor.name === 'Tangerine'
      ) {
        resolver = meta.resolver;
        delete meta.resolver;
      }

      const log = new conn.models.Logs({ err, message, meta });
      if (resolver) log.resolver = resolver;

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

      //
      // NOTE: if we get a cyclic dependency error here
      //       it means that whatever object we're storing here
      //       has a cyclic dependency inside of it, which
      //       typically only happens on `log.err` e.g. `log.err.bounces`
      //       therefore we use this as a way to convert to [Circular] if needed
      //
      // this should never happen but it's a conditional safeguard
      if (_.isError(log.err)) log.err = JSON.parse(safeStringify(log.err));

      return log
        .save() // log.save() ensures pre-validate and pre-save hooks fire
        .then()
        .catch((err) => {
          // return early if it was a duplicate log being created
          if (err.is_duplicate_log) return;
          //
          // when tests close the connection closes so logs don't write
          //
          if (
            // eslint-disable-next-line n/prefer-global/process
            process.env.NODE_ENV === 'test' &&
            (isErrorConstructorName(err, 'MongoNotConnectedError') ||
              (isErrorConstructorName(err, 'ValidationError') &&
                isMongoError(err)))
          ) {
            return;
          }

          // unique hash (already exists)
          if (err.code === 11000 || err.message === 'Hash is not unique.')
            return;
          // duplicate denylist log
          if (err.is_denylist_without_domains) return;
          //
          // NOTE: this allows us to log mongodb timeout issues (e.g. due to slow queries)
          //
          // we should try to create and log the error that occurred
          // but we should indicate that we should ignore the next log hook
          console.error(err);
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
    if (typeof isCodeBug === 'function' && typeof err === 'object') {
      err = JSON.parse(safeStringify(parseErr(err)));
      // add `isCodeBug` parsing here to `err` (safeguard)
      err.isCodeBug = isCodeBug(err);
    }

    //
    // NOTE: we can't use `superjson` because they don't export CJS right now
    //       <https://github.com/blitz-js/superjson/issues/268#issuecomment-1863659516>
    //
    // clone the data so that we don't mutate it
    if (typeof message === 'object')
      message = JSON.parse(safeStringify(message));

    //
    // clone the data so that we don't mutate it
    //
    // NOTE: we preserve `resolver` on the meta object
    //
    if (typeof meta === 'object') {
      let resolver;
      if (
        meta.resolver &&
        meta.resolver.constructor &&
        meta.resolver.constructor.name === 'Tangerine'
      )
        resolver = meta.resolver;

      meta = JSON.parse(safeStringify(meta));
      if (resolver) meta.resolver = resolver;
    }

    //
    // TODO: merge this into axe
    //
    // safeguard to redact sensitive fields
    //
    // wrapper for browser condition
    if (mongoose && hasMixin) {
      err = _.deeply(_.mapValues)(err, function (val, key) {
        if (REDACTED_FIELDS.has(key)) {
          return 'REDACTED';
        }

        return val;
      });
    }

    const hash = meta && meta.app && meta.app.hash;
    // wrapper for browser condition
    if (mongoose && hasMixin) {
      meta = _.deeply(_.mapValues)(meta, function (val, key) {
        if (REDACTED_FIELDS.has(key)) {
          return 'REDACTED';
        }

        return val;
      });
    }

    if (hash) meta.app.hash = hash;

    if (
      (meta && meta.tnx) ||
      (typeof message === 'string' && message.includes(" tnx: '")) ||
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

logger.post('info', function (err, message, meta) {
  if (
    meta &&
    meta.is_http &&
    meta.response &&
    meta.response.duration &&
    meta.request &&
    meta.request.url &&
    meta.response.duration >= 10000 &&
    meta.request.method
  ) {
    const err = new TypeError(
      `${meta.request.method} ${meta.request.url} took longer than 10s`
    );
    err.isCodeBug = true;
    err.meta = meta;
    logger.fatal(err);
  }
});

module.exports = logger;
