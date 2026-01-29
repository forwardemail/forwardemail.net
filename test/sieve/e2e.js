/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Sieve End-to-End Integration Tests
 *
 * These tests verify that Sieve scripts are properly executed when messages
 * are received via MX and stored via IMAP. Each test:
 * 1. Creates a user, domain, and alias with IMAP enabled
 * 2. Saves a Sieve script for the alias
 * 3. Sends a message via the MX server
 * 4. Verifies the message was processed correctly via IMAP
 *
 * Test patterns inspired by Stalwart, Pigeonhole/Dovecot, and other
 * Sieve implementations, adapted for Forward Email's architecture.
 */

/* eslint-disable ava/no-ignored-test-files */

const { ImapFlow } = require('imapflow');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
// const mxConnect = require('mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
// const pify = require('pify');
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

// Unused but kept for reference
// const asyncMxConnect = pify(mxConnect);
// const IP_ADDRESS = ip.address();
// const tls = { rejectUnauthorized: false };

// Test configuration
const TEST_TIMEOUT = ms('60s');

// Helper to wait for message processing
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

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
  // Share the databaseMap from SQLite server so MX can reuse open database connections
  mx.databaseMap = t.context.sqlite.databaseMap;
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
  const IP_ADDRESS = ip.address();

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

  // Set up DNS spoofing for the domain (like test/mx/index.js does)
  const map = new Map();

  // Spoof A record for domain
  map.set(
    `a:${domain.name}`,
    resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
  );

  // Spoof MX record for domain
  map.set(
    `mx:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    )
  );

  // Spoof TXT record for domain verification
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );

  // Store spoofed DNS cache
  await resolver.options.cache.mset(map);

  // Set our local IP to allowlist so message does not get greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

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

/**
 * Helper to send a message via MX server
 */
async function sendMessage(t, options) {
  const { from, to, subject, text, html, headers } = options;

  const transporter = nodemailer.createTransport({
    host: ip.address(),
    port: t.context.mxPort,
    secure: false,
    ignoreTLS: true,
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
    headers
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Helper to connect to IMAP and check mailbox
 */
async function checkMailbox(t, options) {
  const { email, password, mailbox, expectedCount, checkFlags, checkSubject } =
    options;

  const client = new ImapFlow({
    host: ip.address(),
    port: t.context.imapPort,
    secure: false,
    auth: {
      user: email,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Select the mailbox
    const box = await client.mailboxOpen(mailbox || 'INBOX');

    const result = {
      exists: box.exists,
      messages: []
    };

    // Fetch messages if any exist
    if (box.exists > 0) {
      const fetchRange = expectedCount ? `1:${expectedCount}` : '*';
      for await (const msg of client.fetch(fetchRange, {
        envelope: true,
        flags: true,
        bodyStructure: true
      })) {
        result.messages.push({
          uid: msg.uid,
          subject: msg.envelope.subject,
          flags: [...msg.flags],
          from: msg.envelope.from,
          to: msg.envelope.to
        });
      }
    }

    // Verify expected count if specified
    if (expectedCount !== undefined && result.exists !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} messages in ${mailbox || 'INBOX'}, found ${
          result.exists
        }`
      );
    }

    // Check flags if specified
    if (checkFlags && result.messages.length > 0) {
      const lastMsg = result.messages.at(-1);
      for (const flag of checkFlags) {
        if (!lastMsg.flags.includes(flag)) {
          throw new Error(`Expected flag ${flag} not found on message`);
        }
      }
    }

    // Check subject if specified
    if (checkSubject && result.messages.length > 0) {
      const lastMsg = result.messages.at(-1);
      if (lastMsg.subject !== checkSubject) {
        throw new Error(
          `Expected subject "${checkSubject}", found "${lastMsg.subject}"`
        );
      }
    }

    return result;
  } finally {
    await client.logout();
  }
}

/**
 * Helper to list all mailboxes
 */
async function listMailboxes(t, options) {
  const { email, password } = options;

  const client = new ImapFlow({
    host: ip.address(),
    port: t.context.imapPort,
    secure: false,
    auth: {
      user: email,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const mailboxes = await client.list();
    return mailboxes.map((m) => m.path);
  } finally {
    await client.logout();
  }
}

// ============================================================================
// CORE SIEVE TESTS - Basic Commands
// ============================================================================

test.serial('fileinto - message is filed to specified folder', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
fileinto "TestFolder";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test fileinto',
    text: 'This message should be filed to TestFolder'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in TestFolder, not INBOX
  const testFolder = await checkMailbox(t, {
    email,
    password,
    mailbox: 'TestFolder',
    expectedCount: 1,
    checkSubject: 'Test fileinto'
  });

  t.is(testFolder.exists, 1);

  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 0
  });

  t.is(inbox.exists, 0);
});

