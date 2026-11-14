/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { pathToFileURL } = require('node:url');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const Domains = require('#models/domains');
const TunnelWebSocketHandler = require('#helpers/tunnel-websocket-handler');
const config = require('#config');

// the Mail Server Tunnel through the REST API (see ./index.js for delivery)

const TOOL = path.join(__dirname, '..', '..', 'tools', 'mail-server-tunnel');
const toolImport = (file) => import(pathToFileURL(path.join(TOOL, file)).href);

test.before(utils.setupMongoose);
test.before(utils.setupApiServer);
test.before((t) => {
  t.context.tunnelHandler = new TunnelWebSocketHandler({
    server: t.context._api.server,
    client: t.context.client
  });
  t.context.wsHandler.hasTunnel = true;
});
test.after.always(async (t) => {
  if (t.context.tunnelHandler) await t.context.tunnelHandler.close();
});
test.after.always(utils.teardownApiServer);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function createUser(t, plan) {
  const user = await t.context.userFactory
    .withState({
      plan,
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  if (plan !== 'free')
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
  return user;
}

test('the tunnel setting, its status and IMAP commands through the API', async (t) => {
  const user = await createUser(t, 'enhanced_protection');
  const token = user[config.userFields.apiToken];
  const name = 'tunnel-api-test.com';
  const call = (method, url, body) =>
    t.context.api[method](url)
      .auth(token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(body);

  let res = await call('post', '/v1/domains', { domain: name });
  t.is(res.status, 200);
  t.false(res.body.has_tunnel);

  // off until the owner turns it on
  res = await call('get', `/v1/domains/${name}/tunnel`);
  t.is(res.status, 200);
  t.like(res.body, { has_tunnel: false, is_online: false });
  res = await call('post', `/v1/domains/${name}/tunnel/imap`, {
    command: 'list',
    username: 'user',
    password: 'pass'
  });
  t.is(res.status, 400);

  // turned on with the API (what the app's setup does)
  res = await call('put', `/v1/domains/${name}`, { has_tunnel: true });
  t.is(res.status, 200);
  t.true(res.body.has_tunnel);
  const saved = await Domains.findOne({ name }).lean();
  t.true(saved.has_tunnel);

  // not for a domain that its DNS TXT record does not verify yet
  res = await call('post', `/v1/domains/${name}/tunnel/imap`, {
    command: 'list',
    username: 'user',
    password: 'pass'
  });
  t.is(res.status, 400);
  t.regex(res.body.message, /not verified/);
  await Domains.updateOne({ name }, { $set: { has_txt_record: true } });

  // no app is connected yet
  res = await call('get', `/v1/domains/${name}/tunnel`);
  t.like(res.body, { has_tunnel: true, is_online: false });
  res = await call('post', `/v1/domains/${name}/tunnel/imap`, {
    command: 'list',
    username: 'user',
    password: 'pass'
  });
  t.is(res.status, 503);

  // the app connects
  const [{ TunnelClient }, { loadConfig }] = await Promise.all([
    toolImport('lib/client.js'),
    toolImport('lib/config.js')
  ]);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tunnel-api-'));
  const app = new TunnelClient(
    loadConfig({
      directory,
      env: {},
      overrides: {
        token,
        apiUrl: t.context.apiURL,
        domains: name,
        'probe.interval': '0',
        'notify.desktop': 'false'
      }
    }),
    { logger: { debug() {}, info() {}, warn() {}, error() {} } }
  );
  t.teardown(async () => {
    await app.stop();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  app.start();
  await pWaitFor(() => app.state === 'connected', { timeout: ms('15s') });

  res = await call('get', `/v1/domains/${name}/tunnel`);
  t.like(res.body, { has_tunnel: true, is_online: true, has_imap: false });
  t.is(res.body.platform, process.platform);

  // remote mailbox access is off in the app, which the API passes on
  res = await call('post', `/v1/domains/${name}/tunnel/imap`, {
    command: 'list',
    username: 'user',
    password: 'pass'
  });
  t.is(res.status, 403);
  t.regex(res.body.message, /Remote mailbox access is turned off/);

  // what a request must hold
  res = await call('post', `/v1/domains/${name}/tunnel/imap`, {
    command: 'list'
  });
  t.is(res.status, 400);
  res = await call('post', `/v1/domains/${name}/tunnel/imap`, {
    command: 'list',
    username: 'user',
    password: 'pass',
    args: 'INBOX'
  });
  t.is(res.status, 400);

  // someone else's token reaches neither the status nor the mailbox
  const other = await createUser(t, 'enhanced_protection');
  res = await t.context.api
    .get(`/v1/domains/${name}/tunnel`)
    .auth(other[config.userFields.apiToken]);
  t.is(res.status, 404);

  // a custom SMTP port and the tunnel are not set together, either way
  res = await call('put', `/v1/domains/${name}`, { smtp_port: '2525' });
  t.is(res.status, 400);
  t.regex(res.body.message, /cannot both be set/);
  let saved2 = await Domains.findOne({ name }).lean();
  t.is(saved2.smtp_port, '25');
  res = await call('put', `/v1/domains/${name}`, { has_tunnel: false });
  t.is(res.status, 200);
  res = await call('put', `/v1/domains/${name}`, { smtp_port: '2525' });
  t.is(res.status, 200);
  res = await call('put', `/v1/domains/${name}`, { has_tunnel: true });
  t.is(res.status, 400);
  saved2 = await Domains.findOne({ name }).lean();
  t.false(saved2.has_tunnel);
  res = await call('put', `/v1/domains/${name}`, {
    smtp_port: '25',
    has_tunnel: true
  });
  t.is(res.status, 200);

  // turned off again: the domain is no longer served
  res = await call('put', `/v1/domains/${name}`, { has_tunnel: false });
  t.false(res.body.has_tunnel);
});
