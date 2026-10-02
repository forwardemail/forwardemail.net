/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Keywords and labels stay in step between IMAP and the REST API.
//
// IMAP clients see a message's keywords: its flags and its labels together
// (helpers/get-imap-flags.js). The API, webmail and the apps read the labels.
// These tests deliver mail through the MX server with a Sieve script, and
// change messages over IMAP and through the API, all on one SQLite server,
// and check what each side reads back.
//

const { Buffer } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const Axe = require('axe');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const nodemailer = require('nodemailer');
const test = require('ava');
const { ImapFlow } = require('imapflow');

const utils = require('../utils');
const IMAP = require('../../imap-server');
const MX = require('../../mx-server');
const Messages = require('#models/messages');
const SieveScripts = require('#models/sieve-scripts');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const backfillKeywordLabels = require('#helpers/backfill-keyword-labels');
const getDatabase = require('#helpers/get-database');
const { encrypt } = require('#helpers/encrypt-decrypt');

const IP_ADDRESS = ip.address();
const logger = new Axe({ silent: true });

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);

// an IMAP server and an MX server on the SQLite server and Redis of the API
test.beforeEach(async (t) => {
  const { default: getPort } = await import('get-port');
  const wsp = createWebSocketAsPromised({
    port: t.context.sqlite.server.address().port
  });
  await wsp.open();
  t.context.serversWsp = wsp;

  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.imapPort = await getPort();
  await imap.listen(t.context.imapPort);
  t.context.imap = imap;

  const mx = new MX({ client: t.context.client, wsp });
  t.context.mxPort = await getPort();
  await mx.listen(t.context.mxPort);
  t.context.mx = mx;
});

test.afterEach.always(async (t) => {
  for (const server of [t.context.mx, t.context.imap]) {
    try {
      await server?.close();
    } catch {}
  }

  try {
    await t.context.serversWsp?.close();
  } catch {}
});

test.afterEach.always(utils.teardownApiServer);

//
// A user on a paid plan, a verified domain whose MX records point to the
// MX server here, and an alias with IMAP (and no forwarding), a password and
// the Sieve script.
//
async function createAlias(t, sieveScript) {
  const { resolver } = t.context.mx;
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
      resolver,
      has_smtp: true
    })
    .create();

  await resolver.options.cache.mset(
    new Map([
      [
        `a:${domain.name}`,
        resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
      ],
      [
        `mx:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'MX',
          [{ exchange: IP_ADDRESS, priority: 0 }],
          true,
          ms('5m')
        )
      ],
      [
        `txt:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );

  // (no greylisting for the sender here)
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  const alias = await t.context.aliasFactory
    .withState({
      name: 'labels',
      user: user._id,
      domain: domain._id,
      has_imap: true
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();

  if (sieveScript)
    await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: 'labels',
      content: sieveScript,
      is_active: true
    });

  const username = `${alias.name}@${domain.name}`;
  return {
    alias,
    domain,
    username,
    pass,
    auth: `Basic ${Buffer.from(`${username}:${pass}`).toString('base64')}`
  };
}

// a message delivered over SMTP to the MX server
async function deliver(t, { username }, subject) {
  const transporter = nodemailer.createTransport({
    host: IP_ADDRESS,
    port: t.context.mxPort,
    secure: false,
    ignoreTLS: true,
    tls: { rejectUnauthorized: false }
  });
  await transporter.sendMail({
    from: 'test@test.com',
    to: username,
    subject,
    text: `Body of ${subject}`
  });
}

// Whether `condition` is true within 20 seconds, checked every 250 ms.
async function eventually(condition, until = Date.now() + ms('20s')) {
  if (await condition()) return true;
  if (Date.now() >= until) return false;
  await delay(250);
  return eventually(condition, until);
}

// the message with this subject as the API lists it in a folder
async function findInApi(t, { auth }, subject, folder = 'INBOX') {
  let message;
  await eventually(async () => {
    const res = await t.context.api
      .get(`/v1/messages?folder=${encodeURIComponent(folder)}`)
      .set('Authorization', auth);
    message = res.status === 200 && res.body.find((m) => m.subject === subject);
    return Boolean(message);
  });
  return message;
}

// the labels the API lists for the message with this subject
async function labelsInApi(t, ctx, subject) {
  const message = await findInApi(t, ctx, subject);
  return message?.labels;
}

// a signed-in IMAP client
async function imapClient(t, { username, pass }) {
  const client = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.imapPort,
    secure: false,
    logger,
    tls: { rejectUnauthorized: false },
    auth: { user: username, pass },
    disableAutoIdle: true
  });
  await client.connect();
  t.teardown(() => client.logout().catch(() => {}));
  return client;
}

