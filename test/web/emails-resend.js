/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// My Account > Emails shows the size of each message and the IP address of
// the client that sent it, and a delivered or bounced message can be resent
// (a copy is queued for all of its recipients, see #545 and #536).
//
// Its columns (date, sender, recipients, email, size, delivery time and
// status) sort the list, and a status or response code in a row filters it.
//

const { Buffer } = require('node:buffer');
const { Writable } = require('node:stream');

const Redis = require('ioredis-mock');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { JSDOM } = require('jsdom');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails, Users } = require('#models');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const IP_ADDRESS = ip.address();
const RECIPIENT = 'resend@example.net';
// (a documentation address, RFC 5737)
const CLIENT_IP = '203.0.113.5';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();

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

  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

//
// A domain that can send (DNS answered from the cache), an SMTP server that
// stands in for the recipient's, and a message sent from it
//
async function setup(t, retentionDays = 1) {
  const client = new Redis({ keyPrefix: `${t.title}:` });
  t.teardown(() => client.disconnect());
  const resolver = createTangerine(client, logger);

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: t.context.user.plan,
      has_smtp: true,
      retention_days: retentionDays,
      resolver
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: domain._id,
      recipients: [t.context.user.email]
    })
    .create();

  const map = new Map();
  map.set(
    'mx:example.net',
    resolver.spoofPacket(
      'example.net',
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true
    )
  );
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
  await resolver.options.cache.mset(map);

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const received = [];
  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    secure: false,
    logger: false,
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
  await pify(server.listen.bind(server))(port);
  t.teardown(() => server.close());

  const queue = (subject = 'resend test') =>
    Emails.queue({
      message: {
        from: `${alias.name}@${domain.name}`,
        to: RECIPIENT,
        subject,
        text: 'resend test body'
      },
      user: t.context.user._id,
      remoteAddress: CLIENT_IP
    });
  const email = await queue();

  const send = (id) =>
    Emails.findById(id).then((email) =>
      processEmail({ email, port, resolver, client })
    );

  return { domain, alias, email, received, send, queue };
}

function getRow(html, id) {
  const { document } = new JSDOM(html).window;
  return [...document.querySelectorAll('tbody tr')].find((tr) =>
    tr.textContent.includes(id)
  );
}

// (the other message on the domain, e.g. the copy that was resent)
function findCopy(email) {
  return Emails.findOne({ domain: email.domain, _id: { $ne: email._id } })
    .lean()
    .exec();
}

test('a sent message is resent as a copy to all of its recipients', async (t) => {
  const { web } = t.context;
  const { email, received, send } = await setup(t);

  // (stored with its size and the IP address of the client that sent it)
  t.is(email.remote_address, CLIENT_IP);
  t.true(email.size > 0);

  await send(email._id);
  const sent = await Emails.findById(email._id).lean().exec();
  t.is(sent.status, 'sent');
  t.false(sent.is_redacted);
  t.deepEqual(sent.accepted, [RECIPIENT]);
  t.is(received.length, 1);

  // the list shows the size, the client IP and the Resend button
  let res = await web.get('/en/my-account/emails');
  t.is(res.status, 200);
  const row = getRow(res.text, email.id);
  t.truthy(row);
  t.true(row.textContent.includes(CLIENT_IP));
  t.true(row.textContent.includes(bytes(email.size)));
  const form = row.querySelector(
    `form[action="/en/my-account/emails/${email.id}/resend"]`
  );
  t.truthy(form);
  t.true(form.classList.contains('confirm-prompt'));

  // (so is the email's own page)
  res = await web.get(`/en/my-account/emails/${email.id}`);
  t.is(res.status, 200);
  t.true(res.text.includes(CLIENT_IP));
  t.true(res.text.includes(`/en/my-account/emails/${email.id}/resend`));

  // resend it
  res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 200);
  t.is(res.body.redirectTo, '/en/my-account/emails');

  // the original keeps its delivery history
  const original = await Emails.findById(email._id).lean().exec();
  t.is(original.status, 'sent');
  t.deepEqual(original.accepted, [RECIPIENT]);

  // and a copy is queued with its own Message-ID and Date
  const copy = await findCopy(email);
  t.truthy(copy);
  t.is(copy.status, 'queued');
  t.is(copy.subject, 'resend test');
  t.deepEqual(copy.envelope, sent.envelope);
  t.is(copy.alias.toString(), email.alias.toString());
  t.not(copy.messageId, email.messageId);
  t.true(new Date(copy.date).getTime() > new Date(sent.date).getTime());
  t.true(copy.size > 0);
  // (sent from the browser that resent it)
  t.true(['127.0.0.1', '::1'].includes(copy.remote_address));

  // the success modal links to the copy to track its delivery
  res = await web.get('/en/my-account/emails');
  t.true(res.text.includes(`/en/my-account/emails/${copy._id}`));
  t.true(res.text.includes('Track its delivery status'));

  // the copy is delivered
  await send(copy._id);
  const delivered = await Emails.findById(copy._id).lean().exec();
  t.is(delivered.status, 'sent');
  t.deepEqual(delivered.accepted, [RECIPIENT]);
  t.is(received.length, 2);
  t.true(received[1].includes('resend test body'));
  // (with its own Message-ID, so a recipient that has the original keeps it)
  const getMessageId = (raw) =>
    /^message-id:\s*<([^>]+)>/im.exec(raw.split(/\r?\n\r?\n/)[0])?.[1];
  t.is(getMessageId(received[0]), email.messageId);
  t.is(getMessageId(received[1]), copy.messageId);
  t.not(copy.messageId, email.messageId);

  // (and the original can be resent again)
  res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 200);
  t.is(
    await Emails.countDocuments({ domain: email.domain, status: 'queued' }),
    1
  );
});

