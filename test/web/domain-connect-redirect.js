/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// POST /domain-connect sends the browser to the urlSyncUX that the domain's
// Domain Connect provider gives in its settings. The provider is whatever
// server the domain's _domainconnect TXT record points to, which any domain
// owner can set: it is followed when it is an HTTPS URL on a public host,
// of a provider we list, or of any provider that has our template when a
// signed-in member of the domain asks (a form on another site cannot, so it
// cannot send the browser to a page it chose).
//
// The DNS-over-HTTPS lookup of the _domainconnect record is answered by an
// undici MockAgent, and the requests to the provider by a stand-in for
// #helpers/safe-fetch (installed before the web server loads it).
//

const ms = require('ms');
const test = require('ava');
const {
  MockAgent,
  getGlobalDispatcher,
  setGlobalDispatcher
} = require('undici');

// (a public address, so it passes the private host checks without DNS)
const PROVIDER = '93.184.216.34';

let settings;
const SAFE_FETCH_PATH = require.resolve('#helpers/safe-fetch');
require.cache[SAFE_FETCH_PATH] = {
  id: SAFE_FETCH_PATH,
  filename: SAFE_FETCH_PATH,
  loaded: true,
  async exports(url) {
    const json = async () => (url.endsWith('/settings') ? settings : {});
    return { statusCode: 200, headers: {}, body: { json } };
  }
};

const utils = require('../utils');
const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  await utils.setupWebServer(t);
  t.context.dispatcher = getGlobalDispatcher();
  const agent = new MockAgent();
  agent
    .get('https://cloudflare-dns.com')
    .intercept({ path: /^\/dns-query/, method: 'GET' })
    .reply(200, { Answer: [{ data: `"${PROVIDER}"` }] })
    .persist();
  setGlobalDispatcher(agent);
});
test.afterEach.always(async (t) => {
  setGlobalDispatcher(t.context.dispatcher);
  await utils.teardownWebServer(t);
});

function connect(t) {
  return t.context.web
    .post('/en/domain-connect')
    .set('Accept', 'application/json')
    .send({ domain: 'example.com' });
}

async function spoofA(t, host, address) {
  const { resolver } = t.context._web.app.context;
  await resolver.options.cache.mset(
    new Map([
      [`a:${host}`, resolver.spoofPacket(host, 'A', [address], true, ms('5m'))]
    ])
  );
}

// (a member of example.com, signed in)
async function signInAsMember(t) {
  t.context.password = 'Sup3r-L0ng-P4ssw0rd!x';
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await t.context.domainFactory
    .withState({
      name: 'example.com',
      members: [{ user: user._id, group: 'admin' }],
      plan: 'free',
      skip_verification: true
    })
    .create();
  await utils.loginUser(t);
}

test('does not send anyone else to a provider that is not one we list', async (t) => {
  await spoofA(t, 'dns.provider-for-tests.net', '93.184.216.35');
  settings = {
    urlSyncUX: 'https://dns.provider-for-tests.net/sync',
    urlAPI: `https://${PROVIDER}`
  };
  const res = await connect(t);
  t.is(res.status, 200);
  t.falsy(res.body.applyUrl);
});

test('sends a member of the domain to a provider that is not one we list', async (t) => {
  await signInAsMember(t);
  await spoofA(t, 'dns.provider-for-tests.net', '93.184.216.35');
  settings = {
    urlSyncUX: 'https://dns.provider-for-tests.net/sync',
    urlAPI: `https://${PROVIDER}`
  };
  const res = await connect(t);
  t.is(res.status, 200);
  t.true(
    res.body.applyUrl.startsWith(
      'https://dns.provider-for-tests.net/sync/v2/domainTemplates/providers/'
    ),
    `${res.body.applyUrl}`
  );
});

test('does not send the browser to a page that is not HTTPS', async (t) => {
  settings = {
    urlSyncUX: 'http://dns.provider-for-tests.net/sync',
    urlAPI: `https://${PROVIDER}`
  };
  const res = await connect(t);
  t.is(res.status, 200);
  t.falsy(res.body.applyUrl);
});

test('sends the browser to a known provider host', async (t) => {
  await spoofA(t, 'dash.cloudflare.com', '104.16.123.96');

  settings = {
    urlSyncUX: 'https://dash.cloudflare.com/domainconnect',
    urlAPI: `https://${PROVIDER}`
  };
  const res = await connect(t);
  t.is(res.status, 200);
  t.true(
    res.body.applyUrl.startsWith(
      'https://dash.cloudflare.com/domainconnect/v2/domainTemplates/providers/'
    ),
    `${res.body.applyUrl}`
  );
});

test('does not send anyone else to another host of a provider we list', async (t) => {
  // (a site of anyone, on a domain of a provider we list)
  await spoofA(t, 'someone.squarespace.com', '93.184.216.36');
  settings = {
    urlSyncUX: 'https://someone.squarespace.com',
    urlAPI: `https://${PROVIDER}`
  };
  const res = await connect(t);
  t.is(res.status, 200);
  t.falsy(res.body.applyUrl);
});
