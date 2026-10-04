/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const deferredSource = fs.readFileSync(
  path.join(__dirname, '../../assets/js/deferred.js'),
  'utf8'
);

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
  // the page and the dialogs it holds in templates (see assets/js/deferred.js)
  const roots = [
    document,
    ...[...document.querySelectorAll('template')].map((tpl) => tpl.content)
  ];
  const selector = 'input:not([type="hidden"]), select, textarea';
  for (const input of roots.flatMap((root) => [
    ...root.querySelectorAll(selector)
  ])) {
    const root = input.getRootNode();
    const label =
      input.getAttribute('aria-label') ||
      (input.id && root.querySelector(`label[for="${input.id}"]`));
    t.truthy(label, `${input.id || input.outerHTML} has a label`);
  }

  const page = [
    ...document.querySelectorAll('script[type="application/ld+json"]')
  ]
    .map((script) => JSON.parse(script.textContent))
    .find((node) => node['@type'] === 'WebPage');
  t.is(page.author['@id'], 'https://forwardemail.net/#organization');
});

// The page with assets/js/deferred.js running, as the browser runs it
async function openWithDeferred(t, path) {
  const res = await t.context.web.get(path).set({ Accept: 'text/html' });
  t.is(res.status, 200);
  const { window } = new JSDOM(res.text, { runScripts: 'outside-only' });
  t.teardown(() => window.close());
  const module = { exports: {} };
  vm.runInNewContext(
    deferredSource,
    { window, module },
    { filename: 'assets/js/deferred.js' }
  );
  return { window, stamp: module.exports };
}

const menuOf = (document, id) =>
  document.querySelector(`[aria-labelledby="navbar-dropdown-${id}"]`);
const MENUS = ['apps', 'resources', 'guides', 'docs', 'company'];
const DIALOGS = [
  '#modal-sign-in',
  '#modal-sign-up',
  '#modal-search',
  '#modal-domain-search'
];

test('the navbar menus and the dialogs join the page on the first interaction', async (t) => {
  const { window } = await openWithDeferred(t, '/en');
  const { document } = window;

  // as served: each in a template beside its toggle, none in the page
  for (const id of MENUS) {
    t.is(menuOf(document, id), null, `${id} menu not in the page yet`);
    const toggle = document.querySelector(`#navbar-dropdown-${id}`);
    t.truthy(
      toggle.parentElement
        .querySelector('template[data-fe-deferred]')
        .content.querySelector(`[aria-labelledby="navbar-dropdown-${id}"]`),
      `${id} menu waits beside its toggle`
    );
  }

  for (const selector of DIALOGS)
    t.is(document.querySelector(selector), null, `${selector} not yet`);

  const added = [];
  document.addEventListener('fe:deferred', (event) => {
    added.push(...event.detail.elements);
  });

  // the first interaction anywhere puts all of them in place
  document.body.dispatchEvent(
    new window.Event('pointerdown', { bubbles: true })
  );
  t.is(document.querySelectorAll('template[data-fe-deferred]').length, 0);
  for (const id of MENUS) {
    const menu = menuOf(document, id);
    t.truthy(menu, `${id} menu in the page`);
    // where bootstrap looks for it: beside the toggle
    t.is(
      menu.parentElement,
      document.querySelector(`#navbar-dropdown-${id}`).parentElement
    );
  }

  for (const selector of DIALOGS)
    t.truthy(document.querySelector(selector), `${selector} in the page`);
  // the event names what joined, for code that sets things up on load
  t.true(added.includes(document.querySelector('#modal-sign-in')));
  t.true(added.includes(menuOf(document, 'guides')));
  // the switch from sign in to sign up is still a link to the sign up page
  const link = document.querySelector(
    '#modal-sign-in a[data-toggle="modal-anchor"]'
  );
  t.is(link.dataset.target, '#modal-sign-up');

  // later interactions add nothing more
  const count = document.querySelectorAll('*').length;
  document.body.dispatchEvent(new window.Event('keydown', { bubbles: true }));
  t.is(document.querySelectorAll('*').length, count);
});

test('the home page as served stays under 1,000 elements', async (t) => {
  const { document } = await getPage(t, '/en');
  const count = document.querySelectorAll('*').length;
  t.true(count < 1000, `${count} elements`);
});

test('the home page loads its scripts as one file', async (t) => {
  const { document } = await getPage(t, '/en');
  const files = [...document.querySelectorAll('script[src]')].map((script) =>
    new URL(script.getAttribute('src'), 'http://localhost').pathname.replace(
      /[.-][\da-f]{8,10}\.js$/,
      '.js'
    )
  );
  t.deepEqual(files, ['/js/polyfill.js', '/js/build.js', '/js/home.js']);

  // build.js carries the WebMCP tools, which read their data from its tag
  const build = document.querySelector('script[src*="/js/build"]');
  t.is(build.dataset.locale, 'en');
  t.regex(
    build.dataset.pricing,
    /^free:0,enhanced:\d+,team:\d+,enterprise:\d+$/
  );

  // home.js holds the three page scripts it replaces
  const res = await t.context.web.get('/js/home.js');
  t.is(res.status, 200);
  const body = res.text || res.body.toString();
  // (a selector or class name each of them uses)
  for (const [name, marker] of [
    ['domain-search', '#form-domain-search'],
    ['hero-console', 'fe-console__tab--active'],
    ['video-modal', '.fe-video-modal']
  ])
    t.true(body.includes(marker), `home.js includes ${name}`);
});

