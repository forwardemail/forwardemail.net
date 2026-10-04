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

const channelConfig = require('../../config/mail-app-channels');
const fallbackRelease = require('../../config/mail-app-release-fallback.json');

const root = path.join(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const videoModalSource = read('assets/js/video-modal.js');
const jquerySource = read('node_modules/jquery/dist/jquery.js');
const bootstrapSource = read(
  'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
);

// The release /download renders from, cached in Redis by
// helpers/get-mail-app-releases.js
const CACHE_KEY = 'mail_app:github_releases';

// The checked-in release snapshot, without the terminal app's executables
// and with them
const isTerminalBuild = (asset) =>
  /^forwardemail-(darwin|linux|win)-/.test(asset.name);
const releaseWithoutTerminal = {
  ...fallbackRelease,
  assets: fallbackRelease.assets.filter((asset) => !isTerminalBuild(asset))
};
const releaseWithTerminal = {
  ...releaseWithoutTerminal,
  assets: [
    ...releaseWithoutTerminal.assets,
    ...[
      'forwardemail-darwin-arm64.gz',
      'forwardemail-darwin-x64.gz',
      'forwardemail-linux-x64.gz',
      'forwardemail-linux-arm64.gz',
      'forwardemail-win-x64.exe.gz',
      'forwardemail-win-arm64.exe.gz'
    ].map((name) => ({
      name,
      size: 40 * 1024 * 1024,
      digest: `sha256:${'a'.repeat(64)}`,
      browserDownloadUrl: `${channelConfig.REPO_URL}/releases/download/${fallbackRelease.tagName}/${name}`
    }))
  ]
};

// a file of one of the page's videos, revisioned by the build
const videoFile = (name, extension) =>
  new RegExp(`/img/video/${name}(-[\\da-f]{10})?\\.${extension}$`);
const appsVideo = (extension) => videoFile('forward-email-apps', extension);
const terminalVideo = (extension) =>
  videoFile('forward-email-terminal', extension);

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function getDownloadPage(t, release, locale = 'en') {
  await t.context._web.client.set(CACHE_KEY, JSON.stringify(release));
  const res = await t.context.web
    .get(`/${locale}/download`)
    .set({ Accept: 'text/html' });
  t.is(res.status, 200);
  return res.text;
}

//
// The page as served, with the real jQuery, Bootstrap modal and video
// script it loads. jsdom has no media playback, so play() and pause() are
// recorded, per modal.
//
function openPage(html, url) {
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const { window } = dom;
  window.eval(jquerySource);
  window.eval(bootstrapSource);

  const calls = [];
  for (const video of window.document.querySelectorAll(
    '.fe-video-modal video'
  )) {
    const { id } = video.closest('.fe-video-modal');
    video.play = () => {
      calls.push(`play ${id}`);
      return Promise.resolve();
    };

    video.pause = () => calls.push(`pause ${id}`);
  }

  vm.runInNewContext(
    videoModalSource,
    {
      require(id) {
        if (id === 'jquery') return window.jQuery;
        throw new Error(`unexpected require ${id}`);
      },
      window
    },
    { filename: 'assets/js/video-modal.js' }
  );

  return { dom, window, calls };
}

// Bootstrap finishes opening on a timer, so wait for its own event
function modalEvent(window, id, name) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error(`no ${name}.bs.modal on #${id}`)),
      5000
    );
    window.jQuery(`#${id}`).one(`${name}.bs.modal`, () => {
      window.clearTimeout(timer);
      window.setTimeout(resolve, 0);
    });
  });
}

const isOpen = (window, id) =>
  window.document.querySelector(`#${id}`).classList.contains('show');

// what a screen reader hears after a link's name (its aria-describedby)
const description = (document, element) =>
  document.querySelector(`#${element.getAttribute('aria-describedby')}`)
    .textContent;

function click(window, element) {
  const event = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
  return event;
}