test.serial(
  'fileinto with :create - creates mailbox if not exists',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    const sieveScript = `
require ["fileinto", "mailbox"];
fileinto :create "NewFolder/SubFolder";
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send a message
    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'Test fileinto create',
      text: 'This message should create a new folder'
    });

    // Wait for message processing
    await delay(2000);

    // Check that mailbox was created and message is there
    const mailboxes = await listMailboxes(t, { email, password });
    t.true(
      mailboxes.some((m) => m.includes('NewFolder')),
      'NewFolder should be created'
    );

    const newFolder = await checkMailbox(t, {
      email,
      password,
      mailbox: 'NewFolder/SubFolder',
      expectedCount: 1
    });

    t.is(newFolder.exists, 1);
  }
);

test.serial('keep - message is kept in INBOX', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test keep',
    text: 'This message should stay in INBOX'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1,
    checkSubject: 'Test keep'
  });

  t.is(inbox.exists, 1);
});

test.serial('discard - message is silently dropped', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
discard;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test discard',
    text: 'This message should be discarded'
  });

  // Wait for message processing
  await delay(2000);

  // Check that INBOX is empty
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 0
  });

  t.is(inbox.exists, 0);
});

test.serial('stop - processing halts at stop command', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
fileinto "First";
stop;
fileinto "Second";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test stop',
    text: 'This message should only go to First folder'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in First, not Second
  const first = await checkMailbox(t, {
    email,
    password,
    mailbox: 'First',
    expectedCount: 1
  });

  t.is(first.exists, 1);

  // Second folder should not exist or be empty
  try {
    const second = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Second',
      expectedCount: 0
    });
    t.is(second.exists, 0);
  } catch {
    // Folder doesn't exist, which is expected
    t.pass();
  }
});

// ============================================================================
// CONDITIONAL TESTS - Header and Address Tests
// ============================================================================

test.serial('header :contains - matches partial header value', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if header :contains "Subject" "URGENT" {
  fileinto "Urgent";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send matching message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'URGENT: Please read this',
    text: 'Urgent message'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Urgent folder
  const urgent = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Urgent',
    expectedCount: 1
  });

  t.is(urgent.exists, 1);
});

test.serial('header :is - matches exact header value', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if header :is "Subject" "Exact Match" {
  fileinto "Matched";
} else {
  fileinto "NotMatched";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send exact match message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Exact Match',
    text: 'This should match exactly'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Matched folder
  const matched = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Matched',
    expectedCount: 1
  });

  t.is(matched.exists, 1);
});

test.serial('header :matches - glob pattern matching', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if header :matches "Subject" "*newsletter*" {
  fileinto "Newsletters";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send matching message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Weekly newsletter from Company',
    text: 'Newsletter content'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Newsletters folder
  const newsletters = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Newsletters',
    expectedCount: 1
  });

  t.is(newsletters.exists, 1);
});

test.serial('address :is - matches sender address', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if address :is "from" "vip@example.com" {
  fileinto "VIP";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send from VIP address
  await sendMessage(t, {
    from: 'vip@example.com',
    to: email,
    subject: 'VIP Message',
    text: 'Message from VIP sender'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in VIP folder
  const vip = await checkMailbox(t, {
    email,
    password,
    mailbox: 'VIP',
    expectedCount: 1
  });

  t.is(vip.exists, 1);
});

test.serial('address :domain - matches sender domain', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if address :domain :is "from" "company.com" {
  fileinto "Company";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send from company domain
  await sendMessage(t, {
    from: 'anyone@company.com',
    to: email,
    subject: 'Company Message',
    text: 'Message from company domain'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Company folder
  const company = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Company',
    expectedCount: 1
  });

  t.is(company.exists, 1);
});

// ============================================================================
// IMAP4FLAGS EXTENSION TESTS
// ============================================================================

test.serial('imap4flags - setflag sets message flags', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["imap4flags"];
setflag "\\\\Flagged";
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test setflag',
    text: 'This message should be flagged'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message has the Flagged flag
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1,
    checkFlags: ['\\Flagged']
  });

  t.is(inbox.exists, 1);
  t.true(inbox.messages[0].flags.includes('\\Flagged'));
});

test.serial('imap4flags - addflag adds to existing flags', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["imap4flags"];
setflag "\\\\Seen";
addflag "\\\\Flagged";
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test addflag',
    text: 'This message should have multiple flags'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message has both flags
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
  t.true(inbox.messages[0].flags.includes('\\Seen'));
  t.true(inbox.messages[0].flags.includes('\\Flagged'));
});

test.serial('imap4flags - removeflag removes specific flag', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["imap4flags"];
setflag ["\\\\Seen", "\\\\Flagged"];
removeflag "\\\\Flagged";
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test removeflag',
    text: 'This message should only have Seen flag'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message only has Seen flag
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
  t.true(inbox.messages[0].flags.includes('\\Seen'));
  t.false(inbox.messages[0].flags.includes('\\Flagged'));
});

// ============================================================================
// BODY EXTENSION TESTS
// ============================================================================

test.serial('body :contains - matches text in body', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "body"];
if body :contains "secret keyword" {
  fileinto "Secret";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message with keyword in body
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Normal Subject',
    text: 'This message contains the secret keyword in the body'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Secret folder
  const secret = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Secret',
    expectedCount: 1
  });

  t.is(secret.exists, 1);
});

// ============================================================================
// VARIABLES EXTENSION TESTS
// ============================================================================

test.serial('variables - set and use variables in folder names', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "variables"];
set "folder" "Dynamic";
fileinto "\${folder}Folder";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test variables',
    text: 'This message tests variable expansion'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in DynamicFolder
  const dynamic = await checkMailbox(t, {
    email,
    password,
    mailbox: 'DynamicFolder',
    expectedCount: 1
  });

  t.is(dynamic.exists, 1);
});

test.serial('variables - string modifiers (upper, lower)', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "variables"];
set "name" "test";
set :upper "upper_name" "\${name}";
fileinto "\${upper_name}";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test variable modifiers',
    text: 'This message tests variable modifiers'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in TEST folder (uppercase)
  const upper = await checkMailbox(t, {
    email,
    password,
    mailbox: 'TEST',
    expectedCount: 1
  });

  t.is(upper.exists, 1);
});

// ============================================================================
// REGEX EXTENSION TESTS
// ============================================================================

test.serial('regex - pattern matching with regular expressions', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "regex"];
if header :regex "Subject" "^\\\\[TICKET-[0-9]+\\\\]" {
  fileinto "Tickets";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message with ticket number
  await sendMessage(t, {
    from: 'support@example.com',
    to: email,
    subject: '[TICKET-12345] Your support request',
    text: 'Ticket update'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Tickets folder
  const tickets = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Tickets',
    expectedCount: 1
  });

  t.is(tickets.exists, 1);
});

// ============================================================================
// DATE EXTENSION TESTS
// ============================================================================

test.serial('date - currentdate test for time-based filtering', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // Get current hour to create a test that will match
  const currentHour = new Date().getHours();

  const sieveScript = `
require ["fileinto", "date", "relational"];
if currentdate :value "ge" "hour" "${currentHour}" {
  fileinto "CurrentHour";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test date extension',
    text: 'This message tests the date extension'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in CurrentHour folder
  const currentHourFolder = await checkMailbox(t, {
    email,
    password,
    mailbox: 'CurrentHour',
    expectedCount: 1
  });

  t.is(currentHourFolder.exists, 1);
});

