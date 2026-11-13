/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Spam Scanner on the MX server, in monitor mode (helpers/spam-scanner.js):
// every forwarded copy gets X-Spam-Scanner-* headers (a sender's own are
// replaced), a message it would mark as spam is only logged and still
// delivered, and a scan that fails does not stop delivery.
//

const http = require('node:http');
const util = require('node:util');
const { Writable } = require('node:stream');
const { randomUUID } = require('node:crypto');
const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const { captureSpamScannerLog, captureSpamScannerStats } = utils;

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Domains = require('#models/domains');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');
const spamScanner = require('#helpers/spam-scanner');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;
  await spamScanner.reset();
  // (every message scanned, but where a test says otherwise)
  t.context.mxPercent = config.spamScanner.mxPercent;
  config.spamScanner.mxPercent = 100;
});

test.afterEach.always(async (t) => {
  config.spamScanner.mxPercent = t.context.mxPercent;
  await spamScanner.reset();
  for (const key of ['mx', 'target']) {
    if (!t.context[key]) continue;
    try {
      await t.context[key].close();
    } catch {}
  }

  try {
    await t.context.wsp.close();
  } catch {}

  try {
    await t.context.sqlite.close();
  } catch {}
});

//
// A paid domain on the MX server with an alias forwarding to a local SMTP
// server, which keeps every message it receives
//
async function setup(t) {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  t.context.mx = mx;
  const { resolver } = mx;
  await mx.listen(await getPort());

  const received = [];
  const targetPort = await getPort();
  const target = new SMTPServer({
    disabledCommands: ['AUTH'],
    logger: false,
    secure: false,
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
        received.push(Buffer.concat(chunks).toString());
        fn();
      });
    }
  });
  t.context.target = target;
  await pify(target.listen.bind(target))(targetPort);

  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
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

  let domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      smtp_port: targetPort.toString()
    })
    .create();
  domain = await Domains.findByIdAndUpdate(
    domain._id,
    { $set: { has_txt_record: true } },
    { new: true }
  );

  const forwardDomain = `forward-${randomUUID()}.example.com`;
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
  map.set(`mx:${forwardDomain}`, mxRecord(forwardDomain));
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
  await resolver.options.cache.mset(map);

  // (not greylisted on the first attempt)
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  await t.context.aliasFactory
    .withState({
      name: 'bob',
      user: user._id,
      domain: domain._id,
      recipients: [`bob@${forwardDomain}`]
    })
    .create();

  async function send(lines, to = `bob@${domain.name}`) {
    const conn = await asyncMxConnect({
      target: IP_ADDRESS,
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
      tls
    });
    return transporter.sendMail({
      envelope: { from: 'sender@test.com', to: [to] },
      raw: lines.join('\r\n')
    });
  }

  return { domain, received, resolver, send, user };
}

// a scan has the inbound time limit, which a cold worker (loading the
// classifier with its first scan) may need most of: a longer one, so a test
// that waits for a real scan's result does not depend on how fast it loads
// (and the MX server waits for it as long, see SPAM_SCANNER_MX_WAIT)
function withColdStartTime(t) {
  const { timeout, mxWait } = config.spamScanner;
  config.spamScanner.timeout = ms('30s');
  config.spamScanner.mxWait = ms('30s');
  t.teardown(() => {
    config.spamScanner.timeout = timeout;
    config.spamScanner.mxWait = mxWait;
  });
}

// the values of a header in a received message
function headerValues(raw, name) {
  const [head] = raw.split('\r\n\r\n');
  const unfolded = head.replace(/\r\n[ \t]+/g, ' ');
  return unfolded
    .split('\r\n')
    .filter((line) => line.toLowerCase().startsWith(`${name.toLowerCase()}:`))
    .map((line) => line.slice(name.length + 1).trim());
}

