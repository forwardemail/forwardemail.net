/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Logs of mail to a subdomain that inherited its root domain's forwarding
// (wildcard subdomain forwarding, `allow_subdomain_forwarding`) belong to the
// root domain: they are linked to it when parsed, and its admins see those
// recipients. Nobody else does, and a subdomain with records of its own (that
// did not inherit) is never shown to the root domain's admins.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const { Domains, Logs, Users } = require('#models');

const PAID = 'enhanced_protection';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function teamUser(t, user) {
  user.plan = 'team';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  user[config.userFields.hasVerifiedEmail] = true;
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  return user.save();
}

async function login(t, user) {
  t.context.user = user;
  await utils.loginUser(t);
}

test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  const register = async () => {
    const user = await Users.register(
      await t.context.userFactory.make(),
      t.context.password
    );
    user[config.userFields.hasSetPassword] = true;
    return teamUser(t, user);
  };

  t.context.admin = await register();
  t.context.member = await register();
  t.context.other = await register();
  await utils.setupWebServer(t);

  t.context.root = `wild-${randomUUID()}.com`;
  t.context.domain = await t.context.domainFactory
    .withState({
      name: t.context.root,
      members: [
        { user: t.context.admin._id, group: 'admin' },
        { user: t.context.member._id, group: 'user' }
      ],
      plan: 'team',
      allow_subdomain_forwarding: true,
      has_delivery_logs: true,
      skip_verification: true
    })
    .create();

  // a domain of another customer
  t.context.otherDomain = await t.context.domainFactory
    .withState({
      name: `other-${randomUUID()}.example.com`,
      members: [{ user: t.context.other._id, group: 'admin' }],
      plan: 'team',
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

// a log as stored once parsed
async function createLog(
  t,
  { domains, inherited_hosts, rcptTo, headers, info }
) {
  const _id = new mongoose.Types.ObjectId();
  const { insertedId } = await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    is_restricted: true,
    domains,
    inherited_hosts,
    domains_checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    message: 'delivered',
    meta: {
      level: 'info',
      app: { hostname: env.MX1_HOST },
      info,
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'sender@sender.example.net' },
          rcptTo: rcptTo.map((address) => ({ address }))
        },
        headers: { Subject: 'Hello', ...headers }
      }
    }
  });
  return insertedId.toString();
}

//
// parsing (which domains a log is linked to)
//

// a stub DNS resolver with TXT records by host (others have none)
function createResolver(txt) {
  const lookups = [];
  return {
    lookups,
    async resolveTxt(name) {
      lookups.push(name);
      if (txt[name] instanceof Error) throw txt[name];
      if (txt[name]) return txt[name].map((str) => [str]);
      const err = new Error(`queryTxt ENODATA ${name}`);
      err.code = 'ENODATA';
      throw err;
    }
  };
}

// a domain as it is stored
async function insertDomain(fields) {
  const _id = new mongoose.Types.ObjectId();
  await Domains.collection.insertOne({
    _id,
    id: _id.toString(),
    plan: PAID,
    allow_subdomain_forwarding: true,
    has_delivery_logs: true,
    verification_record: randomUUID(),
    ...fields
  });
  return Domains.findById(_id).lean().exec();
}

function parse(resolver, { message = 'delivered', mailFrom, rcptTo }) {
  return Logs.parseLog({
    resolver,
    is_restricted: true,
    domains: [],
    message,
    meta: {
      session: {
        envelope: {
          mailFrom: { address: mailFrom || 'sender@sender.example.net' },
          rcptTo: rcptTo.map((address) => ({ address }))
        }
      }
    }
  });
}

const verification = (domain) =>
  `${config.recordPrefix}-site-verification=${domain.verification_record}`;

const ids = (log) => log.domains.map((id) => id.toString()).sort();

test('a subdomain without records is linked to its opted in root domain', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root });
  const resolver = createResolver({
    [root]: [verification(domain)]
  });
  const log = await parse(resolver, { rcptTo: [`hello@anything.${root}`] });
  t.deepEqual(ids(log), [domain._id.toString()]);
  t.deepEqual(log.inherited_hosts, [`anything.${root}`]);
});

test('a delivered log is not linked when the root domain has delivery logs off', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root, has_delivery_logs: false });
  const resolver = createResolver({
    [root]: [verification(domain)]
  });
  const delivered = await parse(resolver, {
    rcptTo: [`hello@anything.${root}`]
  });
  t.deepEqual(delivered.domains, []);
  t.is(delivered.inherited_hosts, undefined);

  // (an error is linked regardless, as for any domain)
  const error = await parse(resolver, {
    message: 'error',
    rcptTo: [`hello@anything.${root}`]
  });
  t.deepEqual(ids(error), [domain._id.toString()]);
});

