const { Buffer } = require('buffer');

const _ = require('lodash');
const bytes = require('bytes');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const splitLines = require('split-lines');
const { convert } = require('html-to-text');
const { detect } = require('tinyld');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Users = require('./users');
const Domains = require('./domains');

const config = require('#config');

const ERR_DUP_LOG = new Error('Duplicate log in past hour prevented');
ERR_DUP_LOG.is_duplicate_log = true;

//
// MongoDB supported language mapping with tinyld
// <https://github.com/komodojp/tinyld>
// <https://www.mongodb.com/docs/manual/reference/text-search-languages/#text-search-languages>
//
const LANGUAGES = {
  da: 'danish',
  nl: 'dutch',
  en: 'english',
  fi: 'finnish',
  fr: 'french',
  de: 'german',
  hu: 'hungarian',
  it: 'italian',
  nb: 'norwegian',
  pt: 'portuguese',
  ro: 'romanian',
  ru: 'russian',
  es: 'spanish',
  sv: 'swedish',
  tr: 'turkish'
};

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
  // TODO: for the job that sets domains array, also set `language` field on documents without it
  // for text search, the language used for stopwords is based off
  // `language` field (note that we have `locale` in other docs)
  // <https://www.mongodb.com/docs/manual/tutorial/specify-language-for-text-index/>
  language: {
    type: String,
    enum: Object.values(LANGUAGES)
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: Users
  },
  //
  // NOTE: this is a snapshot array of domains that correlated to this log at the created_at time
  //       and this is accomplished by both a pre('save') hook and also a job
  //       that runs indefinitely to process 1000 logs at a time
  //
  //       - we always parse `meta.session.envelope.mailFrom.address` hostname (in case the email was attempting to be sent by them to them)
  //       - we parse `meta.session.envelope.rcptTo[x].address` hostname (note we need to checkSRS)
  //       - we lookup the verification record with redis/dns cache lookup
  //       - then we check our DB for all distinct domain values with those record pairs (needs domain + record match)
  //
  //       also note that when we render these logs upon lookup to the user
  //       we strip the other sensitive data (since RCPT TO could be to multiple separate users on our system)
  //       (e.g. RCPT TO: a@a.com and b@b.com, whereas a.com and b.com are two completely separate and private users)
  //
  domains: [
    {
      type: mongoose.Schema.ObjectId,
      ref: Domains
    }
  ],
  err: mongoose.Schema.Types.Mixed,
  message: {
    type: String,
    required: true,
    index: true
  },
  meta: mongoose.Schema.Types.Mixed,
  //
  // NOTE: `mongoose-common-plugin` will automatically set `timestamps` for us
  // <https://github.com/Automattic/mongoose/blob/b2af0fe4a74aa39eaf3088447b4bb8feeab49342/test/timestamps.test.js#L123-L137>
  //
  created_at: {
    type: Date,
    expires: '7d'
  },
  is_restricted: {
    type: Boolean,
    default: false
  }
});

Logs.plugin(mongooseCommonPlugin, {
  object: 'log',
  locale: false
});

// create full text search index on message
// TODO: we may also want to do this for `err.message`
Logs.index({ message: 'text' }, { default_language: 'english' });