// the keywords and flags an IMAP client reads for the message with this UID
async function imapFlags(client, uid, folder = 'INBOX') {
  const lock = await client.getMailboxLock(folder);
  try {
    const message = await client.fetchOne(
      String(uid),
      { flags: true },
      { uid: true }
    );
    return [...message.flags];
  } finally {
    lock.release();
  }
}

// the UIDs an IMAP client finds with SEARCH KEYWORD
async function searchKeyword(client, keyword, folder = 'INBOX') {
  const lock = await client.getMailboxLock(folder);
  try {
    return await client.search({ keyword }, { uid: true });
  } finally {
    lock.release();
  }
}

function update(t, { auth }, id, body) {
  return t.context.api
    .put(`/v1/messages/${id}?lightweight=true`)
    .set('Authorization', auth)
    .send(body);
}

const lower = (list) => list.map((value) => value.toLowerCase());

const SIEVE_LABELS = `require ["imap4flags"];
addflag ["Work", "$label1"];
keep;
`;

test.serial(
  'keywords a Sieve script adds are labels in the API and keywords over IMAP, for mail stored while no client was signed in',
  async (t) => {
    const ctx = await createAlias(t, SIEVE_LABELS);
    await deliver(t, ctx, 'stored for later');

    // (the API signs in, which moves the message into the mailbox)
    const message = await findInApi(t, ctx, 'stored for later');
    t.truthy(message, 'the API lists the message');
    t.deepEqual(lower(message.labels).sort(), ['$label1', 'work']);

    const client = await imapClient(t, ctx);
    const flags = lower(await imapFlags(client, message.uid));
    t.true(flags.includes('work'));
    t.true(flags.includes('$label1'));
    t.deepEqual(await searchKeyword(client, 'Work'), [message.uid]);
  }
);

test.serial(
  'keywords a Sieve script adds are labels in the API and keywords over IMAP, for mail delivered into an open mailbox',
  async (t) => {
    const ctx = await createAlias(t, SIEVE_LABELS);

    // a client keeps the mailbox open on the SQLite server
    const client = await imapClient(t, ctx);
    const lock = await client.getMailboxLock('INBOX');
    lock.release();

    await deliver(t, ctx, 'delivered live');
    const message = await findInApi(t, ctx, 'delivered live');
    t.truthy(message, 'the API lists the message');
    t.deepEqual(lower(message.labels).sort(), ['$label1', 'work']);

    // (read in a session of its own; the open one keeps the mailbox open)
    const reader = await imapClient(t, ctx);
    const flags = lower(await imapFlags(reader, message.uid));
    t.true(flags.includes('work'));
    t.true(flags.includes('$label1'));
  }
);

test.serial(
  'a keyword Sieve files a message with into a folder is a label there',
  async (t) => {
    const ctx = await createAlias(
      t,
      `require ["fileinto", "imap4flags", "mailbox"];
fileinto :create :flags "Receipts" "Receipts";
`
    );
    await deliver(t, ctx, 'a receipt');
    const message = await findInApi(t, ctx, 'a receipt', 'Receipts');
    t.truthy(message, 'the API lists the message in Receipts');
    t.deepEqual(lower(message.labels), ['receipts']);
  }
);

test.serial(
  'a message Sieve files into a folder gets the flags as they were at the fileinto',
  async (t) => {
    // (RFC 5232: the flags a later addflag sets are not the filed message's)
    const ctx = await createAlias(
      t,
      `require ["fileinto", "imap4flags", "mailbox"];
addflag "Before";
fileinto :create "Filed";
addflag "After";
`
    );
    await deliver(t, ctx, 'filed');
    const message = await findInApi(t, ctx, 'filed', 'Filed');
    t.truthy(message, 'the API lists the message in Filed');
    t.deepEqual(lower(message.labels), ['before']);

    const client = await imapClient(t, ctx);
    const flags = lower(await imapFlags(client, message.uid, 'Filed'));
    t.true(flags.includes('before'));
    t.false(flags.includes('after'));
  }
);