test('a resent message counts toward the sending limits', async (t) => {
  const { web } = t.context;
  const { alias, email, send } = await setup(t);
  await send(email._id);

  // (the original was the one message the alias may send today)
  await alias.constructor.findByIdAndUpdate(alias._id, {
    $set: { smtp_limit: 1 }
  });

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 429);
  t.falsy(await findCopy(email));
});

test('a suspended alias cannot resend a message', async (t) => {
  const { web } = t.context;
  const { alias, email, send } = await setup(t);
  await send(email._id);

  await alias.constructor.findByIdAndUpdate(alias._id, {
    $set: { smtp_suspended_sent_at: new Date() }
  });

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 403);
  t.true(res.body.message.includes('suspended'));
  t.falsy(await findCopy(email));
});

test('a message resent while its domain is suspended waits for approval', async (t) => {
  const { web } = t.context;
  const { domain, email, send } = await setup(t);
  await send(email._id);

  await domain.constructor.findByIdAndUpdate(domain._id, {
    $set: { smtp_suspended_sent_at: new Date() }
  });

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 200);
  const copy = await findCopy(email);
  t.is(copy.status, 'pending');
});

test('a queued message cannot be resent', async (t) => {
  const { web } = t.context;
  const { email } = await setup(t);
  t.is(email.status, 'queued');

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 400);
  t.true(res.body.message.includes('can be resent'));
  t.falsy(await findCopy(email));

  const page = await web.get('/en/my-account/emails');
  const row = getRow(page.text, email.id);
  t.falsy(row.querySelector('form[action$="/resend"]'));
});

test('a redacted message cannot be resent and says why', async (t) => {
  const { web } = t.context;
  // (no retention: the body is redacted once it is delivered)
  const { email, send } = await setup(t, 0);
  await send(email._id);

  const redacted = await Emails.findById(email._id).lean().exec();
  t.is(redacted.status, 'sent');
  t.true(redacted.is_redacted);
  // (the size it was sent with, not the size of the redacted message)
  t.is(redacted.size, email.size);

  const page = await web.get('/en/my-account/emails');
  const row = getRow(page.text, email.id);
  t.falsy(row.querySelector('form[action$="/resend"]'));
  const disabled = row.querySelector('button[disabled]');
  t.truthy(disabled);
  t.true(
    disabled.parentElement
      .getAttribute('title')
      .includes('its content was redacted')
  );

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 400);

  t.falsy(await findCopy(email));
});

