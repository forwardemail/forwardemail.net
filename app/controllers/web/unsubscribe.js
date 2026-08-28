/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const config = require('#config');
const logger = require('#helpers/logger');
const { parseUnsubscribeToken } = require('#helpers/unsubscribe');

/**
 * Handle unsubscribe requests (both GET and POST)
 * GET: User clicks unsubscribe link in email footer
 * POST: Mail client sends one-click unsubscribe request via List-Unsubscribe-Post
 *
 * @param {Object} ctx - Koa context
 */
async function unsubscribe(ctx) {
  const { token } = ctx.params;

  if (!token) {
    throw Boom.badRequest(ctx.translateError('INVALID_UNSUBSCRIBE_TOKEN'));
  }

  let payload;
  try {
    payload = parseUnsubscribeToken(decodeURIComponent(token));
  } catch (err) {
    logger.error(err, { token });
    throw Boom.badRequest(ctx.translateError('INVALID_UNSUBSCRIBE_TOKEN'));
  }

  const { email, template } = payload;

  // Find the user by email
  const { Users } = ctx.models || require('#models');
  const user = await Users.findOne({ email: email.toLowerCase() });

  if (!user) {
    // For POST requests (mail client one-click), return success even if user not found
    // This prevents information disclosure and follows RFC 8058 recommendations
    if (ctx.method === 'POST') {
      ctx.status = 200;
      ctx.body = 'OK';
      return;
    }

    // For GET requests, show a generic success page
    ctx.state.unsubscribeSuccess = true;
    ctx.state.unsubscribeEmail = email;
    ctx.state.unsubscribeTemplate = template;
    return ctx.render('unsubscribe');
  }

  try {
    if (template && config.optOutTemplates.includes(template)) {
      // Template-specific unsubscribe
      // Add template to opt_out_templates if not already present
      if (!user.opt_out_templates.includes(template)) {
        user.opt_out_templates.push(template);
        await user.save();
        logger.info('User unsubscribed from template', {
          email,
          template
        });
      }
    } else if (!template) {
      // Global unsubscribe - opt out from all templates and newsletter
      user.has_newsletter = false;
      user.opt_out_templates = [...config.optOutTemplates];
      await user.save();
      logger.info('User unsubscribed from all emails', { email });
    }
  } catch (err) {
    logger.error(err, { email, template });
    // For POST requests, still return success per RFC 8058
    if (ctx.method === 'POST') {
      ctx.status = 200;
      ctx.body = 'OK';
      return;
    }

    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
  }

  // For POST requests (RFC 8058 one-click unsubscribe), return simple success
  if (ctx.method === 'POST') {
    ctx.status = 200;
    ctx.body = 'OK';
    return;
  }

  // For GET requests, render the unsubscribe success page
  ctx.state.unsubscribeSuccess = true;
  ctx.state.unsubscribeEmail = email;
  ctx.state.unsubscribeTemplate = template;
  return ctx.render('unsubscribe');
}

module.exports = unsubscribe;
