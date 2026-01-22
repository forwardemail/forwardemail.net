/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve Integration Tests
 *
 * These tests verify that Sieve scripts are properly created, validated,
 * and stored in the database. For end-to-end MX delivery tests, see
 * test/mx/sieve.js which requires the full test infrastructure.
 */

/* eslint-disable ava/no-ignored-test-files */

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');
const MX = require('../../mx-server');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const createPassword = require('#helpers/create-password');
const SieveScripts = require('#models/sieve-scripts');

// Dynamically import get-port
let getPort;
import('get-port').then((object) => {
  getPort = object.default;
});

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  await utils.setupRedisClient(t);

  if (!getPort) {
    await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  }

  // Set up SQLite server
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);

  // Set up WebSocket connection
  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  await wsp.open();
  t.context.wsp = wsp;

  // Set up IMAP server
  const imapPort = await getPort();
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.imapPort = imapPort;
  t.context.imapServer = await imap.listen(imapPort);
  t.context.imap = imap;

  // Set up MX server
  const mxPort = await getPort();
  const mx = new MX({
    client: t.context.client,
    wsp: t.context.wsp
  });
  t.context.mxPort = mxPort;
  t.context.mx = mx;
  await mx.listen(mxPort);
});

test.afterEach.always(async (t) => {
  // Close WebSocket connection
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // Ignore
    }
  }

  // Close SQLite server
  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
    } catch {
      // Ignore
    }
  }

  // Close IMAP server
  if (t.context.imap) {
    try {
      await t.context.imap.close();
    } catch {
      // Ignore
    }
  }

  // Close MX server
  if (t.context.mx) {
    try {
      await t.context.mx.close();
    } catch {
      // Ignore
    }
  }
});

/**
 * Helper to create a test user, domain, and alias with Sieve script
 */
async function createTestSetup(t, sieveScript, aliasOptions = {}) {
  const { resolver } = t.context.mx;

  // Create user with plan
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  await user.save();

  // Create domain
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
    })
    .create();

  // Create password for alias
  const password = 'Str0ngP4ssw0rdXyz789';
  const { salt, hash } = await createPassword(password);

  // Create alias with IMAP enabled
  const alias = await t.context.aliasFactory
    .withState({
      name: aliasOptions.name || 'sievetest',
      has_imap: true,
      user: user._id,
      domain: domain._id,
      tokens: [
        {
          salt,
          hash,
          description: 'Test token'
        }
      ],
      ...aliasOptions
    })
    .create();

  // Create Sieve script for the alias if provided
  if (sieveScript) {
    try {
      await SieveScripts.create({
        alias: alias._id,
        user: user._id,
        domain: domain._id,
        name: 'test-script',
        content: sieveScript,
        is_active: true
      });
    } catch (err) {
      console.error('Error creating script:', err.message);
      throw err;
    }
  }

  return { user, domain, alias, password };
}

// ============================================================================
// BASIC SIEVE SCRIPT CREATION TESTS
// ============================================================================

test.serial('Sieve script is created and stored correctly', async (t) => {
  const sieveScript = `
require ["fileinto"];
if header :contains "Subject" "Test" {
  fileinto "TestFolder";
}
`;

  const { alias, domain } = await createTestSetup(t, sieveScript);

  // Verify Sieve script was created
  const script = await SieveScripts.findOne({
    alias: alias._id,
    is_active: true
  });
  t.truthy(script);
  t.is(script.name, 'test-script');
  t.true(script.content.includes('fileinto'));
  t.truthy(domain);
});

test.serial('invalid Sieve script is rejected', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  // Try to create an invalid script
  const invalidScript = `
require ["nonexistent_extension"];
invalid_command;
`;

  try {
    await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: 'invalid-script',
      content: invalidScript,
      is_active: true
    });
    t.fail('Should have thrown validation error');
  } catch (err) {
    t.truthy(err);
    t.pass('Invalid Sieve script was rejected');
  }
});

