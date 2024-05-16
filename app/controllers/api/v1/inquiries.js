/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

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

  const is_resolved = false;
  const is_webhook = true;

  let inquiry;
  try {
    const user = await Users.findOne({ email: sender });
    if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

    inquiry = await Inquiries.create({
      user,
      message,
      is_denylist: user.is_denylist,
      is_resolved,
      references,
      subject,
      is_webhook,
      attachments
    });
  } catch (err) {
    ctx.logger.error(err);
    return ctx.throw(err);
  }

  ctx.body = inquiry;
}

module.exports = { create };
