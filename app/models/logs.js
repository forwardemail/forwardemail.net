const dns = require('dns');
const os = require('os');
const { Buffer } = require('buffer');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const ansiHTML = require('ansi-html-community');
const bytes = require('bytes');
const captainHook = require('captain-hook');
const dayjs = require('dayjs-with-plugins');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const pMap = require('p-map');
const parseErr = require('parse-err');
const regexParser = require('regex-parser');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { isEmail } = require('validator');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Users = require('./users');
const Domains = require('./domains');
const Emails = require('./emails');

const emailHelper = require('#helpers/email');
const parseRootDomain = require('#helpers/parse-root-domain');
const config = require('#config');
const logger = require('#helpers/logger');
const createTangerine = require('#helpers/create-tangerine');

const PREFIX = `${config.recordPrefix}-site-verification=`;
const concurrency = os.cpus().length;
const webSharedConfig = sharedConfig('WEB');
// TODO: we should find a way to share the existing redis connection
const redis = new Redis(
  webSharedConfig.redis,
  logger,
  webSharedConfig.redisMonitor
);

const resolver = createTangerine(redis, logger);

const graceful = new Graceful({
  redisClients: [redis]
});
graceful.listen();

//
// MongoDB supported language mapping with tinyld
// <https://github.com/komodojp/tinyld>
// <https://www.mongodb.com/docs/manual/reference/text-search-languages/#text-search-languages>
//
/*
const LANGUAGES = {
  dan: 'danish',
  nld: 'dutch',
  eng: 'english',
  fin: 'finnish',
  fra: 'french',
  deu: 'german',
  hun: 'hungarian',
  ita: 'italian',
  nob: 'norwegian',
  por: 'portuguese',
  ron: 'romanian',
  rus: 'russian',
  esa: 'spanish',
  swe: 'swedish',
  tur: 'turkish'
};
*/

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

const DNS_ERROR_CODES = new Set([
  dns.CANCELLED,
  dns.CONNREFUSED,
  dns.TIMEOUT,
  dns.BADRESP
]);

const MAX_BYTES = bytes('1MB');

const Logs = new mongoose.Schema({
  hash: {
    type: String,
    index: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: Users
  },
  domains: [
    {
      type: mongoose.Schema.ObjectId,
      ref: Domains,
      index: true
    }
  ],
  // <https://www.mongodb.com/community/forums/t/what-is-the-most-performant-way-to-check-an-array-field-is-not-empty/217392/3>
  is_empty_domains: {
    type: Boolean,
    index: true,
    default: true
  },
  email: {
    type: mongoose.Schema.ObjectId,
    ref: Emails
  },
  domains_checked_at: Date,
  err: mongoose.Schema.Types.Mixed,
  text_message: {
    type: String
  },
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
    expires: config.logRetention
  },
  is_restricted: {
    type: Boolean,
    default: true
  }
});

Logs.virtual('skip_duplicate_check')
  .get(function () {
    return this.__skip_duplicate_check;
  })
  .set(function (skipDuplicateCheck) {
    this.__skip_duplicate_check = boolean(skipDuplicateCheck);
  });

Logs.plugin(captainHook);

Logs.plugin(mongooseCommonPlugin, {
  object: 'log',
  locale: false
});

// TODO: can we remove this?
// create full text search index on message
Logs.index({ text_message: 'text' }, { default_language: 'english' });

//
// create sparse (now known as "partial" indices) on common log queries
// <https://www.mongodb.com/docs/manual/core/index-partial/#comparison-with-sparse-indexes>
//
const PARTIAL_INDICES = [
  'email', // conditionally exists if related to a given outbound email
  'err.isCodeBug',
  'err.responseCode',
  'meta.is_http', // used for search
  'meta.level',
  'meta.request.id',
  'meta.request.method',
  'meta.request.pathname',
  'meta.request.url',
  'meta.response.headers.content-type',
  'meta.response.headers.x-request-id',
  'meta.response.status_code',
  'meta.user.ip_address',
  'meta.app.hostname',
  'user',
  'domains',
  'domains_checked_at',
  'is_restricted',
  // TODO: most likely need to optimize this in another way besides $exists
  'meta.session.envelope.rcptTo.address',
  'meta.err.responseCode',
  'meta.session.resolvedClientHostname',
  'meta.session.remoteAddress',
  'meta.session.envelope.mailFrom.address',
  'meta.session.originalFromAddress'
  // meta.session.headers
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
    // convert ansi (chalk) colors to html (mainly for HTTP request logging)
    this.text_message = ansiHTML(this.message);
    // tokenization and search will be more accurate without HTML in messages
    this.text_message = convert(this.text_message, {
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
    this.text_message = splitLines(this.text_message)
      .map((str) => str.trim())
      .join(' ');
    next();
  } catch (err) {
    next(err);
  }
});