test('a message rejected as spam cannot be resent', async (t) => {
  const { web } = t.context;
  const { email } = await setup(t);
  await Emails.findByIdAndUpdate(email._id, {
    $set: {
      status: 'bounced',
      rejectedErrors: [
        {
          recipient: RECIPIENT,
          responseCode: 550,
          response: '550 5.7.1 Message rejected as spam',
          truthSource: 'example.net',
          bounceInfo: { action: 'reject', category: 'spam' }
        }
      ]
    }
  });

  const page = await web.get('/en/my-account/emails');
  const row = getRow(page.text, email.id);
  t.falsy(row.querySelector('form[action$="/resend"]'));

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 400);

  t.falsy(await findCopy(email));
});

test('a bounced message is resent', async (t) => {
  const { web } = t.context;
  const { email, received, send } = await setup(t);
  await Emails.findByIdAndUpdate(email._id, {
    $set: {
      status: 'bounced',
      hard_bounces: [RECIPIENT],
      rejectedErrors: [
        {
          recipient: RECIPIENT,
          responseCode: 550,
          response: '550 5.1.1 Mailbox unavailable',
          bounceInfo: { action: 'reject', category: 'recipient' }
        }
      ]
    }
  });

  const res = await web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 200);

  // (the original stays bounced, and the copy is delivered)
  const original = await Emails.findById(email._id).lean().exec();
  t.is(original.status, 'bounced');
  const copy = await findCopy(email);
  await send(copy._id);
  const sent = await Emails.findById(copy._id).lean().exec();
  t.is(sent.status, 'sent');
  t.deepEqual(sent.hard_bounces, []);
  t.is(received.length, 1);
});

test("another user's message cannot be resent", async (t) => {
  const { email, send } = await setup(t);
  await send(email._id);

  // sign in as someone else
  const password = falso.randPassword();
  let other = await t.context.userFactory
    .withState({ plan: 'enhanced_protection' })
    .make();
  other = await Users.register(other, password);
  other[config.userFields.hasVerifiedEmail] = true;
  await other.save();
  await utils.teardownWebServer(t);
  await utils.setupWebServer(t);
  t.context.user = other;
  t.context.password = password;
  await utils.loginUser(t);

  const res = await t.context.web
    .post(`/en/my-account/emails/${email.id}/resend`)
    .set('Accept', 'application/json')
    .send();
  t.is(res.status, 404);
  t.falsy(await findCopy(email));
});

// a cell of a row of the list by the name of its column
function getCell(document, tr, name) {
  const names = [...document.querySelectorAll('thead th')].map((th) =>
    th.textContent.trim()
  );
  return tr.children[names.indexOf(name)];
}

async function getList(t, query = '') {
  const res = await t.context.web.get(`/en/my-account/emails${query}`);
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const ids = [...document.querySelectorAll('tbody tr')]
    .map((tr) => tr.querySelector('a[href$=".eml"]'))
    .filter(Boolean)
    .map((a) => a.getAttribute('href').split('/').pop().replace('.eml', ''));
  return { document, ids, text: res.text };
}

