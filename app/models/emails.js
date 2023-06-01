const { Buffer } = require('buffer');

const Boom = require('@hapi/boom');
const SpamScanner = require('spamscanner');
const _ = require('lodash');
const bytes = require('bytes');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');
const noReplyList = require('reserved-email-addresses-list/no-reply-list.json');
const nodemailer = require('nodemailer');
const parseErr = require('parse-err');
const { Iconv } = require('iconv');
const { isEmail } = require('validator');
const { simpleParser } = require('mailparser');

const Aliases = require('./aliases');
const Domains = require('./domains');
const Users = require('./users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const getErrorCode = require('#helpers/get-error-code');
const i18n = require('#helpers/i18n');
const isCodeBug = require('#helpers/is-code-bug');
const logger = require('#helpers/logger');

const NO_REPLY_USERNAMES = new Set(noReplyList);
const ONE_SECOND_AFTER_UNIX_EPOCH = new Date(1000);

const HUMAN_MAX_DAYS_IN_ADVANCE = '30d';
const MAX_DAYS_IN_ADVANCE_TO_MS = ms(HUMAN_MAX_DAYS_IN_ADVANCE);

const HUMAN_MAX_BYTES = '50MB';
const MAX_BYTES = bytes(HUMAN_MAX_BYTES);

const transporter = nodemailer.createTransport({
  streamTransport: true,
  buffer: true
});

const scanner = new SpamScanner({
  logger,
  clamscan: env.NODE_ENV === 'test'
});

const Emails = new mongoose.Schema({
  alias: {
    type: mongoose.Schema.ObjectId,
    ref: Aliases,
    required: true,
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
  // `locked_by` is the IP address of which smtp server locked it for sending
  locked_by: String,
  // every 1m the job "unlock-emails" will unlock emails frozen for more than 5m
  locked_at: Date,
  // envelope
  envelope: {
    from: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: isEmail
    },
    // list of email addresses to sent to
    // (combined To, Cc, Bcc - and then Bcc is removed from headers)
    to: mongoose.Schema.Types.Mixed
  },
  // email to be sent (with date, message-id, etc headers already set)
  message: {
    type: mongoose.Schema.Types.Buffer,
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
    required: true,
    index: true
  },
  // accepted (Array of emails already accepted so we don't resend)
  accepted: [
    {
      type: String,
      lowercase: true,
      trim: true,
      validate: isEmail
    }
  ],
  //
  // an array of errors with `err.recipient` as the email address rejected
  // (we only store the most recent `rejectedError` per recipient)
  //
  rejectedErrors: [mongoose.Schema.Types.Mixed]
});

Emails.plugin(mongooseCommonPlugin, {
  object: 'email',
  locale: false,
  omitExtraFields: ['_id', '__v', 'message', 'locked_by', 'locked_at']
});

// when we query against `locked_at` we also need to query for `$exists: true` for hint to work
Emails.index(
  { locked_at: 1 },
  { partialFilterExpression: { locked_at: { $exists: true } } }
);

//
// validate envelope
//
Emails.pre('validate', function (next) {
  try {
    if (!_.isObject(this.envelope)) throw new Error('Envelope missing');

    if (!isSANB(this.envelope.from) || !isEmail(this.envelope.from))
      throw new Error('Envelope from missing');

    // list of email addresses to sent to
    // (combined To, Cc, Bcc - and then Bcc is removed from headers)
    if (!_.isArray(this.envelope.to) || _.isEmpty(this.envelope.to))
      throw new Error('Envelope to missing');

    // if the envelope is in address object format then convert it
    // make the envelope to unique
    this.envelope.to = _.uniq(
      this.envelope.to.map((to) =>
        typeof to === 'object' && typeof to.address === 'string'
          ? to.address.trim().toLowerCase()
          : to.trim().toLowerCase()
      )
    );

    // ensure all valid emails
    if (!this.envelope.to.every((to) => isEmail(to)))
      throw new Error('Envelope to requires valid email addresses');

    // prevent sending to no-reply address
    if (
      this.envelope.to.some((to) =>
        NO_REPLY_USERNAMES.has(to.replace(/[^\da-z]/g, ''))
      )
    )
      throw new Error('Envelope to cannot contain a "no-reply" email address');

    this.envelope = _.pick(this.envelope, ['from', 'to']);

    if (this.envelope.to.length > 50)
      throw new Error('Exceeded max recipient size');

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
    // ensure message exists and is a buffer
    if (!Buffer.isBuffer(this.message))
      throw new Error('Buffer must be a message');

    // ensure the message is not more than 50 MB
    const bytes = Buffer.byteLength(this.message);
    if (bytes > MAX_BYTES)
      throw new Error(`Email size of ${HUMAN_MAX_BYTES} exceeded.`);

    // TODO: validate Message-Id header to RFC spec (even though we set it if not exists)
    // <https://stackoverflow.com/a/4031705>

    // TODO: ensure that From header exists with at least one valid address (RFC 5322)

    if (!Array.isArray(this.accepted)) this.accepted = [];
    if (!Array.isArray(this.rejectedErrors)) this.rejectedErrors = [];

    // ensure accepted is lowercased and unique
    this.accepted = _.uniq(this.accepted.map((a) => a.toLowerCase()));

    // ensure that all `rejectedErrors` are Objects not Errors
    this.rejectedErrors = this.rejectedErrors.map((err) => {
      const e = err instanceof Error ? parseErr(err) : err;
      //
      // these two properties are set to ensure consistency of `rejectedErrors`
      // (each err has `err.recipient` and `err.responseCode` per nodemailer)
      //
      e.isCodeBug = isCodeBug(err);
      e.responseCode = getErrorCode(err);
      if (typeof e.recipient !== 'string' || !isEmail(e.recipient))
        throw new Error('Recipient was missing from error');
      return e;
    });

    // filter out any `accepted` from `rejectedErrors`
    this.rejectedErrors = this.rejectedErrors.filter(
      (err) => !this.accepted.includes(err.recipient)
    );

    // ensure that `rejectedErrors` are unique (by most recent/last added)
    this.rejectedErrors = _.uniqBy(this.rejectedErrors.reverse(), 'recipient');

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
      throw new Error(
        'Date header must be valid date that is at least 1s after Unix epoch.'
      );

    // ensure date is not more than 30d+ in advance of `this.created_at`
    if (
      this.date.getTime() >
      this.created_at.getTime() + MAX_DAYS_IN_ADVANCE_TO_MS
    )
      throw new Error(
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

    // we only want to modify the status when it is in a "queued" state
    if (this.status !== 'queued' && this.rejectedErrors.length === 0)
      return next();

    //
    // NOTE: we do not unset lock status because the job
    //       "unlock-emails" handles this for us
    //
    // this.locked_by = undefined;
    // this.locked_at = undefined;

    // if all recipients were accepted, then status is "sent"
    if (this.accepted.sort().join(',') === this.envelope.to.sort().join(',')) {
      this.status = 'sent';
      return next();
    }

    // if all recipients were rejected (5xx), then status is "bounced"
    // if some recipients accepted and others were rejected (5xx) then status is "partially_sent"
    if (this.rejectedErrors.length > 0) {
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

// options.message (Buffer or nodemailer Object)
// options.alias
// options.domain
// options.user (from `ctx.state.user` or `alias.user`)
// options.date
// eslint-disable-next-line complexity
Emails.statics.queue = async function (
  options = {},
  locale = i18n.defaultLocale
) {
  //
  // NOTE: memory-leak warning from nodemailer message docs:
  //       when using readable streams as content if sending fails then
  //       nodemailer does not abort opened and not finished stream
  //
  const info = await transporter.sendMail(options.message);

  // ensure the message is not more than 50 MB
  const bytes = Buffer.byteLength(info.message);
  if (bytes > MAX_BYTES)
    throw new Error(`Email size of ${HUMAN_MAX_BYTES} exceeded.`);

  const parsed = await simpleParser(info.message, {
    Iconv,
    skipImageLinks: true,
    skipHtmlToText: false,
    skipTextToHtml: false,
    skipTextLinks: true
  });

  //
  // in case the email was `raw`, the envelope won't be parsed right away
  // so we rely on the parsed headers from `mailparser` to re-create envelope
  // <https://github.com/nodemailer/nodemailer/blob/e3cc93a9c20939b209c804857c75aea0d3305913/lib/mime-node/index.js#LL882C1-L898C57>
  //
  if (
    options?.message?.raw &&
    info.envelope.from === false &&
    info.envelope.to.length === 0
  ) {
    // envelope from
    for (const key of ['from', 'sender', 'reply-to']) {
      const obj = parsed.headers.get(key);
      if (
        _.isObject(obj) &&
        _.isArray(obj.value) &&
        _.isObject(obj.value[0]) &&
        isEmail(obj.value[0].address)
      ) {
        info.envelope.from = obj.value[0].address;
        break;
      }
    }

    // envelope to
    for (const key of ['to', 'cc', 'bcc']) {
      const obj = parsed.headers.get(key);
      if (_.isObject(obj) && _.isArray(obj.value)) {
        for (const val of obj.value) {
          // eslint-disable-next-line max-depth
          if (_.isObject(val) && isEmail(val.address)) {
            info.envelope.to.push(val);
          }
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
    info.envelope.from === false ||
    typeof info.envelope.from !== 'string' ||
    !isEmail(info.envelope.from)
  )
    throw Boom.badRequest(i18n.translateError('ENVELOPE_FROM_MISSING', locale));

  const [aliasName, domainName] = info.envelope.from.split('@');

  if (aliasName === '*')
    throw Boom.badRequest(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));

  const domain =
    options.domain ||
    (options?.user?._id
      ? await Domains.findOne({
          name: domainName,
          'members.user': options.user._id
        }).populate(
          'members.user',
          `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt}`
        )
      : null);

  if (!domain)
    throw Boom.notFound(i18n.translateError('DOMAIN_DOES_NOT_EXIST', locale));

  if (domain.is_global)
    throw Boom.notFound(
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
        new Date(m.user[config.userFields.planExpiresAt]).getTime() >=
          Date.now() &&
        m.group === 'admin'
    )
  )
    throw Boom.forbidden(
      i18n.translateError('PAST_DUE_OR_INVALID_ADMIN', locale)
    );

  const member = domain.members.find(
    (member) => member.user.id === options?.user?.id
  );

  if (!member)
    throw Boom.notFound(i18n.translateError('INVALID_MEMBER', locale));

  //
  // ensure the alias exists
  //
  // NOTE: in the future we will support admins sending from _any_ alias regardless if it exists or not
  //       (most likely with a fall-back that is to the catch-all on the domain, and enforce that as a requirement)
  //
  const alias =
    options.alias ||
    (options?.user?._id
      ? await Aliases.findOne(
          member.group === 'admin'
            ? {
                domain: domain._id,
                name: aliasName
              }
            : {
                // users that are not admins must be an owner of the alias to send as it
                user: options.user._id,
                domain: domain._id,
                name: aliasName
              }
        ).populate('user', `id ${config.userFields.isBanned}`)
      : null);

  // alias must exist
  if (!alias)
    throw Boom.badRequest(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));

  // alias must not have banned user
  if (alias.user[config.userFields.isBanned])
    throw Boom.forbidden(i18n.translateError('ALIAS_ACCOUNT_BANNED', locale));

  // alias must be enabled
  if (!alias.is_enabled)
    throw Boom.notFound(i18n.translateError('ALIAS_IS_NOT_ENABLED', locale));

  const date =
    parsed.headers.get('date') && _.isDate(parsed.headers.get('date'))
      ? parsed.headers.get('date')
      : _.isDate(options.date)
      ? options.date
      : new Date();
  const messageId = parsed.headers.get('message-id') || info.messageId;
  const subject = parsed.headers.get('subject');

  //
  // sanitize message and attachments
  //
  // `parsed.attachments`
  //
  const [phishing, executables, arbitrary, viruses] = await Promise.all([
    scanner.getPhishingResults(parsed),
    scanner.getExecutableResults(parsed),
    scanner.getArbitraryResults(parsed),
    scanner.getVirusResults(parsed)
  ]);

  const messages = [
    ...new Set([...phishing.messages, ...executables, ...arbitrary, ...viruses])
  ];

  if (messages.length > 0) {
    // send an email to all admins of the domain
    const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
    try {
      await emailHelper({
        template: 'smtp-suspended',
        message: { to: obj.to, bcc: config.email.message.from },
        locals: {
          domain:
            typeof domain.toObject === 'function' ? domain.toObject() : domain,
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
            typeof m.user === 'object' && typeof m.user._id === 'object'
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
          smtp_suspended_sent_at: new Date()
        }
      });

    // needs to be forbidden so it gets mapped to 5xx error
    const error = Boom.forbidden(messages.join(' '));
    error.messages = messages;
    error.phishing = phishing;
    error.executables = executables;
    error.arbitrary = arbitrary;
    error.viruses = viruses;
    throw error;
  }

  const headers = {};
  for (const headerLine of parsed.headerLines) {
    const index = headerLine.line.indexOf(': ');
    const header = parsed.headers.get(headerLine.key);
    const key = headerLine.line.slice(0, index);
    let value = headerLine.line.slice(index + 2);
    if (header) {
      switch (headerLine.key) {
        case 'content-type':
        case 'content-disposition':
        case 'dkim-signature':
        case 'subject':
        case 'references':
        case 'message-id':
        case 'in-reply-to':
        case 'priority':
        case 'x-priority':
        case 'x-msmail-priority':
        case 'importance': {
          if (isSANB(header?.value)) {
            value = header.value;
          } else if (isSANB(header)) {
            value = header;
          }

          break;
        }

        default: {
          break;
        }
      }
    }

    headers[key] = value;
  }

  const status = _.isDate(domain.smtp_suspended_sent_at) ? 'pending' : 'queued';

  const email = await this.create({
    alias: alias._id,
    domain: domain._id,
    user: options?.user?._id,
    envelope: info.envelope,
    message: info.message,
    messageId,
    headers,
    date,
    subject,
    status
  });

  return email;
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'EMAILS_MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Emails', Emails);
