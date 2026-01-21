/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const numeral = require('numeral');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const parseErr = require('parse-err');
const mongoose = require('mongoose');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const _ = require('#helpers/lodash');

const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains } = require('#models');
const { paypalAgent } = require('#helpers/paypal');
const stripe = require('#helpers/stripe');

const { PAYPAL_MAPPING, PAYPAL_PLAN_MAPPING } = config.payments;

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

const THREE_SECONDS = ms('3s');
const THIRTY_DAYS_TO_MS = ms('30d');

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

//
// This job sends renewal reminders 7 days before subscription renewal
// for annual and 6-month subscriptions (not monthly).
// This is similar to the VISA trial requirement but for existing subscriptions.
//
// We track sent reminders using:
// - Stripe: subscription metadata
// - PayPal: Redis cache (since PayPal doesn't have metadata like Stripe)
//

async function mapper(user) {
  if (isCancelled) return;

  // safeguard
  if (!user) return;

  try {
    // Stripe subscription renewal reminder
    if (isSANB(user[config.userFields.stripeSubscriptionID])) {
      const subscription = await stripe.subscriptions.retrieve(
        user[config.userFields.stripeSubscriptionID]
      );

      // Only process active subscriptions
      if (subscription.status !== 'active') return;

      // Get the billing interval - only send reminders for 6-month and annual
      const intervalCount =
        subscription.items.data[0]?.price?.recurring?.interval_count || 1;
      const interval =
        subscription.items.data[0]?.price?.recurring?.interval || 'month';

      // Skip monthly subscriptions (interval_count=1 and interval=month)
      const isMonthly = interval === 'month' && intervalCount === 1;
      if (isMonthly) return;

      // Check if next billing is within 7 days
      const nextBillingDate = dayjs.unix(subscription.current_period_end);
      const now = dayjs();

      if (
        nextBillingDate.isAfter(now) &&
        nextBillingDate.isBefore(now.add(7, 'days'))
      ) {
        // Check metadata to see if we already sent a reminder for this billing period
        const metadata = subscription.metadata || {};
        const lastReminderSent = metadata.renewal_reminder_sent_at;

        if (lastReminderSent) {
          const lastSentDate = dayjs(lastReminderSent);
          // Don't send if we sent a reminder in the last 30 days
          if (now.diff(lastSentDate, 'days') < 30) return;
        }

        // Calculate frequency string
        let frequency;
        if (intervalCount > 1) {
          frequency = dayjs()
            .add(intervalCount, interval)
            .locale(user[config.lastLocaleField])
            .fromNow(true);
        } else {
          frequency = i18n.api.t({
            phrase: config.i18n.phrases[interval.toUpperCase()],
            locale: user[config.lastLocaleField]
          });
        }

        const domains = await Domains.find({
          'members.user': user._id
        })
          .sort('name')
          .lean()
          .exec();

        // Send renewal reminder email
        try {
          await emailHelper({
            template: 'subscription-renewal-reminder',
            message: {
              to: user[config.userFields.receiptEmail] || user.email,
              ...(user[config.userFields.receiptEmail]
                ? { cc: user.email }
                : {})
            },
            locals: {
              user,
              renewalDate: nextBillingDate.toDate(),
              frequency,
              formattedAmount: numeral(
                (subscription.items.data[0]?.price?.unit_amount ?? 0) / 100
              ).format('$0,0,0.00'),
              domains
            }
          });

          // Update subscription metadata to track that we sent the reminder
          await stripe.subscriptions.update(
            user[config.userFields.stripeSubscriptionID],
            {
              metadata: {
                ...metadata,
                renewal_reminder_sent_at: now.toISOString()
              }
            }
          );

          logger.info(
            `Sent subscription renewal reminder to ${user.email} for Stripe subscription`
          );
        } catch (err) {
          await logger.error(err);
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: 'Subscription Renewal Reminder Error'
            },
            locals: {
              message: `<pre><code>${encode(
                safeStringify(parseErr(err), null, 2)
              )}</code></pre>`
            }
          });
        }
      }
    }

    // PayPal subscription renewal reminder
    if (isSANB(user[config.userFields.paypalSubscriptionID])) {
      const agent = await paypalAgent();
      const { body: subscription } = await agent.get(
        `/v1/billing/subscriptions/${
          user[config.userFields.paypalSubscriptionID]
        }`
      );

      // Only process active subscriptions
      if (subscription.status !== 'ACTIVE') return;

      // Get the plan to determine frequency
      const mapping = PAYPAL_PLAN_MAPPING[user.plan];
      if (!_.isObject(mapping)) return;

      let duration;
      for (const key of Object.keys(mapping)) {
        if (mapping[key] === subscription.plan_id) {
          duration = key;
          break;
        }
      }

      if (!duration) return;

      // Skip monthly subscriptions
      if (duration === '30d') return;

      // Check if next billing is within 7 days
      const nextBillingDate = subscription.billing_info?.next_billing_time
        ? dayjs(new Date(subscription.billing_info.next_billing_time))
        : null;

      if (!nextBillingDate) return;

      const now = dayjs();

      if (
        nextBillingDate.isAfter(now) &&
        nextBillingDate.isBefore(now.add(7, 'days'))
      ) {
        // Check Redis cache to see if we already sent a reminder for this billing period
        // Key format: renewal_reminder:paypal:{subscription_id}
        const cacheKey = `renewal_reminder:paypal:${
          user[config.userFields.paypalSubscriptionID]
        }`;
        const lastReminderSent = await client.get(cacheKey);

        if (lastReminderSent) {
          const lastSentDate = dayjs(lastReminderSent);
          // Don't send if we sent a reminder in the last 30 days
          if (now.diff(lastSentDate, 'days') < 30) return;
        }

        // Calculate frequency string
        let frequency;
        switch (duration) {
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

          case '2y': {
            frequency = dayjs()
              .add(2, 'year')
              .locale(user[config.lastLocaleField])
              .fromNow(true);
            break;
          }

          case '3y': {
            frequency = dayjs()
              .add(3, 'year')
              .locale(user[config.lastLocaleField])
              .fromNow(true);
            break;
          }

          default: {
            return;
          }
        }

        const amount = PAYPAL_MAPPING[user.plan][duration];
        if (!amount) return;

        const domains = await Domains.find({
          'members.user': user._id
        })
          .sort('name')
          .lean()
          .exec();

        // Send renewal reminder email
        try {
          await emailHelper({
            template: 'subscription-renewal-reminder',
            message: {
              to: user[config.userFields.receiptEmail] || user.email,
              ...(user[config.userFields.receiptEmail]
                ? { cc: user.email }
                : {})
            },
            locals: {
              user,
              renewalDate: nextBillingDate.toDate(),
              frequency,
              formattedAmount: numeral(amount).format('$0,0,0.00'),
              domains
            }
          });

          // Store in Redis that we sent the reminder (expires after 30 days)
          await client.set(
            cacheKey,
            now.toISOString(),
            'PX',
            THIRTY_DAYS_TO_MS
          );

          logger.info(
            `Sent subscription renewal reminder to ${user.email} for PayPal subscription`
          );
        } catch (err) {
          await logger.error(err);
        }
      }

      // Rate limiting for PayPal API
      await setTimeout(THREE_SECONDS);
    }
  } catch (err) {
    logger.fatal(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    // Find users with active subscriptions
    for await (const user of Users.find({
      $or: [
        { [config.userFields.stripeSubscriptionID]: { $exists: true } },
        { [config.userFields.paypalSubscriptionID]: { $exists: true } }
      ],
      [config.userFields.isBanned]: false,
      [config.userFields.hasVerifiedEmail]: true
    })
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
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Subscription Renewal Reminder Job Error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
