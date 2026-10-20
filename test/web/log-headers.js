/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A header can occur more than once in a message (e.g. a DKIM-Signature from
// Amazon SES and another from the sender's own domain), and the log of that
// message must show every one of them, not only the last.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const { Logs, Users } = require('#models');
const sanitizeLogPayload = require('#helpers/sanitize-log-payload');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'team';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);

  t.context.domain = await t.context.domainFactory
    .withState({
      name: `own-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'team',
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

// a log as the MX server stores it (see `helpers/update-session.js`), after
// the logger's `sanitizeLogPayload`
async function createLog(t, session) {
  const own = `alice@${t.context.domain.name}`;
  const _id = new mongoose.Types.ObjectId();
  const { message, meta } = sanitizeLogPayload({
    message: 'The email sent has failed DMARC validation',
    meta: {
      level: 'error',
      app: { hostname: env.MX1_HOST },
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        remoteAddress: '192.0.2.10',
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'sender@sender.example.net' },
          rcptTo: [{ address: own }]
        },
        ...session
      }
    }
  });
  await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    is_restricted: true,
    domains: [t.context.domain._id],
    domains_checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    message,
    meta
  });
  return _id.toString();
}

test('every value of a repeated header is shown', async (t) => {
  const id = await createLog(t, {
    headers: {
      Subject: 'Hello',
      'DKIM-Signature': 'v=1; d=sender.example.net; s=own; b=second-sig',
      'X-Header': 'two'
    },
    repeatedHeaders: {
      'DKIM-Signature': [
        'v=1; d=amazonses.com; s=ses; b=first-sig',
        'v=1; d=sender.example.net; s=own; b=second-sig'
      ],
      'X-Header': ['one', 'two']
    }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes('d=amazonses.com; s=ses; b=first-sig'));
  t.true(res.text.includes('d=sender.example.net; s=own; b=second-sig'));
  t.is(res.text.split('<strong>X-Header</strong>').length - 1, 2);
  t.is(res.text.split('<strong>DKIM-Signature</strong>').length - 1, 2);
  t.is(res.text.split('<strong>Subject</strong>').length - 1, 1);
});

test('a log without repeated headers shows each header once', async (t) => {
  const id = await createLog(t, {
    headers: { Subject: 'Hello', 'X-Header': 'only' }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.is(res.text.split('<strong>X-Header</strong>').length - 1, 1);
  t.true(res.text.includes('only'));
});

test('repeated Bcc values are never shown', async (t) => {
  const id = await createLog(t, {
    headers: { Subject: 'Hello', Bcc: `alice@${t.context.domain.name}` },
    repeatedHeaders: {
      Bcc: ['hidden-recipient@elsewhere.example.net', 'alice@example.com']
    }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.false(res.text.includes('hidden-recipient@elsewhere.example.net'));
});

test('a long chain of Received headers is shown in full', async (t) => {
  const received = Array.from(
    { length: 12 },
    (_, i) => `from hop-${i}.example.net by mx.example.net`
  );
  const id = await createLog(t, {
    headers: { Subject: 'Hello', Received: received.at(-1) },
    repeatedHeaders: { Received: received }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.is(res.text.split('<strong>Received</strong>').length - 1, 12);
  for (const value of received) t.true(res.text.includes(value));
  t.false(res.text.includes('more items truncated'));
});
