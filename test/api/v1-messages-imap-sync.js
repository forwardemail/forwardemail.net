/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Changes made through the REST API (webmail, apps) must reach IMAP clients
// such as Thunderbird: an IMAP client in IDLE is told right away, and a client
// that resynchronizes with CONDSTORE (CHANGEDSINCE) finds the change.
//

const { Buffer } = require('node:buffer');
const { setTimeout } = require('node:timers/promises');

const Axe = require('axe');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const { ImapFlow } = require('imapflow');

const utils = require('../utils');
const IMAP = require('../../imap-server');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const getDatabase = require('#helpers/get-database');
const { HOURLY_LIMIT } = require('#helpers/bandwidth-limiter');
const { encrypt } = require('#helpers/encrypt-decrypt');

const IP_ADDRESS = ip.address();
const logger = new Axe({ silent: true });

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);

test.beforeEach(async (t) => {
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
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
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
  await alias.save();

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  const username = `${alias.name}@${domain.name}`;
  t.context.username = username;
  t.context.pass = pass;
  t.context.auth = `Basic ${Buffer.from(`${username}:${pass}`).toString(
    'base64'
  )}`;

  // IMAP server on the same SQLite server and Redis as the API
  const { default: getPort } = await import('get-port');
  const wsp = createWebSocketAsPromised({
    port: t.context.sqlite.server.address().port
  });
  await wsp.open();
  t.context.imapWsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  const port = await getPort();
  await imap.listen(port);
  t.context.imap = imap;

  // for changes made straight to the mailbox, as an older release would have
  const session = {
    remoteAddress: IP_ADDRESS,
    user: {
      id: alias.id,
      username,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: username
    }
  };
  t.context.session = session;
  t.context.alias = alias;

  await wsp.request({ action: 'setup', session }, 0);

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port,
    secure: false,
    logger,
    tls: { rejectUnauthorized: false },
    auth: { user: username, pass },
    // IDLE is started explicitly below
    disableAutoIdle: true
  });
  await imapFlow.connect();
  t.context.imapFlow = imapFlow;
});

test.afterEach.always(async (t) => {
  if (t.context.imapFlow) {
    try {
      await t.context.imapFlow.logout();
    } catch {}
  }

  if (t.context.imap) {
    try {
      await t.context.imap.close();
    } catch {}
  }

  if (t.context.imapWsp) {
    try {
      await t.context.imapWsp.close();
    } catch {}
  }
});

test.afterEach.always(utils.teardownApiServer);

function rfc822(subject) {
  return Buffer.from(
    [
      'From: sender@example.com',
      'To: recipient@example.com',
      `Subject: ${subject}`,
      `Message-ID: <${Date.now()}.${Math.random()}@example.com>`,
      'Date: ' + new Date().toUTCString(),
      'Content-Type: text/plain; charset=utf-8',
      '',
      `Body of ${subject}`,
      ''
    ].join('\r\n')
  );
}

// append over IMAP, then look the message up in the API by its UID
async function appendMessage(t, path, subject) {
  const { uid } = await t.context.imapFlow.append(path, rfc822(subject));
  const res = await t.context.api
    .get(`/v1/messages?folder=${encodeURIComponent(path)}`)
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  const message = res.body.find((m) => m.uid === uid);
  t.truthy(message, `message ${uid} is listed by the API`);
  return { uid, id: message.id };
}

// collect untagged updates the server pushes during IDLE
function collect(imapFlow, eventName) {
  const events = [];
  const listener = (data) => events.push(data);
  imapFlow.on(eventName, listener);
  return {
    events,
    stop: () => imapFlow.off(eventName, listener)
  };
}

// IDLE runs until the next command, so it is not awaited
async function startIdle(imapFlow) {
  imapFlow.idle().catch(() => {});
  await pWaitFor(() => imapFlow.idling, { timeout: ms('5s') });
}

