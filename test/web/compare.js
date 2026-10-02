/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');
const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function getPage(t, path) {
  const res = await t.context.web.get(path).set({ Accept: 'text/html' });
  t.is(res.status, 200);
  const { window } = new JSDOM(res.text);
  t.teardown(() => window.close());
  return window;
}

// each service has one badge list, in the same order as the services
function badgeLists(window) {
  return [...window.document.querySelectorAll('ul.list-unstyled')].filter(
    (ul) => ul.querySelector('img[alt="Hardenize Test"]')
  );
}

// the Privacy Ratings badge leads each list, links to that service's own
// rating page, and is unique to that service
function assertBadges(t, window, names) {
  const lists = badgeLists(window);
  t.is(lists.length, names.length);
  const sources = new Set();
  for (const [i, ul] of lists.entries()) {
    const alternative = config.alternatives.find((a) => a.name === names[i]);
    const [first, second] = ul.children;
    if (!alternative.privacy_ratings) {
      t.is(first.querySelector('img').getAttribute('alt'), 'Hardenize Test');
      continue;
    }

    const link = first.querySelector('a');
    t.is(
      link.getAttribute('href'),
      `https://privacyratings.com/${alternative.privacy_ratings}/`
    );
    t.is(link.getAttribute('target'), '_blank');
    t.is(link.getAttribute('rel'), 'noopener noreferrer');

    const img = first.querySelector('img');
    t.is(img.getAttribute('alt'), 'Privacy Ratings');
    t.is(
      img.getAttribute('src'),
      `https://img.shields.io/endpoint?url=${encodeURIComponent(
        `https://privacyratings.com/badge/${alternative.privacy_ratings}.json`
      )}`
    );
    t.false(sources.has(img.getAttribute('src')));
    sources.add(img.getAttribute('src'));

    t.is(second.querySelector('img').getAttribute('alt'), 'Hardenize Test');
  }

  return sources.size;
}

const tableNames = (window) =>
  [...window.document.querySelectorAll('tbody tr td:first-child h3 a')].map(
    (a) => a.textContent
  );

for (const path of [
  '/en/blog/best-email-service',
  '/en/blog/best-open-source-email-service',
  '/en/blog/best-private-email-service',
  '/en/blog/best-transactional-email-service',
  '/en/blog/best-email-spam-filtering-service'
]) {
  test(`${path} leads every service with its Privacy Ratings badge`, async (t) => {
    const window = await getPage(t, path);
    const names = tableNames(window);
    t.true(names.length > 0);
    t.true(assertBadges(t, window, names) > 0);
  });
}

test('every alternatives page leads with Privacy Ratings badges', async (t) => {
  const window = await getPage(t, '/en/blog/best-gmail-alternative');
  const names = tableNames(window);
  t.is(names.length, config.alternatives.length);
  t.is(
    assertBadges(t, window, names),
    config.alternatives.filter((a) => a.privacy_ratings).length
  );
});

test('a vs comparison shows each side its own Privacy Ratings badge', async (t) => {
  const window = await getPage(
    t,
    '/en/blog/forward-email-vs-gmail-email-service-comparison'
  );
  t.is(assertBadges(t, window, ['Forward Email', 'Gmail']), 2);
});

test('every service names a Privacy Ratings entry or opts out', (t) => {
  for (const a of config.alternatives) {
    if (a.privacy_ratings === false) continue;
    t.regex(a.privacy_ratings, /^[a-z\d-]+\/[a-z\d-]+$/);
  }

  // one rating page per service
  const paths = config.alternatives
    .map((a) => a.privacy_ratings)
    .filter(Boolean);
  t.is(new Set(paths).size, paths.length);
});
