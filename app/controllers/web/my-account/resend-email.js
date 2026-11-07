/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const punycode = require('node:punycode');
const { pipeline } = require('node:stream');

const Boom = require('@hapi/boom');
const getStream = require('get-stream');
const intoStream = require('into-stream');
const { Splitter, Joiner } = require('mailsplit');

const _ = require('#helpers/lodash');
const config = require('#config');
const createSession = require('#helpers/create-session');
const smtpCodeToHttpError = require('#helpers/smtp-code-to-http-error');
const { Aliases, Domains, Emails } = require('#models');

//
// Only a message that is done being delivered can be resent, and only while
// its body is still stored (it is redacted once delivered or bounced, unless
// the domain has a retention period, see `app/models/emails.js`).
//
// Bounces and auto-replies we sent for the user are not resent, nor messages
// that a recipient rejected as spam or a virus (they count against the
// sender's reputation, see `helpers/record-smtp-reputation-report.js`).
//
const RESEND_STATUSES = new Set(['sent', 'partially_sent', 'bounced']);
const ABUSE_CATEGORIES = new Set(['spam', 'virus']);

//
// (with `ignoreRedaction`, whether it could be resent if its body had been
// kept, so the Resend button can say why it is not available)
//
function isResendable(email, ignoreRedaction = false) {
  return (
    RESEND_STATUSES.has(email.status) &&
    (ignoreRedaction || !email.is_redacted) &&
    !email.is_bounce &&
    !(email.rejectedErrors || []).some(
      (err) =>
        _.isObject(err?.bounceInfo) &&
        ABUSE_CATEGORIES.has(err.bounceInfo.category)
    )
  );
}

//
// The copy gets its own Message-ID and Date: recipients that already have
// the message would otherwise drop it as a duplicate, and `Emails.queue`
// takes the date it is sent with (and its retry period) from the Date header.
//
async function rewriteHeaders(raw, domainName) {
  const messageId = `<${randomUUID()}@${punycode.toASCII(domainName)}>`;
  const date = new Date().toUTCString().replace(/GMT/, '+0000');
  const splitter = new Splitter();
  const joiner = new Joiner();
  splitter.on('data', (data) => {
    if (data.type !== 'node' || data.root !== true) return;
    data.headers.remove('message-id');
    data.headers.add('Message-ID', messageId);
    data.headers.remove('date');
    data.headers.add('Date', date);
  });
  // (an error in any of the streams rejects, see `stream.pipeline`)
  return getStream.buffer(
    pipeline(intoStream(raw), splitter, joiner, () => {})
  );
}

//
// A copy of the message is queued as if it was just submitted, so it is
// scanned and counted toward the sending limits like any other message (see
// `Emails.queue`), and the original keeps its delivery history.
//
async function resendEmail(ctx) {
  const { email } = ctx.state;

  if (!isResendable(email))
    throw Boom.badRequest(ctx.translateError('EMAIL_RESEND_NOT_ALLOWED'));

  const domain = await Domains.findById(email.domain)
    .select('name')
    .lean()
    .exec();

  if (!domain) throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  //
  // An alias suspended from outbound SMTP cannot send it again, nor can the
  // catch-all alias for a message sent with a catch-all password, the same
  // as over SMTP and the API (while the domain is suspended the copy waits
  // for approval, see `Emails.queue`).
  //
  const alias = await Aliases.findOne(
    email.alias
      ? { _id: email.alias, domain: domain._id }
      : { domain: domain._id, name: '*' }
  )
    .select('smtp_suspended_sent_at')
    .lean()
    .exec();

  if (alias && _.isDate(alias.smtp_suspended_sent_at))
    throw Boom.forbidden(
      `Alias is suspended from outbound SMTP access, contact us at ${config.supportEmail}`
    );

  const { envelope, dsn, rcptTo, requireTLS } = email.toObject();

  let copy;
  try {
    const raw = await rewriteHeaders(
      await Emails.getMessage(email.message),
      domain.name
    );

    copy = await Emails.queue(
      {
        message: { envelope, raw },
        // (as an object, so it is sent as this alias, see `Emails.queue`)
        alias: email.alias ? { _id: email.alias } : undefined,
        catchall: !email.alias,
        domain: domain._id,
        // (sent by, and counted toward the limits of, whoever resends it)
        user: ctx.state.user,
        dsn,
        rcptTo,
        requireTLS,
        remoteAddress: ctx.ip
      },
      ctx.locale
    );
  } catch (err) {
    // (e.g. a 421 sending limit becomes a 429, see `Emails.queue`)
    throw smtpCodeToHttpError(err);
  }

  ctx.logger.debug('email resent', {
    session: createSession(copy),
    user: copy.user,
    email: copy._id,
    domains: [copy.domain],
    ignore_hook: false
  });

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    html: ctx.translate(
      'EMAIL_RESENT',
      ctx.state.l(`/my-account/emails/${copy.id}`)
    ),
    type: 'success'
  });

  const redirectTo = ctx.state.l('/my-account/emails');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = resendEmail;
module.exports.isResendable = isResendable;
