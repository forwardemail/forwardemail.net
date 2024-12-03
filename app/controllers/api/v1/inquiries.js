/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const bytes = require('@forwardemail/bytes');
const isSANB = require('is-string-and-not-blank');
const { Iconv } = require('iconv');
const { isEmail } = require('validator');
const { simpleParser } = require('mailparser');

const config = require('#config');
const env = require('#config/env');
const { Inquiries, Users } = require('#models');

function findHeaderByName(name, headers) {
  for (const header of headers) {
    const key = header.key.toLowerCase();
    if (key === name) {
      return header.line;
    }
  }

  return null;
}

// eslint-disable-next-line complexity
async function create(ctx) {
  const { body } = ctx.request;

  ctx.logger.info('creating inquiry from webhook');

  // TODO: Add support for webhook payload signature:
  // https://stackoverflow.com/questions/68885086/how-to-create-signed-webhook-requests-in-nodejs/68885281#68885281
  if (
    !ctx.allowlistValue ||
    ![env.MX1_HOST, env.MX2_HOST, env.WEB_HOST].includes(ctx.allowlistValue)
  )
    return ctx.throw(
      Boom.forbidden(ctx.translateError('INVALID_INQUIRY_WEBHOOK_REQUEST'))
    );

  let parsed;
  try {
    parsed = await simpleParser(body.raw, {
      Iconv,
      skipHtmlToText: true,
      skipTextLinks: true,
      skipTextToHtml: true,
      skipImageLinks: true,
      maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
    });
  } catch (err) {
    ctx.logger.error(err);
    return ctx.throw(err);
  }

  const { headerLines, session, text } = body;
  if (!session)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD'))
    );

  if (!isSANB(text))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD'))
    );

  if (
    (parsed.headers.has('Auto-submitted') &&
      parsed.headers.get('Auto-submitted') !== 'no') ||
    (parsed.headers.has('Auto-Submitted') &&
      parsed.headers.get('Auto-Submitted') !== 'no') ||
    (parsed.headers.has('X-Auto-Response-Suppress') &&
      ['dr', 'autoreply', 'auto-reply', 'auto_reply', 'all'].includes(
        parsed.headers.get('X-Auto-Response-Suppress').toLowerCase().trim()
      )) ||
    parsed.headers.has('List-Id') ||
    parsed.headers.has('List-id') ||
    parsed.headers.has('List-Unsubscribe') ||
    parsed.headers.has('List-unsubscribe') ||
    parsed.headers.has('Feedback-ID') ||
    parsed.headers.has('Feedback-Id') ||
    parsed.headers.has('X-Autoreply') ||
    parsed.headers.has('X-Auto-Reply') ||
    parsed.headers.has('X-AutoReply') ||
    parsed.headers.has('X-Autorespond') ||
    parsed.headers.has('X-Auto-Respond') ||
    parsed.headers.has('X-AutoRespond') ||
    (parsed.headers.has('Precedence') &&
      ['bulk', 'autoreply', 'auto-reply', 'auto_reply', 'list'].includes(
        parsed.headers.get('Precedence').toLowerCase().trim()
      ))
  )
    return;

  const { recipient, sender } = session;

  if (!recipient.includes('support@'))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_EMAIL'))
    );

  if (
    !Array.isArray(body?.from?.value) ||
    body.from.value.length === 0 ||
    typeof body.from.value[0] !== 'object' ||
    typeof body.from.value[0].address !== 'string' ||
    !isEmail(body.from.value[0].address)
  )
    throw new Error('Email address invalid');

  const subject = findHeaderByName('subject', headerLines);

  let inquiry;
  try {
    const user = await Users.findOne({ email: body.from.value[0].address });
    if (!user)
      ctx.logger.warn(`account not found for ${body.from.value[0].address}`);

    const messagePayload = {
      raw: body.raw,
      text: body.text
    };

    const index = subject.indexOf('#');
    if (index !== -1) {
      const reference = subject
        .slice(index + 1)
        .split(' ')[0]
        .trim();
      const previousInquiry = await Inquiries.findOne({
        ...(sender === config.supportEmail ? {} : { sender_email: sender }),
        reference
      });

      if (previousInquiry) {
        ctx.logger.info(
          `previous inquiry found for user: ${sender} with subject: ${subject}`
        );
        previousInquiry.messages.push(messagePayload);
        previousInquiry.is_resolved = false;
        await previousInquiry.save();
        ctx.body = previousInquiry;
        return;
      }
    }

    ctx.logger.info(
      `new inquiry found for user: ${sender} with subject: ${subject}`
    );

    inquiry = await Inquiries.create({
      user,
      sender_email: sender,
      messages: [messagePayload],
      is_denylist: user?.is_denylist,
      is_resolved: false,
      subject
    });
  } catch (err) {
    ctx.logger.error(err);
    return ctx.throw(err);
  }

  ctx.body = inquiry;
}

module.exports = { create };
