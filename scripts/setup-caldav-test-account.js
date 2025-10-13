/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Setup CalDAV Test Account
 *
 * This script creates a test account with all necessary configurations
 * to test CalDAV functionality locally, including VTODO (Tasks) support.
 *
 * Usage:
 *   node scripts/setup-caldav-test-account.js
 *
 * Optional Environment Variables (for ngrok testing):
 *   CALDAV_TEST_DOMAIN - Custom domain to use (e.g., your-ngrok-url.ngrok-free.dev)
 *   CALDAV_SERVER_URL  - Server URL to display (e.g., https://your-ngrok-url.ngrok-free.dev/)
 *
 * Example with ngrok:
 *   export CALDAV_TEST_DOMAIN=silicious-demetra-restrainingly.ngrok-free.dev
 *   export CALDAV_SERVER_URL=https://silicious-demetra-restrainingly.ngrok-free.dev/
 *   node scripts/setup-caldav-test-account.js
 *
 * The script will output:
 *   - Username (alias@domain)
 *   - Password (generated token)
 *   - CalDAV server URL
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');

const Graceful = require('@ladjs/graceful');
const Redis = require('ioredis');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Payments = require('#models/payments');
const Users = require('#models/users');
const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: []
});

graceful.listen();

(async () => {
  try {
    await setupMongoose(logger);

    const client = new Redis(config.redis, logger, config.redisMonitor);

    graceful.config.redisClients.push(client);

    console.log('🚀 Creating CalDAV test account...\n');

    // Create user with enhanced_protection plan
    const testEmail = `caldav-test-${Date.now()}@forwardemail.net`;
    const testPassword = 'Test123!@#$%';

    let user = await Users.findOne({ email: testEmail });

    if (user) {
      console.log('ℹ️  User already exists, updating plan expiration');
      // Update plan expiration to ensure it's not expired
      await Users.findByIdAndUpdate(user._id, {
        $set: {
          plan: 'enhanced_protection',
          [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
          [config.userFields.planExpiresAt]: dayjs().add(1, 'year').toDate(),
          [config.userFields.hasVerifiedEmail]: true
        }
      });
      user = await Users.findById(user._id);
    } else {
      user = await Users.create({
        email: testEmail,
        password: testPassword,
        plan: 'enhanced_protection',
        [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
        [config.userFields.planExpiresAt]: dayjs().add(1, 'year').toDate(),
        [config.userFields.hasVerifiedEmail]: true
      });
      console.log('✅ User created:', testEmail);
    }

    // Create payment to activate the plan
    const existingPayment = await Payments.findOne({
      user: user._id,
      plan: 'enhanced_protection'
    });

    if (!existingPayment) {
      await Payments.create({
        user: user._id,
        amount: 300,
        invoice_at: dayjs().startOf('day').toDate(),
        method: 'free_beta_program',
        duration: ms('30d'),
        plan: user.plan,
        kind: 'one-time'
      });
      console.log('✅ Payment record created (free_beta_program)');
    }

    // Create domain
    // Use CALDAV_TEST_DOMAIN env var if set (e.g., for ngrok testing)
    // Example: CALDAV_TEST_DOMAIN=silicious-demetra-restrainingly.ngrok-free.dev
    const testDomain =
      env.CALDAV_TEST_DOMAIN || `caldav-test-${Date.now()}.com`;

    if (env.CALDAV_TEST_DOMAIN) {
      console.log(
        `ℹ️  Using custom domain from CALDAV_TEST_DOMAIN: ${testDomain}`
      );
    }

    let domain = await Domains.findOne({ name: testDomain });

    if (domain) {
      console.log('ℹ️  Domain already exists, using existing domain');
    } else {
      domain = await Domains.create({
        name: testDomain,
        members: [{ user: user._id, group: 'admin' }],
        plan: user.plan,
        has_smtp: true,
        has_recipient_verification: true
      });

      console.log('✅ Domain created:', testDomain);
      console.log('ℹ️  DNS verification will be bypassed in development mode');
    }

    // Create alias with IMAP enabled
    const aliasName = 'test';
    const aliasEmail = `${aliasName}@${domain.name}`;

    let alias = await Aliases.findOne({
      name: aliasName,
      domain: domain._id
    });

    if (!alias) {
      alias = await Aliases.create({
        name: aliasName,
        domain: domain._id,
        user: user._id,
        recipients: [user.email],
        has_imap: true
      });
      console.log('✅ Alias created:', aliasEmail);
    }

    // Generate authentication token
    const token = await alias.createToken();
    await alias.save();

    // Use CALDAV_SERVER_URL env var if set (e.g., for ngrok testing)
    const serverUrl = env.CALDAV_SERVER_URL || 'http://localhost:5000/';

    console.log('\n' + '='.repeat(70));
    console.log('🎉 CalDAV Test Account Setup Complete!');
    console.log('='.repeat(70));
    console.log('\n📋 CONNECTION DETAILS:\n');
    console.log(`  Server URL:  ${serverUrl}`);
    console.log(`  Username:    ${aliasEmail}`);
    console.log(`  Password:    ${token}`);
    console.log('\n💡 NEXT STEPS:\n');
    console.log('  1. Start the CalDAV server:');
    console.log('     npm start caldav\n');
    console.log('  2. Configure your calendar client (see CALDAV-TESTING.md)');
    console.log('     - Thunderbird: Use TbSync add-on');
    console.log('     - Apple Mail: System Settings → Accounts → CalDAV\n');
    console.log('  3. Test VTODO (Tasks) functionality');
    console.log('     - Create a task in your calendar client');
    console.log('     - Verify sync across devices\n');
    console.log('📝 IMPORTANT NOTES:\n');
    console.log('  - This is a LOCAL test account only');
    console.log('  - SSL/TLS is disabled for local testing');
    console.log('  - Save these credentials - token cannot be retrieved later');
    console.log('  - The "Tasks" calendar supports VTODO objects\n');
    console.log('='.repeat(70) + '\n');

    // Save credentials to file for easy reference
    const credentials = {
      serverUrl,
      username: aliasEmail,
      password: token,
      createdAt: new Date().toISOString()
    };

    const fs = require('node:fs');
    const path = require('node:path');
    const credentialsFile = path.join(
      __dirname,
      '..',
      '.caldav-test-credentials.json'
    );

    fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
    console.log(`💾 Credentials saved to: ${credentialsFile}`);
    console.log('   (This file is git-ignored)\n');

    await client.quit();
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();
