/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

require('#config/env');
require('#config/mongoose');

const process = require('node:process');

const Graceful = require('@ladjs/graceful');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const { Users, Domains, Aliases } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');
const { encrypt } = require('#helpers/encrypt-decrypt');

const logger = require('#helpers/logger');

const TEST_USERS_COUNT = 3;
const DOMAINS_PER_USER = 2;
const ALIASES_PER_DOMAIN = 5;

// Email template subjects and bodies
const EMAIL_SUBJECTS = [
  () => falso.randCatchPhrase(),
  () => `Re: ${falso.randJobTitle()} Meeting`,
  () => `${falso.randCompanyName()} Newsletter`,
  () => `Action Required: ${falso.randJobDescriptor()}`,
  () => `Follow up on ${falso.randProductName()}`,
  () => `${falso.randJobTitle()} Opportunity`,
  () => `Weekly Report - ${dayjs().format('MMM YYYY')}`,
  () => `${falso.randFirstName()}'s Birthday Party`,
  () => `Travel Confirmation - ${falso.randCity()}`,
  () => `${falso.randDepartment()} Team Update`
];

const EMAIL_BODIES = [
  () => falso.randParagraph({ min: 2, max: 5 }),
  () => `Dear ${falso.randFirstName()},\n\n${falso.randParagraph()}\n\nBest regards,\n${falso.randFullName()}`,
  () => `Hi there!\n\n${falso.randQuote()}\n\n${falso.randParagraph()}\n\nCheers,\n${falso.randFirstName()}`,
  () => `Hello,\n\n${falso.randParagraph({ min: 3, max: 6 })}\n\nThanks,\n${falso.randFullName()}`,
  () => falso.randQuote(),
  () => `${falso.randParagraph()}\n\n${falso.randParagraph()}\n\n--\n${falso.randFullName()}\n${falso.randJobTitle()}\n${falso.randCompanyName()}`
];

function generateRandomEmail() {
  return {
    subject: EMAIL_SUBJECTS[Math.floor(Math.random() * EMAIL_SUBJECTS.length)](),
    body: EMAIL_BODIES[Math.floor(Math.random() * EMAIL_BODIES.length)](),
    from: {
      name: falso.randFullName(),
      email: falso.randEmail()
    },
    date: dayjs().subtract(falso.randNumber({ min: 1, max: 90 }), 'days').toDate(),
    flags: generateRandomFlags(),
    hasAttachments: Math.random() < 0.3 // 30% chance of attachments
  };
}

function generateRandomFlags() {
  const flags = [];
  if (Math.random() < 0.7) flags.push('\\Seen'); // 70% read
  if (Math.random() < 0.1) flags.push('\\Flagged'); // 10% flagged
  if (Math.random() < 0.05) flags.push('\\Draft'); // 5% draft
  return flags;
}

async function generateTestData() {
  try {
    logger.info('Starting email client test data generation...');

    // Clean up existing test data
    logger.info('Cleaning up existing test data...');
    await Users.deleteMany({ email: /test-email-client-/ });

    const testUsers = [];

    for (let i = 1; i <= TEST_USERS_COUNT; i++) {
      logger.info(`Creating test user ${i}/${TEST_USERS_COUNT}...`);

      // Create test user with proper authentication setup
      const user = new Users({
        email: `test-email-client-${i}@example.com`,
        plan: 'enhanced_protection',
        [require('#config').userFields.hasVerifiedEmail]: true,
        [require('#config').userFields.hasSetPassword]: true,
        [require('#config').userFields.planSetAt]: dayjs().startOf('day').toDate()
      });

      // Set password using passport-local-mongoose method
      await user.setPassword('testpass123');
      await user.save();

      const userDomains = [];

      for (let j = 1; j <= DOMAINS_PER_USER; j++) {
        logger.info(`Creating domain ${j}/${DOMAINS_PER_USER} for user ${i}...`);

        // Create test domain
        const domain = await Domains.create({
          name: `test-domain-${i}-${j}.example.com`,
          plan: 'enhanced_protection',
          has_txt_record: true,
          has_mx_record: true,
          has_smtp: true,
          members: [{
            user: user._id,
            group: 'admin'
          }]
        });

        const domainAliases = [];
        const usedAliasNames = new Set();

        for (let k = 1; k <= ALIASES_PER_DOMAIN; k++) {
          logger.info(`Creating alias ${k}/${ALIASES_PER_DOMAIN} for domain ${domain.name}...`);

          // Create test alias with unique name
          let aliasName;
          if (k === 1) {
            aliasName = 'admin';
          } else {
            // Generate unique alias name
            do {
              aliasName = falso.randFirstName().toLowerCase();
            } while (usedAliasNames.has(aliasName));
          }

          usedAliasNames.add(aliasName);

          // Use a different recipient to avoid recursive forwarding
          // For test purposes, we'll use the user's main email as recipient
          const alias = await Aliases.create({
            name: aliasName,
            domain: domain._id,
            user: user._id,
            recipients: [user.email], // Use user's main email to avoid recursion
            has_imap: true,
            is_enabled: true
          });

          domainAliases.push(alias);
        }

        userDomains.push({ domain, aliases: domainAliases });
      }

      // Configure email settings for the first domain/alias
      const firstDomain = userDomains[0].domain;
      const firstAlias = userDomains[0].aliases[0];

      logger.info(`Configuring email settings for user ${i}...`);
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          email_settings: {
            domain_id: firstDomain._id,
            alias_id: firstAlias._id,
            encrypted_password: encrypt('testpass123'),
            imap_host: `imap.${firstDomain.name}`,
            imap_port: 993,
            smtp_host: `smtp.${firstDomain.name}`,
            smtp_port: 465,
            updated_at: new Date()
          },
          email_client_preferences: {
            selected_alias_id: firstAlias._id,
            last_accessed_folder: 'inbox',
            preferred_page_size: 25,
            updated_at: new Date()
          }
        }
      });

      testUsers.push({
        user,
        domains: userDomains
      });
    }

    logger.info('✅ Email client test data generation completed successfully!');
    logger.info(`Created ${TEST_USERS_COUNT} test users with email client setup`);
    logger.info('Test user credentials:');

    for (let i = 1; i <= TEST_USERS_COUNT; i++) {
      logger.info(`  User ${i}: test-email-client-${i}@example.com / testpass123`);
    }

    logger.info('\n🚀 You can now test the email client at /my-account/mailbox');
    logger.info('Note: The email client will show empty inboxes since no real messages are populated yet.');

    process.exit(0);
  } catch (err) {
    logger.error('Failed to generate test data:', err);
    process.exit(1);
  }
}

// Handle graceful shutdowns
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// Start the script
(async () => {
  await setupMongoose(logger);
  await generateTestData();
})();