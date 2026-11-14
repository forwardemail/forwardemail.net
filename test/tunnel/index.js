/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const util = require('node:util');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const { Writable } = require('node:stream');
const { pathToFileURL } = require('node:url');

//
// Captures the emails rendered by `#helpers/email` (see
// test/mx/partial-delivery.js), so that this must run before it is loaded.
//
const Email = require('email-templates');
const sinon = require('sinon');

const renderSpy = sinon.spy(Email.prototype, 'renderAll');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const WebSocket = require('ws');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Domains = require('#models/domains');
const TunnelWebSocketHandler = require('#helpers/tunnel-websocket-handler');
const checkTunnelAlerts = require('#helpers/check-tunnel-alerts');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');
const tunnel = require('#helpers/tunnel');
const { encrypt } = require('#helpers/encrypt-decrypt');

//
// End-to-end tests of the Mail Server Tunnel: a message sent to the MX
// server for a domain with a tunnel reaches a local mail server through the
// tunnel app itself (tools/mail-server-tunnel), connected to the API's
// WebSocket handler.
//
const TOOL = path.join(__dirname, '..', '..', 'tools', 'mail-server-tunnel');
const toolImport = (file) => import(pathToFileURL(path.join(TOOL, file)).href);

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const HOST = '127.0.0.1';

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.before((t) => {
  // ioredis-mock's TIME is not monotonic (see `setupApiServer` in ../utils)
  t.context.client.time = async () => {
    const now = Math.floor((performance.timeOrigin + performance.now()) * 1000);
    return [String(Math.floor(now / 1e6)), String(now % 1e6)];
  };
});
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  renderSpy.restore();
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  t.context.cleanup = [];
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort, HOST);
  // (where it listens: `localhost` can be ::1)
  const wsp = createWebSocketAsPromised({ port: sqlitePort, host: HOST });
  await wsp.open();
  t.context.wsp = wsp;
});

test.afterEach.always(async (t) => {
  for (const fn of t.context.cleanup.reverse()) {
    try {
      await fn();
    } catch {}
  }

  for (const key of ['wsp', 'sqlite']) {
    try {
      await t.context[key].close();
    } catch {}
  }
});

