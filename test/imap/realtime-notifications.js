/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Changes made over IMAP (Thunderbird, Apple Mail, ...) must reach WebSocket
// and push clients (webmail, the apps) exactly once, with enough detail for
// them to apply the change: the mailbox ID and path, and the UIDs.
//

const { Buffer } = require('node:buffer');
const net = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');
const IMAP = require('../../imap-server');
const SQLite = require('../../sqlite-server');
const Mailboxes = require('#models/mailboxes');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const getDatabase = require('#helpers/get-database');
const { encrypt } = require('#helpers/encrypt-decrypt');

const IP_ADDRESS = ip.address();

// a plain IMAP connection, so each test sends the exact commands a client does
function connect(port) {
  const socket = net.connect(port, IP_ADDRESS);
  let buffer = '';
  let waiter = null;
  socket.on('data', (data) => {
    buffer += data.toString();
    if (waiter) waiter();
  });

  function read(regex) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Timed out waiting for ${regex}`)),
        ms('30s')
      );
      waiter = () => {
        const match = buffer.match(regex);
        if (!match) return;
        clearTimeout(timer);
        waiter = null;
        const end = match.index + match[0].length;
        const output = buffer.slice(0, end);
        buffer = buffer.slice(end);
        resolve(output);
      };

      waiter();
    });
  }

  let tag = 0;
  async function command(line) {
    const id = `A${++tag}`;
    socket.write(`${id} ${line}\r\n`);
    const output = await read(new RegExp(`${id} (OK|NO|BAD)[^\\r\\n]*\\r\\n`));
    if (!new RegExp(`${id} OK`).test(output))
      throw new Error(`${line}: ${output}`);
    return output;
  }

  async function append(path, raw) {
    const id = `A${++tag}`;
    socket.write(`${id} APPEND ${path} {${Buffer.byteLength(raw)}}\r\n`);
    await read(/\+[^\r\n]*\r\n/);
    socket.write(`${raw}\r\n`);
    return read(new RegExp(`${id} (OK|NO|BAD)[^\\r\\n]*\\r\\n`));
  }

  return {
    greeting: () => read(/\* OK[^\r\n]*\r\n/),
    command,
    append,
    close: () => socket.destroy()
  };
}

function rfc822(subject) {
  return [
    'From: sender@example.com',
    'To: recipient@example.com',
    `Subject: ${subject}`,
    `Message-ID: <${Date.now()}.${Math.random()}@example.com>`,
    '',
    `Body of ${subject}`
  ].join('\r\n');
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  await utils.setupRedisClient(t);
  const { default: getPort } = await import('get-port');

  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  const sqlitePort = await getPort();
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;

  // the IMAP server and the SQLite server publish through the same client
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  const port = await getPort();
  await imap.listen(port);
  t.context.imap = imap;
  t.context.port = port;

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
  const pass = await alias.createToken();
  t.context.alias = await alias.save();
  t.context.username = `${alias.name}@${domain.name}`;
  t.context.pass = pass;

  t.context.session = {
    remoteAddress: IP_ADDRESS,
    user: {
      id: alias.id,
      username: t.context.username,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: t.context.username
    }
  };
  await wsp.request({ action: 'setup', session: t.context.session }, 0);
  await getDatabase(imap, t.context.alias, t.context.session);

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

  t.context.connect = async () => {
    const connection = connect(port);
    await connection.greeting();
    await connection.command(`LOGIN "${t.context.username}" "${pass}"`);
    t.teardown(() => connection.close());
    return connection;
  };
});

test.afterEach.always(async (t) => {
  for (const close of [
    () => t.context.imap.close(),
    () => t.context.wsp.close(),
    () => t.context.sqlite.close()
  ]) {
    try {
      await close();
    } catch {}
  }

  t.context.client.disconnect();
  t.context.subscriber.disconnect();
});

// wait for what one command publishes, plus a moment for anything extra
async function settle(capture, count) {
  await pWaitFor(() => capture.events.length >= count, {
    timeout: ms('10s')
  }).catch(() => {});
  await delay(500);
}

async function getMailbox(t, path) {
  return Mailboxes.findOne(t.context.imap, t.context.session, { path });
}

test('a message deleted as Thunderbird does it is published once per change', async (t) => {
  const imap = await t.context.connect();
  for (const subject of ['one', 'two', 'three'])
    await imap.append('INBOX', rfc822(subject));
  await imap.command('SELECT INBOX');
  const inbox = await getMailbox(t, 'INBOX');

  // "delete" with "Remove it immediately": STORE \Deleted, then UID EXPUNGE
  let capture = utils.captureNotifications(
    t.context.client,
    t.context.alias.id
  );
  await imap.command('UID STORE 1 +FLAGS.SILENT (\\Deleted)');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['flagsUpdated']
  );
  t.like(capture.events[0], {
    mailbox: inbox._id.toString(),
    path: 'INBOX',
    action: 'add',
    flags: ['\\Deleted'],
    uids: [1]
  });
  capture.stop();

  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('UID EXPUNGE 1');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['messagesExpunged']
  );
  t.like(capture.events[0], {
    mailbox: inbox._id.toString(),
    path: 'INBOX',
    uids: [1]
  });
  t.is(capture.events[0].ids.length, 1);
  t.regex(capture.events[0].ids[0], /^[\da-f]{24}$/);
  capture.stop();

  // "Mark it as deleted" and leaving the folder: CLOSE expunges it
  await imap.command('UID STORE 2 +FLAGS.SILENT (\\Deleted)');
  await delay(500);
  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('CLOSE');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['messagesExpunged']
  );
  t.like(capture.events[0], { path: 'INBOX', uids: [2] });
  capture.stop();

  // "Move it to the Trash folder"
  await imap.command('SELECT INBOX');
  const trash = await getMailbox(t, 'Trash');
  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('UID MOVE 3 Trash');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['messagesMoved']
  );
  t.like(capture.events[0], {
    sourceMailbox: inbox._id.toString(),
    sourcePath: 'INBOX',
    destinationMailbox: trash._id.toString(),
    destinationPath: 'Trash',
    sourceUid: [3]
  });
  capture.stop();

  // emptying the Trash: STORE \Deleted on everything, then EXPUNGE
  await imap.command('SELECT Trash');
  await imap.command('UID STORE 1:* +FLAGS.SILENT (\\Deleted)');
  await delay(500);
  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('EXPUNGE');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['messagesExpunged']
  );
  t.like(capture.events[0], { mailbox: trash._id.toString(), path: 'Trash' });
  t.is(capture.events[0].uids.length, 1);
  capture.stop();
});

test('flag, label, copy and implicit read changes are published once', async (t) => {
  const imap = await t.context.connect();
  await imap.command('CREATE Receipts');
  for (const subject of ['one', 'two', 'three'])
    await imap.append('INBOX', rfc822(subject));
  await imap.command('SELECT INBOX');
  const receipts = await getMailbox(t, 'Receipts');

  let capture = utils.captureNotifications(
    t.context.client,
    t.context.alias.id
  );
  await imap.command('UID STORE 1 +FLAGS (\\Seen)');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['flagsUpdated']
  );
  t.like(capture.events[0], { path: 'INBOX', action: 'add', uids: [1] });
  capture.stop();

  // a keyword is a label too
  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('UID STORE 1 +FLAGS (work)');
  await settle(capture, 2);
  t.deepEqual(capture.events.map((e) => e.event).sort(), [
    'flagsUpdated',
    'labelsUpdated'
  ]);
  t.like(capture.of('labelsUpdated')[0], {
    path: 'INBOX',
    action: 'add',
    labels: ['work'],
    uids: [1]
  });
  capture.stop();

  // replacing the flags removes the label: the event says so, with the list
  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('UID STORE 1 FLAGS (\\Seen)');
  await settle(capture, 2);
  t.like(capture.of('labelsUpdated')[0], {
    action: 'set',
    labels: [],
    uids: [1]
  });
  capture.stop();

  // reading the body sets \Seen
  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('UID FETCH 2 (BODY[])');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['flagsUpdated']
  );
  t.like(capture.events[0], {
    path: 'INBOX',
    action: 'add',
    flags: ['\\Seen'],
    uids: [2]
  });
  capture.stop();

  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('UID COPY 3 Receipts');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['messagesCopied']
  );
  t.like(capture.events[0], {
    sourcePath: 'INBOX',
    destinationMailbox: receipts._id.toString(),
    destinationPath: 'Receipts',
    sourceUid: [3],
    destinationUid: [1]
  });
  capture.stop();
});

test('folder changes are published once', async (t) => {
  const imap = await t.context.connect();

  let capture = utils.captureNotifications(
    t.context.client,
    t.context.alias.id
  );
  await imap.command('CREATE Projects');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['mailboxCreated']
  );
  t.like(capture.events[0], { path: 'Projects' });
  capture.stop();

  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('RENAME Projects Work');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['mailboxRenamed']
  );
  t.like(capture.events[0], { oldPath: 'Projects', newPath: 'Work' });
  capture.stop();

  capture = utils.captureNotifications(t.context.client, t.context.alias.id);
  await imap.command('DELETE Work');
  await settle(capture, 1);
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['mailboxDeleted']
  );
  t.like(capture.events[0], { path: 'Work' });
  capture.stop();
});

test('the automatic Trash cleanup is published and expunged for IMAP clients', async (t) => {
  const imap = await t.context.connect();
  await imap.append('Trash', rfc822('old'));
  await imap.command('SELECT Trash');
  // a message marked deleted in Trash is removed by the next cleanup
  await imap.command('UID STORE 1 +FLAGS.SILENT (\\Deleted)');
  await delay(500);
  const trash = await getMailbox(t, 'Trash');

  const capture = utils.captureNotifications(
    t.context.client,
    t.context.alias.id
  );

  // run the cleanup now rather than on the next day's first open
  await t.context.client.del(`trash_check:${t.context.alias.id}`);
  await getDatabase(t.context.sqlite, t.context.alias, t.context.session);

  await settle(capture, 1);
  capture.stop();
  const expunged = capture.of('messagesExpunged');
  t.is(expunged.length, 1);
  t.like(expunged[0], {
    mailbox: trash._id.toString(),
    path: 'Trash',
    uids: [1]
  });
  t.is(expunged[0].ids.length, 1);

  // the client with Trash open is told it is gone
  const output = await imap.command('NOOP');
  t.regex(output, /\* 1 EXPUNGE/);
});

test('a deleted Trash folder that is created again is published', async (t) => {
  const imap = await t.context.connect();
  const capture = utils.captureNotifications(
    t.context.client,
    t.context.alias.id
  );
  await imap.command('DELETE Trash');
  await pWaitFor(() => capture.of('mailboxCreated').length > 0, {
    timeout: ms('10s')
  }).catch(() => {});
  await delay(500);
  capture.stop();

  t.deepEqual(
    capture.events.map((e) => e.event),
    ['mailboxDeleted', 'mailboxCreated']
  );
  const trash = await getMailbox(t, 'Trash');
  t.like(capture.events[1], { path: 'Trash', mailbox: trash._id.toString() });
});
