/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An alias can be cloned: a new alias with the same settings, Sieve scripts
// and password, and a copy of its mailbox made by the sqlite-worker (#575).
//

const fs = require('node:fs');
const { Buffer } = require('node:buffer');

const Axe = require('axe');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ip = require('ip');
const ms = require('ms');
const test = require('ava');
const { ImapFlow } = require('imapflow');
const { JSDOM } = require('jsdom');

const utils = require('../utils');
const IMAP = require('../../imap-server');

const config = require('#config');
const env = require('#config/env');
const getPathToDatabase = require('#helpers/get-path-to-database');
const isValidPassword = require('#helpers/is-valid-password');
const workerConfig = require('#helpers/sqlite-worker-config');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const {
  CLONE_PROCESSING_LIST,
  CLONE_QUEUE,
  finishCloneJob
} = require('#helpers/clone-queue');
const { clone, setWorkerCancelled } = require('#helpers/worker');
const { Aliases, Domains, SieveScripts, Users } = require('#models');

const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const MESSAGE_COUNT = 3;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(utils.setupApiServer);
test.beforeEach(async (t) => {
  // (the web server reaches the sqlite server of this test)
  t.context.sqliteEnv = { host: env.SQLITE_HOST, port: env.SQLITE_PORT };
  env.SQLITE_HOST = '127.0.0.1';
  env.SQLITE_PORT = t.context.sqlite.server.address().port;

  // (the worker would wait for free memory, which is not what this is about)
  t.context.minFreeMem = workerConfig.MIN_FREE_MEM;
  workerConfig.MIN_FREE_MEM = 0;

  t.context.password = falso.randPassword();
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();

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

  t.context.domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  t.context.alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: t.context.domain._id,
      recipients: [user.email],
      has_imap: true,
      description: 'Template mailbox',
      labels: ['template'],
      retention: 30,
      settings: { mail: { archive_folder: 'Archive' } }
    })
    .create();
  t.context.pass = await t.context.alias.createToken();
  await t.context.alias.save();

  const map = new Map();
  map.set(
    `txt:${t.context.domain.name}`,
    t.context.resolver.spoofPacket(
      t.context.domain.name,
      'TXT',
      [`${config.paidPrefix}${t.context.domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  // the clone jobs the sqlite server queues for the worker (see
  // helpers/clone-queue.js), which the tests run themselves
  const { client } = t.context.sqlite;
  t.context.getQueued = async () => {
    const items = await client.lrange(CLONE_QUEUE, 0, -1);
    return items.map((str) => JSON.parse(str));
  };

  t.context.countQueued = () => client.llen(CLONE_QUEUE);
  const { rpush } = client;
  client.rpush = async function (key, ...args) {
    const result = await rpush.call(this, key, ...args);
    // (the connection drops before the sqlite server responds)
    if (key === CLONE_QUEUE && t.context.dropConnection)
      for (const ws of t.context.sqlite.wss.clients) ws.terminate();
    return result;
  };

  const imap = new IMAP(
    {
      client: t.context.client,
      subscriber: t.context.subscriber,
      wsp: t.context.wsp
    },
    false
  );
  await imap.listen(0);
  t.context.imap = imap;
  t.context.imapPort = imap.server.address().port;

  // (the web server shares the sqlite server's Redis, as in production)
  t.context.webRedis = client;
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});

test.afterEach.always(async (t) => {
  env.SQLITE_HOST = t.context.sqliteEnv.host;
  env.SQLITE_PORT = t.context.sqliteEnv.port;
  workerConfig.MIN_FREE_MEM = t.context.minFreeMem;
  try {
    await t.context.imap?.close();
  } catch {}

  await utils.teardownWebServer(t);
  await utils.teardownApiServer(t);
});

async function connect(t, username) {
  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port: t.context.imapPort,
    secure: false,
    logger,
    tls: { rejectUnauthorized: false },
    auth: { user: username, pass: t.context.pass }
  });
  await imapFlow.connect();
  t.teardown(() => imapFlow.logout().catch(() => {}));
  return imapFlow;
}

// a mailbox with a folder of its own and a few messages
async function fillMailbox(t) {
  const { alias, domain } = t.context;
  const imapFlow = await connect(t, `${alias.name}@${domain.name}`);
  await imapFlow.mailboxCreate('Projects');
  for (let i = 0; i < MESSAGE_COUNT; i++) {
    await imapFlow.append(
      i === 0 ? 'Projects' : 'INBOX',
      Buffer.from(
        `Date: ${new Date().toUTCString()}\r\nFrom: sender@example.com\r\nTo: ${
          alias.name
        }@${domain.name}\r\nSubject: message ${i}\r\n\r\nbody ${i}\r\n`
      )
    );
  }

  await imapFlow.logout();
}

function post(t, body) {
  const { web, domain, alias } = t.context;
  return web
    .post(`/en/my-account/domains/${domain.name}/aliases/${alias.id}/clone`)
    .set('Accept', 'application/json')
    .send(body);
}

test('an alias is cloned with its mailbox, settings and Sieve scripts', async (t) => {
  t.timeout(ms('3m'));
  const { alias, domain, pass } = t.context;
  await fillMailbox(t);
  await SieveScripts.create({
    alias: alias._id,
    user: t.context.user._id,
    domain: domain._id,
    name: 'filters',
    content:
      'require ["fileinto"];\r\nif header :contains "subject" "invoice" { fileinto "Projects"; }\r\n',
    is_active: true
  });

  const res = await post(t, { name: 'Copy', password: pass });
  t.is(res.status, 200);
  t.is(res.body.redirectTo, `/en/my-account/domains/${domain.name}/aliases`);

  // (the page it goes back to says it has started, and that its owner is
  // emailed once it is done)
  const page = await t.context.web.get(res.body.redirectTo);
  t.true(page.text.includes('has started'));
  t.true(page.text.includes('you will be emailed once it is ready'));

  // the clone has the settings and password of the original, IMAP off
  let copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .lean()
    .exec();
  t.truthy(copy);
  t.false(copy.has_imap);
  t.is(copy.description, 'Template mailbox');
  t.deepEqual(copy.labels, ['template']);
  t.is(copy.retention, 30);
  t.is(copy.settings.mail.archive_folder, 'Archive');
  t.deepEqual(copy.recipients, alias.recipients);
  t.is(copy.user.toString(), alias.user.toString());
  t.true(await isValidPassword(copy.tokens, pass, copy));

  // (its Sieve scripts are copied, the original's are left as they are)
  const scripts = await SieveScripts.find({ alias: copy._id }).lean().exec();
  t.is(scripts.length, 1);
  t.is(scripts[0].name, 'filters');
  t.true(scripts[0].is_active);
  t.is(await SieveScripts.countDocuments({ alias: alias._id }), 1);

  // the worker copies the mailbox and turns IMAP on
  t.is(await t.context.countQueued(), 1);
  const [payload] = await t.context.getQueued();
  t.is(payload.action, 'clone');
  t.is(payload.clone_alias_id, copy._id.toString());
  await clone(payload, t.context.sqlite.client);

  copy = await Aliases.findById(copy._id).lean().exec();
  t.true(copy.has_imap);
  t.true(copy.storage_used > 0);
  t.true(
    fs.existsSync(
      getPathToDatabase({
        id: copy.id,
        storage_location: copy.storage_location
      })
    )
  );

  // the clone signs in with the same password and has the same mailbox
  const imapFlow = await connect(t, `copy@${domain.name}`);
  const inbox = await imapFlow.status('INBOX', { messages: true });
  t.is(inbox.messages, MESSAGE_COUNT - 1);
  const projects = await imapFlow.status('Projects', { messages: true });
  t.is(projects.messages, 1);

  // (the original is unchanged)
  const original = await connect(t, `${alias.name}@${domain.name}`);
  const originalInbox = await original.status('INBOX', { messages: true });
  t.is(originalInbox.messages, 2);

  // (and can be cloned again once the copy is done)
  const again = await post(t, { name: 'copy-two', password: pass });
  t.is(again.status, 200);
});

test('the current password is required', async (t) => {
  const { domain } = t.context;
  let res = await post(t, { name: 'copy', password: 'not-the-password' });
  t.is(res.status, 403);
  res = await post(t, { name: 'copy' });
  t.is(res.status, 400);
  t.is(await Aliases.countDocuments({ domain: domain._id, name: 'copy' }), 0);
  t.is(await t.context.countQueued(), 0);
});

// the Clone modal of the alias: its fields by name
async function getCloneForm(t) {
  const { web, domain, alias } = t.context;
  const res = await web.get(`/en/my-account/domains/${domain.name}/aliases`);
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  t.truthy(
    document.querySelector(`[data-target="#modal-clone-alias-${alias.id}"]`)
  );
  const form = document.querySelector(`#modal-clone-alias-${alias.id} form`);
  t.truthy(form);
  return [...form.querySelectorAll('input[name]')].map((input) => input.name);
}

test('an alias without IMAP is cloned with its settings and password', async (t) => {
  const { alias, domain, pass } = t.context;
  await Aliases.updateOne({ _id: alias._id }, { $set: { has_imap: false } });

  // (the new name, and the current password the clone signs in with)
  const fields = await getCloneForm(t);
  t.true(fields.includes('name'));
  t.true(fields.includes('password'));

  let res = await post(t, { name: 'copy' });
  t.is(res.status, 400);
  res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);

  // (it is done at once: nothing to be emailed about)
  const page = await t.context.web.get(res.body.redirectTo);
  t.true(page.text.includes('which signs in with the same password'));
  t.false(page.text.includes('you will be emailed'));

  const copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .lean()
    .exec();
  t.false(copy.has_imap);
  t.is(copy.description, 'Template mailbox');
  t.is(copy.settings.mail.archive_folder, 'Archive');
  t.true(await isValidPassword(copy.tokens, pass, copy));
  // (no mailbox to copy)
  t.is(await t.context.countQueued(), 0);
});

test('an alias without a password is cloned with its settings', async (t) => {
  const { web, alias, domain } = t.context;
  // (IMAP on, but no password generated yet)
  await Aliases.updateOne({ _id: alias._id }, { $set: { tokens: [] } });

  // (only the new name is asked for)
  const fields = await getCloneForm(t);
  t.true(fields.includes('name'));
  t.false(fields.includes('password'));

  const res = await post(t, { name: 'copy' });
  t.is(res.status, 200);

  const copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .select('+tokens.hash +tokens.salt')
    .lean()
    .exec();
  t.true(copy.has_imap);
  t.deepEqual(copy.tokens, []);
  t.is(copy.description, 'Template mailbox');
  t.deepEqual(copy.labels, ['template']);
  t.is(await t.context.countQueued(), 0);

  const page = await web.get(`/en/my-account/domains/${domain.name}/aliases`);
  t.true(page.text.includes('was cloned to'));
});

test('a name that is taken or not allowed is refused', async (t) => {
  const { alias, domain, pass } = t.context;
  await fillMailbox(t);

  let res = await post(t, { name: alias.name, password: pass });
  t.is(res.status, 400);
  res = await post(t, { name: '*', password: pass });
  t.is(res.status, 400);
  res = await post(t, { name: '/^.*$/', password: pass });
  t.is(res.status, 400);
  res = await post(t, { name: 'a+b', password: pass });
  t.is(res.status, 400);

  t.is(await Aliases.countDocuments({ domain: domain._id }), 1);
  t.is(await t.context.countQueued(), 0);
});

test('nothing is kept of a clone that could not be started', async (t) => {
  const { alias, domain, pass } = t.context;
  await fillMailbox(t);
  await SieveScripts.create({
    alias: alias._id,
    user: t.context.user._id,
    domain: domain._id,
    name: 'filters',
    content: 'keep;\r\n'
  });

  // (another alias of the domain is being cloned)
  await t.context.sqlite.client.set(`clone_check:${domain.id}`, 'other');

  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 408);
  t.true(res.body.message.includes('already being cloned'));

  t.is(await Aliases.countDocuments({ domain: domain._id, name: 'copy' }), 0);
  t.is(await SieveScripts.countDocuments({ domain: domain._id }), 1);
  t.is(await t.context.countQueued(), 0);
});