Logs.pre('validate', function (next) {
  //
  // ensure the document is not more than 20 KB
  // (prevents someone from sending huge client-side payloads)
  //
  try {
    // if it is a request to POST /v1/emails
    // then we need to delete the body from request
    if (
      this?.meta?.is_http &&
      this?.meta?.request?.pathname === '/v1/emails' &&
      this?.meta?.request?.url === '/v1/emails' &&
      this?.meta?.request?.body
    )
      delete this.meta.request.body;

    const bytes = Buffer.byteLength(safeStringify(this.toObject()), 'utf8');
    if (bytes > MAX_BYTES) throw new Error('Log byte size exceeds maximum');

    next();
  } catch (err) {
    err.is_duplicate_log = true;
    next(err);
  }
});

//
// we don't want to pollute our db (in addition to API endpoint rate limiting we check for duplicates)
//
// eslint-disable-next-line complexity
function getQueryHash(log) {
  //
  // if log.meta.ignore_hook is explicity false
  // then that means we want to definitely log the error
  // (in future we could use a different field to denote unique hash)
  //
  if (log?.meta?.ignore_hook === false) return revHash(safeStringify(log));

  const $and = [];
  //
  // prepare db query for uniqueness
  //

  //
  // group together HTTP related queries into one conditional for performance
  //
  if (log?.meta?.is_http) {
    // ignore 304 not modified content w/o a content-type response
    if (
      log?.meta?.response?.status_code === 304 &&
      !log?.meta?.response?.headers?.['content-type']
    )
      throw new Error('Ignored modified HTTP response');

    // don't store logs for fonts, images, and other assets
    if (
      log?.meta?.response?.headers?.['content-type'] &&
      IGNORED_CONTENT_TYPES.some((c) =>
        log.meta.response.headers['content-type'].startsWith(c)
      )
    )
      throw new Error('Ignored content type');

    // don't store logs for JavaScript and CSS source map files
    if (
      log?.meta?.request?.url &&
      log?.meta?.response?.headers?.['content-type'] &&
      log.meta.response.headers['content-type'].startsWith(
        'application/json'
      ) &&
      (log.meta.request.url.endsWith('.css.map') ||
        log.meta.request.url.endsWith('.js.map'))
    )
      throw new Error('Ignored source map file');

    // don't store logs for banned users
    if (
      !log?.meta?.response?.status_code &&
      log?.err?.output?.statusCode === 403
    )
      throw new Error('Ignored banned user or rate limiting');

    // if no user but if had a metadata IP address
    if (!log?.user && log?.meta?.user?.ip_address) {
      $and.push({
        'meta.user.ip_address': {
          $eq: log.meta.user.ip_address,
          $exists: true
        }
      });
    }

    // check
    // + meta.response.status_code
    // + meta.request.method
    // + meta.request.pathname OR meta.request.url (otherwise unique querystrings won't be detected as duplicates)
    if (log?.meta?.response?.status_code)
      $and.push({
        'meta.response.status_code': {
          $eq: log.meta.response.status_code,
          $exists: true
        }
      });

    if (log?.meta?.request?.method)
      $and.push({
        'meta.request.method': {
          $eq: log.meta.request.method,
          $exists: true
        }
      });

    //
    // NOTE: pathname was added in `parse-request` v6.0.1
    //       (since /v1/lookup?q=... querystring was polluting logs)
    //
    if (log?.meta?.request?.pathname) {
      // > "/v1/domains/beep.com/aliases/beep".split('/')
      // [ '', 'v1', 'domains', 'beep.com', 'aliases', 'beep' ]
      const arr = log.meta.request.pathname.split('/');
      if (
        arr[0] === '' &&
        arr[1] === 'v1' &&
        arr[2] === 'domains' &&
        arr[3] &&
        arr[4] === 'aliases'
      ) {
        $and.push({
          'meta.request.pathname': {
            $exists: true,
            $regex: new RegExp('^' + _.escapeRegExp(arr.slice(0, 5).join('/')))
          }
        });
      } else {
        $and.push({
          'meta.request.pathname': {
            $eq: log.meta.request.pathname,
            $exists: true
          }
        });
      }
    } else if (log?.meta?.request?.url) {
      $and.push({
        'meta.request.url': {
          $eq: log.meta.request.url,
          $exists: true
        }
      });
    }
  }

  //
  // log.meta.level (log level)
  //
  const $gte =
    log?.meta?.level && ['error', 'fatal'].includes(log.meta.level)
      ? dayjs(new Date(log.created_at)).startOf('hour').toDate()
      : dayjs(new Date(log.created_at)).startOf('day').toDate();

  if (log?.meta?.level) {
    $and.push({
      'meta.level': {
        $eq: log.meta.level,
        $exists: true
      }
    });
  }

  if (!log?.meta?.is_http) {
    //
    // NOTE: if it was an HTTP request, then the `message` would always be unique
    //       (e.g. the response time might slightly vary in the message string)
    //
    // if (log?.message) $and.push({ $text: { $search: log.message } });
    if (log?.message)
      $and.push({
        message: log.message
      });
    //
    // if it was not an HTTP request then include date query
    // (we don't want the server itself to pollute the db on its own)
    $and.push({
      created_at: { $gte }
    });
  }

  // if it was restricted or not
  if (typeof log.is_restricted === 'boolean')
    $and.push({
      is_restricted: {
        $eq: log.is_restricted,
        $exists: true
      }
    });

  // if had a user
  if (log?.user) {
    $and.push({
      user: {
        $eq: log.user,
        $exists: true
      }
    });
  }

  // make it unique by mail from
  if (
    isSANB(log?.meta?.session?.envelope?.mailFrom?.address) &&
    isEmail(log.meta.session.envelope.mailFrom.address)
  ) {
    $and.push({
      'meta.session.envelope.mailFrom.address': {
        $exists: true,
        // @.*example-1\.com$
        $regex: regexParser(
          `/@.*${parseRootDomain(
            log.meta.session.envelope.mailFrom.address.split('@')[1]
          )}$/`
        ),
        $options: 'i'
      }
    });
  }

  // make it unique by rcpt to
  if (
    Array.isArray(log?.meta?.session?.envelope?.rcptTo) &&
    log.meta.session.envelope.rcptTo.length > 0
  ) {
    const set = new Set();
    for (const rcpt of log.meta.session.envelope.rcptTo) {
      if (_.isObject(rcpt) && isSANB(rcpt.address) && isEmail(rcpt.address))
        set.add(rcpt.address);
    }

    if (set.size > 0) {
      const $or = [];
      for (const address of set) {
        $or.push({
          'meta.session.envelope.rcptTo.address': {
            $exists: true,
            // @.*example-1\.com$
            $regex: regexParser(
              `/@.*${parseRootDomain(address.split('@')[1])}$/`
            ),
            $options: 'i'
          }
        });
      }

      $and.push({ $or });
    }
  }

  // TODO: filter if it was a code bug or not
  // TODO: if err.responseCode and !err.bounces && !meta.session.resolvedClientHostname && meta.session.remoteAddress
  // TODO: else if err.responseCode and !err.bounces && meta.session.allowlistValue
  // TODO: else if err.responseCode and !err.bounces && meta.session.resolvedClientHostname
  // TODO: check count over time period for abuse
  // TODO: we should also store dkim, dmarc, spf, etc info that we do for webhooks here
  // TODO: daily digest email + dashboard + visual charts + real-time metric counters

  // safeguard to prevent empty query
  if ($and.length === 0) throw new Error('Empty query');

  return revHash(safeStringify({ $and }));
}