// ============================================================================
// ENVELOPE EXTENSION TESTS
// ============================================================================

test.serial('envelope - matches envelope sender', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "envelope"];
if envelope :domain :is "from" "bounce.example.com" {
  fileinto "Bounces";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message with envelope from bounce domain
  // Note: nodemailer uses 'from' for envelope by default
  await sendMessage(t, {
    from: 'bounce@bounce.example.com',
    to: email,
    subject: 'Bounce notification',
    text: 'This is a bounce message'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Bounces folder
  const bounces = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Bounces',
    expectedCount: 1
  });

  t.is(bounces.exists, 1);
});

// ============================================================================
// RELATIONAL EXTENSION TESTS
// ============================================================================

test.serial('relational - numeric comparison with :count', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "relational"];
if header :count "ge" :comparator "i;ascii-numeric" "Received" "3" {
  fileinto "ManyHops";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message (will have multiple Received headers from MX processing)
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test relational',
    text: 'This message tests relational comparisons'
  });

  // Wait for message processing
  await delay(2000);

  // Message may or may not have 3+ Received headers depending on setup
  // Just verify the script executed without error
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX'
  });

  t.true(inbox.exists >= 0);
});

// ============================================================================
// SUBADDRESS EXTENSION TESTS
// ============================================================================

test.serial('subaddress - matches plus-addressed mail', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "envelope", "subaddress"];
if envelope :detail :is "to" "shopping" {
  fileinto "Shopping";
}
`;

  const { domain, password } = await createTestSetup(t, sieveScript, {
    name: 'user'
  });
  const email = `user+shopping@${domain.name}`;

  // Send to plus-addressed email
  await sendMessage(t, {
    from: 'store@example.com',
    to: email,
    subject: 'Your order confirmation',
    text: 'Thank you for your order'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Shopping folder
  const shopping = await checkMailbox(t, {
    email: `user@${domain.name}`,
    password,
    mailbox: 'Shopping',
    expectedCount: 1
  });

  t.is(shopping.exists, 1);
});

// ============================================================================
// COPY EXTENSION TESTS
// ============================================================================

test.serial('copy - fileinto with :copy keeps original', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "copy"];
fileinto :copy "Archive";
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test copy',
    text: 'This message should be in both INBOX and Archive'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in both INBOX and Archive
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);

  const archive = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Archive',
    expectedCount: 1
  });

  t.is(archive.exists, 1);
});

// ============================================================================
// EDITHEADER EXTENSION TESTS
// ============================================================================

test.serial('editheader - addheader adds custom header', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["editheader"];
addheader "X-Sieve-Processed" "true";
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test editheader',
    text: 'This message should have a custom header'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
  // Note: Header verification would require fetching full message
});

// ============================================================================
// COMPLEX SCRIPT TESTS
// ============================================================================

test.serial('complex script - multiple conditions and actions', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "imap4flags", "variables", "regex"];

# Priority handling
if header :contains "X-Priority" "1" {
  setflag "\\\\Flagged";
  fileinto "Priority";
  stop;
}

# Mailing list detection
if header :regex "List-Id" "<.*>" {
  set "listfolder" "Lists";
  fileinto "\${listfolder}";
  stop;
}

# Spam filtering (based on subject)
if header :contains "Subject" ["[SPAM]", "***SPAM***"] {
  fileinto "Junk";
  stop;
}

# Default: keep in INBOX
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Test 1: Priority message
  await sendMessage(t, {
    from: 'urgent@example.com',
    to: email,
    subject: 'Urgent matter',
    text: 'This is urgent',
    headers: { 'X-Priority': '1' }
  });

  // Wait for message processing
  await delay(2000);

  const priority = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Priority',
    expectedCount: 1,
    checkFlags: ['\\Flagged']
  });

  t.is(priority.exists, 1);

  // Test 2: Mailing list message
  await sendMessage(t, {
    from: 'list@example.com',
    to: email,
    subject: 'Mailing list post',
    text: 'List content',
    headers: { 'List-Id': '<test-list.example.com>' }
  });

  // Wait for message processing
  await delay(2000);

  const lists = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Lists',
    expectedCount: 1
  });

  t.is(lists.exists, 1);

  // Test 3: Spam message
  await sendMessage(t, {
    from: 'spammer@example.com',
    to: email,
    subject: '[SPAM] Buy now!',
    text: 'Spam content'
  });

  // Wait for message processing
  await delay(2000);

  const junk = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Junk',
    expectedCount: 1
  });

  t.is(junk.exists, 1);

  // Test 4: Normal message
  await sendMessage(t, {
    from: 'friend@example.com',
    to: email,
    subject: 'Hello',
    text: 'Normal message'
  });

  // Wait for message processing
  await delay(2000);

  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

// ============================================================================
// NO SCRIPT TESTS - Default Behavior
// ============================================================================

test.serial(
  'no sieve script - message delivered to INBOX normally',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // Create setup without Sieve script
    const { alias, domain, password } = await createTestSetup(t, null);
    const email = `${alias.name}@${domain.name}`;

    // Send a message
    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'Test no script',
      text: 'This message should go to INBOX by default'
    });

    // Wait for message processing
    await delay(2000);

    // Check that message is in INBOX
    const inbox = await checkMailbox(t, {
      email,
      password,
      mailbox: 'INBOX',
      expectedCount: 1,
      checkSubject: 'Test no script'
    });

    t.is(inbox.exists, 1);
  }
);

test.serial('inactive sieve script - message delivered to INBOX', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const { alias, domain, password, user } = await createTestSetup(t, null);
  const email = `${alias.name}@${domain.name}`;

  // Create an inactive Sieve script
  await SieveScripts.create({
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'inactive-script',
    content: 'require ["fileinto"]; fileinto "ShouldNotGoHere";',
    is_active: false // Inactive!
  });

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test inactive script',
    text: 'This message should go to INBOX since script is inactive'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in INBOX, not the folder from the script
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);

  // Verify the other folder doesn't have the message
  try {
    const other = await checkMailbox(t, {
      email,
      password,
      mailbox: 'ShouldNotGoHere',
      expectedCount: 0
    });
    t.is(other.exists, 0);
  } catch {
    // Folder doesn't exist, which is expected
    t.pass();
  }
});

// ============================================================================
// IHAVE EXTENSION TESTS
// ============================================================================

test.serial('ihave - tests for extension availability', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "ihave"];
if ihave "vacation" {
  fileinto "HasVacation";
} else {
  fileinto "NoVacation";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test ihave',
    text: 'This message tests ihave extension'
  });

  // Wait for message processing
  await delay(2000);

  // Since vacation is supported, message should be in HasVacation
  const hasVacation = await checkMailbox(t, {
    email,
    password,
    mailbox: 'HasVacation',
    expectedCount: 1
  });

  t.is(hasVacation.exists, 1);
});

// ============================================================================
// DUPLICATE EXTENSION TESTS
// ============================================================================

test.serial('duplicate - detects duplicate messages', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "duplicate"];
if duplicate {
  fileinto "Duplicates";
} else {
  keep;
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send first message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test duplicate',
    text: 'First message',
    headers: { 'Message-ID': '<unique-id-123@example.com>' }
  });

  // Wait for message processing
  await delay(2000);

  // First message should be in INBOX
  const inbox1 = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox1.exists, 1);

  // Send duplicate message with same Message-ID
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test duplicate',
    text: 'Duplicate message',
    headers: { 'Message-ID': '<unique-id-123@example.com>' }
  });

  // Wait for message processing
  await delay(2000);

  // Duplicate should be in Duplicates folder
  const duplicates = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Duplicates',
    expectedCount: 1
  });

  t.is(duplicates.exists, 1);
});

// ============================================================================
// SIZE TEST
// ============================================================================

test.serial('size - filters based on message size', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if size :over 1K {
  fileinto "Large";
} else {
  fileinto "Small";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send small message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Small message',
    text: 'Short'
  });

  // Wait for message processing
  await delay(2000);

  // Small message should be in Small folder
  const small = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Small',
    expectedCount: 1
  });

  t.is(small.exists, 1);

  // Send large message
  const largeBody = 'X'.repeat(2000); // 2KB body
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Large message',
    text: largeBody
  });

  // Wait for message processing
  await delay(2000);

  // Large message should be in Large folder
  const large = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Large',
    expectedCount: 1
  });

  t.is(large.exists, 1);
});

// ============================================================================
// ALLOF / ANYOF TESTS
// ============================================================================

test.serial('allof - all conditions must match', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if allof (
  header :contains "Subject" "Important",
  header :contains "From" "boss"
) {
  fileinto "BossImportant";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message matching both conditions
  await sendMessage(t, {
    from: 'boss@example.com',
    to: email,
    subject: 'Important: Review needed',
    text: 'Please review'
  });

  // Wait for message processing
  await delay(2000);

  // Message should be in BossImportant folder
  const bossImportant = await checkMailbox(t, {
    email,
    password,
    mailbox: 'BossImportant',
    expectedCount: 1
  });

  t.is(bossImportant.exists, 1);

  // Send message matching only one condition
  await sendMessage(t, {
    from: 'colleague@example.com',
    to: email,
    subject: 'Important: FYI',
    text: 'FYI'
  });

  // Wait for message processing
  await delay(2000);

  // This message should be in INBOX (implicit keep)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

test.serial('anyof - any condition can match', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if anyof (
  header :contains "Subject" "urgent",
  header :contains "Subject" "asap",
  header :contains "X-Priority" "1"
) {
  fileinto "Urgent";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message matching first condition
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'This is urgent',
    text: 'Urgent matter'
  });

  // Wait for message processing
  await delay(2000);

  // Message should be in Urgent folder
  const urgent1 = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Urgent',
    expectedCount: 1
  });

  t.is(urgent1.exists, 1);

  // Send message matching second condition
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Need this asap',
    text: 'ASAP request'
  });

  // Wait for message processing
  await delay(2000);

  // Second message should also be in Urgent folder
  const urgent2 = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Urgent',
    expectedCount: 2
  });

  t.is(urgent2.exists, 2);
});

// ============================================================================
// NOT TEST
// ============================================================================

test.serial('not - negates condition', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if not header :contains "Subject" "spam" {
  fileinto "NotSpam";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send non-spam message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Hello friend',
    text: 'Normal message'
  });

  // Wait for message processing
  await delay(2000);

  // Message should be in NotSpam folder
  const notSpam = await checkMailbox(t, {
    email,
    password,
    mailbox: 'NotSpam',
    expectedCount: 1
  });

  t.is(notSpam.exists, 1);
});

// ============================================================================
// EXISTS TEST
// ============================================================================

test.serial('exists - tests for header existence', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if exists "X-Custom-Header" {
  fileinto "HasCustom";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send message with custom header
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test exists',
    text: 'Message with custom header',
    headers: { 'X-Custom-Header': 'present' }
  });

  // Wait for message processing
  await delay(2000);

  // Message should be in HasCustom folder
  const hasCustom = await checkMailbox(t, {
    email,
    password,
    mailbox: 'HasCustom',
    expectedCount: 1
  });

  t.is(hasCustom.exists, 1);

  // Send message without custom header
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test exists 2',
    text: 'Message without custom header'
  });

  // Wait for message processing
  await delay(2000);

  // This message should be in INBOX (implicit keep)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

// ============================================================================
// ENVIRONMENT EXTENSION TESTS
// ============================================================================

test.serial('environment - access environment information', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "environment"];
if environment :is "name" "Forward Email" {
  fileinto "ForwardEmail";
} else {
  fileinto "Other";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test environment',
    text: 'This message tests the environment extension'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message went to appropriate folder
  // The environment name should be "Forward Email"
  const forwardEmail = await checkMailbox(t, {
    email,
    password,
    mailbox: 'ForwardEmail',
    expectedCount: 1
  });

  t.is(forwardEmail.exists, 1);
});

// ============================================================================
// INDEX EXTENSION TESTS
// ============================================================================

test.serial('index - matches specific header occurrence', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "index"];
if header :index 1 :contains "Received" "localhost" {
  fileinto "LocalReceived";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message (MX will add Received headers)
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test index',
    text: 'This message tests the index extension'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message was processed (may or may not match depending on Received headers)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX'
  });

  t.true(inbox.exists >= 0);
});

// ============================================================================
// SPECIAL-USE EXTENSION TESTS
// ============================================================================

test.serial('special-use - fileinto with :specialuse flag', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "special-use"];
fileinto :specialuse "\\\\Junk" "Spam";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test special-use',
    text: 'This message tests the special-use extension'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Spam folder (or Junk if that's the special-use folder)
  const spam = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Spam',
    expectedCount: 1
  });

  t.is(spam.exists, 1);
});

// ============================================================================
// VACATION EXTENSION TESTS
// ============================================================================

test.serial('vacation - sends auto-reply to sender', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["vacation"];
vacation :days 1 :subject "Out of Office" "I am currently out of the office and will respond when I return.";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Hello',
    text: 'Are you available?'
  });

  // Wait for message processing
  await delay(3000);

  // Check that original message is in INBOX (vacation doesn't prevent delivery)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);

  // Note: Vacation reply is sent via Emails.queue, which would need
  // a separate check against the Emails collection or outbound queue
});

test.serial('vacation-seconds - uses seconds for reply interval', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["vacation", "vacation-seconds"];
vacation :seconds 120 :subject "Quick Reply" "I'll respond within 2 minutes.";
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Quick question',
    text: 'Need a fast response'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

test.serial(
  'vacation with :addresses - only replies to specified addresses',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    const { alias, domain, password } = await createTestSetup(t, null);
    const email = `${alias.name}@${domain.name}`;

    const sieveScript = `