test.serial(
  'a keyword added through the API flags is a label as well, shown once over IMAP',
  async (t) => {
    const ctx = await createAlias(t);
    await deliver(t, ctx, 'flag me');
    const message = await findInApi(t, ctx, 'flag me');
    t.truthy(message);

    const res = await update(t, ctx, message.id, {
      flags: ['Urgent'],
      flags_add: ['Urgent']
    });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, ['urgent']);

    const client = await imapClient(t, ctx);
    const flags = await imapFlags(client, message.uid);
    t.is(lower(flags).filter((flag) => flag === 'urgent').length, 1);
    t.deepEqual(await searchKeyword(client, 'urgent'), [message.uid]);
  }
);

test.serial(
  'a whole list of flags through the API adds the labels of its keywords and keeps the other labels',
  async (t) => {
    const ctx = await createAlias(t, SIEVE_LABELS);
    await deliver(t, ctx, 'whole list');
    const message = await findInApi(t, ctx, 'whole list');
    t.truthy(message);

    // a label set apart from the flags
    let res = await update(t, ctx, message.id, { labels_add: ['personal'] });
    t.is(res.status, 200);

    // an older client sends only the flags it knows about
    res = await update(t, ctx, message.id, { flags: ['\\Seen', 'Travel'] });
    t.is(res.status, 200);
    t.deepEqual(lower(res.body.labels).sort(), [
      '$label1',
      'personal',
      'travel',
      'work'
    ]);

    // the keywords an IMAP client sees are the same
    const client = await imapClient(t, ctx);
    const flags = lower(await imapFlags(client, message.uid));
    for (const keyword of ['$label1', 'personal', 'travel', 'work'])
      t.true(flags.includes(keyword), `IMAP shows ${keyword}`);
  }
);

test.serial(
  'a label removed with a whole list of labels stays removed when a whole list of flags comes after',
  async (t) => {
    const ctx = await createAlias(t, SIEVE_LABELS);
    await deliver(t, ctx, 'removed label');
    const message = await findInApi(t, ctx, 'removed label');
    t.truthy(message);

    // an older webmail sends the labels it shows, without "work"
    let res = await update(t, ctx, message.id, { labels: ['$label1'] });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, ['$label1']);
    // (the keyword stays in the flags, where IMAP clients see it)
    t.true(res.body.flags.includes('Work'));

    // a client marks it read with the whole list of flags it has
    res = await update(t, ctx, message.id, {
      flags: [...res.body.flags, '\\Seen']
    });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, ['$label1']);
  }
);

test.serial(
  'a label set through the API is a keyword an IMAP search finds, in any case',
  async (t) => {
    const ctx = await createAlias(t);
    await deliver(t, ctx, 'search me');
    const message = await findInApi(t, ctx, 'search me');
    t.truthy(message);

    const res = await update(t, ctx, message.id, { labels_add: ['project-x'] });
    t.is(res.status, 200);
    t.deepEqual(res.body.labels, ['project-x']);

    const client = await imapClient(t, ctx);
    t.deepEqual(await searchKeyword(client, 'project-x'), [message.uid]);
    t.deepEqual(await searchKeyword(client, 'Project-X'), [message.uid]);

    // and UNKEYWORD leaves it out
    const lock = await client.getMailboxLock('INBOX');
    try {
      t.deepEqual(
        await client.search({ unKeyword: 'project-x' }, { uid: true }),
        []
      );
    } finally {
      lock.release();
    }
  }
);

test.serial(
  'keywords an IMAP client sets and clears are the labels the API reads',
  async (t) => {
    const ctx = await createAlias(t);
    await deliver(t, ctx, 'tag me');
    const message = await findInApi(t, ctx, 'tag me');
    t.truthy(message);

    const client = await imapClient(t, ctx);
    const lock = await client.getMailboxLock('INBOX');
    try {
      await client.messageFlagsAdd(String(message.uid), ['Tagged'], {
        uid: true
      });
    } finally {
      lock.release();
    }

    let found = await findInApi(t, ctx, 'tag me');
    t.deepEqual(found.labels, ['tagged']);

    const again = await client.getMailboxLock('INBOX');
    try {
      await client.messageFlagsRemove(String(message.uid), ['tagged'], {
        uid: true
      });
    } finally {
      again.release();
    }

    found = await findInApi(t, ctx, 'tag me');
    t.deepEqual(found.labels, []);
    t.false(lower(await imapFlags(client, message.uid)).includes('tagged'));
  }
);

