const { select } = require('mongoose-json-select');

const Users = require('../app/models/user');

const config = require('../config');

async function sendVerificationEmail(ctx) {
  ctx.state.user = await ctx.state.user.sendVerificationEmail(ctx);

  // attempt to send them an email
  const job = await ctx.bull.add('email', {
    template: 'verify',
    message: {
      to: ctx.state.user[config.userFields.fullEmail]
    },
    locals: {
      user: select(
        ctx.state.user.toObject(),
        Users.schema.options.toJSON.select
      ),
      expiresAt: ctx.state.user[config.userFields.verificationPinExpiresAt],
      pin: ctx.state.user[config.userFields.verificationPin],
      link: `${config.urls.web}${config.verifyRoute}?pin=${
        ctx.state.user[config.userFields.verificationPin]
      }`
    }
  });

  ctx.logger.info('added job', ctx.bull.getMeta({ job }));

  return ctx.state.user;
}

module.exports = sendVerificationEmail;
