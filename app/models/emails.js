/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

const Axe = require('axe');
const Boom = require('@hapi/boom');
const SpamScanner = require('spamscanner');
const _ = require('lodash');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const getStream = require('get-stream');
const intoStream = require('into-stream');
const ip = require('ip');
const isSANB = require('is-string-and-not-blank');
const libmime = require('libmime');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');
const noReplyList = require('reserved-email-addresses-list/no-reply-list.json');
const nodemailer = require('nodemailer');
const pEvent = require('p-event');
const parseErr = require('parse-err');
const { Headers, Splitter, Joiner } = require('mailsplit');
const { Iconv } = require('iconv');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { isEmail } = require('validator');

const Aliases = require('./aliases');
const Domains = require('./domains');
const Users = require('./users');

const MessageSplitter = require('#helpers/message-splitter');
const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const getBlockedHashes = require('#helpers/get-blocked-hashes');
const getErrorCode = require('#helpers/get-error-code');
const getHeaders = require('#helpers/get-headers');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const logger = require('#helpers/logger');
const parseAddresses = require('#helpers/parse-addresses');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseUsername = require('#helpers/parse-username');

const IP_ADDRESS = ip.address();
const NO_REPLY_USERNAMES = new Set(noReplyList);
const ONE_SECOND_AFTER_UNIX_EPOCH = new Date(1000);
const HUMAN_MAX_DAYS_IN_ADVANCE = '30d';
const MAX_DAYS_IN_ADVANCE_TO_MS = ms(HUMAN_MAX_DAYS_IN_ADVANCE);
const MAX_BYTES = bytes(env.SMTP_MESSAGE_MAX_SIZE);
const BYTES_15MB = bytes('15MB');
const ADDRESS_KEYS = new Set([
  'from',
  'to',
  'cc',
  'bcc',
  'sender',
  'reply-to',
  'delivered-to',
  'return-path'
]);
const SENDER_KEYS = new Set(['from', 'sender', 'reply-to']);
const RCPT_TO_KEYS = new Set(['to', 'cc', 'bcc']);

const transporter = nodemailer.createTransport({
  streamTransport: true,
  buffer: false,
  logger: new Axe({
    silent: true
  })
});

const scanner = new SpamScanner({
  logger,
  clamscan: env.NODE_ENV === 'test'
});

const Emails = new mongoose.Schema(
  {
    is_redacted: {
      type: Boolean,
      default: false
    },
    //
    // NOTE: `mongoose-common-plugin` will automatically set `timestamps` for us
    // <https://github.com/Automattic/mongoose/blob/b2af0fe4a74aa39eaf3088447b4bb8feeab49342/test/timestamps.test.js#L123-L137>
    //
    created_at: {
      type: Date,
      expires: config.emailRetention,
      index: true
    },
    blocked_hashes: [
      {
        type: String,
        index: true
      }
    ],
    has_blocked_hashes: {
      type: Boolean,
      index: true,
      default: false
    },
    hard_bounces: [String], // 5xx bounces (an array for storage to prevent duplicates)
    soft_bounces: [String], // 4xx bounces (an array for storage to prevent duplicates)
    is_bounce: {
      type: Boolean,
      default: false,
      index: true
    },
    priority: {
      type: Number,
      default: 0,
      min: 0
    },
    alias: {
      type: mongoose.Schema.ObjectId,
      ref: Aliases,
      // NOTE: no longer required since we can have catch-alls
      // required: true,
      index: true
    },
    domain: {
      type: mongoose.Schema.ObjectId,
      ref: Domains,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: Users,
      required: true,
      index: true
    },
    // postfix inspired
    status: {
      type: String,
      required: true,
      index: true,
      default: 'queued',
      enum: [
        // pending means that it was stored successfully to be processed
        // (we can also leverage this for future edge cases and safeguards)
        'pending',

        // manually put into "queued" state by admins
        // (until bree job checks for spam) and then `locked_at` is set
        'queued',

        // 2xx
        'sent',

        // mix of 2xx and 5xx
        'partially_sent',

        // 4xx
        'deferred',

        // 5xx (if and only if all were bounced)
        'bounced',

        // rejected means it was denied by an admin or bree detected spam/limitations
        'rejected'
      ]
    },
    // boolean used for querying
    is_locked: {
      type: Boolean,
      default: false,
      index: true
    },
    // `locked_by` is the IP address of which smtp server locked it for sending
    locked_by: String,
    // every 1m the job "unlock-emails" will unlock emails frozen for more than 5m
    locked_at: {
      type: Date,
      index: true
    },
    // envelope
    envelope: {
      from: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: (v) => isEmail(v, { ignore_max_length: true })
      },
      // list of email addresses to sent to
      // (combined To, Cc, Bcc - and then Bcc is removed from headers)
      to: mongoose.Schema.Types.Mixed
    },
    // email to be sent (with date, message-id, etc headers already set)
    message: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // message-id header
    messageId: {
      type: String,
      required: true,
      index: true
    },
    // headers parsed from "message" when initially saved
    headers: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // date header (same value as `headers.Date`)
    date: {
      type: Date,
      required: true,
      index: true
    },
    // subject header (same value as `headers.Subject`)
    subject: {
      type: String,
      index: true
    },
    // accepted (Array of emails already accepted so we don't resend)
    accepted: [
      {
        type: String,
        lowercase: true,
        trim: true,
        validate: (v) => isEmail(v, { ignore_max_length: true })
      }
    ],
    //
    // an array of errors with `err.recipient` as the email address rejected
    // (we only store the most recent `rejectedError` per recipient)
    //
    rejectedErrors: [mongoose.Schema.Types.Mixed]
  },
  {
    versionKey: false,
    writeConcern: {
      w: 'majority'
    }
  }
);

