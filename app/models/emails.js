/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

const Axe = require('axe');
const Boom = require('@hapi/boom');
const Redis =
  process.env.NODE_ENV === 'test'
    ? require('ioredis-mock')
    : require('@ladjs/redis');
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
const sharedConfig = require('@ladjs/shared-config');
const striptags = require('striptags');
const { Headers, Splitter, Joiner } = require('mailsplit');
const { Iconv } = require('iconv');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { decode } = require('html-entities');

const Aliases = require('./aliases');
const Domains = require('./domains');
const Users = require('./users');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const MessageSplitter = require('#helpers/message-splitter');
const checkAndAutoApproveSMTP = require('#helpers/check-and-auto-approve-smtp');
const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const getBlockedHashes = require('#helpers/get-blocked-hashes');
const getErrorCode = require('#helpers/get-error-code');
const getHeaders = require('#helpers/get-headers');
const getEmailMessageStream = require('#helpers/get-email-message-stream');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const logger = require('#helpers/logger');
const parseAddresses = require('#helpers/parse-addresses');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseUsername = require('#helpers/parse-username');
const SMTPError = require('#helpers/smtp-error');
const checkSmtpVelocity = require('#helpers/check-smtp-velocity');

const { reserveAliasMessage } = checkSmtpVelocity;
const {
  enforceSmtpSendingLimits
} = require('#helpers/get-smtp-sending-limits');
const { getSmtpDayStart } = require('#helpers/get-smtp-day');
const { isWithinGracePeriod } = require('#helpers/is-within-grace-period');

const IP_ADDRESS = ip.address();
const NO_REPLY_USERNAMES = new Set(noReplyList);
const ONE_SECOND_AFTER_UNIX_EPOCH = new Date(1000);
// (a message can be scheduled up to the days messages are kept, less the days
// until the reputation job evaluates its outcomes on the day it was due, see
// `helpers/update-smtp-reputation.js`, so its bounces are never deleted
// before they count)
const MAX_DAYS_IN_ADVANCE = Math.max(
  1,
  Math.floor(
    (typeof config.emailRetention === 'number'
      ? config.emailRetention * 1000
      : ms(config.emailRetention)) / ms('1d')
  ) -
    config.smtpReputationEvaluationDelayDays -
    1
);
const HUMAN_MAX_DAYS_IN_ADVANCE = `${MAX_DAYS_IN_ADVANCE}d`;
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

let SpamScanner;
let scanner;

const webSharedConfig = sharedConfig('WEB');

// TODO: we should find a way to share the existing redis connection
const redis = new Redis(
  webSharedConfig.redis,
  logger,
  webSharedConfig.redisMonitor
);