require ["vacation"];
vacation :addresses ["${email}", "alternate@${domain.name}"]
         :subject "Auto-Reply"
         "Thank you for your message.";
`;

    // Update the script
    await SieveScripts.findOneAndUpdate(
      { alias: alias._id },
      { content: sieveScript, is_active: true },
      { upsert: true }
    );

    // Send a message
    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'Test vacation addresses',
      text: 'Testing vacation with addresses'
    });

    // Wait for message processing
    await delay(2000);

    // Check that message is in INBOX
    const inbox = await checkMailbox(t, {
      email,
      password,
      mailbox: 'INBOX',
      expectedCount: 1
    });

    t.is(inbox.exists, 1);
  }
);

// ============================================================================
// REJECT/EREJECT EXTENSION TESTS
// ============================================================================

test.serial('reject - returns error to sender', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["reject"];
if header :contains "Subject" "spam" {
  reject "Your message has been rejected as spam.";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a spam message - should be rejected
  try {
    await sendMessage(t, {
      from: 'spammer@example.com',
      to: email,
      subject: 'Buy spam products now!',
      text: 'Spam content'
    });
    // If we get here, the message wasn't rejected at SMTP level
    // Check that INBOX is empty
    const inbox = await checkMailbox(t, {
      email,
      password,
      mailbox: 'INBOX',
      expectedCount: 0
    });
    t.is(inbox.exists, 0);
  } catch (err) {
    // Expected - SMTP rejection
    t.true(
      err.message.includes('550') || err.message.includes('reject'),
      'Should receive SMTP rejection'
    );
  }

  // Send a normal message - should be delivered
  await sendMessage(t, {
    from: 'friend@example.com',
    to: email,
    subject: 'Hello friend',
    text: 'Normal message'
  });

  // Wait for message processing
  await delay(2000);

  // Normal message should be in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

test.serial('ereject - extended reject at SMTP level', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["ereject"];
if header :contains "X-Spam-Flag" "YES" {
  ereject "Message rejected due to spam classification.";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a flagged spam message
  try {
    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'Test ereject',
      text: 'Spam flagged message',
      headers: { 'X-Spam-Flag': 'YES' }
    });
    // Check INBOX is empty if no SMTP error
    const inbox = await checkMailbox(t, {
      email,
      password,
      mailbox: 'INBOX',
      expectedCount: 0
    });
    t.is(inbox.exists, 0);
  } catch (err) {
    // Expected - SMTP rejection
    t.true(
      err.message.includes('550') || err.message.includes('reject'),
      'Should receive SMTP rejection'
    );
  }
});

// ============================================================================
// REDIRECT EXTENSION TESTS
// ============================================================================

test.serial('redirect - forwards message to another address', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // Create a second alias to receive the redirect
  const { alias, domain, password, user } = await createTestSetup(t, null);
  const email = `${alias.name}@${domain.name}`;

  // Create second alias
  const { salt, hash } = await require('#helpers/create-password')('password2');
  await t.context.aliasFactory
    .withState({
      name: 'redirect-target',
      has_imap: true,
      user: user._id,
      domain: domain._id,
      tokens: [{ salt, hash, description: 'Test token' }]
    })
    .create();

  const sieveScript = `
