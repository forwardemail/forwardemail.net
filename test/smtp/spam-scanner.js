/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Spam Scanner as smtp-bree sends outbound mail (`processEmail`): the verdict
// kept when a message was submitted is used (not scanned again), a message
// that was not checked then is scanned, and one blocked or rejected gets a
// permanent error for each recipient, a bounce (headers only) to its sender
// and bounce webhooks, as for any other rejection
//

const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const nodemailer = require('nodemailer');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');
const API = require('../../api-server');
const SMTP = require('../../smtp-server');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const spamScanner = require('#helpers/spam-scanner');
const { Emails } = require('#models');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
const client = new Redis();
client.setMaxListeners(0);

const DEFAULTS = structuredClone(config.spamScanner);

const GTUBE =
  'XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X';

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});

test.beforeEach(utils.setupFactories);
test.beforeEach(async () => {
  await spamScanner.reset();
  Object.assign(config.spamScanner, structuredClone(DEFAULTS));
});
test.afterEach.always(async () => {
  await spamScanner.reset();
  Object.assign(config.spamScanner, structuredClone(DEFAULTS));
});

//
// A user, domain and alias that may send, the DNS records outbound mail is
// checked against, and an SMTP server that accepts everything (counting
// what it receives) for the recipients
//
async function setup(t, to, { returnPath = true } = {}) {
  const resolver = createTangerine(t.context.client, logger);

  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
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

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const map = new Map();
  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
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
  if (returnPath)
    map.set(
      `cname:${domain.return_path}.${domain.name}`,
      resolver.spoofPacket(
        `${domain.return_path}.${domain.name}`,
        'CNAME',
        [env.WEB_HOST],
        true
      )
    );
  map.set(
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [`v=DMARC1; p=reject; pct=100;`],
      true
    )
  );
  for (const address of to) {
    const [, host] = address.split('@');
    map.set(
      `mx:${host}`,
      resolver.spoofPacket(
        `mx:${host}`,
        'MX',
        [{ exchange: IP_ADDRESS, priority: 0 }],
        true,
        ms('5m')
      )
    );
  }

  await resolver.options.cache.mset(map);

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const received = [];
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
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
    },
    logger,
    secure: false
  });
  await pify(server.listen.bind(server))(port);
  t.teardown(() => server.close());

  return { resolver, user, domain, alias, port, received };
}

// the email as it is stored now
const reload = (email) => Emails.findById(email._id).lean().exec();

// count the scans the worker pool runs
function countScans(t) {
  const counter = { scans: 0 };
  const pool = spamScanner.getPool();
  const { run } = pool;
  pool.run = (...args) => {
    counter.scans++;
    return run.apply(pool, args);
  };

  t.teardown(() => {
    pool.run = run;
  });
  return counter;
}

// scans that fail (resolve to null) until `restore` is called, or the test
// ends
function withoutScans(t) {
  const { scan } = spamScanner;
  spamScanner.scan = async () => null;
  const restore = () => {
    spamScanner.scan = scan;
  };

  t.teardown(restore);
  return restore;
}

// a scan that only logs (in monitor mode) has the inbound time limit, which
// a cold worker (loading the classifier with its first scan) may need most
// of: a longer one, so these tests do not depend on how fast it loads
function withColdStartTime() {
  config.spamScanner.timeout = ms('30s');
}

// what is logged (warnings, errors), with its meta: also Spam Scanner's
// warnings, which it writes to the console
function captureLogs(t) {
  const logged = [];
  const original = {};
  for (const level of ['warn', 'error', 'fatal']) {
    original[level] = logger[level];
    logger[level] = (...args) => {
      logged.push(args);
      return original[level].apply(logger, args);
    };
  }

  const consoleOriginal = { warn: console.warn, error: console.error };
  for (const level of ['warn', 'error'])
    console[level] = (...args) => {
      if (typeof args[0] === 'string' && args[0].startsWith('[SPAM_SCANNER] '))
        logged.push([
          args[0].slice('[SPAM_SCANNER] '.length),
          typeof args[1] === 'string' ? JSON.parse(args[1]) : {}
        ]);
      return consoleOriginal[level](...args);
    };

  t.teardown(() => {
    Object.assign(logger, original);
    console.warn = consoleOriginal.warn;
    console.error = consoleOriginal.error;
  });
  return logged;
}

