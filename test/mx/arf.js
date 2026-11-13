/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Abuse reports (ARF) from feedback loops to the abuse address, read by the
// MX server (helpers/arf-report.js): a report about a message one of our users
// sent counts against their outbound reputation, a message reported as spam
// is learned, and neither is delivered; any other mail to the abuse address
// is delivered as before.
//

const util = require('node:util');
const { Writable } = require('node:stream');
const { generateKeyPairSync, randomUUID } = require('node:crypto');
const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const arf = require('spamscanner/arf');
const test = require('ava');
const { SMTPServer } = require('smtp-server');
const { dkimSign } = require('mailauth/lib/dkim/sign');

const utils = require('../utils');

const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Domains = require('#models/domains');
const { Aliases, Emails, Users } = require('#models');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');
const spamScanner = require('#helpers/spam-scanner');
const { VERSION_KEY, getDayKey } = require('#helpers/spam-scanner-learned');
const {
  isBlocked,
  listBlocks,
  unblock
} = require('#helpers/arf-recipient-block');
const { isDestinationIssue } = require('#helpers/send-forwarding-issue-emails');
const { getDeliveryOutcome } = require('#helpers/on-data-mx');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

// a feedback loop at a truth source of the test environment (TRUTH_SOURCES)
const TRUTH_SOURCE = [...config.truthSources][0];
const FBL_DOMAIN = `arf.${TRUTH_SOURCE}`;
const FBL_ADDRESS = `feedback@${FBL_DOMAIN}`;

// (the feedback loops sign their reports, as they do, with this key)
const DKIM_KEY = generateKeyPairSync('rsa', { modulusLength: 2048 });
const DKIM_SELECTOR = 'fbl';
const SIGNING_DOMAINS = new Set([FBL_DOMAIN, 'arf.otherprovider.net']);

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
  // (what earlier tests learned and read: KEYS takes the client's prefix
  //  as part of the pattern, and DEL adds it)
  const { keyPrefix } = t.context.client.options;
  const keys = [];
  for (const pattern of ['spam_scanner_learned*', 'arf_report*'])
    for (const key of await t.context.client.keys(`${keyPrefix}${pattern}`))
      keys.push(key.slice(keyPrefix.length));
  if (keys.length > 0) await t.context.client.del(...keys);
});