Logs.pre('validate', function (next) {
  try {
    this.hash = getQueryHash(this);
    next();
  } catch (err) {
    err.is_duplicate_log = true;
    next(err);
  }
});

Logs.pre('save', async function (next) {
  // only run this if the document was new
  // or if it was run from the parse-logs job
  // (which sets `skip_duplicate_check = true`)
  if (!this.isNew || this.skip_duplicate_check) return next();

  try {
    const exists = await this.constructor.exists({
      hash: this.hash
    });

    if (exists) throw new Error('Ignored duplicate log');

    next();
  } catch (err) {
    err.is_duplicate_log = true;
    next(err);
  }
});

//
// NOTE: there is a snapshot array of domains that correlated to this log at the created_at time
//       and this is accomplished by both a pre('save') hook and also a job
//       that runs indefinitely to process 1000 logs at a time (both re-use this static function below)
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
async function parseLog(log) {
  if (!log.is_restricted) return log;
  if (_.isDate(log.domains_checked_at)) return log;
  if (log.domains.length > 0) return log;
  try {
    const set = new Set();

    // meta.session.envelope.mailFrom.address
    if (
      isSANB(log?.meta?.session?.envelope?.mailFrom?.address) &&
      isEmail(log.meta.session.envelope.mailFrom.address)
    ) {
      set.add(
        log.meta.session.envelope.mailFrom.address.split('@')[1].toLowerCase()
      );
    }

    // meta.session.rcptTo
    if (
      Array.isArray(log?.meta?.session?.envelope?.rcptTo) &&
      log.meta.session.envelope.rcptTo.length > 0
    ) {
      for (const rcpt of log.meta.session.envelope.rcptTo) {
        if (_.isObject(rcpt) && isSANB(rcpt.address) && isEmail(rcpt.address)) {
          set.add(rcpt.address.split('@')[1].toLowerCase());
        }
      }
    }

    // session.resolvedClientHostname
    if (
      isSANB(log?.meta?.session?.resolvedClientHostname) &&
      isFQDN(log.meta.session.resolvedClientHostname)
    ) {
      set.add(log.meta.session.resolvedClientHostname);
    }

    // if no domains were found then return early
    if (set.size === 0) return log;

    log.domains = await pMap(
      [...set],
      async (name) => {
        try {
          const records = await resolver.resolveTxt(name);
          const verifications = [];
          for (const record of records) {
            const str = record.join('').trim();
            if (str.startsWith(PREFIX))
              verifications.push(str.replace(PREFIX, ''));
          }

          if (verifications.length === 0) return;

          if (verifications.length > 1) {
            logger.warn(new Error('Multiple verification records'), {
              domain: name
            });
            return;
          }

          const domain = await Domains.findOne({
            name,
            verification_record: verifications[0],
            plan: { $ne: 'free' }
          });

          if (!domain) return;

          return domain._id;
        } catch (err) {
          if (DNS_ERROR_CODES.has(err.code)) throw err;
          logger.warn(err);
        }
      },
      { concurrency }
    );

    // filter out null values
    log.domains = log.domains.filter(Boolean);

    log.domains_checked_at = new Date();
  } catch (err) {
    logger.error(err);
  }

  return log;
}