// the lines logged whose message matches, each with no full recipient
// address and no SMTP session (which holds them and the headers)
function assertNoAddresses(t, logged, pattern, addresses) {
  const lines = logged.filter(([err]) =>
    pattern.test(typeof err === 'string' ? err : err?.message)
  );
  t.true(lines.length > 0);
  for (const [, meta] of lines) {
    t.is(typeof meta, 'object');
    t.false('session' in meta);
    const text = JSON.stringify(meta);
    for (const address of addresses) t.false(text.includes(address), address);
  }
}

test('out of monitor mode, a message submitted over SMTP is refused when blocked, and deferred when it cannot be checked', async (t) => {
  config.spamScanner.monitorOnly = false;
  const to = ['bob@submitted.example'];
  const { resolver, domain, alias } = await setup(t, to);
  const pass = await alias.createToken();
  await alias.save();
  // (the domain is verified)
  await resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );
  const smtp = new SMTP({ client: t.context.client }, true);
  const port = await getPort();
  await smtp.listen(port);
  t.teardown(() => smtp.close());
  const from = `${alias.name}@${domain.name}`;
  const transporter = nodemailer.createTransport({
    logger: false,
    host: IP_ADDRESS,
    port,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: { user: from, pass }
  });
  const send = (text) =>
    transporter.sendMail({
      envelope: { from, to },
      raw: [
        `To: ${to[0]}`,
        `From: ${from}`,
        'Subject: Test',
        'Date: Sun, 11 Oct 2026 10:00:00 +0000',
        '',
        text
      ].join('\r\n')
    });

  const blocked = await t.throwsAsync(send(GTUBE));
  t.is(blocked.responseCode, 554);
  t.regex(blocked.message, /GTUBE/);

  // (the scan failed or took too long)
  withoutScans(t);
  const unchecked = await t.throwsAsync(send('Hello'));
  t.is(unchecked.responseCode, 421);
  t.regex(unchecked.message, /could not be scanned at this time/);

  // (neither was queued)
  t.is(await Emails.countDocuments({ alias: alias._id }), 0);
});

test('a message submitted over SMTP whose From field mailauth could not read in reasonable time is refused at once', async (t) => {
  utils.captureSpamScannerLog(t);
  const to = ['bob@from-limits.example'];
  const { resolver, domain, alias } = await setup(t, to);
  const pass = await alias.createToken();
  await alias.save();
  // (the domain is verified)
  await resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );
  const smtp = new SMTP({ client: t.context.client }, true);
  const port = await getPort();
  await smtp.listen(port);
  t.teardown(() => smtp.close());
  const from = `${alias.name}@${domain.name}`;
  const transporter = nodemailer.createTransport({
    logger: false,
    host: IP_ADDRESS,
    port,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: { user: from, pass }
  });
  // one address, and 99 KB of empty groups
  const groups = 'g:;'
    .repeat(33_000)
    .match(/.{1,998}/g)
    .join('\r\n ');
  const err = await t.throwsAsync(
    transporter.sendMail({
      envelope: { from, to },
      raw: [
        `To: ${to[0]}`,
        `From: ${from}, ${groups}`,
        'Subject: Test',
        'Date: Sun, 11 Oct 2026 10:00:00 +0000',
        '',
        'Hello'
      ].join('\r\n')
    })
  );
  // (by the unsafe address header check, see
  //  helpers/get-unsafe-address-header.js: permanent on the SMTP server)
  t.is(err.responseCode, 552);
  t.regex(err.message, /"From" header/);
  t.is(await Emails.countDocuments({ alias: alias._id }), 0);
});