//
// A paid domain with the tunnel setting on, the MX server, the API's tunnel
// handler on an HTTP server of its own, and a local mail server that stores
// what it is sent. `rcptTo(address)` returns an error to refuse a recipient.
//
async function setup(t, { rcptTo = () => {}, hasTunnel = true } = {}) {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  const { resolver } = mx;
  await mx.listen(await getPort(), HOST);
  t.context.cleanup.push(
    () => pify(mx.server.close).bind(mx.server)(),
    () => tunnel.close(t.context.client)
  );

  const server = http.createServer((request, response) => {
    response.writeHead(404);
    response.end();
  });
  const handler = new TunnelWebSocketHandler({
    server,
    client: t.context.client
  });
  await new Promise((resolve) => {
    server.listen(0, HOST, resolve);
  });
  t.context.cleanup.push(async () => {
    await handler.close();
    server.close();
  });
  const apiUrl = `http://${HOST}:${server.address().port}`;

  // the local mail server behind the tunnel
  const received = [];
  const targetPort = await getPort();
  const target = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    logger: false,
    secure: false,
    onRcptTo(address, session, fn) {
      Promise.resolve(rcptTo(address.address.toLowerCase())).then((err) =>
        fn(err)
      );
    },
    onData(stream, session, fn) {
      const chunks = [];
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            chunks.push(chunk);
            next();
          }
        })
      );
      stream.on('end', () => {
        received.push({
          from: session.envelope.mailFrom.address,
          to: session.envelope.rcptTo.map((rcpt) => rcpt.address),
          raw: Buffer.concat(chunks).toString()
        });
        fn();
      });
    }
  });
  await pify(target.listen.bind(target))(targetPort, HOST);
  t.context.cleanup.push(() => pify(target.close.bind(target))());

  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: admin._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin.plan,
      kind: 'one-time'
    })
    .create();
  await admin.save();

  let domain = await t.context.domainFactory
    .withState({
      members: [{ user: admin._id, group: 'admin' }],
      plan: admin.plan,
      resolver
    })
    .create();
  domain = await Domains.findByIdAndUpdate(
    domain._id,
    { $set: { has_txt_record: true, has_tunnel: hasTunnel } },
    { new: true }
  );

  const map = new Map();
  const mxRecord = (name) =>
    resolver.spoofPacket(
      name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    );
  map.set('mx:test.com', mxRecord('test.com'));
  map.set(`mx:${domain.name}`, mxRecord(domain.name));
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  // (saving another domain of the same name replaces these, see
  // test/mx/partial-delivery.js)
  const spoofDns = () => resolver.options.cache.mset(map);
  await spoofDns();
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);
  await t.context.client.set(`allowlist:${HOST}`, true);

  // the tunnel app, as its owner runs it beside the local mail server
  const [{ TunnelClient }, { loadConfig }] = await Promise.all([
    toolImport('lib/client.js'),
    toolImport('lib/config.js')
  ]);
  const apps = [];
  async function startApp(overrides = {}) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tunnel-test-'));
    const appConfig = loadConfig({
      directory,
      env: {},
      overrides: {
        token: admin[config.userFields.apiToken],
        apiUrl,
        domains: domain.name,
        'local.host': HOST,
        'local.port': String(targetPort),
        'local.tls': 'none',
        'probe.interval': '0',
        'notify.desktop': 'false',
        'reconnect.minDelay': '50',
        'reconnect.maxDelay': '200',
        'reconnect.slowDelay': '60000',
        ...overrides
      }
    });
    const events = [];
    const app = new TunnelClient(appConfig, {
      logger: { debug() {}, info() {}, warn() {}, error() {} },
      notify: (event, message) => events.push({ event, message })
    });
    app.events = events;
    apps.push(app);
    app.start();
    return app;
  }

  t.context.cleanup.push(async () => {
    for (const app of apps) {
      await app.stop();
      fs.rmSync(app.config.directory, { recursive: true, force: true });
    }
  });

  async function send(names, id = randomUUID()) {
    const to = names.map((name) =>
      name.includes('@') ? name : `${name}@${domain.name}`
    );
    const conn = await asyncMxConnect({
      target: HOST,
      port: mx.server.address().port,
      dnsOptions: {
        resolve: util.callbackify(resolver.resolve.bind(resolver))
      }
    });
    const transporter = nodemailer.createTransport({
      logger,
      host: conn.host,
      port: conn.port,
      connection: conn.socket,
      ignoreTLS: true,
      secure: false,
      tls: { rejectUnauthorized: false }
    });
    return transporter.sendMail({
      envelope: { from: 'sender@test.com', to },
      raw: [
        `Message-ID: <${id}@test.com>`,
        `To: ${to.join(', ')}`,
        'From: Sender <sender@test.com>',
        'Subject: through the tunnel',
        `Date: ${new Date().toUTCString()}`,
        '',
        `Hello ${id}`,
        ''
      ].join('\r\n')
    });
  }

  const isConnected = (app) => app.state === 'connected';
  return {
    admin,
    apiUrl,
    domain,
    handler,
    isConnected,
    received,
    resolver,
    send,
    spoofDns,
    startApp
  };
}

test('delivers mail for a domain behind a tunnel to its local mail server', async (t) => {
  const ctx = await setup(t);
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });
  t.deepEqual(app.servedDomains, [ctx.domain.name]);
  t.true(await tunnel.isOnline(t.context.client, ctx.domain.id));

  const id = randomUUID();
  const info = await ctx.send(['hello'], id);
  t.deepEqual(info.accepted, [`hello@${ctx.domain.name}`]);

  t.is(ctx.received.length, 1);
  const [message] = ctx.received;
  t.is(message.from, 'sender@test.com');
  t.deepEqual(message.to, [`hello@${ctx.domain.name}`]);
  t.true(message.raw.includes(`Hello ${id}`));
  // (what the local server can trust about where the message came from)
  t.regex(message.raw, /^ARC-Seal:/m);
  t.regex(message.raw, /^ARC-Authentication-Results:/m);
  t.regex(message.raw, /^Received: from /m);
  t.is(app.stats.delivered, 1);
});

