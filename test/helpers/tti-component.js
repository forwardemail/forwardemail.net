/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const dayjs = require('dayjs');
const pug = require('pug');
const test = require('ava');

const template = path.join(__dirname, '..', '..', 'app', 'views', '_tti.pug');

// `config` and `manifest` are view locals on every page (the chart names the
// ApexCharts file it loads from them)
function renderTti(pathWithoutLocale, env = 'production') {
  return pug.renderFile(template, {
    config: { env, urls: { web: 'http://127.0.0.1:3000' } },
    manifest(file, key) {
      return key === 'integrity'
        ? 'sha256-test'
        : `/${file.replace('.js', '.0123abcd.js')}`;
    },
    ctx: { pathWithoutLocale },
    t: (value, ...args) =>
      args.length > 0
        ? value.replace(/%[ds]/g, () => String(args.shift()))
        : value,
    dayjs,
    prettyMilliseconds: (value) => `${value}ms`,
    tti: {
      created_at: new Date('2026-09-24T00:00:00Z'),
      providers: [
        { name: 'Forward Email', directMs: 100, forwardingMs: 200 },
        { name: 'Gmail', directMs: 300, forwardingMs: 400 }
      ]
    },
    ttiChartData: []
  });
}

test('renders one refreshable Time to Inbox dashboard root', (t) => {
  const html = renderTti('/tti');

  t.is((html.match(/id="tti"/g) || []).length, 1);
  t.is((html.match(/data-tti-refresh="true"/g) || []).length, 1);
  t.is((html.match(/Historical Timeline/g) || []).length, 1);
  t.is((html.match(/Current Delivery Times/g) || []).length, 1);

  // the chart loads ApexCharts itself: the revisioned file and its hash
  t.true(
    html.includes(
      'data-apexcharts-src="/js/apexcharts.0123abcd.js" data-apexcharts-integrity="sha256-test"'
    )
  );
});

test('the chart loads the unrevisioned ApexCharts in the test environment', (t) => {
  const html = renderTti('/tti', 'test');
  t.true(
    html.includes(
      'data-apexcharts-src="http://127.0.0.1:3000/js/apexcharts.js"'
    )
  );
  t.false(html.includes('data-apexcharts-integrity'));
});

test('renders a non-refreshing Time to Inbox summary outside the dashboard', (t) => {
  const html = renderTti('/');

  t.is((html.match(/id="tti"/g) || []).length, 1);
  t.is((html.match(/data-tti-refresh/g) || []).length, 0);
  t.is((html.match(/Historical Timeline/g) || []).length, 0);
  t.is((html.match(/Current Delivery Times/g) || []).length, 1);
});