test('a message submitted over SMTP whose header no parser could read in reasonable time is refused for good, not tried again for days', async (t) => {
  utils.captureSpamScannerLog(t);
  const to = ['bob@header-limits.example'];
  const { resolver, domain, alias } = await setup(t, to);
  const pass = await alias.createToken();
  await alias.save();
  // (the domain is verified)
  await resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );
  const smtp = new SMTP({ client: t.context.client }, true);
  const port = await getPort();
  await smtp.listen(port);
  t.teardown(() => smtp.close());
  const from = `${alias.name}@${domain.name}`;
  const transporter = nodemailer.createTransport({
    logger: false,
    host: IP_ADDRESS,
    port,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: { user: from, pass }
  });
  const err = await t.throwsAsync(
    transporter.sendMail({
      envelope: { from, to },
      raw: [
        `To: ${to[0]}`,
        `From: ${from}`,
        `X-Folded: a${'\r\n b'.repeat(6000)}`,
        'Subject: Test',
        'Date: Sun, 11 Oct 2026 10:00:00 +0000',
        '',
        'Hello'
      ].join('\r\n')
    })
  );
  // (permanent on the SMTP server, temporary on the MX server, see
  //  test/mx/hardening.js)
  t.is(err.responseCode, 552);
  t.regex(err.message, /more than 5000 lines/);
  t.is(await Emails.countDocuments({ alias: alias._id }), 0);
});

test('in monitor mode, a message submitted over SMTP with what blocks it is refused, as before Spam Scanner 7, and with SPAM_SCANNER_OUTBOUND_BLOCK=false queued, not refused', async (t) => {
  withColdStartTime();
  const lines = utils.captureSpamScannerLog(t);
  const to = ['bob@monitored-submission.example'];
  const { resolver, domain, alias } = await setup(t, to);
  const pass = await alias.createToken();
  await alias.save();
  // (the domain is verified)
  await resolver.options.cache.mset(
    new Map([
      [
        `txt:${domain.name}`,
        resolver.spoofPacket(
          domain.name,
          'TXT',
          [`${config.paidPrefix}${domain.verification_record}`],
          true,
          ms('5m')
        )
      ]
    ])
  );
  const smtp = new SMTP({ client: t.context.client }, true);
  const port = await getPort();
  await smtp.listen(port);
  t.teardown(() => smtp.close());
  const from = `${alias.name}@${domain.name}`;
  const transporter = nodemailer.createTransport({
    logger: false,
    host: IP_ADDRESS,
    port,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: { user: from, pass }
  });
  const send = () =>
    transporter.sendMail({
      envelope: { from, to },
      raw: [
        `To: ${to[0]}`,
        `From: ${from}`,
        'Subject: Test',
        'Date: Sun, 11 Oct 2026 10:00:00 +0000',
        '',
        GTUBE
      ].join('\r\n')
    });

  // refused (a permanent error), not queued, and logged as blocked
  const blocked = await t.throwsAsync(send());
  t.is(blocked.responseCode, 554);
  t.regex(blocked.message, /GTUBE/);
  t.is(await Emails.countDocuments({ alias: alias._id }), 0);
  t.true(lines.some((line) => / blocked {/.test(line)));
  lines.length = 0;

  config.spamScanner.outboundBlock = false;
  const info = await send();
  t.deepEqual(info.accepted, to);
  const queued = await Emails.findOne({ alias: alias._id }).lean().exec();
  t.truthy(queued);
  t.is(queued.status, 'queued');
  // (what would block it is kept and logged)
  t.true(queued.spam_scan.blocking.some((message) => /GTUBE/.test(message)));
  t.true(lines.some((line) => line.includes('would block')));
});

test('mail we send carries no X-Forward-Email-Report or X-Spam-Scanner-* header its sender added', async (t) => {
  // (only our MX servers add it, to copies they forward, see
  //  helpers/arf-recipient-block.js)
  const to = ['someone@report.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const email = await Emails.queue({
    message: {
      envelope: { from: `${alias.name}@${domain.name}`, to: to[0] },
      raw: [
        `From: ${alias.name}@${domain.name}`,
        `To: ${to[0]}`,
        'Subject: Hello',
        `Date: ${new Date().toUTCString()}`,
        'X-Forward-Email-Report: forged',
        'X-Spam-Scanner-Flag: NO',
        'x-spam-scanner-score : -9',
        '',
        'Hello.'
      ].join('\r\n')
    },
    alias,
    domain,
    user,
    date: new Date()
  });
  await processEmail({ email, port, resolver, client });
  t.is(received.length, 1);
  t.notRegex(received[0].split('\r\n\r\n')[0], /^x-forward-email-report:/im);
  // (which would read as our verdict to whoever receives it)
  t.notRegex(received[0].split('\r\n\r\n')[0], /^x-spam-scanner-/im);
  t.regex(received[0], /^X-Forward-Email-Sender: /m);
});