test('an alias that was never signed in to is cloned at once', async (t) => {
  const { domain, pass } = t.context;
  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);
  t.is(await t.context.countQueued(), 0);

  const copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .lean()
    .exec();
  t.true(copy.has_imap);
});

test('the worker never copies over a mailbox of the clone', async (t) => {
  t.timeout(ms('3m'));
  const { domain, pass } = t.context;
  await fillMailbox(t);

  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);
  const [payload] = await t.context.getQueued();
  const copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .lean()
    .exec();

  // (IMAP was turned on and the clone signed in before the copy was done)
  await Aliases.updateOne({ _id: copy._id }, { $set: { has_imap: true } });
  const target = getPathToDatabase({
    id: copy.id,
    storage_location: copy.storage_location
  });
  fs.writeFileSync(target, 'existing');

  await clone(payload, t.context.sqlite.client);
  t.is(fs.readFileSync(target, 'utf8'), 'existing');

  // (nor while IMAP is still off, e.g. a mailbox left there before)
  await Aliases.updateOne({ _id: copy._id }, { $set: { has_imap: false } });
  await clone(payload, t.context.sqlite.client);
  t.is(fs.readFileSync(target, 'utf8'), 'existing');
  const unchanged = await Aliases.findById(copy._id).lean().exec();
  t.false(unchanged.has_imap);
  fs.rmSync(target, { force: true });

  // (another alias of the domain may be cloned now)
  t.is(await t.context.sqlite.client.get(`clone_check:${domain.id}`), null);
});

