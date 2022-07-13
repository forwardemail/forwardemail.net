const _ = require('lodash');

const emailHelper = require('#helpers/email');
const config = require('#config');

async function ensurePaidToDate(ctx, next) {
  // return early if we're already on a billing page
  if (
    ctx.pathWithoutLocale.startsWith('/my-account/billing') ||
    ctx.state.plan === 'free' ||
    !_.isDate(ctx.state.user[config.userFields.planExpiresAt]) ||
    new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() >=
      Date.now()
  )
    return next();

  const subject = ctx.translate('PAYMENT_PAST_DUE_SUBJECT');
  const message = ctx.translate(
    'PAYMENT_PAST_DUE_MESSAGE',
    ctx.state.l('/my-account/billing/make-payment'),
    ctx.state.l('/my-account/billing')
  );

  // otherwise enforce the user to make payment if they're behind
  if (ctx.api) {
    // TODO: if they're past 30 days due then restrict API access
    // ctx.throw(Boom.paymentRequired(ctx.translateError('PAYMENT_PAST_DUE')));

    // send a one-time email if the user was late on payments
    if (!_.isDate(ctx.state.user[config.userFields.apiPastDueSentAt])) {
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: ctx.state.user[config.userFields.fullEmail],
            cc: config.email.message.from,
            subject
          },
          locals: { message }
        });
        // mark that we sent this email
        ctx.state.user[config.userFields.apiPastDueSentAt] = new Date();
        await ctx.state.user.save();
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }

    return next();
  }

  ctx.flash('error', message);
  const redirectTo = ctx.state.l('/my-account/billing');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = ensurePaidToDate;
