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
  path.join(__dirname, '../../assets/js/hero-console.js'),
  'utf8'
);

function createConsole(direction = 'ltr') {
  const dom = new JSDOM(`
    <!doctype html>
    <html dir="${direction}">
      <body>
        <div data-fe-console>
          <button disabled data-fe-console-scroll="previous">Previous</button>
          <nav data-fe-console-rail>
            <a id="tab-forward" class="fe-console__tab--active" href="#forward" data-fe-console-tab="forward">Forward</a>
            <a id="tab-send" href="#send" data-fe-console-tab="send">Send</a>
            <a id="tab-apps" href="#apps" data-fe-console-tab="apps">Apps</a>
          </nav>
          <button disabled data-fe-console-scroll="next">Next</button>
          <section class="fe-console__view--active" data-fe-console-view="forward"></section>
          <section data-fe-console-view="send"></section>
          <section data-fe-console-view="apps"></section>
        </div>
      </body>
    </html>
  `);
  const { document, window } = dom.window;
  const root = document.querySelector('[data-fe-console]');
  const rail = document.querySelector('[data-fe-console-rail]');
  const tabs = [...document.querySelectorAll('[data-fe-console-tab]')];

  Object.defineProperty(document, 'readyState', {
    configurable: true,
    value: 'complete'
  });

  Object.defineProperties(rail, {
    clientWidth: { value: 200 },
    scrollWidth: { value: 320 }
  });
  rail.getBoundingClientRect = () => ({ left: 0, right: 200 });
  tabs[0].getBoundingClientRect = () =>
    direction === 'rtl' ? { left: 120, right: 200 } : { left: 0, right: 80 };
  tabs[1].getBoundingClientRect = () => ({ left: 80, right: 160 });
  tabs[2].getBoundingClientRect = () =>
    direction === 'rtl'
      ? { left: -120, right: -40 }
      : { left: 240, right: 320 };
  for (const tab of tabs) tab.scrollIntoView = () => {};

  const sandbox = {
    clearInterval() {},
    document,
    matchMedia() {
      return { matches: true };
    },
    setInterval() {
      return 1;
    },
    window
  };
  vm.runInNewContext(source, sandbox, {
    filename: 'assets/js/hero-console.js'
  });

  return { dom, document, root, tabs, window };
}

test('mobile product rail exposes working overflow controls', async (t) => {
  const { dom, document, root, tabs, window } = createConsole();
  t.teardown(() => dom.window.close());

  const previous = document.querySelector(
    '[data-fe-console-scroll="previous"]'
  );
  const next = document.querySelector('[data-fe-console-scroll="next"]');

  t.true(root.classList.contains('fe-console--rail-overflow'));
  t.true(previous.disabled);
  t.false(next.disabled);

  next.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });

  t.false(tabs[0].classList.contains('fe-console__tab--active'));
  t.true(tabs[1].classList.contains('fe-console__tab--active'));
  t.is(tabs[1].getAttribute('aria-selected'), 'true');
  t.true(
    document
      .querySelector('[data-fe-console-view="send"]')
      .classList.contains('fe-console__view--active')
  );
});

test('RTL product rail detects its logical start without scroll offsets', (t) => {
  const { dom, document, root } = createConsole('rtl');
  t.teardown(() => dom.window.close());

  t.true(root.classList.contains('fe-console--rail-overflow'));
  t.true(
    document.querySelector('[data-fe-console-scroll="previous"]').disabled
  );
  t.false(document.querySelector('[data-fe-console-scroll="next"]').disabled);
});
