/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const Aliases = require('#models/aliases');
const Emails = require('#models/emails');
const Payments = require('#models/payments');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');

//
// abuse prevention (need to wait at least 5 days if any payments made)
//
// the reason is b/c scammers sign up and often use vanity domains
// to use dkim replay attacks to forward mail to unwanted recipients
// and then they quickly delete their accounts and evidence afterwards
//
// optional `alias` parameter is used when deleting a specific alias
// to allow deletion if the alias has < 20 recipients (not abusive)
//
async function abusePreventionByUserId(ctx, alias) {
  // safeguard
  if (!ctx.isAuthenticated()) throw new TypeError('User is not logged in');

  const user = await Users.findById(ctx.state.user._id).lean().exec();

  if (!user) throw new TypeError('User does not exist');

  //
  // permit user to delete if they have a special flag set
  // (admin manual curation)
  //
  if (user.has_passed_kyc) return;

  // if user never had a payment then return early
  // (this prevents users from changing to free plan and then deleting their account)
  const firstPayment = await Payments.findOne(
    { user: user._id },
    { invoice_at: 1 },
    { sort: { invoice_at: 1 } }
  )
    .lean()
    .exec();
  if (!firstPayment) return;

  //
  // use the first payment's invoice_at date instead of plan_set_at
  // because plan_set_at represents the current plan period start date
  // and gets reset on plan changes, upgrades, downgrades, etc.
  // which can falsely block long-time users from deleting their account
  //
  const firstPaymentDate = new Date(firstPayment.invoice_at);

  // add 5 days to their first payment date and if in past already then return early
  const fiveDaysFromFirstPayment = dayjs(firstPaymentDate)
    .startOf('day')
    .add(5, 'days')
    .toDate();
  if (fiveDaysFromFirstPayment.getTime() <= Date.now()) return;

  //
  // if an alias is passed (alias deletion) then permit deletion
  // if the alias has fewer than 20 recipients configured
  // (this allows legitimate users to delete catch-all/wildcard aliases
  //  during initial setup without waiting 5 days)
  //
  if (alias && Array.isArray(alias.recipients) && alias.recipients.length < 20)
    return;

  // check against alias count (e.g. vanity domains + other custom domains)
  // check against outbound SMTP email count
  const [aliasCount, emailCount] = await Promise.all([
    Aliases.countDocuments({ user: user._id }),
    Emails.countDocuments({ user: user._id })
  ]);

  if (aliasCount === 0 && emailCount === 0) return;

  //
  // in the background send an email to admins
  // only send one email to admins for this user id (PX expiry of 5d)
  //
  const key = `abuse_delete_check:${user.id}`;
  const cache = await ctx.client.get(key);
  if (!cache) {
    try {
      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Delete Request: ${user.email}`
        },
        locals: {
          message: `<a href="${config.urls.web}/admin/users?q=${
            user.email
          }" target="_blank" rel="noopener noreferrer">${
            user.email
          }</a> attempted to <code>${ctx.method} ${
            ctx.pathWithoutLocale
          }</code> but cannot until ${dayjs(fiveDaysFromFirstPayment).format(
            'M/D/YY'
          )}.`
        }
      });
      await ctx.client.set(key, true, 'PX', ms('5d'));
    } catch (err) {
      ctx.logger.fatal(err);
    }
  }

  // throw a bad request error if not valid
  throw Boom.badRequest(ctx.translateError('ABUSE_PREVENTION_DELETE_ACCOUNT'));
}

module.exports = abusePreventionByUserId;
