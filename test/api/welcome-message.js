/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The welcome message in the INBOX of a new mailbox
// (helpers/append-welcome-message.js).
//
// Through the real API -> controller -> WebSocket -> SQLite server path:
//
//  - the first password of an alias sets up its mailbox with the welcome
//    message in the INBOX, also when the alias does not have IMAP enabled
//    yet (the alias shows it once IMAP is on)
//  - a mailbox deleted the way jobs/cleanup-sqlite.js deletes the mailbox of
//    an alias without IMAP gets its folders and the welcome message again
//    once IMAP is enabled
//
// Through the SQLite server, with the helper called as getDatabase calls it:
//
//  - the message is stored even when the mailbox handle is evicted while it
//    is stored (the reset that set the mailbox up evicts it when it ends),
//    or was closed before
//  - a failed attempt gets another one, the message is stored once, an
//    alias whose message could not be stored is not marked as having one,
//    and no reference to a handle is left behind
//
// (serial: some tests replace `Messages.create` for a moment)
//

const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const Messages = require('#models/messages');
const appendWelcomeMessage = require('#helpers/append-welcome-message');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const getDatabase = require('#helpers/get-database');
const getPathToDatabase = require('#helpers/get-path-to-database');
const openDatabaseHandle = require('#helpers/open-database-handle');
const { encrypt } = require('#helpers/encrypt-decrypt');

const client = new Redis();
client.setMaxListeners(0);
const resolver = createTangerine(client);

const WELCOME_SUBJECT = 'Welcome to Forward Email';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// (each test changes what it needs, and it is all restored afterwards)
const { enabled, retries, retryDelay } = appendWelcomeMessage;
const { create } = Messages;
test.afterEach.always(() => {
  Object.assign(appendWelcomeMessage, { enabled, retries, retryDelay });
  Messages.create = create;
});

async function createUserDomainAlias(t, { hasImap = true } = {}) {
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
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  // the domain is verified for the API server (alias authentication)
  await t.context.resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        t.context.resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );

  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({ name: 'test', has_imap: hasImap });
  t.is(res.status, 200);

  const alias = await Aliases.findById(res.body.id).lean().exec();
  const storagePath = getPathToDatabase({
    id: alias.id,
    storage_location: alias.storage_location
  });

  return { user, domain, alias, aliasId: alias.id, storagePath };
}

// the first password of the alias (sets up its mailbox)
async function generatePassword(t, { user, domain, aliasId }) {
  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases/${aliasId}/generate-password`)
    .auth(user[config.userFields.apiToken])
    .send({});
  t.is(res.status, 200);
  return res.body.password;
}

// the session the SQLite server sets the mailbox up with (see the `reset`
// action of helpers/parse-payload.js)
function welcomeSession({ user, domain, alias }, password) {
  return {
    user: {
      id: alias.id,
      username: `${alias.name}@${domain.name}`,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      storage_location: alias.storage_location,
      password: encrypt(password),
      locale: 'en',
      owner_full_email: user.email
    }
  };
}

// the subjects of the messages in the INBOX of the mailbox
async function inboxSubjects({ storagePath, aliasId }, password) {
  const db = await openDatabaseHandle(storagePath, {
    user: { alias_id: aliasId, password: encrypt(password) }
  });
  try {
    return db
      .prepare(
        "SELECT m.subject FROM Messages m JOIN Mailboxes b ON b._id = m.mailbox WHERE b.path = 'INBOX'"
      )
      .pluck()
      .all();
  } finally {
    db.close();
  }
}

// Whether `condition` is true within 20 seconds, checked every 250 ms (no
// check runs after that, as one of p-wait-for 3 can).
async function eventually(condition, until = Date.now() + ms('20s')) {
  if (await condition()) return true;
  if (Date.now() >= until) return false;
  await delay(250);
  return eventually(condition, until);
}

// (the SQLite server writes the welcome message in the background once it
//  has set the mailbox up)
async function waitForInbox(ctx, password) {
  let subjects = [];
  let error;
  await eventually(async () => {
    try {
      subjects = await inboxSubjects(ctx, password);
      error = undefined;
    } catch (err) {
      error = err;
      return false;
    }

    return subjects.length > 0;
  });
  if (error) throw error;
  return subjects;
}

// the messages the API lists in the INBOX of the alias
function listInbox(t, { alias, domain }, password) {
  return t.context.api
    .get('/v1/messages?folder=INBOX')
    .set(
      'Authorization',
      `Basic ${Buffer.from(`${alias.name}@${domain.name}:${password}`).toString(
        'base64'
      )}`
    );
}

function enableImap(t, { user, domain, aliasId }) {
  return t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${aliasId}`)
    .auth(user[config.userFields.apiToken])
    .send({ has_imap: true });
}