test.serial("the hero's Watch link plays the apps video", async (t) => {
  const html = await getDownloadPage(t, releaseWithTerminal);
  const { dom, window, calls } = openPage(
    html,
    `${t.context.webURL}/en/download`
  );
  t.teardown(() => dom.window.close());
  const { document } = window;

  // the link sits in the hero, with the length of the video
  const link = document.querySelector(
    '#fe-download-title ~ .fe-actions .fe-video-button'
  );
  t.truthy(link);
  t.is(link.dataset.target, '#modal-video-apps');
  // without JavaScript, the link is the MP4 itself
  t.regex(link.getAttribute('href'), appsVideo('mp4'));
  t.is(link.querySelector('time').textContent, '1:49');
  // a screen reader hears which video it opens
  t.is(description(document, link), 'Forward Email on every device');

  // its modal plays the apps video
  const modal = document.querySelector('#modal-video-apps');
  t.is(
    modal.querySelector('#modal-video-apps-title').textContent,
    'Forward Email on every device'
  );
  const video = modal.querySelector('video');
  const sources = [...video.querySelectorAll('source')];
  t.regex(sources[0].getAttribute('src'), appsVideo('mp4'));
  t.regex(sources[1].getAttribute('src'), appsVideo('webm'));
  t.is(
    modal.querySelector('.fe-video__download').getAttribute('download'),
    'forward-email-apps.mp4'
  );
  // nothing of the video loads until the link is clicked
  t.is(video.getAttribute('preload'), 'none');
  t.is(video.getAttribute('poster'), null);

  const shown = modalEvent(window, 'modal-video-apps', 'shown');
  const event = click(window, link);
  // within the click, and the link opens the modal instead of the file
  t.deepEqual(calls, ['play modal-video-apps']);
  t.true(event.defaultPrevented);
  t.regex(video.getAttribute('poster'), appsVideo('jpg'));

  await shown;
  t.true(isOpen(window, 'modal-video-apps'));
  t.false(isOpen(window, 'modal-video-terminal'));
});

test.serial(
  'the hero hides its terminal button on phones with display classes',
  async (t) => {
    const html = await getDownloadPage(t, releaseWithTerminal);
    const { window } = new JSDOM(html);
    t.teardown(() => window.close());

    const actions = window.document.querySelector(
      '.fe-download-hero .fe-actions'
    );
    const terminal = actions.querySelector('a[href="#fe-download-terminal"]');
    t.is(terminal.textContent.trim(), 'Install in the terminal');
    // bootstrap's display classes: none below 768px, and from 768px the
    // inline-flex every .fe-btn has
    t.true(terminal.classList.contains('d-none'));
    t.true(terminal.classList.contains('d-md-inline-flex'));

    // the hero's other actions show at every width
    const others = [...actions.querySelectorAll('a')].filter(
      (a) => a !== terminal
    );
    t.is(others.length, 3);
    for (const a of others) t.false(a.classList.contains('d-none'));
  }
);

test.serial(
  "the Terminal section's card plays the terminal app's video",
  async (t) => {
    const html = await getDownloadPage(t, releaseWithTerminal);
    const { dom, window, calls } = openPage(
      html,
      `${t.context.webURL}/en/download`
    );
    t.teardown(() => dom.window.close());
    const { document } = window;

    // the card sits beside the lede of the Terminal section
    const section = document
      .querySelector('#fe-download-terminal-group-title')
      .closest('section');
    const card = section.querySelector(
      '.fe-download-group__intro > .fe-video-card'
    );
    t.truthy(card);
    t.is(document.querySelectorAll('.fe-video-card').length, 1);
    t.is(card.dataset.target, '#modal-video-terminal');
    // without JavaScript, the card is a link to the MP4
    t.regex(card.getAttribute('href'), terminalVideo('mp4'));
    // the card's still is the WebP copy of the poster
    t.regex(
      card.querySelector('img').getAttribute('src'),
      terminalVideo('webp')
    );
    t.is(card.querySelector('time').textContent, '1:44');
    // a screen reader hears which video it opens
    t.is(description(document, card), 'Forward Email in your terminal');

    // its own modal plays the terminal app's video
    const modal = document.querySelector('#modal-video-terminal');
    t.is(
      modal.querySelector('#modal-video-terminal-title').textContent,
      'Forward Email in your terminal'
    );
    const video = modal.querySelector('video');
    const sources = [...video.querySelectorAll('source')];
    t.regex(sources[0].getAttribute('src'), terminalVideo('mp4'));
    t.regex(sources[1].getAttribute('src'), terminalVideo('webm'));
    t.is(
      modal.querySelector('.fe-video__download').getAttribute('download'),
      'forward-email-terminal.mp4'
    );
    t.truthy(document.querySelector('script[src*="js/video-modal"]'));
    t.is(video.getAttribute('poster'), null);

    const shown = modalEvent(window, 'modal-video-terminal', 'shown');
    t.true(click(window, card).defaultPrevented);
    t.deepEqual(calls, ['play modal-video-terminal']);
    t.regex(video.getAttribute('poster'), terminalVideo('jpg'));
    await shown;
    t.true(isOpen(window, 'modal-video-terminal'));
    t.false(isOpen(window, 'modal-video-apps'));

    // closing it pauses that video only
    const hidden = modalEvent(window, 'modal-video-terminal', 'hidden');
    click(window, modal.querySelector('[data-dismiss="modal"]'));
    await hidden;
    t.deepEqual(calls, [
      'play modal-video-terminal',
      'pause modal-video-terminal'
    ]);
  }
);

