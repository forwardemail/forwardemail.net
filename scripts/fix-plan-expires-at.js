/* eslint-disable no-await-in-loop */
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const dayjs = require('dayjs-with-plugins');
const _ = require('lodash');

const logger = require('../helpers/logger');
const Users = require('../app/models/user');
const Payments = require('../app/models/payment');
const config = require('../config');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const now = dayjs();

(async () => {
  await mongoose.connect();

  // we can immediately run this script for stripe payments
  // once we have paypal fully synced paypal we can remove the
  // TODO: remove this filter when paypal is synced
  const payingCustomerIds = await Payments.distinct('user', {
    method: {
      $nin: ['paypal', 'bitpay']
    }
  });

  const customers = await Users.find({
    _id: { $in: payingCustomerIds }
  });

  console.log(
    `Fixing plan_expires_at for ${customers.length} stripe customers.`
  );

  for (const customer of customers) {
    console.group(`customer ${customer.email}`);
    try {
      const payments = await Payments.find({
        user: customer._id
      })
        .sort('created_at')
        .lean()
        .exec();

      // we can immediately run this script for stripe payments
      // once we have paypal fully synced paypal we can remove the
      // TODO: remove this when paypal is synced and run again
      if (payments.some((p) => ['paypal', 'bitpay'].includes(p.method))) {
        console.log('Mixed payment methods found, skipping calculation.');
        console.groupEnd();
        continue;
      }

      const currentPayments = payments.filter(
        (payment) =>
          _.isDate(payment.created_at) &&
          _.isFinite(payment.duration) &&
          dayjs(payment.created_at).add(payment.duration, 'ms').isAfter(now)
      );

      if (currentPayments.length > 0) {
        console.log('Current payments found!');
        // calc the time they have accumulated
        let accumulatedTime = 0;
        for (const payment of currentPayments) {
          const paymentEndDate = dayjs(payment.created_at).add(
            payment.duration,
            'ms'
          );

          accumulatedTime += dayjs
            .duration(paymentEndDate.diff(now))
            .asMilliseconds();
        }

        const calculatedPlanExpiresAt = now.add(accumulatedTime, 'ms');

        const currentPlanExpiresAt =
          _.isDate(customer[config.userFields.planExpiresAt]) &&
          dayjs(customer[config.userFields.planExpiresAt]);

        // eslint-disable-next-line no-negated-condition
        if (
          // if the current planExpiresAt field is on the same day - don't bother changing it.
          currentPlanExpiresAt.format('MMDDYYYY') !== now.format('MMDDYYYY')
        ) {
          customer[config.userFields.planExpiresAt] =
            calculatedPlanExpiresAt.toDate();

          console.log(
            `Plan expires at changed to ${calculatedPlanExpiresAt.format(
              'MM/DD/YY mm:hh A'
            )}`
          );
        } else console.log('Plan expires at set correctly already');

        // if they've got the wrong plan set
        // make sure we get the appropriate one set
        if (customer.plan === 'free') {
          const plans = _.uniq(_.map(currentPayments, 'plan'));
          // if they have both an active team and enhanced plan just give them the team plan
          const plan = plans.length > 1 ? 'team' : plans[0];
          console.log(`Changing customer plan from free to ${plan}`);
          customer.plan = plan;
        }

        await customer.save();
        // if they have a past due planExpiresAt field, make sure they have the free plan set
      } else if (_.isDate() && customer.plan !== 'free') {
        console.log('No current payments, setting customer plan to "free"');
        customer.plan = 'free';
        await customer.save();
      }

      console.log('No current payments found!');
    } catch (err) {
      console.error(err);
    }

    console.groupEnd();
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
})();
