/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * E2E tests for IMAP ALERT (RFC 3501 Section 7.1) functionality.
 *
 * These tests verify that the server sends `* OK [ALERT] ...` untagged
 * responses for user/account/domain diagnostics (quota warnings, payment
 * grace period, SMTP not enabled) and that they are properly rate-limited.
 */

const net = require('node:net');
const { setTimeout } = require('node:timers/promises');

const Axe = require('axe');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const { ImapFlow } = require('imapflow');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const Aliases = require('#models/aliases');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getDatabase = require('#helpers/get-database');
const { encrypt } = require('#helpers/encrypt-decrypt');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const semaphore = new Semaphore(2);
const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

/**
 * Helper: Create a full IMAP test environment with custom domain/alias/user state.
 * Returns { imap, port, secure, alias, domain, user, pass, client, wsp, session, cleanup }
 */
async function createTestEnv(
  t,
  { domainState = {}, aliasState = {}, userState = {}, paymentState = {} } = {}
) {
  const secure = false;
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();

  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  await sqlite.listen(sqlitePort);

  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();

  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    secure
  );
  await imap.listen(port);

  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      ...userState
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
      kind: 'one-time',
      ...paymentState
    })
    .create();

  await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: imap.resolver,
      has_smtp: true,
      ...domainState
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true,
      ...aliasState
    })
    .create();

  const pass = await alias.createToken();

  const session = {
    remoteAddress: IP_ADDRESS,
    user: {
      id: alias.id,
      username: `${alias.name}@${domain.name}`,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: `${alias.name}@${domain.name}`
    }
  };

  await wsp.request({ action: 'setup', session }, 0);
  await alias.save();

  // Spoof DNS records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true
    )
  );
  await imap.resolver.options.cache.mset(map);

  // Create the database
  await getDatabase(imap, alias, session);

  return {
    imap,
    port,
    secure,
    alias,
    domain,
    user,
    pass,
    client: t.context.client,
    wsp,
    session,
    async cleanup() {
      await imap.close();
    }
  };
}

/**
 * Helper: Connect to IMAP using a raw TCP socket and capture all server lines.
 * This is necessary because ImapFlow does not expose untagged `* OK [ALERT]`
 * responses through any event or property — they are only visible in raw protocol.
 *
 * @returns {{ lines, connect, login, disconnect, getAlertLines }}
 */
function createRawImapClient(host, port) {
  const lines = [];
  let socket = null;
  let buffer = '';
  let checkInterval = null;

  function processBuffer() {
    const parts = buffer.split('\r\n');
    // Keep the last incomplete part in the buffer
    buffer = parts.pop();
    for (const line of parts) {
      if (line) lines.push(line);
    }
  }

  return {
    lines,
    connect() {
      return new Promise((resolve, reject) => {
        socket = net.createConnection({ host, port }, () => {
          const onData = (chunk) => {
            buffer += chunk.toString();
            processBuffer();
            // Greeting received
            if (
              lines.some(
                (l) => l.startsWith('* OK') || l.startsWith('* PREAUTH')
              )
            ) {
              resolve();
            }
          };

          socket.on('data', onData);
        });
        socket.on('error', reject);
      });
    },
    sendCommand(tag, command) {
      return new Promise((resolve) => {
        if (!socket) {
          resolve();
          return;
        }

        const onData = (chunk) => {
          buffer += chunk.toString();
          processBuffer();
        };

        socket.on('data', onData);
        socket.write(`${tag} ${command}\r\n`);

        // Timeout after 10s
        const timeout = global.setTimeout(() => {
          if (checkInterval) clearInterval(checkInterval);
          if (socket) socket.removeListener('data', onData);
          resolve();
        }, 10_000);

        checkInterval = setInterval(() => {
          if (
            lines.some(
              (l) =>
                l.startsWith(`${tag} OK`) ||
                l.startsWith(`${tag} NO`) ||
                l.startsWith(`${tag} BAD`)
            )
          ) {
            clearInterval(checkInterval);
            checkInterval = null;
            clearTimeout(timeout);
            if (socket) socket.removeListener('data', onData);
            resolve();
          }
        }, 50);
      });
    },
    async login(user, pass) {
      await this.sendCommand('A001', `LOGIN ${user} ${pass}`);
    },
    async getQuota() {
      await this.sendCommand('A002', 'GETQUOTA ""');
    },
    async logout() {
      await this.sendCommand('A003', 'LOGOUT');
    },
    disconnect() {
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }

      if (socket) {
        socket.destroy();
        socket = null;
      }
    },
    getAlertLines() {
      return lines.filter((l) => l.includes('[ALERT]'));
    }
  };
}