test('spam is logged and still forwarded, with X-Spam-Scanner headers in place of the sender’s', async (t) => {
  withColdStartTime(t);
  const lines = captureSpamScannerLog(t);
  const { domain, received, send } = await setup(t);
  const id = randomUUID();
  await send([
    // (headers a sender adds to pass off a verdict of its own)
    'X-Spam-Scanner-Flag: NO',
    'X-Spam-Scanner-Score: -100',
    `To: bob@${domain.name}`,
    'From: "PayPal" <sender@test.com>',
    'Subject: Your account is suspended',
    `Message-ID: <${id}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    'Content-Type: text/html; charset=utf-8',
    '',
    '<p>Dear customer, verify your account now: <a href="http://paypa1-secure.example/login">https://www.paypal.com/signin</a></p>'
  ]);

  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  const [raw] = received;
  t.deepEqual(headerValues(raw, 'X-Spam-Scanner-Version'), [
    spamScanner.getVersion()
  ]);
  t.deepEqual(headerValues(raw, 'X-Spam-Scanner-Flag'), ['YES']);
  const [score] = headerValues(raw, 'X-Spam-Scanner-Score');
  t.true(Number(score) >= 5, `score ${score}`);
  t.is(headerValues(raw, 'X-Spam-Scanner-Score').length, 1);
  t.regex(
    headerValues(raw, 'X-Spam-Scanner-Status')[0],
    /^Yes, score=[\d.]+ required=5\.0 tests=.*DECEPTIVE_LINK/
  );
  // (monitor mode: nothing a client or filter acts on)
  t.deepEqual(headerValues(raw, 'X-Spam-Flag'), []);

  t.is(lines.length, 1);
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.is(logged.direction, 'inbound');
  t.is(logged.stage, 'received');
  t.is(logged.mail_from, 'sender@test.com');
  t.is(logged.from, 'sender@test.com');
  t.is(logged.subject, 'Your account is suspended');
  // (the recipients' domains, not their addresses, and not the body)
  t.deepEqual(logged.rcpt_to_domains, [domain.name]);
  t.false(lines[0].includes(`bob@${domain.name}`));
  t.false(lines[0].includes('Dear customer'));
});

test('a wanted message is forwarded with X-Spam-Scanner-Flag NO and not logged', async (t) => {
  withColdStartTime(t);
  const lines = captureSpamScannerLog(t);
  const { domain, received, send } = await setup(t);
  const id = randomUUID();
  await send([
    `To: bob@${domain.name}`,
    'From: sender@test.com',
    'Subject: Lunch tomorrow',
    `Message-ID: <${id}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    'Content-Type: text/plain; charset=us-ascii',
    '',
    'Hey Bob, do you want to grab lunch tomorrow at noon?'
  ]);
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Flag'), ['NO']);
  t.is(lines.length, 0);
});

