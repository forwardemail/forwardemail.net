/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Inbound rate limiting of the SQLite server (the `tmp` action, which the
// MX server calls for every message it accepts), through the real
// WebSocket -> SQLite server path:
//
//  - an untrusted sender is limited to 50 messages a minute per recipient
//    domain, in a fixed window that a burst does not keep extending, and
//    to 1,000 messages a day (per recipient domain and in total)
//  - a recipient mailbox takes at most 100,000 messages a day, whoever the
//    sender is
//  - a trusted sender is exempt from the burst and per-domain limits
//  - the daily counters of a message that could not be stored are given
//    back; the burst and recipient counters are not
//

const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');

const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getPathToDatabase = require('#helpers/get-path-to-database');
const parseRootDomain = require('#helpers/parse-root-domain');
const { encrypt } = require('#helpers/encrypt-decrypt');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
// an untrusted sender (a test domain is never allowlisted), and a trusted one
const SENDER_ADDRESS = '203.0.113.5';
const SENDER_HOST = 'mail.sender.example';
const SENDER = parseRootDomain(SENDER_HOST);
const TRUSTED = [...config.truthSources][0];

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;

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

  t.context.user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: sqlite.resolver,
      has_smtp: true
    })
    .create();
  t.context.domain = domain;

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.alias = await alias.save();

  t.context.session = {
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
      owner_full_email: user.email
    }
  };

  t.context.storagePath = getPathToDatabase({
    id: alias.id,
    storage_location: alias.storage_location
  });

  // creates the mailbox (and caches its handle on the server)
  await wsp.request({ action: 'setup', session: t.context.session }, 0);
  t.context.root = parseRootDomain(domain.name);
  t.context.date = new Date().toISOString().split('T')[0];
});

test.afterEach.always(async (t) => {
  try {
    await t.context.wsp?.close();
  } catch {}

  try {
    await t.context.sqlite?.close();
  } catch {}
});

function rawMessage(subject) {
  return Buffer.from(
    `
From: sender@${SENDER}
To: recipient@example.net
Subject: ${subject}
Message-ID: <${randomUUID()}@${SENDER}>
Date: ${new Date().toUTCString()}
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

${subject}
`.trim()
  );
}

// a delivery of the MX server on behalf of `hostname`
function deliver(t, { hostname = SENDER_HOST } = {}) {
  return t.context.wsp.request(
    {
      action: 'tmp',
      aliases: [
        {
          address: `${t.context.alias.name}@${t.context.domain.name}`,
          id: t.context.alias.id
        }
      ],
      remoteAddress: SENDER_ADDRESS,
      resolvedClientHostname: hostname,
      date: new Date().toISOString(),
      raw: rawMessage(randomUUID())
    },
    0
  );
}

// the refusal of a delivery is reported per recipient in the response
async function refused(t, options) {
  const address = `${t.context.alias.name}@${t.context.domain.name}`;
  const response = await deliver(t, options);
  const err = response[address];
  if (!err)
    throw new Error(
      `the delivery was not refused: ${JSON.stringify(response)}`
    );
  return err;
}

function keys(t, sender = SENDER) {
  const { date, root } = t.context;
  return {
    burst: `imap_burst_${config.env}:${sender}:${root}`,
    count: `imap_limit_count_${config.env}:${date}:${sender}`,
    size: `imap_limit_size_${config.env}:${date}:${sender}`,
    specificCount: `imap_limit_count_${config.env}:${date}:${sender}:${root}`,
    specificSize: `imap_limit_size_${config.env}:${date}:${sender}:${root}`,
    recipient: `imap_rcpt_count_${config.env}:${date}:${t.context.alias.id}`
  };
}

async function counters(t, sender) {
  const { client } = t.context;
  const result = {};
  for (const [name, key] of Object.entries(keys(t, sender)))
    result[name] = Number((await client.get(key)) || 0);
  return result;
}

function storedMessages(t) {
  const db = t.context.sqlite.databaseMap.get(t.context.alias.id);
  return db.prepare('SELECT count(*) FROM Messages').pluck().get();
}