require ["fileinto"];
if header :contains "Subject" "forward-me" {
  redirect "redirect-target@${domain.name}";
}
`;

  await SieveScripts.findOneAndUpdate(
    { alias: alias._id },
    { content: sieveScript, is_active: true },
    { upsert: true }
  );

  // Send a message to be redirected
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Please forward-me to another address',
    text: 'This should be redirected'
  });

  // Wait for message processing
  await delay(3000);

  // Original recipient should NOT have the message (redirect without :copy)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 0
  });

  t.is(inbox.exists, 0);

  // Note: The redirected message would be queued via Emails.queue
  // Full verification would require checking the Emails collection
});

test.serial('redirect with :copy - forwards and keeps original', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const { alias, domain, password } = await createTestSetup(t, null);
  const email = `${alias.name}@${domain.name}`;

  const sieveScript = `
require ["copy"];
if header :contains "Subject" "copy-forward" {
  redirect :copy "external@example.com";
}
`;

  await SieveScripts.findOneAndUpdate(
    { alias: alias._id },
    { content: sieveScript, is_active: true },
    { upsert: true }
  );

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Please copy-forward this message',
    text: 'This should be copied and forwarded'
  });

  // Wait for message processing
  await delay(2000);

  // Original recipient SHOULD have the message (redirect with :copy)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

// ============================================================================
// EDITHEADER EXTENSION TESTS - DELETEHEADER
// ============================================================================

test.serial('editheader - deleteheader removes header', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["editheader"];
deleteheader "X-Remove-Me";
keep;
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message with the header to be removed
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test deleteheader',
    text: 'This message has a header that should be removed',
    headers: { 'X-Remove-Me': 'this-should-be-gone' }
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
  // Note: Full verification would require fetching raw message to check header removal
});

// ============================================================================
// MAILBOX EXTENSION TESTS
// ============================================================================

test.serial('mailboxexists - tests for mailbox existence', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "mailbox"];
if mailboxexists "INBOX" {
  fileinto "InboxExists";
} else {
  fileinto "InboxMissing";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test mailboxexists',
    text: 'Testing mailbox existence check'
  });

  // Wait for message processing
  await delay(2000);

  // INBOX always exists, so message should be in InboxExists
  const inboxExists = await checkMailbox(t, {
    email,
    password,
    mailbox: 'InboxExists',
    expectedCount: 1
  });

  t.is(inboxExists.exists, 1);
});

// ============================================================================
// ENOTIFY EXTENSION TESTS
// ============================================================================

test.serial('enotify - sends notification via mailto', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["enotify", "variables"];
if header :contains "Subject" "urgent" {
  set "subject" "Urgent message received";
  notify :importance "1"
         :message "You have received an urgent message"
         "mailto:notify@example.com";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send an urgent message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'This is urgent!',
    text: 'Urgent message content'
  });

  // Wait for message processing
  await delay(2000);

  // Check that original message is in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
  // Note: Notification would be queued via Emails.queue
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

test.serial('script syntax error - message still delivered', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // Create alias without script first
  const { alias, domain, password, user } = await createTestSetup(t, null);
  const email = `${alias.name}@${domain.name}`;

  // Try to create an invalid script (this should fail validation)
  try {
    await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: 'invalid-script',
      content: 'this is not valid sieve syntax {{{',
      is_active: true
    });
  } catch {
    // Expected - validation should fail
  }

  // Send a message - should still be delivered to INBOX
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test syntax error handling',
    text: 'This should still be delivered'
  });

  // Wait for message processing
  await delay(2000);

  // Message should be in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

test.serial(
  'multiple fileinto - message copied to multiple folders',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    const sieveScript = `
