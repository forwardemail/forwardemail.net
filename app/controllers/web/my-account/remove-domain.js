/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');

const abusePreventionByUserId = require('#helpers/abuse-prevention-by-user-id');
const config = require('#config');
const { Domains, Aliases } = require('#models');

async function removeDomain(ctx, next) {
  // we have the same logic in a pre('remove') hook in domains model
  if (ctx.state.domain.is_global)
    throw Boom.badRequest(ctx.translateError('CANNOT_REMOVE_GLOBAL_DOMAIN'));

  //
  // abuse prevention (need to wait at least 5 days if any payments made)
  //
  await abusePreventionByUserId(ctx);

  // remove all aliases
  await Aliases.deleteMany({
    domain: ctx.state.domain._id
  });
  // remove the domain
  await Domains.findByIdAndRemove(ctx.state.domain._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  //
  // NOTE: this logic is the same as `jobs/fix-non-free-users`
  //       (which runs every minute as plans expire, but this is to ensure its real-time)
  //
  // downgrade the user if past due,
  // not on free plan, zero domains on paid plans,
  // and no subscription
  if (
    ctx.state.user.plan !== 'free' &&
    new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() <
      Date.now() &&
    !isSANB(ctx.state.user[config.userFields.stripeSubscriptionID]) &&
    !isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])
  ) {
    const count = await Domains.countDocuments({
      members: {
        $elemMatch: {
          user: ctx.state.user._id,
          group: 'admin'
        }
      },
      plan: { $in: ['enhanced_protection', 'team', 'enterprise'] }
    });
    if (count === 0) {
      ctx.logger.info(`updating to free plan`);
      ctx.state.user.plan = 'free';
      ctx.state.user[config.userFields.planSetAt] = new Date();
      if (!ctx.api) ctx.flash('success', ctx.translate('FREE_PLAN'));
      await ctx.state.user.save();
    }
  }

  if (ctx.api) return next();
  const redirectTo = ctx.state.l('/my-account/domains');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = removeDomain;
