const { Buffer } = require('buffer');

const _ = require('lodash');
const bytes = require('bytes');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Users = require('./users');
const Domains = require('./domains');

const ERR_DUP_LOG = new Error('Duplicate log in past hour prevented');
ERR_DUP_LOG.is_duplicate_log = true;

//
// NOTE: if you update this, then also update `helpers/logger.js` similar usage
//
const IGNORED_CONTENT_TYPES = [
  'application/javascript; charset=utf-8',
  'application/manifest+json',
  'font',
  'image',
  'text/css'
];

const MAX_BYTES = bytes('20KB');

const Logs = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: Users
  },
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: Domains
  },
  err: mongoose.Schema.Types.Mixed,
  message: String,
  meta: mongoose.Schema.Types.Mixed,
  //
  // NOTE: `mongoose-common-plugin` will automatically set `timestamps` for us
  // <https://github.com/Automattic/mongoose/blob/b2af0fe4a74aa39eaf3088447b4bb8feeab49342/test/timestamps.test.js#L123-L137>
  //
  created_at: {
    type: Date,
    expires: ms('1d')
  }
});

Logs.plugin(mongooseCommonPlugin, {
  object: 'log',
  locale: false
});

//
// create sparse (now known as "partial" indices) on common log queries
// <https://www.mongodb.com/docs/manual/core/index-partial/#comparison-with-sparse-indexes>
//
const PARTIAL_INDICES = [
  'err.message',
  'message',
  'meta.is_http', // used for search
  'meta.level',
  'meta.request.id',
  'meta.request.method',
  'meta.request.url',
  'meta.response.headers.content-type',
  'meta.response.headers.x-request-id',
  'meta.response.status_code',
  'meta.user.ip_address',
  'meta.app.hostname',
  'user',
  'domain'
];

for (const index of PARTIAL_INDICES) {
  Logs.index(
    { [index]: 1 },
    {
      partialFilterExpression: {
        [index]: { $exists: true }
      }
    }
  );
}

//
// before saving a log ensure that `err` and `meta.err` are parsed
// (this helps with server-side log saving, and for client-side we parseErr in advance)
//
Logs.pre('validate', function (next) {
  if (_.isError(this.err)) this.err = parseErr(this.err);
  if (_.isError(this.meta.err)) this.meta.err = parseErr(this.meta.err);
  next();
});

//
// we don't want to pollute our db with 404's and 429's
// in addition to API endpoint rate limiting we check for duplicates
//
// eslint-disable-next-line complexity
Logs.pre('save', async function (next) {
  try {
    //
    // ensure the document is not more than 20 KB
    // (prevents someone from sending huge client-side payloads)
    //
    const bytes = Buffer.byteLength(safeStringify(this.toObject()), 'utf8');

    if (bytes > MAX_BYTES)
      return next(new Error('Log byte size exceeds maximum'));

    //
    // prepare db query for uniqueness
    //
    const $and = [];
    const $or = [];

    //
    // group together HTTP related queries into one conditional for performance
    //
    if (this?.meta?.is_http) {
      // ignore 304 not modified content w/o a content-type response
      if (
        this?.meta?.response?.status_code === 304 &&
        !this?.meta?.response?.headers?.['content-type']
      )
        return next(ERR_DUP_LOG);

      // don't store logs for fonts, images, and other assets
      if (
        this?.meta?.response?.headers?.['content-type'] &&
        IGNORED_CONTENT_TYPES.some((c) =>
          this.meta.response.headers['content-type'].startsWith(c)
        )
      )
        return next(ERR_DUP_LOG);

      // don't store logs for JavaScript and CSS source map files
      if (
        this?.meta?.request?.url &&
        this?.meta?.response?.headers?.['content-type'] &&
        this.meta.response.headers['content-type'].startsWith(
          'application/json'
        ) &&
        (this.meta.request.url.endsWith('.css.map') ||
          this.meta.request.url.endsWith('.js.map'))
      )
        return next(ERR_DUP_LOG);

      // filter by meta request id (X-Request-Id)
      if (this?.meta?.request?.id)
        $or.push({
          'meta.request.id': this.meta.request.id
        });

      // filter by meta response headers (X-Request-Id)
      if (this?.meta?.response?.headers?.['x-request-id'])
        $or.push({
          'meta.response.headers.x-request-id':
            this.meta.response.headers['x-request-id']
        });

      // if no user but if had a metadata IP address
      if (!this?.user && this?.meta?.user?.ip_address)
        $and.push({
          'meta.user.ip_address': this.meta.user.ip_address
        });

      // check meta.response.status_code
      //       + meta.request.method
      //       + meta.request.url
      if (
        this?.meta?.response?.status_code &&
        this?.meta?.request?.method &&
        this?.meta?.request?.url
      )
        $and.push({
          'meta.response.status_code': this.meta.response.status_code,
          'meta.request.method': this.meta.request.method,
          'meta.request.url': this.meta.request.url
        });
    } else if (this?.message) {
      //
      // NOTE: if it was a request, then the `message` would always be unique
      //       (e.g. the response time might slightly vary)
      //
      $and.push({ message: this.message });
    }

    //
    // log.meta.level (log level)
    //
    // NOTE: also using this level, we can set a date query range
    // the log must be created within past hour
    // but if it's a fatal or error level, within past 10 minutes
    //
    let $gte = dayjs().subtract(1, 'hour').toDate();
    if (this?.meta?.level) {
      $and.push({
        'meta.level': this.meta.level
      });
      if (['error', 'fatal'].includes(this.meta.level))
        $gte = dayjs().subtract(10, 'minutes').toDate();
    }

    //
    // if it was not an HTTP request then include date query
    // (we don't want the server itself to pollute the db on its own)
    //
    if (!this?.meta?.is_http)
      $and.push({
        created_at: { $gte }
      });

    // if had a user
    if (this?.user)
      $and.push({
        user: this.user
      });

    // check err.message
    if (this?.err?.message) $or.push({ 'err.message': this.err.message });

    // push the $or to the $and arr
    if ($or.length > 0) $and.push({ $or });

    // safeguard to prevent empty query
    if ($and.length === 0) return next(ERR_DUP_LOG);

    const count = await this.constructor.countDocuments({ $and });

    if (count > 0) return next(ERR_DUP_LOG);

    next();
  } catch (err) {
    next(err);
  }
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Logs', Logs);
