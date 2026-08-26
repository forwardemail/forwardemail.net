/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Two small enhancements for /download. Both are additive: with this file
// blocked the hero button is still an anchor down to the full matrix, and the
// checksum controls simply do not appear, since they are only rendered when
// the release reported a digest and they do nothing until wired up here.

/**
 * Work out which build to offer, from the coarsest signal that is actually
 * reliable. Only the platform is detected, never the architecture: Safari
 * reports Intel on Apple Silicon, so a guess would send some visitors the
 * wrong Mac build. The card for their platform sits immediately below with
 * both options on it.
 *
 * navigator.platform is deprecated but is the one signal every browser in our
 * targets still answers, and it only has to separate five operating systems.
 * navigator.userAgentData would be the modern form and is Chromium only, so
 * it would need this fallback anyway.
 *
 * @returns {string|null} a platform key from helpers/get-app-downloads.js
 */
function detectPlatform() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';

  // Android has to be tested before Linux, since every Android user agent
  // also says Linux.
  if (/android/i.test(ua)) return 'android';

  // iPadOS 13 and later report a Mac user agent, so a Mac that reports touch
  // points is an iPad.
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/mac/i.test(platform) && navigator.maxTouchPoints > 1) return 'ios';

  if (/mac/i.test(platform) || /mac os x/i.test(ua)) return 'macos';
  if (/win/i.test(platform) || /windows/i.test(ua)) return 'windows';
  if (/linux|x11|cros/i.test(platform) || /linux/i.test(ua)) return 'linux';

  return null;
}

/**
 * Point the hero button at the detected platform's default build.
 */
function setUpPrimary() {
  const button = document.querySelector('#fe-download-primary');
  if (!button) return;

  let map;
  try {
    map = JSON.parse(button.dataset.feDownloadMap || '{}');
  } catch (err) {
    // The map is emitted by the server, so a parse failure means the markup
    // and this file are out of step. Leaving the anchor pointing at the
    // matrix is the right outcome either way.
    if (window.console && window.console.error) window.console.error(err);
    return;
  }

  const platform = detectPlatform();
  const entry = platform ? map[platform] : null;
  // No detection, or a platform with no build in this release, leaves the
  // server-rendered anchor to the matrix exactly as it is.
  if (!entry || !entry.url) return;

  button.href = entry.url;
  button.rel = 'noopener';

  const label = document.querySelector('#fe-download-primary-label');
  if (label && entry.label) label.textContent = entry.label;

  const meta = document.querySelector('#fe-download-primary-meta');
  if (meta && entry.meta) {
    meta.textContent = entry.meta;
    meta.hidden = false;
  }
}

/**
 * Copy an asset's checksum.
 *
 * The tick means "this is the one in your clipboard", so any other row still
 * showing it is cleared first. Without that, clicking three rows inside the
 * revert window leaves three ticks up while the clipboard holds only the last.
 *
 * @param {HTMLElement} button
 */
async function copyChecksum(button) {
  const value = button.dataset.feCopy;
  if (!value || !navigator.clipboard) return;

  try {
    await navigator.clipboard.writeText(value);
  } catch (err) {
    // A denied clipboard permission is not worth surfacing. The checksum is
    // still on the release page the row links to.
    if (window.console && window.console.debug) window.console.debug(err);
    return;
  }

  for (const other of document.querySelectorAll('.fe-dl-copy.is-copied')) {
    if (other === button) continue;
    other.classList.remove('is-copied');
    if (other.dataset.feCopyTimer) {
      clearTimeout(Number.parseInt(other.dataset.feCopyTimer, 10));
      delete other.dataset.feCopyTimer;
    }
  }

  button.classList.add('is-copied');
  if (button.dataset.feCopyTimer) {
    clearTimeout(Number.parseInt(button.dataset.feCopyTimer, 10));
  }

  button.dataset.feCopyTimer = String(
    setTimeout(() => {
      button.classList.remove('is-copied');
      delete button.dataset.feCopyTimer;
    }, 1600)
  );
}

function setUpCopy() {
  // Delegated, so this is one listener rather than one per row.
  document.addEventListener('click', (ev) => {
    const button = ev.target.closest('[data-fe-copy]');
    if (!button) return;
    ev.preventDefault();
    copyChecksum(button);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setUpPrimary();
    setUpCopy();
  });
} else {
  setUpPrimary();
  setUpCopy();
}