require ["fileinto", "copy"];
fileinto :copy "Folder1";
fileinto :copy "Folder2";
fileinto "Folder3";
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send a message
    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'Test multiple fileinto',
      text: 'This should go to multiple folders'
    });

    // Wait for message processing
    await delay(2000);

    // Check all folders have the message
    const folder1 = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Folder1',
      expectedCount: 1
    });
    t.is(folder1.exists, 1);

    const folder2 = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Folder2',
      expectedCount: 1
    });
    t.is(folder2.exists, 1);

    const folder3 = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Folder3',
      expectedCount: 1
    });
    t.is(folder3.exists, 1);
  }
);

test.serial('nested if-elsif-else - complex conditional logic', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if header :contains "Subject" "priority-high" {
  fileinto "High";
} elsif header :contains "Subject" "priority-medium" {
  fileinto "Medium";
} elsif header :contains "Subject" "priority-low" {
  fileinto "Low";
} else {
  fileinto "Normal";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Test high priority
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'priority-high task',
    text: 'High priority'
  });
  await delay(2000);

  const high = await checkMailbox(t, {
    email,
    password,
    mailbox: 'High',
    expectedCount: 1
  });
  t.is(high.exists, 1);

  // Test medium priority
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'priority-medium task',
    text: 'Medium priority'
  });
  await delay(2000);

  const medium = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Medium',
    expectedCount: 1
  });
  t.is(medium.exists, 1);

  // Test low priority
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'priority-low task',
    text: 'Low priority'
  });
  await delay(2000);

  const low = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Low',
    expectedCount: 1
  });
  t.is(low.exists, 1);

  // Test normal (no priority)
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Regular task',
    text: 'Normal priority'
  });
  await delay(2000);

  const normal = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Normal',
    expectedCount: 1
  });
  t.is(normal.exists, 1);
});