test.beforeEach(async (t) => {
  t.context.permit = await semaphore.acquire();
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
});

test.afterEach((t) => {
  t.context.permit.release();
});

//
// ─── SMTP NOT ENABLED ALERT ──────────────────────────────────────────────────
//

test('sends IMAP ALERT when domain has SMTP not enabled', async (t) => {
  const env = await createTestEnv(t, {
    domainState: { has_smtp: false }
  });

  try {
    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);

    // Wait a moment for async alerts to be sent
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.true(
      alertLines.length > 0,
      'Should receive at least one ALERT when SMTP is not enabled'
    );
    t.true(
      alertLines.some((l) => l.includes('SMTP') || l.includes('smtp')),
      'ALERT should mention SMTP'
    );

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

test('SMTP not enabled ALERT is rate-limited (not sent twice)', async (t) => {
  const env = await createTestEnv(t, {
    domainState: { has_smtp: false }
  });

  try {
    // First connection — should get alert
    const raw1 = createRawImapClient(IP_ADDRESS, env.port);
    await raw1.connect();
    await raw1.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);
    const alerts1 = raw1.getAlertLines();
    t.true(alerts1.length > 0, 'First connection should get SMTP ALERT');
    await raw1.logout();
    raw1.disconnect();

    // Second connection — should NOT get alert (rate-limited)
    const raw2 = createRawImapClient(IP_ADDRESS, env.port);
    await raw2.connect();
    await raw2.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);
    const alerts2 = raw2.getAlertLines();
    t.is(
      alerts2.filter((l) => l.includes('SMTP') || l.includes('smtp')).length,
      0,
      'Second connection should NOT get SMTP ALERT (rate-limited)'
    );
    await raw2.logout();
    raw2.disconnect();
  } finally {
    await env.cleanup();
  }
});

//
// ─── PAYMENT GRACE PERIOD ALERT ──────────────────────────────────────────────
//