test.afterEach.always(async (t) => {
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

async function createPaidUser(t) {
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
  return user;
}

//
// The MX server, with the abuse address (and bob) on a paid domain
// forwarding to a local SMTP server that keeps what it receives, the
// feedback loop's SPF and DMARC records, and a user who sent a message
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
        received.push({
          to: session.envelope.rcptTo.map((rcpt) => rcpt.address),
          raw: Buffer.concat(chunks).toString()
        });
        fn();
      });
    }
  });
  t.context.target = target;
  await pify(target.listen.bind(target))(targetPort);

  const user = await createPaidUser(t);
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
  const txt = (name, values) =>
    map.set(
      `txt:${name}`,
      resolver.spoofPacket(name, 'TXT', values, true, ms('5m'))
    );
  map.set('mx:test.com', mxRecord('test.com'));
  map.set(`mx:${domain.name}`, mxRecord(domain.name));
  map.set(`mx:${forwardDomain}`, mxRecord(forwardDomain));
  txt(domain.name, [`${config.paidPrefix}${domain.verification_record}`]);
  // (the feedback loops' mail passes SPF, aligned with their From domain,
  //  and so DMARC; and `arf.otherprovider.net` passes too, but is no truth
  //  source; and so does a sender of mail we forward, `sendertest.net`)
  for (const name of [FBL_DOMAIN, 'arf.otherprovider.net', 'sendertest.net']) {
    txt(name, [`v=spf1 ip4:${IP_ADDRESS} -all`]);
    txt(`_dmarc.${name}`, ['v=DMARC1; p=none']);
  }

  // (and publish the key their reports are signed with)
  const publicKey = DKIM_KEY.publicKey
    .export({ type: 'spki', format: 'der' })
    .toString('base64');
  for (const name of SIGNING_DOMAINS)
    txt(`${DKIM_SELECTOR}._domainkey.${name}`, [
      `v=DKIM1; k=rsa; p=${publicKey}`
    ]);

  await resolver.options.cache.mset(map);
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  for (const name of ['abuse', 'bob', 'carol'])
    await t.context.aliasFactory
      .withState({
        name,
        user: user._id,
        domain: domain._id,
        recipients: [`${name}@${forwardDomain}`]
      })
      .create();

  // the abuse address, and the feedback loop addresses whose reports are
  // read, for this test
  const { abuseEmail } = config;
  const reporters = new Set(config.arf.reporters);
  config.abuseEmail = `abuse@${domain.name}`;
  config.arf.reporters.clear();
  config.arf.reporters.add(FBL_ADDRESS);
  config.arf.reporters.add('feedback@arf.otherprovider.net');
  t.teardown(() => {
    config.abuseEmail = abuseEmail;
    config.arf.reporters.clear();
    for (const value of reporters) config.arf.reporters.add(value);
  });

  // a user on another domain who sent a message through our SMTP servers
  const sender = await createPaidUser(t);
  const senderDomain = await t.context.domainFactory
    .withState({
      members: [{ user: sender._id, group: 'admin' }],
      plan: sender.plan,
      resolver
    })
    .create();
  const messageId = `${randomUUID()}@${senderDomain.name}`;
  const email = await Emails.create({
    user: sender._id,
    domain: senderDomain._id,
    status: 'sent',
    envelope: {
      from: `news@${senderDomain.name}`,
      to: [`someone@${TRUTH_SOURCE}`, `else@${TRUTH_SOURCE}`]
    },
    message: Buffer.from('test'),
    messageId: `<${messageId}>`,
    headers: { Subject: 'test' },
    date: new Date()
  });

  // another message the user sent, to the same recipients
  async function createEmail() {
    const id = `${randomUUID()}@${senderDomain.name}`;
    const created = await Emails.create({
      user: sender._id,
      domain: senderDomain._id,
      status: 'sent',
      envelope: {
        from: `news@${senderDomain.name}`,
        to: [`someone@${TRUTH_SOURCE}`, `else@${TRUTH_SOURCE}`]
      },
      message: Buffer.from('test'),
      messageId: `<${id}>`,
      headers: { Subject: 'test' },
      date: new Date()
    });
    return { email: created, messageId: id };
  }

  // (`signed`: signed by a feedback loop's domain its From address is at)
  async function send(
    raw,
    { from, to = [config.abuseEmail], signed = true } = {}
  ) {
    const fromDomain = /^from:[^\n]*@([^>\s]+)/im
      .exec(String(raw))?.[1]
      ?.toLowerCase();
    if (signed && SIGNING_DOMAINS.has(fromDomain)) {
      const { signatures } = await dkimSign(Buffer.from(raw), {
        canonicalization: 'relaxed/relaxed',
        signatureData: [
          {
            signingDomain: fromDomain,
            selector: DKIM_SELECTOR,
            privateKey: DKIM_KEY.privateKey.export({
              type: 'pkcs8',
              format: 'pem'
            })
          }
        ]
      });
      raw = Buffer.concat([Buffer.from(signatures), Buffer.from(raw)]);
    }

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
    return transporter.sendMail({ envelope: { from, to }, raw });
  }

  return {
    createEmail,
    forwardDomain,
    domain,
    received,
    send,
    sender,
    senderDomain,
    email,
    messageId
  };
}

// a message as one of our SMTP servers sent it (with the fields they set),
// or as our MX server forwarded it for `client`
function original({ email, messageId, senderDomain, client, body }) {
  return [
    `From: news@${senderDomain.name}`,
    `To: someone@${TRUTH_SOURCE}`,
    'Subject: Limited offer',
    `Message-ID: <${messageId}>`,
    'Date: Mon, 19 Oct 2026 10:00:00 +0000',
    `X-Forward-Email-ID: ${email.id}`,
    client
      ? `X-Forward-Email-Sender: rfc822; ${client}`
      : `X-Forward-Email-Sender: rfc822; news@${senderDomain.name}, smtp.${env.WEB_HOST}, 192.0.2.1`,
    'Content-Type: text/plain; charset=us-ascii',
    '',
    body ||
      'Zorbic vantaflux quimberly offer: claim your plexoria reward at http://plexoria.example.com/claim today',
    ''
  ].join('\r\n');
}