test('our own bounces (DSNs) are not scanned, when queued or sent', async (t) => {
  // (out of monitor mode, where it would be blocked if scanned)
  config.spamScanner.monitorOnly = false;
  const to = ['sender@dsn.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const counter = countScans(t);
  const email = await Emails.queue({
    message: {
      envelope: { from: `mailer-daemon@${domain.name}`, to: to[0] },
      raw: [
        `From: Mail Delivery Subsystem <mailer-daemon@${domain.name}>`,
        `To: ${to[0]}`,
        'Subject: Delivery Status Notification (Failure)',
        `Date: ${new Date().toUTCString()}`,
        '',
        `Your message could not be delivered: ${GTUBE}`
      ].join('\r\n')
    },
    alias,
    domain,
    user,
    date: new Date(),
    is_bounce: true,
    is_dsn: true
  });
  t.true(email.is_dsn);
  t.is(email.spam_scan, undefined);
  await processEmail({ email, port, resolver, client });
  t.is(counter.scans, 0);
  const after = await reload(email);
  t.false(after.rejectedErrors.some((error) => error.is_spam_scanner));
  t.is(after.status, 'sent');
  t.is(received.length, 1);
});

test('in monitor mode, a message larger than a scan that only logs reads is not checked as it is sent', async (t) => {
  const to = ['big@big.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  config.spamScanner.maxSize = 200;
  // (not scanned as it is submitted either: one that could be refused for
  //  what blocks it is scanned whatever its size, see SPAM_SCANNER_OUTBOUND_BLOCK)
  config.spamScanner.outboundBlock = false;
  const queue = () =>
    Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to,
        subject: 'Big',
        text: 'A message larger than the limit. '.repeat(20)
      },
      user
    });
  let checks = 0;
  const { checkOutbound } = spamScanner;
  spamScanner.checkOutbound = (...args) => {
    checks++;
    return checkOutbound.apply(spamScanner, args);
  };

  t.teardown(() => {
    spamScanner.checkOutbound = checkOutbound;
  });
  const email = await queue();
  t.is(email.spam_scan, undefined);
  await processEmail({ email, port, resolver, client });
  t.is(checks, 0);
  const sent = await reload(email);
  t.is(sent.status, 'sent');
  t.is(received.length, 1);

  // (out of monitor mode it is, whatever its size)
  config.spamScanner.monitorOnly = false;
  const enforced = await queue();
  await processEmail({ email: enforced, port, resolver, client });
  t.is(checks, 1);
});

test('a message submitted with a verdict kept is sent without being scanned again', async (t) => {
  withColdStartTime();
  const to = ['clean@clean.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Lunch',
      text: 'Do you want to grab lunch tomorrow?'
    },
    user
  });
  t.is(email.status, 'queued');
  t.is(email.spam_scan.version, spamScanner.getVersion());
  t.deepEqual(email.spam_scan.blocking, []);
  // (not shown to users: its score and tests would help tune spam)
  t.false('spam_scan' in JSON.parse(JSON.stringify(email.toJSON())));

  const counter = countScans(t);
  await processEmail({ email, port, resolver, client });
  t.is(counter.scans, 0);
  const sent = await Emails.findById(email._id).lean().exec();
  t.is(sent.status, 'sent');
  t.is(received.length, 1);
});