test('a scan that fails does not stop delivery, and forged headers still go', async (t) => {
  const { domain, received, send } = await setup(t);
  let scans = 0;
  spamScanner.getPool().run = async () => {
    scans++;
    throw new Error('boom');
  };

  await send([
    'X-Spam-Scanner-Flag: NO',
    `To: bob@${domain.name}`,
    'From: sender@test.com',
    'Subject: Hello',
    `Message-ID: <${randomUUID()}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    '',
    'Hello'
  ]);
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  t.is(scans, 1);
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Flag'), []);
});

test('a message whose every recipient bounces is rejected without waiting for its scan', async (t) => {
  const { resolver, send } = await setup(t);
  // (a domain whose TXT record rejects the address: it is looked up, and
  //  then bounces)
  const name = `off-${randomUUID()}.example.com`;
  await resolver.options.cache.mset(
    new Map([
      [
        `mx:${name}`,
        resolver.spoofPacket(
          name,
          'MX',
          [{ exchange: IP_ADDRESS, priority: 0 }],
          true,
          ms('5m')
        )
      ],
      [
        `txt:${name}`,
        resolver.spoofPacket(
          name,
          'TXT',
          [`${config.recordPrefix}=!!!off`],
          true,
          ms('5m')
        )
      ]
    ])
  );
  // (a scan that would hold up the reply for 15s, waiting for a worker)
  const { timeout } = config.spamScanner;
  config.spamScanner.timeout = 15_000;
  t.teardown(() => {
    config.spamScanner.timeout = timeout;
  });
  let scans = 0;
  let stopped = 0;
  spamScanner.getPool().run = (task, { signal }) => {
    scans++;
    return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        stopped++;
        reject(new Error('aborted'));
      });
    });
  };

  const started = Date.now();
  const err = await t.throwsAsync(
    send(
      [
        `To: off@${name}`,
        'From: sender@test.com',
        'Subject: Hello',
        `Message-ID: <${randomUUID()}@test.com>`,
        'Date: Sun, 11 Oct 2026 10:00:00 +0000',
        '',
        'Hello'
      ],
      `off@${name}`
    )
  );
  t.is(err.responseCode, 550);
  t.is(scans, 1);
  t.true(Date.now() - started < 10_000, `took ${Date.now() - started}ms`);
  // (a scan a worker has got is not stopped at once, which would stop the
  //  worker, but at its time limit: not long after it is given up)
  t.is(stopped, 0);
});

test('a scan that never finishes does not hold up the copy past its time limit', async (t) => {
  const { domain, received, send } = await setup(t);
  const { timeout } = config.spamScanner;
  config.spamScanner.timeout = 1000;
  t.teardown(() => {
    config.spamScanner.timeout = timeout;
  });
  let scans = 0;
  // (a worker that never answers, even when stopped)
  spamScanner.getPool().run = () => {
    scans++;
    return new Promise(() => {});
  };

  const started = Date.now();
  await send([
    'X-Spam-Scanner-Flag: NO',
    `To: bob@${domain.name}`,
    'From: sender@test.com',
    'Subject: Hello',
    `Message-ID: <${randomUUID()}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    '',
    'Hello'
  ]);
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  t.is(scans, 1);
  t.true(Date.now() - started < 10_000, `took ${Date.now() - started}ms`);
  // (without a result, and without the sender's forged header)
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Flag'), []);
});