// Lazily-initialized resolver for auto-approval DNS checks in Emails.queue()
let _emailsResolver;

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
    // a delivery status notification for mail the user submitted (a bounce,
    // but not in response to inbound mail, see `helpers/process-email.js`)
    is_dsn: {
      type: Boolean,
      default: false
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
    // the "unlock-emails" job (every 1m) unlocks orphaned emails still locked for 5m+;
    // deferred emails are retried directly by the send-emails job (see its finder
    // query and the lock-acquisition in helpers/process-email.js)
    locked_at: {
      // (indexed below with options; a plain index here would take its name)
      type: Date
    },
    // envelope
    envelope: {
      from: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: (v) => isEmail(v)
      },
      // list of email addresses to sent to
      // (combined To, Cc, Bcc - and then Bcc is removed from headers)
      to: mongoose.Schema.Types.Mixed
    },

    //
    // Delivery Status Notificatinos
    //
    // rcptTo = [
    //   {
    //     "address": "foo@foo.com",
    //     "args": {
    //       "NOTIFY": "SUCCESS,FAILURE,DELAY",
    //       "ORCPT": "rfc822;foo@foo.com"
    //     },
    //     "dsn": {
    //       "notify": [
    //         "SUCCESS",
    //         "FAILURE",
    //         "DELAY"
    //       ],
    //       "orcpt": "rfc822;foo@foo.com"
    //     },
    //     "name": ""
    //   }
    // ]
    rcptTo: mongoose.Schema.Types.Mixed,
    // session.envelope.dsn {
    //   ret: 'FULL',
    //   envid: 'TEST-ENVELOPE-IDENTIFIER'
    // }
    dsn: {
      // MAIL FROM gets this mapped via `session.envelope.dsn.envid` (see above)
      // (otherwise API just sets it using nodemailer-like DSN object)
      id: String,
      // MAIL FROM gets this mapped via `session.envelope.dsn.ret` (see above)
      // (otherwise API just sets it using nodemailer-like DSN object)
      return: {
        type: String,
        lowercase: true,
        validate: (v) => !v || ['headers', 'full'].includes(v)
      },
      // specific NOTIFY property for emails added via API
      // (since it doesn't provide envelope RCPT TO)
      notify: mongoose.Schema.Types.Mixed, // String or Array
      // specific ORCPT property for emails added via API
      // (since it doesn't provide envelope RCPT TO)
      //
      // NOTE: we do not validate this and leave it up to the sender to configure this properly
      //       (e.g. it must be `ORCPT=<address-type>;<address>`)
      //       where `<address-type>` could be, but not limited to:
      //       - rfc822
      //       - x400
      //       - fax
      //       - ediint
      //       - ms
      //       - ddn
      //       - uucp
      //       - smtp
      //
      recipient: String
    },

    //
    // RFC 8689 - REQUIRETLS parameter
    // Indicates that the message requires TLS for the entire delivery chain
    //
    requireTLS: {
      type: Boolean,
      default: false
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
        validate: (v) => isEmail(v)
      }
    ],
    //
    // successful deliveries with transport information
    // (stores MX records, response codes, and other delivery metadata)
    //
    deliveries: [
      {
        // recipient email address
        recipient: {
          type: String,
          lowercase: true,
          trim: true,
          validate: (v) => isEmail(v)
        },
        // date of successful delivery
        date: {
          type: Date
        },
        // SMTP response from receiving server
        response: String,
        // SMTP response code (e.g. 250)
        responseCode: Number,
        // MX record information
        mx: {
          // MX hostname
          host: String,
          // MX priority
          priority: Number,
          // resolved IP address
          ip: String,
          // port used for connection
          port: Number
        },
        // TLS information
        tls: {
          // whether TLS was used
          enabled: Boolean,
          // TLS version (e.g. 'TLSv1.3')
          version: String,
          // cipher suite used
          cipher: String
        },
        // whether message was encrypted with PGP
        pgp: Boolean,
        // whether DKIM was signed
        dkim: Boolean,
        // truth source for MX lookup (e.g. 'dns', 'mta-sts')
        truthSource: String,
        // whether TLS was required
        requireTLS: Boolean,
        // whether TLS was ignored
        ignoreTLS: Boolean,
        // whether opportunistic TLS was used
        opportunisticTLS: Boolean,
        // delivery duration in milliseconds
        duration: Number
      }
    ],
    //
    // NOTE: rejectedErrors now enhanced to include additional transport properties:
    // - mx: { host, priority, ip, port }
    // - tls: { enabled, version, cipher }
    // - truthSource: string
    // - requireTLS: boolean
    // - ignoreTLS: boolean
    // - opportunisticTLS: boolean
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

// Compound indexes for optimal query performance on /my-account/emails page
// These indexes support the common query patterns used in list-emails controller

// For queries filtering by alias and sorting by created_at
Emails.index({ alias: 1, created_at: -1 });

// For queries filtering by domain and sorting by created_at
Emails.index({ domain: 1, created_at: -1 });

// For queries filtering by user and sorting by created_at
Emails.index({ user: 1, created_at: -1 });

// For status filtering with sorting
Emails.index({ status: 1, created_at: -1 });

// For send-emails job dual-queue strategy:
// Equality fields precede the sort field; the scheduled-date range follows it
// so MongoDB can preserve queue order without a blocking sort.
// Phase 1 (queued): newest first for fast first-delivery
Emails.index({ is_locked: 1, status: 1, created_at: -1, date: 1 });
// Phase 2 (deferred): oldest-touched first for fair round-robin retry
Emails.index({ is_locked: 1, status: 1, updated_at: 1, date: 1 });

// Compound indexes for common filter combinations
Emails.index({ domain: 1, status: 1, created_at: -1 });
Emails.index({ alias: 1, status: 1, created_at: -1 });
Emails.index({ user: 1, status: 1, created_at: -1 });

// For the daily outbound SMTP thresholds, which count every message but
// bounces and auto-replies (see `helpers/get-smtp-sending-limits.js`)
// (so the per-message counts are answered from the index alone)
Emails.index({ user: 1, is_bounce: 1, created_at: -1 });
Emails.index({ domain: 1, is_bounce: 1, created_at: -1 });
// (and for per-alias limits)
Emails.index({ alias: 1, is_bounce: 1, created_at: -1 });
// (and for the reputation job, messages scheduled for a day)
Emails.index({ user: 1, date: 1 });

// Indexes for envelope.from and envelope.to queries (admin emails page)
// These support queries like { 'envelope.from': 'support@forwardemail.net' }
Emails.index({ 'envelope.from': 1, created_at: -1 });

