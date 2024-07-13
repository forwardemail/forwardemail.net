/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

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

async function create(ctx) {
  const { body } = ctx.request;

  ctx.logger.info('creating inquiry from webhook');

  // TODO: Add support for webhook payload signature:
  // https://stackoverflow.com/questions/68885086/how-to-create-signed-webhook-requests-in-nodejs/68885281#68885281
  if (
    !ctx.allowlistValue ||
    ![env.MX1_HOST, env.MX2_HOST, env.WEB_HOST].includes(ctx.allowlistValue)
  )
    throw Boom.forbidden(ctx.translateError('INVALID_INQUIRY_WEBHOOK_REQUEST'));

  const { headerLines, session, text } = body;
  if (!session)
    Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD'));

  if (!isSANB(text))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_INQUIRY_WEBHOOK_PAYLOAD'))
    );

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

    const previousInquiry = await Inquiries.findOne({
      sender_email: sender,
      subject
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
