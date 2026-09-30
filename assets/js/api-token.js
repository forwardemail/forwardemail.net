/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Show and Copy for the masked API token (app/views/_api-token.pug).
//
// The token is not in the page. It is fetched when Show or Copy is used and
// kept only in this closure; Hide puts the mask back (see AUTO_HIDE_MS). Every change is also
// announced as an `api-token:change` event on document, with the token in
// `detail.token` while it is shown and an empty string once it is hidden, so
// the Email API reference can fill it into its examples only while visible.
//

const MASK = '••••••••••••••••••••••••';

// A shown token is masked again (and taken out of the examples) after this
// long, when the tab goes to the background, and when the page is left
const AUTO_HIDE_MS = 5 * 60 * 1000;

function initApiToken(container, { onError, onCopied }) {
  const input = container.querySelector('[data-api-token-input]');
  const toggle = container.querySelector('[data-api-token-toggle]');
  const toggleLabel = container.querySelector('[data-api-token-toggle-label]');
  const copy = container.querySelector('[data-api-token-copy]');
  const url = container.dataset.apiTokenUrl;
  // the input and Copy are optional: the Email API page has only a toggle
  // that fills the token into the reference's Authentication card
  if (!toggle || !url) return;

  let token = '';
  let shown = false;
  let loading = null;
  let hideTimer = null;

  async function request() {
    const response = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
      // required by the server: only this site's script may ask
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || typeof body.api_token !== 'string' || !body.api_token)
      throw new Error(body.message || response.statusText || 'Unknown error');
    token = body.api_token;
    return token;
  }

  // One request at a time: Show and Copy (or a double click) share it
  function load() {
    if (token) return Promise.resolve(token);
    if (!loading)
      loading = request().finally(() => {
        loading = null;
      });
    return loading;
  }

  function render() {
    clearTimeout(hideTimer);
    if (shown) hideTimer = setTimeout(hide, AUTO_HIDE_MS);
    if (input) input.value = shown ? token : MASK;
    toggle.setAttribute('aria-pressed', shown ? 'true' : 'false');
    if (toggleLabel)
      toggleLabel.textContent = shown
        ? container.dataset.hideLabel || 'Hide'
        : container.dataset.showLabel || 'Show';
    document.dispatchEvent(
      new CustomEvent('api-token:change', {
        detail: { token: shown ? token : '' }
      })
    );
  }

  function hide() {
    if (!shown) return;
    shown = false;
    render();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') hide();
  });

  // leaving the page (including into the back/forward cache) also forgets
  // the fetched token, so it is asked for again when needed
  window.addEventListener('pagehide', () => {
    hide();
    token = '';
  });

  toggle.addEventListener('click', async () => {
    if (toggle.disabled) return;
    toggle.disabled = true;
    try {
      if (!shown) await load();
      shown = !shown;
      render();
    } catch (err) {
      onError(err);
    } finally {
      toggle.disabled = false;
    }
  });

  if (copy)
    copy.addEventListener('click', async () => {
      let pending = null;
      try {
        if (token) {
          await navigator.clipboard.writeText(token);
        } else if (typeof ClipboardItem === 'function') {
          // Safari only allows the write during the click itself, so hand it
          // the pending token rather than waiting for the request first
          pending = load();
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': pending.then(
                (value) => new Blob([value], { type: 'text/plain' })
              )
            })
          ]);
        } else {
          await navigator.clipboard.writeText(await load());
        }

        onCopied(copy);
      } catch (err) {
        // the write fails with a generic error when the request did, so report
        // the request's own error (its message is the server's)
        onError(
          pending
            ? await pending.then(
                () => err,
                (err_) => err_
              )
            : err
        );
      }
    });
}

/**
 * @param {object} handlers
 * @param {function(Error): void} handlers.onError
 * @param {function(HTMLElement): void} handlers.onCopied
 */
function initApiTokens(handlers) {
  for (const container of document.querySelectorAll('[data-api-token]')) {
    initApiToken(container, handlers);
  }
}

module.exports = { initApiTokens, MASK };
