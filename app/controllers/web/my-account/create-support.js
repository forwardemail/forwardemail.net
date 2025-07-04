/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const emailHelper = require('#helpers/email');

async function createSupport(ctx, next) {
  try {
    const { subject, message, priority = 'normal' } = ctx.request.body;

    // Validate required fields
    if (!isSANB(subject)) {
      throw Boom.badRequest('Subject is required');
    }

    if (!isSANB(message)) {
      throw Boom.badRequest('Message is required');
    }

    // Validate message length
    if (message.length > config.supportRequestMaxLength) {
      throw Boom.badRequest(
        `Message must be ${config.supportRequestMaxLength} characters or less`
      );
    }

    // Prepare email data
    const emailData = {
      template: 'support-request',
      message: {
        to: config.supportEmail,
        from: ctx.state.user.email,
        subject: `[Support] ${subject}`,
        replyTo: ctx.state.user.email
      },
      locals: {
        user: ctx.state.user,
        subject,
        message,
        priority,
        userAgent: ctx.get('User-Agent'),
        ip: ctx.ip,
        timestamp: new Date()
      }
    };

    // Send the email (this will also store it in IMAP via the modified emailHelper)
    await emailHelper(emailData);

    // Set success message
    const successMessage = ctx.translate('SUPPORT_MESSAGE_SENT');

    if (ctx.api) {
      ctx.body = { message: successMessage };
      return next();
    }

    ctx.flash('success', successMessage);

    // Redirect back to support list
    const redirectTo = ctx.state.l('/my-account/support');
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }
  } catch (err) {
    console.error('Error in createSupport:', err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation('Failed to send support message');
  }
}

module.exports = createSupport;
