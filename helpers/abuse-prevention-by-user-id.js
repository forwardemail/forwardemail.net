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
const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');

//
// abuse prevention (need to wait at least 5 days if any payments made)
//
// the reason is b/c scammers sign up and often use vanity domains
// to use dkim replay attacks to forward mail to unwanted recipients
// and then they quickly delete their accounts and evidence afterwards
//
async function abusePreventionByUserId(ctx) {
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
  const exists = await Payments.exists({ user: user._id });
  if (!exists) return;

  // if plan set at is not a date (safeguard)
  if (!_.isDate(user[config.userFields.planSetAt])) return;

  // add 5 days to their plan started date and if in past already then return early
  const fiveDaysFromStartDate = dayjs(
    new Date(user[config.userFields.planSetAt])
  )
    .startOf('day')
    .add(5, 'days')
    .toDate();
  if (fiveDaysFromStartDate.getTime() <= Date.now()) return;

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
          }</code> but cannot until ${dayjs(fiveDaysFromStartDate).format(
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