function report(
  options,
  {
    from = FBL_ADDRESS,
    feedbackType = 'abuse',
    originalRcptTo = `someone@${TRUTH_SOURCE}`
  } = {}
) {
  return arf.create({
    feedbackType,
    userAgent: 'Feedback/1.0',
    from,
    to: config.abuseEmail,
    originalMessage: Buffer.from(original(options)),
    ...(originalRcptTo ? { originalRcptTo } : {}),
    sourceIp: '192.0.2.1'
  });
}

async function getReports(user) {
  const found = await Users.findById(user._id)
    .select(config.userFields.smtpReputationReports)
    .lean()
    .exec();
  return found[config.userFields.smtpReputationReports] || [];
}

test.serial(
  'a report about a message a user sent counts against them, is learned, and is not delivered',
  async (t) => {
    const setupResult = await setup(t);
    const { received, send, sender, email } = setupResult;

    const info = await send(report(setupResult), {
      from: `fbl@${FBL_DOMAIN}`
    });
    t.deepEqual(info.accepted, [config.abuseEmail]);

    const reports = await getReports(sender);
    t.is(reports.length, 1);
    t.is(reports[0].truth_source, TRUTH_SOURCE);
    t.is(reports[0].category, 'spam');
    t.is(reports[0].email.toString(), email._id.toString());
    // (the recipient reported, one of the message's)
    t.is(reports[0].recipient, `someone@${TRUTH_SOURCE}`);

    // (learned, for every server)
    t.is(await t.context.client.get(VERSION_KEY), '1');
    t.is(await t.context.client.hget(getDayKey(Date.now()), 'n'), '1');

    // (and not delivered to the abuse address)
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    t.is(received.length, 0);
  }
);

test.serial(
  'a virus report counts against the sender and is not learned as spam',
  async (t) => {
    const setupResult = await setup(t);
    const { received, send, sender } = setupResult;
    await send(report(setupResult, { feedbackType: 'virus' }), {
      from: `fbl@${FBL_DOMAIN}`
    });
    const reports = await getReports(sender);
    t.is(reports.length, 1);
    t.is(reports[0].category, 'virus');
    t.is(await t.context.client.get(VERSION_KEY), null);
    t.is(received.length, 0);
  }
);

test.serial(
  'a report about a message from elsewhere counts against no one, is not learned without a field we made for its copy, and is delivered as before',
  async (t) => {
    const setupResult = await setup(t);
    const { received, send, sender } = setupResult;
    // (a message from elsewhere that names a message one of our users sent:
    //  only our own servers' X-Forward-Email-Sender is trusted; and with no
    //  X-Forward-Email-Report field we made for a copy we forwarded, it is
    //  not learned, as anyone could report a message of their own)
    await send(
      report({
        ...setupResult,
        client: 'x@test.com, mail.test.com, 192.0.2.7'
      }),
      { from: `fbl@${FBL_DOMAIN}` }
    );
    t.deepEqual(await getReports(sender), []);
    t.is(await t.context.client.get(VERSION_KEY), null);
    // (nothing came of it, so the abuse address has it, as before)
    await pWaitFor(
      () =>
        received.some((message) =>
          message.to.some((address) => address.startsWith('abuse@'))
        ),
      { timeout: ms('20s') }
    );
  }
);

test.serial('each report is read once', async (t) => {
  const setupResult = await setup(t);
  const { received, send, sender } = setupResult;
  const raw = report(setupResult);
  await send(raw, { from: `fbl@${FBL_DOMAIN}` });
  await send(raw, { from: `fbl@${FBL_DOMAIN}` });
  const reports = await getReports(sender);
  t.is(reports.length, 1);
  t.is(await t.context.client.get(VERSION_KEY), '1');
  t.is(received.length, 0);
});

