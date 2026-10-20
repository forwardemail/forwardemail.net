/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const { Writable } = require('node:stream');
const { setTimeout: delay } = require('node:timers/promises');

const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const sendEmail = require('#helpers/send-email');
const {
  getSessionGroup,
  isSessionLimitError
} = require('#helpers/smtp-session-limiter');

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
  t.context.wait = config.smtpSessionLimitWait;
});

test.afterEach.always(async (t) => {
  config.smtpSessionLimits = t.context.limits;
  config.smtpSessionLimitWait = t.context.wait;
  t.context.client.disconnect();
  t.context.subscriber.disconnect();
  if (t.context.server)
    await pify(t.context.server.close.bind(t.context.server))();
});

//
// A receiving server that (like Comcast) refuses a connection with a 421
// greeting when a sending IP has too many sessions open at once, or with
// `greeting()` for every connection (e.g. a throttled IP).
//
async function createServer(
  t,
  { maxSessions = Number.POSITIVE_INFINITY, greeting, dataDelay = 300 } = {}
) {
  const stats = { connections: 0, refused: 0, active: 0, maxActive: 0 };
  const server = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    logger: false,
    secure: false,
    onConnect(session, fn) {
      stats.connections++;
      const refusal = greeting && greeting();
      if (refusal) {
        stats.refused++;
        fn(refusal);
        return;
      }

      if (stats.active >= maxSessions) {
        stats.refused++;
        const err = new Error(
          'resimta-h2p-000000.sys.example.net Too many sessions opened'
        );
        err.responseCode = 421;
        fn(err);
        return;
      }

      stats.active++;
      stats.maxActive = Math.max(stats.maxActive, stats.active);
      session.counted = true;
      fn();
    },
    onClose(session) {
      if (session.counted) stats.active--;
    },
    onData(stream, session, fn) {
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            next();
          }
        })
      );
      stream.on('end', () => {
        // keep the session open for a while (like a real delivery)
        delay(dataDelay).then(() => fn());
      });
    }
  });
  t.context.server = server;
  const port = await getPort();
  await pify(server.listen.bind(server))(port);
  return { port, stats };
}

// the recipient domain's MX hosts all live on the local test server
async function spoofMx(t, records) {
  const domain = `limit-${randomUUID()}.example.com`;
  const { resolver } = t.context;
  await resolver.options.cache.mset(
    new Map([
      [
        `mx:${domain}`,
        resolver.spoofPacket(domain, 'MX', records, true, ms('5m'))
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

test('sessions are counted per provider of the primary MX host', async (t) => {
  // a domain hosted by Comcast (not only comcast.net addresses) shares its limit
  const domain = await spoofMx(t, [
    { exchange: 'mx2.mxge.comcast.net', priority: 10 },
    { exchange: 'mx1.mxge.comcast.net', priority: 5 }
  ]);
  t.is(
    await getSessionGroup({ target: domain, resolver: t.context.resolver }),
    'comcast.net'
  );

  // Comcast allows 25 sessions per IP
  const limit = config.smtpSessionLimits.get('comcast.net');
  t.true(limit > 0 && limit < 25);

  t.is(
    await getSessionGroup({
      target: '203.0.113.7',
      resolver: t.context.resolver
    }),
    '203.0.113.7'
  );
});

test.serial(
  'concurrent deliveries stay under the provider session limit',
  async (t) => {
    // the server refuses past 6 sessions and we allow 3 at a time (sessions
    // that were just closed may still count on the server for a moment)
    const { port, stats } = await createServer(t, { maxSessions: 6 });
    const domain = await spoofMx(t, [{ exchange: IP_ADDRESS, priority: 5 }]);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 3]]);

    const results = await Promise.allSettled(
      Array.from({ length: 12 }, () => send(t, domain, port))
    );

    const failed = results.filter((r) => r.status === 'rejected');
    t.deepEqual(
      failed.map((r) => r.reason.message),
      [],
      'every message is delivered'
    );
    t.is(stats.refused, 0);
    t.true(stats.maxActive <= 3, `${stats.maxActive} sessions at once`);

    // every session was released
    const count = await t.context.client.zcard(
      `smtp_sessions:${IP_ADDRESS}:${IP_ADDRESS}`
    );
    t.is(count, 0);
  }
);

test.serial(
  'a throttled IP is deferred without opening a session to the next MX host',
  async (t) => {
    let throttled = true;
    const { port, stats } = await createServer(t, {
      greeting() {
        if (!throttled) return;
        const err = new Error(
          `4.2.0 ${IP_ADDRESS} Throttled - try again later. Please see https://postmaster.comcast.net/smtp-error-codes.php#RL000003`
        );
        err.responseCode = 421;
        return err;
      }
    });
    // two MX hosts of the same provider (both reach the local server)
    const domain = await spoofMx(t, [
      { exchange: IP_ADDRESS, priority: 5 },
      { exchange: '127.0.0.1', priority: 10 }
    ]);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 10]]);

    const err = await t.throwsAsync(send(t, domain, port));
    t.is(stats.connections, 1, 'only one session was opened');
    t.is(err.responseCode, 421);
    t.true(err.isSessionLimit);
    t.regex(err.message, /Throttled/);

    // while backing off only a couple of sessions are opened at once
    throttled = false;
    stats.refused = 0;
    const results = await Promise.allSettled(
      Array.from({ length: 6 }, () => send(t, domain, port))
    );
    t.true(results.every((r) => r.status === 'fulfilled'));
    t.true(
      stats.maxActive <= config.smtpSessionLimitBackoffMax,
      `${stats.maxActive} sessions at once`
    );
  }
);

