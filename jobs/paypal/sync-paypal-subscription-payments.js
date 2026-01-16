/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pReduce = require('p-reduce');
const isSANB = require('is-string-and-not-blank');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const Users = require('#models/users');
const Payments = require('#models/payments');
const config = require('#config');
const syncPayPalSubscriptionPaymentsByUser = require('#helpers/sync-paypal-subscription-payments-by-user');
const getAllPayPalSubscriptions = require('#helpers/get-all-paypal-subscriptions');
const getAllPayPalSubscriptionTransactions = require('#helpers/get-all-paypal-subscription-transactions');
const { paypalAgent } = require('#helpers/paypal');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const i18n = require('#helpers/i18n');

const { PAYPAL_PLAN_MAPPING } = config.payments;
const PAYPAL_PLANS = {
  enhanced_protection: Object.values(PAYPAL_PLAN_MAPPING.enhanced_protection),
  team: Object.values(PAYPAL_PLAN_MAPPING.team)
};

async function syncPayPalSubscriptionPayments() {
  //
  // NEW: As of July 2025, PayPal finally added the GET /v1/billing/subscriptions endpoint
  //      after 11 years of developer requests. We now use this to discover ALL subscriptions
  //      and ensure we're not missing any due to webhook/redirect failures.
  //
  //      We still maintain the user-based sync as a secondary pass for redundancy.
  //

  const errorEmails = [];
  const unmatchedSubscriptions = [];
  let allSubscriptions = null; // Declare at function scope for use in both phases

  //
  // PHASE 1: Fetch all subscriptions from PayPal API and sync them
  //
  try {
    logger.info('Phase 1: Fetching all subscriptions from PayPal API');
    const agent = await paypalAgent();

    // Get all active and suspended subscriptions (we'll handle cancelled/expired ones too)
    allSubscriptions = await getAllPayPalSubscriptions(agent, {
      pageSize: 20 // Use maximum page size for efficiency
    });

    logger.info(
      `Found ${allSubscriptions.length} total subscriptions from PayPal API`
    );

    // Process each subscription
    for (const subscription of allSubscriptions) {
      try {
        // Find the user by payer_id or subscription ID
        let user = null;

        // First try to find by subscription ID
        if (isSANB(subscription.id)) {
          user = await Users.findOne({
            [config.userFields.paypalSubscriptionID]: subscription.id
          })
            .lean()
            .exec();
        }

        // If not found, try to find by payer_id
        if (!user && isSANB(subscription.subscriber?.payer_id)) {
          user = await Users.findOne({
            [config.userFields.paypalPayerID]: subscription.subscriber.payer_id
          })
            .lean()
            .exec();
        }

        // If not found, try to find by email address
        if (!user && isSANB(subscription.subscriber?.email_address)) {
          user = await Users.findOne({
            email: subscription.subscriber.email_address.toLowerCase()
          })
            .lean()
            .exec();
        }

        if (!user) {
          logger.warn(
            `Could not find user for PayPal subscription ${subscription.id}`,
            {
              payer_id: subscription.subscriber?.payer_id,
              email: subscription.subscriber?.email_address
            }
          );

          // Collect unmatched subscription for admin notification
          unmatchedSubscriptions.push({
            subscription_id: subscription.id,
            payer_id: subscription.subscriber?.payer_id,
            email: subscription.subscriber?.email_address,
            status: subscription.status,
            plan_id: subscription.plan_id,
            start_time: subscription.start_time,
            billing_info: subscription.billing_info
          });

          continue;
        }

        // Determine the plan from subscription
        const plan = Object.keys(PAYPAL_PLANS).find((plan) =>
          PAYPAL_PLANS[plan].includes(subscription.plan_id)
        );

        if (!plan) {
          logger.error(
            new Error(
              `Could not determine plan for PayPal subscription ${subscription.id} with plan_id ${subscription.plan_id}`
            )
          );
          continue;
        }

        //
        // BUG FIX: Check if user has a different subscription ID than the one we're processing
        // If so, cancel the older subscription and keep the newer one
        //
        if (
          isSANB(user[config.userFields.paypalSubscriptionID]) &&
          user[config.userFields.paypalSubscriptionID] !== subscription.id
        ) {
          logger.warn(
            `User ${user.email} has subscription ID ${
              user[config.userFields.paypalSubscriptionID]
            } but found ${subscription.id}`
          );

          // Fetch both subscriptions to compare dates
          const agent = await paypalAgent();
          let existingSubscription;
          try {
            const response = await agent.get(
              `/v1/billing/subscriptions/${
                user[config.userFields.paypalSubscriptionID]
              }`
            );
            existingSubscription = response.body;
          } catch (err) {
            logger.error(err, {
              subscription_id: user[config.userFields.paypalSubscriptionID]
            });
          }

          // Determine which is newer
          let olderSubscriptionId;
          let newerSubscriptionId;
          let shouldCancel = false;

          if (existingSubscription) {
            const existingDate = new Date(
              existingSubscription.start_time ||
                existingSubscription.create_time
            );
            const currentDate = new Date(
              subscription.start_time || subscription.create_time
            );

            if (currentDate > existingDate) {
              // Current subscription is newer
              olderSubscriptionId = existingSubscription.id;
              newerSubscriptionId = subscription.id;
              shouldCancel = true;
            } else {
              // Existing subscription is newer
              olderSubscriptionId = subscription.id;
              newerSubscriptionId = existingSubscription.id;
              shouldCancel = true;
            }
          }

          if (shouldCancel) {
            logger.warn(
              `Canceling older PayPal subscription ${olderSubscriptionId} for user ${user.email}, keeping ${newerSubscriptionId}`
            );

            // Cancel the older subscription
            try {
              await agent
                .post(`/v1/billing/subscriptions/${olderSubscriptionId}/cancel`)
                .send({
                  reason:
                    'Duplicate subscription detected, keeping newer subscription'
                });
              logger.info(
                `Successfully cancelled older subscription ${olderSubscriptionId}`
              );
            } catch (err) {
              logger.error(err, {
                subscription_id: olderSubscriptionId
              });
            }

            // Update user with newer subscription ID
            await Users.findByIdAndUpdate(user._id, {
              $set: {
                [config.userFields.paypalSubscriptionID]: newerSubscriptionId
              }
            });

            // Send notification email to user and admin
            const userDoc = await Users.findById(user._id);
            const locale =
              userDoc[config.lastLocaleField] || i18n.config.defaultLocale;
            try {
              await emailHelper({
                template: 'alert',
                message: {
                  to: userDoc[config.userFields.receiptEmail] || userDoc.email,
                  ...(userDoc[config.userFields.receiptEmail]
                    ? { cc: userDoc.email }
                    : {}),
                  bcc: config.supportEmail,
                  subject: 'Duplicate PayPal subscription resolved'
                },
                locals: {
                  message: `<p class="text-center">We detected that you had multiple PayPal subscriptions and have automatically resolved this by canceling the older subscription.</p><p class="text-center"><strong>Active subscription:</strong> <span class="notranslate">${newerSubscriptionId}</span></p><p class="text-center"><strong>Cancelled subscription:</strong> <span class="notranslate">${olderSubscriptionId}</span></p><p class="text-center">You do not need to take any action. Your billing will continue normally with the active subscription.</p><p class="text-center mb-0"><a href="${config.urls.web}/${locale}/my-account/billing" class="btn btn-md btn-dark notranslate">Manage Billing</a></p>`,
                  locale
                }
              });
              logger.info(
                `Sent duplicate subscription notification to ${userDoc.email} and admin`
              );
            } catch (err) {
              logger.error(err, {
                user_email: userDoc.email
              });
            }

            // Refresh user object
            user = await Users.findById(user._id).lean().exec();

            // If the current subscription was the older one, skip further processing
            if (subscription.id === olderSubscriptionId) {
              continue;
            }
          }
        }

        //
        // BUG FIX: Check if user's plan doesn't match their ACTIVE subscription
        // This handles the edge case where webhook doesn't fire or user doesn't complete redirect
        //
        if (subscription.status === 'ACTIVE' && user.plan !== plan) {
          logger.warn(
            `User ${user.email} has plan "${user.plan}" but has ACTIVE PayPal subscription ${subscription.id} for "${plan}" plan`
          );

          // Update user's plan to match subscription
          const userDoc = await Users.findById(user._id);
          if (!userDoc) throw new Error('User does not exist');

          const wasFree = userDoc.plan === 'free';

          userDoc.plan = plan;

          // If user was on free plan, set planSetAt to first payment's invoice_at
          // This mirrors the webhook logic at app/controllers/api/v1/paypal.js:323
          if (wasFree) {
            let payment = await Payments.findOne(
              {
                user: userDoc._id,
                [config.userFields.paypalSubscriptionID]: subscription.id
              },
              null,
              { sort: { invoice_at: 1 } }
            );

            // If no payment found, fetch and sync transactions from PayPal
            if (!payment) {
              logger.info(
                `No payment found for subscription ${subscription.id}, fetching transactions from PayPal`
              );
              try {
                const transactions = await getAllPayPalSubscriptionTransactions(
                  subscription,
                  agent
                );
                if (transactions && transactions.length > 0) {
                  // Sync transactions using the helper
                  await syncPayPalSubscriptionPaymentsByUser(
                    [],
                    userDoc,
                    allSubscriptions
                  );
                  // Try to find payment again after syncing
                  payment = await Payments.findOne(
                    {
                      user: userDoc._id,
                      [config.userFields.paypalSubscriptionID]: subscription.id
                    },
                    null,
                    { sort: { invoice_at: 1 } }
                  );
                }
              } catch (err) {
                logger.error(
                  err,
                  `Error fetching transactions for subscription ${subscription.id}`
                );
              }
            }

            if (payment) {
              userDoc[config.userFields.planSetAt] = payment.invoice_at;
              logger.info(
                `Set planSetAt to ${payment.invoice_at} for user ${userDoc.email}`
              );
            } else {
              logger.warn(
                `No payment found for subscription ${subscription.id} even after fetching from PayPal, cannot set planSetAt`
              );
            }
          }

          await userDoc.save();

          logger.info(
            `Updated user ${user.email} from "${user.plan}" plan to "${plan}" plan`
          );

          // Send notification email to user and admin
          const locale =
            userDoc[config.lastLocaleField] || i18n.config.defaultLocale;
          try {
            await emailHelper({
              template: 'alert',
              message: {
                to: userDoc[config.userFields.receiptEmail] || userDoc.email,
                ...(userDoc[config.userFields.receiptEmail]
                  ? { cc: userDoc.email }
                  : {}),
                bcc: config.supportEmail,
                subject: i18n.api.t({
                  phrase: config.i18n.phrases.SUBSCRIPTION_ACTIVATED_SUBJECT,
                  locale
                })
              },
              locals: {
                message: i18n.api.t(
                  {
                    phrase: config.i18n.phrases.SUBSCRIPTION_ACTIVATED_BODY,
                    locale
                  },
                  i18n.api.t({ phrase: plan.toUpperCase(), locale }),
                  `${config.urls.web}/${locale}/my-account/billing`
                ),
                locale
              }
            });
            logger.info(
              `Sent subscription activation email to ${userDoc.email} and admin`
            );
          } catch (err) {
            logger.error(err, {
              user_email: userDoc.email,
              subscription_id: subscription.id
            });
          }

          // Refresh user object with updated plan
          user = await Users.findById(user._id).lean().exec();
        }

        // Update user's PayPal subscription ID if not set
        if (user[config.userFields.paypalSubscriptionID] !== subscription.id) {
          await Users.findByIdAndUpdate(user._id, {
            $set: {
              [config.userFields.paypalSubscriptionID]: subscription.id
            }
          });
          logger.info(
            `Updated user ${user.email} with PayPal subscription ID ${subscription.id}`
          );
        }

        // Update user's PayPal payer ID if not set
        if (
          isSANB(subscription.subscriber?.payer_id) &&
          user[config.userFields.paypalPayerID] !==
            subscription.subscriber.payer_id
        ) {
          await Users.findByIdAndUpdate(user._id, {
            $set: {
              [config.userFields.paypalPayerID]:
                subscription.subscriber.payer_id
            }
          });
          logger.info(
            `Updated user ${user.email} with PayPal payer ID ${subscription.subscriber.payer_id}`
          );
        }

        // Now sync this user's payments (pass allSubscriptions to avoid re-fetching)
        await syncPayPalSubscriptionPaymentsByUser(
          errorEmails,
          user,
          allSubscriptions
        );
      } catch (err) {
        logger.error(err, {
          subscription_id: subscription.id
        });
        // Continue processing other subscriptions even if one fails
      }
    }

    logger.info('Phase 1 complete: All PayPal API subscriptions processed');

    // Send admin email if there are unmatched subscriptions
    if (unmatchedSubscriptions.length > 0) {
      try {
        await emailHelper({
          template: 'alert',
          message: {
            to: config.supportEmail,
            subject: `${unmatchedSubscriptions.length} PayPal subscription(s) could not be matched to users`
          },
          locals: {
            message: `<p>The following PayPal subscriptions were found in the PayPal API but could not be matched to any user in the database:</p>
<pre><code>${encode(
              safeStringify(unmatchedSubscriptions, null, 2)
            )}</code></pre>
<p><strong>Total unmatched:</strong> ${unmatchedSubscriptions.length}</p>
<p><strong>Possible reasons:</strong></p>
<ul>
<li>User account was deleted but PayPal subscription still active</li>
<li>Email address mismatch between PayPal and Forward Email accounts</li>
<li>Subscription created outside of normal checkout flow</li>
<li>Data corruption or migration issue</li>
</ul>
<p><strong>Recommended actions:</strong></p>
<ul>
<li>Review each subscription in PayPal dashboard</li>
<li>Contact subscribers directly if needed</li>
<li>Cancel subscriptions for deleted accounts</li>
<li>Investigate email address mismatches</li>
</ul>`
          }
        });
        logger.info(
          `Sent admin email about ${unmatchedSubscriptions.length} unmatched subscriptions`
        );
      } catch (err) {
        logger.error(err, {
          unmatchedCount: unmatchedSubscriptions.length
        });
      }
    }
  } catch (err) {
    logger.error(err);
    // Don't throw here - continue to Phase 2
  }

  //
  // PHASE 2: User-based sync (existing logic as fallback/redundancy)
  //
  try {
    logger.info('Phase 2: Running user-based sync for additional coverage');

    const paypalCustomers = await Users.find({
      $or: [
        {
          [config.userFields.paypalSubscriptionID]: { $exists: true, $ne: null }
        },
        {
          [config.userFields.paypalPayerID]: { $exists: true, $ne: null }
        }
      ]
    })
      // sort by newest customers first
      .sort('-created_at')
      .lean()
      .exec();

    await logger.info(
      `Syncing payments for ${paypalCustomers.length} paypal customers (user-based)`
    );

    const userErrorEmails = await pReduce(
      paypalCustomers,
      async (errorEmails, user) => {
        // Pass allSubscriptions from Phase 1 to avoid re-fetching
        // If Phase 1 failed, allSubscriptions will be undefined and helper will fetch
        return syncPayPalSubscriptionPaymentsByUser(
          errorEmails,
          user,
          allSubscriptions
        );
      },
      errorEmails
    );

    if (userErrorEmails.length > 0)
      await Promise.all(userErrorEmails.map((email) => emailHelper(email)));

    logger.info('Phase 2 complete: User-based sync finished');
  } catch (err) {
    logger.error(err);
  }

  await logger.info(
    'Paypal subscriptions synced to payments (both phases complete)'
  );
}

module.exports = syncPayPalSubscriptionPayments;
