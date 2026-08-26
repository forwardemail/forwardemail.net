/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Live filtering for the FAQ. Everything here is additive: with this file
// blocked the page is still a complete, readable list of every question, the
// topic rail still jumps, and each answer still opens, because they are real
// anchors and real details elements.

// Matching is done against a lowercased copy of the question the server put in
// data-fe-faq-search, so no string work happens per keystroke beyond the
// comparison itself.
const ITEM = '[data-fe-faq-search]';
const TOPIC = '[data-fe-faq-topic]';

/**
 * Narrow the list to questions matching every word typed, in any order, so
 * "gmail send" finds "How to Send Mail As using Gmail".
 *
 * @param {string} query
 * @returns {number} how many questions matched
 */
function applyFilter(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;

  for (const item of document.querySelectorAll(ITEM)) {
    const haystack = item.dataset.feFaqSearch || '';
    const match = words.every((w) => haystack.includes(w));
    item.hidden = !match;
    if (match) shown++;
  }

  // A topic heading with nothing under it is noise, so it goes too, along with
  // its entry in the rail. The rail count follows the filter as well: leaving
  // it at the topic's total would put "15" beside a topic showing two.
  for (const topic of document.querySelectorAll(TOPIC)) {
    const matched = topic.querySelectorAll(ITEM + ':not([hidden])').length;
    topic.hidden = matched === 0;
    const link = document.querySelector(
      `[data-fe-faq-nav="${topic.dataset.feFaqTopic}"]`
    );
    if (!link) continue;
    if (link.parentElement) link.parentElement.hidden = matched === 0;
    const badge = link.querySelector('.fe-faq-nav__count');
    if (badge) badge.textContent = String(matched);
  }

  return shown;
}

function setUp() {
  const input = document.querySelector('#fe-faq-q');
  if (!input) return;

  // Remember each topic's real total so clearing the filter can put it back.
  const totals = new Map();
  for (const link of document.querySelectorAll('[data-fe-faq-nav]')) {
    const badge = link.querySelector('.fe-faq-nav__count');
    if (badge) totals.set(link, badge.textContent);
  }

  const count = document.querySelector('#fe-faq-count');
  const empty = document.querySelector('#fe-faq-empty');
  const clear = document.querySelector('.fe-faq-search__clear');
  const total = document.querySelectorAll(ITEM).length;
  const countTemplate = count ? count.innerHTML.trim() : '';

  function run() {
    const query = input.value.trim();
    if (clear) clear.hidden = query.length === 0;

    if (!query) {
      for (const el of document.querySelectorAll(ITEM)) el.hidden = false;
      for (const el of document.querySelectorAll(TOPIC)) {
        el.hidden = false;
        const link = document.querySelector(
          `[data-fe-faq-nav="${el.dataset.feFaqTopic}"]`
        );
        if (!link) continue;
        if (link.parentElement) link.parentElement.hidden = false;
        const badge = link.querySelector('.fe-faq-nav__count');
        if (badge && totals.has(link)) badge.textContent = totals.get(link);
      }

      if (empty) empty.hidden = true;
      if (count) count.innerHTML = countTemplate;
      return;
    }

    const shown = applyFilter(query);
    if (empty) empty.hidden = shown > 0;
    // Counting is the whole feedback signal here, so it stays a plain
    // "n of total" rather than borrowing the unfiltered sentence.
    if (count) count.textContent = `${shown} / ${total}`;
  }

  input.addEventListener('input', run);

  if (clear) {
    clear.addEventListener('click', () => {
      input.value = '';
      run();
      input.focus();
    });
  }

  // Escape clears rather than leaving a filtered page behind.
  input.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape' || !input.value) return;
    ev.preventDefault();
    input.value = '';
    run();
  });

  // A link to a single answer should arrive with that answer open. details
  // elements do not do this on their own.
  function openFromHash() {
    if (!window.location.hash) return;
    let target;
    try {
      target = document.querySelector(window.location.hash);
    } catch (err) {
      // A hash that is not a valid selector is just a hash we do not handle.
      if (window.console && window.console.debug) window.console.debug(err);
      return;
    }

    if (!target || target.tagName !== 'DETAILS') return;
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  }

  window.addEventListener('hashchange', openFromHash);

  // Also on load, and this is the one that actually fires on a cold deep link.
  // core.js calls handleHashOnLoad() from @ladjs/assets, which removes the id
  // attribute from the hash target to suppress the browser's native jump and
  // only puts it back on window load. Deferred scripts run before that, so at
  // the point this file first executes the element cannot be found by its id
  // and the answer stayed shut. Registered after core.js's own load handler,
  // so the id is back by the time this runs.
  window.addEventListener('load', openFromHash);

  openFromHash();

  // Honour ?q= arriving from a submitted form or a shared link.
  if (input.value.trim()) run();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setUp);
} else {
  setUp();
}
