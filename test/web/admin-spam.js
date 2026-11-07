/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');
const config = require('#config');
const env = require('#config/env');
const { Logs, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const password = falso.randPassword();
  let admin = await t.context.userFactory.make();
  admin = await Users.register(admin, password);
  admin.group = 'admin';
  admin[config.userFields.hasVerifiedEmail] = true;
  admin = await admin.save();
  t.context.user = admin;
  t.context.password = password;
  t.context.webConfig = { turnstileEnabled: false };
  // (each test counts only its own logs)
  await Logs.deleteMany({});
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

// our own server, which every log of the MX server carries in `meta.app`
const SERVER_IP = '203.0.113.250';

async function createLog(fields = {}) {
  const _id = new mongoose.Types.ObjectId();
  const { remoteAddress, hostname, ...rest } = fields;
  await Logs.collection.insertOne({
    _id,
    id: _id.toString(),
    hash: randomUUID(),
    bounce_category: 'spam',
    is_restricted: true,
    domains: [],
    created_at: new Date(),
    updated_at: new Date(),
    message: 'Message detected as spam',
    err: {
      message: 'Message detected as spam <img src=x onerror=alert(1)>',
      responseCode: 554
    },
    meta: {
      level: 'error',
      app: { ip: SERVER_IP, hostname: env.MX1_HOST },
      session: {
        remoteAddress,
        resolvedClientHostname: hostname
      }
    },
    ...rest
  });
  return _id.toString();
}

function getJSON(t, path, query = {}) {
  return t.context.web.get(path).query(query).set('Accept', 'application/json');
}

test.serial('the admin menu links to the spam page', async (t) => {
  const res = await t.context.web
    .get('/en/admin/spam')
    .set('Accept', 'text/html');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const link = document.querySelector(
    '[aria-labelledby="navbar-dropdown-admin"] a[href="/en/admin/spam"]'
  );
  t.truthy(link);
  t.true(link.classList.contains('active'));

  // the page scripts carry the CSP nonce (or they would not run) and the
  // charts are the shared ApexCharts script, loaded before the page script
  const scripts = [...document.querySelectorAll('script[src]')];
  const apex = scripts.findIndex((s) => s.src.includes('js/apexcharts'));
  const page = scripts.findIndex((s) => s.src.includes('js/admin-spam'));
  t.true(apex !== -1 && page > apex);
  t.truthy(scripts[page].getAttribute('nonce'));
  t.truthy(
    document.querySelector('#spam-stats[data-url="/en/admin/spam/stats"]')
  );
});

test.serial(
  'the table shows the log ID, client and a link to the log',
  async (t) => {
    const id = await createLog({
      remoteAddress: '198.51.100.7',
      hostname: 'spammer.example.net'
    });
    // (a log that is not spam)
    await createLog({ remoteAddress: '198.51.100.8', bounce_category: 'none' });

    const res = await getJSON(t, '/en/admin/spam');
    t.is(res.status, 200);
    const { document } = new JSDOM(res.body.table).window;
    const rows = [...document.querySelectorAll('tbody tr')];
    t.is(rows.length, 1);
    const [row] = rows;
    t.is(row.querySelector('td code').textContent, id);
    t.truthy(row.querySelector(`a[href="/en/admin/logs/${id}"]`));
    t.true(row.textContent.includes('198.51.100.7'));
    t.true(row.textContent.includes('spammer.example.net'));
    t.false(row.textContent.includes(SERVER_IP));
    t.false(row.textContent.includes(env.MX1_HOST));
    // (the remote error is shown as text)
    t.is(row.querySelector('img'), null);
    t.true(row.textContent.includes('<img src=x onerror=alert(1)>'));
  }
);

test.serial('the statistics count the connecting clients', async (t) => {
  for (let i = 0; i < 3; i++)
    await createLog({
      remoteAddress: '198.51.100.7',
      hostname: 'a.example.net'
    });
  await createLog({ remoteAddress: '198.51.100.9', hostname: 'b.example.net' });
  await createLog({
    remoteAddress: '198.51.100.9',
    created_at: new Date(Date.now() - 2 * 86_400_000)
  });

  const res = await getJSON(t, '/en/admin/spam/stats');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.body.html).window;

  const cards = [...document.querySelectorAll('.display-4')].map((el) =>
    el.textContent.trim()
  );
  t.deepEqual(cards, ['4', '4', '5']);

  const chart = JSON.parse(
    document.querySelector('#spam-timeline-chart').dataset.chart
  );
  t.is(chart.unit, 'day');
  t.is(chart.categories.length, chart.counts.length);
  t.is(
    chart.counts.reduce((a, b) => a + b, 0),
    5
  );

  const tables = [...document.querySelectorAll('table')];
  const rows = (table) =>
    [...table.querySelectorAll('tbody tr')].map((tr) =>
      [...tr.querySelectorAll('td')].map((td) => td.textContent.trim())
    );
  t.deepEqual(rows(tables[0]), [
    ['198.51.100.7', '3'],
    ['198.51.100.9', '2']
  ]);
  t.deepEqual(rows(tables[1]), [
    ['a.example.net', '3'],
    ['Unknown', '1'],
    ['b.example.net', '1']
  ]);
  t.false(res.body.html.includes(SERVER_IP));

  // each links to that client's spam logs in Admin > Logs
  const link = tables[0].querySelector('a').getAttribute('href');
  t.is(
    link,
    `/en/admin/logs?mongodb_query=${encodeURIComponent(
      JSON.stringify({
        bounce_category: 'spam',
        'meta.session.remoteAddress': '198.51.100.7'
      })
    )}`
  );
  const logs = await getJSON(t, link);
  t.is(logs.status, 200);
  t.is(
    new JSDOM(logs.body.table).window.document.querySelectorAll('tbody tr')
      .length,
    3
  );

  const filtered = await getJSON(t, '/en/admin/spam/stats', {
    ip: '198.51.100.7'
  });
  t.is(filtered.status, 200);
  const doc = new JSDOM(filtered.body.html).window.document;
  t.deepEqual(
    [...doc.querySelectorAll('.display-4')].map((el) => el.textContent.trim()),
    ['3', '3', '3']
  );

  const today = new Date().toISOString().slice(0, 10);
  const table = await getJSON(t, '/en/admin/spam', {
    hostname: 'b.example.net',
    start_date: '2026-01-01',
    end_date: today
  });
  t.is(table.status, 200);
  const tableDocument = new JSDOM(table.body.table).window.document;
  t.is(tableDocument.querySelectorAll('tbody tr').length, 1);
  // (a client's link is to its spam logs in Admin > Logs)
  const hostnameLink = tableDocument
    .querySelector('tbody a[href*="resolvedClientHostname"]')
    .getAttribute('href');
  t.true(hostnameLink.startsWith('/en/admin/logs?mongodb_query='));
  const hostnameLogs = await getJSON(t, hostnameLink);
  t.is(hostnameLogs.status, 200);
  t.is(
    new JSDOM(hostnameLogs.body.table).window.document.querySelectorAll(
      'tbody tr'
    ).length,
    1
  );
});

