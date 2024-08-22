/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { createHmac } = require('node:crypto');
const process = require('node:process');
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');
const { Headers } = require('mailsplit');

const { decrypt } = require('./encrypt-decrypt');
const config = require('#config');
const env = require('#config/env');
const { Inquiries, Users } = require('#models');

const webhookSignatureKey = process.env.WEBHOOK_SIGNATURE_KEY;

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
  const { body, headers: requestHeaders } = ctx.request;

  ctx.logger.info('creating inquiry from webhook');

  if (!requestHeaders['X-Webhook-Signature']) {
    return ctx.throw(
      Boom.badRequest(
        ctx.translateError('MISSING_INQUIRY_WEBHOOK_SIGNATURE_HEADER')
      )
    );
  }

  const webhookSignature = createHmac('sha256', decrypt(webhookSignatureKey))
    .update(body)
    .digest('hex');

  if (requestHeaders['X-Webhook-Signature'] !== webhookSignature) {
    return ctx.throw(
      Boom.forbidden(ctx.translateError('INVALID_INQUIRY_WEBHOOK_SIGNATURE'))
    );
  }

  if (
    !ctx.allowlistValue ||
    ![env.MX1_HOST, env.MX2_HOST, env.WEB_HOST].includes(ctx.allowlistValue)
  )
    return ctx.throw(
      Boom.forbidden(ctx.translateError('INVALID_INQUIRY_WEBHOOK_REQUEST'))
    );

  const { headerLines, session, text } = body;

  const headers = new Headers(headerLines);

  if (!session)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD'))
    );

  if (!isSANB(text))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD'))
    );

  if (
    (headers.hasHeader('Auto-submitted') &&
      headers.getFirst('Auto-submitted') !== 'no') ||
    (headers.hasHeader('Auto-Submitted') &&
      headers.getFirst('Auto-Submitted') !== 'no') ||
    (headers.hasHeader('X-Auto-Response-Suppress') &&
      ['dr', 'autoreply', 'auto-reply', 'auto_reply', 'all'].includes(
        headers.getFirst('X-Auto-Response-Suppress').toLowerCase().trim()
      )) ||
    headers.hasHeader('List-Id') ||
    headers.hasHeader('List-id') ||
    headers.hasHeader('List-Unsubscribe') ||
    headers.hasHeader('List-unsubscribe') ||
    headers.hasHeader('Feedback-ID') ||
    headers.hasHeader('Feedback-Id') ||
    headers.hasHeader('X-Autoreply') ||
    headers.hasHeader('X-Auto-Reply') ||
    headers.hasHeader('X-AutoReply') ||
    headers.hasHeader('X-Autorespond') ||
    headers.hasHeader('X-Auto-Respond') ||
    headers.hasHeader('X-AutoRespond') ||
    (headers.hasHeader('Precedence') &&
      ['bulk', 'autoreply', 'auto-reply', 'auto_reply', 'list'].includes(
        headers.getFirst('Precedence').toLowerCase().trim()
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