test('defers mail with 421 while the tunnel app is not connected', async (t) => {
  const ctx = await setup(t);
  const err = await t.throwsAsync(ctx.send(['hello']));
  t.is(err.responseCode, 421);
  t.regex(err.response, /not reachable right now, please try again later/);
  t.is(ctx.received.length, 0);

  // the same message is delivered once the app is connected
  const id = randomUUID();
  await t.throwsAsync(ctx.send(['again'], id));
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });
  const info = await ctx.send(['again'], id);
  t.deepEqual(info.accepted, [`again@${ctx.domain.name}`]);
  t.is(ctx.received.length, 1);
});

test('defers mail with 421 while the local mail server is down, and tells the app owner', async (t) => {
  const ctx = await setup(t);
  // (a port nothing listens on)
  const app = await ctx.startApp({ 'local.port': String(await getPort()) });
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  const err = await t.throwsAsync(ctx.send(['hello']));
  t.is(err.responseCode, 421);
  t.is(ctx.received.length, 0);
  t.true(app.events.some((event) => event.event === 'local_down'));

  // the API knows the local server is down (for the alert email)
  await pWaitFor(
    async () => {
      const value = await t.context.client.get(
        `${tunnel.ONLINE_PREFIX}${ctx.domain.id}`
      );
      return value && JSON.parse(value).local.state === 'down';
    },
    { timeout: ms('5s') }
  );
});

test('passes on a permanent rejection from the local mail server', async (t) => {
  const ctx = await setup(t, {
    rcptTo(address) {
      if (!address.startsWith('nobody@')) return;
      const err = new Error('5.1.1 No such user here');
      err.responseCode = 550;
      return err;
    }
  });
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  const err = await t.throwsAsync(ctx.send(['nobody']));
  t.is(err.responseCode, 550);
  t.regex(err.response, /No such user here/);
  t.is(ctx.received.length, 0);

  // another recipient of the same domain is still delivered
  const info = await ctx.send(['somebody']);
  t.deepEqual(info.accepted, [`somebody@${ctx.domain.name}`]);
  t.is(ctx.received.length, 1);
});

test('a mailbox of the domain keeps its own forwarding and is not tunneled', async (t) => {
  const ctx = await setup(t);
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  // an alias that is disabled answers for itself (the tunnel is only for
  // addresses that have no mailbox or forwarding here)
  await t.context.aliasFactory
    .withState({
      name: 'off',
      user: ctx.admin._id,
      domain: ctx.domain._id,
      recipients: ['someone@test.com'],
      is_enabled: false,
      error_code_if_disabled: 550
    })
    .create();
  const err = await t.throwsAsync(ctx.send(['off']));
  t.is(err.responseCode, 550);
  t.is(ctx.received.length, 0);

  // an address with a mailbox here is stored here, and not also handed to
  // the local mail server (which would refuse an address it does not know)
  await t.context.aliasFactory
    .withState({
      name: 'stored',
      user: ctx.admin._id,
      domain: ctx.domain._id,
      recipients: [],
      has_imap: true
    })
    .create();
  await ctx.send(['stored']).catch(() => {});
  t.is(ctx.received.length, 0);
  t.is(app.stats.delivered + app.stats.rejected + app.stats.deferred, 0);
});

test('a mailbox that lists the domain itself is delivered to its recipients and to the local mail server', async (t) => {
  const ctx = await setup(t);
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  // a webhook stands in for the mailbox's other recipient
  const hooks = [];
  const hook = http.createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      hooks.push(JSON.parse(body));
      response.end('ok');
    });
  });
  await new Promise((resolve) => {
    hook.listen(0, HOST, resolve);
  });
  t.context.cleanup.push(() => hook.close());

  await t.context.aliasFactory
    .withState({
      name: 'both',
      user: ctx.admin._id,
      domain: ctx.domain._id,
      recipients: [
        `http://${HOST}:${hook.address().port}/hook`,
        ctx.domain.name
      ]
    })
    .create();
  await t.context.aliasFactory
    .withState({
      name: 'elsewhere',
      user: ctx.admin._id,
      domain: ctx.domain._id,
      recipients: [`http://${HOST}:${hook.address().port}/hook`]
    })
    .create();

  const info = await ctx.send(['both']);
  t.deepEqual(info.accepted, [`both@${ctx.domain.name}`]);
  t.is(hooks.length, 1);
  t.is(ctx.received.length, 1);
  t.deepEqual(ctx.received[0].to, [`both@${ctx.domain.name}`]);

  // one that forwards elsewhere only is not handed to the local server
  await ctx.send(['elsewhere']);
  t.is(hooks.length, 2);
  t.is(ctx.received.length, 1);
});