test('in monitor mode a slow scan holds up the transaction at most SPAM_SCANNER_MX_WAIT, and the copy goes without its headers while it goes on (counted in the stats line); out of it the scan is waited for', async (t) => {
  const lines = captureSpamScannerLog(t);
  const stats = captureSpamScannerStats(t);
  const { domain, received, send } = await setup(t);
  const { mxWait, monitorOnly } = config.spamScanner;
  config.spamScanner.mxWait = 500;
  t.teardown(() => {
    config.spamScanner.mxWait = mxWait;
    config.spamScanner.monitorOnly = monitorOnly;
  });
  // (a worker that starts each scan, and finishes it 4s later)
  const { run } = spamScanner.getPool();
  const finished = [];
  spamScanner.getPool().run = (task, options) => {
    task.port.postMessage({ started: true, warm: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        finished.push(task);
        resolve(
          run.call(
            spamScanner.getPool(),
            { ...task, port: undefined },
            { signal: options.signal }
          )
        );
      }, 4000);
    });
  };

  const message = (subject) => [
    'X-Spam-Scanner-Flag: NO',
    `To: bob@${domain.name}`,
    'From: sender@test.com',
    `Subject: ${subject}`,
    `Message-ID: <${randomUUID()}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    'Content-Type: text/plain; charset=us-ascii',
    '',
    'Hey Bob, do you want to grab lunch tomorrow at noon?'
  ];

  let started = Date.now();
  await send(message('Lunch tomorrow'));
  let elapsed = Date.now() - started;
  t.true(elapsed < 3000, `took ${elapsed}ms`);
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  // (without a result, and without the sender's forged header)
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Flag'), []);
  // the scan goes on (to its end, past the transaction)
  await pWaitFor(() => finished.length === 1, { timeout: ms('30s') });
  t.is(lines.length, 0);

  config.spamScanner.monitorOnly = false;
  started = Date.now();
  await send(message('Lunch the day after'));
  elapsed = Date.now() - started;
  t.true(elapsed >= 4000, `took ${elapsed}ms`);
  await pWaitFor(() => received.length === 2, { timeout: ms('20s') });
  t.deepEqual(headerValues(received[1], 'X-Spam-Scanner-Flag'), ['NO']);

  // (both scanned, one delivered before its scan was done)
  spamScanner.flushStats();
  t.like(stats[0], { received: { scanned: 2, over_mx_wait: 1 } });
  t.true(stats[0].received.run_ms.max >= 4000);
});

test('a message to be rejected for Gmail’s authentication policy is not scanned', async (t) => {
  const { domain, received, resolver, send } = await setup(t);
  // (gmail.com's policy, p=none, and an SPF record this server is not in)
  await resolver.options.cache.mset(
    new Map([
      [
        'txt:gmail.com',
        resolver.spoofPacket(
          'gmail.com',
          'TXT',
          ['v=spf1 -all'],
          true,
          ms('5m')
        )
      ],
      [
        'txt:_dmarc.gmail.com',
        resolver.spoofPacket(
          '_dmarc.gmail.com',
          'TXT',
          ['v=DMARC1; p=none'],
          true,
          ms('5m')
        )
      ]
    ])
  );
  t.teardown(() =>
    t.context.client.del(
      'tangerine:txt:gmail.com',
      'tangerine:txt:_dmarc.gmail.com'
    )
  );
  let scans = 0;
  const { scan } = spamScanner;
  spamScanner.scan = (...args) => {
    scans++;
    return scan.apply(spamScanner, args);
  };

  t.teardown(() => {
    spamScanner.scan = scan;
  });

  const err = await t.throwsAsync(
    send([
      `To: bob@${domain.name}`,
      'From: someone@gmail.com',
      'Subject: Hello',
      `Message-ID: <${randomUUID()}@test.com>`,
      'Date: Sun, 11 Oct 2026 10:00:00 +0000',
      '',
      'Hello'
    ])
  );
  t.regex(err.message, /no passing authentication aligned/i);
  t.is(scans, 0);
  t.is(received.length, 0);
});

test('only SPAM_SCANNER_MX_PERCENT of inbound mail is scanned, picked at random, and counted in the stats line with how long scans took', async (t) => {
  withColdStartTime(t);
  const stats = captureSpamScannerStats(t);
  const { domain, received, send } = await setup(t);
  let scans = 0;
  const { scan } = spamScanner;
  spamScanner.scan = (...args) => {
    scans++;
    return scan.apply(spamScanner, args);
  };

  // (each message picked by the number given, rather than Math.random,
  //  which more than this reads)
  const { isSampledInbound } = spamScanner;
  let picked = 0;
  spamScanner.isSampledInbound = () => isSampledInbound(() => picked);
  t.teardown(() => {
    spamScanner.scan = scan;
    spamScanner.isSampledInbound = isSampledInbound;
  });
  const message = (subject) => [
    'X-Spam-Scanner-Flag: NO',
    `To: bob@${domain.name}`,
    'From: sender@test.com',
    `Subject: ${subject}`,
    `Message-ID: <${randomUUID()}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    '',
    'Hello Bob, see you at noon.'
  ];

  // (0: none, and a sender's headers still go)
  config.spamScanner.mxPercent = 0;
  picked = 0;
  await send(message('none'));
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  t.is(scans, 0);
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Flag'), []);

  // (10: one picked under 10 out of 100, not one at 10 or over)
  config.spamScanner.mxPercent = 10;
  picked = 0.1;
  await send(message('not picked'));
  await pWaitFor(() => received.length === 2, { timeout: ms('20s') });
  t.is(scans, 0);
  t.deepEqual(headerValues(received[1], 'X-Spam-Scanner-Flag'), []);

  picked = 0.099;
  await send(message('picked'));
  await pWaitFor(() => received.length === 3, { timeout: ms('20s') });
  t.is(scans, 1);
  t.deepEqual(headerValues(received[2], 'X-Spam-Scanner-Flag'), ['NO']);

  // (each process writes what it counted, then starts counting again)
  spamScanner.flushStats();
  t.is(stats.length, 1);
  const [line] = stats;
  t.is(line.mx_percent, 10);
  t.is(line.received.not_sampled, 2);
  t.is(line.received.scanned, 1);
  for (const timing of ['time_ms', 'wait_ms', 'run_ms']) {
    t.is(line.received[timing].count, 1, `${timing}`);
    t.true(line.received[timing].max >= 0, `${timing}`);
  }

  t.true(line.received.time_ms.max >= line.received.run_ms.max);
  spamScanner.flushStats();
  t.is(stats.length, 1);
});