Emails.virtual('is_redacting')
  .get(function () {
    return this.__is_redacting;
  })
  .set(function (isRedacting) {
    this.__is_redacting = boolean(isRedacting);
  });

Emails.plugin(mongooseCommonPlugin, {
  object: 'email',
  locale: false,
  omitExtraFields: [
    '_id',
    '__v',
    'message',
    'locked_by',
    'locked_at',
    'priority'
  ]
});

// when we query against `locked_at` we also need to query for `$exists: true` for hint to work
Emails.index(
  { locked_at: 1 },
  { partialFilterExpression: { locked_at: { $exists: true } } }
);

//
// remove "<" and ">" from `messageId` if present
// (makes it easier and cleaner for search)
//
Emails.pre('validate', function (next) {
  if (!isSANB(this.messageId)) return next();
  if (this.messageId.startsWith('<')) this.messageId = this.messageId.slice(1);
  if (this.messageId.endsWith('>'))
    this.messageId = this.messageId.slice(0, -1);
  return next();
});

//
// validate envelope
//
Emails.pre('validate', function (next) {
  try {
    if (!_.isObject(this.envelope)) throw Boom.badRequest('Envelope missing');

    if (
      !isSANB(this.envelope.from) ||
      !isEmail(this.envelope.from, { ignore_max_length: true })
    )
      throw Boom.badRequest('Envelope from missing');

    if (
      isSANB(this.envelope.to) &&
      isEmail(this.envelope.to, { ignore_max_length: true })
    )
      this.envelope.to = [this.envelope.to];

    // list of email addresses to sent to
    // (combined To, Cc, Bcc - and then Bcc is removed from headers)
    if (!_.isArray(this.envelope.to) || _.isEmpty(this.envelope.to))
      throw Boom.badRequest('Envelope to missing');

    //
    // NOTE: we don't convert to lowercase here because of SRS
    // (e.g. srs0 is invalid but SRS0 is valid in RCPT TO)
    //
    // if the envelope is in address object format then convert it
    // make the envelope to unique
    this.envelope.to = _.uniq(
      this.envelope.to.map((to) =>
        typeof to === 'object' && typeof to.address === 'string'
          ? checkSRS(to.address.trim())
          : checkSRS(to.trim())
      )
    );

    // filter out @removed.forwardemail.net
    this.envelope.to = this.envelope.to.filter(
      (to) => !to.endsWith(`@${config.removedEmailDomain}`)
    );

    // ensure all valid emails
    if (
      !this.envelope.to.every((to) => isEmail(to, { ignore_max_length: true }))
    )
      throw Boom.badRequest('Envelope to requires valid email addresses');

    // prevent sending to no-reply address
    if (
      this.envelope.to.some((to) =>
        NO_REPLY_USERNAMES.has(to.toLowerCase().replace(/[^\da-z]/g, ''))
      )
    )
      throw Boom.badRequest(
        'Envelope to cannot contain a "no-reply" email address'
      );

    this.envelope = _.pick(this.envelope, ['from', 'to']);

    if (this.envelope.to.length === 0)
      throw Boom.badRequest('Envelope to missing');

    if (this.envelope.to.length > 50)
      throw Boom.badRequest('Exceeded max recipient size');

    next();
  } catch (err) {
    next(err);
  }
});

