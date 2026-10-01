/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const pug = require('pug');
const test = require('ava');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '../..');
const source = fs.readFileSync(
  path.join(root, 'assets/js/home-video.js'),
  'utf8'
);
const jquerySource = fs.readFileSync(
  path.join(root, 'node_modules/jquery/dist/jquery.js'),
  'utf8'
);
const bootstrapSource = fs.readFileSync(
  path.join(root, 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'),
  'utf8'
);

// the hero's link, the product card and the modal, rendered from
// app/views/_fe-video.pug as the home page renders them
const markup = pug.render(
  'include _fe-video\n+feVideoButton\n+feVideoCard\n+feVideoModal\n',
  {
    filename: path.join(root, 'app/views/home.pug'),
    t: (phrase) => phrase,
    manifest: (file) => `/${file}`
  }
);

//
// The page with the real jQuery and Bootstrap modal it loads. jsdom has no
// media playback, so play() and pause() are recorded.
//
function createPage({ url = 'http://localhost/en', refusePlay = false } = {}) {
  const dom = new JSDOM(`<!doctype html><html><body>${markup}</body></html>`, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const { window } = dom;
  window.eval(jquerySource);
  window.eval(bootstrapSource);

  const video = window.document.querySelector('#modal-video video');
  const calls = [];
  video.play = () => {
    calls.push('play');
    return refusePlay
      ? Promise.reject(new window.DOMException('no', 'NotAllowedError'))
      : Promise.resolve();
  };

  video.pause = () => calls.push('pause');

  vm.runInNewContext(
    source,
    {
      require(id) {
        if (id === 'jquery') return window.jQuery;
        throw new Error(`unexpected require ${id}`);
      },
      window
    },
    { filename: 'assets/js/home-video.js' }
  );

  return { dom, window, video, calls };
}

// Bootstrap finishes opening and closing on timers (computing styles in
// jsdom takes a while), so wait for its own event
function modalEvent(window, name) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error(`no ${name}.bs.modal`)),
      2000
    );
    window.jQuery('#modal-video').one(`${name}.bs.modal`, () => {
      window.clearTimeout(timer);
      // after every other handler for the same event has run
      window.setTimeout(resolve, 0);
    });
  });
}

function wait(window, ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function click(window, selector) {
  const event = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });
  window.document.querySelector(selector).dispatchEvent(event);
  return event;
}

const isOpen = (window) =>
  window.document.querySelector('#modal-video').classList.contains('show');

test('the hero link plays the video within the click, and loads the poster only then', async (t) => {
  const { dom, window, video, calls } = createPage();
  t.teardown(() => dom.window.close());

  t.is(video.getAttribute('poster'), null);
  t.deepEqual(calls, []);

  const shown = modalEvent(window, 'shown');
  const event = click(window, '.fe-video-button');
  // still inside the click: Safari allows sound only from there
  t.deepEqual(calls, ['play']);
  t.is(video.getAttribute('poster'), '/img/video/forward-email.jpg');
  // the link opens the modal instead of the file
  t.true(event.defaultPrevented);

  await shown;
  t.true(isOpen(window));
});

test('the product card opens it too', async (t) => {
  const { dom, window, calls } = createPage();
  t.teardown(() => dom.window.close());

  const shown = modalEvent(window, 'shown');
  t.true(click(window, '.fe-video-card').defaultPrevented);
  await shown;
  t.true(isOpen(window));
  t.deepEqual(calls, ['play']);
});

test('closing the modal pauses the video', async (t) => {
  const { dom, window, calls } = createPage();
  t.teardown(() => dom.window.close());

  const shown = modalEvent(window, 'shown');
  click(window, '.fe-video-button');
  await shown;
  const hidden = modalEvent(window, 'hidden');
  click(window, '#modal-video [data-dismiss="modal"]');
  await hidden;

  t.deepEqual(calls, ['play', 'pause']);
  t.false(isOpen(window));
});

test('a browser that declines to play leaves the controls to the visitor', async (t) => {
  const { dom, window, calls } = createPage({ refusePlay: true });
  t.teardown(() => dom.window.close());

  // an unhandled rejection here would fail the test run
  const shown = modalEvent(window, 'shown');
  click(window, '.fe-video-button');
  await shown;
  await wait(window, 20);

  t.deepEqual(calls, ['play']);
  t.true(isOpen(window));
});

test('a link to /#video opens it on arrival, and closing it clears the hash', async (t) => {
  const { dom, window, video } = createPage({
    url: 'http://localhost/en?ref=x#video'
  });
  t.teardown(() => dom.window.close());

  await modalEvent(window, 'shown');
  t.true(isOpen(window));
  t.is(video.getAttribute('poster'), '/img/video/forward-email.jpg');

  const hidden = modalEvent(window, 'hidden');
  window.jQuery('#modal-video').modal('hide');
  await hidden;
  t.is(window.location.hash, '');
  t.is(window.location.pathname + window.location.search, '/en?ref=x');

  // so the same link works again
  const shown = modalEvent(window, 'shown');
  window.location.hash = '#video';
  await shown;
  t.true(isOpen(window));
});

test('other hashes leave it closed, and closing it leaves them alone', async (t) => {
  const { dom, window, calls } = createPage({
    url: 'http://localhost/en#send'
  });
  t.teardown(() => dom.window.close());

  await wait(window, 200);
  t.false(isOpen(window));
  t.deepEqual(calls, []);

  const shown = modalEvent(window, 'shown');
  click(window, '.fe-video-button');
  await shown;
  const hidden = modalEvent(window, 'hidden');
  window.jQuery('#modal-video').modal('hide');
  await hidden;
  t.is(window.location.hash, '#send');
});