test.serial(
  'mail to the abuse address that is no feedback loop report is delivered as before',
  async (t) => {
    const setupResult = await setup(t);
    const { domain, received, send, sender } = setupResult;

    // (from an address of the feedback loop's domain that is not its own)
    await send(report(setupResult, { from: `someone@${FBL_DOMAIN}` }), {
      from: `fbl@${FBL_DOMAIN}`
    });
    // (from a feedback loop that is no truth source)
    await send(
      report(setupResult, { from: 'feedback@arf.otherprovider.net' }),
      { from: 'fbl@arf.otherprovider.net' }
    );
    // (to someone else as well)
    await send(report(setupResult), {
      from: `fbl@${FBL_DOMAIN}`,
      to: [config.abuseEmail, `bob@${domain.name}`]
    });
    // (and a message that is no report)
    await send(
      [
        `From: ${FBL_ADDRESS}`,
        `To: ${config.abuseEmail}`,
        'Subject: Hello',
        `Message-ID: <${randomUUID()}@${FBL_DOMAIN}>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        '',
        'Not a report.',
        ''
      ].join('\r\n'),
      { from: `fbl@${FBL_DOMAIN}` }
    );

    await pWaitFor(
      () =>
        received.filter((message) =>
          message.to.some((address) => address.startsWith('abuse@'))
        ).length === 4,
      { timeout: ms('20s') }
    );
    t.true(
      received.some((message) =>
        message.to.some((address) => address.startsWith('bob@'))
      )
    );
    t.deepEqual(await getReports(sender), []);
    t.is(await t.context.client.get(VERSION_KEY), null);
  }
);

test.serial(
  'with ARF_ENABLED=false reports are delivered as before',
  async (t) => {
    const setupResult = await setup(t);
    const { received, send, sender } = setupResult;
    config.arf.enabled = false;
    t.teardown(() => {
      config.arf.enabled = true;
    });
    await send(report(setupResult), { from: `fbl@${FBL_DOMAIN}` });
    await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
    t.deepEqual(await getReports(sender), []);
  }
);

test.serial(
  'a recipient a feedback loop hides counts once a day, however many messages they report',
  async (t) => {
    const setupResult = await setup(t);
    const { createEmail, received, send, sender } = setupResult;
    for (let i = 0; i < 3; i++) {
      const another = await createEmail();

      await send(
        report({ ...setupResult, ...another }, { originalRcptTo: null }),
        {
          from: `fbl@${FBL_DOMAIN}`
        }
      );
    }

    const reports = await getReports(sender);
    t.is(reports.length, 1);
    t.is(reports[0].recipient, `postmaster@${TRUTH_SOURCE}`);
    // (all three were read, and learned once: they are copies of one message)
    t.is(received.length, 0);
  }
);

test.serial('a report of another type is delivered as before', async (t) => {
  const setupResult = await setup(t);
  const { received, send, sender } = setupResult;
  await send(report(setupResult, { feedbackType: 'not-spam' }), {
    from: `fbl@${FBL_DOMAIN}`
  });
  await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
  t.deepEqual(await getReports(sender), []);
  t.is(await t.context.client.get(VERSION_KEY), null);
});

test.serial(
  'mail from elsewhere keeps no X-Forward-Email-ID it carried',
  async (t) => {
    const setupResult = await setup(t);
    const { domain, email, received, send } = setupResult;
    // (so it cannot name a message one of our users sent, and have reports of
    //  it counted against them)
    await send(
      [
        `From: sender@test.com`,
        `To: bob@${domain.name}`,
        'Subject: Hello',
        `Message-ID: <${randomUUID()}@test.com>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        `X-Forward-Email-ID: ${email.id}`,
        '',
        'Hello Bob.',
        ''
      ].join('\r\n'),
      { from: 'sender@test.com', to: [`bob@${domain.name}`] }
    );
    await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
    t.notRegex(received[0].raw.split('\r\n\r\n')[0], /^x-forward-email-id:/im);
    t.regex(received[0].raw, /^X-Forward-Email-Sender: rfc822; /m);
  }
);