test.serial(
  'the hourly timeline covers each hour of a short range',
  async (t) => {
    // (yesterday, a whole day whenever the test runs)
    const day = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    await createLog({
      remoteAddress: '198.51.100.7',
      created_at: new Date(`${day}T12:30:00Z`)
    });
    const res = await getJSON(t, '/en/admin/spam/stats', {
      start_date: day,
      end_date: day
    });
    t.is(res.status, 200);
    const { document } = new JSDOM(res.body.html).window;
    const chart = JSON.parse(
      document.querySelector('#spam-timeline-chart').dataset.chart
    );
    t.is(chart.unit, 'hour');
    t.is(chart.categories.length, 24);
    t.is(chart.categories[0], `${day} 00:00`);
    t.is(chart.counts[12], 1);
    t.is(
      chart.counts.reduce((a, b) => a + b, 0),
      1
    );
  }
);

test.serial('invalid filters are refused', async (t) => {
  for (const query of [
    { ip: 'not-an-ip' },
    { start_date: '2026-13-45' },
    { start_date: 'yesterday' },
    { start_date: '2026-11-07', end_date: '2026-11-01' },
    { start_date: '2024-01-01', end_date: '2026-11-01' }
  ]) {
    for (const path of ['/en/admin/spam', '/en/admin/spam/stats']) {
      const res = await getJSON(t, path, query);
      t.is(res.status, 400, `${path} ${JSON.stringify(query)}`);
    }
  }
});

//
// An index the page hints may not be built yet (Mongoose builds them one at
// a time at startup, and on millions of logs that takes a while): a hint
// for an index that does not exist fails the query, so the page hints the
// next best one that is built.
//
for (const [filter, key] of [
  ['ip', { 'meta.session.remoteAddress': 1 }],
  ['hostname', { 'meta.session.resolvedClientHostname': 1 }],
  ['unfiltered', {}]
]) {
  test.serial(
    `the ${filter} page works before its index is built`,
    async (t) => {
      const index = { bounce_category: 1, ...key, created_at: 1 };
      const name = Object.entries(index)
        .map(([field, order]) => `${field}_${order}`)
        .join('_');
      await Logs.collection.dropIndex(name);
      t.teardown(() => Logs.collection.createIndex(index, { name }));

      await createLog({
        remoteAddress: '198.51.100.7',
        hostname: 'a.example.net'
      });
      await createLog({
        remoteAddress: '198.51.100.9',
        hostname: 'b.example.net'
      });
      const query =
        filter === 'ip'
          ? { ip: '198.51.100.7' }
          : filter === 'hostname'
          ? { hostname: 'a.example.net' }
          : {};
      const count = filter === 'unfiltered' ? 2 : 1;

      const table = await getJSON(t, '/en/admin/spam', query);
      t.is(table.status, 200);
      const rows = new JSDOM(table.body.table).window.document.querySelectorAll(
        'tbody tr'
      );
      t.is(rows.length, count);
      t.true(rows[0].textContent.includes('198.51.100.'));

      const stats = await getJSON(t, '/en/admin/spam/stats', query);
      t.is(stats.status, 200);
      t.deepEqual(
        [
          ...new JSDOM(stats.body.html).window.document.querySelectorAll(
            '.display-4'
          )
        ].map((el) => el.textContent.trim()),
        [String(count), String(count), String(count)]
      );
    }
  );
}
