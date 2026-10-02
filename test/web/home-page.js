/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

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

test('the skip link is the first focusable element and targets the main content', async (t) => {
  const { document } = await getPage(t, '/en');
  const first = document.querySelector('body a[href], body button');
  t.is(first.getAttribute('href'), '#main-content');
  t.true(first.classList.contains('fe-skip-link'));
  t.is(first.textContent, 'Skip to content');
  const main = document.querySelector('#main-content');
  t.is(main.tagName, 'MAIN');
  t.is(main.getAttribute('tabindex'), '-1');
});

test('the tour video carries a WebVTT captions track', async (t) => {
  const { document } = await getPage(t, '/en');
  const track = document.querySelector('#modal-video video track');
  t.truthy(track);
  t.is(track.getAttribute('kind'), 'captions');
  t.is(track.getAttribute('srclang'), 'en');
  // off by default: the captions are also part of the picture
  t.false(track.hasAttribute('default'));

  // the src is absolute in production and may be a path elsewhere
  const res = await t.context.web.get(
    new URL(track.getAttribute('src'), 'http://localhost').pathname
  );
  t.is(res.status, 200);
  const body = res.text || res.body.toString();
  t.true(body.startsWith('WEBVTT'));
  t.regex(body, /00:00:01\.550 --> 00:00:02\.700\nThis is Forward Email\./);
  t.regex(body, /Try it free at forwardemail\.net\./);
});

test('the home page labels its inputs and names its author', async (t) => {
  const { document } = await getPage(t, '/en');
  for (const input of document.querySelectorAll(
    'input:not([type="hidden"]), select, textarea'
  )) {
    const label =
      input.getAttribute('aria-label') ||
      (input.id && document.querySelector(`label[for="${input.id}"]`));
    t.truthy(label, `${input.id || input.outerHTML} has a label`);
  }

  const page = [
    ...document.querySelectorAll('script[type="application/ld+json"]')
  ]
    .map((script) => JSON.parse(script.textContent))
    .find((node) => node['@type'] === 'WebPage');
  t.is(page.author['@id'], 'https://forwardemail.net/#organization');
});
