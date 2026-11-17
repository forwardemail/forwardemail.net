/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Each noun ("Churches", "Sushi Restaurants") used to have fifteen pages that
// differed by a headline ("Free Email Masking for Sushi Restaurants"). It has
// one now; the others redirect to it, and it is a page of its own (canonical,
// in the sitemap) only when it says something of its own.
//

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');
const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function getDocument(t, path) {
  const res = await t.context.web.get(path).set({ Accept: 'text/html' });
  t.is(res.status, 200, path);
  const { window } = new JSDOM(res.text);
  t.teardown(() => window.close());
  return window.document;
}

function canonicalOf(document) {
  return document.querySelector('link[rel="canonical"]').getAttribute('href');
}

test('the other pages of a noun redirect to its one page', async (t) => {
  for (const suffix of ['email-masking', 'bulk-email-service', 'email-api']) {
    const res = await t.context.web.get(`/en/churches-${suffix}`);
    t.is(res.status, 301, `${suffix}`);
    t.is(res.headers.location, '/en/churches-email-hosting', `${suffix}`);
  }

  // (in the language asked for)
  const res = await t.context.web.get('/de/sushi-restaurants-email-marketing');
  t.is(res.status, 301);
  t.is(res.headers.location, '/de/sushi-restaurants-email-hosting');
});

test('a page with content of its own is its canonical page and shows it', async (t) => {
  const document = await getDocument(t, '/en/churches-email-hosting');
  t.is(canonicalOf(document), `${config.urls.web}/en/churches-email-hosting`);
  t.is(
    document.querySelector('h1').textContent.trim(),
    'Email Hosting for Churches'
  );
  const section = document
    .querySelector('#fe-use-case-title')
    .closest('section');
  t.true(section.textContent.includes('youth@yourchurch.org'));
  t.true(section.querySelectorAll('p.fe-text').length >= 2);
});

test('a page with nothing of its own stays canonical to the pricing page', async (t) => {
  const document = await getDocument(t, '/en/sushi-restaurants-email-hosting');
  t.is(canonicalOf(document), `${config.urls.web}/en/private-business-email`);
  t.is(
    document.querySelector('h1').textContent.trim(),
    'Email Hosting for Sushi Restaurants'
  );
  t.is(document.querySelector('#fe-use-case-title'), null);
});

test('a hand-written page that is only a headline stays as it was', async (t) => {
  const document = await getDocument(t, '/en/custom-domain-email-hosting');
  t.is(canonicalOf(document), `${config.urls.web}/en/private-business-email`);
  const res = await t.context.web.get('/en/sitemap.xml');
  const body = res.text || res.body.toString();
  t.false(body.includes('/en/custom-domain-email-hosting<'));
});

test('a redirect keeps the query string', async (t) => {
  const res = await t.context.web.get('/en/churches-email-api?ref=test');
  t.is(res.status, 301);
  t.is(res.headers.location, '/en/churches-email-hosting?ref=test');
});

test('the pricing page itself has no use case section', async (t) => {
  const document = await getDocument(t, '/en/private-business-email');
  t.is(document.querySelector('#fe-use-case-title'), null);
});

test('the sitemap lists the pages with content and none of the rest', async (t) => {
  const res = await t.context.web.get('/en/sitemap.xml');
  t.is(res.status, 200);
  const body = res.text || res.body.toString();
  t.true(body.includes('/en/churches-email-hosting<'));
  t.true(body.includes('/en/attorneys-and-law-firms-email-hosting<'));
  t.false(body.includes('/en/sushi-restaurants-email-hosting<'));
  t.false(body.includes('/en/churches-email-masking<'));
  // (a hand-written use case page is listed as before)
  t.true(body.includes('/en/nonprofit-organization-email-setup<'));
});