test.serial(
  'a recipient who reports mail we forwarded stops that sender’s mail to them alone',
  async (t) => {
    const setupResult = await setup(t);
    const { domain, forwardDomain, received, send } = setupResult;
    const message = (to) =>
      [
        'From: news@sendertest.net',
        `To: ${to}`,
        'Subject: Weekly deals',
        `Message-ID: <${randomUUID()}@sendertest.net>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        // (one a sender adds is not kept)
        'X-Forward-Email-Report: v=1; d=x; s=x; m=x',
        '',
        'Deals of the week.',
        ''
      ].join('\r\n');

    // (a sender that passes DMARC: the copy forwarded to bob carries the field
    //  a report of it brings back)
    await send(message(`bob@${domain.name}`), {
      from: 'news@sendertest.net',
      to: [`bob@${domain.name}`]
    });
    await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
    const copy = received[0].raw;
    const fields = copy
      .split('\r\n\r\n')[0]
      .replace(/\r\n[ \t]+/g, ' ')
      .split('\r\n')
      .filter((line) => /^x-forward-email-report:/i.test(line));
    t.is(fields.length, 1);
    t.false(fields[0].includes('d=x;'));

    // bob reports it to their mailbox provider, whose feedback loop reports it
    await send(
      arf.create({
        feedbackType: 'abuse',
        userAgent: 'Feedback/1.0',
        from: FBL_ADDRESS,
        to: config.abuseEmail,
        originalMessage: Buffer.from(copy)
      }),
      { from: `fbl@${FBL_DOMAIN}` }
    );
    t.true(
      await isBlocked(t.context.client, {
        recipient: `bob@${domain.name}`,
        destination: `bob@${forwardDomain}`,
        sender: 'news@sendertest.net'
      })
    );
    const bob = await Aliases.findOne({ domain: domain._id, name: 'bob' })
      .lean()
      .exec();
    const blocks = await listBlocks(
      t.context.client,
      bob._id,
      `bob@${domain.name}`
    );
    t.is(blocks.length, 1);
    t.is(blocks[0].sender, 'news@sendertest.net');
    t.is(received.length, 1);

    // the sender's next message to bob gets a temporary error
    const next = message(`bob@${domain.name}`);
    const err = await t.throwsAsync(
      send(next, { from: 'news@sendertest.net', to: [`bob@${domain.name}`] })
    );
    t.is(err.responseCode, 421);
    t.false(err.response.includes('recipient'));

    // and carol still gets it, also in one transaction with bob (which is
    // not held up for bob)
    await send(message(`carol@${domain.name}`), {
      from: 'news@sendertest.net',
      to: [`carol@${domain.name}`, `bob@${domain.name}`]
    });
    await pWaitFor(() => received.length === 2, { timeout: ms('20s') });
    t.deepEqual(received[1].to, [`carol@${forwardDomain}`]);

    // (and once lifted, the message refused is delivered when tried again:
    //  the block counted against it nowhere, e.g. greylisting)
    t.true(
      await unblock(
        t.context.client,
        bob._id,
        `bob@${forwardDomain}`,
        'news@sendertest.net'
      )
    );
    await send(next, {
      from: 'news@sendertest.net',
      to: [`bob@${domain.name}`]
    });
    await pWaitFor(() => received.length === 3, { timeout: ms('20s') });
    t.deepEqual(received[2].to, [`bob@${forwardDomain}`]);
    const blockErr = Object.assign(new Error('Try again later'), {
      responseCode: 421,
      isRecipientBlock: true
    });
    t.false(
      isDestinationIssue({
        destination: `bob@${forwardDomain}`,
        err: blockErr,
        isRetryWindowExceeded: true
      })
    );

    // (and so does mail from another sender to bob)
    await send(
      [
        'From: sender@test.com',
        `To: bob@${domain.name}`,
        'Subject: Hello',
        `Message-ID: <${randomUUID()}@test.com>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        '',
        'Hello Bob.',
        ''
      ].join('\r\n'),
      { from: 'sender@test.com', to: [`bob@${domain.name}`] }
    );
    await pWaitFor(() => received.length === 4, { timeout: ms('20s') });
    t.deepEqual(received[3].to, [`bob@${forwardDomain}`]);
  }
);