test.serial(
  'a delivery that cannot get a session in time is deferred without connecting',
  async (t) => {
    const { port, stats } = await createServer(t, { dataDelay: 3000 });
    const domain = await spoofMx(t, [{ exchange: IP_ADDRESS, priority: 5 }]);
    config.smtpSessionLimits = new Map([[IP_ADDRESS, 1]]);
    config.smtpSessionLimitWait = 500;

    const first = send(t, domain, port);
    await pWaitFor(() => stats.connections === 1, { timeout: ms('10s') });

    const err = await t.throwsAsync(send(t, domain, port));
    t.is(err.responseCode, 421);
    t.true(err.isSessionLimit);
    t.is(err.target, domain);
    t.is(err.sessionGroup, IP_ADDRESS);
    // (the reply can reach the sender, so it does not name the provider)
    t.false(err.message.includes(IP_ADDRESS));
    t.is(stats.connections, 1);

    const info = await first;
    t.deepEqual(info.accepted, [`user@${domain}`]);
  }
);

test.serial(
  'a provider without a limit is not slowed down by a too many sessions reply',
  async (t) => {
    let refuse = true;
    const { port, stats } = await createServer(t, {
      greeting() {
        if (!refuse) return;
        const err = new Error('Too many concurrent SMTP connections');
        err.responseCode = 421;
        return err;
      }
    });
    const domain = await spoofMx(t, [{ exchange: IP_ADDRESS, priority: 5 }]);
    config.smtpSessionLimits = new Map();

    const err = await t.throwsAsync(send(t, domain, port));
    t.true(err.isSessionLimit);
    t.is(stats.connections, 1);

    // (one server's reply does not cap every domain at a large provider)
    refuse = false;
    const results = await Promise.allSettled(
      Array.from({ length: 6 }, () => send(t, domain, port))
    );
    t.true(results.every((r) => r.status === 'fulfilled'));
    t.true(
      stats.maxActive > config.smtpSessionLimitBackoffMax,
      `${stats.maxActive} sessions at once`
    );
  }
);

test.serial('delivery continues when Redis fails', async (t) => {
  const { port, stats } = await createServer(t);
  const domain = await spoofMx(t, [{ exchange: IP_ADDRESS, priority: 5 }]);
  config.smtpSessionLimits = new Map([[IP_ADDRESS, 1]]);

  const { client } = t.context;
  const multi = client.multi.bind(client);
  client.multi = () => {
    throw new Error('Connection is closed.');
  };

  try {
    const info = await send(t, domain, port);
    t.deepEqual(info.accepted, [`user@${domain}`]);
    t.is(stats.connections, 1);
  } finally {
    client.multi = multi;
  }
});

test('only replies about sessions or a throttled IP are treated as session limits', (t) => {
  const reply = (responseCode, response) => ({ responseCode, response });

  // Comcast
  t.true(
    isSessionLimitError(
      reply(
        421,
        '421 resimta-h2p-000000.sys.comcast.net Too many sessions opened'
      )
    )
  );
  t.true(
    isSessionLimitError(
      reply(
        421,
        '421 4.2.0 192.0.2.1 Throttled - try again later. Please see https://postmaster.comcast.net/smtp-error-codes.php#RL000003'
      )
    )
  );
  t.true(isSessionLimitError(reply(421, '421 Too many connections')));

  // about a mailbox, the message or the sender (not our session count)
  t.false(isSessionLimitError(reply(450, '450 4.2.1 Mailbox throttled')));
  t.false(
    isSessionLimitError(
      reply(
        421,
        '421-4.7.28 Gmail has detected an unusual rate of unsolicited mail'
      )
    )
  );
  t.false(
    isSessionLimitError(
      reply(
        450,
        '450-4.2.1 The user you are trying to contact is receiving mail at a rate that prevents additional messages from being delivered.'
      )
    )
  );
  t.false(
    isSessionLimitError(
      reply(451, '451 4.7.500 Server busy. Please try again later.')
    )
  );
  t.false(isSessionLimitError(reply(452, '452 Too many recipients')));

  // permanent rejections are never deferred
  t.false(isSessionLimitError(reply(554, '554 Too many connections')));
});