test('a root domain that did not opt in is not looked up nor linked', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({
    name: root,
    allow_subdomain_forwarding: false
  });
  const resolver = createResolver({
    [root]: [verification(domain)]
  });
  const log = await parse(resolver, { rcptTo: [`hello@anything.${root}`] });
  t.deepEqual(log.domains, []);
  t.false(resolver.lookups.includes(root));
});

test('a same-named domain not verified at the root is not linked', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  // (another account's domain of the same name, opted in but not verified)
  await insertDomain({ name: root });
  const resolver = createResolver({
    [root]: [verification({ verification_record: randomUUID() })]
  });
  const log = await parse(resolver, { rcptTo: [`hello@anything.${root}`] });
  t.deepEqual(log.domains, []);
});

test('a root domain publishing several verification values is not linked', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root });
  const resolver = createResolver({
    [root]: [
      verification(domain),
      verification({ verification_record: randomUUID() })
    ]
  });
  const log = await parse(resolver, { rcptTo: [`hello@anything.${root}`] });
  t.deepEqual(log.domains, []);
});

test('a subdomain with forwarding records of its own does not inherit', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root });
  const sub = await insertDomain({ name: `own.${root}` });
  const resolver = createResolver({
    [root]: [verification(domain)],
    [`free.${root}`]: [`${config.recordPrefix}=hello@destination.example.net`],
    [`own.${root}`]: [verification(sub)]
  });

  const free = await parse(resolver, { rcptTo: [`hello@free.${root}`] });
  t.deepEqual(free.domains, []);

  const own = await parse(resolver, { rcptTo: [`hello@own.${root}`] });
  t.deepEqual(ids(own), [sub._id.toString()]);
  t.is(own.inherited_hosts, undefined);
});

test('only recipients inherit (not the sender)', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root });
  const resolver = createResolver({
    [root]: [verification(domain)]
  });
  const log = await parse(resolver, {
    message: 'error',
    mailFrom: `hello@anything.${root}`,
    rcptTo: ['someone@destination.example.net']
  });
  t.deepEqual(log.domains, []);
});

test('several subdomains of one root domain link it once', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root });
  const resolver = createResolver({
    [root]: [verification(domain)]
  });
  const log = await parse(resolver, {
    rcptTo: [`a@one.${root}`, `b@two.${root}`, `c@${root}`]
  });
  t.deepEqual(ids(log), [domain._id.toString()]);
  t.deepEqual(log.inherited_hosts.sort(), [`one.${root}`, `two.${root}`]);
  // (once for the root domain itself, once for its inherited domain)
  t.is(resolver.lookups.filter((name) => name === root).length, 2);
});

test('a failed root domain lookup does not unlink the other recipients', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  await insertDomain({ name: root });
  const other = await insertDomain({
    name: `other-${randomUUID()}.example.com`
  });
  const timeout = new Error(`queryTxt ETIMEOUT ${root}`);
  timeout.code = 'ETIMEOUT';
  const resolver = createResolver({
    [root]: timeout,
    [other.name]: [verification(other)]
  });

  const log = await parse(resolver, {
    message: 'error',
    rcptTo: [`hello@anything.${root}`, `bob@${other.name}`]
  });
  t.deepEqual(ids(log), [other._id.toString()]);
  t.is(log.inherited_hosts, undefined);

  // (a log with no other domain is left to be parsed again)
  const alone = await parse(resolver, {
    message: 'error',
    rcptTo: [`hello@anything.${root}`]
  });
  t.deepEqual(alone.domains, []);
  t.is(alone.domains_checked_at, undefined);
});

test('a delivered log of an inherited subdomain is saved', async (t) => {
  const root = `wild-${randomUUID()}.com`;
  const domain = await insertDomain({ name: root });
  const resolver = createResolver({
    [root]: [verification(domain)]
  });
  const log = new Logs({
    message: 'delivered',
    is_restricted: true,
    meta: {
      level: 'info',
      app: { hostname: env.MX1_HOST },
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'sender@sender.example.net' },
          rcptTo: [{ address: `hello@anything.${root}` }]
        }
      }
    }
  });
  log.resolver = resolver;
  log.skip_duplicate_check = true;
  await log.save();
  const saved = await Logs.findById(log._id).lean().exec();
  t.deepEqual(ids(saved), [domain._id.toString()]);
  t.deepEqual(saved.inherited_hosts, [`anything.${root}`]);
});