test('the first images load eagerly and offer smaller files', async (t) => {
  const { document } = await getPage(t, '/en');
  const images = [...document.querySelectorAll('img')];
  // the first three load at once, everything after is lazy
  for (const img of images.slice(0, 3))
    t.not(img.getAttribute('loading'), 'lazy', `${img.getAttribute('src')}`);
  for (const img of images.slice(3))
    t.is(img.getAttribute('loading'), 'lazy', `${img.getAttribute('src')}`);

  const still = document.querySelector('.fe-video-card__poster');
  const avatars = [...document.querySelectorAll('.fe-proof__avatar')];
  t.is(avatars.length, 3);
  for (const img of [still, ...avatars]) {
    const candidates = img
      .getAttribute('srcset')
      .split(',')
      .map((candidate) => candidate.trim().split(/\s+/)[0]);
    t.is(candidates.length, 2);
    for (const url of candidates) {
      const res = await t.context.web.get(
        new URL(url, 'http://localhost').pathname
      );
      t.is(res.status, 200, `${url}`);
    }
  }
});

test('the stylesheet loads only WOFF2 fonts', async (t) => {
  const res = await t.context.web.get('/css/app.css');
  t.is(res.status, 200);
  const css = res.text || res.body.toString();
  const fonts = [
    ...css.matchAll(/url\(["']?([^)"']+\.(woff2?|ttf|eot|otf|svg))/g)
  ].map((m) => m[1]);
  t.true(fonts.length > 0);
  for (const font of fonts) t.regex(font, /\.woff2$/, `${font}`);

  // icons swap in like text rather than staying invisible while they load
  // (found by file: the minifier escapes the spaces in the family names)
  for (const family of ['fa-solid-900', 'fa-brands-400']) {
    const face = [...css.matchAll(/@font-face\s*{([^}]*)}/g)]
      .map((m) => m[1])
      .find((rule) => rule.includes(family));
    t.truthy(face, `${family}`);
    t.regex(face, /font-display:\s*swap/, `${family}`);
  }
});

test('the home page names its sources', async (t) => {
  const { document } = await getPage(t, '/en');

  // the Enterprise card links both case studies
  const proof = document.querySelector('.fe-plan__proof');
  t.truthy(proof);
  const links = [...proof.querySelectorAll('a')].map((a) =>
    a.getAttribute('href')
  );
  t.deepEqual(links, [
    '/en/blog/docs/linux-foundation-email-enterprise-case-study',
    '/en/blog/docs/canonical-ubuntu-email-enterprise-case-study'
  ]);

  // the sending section quotes the rate it enforces, and where it comes from
  const sending = document.querySelector('.fe-sending__body');
  t.regex(sending.textContent, /keep their spam rate under 0\.1%\./);
  t.regex(sending.textContent, /mail to 0\.1% or more of your recipients/);
  t.is(
    sending.querySelector('a').getAttribute('href'),
    'https://support.google.com/a/answer/81126'
  );

  // the testimonials lede names the auditor and what it covered
  t.regex(
    document.querySelector('#testimonials .fe-lede').textContent,
    /Cure53 spent 25 days auditing our code, our infrastructure and Nodemailer, .*according to its report\./
  );

  // the four route steps are list labels, not headings
  t.is(document.querySelectorAll('.fe-stepper__step h3').length, 0);
  t.is(document.querySelectorAll('.fe-stepper__title').length, 4);
});

test('the search tools reach in-browser agents once the page has loaded', async (t) => {
  const { window } = await openWithDeferred(t, '/en');
  const { document } = window;
  // the WebMCP declarative forms wait in templates as served
  t.is(document.querySelector('form[toolname]'), null);

  // no interaction: the browser adds them once it is idle after load
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  t.is(document.querySelectorAll('template[data-fe-deferred]').length, 0);
  t.truthy(
    document.querySelector('form[toolname="search_forward_email_docs"]')
  );
  t.truthy(document.querySelector('form[toolname="search_domain_names"]'));
  for (const id of MENUS) t.truthy(menuOf(document, id), `${id} menu`);
});

test('/search declares the search tool on its own form', async (t) => {
  const res = await t.context.web
    .get('/en/search')
    .set({ Accept: 'text/html' });
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  // one declaration, on the page's form (not the dialog's, in its template)
  t.is(res.text.match(/toolname="search_forward_email_docs"/g).length, 1);
  const form = document.querySelector(
    'form[toolname="search_forward_email_docs"]'
  );
  t.truthy(form);
  t.is(form.closest('#modal-search'), null);
});
