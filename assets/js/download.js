/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Two small enhancements for /download. Both are additive: with this file
// blocked the hero button is still an anchor down to the full matrix, and the
// checksum controls simply do not appear, since they are only rendered when
// the release reported a digest and they do nothing until wired up here.

/**
 * Work out which platform to offer.
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
 * Work out which architecture to offer, best effort. Architecture is only
 * exposed where the browser chooses to tell us:
 *
 *   - Chromium answers navigator.userAgentData high-entropy hints, which is
 *     the majority of visitors and is authoritative.
 *   - Elsewhere the unmasked WebGL renderer separates "Apple M1/M2/..." from
 *     Intel/AMD/NVIDIA GPUs on the browsers that still report it.
 *   - Safari masks both (it reports Intel on Apple Silicon and "Apple GPU"
 *     on every Mac), so this returns null there.
 *
 * A null result falls back to the platform's first build, and the visible
 * switch link under the hero button covers every wrong or unknown guess.
 *
 * @returns {Promise<string|null>} 'arm', 'x86', or null when unknowable
 */
async function detectArch() {
  try {
    if (
      navigator.userAgentData &&
      typeof navigator.userAgentData.getHighEntropyValues === 'function'
    ) {
      const data = await navigator.userAgentData.getHighEntropyValues([
        'architecture'
      ]);
      if (data && data.architecture === 'arm') return 'arm';
      if (data && data.architecture === 'x86') return 'x86';
    }
  } catch (err) {
    // fall through to the WebGL heuristic
    if (window.console && window.console.debug) window.console.debug(err);
  }

  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = String(
        ext
          ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER)
      );
      if (/apple m\d/i.test(renderer)) return 'arm';
      if (/intel|amd|radeon|nvidia|geforce/i.test(renderer)) return 'x86';
    }
  } catch (err) {
    // unknowable is fine; the switch link covers it
    if (window.console && window.console.debug) window.console.debug(err);
  }

  return null;
}

// The arch keys helpers/get-app-downloads.js uses, per platform, for each
// answer the detector can give.
const ARCH_KEYS = {
  macos: { arm: 'appleSilicon', x86: 'intel' },
  windows: { arm: 'arm64', x86: 'x64' },
  linux: { arm: 'arm64', x86: 'x64' }
};

/**
 * Point the hero button at the detected platform's build for the detected
 * architecture, and offer the other architecture one click away.
 */
async function setUpPrimary() {
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
  if (!entry || !Array.isArray(entry.options) || entry.options.length === 0)
    return;

  const arch = await detectArch();
  const archKey =
    arch && ARCH_KEYS[platform] ? ARCH_KEYS[platform][arch] : null;
  const chosen =
    (archKey && entry.options.find((option) => option.arch === archKey)) ||
    entry.options[0];
  if (!chosen || !chosen.url) return;

  button.href = chosen.url;
  button.rel = 'noopener';

  const label = document.querySelector('#fe-download-primary-label');
  if (label && entry.label) label.textContent = entry.label;

  const meta = document.querySelector('#fe-download-primary-meta');
  if (meta && chosen.meta) {
    meta.textContent = chosen.meta;
    meta.hidden = false;
  }

  // The escape hatch for a wrong or unknowable guess: link the platform's
  // other architecture right under the button.
  const other = entry.options.find(
    (option) =>
      option !== chosen && option.url && option.switchLabel && option.arch
  );
  const alt = document.querySelector('#fe-download-primary-alt');
  if (other && alt) {
    alt.href = other.url;
    alt.rel = 'noopener';
    alt.textContent = other.switchLabel;
    if (alt.parentElement) alt.parentElement.hidden = false;
  }

  // Keep the verification example honest: name the file this visitor is
  // actually offered rather than the release's first file.
  const sample = document.querySelector('#fe-download-verify-sample');
  if (sample && chosen.fileName) sample.textContent = chosen.fileName;
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
