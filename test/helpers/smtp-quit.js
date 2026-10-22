/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Sessions to a provider that limits how many an IP may have open (e.g.
// Comcast) end with QUIT instead of a dropped connection, without holding up
// a delivery or failing it however the server answers; sessions to every
// other server close as before (see helpers/smtp-quit.js).
//

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const net = require('node:net');
const { Writable } = require('node:stream');

const ip = require('ip');
const ms = require('ms');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const sendEmail = require('#helpers/send-email');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  await utils.setupRedisClient(t);
  t.context.resolver = createTangerine(t.context.client, logger);

  // (restored after each test)
  t.context.limits = config.smtpSessionLimits;
  t.context.quitTimeout = config.smtpQuitTimeout;
});

test.afterEach.always(async (t) => {
  config.smtpSessionLimits = t.context.limits;
  config.smtpQuitTimeout = t.context.quitTimeout;
  t.context.client.disconnect();
  t.context.subscriber.disconnect();
  if (t.context.server)
    await pify(t.context.server.close.bind(t.context.server))();
});

// a server that records the commands of each session and when it closed
async function createServer(t) {
  const sessions = new Map();
  const record = (data) => {
    if (data?.tnx !== 'command') return;
    if (!sessions.has(data.cid)) sessions.set(data.cid, { commands: [] });
    sessions.get(data.cid).commands.push(data.command);
  };

  const server = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    secure: false,
    logger: {
      info: record,
      debug: record,
      error() {},
      warn() {},
      trace() {},
      fatal() {}
    },
    onClose(session) {
      if (!sessions.has(session.id)) sessions.set(session.id, { commands: [] });
      sessions.get(session.id).closed = true;
    },
    onData(stream, session, fn) {
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            next();
          }
        })
      );
      stream.on('end', () => fn());
    }
  });
  t.context.server = server;
  const port = await getPort();
  await pify(server.listen.bind(server))(port);
  return { port, sessions };
}

//
// a minimal server that accepts one message and then, on QUIT, either never
// answers ("ignore") or drops the connection ("drop")
//
async function createRawServer(t, onQuit) {
  const stats = { quit: false, closedAt: null };
  const server = net.createServer((socket) => {
    let buffer = '';
    let inData = false;
    socket.on('error', () => {});
    socket.on('close', () => {
      stats.closedAt = Date.now();
    });
    socket.write('220 raw.example.net ESMTP\r\n');
    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      let index;
      while ((index = buffer.indexOf('\r\n')) !== -1) {
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 2);
        if (inData) {
          if (line === '.') {
            inData = false;
            socket.write('250 2.0.0 queued\r\n');
          }

          continue;
        }

        const command = line.split(' ')[0].toUpperCase();
        switch (command) {
          case 'EHLO':
          case 'HELO': {
            socket.write('250 raw.example.net\r\n');

            break;
          }

          case 'DATA': {
            inData = true;
            socket.write('354 go ahead\r\n');

            break;
          }

          case 'QUIT': {
            stats.quit = true;
            if (onQuit === 'drop') socket.destroy();
            // ("ignore": no reply, and the connection stays open)

            break;
          }

          default: {
            socket.write('250 OK\r\n');
          }
        }
      }
    });
  });
  t.context.server = server;
  const port = await getPort();
  await pify(server.listen.bind(server))(port);
  return { port, stats };
}

// the recipient domain's MX host is the local test server
async function spoofMx(t) {
  const domain = `quit-${randomUUID()}.example.com`;
  const { resolver } = t.context;
  await resolver.options.cache.mset(
    new Map([
      [
        `mx:${domain}`,
        resolver.spoofPacket(
          domain,
          'MX',
          [{ exchange: IP_ADDRESS, priority: 5 }],
          true,
          ms('5m')
        )
      ]
    ])
  );
  return domain;
}