test('flag changes through the API reach an IMAP client in IDLE', async (t) => {
  const { imapFlow } = t.context;
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    const { uid, id } = await appendMessage(t, 'INBOX', 'mark as read');
    // untagged FETCH updates carry the sequence number, not the UID
    const { seq } = await imapFlow.fetchOne(
      String(uid),
      { uid: true },
      { uid: true }
    );
    const flags = collect(imapFlow, 'flags');
    const expunged = collect(imapFlow, 'expunge');
    await startIdle(imapFlow);

    // what webmail sends for "mark as read"
    const res = await t.context.api
      .put(`/v1/messages/${id}?lightweight=true`)
      .set('Authorization', t.context.auth)
      .send({ flags: ['\\Seen'], folder: 'INBOX' });
    t.is(res.status, 200);
    t.false(res.body.is_unread);
    // the message keeps its UID (the current folder is not a move)
    t.is(res.body.uid, uid);

    await pWaitFor(() => flags.events.some((e) => e.seq === seq), {
      timeout: ms('10s')
    }).catch(() => {});
    flags.stop();
    expunged.stop();

    const event = flags.events.find((e) => e.seq === seq);
    t.truthy(event, 'IMAP client was told about the new flags');
    t.true(event?.flags?.has('\\Seen'));
    t.is(expunged.events.length, 0);
  } finally {
    lock.release();
  }
});

test('label changes through the API reach an IMAP client in IDLE as keywords', async (t) => {
  const { imapFlow } = t.context;
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    const { uid, id } = await appendMessage(t, 'INBOX', 'label me');
    const { seq } = await imapFlow.fetchOne(
      String(uid),
      { uid: true },
      { uid: true }
    );
    const flags = collect(imapFlow, 'flags');
    await startIdle(imapFlow);

    const res = await t.context.api
      .put(`/v1/messages/${id}?lightweight=true`)
      .set('Authorization', t.context.auth)
      .send({ labels: ['work'] });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, ['work']);

    await pWaitFor(() => flags.events.some((e) => e.seq === seq), {
      timeout: ms('10s')
    }).catch(() => {});
    flags.stop();

    const event = flags.events.find((e) => e.seq === seq);
    t.truthy(event, 'IMAP client was told about the new keyword');
    t.true(event?.flags?.has('work'));
  } finally {
    lock.release();
  }
});

test('flag changes through the API are found by a CONDSTORE resync', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'condstore');

  // what a client that is not connected knows about the folder
  const { highestModseq } = await imapFlow.status('INBOX', {
    highestModseq: true
  });
  t.truthy(highestModseq);

  const res = await t.context.api
    .put(`/v1/messages/${id}`)
    .set('Authorization', t.context.auth)
    .send({ flags: ['\\Seen', '\\Flagged'] });
  t.is(res.status, 200);

  // the client comes back and asks what changed since then (the journal is
  // written right after the response, so give it a moment)
  let message;
  await pWaitFor(
    async () => {
      const lock = await imapFlow.getMailboxLock('INBOX');
      try {
        for await (const changed of imapFlow.fetch(
          '1:*',
          { uid: true, flags: true, modseq: true },
          { changedSince: highestModseq }
        )) {
          if (changed.uid === uid) message = changed;
        }
      } finally {
        lock.release();
      }

      return Boolean(message);
    },
    { interval: 100, timeout: ms('10s') }
  ).catch(() => {});

  t.truthy(message, 'CHANGEDSINCE returns the message changed by the API');
  t.true(message?.flags?.has('\\Seen'));
  t.true(message?.flags?.has('\\Flagged'));
  t.true(BigInt(message?.modseq || 0) > BigInt(highestModseq));
});