test.serial(
  "a link with a video's hash opens that video on arrival",
  async (t) => {
    const html = await getDownloadPage(t, releaseWithTerminal);
    for (const [hash, id, other] of [
      ['#video', 'modal-video-apps', 'modal-video-terminal'],
      ['#video-terminal', 'modal-video-terminal', 'modal-video-apps']
    ]) {
      const { dom, window, calls } = openPage(
        html,
        `${t.context.webURL}/en/download?ref=x${hash}`
      );
      t.teardown(() => dom.window.close());
      await modalEvent(window, id, 'shown');
      t.true(isOpen(window, id));
      t.false(isOpen(window, other));

      // closing it pauses that video and takes the hash back out, so the
      // same link works again
      const hidden = modalEvent(window, id, 'hidden');
      window.jQuery(`#${id}`).modal('hide');
      await hidden;
      t.deepEqual(calls, [`play ${id}`, `pause ${id}`]);
      t.is(window.location.hash, '');
      t.is(window.location.search, '?ref=x');
    }
  }
);

test.serial('the Spanish page names both videos in Spanish', async (t) => {
  const html = await getDownloadPage(t, releaseWithTerminal, 'es');
  const { window } = new JSDOM(html);
  t.teardown(() => window.close());
  const { document } = window;

  t.is(
    document.querySelector('#modal-video-apps-title').textContent,
    'Forward Email en todos sus dispositivos'
  );
  t.is(
    document.querySelector('#modal-video-terminal-title').textContent,
    'Forward Email en su terminal'
  );
});

test.serial(
  'a release without the terminal app has only the apps video',
  async (t) => {
    const html = await getDownloadPage(t, releaseWithoutTerminal);
    // with #video-terminal in the address, nothing opens
    const { dom, window, calls } = openPage(
      html,
      `${t.context.webURL}/en/download#video-terminal`
    );
    t.teardown(() => dom.window.close());
    const { document } = window;

    t.is(document.querySelector('#fe-download-terminal-group-title'), null);
    t.is(document.querySelector('.fe-video-card'), null);
    t.is(document.querySelector('#modal-video-terminal'), null);
    t.truthy(document.querySelector('#modal-video-apps'));
    t.truthy(document.querySelector('.fe-download-hero .fe-video-button'));
    t.false(isOpen(window, 'modal-video-apps'));
    t.deepEqual(calls, []);
  }
);

test.serial(
  'the footer has a chip per app that opens its card on the download page',
  async (t) => {
    const keys = ['macos', 'windows', 'linux', 'android', 'ios', 'terminal'];
    const download = new JSDOM(await getDownloadPage(t, releaseWithTerminal))
      .window.document;

    for (const locale of ['en', 'es']) {
      const res = await t.context.web
        .get(`/${locale}/about`)
        .set({ Accept: 'text/html' });
      t.is(res.status, 200);
      const { document } = new JSDOM(res.text).window;
      const nav = document.querySelector('footer nav.fe-footer-apps');
      t.truthy(nav, `${locale}: the footer has the app chips`);
      t.is(
        document.querySelector(`#${nav.getAttribute('aria-labelledby')}`)
          .textContent,
        locale === 'es' ? 'Aplicaciones' : 'Apps'
      );

      const links = [...nav.querySelectorAll('a.fe-chip')];
      t.deepEqual(
        links.map((a) => a.getAttribute('href')),
        keys.map((key) => `/${locale}/download#fe-download-${key}`)
      );
      t.deepEqual(
        links.map((a) => a.textContent.trim()),
        ['macOS', 'Windows', 'Linux', 'Android', 'iOS', 'Terminal']
      );
      for (const a of links) {
        const icon = a.querySelector('i');
        t.is(icon.getAttribute('aria-hidden'), 'true');
      }
    }

    // every chip lands on that platform's card, which holds its builds
    for (const key of keys) {
      const card = download.querySelector(`#fe-download-${key}`);
      t.truthy(card, `the download page has a ${key} card`);
      t.true(card.classList.contains('fe-download-card'));
      t.truthy(card.querySelector('a[href]'), `the ${key} card has a link`);
    }
  }
);