test('does not serve a domain whose DNS TXT record does not verify it', async (t) => {
  const ctx = await setup(t);
  await Domains.findByIdAndUpdate(ctx.domain._id, {
    $set: { has_txt_record: false }
  });
  const app = await ctx.startApp();
  await pWaitFor(() => app.rejectedDomains.length > 0, { timeout: ms('10s') });
  t.is(app.rejectedDomains[0].code, 'NOT_VERIFIED');
  t.not(app.state, 'connected');
  t.false(await tunnel.isOnline(t.context.client, ctx.domain.id));
});

test('does not tunnel mail for a domain whose setting is off', async (t) => {
  const ctx = await setup(t, { hasTunnel: false });
  const app = await ctx.startApp();
  // the API refuses to serve the domain and says why
  await pWaitFor(() => app.rejectedDomains.length > 0, { timeout: ms('10s') });
  t.is(app.rejectedDomains[0].code, 'NOT_ENABLED');
  t.not(app.state, 'connected');
  t.false(await tunnel.isOnline(t.context.client, ctx.domain.id));

  const err = await t.throwsAsync(ctx.send(['hello']));
  t.is(err.responseCode, 550);
  t.is(ctx.received.length, 0);
});

test('refuses an app whose API token is wrong or is not an admin of the domain', async (t) => {
  const ctx = await setup(t);
  const wrong = await ctx.startApp({ token: 'f'.repeat(40) });
  await pWaitFor(
    () => wrong.events.some((event) => event.event === 'unauthorized'),
    { timeout: ms('10s') }
  );
  t.not(wrong.state, 'connected');

  const stranger = await t.context.userFactory
    .withState({ [config.userFields.hasVerifiedEmail]: true })
    .create();
  const other = await ctx.startApp({
    token: stranger[config.userFields.apiToken]
  });
  await pWaitFor(() => other.rejectedDomains.length > 0, {
    timeout: ms('10s')
  });
  t.is(other.rejectedDomains[0].code, 'NOT_FOUND');
  t.false(await tunnel.isOnline(t.context.client, ctx.domain.id));
});

test('another account that adds a domain of the same name gets none of its mail', async (t) => {
  const ctx = await setup(t);
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  // someone else adds the same name to an account of their own (which the
  // domain's DNS does not verify), turns the tunnel on and connects an app
  const intruder = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  const copy = await Domains.create({
    name: ctx.domain.name,
    plan: 'team',
    members: [{ user: intruder._id, group: 'admin' }],
    has_tunnel: true,
    // (as if it had been verified once, before the name's DNS changed hands)
    has_txt_record: true,
    skip_verification: true,
    resolver: ctx.resolver
  });
  t.not(copy.id, ctx.domain.id);
  await ctx.spoofDns();
  const other = await ctx.startApp({
    token: intruder[config.userFields.apiToken],
    'local.port': String(await getPort())
  });
  await pWaitFor(() => ctx.isConnected(other), { timeout: ms('10s') });

  // the owner's app is not replaced, and the mail still reaches the owner
  t.true(ctx.isConnected(app));
  t.false(app.events.some((event) => event.event === 'replaced'));
  const info = await ctx.send(['hello']);
  t.deepEqual(info.accepted, [`hello@${ctx.domain.name}`]);
  t.is(ctx.received.length, 1);
  t.is(app.stats.delivered, 1);
  t.is(other.stats.delivered + other.stats.deferred + other.stats.rejected, 0);
});