test('deleting through the API expunges it in an IMAP client in IDLE', async (t) => {
  const { imapFlow } = t.context;
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    await appendMessage(t, 'INBOX', 'keep');
    const { id } = await appendMessage(t, 'INBOX', 'delete me');
    t.is(imapFlow.mailbox.exists, 2);

    const expunged = collect(imapFlow, 'expunge');
    await startIdle(imapFlow);

    const res = await t.context.api
      .delete(`/v1/messages/${id}`)
      .set('Authorization', t.context.auth);
    t.is(res.status, 200);

    await pWaitFor(() => expunged.events.length > 0, {
      timeout: ms('10s')
    }).catch(() => {});
    expunged.stop();

    t.is(expunged.events.length, 1, 'IMAP client was told about the expunge');
    t.is(imapFlow.mailbox.exists, 1);
  } finally {
    lock.release();
  }
});

test('moving through the API (e.g. to Trash) updates an IMAP client in IDLE', async (t) => {
  const { imapFlow } = t.context;
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    const { id } = await appendMessage(t, 'INBOX', 'move me');
    t.is(imapFlow.mailbox.exists, 1);

    const expunged = collect(imapFlow, 'expunge');
    await startIdle(imapFlow);

    const res = await t.context.api
      .put(`/v1/messages/${id}`)
      .set('Authorization', t.context.auth)
      .send({ folder: 'Trash' });
    t.is(res.status, 200);
    t.is(res.body.folder_path, 'Trash');

    await pWaitFor(() => expunged.events.length > 0, {
      timeout: ms('10s')
    }).catch(() => {});
    expunged.stop();

    t.is(expunged.events.length, 1, 'IMAP client was told about the move');
    t.is(imapFlow.mailbox.exists, 0);
  } finally {
    lock.release();
  }

  const status = await imapFlow.status('Trash', { messages: true });
  t.is(status.messages, 1);
});

async function getMessage(t, id) {
  const res = await t.context.api
    .get(`/v1/messages/${id}`)
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  return res.body;
}

async function updateMessage(t, id, body) {
  return t.context.api
    .put(`/v1/messages/${id}?lightweight=true`)
    .set('Authorization', t.context.auth)
    .send(body);
}

test('labels set through the API survive flag changes from IMAP clients', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'labeled in webmail');
  const res = await updateMessage(t, id, { labels: ['work'] });
  t.is(res.status, 200);

  // Thunderbird marks it read (STORE +FLAGS)
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    await imapFlow.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
  } finally {
    lock.release();
  }

  const message = await getMessage(t, id);
  t.false(message.is_unread);
  t.deepEqual(message.labels, ['work']);
});

test('labels removed through the API are removed for IMAP clients too', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'tagged in thunderbird');
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    // Thunderbird tags it: the keyword is stored with the flags
    await imapFlow.messageFlagsAdd(String(uid), ['work'], { uid: true });
    const tagged = await getMessage(t, id);
    t.deepEqual(tagged.labels, ['work']);

    // what webmail sends when the label is removed there
    const res = await updateMessage(t, id, {
      labels: [],
      labels_remove: ['work']
    });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, []);

    let message = await imapFlow.fetchOne(
      String(uid),
      { flags: true },
      { uid: true }
    );
    t.false(message.flags.has('work'));

    // and the next flag change from IMAP does not bring it back
    await imapFlow.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
    message = await imapFlow.fetchOne(
      String(uid),
      { flags: true },
      { uid: true }
    );
    t.false(message.flags.has('work'));
  } finally {
    lock.release();
  }

  const stored = await getMessage(t, id);
  t.deepEqual(stored.labels, []);
});

test('flags_add and flags_remove change only those flags', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'changed elsewhere');

  // another client flags the message, and webmail has not seen that yet
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    await imapFlow.messageFlagsAdd(String(uid), ['\\Flagged'], { uid: true });
  } finally {
    lock.release();
  }

  // webmail marks it read: the full list it knows about, and the change
  let res = await updateMessage(t, id, {
    flags: ['\\Seen'],
    flags_add: ['\\Seen']
  });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags.sort(), ['\\Flagged', '\\Seen']);
  t.false(res.body.is_unread);

  res = await updateMessage(t, id, {
    flags: ['\\Seen'],
    flags_remove: ['\\Seen']
  });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags, ['\\Flagged']);
  t.true(res.body.is_unread);
});

