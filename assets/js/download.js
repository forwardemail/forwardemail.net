/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Three small enhancements for /download. All are additive: with this file
// blocked the hero button is still an anchor down to the full matrix, the
// platform override under it is a row of anchors down to the platform cards,
// and the copy controls are inert (each sits beside the value it copies).

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
 * architecture, offer the other architecture one click away, and let the
 * visitor override the platform from the row of chips under the button.
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

  const label = document.querySelector('#fe-download-primary-label');
  const meta = document.querySelector('#fe-download-primary-meta');
  const alt = document.querySelector('#fe-download-primary-alt');
  const samples = document.querySelectorAll('.fe-download-verify__sample');
  const switches = document.querySelectorAll('[data-fe-download-platform]');

  const detected = detectPlatform();
  // Arch detection reads this machine, so it only means anything for the
  // platform this machine runs. A visitor picking another platform gets
  // that platform's first build and the switch link to its other arch.
  const arch = detected ? await detectArch() : null;

  /**
   * Re-point the hero at one platform's build.
   *
   * @param {string} platform - a key from helpers/get-app-downloads.js
   * @returns {boolean} whether the platform had a build to point at
   */
  function choose(platform) {
    const entry = map[platform];
    // A platform with no build in this release leaves the server-rendered
    // anchor to the matrix exactly as it is.
    if (!entry || !Array.isArray(entry.options) || entry.options.length === 0)
      return false;

    const archKey =
      platform === detected && arch && ARCH_KEYS[platform]
        ? ARCH_KEYS[platform][arch]
        : null;
    const chosen =
      (archKey && entry.options.find((option) => option.arch === archKey)) ||
      entry.options[0];
    if (!chosen || !chosen.url) return false;

    button.href = chosen.url;
    button.rel = 'noopener';

    if (label && entry.label) label.textContent = entry.label;

    if (meta) {
      meta.textContent = chosen.meta || '';
      meta.hidden = !chosen.meta;
    }

    // The escape hatch for a wrong or unknowable guess: link the platform's
    // other architecture right under the button. Mobile builds are
    // universal, so the line hides again when switching to one.
    const other = entry.options.find(
      (option) =>
        option !== chosen && option.url && option.switchLabel && option.arch
    );
    if (alt) {
      if (other) {
        alt.href = other.url;
        alt.rel = 'noopener';
        alt.textContent = other.switchLabel;
      }

      if (alt.parentElement) alt.parentElement.hidden = !other;
    }

    // Keep the verification examples honest: name the file this visitor is
    // actually offered rather than the release's first file.
    if (chosen.fileName) {
      for (const sample of samples) sample.textContent = chosen.fileName;
    }

    for (const item of switches) {
      const active = item.dataset.feDownloadPlatform === platform;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    }

    return true;
  }

  // The override row. A click re-points the button in place; the anchor's
  // own jump to the platform card is only kept when the platform turns out
  // to have nothing to offer, which cannot happen with a server-built row
  // but costs nothing to leave correct.
  for (const item of switches) {
    item.addEventListener('click', (ev) => {
      if (choose(item.dataset.feDownloadPlatform)) ev.preventDefault();
    });
  }

  if (detected) choose(detected);
}

/**
 * Put a string on the clipboard.
 *
 * navigator.clipboard only exists in a secure context, so on a plain http
 * dev host (or any page a proxy downgrades) it is undefined and the button
 * would silently do nothing. The execCommand path still works there: a
 * hidden textarea holding the value, selected and copied. It is deprecated
 * but nothing has removed it, and it is the same route clipboard.js takes in
 * core.js for the code blocks.
 *
 * @param {string} value
 * @returns {Promise<boolean>} whether the value made it to the clipboard
 */
async function writeClipboard(value) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (err) {
      // fall through to execCommand; a denied permission lands here too
      if (window.console && window.console.debug) window.console.debug(err);
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  // Off screen rather than display:none, which would make it unselectable.
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  document.body.append(textarea);
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (err) {
    if (window.console && window.console.debug) window.console.debug(err);
  }

  textarea.remove();
  return copied;
}

/**
 * Copy a value: an asset's checksum, the updater key, an install command.
 *
 * The tick means "this is the one in your clipboard", so any other row still
 * showing it is cleared first. Without that, clicking three rows inside the
 * revert window leaves three ticks up while the clipboard holds only the last.
 *
 * @param {HTMLElement} button
 */
async function copyChecksum(button) {
  const value = button.dataset.feCopy;
  if (!value) return;

  const copied = await writeClipboard(value);
  // A denied clipboard is not worth surfacing. Every value with a copy
  // control is also shown in full beside it, so it can still be selected.
  if (!copied) return;

  for (const other of document.querySelectorAll(
    '.fe-download-copy.is-copied'
  )) {
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