test('an app that floods the connection is ignored or disconnected, and mail still flows', async (t) => {
  const ctx = await setup(t);
  const socket = new WebSocket(
    `${ctx.apiUrl.replace('http', 'ws')}/v1/tunnel`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${ctx.admin[config.userFields.apiToken]}:`
        ).toString('base64')}`
      }
    }
  );
  const messages = [];
  socket.on('message', (data) => messages.push(JSON.parse(data.toString())));
  await new Promise((resolve) => {
    socket.on('open', resolve);
  });
  socket.send(
    JSON.stringify({ event: 'hello', protocol: 1, domains: [ctx.domain.name] })
  );
  await pWaitFor(() => messages.some((m) => m.event === 'ready'), {
    timeout: ms('10s')
  });

  // status messages beyond a few a minute are not written anywhere
  const [ws] = ctx.handler.wss.clients;
  const writes = [];
  const refresh = ctx.handler._refreshOnline.bind(ctx.handler);
  ctx.handler._refreshOnline = (...args) => {
    writes.push(args);
    return refresh(...args);
  };

  for (let i = 0; i < 200; i++)
    socket.send(
      JSON.stringify({
        event: 'status',
        domain: ctx.domain.name,
        local: 'down',
        message: `flood ${i}`
      })
    );
  await pWaitFor(() => ws.statusCount >= 200, { timeout: ms('10s') });
  t.is(writes.length, 30);
  ctx.handler._refreshOnline = refresh;

  // an answer to a request it was never sent is dropped
  socket.send(
    JSON.stringify({ event: 'result', id: 'not-a-request', accepted: ['x'] })
  );

  // a frame larger than anything it may send closes the connection
  const closed = new Promise((resolve) => {
    socket.on('close', (code) => resolve(code));
  });
  socket.send(
    JSON.stringify({ event: 'status', message: 'x'.repeat(2 * 1024 * 1024) })
  );
  t.is(await closed, 4400);
  await pWaitFor(
    async () => !(await tunnel.isOnline(t.context.client, ctx.domain.id)),
    { timeout: ms('10s') }
  );

  // the owner's real app connects and receives mail as usual
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });
  const info = await ctx.send(['hello']);
  t.deepEqual(info.accepted, [`hello@${ctx.domain.name}`]);
  t.is(ctx.received.length, 1);
});

test('a rejection worded by the app reaches the sender as one line of plain text', async (t) => {
  const ctx = await setup(t);
  const socket = new WebSocket(
    `${ctx.apiUrl.replace('http', 'ws')}/v1/tunnel`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${ctx.admin[config.userFields.apiToken]}:`
        ).toString('base64')}`
      }
    }
  );
  t.teardown(() => socket.terminate());
  let isReady = false;
  socket.on('message', (data, isBinary) => {
    if (!isBinary) {
      if (JSON.parse(data.toString()).event === 'ready') isReady = true;
      return;
    }

    const header = JSON.parse(
      data.subarray(4, 4 + data.readUInt32BE(0)).toString()
    );
    socket.send(
      JSON.stringify({
        event: 'result',
        id: header.id,
        accepted: [],
        rejected: [],
        error: {
          code: 'REJECTED',
          smtp_code: 550,
          response: `No such user\r\n250 OK\r\nMAIL FROM:<a@example.com>\u0000\u0007 ${'x'.repeat(
            2000
          )}`
        }
      })
    );
  });
  await new Promise((resolve) => {
    socket.on('open', resolve);
  });
  socket.send(
    JSON.stringify({ event: 'hello', protocol: 1, domains: [ctx.domain.name] })
  );
  await pWaitFor(() => isReady, { timeout: ms('10s') });

  const err = await t.throwsAsync(ctx.send(['somebody']));
  t.is(err.responseCode, 550);
  t.regex(err.response, /No such user 250 OK MAIL FROM/);
  // eslint-disable-next-line no-control-regex
  t.notRegex(err.response.replace(/\r?\n$/, ''), /[\u0000-\u001F]/);
  t.true(err.response.length < 700);
});

