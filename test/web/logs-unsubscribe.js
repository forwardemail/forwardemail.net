/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// My Account > Logs offers one-click unsubscribe (RFC 8058) for a message
// that supports it, sent by the viewer's own browser (see #309).
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const getOneClickUnsubscribeUrl = require('#helpers/get-one-click-unsubscribe-url');
const { Logs, Users } = require('#models');

const LIST_HOST = 'news.example.com';
const LIST_URL = `https://${LIST_HOST}/unsubscribe?id=abc123`;
const ONE_CLICK = 'List-Unsubscribe=One-Click';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'enhanced_protection';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  t.context.user = await user.save();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: 'enhanced_protection',
      kind: 'one-time'
    })
    .create();

  await utils.setupWebServer(t);
  await utils.loginUser(t);

  t.context.domain = await t.context.domainFactory
    .withState({
      name: `own-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

// a log of a message the MX server received for the user's domain
// (with `baseHeaders` in place of its usual From, Subject and To)
async function createLog(t, headers, fields = {}, baseHeaders = undefined) {
  baseHeaders ||= {
    From: 'News <list@news.example.com>',
    Subject: 'Weekly news',
    To: `alice@${t.context.domain.name}`
  };
  const _id = new mongoose.Types.ObjectId();
  await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    is_restricted: true,
    domains: [t.context.domain._id],
    domains_checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    message: 'delivered',
    ...fields,
    meta: {
      level: 'info',
      app: { hostname: env.MX1_HOST },
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        remoteAddress: '192.0.2.10',
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'list@news.example.com' },
          rcptTo: [{ address: `alice@${t.context.domain.name}` }]
        },
        headers: { ...baseHeaders, ...headers },
        ...fields.session
      },
      ...fields.meta
    }
  });
  return _id.toString();
}

function getRow(html, id) {
  const { document } = new JSDOM(html).window;
  return [...document.querySelectorAll('tbody tr')].find((tr) =>
    tr.querySelector(`a[href="/en/my-account/logs/${id}"]`)
  );
}

test('a message with one-click unsubscribe can be unsubscribed from', async (t) => {
  const { web } = t.context;
  const id = await createLog(t, {
    'List-Unsubscribe': `<mailto:unsubscribe@news.example.com>, <${LIST_URL}>`,
    'List-Unsubscribe-Post': ONE_CLICK
  });

  // the list of logs has a button for it
  let res = await web.get('/en/my-account/logs');
  t.is(res.status, 200);
  const row = getRow(res.text, id);
  t.truthy(row);
  t.truthy(
    row.querySelector(`a[href="/en/my-account/logs/${id}/unsubscribe"]`)
  );

  // (so does the log's page)
  res = await web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.true(res.text.includes(`/en/my-account/logs/${id}/unsubscribe`));

  // the page the browser unsubscribes from
  res = await web.get(`/en/my-account/logs/${id}/unsubscribe`);
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const button = document.querySelector('button[data-one-click-unsubscribe]');
  t.truthy(button);
  t.is(button.dataset.oneClickUnsubscribe, LIST_URL);
  t.true(res.text.includes(LIST_HOST));
  t.true(res.text.includes('Weekly news'));
  // (and who it unsubscribes)
  t.true(res.text.includes(`alice@${t.context.domain.name}`));

  // (it may connect to the list's origin, and only on this page)
  const csp = res.headers['content-security-policy'];
  t.truthy(csp);
  t.regex(csp, new RegExp(`connect-src [^;]*https://${LIST_HOST}`));
  const list = await web.get('/en/my-account/logs');
  t.false(
    list.headers['content-security-policy'].includes(`https://${LIST_HOST}`)
  );
});

test('a message without one-click unsubscribe has no button', async (t) => {
  const { web } = t.context;
  // (a link to visit is not one-click: List-Unsubscribe-Post is missing)
  const id = await createLog(t, { 'List-Unsubscribe': `<${LIST_URL}>` });

  const res = await web.get('/en/my-account/logs');
  const row = getRow(res.text, id);
  t.truthy(row);
  t.falsy(row.querySelector('a[href$="/unsubscribe"]'));

  const page = await web.get(`/en/my-account/logs/${id}/unsubscribe`);
  t.is(page.status, 404);
});

test('only a message that failed to forward for a harmless reason can be unsubscribed from', async (t) => {
  const { web } = t.context;
  const headers = {
    'List-Unsubscribe': `<${LIST_URL}>`,
    'List-Unsubscribe-Post': ONE_CLICK
  };
  const rejected = (category) => ({
    message: 'Message was not delivered',
    bounce_category: category,
    err: {
      responseCode: 550,
      message: 'Message was not delivered',
      bounceInfo: { category, action: 'reject' }
    }
  });

  // (its sender would only learn the address is read)
  for (const category of ['spam', 'virus', 'dmarc', 'policy', 'other']) {
    const id = await createLog(t, headers, rejected(category));
    const page = await web.get(`/en/my-account/logs/${id}/unsubscribe`);
    t.is(page.status, 404, `${category}`);
  }

  // (e.g. the mailbox it is forwarded to is full)
  const id = await createLog(t, headers, rejected('recipient'));
  const page = await web.get(`/en/my-account/logs/${id}/unsubscribe`);
  t.is(page.status, 200);
});

test('the page shows the sender and subject whatever the case of their headers', async (t) => {
  const { web } = t.context;
  const id = await createLog(
    t,
    {
      'list-unsubscribe': `<${LIST_URL}>`,
      'list-unsubscribe-post': ONE_CLICK
    },
    {},
    { from: 'Lowercase <list@news.example.com>', SUBJECT: 'Uppercase news' }
  );

  const page = await web.get(`/en/my-account/logs/${id}/unsubscribe`);
  t.is(page.status, 200);
  t.true(page.text.includes('Lowercase &lt;list@news.example.com&gt;'));
  t.true(page.text.includes('Uppercase news'));
});

