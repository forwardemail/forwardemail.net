const Boom = require('@hapi/boom');

const email = require('./email');
const logger = require('./logger');
const config = require('#config');

async function sendVerificationEmail(ctx) {
  ctx.state.user = await ctx.state.user.updateVerificationPin(ctx);

  // attempt to send them an email
  try {
    await email({
      template: 'verify',
      message: {
        to: ctx.state.user[config.userFields.fullEmail]
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

    throw Boom.badRequest(ctx.translateError('EMAIL_FAILED_TO_SEND'));
  }

  return ctx.state.user;
}

module.exports = sendVerificationEmail;