test('an untrusted sender is limited to 50 messages a minute per domain, in a fixed window', async (t) => {
  const { client } = t.context;
  t.deepEqual(await deliver(t), {});
  t.is(storedMessages(t), 1);

  // every message counts against the window; the window is not extended
  // by the traffic that fills it
  const { burst } = keys(t);
  t.is(Number(await client.get(burst)), 1);
  const ttl = await client.pttl(burst);
  t.true(ttl > 0 && ttl <= ms('1m'), `${ttl}`);
  await setTimeout(1100);
  t.deepEqual(await deliver(t), {});
  t.is(Number(await client.get(burst)), 2);
  const later = await client.pttl(burst);
  t.true(later < ttl - 1000, `${ttl} -> ${later}`);

  // the 51st message of the window is refused
  await client.set(burst, 50, 'PX', ms('1m'));
  const err = await refused(t);
  t.is(err.responseCode, 421);
  t.regex(err.message, /burst limited to 50 messages\/min/);
  t.is(storedMessages(t), 2);

  // a trusted sender is not
  await client.set(keys(t, TRUSTED).burst, 500, 'PX', ms('1m'));
  t.deepEqual(await deliver(t, { hostname: `mail.${TRUSTED}` }), {});
  t.is(storedMessages(t), 3);
});

test('an untrusted sender is limited to 1,000 messages a day, per domain and in total', async (t) => {
  const { client } = t.context;
  const { count, specificCount } = keys(t);

  // to this domain
  await client.set(specificCount, 1000, 'PX', ms('1d'));
  let err = await refused(t);
  t.is(err.responseCode, 421);
  t.regex(err.message, /from 1001 messages to/);
  t.is(storedMessages(t), 0);

  // in total
  await client.del(specificCount);
  await client.set(count, 1000, 'PX', ms('1d'));
  err = await refused(t);
  t.is(err.responseCode, 421);
  t.regex(err.message, /from 1001 messages$/);
  t.is(storedMessages(t), 0);

  // a trusted sender is exempt from the per-domain limit
  await client.set(keys(t, TRUSTED).specificCount, 5000, 'PX', ms('1d'));
  t.deepEqual(await deliver(t, { hostname: `mail.${TRUSTED}` }), {});
  t.is(storedMessages(t), 1);
});

test('a recipient mailbox takes at most 100,000 messages a day, whoever sends them', async (t) => {
  const { client } = t.context;
  await client.set(keys(t).recipient, 100_000, 'PX', ms('1d'));

  for (const hostname of [SENDER_HOST, `mail.${TRUSTED}`]) {
    const err = await refused(t, { hostname });
    t.is(err.responseCode, 421);
    t.regex(err.message, /limited to 100000 messages\/day/);
  }

  t.is(storedMessages(t), 0);
});

test('the daily counters of a message that could not be stored are given back', async (t) => {
  const { alias, client, sqlite, storagePath } = t.context;
  t.deepEqual(await deliver(t), {});
  const before = await counters(t);
  t.is(before.count, 1);
  t.is(before.burst, 1);
  t.is(before.recipient, 1);

  // the live mailbox is not open on the server and the temporary mailbox
  // cannot be created (a directory sits at its path): the message cannot
  // be stored anywhere
  await client.publish('sqlite_auth_reset', alias.id);
  await pWaitFor(() => !sqlite.databaseMap.get(alias.id), {
    timeout: ms('10s')
  });
  const tmpPath = path.join(
    path.dirname(storagePath),
    `${alias.id}-tmp.sqlite`
  );
  fs.mkdirSync(tmpPath);
  t.teardown(() => fs.rmSync(tmpPath, { recursive: true, force: true }));
  const err = await refused(t);
  t.is(err.code, 'SQLITE_CANTOPEN');

  // (the counters were incremented before the attempt: what the message
  //  would have consumed is returned, the burst window and the recipient's
  //  daily count keep counting the attempt)
  const after = await counters(t);
  t.is(after.count, before.count);
  t.is(after.size, before.size);
  t.is(after.specificCount, before.specificCount);
  t.is(after.specificSize, before.specificSize);
  t.is(after.burst, before.burst + 1);
  t.is(after.recipient, before.recipient + 1);
});