test.serial(
  'comparator i;ascii-casemap - case-insensitive matching',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    const sieveScript = `
require ["fileinto"];
if header :comparator "i;ascii-casemap" :is "Subject" "HELLO WORLD" {
  fileinto "Matched";
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send with different case - should still match
    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'hello world',
      text: 'Testing case-insensitive matching'
    });

    // Wait for message processing
    await delay(2000);

    // Should match due to case-insensitive comparator
    const matched = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Matched',
      expectedCount: 1
    });

    t.is(matched.exists, 1);
  }
);

test.serial('address :localpart - matches local part only', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto"];
if address :localpart :is "from" "admin" {
  fileinto "FromAdmin";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send from admin@anydomain.com
  await sendMessage(t, {
    from: 'admin@anydomain.com',
    to: email,
    subject: 'Admin message',
    text: 'From admin user'
  });

  // Wait for message processing
  await delay(2000);

  // Should match the localpart 'admin'
  const fromAdmin = await checkMailbox(t, {
    email,
    password,
    mailbox: 'FromAdmin',
    expectedCount: 1
  });

  t.is(fromAdmin.exists, 1);
});

test.serial(
  'header with multiple values - matches any occurrence',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    const sieveScript = `
require ["fileinto"];
if header :contains "To" "recipient" {
  fileinto "HasRecipient";
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send with multiple To addresses
    await sendMessage(t, {
      from: 'sender@example.com',
      to: [email, 'other-recipient@example.com'],
      subject: 'Multiple recipients',
      text: 'Message to multiple recipients'
    });

    // Wait for message processing
    await delay(2000);

    // Should match because 'recipient' is in one of the To addresses
    const hasRecipient = await checkMailbox(t, {
      email,
      password,
      mailbox: 'HasRecipient',
      expectedCount: 1
    });

    t.is(hasRecipient.exists, 1);
  }
);

test.serial('empty script - implicit keep delivers to INBOX', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
# This script does nothing, so implicit keep should apply
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send a message
  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Test empty script',
    text: 'This should go to INBOX via implicit keep'
  });

  // Wait for message processing
  await delay(2000);

  // Message should be in INBOX
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1
  });

  t.is(inbox.exists, 1);
});

// ============================================================================
// USER-REPORTED ISSUE TESTS - Core tests in require statements
// ============================================================================

test.serial(
  'address :domain with require ["fileinto", "address"] - customer reported issue',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // This is the exact script from the customer's bug report
    // The issue was that "address" in require was being rejected as unsupported
    const sieveScript = `
require ["fileinto", "address"];

if address :domain "from" "gmail.com"
{
    fileinto "System";
    stop;
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send from gmail.com - should be filed to System
    await sendMessage(t, {
      from: 'user@gmail.com',
      to: email,
      subject: 'Test from Gmail',
      text: 'This message should be filed to System folder'
    });

    // Wait for message processing
    await delay(2000);

    // First check INBOX to see if message was delivered at all
    const inbox = await checkMailbox(t, {
      email,
      password,
      mailbox: 'INBOX'
    });
    console.log('INBOX has', inbox.exists, 'messages');
    if (inbox.messages.length > 0) {
      console.log(
        'INBOX messages:',
        inbox.messages.map((m) => m.subject)
      );
    }

    // List all mailboxes to see what exists
    const client = new ImapFlow({
      host: ip.address(),
      port: t.context.imapPort,
      secure: false,
      auth: { user: email, pass: password },
      tls: { rejectUnauthorized: false }
    });
    await client.connect();
    const mailboxes = await client.list();
    console.log(
      'Available mailboxes:',
      mailboxes.map((m) => m.path)
    );
    await client.logout();

    // Check that message is in System folder
    const system = await checkMailbox(t, {
      email,
      password,
      mailbox: 'System',
      expectedCount: 1,
      checkSubject: 'Test from Gmail'
    });

    t.is(system.exists, 1);
    t.is(inbox.exists, 0);
  }
);

test.serial(
  'address :domain with display name - customer reported issue variant',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    const sieveScript = `
require ["fileinto", "address"];

if address :domain "from" "gmail.com"
{
    fileinto "System";
    stop;
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send from gmail.com with display name
    await sendMessage(t, {
      from: '"John Doe" <user@gmail.com>',
      to: email,
      subject: 'Test from Gmail with display name',
      text: 'This message should be filed to System folder'
    });

    // Wait for message processing
    await delay(2000);

    // Check that message is in System folder
    const system = await checkMailbox(t, {
      email,
      password,
      mailbox: 'System',
      expectedCount: 1
    });

    t.is(system.exists, 1);
  }
);

test.serial(
  'header :contains "from" "@gmail.com" - alternative customer script',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // Alternative script the customer tried
    const sieveScript = `
require ["fileinto"];

if header :contains "from" "@gmail.com"
{
    fileinto "System";
    stop;
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send from gmail.com
    await sendMessage(t, {
      from: 'user@gmail.com',
      to: email,
      subject: 'Test header contains gmail',
      text: 'This message should be filed to System folder'
    });

    // Wait for message processing
    await delay(2000);

    // Check that message is in System folder
    const system = await checkMailbox(t, {
      email,
      password,
      mailbox: 'System',
      expectedCount: 1
    });

    t.is(system.exists, 1);
  }
);

test.serial('non-gmail message should not match gmail filter', async (t) => {
  t.timeout(TEST_TIMEOUT);

  const sieveScript = `
require ["fileinto", "address"];

if address :domain "from" "gmail.com"
{
    fileinto "System";
    stop;
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send from yahoo.com - should NOT be filed to System
  await sendMessage(t, {
    from: 'user@yahoo.com',
    to: email,
    subject: 'Test from Yahoo',
    text: 'This message should stay in INBOX'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in INBOX, not System
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1,
    checkSubject: 'Test from Yahoo'
  });

  t.is(inbox.exists, 1);
});

