/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// My Account > Logs has a Status column with the response code and bounce
// category of each log, each a link that filters the list for it, and the
// list keeps its other filters and sort when it is filtered.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const revHash = require('rev-hash');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const { Domains, Logs, Users } = require('#models');

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
async function createLog(t, { session, meta, subject, ...fields } = {}) {
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
      level: fields.err ? 'error' : 'info',
      app: { hostname: env.MX1_HOST },
      session: {
        id: randomUUID(),
        fingerprint: randomUUID(),
        remoteAddress: '192.0.2.10',
        arrivalDate: new Date(),
        envelope: {
          mailFrom: { address: 'sender@example.net' },
          rcptTo: [{ address: `alice@${t.context.domain.name}` }]
        },
        headers: {
          From: 'Sender <sender@example.net>',
          Subject: subject || 'Hello',
          To: `alice@${t.context.domain.name}`
        },
        ...session
      },
      ...meta
    }
  });
  return _id.toString();
}

async function getPage(t, query = '') {
  const res = await t.context.web.get(`/en/my-account/logs${query}`);
  t.is(res.status, 200);
  return new JSDOM(res.text).window.document;
}

// the rows of the list by the id of their log
function getRows(document) {
  const rows = {};
  for (const tr of document.querySelectorAll('#table-logs tbody tr')) {
    const link = tr.querySelector('a[href^="/en/my-account/logs/"]');
    if (link) rows[link.getAttribute('href').split('/').pop()] = tr;
  }

  return rows;
}

// a cell of a row by the name of its column
function getCell(document, tr, name) {
  const names = [...document.querySelectorAll('#table-logs thead th')].map(
    (th) => th.textContent.trim()
  );
  return tr.children[names.indexOf(name)];
}

test('each log has its status, which filters the list for it', async (t) => {
  const delivered = await createLog(t, {
    meta: { info: { envelopeTime: 4000, messageTime: 8000 } }
  });
  const rejected = await createLog(t, {
    message: 'Message was not delivered',
    bounce_category: 'blocklist',
    err: {
      name: 'SMTPError',
      responseCode: 421,
      message: '421 Try again later'
    }
  });

  let document = await getPage(t);
  const names = [...document.querySelectorAll('#table-logs thead th')].map(
    (th) => th.textContent.trim()
  );
  t.deepEqual(names, [
    'Date',
    'Log',
    'Size',
    'Delivery Time',
    'Status',
    'Actions'
  ]);

  let rows = getRows(document);
  t.deepEqual(Object.keys(rows).sort(), [delivered, rejected].sort());

  // a delivered message is a 250, and an error is its response code
  let status = getCell(document, rows[delivered], 'Status');
  let badge = status.querySelector('a.badge-success');
  t.is(badge.textContent, '250');
  t.is(badge.getAttribute('href'), '/en/my-account/logs?response_codes=250');

  status = getCell(document, rows[rejected], 'Status');
  badge = status.querySelector('a.badge-warning');
  t.is(badge.textContent, '421');
  t.is(badge.getAttribute('href'), '/en/my-account/logs?response_codes=421');
  t.regex(status.textContent, /421 Try again later/);
  // (with its bounce category)
  const category = [...status.querySelectorAll('a.badge')].find(
    (a) => a.textContent === 'Blocklist'
  );
  t.is(
    category.getAttribute('href'),
    '/en/my-account/logs?bounce_category=blocklist'
  );

  // (its delivery time is colored by how long it took)
  const time = getCell(document, rows[delivered], 'Delivery Time');
  t.is(time.textContent.trim(), '12.0s');
  t.truthy(time.querySelector('.text-warning'));

  // the list filtered by a code has the logs with that code
  rows = getRows(await getPage(t, '?response_codes=421'));
  t.deepEqual(Object.keys(rows), [rejected]);
  rows = getRows(await getPage(t, '?response_codes=250'));
  t.deepEqual(Object.keys(rows), [delivered]);
  rows = getRows(await getPage(t, '?bounce_category=blocklist'));
  t.deepEqual(Object.keys(rows), [rejected]);

  // and by its status code
  rows = getRows(await getPage(t, '?sort=err.responseCode'));
  t.deepEqual(Object.keys(rows), [delivered, rejected]);
  rows = getRows(await getPage(t, '?sort=-err.responseCode'));
  t.deepEqual(Object.keys(rows), [rejected, delivered]);

  // a code in a row keeps the other filters and sort of the list
  document = await getPage(
    t,
    '?sort=-created_at&page=1&bounce_category=blocklist'
  );
  rows = getRows(document);
  badge = getCell(document, rows[rejected], 'Status').querySelector(
    'a.badge-warning'
  );
  t.is(
    badge.getAttribute('href'),
    '/en/my-account/logs?sort=-created_at&bounce_category=blocklist&response_codes=421'
  );
});

