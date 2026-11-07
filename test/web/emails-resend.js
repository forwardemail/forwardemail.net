/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// My Account > Emails shows the size of each message and the IP address of
// the client that sent it, and a delivered or bounced message can be resent
// (a copy is queued for all of its recipients, see #545 and #536).
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

  const email = await Emails.queue({
    message: {
      from: `${alias.name}@${domain.name}`,
      to: RECIPIENT,
      subject: 'resend test',
      text: 'resend test body'
    },
    user: t.context.user._id,
    remoteAddress: CLIENT_IP
  });

  const send = (id) =>
    Emails.findById(id).then((email) =>
      processEmail({ email, port, resolver, client })
    );

  return { domain, alias, email, received, send };
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
