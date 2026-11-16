/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const numeral = require('numeral');

const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Payments, Users } = require('#models');
const {
  getNextDueAt,
  cancelSubscriptions
} = require('#helpers/enterprise-billing');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

let isCancelled = false;
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

//
// Enterprise accounts are billed by invoice (see `is_enterprise` in the user
// model), so the customer gets no billing emails.  Admins are reminded
// instead: a week before a payment is due, and again every week until the
// billing period is recorded as paid in Admin > Users or Admin > Enterprise.
//
// (an enterprise plan expires 50 years from its last save)
const FAR = ms('40y');
const LEAD = ms('7d');
const REPEAT = ms('7d');

const formatDate = (date) =>
  _.isDate(date) ? dayjs.utc(date).format('MMMM D, YYYY') : 'None';
const formatAmount = (cents) =>
  Number.isFinite(cents) ? numeral(cents / 100).format('$0,0.00') : 'None';

function getStatus(nextDueAt, now) {
  const days = dayjs
    .utc(nextDueAt)
    .startOf('day')
    .diff(dayjs.utc(now).startOf('day'), 'day');
  if (days > 0) return `due in ${days} day${days === 1 ? '' : 's'}`;
  if (days === 0) return 'due today';
  return `overdue by ${-days} day${days === -1 ? '' : 's'}`;
}

async function mapper(user) {
  //
  // a subscription that a checkout started before the account became
  // enterprise added since is canceled, so the customer is not charged
  //
  const { fields, failed } = await cancelSubscriptions(user);
  if (fields.length > 0) {
    await Users.findByIdAndUpdate(user._id, {
      $unset: Object.fromEntries(fields.map((field) => [field, 1]))
    });
    // (it may have charged the customer before it was canceled)
    if (failed.length === 0)
      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Canceled a subscription of enterprise account ${user.email}`
        },
        locals: {
          message: `<p>${_.escape(
            user.email
          )} is an enterprise account and had a Stripe or PayPal subscription, which was canceled. Check with the payment provider whether it charged the customer, and refund the charge if it did.</p>`
        }
      });
  }

  //
  // an enterprise account is on the Team plan, which does not expire (see
  // the user model): saved again if something wrote over that, e.g. a save
  // of the account as it was read before it became enterprise
  //
  if (
    user.plan !== 'team' ||
    !_.isDate(user[config.userFields.planExpiresAt]) ||
    user[config.userFields.planExpiresAt].getTime() < Date.now() + FAR
  ) {
    const doc = await Users.findById(user._id);
    if (doc && doc.is_enterprise) await doc.save();
  }

  const nextDueAt = getNextDueAt(user);
  if (!nextDueAt) return;

  const now = new Date();
  if (nextDueAt.getTime() - now.getTime() > LEAD) return;

  // already reminded of this payment within the past week
  if (
    _.isDate(user.enterprise_reminder_due_at) &&
    _.isDate(user.enterprise_reminder_sent_at) &&
    user.enterprise_reminder_due_at.getTime() === nextDueAt.getTime() &&
    now.getTime() - user.enterprise_reminder_sent_at.getTime() < REPEAT
  )
    return;

  //
  // mark the reminder as sent first, and only if no other run of this job
  // (or a change by an admin) did since the account was read, so that a
  // reminder is not sent twice
  //
  const claimed = await Users.findOneAndUpdate(
    {
      _id: user._id,
      is_enterprise: true,
      enterprise_reminder_sent_at: user.enterprise_reminder_sent_at || null
    },
    {
      $set: {
        enterprise_reminder_due_at: nextDueAt,
        enterprise_reminder_sent_at: now
      }
    }
  )
    .lean()
    .exec();
  if (!claimed) return;

  const lastPayment = await Payments.findOne({
    user: user._id,
    method: 'enterprise'
  })
    .sort({ invoice_at: -1 })
    .lean()
    .exec();
  const name = [
    user[config.passport.fields.givenName],
    user[config.passport.fields.familyName]
  ]
    .filter(Boolean)
    .join(' ');
  const url = `${config.urls.web}/admin/users/${user.id}`;
  const status = getStatus(nextDueAt, now);
  // (everything below was typed in by a customer or an admin)
  const rows = [
    ['Customer', _.escape(name ? `${name} <${user.email}>` : user.email)],
    ['Status', _.escape(_.capitalize(status))],
    ['Due date', formatDate(nextDueAt)],
    [
      'Billing frequency',
      _.escape(_.capitalize(user.enterprise_billing_frequency))
    ],
    ['Billing amount', formatAmount(user.enterprise_billing_amount)],
    ['Frequency last paid', formatDate(user.enterprise_last_paid_at)],
    ['Start date', formatDate(user.enterprise_start_date)],
    [
      'Last payment recorded',
      lastPayment
        ? `${formatAmount(lastPayment.amount)} on ${formatDate(
            lastPayment.invoice_at
          )}`
        : 'None'
    ],
    [
      'Notes',
      user.enterprise_notes
        ? _.escape(user.enterprise_notes).replace(/\r?\n/g, '<br />')
        : 'None'
    ]
  ];

  try {
    await emailHelper({
      template: 'alert',
      message: {
        to: config.supportEmail,
        subject: `Enterprise payment ${status} for ${user.email}`
      },
      locals: {
        message: `<p>An enterprise payment is ${_.escape(
          status
        )}. Send the invoice if needed, then record the payment on the <a href="${_.escape(
          url
        )}">customer's admin page</a> once it arrives. Reminders repeat weekly until the billing period is recorded as paid.</p><table class="table table-bordered table-sm"><tbody>${rows
          .map(
            ([label, value]) =>
              `<tr><th scope="row">${label}</th><td>${value}</td></tr>`
          )
          .join('')}</tbody></table>`
      }
    });
    logger.info('enterprise billing reminder sent', {
      user: user.id,
      due_at: nextDueAt
    });
  } catch (err) {
    // the reminder was not sent, so the next run sends it
    const revert = {};
    for (const field of [
      'enterprise_reminder_due_at',
      'enterprise_reminder_sent_at'
    ]) {
      const op = _.isDate(user[field]) ? '$set' : '$unset';
      revert[op] = { ...revert[op], [field]: user[field] || 1 };
    }

    await Users.findOneAndUpdate(
      { _id: user._id, enterprise_reminder_sent_at: now },
      revert
    );
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    for await (const user of Users.find({
      is_enterprise: true,
      [config.userFields.isBanned]: { $ne: true },
      [config.userFields.isRemoved]: { $ne: true }
    })
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      if (isCancelled) break;
      try {
        await mapper(user);
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  //
  // the reverse: an account that is no longer enterprise, but whose plan
  // still does not expire (a save of the account as it was read before the
  // change), is saved again so that its plan expires as it should
  //
  try {
    if (!config.isSelfHosted)
      for await (const user of Users.find({
        is_enterprise: { $ne: true },
        // (only one that was an enterprise account)
        enterprise_start_date: { $exists: true },
        [config.userFields.planExpiresAt]: { $gt: new Date(Date.now() + FAR) }
      }).cursor()) {
        if (isCancelled) break;
        try {
          await user.save();
        } catch (err) {
          logger.error(err);
        }
      }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
