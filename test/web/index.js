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

test('FAQ topic titles and questions link to themselves', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/faq');
  t.is(res.status, 200);

  // a topic title links to its topic
  t.regex(
    res.text,
    /<section class="fe-faq-topic" id="([\w-]+)"[^>]*><h2[^>]*><a class="fe-faq-topic__link" href="#\1">/
  );

  // a question links to its answer
  t.regex(
    res.text,
    /<details class="fe-faq-answer" id="([\w-]+)"><summary class="fe-faq-answer__q"><a class="fe-faq-answer__text fe-faq-answer__link" href="#\1">/
  );
  t.true(
    res.text.includes(
      'href="#how-do-i-increase-my-storage-or-outbound-smtp-sending-limit"'
    )
  );
});

test('GET /:locale/starlink', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/starlink');

  t.is(res.status, 200);
  t.assert(res.text.includes('Self-Hosted Email Server on Starlink'));
  t.assert(
    res.text.includes('/en/guides/self-hosted-mail-server-behind-cgnat')
  );
  // (its title and description for search engines, see config/meta.js)
  t.regex(
    res.text,
    /<title>Starlink Email Server - Self-Hosted Mail Behind CGNAT/
  );
});

test('GET /:locale/guides/self-hosted-mail-server-behind-cgnat', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/guides/self-hosted-mail-server-behind-cgnat');

  t.is(res.status, 200);
  t.assert(res.text.includes('Self-Hosted Mail Server Behind CGNAT'));
  t.assert(res.text.includes('mail-server-tunnel doctor'));
  t.assert(res.text.includes('mx1.forwardemail.net'));
  // (the TXT verification record is what keeps mail with its owner)
  t.assert(res.text.includes('forward-email-site-verification='));
  t.assert(res.text.includes('The TXT verification record is required.'));
  // the guide is listed in the navbar and the footer of every page
  const home = await web.get('/en/privacy');
  t.assert(
    home.text.includes('/en/guides/self-hosted-mail-server-behind-cgnat')
  );
  t.assert(home.text.includes('/en/starlink'));
});

test('FAQ answers whether a mail server can be self-hosted behind CGNAT', async (t) => {
  const { web } = t.context;
  for (const locale of ['en', 'de', 'ja']) {
    const res = await web.get(`/${locale}/faq`);
    t.is(res.status, 200);
    t.assert(
      res.text.includes(
        'id="can-i-self-host-a-mail-server-behind-cgnat-or-starlink"'
      )
    );
    t.assert(res.text.includes('/guides/self-hosted-mail-server-behind-cgnat'));
  }
});
