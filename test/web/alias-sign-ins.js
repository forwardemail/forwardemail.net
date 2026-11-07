/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The recent sign-ins to an alias (service and IP address) are recorded on
// every successful sign-in and shown on the alias's page (see #531).
//

const { Buffer } = require('node:buffer');

const Client = require('nodemailer/lib/smtp-connection');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');
const SMTP = require('../../smtp-server');

const config = require('#config');
const createPassword = require('#helpers/create-password');
const { getSignIns, recordSignIn } = require('#helpers/alias-sign-ins');
const { Users } = require('#models');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(utils.setupApiServer);
test.beforeEach(async (t) => {
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
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  t.context.alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: t.context.domain._id,
      recipients: [t.context.user.email],
      has_imap: true
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

  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);
test.afterEach.always(utils.teardownApiServer);

function auth(t, password) {
  const { alias, domain } = t.context;
  return `Basic ${Buffer.from(
    `${alias.name}@${domain.name}:${password}`
  ).toString('base64')}`;
}

test('a successful sign-in is recorded once for each IP address', async (t) => {
  const { api, client, alias, pass } = t.context;

  for (let i = 0; i < 3; i++) {
    const res = await api
      .get('/v1/account')
      .set('Authorization', auth(t, pass));
    t.is(res.status, 200);
  }

  // (recorded after the response, without delaying it)
  let signIns = [];
  for (let i = 0; i < 50 && signIns.length === 0; i++) {
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });

    signIns = await getSignIns(client, alias.id);
  }

  t.is(signIns.length, 1);
  t.is(signIns[0].service, 'api');
  t.is(signIns[0].remote_address, '127.0.0.1');
  t.true(Date.now() - signIns[0].date.getTime() < ms('1m'));
});

// (the sign-ins recorded after a moment, see above)
async function waitForSignIns(t, count) {
  let signIns = [];
  for (let i = 0; i < 50 && signIns.length < count; i++) {
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });

    signIns = await getSignIns(t.context.client, t.context.alias.id);
  }

  return signIns;
}

test('a sign-in with a catch-all password is not recorded for the alias', async (t) => {
  const { client, alias, domain, pass } = t.context;

  // (the domain-wide catch-all password signs in to SMTP as any address)
  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: t.context.user._id
  });
  domain.skip_verification = true;
  await domain.save();

  const smtp = new SMTP({ client }, true);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  await smtp.listen(port);
  t.teardown(() => smtp.close());

  async function login(pass) {
    const connection = new Client({
      port,
      host: IP_ADDRESS,
      secure: true,
      tls: { rejectUnauthorized: false }
    });
    await pify(connection.connect.bind(connection))();
    await pify(connection.login.bind(connection))({
      user: `${alias.name}@${domain.name}`,
      pass
    });
    connection.quit();
  }

  await login(password);
  t.deepEqual(await waitForSignIns(t, 1), []);

  // (its own password is)
  await login(pass);
  const signIns = await waitForSignIns(t, 1);
  t.is(signIns.length, 1);
  t.is(signIns[0].service, 'smtp');
});

test('a failed sign-in is not recorded', async (t) => {
  const { api, client, alias } = t.context;
  const res = await api
    .get('/v1/account')
    .set('Authorization', auth(t, 'wrong-password'));
  t.is(res.status, 401);
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });
  t.deepEqual(await getSignIns(client, alias.id), []);
});

test('the alias page shows its recent sign-ins', async (t) => {
  const { web, alias, domain } = t.context;
  const { client } = t.context._web.app.context;

  let res = await web.get(
    `/en/my-account/domains/${domain.name}/aliases/${alias.id}`
  );
  t.is(res.status, 200);
  t.true(res.text.includes('Recent Sign-Ins'));
  t.true(res.text.includes('was not signed in to in the last 7 days'));

  await recordSignIn(client, alias.id, 'imap', '::ffff:198.51.100.7');
  await recordSignIn(client, alias.id, 'smtp', '2001:db8::1');
  // (not an IP address, nor a known service)
  await recordSignIn(client, alias.id, 'imap', 'not-an-ip');
  await recordSignIn(client, alias.id, 'telnet', '198.51.100.8');

  res = await web.get(
    `/en/my-account/domains/${domain.name}/aliases/${alias.id}`
  );
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const rows = [...document.querySelectorAll('#recent-sign-ins tbody tr')].map(
    (tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent.trim())
  );
  t.is(rows.length, 2);
  // (newest first)
  t.deepEqual(
    rows.map((row) => row.slice(0, 2)),
    [
      ['SMTP', '2001:db8::1'],
      ['IMAP', '198.51.100.7']
    ]
  );
});

test('only the last 7 days and 50 sign-ins are kept', async (t) => {
  const { client, alias } = t.context;
  const key = `alias_sign_ins:${alias.id}`;
  await client.zadd(
    key,
    Date.now() - ms('8d'),
    JSON.stringify(['imap', '198.51.100.1'])
  );
  for (let i = 0; i < 60; i++) {
    await recordSignIn(client, alias.id, 'imap', `198.51.100.${i + 10}`);
  }

  const signIns = await getSignIns(client, alias.id);
  t.is(signIns.length, 50);
  t.false(signIns.some((s) => s.remote_address === '198.51.100.1'));
  t.is(await client.zcard(key), 50);
  const ttl = await client.pttl(key);
  t.true(ttl > 0 && ttl <= ms('7d'));
});
