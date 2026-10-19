/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const dayjs = require('dayjs');
const pug = require('pug');
const test = require('ava');

const template = path.join(
  __dirname,
  '..',
  '..',
  'app',
  'views',
  '_schema.pug'
);

// the home page's structured data, with the locals _schema.pug reads there
function renderHomeSchema(tti) {
  const html = pug.renderFile(template, {
    ctx: { pathWithoutLocale: '/', path: '/en', query: {} },
    locale: 'en',
    planPricing: { free: 0, enhanced: 3, team: 9 },
    pkgVersion: '1.0.0',
    nonce: 'nonce',
    config: { env: 'test', urls: { web: 'https://example.com' }, meta: {} },
    meta: { title: '', description: '' },
    t: (value) => value,
    l: (value) => `/en${value}`,
    striptags: (value) => value,
    convert: (value) => value,
    dayjs,
    tti
  });
  return [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
}

const webPage = (nodes) => nodes.find((node) => node['@type'] === 'WebPage');

test('the home page was last modified by its latest delivery test', (t) => {
  // (the date the page shows as "Last updated on" under the delivery times)
  const createdAt = new Date('2026-10-19T12:00:00Z');
  const providers = [
    { name: 'Forward Email', directMs: 100, forwardingMs: 200 },
    { name: 'Gmail', directMs: 300, forwardingMs: 400 }
  ];
  t.is(
    webPage(renderHomeSchema({ created_at: createdAt, providers }))
      .dateModified,
    '2026-10-19T12:00:00.000Z'
  );

  // no date when the page shows no delivery times: none stored, or one
  // slower than 10 seconds (_tti.pug leaves the section out then)
  t.is(webPage(renderHomeSchema(null)).dateModified, undefined);
  t.is(
    webPage(
      renderHomeSchema({
        created_at: createdAt,
        providers: [{ name: 'Gmail', directMs: 12_000, forwardingMs: 400 }]
      })
    ).dateModified,
    undefined
  );
});
