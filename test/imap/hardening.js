/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Input limits of the IMAP server (helpers/harden-imap-core.js), exercised
// over a raw socket against a real IMAP server.
//

const net = require('node:net');
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pTimeout = require('p-timeout');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { MAX_LINE_LENGTH } = require('#helpers/harden-imap-core');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(await getPort());
  const wsp = createWebSocketAsPromised({
    port: sqlite.server.address().port
  });
  await wsp.open();
  t.context.wsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.port = await getPort();
  await imap.listen(t.context.port);
  t.context.imap = imap;

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
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: imap.resolver,
      has_smtp: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  t.context.username = `${alias.name}@${domain.name}`;
  t.context.pass = await alias.createToken();
  await alias.save();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await imap.resolver.options.cache.mset(map);
});

test.afterEach.always(async (t) => {
  for (const closable of [t.context.imap, t.context.wsp, t.context.sqlite]) {
    try {
      if (closable) await closable.close();
    } catch {}
  }

  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

//
// A raw IMAP connection: `write` sends bytes, `until(re)` waits for the
// accumulated server output to match, `closed` resolves on disconnect.
//
async function connect(t) {
  const socket = net.connect(t.context.port, IP_ADDRESS);
  const connection = {
    socket,
    output: '',
    closed: new Promise((resolve) => {
      socket.once('close', resolve);
    }),
    write(data) {
      socket.write(data);
    },
    async until(re, timeout = ms('10s')) {
      try {
        await pWaitFor(() => re.test(connection.output), { timeout });
      } catch (err) {
        err.message += ` waiting for ${re} in ${JSON.stringify(
          connection.output.slice(-500)
        )}`;
        throw err;
      }
    }
  };
  socket.on('data', (chunk) => {
    connection.output += chunk.toString('binary');
  });
  socket.on('error', () => {});
  t.teardown(() => socket.destroy());
  await connection.until(/^\* OK/m);
  return connection;
}

test('refuses literals before authentication, except for LOGIN', async (t) => {
  const connection = await connect(t);

  // APPEND is not even valid before login, but its literal used to be
  // accepted and buffered first
  connection.write('a APPEND INBOX {50000000}\r\n');
  await connection.until(/^a NO Literals are not accepted/m);
  t.false(connection.output.includes('+ Go ahead'));

  connection.write('b SEARCH TEXT {3}\r\n');
  await connection.until(/^b NO Literals are not accepted/m);
  t.false(connection.output.includes('+ Go ahead'));

  // LOGIN with literals still works
  const { username, pass } = t.context;
  connection.write(`c LOGIN {${username.length}}\r\n`);
  await connection.until(/^\+ /m);
  connection.write(`${username} {${pass.length}}\r\n`);
  await connection.until(/(?:^\+ [\s\S]*){2}/m);
  connection.write(`${pass}\r\n`);
  await connection.until(/^c OK/m);
  t.pass();
});

test('limits the number of literals in a command before authentication', async (t) => {
  const connection = await connect(t);
  connection.write('a LOGIN {1}\r\n');
  for (let i = 0; i < 4; i++) {
    await connection.until(new RegExp(`(?:^\\+ [\\s\\S]*){${i + 1}}`, 'm'));
    connection.write('x {1}\r\n');
  }

  await connection.until(/^a NO Too many literals/m);
  t.pass();
});

test('disconnects a client that sends an endless command line', async (t) => {
  const connection = await connect(t);
  const chunk = 'a'.repeat(64 * 1024);
  for (let sent = 0; sent <= MAX_LINE_LENGTH; sent += chunk.length)
    connection.write(chunk);

  await connection.closed;
  t.regex(connection.output, /\* BYE Line too long/);
});

test('bounds a COMPRESS=DEFLATE bomb by the same line limit', async (t) => {
  const connection = await connect(t);
  const { username, pass } = t.context;
  connection.write(`a LOGIN "${username}" "${pass}"\r\n`);
  await connection.until(/^a OK/m);
  connection.write('b COMPRESS DEFLATE\r\n');
  await connection.until(/^b OK/m);

  // 64 MB of the same byte deflates to about 64 KB
  const deflate = zlib.createDeflateRaw();
  deflate.on('data', (data) => connection.socket.write(data));
  const block = Buffer.alloc(1024 * 1024, 'a');
  for (let i = 0; i < 64; i++) deflate.write(block);
  deflate.flush();

  // disconnected long before 64 MB could pile up in one line
  await pTimeout(connection.closed, ms('10s'));

  // and the server keeps serving other clients
  const next = await connect(t);
  next.write('a CAPABILITY\r\n');
  await next.until(/^a OK/m);
  t.pass();
});
