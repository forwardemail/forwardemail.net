/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');

// The tour video on the home page (app/views/_fe-video.pug). The video starts
// as the modal opens, in the same click (Safari plays sound only from inside
// one, and the modal finishes opening on a timer), and pauses when it closes.
// A link to /#video opens it on arrival, and closing it takes #video back out
// of the address bar so the same link works again. The poster is set here, so
// a visit that never opens the video never downloads it.

const $modal = $('#modal-video');
const video = $modal.find('video').get(0);

function play() {
  const playing = video.play();
  // A browser can still decline (no click behind it, as with /#video, or
  // autoplay turned off); the controls are there for that.
  if (playing && typeof playing.catch === 'function') playing.catch(() => {});
}

function openFromHash() {
  if (window.location.hash === '#video') $modal.modal('show');
}

if (video) {
  $modal.on('show.bs.modal', () => {
    if (!video.getAttribute('poster') && video.dataset.poster)
      video.setAttribute('poster', video.dataset.poster);
    play();
  });
  $modal.on('hide.bs.modal', () => video.pause());
  $modal.on('hidden.bs.modal', () => {
    if (window.location.hash === '#video')
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search
      );
  });
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}