// For envelope.to queries - since envelope.to is an array, MongoDB will create
// a multikey index that efficiently supports queries on array elements
Emails.index({ 'envelope.to': 1, created_at: -1 });

// Compound index for queries filtering by both envelope.from and status
Emails.index({ 'envelope.from': 1, status: 1, created_at: -1 });

// Compound index for the "recently blocked" prefetch query used by
// send-emails, check-smtp-frozen-queue, and check-smtp-queue-count jobs.
// Query shape: { has_blocked_hashes: true, updated_at: { $gte, $lte }, blocked_hashes: { $in } }
// Equality on has_blocked_hashes first (high selectivity boolean), then range on updated_at.
// blocked_hashes has its own multikey index and MongoDB will intersect if needed.
Emails.index(
  { has_blocked_hashes: 1, updated_at: -1 },
  { partialFilterExpression: { has_blocked_hashes: true } }
);

// Compound index for unlock-emails job bulk orphan recovery.
// Query shape: { is_locked: true, locked_at: { $exists: true, $lte }, status: { $in: ['queued','deferred'] } }
// Partial filter keeps the index small (only locked emails with locked_at set).
Emails.index(
  { is_locked: 1, locked_at: 1, status: 1 },
  { partialFilterExpression: { is_locked: true, locked_at: { $exists: true } } }
);

// DSN
Emails.pre('validate', function (next) {
  if (this.dsn === undefined) return next();

  if (!_.isObject(this.dsn))
    throw Boom.badRequest('Property "dsn" must be a plain object');

  // need to call Object.values here since it's a Mongoose object
  // (we might be able to do `toObject` here actually)
  if (_.isEmpty(_.compact(Object.values(this.dsn)))) return next();

  // dsn.id (String)
  if (this.dsn.id !== undefined && !isSANB(this.dsn.id))
    throw Boom.badRequest('Property "dsn.id" must be a non-empty String');

  // dsn.return (String "headers" or "full")
  if (
    this.dsn.return !== undefined &&
    (typeof this.dsn.return !== 'string' ||
      !['headers', 'full'].includes(this.dsn.return))
  )
    throw Boom.badRequest(
      'Property "dsn.return" must be either "headers" or "full"'
    );

  //
  // dsn.notify (String or Array, "never", "success", and/or "failure")
  //            (cannot combine "never" in the Array with others)
  //
  if (
    typeof this.dsn.notify === 'string' &&
    !['never', 'success', 'failure'].includes(this.dsn.notify)
  ) {
    throw Boom.badRequest(
      'Property "dsn.notify" must be "never", "success", or "failure"'
    );
  } else if (_.isArray(this.dsn.notify)) {
    this.dsn.notify = _.compact(_.uniq(this.dsn.notify));
    if (this.dsn.notify.length === 0)
      throw Boom.badRequest('Property "dsn.notify" must be a non-empty Array');
    if (
      this.dsn.notify.every((v) => !['never', 'success', 'failure'].includes(v))
    )
      throw Boom.badRequest(
        'Property "dsn.notify" must only contain "never", "success", or "failure"'
      );
    if (this.dsn.notify.includes('never') && this.dsn.notify.length > 1)
      throw Boom.badRequest(
        'Property "dsn.notify" can only contain "never" if "never" is set, no other values are permitted'
      );
  } else if (this.dsn.notify !== undefined) {
    throw Boom.badRequest('Property "dsn.notify" must be a String or Array');
  }

  //
  // dsn.recipient (ORCPT)
  //
  if (
    this.dsn.recipient !== undefined &&
    typeof this.dsn.recipient !== 'string'
  )
    throw Boom.badRequest('Property "dsn.recipient" must be a String');

  next();
});