//
// create sparse (now known as "partial" indices) on common log queries
// <https://www.mongodb.com/docs/manual/core/index-partial/#comparison-with-sparse-indexes>
//
const PARTIAL_INDICES = [
  'err.responseCode',
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
  // TODO: finish `domains` integration and partial index
  'domains',
  'is_restricted'
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
// NOTE: this comes after validate because validation ensures `required: true`
// - before saving ensure that the `message` is converted from html to text
// - before saving ensure that language is set properly based off detected
//   language from the `message` property using the `tinyld` package
//
Logs.pre('save', function (next) {
  try {
    // tokenization and search will be more accurate without HTML in messages
    this.message = convert(this.message, {
      wordwrap: false,
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'ul', options: { itemPrefix: ' ' } },
        {
          selector: 'a',
          options: { baseUrl: config.urls.web, linkBrackets: false }
        }
      ]
    });
    // splitLines and join by space
    // (we don't want `\n` in messages since it's irrelevant for search)
    this.message = splitLines(this.message)
      .map((str) => str.trim())
      .join(' ');
    // language detection will be more accurate without HTML in messages
    const language = detect(this.message);
    this.language = LANGUAGES[language] || 'none';
    next();
  } catch (err) {
    next(err);
  }
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

    if (bytes > MAX_BYTES) throw new Error('Log byte size exceeds maximum');

    //
    // prepare db query for uniqueness
    //
    const $and = [];

    //
    // group together HTTP related queries into one conditional for performance
    //
    if (this?.meta?.is_http) {
      // ignore 304 not modified content w/o a content-type response
      if (
        this?.meta?.response?.status_code === 304 &&
        !this?.meta?.response?.headers?.['content-type']
      )
        throw ERR_DUP_LOG;

      // don't store logs for fonts, images, and other assets
      if (
        this?.meta?.response?.headers?.['content-type'] &&
        IGNORED_CONTENT_TYPES.some((c) =>
          this.meta.response.headers['content-type'].startsWith(c)
        )
      )
        throw ERR_DUP_LOG;

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
        throw ERR_DUP_LOG;

      //
      // logs have at least one of the following:
      // - log.is_restricted (this means it was sent by bree, mx1, or mx2)
      // - log.user (this is a ObjectID user reference, e.g. website traffic)
      // - log.meta.user.ip_address
      //
      // if it was from a trusted and restricted server
      // or if it had an authenticated user assigned
      // then we can assume that the request ID's were not spoofed
      // however they could still be spoofed by the user themselves
      // that is why we do not look for distinct `X-Request-Id`
      // ('meta.request.id' nor 'meta.response.headers.x-request-id')
      //
      // NOTE: this is commented out due to above
      // filter by meta request id (X-Request-Id)
      // if (this?.meta?.request?.id)
      //   $and.push(
      //     {
      //       'meta.request.id': this.meta.request.id
      //     },
      //     {
      //       'meta.request.id': { $exists: true }
      //     }
      //   );
      //
      // NOTE: this is commented out due to above
      // filter by meta response headers (X-Request-Id)
      // if (this?.meta?.response?.headers?.['x-request-id'])
      //   $and.push(
      //     {
      //       'meta.response.headers.x-request-id':
      //         this.meta.response.headers['x-request-id']
      //     },
      //     {
      //       'meta.response.headers.x-request-id': { $exists: true }
      //     }
      //   );

      // if no user but if had a metadata IP address
      if (!this?.user && this?.meta?.user?.ip_address) {
        $and.push(
          {
            'meta.user.ip_address': this.meta.user.ip_address
          },
          {
            'meta.user.ip_address': {
              $exists: true
            }
          }
        );
      }

      // check meta.response.status_code
      //       + meta.request.method
      //       + meta.request.url
      if (
        this?.meta?.response?.status_code &&
        this?.meta?.request?.method &&
        this?.meta?.request?.url
      ) {
        $and.push(
          {
            'meta.response.status_code': this.meta.response.status_code,
            'meta.request.method': this.meta.request.method,
            'meta.request.url': this.meta.request.url
          },
          {
            'meta.response.status_code': { $exists: true },
            'meta.request.method': { $exists: true },
            'meta.request.url': { $exists: true }
          }
        );
      }
    }

    //
    // log.meta.level (log level)
    //
    // NOTE: also using this level, we can set a date query range
    // the log must be created within past hour
    // but if it's a fatal or error level, within past 10 minutes
    //
    const $gte =
      this?.meta?.level && ['error', 'fatal'].includes(this.meta.level)
        ? dayjs().subtract(10, 'minutes').toDate()
        : dayjs().subtract(1, 'hour').toDate();

    if (this?.meta?.level) {
      $and.push(
        {
          'meta.level': this.meta.level
        },
        {
          'meta.level': { $exists: true }
        }
      );
    }

    if (!this?.meta?.is_http) {
      //
      // NOTE: if it was an HTTP request, then the `message` would always be unique
      //       (e.g. the response time might slightly vary in the message string)
      //
      // if (this?.message) $and.push({ $text: { $search: this.message } });
      if (this?.message)
        $and.push({
          message: this.message
        });
      //
      // if it was not an HTTP request then include date query
      // (we don't want the server itself to pollute the db on its own)
      //
      $and.push({
        created_at: { $gte }
      });
    }

    // if it was restricted or not
    if (typeof this.is_restricted === 'boolean')
      $and.push(
        {
          is_restricted: this.is_restricted
        },
        {
          is_restricted: { $exists: true }
        }
      );

    // if had a user
    if (this?.user) {
      $and.push(
        {
          user: this.user
        },
        {
          user: { $exists: true }
        }
      );
    }

    // TODO: if err.responseCode and !err.bounces && !meta.session.resolvedClientHostname && meta.session.remoteAddress
    // TODO: else if err.responseCode and !err.bounces && meta.session.allowlistValue
    // TODO: else if err.responseCode and !err.bounces && meta.session.resolvedClientHostname
    // TODO: meta.session.fingerprint
    // TODO: check count over time period for abuse

    // safeguard to prevent empty query
    if ($and.length === 0) throw ERR_DUP_LOG;

    const count = await this.constructor.countDocuments({ $and });

    if (count > 0) throw ERR_DUP_LOG;

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