test('the API only stores flags IMAP clients can read', async (t) => {
  const { id } = await appendMessage(t, 'INBOX', 'flag syntax');

  for (const flags of [
    ['hello world'],
    ['(work)'],
    ['work"'],
    ['\\Recent'],
    ['\\Important'],
    ['x'.repeat(256)],
    Array.from({ length: 101 }, (_, i) => `k${i}`),
    [42]
  ]) {
    const res = await updateMessage(t, id, { flags });
    t.is(res.status, 400, `flags ${JSON.stringify(flags).slice(0, 40)}`);
  }

  for (const body of [{ flags_add: ['a b'] }, { flags_remove: ['\\Recent'] }]) {
    const res = await updateMessage(t, id, body);
    t.is(res.status, 400, `body ${JSON.stringify(body)}`);
  }

  // system flags are case-insensitive and stored the way IMAP writes them
  const res = await updateMessage(t, id, { flags: ['\\seen', '$Forwarded'] });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags, ['\\Seen', '$Forwarded']);

  // a new message goes through the same check
  const created = await t.context.api
    .post('/v1/messages')
    .set('Authorization', t.context.auth)
    .send({
      to: ['recipient@example.com'],
      subject: 'draft',
      text: 'draft',
      folder: 'INBOX',
      flags: ['bad flag']
    });
  t.is(created.status, 400);
});

test('INBOX is matched in any case, as over IMAP', async (t) => {
  const { uid, id } = await appendMessage(t, 'INBOX', 'inbox case');

  const res = await updateMessage(t, id, {
    flags: ['\\Seen'],
    folder: 'inbox'
  });
  t.is(res.status, 200);
  t.is(res.body.folder_path, 'INBOX');
  // not a move: the message keeps its UID
  t.is(res.body.uid, uid);

  const list = await t.context.api
    .get('/v1/messages?folder=inbox')
    .set('Authorization', t.context.auth);
  t.is(list.status, 200);
  t.true(list.body.some((m) => m.id === id));

  const folders = await t.context.api
    .get('/v1/folders')
    .set('Authorization', t.context.auth);
  t.is(folders.status, 200);
  t.is(folders.body.filter((f) => f.path.toUpperCase() === 'INBOX').length, 1);
});

test('API requests are not counted or limited as CalDAV traffic', async (t) => {
  // the CalDAV hourly bandwidth limit is used up
  const now = new Date();
  const day = now.toISOString().split('T')[0];
  const hour = `${day}T${String(now.getUTCHours()).padStart(2, '0')}`;
  const key = `bw_${config.env}:caldav:h:${hour}:${t.context.alias.user}`;
  await t.context.client.set(key, String(HOURLY_LIMIT + 1));

  const res = await t.context.api
    .get('/v1/folders')
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  await setTimeout(100);
  t.is(await t.context.client.get(key), String(HOURLY_LIMIT + 1));
});

test('renaming a folder without a new name is a bad request', async (t) => {
  const created = await t.context.api
    .post('/v1/folders')
    .set('Authorization', t.context.auth)
    .send({ path: 'Projects' });
  t.is(created.status, 200);

  const res = await t.context.api
    .put(`/v1/folders/${created.body.id}`)
    .set('Authorization', t.context.auth)
    .send({});
  t.is(res.status, 400);
});

test('deleting a folder through the API closes it for an IMAP client that has it open', async (t) => {
  const { imapFlow } = t.context;
  const created = await t.context.api
    .post('/v1/folders')
    .set('Authorization', t.context.auth)
    .send({ path: 'Old Projects' });
  t.is(created.status, 200);

  await imapFlow.mailboxOpen('Old Projects');
  let closed = false;
  imapFlow.on('close', () => {
    closed = true;
  });

  const res = await t.context.api
    .delete(`/v1/folders/${created.body.id}`)
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);

  // the server says BYE instead of leaving the client in a folder that is gone
  await pWaitFor(() => closed, { timeout: ms('10s') }).catch(() => {});
  t.true(closed, 'IMAP client was told the open folder was deleted');
});

