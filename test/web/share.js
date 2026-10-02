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

const root = path.join(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const shareSource = read('assets/js/share.js');
const jquerySource = read('node_modules/jquery/dist/jquery.js');
const bootstrapSource = read(
  'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
);

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function getHtml(t, path) {
  const res = await t.context.web.get(path).set({ Accept: 'text/html' });
  t.is(res.status, 200);
  return res.text;
}

async function getPage(t, path) {
  const { window } = new JSDOM(await getHtml(t, path));
  t.teardown(() => window.close());
  return window;
}

// The page with jQuery, bootstrap and assets/js/share.js running, as a phone
// (touch, with a share sheet that resolves, or rejects with `shareError`)
// or as a desktop browser without one
async function openPage(t, path, { phone = false, shareError } = {}) {
  const dom = new JSDOM(await getHtml(t, path), {
    url: `${t.context.webURL}${path}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  t.teardown(() => dom.window.close());
  const { window } = dom;
  const shared = [];
  const opened = [];
  window.matchMedia = (query) => ({
    matches: phone && query === '(pointer: coarse)'
  });
  window.open = (...args) => {
    opened.push(args);
    return null;
  };

  if (phone)
    window.navigator.share = (data) => {
      shared.push(data);
      if (!shareError) return Promise.resolve();
      const error = new Error(shareError);
      error.name = shareError;
      return Promise.reject(error);
    };

  window.eval(jquerySource);
  window.eval(bootstrapSource);
  vm.runInNewContext(
    shareSource,
    {
      require(id) {
        if (id === 'jquery') return window.jQuery;
        if (id === './logger') return { debug() {} };
        throw new Error(`unexpected require ${id}`);
      },
      window,
      // a browser global, but not part of a bare vm context
      URL: window.URL
    },
    { filename: 'assets/js/share.js' }
  );
  return { window, shared, opened };
}

function click(window, element) {
  const event = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
  return event;
}

// Bootstrap finishes opening on a timer, so wait for its own event
function shown(window) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error('no shown.bs.modal on #modal-share')),
      5000
    );
    window.jQuery(window.document).one('shown.bs.modal', () => {
      window.clearTimeout(timer);
      resolve();
    });
  });
}

const canonical = (document) =>
  document.querySelector('link[rel="canonical"]').getAttribute('href');

// the dialog, kept in a <template> until a Share button is clicked
const shareDialog = (document) =>
  document
    .querySelector('#share-template')
    .content.querySelector('#modal-share');

test('the footer Share button offers plain links to the page', async (t) => {
  // a query string on the request is not passed on to the people it is shared with
  const { document } = await getPage(t, '/en/about?domain=example.com');
  const url = canonical(document);
  t.false(url.includes('?'));

  const button = document.querySelector(
    'footer button[data-target="#modal-share"]'
  );
  t.truthy(button);
  t.is(button.dataset.toggle, 'modal');
  t.is(button.textContent.trim(), 'Share');

  // the dialog is not part of the page until it is opened
  t.is(document.querySelector('#modal-share'), null);
  const template = document.querySelector('#share-template');
  t.is(template.closest('footer'), null);
  const modal = shareDialog(document);
  t.is(modal.dataset.shareUrl, url);
  t.is(modal.dataset.shareText, document.title);

  // Copy link copies the canonical URL with the clipboard handler in core.js
  const copy = modal.querySelector('[data-toggle="clipboard"]');
  t.is(copy.dataset.clipboardText, url);
  t.is(modal.querySelector('#share-url').value, url);

  // every network link carries the URL and opens that network's own page,
  // so nothing from those sites loads here
  const links = [...modal.querySelectorAll('ul a')];
  t.deepEqual(
    links.map((a) => a.textContent),
    [
      'Messages',
      'Email',
      'WhatsApp',
      'Telegram',
      'Mastodon',
      'Bluesky',
      'X',
      'Reddit',
      'Hacker News',
      'LinkedIn',
      'Facebook'
    ]
  );
  for (const a of links) {
    t.true(
      a.getAttribute('href').includes(encodeURIComponent(url)),
      `${a.textContent} links the page`
    );
    if (/^(mailto|sms):/.test(a.getAttribute('href'))) {
      t.is(a.getAttribute('target'), null);
    } else {
      t.is(a.getAttribute('target'), '_blank');
      t.is(a.getAttribute('rel'), 'nofollow noopener noreferrer');
    }
  }
});

test('clicking Share adds the dialog to the page and opens it', async (t) => {
  const { window, shared } = await openPage(t, '/en/about');
  const { document } = window;
  const button = document.querySelector(
    'footer button[data-target="#modal-share"]'
  );

  const opened = shown(window);
  click(window, button);
  await opened;

  const modals = document.querySelectorAll('#modal-share');
  t.is(modals.length, 1);
  t.true(modals[0].classList.contains('show'));
  // no share sheet in this browser, so the dialog does not offer one
  t.true(modals[0].querySelector('[data-share-native]').hidden);
  t.deepEqual(shared, []);

  // Mastodon asks for the reader's server instead of leaving the page
  const form = modals[0].querySelector('[data-share-mastodon-form]');
  t.true(form.hidden);
  const mastodon = modals[0].querySelector('[data-share-mastodon]');
  t.true(click(window, mastodon).defaultPrevented);
  t.false(form.hidden);

  // a second click opens the same dialog rather than adding another
  window.jQuery('#modal-share').modal('hide');
  click(window, button);
  t.is(document.querySelectorAll('#modal-share').length, 1);
});

test('on a phone, Share opens the device share sheet', async (t) => {
  const { window, shared } = await openPage(t, '/en/about', { phone: true });
  const { document } = window;
  const event = click(
    window,
    document.querySelector('footer button[data-target="#modal-share"]')
  );
  t.true(event.defaultPrevented);
  t.is(document.querySelector('#modal-share'), null);
  t.is(shared.length, 1);
  t.is(shared[0].url, canonical(document));
  t.is(shared[0].text, document.title);
});

test('the dialog is translated with the page', async (t) => {
  const { document } = await getPage(t, '/es/about');
  const modal = shareDialog(document);
  t.is(modal.querySelector('#modal-share-title').textContent, 'Compartir');
  t.is(
    modal.querySelector('[data-toggle="clipboard"]').textContent.trim(),
    'Copiar enlace'
  );
  t.true(modal.dataset.shareUrl.endsWith('/es/about'));
});

test('guides offer Share in their byline', async (t) => {
  const { document } = await getPage(
    t,
    '/en/guides/send-email-with-custom-domain-smtp'
  );
  const button = document.querySelector(
    '.fe-byline button[data-target="#modal-share"]'
  );
  t.truthy(button);
  t.is(button.textContent.trim(), 'Share this page');
  t.truthy(shareDialog(document));
});

test('private pages have no Share button or dialog', async (t) => {
  const { document } = await getPage(t, '/en/forgot-password');
  t.is(document.querySelector('#share-template'), null);
  t.is(document.querySelector('[data-target="#modal-share"]'), null);
});

test('the dialog opens when the share sheet fails, and not when the reader closes it', async (t) => {
  // a browser that refuses (e.g. a policy that disables Web Share)
  const failing = await openPage(t, '/en/about', {
    phone: true,
    shareError: 'NotAllowedError'
  });
  const opened = shown(failing.window);
  click(
    failing.window,
    failing.window.document.querySelector('footer [data-share-open]')
  );
  await opened;
  t.is(failing.shared.length, 1);
  t.true(
    failing.window.document
      .querySelector('#modal-share')
      .classList.contains('show')
  );

  // the reader closing the sheet is an AbortError: nothing else opens
  const closed = await openPage(t, '/en/about', {
    phone: true,
    shareError: 'AbortError'
  });
  click(
    closed.window,
    closed.window.document.querySelector('footer [data-share-open]')
  );
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
  t.is(closed.shared.length, 1);
  t.is(closed.window.document.querySelector('#modal-share'), null);
});

test('the Mastodon form takes the server however the reader types it', async (t) => {
  const { window, opened } = await openPage(t, '/en/about');
  const { document } = window;
  const shownModal = shown(window);
  click(window, document.querySelector('footer [data-share-open]'));
  await shownModal;

  const modal = document.querySelector('#modal-share');
  click(window, modal.querySelector('[data-share-mastodon]'));
  const form = modal.querySelector('[data-share-mastodon-form]');
  const input = form.querySelector('input');
  const submit = (value) => {
    input.value = value;
    form.dispatchEvent(
      new window.Event('submit', { bubbles: true, cancelable: true })
    );
  };

  const text = encodeURIComponent(
    `${modal.dataset.shareText} ${modal.dataset.shareUrl}`
  );
  for (const [value, host] of [
    ['mastodon.social', 'mastodon.social'],
    [' https://Hachyderm.io/ ', 'hachyderm.io'],
    ['fosstodon.org/@someone', 'fosstodon.org'],
    ['@someone@mastodon.online', 'mastodon.online'],
    ['social.example.com:8443', 'social.example.com:8443'],
    ['mastodon.café', 'mastodon.xn--caf-dma']
  ]) {
    opened.length = 0;
    submit(value);
    t.deepEqual(
      opened,
      [[`https://${host}/share?text=${text}`, '_blank', 'noopener']],
      `${value} opens ${host}`
    );
    t.false(input.classList.contains('is-invalid'), `${value} is accepted`);
  }

  // not a host name: nothing opens and the field says why
  // (the scheme is joined so it does not read as a script URL to the linter)
  for (const value of [
    '',
    'mastodon',
    ['javascript', 'alert(1)'].join(':'),
    'a b.com'
  ]) {
    opened.length = 0;
    submit(value);
    t.deepEqual(opened, [], `"${value}" opens nothing`);
    t.true(
      input.classList.contains('is-invalid'),
      `"${value}" is marked invalid`
    );
    t.is(
      input.getAttribute('aria-invalid'),
      'true',
      `"${value}" is announced invalid`
    );
  }

  t.is(
    modal.querySelector('#share-mastodon-error').textContent,
    'Enter a server name such as mastodon.social.'
  );
});

test('the site lets its own pages use the device share sheet', async (t) => {
  // Chrome refuses navigator.share() when Permissions-Policy disables it
  const res = await t.context.web.get('/en/about');
  t.is(res.status, 200);
  const policy = res.headers['permissions-policy'];
  t.truthy(policy);
  t.true(policy.split(/,\s*/).includes('web-share=(self)'));
});