// if a message is a bounce requireTLS should always be false
Emails.pre('validate', function (next) {
  if (this.is_bounce) this.requireTLS = false;
  next();
});

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

    if (!isSANB(this.envelope.from) || !isEmail(this.envelope.from))
      throw Boom.badRequest('Envelope from missing');

    if (isSANB(this.envelope.to) && isEmail(this.envelope.to))
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
    if (!this.envelope.to.every((to) => isEmail(to)))
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
    this.accepted = _.uniq(this.accepted.map((a) => a.toLowerCase())).sort();

    // ensure that all `rejectedErrors` are Objects not Errors
    this.rejectedErrors = this.rejectedErrors
      .map((err) => {
        const e = err instanceof Error ? parseErr(err) : err;
        //
        // these two properties are set to ensure consistency of `rejectedErrors`
        // (each err has `err.recipient` and `err.responseCode` per nodemailer)
        //
        e.isCodeBug = isCodeBug(err);
        e.responseCode = getErrorCode(err);
        // always set date if not set already
        if (typeof e.date === 'undefined' || !(e.date instanceof Date))
          e.date = new Date();
        return e;
      })
      // Filter out entries without a valid recipient instead of throwing —
      // legacy data or timeout errors may lack this field
      .filter((e) => typeof e.recipient === 'string' && isEmail(e.recipient));

    // filter out any `accepted` from `rejectedErrors`
    this.rejectedErrors = this.rejectedErrors.filter(
      (err) => !this.accepted.includes(err.recipient.toLowerCase())
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
        // in case of netblocks we use "network" category (e.g. issue with groups.io)
        (err?.bounceInfo?.category === 'blocklist' ||
          err?.bounceInfo?.category === 'network') &&
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

    // ensure date is not more than MAX_DAYS_IN_ADVANCE in advance of
    // `this.created_at` (only when the date is set, so messages scheduled
    // under an earlier, longer horizon can still be updated, e.g. delivered)
    if (
      (this.isNew || this.isModified('date')) &&
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
// NOTE: the previous version of this hook had an IP_ADDRESS guard that would
//       skip status transitions when `locked_by !== IP_ADDRESS`. This caused
//       emails to get permanently stuck as `queued + is_locked: true` in
//       multi-server or container-restart scenarios. The atomic lock acquisition
//       in process-email.js (findOneAndUpdate with is_locked: false) already
//       guarantees single-writer semantics, so the IP guard is no longer needed.
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
    // If status is not 'queued' and there are no rejectedErrors,
    // there is nothing for this hook to do (e.g. 'deferred' without new errors).
    //
    if (this.status !== 'queued' && this.rejectedErrors.length === 0)
      return next();
    // if all recipients were rejected (5xx), then status is "bounced"
    // if some recipients accepted and others were rejected (5xx) then status is "partially_sent"
    if (this.rejectedErrors.length > 0) {
      //
      // isCodeBug path: these are transient infrastructure errors
      // (e.g. MongoServerError, RedisError) that should be retried.
      // We unlock the email so it can be picked up again immediately.
      // The existing maxRetryDuration (5 days) time-based bounce in
      // process-email.js will eventually bounce the email if the
      // infrastructure issue persists.
      //
      if (
        this.status === 'queued' &&
        this.rejectedErrors.every((err) => err.isCodeBug === true)
      ) {
        const codeBugCount = this.rejectedErrors.filter(
          (err) => err.isCodeBug === true
        ).length;
        // Log every isCodeBug occurrence for visibility
        console.error(
          '[WARN:emails-pre-save] isCodeBug=true for all rejectedErrors, unlocking for retry',
          JSON.stringify({
            emailId: this._id,
            codeBugCount,
            firstErrName: this.rejectedErrors[0]?.name,
            firstErrMsg: this.rejectedErrors[0]?.message?.slice(0, 200),
            locked_by: this.locked_by,
            ip: IP_ADDRESS
          })
        );
        // Unlock for retry (time-based maxRetryDuration will eventually bounce)
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
        this.is_locked = false;
        this.locked_by = undefined;
        this.locked_at = undefined;
        return next();
      }

      // otherwise status is deferred; the lock is released here and the email is
      // retried by the send-emails job, which picks up `deferred` emails directly
      // (with a 1m backoff enforced at lock acquisition in helpers/process-email.js)
      this.status = 'deferred';
      this.is_locked = false;
      this.locked_by = undefined;
      this.locked_at = undefined;
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

//
// NOTE: some clients like emClient will retry multiple times
//       therefore we should check for duplicate `messageId`, `date`, and `envelope`
//
Emails.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    const exists = await this.constructor.exists({
      messageId: this.messageId,
      date: this.date,
      domain: this.domain,
      user: this.user,
      envelope: this.envelope
    });

    if (exists) {
      const err = Boom.badRequest(
        i18n.translateError('EMAIL_ALREADY_EXISTS', i18n.config.defaultLocale)
      );
      //
      // NOTE: we could use `email = ` instead of `exists =` in future
      //       if we want more debug info on the emails that are duplicates
      //       (and then we'd set `err.email = email;` here instead)
      //
      err.emailAlreadyExists = true;
      throw err;
    }

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

  // return early if domain is suspended or if email was marked as spam
  // (this way we can investigate spam detected content/links to help users)
  if (
    domain.is_smtp_suspended ||
    (Array.isArray(email.rejectedErrors) &&
      email.rejectedErrors.some(
        (err) =>
          _.isObject(err) &&
          err?.truthSource &&
          err?.bounceInfo?.category === 'spam'
      ))
  )
    return;

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

//
// Guard against BSON overflow (ERR_OUT_OF_RANGE) on oversized Email documents.
// The rejectedErrors and deliveries arrays can grow unbounded across retries,
// and each entry carries full stack traces, MX/TLS metadata, and bounceInfo.
//
// This pre-save hook performs ONLY cheap in-place truncation of diagnostic
// strings (stacks, responses). It does NOT measure document byte size — that
// is extremely expensive for large emails (toObject + JSON serialization of
// documents up to 50 MB). Instead, if the save still fails with a BSON
// overflow, bsonOverflowFallbackSave handles progressive trimming and retry.
//
const MAX_STACK_LENGTH = 1024;
const MAX_RESPONSE_LENGTH = 512;
const MAX_DELIVERY_RESPONSE_LENGTH = 256;

Emails.pre('save', function (next) {
  try {
    // Truncate stacks and long response strings on rejectedErrors
    if (Array.isArray(this.rejectedErrors)) {
      for (const err of this.rejectedErrors) {
        if (
          typeof err.stack === 'string' &&
          err.stack.length > MAX_STACK_LENGTH
        )
          err.stack = err.stack.slice(0, MAX_STACK_LENGTH) + '...[truncated]';
        if (
          typeof err.response === 'string' &&
          err.response.length > MAX_RESPONSE_LENGTH
        )
          err.response =
            err.response.slice(0, MAX_RESPONSE_LENGTH) + '...[truncated]';
      }
    }

    // Deduplicate and cap deliveries to prevent exponential growth on retries
    if (Array.isArray(this.deliveries) && this.deliveries.length > 0) {
      // Deduplicate by recipient+date key (keep first occurrence)
      const seen = new Set();
      this.deliveries = this.deliveries.filter((d) => {
        const key = `${d.recipient}|${d.date?.toISOString?.() || d.date}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Cap at a reasonable maximum (one email can have at most ~100 recipients)
      if (this.deliveries.length > 128) {
        this.deliveries = this.deliveries.slice(-128);
      }

      // Truncate long response strings
      for (const d of this.deliveries) {
        if (
          typeof d.response === 'string' &&
          d.response.length > MAX_DELIVERY_RESPONSE_LENGTH
        )
          d.response =
            d.response.slice(0, MAX_DELIVERY_RESPONSE_LENGTH) +
            '...[truncated]';
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

Emails.pre('save', async function (next) {
  this._isNew = this.isNew;
  next();
});

// once saved, the message counts (see below)
Emails.post('save', function () {
  if (this.$locals) this.$locals.releaseRecipients = null;
});

// a message that failed to save does not count toward the sender's daily
// threshold and recipients (see `helpers/check-smtp-velocity.js`)
Emails.post('save', function (err, doc, next) {
  if (typeof this.$locals?.releaseRecipients === 'function') {
    this.$locals.releaseRecipients();
    this.$locals.releaseRecipients = null;
  }

  next(err);
});

//
// Rate limiting pre-save hook for the API path.
// The SMTP path checks limits in helpers/on-data-smtp.js before queueing.
// The API path (Emails.queue → this.create) triggers this hook.
// Uses this.constructor.countDocuments() against the database directly.
//
Emails.pre('save', async function (next) {
  if (!this._isNew) return next();
  // Skip rate limiting for bounce/DSN emails
  if (this.is_bounce === true) return next();
  // Skip if already enforced before queueing (SMTP path)
  if (this.$locals.rateLimitChecked === true) return next();

  // (undoes counting this message toward its alias's limit if it is refused)
  let releaseAlias = () => {};
  try {
    const EmailModel = this.constructor;
    const [user, domain] = await Promise.all([
      Users.findById(this.user)
        .select(
          `id email plan group ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpBaselineDaily} ${config.userFields.smtpBaselineAt} ${config.userFields.smtpBaselineHourly} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID} ${config.userFields.isBanned} ${config.lastLocaleField}`
        )
        .lean()
        .exec(),
      Domains.findById(this.domain)
        .populate(
          'members.user',
          `id plan group ${config.userFields.isBanned} ${config.userFields.smtpLimit} ${config.userFields.smtpReputationTier} ${config.userFields.smtpReputationHoldUntil} ${config.userFields.smtpReputationHoldReason} ${config.userFields.smtpReputationLendHoldUntil} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
        )
        .select('id plan members name smtp_daily_counts smtp_daily_counts_at')
        .lean()
        .exec()
    ]);

    if (!user) throw new SMTPError('User does not exist', { ignoreHook: true });
    if (!domain)
      throw new SMTPError('Domain does not exist', { ignoreHook: true });

    //
    // Per-alias limit (the same as over SMTP, see `helpers/on-data-smtp.js`):
    // an alias with a custom `smtp_limit` is checked first, and mail sent
    // without an alias uses the catch-all ('*') alias's limit
    //
    {
      const rateLimitAlias = this.alias
        ? await Aliases.findById(this.alias)
            .select('_id name smtp_limit')
            .lean()
            .exec()
        : await Aliases.findOne({ domain: domain._id, name: '*' })
            .select('_id name smtp_limit')
            .lean()
            .exec();
      if (rateLimitAlias && rateLimitAlias.smtp_limit > 0) {
        // (one time for the count and the reservation's day)
        const aliasNow = new Date();
        const startOfDay = getSmtpDayStart(aliasNow);
        const aliasCount = await EmailModel.countDocuments(
          rateLimitAlias.name === '*'
            ? {
                domain: domain._id,
                $or: [
                  { alias: rateLimitAlias._id },
                  { alias: { $exists: false } },
                  { alias: null }
                ],
                // (bounces and auto-replies do not count)
                is_bounce: { $ne: true },
                created_at: { $gte: startOfDay }
              }
            : {
                alias: rateLimitAlias._id,
                is_bounce: { $ne: true },
                created_at: { $gte: startOfDay }
              }
        );
        // (reserved atomically, so concurrent submissions cannot pass it, and
        // released if the message is refused below or fails to save)
        releaseAlias = await reserveAliasMessage({
          client: redis,
          alias: rateLimitAlias,
          count: aliasCount,
          now: aliasNow
        });
      }
    }

    //
    // Daily thresholds (see `helpers/get-smtp-sending-limits.js`)
    //
    // (one time for the counts and the reservations, see `checkSmtpVelocity`)
    const now = new Date();
    const limits = await enforceSmtpSendingLimits({
      user,
      domain,
      Users,
      Domains,
      Emails: EmailModel,
      client: redis,
      now
    });

    this.$locals.releaseRecipients = releaseAlias;
    if (!limits.isExempt) {
      // slow down unusual sending patterns (regardless of threshold)
      // (recipients of a message that fails to save do not count)
      const releaseVelocity = await checkSmtpVelocity({
        user,
        domain,
        dailyLimit: limits.userLimit,
        todayCount: limits.userCount,
        domainLimit: limits.domainLimit,
        domainCount: limits.domainCount,
        accountId: limits.accountId,
        accountLimit: limits.accountLimit,
        accountCount: limits.accountCount,
        date: this.date,
        recipients: Array.isArray(this.envelope?.to)
          ? this.envelope.to.length
          : 1,
        to: this.envelope?.to,
        Emails: EmailModel,
        Users,
        client: redis,
        now
      });
      this.$locals.releaseRecipients = () => {
        releaseAlias();
        releaseVelocity();
      };
    }

    next();
  } catch (err) {
    releaseAlias();
    this.$locals.releaseRecipients = null;
    next(err);
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
// options.dsn (for DSN from API)
// options.rcptTo (for DSN from SMTP)

Emails.statics.queue = async function (
  options = {},
  locale = i18n.config.defaultLocale
) {
  const isBounce = boolean(options?.is_bounce);

  //
  // NOTE: memory-leak warning from nodemailer message docs:
  //       when using readable streams as content if sending fails then
  //       nodemailer does not abort opened and not finished stream
  //

  //
  // Strip HTML tags from email subjects before sending.
  // Many translated phrase keys contain <span class="notranslate">...</span>
  // wrappers for translation services, which are fine for HTML email bodies
  // but render as raw HTML in plain-text email subjects.
  // (see https://github.com/forwardemail/forwardemail.net/issues/475)
  //
  if (options?.message?.subject)
    options.message.subject = decode(striptags(options.message.subject));

  // this allow us to pass an already created nodemailer transport stream for parsing
  const info = options?.info || (await transporter.sendMail(options.message));

  const messageSplitter = new MessageSplitter({
    maxBytes: MAX_BYTES
  });
  const body = await getStream.buffer(
    getEmailMessageStream(info?.message).pipe(messageSplitter),
    {
      maxBuffer: MAX_BYTES
    }
  );

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

  //
  // RFC 5322 permits exactly one From field, and the check below reads a
  // single one: with a second field (e.g. "FROM:", "From :", one on the
  // first line after whitespace, or one after a bare CR, which some
  // receivers end a line on) it could see the sender's own alias while
  // recipients are shown the other address
  //
  // (the lines are counted here, since the header parser drops a first
  // line starting with "From " as an mbox separator, but it is still sent)
  //
  if (
    headers.headers
      .toString()
      .split(/\r\n|\r|\n/)
      .filter((line, i) =>
        (i === 0 ? /^\s*from\s*:/i : /^from\s*:/i).test(line)
      ).length > 1
  )
    throw Boom.forbidden('The email sent contains multiple From headers');

  const isEnvelopeToEmpty = info.envelope.to.length === 0;
  const isEnvelopeFromEmpty = !info.envelope.from;

  //
  // ensure from header is equal to the alias sending from
  // (avoids confusing "Invalid DKIM signature" error message)
  //
  let from;

  const obj = getHeaders(headers);

  for (const key of Object.keys(obj)) {
    const lc = key.toLowerCase();
    if (!ADDRESS_KEYS.has(lc)) continue;

    const addresses = parseAddresses(obj[key]);
    if (!_.isArray(addresses) || _.isEmpty(addresses)) continue;

    // there should only be one value in From header
    if (lc === 'from' && addresses.length === 1) {
      //
      // rewrite from header to be without "+" symbol
      // so that users can send with "+" address filtering
      //
      const name = parseUsername(addresses[0]); // converts to ASCII
      const domain = parseHostFromDomainOrAddress(addresses[0]); // converts to ASCII
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
        (!info.envelope.from || (isEnvelopeFromEmpty && lc === 'from')) &&
        SENDER_KEYS.has(lc)
      )
        info.envelope.from = addresses[0];
      // envelope to
      else if (isEnvelopeToEmpty && RCPT_TO_KEYS.has(lc)) {
        for (const address of addresses) {
          if (info.envelope.to.includes(address)) continue;
          info.envelope.to.push(address);
        }
      }
    }
  }

  //
  // based off the logged in user we need to lookup the associated domain
  // and ensure that either the user is an admin or the alias is owned by them
  // (and the domain must be on a paid plan)
  //
  if (!info.envelope.from || !isEmail(info.envelope.from))
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
  else if (mongoose.isObjectIdOrHexString(options?.user))
    userId = options?.user.toString();

  let domain;

  // TODO: this is a double lookup on the domain
  //       (but we keep it here because we rely on `populate`)
  if (_.isObject(options.domain)) {
    if (mongoose.isObjectIdOrHexString(options.domain)) {
      domain = await Domains.findOne({
        _id: options.domain
      }).populate(
        'members.user',
        `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
      );
    } else if (options.domain._id) {
      domain = await Domains.findOne({
        _id: options.domain._id
      }).populate(
        'members.user',
        `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
      );
    }
  } else if (mongoose.isObjectIdOrHexString(options.domain)) {
    domain = await Domains.findOne({
      _id: options.domain
    }).populate(
      'members.user',
      `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
    );
  } else if (userId) {
    domain = await Domains.findOne({
      name: domainName,
      'members.user': new mongoose.Types.ObjectId(userId)
    }).populate(
      'members.user',
      `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
    );
  }

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
  if (!domain.has_smtp) {
    //
    // Attempt auto-approval: if DNS records are verified and the user
    // meets auto-approval criteria (e.g. passed KYC), approve on the fly.
    // This mirrors the logic from the "Verify SMTP" button flow.
    //
    try {
      if (userId) {
        // Create a resolver using the existing redis client in this module
        if (!_emailsResolver) {
          _emailsResolver = createTangerine(redis, logger);
        }

        const { isAutoApproved } = await checkAndAutoApproveSMTP({
          domain,
          resolver: _emailsResolver,
          userId
        });

        if (isAutoApproved) {
          logger.info('API auto-approved domain for SMTP', {
            domain: domain.name,
            userId
          });
        }
      }
    } catch (err) {
      // Log but do not throw – fall through to the existing error message
      logger.error(err, { domain: domain.name });
    }

    // Re-check after auto-approval attempt
    if (!domain.has_smtp)
      throw Boom.forbidden(
        i18n.translateError('EMAIL_SMTP_ACCESS_REQUIRED', locale)
      );
  }

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
          isSANB(m.user[config.userFields.paypalSubscriptionID]) ||
          // Allow access during 15-day grace period for paid users
          isWithinGracePeriod(m.user)) &&
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
    //
    // an explicit alias (e.g. the alias that authenticated) may be passed
    // as a document, an ObjectId, or a string id (API alias auth passes
    // a string), and it must always resolve to exactly that alias,
    // otherwise the From address would be looked up by name instead
    //
    let aliasId;
    if (mongoose.isObjectIdOrHexString(options.alias)) aliasId = options.alias;
    else if (
      _.isObject(options.alias) &&
      mongoose.isObjectIdOrHexString(options.alias._id)
    )
      aliasId = options.alias._id;

    // TODO: this is a double lookup on the alias
    //       (but we keep it here because we rely on `populate`)
    if (aliasId) {
      alias = await Aliases.findOne({
        _id: aliasId,
        domain: domain._id
      }).populate('user', `id ${config.userFields.isBanned}`);

      // bounces keep their old behavior (the alias may since be removed)
      if (!alias && !isBounce)
        throw Boom.forbidden(
          i18n.translateError('ALIAS_DOES_NOT_EXIST', locale)
        );
    } else if (options.alias && !isBounce) {
      throw Boom.forbidden(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));
    } else if (userId) {
      alias = await Aliases.findOne(
        member.group === 'admin'
          ? {
              domain: domain._id,
              name: aliasName
            }
          : {
              // users that are not admins must be an owner of the alias to send as it
              user: new mongoose.Types.ObjectId(userId),
              domain: domain._id,
              // alias names are stored lowercase and without a "+" tag
              // (so "+" address filtering keeps working for members)
              name: aliasName.split('+')[0].toLowerCase()
            }
      ).populate('user', `id ${config.userFields.isBanned}`);
    }

    //
    // without a matching alias only domain admins may send from any
    // address on the domain (a `user` member must own the alias)
    //
    if (!alias && !isBounce && member.group !== 'admin')
      throw Boom.forbidden(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));
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

  // (a member who is not an admin can only send as their own aliases, e.g.
  // with a "+" tag, or with a catch-all password)
  if (
    !options.catchall &&
    !alias &&
    !isBounce &&
    member.group !== 'admin' &&
    userId &&
    aliasName.includes('+')
  ) {
    alias = await Aliases.findOne({
      user: new mongoose.Types.ObjectId(userId),
      domain: domain._id,
      name: aliasName.split('+')[0]
    }).populate('user', `id ${config.userFields.isBanned}`);
    if (alias && alias.user[config.userFields.isBanned])
      throw Boom.forbidden(i18n.translateError('ALIAS_ACCOUNT_BANNED', locale));
    if (alias && !alias.is_enabled)
      throw Boom.badRequest(
        i18n.translateError('ALIAS_IS_NOT_ENABLED', locale)
      );
  }

  if (!options.catchall && !alias && !isBounce && member.group !== 'admin')
    throw Boom.forbidden(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));

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
    from !==
      `${punycode.toASCII(alias.name)}@${punycode.toASCII(domain.name)}` &&
    !isBounce
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
    isEmail(info.envelope.from) &&
    //
    // only our own system mail (sent as support@ on our own domain) skips
    // the scan; the envelope sender alone is client-controlled
    //
    !(
      config.supportEmail === info.envelope.from.toLowerCase() &&
      punycode.toASCII(domain.name).toLowerCase() ===
        config.webHost.toLowerCase()
    ) &&
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
        isEmail(to) &&
        ![config.supportEmail, config.abuseEmail].includes(to.toLowerCase())
    )
  ) {
    if (!SpamScanner) SpamScanner = require('spamscanner');
    if (!scanner)
      scanner = new SpamScanner({
        logger,
        clamscan: env.NODE_ENV === 'test'
      });

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
        // only send smtp prevented emails once a day for the domain
        const key = `smtp_prevented:${domain.id}`;
        const cache = await redis.get(key);
        if (!cache) {
          await emailHelper({
            template: 'smtp-prevented',
            message: { to: obj.to }, // , bcc: config.alertsEmail },
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
          await redis.set(key, true, 'PX', ms('1d'));
        }
      } catch (err) {
        // NOTE: it would be better to use `ctx.logger` probably here
        logger.fatal(err);
      }

      // needs to be forbidden so it gets mapped to 5xx error
      const error = Boom.forbidden(messages.join(' '));
      error.scan = scan;
      throw error;
    }
  }

  // Determine status based on domain suspension
  let status = 'queued';

  // If domain is suspended or explicitly marked as pending
  if (_.isDate(domain.smtp_suspended_sent_at) || options?.isPending === true) {
    status = 'pending';
  }

  const email = new this({
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
    is_bounce: isBounce,
    is_dsn: isBounce && boolean(options?.is_dsn),
    dsn: options?.dsn,
    rcptTo: options?.rcptTo,
    requireTLS: boolean(options?.requireTLS)
  });

  // the SMTP path already enforced sending limits before queueing
  if (options?.rateLimitChecked === true) email.$locals.rateLimitChecked = true;

  await email.save();

  return email;
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Emails', Emails);