test('listed messages have their labels, and true or false for booleans', async (t) => {
  const { id } = await appendMessage(t, 'INBOX', 'listed labels');
  const res = await updateMessage(t, id, { labels: ['work'] });
  t.is(res.status, 200);

  const list = await t.context.api
    .get('/v1/messages?folder=INBOX&lightweight=true')
    .set('Authorization', t.context.auth);
  t.is(list.status, 200);
  const message = list.body.find((m) => m.id === id);
  // not the stored bytes ({ "type": "Buffer", ... })
  t.deepEqual(message.labels, ['work']);
  for (const key of [
    'is_junk',
    'is_copied',
    'is_searchable',
    'is_expired',
    'has_attachment'
  ]) {
    t.is(typeof message[key], 'boolean', `${key} is a boolean`);
  }
});

test('labels_add and labels_remove change only those labels', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'tagged twice');
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    // Thunderbird tags it, and webmail has not seen that yet
    await imapFlow.messageFlagsAdd(String(uid), ['urgent'], { uid: true });

    // webmail adds a label: the whole list it knows about, and the change
    let res = await updateMessage(t, id, {
      labels: ['work'],
      labels_add: ['work']
    });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels.sort(), ['urgent', 'work']);

    res = await updateMessage(t, id, {
      labels: ['work'],
      labels_remove: ['urgent']
    });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, ['work']);

    // removed for IMAP clients as well
    const message = await imapFlow.fetchOne(
      String(uid),
      { flags: true },
      { uid: true }
    );
    t.false(message.flags.has('urgent'));
    t.true(message.flags.has('work'));
  } finally {
    lock.release();
  }
});

test('a whole list of labels leaves the keywords IMAP clients set alone', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'forwarded');
  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    // Thunderbird forwards it and tags it
    await imapFlow.messageFlagsAdd(String(uid), ['$Forwarded', 'work'], {
      uid: true
    });

    // an older webmail sends the labels it shows, which leave out
    // $Forwarded (and can be out of date)
    const res = await updateMessage(t, id, { labels: [] });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, []);

    const message = await imapFlow.fetchOne(
      String(uid),
      { flags: true },
      { uid: true }
    );
    t.true(message.flags.has('$Forwarded'));
    t.true(message.flags.has('work'));
  } finally {
    lock.release();
  }
});

test('a label is never shown to IMAP clients as a system flag', async (t) => {
  const { imapFlow } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'not deleted');
  const res = await updateMessage(t, id, { labels: ['\\Deleted'] });
  t.is(res.status, 200);

  const lock = await imapFlow.getMailboxLock('INBOX');
  try {
    const message = await imapFlow.fetchOne(
      String(uid),
      { flags: true },
      { uid: true }
    );
    t.false([...message.flags].some((flag) => /^\\deleted$/i.test(flag)));
  } finally {
    lock.release();
  }
});

test('the whole list of flags is ignored, and not checked, when changes are named', async (t) => {
  const { id } = await appendMessage(t, 'INBOX', 'stale list');

  // a list from a client that is out of date, next to the change
  let res = await updateMessage(t, id, {
    flags: ['flag the server no longer has'],
    flags_add: ['\\Seen']
  });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags, ['\\Seen']);

  // an empty list of changes is no change, so the whole list is used
  res = await updateMessage(t, id, {
    flags: ['\\Flagged'],
    flags_add: [],
    flags_remove: []
  });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags, ['\\Flagged']);
});

