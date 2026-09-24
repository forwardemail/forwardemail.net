/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isCI = require('is-ci');
const test = require('ava');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

test('redirects to correct locale', async (t) => {
  const { web } = t.context;
  const res = await web.get('/');
  t.is(res.status, 301);
  t.is(res.headers.location, '/en');
});

if (!isCI) {
  test('returns English homepage', async (t) => {
    const { web } = t.context;
    const res = await web.get('/en').set({ Accept: 'text/html' });

    t.snapshot(utils.normalizeBuildHashes(res.text));
  });

  test('returns Spanish homepage', async (t) => {
    const { web } = t.context;
    const res = await web.get('/es').set({ Accept: 'text/html' });

    t.snapshot(utils.normalizeBuildHashes(res.text));
  });

  test('returns English ToS', async (t) => {
    const { web } = t.context;
    const res = await web.get('/en/terms').set({ Accept: 'text/html' });

    t.snapshot(utils.normalizeBuildHashes(res.text));
  });

  test('returns Spanish ToS', async (t) => {
    const { web } = t.context;
    const res = await web.get('/es/terms').set({ Accept: 'text/html' });

    t.snapshot(utils.normalizeBuildHashes(res.text));
  });
}

test('GET /:locale/about', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/about');

  t.is(res.status, 200);
  t.assert(res.text.includes('About'));
});

test('GET /:locale/404', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/404');

  t.is(res.status, 404);
  t.assert(res.text.includes('Not Found'));
});

test('GET /:locale/privacy', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/privacy');

  t.is(res.status, 200);
  t.assert(res.text.includes('Privacy Policy'));
});

test('GET /:locale/faq/suggest.json returns matching FAQ answers with localized links', async (t) => {
  const { web } = t.context;
  const res = await web
    .get('/en/faq/suggest.json?q=eu%20data%20residency%20gdpr%20processor')
    .set({ Accept: 'application/json' });
  t.is(res.status, 200);
  t.is(res.headers['cache-control'], 'private, no-store');
  t.true(Array.isArray(res.body.suggestions));
  t.true(res.body.suggestions.length > 0);
  t.true(res.body.suggestions.length <= 5);
  const [top] = res.body.suggestions;
  t.is(
    top.id,
    'can-i-keep-my-email-processing-and-storage-in-the-eu-data-residency'
  );
  t.is(top.url, `/en/faq#${top.id}`);
  t.is(typeof top.question, 'string');
  t.is(typeof top.topic, 'string');
  t.is(top.score, undefined);

  const empty = await web
    .get('/en/faq/suggest.json')
    .set({ Accept: 'application/json' });
  t.is(empty.status, 200);
  t.deepEqual(empty.body, { suggestions: [] });
});

test('GET /:locale/help', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/help');
  t.is(res.status, 302);
  t.is(res.header.location, '/en/login?return_to=%2Fen%2Fhelp');
});