test('the codes by the header keep the other filters and sort', async (t) => {
  await createLog(t, {
    message: 'Message was not delivered',
    err: { name: 'SMTPError', responseCode: 550, message: '550 No such user' }
  });

  const document = await getPage(
    t,
    '?sort=-created_at&q=hello&response_codes=550'
  );
  const { form } = document.querySelector('form input[name="response_codes"]');
  t.is(form.getAttribute('action'), '/en/my-account/logs');
  const hidden = Object.fromEntries(
    [...form.querySelectorAll('input[type="hidden"]')].map((input) => [
      input.name,
      input.value
    ])
  );
  t.deepEqual(hidden, { sort: '-created_at', q: 'hello' });
  const box = form.querySelector('input[value="550"]');
  t.true(box.checked);

  // (and it is cleared to the same list without codes)
  const clear = [...form.querySelectorAll('a')].find(
    (a) => a.textContent === 'Clear'
  );
  t.is(
    clear.getAttribute('href'),
    '/en/my-account/logs?sort=-created_at&q=hello'
  );
});

test('the sender and recipients of a log filter the list for them', async (t) => {
  const id = await createLog(t);
  const document = await getPage(t);
  const row = getRows(document)[id];
  const log = getCell(document, row, 'Log');
  const hrefs = new Set(
    [...log.querySelectorAll('a')].map((a) => a.getAttribute('href'))
  );
  t.true(hrefs.has('/en/my-account/logs?q=sender%40example.net'));
  t.true(
    hrefs.has(
      `/en/my-account/logs?q=alice%40${encodeURIComponent(
        t.context.domain.name
      )}`
    )
  );
});

test('a 200 filters for webhook deliveries and a 250 for the others', async (t) => {
  const webhook = await createLog(t, {
    meta: { is_webhook: true, info: { response: 'OK' } }
  });
  const delivered = await createLog(t);

  let document = await getPage(t, '?response_codes=200');
  let rows = getRows(document);
  t.deepEqual(Object.keys(rows), [webhook]);
  const badge = getCell(document, rows[webhook], 'Status').querySelector(
    'a.badge-success'
  );
  t.is(badge.textContent, '200');
  t.is(badge.getAttribute('href'), '/en/my-account/logs?response_codes=200');

  document = await getPage(t, '?response_codes=250');
  rows = getRows(document);
  t.deepEqual(Object.keys(rows), [delivered]);
});

test('several codes are kept as the table forms write them', async (t) => {
  const err = (code) => ({
    message: 'Message was not delivered',
    err: { name: 'SMTPError', responseCode: code, message: `${code} No` }
  });
  const deferred = await createLog(t, err(421));
  const bounced = await createLog(t, err(550));
  await createLog(t);

  // (as `qs` writes a repeated parameter, e.g. when the table is sorted)
  const document = await getPage(
    t,
    '?sort=-created_at&response_codes%5B0%5D=421&response_codes%5B1%5D=550'
  );
  const rows = getRows(document);
  t.deepEqual(Object.keys(rows).sort(), [deferred, bounced].sort());
  t.truthy(
    [...document.querySelectorAll('.dropdown-toggle')].find(
      (button) => button.textContent.trim() === 'Codes: 421, 550'
    )
  );

  // (a code in a row filters for that code only)
  const badge = getCell(document, rows[bounced], 'Status').querySelector(
    'a.badge-danger'
  );
  t.is(
    badge.getAttribute('href'),
    '/en/my-account/logs?sort=-created_at&response_codes=550'
  );
});

