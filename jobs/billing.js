const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const mongoose = require('mongoose');

const i18n = require('#helpers/i18n');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, Payments } = require('#models');

const concurrency = config.env === 'development' ? 1 : os.cpus().length;

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

// eslint-disable-next-line complexity
async function mapper(id) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  const user = await Users.findById(id).lean().exec();

  // ensure not banned
  if (user[config.userFields.isBanned]) return;

  // if on free plan then ignore
  if (user.plan === 'free') return;

  // if they started a subscription then ignore
  if (
    isSANB(user[config.userFields.stripeSubscriptionID]) ||
    isSANB(user[config.userFields.paypalSubscriptionID])
  )
    return;

  // if user has zero domains on paid plans then ignore (another job will downgrade them)
  const count = await Domains.countDocuments({
    plan: { $ne: 'free' },
    user: user._id
  });
  if (count === 0) return;

  // ensure plan has expiry
  if (!_.isDate(user[config.userFields.planExpiresAt])) return;
  // ensure plan expires < 1 month from now
  if (
    dayjs(user[config.userFields.planExpiresAt]).isAfter(
      dayjs().add(1, 'month')
    )
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
    if (paymentCount >= 0) return;
  }

  // if final notice sent then ensure it's been 1 month since final notice
  if (_.isDate(user[config.userFields.paymentReminderFinalNoticeSentAt])) {
    // if it has been more than a month then ban the user and email admins
    // otherwise return early since we've already notified them
    if (
      dayjs().isAfter(
        dayjs(user[config.userFields.paymentReminderFinalNoticeSentAt]).add(
          1,
          'month'
        )
      ) &&
      !_.isDate(user[config.userFields.paymentReminderTerminationNoticeSentAt])
    ) {
      await email({
        template: 'alert',
        message: {
          to:
            user[config.userFields.receiptEmail] ||
            user[config.userFields.fullEmail],
          ...(user[config.userFields.receiptEmail]
            ? { cc: user[config.userFields.fullEmail] }
            : {}),
          bcc: config.email.message.from,
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
  const domains = await Domains.find({
    'members.user': user._id
  })
    .sort('name')
    .lean()
    .exec();

  try {
    await email({
      template: 'payment-reminder',
      message: {
        to:
          user[config.userFields.receiptEmail] ||
          user[config.userFields.fullEmail],
        ...(user[config.userFields.receiptEmail]
          ? { cc: user[config.userFields.fullEmail] }
          : {})
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
    const ids = await Users.distinct('_id', {
      plan: { $ne: 'free' },
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
      [config.userFields.paypalSubscriptionID]: { $exists: false }
      // TODO: we can optimize this query more with date filtering in the future
    });

    //
    // NOTE: we send an initial notice
    //       then a follow-up one week later
    //       then a final notice three weeks later
    //       and then finally ban the account one month later
    //       (so users technically have 2 months after they receive initial notice before they get banned)
    //       (and they only get banned if we successfully have sent them each notice in order)
    //
    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