test('a flag IMAP cannot read, stored before flags were checked, does not block changes', async (t) => {
  const { imap, session, alias } = t.context;
  const { id } = await appendMessage(t, 'INBOX', 'old flag');

  // an older release stored any string
  await getDatabase(imap, alias, session);
  await Messages.findOneAndUpdate(
    imap,
    session,
    { _id: id },
    { $set: { flags: ['old flag'] } }
  );

  // an older webmail sends it back with its change, and it is kept
  let res = await updateMessage(t, id, { flags: ['old flag', '\\Seen'] });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags, ['old flag', '\\Seen']);

  // and it can be removed on its own
  res = await updateMessage(t, id, { flags_remove: ['old flag'] });
  t.is(res.status, 200);
  t.deepEqual(res.body.flags, ['\\Seen']);
});

test('a message that is refused leaves no new folder behind', async (t) => {
  const res = await t.context.api
    .post('/v1/messages')
    .set('Authorization', t.context.auth)
    .send({
      to: ['recipient@example.com'],
      subject: 'refused',
      text: 'refused',
      folder: 'Refused',
      flags: ['bad flag']
    });
  t.is(res.status, 400);

  const paths = await listFolderPaths(t);
  t.false(paths.includes('Refused'));
});

async function createFolder(t, path) {
  const res = await t.context.api
    .post('/v1/folders')
    .set('Authorization', t.context.auth)
    .send({ path });
  t.is(res.status, 200, `${path} is created`);
  return res.body;
}

async function renameFolder(t, id, path) {
  return t.context.api
    .put(`/v1/folders/${encodeURIComponent(id)}`)
    .set('Authorization', t.context.auth)
    .send({ path });
}

async function listFolderPaths(t) {
  const res = await t.context.api
    .get('/v1/folders?limit=100')
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  return res.body.map((folder) => folder.path);
}

test('renaming a folder renames the folders in it (RFC 3501)', async (t) => {
  const { imapFlow } = t.context;
  const work = await createFolder(t, 'Work');
  await createFolder(t, 'Work/Clients');
  await createFolder(t, 'Work/Clients/Acme');
  await createFolder(t, 'Workshop');
  await imapFlow.append('Work/Clients/Acme', rfc822('in a subfolder'));

  // what webmail sends when a folder is renamed
  const res = await renameFolder(t, work.id, 'Jobs');
  t.is(res.status, 200);
  t.is(res.body.path, 'Jobs');

  let paths = await listFolderPaths(t);
  for (const path of [
    'Jobs',
    'Jobs/Clients',
    'Jobs/Clients/Acme',
    'Workshop'
  ]) {
    t.true(paths.includes(path), `${path} is listed`);
  }

  t.false(paths.some((path) => path === 'Work' || path.startsWith('Work/')));

  // and over IMAP, as Thunderbird renames a folder
  await imapFlow.mailboxRename('Jobs', 'Projects');
  paths = await listFolderPaths(t);
  t.true(paths.includes('Projects/Clients/Acme'));
  t.false(paths.some((path) => path.startsWith('Jobs')));

  const status = await imapFlow.status('Projects/Clients/Acme', {
    messages: true
  });
  t.is(status.messages, 1);
});

test('renaming a folder onto another or into itself is a bad request', async (t) => {
  const alpha = await createFolder(t, 'Alpha');
  await createFolder(t, 'Beta');

  let res = await renameFolder(t, alpha.id, 'Beta');
  t.is(res.status, 400);

  res = await renameFolder(t, alpha.id, 'Alpha/Old');
  t.is(res.status, 400);

  const paths = await listFolderPaths(t);
  t.true(paths.includes('Alpha'));
  t.true(paths.includes('Beta'));
  t.false(paths.includes('Alpha/Old'));
});

test('INBOX cannot be deleted or renamed through the API, as over IMAP', async (t) => {
  const { id } = await appendMessage(t, 'INBOX', 'stays in INBOX');

  let res = await t.context.api
    .delete('/v1/folders/INBOX')
    .set('Authorization', t.context.auth);
  t.is(res.status, 400);

  res = await renameFolder(t, 'inbox', 'Old Inbox');
  t.is(res.status, 400);

  const message = await getMessage(t, id);
  t.is(message.folder_path, 'INBOX');
});

