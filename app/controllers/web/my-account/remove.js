/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const numeral = require('numeral');
const isSANB = require('is-string-and-not-blank');
const pMapSeries = require('p-map-series');
const _ = require('#helpers/lodash');

const abusePreventionByUserId = require('#helpers/abuse-prevention-by-user-id');
const config = require('#config');
const stripe = require('#helpers/stripe');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const refundHelper = require('#helpers/refund');
const { Domains, Aliases } = require('#models');
const { paypalAgent } = require('#helpers/paypal');

async function remove(ctx) {
  if (ctx.state.user[config.userFields.hasSetPassword]) {
    if (!isSANB(ctx.request?.body?.password))
      throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

    const { user } = await ctx.state.user.authenticate(
      ctx.request.body.password
    );
    if (!user) throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));
  }

  // check that we're not an admin of any team domains
  const domainsWithOtherAdmins = ctx.state.domains.some(
    (d) =>
      d.plan === 'team' &&
      d.group === 'admin' &&
      d.members.some(
        (m) => m.group === 'admin' && m.user.id !== ctx.state.user.id
      )
  );
  if (domainsWithOtherAdmins.length > 0)
    throw Boom.badRequest(ctx.translateError('ACCOUNT_DELETE_HAS_DOMAINS'));

  // safeguard in case admins were of global
  if (ctx.state.domains.some((d) => d.is_global && d.group === 'admin'))
    throw Boom.badRequest(ctx.translateError('CANNOT_REMOVE_GLOBAL_DOMAIN'));

  //
  // abuse prevention (need to wait at least 5 days if any payments made)
  //
  await abusePreventionByUserId(ctx);

  // store the user's email before it gets rewritten
  const originalEmail = ctx.state.user.email;

  // filter domain ids for admin owned domains
  const domainIds = ctx.state.domains
    .filter((d) => d.group === 'admin')
    .map((d) => d._id);

  // delete aliases and domains
  await Promise.all([
    Aliases.deleteMany({
      $or: [
        {
          user: ctx.state.user._id
        },
        {
          domain: {
            $in: domainIds
          }
        }
      ]
    }),
    Domains.deleteMany({
      _id: {
        $in: domainIds
      }
    })
  ]);

  // handle refunds
  if (ctx.state.paymentIds.length > 0) {
    //
    // this helper function will simply return early if the payment was already refunded
    // note that we iterate in series due to PayPal API rate limitations
    //
    const refundedPayments = await pMapSeries(
      ctx.state.paymentIds,
      refundHelper
    );

    // flash a message with a total of how much was refunded
    ctx.flash(
      'success',
      ctx.translate(
        'REFUND_SUCCESSFUL',
        numeral(
          Math.round(_.sumBy(refundedPayments, 'amount_refunded') / 100)
        ).format('$0,0,0.00')
      )
    );
  }

  // cancel paypal subscription
  if (isSANB(ctx.state.user[config.userFields.paypalSubscriptionID])) {
    try {
      const agent = await paypalAgent();
      await agent.post(
        `/v1/billing/subscriptions/${
          ctx.state.user[config.userFields.paypalSubscriptionID]
        }/cancel`
      );
      ctx.state.user[config.userFields.paypalSubscriptionID] = undefined;
      await ctx.state.user.save();
    } catch (err) {
      ctx.logger.fatal(err);
      // email admins here
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `Error deleting PayPal subscription ID ${
              ctx.state.user[config.userFields.paypalSubscriptionID]
            } for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        });
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }
  }

  // cancel stripe subscription
  if (isSANB(ctx.state.user[config.userFields.stripeSubscriptionID])) {
    try {
      await stripe.subscriptions.del(
        ctx.state.user[config.userFields.stripeSubscriptionID]
      );
      ctx.state.user[config.userFields.stripeSubscriptionID] = undefined;
      await ctx.state.user.save();
    } catch (err) {
      ctx.logger.fatal(err);
      // email admins here
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.alertsEmail,
            subject: `Error deleting Stripe subscription ID ${
              ctx.state.user[config.userFields.stripeSubscriptionID]
            } for ${ctx.state.user.email}`
          },
          locals: { message: err.message }
        });
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }
  }

  // update domains 'members.user' with this uid (pull it)
  try {
    await Domains.updateMany(
      {
        'members.user': ctx.state.user._id
      },
      {
        $pull: {
          members: {
            user: ctx.state.user._id
          }
        }
      }
    );
  } catch (err) {
    ctx.logger.fatal(err);
  }

  // instead of deleting the user we'll anonymize their account
  // (this is because payment model has required user field)
  // (and we want to easily be able to populate data on churn for example)
  for (const prop of [
    config.userFields.companyName,
    config.userFields.addressLine1,
    config.userFields.addressLine2,
    config.userFields.addressCity,
    config.userFields.addressState,
    config.userFields.addressZip,
    config.userFields.companyVAT
  ]) {
    ctx.state.user[prop] = undefined;
  }

  ctx.state.user.email = `${ctx.state.user.id}@${config.removedEmailDomain}`;
  ctx.state.user[config.lastLocaleField] = i18n.config.defaultLocale;
  ctx.state.user[config.passport.fields.appleAccessToken] = undefined;
  ctx.state.user[config.passport.fields.appleProfileID] = undefined;
  ctx.state.user[config.passport.fields.appleRefreshToken] = undefined;
  ctx.state.user[config.passport.fields.avatarURL] = undefined;
  ctx.state.user[config.passport.fields.familyName] = undefined;
  ctx.state.user[config.passport.fields.githubAccessToken] = undefined;
  ctx.state.user[config.passport.fields.githubProfileID] = undefined;
  ctx.state.user[config.passport.fields.githubRefreshToken] = undefined;
  ctx.state.user[config.passport.fields.givenName] = undefined;
  ctx.state.user[config.passport.fields.googleAccessToken] = undefined;
  ctx.state.user[config.passport.fields.googleProfileID] = undefined;
  ctx.state.user[config.passport.fields.googleRefreshToken] = undefined;
  ctx.state.user[config.passport.fields.otpEnabled] = false;
  ctx.state.user[config.passport.fields.otpToken] = undefined;
  ctx.state.user[config.userFields.addressCountry] = 'None';
  ctx.state.user[config.userFields.apiToken] = undefined;
  ctx.state.user[config.userFields.changeEmailNewAddress] = undefined;
  ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = undefined;
  ctx.state.user[config.userFields.changeEmailToken] = undefined;
  ctx.state.user[config.userFields.defaultDomain] = undefined;
  ctx.state.user[config.userFields.receiptEmail] = undefined;
  ctx.state.user[config.userFields.isBanned] = true;
  ctx.state.user[config.userFields.isRemoved] = true;
  ctx.state.user[config.userFields.accountUpdates] = [];
  ctx.state.user[config.userFields.otpRecoveryKeys] = [];
  // we need to keep these so webhooks work properly for refunding transactions
  // ctx.state.user[config.userFields.paypalPayerID] = undefined;
  // ctx.state.user[config.userFields.stripeCustomerID] = undefined;
  await ctx.state.user.save();

  // clear banned cache
  ctx.client
    .del('banned_user_ids')
    .then()
    .catch((err) => ctx.logger.fatal(err));

  // send win-back email to the user's original email address
  emailHelper({
    message: {
      to: originalEmail,
      from: config.supportEmail,
      bcc: config.supportEmail,
      subject: 'Forward Email - Quick question',
      text: `Hey,

I'm the founder of Forward Email and I noticed you deleted your account. I'm sorry if we let you down.

Was there a missing feature? Configuration issue? Question we didn't answer?

Reply and let me know. I'll send you a coupon for at least a free month.

P.S. Don't worry, your email and data have been deleted from our system. This is a one-time email - no spam or follow-ups.

--
Forward Email
https://forwardemail.net`
    }
  })
    .then()
    .catch((err) => ctx.logger.fatal(err));

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('ACCOUNT_DELETE_SUCCESSFUL'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  const redirectTo = ctx.state.l('/logout');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = remove;