async function welcomeSentAt(aliasId) {
  const alias = await Aliases.findById(aliasId).lean().exec();
  return alias.welcome_email_sent_at;
}

//
// The mailbox open and cached on the SQLite server with no request holding
// it, as the reset leaves it before its `sqlite_auth_reset` (which has
// evicted it by the time the API answers, so it is opened again here).
//
async function openMailbox(t, ctx, password) {
  const { sqlite } = t.context;
  const session = welcomeSession(ctx, password);
  const db = await getDatabase(
    sqlite,
    { id: ctx.aliasId, storage_location: ctx.alias.storage_location },
    session
  );
  for (const handle of session.dbAcquired || [])
    sqlite.databaseMap.release(ctx.aliasId, handle);
  return { session, db };
}

test.serial(
  'the first password sets up the mailbox with the welcome message in the inbox',
  async (t) => {
    appendWelcomeMessage.enabled = true;

    const ctx = await createUserDomainAlias(t);
    const password = await generatePassword(t, ctx);

    const subjects = await waitForInbox(ctx, password);
    t.is(subjects.length, 1);
    t.true(subjects[0].includes(WELCOME_SUBJECT));
    t.truthy(await welcomeSentAt(ctx.aliasId));
  }
);

test.serial(
  'an alias without IMAP gets the welcome message with its first password, and it is there once IMAP is enabled',
  async (t) => {
    appendWelcomeMessage.enabled = true;

    const ctx = await createUserDomainAlias(t, { hasImap: false });
    const password = await generatePassword(t, ctx);

    const subjects = await waitForInbox(ctx, password);
    t.is(subjects.length, 1);
    t.true(subjects[0].includes(WELCOME_SUBJECT));
    // (not marked: the next mailbox of the alias gets one too)
    t.falsy(await welcomeSentAt(ctx.aliasId));

    const update = await enableImap(t, ctx);
    t.is(update.status, 200);
    t.true(update.body.has_imap);

    const res = await listInbox(t, ctx, password);
    t.is(res.status, 200);
    t.is(res.body.length, 1);
    t.true(res.body[0].subject.includes(WELCOME_SUBJECT));
  }
);

test.serial(
  'a mailbox deleted while the alias had no IMAP is set up again with its folders and the welcome message once IMAP is enabled',
  async (t) => {
    appendWelcomeMessage.enabled = true;

    const ctx = await createUserDomainAlias(t, { hasImap: false });
    const password = await generatePassword(t, ctx);
    const subjects = await waitForInbox(ctx, password);
    t.is(subjects.length, 1);

    // as jobs/cleanup-sqlite.js deletes the mailbox of an alias without
    // IMAP: the SQLite servers close their handles, then the job deletes the
    // files
    t.true(t.context.sqlite.databaseMap.evictAndClose(ctx.aliasId));
    for (const suffix of ['', '-wal', '-shm'])
      fs.rmSync(`${ctx.storagePath}${suffix}`, { force: true });

    const update = await enableImap(t, ctx);
    t.is(update.status, 200);

    // the first request sets up a new mailbox, and the welcome message
    // follows in the background
    let res;
    await eventually(async () => {
      res = await listInbox(t, ctx, password);
      return res.status === 200 && res.body.length > 0;
    });
    t.is(res.status, 200);
    t.is(res.body.length, 1);
    t.true(res.body[0].subject.includes(WELCOME_SUBJECT));
    t.truthy(await welcomeSentAt(ctx.aliasId));
  }
);