test('folder paths are checked and matched as over IMAP', async (t) => {
  // there is one INBOX, in any case
  let res = await t.context.api
    .post('/v1/folders')
    .set('Authorization', t.context.auth)
    .send({ path: 'inbox' });
  t.is(res.status, 400);

  res = await t.context.api
    .get('/v1/folders/inbox')
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  t.is(res.body.path, 'INBOX');

  // slashes around a path are dropped
  const receipts = await createFolder(t, '/Receipts/');
  t.is(receipts.path, 'Receipts');

  // and an empty name is refused
  for (const path of ['/', 'a//b', '//x']) {
    res = await t.context.api
      .post('/v1/folders')
      .set('Authorization', t.context.auth)
      .send({ path });
    t.is(res.status, 400, `${path} is refused`);
  }

  const paths = await listFolderPaths(t);
  t.is(paths.filter((path) => path.toUpperCase() === 'INBOX').length, 1);
  t.false(paths.some((path) => path.includes('//') || path.startsWith('/')));
});

test('creating a folder creates the folders above it (RFC 3501)', async (t) => {
  const { imapFlow } = t.context;

  // through the API, and over IMAP
  await createFolder(t, 'Projects/2026');
  await imapFlow.mailboxCreate(['Clients', 'Acme']);

  const paths = await listFolderPaths(t);
  for (const path of ['Projects', 'Projects/2026', 'Clients', 'Clients/Acme']) {
    t.true(paths.includes(path), `${path} is listed`);
  }
});

test('a folder stored with another case of INBOX is still found by its path', async (t) => {
  const { imap, session, alias } = t.context;

  // created through the API before paths were normalized
  await getDatabase(imap, alias, session);
  await Mailboxes.create({ instance: imap, session, path: 'Inbox/Receipts' });

  let res = await t.context.api
    .get(`/v1/folders/${encodeURIComponent('Inbox/Receipts')}`)
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  t.is(res.body.path, 'Inbox/Receipts');

  const { id } = await appendMessage(t, 'INBOX', 'receipt');
  res = await updateMessage(t, id, { folder: 'Inbox/Receipts' });
  t.is(res.status, 200);
  t.is(res.body.folder_path, 'Inbox/Receipts');

  res = await t.context.api
    .get(`/v1/messages?folder=${encodeURIComponent('Inbox/Receipts')}`)
    .set('Authorization', t.context.auth);
  t.is(res.status, 200);
  t.true(res.body.some((m) => m.id === id));
});

