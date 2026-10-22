/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Ubuntu SSO only ever talks to Ubuntu One: a request cannot choose the
// OpenID provider the server fetches and trusts (which would let anyone
// make the server fetch any URL, and assert any email address to sign in
// to that account).
//

const http = require('node:http');
const process = require('node:process');
const querystring = require('node:querystring');
const { randomUUID } = require('node:crypto');

const test = require('ava');

process.env.AUTH_UBUNTU_ENABLED = 'true';

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.before(async (t) => {
  // a server that counts every request the web server makes to it
  t.context.hits = [];
  const server = http.createServer((req, res) => {
    t.context.hits.push(`${req.method} ${req.url}`);
    res.writeHead(404).end();
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.context.server = server;
  t.context.origin = `http://127.0.0.1:${server.address().port}`;
});
test.after.always(async (t) => {
  await new Promise((resolve) => {
    t.context.server?.close(resolve);
  });
  await utils.teardownMongoose();
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.hits.length = 0;
  t.context.victim = await t.context.userFactory
    .withState({ email: `victim-${randomUUID()}@example.com` })
    .create();
  await utils.setupWebServer(t);
});
test.afterEach.always(utils.teardownWebServer);

function assertion(t, overrides = {}) {
  const id = `${t.context.origin}/id`;
  return {
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'id_res',
    'openid.op_endpoint': `${t.context.origin}/op`,
    'openid.claimed_id': id,
    'openid.identity': id,
    'openid.return_to': process.env.UBUNTU_CALLBACK_URL,
    'openid.response_nonce': `${new Date().toISOString().slice(0, 19)}Z0`,
    'openid.assoc_handle': '1',
    'openid.ns.sreg': 'http://openid.net/extensions/sreg/1.1',
    'openid.sreg.nickname': 'someone',
    'openid.sreg.email': t.context.victim.email,
    'openid.signed':
      'op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle,ns.sreg,sreg.nickname,sreg.email',
    'openid.sig': 'c2ln',
    ...overrides
  };
}

async function isLinked(t) {
  const user = await Users.findById(t.context.victim._id).lean().exec();
  return Boolean(user[config.passport.fields.ubuntuProfileID]);
}

// the stubbed check of an assertion with its provider (see below)
function stubVerification(t) {
  const strategy = t.context._web.passport._strategy('ubuntu');
  const verified = [];
  strategy._relyingParty.verifyAssertion = (url, fn) => {
    verified.push(new URL(url, 'http://localhost').searchParams);
    fn(new Error('not reachable in tests'));
  };

  return verified;
}

test('an assertion from another provider is refused', async (t) => {
  const get = await t.context.web
    .get(`/auth/ubuntu/ok?${querystring.stringify(assertion(t))}`)
    .set('Accept', 'application/json');
  // (sent back to sign in, see web.auth.catchError)
  t.is(get.body.redirectTo, '/en/login');

  const post = await t.context.web
    .post('/auth/ubuntu/ok')
    .set('Accept', 'application/json')
    .type('form')
    .send(querystring.stringify(assertion(t)));
  t.is(post.body.redirectTo, '/en/login');

  t.deepEqual(t.context.hits, []);
  t.false(await isLinked(t));
});

test('an Ubuntu One identity with another provider endpoint is refused', async (t) => {
  const verified = stubVerification(t);
  const id = 'https://login.ubuntu.com/+id/abc123';
  const res = await t.context.web
    .get(
      `/auth/ubuntu/ok?${querystring.stringify(
        assertion(t, { 'openid.claimed_id': id, 'openid.identity': id })
      )}`
    )
    .set('Accept', 'application/json');
  t.is(res.body.redirectTo, '/en/login');
  t.is(verified.length, 0);
  t.deepEqual(t.context.hits, []);
});

test('signing in cannot start at another provider', async (t) => {
  const identifier = `${t.context.origin}/start`;
  const post = await t.context.web
    .post('/auth/ubuntu')
    .set('Accept', 'application/json')
    .type('form')
    .send(querystring.stringify({ openid_identifier: identifier }));
  t.is(post.status, 400);

  const get = await t.context.web
    .get(
      `/auth/ubuntu?${querystring.stringify({ openid_identifier: identifier })}`
    )
    .set('Accept', 'application/json');
  t.is(get.body.redirectTo, '/en/login');

  // (nor at a callback without an assertion)
  const callback = await t.context.web
    .post('/auth/ubuntu/ok')
    .set('Accept', 'application/json')
    .type('form')
    .send(querystring.stringify({ openid_identifier: identifier }));
  t.is(callback.body.redirectTo, '/en/login');

  // (passport-openid reads an identifier from a body whatever the method, and
  //  a POST can be turned into a GET with `_method`)
  const form = querystring.stringify({ openid_identifier: identifier });
  await t.context.web
    .get('/auth/ubuntu')
    .set('Accept', 'application/json')
    .type('form')
    .send(form);
  await t.context.web
    .get('/auth/ubuntu/ok')
    .set('Accept', 'application/json')
    .send({ openid_identifier: identifier });
  await t.context.web
    .post('/auth/ubuntu/ok')
    .set('Accept', 'application/json')
    .type('form')
    .send(`_method=GET&${form}`);
  await t.context.web
    .post('/auth/ubuntu')
    .set('Accept', 'application/json')
    .send({ openid_identifier: identifier });

  t.deepEqual(t.context.hits, []);
});

test('an assertion from Ubuntu One is verified as before', async (t) => {
  // (the assertion is checked with Ubuntu One, which is not reachable here,
  //  so the check is stubbed to see that the assertion gets to it)
  const verified = stubVerification(t);

  const id = 'https://login.ubuntu.com/+id/abc123';
  await t.context.web
    .get(
      `/auth/ubuntu/ok?${querystring.stringify(
        assertion(t, {
          'openid.op_endpoint': 'https://login.ubuntu.com/+openid',
          'openid.claimed_id': id,
          'openid.identity': id
        })
      )}`
    )
    .set('Accept', 'application/json');
  t.is(verified.length, 1);
  t.deepEqual(verified[0].getAll('openid.claimed_id'), [id]);
  t.is(verified[0].get('openid.claimed_id'), id);
  t.deepEqual(t.context.hits, []);
});

test('only an Ubuntu One identity gives an email address', async (t) => {
  const { passport } = t.context._web;
  const signIn = (claimedIdentifier) =>
    new Promise((resolve) => {
      // (passport-openid calls it with the identifier, profile, PAPE and done)
      passport.loginOrCreateProfile(Users, 'ubuntu')(
        claimedIdentifier,
        {
          claimedIdentifier,
          nickname: ['someone'],
          email: [t.context.victim.email]
        },
        {},
        (err, user) => {
          resolve({ err, user });
        }
      );
    });

  const other = await signIn(`${t.context.origin}/id`);
  t.is(other.err?.message, phrases.INVALID_EMAIL);
  t.false(await isLinked(t));

  const ubuntu = await signIn('https://login.ubuntu.com/+id/abc123');
  t.falsy(ubuntu.err);
  t.is(ubuntu.user.id, t.context.victim.id);
});
