/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const test = require('ava');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(
  path.join(__dirname, '../../assets/js/help-suggest.js'),
  'utf8'
);

const HTML = `
  <!doctype html>
  <html>
    <body>
      <form action="/en/help" method="POST">
        <textarea name="message"></textarea>
        <div
          hidden
          data-help-suggest="/en/faq/suggest.json"
          data-help-suggest-label="These answers may help:"
        ></div>
        <button type="submit">Send</button>
      </form>
    </body>
  </html>
`;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Boot the script in a jsdom page with a scripted fetch. Returns the page and
// the list of URLs fetch was asked for.
function boot(respond) {
  const dom = new JSDOM(HTML);
  const { document, window } = dom.window;
  const calls = [];
  const fetch = (url, options) => {
    calls.push(url);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(respond(url, options))
    });
  };

  const sandbox = {
    document,
    window,
    fetch,
    AbortController: window.AbortController,
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    console
  };
  window.fetch = fetch;
  vm.runInNewContext(source, sandbox, {
    filename: 'assets/js/help-suggest.js'
  });
  document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return { document, window, calls };
}

function type(document, window, value) {
  const input = document.querySelector('textarea');
  input.value = value;
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

test('renders suggestions as text links after a pause in typing', async (t) => {
  const payload =
    '<img src=x onerror="window.__xss=1">Do you store error logs?';
  const { document, window, calls } = boot(() => ({
    suggestions: [
      {
        id: 'do-you-store-error-logs',
        question: payload,
        topic: 'Account & <b>Billing</b>',
        url: '/en/faq#do-you-store-error-logs'
      }
    ]
  }));

  type(document, window, 'why are my error logs empty');
  await delay(400);

  t.is(calls.length, 1);
  t.true(calls[0].startsWith('/en/faq/suggest.json?q='));
  t.true(calls[0].includes(encodeURIComponent('why are my error logs empty')));

  const box = document.querySelector('[data-help-suggest]');
  t.false(box.hidden);
  t.is(box.querySelector('p').textContent, 'These answers may help:');
  const link = box.querySelector('a');
  t.is(link.getAttribute('href'), '/en/faq#do-you-store-error-logs');
  t.is(link.target, '_blank');
  t.is(link.rel, 'noopener noreferrer');
  t.is(link.querySelectorAll('img, b').length, 0);
  t.is(link.querySelector('span').textContent, payload);
  t.is(link.querySelector('small').textContent, 'Account & <b>Billing</b>');
});

test('does not fetch for very short input and hides when the box is cleared or reset', async (t) => {
  const { document, window, calls } = boot(() => ({
    suggestions: [{ id: 'x', question: 'Q', topic: 'T', url: '/en/faq#x' }]
  }));

  type(document, window, 'hi');
  await delay(400);
  t.is(calls.length, 0);
  t.true(document.querySelector('[data-help-suggest]').hidden);

  type(document, window, 'imap not working');
  await delay(400);
  t.is(calls.length, 1);
  t.false(document.querySelector('[data-help-suggest]').hidden);

  type(document, window, '');
  await delay(400);
  t.is(calls.length, 1);
  t.true(document.querySelector('[data-help-suggest]').hidden);
  t.is(document.querySelector('[data-help-suggest]').childElementCount, 0);

  type(document, window, 'imap not working');
  await delay(400);
  t.false(document.querySelector('[data-help-suggest]').hidden);
  document
    .querySelector('form')
    .dispatchEvent(new window.Event('reset', { bubbles: true }));
  t.true(document.querySelector('[data-help-suggest]').hidden);
});

test('hides the box when the server has no suggestions and only renders the latest response', async (t) => {
  let resolveFirst;
  const first = new Promise((resolve) => {
    resolveFirst = resolve;
  });
  let n = 0;
  const dom = new JSDOM(HTML);
  const { document, window } = dom.window;
  const fetch = () => {
    n++;
    if (n === 1)
      return first.then(() => ({
        ok: true,
        json: () =>
          Promise.resolve({
            suggestions: [
              { id: 'old', question: 'Old', topic: 'T', url: '/en/faq#old' }
            ]
          })
      }));
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ suggestions: [] })
    });
  };

  vm.runInNewContext(
    source,
    {
      document,
      window,
      fetch,
      setTimeout: window.setTimeout.bind(window),
      clearTimeout: window.clearTimeout.bind(window),
      console
    },
    { filename: 'assets/js/help-suggest.js' }
  );
  document.dispatchEvent(new window.Event('DOMContentLoaded'));

  type(document, window, 'first question');
  await delay(400);
  type(document, window, 'second question');
  await delay(400);
  // The stale first response arrives after the second was rendered.
  resolveFirst();
  await delay(20);

  t.is(n, 2);
  const box = document.querySelector('[data-help-suggest]');
  t.true(box.hidden);
  t.is(box.querySelectorAll('a').length, 0);
});