//
// viewing (who sees the recipients of inherited subdomains)
//

test('an admin of the root domain sees recipients of inherited subdomains', async (t) => {
  const { root, domain } = t.context;
  const id = await createLog(t, {
    domains: [domain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`]
  });
  await login(t, t.context.admin);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes(`hello@anything.${root}`));

  const list = await t.context.web.get('/en/my-account/logs');
  t.is(list.status, 200);
  t.true(list.text.includes(`hello@anything.${root}`));
});

test('a subdomain that did not inherit is not shown to the root domain’s admins', async (t) => {
  const { root, domain } = t.context;
  const id = await createLog(t, {
    domains: [domain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`, `private@separate.${root}`]
  });
  await login(t, t.context.admin);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes(`hello@anything.${root}`));
  t.false(res.text.includes(`private@separate.${root}`));

  const list = await t.context.web.get('/en/my-account/logs');
  t.false(list.text.includes(`private@separate.${root}`));
});

test('another customer does not see recipients of inherited subdomains', async (t) => {
  const { root, domain, otherDomain } = t.context;
  const id = await createLog(t, {
    domains: [domain._id, otherDomain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`, `bob@${otherDomain.name}`]
  });
  await login(t, t.context.other);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes(`bob@${otherDomain.name}`));
  t.false(res.text.includes(`hello@anything.${root}`));

  const list = await t.context.web.get('/en/my-account/logs');
  t.false(list.text.includes(`hello@anything.${root}`));
});

test('an admin of a same-named domain not linked to the log cannot see it', async (t) => {
  const { root, domain } = t.context;
  // (another account's domain of the same name, never verified)
  await t.context.domainFactory
    .withState({
      name: root,
      members: [{ user: t.context.other._id, group: 'admin' }],
      plan: 'team',
      allow_subdomain_forwarding: true,
      skip_verification: true
    })
    .create();
  const id = await createLog(t, {
    domains: [domain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`]
  });
  await login(t, t.context.other);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 400);
  t.false(res.text.includes(`hello@anything.${root}`));

  const list = await t.context.web.get('/en/my-account/logs');
  t.false(list.text.includes(`hello@anything.${root}`));
});

test('a member of the root domain does not see recipients of inherited subdomains', async (t) => {
  const { root, domain } = t.context;
  await t.context.aliasFactory
    .withState({
      name: 'hello',
      user: t.context.member._id,
      domain: domain._id,
      recipients: ['my-inbox@destination.example.net']
    })
    .create();
  const id = await createLog(t, {
    domains: [domain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`]
  });
  await login(t, t.context.member);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 400);
  t.false(res.text.includes(`hello@anything.${root}`));
});

test('an admin of the root domain sees only inherited Bcc recipients', async (t) => {
  const { root, domain } = t.context;
  const id = await createLog(t, {
    domains: [domain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`, `private@separate.${root}`],
    headers: { Bcc: `hello@anything.${root}, private@separate.${root}` }
  });
  await login(t, t.context.admin);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes(`hello@anything.${root}`));
  t.false(res.text.includes(`private@separate.${root}`));
});

test('an admin of the root domain does not see where another customer’s alias forwards', async (t) => {
  const { root, domain, otherDomain } = t.context;
  const id = await createLog(t, {
    domains: [domain._id, otherDomain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`, `bob@${otherDomain.name}`],
    info: {
      accepted: ['private-inbox@destination.example.net'],
      envelope: { to: ['private-inbox@destination.example.net'] },
      forwardedFor: `bob@${otherDomain.name}`,
      response: '250 2.0.0 OK queued for private-inbox@destination.example.net'
    }
  });
  await login(t, t.context.admin);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.false(res.text.includes('private-inbox@destination.example.net'));
  t.false(res.text.includes(`bob@${otherDomain.name}`));

  const list = await t.context.web.get('/en/my-account/logs');
  t.false(list.text.includes('private-inbox@destination.example.net'));
});

test('a forwarding destination of an inherited recipient is shown to the root domain’s admins', async (t) => {
  const { root, domain } = t.context;
  const id = await createLog(t, {
    domains: [domain._id],
    inherited_hosts: [`anything.${root}`],
    rcptTo: [`hello@anything.${root}`],
    info: {
      accepted: ['my-inbox@destination.example.net'],
      envelope: { to: ['my-inbox@destination.example.net'] },
      forwardedFor: `hello@anything.${root}`,
      response: '250 2.0.0 OK'
    }
  });
  await login(t, t.context.admin);

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes('my-inbox@destination.example.net'));
});
