/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const email = require('./email');
const logger = require('./logger');

const config = require('#config');
const i18n = require('#helpers/i18n');

async function sendVerificationEmail(ctx) {
  ctx.state.user = await ctx.state.user.updateVerificationPin(ctx);

  // attempt to send them an email
  try {
    await email({
      template: 'verify',
      message: {
        to: ctx.state.user.email
      },
      locals: {
        user: ctx.state.user.toObject(),
        expiresAt: ctx.state.user[config.userFields.verificationPinExpiresAt],
        pin: ctx.state.user[config.userFields.verificationPin],
        link: `${config.urls.web}${config.verifyRoute}?pin=${
          ctx.state.user[config.userFields.verificationPin]
        }`
      }
    });

    // save when the verification pin was sent
    ctx.state.user[config.userFields.verificationPinSentAt] = new Date();
    await ctx.state.user.save();
  } catch (err) {
    logger.error(err);
    // revert if there was an error
    try {
      ctx.state.user = await ctx.state.user.updateVerificationPin(ctx, true);
    } catch (err) {
      logger.error(err);
    }

    const error = Boom.badRequest(
      i18n.translateError('EMAIL_FAILED_TO_SEND', ctx.locale)
    );
    //
    // callers verify the user when the email could not be sent (e.g. our
    // mail server is down), so a message refused for its address (a 5xx
    // reply, or an address our mail server does not accept) must not count,
    // or an address that cannot receive mail would be verified
    //
    if (
      err?.code === 'EENVELOPE' ||
      err?.isBoom ||
      (err?.responseCode >= 500 && err?.responseCode < 600)
    )
      error.is_email_rejected = true;
    else error.has_email_failed = true;
    throw error;
  }

  return ctx.state.user;
}

module.exports = sendVerificationEmail;
