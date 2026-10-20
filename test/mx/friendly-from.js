/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const util = require('node:util');
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
const { sealMessage } = require('mailauth');

const utils = require('../utils');

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Domains = require('#models/domains');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');

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
});

test.afterEach.always(async (t) => {
  if (t.context.truthSources) config.truthSources = t.context.truthSources;

  if (t.context.target)
    await new Promise((resolve) => {
      t.context.target.close(resolve);
    });

  if (t.context.mx) {
    try {
      await t.context.mx.close();
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
// The reported case: a sender with a DMARC reject policy mails a Hotmail user,
// whose Outlook inbox rule redirects it to a Forward Email alias. Outlook
// re-encodes the body (breaking the sender's DKIM signature) but keeps the
// original From header, and seals the message with ARC while reporting nothing
// as passing. We accept it since the ARC sealer is a truth source, but the
// destination (e.g. Gmail) rejects it for failing DMARC on the original From.
//
// `exchange` is the MX hostname of the forwarding destination, which is served
// by a local SMTP server that rejects any message from the original sender for
// failing DMARC (as Gmail does).
//
async function setup(t, exchange) {
  const id = crypto.randomUUID().slice(0, 8);
  // (test domains such as `.test` are denylisted, so use `.com` names)
  const senderDomain = `sender-${id}.com`;
  const sealerDomain = `arc-${id}.com`;
  const forwardDomain = `forward-${id}.example.com`;
  const originalFrom = `jamie@${senderDomain}`;

  // the ARC sealer is a truth source (e.g. microsoft.com in production)
  t.context.truthSources = config.truthSources;
  config.truthSources = new Set([...config.truthSources, sealerDomain]);

  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  t.context.mx = mx;
  const { resolver } = mx;
  await mx.listen(await getPort());

  const attempts = [];
  const targetPort = await getPort();
  const target = new SMTPServer({
    disabledCommands: ['AUTH'],
    logger: false,
    secure: false,
    onData(stream, session, fn) {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        attempts.push(raw);
        if (raw.includes(`<${originalFrom}>`)) {
          const err = new Error(
            `5.7.26 Unauthenticated email from ${senderDomain} is not accepted due to domain's DMARC policy. Please contact the administrator of ${senderDomain} domain if this was a legitimate mail.`
          );
          err.responseCode = 550;
          fn(err);
          return;
        }

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

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [`user@${forwardDomain}`]
    })
    .create();

  const sealerKeys = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048
  });

  const map = new Map();
  const mxRecord = (name, exchange) =>
    resolver.spoofPacket(
      name,
      'MX',
      [{ exchange, priority: 0 }],
      true,
      ms('5m')
    );
  map.set(`mx:${domain.name}`, mxRecord(domain.name, IP_ADDRESS));
  map.set(`mx:${forwardDomain}`, mxRecord(forwardDomain, exchange));
  if (exchange !== IP_ADDRESS) {
    map.set(
      `a:${exchange}`,
      resolver.spoofPacket(exchange, 'A', [IP_ADDRESS], true, ms('5m'))
    );
    map.set(
      `aaaa:${exchange}`,
      resolver.spoofPacket(exchange, 'AAAA', [], true, ms('5m'))
    );
  }

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
  // the forwarder (e.g. hotmail.com) passes SPF for its own envelope sender
  map.set(
    'txt:test.com',
    resolver.spoofPacket(
      'test.com',
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  // the original sender publishes a DMARC reject policy
  map.set(
    `txt:_dmarc.${senderDomain}`,
    resolver.spoofPacket(
      `_dmarc.${senderDomain}`,
      'TXT',
      ['v=DMARC1; p=reject;'],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:arc._domainkey.${sealerDomain}`,
    resolver.spoofPacket(
      `arc._domainkey.${sealerDomain}`,
      'TXT',
      [
        `v=DKIM1; k=rsa; p=${sealerKeys.publicKey
          .export({ type: 'spki', format: 'der' })
          .toString('base64')}`
      ],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);

  // allowlist our IP (as outlook.com is) so it is not greylisted
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  async function send() {
    const message = Buffer.from(
      [
        `From: Jamie Lane <${originalFrom}>`,
        `To: ${alias.name}@${domain.name}`,
        'Subject: Lock in your Seats',
        `Message-ID: <${crypto.randomUUID()}@test.com>`,
        `Date: ${new Date().toUTCString()}`,
        'Content-Type: text/plain; charset=us-ascii',
        '',
        'Lock in your seats for the season.',
        ''
      ].join('\r\n')
    );

    const sealHeaders = await sealMessage(message, {
      signingDomain: sealerDomain,
      selector: 'arc',
      privateKey: sealerKeys.privateKey.export({
        type: 'pkcs8',
        format: 'pem'
      }),
      authResults: `${sealerDomain} 1; spf=none; dmarc=none; dkim=none; arc=none`,
      cv: 'none'
    });

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
      envelope: {
        from: 'forwarder@test.com',
        to: `${alias.name}@${domain.name}`
      },
      raw: Buffer.concat([sealHeaders, message])
    });
  }

  return { alias, domain, originalFrom, attempts, send };
}

function assertFriendlyFrom(t, raw, originalFrom) {
  t.regex(
    raw,
    new RegExp(
      `^From: "${originalFrom}" <${config.friendlyFromEmail}>\\r?$`,
      'im'
    )
  );
  t.regex(raw, new RegExp(`^X-Original-From: ${originalFrom}\\r?$`, 'im'));
  t.regex(raw, new RegExp(`^Reply-To: ${originalFrom}\\r?$`, 'im'));
}

test.serial(
  'rewrites From before forwarding a trusted ARC message that failed DMARC to Gmail',
  async (t) => {
    // (a hostname that does not exist, so DNS can never reach Google itself)
    const exchange = `forward-test-${crypto
      .randomUUID()
      .slice(0, 8)}.l.google.com`;
    const { alias, domain, originalFrom, attempts, send } = await setup(
      t,
      exchange
    );

    const info = await send();
    t.deepEqual(info.accepted, [`${alias.name}@${domain.name}`]);

    // the first and only attempt already had the friendly-from rewrite
    t.is(attempts.length, 1);
    assertFriendlyFrom(t, attempts[0], originalFrom);
  }
);

test.serial(
  'rewrites From after another destination rejects a trusted ARC message that failed DMARC',
  async (t) => {
    const { alias, domain, originalFrom, attempts, send } = await setup(
      t,
      IP_ADDRESS
    );

    const info = await send();
    t.deepEqual(info.accepted, [`${alias.name}@${domain.name}`]);

    // the original From was rejected, then retried with a friendly-from rewrite
    t.is(attempts.length, 2);
    t.true(attempts[0].includes(`<${originalFrom}>`));
    assertFriendlyFrom(t, attempts[1], originalFrom);
  }
);
