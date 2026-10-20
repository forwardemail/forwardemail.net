/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');
const _ = require('#helpers/lodash');
const { Domains } = require('#models');

//
// whether the user no longer manages any paid domain (e.g. after changing
// their last paid domain to free, deleting it, or leaving it) while their
// account, which is what gets billed, is still on a paid plan
//
// (not when the plan expired, since a past due account cannot switch plans
// and one without a subscription is downgraded on its own, and not when the
// user has aliases on a global domain, since those need a paid plan)
//
async function shouldAskToDowngradeAccount(ctx) {
  const { user } = ctx.state;
  if (!user || user.plan === 'free') return false;
  if (
    !(new Date(user[config.userFields.planExpiresAt]).getTime() >= Date.now())
  )
    return false;
  if (
    Array.isArray(ctx.state.domains) &&
    ctx.state.domains.some((d) => d.is_global && d.has_global_aliases)
  )
    return false;
  const domain = await Domains.exists({
    members: {
      $elemMatch: {
        user: user._id,
        group: 'admin'
      }
    },
    plan: { $in: ['enhanced_protection', 'team'] }
  });
  return !domain;
}

//
// asks whether to downgrade the account to free too, with `message` (the
// result of what the user just did) at the top, all in one dialog
//
function flashAskToDowngradeAccount(ctx, message) {
  ctx.flash('custom', {
    title: ctx.translate('DOWNGRADE_ACCOUNT_TOO_TITLE'),
    html: `<p>${message}</p><p>${ctx.translate(
      'DOWNGRADE_ACCOUNT_TOO_MESSAGE',
      ctx.translate(ctx.state.user.plan.toUpperCase())
    )}</p><a class="btn btn-danger btn-block" href="${_.escape(
      ctx.state.l('/my-account/billing/upgrade?plan=free')
    )}">${_.escape(ctx.translate('DOWNGRADE_ACCOUNT_TO_FREE'))}</a>`,
    type: 'question',
    confirmButtonText: ctx.translate('KEEP_MY_PLAN'),
    showCloseButton: true
  });
}

module.exports = { shouldAskToDowngradeAccount, flashAskToDowngradeAccount };
