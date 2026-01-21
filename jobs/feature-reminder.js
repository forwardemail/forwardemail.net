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

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Users = require('#models/users');
const Domains = require('#models/domains');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const email = require('#helpers/email');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});
const threeMonthsAgo = dayjs().subtract(3, 'months').toDate();

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

/**
 * Build feature lists based on what user is using vs not using
 * @param {Object} featureUsage - Object containing feature usage booleans
 * @param {string} locale - User's locale for links
 * @returns {Object} - Object with 'using' and 'missing' arrays
 */
function buildFeatureLists(featureUsage, locale) {
  const features = {
    using: [],
    missing: []
  };

  // SMTP - Outbound email sending
  const smtpFeature = {
    emoji: 'outbox_tray',
    title: 'Outbound SMTP',
    description:
      'Send emails from your custom domain with full authentication.',
    link: `${config.urls.web}/${locale}/guides/send-email-with-custom-domain-smtp`,
    linkText: 'SMTP Guide',
    external: false
  };
  if (featureUsage.hasSmtp) {
    features.using.push(smtpFeature);
  } else {
    features.missing.push(smtpFeature);
  }

  // IMAP - Encrypted email storage
  const imapFeature = {
    emoji: 'inbox_tray',
    title: '10 GB Encrypted Storage',
    description: 'Store emails securely with quantum-resistant encryption.',
    link: `${config.urls.web}/${locale}/blog/docs/best-quantum-safe-encrypted-email-service`,
    linkText: 'Learn more',
    external: false
  };
  if (featureUsage.hasImap) {
    features.using.push(imapFeature);
  } else {
    features.missing.push(imapFeature);
  }

  // Catchall - Domain-wide email catching
  const catchallFeature = {
    emoji: 'envelope_with_arrow',
    title: 'Catch-all Aliases',
    description: 'Receive emails sent to any address at your domain.',
    link: `${config.urls.web}/${locale}/faq#can-i-have-a-catch-all-alias`,
    linkText: 'Learn more',
    external: false
  };
  if (featureUsage.hasCatchall) {
    features.using.push(catchallFeature);
  } else {
    features.missing.push(catchallFeature);
  }

  // PGP - End-to-end encryption
  const pgpFeature = {
    emoji: 'closed_lock_with_key',
    title: 'PGP/OpenPGP Encryption',
    description: 'End-to-end encryption with Web Key Directory (WKD) support.',
    link: `${config.urls.web}/${locale}/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd`,
    linkText: 'Learn more',
    external: false
  };
  if (featureUsage.hasPgp) {
    features.using.push(pgpFeature);
  } else {
    features.missing.push(pgpFeature);
  }

  // Vacation Responder
  const vacationFeature = {
    emoji: 'beach_umbrella',
    title: 'Vacation Responder',
    description: 'Automatic out-of-office replies when you are away.',
    link: `${config.urls.web}/${locale}/my-account/domains`,
    linkText: 'Set up',
    external: false
  };
  if (featureUsage.hasVacationResponder) {
    features.using.push(vacationFeature);
  } else {
    features.missing.push(vacationFeature);
  }

  // CalDAV - Calendar sync
  const caldavFeature = {
    emoji: 'calendar',
    title: 'Calendar Sync (CalDAV)',
    description: 'Sync calendars across all your devices.',
    link: `${config.urls.web}/${locale}/faq#do-you-support-caldav`,
    linkText: 'Learn more',
    external: false
  };
  if (featureUsage.hasCalendar) {
    features.using.push(caldavFeature);
  } else {
    features.missing.push(caldavFeature);
  }

  // CardDAV - Contact sync
  const carddavFeature = {
    emoji: 'card_index',
    title: 'Contact Sync (CardDAV)',
    description: 'Sync contacts across all your devices.',
    link: `${config.urls.web}/${locale}/faq#do-you-support-carddav`,
    linkText: 'Learn more',
    external: false
  };
  if (featureUsage.hasContacts) {
    features.using.push(carddavFeature);
  } else {
    features.missing.push(carddavFeature);
  }

  // Email API
  const apiFeature = {
    emoji: 'electric_plug',
    title: 'Email API',
    description: 'Programmatic access for developers to send and manage email.',
    link: `${config.urls.web}/${locale}/email-api`,
    linkText: 'API Docs',
    external: false
  };
  if (featureUsage.hasApi) {
    features.using.push(apiFeature);
  } else {
    features.missing.push(apiFeature);
  }

  // Always show these as available features if not using
  // (they don't have specific detection)
  if (!featureUsage.hasImap) {
    // Mail client compatibility - only show if not using IMAP
    features.missing.push({
      emoji: 'iphone',
      title: 'Works with Any Mail App',
      description: 'Apple Mail, Outlook, Gmail, Thunderbird, and more.',
      link: `${config.urls.web}/${locale}/faq#do-you-support-receiving-email-with-imap`,
      linkText: 'Setup Guide',
      external: false
    });
  }

  return features;
}

