/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const env = require('#config/env');
const { Inquiries, Users } = require('#models');

function findSubject(headers) {
  for (const header of headers) {
    const key = header.key.toLowerCase();
    if (key === 'subject') {
      return header.line.split(': ')[1];
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

  const { attachments, headerLines, messageId, session, text } = body;
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

  const message = text;
  const references = [messageId];
  const subject = findSubject(headerLines);

  const isResolved = false;
  const isWebhook = true;

  let inquiry;
  try {
    const user = await Users.findOne({ email: sender });
    if (!user) ctx.logger.warn(`account not found for ${sender}`);

    inquiry = await Inquiries.create({
      user,
      sender_email: sender,
      message,
      is_denylist: user.is_denylist,
      is_resolved: isResolved,
      references,
      subject,
      is_webhook: isWebhook,
      attachments
    });
  } catch (err) {
    ctx.logger.error(err);
    return ctx.throw(err);
  }

  ctx.body = inquiry;
}

module.exports = { create };