//
// validate message
//
Emails.pre('validate', function (next) {
  try {
    // TODO: validate Message-ID header to RFC spec (even though we set it if not exists)
    // <https://stackoverflow.com/a/4031705>

    // TODO: ensure that From header exists with at least one valid address (RFC 5322)

    if (!Array.isArray(this.accepted)) this.accepted = [];
    if (!Array.isArray(this.rejectedErrors)) this.rejectedErrors = [];

    // ensure accepted is lowercased and unique
    this.accepted = _.uniq(this.accepted).sort();

    // ensure that all `rejectedErrors` are Objects not Errors
    this.rejectedErrors = this.rejectedErrors.map((err) => {
      const e = err instanceof Error ? parseErr(err) : err;
      //
      // these two properties are set to ensure consistency of `rejectedErrors`
      // (each err has `err.recipient` and `err.responseCode` per nodemailer)
      //
      e.isCodeBug = isCodeBug(err);
      e.responseCode = getErrorCode(err);
      if (
        typeof e.recipient !== 'string' ||
        !isEmail(e.recipient, { ignore_max_length: true })
      )
        throw Boom.badRequest('Recipient was missing from error');
      // always set date if not set already
      if (typeof e.date === 'undefined' || !(e.date instanceof Date))
        e.date = new Date();
      return e;
    });

    // filter out any `accepted` from `rejectedErrors`
    this.rejectedErrors = this.rejectedErrors.filter(
      (err) => !this.accepted.includes(err.recipient)
    );

    // ensure that `rejectedErrors` are unique (by most recent/last added)
    this.rejectedErrors = _.uniqBy(this.rejectedErrors.reverse(), 'recipient');

    //
    // note that we need an array instead of a single hash because
    // when we have multiple servers, more than one of them could
    // be blocked at any given time (this is a query optimized approach to ensuring retry every 1+ hour)
    //
    this.blocked_hashes = [];

    for (const err of this.rejectedErrors) {
      if (
        err?.bounceInfo?.category === 'blocklist' &&
        err?.date &&
        _.isDate(err.date) &&
        err?.mx?.localAddress &&
        isIP(err.mx.localAddress)
      ) {
        this.blocked_hashes.push(
          ...getBlockedHashes(err.mx.localAddress, new Date(err.date)),
          ...getBlockedHashes(env.SMTP_HOST, new Date(err.date))
        );
      }
    }

    // make blocked hashes unique
    this.blocked_hashes = _.uniq(this.blocked_hashes);

    // boolean for quick search indexing
    this.has_blocked_hashes = this.blocked_hashes.length > 0;

    next();
  } catch (err) {
    next(err);
  }
});

//
// validate date and headers (must be in pre-save since it uses created_at)
//
Emails.pre('save', function (next) {
  try {
    // ensure date is greater than 1s after Unix epoch
    if (this.date.getTime() < ONE_SECOND_AFTER_UNIX_EPOCH)
      throw Boom.badRequest(
        'Date header must be valid date that is at least 1s after Unix epoch.'
      );

    // ensure date is not more than 30d+ in advance of `this.created_at`
    if (
      this.date.getTime() >
      this.created_at.getTime() + MAX_DAYS_IN_ADVANCE_TO_MS
    )
      throw Boom.badRequest(
        `Date header must not be more than ${HUMAN_MAX_DAYS_IN_ADVANCE} in the future.`
      );

    next();
  } catch (err) {
    next(err);
  }
});