test('the dates are days in the time zone of the user', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { timezone: 'America/Los_Angeles' } }
  );
  // yesterday at 3 AM UTC, the evening before in Los Angeles
  const createdAt = dayjs.utc().subtract(1, 'day').startOf('day').add(3, 'h');
  const id = await createLog(t, {
    created_at: createdAt.toDate(),
    session: { arrivalDate: createdAt.toDate() }
  });
  const local = createdAt.tz('America/Los_Angeles').format('YYYY-MM-DD');
  const utc = createdAt.format('YYYY-MM-DD');
  t.not(local, utc);

  let rows = getRows(
    await getPage(t, `?start_date=${local}&end_date=${local}`)
  );
  t.deepEqual(Object.keys(rows), [id]);
  rows = getRows(await getPage(t, `?start_date=${utc}&end_date=${utc}`));
  t.deepEqual(Object.keys(rows), []);
});

test('DMARC reports stay out of the list of a member when it is filtered', async (t) => {
  // (the user is a member of another domain, with an alias of their own)
  const admin = await t.context.userFactory.create();
  const domain = await t.context.domainFactory
    .withState({
      name: `member-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
  await Domains.updateOne(
    { _id: domain._id },
    {
      $set: {
        plan: 'team',
        members: [
          { user: admin._id, group: 'admin' },
          { user: t.context.user._id, group: 'user' }
        ]
      }
    }
  );
  await t.context.aliasFactory
    .withState({
      name: 'carol',
      user: t.context.user._id,
      domain: domain._id,
      recipients: [t.context.user.email]
    })
    .create();
  const address = `carol@${domain.name}`;
  const fields = {
    domains: [domain._id],
    keywords: [revHash(address)],
    session: {
      envelope: {
        mailFrom: { address: 'sender@example.net' },
        rcptTo: [{ address }]
      }
    }
  };
  const id = await createLog(t, fields);
  await createLog(t, { ...fields, is_dmarc_report: true });

  const today = dayjs.utc().format('YYYY-MM-DD');
  for (const query of [
    '',
    '?response_codes=250',
    `?start_date=${today}`,
    `?q=${address}`
  ]) {
    const rows = getRows(await getPage(t, query));
    t.deepEqual(Object.keys(rows), [id], `${query}`);
  }
});

test('the IMAP copy of a delivery is hidden only when it was forwarded for the same alias', async (t) => {
  const { domain } = t.context;
  const alice = `alice@${domain.name}`;
  const bob = `bob@${domain.name}`;
  const session = {
    fingerprint: randomUUID(),
    envelope: {
      mailFrom: { address: 'sender@example.net' },
      rcptTo: [{ address: alice }, { address: bob }]
    }
  };

  // one message, stored for alice and forwarded for bob
  const stored = await createLog(t, {
    session,
    meta: {
      info: { response: `Appended to INBOX of ${alice}`, accepted: [alice] }
    }
  });
  const forwarded = await createLog(t, {
    session,
    meta: {
      info: {
        response: '250 2.0.0 OK',
        accepted: ['bob@example.org'],
        forwardedFor: bob
      }
    }
  });
  let rows = getRows(await getPage(t));
  t.deepEqual(Object.keys(rows).sort(), [stored, forwarded].sort());

  // (and forwarded for alice too: her IMAP copy is not shown)
  const own = await createLog(t, {
    session,
    meta: {
      info: {
        response: '250 2.0.0 OK',
        accepted: ['alice@example.org'],
        forwardedFor: [alice]
      }
    }
  });
  rows = getRows(await getPage(t));
  t.deepEqual(Object.keys(rows).sort(), [forwarded, own].sort());
});