test.serial('a clone interrupted by a shutdown is run again', async (t) => {
  t.timeout(ms('3m'));
  const { domain, pass } = t.context;
  await fillMailbox(t);

  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);
  const [payload] = await t.context.getQueued();

  // (thrown to the worker, which puts the job back in the queue)
  setWorkerCancelled(true);
  try {
    await t.throwsAsync(clone(payload, t.context.sqlite.client), {
      instanceOf: ServerShutdownError
    });
  } finally {
    setWorkerCancelled(false);
  }

  // (nothing changed, and the domain is still claimed for it)
  let copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .lean()
    .exec();
  t.false(copy.has_imap);
  t.is(
    await t.context.sqlite.client.get(`clone_check:${domain.id}`),
    copy._id.toString()
  );

  await clone(payload, t.context.sqlite.client);
  copy = await Aliases.findById(copy._id).lean().exec();
  t.true(copy.has_imap);
  t.true(copy.storage_used > 0);
  t.is(await t.context.sqlite.client.get(`clone_check:${domain.id}`), null);
});

test('a clone is refused when the domain has no room for the copy', async (t) => {
  const { alias, domain, pass } = t.context;
  await fillMailbox(t);
  await Aliases.updateOne({ _id: alias._id }, { $set: { storage_used: 1000 } });
  await Domains.updateOne(
    { _id: domain._id },
    { $set: { max_quota_per_alias: 1500 } }
  );

  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 400);
  t.true(res.body.message.includes('not enough storage left'));
  t.is(await Aliases.countDocuments({ domain: domain._id, name: 'copy' }), 0);
  t.is(await t.context.countQueued(), 0);
  t.is(await t.context.sqlite.client.get(`clone_check:${domain.id}`), null);
});