//
// update `status` based off `accepted` and `rejectedErrors` array
//
Emails.pre('save', function (next) {
  try {
    // if email is still in "pending" state then do not modify it
    if (this.status === 'pending' && this.rejectedErrors.length === 0)
      return next();

    // if already "sent", "partially_sent", "bounced", or "rejected" then leave as-is
    if (['sent', 'partially_sent', 'bounced', 'rejected'].includes(this.status))
      return next();

    // if all recipients were accepted, then status is "sent"
    if (
      _.uniq(this.accepted.map((s) => s.toLowerCase()))
        .sort()
        .join(',') ===
      _.uniq(this.envelope.to.map((s) => s.toLowerCase()))
        .sort()
        .join(',')
    ) {
      this.status = 'sent';
      this.is_locked = false;
      this.locked_by = undefined;
      this.locked_at = undefined;
      return next();
    }

    //
    // NOTE: we only want to modify the status when it is in a "queued" state
    //       or when it is in a queued state and locked by current server
    //
    if (
      (this.status !== 'queued' && this.rejectedErrors.length === 0) ||
      (this.status === 'queued' &&
        typeof this.locked_by === 'string' &&
        isIP(this.locked_by) &&
        this.locked_by !== IP_ADDRESS)
    )
      return next();

    //
    // NOTE: we do not unset lock status because the job
    //       "unlock-emails" handles this for us
    //
    // this.locked_by = undefined;
    // this.locked_at = undefined;

    //
    // in case of MongoServerError we want email to instantly retry
    // (e.g. `rejectedErrors.name` is `MongoServerError`)
    //

    // if all recipients were rejected (5xx), then status is "bounced"
    // if some recipients accepted and others were rejected (5xx) then status is "partially_sent"
    if (this.rejectedErrors.length > 0) {
      if (
        this.status === 'queued' &&
        this.rejectedErrors.every((err) => err.isCodeBug === true)
        // this.rejectedErrors.every(
        //   (err) =>
        //     err.name === 'MongoServerError' ||
        //     err.name === 'MongoError' ||
        //     err.name === 'RedisError'
        // )
      ) {
        this.is_locked = false;
        this.locked_by = undefined;
        this.locked_at = undefined;
        return next();
      }

      const [lowestErrorCode] = this.rejectedErrors
        .map((err) => getErrorCode(err))
        .sort();
      if (lowestErrorCode >= 500) {
        //
        // if lowest error code was >= 500 and none of the rejected errors had `response`
        // then consider this message to be "rejected" by our side without delivery attempts made
        //
        if (
          this.rejectedErrors.some(
            (err) => err.maxRetryDuration || typeof err.response === 'string'
          )
        )
          this.status = this.accepted.length > 0 ? 'partially_sent' : 'bounced';
        else this.status = 'rejected';
        return next();
      }

      // otherwise status is deferred (will be unlocked after 10m by automated job)
      this.status = 'deferred';
    }

    next();
  } catch (err) {
    next(err);
  }
});

// determine priority
Emails.pre('save', async function (next) {
  try {
    const domain = await Domains.findById(this.domain);
    // we return here instead of erroring
    if (!domain) {
      this.status = 'pending';
      this.priority = 0;
      return next();
    }

    // if any of the domain admins are admins then set priority to 1
    const adminExists = await Users.exists({
      _id: {
        $in: domain.members
          .filter((m) => m.group === 'admin')
          .map((m) => m.user)
      },
      group: 'admin'
    });
    this.priority = adminExists ? 1 : 0;
    next();
  } catch (err) {
    next(err);
  }
});

// NOTE: this must come BEFORE the next pre save hook
Emails.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    // if "To" header in `raw` was SRS then rewrite
    const splitter = new Splitter();
    const joiner = new Joiner();

    splitter.on('data', (data) => {
      if (data.type !== 'node' || data.root !== true) return;
      const headerLines = Buffer.concat(data._headersLines, data._headerlen);
      const headers = new Headers(headerLines, { Iconv });
      const lines = headers.getList();
      const header = lines.find((line) => line.key === 'to');
      if (!header) return;
      const { value } = libmime.decodeHeader(header.line);
      if (!isSANB(value)) return;
      if (checkSRS(value) !== value)
        data.headers.update(header.line.split(': ')[0], checkSRS(value));
    });

    // not necessary, but a safeguard in case pre hooks moved around
    const existingMessage = await this.constructor.getMessage(this.message);

    this.message = await getStream.buffer(
      intoStream(existingMessage).pipe(splitter).pipe(joiner)
    );

    next();
  } catch (err) {
    logger.fatal(err);
    next(err);
  }
});

//
// if message was more than 15 MB then store it with grid fs
// (the mongodb document max size limit is 16 mb)
//
Emails.pre('save', async function (next) {
  try {
    // immutable message (to edit a message you need to create a new email)
    if (!this.isNew && !this.is_redacting) return next();

    // ensure message exists and is a buffer
    if (!Buffer.isBuffer(this.message))
      throw Boom.badRequest('Buffer must be a message');

    // ensure the message is not more than 50 MB
    const messageBytes = Buffer.byteLength(this.message);
    if (messageBytes > MAX_BYTES)
      throw Boom.badRequest(
        `Email size of ${env.SMTP_MESSAGE_MAX_SIZE} exceeded.`
      );

    // if the doc was was <= 15 MB then return early
    if (messageBytes <= BYTES_15MB) return next();

    // TODO: move bucket to root
    const bucket = new mongoose.mongo.GridFSBucket(this.db);

    const stream = bucket.openUploadStream(`${this.id}.eml`, {
      contentType: 'message/rfc822'
    });

    intoStream(this.message).pipe(stream);

    // `p-event` listens for rejectionEvents default of `['error']`
    this.message = await pEvent(stream, 'finish');

    next();
  } catch (err) {
    next(err);
  }
});

