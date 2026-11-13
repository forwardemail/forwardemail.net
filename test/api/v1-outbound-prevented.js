/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An outbound message with what blocks it (an executable attachment, the
// GTUBE test string, and by the domain's Spam Scanner settings a link to a
// malware or adult site) is refused at the API before
// it is queued, in monitor mode (SPAM_SCANNER_MONITOR_ONLY, the default) too,
// as before Spam Scanner 7: it is not stored, the domain is not suspended for
// it (only that one message is prevented), and the domain's admins get a
// notice that says exactly that.  With SPAM_SCANNER_OUTBOUND_BLOCK=false it
// is only logged in monitor mode (and still refused out of it).
//

// the notices the API emails are captured (the module is wrapped before
// anything binds to it)
const sentEmails = [];
const emailModulePath = require.resolve('#helpers/email');
const emailHelper = require(emailModulePath);
require.cache[emailModulePath].exports = (data) => {
  sentEmails.push(data);
  return emailHelper(data);
};

const process = require('node:process');
const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const { captureSpamScannerLog } = utils;

const config = require('#config');
const spamScanner = require('#helpers/spam-scanner');
const { Domains, Emails } = require('#models');

const DEFAULT_MAX_SIZE = config.spamScanner.maxSize;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// out of monitor mode for a test (restored after it)
function enforce(t) {
  const { monitorOnly } = config.spamScanner;
  config.spamScanner.monitorOnly = false;
  t.teardown(() => {
    config.spamScanner.monitorOnly = monitorOnly;
  });
}

// SPAM_SCANNER_OUTBOUND_BLOCK=false for a test (restored after it)
function withoutOutboundBlock(t) {
  const { outboundBlock } = config.spamScanner;
  config.spamScanner.outboundBlock = false;
  t.teardown(() => {
    config.spamScanner.outboundBlock = outboundBlock;
  });
}

// a longer time limit for a test: in monitor mode a submission waits for its
// scan at most the inbound time limit, which a cold worker, loading the
// classifier with its first scan, may need most of
function withColdStartTime(t) {
  const { timeout } = config.spamScanner;
  config.spamScanner.timeout = ms('20s');
  t.teardown(() => {
    config.spamScanner.timeout = timeout;
  });
}

// a paid domain with outbound SMTP, and a way to send from one of its aliases
async function setup(t) {
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
      resolver: t.context.resolver,
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

  const send = (attachments, fields = {}) =>
    t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${alias.name}@${domain.name}`,
        to: 'someone@example.net',
        subject: 'quarterly report',
        text: 'please see the attachment',
        attachments,
        ...fields
      });

  return { user, domain, alias, send };
}

test('a message with an executable attachment is prevented, in monitor mode too, and only that message', async (t) => {
  withColdStartTime(t);
  const { user, domain, send } = await setup(t);
  const lines = captureSpamScannerLog(t);

  // a Windows executable (its extension gives it away)
  const executable = [
    {
      filename: 'report.exe',
      content: Buffer.from(`MZ${'\u0000'.repeat(64)}`).toString('base64'),
      encoding: 'base64',
      contentType: 'application/octet-stream'
    }
  ];

  // (in monitor mode, the default), logged as blocked with the sender and
  // subject
  t.true(config.spamScanner.monitorOnly);
  const res = await send(executable);
  t.is(res.status, 403, `${JSON.stringify(res.body)}`);
  t.regex(res.body.message, /report\.exe.*runs code/i);

  // nothing was queued
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);
  t.is(lines.length, 1);
  t.regex(
    lines[0],
    /^\[SPAM_SCANNER] (would (mark|reject) as spam and )?blocked {/
  );
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.true(logged.monitor_only);
  t.true(logged.blocked);
  t.is(logged.direction, 'outbound');
  t.is(logged.subject, 'quarterly report');
  t.regex(logged.blocking.join(' '), /report\.exe/);

  // the domain's outbound service is untouched: not suspended, not marked
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.false(fresh.is_smtp_suspended);
  t.is(fresh.smtp_suspended_sent_at, undefined);

  // and the admins were told that this one message was prevented (once a
  // day for the domain)
  await pWaitFor(
    () => sentEmails.some((data) => data.template === 'smtp-prevented'),
    { timeout: ms('10s') }
  );
  const notice = sentEmails.find((data) => data.template === 'smtp-prevented');
  t.true(
    (Array.isArray(notice.message.to)
      ? notice.message.to
      : [notice.message.to]
    ).includes(user.email)
  );
  t.is(notice.locals.responseCode, 554);
  t.regex(notice.locals.response, /report\.exe.*runs code/i);
  // (rendered through the real template)
  const { info } = await emailHelper(notice);
  const { html } = info.originalMessage;
  t.true(
    html.includes('Only this outbound message was prevented from delivery.')
  );
  t.true(
    html.includes(
      'Your outbound SMTP service and other queued messages remain active.'
    )
  );
  t.false(html.includes('Outbound SMTP is currently paused and suspended.'));
  t.false(
    html.includes(
      'This means that all of your outbound emails are not being processed.'
    )
  );

  // the next, harmless message of the same domain goes through
  const ok = await send([
    {
      filename: 'report.txt',
      content: Buffer.from('all good').toString('base64'),
      encoding: 'base64',
      contentType: 'text/plain'
    }
  ]);
  t.is(ok.status, 200, `${JSON.stringify(ok.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  // (and out of monitor mode)
  enforce(t);
  const enforced = await send(executable);
  t.is(enforced.status, 403, `${JSON.stringify(enforced.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  // (but not with the domain's executable protection turned off)
  await Domains.updateOne(
    { _id: domain._id },
    { $set: { has_executable_protection: false } }
  );
  const allowed = await send(executable);
  t.is(allowed.status, 200, `${JSON.stringify(allowed.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 2);
});

test("the GTUBE test string and a link to a malware site are prevented in monitor mode too, and a link to an adult site only by the domain's settings", async (t) => {
  withColdStartTime(t);
  // (Cloudflare's malware resolver blocks the one host, with 0.0.0.0)
  config.spamScanner.cloudflare = true;
  t.teardown(async () => {
    config.spamScanner.cloudflare = false;
    await spamScanner.reset();
  });
  await spamScanner.reset();
  const fake = {
    async resolve4(name) {
      return name === 'malware.example.net' ? ['0.0.0.0'] : ['192.0.2.1'];
    }
  };
  const resolvers = spamScanner.getResolvers({}, fake);
  resolvers.malware = fake;
  // (and its family resolver the other, and malware too)
  resolvers.family = {
    async resolve4(name) {
      return name === 'malware.example.net' || name === 'adult.example.net'
        ? ['0.0.0.0']
        : ['192.0.2.1'];
    }
  };
  const { domain, send } = await setup(t);
  captureSpamScannerLog(t);

  const gtube = await send([], {
    text: 'XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X'
  });
  t.is(gtube.status, 403, `${JSON.stringify(gtube.body)}`);
  t.regex(gtube.body.message, /GTUBE/);

  t.is(await Emails.countDocuments({ domain: domain._id }), 0);

  const malwareLink = {
    html: '<p>see <a href="https://malware.example.net/x">the report</a></p>'
  };
  const adultLink = {
    html: '<p>see <a href="https://adult.example.net/x">the report</a></p>'
  };

  // by default (as a domain has them now) the malware link is prevented,
  // as origin prevented it, and the adult link sent
  t.false(domain.has_adult_content_protection);
  t.true(domain.has_phishing_protection);
  const malware = await send([], malwareLink);
  t.is(malware.status, 403, `${JSON.stringify(malware.body)}`);
  t.regex(malware.body.message, /malware\.example\.net/);
  const adultSent = await send([], adultLink);
  t.is(adultSent.status, 200, `${JSON.stringify(adultSent.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  // (also with phishing protection turned off, which is no longer a
  //  setting)
  await Domains.updateOne(
    { _id: domain._id },
    { $set: { has_phishing_protection: false } }
  );
  const stillPrevented = await send([], malwareLink);
  t.is(stillPrevented.status, 403, `${JSON.stringify(stillPrevented.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  // and with adult content protection the adult link
  await Domains.updateOne(
    { _id: domain._id },
    { $set: { has_adult_content_protection: true } }
  );
  const adult = await send([], adultLink);
  t.is(adult.status, 403, `${JSON.stringify(adult.body)}`);
  t.regex(adult.body.message, /adult\.example\.net/);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  // (a link to any other site is sent)
  const fine = await send([], {
    html: '<p>see <a href="https://fine.example.net/x">the report</a></p>'
  });
  t.is(fine.status, 200, `${JSON.stringify(fine.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 2);
});

test('a message linking to more hosts than are looked up is prevented, in monitor mode too (as origin looked up every one, a malware link past them would get out), but only logged with SPAM_SCANNER_OUTBOUND_BLOCK=false', async (t) => {
  withColdStartTime(t);
  const { domain, send } = await setup(t);
  // (251 hosts, one more than are looked up)
  const html = Array.from(
    { length: 251 },
    (_, i) => `<a href="https://host${i}.example.net/">${i}</a>`
  ).join(' ');

  const lines = captureSpamScannerLog(t);

  const monitored = await send([], { html });
  t.is(monitored.status, 403, `${JSON.stringify(monitored.body)}`);
  t.regex(monitored.body.message, /more than 250/i);
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);
  t.is(lines.length, 1);
  t.regex(lines[0], / blocked {/);
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.true(logged.blocked);
  t.regex(logged.blocking.join(' '), /more than 250/i);

  withoutOutboundBlock(t);
  const logOnly = await send([], { html });
  t.is(logOnly.status, 200, `${JSON.stringify(logOnly.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  enforce(t);
  const res = await send([], { html });
  t.is(res.status, 403, `${JSON.stringify(res.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);
});

test('a message with an executable attachment is prevented in monitor mode however large it is', async (t) => {
  withColdStartTime(t);
  const { domain, send } = await setup(t);
  captureSpamScannerLog(t);
  // (larger than a scan that only logs scans)
  config.spamScanner.maxSize = 100;
  t.teardown(() => {
    config.spamScanner.maxSize = DEFAULT_MAX_SIZE;
  });
  const res = await send([
    {
      filename: 'report.exe',
      content: Buffer.from(`MZ${'\u0000'.repeat(64)}`).toString('base64'),
      encoding: 'base64',
      contentType: 'application/octet-stream'
    }
  ]);
  t.is(res.status, 403, `${JSON.stringify(res.body)}`);
  t.regex(res.body.message, /report\.exe/);
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);
});

test('with SPAM_SCANNER_OUTBOUND_BLOCK=false a message with an executable attachment is only logged in monitor mode, and still prevented out of it', async (t) => {
  withColdStartTime(t);
  withoutOutboundBlock(t);
  const { domain, send } = await setup(t);
  const lines = captureSpamScannerLog(t);
  const executable = [
    {
      filename: 'report.exe',
      content: Buffer.from(`MZ${'\u0000'.repeat(64)}`).toString('base64'),
      encoding: 'base64',
      contentType: 'application/octet-stream'
    }
  ];

  // queued, and logged with what would block it
  const monitored = await send(executable);
  t.is(monitored.status, 200, `${JSON.stringify(monitored.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);
  t.is(lines.length, 1);
  t.regex(
    lines[0],
    /^\[SPAM_SCANNER] (would (mark|reject) as spam and )?would block {/
  );
  const logged = JSON.parse(lines[0].slice(lines[0].indexOf('{')));
  t.false(logged.blocked);
  t.regex(logged.blocking.join(' '), /report\.exe/);
  t.false(
    sentEmails.some(
      (data) =>
        data.template === 'smtp-prevented' &&
        data.locals?.domain?.name === domain.name
    )
  );

  enforce(t);
  const res = await send(executable);
  t.is(res.status, 403, `${JSON.stringify(res.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);
});

test('a message that could not be checked is deferred out of monitor mode, unless set to send it unchecked', async (t) => {
  const { user, domain, alias, send } = await setup(t);
  // (the scan failed or took too long)
  const { scan } = spamScanner;
  const { outboundFailClosed } = config.spamScanner;
  spamScanner.scan = async () => null;
  t.teardown(() => {
    spamScanner.scan = scan;
    config.spamScanner.outboundFailClosed = outboundFailClosed;
  });

  const attachments = [
    {
      filename: 'report.txt',
      content: Buffer.from('all good').toString('base64'),
      encoding: 'base64',
      contentType: 'text/plain'
    }
  ];
  // (in monitor mode with SPAM_SCANNER_OUTBOUND_BLOCK=false: sent unchecked;
  //  with it, deferred, see the next test)
  const { outboundBlock } = config.spamScanner;
  config.spamScanner.outboundBlock = false;
  const monitored = await send(attachments);
  config.spamScanner.outboundBlock = outboundBlock;
  t.is(monitored.status, 200, `${JSON.stringify(monitored.body)}`);
  await Emails.deleteMany({ domain: domain._id });

  enforce(t);
  const res = await send(attachments);
  t.is(res.status, 503, `${JSON.stringify(res.body)}`);
  t.regex(
    res.body.message,
    /could not be scanned at this time, please try again later/
  );
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);

  // (as is one whose link hosts were not all looked up, e.g. while DNS fails)
  spamScanner.scan = async () => ({
    version: spamScanner.getVersion(),
    isSpam: false,
    score: 0,
    threshold: 5,
    rejectThreshold: 15,
    action: 'accept',
    tests: [],
    findings: {},
    enforced: true,
    linksComplete: false
  });
  const partly = await send(attachments);
  t.is(partly.status, 503, `${JSON.stringify(partly.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);
  spamScanner.scan = async () => null;

  // one this server makes itself (a vacation reply, a calendar invitation)
  // has no client to try again, so it is sent unchecked
  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: 'someone@example.net',
      subject: 'away',
      text: 'back on monday'
    },
    alias: { _id: alias._id },
    domain: domain._id,
    user: user._id
  });
  t.truthy(email);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);

  config.spamScanner.outboundFailClosed = false;
  const ok = await send(attachments);
  t.is(ok.status, 200, `${JSON.stringify(ok.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 2);
});

test('in monitor mode a submission whose scan fails or takes too long is queued unchecked at once, to be scanned as it is sent, never sent unscanned, also with Spam Scanner off; with SPAM_SCANNER_OUTBOUND_BLOCK=false it is queued as before', async (t) => {
  const { domain, send } = await setup(t);
  const attachments = [
    {
      filename: 'report.txt',
      content: Buffer.from('all good').toString('base64'),
      encoding: 'base64',
      contentType: 'text/plain'
    }
  ];
  // (a worker that never answers: the scan takes longer than the outbound
  //  time limit, which a submission that could be refused has)
  const { outboundTimeout, enabled } = config.spamScanner;
  config.spamScanner.outboundTimeout = 1000;
  t.teardown(async () => {
    config.spamScanner.outboundTimeout = outboundTimeout;
    config.spamScanner.enabled = enabled;
    // (a new pool, with workers that answer)
    await spamScanner.reset();
  });
  t.true(config.spamScanner.monitorOnly);
  // (each queued marked unchecked, so it is scanned as it is sent, and
  //  refused then for what blocks it, see `blocksAsSent`)
  const queuedUnchecked = async (res) => {
    t.is(res.status, 200, `${JSON.stringify(res.body)}`);
    const email = await Emails.findById(res.body.id).lean();
    t.deepEqual(email.spam_scan, { unchecked: true });
  };

  spamScanner.getPool().run = () => new Promise(() => {});
  const started = Date.now();
  await queuedUnchecked(await send(attachments));
  t.true(Date.now() - started < 5000, `took ${Date.now() - started}ms`);

  // (a worker that fails)
  spamScanner.getPool().run = async () => {
    throw new Error('out of memory');
  };

  await queuedUnchecked(await send(attachments));

  // with Spam Scanner turned off it is still scanned for what blocks it,
  // as origin always scanned outbound mail: queued unchecked
  config.spamScanner.enabled = false;
  await queuedUnchecked(await send(attachments));
  config.spamScanner.enabled = true;
  t.is(await Emails.countDocuments({ domain: domain._id }), 3);

  // and with SPAM_SCANNER_OUTBOUND_BLOCK=false, as before: queued, and sent
  // as it is
  withoutOutboundBlock(t);
  const unblocked = await send(attachments);
  t.is(unblocked.status, 200, `${JSON.stringify(unblocked.body)}`);
  const email = await Emails.findById(unblocked.body.id).lean();
  t.is(email.spam_scan, undefined);
});

test('in monitor mode none of a burst of submissions with the GTUBE test string is sent unscanned: each is refused, or queued unchecked at once when more wait for a worker than the queue holds', async (t) => {
  withColdStartTime(t);
  const { domain, send } = await setup(t);
  captureSpamScannerLog(t);
  // (more at once than may wait for a worker)
  const { maxQueue } = config.spamScanner;
  config.spamScanner.maxQueue = 2;
  t.teardown(() => {
    config.spamScanner.maxQueue = maxQueue;
  });
  const responses = await Promise.all(
    Array.from({ length: 12 }, () =>
      send([], {
        text: 'XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X'
      })
    )
  );
  // (each scanned and refused, or queued unchecked, at once: refused then
  //  as it is sent, see `blocksAsSent`)
  for (const res of responses)
    t.true([200, 403].includes(res.status), `${JSON.stringify(res.body)}`);
  t.true(responses.some((res) => res.status === 403));
  const queued = responses.filter((res) => res.status === 200);
  t.true(queued.length > 0);
  const emails = await Emails.find({ domain: domain._id }).lean();
  t.is(emails.length, queued.length);
  for (const email of emails) t.deepEqual(email.spam_scan, { unchecked: true });
});

test('a raw submission whose header no parser could read in reasonable time is refused at once, and an ordinary one is accepted', async (t) => {
  withColdStartTime(t);
  const { user, domain, alias } = await setup(t);
  captureSpamScannerLog(t);
  const from = `${alias.name}@${domain.name}`;
  const submit = (header) =>
    t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        raw: [
          `From: ${from}`,
          'To: someone@example.net',
          header,
          'Date: Mon, 19 Oct 2026 10:00:00 +0000',
          '',
          'hello'
        ].join('\r\n')
      });

  // 40,000 folded lines in one field: each header parser joins them one at
  // a time, in time in the square of their number
  const cpu = process.cpuUsage();
  const res = await submit(`Subject: x${'\r\n y'.repeat(40_000)}`);
  const used = process.cpuUsage(cpu);
  const ms = (used.user + used.system) / 1000;
  t.is(res.status, 400, `${JSON.stringify(res.body)}`);
  t.regex(res.body.message, /more than 5000 lines/);
  t.true(ms < 3000, `${Math.round(ms)}ms of CPU`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);

  const ok = await submit('Subject: hello');
  t.is(ok.status, 200, `${JSON.stringify(ok.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);
});

test('a submission whose From field mailauth could not read in reasonable time is refused at once', async (t) => {
  withColdStartTime(t);
  const { user, domain, alias } = await setup(t);
  captureSpamScannerLog(t);
  const from = `${alias.name}@${domain.name}`;
  const submit = (fromField) =>
    t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        raw: [
          `From: ${fromField}`,
          'To: someone@example.net',
          'Subject: hello',
          'Date: Mon, 19 Oct 2026 10:00:00 +0000',
          '',
          'hello'
        ].join('\r\n')
      });

  // one address, and 99 KB of empty groups (mailauth reads it as the
  // message is sent, in time in the square of their number)
  const groups = 'g:;'
    .repeat(33_000)
    .match(/.{1,998}/g)
    .join('\r\n ');
  const cpu = process.cpuUsage();
  const res = await submit(`${from}, ${groups}`);
  const used = process.cpuUsage(cpu);
  const ms = (used.user + used.system) / 1000;
  t.is(res.status, 400, `${JSON.stringify(res.body)}`);
  t.regex(res.body.message, /"From" header/);
  t.true(ms < 3000, `${Math.round(ms)}ms of CPU`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);

  const ok = await submit(from);
  t.is(ok.status, 200, `${JSON.stringify(ok.body)}`);
});

//
// Spam Scanner 5's file type check (file-type 16.5.4) looped forever on an
// ASF file with a sub-header shorter than its own header
// (GHSA-5v7r-6r5c-r473), which held the whole process; Spam Scanner 7 reads
// file types itself, without file-type.
//
test('an attachment the file type check could not finish is still checked', async (t) => {
  const { domain, send } = await setup(t);

  // (an ASF header object, then a sub-header that gives its size as 0)
  const content = Buffer.alloc(256);
  Buffer.from([
    0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11, 0xa6, 0xd9, 0x00, 0xaa,
    0x00, 0x62, 0xce, 0x6c
  ]).copy(content);
  content.writeBigUInt64LE(256n, 16);
  content.fill(0x11, 30, 46);
  content.writeBigUInt64LE(0n, 46);

  // (and the same after an ID3 tag, which file-type skips first: its size
  //  bytes are read as file-type reads them, here 0x80 * 2^7 bytes)
  const id3 = Buffer.from([0x49, 0x44, 0x33, 4, 0, 0, 0, 0, 0x80, 0]);
  const tagged = Buffer.concat([id3, Buffer.alloc(0x80 * 2 ** 7), content]);

  for (const [i, file] of [content, tagged].entries()) {
    const res = await send([
      {
        filename: 'clip.wmv',
        content: file.toString('base64'),
        encoding: 'base64',
        contentType: 'video/x-ms-wmv'
      }
    ]);
    t.is(res.status, 200, `${JSON.stringify(res.body)}`);
    t.is(await Emails.countDocuments({ domain: domain._id }), i + 1);
  }
});