test('each email has its date, sender, recipients, size, delivery time and status', async (t) => {
  const { alias, domain, email, send } = await setup(t);
  await send(email._id);

  // (how long it took to deliver is stored, to sort the list by it)
  const sent = await Emails.findById(email._id).lean().exec();
  t.is(sent.status, 'sent');
  t.true(sent.delivery_time >= 0);
  t.true(
    sent.delivery_time <= Date.now() - new Date(sent.created_at).getTime()
  );

  const { document, text } = await getList(t);
  t.deepEqual(
    [...document.querySelectorAll('thead th')].map((th) =>
      th.textContent.trim()
    ),
    [
      'Date',
      'From',
      'To',
      'Email',
      'Size',
      'Delivery Time',
      'Status',
      'Actions'
    ]
  );
  const row = getRow(text, email.id);
  const cell = (name) => getCell(row.ownerDocument, row, name);

  // the sender and recipient filter the list for them
  const from = `${alias.name}@${domain.name}`;
  t.is(cell('From').textContent.trim(), from);
  t.is(
    cell('From').querySelector('a').getAttribute('href'),
    `/en/my-account/emails?q=${encodeURIComponent(from)}`
  );
  t.is(cell('To').textContent.trim(), RECIPIENT);
  t.is(
    cell('To').querySelector('a').getAttribute('href'),
    `/en/my-account/emails?q=${encodeURIComponent(RECIPIENT)}`
  );

  // the email is its subject (to its page) and Message-ID
  const subject = cell('Email').querySelector(
    `a[href="/en/my-account/emails/${email.id}"]`
  );
  t.is(subject.textContent, 'resend test');
  t.true(cell('Email').textContent.includes(email.messageId));
  t.true(cell('Email').textContent.includes(CLIENT_IP));
  t.is(cell('Size').textContent.trim(), bytes(email.size));

  // its status and the response, each filtering the list for it
  const status = cell('Status').querySelector('a.badge-success');
  t.is(status.textContent, 'Sent');
  t.is(status.getAttribute('href'), '/en/my-account/emails?status=sent');
  const code = cell('Status').querySelector('a.badge-pill');
  t.is(code.textContent, '250');
  t.is(code.getAttribute('href'), '/en/my-account/emails?response_codes=250');

  // its delivery time is colored by how long it took
  await Emails.findByIdAndUpdate(email._id, {
    $set: { delivery_time: 75_000 }
  });
  const list = await getList(t);
  const time = getCell(
    list.document,
    getRow(list.text, email.id),
    'Delivery Time'
  );
  t.is(time.textContent.trim(), '1m 15s');
  t.truthy(time.querySelector('.text-danger'));

  // (as on the page of the email)
  const res = await t.context.web.get(`/en/my-account/emails/${email.id}`);
  t.is(res.status, 200);
  const page = new JSDOM(res.text).window.document;
  const th = [...page.querySelectorAll('th')].find(
    (th) => th.textContent === 'DELIVERY TIME'
  );
  t.is(th.nextElementSibling.textContent.trim(), '1m 15s');
});