test('a clone whose request was cut off is kept for the worker', async (t) => {
  t.timeout(ms('3m'));
  const { web, domain, pass } = t.context;
  await fillMailbox(t);
  t.context.dropConnection = true;

  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);
  let copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .lean()
    .exec();
  t.truthy(copy);
  t.false(copy.has_imap);

  // (its owner is told how to tell whether it was started)
  const page = await web.get(`/en/my-account/domains/${domain.name}/aliases`);
  t.true(page.text.includes('We could not confirm that cloning'));

  // (it was, and the worker copies it)
  t.is(await t.context.countQueued(), 1);
  const [payload] = await t.context.getQueued();
  await clone(payload, t.context.sqlite.client);
  copy = await Aliases.findById(copy._id).lean().exec();
  t.true(copy.has_imap);
});

test('the copy is not used once the clone has a new password', async (t) => {
  t.timeout(ms('3m'));
  const { domain, pass } = t.context;
  await fillMailbox(t);

  const res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);
  const [payload] = await t.context.getQueued();

  // (a password generated for the clone while its mailbox is copied, which
  // would not open the copy)
  const copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .exec();
  copy.tokens = [];
  await copy.createToken();
  await copy.save();

  await clone(payload, t.context.sqlite.client);
  const after = await Aliases.findById(copy._id).lean().exec();
  t.false(after.has_imap);
  t.false(
    fs.existsSync(
      getPathToDatabase({
        id: copy.id,
        storage_location: copy.storage_location
      })
    )
  );
  t.is(await t.context.sqlite.client.get(`clone_check:${domain.id}`), null);
});

