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
    // the account stays unverified either way, and the error says which
    // happened: the address refused the email for good (`is_email_rejected`:
    // an address our mail server does not accept, a 5xx reply to RCPT TO,
    // or nodemailer's own check of the recipient, command "API", which it
    // also uses for an invalid sender of ours), or the email could not be
    // sent for now (`has_email_failed`, e.g. our mail server is down or
    // refused our own login, or a refusal of MAIL FROM or DATA, or a 4xx),
    // so the user tries again later
    //
    if (
      err?.isBoom ||
      (err?.code === 'EENVELOPE' &&
        (err.command === 'RCPT TO' ||
          err.command === undefined ||
          (err.command === 'API' &&
            typeof err.message === 'string' &&
            /recipient/i.test(err.message))) &&
        !(err.responseCode >= 400 && err.responseCode < 500))
    )
      error.is_email_rejected = true;
    else error.has_email_failed = true;
    throw error;
  }

  return ctx.state.user;
}

module.exports = sendVerificationEmail;