async function mapper(user) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    // safeguard
    if (!user) return;

    // if the email was sent within the past 3 months
    if (
      _.isDate(user[config.userFields.featureReminderSentAt]) &&
      dayjs(user[config.userFields.featureReminderSentAt]).isAfter(
        dayjs().subtract(3, 'months')
      )
    )
      return;

    // Get all domains where user is admin
    const userDomains = await Domains.find({
      members: {
        $elemMatch: {
          user: user._id,
          group: 'admin'
        }
      }
    }).lean();

    // Get all aliases for this user
    const userAliases = await Aliases.find({
      user: user._id
    }).lean();

    // Determine feature usage
    const featureUsage = {
      // SMTP: user has a domain with SMTP enabled and verified
      hasSmtp: userDomains.some((d) => d.has_smtp && d.smtp_verified_at),

      // IMAP: user has an alias with IMAP enabled
      hasImap: userAliases.some((a) => a.has_imap),

      // Catchall: user has a domain with catchall enabled (has an alias named '*')
      hasCatchall: userDomains.some((d) => d.has_catchall),

      // PGP: user has an alias with PGP enabled
      hasPgp: userAliases.some((a) => a.has_pgp && a.public_key),

      // Vacation Responder: user has an alias with vacation responder enabled
      hasVacationResponder: userAliases.some(
        (a) => a.vacation_responder && a.vacation_responder.is_enabled
      ),

      // Calendar: check if user has any calendars (via alias with IMAP)
      // This is a proxy - if they have IMAP they can use CalDAV
      hasCalendar: false, // Will be detected via separate query if needed

      // Contacts: check if user has any contacts (via alias with IMAP)
      // This is a proxy - if they have IMAP they can use CardDAV
      hasContacts: false, // Will be detected via separate query if needed

      // API: check if any domain or alias was created via API
      hasApi:
        userDomains.some((d) => d.is_api) || userAliases.some((a) => a.is_api)
    };

    // If user is already using ALL features, we can skip sending the email
    // (they're fully utilizing their subscription)
    const allFeaturesUsed =
      featureUsage.hasSmtp &&
      featureUsage.hasImap &&
      featureUsage.hasCatchall &&
      featureUsage.hasPgp &&
      featureUsage.hasVacationResponder;

    if (allFeaturesUsed) return;

    // Build personalized feature lists
    const locale = user.locale || 'en';
    const features = buildFeatureLists(featureUsage, locale);

    // send email
    await email({
      template: 'feature-reminder',
      message: {
        to: user.email
      },
      locals: {
        user,
        features,
        // Keep legacy variables for backward compatibility
        domainExists: featureUsage.hasSmtp,
        aliasExists: featureUsage.hasImap
      }
    });

    // store that we sent this email
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.featureReminderSentAt]: new Date()
      }
    });
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    // filter for users that do not have reminders sent yet
    for await (const user of Users.find({
      $and: [
        {
          [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.isBanned]: false,
          plan: {
            $in: ['enhanced_protection', 'team']
          }
        },
        {
          $or: [
            {
              [config.userFields.featureReminderSentAt]: {
                $exists: false
              }
            },
            {
              [config.userFields.featureReminderSentAt]: {
                $lte: threeMonthsAgo
              }
            }
          ]
        }
      ]
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      // break if cancelled
      if (isCancelled) break;
      // send emails and update `feature_reminder_sent_at` date
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