test.serial(
  'mail that does not pass DMARC carries no X-Forward-Email-Report',
  async (t) => {
    const setupResult = await setup(t);
    const { domain, received, send } = setupResult;
    // (From an address it cannot block, as anyone could send as it)
    await send(
      [
        'From: news@sendertest.net',
        `To: bob@${domain.name}`,
        'Subject: Hello',
        `Message-ID: <${randomUUID()}@test.com>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        '',
        'Hello Bob.',
        ''
      ].join('\r\n'),
      { from: 'sender@test.com', to: [`bob@${domain.name}`] }
    );
    await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
    t.notRegex(
      received[0].raw.split('\r\n\r\n')[0],
      /^x-forward-email-report:/im
    );
  }
);

test.serial(
  'each recipient of one message who reports it stops that sender for themselves, and a report not signed by the feedback loop is delivered',
  async (t) => {
    const setupResult = await setup(t);
    const { domain, forwardDomain, received, send } = setupResult;
    // one message, with one Message-ID, to bob and carol
    await send(
      [
        'From: news@sendertest.net',
        `To: bob@${domain.name}, carol@${domain.name}`,
        'Subject: Weekly deals',
        `Message-ID: <${randomUUID()}@sendertest.net>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        '',
        'Deals of the week.',
        ''
      ].join('\r\n'),
      {
        from: 'news@sendertest.net',
        to: [`bob@${domain.name}`, `carol@${domain.name}`]
      }
    );
    await pWaitFor(() => received.length === 2, { timeout: ms('20s') });
    const reportOf = (copy) =>
      arf.create({
        feedbackType: 'abuse',
        userAgent: 'Feedback/1.0',
        from: FBL_ADDRESS,
        to: config.abuseEmail,
        originalMessage: Buffer.from(copy.raw)
      });

    // (a report that passes DMARC but is not signed by the feedback loop's
    //  domain, e.g. by SPF alone, is no feedback loop's: delivered)
    await send(reportOf(received[0]), {
      from: `fbl@${FBL_DOMAIN}`,
      signed: false
    });
    await pWaitFor(() => received.length === 3, { timeout: ms('20s') });
    t.deepEqual(received[2].to, [`abuse@${forwardDomain}`]);

    // each copy reported blocks the sender for its own recipient

    for (const copy of received.slice(0, 2))
      await send(reportOf(copy), { from: `fbl@${FBL_DOMAIN}` });
    for (const name of ['bob', 'carol'])
      t.true(
        await isBlocked(t.context.client, {
          recipient: `${name}@${domain.name}`,
          destination: `${name}@${forwardDomain}`,
          sender: 'news@sendertest.net'
        }),
        `${name}`
      );
    t.is(received.length, 3);
  }
);

test.serial(
  'with recipient blocks off, a copy we forward still carries X-Forward-Email-Report, which learning from reports reads',
  async (t) => {
    const { recipientBlock } = config.arf;
    config.arf.recipientBlock = false;
    t.teardown(() => {
      config.arf.recipientBlock = recipientBlock;
    });
    t.true(config.arf.learn);
    const { domain, received, send } = await setup(t);
    await send(
      [
        'From: news@sendertest.net',
        `To: bob@${domain.name}`,
        'Subject: Weekly deals',
        `Message-ID: <${randomUUID()}@sendertest.net>`,
        'Date: Mon, 19 Oct 2026 10:00:00 +0000',
        '',
        'Deals of the week.',
        ''
      ].join('\r\n'),
      { from: 'news@sendertest.net', to: [`bob@${domain.name}`] }
    );
    await pWaitFor(() => received.length === 1, { timeout: ms('20s') });
    t.regex(received[0].raw.split('\r\n\r\n')[0], /^x-forward-email-report:/im);
  }
);

test('a recipient block does not hold up a permanent error for the rest of a message nobody received', (t) => {
  const bounce = (address, responseCode, extra = {}) => ({
    address,
    err: Object.assign(new Error(`${responseCode} for ${address}`), {
      responseCode,
      ...extra
    })
  });
  const session = { arrivalTime: Date.now() };
  const blocked = bounce('bob@example.com', 421, { isRecipientBlock: true });

  // (with another recipient refused for good, the sender is told at once)
  const outcome = getDeliveryOutcome(
    session,
    [],
    [blocked, bounce('carol@example.com', 550)]
  );
  t.is(outcome.action, 'reject');
  t.is(outcome.err.responseCode, 550);
  // (its bounce kept, so the log shows it to the alias's owner)
  t.is(outcome.err.bounces.length, 2);
  // (and the sender told of the rest alone)
  t.false(outcome.err.message.includes('421 for bob'));

  // (with one refused for now, it is tried again, as before)
  t.is(
    getDeliveryOutcome(session, [], [blocked, bounce('dan@example.com', 451)])
      .err.responseCode,
    451
  );

  // (and alone, the block is a temporary error)
  t.is(getDeliveryOutcome(session, [], [blocked]).err.responseCode, 421);
});