test('the last app to connect for a domain takes over', async (t) => {
  const ctx = await setup(t);
  const first = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(first), { timeout: ms('10s') });
  const second = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(second), { timeout: ms('10s') });
  await pWaitFor(() => first.state !== 'connected', { timeout: ms('10s') });
  t.true(first.events.some((event) => event.event === 'replaced'));

  await ctx.send(['hello']);
  t.is(second.stats.delivered, 1);
  t.is(first.stats.delivered, 0);
  t.is(ctx.received.length, 1);
});

test('stops serving a domain when its setting is turned off', async (t) => {
  const ctx = await setup(t);
  ctx.handler.accessCheckInterval = 0;
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  await Domains.findByIdAndUpdate(ctx.domain._id, {
    $set: { has_tunnel: false }
  });
  const [ws] = ctx.handler.wss.clients;
  await ctx.handler._checkAccess(ws);
  await pWaitFor(() => app.state !== 'connected', { timeout: ms('10s') });
  t.false(await tunnel.isOnline(t.context.client, ctx.domain.id));
});

test('answers an IMAP command through the tunnel only when the app allows it', async (t) => {
  const ctx = await setup(t);
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });

  const request = (command) =>
    tunnel.request(
      t.context.client,
      ctx.domain.id,
      {
        event: 'imap',
        domain: tunnel.getName(ctx.domain.name),
        command,
        args: {},
        auth: encrypt(JSON.stringify({ user: 'user', pass: 'pass' }))
      },
      { timeout: tunnel.IMAP_TIMEOUT }
    );

  // remote mailbox access is off unless the owner turns it on in the app
  let reply = await request('list');
  t.is(reply.error.code, 'IMAP_DISABLED');

  // turned on, the command reaches the app's own IMAP host (none here)
  app.config.imap.enabled = true;
  app.config.imap.port = await getPort();
  app.config.imap.secure = false;
  reply = await request('list');
  t.is(reply.error.code, 'LOCAL_UNREACHABLE');

  // a command the app does not know is refused
  reply = await request('logout');
  t.is(reply.error.code, 'NOT_ALLOWED');
});

test('emails the admins when a tunnel is offline, and again when it is back', async (t) => {
  const ctx = await setup(t);
  const subjects = () =>
    renderSpy
      .getCalls()
      .filter((call) =>
        String(call.args[1]?.message || '').includes(ctx.domain.name)
      )
      .map((call) => String(call.args[1].message));
  const options = { grace: 0, reminder: ms('1d') };

  // first seen offline: noted, not yet emailed
  await checkTunnelAlerts(t.context.client, options);
  t.is(subjects().length, 0);
  let domain = await Domains.findById(ctx.domain._id).lean();
  t.is(domain.tunnel_issue_state, 'offline');

  // still offline after the grace period: emailed once, not on every run
  await checkTunnelAlerts(t.context.client, options);
  await checkTunnelAlerts(t.context.client, options);
  t.is(subjects().length, 1);
  t.regex(subjects()[0], /has not been connected since/);

  // back online: emailed that it is restored
  const app = await ctx.startApp();
  await pWaitFor(() => ctx.isConnected(app), { timeout: ms('10s') });
  await checkTunnelAlerts(t.context.client, options);
  t.is(subjects().length, 2);
  t.regex(subjects()[1], /reachable again/);
  domain = await Domains.findById(ctx.domain._id).lean();
  t.is(domain.tunnel_issue_at, undefined);
  t.is(domain.tunnel_alert_sent_at, undefined);

  // what an app reports about its local mail server is text in the email,
  // never markup
  const [ws] = ctx.handler.wss.clients;
  ws.local[ctx.domain.id] = {
    state: 'down',
    message: '<a href="https://evil.example">click</a>'
  };
  await ctx.handler._refreshOnline(ws);
  await checkTunnelAlerts(t.context.client, options);
  await checkTunnelAlerts(t.context.client, options);
  t.is(subjects().length, 3);
  t.true(
    subjects()[2].includes('&lt;a href=&quot;https://evil.example&quot;&gt;')
  );
  t.false(subjects()[2].includes('<a href="https://evil.example">'));
});
