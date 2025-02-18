/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { createHmac } = require('node:crypto');
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const _ = require('lodash');
const { Headers } = require('mailsplit');

const config = require('#config');
const env = require('#config/env');
const isAutoReplyOrMailingList = require('#helpers/is-auto-reply-or-mailing-list');
const isEmail = require('#helpers/is-email');
const parseUsername = require('#helpers/parse-username');
const { Inquiries, Users } = require('#models');
const { decrypt } = require('#helpers/encrypt-decrypt');

const webhookSignatureKey = env.WEBHOOK_SIGNATURE_KEY;
const WEBHOOK_SIGNATURE_HEADER = 'X-Webhook-Signature';

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

  if (
    !ctx.allowlistValue ||
    ![env.MX1_HOST, env.MX2_HOST, env.WEB_HOST].includes(ctx.allowlistValue)
  )
    throw Boom.forbidden(ctx.translateError('INVALID_INQUIRY_WEBHOOK_REQUEST'));

  if (
    !_.isObject(requestHeaders) ||
    !isSANB(requestHeaders[WEBHOOK_SIGNATURE_HEADER])
  )
    throw Boom.badRequest(
      ctx.translateError('MISSING_INQUIRY_WEBHOOK_SIGNATURE_HEADER')
    );

  if (isSANB(webhookSignatureKey)) {
    const webhookSignature = createHmac('sha256', decrypt(webhookSignatureKey))
      .update(body)
      .digest('hex');

    if (requestHeaders[WEBHOOK_SIGNATURE_HEADER] !== webhookSignature)
      throw Boom.forbidden(
        ctx.translateError('INVALID_INQUIRY_WEBHOOK_SIGNATURE')
      );
  } else {
    const err = new TypeError(
      'Webhook signature key missing, did you forget to add it to .env?'
    );
    err.isCodeBug = true;
    ctx.logger.fatal(err);
  }

  const { headerLines, session, text } = body;
  const headers = new Headers(headerLines);

  if (!session)
    throw Boom.badRequest(
      ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD')
    );

  if (!isSANB(text))
    throw Boom.badRequest(
      ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD')
    );

  if (isAutoReplyOrMailingList(headers)) {
    const err = new TypeError(`Support inquiry suppressed from ${sender}`);
    err.body = body;
    ctx.logger.fatal(err);
  }

  const { recipient, sender } = session;

  if (parseUsername(recipient) !== parseUsername(config.supportEmail))
    throw Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_EMAIL'));

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
    throw err;
  }

  ctx.body = inquiry;
}

module.exports = { create };