test.serial(
  'messages stored with keywords and no labels by an older release get the labels',
  async (t) => {
    const ctx = await createAlias(t);
    await deliver(t, ctx, 'older release');
    const message = await findInApi(t, ctx, 'older release');
    t.truthy(message);

    // as an older release stored keywords: in the flags only
    const session = {
      user: {
        id: ctx.alias.id,
        username: ctx.username,
        alias_id: ctx.alias.id,
        alias_name: ctx.alias.name,
        domain_id: ctx.domain.id,
        domain_name: ctx.domain.name,
        password: encrypt(ctx.pass),
        storage_location: ctx.alias.storage_location,
        locale: 'en',
        owner_full_email: ctx.username
      }
    };
    const db = await getDatabase(
      t.context.sqlite,
      { id: ctx.alias.id, storage_location: ctx.alias.storage_location },
      session
    );
    for (const handle of session.dbAcquired || [])
      t.context.sqlite.databaseMap.release(ctx.alias.id, handle);
    await Messages.updateMany(
      t.context.sqlite,
      { ...session, db },
      { _id: message.id },
      { $set: { flags: ['Work', '\\Seen'], labels: [] } }
    );

    // a message with labels keeps them as they are: a label removed on
    // purpose leaves its keyword in the flags
    await deliver(t, ctx, 'labeled');
    const labeled = await findInApi(t, ctx, 'labeled');
    t.truthy(labeled);
    await Messages.updateMany(
      t.context.sqlite,
      { ...session, db },
      { _id: labeled.id },
      { $set: { flags: ['Travel'], labels: ['personal'] } }
    );

    // the next time the mailbox is opened, as for a mailbox not opened
    // since this release
    await t.context.client.del(`keyword_labels_check:${ctx.alias.id}`);
    t.true(t.context.sqlite.databaseMap.evictAndClose(ctx.alias.id));
    let found;
    await eventually(async () => {
      found = await findInApi(t, ctx, 'older release');
      return found?.labels?.includes('work');
    });
    t.deepEqual(found.labels, ['work']);
    // (a new modseq, so clients that sync changes see the labels)
    t.true(Number(found.modseq) > Number(message.modseq));

    t.deepEqual(await labelsInApi(t, ctx, 'labeled'), ['personal']);

    // done for this mailbox, after the full pass
    await eventually(async () =>
      Boolean(
        await t.context.client.get(`keyword_labels_check:${ctx.alias.id}`)
      )
    );
    t.truthy(
      await t.context.client.get(`keyword_labels_check:${ctx.alias.id}`)
    );

    // and IMAP clients see the keyword once, as before
    const client = await imapClient(t, ctx);
    const flags = lower(await imapFlags(client, message.uid));
    t.is(flags.filter((flag) => flag === 'work').length, 1);
  }
);

test.serial(
  'the labels backfill stops when its handle is no longer the mailbox, and a later pass finishes it',
  async (t) => {
    const ctx = await createAlias(t);
    await deliver(t, ctx, 'first');
    await deliver(t, ctx, 'second');
    const first = await findInApi(t, ctx, 'first');
    const second = await findInApi(t, ctx, 'second');
    t.truthy(first && second);

    const session = {
      user: {
        id: ctx.alias.id,
        username: ctx.username,
        alias_id: ctx.alias.id,
        alias_name: ctx.alias.name,
        domain_id: ctx.domain.id,
        domain_name: ctx.domain.name,
        password: encrypt(ctx.pass),
        storage_location: ctx.alias.storage_location,
        locale: 'en',
        owner_full_email: ctx.username
      }
    };
    const db = await getDatabase(
      t.context.sqlite,
      { id: ctx.alias.id, storage_location: ctx.alias.storage_location },
      session
    );
    try {
      await Messages.updateMany(
        t.context.sqlite,
        { ...session, db },
        { _id: { $in: [first.id, second.id] } },
        { $set: { flags: ['Work'], labels: [] } }
      );

      // the handle was evicted before the pass began
      let stats = await backfillKeywordLabels(db, () => false);
      t.deepEqual(stats, { checked: 0, updated: 0, complete: false });
      t.deepEqual(await labelsInApi(t, ctx, 'first'), []);

      stats = await backfillKeywordLabels(db);
      t.true(stats.complete);
      t.is(stats.updated, 2);
      t.deepEqual(await labelsInApi(t, ctx, 'first'), ['work']);
      t.deepEqual(await labelsInApi(t, ctx, 'second'), ['work']);

      // a second pass finds nothing to do
      stats = await backfillKeywordLabels(db);
      t.true(stats.complete);
      t.is(stats.updated, 0);
    } finally {
      for (const handle of session.dbAcquired || [])
        t.context.sqlite.databaseMap.release(ctx.alias.id, handle);
    }
  }
);
