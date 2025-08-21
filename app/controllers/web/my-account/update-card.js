/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');
const Stripe = require('stripe');
const emailHelper = require('#helpers/email');

const env = require('#config/env');
const config = require('#config');

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function redirectToPortal(ctx) {
  try {
    if (!isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]))
      throw Boom.badRequest(
        ctx.translateError('SUBSCRIPTION_ALREADY_CANCELLED')
      );

    if (!isSANB(ctx.state.user[config.userFields.stripeCustomerID]))
      throw Boom.badRequest(
        ctx.translateError('SUBSCRIPTION_ALREADY_CANCELLED')
      );

    const session = await stripe.billingPortal.sessions.create({
      customer: ctx.state.user[config.userFields.stripeCustomerID],
      return_url: `${config.urls.web}${ctx.state.l('/my-account/billing')}`,
      locale: config.STRIPE_LOCALES.has(ctx.locale) ? ctx.locale : 'auto'
    });

    if (!session) throw ctx.translateError('UNKNOWN_ERROR');

    if (ctx.accepts('html')) ctx.redirect(session.url);
    else ctx.body = { redirectTo: session.url };
  } catch (err) {
    ctx.logger.fatal(err);
    // email admins here
    try {
      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Error creating Stripe billing portal session for customer ID ${
            ctx.state.user[config.userFields.stripeCustomerID]
          } for ${ctx.state.user.email}`
        },
        locals: { message: err.message }
      });
    } catch (err) {
      ctx.logger.fatal(err);
    }

    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));
  }
}

module.exports = redirectToPortal;
