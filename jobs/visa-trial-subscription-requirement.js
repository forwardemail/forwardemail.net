/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const Stripe = require('stripe');
const numeral = require('numeral');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const parseErr = require('parse-err');
const mongoose = require('mongoose');
const safeStringify = require('fast-safe-stringify');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Payments, Domains } = require('#models');
const { paypalAgent } = require('#helpers/paypal');

const { PAYPAL_MAPPING, PAYPAL_PLAN_MAPPING } = config.payments;
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

const THREE_SECONDS = ms('3s');

graceful.listen();

async function mapper(user) {
  // safeguard
  if (!user) return;

  try {
    // stripe support
    if (
      isSANB(user[config.userFields.stripeSubscriptionID]) &&
      !_.isDate(user[config.userFields.stripeTrialSentAt])
    ) {
      //
      // lookup the subscription and if it's `status` is "trialing"
      // then send them an email if the `billing_cycle_anchor` is within the next week
      // (VISA requirement is 7 days)
      // <https://support.stripe.com/questions/2020-visa-trial-subscription-requirement-changes-guide>
      //
      // (note that we store metadata on the subscription itself for when we sent the email - as opposed to doing it on our side)
      //
      const subscription = await stripe.subscriptions.retrieve(
        user[config.userFields.stripeSubscriptionID]
      );
      if (
        subscription.status === 'trialing' &&
        dayjs.unix(subscription.billing_cycle_anchor).isAfter(dayjs()) &&
        dayjs
          .unix(subscription.billing_cycle_anchor)
          .isBefore(dayjs().add(1, 'week'))
      ) {
        const frequency =
          subscription.plan.interval_count > 1
            ? dayjs()
                .add(
                  subscription.plan.interval_count,
                  subscription.plan.interval
                )
                .locale(user[config.lastLocaleField])
                .fromNow(true)
            : i18n.api.t({
                phrase:
                  config.i18n.phrases[subscription.plan.interval.toUpperCase()],
                locale: user[config.lastLocaleField]
              });

        const domains = await Domains.find({
          'members.user': user._id
        })
          .sort('name')
          .lean()
          .exec();

        // send them an email in compliance with payment processing requirements
        try {
          await emailHelper({
            template: 'visa-trial-subscription-requirement',
            message: {
              to: user[config.userFields.receiptEmail] || user.email,
              ...(user[config.userFields.receiptEmail]
                ? { cc: user.email }
                : {})
            },
            locals: {
              user,
              firstChargeDate: dayjs
                .unix(subscription.billing_cycle_anchor)
                .toDate(),
              frequency,
              formattedAmount: numeral(subscription.plan.amount / 100).format(
                '$0,0,0.00'
              ),
              domains
            }
          });

          const now = new Date();

          // store that we sent this email
          await Users.findByIdAndUpdate(user._id, {
            $set: {
              [config.userFields.stripeTrialSentAt]: now
            }
          });

          // after the email was successfully sent then we need to update the subscription metadata
          // (just so we have this on the Stripe side saved)
          const metadata = subscription.metadata || {};
          metadata.visa_trial_email_sent_at = now.toISOString();
          await stripe.subscriptions.update(
            user[config.userFields.stripeSubscriptionID],
            { metadata }
          );
        } catch (err) {
          await logger.error(err);
          // send an email to admins of the error
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: 'VISA Trial Subscription Requirement Error'
            },
            locals: {
              message: `<pre><code>${safeStringify(
                parseErr(err),
                null,
                2
              )}</code></pre>`
            }
          });
        }
      }
    }

    //
    // paypal support
    // (they don't explicitly suggest to do this anywhere like Stripe does, but we're doing it for consistency)
    //
    if (
      isSANB(user[config.userFields.paypalSubscriptionID]) &&
      !_.isDate(user[config.userFields.paypalTrialSentAt])
    ) {
      const agent = await paypalAgent();
      const { body: subscription } = await agent.get(
        `/v1/billing/subscriptions/${
          user[config.userFields.paypalSubscriptionID]
        }`
      );
      const hasPayment =
        _.isObject(subscription.billing_info) &&
        _.isObject(subscription.billing_info.last_payment) &&
        _.isObject(subscription.billing_info.last_payment.amount) &&
        subscription.billing_info.last_payment.amount.value;
      if (
        !hasPayment &&
        dayjs(new Date(subscription.start_time)).isAfter(dayjs()) &&
        dayjs(new Date(subscription.start_time)).isBefore(
          dayjs().add(1, 'week')
        )
      ) {
        // use `subscription.plan_id` to get frequency and amount
        const mapping = PAYPAL_PLAN_MAPPING[user.plan];
        if (!_.isObject(mapping)) throw new Error('Mapping was missing');
        let duration;
        for (const key of Object.keys(mapping)) {
          if (mapping[key] === subscription.plan_id) {
            duration = key;
            break;
          }
        }

        if (!duration) throw new Error('Duration was missing');

        let frequency;
        switch (duration) {
          case '30d': {
            frequency = i18n.api.t({
              phrase: config.i18n.phrases.MONTH,
              locale: user[config.lastLocaleField]
            });
            break;
          }

          case '60d': {
            frequency = dayjs()
              .add(2, 'month')
              .locale(user[config.lastLocaleField])
              .fromNow(true);
            break;
          }

          case '90d': {
            frequency = dayjs()
              .add(3, 'month')
              .locale(user[config.lastLocaleField])
              .fromNow(true);
            break;
          }

          case '180d': {
            frequency = dayjs()
              .add(6, 'month')
              .locale(user[config.lastLocaleField])
              .fromNow(true);
            break;
          }

          case '1y': {
            frequency = i18n.api.t({
              phrase: config.i18n.phrases.YEAR,
              locale: user[config.lastLocaleField]
            });
            break;
          }

          default: {
            throw new Error('Invalid frequency duration');
          }
        }

        if (!frequency) throw new Error('Frequency was missing');

        const amount = PAYPAL_MAPPING[user.plan][duration];

        if (!amount) throw new Error('Amount was missing');

        const domains = await Domains.find({
          'members.user': user._id
        })
          .sort('name')
          .lean()
          .exec();

        // send them an email in compliance with payment processing requirements
        await emailHelper({
          template: 'visa-trial-subscription-requirement',
          message: {
            to: user[config.userFields.receiptEmail] || user.email,
            ...(user[config.userFields.receiptEmail] ? { cc: user.email } : {})
          },
          locals: {
            user,
            firstChargeDate: new Date(subscription.start_time),
            frequency,
            formattedAmount: numeral(amount).format('$0,0,0.00'),
            domains
          }
        });

        // store that we sent this email
        await Users.findByIdAndUpdate(user._id, {
          $set: {
            [config.userFields.paypalTrialSentAt]: new Date()
          }
        });
      }

      //
      // NOTE: we can only do ~50 requests per minute with PayPal API
      //       and this does 2 API requests per call
      //       and with a 3s delay we can get 60/3 = 20 in 1 min (so 40 requests total)
      //
      await setTimeout(THREE_SECONDS);
    }
  } catch (err) {
    logger.fatal(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    //
    // we can filter out users with subscriptions
    // that have already had payments (aka no trial period)
    //
    const [paidStripeSubscriptionIds, paidPayPalSubscriptionIds] =
      await Promise.all([
        Payments.distinct(config.userFields.stripeSubscriptionID, {
          [config.userFields.stripeSubscriptionID]: { $exists: true }
        }),
        Payments.distinct(config.userFields.paypalSubscriptionID, {
          [config.userFields.paypalSubscriptionID]: { $exists: true }
        })
      ]);

    for await (const user of Users.find({
      $or: [
        {
          $and: [
            { [config.userFields.stripeSubscriptionID]: { $exists: true } },
            { [config.userFields.stripeTrialSentAt]: { $exists: false } },
            ...(paidStripeSubscriptionIds.length > 0
              ? [
                  {
                    [config.userFields.stripeSubscriptionID]: {
                      $nin: paidStripeSubscriptionIds
                    }
                  }
                ]
              : [])
          ]
        },
        {
          $and: [
            { [config.userFields.paypalSubscriptionID]: { $exists: true } },
            { [config.userFields.paypalTrialSentAt]: { $exists: false } },
            ...(paidPayPalSubscriptionIds.length > 0
              ? [
                  {
                    [config.userFields.paypalSubscriptionID]: {
                      $nin: paidPayPalSubscriptionIds
                    }
                  }
                ]
              : [])
          ]
        }
      ]
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      try {
        await mapper(user);
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'VISA Trial Subscription Requirement Error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