test('sends IMAP ALERT when account is in payment grace period', async (t) => {
  // The pre-save hook recalculates plan_expires_at = plan_set_at + sum(payment durations).
  // With a 30d payment (mapped to 1 month), setting plan_set_at to 40 days ago
  // yields plan_expires_at ~10 days ago (expired, within 15-day grace period).
  const env = await createTestEnv(t, {
    userState: {
      [config.userFields.planSetAt]: dayjs().subtract(40, 'day').toDate()
    },
    paymentState: {
      invoice_at: dayjs().subtract(40, 'day').toDate(),
      duration: ms('30d')
    }
  });

  try {
    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.true(
      alertLines.length > 0,
      'Should receive ALERT when payment is in grace period'
    );
    t.true(
      alertLines.some(
        (l) =>
          l.includes('payment') ||
          l.includes('past due') ||
          l.includes('billing')
      ),
      'ALERT should mention payment/billing'
    );

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

//
// ─── QUOTA WARNING ALERT ─────────────────────────────────────────────────────
//

test('sends IMAP ALERT when storage quota exceeds 80%', async (t) => {
  const env = await createTestEnv(t);

  try {
    // Artificially set storage_used to 85% of maxQuotaPerAlias
    const highUsage = Math.floor(config.maxQuotaPerAlias * 0.85);
    await Aliases.updateOne(
      { _id: env.alias._id },
      { $set: { storage_used: highUsage } }
    );

    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.true(
      alertLines.length > 0,
      'Should receive ALERT when quota exceeds 80%'
    );
    t.true(
      alertLines.some((l) => l.includes('85%') || l.includes('mailbox')),
      'ALERT should mention quota percentage'
    );

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

test('sends critical IMAP ALERT when storage quota exceeds 95%', async (t) => {
  const env = await createTestEnv(t);

  try {
    // Artificially set storage_used to 97% of maxQuotaPerAlias
    const criticalUsage = Math.floor(config.maxQuotaPerAlias * 0.97);
    await Aliases.updateOne(
      { _id: env.alias._id },
      { $set: { storage_used: criticalUsage } }
    );

    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.true(
      alertLines.length > 0,
      'Should receive ALERT when quota exceeds 95%'
    );
    t.true(
      alertLines.some((l) => l.includes('URGENT') || l.includes('97%')),
      'Critical ALERT should mention URGENT or high percentage'
    );

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

//
// ─── NO ALERT FOR NORMAL STATE ───────────────────────────────────────────────
//

test('does NOT send IMAP ALERT when account is in good standing', async (t) => {
  // Default state: has_smtp: true, valid payment, low quota usage
  const env = await createTestEnv(t);

  try {
    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.is(
      alertLines.length,
      0,
      'Should NOT receive any ALERT when account is in good standing'
    );

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

//
// ─── MULTIPLE ALERTS ─────────────────────────────────────────────────────────
//

test('sends multiple IMAP ALERTs when multiple issues exist', async (t) => {
  // Domain has no SMTP AND user is in grace period
  // (planSetAt 40 days ago + 30d payment = expired ~10 days ago, within grace)
  const env = await createTestEnv(t, {
    domainState: { has_smtp: false },
    userState: {
      [config.userFields.planSetAt]: dayjs().subtract(40, 'day').toDate()
    },
    paymentState: {
      invoice_at: dayjs().subtract(40, 'day').toDate(),
      duration: ms('30d')
    }
  });

  try {
    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.true(
      alertLines.length >= 2,
      'Should receive multiple ALERTs when multiple issues exist'
    );

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

//
// ─── PROTOCOL COMPLIANCE ─────────────────────────────────────────────────────
//

test('IMAP ALERT format is RFC 3501 compliant', async (t) => {
  const env = await createTestEnv(t, {
    domainState: { has_smtp: false }
  });

  try {
    const raw = createRawImapClient(IP_ADDRESS, env.port);
    await raw.connect();
    await raw.login(`${env.alias.name}@${env.domain.name}`, env.pass);
    await setTimeout(500);

    const alertLines = raw.getAlertLines();
    t.true(alertLines.length > 0, 'Should have at least one ALERT');

    // RFC 3501: ALERT must be in format `* OK [ALERT] <human-readable text>`
    for (const line of alertLines) {
      t.regex(
        line,
        /^\* OK \[ALERT] .+$/,
        'ALERT line must match RFC 3501 format: * OK [ALERT] <text>'
      );
    }

    await raw.logout();
    raw.disconnect();
  } finally {
    await env.cleanup();
  }
});

test('IMAP ALERT does not interfere with normal IMAP operations', async (t) => {
  const env = await createTestEnv(t, {
    domainState: { has_smtp: false }
  });

  try {
    // Use ImapFlow (high-level client) to verify normal operations work
    const imapFlow = new ImapFlow({
      host: IP_ADDRESS,
      port: env.port,
      secure: env.secure,
      logger,
      tls,
      auth: {
        user: `${env.alias.name}@${env.domain.name}`,
        pass: env.pass
      },
      commandTimeout: 30_000
    });

    // Connect should succeed despite ALERT being sent
    await imapFlow.connect();

    // Normal operations should work
    const lock = await imapFlow.getMailboxLock('INBOX');
    try {
      const status = await imapFlow.status('INBOX', { messages: true });
      t.is(typeof status.messages, 'number');
    } finally {
      lock.release();
    }

    await imapFlow.logout();
  } finally {
    await env.cleanup();
  }
});