test('list mail the viewer sent cannot be unsubscribed from', async (t) => {
  const { web, domain } = t.context;
  // (the viewer's own list mail to someone else, which the MX server
  // received for another user, see retrieve-log.js)
  const id = await createLog(
    t,
    {
      'List-Unsubscribe': `<${LIST_URL}>`,
      'List-Unsubscribe-Post': ONE_CLICK
    },
    {
      session: {
        envelope: {
          mailFrom: { address: `news@${domain.name}` },
          rcptTo: [{ address: 'subscriber@example.net' }]
        }
      }
    }
  );

  const res = await web.get(`/en/my-account/logs/${id}`);
  t.is(res.status, 200);
  t.false(res.text.includes(`/en/my-account/logs/${id}/unsubscribe`));

  const page = await web.get(`/en/my-account/logs/${id}/unsubscribe`);
  t.is(page.status, 404);
});

test("another user's log cannot be unsubscribed from", async (t) => {
  const { web } = t.context;
  const otherUser = await t.context.userFactory.create();
  const other = await t.context.domainFactory
    .withState({
      name: `other-${randomUUID()}.example.com`,
      members: [
        {
          user: otherUser._id,
          group: 'admin'
        }
      ],
      plan: 'free',
      skip_verification: true
    })
    .create();
  const _id = new mongoose.Types.ObjectId();
  await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    is_restricted: true,
    domains: [other._id],
    domains_checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    message: 'delivered',
    meta: {
      level: 'info',
      app: { hostname: env.MX1_HOST },
      session: {
        envelope: {
          mailFrom: { address: 'list@news.example.com' },
          rcptTo: [{ address: `bob@${other.name}` }]
        },
        headers: {
          'List-Unsubscribe': `<${LIST_URL}>`,
          'List-Unsubscribe-Post': ONE_CLICK
        }
      }
    }
  });

  const page = await web.get(`/en/my-account/logs/${_id}/unsubscribe`);
  t.is(page.status, 400);
  t.false(page.text.includes(LIST_URL));
});

test('only a safe HTTPS URL is used for one-click unsubscribe', (t) => {
  const log = (value, post = ONE_CLICK, fields = {}) => ({
    meta: {
      app: { hostname: env.MX2_HOST },
      session: {
        envelope: { rcptTo: [{ address: 'alice@example.com' }] },
        headers: { 'list-unsubscribe': value, 'LIST-UNSUBSCRIBE-POST': post }
      }
    },
    ...fields
  });

  t.is(getOneClickUnsubscribeUrl(log(`<${LIST_URL}>`)), LIST_URL);
  // (the first HTTPS URI, after a mailto: one)
  t.is(
    getOneClickUnsubscribeUrl(log(`<mailto:u@example.com>,<${LIST_URL}>`)),
    LIST_URL
  );
  t.is(
    getOneClickUnsubscribeUrl(
      log(`<${LIST_URL}>`, ' list-unsubscribe=one-click ')
    ),
    LIST_URL
  );

  for (const value of [
    '<http://news.example.com/unsubscribe>',
    '<https://192.168.1.1/unsubscribe>',
    '<https://127.0.0.1/unsubscribe>',
    '<https://2130706433/unsubscribe>',
    '<https://[::1]/unsubscribe>',
    '<https://localhost/unsubscribe>',
    '<https://router.local/unsubscribe>',
    '<https://intranet/unsubscribe>',
    '<https://user:pass@news.example.com/unsubscribe>',
    '<https://news.example.com:8443/unsubscribe>',
    '<javascript:alert(1)>',
    '<data:text/html,hello>',
    `<https://news.example.com/${'a'.repeat(3000)}>`,
    LIST_URL,
    ''
  ]) {
    t.is(getOneClickUnsubscribeUrl(log(value)), undefined, `${value}`);
  }

  // not one-click
  t.is(getOneClickUnsubscribeUrl(log(`<${LIST_URL}>`, 'One-Click')), undefined);
  t.is(getOneClickUnsubscribeUrl(log(`<${LIST_URL}>`, '')), undefined);

  // not for a message the viewer sent, nor for one that was rejected as
  // unwanted (only for one that failed to forward for a harmless reason)
  t.is(
    getOneClickUnsubscribeUrl(log(`<${LIST_URL}>`, ONE_CLICK, { email: 'x' })),
    undefined
  );
  t.is(
    getOneClickUnsubscribeUrl(
      log(`<${LIST_URL}>`, ONE_CLICK, {
        bounce_category: 'virus',
        err: { message: 'Virus' }
      })
    ),
    undefined
  );
  t.is(
    getOneClickUnsubscribeUrl(
      log(`<${LIST_URL}>`, ONE_CLICK, { err: { message: 'Unknown' } })
    ),
    undefined
  );
  t.is(
    getOneClickUnsubscribeUrl(
      log(`<${LIST_URL}>`, ONE_CLICK, {
        err: { bounceInfo: { category: 'network' } }
      })
    ),
    LIST_URL
  );

  // only for a message our MX servers received for the viewer
  const outbound = log(`<${LIST_URL}>`);
  outbound.meta.app.hostname = env.SMTP_HOST;
  t.is(getOneClickUnsubscribeUrl(outbound), undefined);
  delete outbound.meta.app;
  t.is(getOneClickUnsubscribeUrl(outbound), undefined);
  const notForViewer = log(`<${LIST_URL}>`);
  notForViewer.meta.session.envelope.rcptTo = [];
  t.is(getOneClickUnsubscribeUrl(notForViewer), undefined);
});
