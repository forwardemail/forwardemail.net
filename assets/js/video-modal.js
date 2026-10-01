/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');

// The video modals (app/views/_fe-video.pug): the tour on the home page, and
// the apps video and the terminal app's video on /download. A video starts as
// its modal opens, in the same click (Safari plays sound only from inside
// one, and the modal finishes opening on a timer), and pauses when it closes.
// A link to the page with a modal's hash (#video, #video-terminal) opens that
// modal on arrival, and closing it takes the hash back out of the address bar
// so the same link works again. The poster is set here, so a visit that never
// opens a video never downloads it.

const modals = $('.fe-video-modal')
  .toArray()
  .map((element) => ({
    $modal: $(element),
    video: element.querySelector('video'),
    hash: `#${element.dataset.videoHash}`
  }))
  .filter(({ video }) => video);

function play(video) {
  const playing = video.play();
  // A browser can still decline (no click behind it, as with a #video link,
  // or autoplay turned off); the controls are there for that.
  if (playing && typeof playing.catch === 'function') playing.catch(() => {});
}

function openFromHash() {
  const match = modals.find(({ hash }) => window.location.hash === hash);
  if (match) match.$modal.modal('show');
}

for (const { $modal, video, hash } of modals) {
  $modal.on('show.bs.modal', () => {
    if (!video.getAttribute('poster') && video.dataset.poster)
      video.setAttribute('poster', video.dataset.poster);
    play(video);
  });
  $modal.on('hide.bs.modal', () => video.pause());
  $modal.on('hidden.bs.modal', () => {
    if (window.location.hash === hash)
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search
      );
  });
}

if (modals.length > 0) {
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}
