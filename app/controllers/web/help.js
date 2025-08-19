/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const sanitize = require('sanitize-html');
const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');
const nodemailer = require('nodemailer');
const Axe = require('axe');
const _ = require('#helpers/lodash');

const emailHelper = require('#helpers/email');
const { Domains, Emails, Inquiries } = require('#models');
const config = require('#config');

const transporter = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  logger: new Axe({
    silent: true
  })
});

async function help(ctx) {
  const { body } = ctx.request;

  if (_.isString(body.message)) {
    body.message = sanitize(body.message, {
      allowedTags: [],
      allowedAttributes: []
    });
  }

  if (!isSANB(body.message))
    throw Boom.badRequest(ctx.translateError('INVALID_MESSAGE'));

  if (body.message.length > config.supportRequestMaxLength)
    throw Boom.badRequest(ctx.translateError('INVALID_MESSAGE'));

  try {
    const domains = await Domains.find({
      'members.user': ctx.state.user._id
    })
      .sort('name')
      .lean()
      .exec();

    const user = ctx.state.user.toObject();

    const inquiry = await Inquiries.create({
      user: user.id,
      sender_email: user.full_email,
      is_resolved: false
    });

    ctx.logger.debug('created inquiry', { inquiry });

    const emoji = ctx.state.emoji(user.plan === 'free' ? 'mega' : 'star');
    const subject = `${emoji} ${
      user.plan === 'free' ? '' : 'Premium Support: '
    }${ctx.translate('YOUR_HELP_REQUEST')} #${inquiry.reference}`;

    const { email, info } = await emailHelper({
      template: 'inquiry',
      message: {
        to: ctx.state.user.email,
        cc: config.email.message.from
      },
      locals: {
        user: ctx.state.user.toObject(),
        domains,
        inquiry: { subject, message: body.message },
        subject
      }
    });

    let raw;
    if (email) {
      raw = await Emails.getMessage(email.message);
    } else {
      const obj = await transporter.sendMail(info.originalMessage);
      raw = obj.message;
    }

    inquiry.original_message = body.message;
    inquiry.subject = subject;
    inquiry.messages.push({
      raw,
      text: body.message
    });
    await inquiry.save();

    const message = ctx.translate('SUPPORT_REQUEST_SENT');
    if (ctx.accepts('html')) {
      ctx.flash('success', message);
      ctx.redirect('back');
    } else {
      ctx.body = { message, resetForm: true, hideModal: true };
    }
  } catch (err) {
    ctx.logger.fatal(err);
    throw Boom.badRequest(ctx.translateError('SUPPORT_REQUEST_ERROR'));
  }
}

module.exports = help;