test('in monitor mode, mail this server made that was queued unchecked is refused for what blocks it as it is sent, as it would have been when queued', async (t) => {
  withColdStartTime();
  captureLogs(t);
  utils.captureSpamScannerLog(t);
  const to = ['one@made-unchecked.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  t.true(config.spamScanner.monitorOnly);

  // (mail this server made, whose scan failed when it was queued: with no
  //  client to try again, it is queued unchecked)
  const restore = withoutScans(t);
  const queue = (text) =>
    Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to,
        subject: 'Test',
        text
      },
      user
    });
  const email = await queue(GTUBE);
  const harmless = await queue('Hello');
  restore();
  t.deepEqual(email.spam_scan, { unchecked: true });

  await processEmail({ email, port, resolver, client });
  t.is(received.length, 0);
  const rejected = await Emails.findById(email._id).lean().exec();
  t.is(rejected.status, 'rejected');
  t.true(
    rejected.rejectedErrors.every(
      (error) => error.is_spam_scanner && error.responseCode === 554
    )
  );
  t.regex(rejected.rejectedErrors[0].message, /GTUBE/);

  // (one with nothing that blocks it is sent)
  await processEmail({ email: harmless, port, resolver, client });
  const sent = await Emails.findById(harmless._id).lean().exec();
  t.is(sent.status, 'sent');
  t.is(received.length, 1);
  // (its scan as it was sent not kept: one that came after the message
  //  stopped waiting would be kept without what refuses it, and the next
  //  attempt would send it unscanned)
  t.deepEqual(sent.spam_scan, { unchecked: true });

  // (and one whose scan as it is sent fails too is deferred, not sent
  //  unchecked: it could carry what is refused)
  withoutScans(t);
  const unscanned = await queue('Hello again');
  t.deepEqual(unscanned.spam_scan, { unchecked: true });
  spamScanner.getPool().run = async () => {
    throw new Error('boom');
  };

  await processEmail({ email: unscanned, port, resolver, client });
  const deferred = await Emails.findById(unscanned._id).lean().exec();
  t.is(deferred.status, 'deferred');
  t.is(received.length, 1);

  // (for an hour after it was first to be sent: not one queued long ago and
  //  scheduled for now, or kept pending, which is still held back)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const scheduled = await queue('Hello later');
  await Emails.updateOne(
    { _id: scheduled._id },
    { $set: { created_at: twoHoursAgo } },
    { timestamps: false }
  );
  await processEmail({
    email: await Emails.findById(scheduled._id).exec(),
    port,
    resolver,
    client
  });
  const stillDeferred = await Emails.findById(scheduled._id).lean().exec();
  t.is(stillDeferred.status, 'deferred');
  t.is(received.length, 1);

  // (then it is sent unchecked, as origin sent it, not tried again until it
  //  bounces)
  const stale = await queue('Hello once more');
  await Emails.updateOne(
    { _id: stale._id },
    { $set: { created_at: twoHoursAgo, date: twoHoursAgo } },
    { timestamps: false }
  );
  await processEmail({
    email: await Emails.findById(stale._id).exec(),
    port,
    resolver,
    client
  });
  const staleSent = await Emails.findById(stale._id).lean().exec();
  t.is(staleSent.status, 'sent');
  t.is(received.length, 2);

  // (but mail queued before Spam Scanner 7, with no scan kept, is sent as
  //  it was then, without waiting for a scan, which only logs)
  const legacy = await queue(GTUBE);
  await Emails.updateOne({ _id: legacy._id }, { $unset: { spam_scan: 1 } });
  const before = await Emails.findById(legacy._id).exec();
  t.is(before.spam_scan, undefined);
  t.false(spamScanner.blocksAsSent(before.spam_scan));
  await processEmail({ email: before, port, resolver, client });
  const legacySent = await Emails.findById(legacy._id).lean().exec();
  t.is(legacySent.status, 'sent');
  t.is(received.length, 3);
});