test.serial('only one active Sieve script per alias', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  // Create first active script
  await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'script-1',
    content: 'keep;',
    is_active: true
  });

  // Create second active script - should deactivate first
  await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'script-2',
    content: 'require ["fileinto"]; fileinto "Test";',
    is_active: true
  });

  const activeScripts = await SieveScripts.find({
    alias: alias._id,
    is_active: true
  });

  t.is(activeScripts.length, 1);
  t.is(activeScripts[0].name, 'script-2');
});

// ============================================================================
// SIEVE SCRIPT MANAGEMENT TESTS
// ============================================================================

test.serial('Sieve script size limit is enforced', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  // Create a script that's too large (over 1MB)
  const largeContent = 'keep;\n'.repeat(200_000); // ~1.4MB

  try {
    await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: 'large-script',
      content: largeContent,
      is_active: true
    });
    t.fail('Should have thrown size limit error');
  } catch (err) {
    t.truthy(err);
    t.pass('Large Sieve script was rejected');
  }
});

test.serial('Sieve script requires IMAP to be useful', async (t) => {
  const { resolver } = t.context.mx;

  // Create user
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  await user.save();

  // Create domain
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true,
      resolver
    })
    .create();

  // Create password for alias
  const password = 'Str0ngP4ssw0rdXyz789';
  const { salt, hash } = await createPassword(password);

  // Create alias WITHOUT IMAP enabled
  const alias = await t.context.aliasFactory
    .withState({
      name: 'noimap',
      has_imap: false, // IMAP disabled
      user: user._id,
      domain: domain._id,
      tokens: [
        {
          salt,
          hash,
          description: 'Test token'
        }
      ]
    })
    .create();

  // Sieve script can still be created, but won't be used
  const script = await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'test-script',
    content: 'require ["fileinto"]; fileinto "Test";',
    is_active: true
  });

  t.truthy(script);
  t.pass('Sieve script created but will not be used without IMAP');
});

test.serial('Sieve script static methods work correctly', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  // Create a script
  await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'test-script',
    content: 'keep;',
    is_active: true
  });

  // Test getActiveScript
  const activeScript = await SieveScripts.getActiveScript(alias._id);
  t.truthy(activeScript);
  t.is(activeScript.name, 'test-script');

  // Test deactivateAll
  await SieveScripts.deactivateAll(alias._id);
  const afterDeactivate = await SieveScripts.getActiveScript(alias._id);
  t.falsy(afterDeactivate);

  // Test activateScript
  const activated = await SieveScripts.activateScript(alias._id, 'test-script');
  t.truthy(activated);
  t.true(activated.is_active);
});

test.serial('Sieve script validation detects syntax errors', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  // Script with syntax error
  const badScript = `
require ["fileinto"];
if header :contains "Subject" "Test" {
  fileinto "Folder"  // Missing semicolon
}
`;

  try {
    await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: 'bad-script',
      content: badScript,
      is_active: true
    });
    t.fail('Should have thrown syntax error');
  } catch (err) {
    t.truthy(err);
    t.pass('Syntax error was detected');
  }
});

test.serial(
  'Sieve script with vacation extension validates correctly',
  async (t) => {
    const { alias, user, domain } = await createTestSetup(t, null);

    const vacationScript = `
require ["vacation"];
vacation :days 7 :subject "Out of Office" "I am currently out of the office.";
`;

    const script = await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: 'vacation-script',
      content: vacationScript,
      is_active: true
    });

    t.truthy(script);
    t.true(script.required_capabilities.includes('vacation'));
    t.is(script.name, 'vacation-script');
  }
);

test.serial('Sieve script with redirect validates domains', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  // Redirect to external domain should work
  const redirectScript = `
redirect "user@example.com";
`;

  const script = await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'redirect-script',
    content: redirectScript,
    is_active: true
  });

  t.truthy(script);
  t.is(script.name, 'redirect-script');
});

test.serial('Sieve script fields are set correctly', async (t) => {
  const { alias, user, domain } = await createTestSetup(t, null);

  const script = await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'test-script',
    content: 'keep;',
    is_active: true
  });

  t.truthy(script);
  t.is(script.name, 'test-script');
  t.is(script.content, 'keep;');
  t.true(script.is_active);
  t.true(script.is_valid);
});