// if message was deleted then cleanup grid fs
Emails.post('deleteOne', async function (email) {
  if (
    !email?.message?._id ||
    !mongoose.isObjectIdOrHexString(email.message._id)
  )
    return;
  try {
    // cleanup grid fs
    const bucket = new mongoose.mongo.GridFSBucket(email.constructor.db);
    await bucket.delete(email.message._id);
  } catch (err) {
    err.email = email;
    logger.error(err);
  }
});

//
// if the message was successfully sent then redact the message
// and delete/cleanup gridfs storage if it was used
//
Emails.post('save', async function (email) {
  if (
    email.is_redacted ||
    ['pending', 'queued', 'deferred'].includes(email.status)
  )
    return;

  const domain = await Domains.findById(email.domain);
  if (!domain)
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST', i18n.config.defaultLocale)
    );

  // return early if it hasn't passed the user's retention days yet
  if (
    typeof domain.retention_days === 'number' &&
    Number.isFinite(domain.retention_days) &&
    domain.retention_days > 0 &&
    dayjs(email.created_at)
      .add(domain.retention_days, 'days')
      .toDate()
      .getTime() > Date.now()
  )
    return;

  // redact the body but retain headers (so our team can curate spam/abuse)
  const splitter = new Splitter();
  const joiner = new Joiner();
  let headers;
  splitter.on('data', (data) => {
    if (data.type !== 'node' || data.root !== true) return;
    const headerLines = Buffer.concat(data._headersLines, data._headerlen);
    headers = new Headers(headerLines, { Iconv });
  });
  const existingMessage = await email.constructor.getMessage(email.message);
  await getStream.buffer(
    intoStream(existingMessage).pipe(splitter).pipe(joiner)
  );

  // store reference to old message grid fs id
  let gridFsFileId;
  if (
    email?.message?._id &&
    mongoose.isObjectIdOrHexString(email.message._id)
  ) {
    gridFsFileId = email.message._id;
  }

  // update content type and transfer encoding headers
  headers.add(
    'X-Original-Content-Type',
    headers.getFirst('Content-Type') || ''
  );
  headers.add(
    'X-Original-Content-Transfer-Encoding',
    headers.getFirst('Content-Transfer-Encoding') || ''
  );
  headers.remove('Content-Type');
  headers.remove('Content-Transfer-Encoding');
  headers.add('Content-Type', 'text/plain; charset=us-ascii');
  headers.add('Content-Transfer-Encoding', '7bit');

  // update the existing message stored
  email.message = Buffer.concat([
    headers.build(),
    Buffer.from(
      convert(
        'This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.',
        {
          wordwrap: 60
        }
      )
    )
  ]);
  email.is_redacting = true; // virtual helper to rewrite message
  email.is_redacted = true; // so this isn't a recursive loop on save() call
  await email.save();

  // delete the old message stored
  if (gridFsFileId) {
    try {
      // cleanup grid fs
      const bucket = new mongoose.mongo.GridFSBucket(email.constructor.db);
      await bucket.delete(gridFsFileId);
    } catch (err) {
      err.email = email;
      logger.error(err);
    }
  }
});

Emails.statics.getMessage = async function (obj, returnString = false) {
  if (Buffer.isBuffer(obj)) {
    if (returnString) return obj.toString();
    return obj;
  }

  if (obj instanceof mongoose.mongo.Binary) {
    if (returnString) return obj.buffer.toString();
    return obj.buffer;
  }

  // obj = {
  //   _id: new ObjectId("..."),
  //   length: 22958877,
  //   chunkSize: 261120,
  //   uploadDate: new Date(...),
  //   filename: '$id.eml',
  //   contentType: 'message/rfc822'
  // }

  if (typeof obj !== 'object') throw Boom.badRequest('Invalid GridFS object');

  if (!obj?._id || !mongoose.isObjectIdOrHexString(obj._id))
    throw Boom.badRequest('Invalid GridFS ObjectId');

  if (typeof obj.length !== 'number')
    throw Boom.badRequest('Invalid GridFS length');

  if (typeof obj.chunkSize !== 'number')
    throw Boom.badRequest('Invalid GridFS chunkSize');

  if (!obj?.uploadDate || !(obj.uploadDate instanceof Date))
    throw Boom.badRequest('Invalid GridFS uploadDate');

  if (typeof obj.filename !== 'string' || !obj.filename.endsWith('.eml'))
    throw Boom.badRequest('Invalid GridFS filename');

  if (
    typeof obj.contentType !== 'string' ||
    obj.contentType !== 'message/rfc822'
  )
    throw Boom.badRequest('Invalid GridFS contentType');

  // TODO: move bucket to root
  const bucket = new mongoose.mongo.GridFSBucket(this.db);

  if (returnString) {
    const raw = await getStream(bucket.openDownloadStream(obj._id), {
      maxBuffer: MAX_BYTES
    });

    return raw;
  }

  const raw = await getStream.buffer(bucket.openDownloadStream(obj._id), {
    maxBuffer: MAX_BYTES
  });

  return raw;
};

