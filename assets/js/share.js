/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');

const logger = require('./logger');

//
// Share dialog (_share.pug)
//
// The dialog ships in a <template> and joins the page on the first click of a
// Share button, ahead of bootstrap's delegated data-toggle="modal" handler
// (this listener captures). Where the browser has a share sheet the dialog
// offers it, and on phones and tablets the Share buttons open the sheet
// instead of the dialog. Mastodon has no central share page, so its link asks
// for the reader's server.
//

// The host of a Mastodon server as a reader might type it: "mastodon.social",
// "https://hachyderm.io/", "fosstodon.org/@name" or the handle
// "@name@mastodon.social". Returns "" for anything that is not a host name.
// URL() turns an international name into its ASCII (xn--) form and keeps a
// port.
function mastodonHost(value) {
  let input = String(value || '').trim();
  const handle = /^@?[^\s/@]+@([^\s/@]+)$/.exec(input);
  if (handle) input = handle[1];
  let host = '';
  try {
    host = new URL(input.includes('://') ? input : `https://${input}`).host;
  } catch (err) {
    // (a named binding: the bundler's parser predates optional catch binding)
    logger.debug(err);
    return '';
  }

  host = host.toLowerCase();
  return /^([\da-z]([\da-z-]*[\da-z])?\.)+[\da-z-]{2,}(:\d{1,5})?$/.test(host)
    ? host
    : '';
}

const shareTemplate = window.document.querySelector('#share-template');
if (shareTemplate) {
  const shareSource = shareTemplate.content.querySelector('#modal-share');
  const shareData = {
    title: window.document.title,
    text: shareSource.dataset.shareText,
    url: shareSource.dataset.shareUrl
  };
  const canShareNatively =
    typeof window.navigator.share === 'function' &&
    (typeof window.navigator.canShare !== 'function' ||
      window.navigator.canShare(shareData));
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  // The reader closing the sheet rejects with an AbortError. Any other
  // rejection means the sheet did not open, so the dialog opens instead.
  const shareNatively = (onFail) => {
    let sharing;
    try {
      sharing = window.navigator.share(shareData);
    } catch (err) {
      sharing = Promise.reject(err);
    }

    sharing.catch((err) => {
      logger.debug(err);
      if (onFail && (!err || err.name !== 'AbortError')) onFail();
    });
  };

  const addShareModal = () => {
    window.document.body.append(shareTemplate.content.cloneNode(true));
    const $modal = $('#modal-share');
    if (canShareNatively)
      $modal
        .find('[data-share-native]')
        .prop('hidden', false)
        .on('click', () => shareNatively());

    const $mastodonForm = $modal.find('[data-share-mastodon-form]');
    $modal.find('[data-share-mastodon]').on('click', (event) => {
      event.preventDefault();
      $mastodonForm.prop('hidden', false).find('input').trigger('focus');
    });
    $mastodonForm.on('submit', (event) => {
      event.preventDefault();
      const $input = $mastodonForm.find('input');
      const host = mastodonHost($input.val());
      $input.toggleClass('is-invalid', !host).attr('aria-invalid', !host);
      if (!host) {
        $input.trigger('focus');
        return;
      }

      window.open(
        `https://${host}/share?text=${encodeURIComponent(
          `${shareData.text} ${shareData.url}`
        )}`,
        '_blank',
        'noopener'
      );
    });
  };

  window.document.addEventListener(
    'click',
    (event) => {
      const opener =
        event.target && typeof event.target.closest === 'function'
          ? event.target.closest('[data-share-open]')
          : null;
      if (!opener) return;
      if (canShareNatively && isTouch) {
        event.preventDefault();
        event.stopPropagation();
        shareNatively(() => {
          if (!window.document.querySelector('#modal-share')) addShareModal();
          $('#modal-share').modal('show');
        });
        return;
      }

      if (!window.document.querySelector('#modal-share')) addShareModal();
    },
    true
  );
}