//
// WebSocket and push clients (webmail, the apps) learn about a change made
// through the API from one event per real change: nothing when the flags and
// labels stay the same, the full IMAP flags (keywords included) when they do
// change, and the labels of a new message once they are saved.
//
test('flag and label changes through the API are published once, and only when something changed', async (t) => {
  const { alias } = t.context;
  const { uid, id } = await appendMessage(t, 'INBOX', 'mark as read');
  const inbox = await t.context.api
    .get('/v1/folders/INBOX')
    .set('Authorization', t.context.auth);

  // mark as read
  let capture = utils.captureNotifications(t.context.client, alias.id);
  let res = await updateMessage(t, id, {
    flags: ['\\Seen'],
    folder: 'INBOX'
  });
  t.is(res.status, 200);
  await pWaitFor(() => capture.events.length > 0, {
    timeout: ms('10s')
  }).catch(() => {});
  await setTimeout(500);
  capture.stop();
  t.deepEqual(
    capture.events.map((e) => e.event),
    ['flagsUpdated']
  );
  t.like(capture.events[0], {
    mailbox: inbox.body.id,
    path: 'INBOX',
    action: 'set',
    flags: ['\\Seen'],
    uids: [uid]
  });

  // the same again (another device, or a retry) changes nothing
  capture = utils.captureNotifications(t.context.client, alias.id);
  res = await updateMessage(t, id, { flags: ['\\Seen'], folder: 'INBOX' });
  t.is(res.status, 200);
  res = await updateMessage(t, id, { flags_add: ['\\Seen'] });
  t.is(res.status, 200);
  await setTimeout(1000);
  capture.stop();
  t.deepEqual(capture.events, []);

  // a label is a keyword for IMAP clients, so the flags change as well
  capture = utils.captureNotifications(t.context.client, alias.id);
  res = await updateMessage(t, id, { labels_add: ['work'], folder: 'INBOX' });
  t.is(res.status, 200);
  await pWaitFor(() => capture.events.length >= 2, {
    timeout: ms('10s')
  }).catch(() => {});
  await setTimeout(500);
  capture.stop();
  t.deepEqual(capture.events.map((e) => e.event).sort(), [
    'flagsUpdated',
    'labelsUpdated'
  ]);
  t.deepEqual(capture.of('flagsUpdated')[0].flags.sort(), ['\\Seen', 'work']);
  t.like(capture.of('labelsUpdated')[0], {
    path: 'INBOX',
    action: 'set',
    labels: ['work'],
    uids: [uid]
  });

  // without the folder in the request the event names the mailbox by id only
  capture = utils.captureNotifications(t.context.client, alias.id);
  res = await updateMessage(t, id, { labels_remove: ['work'] });
  t.is(res.status, 200);
  await pWaitFor(() => capture.of('labelsUpdated').length > 0, {
    timeout: ms('10s')
  }).catch(() => {});
  capture.stop();
  const removed = capture.of('labelsUpdated');
  t.is(removed.length, 1);
  t.like(removed[0], { mailbox: inbox.body.id, labels: [], uids: [uid] });
  t.false('path' in removed[0]);
});

test('labels of a message created through the API are published', async (t) => {
  const { alias } = t.context;
  const capture = utils.captureNotifications(t.context.client, alias.id);
  const res = await t.context.api
    .post('/v1/messages')
    .set('Authorization', t.context.auth)
    .send({
      to: [{ address: 'recipient@example.com' }],
      subject: 'labeled draft',
      text: 'body',
      folder: 'INBOX',
      labels: ['work']
    });
  t.is(res.status, 200);
  await pWaitFor(() => capture.of('labelsUpdated').length > 0, {
    timeout: ms('10s')
  }).catch(() => {});
  await setTimeout(500);
  capture.stop();

  t.is(capture.of('newMessage').length, 1);
  const labels = capture.of('labelsUpdated');
  t.is(labels.length, 1);
  t.like(labels[0], {
    path: 'INBOX',
    action: 'set',
    labels: ['work'],
    uids: [res.body.uid]
  });
});

test('labels given to a new message keep the labels its keywords give it', async (t) => {
  const res = await t.context.api
    .post('/v1/messages')
    .set('Authorization', t.context.auth)
    .send({
      to: [{ address: 'recipient@example.com' }],
      subject: 'keyword and label',
      text: 'body',
      folder: 'INBOX',
      flags: ['receipts'],
      labels: ['work']
    });
  t.is(res.status, 200);
  t.deepEqual([...res.body.labels].sort(), ['receipts', 'work']);
});

test('labels given to a new message are kept when its keywords reach the label limit', async (t) => {
  const keywords = Array.from({ length: 10 }, (_, i) => `keyword${i}`);
  const res = await t.context.api
    .post('/v1/messages')
    .set('Authorization', t.context.auth)
    .send({
      to: [{ address: 'recipient@example.com' }],
      subject: 'many keywords',
      text: 'body',
      folder: 'INBOX',
      flags: keywords,
      labels: ['work']
    });
  t.is(res.status, 200, `${res.text}`);
  t.is(res.body.labels.length, 10);
  t.true(res.body.labels.includes('work'));
});