test('a message not checked when submitted is scanned as it is sent, and blocked: rejected for each recipient, with a bounce and webhooks read as a virus', async (t) => {
  // (out of monitor mode)
  config.spamScanner.monitorOnly = false;
  const to = ['one@blocked.example', 'two@blocked.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);

  // (mail this server made, whose scan failed when it was queued)
  const restore = withoutScans(t);
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Test',
      text: GTUBE
    },
    user
  });
  restore();
  t.deepEqual(email.spam_scan, { unchecked: true });

  // bounce webhook
  const api = new API({ logger });
  const webhooks = {};
  api.app.use(async (ctx) => {
    webhooks[ctx.request.body.recipient] = ctx.request.body;
    ctx.status = 200;
  });
  const apiPort = await getPort();
  await api.listen(apiPort);
  t.teardown(() => api.close());
  domain.bounce_webhook = `http://${IP_ADDRESS}:${apiPort}/bounce?test=true`;
  await domain.save();

  const logged = captureLogs(t);
  await processEmail({ email, port, resolver, client });

  // nothing sent
  t.is(received.length, 0);

  // (logged without the recipients' addresses)
  assertNoAddresses(t, logged, /Outbound message prevented/, to);

  const rejected = await Emails.findById(email._id).lean().exec();
  t.is(rejected.status, 'rejected');
  t.is(rejected.rejectedErrors.length, 2);
  for (const error of rejected.rejectedErrors) {
    t.is(error.responseCode, 554);
    t.true(error.is_spam_scanner);
    t.regex(error.message, /^Message blocked by Spam Scanner/);
  }

  // the verdict is kept, so a retry is not scanned again
  t.true(rejected.spam_scan.blocking.length > 0);

  // webhooks read it as a virus
  await pWaitFor(() => Object.keys(webhooks).length === 2, {
    timeout: ms('10s')
  });
  for (const address of to) {
    t.is(webhooks[address].response_code, 554);
    t.is(webhooks[address].bounce.category, 'virus');
  }

  // a bounce to the sender, with the message's headers only
  await pWaitFor(
    async () =>
      Boolean(
        await Emails.exists({ user: user._id, is_bounce: true, is_dsn: true })
      ),
    { timeout: ms('10s') }
  );
  const bounce = await Emails.findOne({
    user: user._id,
    is_bounce: true,
    is_dsn: true
  });
  const bounceMessage = await Emails.getMessage(bounce.message);
  const raw = bounceMessage.toString();
  t.true(raw.includes('text/rfc822-headers'));
  t.false(raw.includes(GTUBE));

  // (one bounce for the message, not one for each recipient; both are
  //  recorded as bounced)
  t.is(
    await Emails.countDocuments({
      user: user._id,
      is_bounce: true,
      is_dsn: true
    }),
    1
  );
  const bounced = await reload(email);
  t.deepEqual([...bounced.hard_bounces].sort(), [...to].sort());
  // (and its body is kept for review, not redacted)
  t.not(bounced.is_redacted, true);
});

test('outbound spam is sent in outbound monitor mode, and rejected as it is sent outside it, but not auto-replies', async (t) => {
  withColdStartTime();
  const to = ['spam@spam.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const queue = (options = {}) =>
    Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to,
        subject: 'Offer',
        text: 'An offer'
      },
      user,
      ...options
    });
  // (a verdict kept when it was submitted that marked it as spam)
  const markSpam = (email) =>
    Emails.findByIdAndUpdate(
      email._id,
      {
        $set: {
          'spam_scan.is_spam': true,
          'spam_scan.score': 20,
          'spam_scan.action': 'reject'
        }
      },
      { new: true }
    );

  const monitored = await markSpam(await queue());
  await processEmail({ email: monitored, port, resolver, client });
  const sent = await reload(monitored);
  t.is(sent.status, 'sent');
  t.is(received.length, 1);

  // (out of monitor mode, outbound spam is still only logged unless
  //  SPAM_SCANNER_OUTBOUND_MONITOR_ONLY is false too)
  config.spamScanner.monitorOnly = false;
  const outboundMonitored = await markSpam(await queue());
  await processEmail({ email: outboundMonitored, port, resolver, client });
  t.is(received.length, 2);

  config.spamScanner.outboundMonitorOnly = false;
  const rejected = await markSpam(await queue());
  await processEmail({ email: rejected, port, resolver, client });
  const after = await Emails.findById(rejected._id).lean().exec();
  t.is(after.status, 'rejected');
  t.is(after.rejectedErrors[0].responseCode, 550);
  // (no score: it reaches the sender)
  t.is(
    after.rejectedErrors[0].message,
    'Message rejected as spam by Spam Scanner'
  );
  t.is(received.length, 2);

  // the admins are told (once a day: its key is taken)
  t.truthy(await client.get(`smtp_prevented:${domain.id}`));

  // (an auto-reply, which gets no bounce of its own: sent)
  const autoReply = await markSpam(await queue({ is_bounce: true }));
  await processEmail({ email: autoReply, port, resolver, client });
  const autoReplied = await reload(autoReply);
  t.is(autoReplied.status, 'sent');
  t.is(received.length, 3);
});

