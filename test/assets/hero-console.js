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

//
// The console as _fe-console.pug renders it: buttons naming their view through
// `data-target`, the views carrying those ids. The rail is given a 200px box
// with 320px of content so the third tab starts out of view, which is what
// the overflow controls and the rail scrolling are about.
//
function createConsole({ direction = 'ltr', reducedMotion = true, url } = {}) {
  const dom = new JSDOM(
    `
    <!doctype html>
    <html dir="${direction}">
      <body>
        <div data-fe-console>
          <button disabled data-fe-console-scroll="previous">Previous</button>
          <div data-fe-console-rail>
            <button type="button" id="tab-forward" class="fe-console__tab--active" data-target="#forward" data-fe-console-tab>Forward</button>
            <button type="button" id="tab-send" data-target="#send" data-fe-console-tab>Send</button>
            <button type="button" id="tab-apps" data-target="#apps" data-fe-console-tab>Apps</button>
          </div>
          <button disabled data-fe-console-scroll="next">Next</button>
          <section id="forward" class="fe-console__view--active" data-fe-console-view="forward"></section>
          <section id="send" data-fe-console-view="send"></section>
          <section id="apps" data-fe-console-view="apps"></section>
        </div>
      </body>
    </html>
  `,
    // pretendToBeVisual: jsdom reports document.hidden otherwise, and the
    // auto-advance sits out hidden tabs
    { url: url || 'http://localhost/', pretendToBeVisual: true }
  );
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

  // Everything that could move the page is recorded rather than allowed.
  const pageScrolls = [];
  const railScrolls = [];
  const hashWrites = [];
  window.scrollTo = (...args) => pageScrolls.push(['scrollTo', ...args]);
  window.scrollBy = (...args) => pageScrolls.push(['scrollBy', ...args]);
  window.scroll = (...args) => pageScrolls.push(['scroll', ...args]);
  for (const tab of tabs)
    tab.scrollIntoView = (...args) =>
      pageScrolls.push(['scrollIntoView', ...args]);
  rail.scrollBy = (options) => railScrolls.push(options);
  window.history.replaceState = (...args) =>
    hashWrites.push(['replaceState', ...args]);
  window.history.pushState = (...args) =>
    hashWrites.push(['pushState', ...args]);

  // The auto-advance timer and the visibility observer are driven by hand.
  let tick = null;
  let observe = null;
  class IntersectionObserver {
    constructor(callback) {
      observe = callback;
    }

    observe() {}
  }

  const sandbox = {
    IntersectionObserver,
    clearInterval() {
      tick = null;
    },
    document,
    matchMedia() {
      return { matches: reducedMotion };
    },
    setInterval(fn) {
      tick = fn;
      return 1;
    },
    window
  };
  vm.runInNewContext(source, sandbox, {
    filename: 'assets/js/hero-console.js'
  });

  return {
    dom,
    document,
    root,
    rail,
    tabs,
    window,
    pageScrolls,
    railScrolls,
    hashWrites,
    tick: () => tick && tick(),
    isRotating: () => tick !== null,
    setOnScreen: (isIntersecting) => observe && observe([{ isIntersecting }])
  };
}

function activeId(document) {
  return document.querySelector('.fe-console__view--active').id;
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
  const { dom, document, root } = createConsole({ direction: 'rtl' });
  t.teardown(() => dom.window.close());

  t.true(root.classList.contains('fe-console--rail-overflow'));
  t.true(
    document.querySelector('[data-fe-console-scroll="previous"]').disabled
  );
  t.false(document.querySelector('[data-fe-console-scroll="next"]').disabled);
});

test('tabs control the view named by their data-target', (t) => {
  const { dom, rail, tabs, document } = createConsole();
  t.teardown(() => dom.window.close());

  t.is(rail.getAttribute('role'), 'tablist');
  t.deepEqual(
    tabs.map((tab) => tab.getAttribute('aria-controls')),
    ['forward', 'send', 'apps']
  );
  t.is(
    document.querySelector('#send').getAttribute('aria-labelledby'),
    'tab-send'
  );
});

test('choosing a tab leaves the address bar alone', (t) => {
  const { dom, document, tabs, window, hashWrites, isRotating } = createConsole(
    { reducedMotion: false }
  );
  t.teardown(() => dom.window.close());

  t.true(isRotating());
  tabs[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  t.is(activeId(document), 'send');
  t.is(tabs[1].getAttribute('aria-selected'), 'true');
  t.is(window.location.hash, '');
  t.is(window.location.href, 'http://localhost/');
  t.deepEqual(hashWrites, []);
  // the first interaction ends the tour
  t.false(isRotating());
});

test('auto-advance scrolls the rail, never the page', (t) => {
  const { dom, document, tick, pageScrolls, railScrolls, isRotating } =
    createConsole({ reducedMotion: false });
  t.teardown(() => dom.window.close());

  t.true(isRotating());
  t.is(activeId(document), 'forward');

  tick();
  t.is(activeId(document), 'send');
  // the second tab sits inside the rail's box, nothing to scroll
  t.deepEqual(railScrolls, []);

  tick();
  t.is(activeId(document), 'apps');
  // the third starts 120px past the rail's right edge: the rail moves by that
  t.deepEqual(railScrolls, [{ left: 120, behavior: 'auto' }]);

  tick();
  t.is(activeId(document), 'forward');
  // (the stubbed boxes do not move with the rail, so the first tab still
  // measures as visible and the wrap-around asks for no scroll)
  t.is(railScrolls.length, 1);

  t.deepEqual(pageScrolls, []);
  t.true(isRotating());
});

test('auto-advance waits while the console is off screen', (t) => {
  const { dom, document, tick, setOnScreen, pageScrolls } = createConsole({
    reducedMotion: false
  });
  t.teardown(() => dom.window.close());

  setOnScreen(false);
  tick();
  tick();
  t.is(activeId(document), 'forward');

  setOnScreen(true);
  tick();
  t.is(activeId(document), 'send');
  t.deepEqual(pageScrolls, []);
});

test('arrow keys move between tabs without scrolling the page', (t) => {
  const { dom, document, tabs, window, pageScrolls, hashWrites, isRotating } =
    createConsole({ reducedMotion: false });
  t.teardown(() => dom.window.close());

  tabs[0].dispatchEvent(
    new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
  );
  t.is(activeId(document), 'send');
  t.is(document.activeElement, tabs[1]);
  t.is(tabs[1].tabIndex, 0);
  t.is(tabs[0].tabIndex, -1);

  tabs[1].dispatchEvent(
    new window.KeyboardEvent('keydown', { key: 'End', bubbles: true })
  );
  t.is(activeId(document), 'apps');

  t.deepEqual(pageScrolls, []);
  t.deepEqual(hashWrites, []);
  t.false(isRotating());
});

test('a deep link opens its view and does not start the tour', (t) => {
  const { dom, document, tabs, isRotating, hashWrites } = createConsole({
    reducedMotion: false,
    url: 'http://localhost/#send'
  });
  t.teardown(() => dom.window.close());

  t.is(activeId(document), 'send');
  t.is(tabs[1].getAttribute('aria-selected'), 'true');
  t.false(isRotating());
  t.deepEqual(hashWrites, []);
});