test('a clone in progress keeps both aliases as they are until it is done', async (t) => {
  t.timeout(ms('3m'));
  const { api, alias, domain, pass } = t.context;
  const { client } = t.context.sqlite;
  await fillMailbox(t);

  let res = await post(t, { name: 'copy', password: pass });
  t.is(res.status, 200);
  const copy = await Aliases.findOne({ domain: domain._id, name: 'copy' })
    .lean()
    .exec();

  const token = t.context.user[config.userFields.apiToken];
  const v1 = (id) => `/v1/domains/${domain.name}/aliases/${id}`;
  async function isRefused(request) {
    const res = await request;
    t.is(res.status, 409);
    t.true(res.body.message.includes('is being cloned'));
  }

  async function checkRefused() {
    // neither alias gets a new password (the copy is encrypted with theirs)
    for (const id of [alias.id, copy.id])
      await isRefused(
        api
          .post(`${v1(id)}/generate-password`)
          .auth(token)
          .send({ password: pass })
      );
    // nor has IMAP turned off (the original) or on (the clone)
    await isRefused(
      api.put(v1(alias.id)).auth(token).send({ has_imap: false })
    );
    await isRefused(api.put(v1(copy.id)).auth(token).send({ has_imap: true }));
    // nor is the original deleted
    await isRefused(api.delete(v1(alias.id)).auth(token));
  }

  // while its job waits in the queue
  await checkRefused();
  // and while the worker runs it
  const payloadStr = await client.rpoplpush(CLONE_QUEUE, CLONE_PROCESSING_LIST);
  t.truthy(payloadStr);
  await checkRefused();

  // (nothing changed, and other changes are fine)
  const original = await Aliases.findById(alias._id)
    .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
    .lean()
    .exec();
  t.true(original.has_imap);
  t.false(original.is_rekey);
  t.true(await isValidPassword(original.tokens, pass, original));
  res = await api
    .put(v1(alias.id))
    .auth(token)
    .send({ description: 'Still the template' });
  t.is(res.status, 200);

  // once it is done, they are the owner's again
  await clone(JSON.parse(payloadStr), client);
  await finishCloneJob(client, payloadStr);
  res = await api.put(v1(copy.id)).auth(token).send({ has_imap: false });
  t.is(res.status, 200);
  res = await api.delete(v1(alias.id)).auth(token);
  t.is(res.status, 200);
});

test('only the owner of an alias or an admin of its domain can clone it', async (t) => {
  const { alias, domain, pass } = t.context;

  //
  // a team domain with a member, whose alias has a higher quota and SMTP
  // limit than new aliases get (set by an admin)
  //
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'team' } }
  );
  const password = falso.randPassword();
  let member = await t.context.userFactory.make();
  member = await Users.register(member, password);
  member[config.userFields.hasSetPassword] = true;
  member[config.userFields.hasVerifiedEmail] = true;
  member = await member.save();
  await Domains.updateOne(
    { _id: domain._id },
    {
      $set: { plan: 'team', alias_default_smtp_limit: 10 },
      $push: { members: { user: member._id, group: 'user' } }
    }
  );
  const memberAlias = await t.context.aliasFactory
    .withState({
      user: member._id,
      domain: domain._id,
      recipients: [member.email]
    })
    .create();
  const maxQuota = await Domains.getMaxQuota(domain._id);
  await Aliases.updateOne(
    { _id: memberAlias._id },
    { $set: { max_quota: maxQuota + 1, smtp_limit: 500 } }
  );

  // (signed in as the member)
  async function signInAs(user, password) {
    await utils.teardownWebServer(t);
    t.context.user = user;
    t.context.password = password;
    await utils.setupWebServer(t);
    await utils.loginUser(t);
  }

  const cloneOf = (id, body) =>
    t.context.web
      .post(`/en/my-account/domains/${domain.name}/aliases/${id}/clone`)
      .set('Accept', 'application/json')
      .send(body);

  await signInAs(member, password);

  // not an alias of someone else, even with its password
  let res = await cloneOf(alias.id, { name: 'not-mine', password: pass });
  t.is(res.status, 404);
  t.is(await Aliases.countDocuments({ name: 'not-mine' }), 0);

  // their own, with limits no higher than new aliases get
  res = await cloneOf(memberAlias.id, { name: 'mine' });
  t.is(res.status, 200);
  const copy = await Aliases.findOne({ domain: domain._id, name: 'mine' })
    .lean()
    .exec();
  t.is(copy.user.toString(), member._id.toString());
  t.is(copy.max_quota, undefined);
  t.is(copy.smtp_limit, 10);

  // nor someone who is not a member of the domain
  const outsiderPassword = falso.randPassword();
  let outsider = await t.context.userFactory.make();
  outsider = await Users.register(outsider, outsiderPassword);
  outsider[config.userFields.hasSetPassword] = true;
  outsider[config.userFields.hasVerifiedEmail] = true;
  outsider = await outsider.save();
  await signInAs(outsider, outsiderPassword);
  for (const id of [alias.id, memberAlias.id]) {
    res = await cloneOf(id, { name: 'outsider', password: pass });
    t.true(res.status === 404 || res.status === 400, `${res.status}`);
  }

  t.is(await Aliases.countDocuments({ name: 'outsider' }), 0);
});