test('a message Spam Scanner rejects is rejected for each recipient even when a setting of its domain would defer it', async (t) => {
  // (out of monitor mode: it is scanned when queued with the outbound time
  //  limit, which a cold worker has time enough in)
  config.spamScanner.monitorOnly = false;
  const to = ['spam@nopath.example'];
  // (no Return-Path CNAME: a message would be deferred for it)
  const { resolver, alias, domain, user, port, received } = await setup(t, to, {
    returnPath: false
  });
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Offer',
      text: 'An offer'
    },
    user
  });
  await Emails.findByIdAndUpdate(email._id, {
    $set: { 'spam_scan.score': 20, 'spam_scan.is_spam': true }
  });

  // (in outbound monitor mode: deferred for the Return-Path, as before)
  await processEmail({ email, port, resolver, client });
  const deferred = await reload(email);
  t.is(deferred.status, 'deferred');

  config.spamScanner.outboundMonitorOnly = false;
  const again = await Emails.findByIdAndUpdate(
    email._id,
    { $set: { status: 'queued', updated_at: new Date(Date.now() - 120_000) } },
    { new: true }
  );
  await processEmail({ email: again, port, resolver, client });
  const rejected = await reload(email);
  t.is(rejected.status, 'rejected');
  t.true(rejected.rejectedErrors.every((error) => error.is_spam_scanner));
  t.is(received.length, 0);
});

test('a message that cannot be checked as it is sent is deferred out of monitor mode, or sent unchecked when set', async (t) => {
  // (out of monitor mode)
  config.spamScanner.monitorOnly = false;
  const to = ['later@later.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const queue = async () => {
    const email = await Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to,
        subject: 'Later',
        text: 'See you later'
      },
      user
    });
    // (no verdict kept: queued before Spam Scanner, say)
    return Emails.findByIdAndUpdate(
      email._id,
      { $unset: { spam_scan: 1 } },
      { new: true }
    );
  };

  spamScanner.getPool().run = async () => {
    throw new Error('boom');
  };

  const deferred = await queue();
  const logged = captureLogs(t);
  await processEmail({ email: deferred, port, resolver, client });
  const after = await Emails.findById(deferred._id).lean().exec();
  // (reported without the recipients' addresses)
  await pWaitFor(
    () =>
      logged.some(([err]) =>
        /could not be checked by Spam Scanner/.test(err?.message || err)
      ),
    { timeout: ms('5s') }
  );
  assertNoAddresses(t, logged, /could not be checked by Spam Scanner/, to);
  t.is(after.status, 'deferred');
  t.regex(
    after.rejectedErrors[0].message,
    /could not be scanned at this time and will be retried/
  );
  t.is(received.length, 0);

  config.spamScanner.outboundFailClosed = false;
  const unchecked = await queue();
  await processEmail({ email: unchecked, port, resolver, client });
  const sentUnchecked = await reload(unchecked);
  t.is(sentUnchecked.status, 'sent');
  t.is(received.length, 1);
});

test('mail with abuse@ and another recipient is scanned as it is sent', async (t) => {
  // (out of monitor mode)
  config.spamScanner.monitorOnly = false;
  const to = [config.abuseEmail, 'other@other.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const restore = withoutScans(t);
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Report',
      text: GTUBE
    },
    user
  });
  restore();
  await processEmail({ email, port, resolver, client });
  const after = await reload(email);
  t.is(after.status, 'rejected');
  t.true(after.rejectedErrors.length > 0);
  t.true(after.rejectedErrors.every((error) => error.is_spam_scanner));
  t.is(received.length, 0);
});

test('mail to our abuse@ address is sent without a verdict, whatever it holds', async (t) => {
  // (out of monitor mode, where it would be blocked if scanned)
  config.spamScanner.monitorOnly = false;
  const to = [config.abuseEmail];
  const { resolver, alias, domain, user, port } = await setup(t, to);
  const restore = withoutScans(t);
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Spam report',
      text: GTUBE
    },
    user
  });
  restore();
  const counter = countScans(t);
  await processEmail({ email, port, resolver, client });
  t.is(counter.scans, 0);
  const after = await Emails.findById(email._id).lean().exec();
  t.false(after.rejectedErrors.some((error) => error.is_spam_scanner));
  t.is(after.status, 'sent');
});