test.serial(
  'the welcome message is stored when the mailbox handle is evicted while it is stored',
  async (t) => {
    const ctx = await createUserDomainAlias(t);
    const password = await generatePassword(t, ctx);
    const { session, db } = await openMailbox(t, ctx, password);

    // an eviction right before the message is stored, as the
    // `sqlite_auth_reset` that ends the reset of the mailbox can do
    const { sqlite } = t.context;
    Messages.create = function (...args) {
      sqlite.databaseMap.evictAndClose(ctx.aliasId);
      return create.apply(this, args);
    };

    // (one attempt: it must not need another)
    appendWelcomeMessage.retries = 0;

    t.true(await appendWelcomeMessage(sqlite, { ...session, db }));

    const subjects = await inboxSubjects(ctx, password);
    t.is(subjects.length, 1);
    t.true(subjects[0].includes(WELCOME_SUBJECT));

    // and the cache closed the evicted handle once the message was stored
    t.false(db.open);
    t.is(sqlite.databaseMap.activeReferences, 0);
  }
);

test.serial(
  'the welcome message is stored when the mailbox handle was closed before',
  async (t) => {
    const ctx = await createUserDomainAlias(t);
    const password = await generatePassword(t, ctx);
    const { session, db } = await openMailbox(t, ctx, password);
    const { sqlite } = t.context;
    t.true(sqlite.databaseMap.evictAndClose(ctx.aliasId));
    t.false(db.open);

    appendWelcomeMessage.retries = 0;

    // (the append opens the mailbox again, and lets go of it when done)
    t.true(await appendWelcomeMessage(sqlite, { ...session, db }));
    const subjects = await inboxSubjects(ctx, password);
    t.is(subjects.length, 1);
    t.true(subjects[0].includes(WELCOME_SUBJECT));
    t.is(sqlite.databaseMap.activeReferences, 0);
  }
);

test.serial(
  'a welcome message that could not be stored gets another attempt, and is stored once',
  async (t) => {
    const ctx = await createUserDomainAlias(t);
    const password = await generatePassword(t, ctx);
    const { session, db } = await openMailbox(t, ctx, password);

    let failures = 0;
    Messages.create = function (...args) {
      if (failures === 0) {
        failures++;
        return Promise.reject(new Error('Unable to store the message'));
      }

      return create.apply(this, args);
    };

    appendWelcomeMessage.retryDelay = 100;

    t.true(await appendWelcomeMessage(t.context.sqlite, { ...session, db }));
    t.is(failures, 1);
    t.truthy(await welcomeSentAt(ctx.aliasId));

    // once per alias
    t.false(await appendWelcomeMessage(t.context.sqlite, { ...session, db }));

    const subjects = await inboxSubjects(ctx, password);
    t.is(subjects.length, 1);
    t.true(subjects[0].includes(WELCOME_SUBJECT));
    t.is(t.context.sqlite.databaseMap.activeReferences, 0);
  }
);

test.serial(
  'an alias whose welcome message could not be stored is not marked as having one',
  async (t) => {
    const ctx = await createUserDomainAlias(t);
    const password = await generatePassword(t, ctx);
    const { session, db } = await openMailbox(t, ctx, password);

    let attempts = 0;
    Messages.create = function () {
      attempts++;
      return Promise.reject(new Error('Unable to store the message'));
    };

    appendWelcomeMessage.retries = 1;
    appendWelcomeMessage.retryDelay = 100;

    await t.throwsAsync(
      appendWelcomeMessage(t.context.sqlite, { ...session, db })
    );
    t.is(attempts, 2);
    t.falsy(await welcomeSentAt(ctx.aliasId));
    t.deepEqual(await inboxSubjects(ctx, password), []);
    t.is(t.context.sqlite.databaseMap.activeReferences, 0);
  }
);