// options.info (Nodemailer transport response *optional*)
// options.message (Buffer or nodemailer Object) (required if `options.info` not provided)
// options.alias
// options.domain
// options.user (from `ctx.state.user` or `alias.user`)
// options.date
// options.catchall (boolean, true, if using domain-wide generated catch-all password)
// eslint-disable-next-line complexity
Emails.statics.queue = async function (
  options = {},
  locale = i18n.config.defaultLocale
) {
  //
  // NOTE: memory-leak warning from nodemailer message docs:
  //       when using readable streams as content if sending fails then
  //       nodemailer does not abort opened and not finished stream
  //

  // this allow us to pass an already created nodemailer transport stream for parsing
  const info = options?.info || (await transporter.sendMail(options.message));

  const messageSplitter = new MessageSplitter({
    maxBytes: MAX_BYTES
  });

  const body = await getStream.buffer(info.message.pipe(messageSplitter), {
    maxBuffer: MAX_BYTES
  });

  // ensure the message is not more than 50 MB
  if (messageSplitter.sizeExceeded) {
    const err = Boom.badRequest(
      `Email size of ${env.SMTP_MESSAGE_MAX_SIZE} exceeded.`
    );
    err.responseCode = 552; // otherwise it would get mapped to `550` (see `#helpers/get-error-code.js`)
    throw err;
  }

  if (!messageSplitter.headersParsed)
    throw Boom.badRequest('Headers were unable to be parsed');

  const { headers } = messageSplitter;

  const isEnvelopeToEmpty = info.envelope.to.length === 0;
  const isEnvelopeFromEmpty = !info.envelope.from;

  //
  // ensure from header is equal to the alias sending from
  // (avoids confusing "Invalid DKIM signature" error message)
  //
  let from;

  //
  // NOTE: we should only decode these headers, but we're going to decode all anyways for now
  //       <https://github.com/nodemailer/mailparser/blob/ac11f78429cf13da42162e996a05b875030ae1c1/lib/mail-parser.js#L329>
  //
  // NOTE: we decode header values because
  //       want them to be easily searchable
  //       (e.g. an emoji in a header line gets encoded as:
  //       > '=?UTF-8?Q?=F0=9F=8E=89_beep?='
  //       and we want output that looks like
  //       > 🎉 beep
  //       (e.g. so a user could search for 🎉)
  //
  //       we can't use mailsplit b/c unicode characters get rewritten
  //       <https://github.com/andris9/mailsplit/issues/21>
  //
  let lines = headers.headers.toString();
  try {
    lines = headers.libmime.decodeWords(lines);
  } catch {
    // ignore, keep as is
  }

  lines = lines
    // <https://github.com/andris9/mailsplit/issues/22>
    .replace(/\r?\n?\t/g, ' ')
    .replace(/[\r\n]+$/, '')
    .split(/\r?\n/);

  for (const line of lines) {
    const index = line.indexOf(':');
    const key = line.slice(0, index);
    const value = line.slice(index + 1).trim();

    const lowercaseKey = key.toLowerCase();
    if (!ADDRESS_KEYS.has(lowercaseKey)) continue;

    const addresses = parseAddresses(value);
    if (!_.isArray(addresses) || _.isEmpty(addresses)) continue;

    // there should only be one value in From header
    if (lowercaseKey === 'from' && addresses.length === 1) {
      //
      // rewrite from header to be without "+" symbol
      // so that users can send with "+" address filtering
      //
      const name = parseUsername(addresses[0].address); // converts to ASCII
      const domain = parseHostFromDomainOrAddress(addresses[0].address); // converts to ASCII
      from = `${name}@${domain}`; // ASCII formatted From address header
    }

    //
    // in case the email was `raw`, the envelope won't be parsed right away
    // so we rely on the parsed headers from `mailparser` to re-create envelope
    // <https://github.com/nodemailer/nodemailer/blob/e3cc93a9c20939b209c804857c75aea0d3305913/lib/mime-node/index.js#LL882C1-L898C57>
    //
    if (options?.message?.raw) {
      // envelope from
      if (
        (!info.envelope.from ||
          (isEnvelopeFromEmpty && lowercaseKey === 'from')) &&
        SENDER_KEYS.has(lowercaseKey)
      )
        info.envelope.from = addresses[0].address;
      // envelope to
      else if (isEnvelopeToEmpty && RCPT_TO_KEYS.has(lowercaseKey)) {
        for (const address of addresses) {
          if (info.envelope.to.includes(address.address)) continue;
          info.envelope.to.push(address.address);
        }
      }
    }
  }

  //
  // based off the logged in user we need to lookup the associated domain
  // and ensure that either the user is an admin or the alias is owned by them
  // (and the domain must be on a paid plan)
  //
  if (
    !info.envelope.from ||
    !isEmail(info.envelope.from, { ignore_max_length: true })
  )
    throw Boom.forbidden(i18n.translateError('ENVELOPE_FROM_MISSING', locale));

  let [aliasName, domainName] = info.envelope.from.split('@');

  domainName = punycode.toUnicode(domainName);

  // if (aliasName === '*' && !options.catchall)
  //  throw Boom.forbidden(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));

  let userId;

  if (isSANB(options?.user?.id)) userId = options.user.id;
  else if (typeof options?.user?._id === 'object')
    userId = options.user._id.toString();
  else if (typeof options?.user === 'object') userId = options.user.toString();

  const domain =
    options.domain ||
    (userId
      ? await Domains.findOne({
          name: domainName,
          'members.user': new mongoose.Types.ObjectId(userId)
        }).populate(
          'members.user',
          `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
      : null);

  if (!domain)
    throw Boom.badRequest(i18n.translateError('DOMAIN_DOES_NOT_EXIST', locale));

  if (domain.is_global)
    throw Boom.badRequest(
      i18n.translateError('EMAIL_SMTP_GLOBAL_NOT_PERMITTED', locale)
    );

  //
  // NOTE: if the domain is suspended then the state is "pending" not queued
  //
  // domain cannot be in suspended domains list
  // if (_.isDate(domain.smtp_suspended_sent_at))
  //   throw Boom.forbidden(i18n.translateError('DOMAIN_SUSPENDED', locale));

  // domain must be enabled
  if (!domain.has_smtp)
    throw Boom.forbidden(
      i18n.translateError('EMAIL_SMTP_ACCESS_REQUIRED', locale)
    );

  //
  // validate that at least one paying, non-banned admin on >= same plan without expiration
  //
  const validPlans =
    domain.plan === 'team' ? ['team'] : ['team', 'enhanced_protection'];

  if (
    !domain.members.some(
      (m) =>
        !m.user[config.userFields.isBanned] &&
        m.user[config.userFields.hasVerifiedEmail] &&
        validPlans.includes(m.user.plan) &&
        (new Date(m.user[config.userFields.planExpiresAt]).getTime() >=
          Date.now() ||
          isSANB(m.user[config.userFields.stripeSubscriptionID]) ||
          isSANB(m.user[config.userFields.paypalSubscriptionID])) &&
        m.group === 'admin'
    )
  )
    throw Boom.forbidden(
      i18n.translateError('PAST_DUE_OR_INVALID_ADMIN', locale)
    );

  let member;

  if (userId)
    member = domain.members.find(
      (member) =>
        member?.user?.id === userId ||
        (member.user && member.user.toString() === userId)
    );

  if (!member)
    throw Boom.badRequest(i18n.translateError('INVALID_MEMBER', locale));

  //
  // ensure the alias exists (if it was not a catch-all)
  //
  let alias;
  if (!options.catchall) {
    alias =
      options.alias ||
      (userId
        ? await Aliases.findOne(
            member.group === 'admin'
              ? {
                  domain: domain._id,
                  name: aliasName
                }
              : {
                  // users that are not admins must be an owner of the alias to send as it
                  user: new mongoose.Types.ObjectId(userId),
                  domain: domain._id,
                  name: aliasName
                }
          ).populate('user', `id ${config.userFields.isBanned}`)
        : null);
  }

  if (alias) {
    // alias must not have banned user
    if (alias.user[config.userFields.isBanned])
      throw Boom.forbidden(i18n.translateError('ALIAS_ACCOUNT_BANNED', locale));

    // alias must be enabled
    if (!alias.is_enabled)
      throw Boom.badRequest(
        i18n.translateError('ALIAS_IS_NOT_ENABLED', locale)
      );
  }

  // parse the date for SMTP queuing
  let date = new Date(headers.getFirst('date'));
  if (
    !date ||
    date.toString() === 'Invalid Date' ||
    date < ONE_SECOND_AFTER_UNIX_EPOCH ||
    !_.isDate(date)
  ) {
    date =
      _.isDate(options.date) && options.date >= ONE_SECOND_AFTER_UNIX_EPOCH
        ? options.date
        : new Date();
  }

  // decode headers (e.g. for search)
  const decodedHeaders = await getHeaders(headers);
  let subject;
  let messageId;
  for (const key of Object.keys(decodedHeaders)) {
    if (key.toLowerCase() === 'subject') subject = decodedHeaders[key];
    if (key.toLowerCase() === 'message-id') messageId = decodedHeaders[key];
  }

  if (!messageId && info.messageId) messageId = info.messageId;

  if (!from)
    throw Boom.forbidden(
      i18n.translateError(
        'INVALID_FROM_HEADER',
        locale,
        `${
          !options.catchall && alias ? punycode.toASCII(alias.name) : '*'
        }@${punycode.toASCII(domain.name)}`,
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/advanced-settings#catch-all-passwords`,
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/advanced-settings#catch-all-passwords`
      )
    );

  // if we're a catch-all then validate from ends with @domain
  if (
    (options.catchall || !alias) &&
    !from.endsWith(`@${punycode.toASCII(domain.name)}`)
  )
    throw Boom.forbidden(
      i18n.translateError(
        'INVALID_CATCHALL_FROM_HEADER',
        locale,
        `@${punycode.toASCII(domain.name)}`
      )
    );
  // otherwise it must be a specific match to the alias
  else if (
    !options.catchall &&
    alias &&
    from !== `${punycode.toASCII(alias.name)}@${punycode.toASCII(domain.name)}`
  )
    throw Boom.forbidden(
      i18n.translateError(
        'INVALID_FROM_HEADER',
        locale,
        `${punycode.toASCII(alias.name)}@${punycode.toASCII(domain.name)}`,
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/advanced-settings#catch-all-passwords`,
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/advanced-settings#catch-all-passwords`
      )
    );

  const message = Buffer.concat([headers.build(), body]);

  //
  // sanitize message and attachments
  //
  if (
    isSANB(info?.envelope?.from) &&
    isEmail(info.envelope.from, { ignore_max_length: true }) &&
    config.supportEmail !== info.envelope.from.toLowerCase() &&
    //
    // we don't want to scan messages sent with our own SMTP service
    // by our users/customers to our support@ or abuse@ email addresses
    // (otherwise it'll get banned just for users reporting spam/phishing)
    // (also handles edge case where a user sends to both support@ and abuse@)
    //
    _.isArray(info?.envelope?.to) &&
    !_.isEmpty(info.envelope.to) &&
    info.envelope.to.every(
      (to) =>
        isSANB(to) &&
        isEmail(to, { ignore_max_length: true }) &&
        ![config.supportEmail, config.abuseEmail].includes(to.toLowerCase())
    )
  ) {
    const scan = await scanner.scan(message);

    const messages = [
      ...new Set([
        ...scan.results.phishing,
        ...scan.results.executables,
        ...scan.results.arbitrary,
        ...scan.results.viruses
      ])
    ];

    if (messages.length > 0) {
      // send an email to all admins
      const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
      try {
        await emailHelper({
          template: 'smtp-suspended',
          message: { to: obj.to, bcc: config.email.message.from },
          locals: {
            domain:
              typeof domain.toObject === 'function'
                ? domain.toObject()
                : domain,
            locale: obj.locale,
            category: 'virus',
            responseCode: 554,
            response: messages.join(' '),
            truthSource: config.webHost,
            email: {
              envelope: info.envelope,
              messageId,
              subject,
              date
            }
          }
        });
      } catch (err) {
        // NOTE: it would be better to use `ctx.logger` probably here
        logger.fatal(err);
      }

      // if any of the domain admins are admins then don't ban
      const adminExists = await Users.exists({
        _id: {
          $in: domain.members
            .filter((m) => m.group === 'admin')
            .map((m) =>
              typeof m.user === 'object' && typeof m?.user?._id === 'object'
                ? m.user._id
                : m.user
            )
        },
        group: 'admin'
      });

      // store when we sent this email
      if (!adminExists)
        await Domains.findByIdAndUpdate(domain._id, {
          $set: {
            smtp_suspended_sent_at: new Date(),
            is_smtp_suspended: true
          }
        });

      // needs to be forbidden so it gets mapped to 5xx error
      const error = Boom.forbidden(messages.join(' '));
      error.scan = scan;
      throw error;
    }
  }

  const status =
    _.isDate(domain.smtp_suspended_sent_at) || options?.isPending === true
      ? 'pending'
      : 'queued';

  const email = await this.create({
    alias: !options.catchall && alias ? alias._id : undefined,
    domain: domain._id,
    user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
    envelope: info.envelope,
    message,
    messageId,
    headers: decodedHeaders,
    date,
    subject,
    status,
    is_bounce: boolean(options?.is_bounce)
  });

  return email;
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'EMAILS_MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Emails', Emails);