function send(t, domain, port) {
  const id = randomUUID();
  return sendEmail({
    session: {
      envelope: {
        mailFrom: { address: 'test@test.com' },
        rcptTo: [{ address: `user@${domain}` }]
      },
      arrivalDateFormatted: new Date().toISOString().split('T')[0]
    },
    target: domain,
    port,
    envelope: { from: 'test@test.com', to: `user@${domain}` },
    raw: Buffer.from(
      [
        `To: user@${domain}`,
        'From: test@test.com',
        `Subject: Test ${id}`,
        `Message-ID: <${id}@test.com>`,
        'Content-Type: text/plain; charset=us-ascii',
        '',
        'Test'
      ].join('\r\n')
    ),
    resolver: t.context.resolver,
    client: t.context.client,
    hasWkdDisabled: true
  });
}

test.serial(
  'a session to a provider that limits sessions ends with QUIT',
  async (t) => {
    const { port, sessions } = await createServer(t);
    const domain = await spoofMx(t);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 10]]);
    // (closed on the reply to QUIT, long before this)
    config.smtpQuitTimeout = ms('30s');

    const info = await send(t, domain, port);
    t.deepEqual(info.accepted, [`user@${domain}`]);

    await pWaitFor(() => [...sessions.values()].some((s) => s.closed), {
      timeout: ms('2s')
    });
    const [session] = [...sessions.values()];
    t.is(session.commands.at(-1), 'QUIT');
    t.true(session.commands.includes('DATA'));
  }
);

test.serial('verify sends QUIT once', async (t) => {
  const { port, sessions } = await createServer(t);
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port,
    secure: false,
    ignoreTLS: true,
    quitBeforeClose: true
  });

  t.true(await transporter.verify());
  await pWaitFor(() => [...sessions.values()].some((s) => s.closed), {
    timeout: ms('2s')
  });
  const [session] = [...sessions.values()];
  t.is(session.commands.filter((command) => command === 'QUIT').length, 1);
});

test.serial(
  'a session to any other server closes as before, without QUIT',
  async (t) => {
    const { port, sessions } = await createServer(t);
    const domain = await spoofMx(t);
    config.smtpSessionLimits = new Map();

    const info = await send(t, domain, port);
    t.deepEqual(info.accepted, [`user@${domain}`]);

    await pWaitFor(() => [...sessions.values()].some((s) => s.closed), {
      timeout: ms('10s')
    });
    const [session] = [...sessions.values()];
    t.false(session.commands.includes('QUIT'));
    t.true(session.commands.includes('DATA'));
  }
);

test.serial(
  'a server that never answers QUIT does not hold up the delivery, and the connection is closed after a while',
  async (t) => {
    const { port, stats } = await createRawServer(t, 'ignore');
    const domain = await spoofMx(t);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 10]]);
    config.smtpQuitTimeout = 1500;

    const info = await send(t, domain, port);
    const deliveredAt = Date.now();
    t.deepEqual(info.accepted, [`user@${domain}`]);

    await pWaitFor(() => stats.quit && stats.closedAt !== null, {
      timeout: ms('10s')
    });
    // (the delivery was done before the connection was closed)
    t.true(stats.closedAt - deliveredAt >= 1000, 'closed after the timeout');
  }
);

test.serial(
  'a server that drops the connection on QUIT does not fail the delivery',
  async (t) => {
    const { port, stats } = await createRawServer(t, 'drop');
    const domain = await spoofMx(t);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 10]]);

    const info = await send(t, domain, port);
    t.deepEqual(info.accepted, [`user@${domain}`]);
    await pWaitFor(() => stats.quit && stats.closedAt !== null, {
      timeout: ms('10s')
    });

    // (and nothing is thrown after it: an uncaught error fails this file)
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    t.pass();
  }
);

test.serial(
  'a server that refuses the session with 421 is still deferred as before',
  async (t) => {
    const server = new SMTPServer({
      disabledCommands: ['AUTH', 'STARTTLS'],
      logger: false,
      secure: false,
      onConnect(session, fn) {
        const err = new Error(
          'resimta-c2p-000000.sys.example.net Too many sessions opened'
        );
        err.responseCode = 421;
        fn(err);
      }
    });
    t.context.server = server;
    const port = await getPort();
    await pify(server.listen.bind(server))(port);
    const domain = await spoofMx(t);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 10]]);

    const err = await t.throwsAsync(send(t, domain, port));
    t.is(err.responseCode, 421);
    t.true(err.isSessionLimit);
  }
);