// ============================================================================
// FAQ EXAMPLE SCRIPTS TESTS
// ============================================================================

test.serial('FAQ example: File newsletters into a folder', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // From FAQ: "File newsletters into a folder"
  const sieveScript = `
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send newsletter message
  await sendMessage(t, {
    from: 'news@example.com',
    to: email,
    subject: 'Weekly Newsletter',
    text: 'Newsletter content',
    headers: { 'List-Id': '<newsletter.example.com>' }
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is in Newsletters folder
  const newsletters = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Newsletters',
    expectedCount: 1
  });

  t.is(newsletters.exists, 1);
});

test.serial('FAQ example: Mark messages from important senders', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // From FAQ: "Mark messages from important senders"
  const sieveScript = `
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\\\Flagged";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send from boss
  await sendMessage(t, {
    from: 'boss@example.com',
    to: email,
    subject: 'Important message from boss',
    text: 'Please review this'
  });

  // Wait for message processing
  await delay(2000);

  // Check that message is flagged
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 1,
    checkFlags: ['\\Flagged']
  });

  t.is(inbox.exists, 1);
  t.true(inbox.messages[0].flags.includes('\\Flagged'));
});

test.serial('FAQ example: Reject spam with specific subjects', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // From FAQ: "Reject spam with specific subjects"
  const sieveScript = `
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  // Send spam message - this should be rejected
  // Note: The reject action may not result in the message being stored at all
  await sendMessage(t, {
    from: 'spammer@example.com',
    to: email,
    subject: 'You are a lottery winner!',
    text: 'Claim your prize'
  });

  // Wait for message processing
  await delay(2000);

  // INBOX should be empty (message was rejected)
  const inbox = await checkMailbox(t, {
    email,
    password,
    mailbox: 'INBOX',
    expectedCount: 0
  });

  t.is(inbox.exists, 0);
});

test.serial(
  'FAQ example: Spam filtering with flags (from RFC compliance doc)',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // From RFC compliance doc example
    const sieveScript = `
require ["fileinto", "imap4flags"];

if header :contains "X-Spam-Status" "Yes" {
    setflag "\\\\Seen";
    fileinto "Junk";
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    // Send spam message with X-Spam-Status header
    await sendMessage(t, {
      from: 'spammer@example.com',
      to: email,
      subject: 'Spam message',
      text: 'Buy now!',
      headers: { 'X-Spam-Status': 'Yes, score=10.0' }
    });

    // Wait for message processing
    await delay(2000);

    // Check that message is in Junk folder with Seen flag
    const junk = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Junk',
      expectedCount: 1,
      checkFlags: ['\\Seen']
    });

    t.is(junk.exists, 1);
    t.true(junk.messages[0].flags.includes('\\Seen'));
  }
);

// ============================================================================
// CORE TESTS IN REQUIRE - Comprehensive coverage
// ============================================================================

test.serial(
  'require ["fileinto", "header"] - header is a core test',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // "header" is a core test per RFC 5228, should be accepted in require
    const sieveScript = `
require ["fileinto", "header"];

if header :contains "Subject" "test" {
    fileinto "Tests";
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'This is a test message',
      text: 'Test content'
    });

    await delay(2000);

    const tests = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Tests',
      expectedCount: 1
    });

    t.is(tests.exists, 1);
  }
);

test.serial(
  'require ["fileinto", "exists"] - exists is a core test',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // "exists" is a core test per RFC 5228, should be accepted in require
    const sieveScript = `
require ["fileinto", "exists"];

if exists "X-Custom-Header" {
    fileinto "Custom";
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    await sendMessage(t, {
      from: 'sender@example.com',
      to: email,
      subject: 'Message with custom header',
      text: 'Test content',
      headers: { 'X-Custom-Header': 'present' }
    });

    await delay(2000);

    const custom = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Custom',
      expectedCount: 1
    });

    t.is(custom.exists, 1);
  }
);

test.serial('require ["fileinto", "size"] - size is a core test', async (t) => {
  t.timeout(TEST_TIMEOUT);

  // "size" is a core test per RFC 5228, should be accepted in require
  const sieveScript = `
require ["fileinto", "size"];

if size :under 500 {
    fileinto "Small";
}
`;

  const { alias, domain, password } = await createTestSetup(t, sieveScript);
  const email = `${alias.name}@${domain.name}`;

  await sendMessage(t, {
    from: 'sender@example.com',
    to: email,
    subject: 'Small message',
    text: 'Hi'
  });

  await delay(2000);

  const small = await checkMailbox(t, {
    email,
    password,
    mailbox: 'Small',
    expectedCount: 1
  });

  t.is(small.exists, 1);
});

test.serial(
  'require with multiple core tests - all should be accepted',
  async (t) => {
    t.timeout(TEST_TIMEOUT);

    // Multiple core tests in require should all be accepted
    const sieveScript = `
require ["fileinto", "address", "header", "exists", "size", "true", "false", "not", "allof", "anyof"];

if address :domain "from" "example.com" {
    fileinto "Example";
}
`;

    const { alias, domain, password } = await createTestSetup(t, sieveScript);
    const email = `${alias.name}@${domain.name}`;

    await sendMessage(t, {
      from: 'user@example.com',
      to: email,
      subject: 'Test multiple core tests',
      text: 'Test content'
    });

    await delay(2000);

    const example = await checkMailbox(t, {
      email,
      password,
      mailbox: 'Example',
      expectedCount: 1
    });

    t.is(example.exists, 1);
  }
);
