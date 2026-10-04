/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A log of a message sent to several recipients is shown to everyone who may
// see one of them (two customers whose addresses were both recipients, or two
// members of a domain). Each must see only their own deliveries: never where
// another recipient's alias forwards to, nor what that destination replied.
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

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function teamUser(t, user) {
  user.plan = 'team';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  user[config.userFields.hasVerifiedEmail] = true;
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
  return user.save();
}

test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  t.context.user = await teamUser(t, user);
  t.context.other = await teamUser(t, await t.context.userFactory.create());
  t.context.member = await teamUser(t, await t.context.userFactory.create());
  await utils.setupWebServer(t);
  await utils.loginUser(t);

  // a domain of the logged in user
  t.context.domain = await t.context.domainFactory
    .withState({
      name: `own-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'team',
      skip_verification: true
    })
    .create();

  // a domain of another customer
  t.context.otherDomain = await t.context.domainFactory
    .withState({
      name: `other-${randomUUID()}.example.com`,
      members: [{ user: t.context.other._id, group: 'admin' }],
      plan: 'team',
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

// a log as the MX server stores it, for a message to both customers
async function createLog(t, fields) {
  const own = `alice@${t.context.domain.name}`;
  const other = `bob@${t.context.otherDomain.name}`;
  const _id = new mongoose.Types.ObjectId();
  const { insertedId } = await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    is_restricted: true,
    domains: [t.context.domain._id, t.context.otherDomain._id],
    domains_checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    ...fields,
    meta: {
      level: fields.message === 'delivered' ? 'info' : 'error',
      app: { hostname: env.MX1_HOST },
      ...fields.meta,
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        remoteAddress: '192.0.2.10',
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'sender@sender.example.net' },
          rcptTo: [{ address: own }, { address: other }]
        },
        headers: { Subject: 'Hello', To: `${own}, ${other}` }
      }
    }
  });
  return { id: insertedId.toString(), own, other };
}

test('another customer’s forwarding destination is not shown', async (t) => {
  const { id } = await createLog(t, {
    message: 'delivered',
    meta: {
      info: {
        accepted: ['private-inbox@destination.example.net'],
        envelope: {
          from: 'srs@example.com',
          to: ['private-inbox@destination.example.net']
        },
        forwardedFor: `bob@${t.context.otherDomain.name}`,
        response:
          '250 2.0.0 OK queued for private-inbox@destination.example.net'
      }
    }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.false(res.text.includes('private-inbox@destination.example.net'));

  const list = await t.context.web.get('/en/my-account/logs');
  t.is(list.status, 200);
  t.false(list.text.includes('private-inbox@destination.example.net'));
});

test('a forwarding destination of the user’s own alias is shown', async (t) => {
  const { id } = await createLog(t, {
    message: 'delivered',
    meta: {
      info: {
        accepted: ['my-inbox@destination.example.net'],
        envelope: {
          from: 'srs@example.com',
          to: ['my-inbox@destination.example.net']
        },
        forwardedFor: `alice@${t.context.domain.name}`,
        response: '250 2.0.0 OK'
      }
    }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes('my-inbox@destination.example.net'));
});

test('only the user’s own delivery errors are shown', async (t) => {
  const own = `alice@${t.context.domain.name}`;
  const other = `bob@${t.context.otherDomain.name}`;
  const ownError = `5.2.2 ${own}: mailbox full`;
  const otherError = `5.1.1 ${other}: user unknown at destination.example.net`;
  const { id } = await createLog(t, {
    message: `${ownError}; ${otherError}`,
    err: {
      name: 'Error',
      message: `${ownError}; ${otherError}`,
      responseCode: 550,
      bounces: [
        {
          address: own,
          err: { message: ownError, responseCode: 552 },
          recipient: { to: ['my-inbox@destination.example.net'] }
        },
        {
          address: other,
          err: { message: otherError, responseCode: 550 },
          recipient: { to: ['private-inbox@destination.example.net'] }
        }
      ]
    }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes('mailbox full'));
  t.true(res.text.includes('my-inbox@destination.example.net'));
  t.false(res.text.includes('private-inbox@destination.example.net'));
  t.false(res.text.includes('user unknown'));
});

test('a log with only another customer’s delivery error is not shown', async (t) => {
  const other = `bob@${t.context.otherDomain.name}`;
  const { id } = await createLog(t, {
    message: `5.1.1 ${other}: user unknown`,
    err: {
      name: 'Error',
      message: `5.1.1 ${other}: user unknown`,
      responseCode: 550,
      bounces: [
        {
          address: other,
          err: { message: `5.1.1 ${other}: user unknown`, responseCode: 550 },
          recipient: { to: ['private-inbox@destination.example.net'] }
        }
      ]
    }
  });

  const res = await t.context.web.get(`/en/my-account/logs/${id}`);
  t.false(res.text.includes('private-inbox@destination.example.net'));
  t.false(res.text.includes('user unknown'));
});

test('a member does not see where another member’s alias forwards', async (t) => {
  // the logged in user is a member (not an admin) of a shared domain
  const shared = await t.context.domainFactory
    .withState({
      name: `shared-${randomUUID()}.example.com`,
      members: [
        { user: t.context.member._id, group: 'admin' },
        { user: t.context.user._id, group: 'user' }
      ],
      plan: 'team',
      skip_verification: true
    })
    .create();
  await t.context.aliasFactory
    .withState({
      name: 'alice',
      user: t.context.user._id,
      domain: shared._id,
      recipients: ['my-inbox@destination.example.net']
    })
    .create();
  await t.context.aliasFactory
    .withState({
      name: 'carol',
      user: t.context.member._id,
      domain: shared._id,
      recipients: ['private-inbox@destination.example.net']
    })
    .create();

  const _id = new mongoose.Types.ObjectId();
  const { insertedId } = await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    is_restricted: true,
    domains: [shared._id],
    domains_checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    message: 'delivered',
    meta: {
      level: 'info',
      app: { hostname: env.MX1_HOST },
      info: {
        accepted: ['private-inbox@destination.example.net'],
        envelope: { to: ['private-inbox@destination.example.net'] },
        forwardedFor: `carol@${shared.name}`
      },
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'sender@sender.example.net' },
          rcptTo: [
            { address: `alice@${shared.name}` },
            { address: `carol@${shared.name}` }
          ]
        },
        headers: { Subject: 'Hello' }
      }
    }
  });

  const res = await t.context.web.get(
    `/en/my-account/logs/${insertedId.toString()}`
  );
  t.false(res.text.includes('private-inbox@destination.example.net'));
});
