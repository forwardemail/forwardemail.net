/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const { paypalAgent } = require('#helpers/paypal');
const config = require('#config');
const emailHelper = require('#helpers/email');
const stripe = require('#helpers/stripe');

async function cancelSubscription(ctx, next) {
  if (
    !isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
    !isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
  )
    throw Boom.badRequest(ctx.translateError('SUBSCRIPTION_ALREADY_CANCELLED'));

  if (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])) {
    try {
      await stripe.subscriptions.del(
        ctx.state.user[config.userFields.stripeSubscriptionID]
      );
    } catch (err) {
      ctx.logger.fatal(err);
      // email admins here
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Error deleting Stripe subscription ID ${
            ctx.state.user[config.userFields.stripeSubscriptionID]
          } for ${ctx.state.user.email}`
        },
        locals: { message: err.message }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));
    }
  }

  if (isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])) {
    try {
      const agent = await paypalAgent();
      await agent.post(
        `/v1/billing/subscriptions/${
          ctx.state.user[config.userFields.paypalSubscriptionID]
        }/cancel`
      );
    } catch (err) {
      ctx.logger.fatal(err);
      // email admins here
      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Error deleting PayPal subscription ID ${
            ctx.state.user[config.userFields.paypalSubscriptionID]
          } for ${ctx.state.user.email}`
        },
        locals: { message: err.message }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));
    }
  }

  ctx.state.user[config.userFields.stripeSubscriptionID] = undefined;
  ctx.state.user[config.userFields.paypalSubscriptionID] = undefined;

  await ctx.state.user.save();

  ctx.flash('success', ctx.translate('SUBSCRIPTION_CANCELLED'));

  return next();
}

module.exports = cancelSubscription;
