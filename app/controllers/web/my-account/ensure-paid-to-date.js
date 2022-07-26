const Boom = require('@hapi/boom');
const _ = require('lodash');
const ms = require('ms');
const isSANB = require('is-string-and-not-blank');

const emailHelper = require('#helpers/email');
const config = require('#config');

// eslint-disable-next-line complexity
async function ensurePaidToDate(ctx, next) {
  // return early if we're already on profile, security, or billing
  if (
    (!ctx.api && ctx.method !== 'GET') ||
    ctx.pathWithoutLocale.startsWith('/my-account/billing') ||
    ctx.state.user.plan === 'free' ||
    !_.isDate(ctx.state.user[config.userFields.planExpiresAt]) ||
    new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() >=
      Date.now() ||
    // or if the user has a subscription then don't show the error
    isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) ||
    isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
  )
    return next();

  const subject = ctx.translate('PAYMENT_PAST_DUE_SUBJECT');
  const message = ctx.translate(
    'PAYMENT_PAST_DUE_MESSAGE',
    ctx.state.l('/my-account/billing/make-payment')
  );

  // otherwise enforce the user to make payment if they're behind
  if (ctx.api) {
    // if they received a past due reminder
    // and it was more than 30 days ago then restrict their usage entirely
    if (
      _.isDate(ctx.state.user[config.userFields.apiPastDueSentAt]) &&
      new Date(ctx.state.user[config.userFields.apiPastDueSentAt]).getTime() <
        Date.now() - ms('30d')
    ) {
      // if they were already sent the email then return early
      if (_.isDate(ctx.state.user[config.userFields.apiRestrictedSentAt])) {
        ctx.throw(Boom.paymentRequired(ctx.translateError('PAYMENT_PAST_DUE')));
        return;
      }

      // send them an email notifying them that access is restricted
      // and only restrict access if this email was able to be sent successfully
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: ctx.state.user[config.userFields.receiptEmail]
              ? ctx.state.user[config.userFields.receiptEmail]
              : ctx.state.user[config.userFields.fullEmail],
            ...(ctx.state.user[config.userFields.receiptEmail]
              ? {
                  cc: [
                    ctx.state.user[config.userFields.fullEmail],
                    config.email.message.from
                  ]
                }
              : { cc: config.email.message.from }),
            subject: ctx.translate('PAYMENT_PAST_DUE_API_RESTRICTED')
          },
          locals: { message, user: ctx.state.user.toObject() }
        });
        // mark that we sent this email
        ctx.state.user[config.userFields.apiRestrictedSentAt] = new Date();
        await ctx.state.user.save();
        ctx.throw(Boom.paymentRequired(ctx.translateError('PAYMENT_PAST_DUE')));
        return;
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }

    // send a one-time email if the user was late on payments
    if (!_.isDate(ctx.state.user[config.userFields.apiPastDueSentAt])) {
      try {
        // mark that we sent this email (otherwise multiple requests will cause multiple emails)
        ctx.state.user[config.userFields.apiPastDueSentAt] = new Date();
        await ctx.state.user.save();
        await emailHelper({
          template: 'alert',
          message: {
            to: ctx.state.user[config.userFields.receiptEmail]
              ? ctx.state.user[config.userFields.receiptEmail]
              : ctx.state.user[config.userFields.fullEmail],
            ...(ctx.state.user[config.userFields.receiptEmail]
              ? {
                  cc: [
                    ctx.state.user[config.userFields.fullEmail],
                    config.email.message.from
                  ]
                }
              : { cc: config.email.message.from }),
            subject
          },
          locals: { message }
        });
      } catch (err) {
        // mark that we did not send this email
        ctx.state.user[config.userFields.apiPastDueSentAt] = undefined;
        await ctx.state.user.save();
        ctx.logger.fatal(err);
      }
    }

    return next();
  }

  // ctx.flash('error', message);

  // NOTE: toast notification is less obtrusive
  ctx.flash('custom', {
    title: ctx.request.t('Warning'),
    html: message,
    type: 'error',
    toast: true,
    position: 'top'
  });

  if (ctx.pathWithoutLocale !== '/my-account') return next();
  const redirectTo = ctx.state.l('/my-account/billing/make-payment');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = ensurePaidToDate;
