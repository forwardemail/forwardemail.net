/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Related FAQ answers under the help form, as the message is typed.
//
// Most support questions are already answered on /faq, but the form only
// says "have you read our FAQ?" and leaves the finding to the visitor. This
// asks /faq/suggest.json for the best matches on each pause in typing and
// lists them beneath the message box, so the answer can be read before the
// message is sent. Everything here is additive: without it the form is the
// same form and submits the same way.

const CONTAINER = '[data-help-suggest]';
// Long enough that a couple of characters do not fetch, short enough that a
// single meaningful word does.
const MIN_LENGTH = 4;
const WAIT = 300;

/**
 * Wire one suggestion box to the message textarea in its form.
 *
 * @param {HTMLElement} box - the [data-help-suggest] element
 */
function setUpBox(box) {
  // Wired once: setUp can run both from DOMContentLoaded and directly, and a
  // second set of listeners would fetch and render everything twice.
  if (box.dataset.helpSuggestReady) return;
  box.dataset.helpSuggestReady = 'true';

  const form = box.closest('form');
  const input = form && form.querySelector('textarea[name="message"]');
  const endpoint = box.dataset.helpSuggest;
  if (!input || !endpoint) return;

  // Fetches are answered out of order under a slow connection, so a response
  // is only rendered if it is for the most recent request.
  let sequence = 0;
  let controller = null;
  let timer = null;

  function clear() {
    sequence++;
    if (controller) controller.abort();
    controller = null;
    box.hidden = true;
    while (box.firstChild) box.firstChild.remove();
  }

  function render(suggestions) {
    while (box.firstChild) box.firstChild.remove();
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      box.hidden = true;
      return;
    }

    const label = document.createElement('p');
    label.className = 'small font-weight-bold mb-2';
    label.textContent = box.dataset.helpSuggestLabel || '';
    box.append(label);

    const list = document.createElement('div');
    list.className = 'list-group list-group-flush mb-3';

    // Built with textContent throughout: the strings are our own FAQ
    // headings, but nothing from the network is ever parsed as HTML here.
    for (const item of suggestions) {
      if (!item || typeof item.url !== 'string') continue;
      const link = document.createElement('a');
      link.className = 'list-group-item list-group-item-action py-2';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const question = document.createElement('span');
      question.textContent = String(item.question || '');
      link.append(question);

      if (item.topic) {
        const topic = document.createElement('small');
        topic.className = 'text-muted d-block';
        topic.textContent = String(item.topic);
        link.append(topic);
      }

      list.append(link);
    }

    box.append(list);
    box.hidden = list.childElementCount === 0;
  }

  function lookUp() {
    const query = input.value.trim();
    if (query.length < MIN_LENGTH) {
      clear();
      return;
    }

    const current = ++sequence;
    if (controller) controller.abort();
    controller =
      typeof AbortController === 'undefined' ? null : new AbortController();

    const url = `${endpoint}${
      endpoint.includes('?') ? '&' : '?'
    }q=${encodeURIComponent(query)}`;
    fetch(url, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      signal: controller ? controller.signal : undefined
    })
      .then((res) => (res.ok ? res.json() : { suggestions: [] }))
      .then((body) => {
        if (current !== sequence) return;
        render(body && body.suggestions);
      })
      .catch((err) => {
        // An aborted request is the expected outcome of typing on; anything
        // else just means no suggestions this time.
        if (current !== sequence) return;
        if (window.console && window.console.debug) window.console.debug(err);
        box.hidden = true;
      });
  }

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(lookUp, WAIT);
  });

  // The ajax form resets itself after a successful send, and a stale list
  // under an empty box would read as a reply.
  form.addEventListener('reset', () => {
    window.clearTimeout(timer);
    clear();
  });
}

function setUp() {
  if (typeof fetch !== 'function') return;
  for (const box of document.querySelectorAll(CONTAINER)) setUpBox(box);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setUp);
} else {
  setUp();
}
