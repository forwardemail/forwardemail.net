/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ms = require('ms');
const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');

const emailHelper = require('#helpers/email');
const config = require('#config');
const { isWithinGracePeriod } = require('#helpers/is-within-grace-period');

async function ensurePaidToDate(ctx, next) {
  // short-circuit if in self-hosted mode
  // as we don't need to check payment
  if (config.isSelfHosted) return next();

  // if the user has a global domain and they're not an admin
  // and they are not on a paid plan or their plan is 30d past due
  // then alert them with a toast notification
  // iff they are not on billing page and request is not GET
  if (
    !ctx.api &&
    ctx.method === 'GET' &&
    !ctx.pathWithoutLocale.startsWith('/my-account/billing') &&
    ctx.state.user.group !== 'admin' &&
    // either the user was on a free plan and had some domains
    ((ctx.state.user.plan === 'free' &&
      ctx.state.domains.some(
        (d) =>
          d.is_global &&
          _.isArray(d.aliases) &&
          d.aliases.some((a) => a.is_enabled)
      )) ||
      // or the user was on paid plan, plan expired, not in grace period, and had some domains
      (ctx.state.user.plan !== 'free' &&
        new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() <
          Date.now() &&
        !isWithinGracePeriod(ctx.state.user) &&
        ctx.state.domains.some(
          (d) =>
            d.is_global &&
            _.isArray(d.aliases) &&
            d.aliases.some((a) => a.is_enabled)
        )))
  ) {
    const message = ctx.translate(
      'VANITY_DOMAINS_NOT_ON_PAID',
      ctx.state.user.plan === 'free'
        ? ctx.state.l('/my-account/billing/upgrade?plan=enhanced_protection')
        : ctx.state.l('/my-account/billing/make-payment'),
      ctx.state.user.plan === 'free'
        ? ctx.translate('UPGRADE')
        : ctx.translate('MAKE_PAYMENT')
    );
    ctx.flash('custom', {
      title: ctx.request.t('Warning'),
      html: message,
      type: 'error',
      toast: true,
      position: 'top'
    });
  }

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
    isSANB(ctx.state.user[config.userFields.paypalSubscriptionID]) ||
    // or if the user is within the 15-day grace period
    isWithinGracePeriod(ctx.state.user)
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
      if (_.isDate(ctx.state.user[config.userFields.apiRestrictedSentAt]))
        throw Boom.paymentRequired(
          ctx.translateError('PAYMENT_PAST_DUE_API_RESTRICTED')
        );

      // mark that we sent this email
      ctx.state.user[config.userFields.apiRestrictedSentAt] = new Date();
      await ctx.state.user.save();

      // send the email after
      await emailHelper({
        template: 'alert',
        message: {
          to:
            ctx.state.user[config.userFields.receiptEmail] ||
            ctx.state.user.email,
          ...(ctx.state.user[config.userFields.receiptEmail]
            ? {
                cc: [
                  ctx.state.user.email
                  // config.alertsEmail
                ]
              }
            : {}),
          // : { cc: config.alertsEmail }),
          subject: ctx.translate('PAYMENT_PAST_DUE_API_RESTRICTED')
        },
        locals: { message, user: ctx.state.user.toObject() }
      });

      throw Boom.paymentRequired(
        ctx.translateError('PAYMENT_PAST_DUE_API_RESTRICTED')
      );
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
            to:
              ctx.state.user[config.userFields.receiptEmail] ||
              ctx.state.user.email,
            ...(ctx.state.user[config.userFields.receiptEmail]
              ? {
                  cc: [ctx.state.user.email, config.alertsEmail]
                }
              : { cc: config.alertsEmail }),
            subject
          },
          locals: { message, locale: ctx.state.user[config.lastLocale] }
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