test('the list is filtered by status, response code and date and sorted by its columns', async (t) => {
  const { email, queue, send } = await setup(t);
  await send(email._id);
  const bounced = await queue('bounce test');
  await Emails.findByIdAndUpdate(bounced._id, {
    $set: {
      status: 'bounced',
      hard_bounces: [RECIPIENT],
      rejectedErrors: [
        {
          recipient: RECIPIENT,
          responseCode: 550,
          response: '550 5.1.1 Mailbox unavailable'
        }
      ]
    }
  });
  await Emails.findByIdAndUpdate(email._id, {
    $set: { size: 100, delivery_time: 5000 }
  });
  await Emails.findByIdAndUpdate(bounced._id, { $set: { size: 200 } });

  // by status
  let list = await getList(t, '?status=bounced');
  t.deepEqual(list.ids, [bounced.id]);
  list = await getList(t, '?status=sent');
  t.deepEqual(list.ids, [email.id]);
  // (one that does not exist is ignored)
  list = await getList(t, '?status=nonsense');
  t.is(list.ids.length, 2);

  // by response code (250 for each recipient it was delivered to)
  list = await getList(t, '?response_codes=550');
  t.deepEqual(list.ids, [bounced.id]);
  list = await getList(t, '?response_codes=250');
  t.deepEqual(list.ids, [email.id]);
  list = await getList(t, '?response_codes=250,550');
  t.is(list.ids.length, 2);
  // (the code in the row of the bounced email filters for it)
  const row = getRow(list.text, bounced.id);
  const code = getCell(list.document, row, 'Status').querySelector(
    'a.badge-danger.badge-pill'
  );
  t.is(code.textContent, '550');
  t.is(code.getAttribute('href'), '/en/my-account/emails?response_codes=550');
  t.true(row.textContent.includes('550 5.1.1 Mailbox unavailable'));

  // (several, as the table forms write them, or with spaces)
  list = await getList(
    t,
    '?response_codes%5B0%5D=250&response_codes%5B1%5D=550'
  );
  t.is(list.ids.length, 2);
  list = await getList(t, '?status=sent,%20bounced');
  t.is(list.ids.length, 2);

  // (and when the table is refreshed by itself)
  const res = await t.context.web
    .get('/en/my-account/emails?status=bounced')
    .set('Accept', 'application/json');
  t.is(res.status, 200);
  t.true(res.body.table.includes(bounced.id));
  t.false(res.body.table.includes(email.id));

  // by the date it was sent (a day in the time zone of the user, UTC)
  const day = (days) =>
    dayjs.utc(email.created_at).add(days, 'day').format('YYYY-MM-DD');
  const today = day(0);
  const tomorrow = day(1);
  const yesterday = day(-1);
  list = await getList(t, `?start_date=${today}&end_date=${today}`);
  t.is(list.ids.length, 2);
  list = await getList(t, `?start_date=${tomorrow}`);
  t.deepEqual(list.ids, []);
  t.true(list.text.includes('No emails exist for that search.'));
  list = await getList(t, `?end_date=${yesterday}`);
  t.deepEqual(list.ids, []);

  // sorted by each column
  list = await getList(t, '?sort=size');
  t.deepEqual(list.ids, [email.id, bounced.id]);
  list = await getList(t, '?sort=-size');
  t.deepEqual(list.ids, [bounced.id, email.id]);
  list = await getList(t, '?sort=-delivery_time');
  t.deepEqual(list.ids, [email.id, bounced.id]);
  list = await getList(t, '?sort=status');
  t.deepEqual(list.ids, [bounced.id, email.id]);
  list = await getList(t, '?sort=-subject');
  t.deepEqual(list.ids, [email.id, bounced.id]);
  list = await getList(t, '?sort=envelope.from');
  t.is(list.ids.length, 2);

  // the header has the filters, and clears them
  list = await getList(t, '?status=bounced&sort=-size');
  const getButtons = (document) =>
    new Set(
      [...document.querySelectorAll('.dropdown-toggle')].map((button) =>
        button.textContent.trim()
      )
    );
  t.true(getButtons(list.document).has('Status: Bounced'));
  const statuses = [
    ...list.document.querySelectorAll('.dropdown-menu a.dropdown-item')
  ].find((a) => a.textContent === 'Sent');
  t.is(
    statuses.getAttribute('href'),
    '/en/my-account/emails?sort=-size&status=sent'
  );
  // (the codes filtered by from a row, to change or clear)
  t.is(list.document.querySelector('input[name="response_codes"]'), null);
  const codes = await getList(t, '?response_codes=550&sort=-size');
  t.true(getButtons(codes.document).has('Codes: 550'));
  const box = codes.document.querySelector('input[name="response_codes"]');
  t.is(box.value, '550');
  t.true(box.checked);
  t.is(box.form.querySelector('input[name="sort"]').value, '-size');
  const clear = [...list.document.querySelectorAll('a.btn')].find(
    (a) => a.textContent.trim() === 'Clear filters'
  );
  t.is(clear.getAttribute('href'), '/en/my-account/emails');
  list = await getList(t);
  t.false(list.text.includes('Clear filters'));
});

test('the dates of the list are days in the time zone of the user', async (t) => {
  const { email } = await setup(t);
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { timezone: 'America/Los_Angeles' } }
  );
  // yesterday at 3 AM UTC, the evening before in Los Angeles
  const createdAt = dayjs.utc().subtract(1, 'day').startOf('day').add(3, 'h');
  await Emails.collection.updateOne(
    { _id: email._id },
    { $set: { created_at: createdAt.toDate(), date: createdAt.toDate() } }
  );
  const local = createdAt.tz('America/Los_Angeles').format('YYYY-MM-DD');
  const utc = createdAt.format('YYYY-MM-DD');
  t.not(local, utc);

  let list = await getList(t, `?start_date=${local}&end_date=${local}`);
  t.deepEqual(list.ids, [email.id]);
  list = await getList(t, `?start_date=${utc}&end_date=${utc}`);
  t.deepEqual(list.ids, []);
});

test('the list of a user without domains has nothing to filter', async (t) => {
  for (const query of ['', '?status=sent&response_codes=550&sort=size']) {
    const { text } = await getList(t, query);
    t.true(text.includes('No emails have been stored yet.'), `${query}`);
  }
});