test('mail only to our own addresses is not scanned, and forged headers still go', async (t) => {
  const lines = captureSpamScannerLog(t);
  const { domain, received, send } = await setup(t);
  // (the alias's domain as ours, WEB_HOST)
  const { webHost } = config;
  config.webHost = domain.name.toUpperCase();
  t.teardown(() => {
    config.webHost = webHost;
  });
  let scans = 0;
  const { scan } = spamScanner;
  spamScanner.scan = (...args) => {
    scans++;
    return scan.apply(spamScanner, args);
  };

  t.teardown(() => {
    spamScanner.scan = scan;
  });

  await send([
    'X-Spam-Scanner-Flag: NO',
    `To: bob@${domain.name}`,
    'From: "PayPal" <sender@test.com>',
    'Subject: Your account is suspended',
    `Message-ID: <${randomUUID()}@test.com>`,
    'Date: Sun, 11 Oct 2026 10:00:00 +0000',
    'Content-Type: text/html; charset=utf-8',
    '',
    '<p>Dear customer, verify your account now: <a href="http://paypa1-secure.example/login">https://www.paypal.com/signin</a></p>'
  ]);
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  t.is(scans, 0);
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Flag'), []);
  t.deepEqual(headerValues(received[0], 'X-Spam-Scanner-Version'), []);
  t.is(lines.length, 0);
});

test('a webhook gets the X-Spam-Scanner headers in place of the sender’s', async (t) => {
  withColdStartTime(t);
  captureSpamScannerLog(t);
  const { domain, resolver, send, user } = await setup(t);
  const bodies = [];
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      bodies.push(JSON.parse(Buffer.concat(chunks).toString()));
      res.end('OK');
    });
  });
  await pify(server.listen.bind(server))(await getPort());
  t.teardown(() => server.close());
  await resolver.options.cache.mset(
    new Map([
      [
        `a:${domain.name}`,
        resolver.spoofPacket(domain.name, 'A', [IP_ADDRESS], true, ms('5m'))
      ]
    ])
  );
  await t.context.aliasFactory
    .withState({
      name: 'hook',
      user: user._id,
      domain: domain._id,
      recipients: [`http://${domain.name}:${server.address().port}/`]
    })
    .create();

  await send(
    [
      'X-Spam-Scanner-Flag: NO',
      `To: hook@${domain.name}`,
      'From: "PayPal" <sender@test.com>',
      'Subject: Your account is suspended',
      `Message-ID: <${randomUUID()}@test.com>`,
      'Date: Sun, 11 Oct 2026 10:00:00 +0000',
      'Content-Type: text/html; charset=utf-8',
      '',
      '<p>Dear customer, verify your account now: <a href="http://paypa1-secure.example/login">https://www.paypal.com/signin</a></p>'
    ],
    `hook@${domain.name}`
  );
  await pWaitFor(() => bodies.length === 1, { timeout: ms('20s') });
  t.is(bodies[0].headers['X-Spam-Scanner-Flag'], 'YES');
  t.is(bodies[0].headers['X-Spam-Scanner-Version'], spamScanner.getVersion());
  // (and otherwise the headers as they arrived, not those we add)
  t.is(bodies[0].headers.Subject, 'Your account is suspended');
  t.is(bodies[0].headers['X-Report-Abuse-To'], undefined);
});
