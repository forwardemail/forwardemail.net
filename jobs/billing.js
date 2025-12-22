/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const i18n = require('#helpers/i18n');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, Payments } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

async function mapper(user) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  // safeguard
  if (!user) return;

  // ensure not banned
  if (user[config.userFields.isBanned]) return;

  // ensure not removed
  if (user[config.userFields.isRemoved]) return;

  // if on free plan then ignore
  if (user.plan === 'free') return;

  // run a quick save of the user to update fields
  // (e.g. and remove expiration notice dates if plan expires in future)
  await user.save();

  user = await Users.findById(user._id).lean().exec();

  if (!user) return;

  // if they started a subscription then ignore
  if (
    isSANB(user[config.userFields.stripeSubscriptionID]) ||
    isSANB(user[config.userFields.paypalSubscriptionID])
  )
    return;

  // ensure that user is the admin of at least one domain on a paid plan
  const domains = await Domains.find({
    'members.user': user._id
  })
    .sort('name')
    .lean()
    .exec();
  let requiresPaidPlan = false;
  for (const domain of domains) {
    const member = domain.members.find(
      (member) => member.user.toString() === user.id
    );
    if (!member || member.group !== 'admin') continue;
    if (domain.plan !== 'free') {
      requiresPaidPlan = true;
      break;
    }

    // NOTE: jobs/check-bad-domains takes care of this notification
    // const { isDisposable, isRestricted } = Domains.getNameRestrictions(
    //   domain.name
    // );
    // if (isDisposable || isRestricted) {
    //   requiresPaidPlan = true;
    //   break;
    // }
  }

  if (!requiresPaidPlan) return;

  // ensure plan has expiry
  if (!_.isDate(user[config.userFields.planExpiresAt])) return;

  // ensure plan expires < 1 month from now
  if (
    new Date(user[config.userFields.planExpiresAt]).getTime() >
    dayjs().add(1, 'month').toDate().getTime()
  )
    return;

  //
  // if the user made a payment within past 2 weeks
  // and if the plan expires within the next month then ignore
  // (we don't want someone that just paid for a month to get a notification instantly)
  // (this will prevent a bit of annoyance to customers)
  //
  if (dayjs(user[config.userFields.planExpiresAt]).isAfter(dayjs())) {
    const paymentCount = await Payments.countDocuments({
      user: user._id,
      invoice_at: {
        $gte: dayjs().subtract(2, 'weeks').toDate()
      }
    });
    if (paymentCount > 0) return;
  }

  // if final notice sent then ensure it's been 1 month since final notice
  if (_.isDate(user[config.userFields.paymentReminderFinalNoticeSentAt])) {
    // if it has been more than a month then ban the user and email admins
    // otherwise return early since we've already notified them
    //
    // NOTE: also ensure the plan is actually past due before sending termination notice
    // This prevents sending termination emails to users who paid after the final notice
    //
    if (
      dayjs(user[config.userFields.planExpiresAt]).isBefore(dayjs()) &&
      Date.now() >
        dayjs(user[config.userFields.paymentReminderFinalNoticeSentAt])
          .add(1, 'month')
          .toDate()
          .getTime() &&
      !_.isDate(user[config.userFields.paymentReminderTerminationNoticeSentAt])
    ) {
      await email({
        template: 'alert',
        message: {
          to: user[config.userFields.receiptEmail] || user.email,
          ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {}),
          // bcc: config.alertsEmail,
          subject: i18n.api.t({
            phrase: config.i18n.phrases.EMAIL_FORWARDING_PAUSED,
            locale: user[config.lastLocaleField]
          })
        },
        locals: {
          message: i18n.api.t(
            {
              phrase: config.i18n.phrases.EMAIL_PAST_DUE,
              locale: user[config.lastLocaleField]
            },
            user.email
          ),
          locale: user[config.lastLocaleField]
        }
      });
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.paymentReminderTerminationNoticeSentAt]: new Date()
        }
      });
    }

    return;
  }

  // ensure final notice is only sent after 3 weeks past follow-up
  if (_.isDate(user[config.userFields.paymentReminderFollowUpSentAt])) {
    if (
      dayjs().isBefore(
        dayjs(user[config.userFields.paymentReminderFollowUpSentAt]).add(
          3,
          'weeks'
        )
      )
    )
      return;
  } else if (
    // otherwise ensure follow up isn't sent until 1 week after initial notice
    _.isDate(user[config.userFields.paymentReminderInitialSentAt]) &&
    dayjs().isBefore(
      dayjs(user[config.userFields.paymentReminderInitialSentAt]).add(1, 'week')
    )
  )
    return;

  //
  // fetch account summary for the user
  // (super helpful to remind users of what domains they have with us)
  //
  // the table we render in emails has the following
  //
  // domain name | plan | member group | has mx | has txt
  // (link)
  //
  try {
    await email({
      template: 'payment-reminder',
      message: {
        to: user[config.userFields.receiptEmail] || user.email,
        ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {})
      },
      locals: { user, domains }
    });

    if (!_.isDate(user[config.userFields.paymentReminderInitialSentAt])) {
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.paymentReminderInitialSentAt]: new Date()
        }
      });
      return;
    }

    if (!_.isDate(user[config.userFields.paymentReminderFollowUpSentAt])) {
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.paymentReminderFollowUpSentAt]: new Date()
        }
      });
      return;
    }

    if (!_.isDate(user[config.userFields.paymentReminderFinalNoticeSentAt])) {
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          [config.userFields.paymentReminderFinalNoticeSentAt]: new Date()
        }
      });
      return;
    }
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    for await (const user of Users.find({
      plan: { $in: ['enhanced_protection', 'team'] },
      group: 'user',
      [config.userFields.isBanned]: false,
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.planExpiresAt]: {
        // NOTE: if you change this then also update `app/models/user.js` save hook
        $lte: dayjs().add(1, 'month').toDate()
      },
      //
      // NOTE: users on subscriptions will automatically have
      //       their subscriptions cancelled and removed if they
      //       are late on payments or if they manually cancel from PayPal
      //       (the sync jobs will take care of this automatically)
      //       (we don't want to annoy people on subscriptions with messages)
      //
      [config.userFields.stripeSubscriptionID]: { $exists: false },
      [config.userFields.paypalSubscriptionID]: { $exists: false },
      [config.userFields.paymentReminderTerminationNoticeSentAt]: {
        $exists: false
      }
      // TODO: we can optimize this query more with date filtering in the future
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      //
      // NOTE: we send an initial notice
      //       then a follow-up one week later
      //       then a final notice three weeks later
      //       and then finally ban the account one month later
      //       (so users technically have 2 months after they receive initial notice before they get banned)
      //       (and they only get banned if we successfully have sent them each notice in order)
      //
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

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