test('the rest of a partly sent message Spam Scanner blocks on a later attempt is partially sent, not rejected', async (t) => {
  // (out of monitor mode)
  config.spamScanner.monitorOnly = false;
  const to = ['one@partly.example', 'two@partly.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const queued = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Report',
      text: 'The report'
    },
    user
  });
  // (accepted by the first recipient on an earlier attempt, and blocked on
  //  this one)
  const email = await Emails.findByIdAndUpdate(
    queued._id,
    {
      $set: {
        accepted: [to[0]],
        'spam_scan.blocking': ['A link goes to a host that is not allowed']
      }
    },
    { new: true }
  );
  await processEmail({ email, port, resolver, client });
  const after = await reload(email);
  t.is(after.status, 'partially_sent');
  t.deepEqual(after.accepted, [to[0]]);
  t.deepEqual(
    after.rejectedErrors.map((error) => [error.recipient, error.responseCode]),
    [[to[1], 554]]
  );
  t.is(received.length, 0);
});

test('mail from our own domain is neither scanned nor blocked, when submitted or sent', async (t) => {
  // (out of monitor mode, where it would be blocked if scanned)
  config.spamScanner.monitorOnly = false;
  const to = ['admin@ours.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  // (the sender's domain as ours, WEB_HOST)
  const { webHost } = config;
  config.webHost = domain.name;
  t.teardown(() => {
    config.webHost = webHost;
  });
  const counter = countScans(t);
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to,
      subject: 'Test',
      text: GTUBE
    },
    user
  });
  t.is(email.spam_scan, undefined);
  await processEmail({ email, port, resolver, client });
  t.is(counter.scans, 0);
  const after = await reload(email);
  t.is(after.status, 'sent');
  t.is(received.length, 1);
});

test('in monitor mode nothing is rejected or deferred as it is sent: what would be blocked, and what cannot be checked, is sent', async (t) => {
  withColdStartTime();
  // (queued with what would block it, which as it is submitted is refused,
  //  see SPAM_SCANNER_OUTBOUND_BLOCK)
  config.spamScanner.outboundBlock = false;
  const to = ['one@monitored.example'];
  const { resolver, alias, domain, user, port, received } = await setup(t, to);
  const queue = () =>
    Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to,
        subject: 'Test',
        text: GTUBE
      },
      user
    });
  const lines = utils.captureSpamScannerLog(t);

  // (queued, and logged with what would block it)
  const email = await queue();
  t.true(email.spam_scan.blocking.length > 0);
  t.is(lines.length, 1);
  t.regex(
    lines[0],
    /^\[SPAM_SCANNER] (would (mark|reject) as spam and )?would block {/
  );
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.is(logged.subject, 'Test');
  t.is(logged.mail_from, `${alias.name}@${domain.name}`);
  t.is(logged.from, `${alias.name}@${domain.name}`);

  // (sent, with outbound spam rejection turned on as well: monitor mode
  //  decides it)
  config.spamScanner.outboundMonitorOnly = false;
  await processEmail({ email, port, resolver, client });
  const sent = await reload(email);
  t.is(sent.status, 'sent');
  t.false(sent.rejectedErrors.some((error) => error.is_spam_scanner));
  t.is(received.length, 1);
  t.falsy(await client.get(`smtp_prevented:${domain.id}`));

  // (one that cannot be checked is sent as well)
  const second = await queue();
  const unchecked = await Emails.findByIdAndUpdate(
    second._id,
    { $unset: { spam_scan: 1 } },
    { new: true }
  );
  // (a scan as it is sent runs alongside sending: the message does not wait
  //  for it, and its verdict is kept once it is done)
  const { run } = spamScanner.getPool();
  let release;
  const released = new Promise((resolve) => {
    release = resolve;
  });
  spamScanner.getPool().run = async (...args) => {
    await released;
    return run.apply(spamScanner.getPool(), args);
  };

  await processEmail({ email: unchecked, port, resolver, client });
  const sentUnchecked = await reload(unchecked);
  t.is(sentUnchecked.status, 'sent');
  t.is(sentUnchecked.spam_scan, undefined);
  t.is(received.length, 2);
  release();
  let kept;
  await pWaitFor(
    async () => {
      kept = await reload(unchecked);
      return Boolean(kept.spam_scan);
    },
    { timeout: ms('20s') }
  );
  t.true(lines.at(-1).includes('"stage":"sending"'));
  // (keeping it leaves `updated_at` alone, which retries go by)
  t.is(kept.updated_at.getTime(), sentUnchecked.updated_at.getTime());
});