Logs.statics.parseLog = parseLog;

Logs.pre('save', async function (next) {
  //
  // if the log was newly created then we don't want to parse the DNS yet
  // (it runs in background job via bree, otherwise DNS requests would flood API)
  //
  if (this.isNew) return next();

  try {
    await parseLog(this);
    //
    // if it was not an error from an exchange then return early
    //
    if (
      !this?.meta?.app?.hostname ||
      !config.exchanges.includes(this.meta.app.hostname)
    )
      return next();

    // if it was not a SMTP response code error log then return early
    if (!this?.err?.responseCode || !Number.isFinite(this.err.responseCode))
      return next();

    if (Array.isArray(this.domains) && this.domains.length > 0) return next();

    if (!_.isDate(this.domains_checked_at)) return next();

    const err = new Error('Unnecessary log to store without domains');
    err.is_denylist_without_domains = true;
    throw err;
  } catch (err) {
    next(err);
  }
});

Logs.pre('save', function (next) {
  this.is_empty_domains =
    !Array.isArray(this.domains) || this.domains.length === 0;
  next();
});

//
// NOTE: we want instant notifications of code bugs
// (typically this would belong in a job but we're putting in here for speed)
//
Logs.postCreate(async (doc, next) => {
  const isRateLimiting = doc?.err?.output?.statusCode === 429;
  if (doc?.err?.isCodeBug !== true && !isRateLimiting) return next();
  try {
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `${
          isRateLimiting ? 'Rate Limiting' : 'Code Bug'
        } Detected (Log ID ${doc.id})`
      },
      locals: {
        message: `<pre><code>${JSON.stringify(doc.err, null, 2)}</code></pre>`
      }
    });
    next();
  } catch (err) {
    await logger.fatal(err);
    next();
  }
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Logs', Logs);
