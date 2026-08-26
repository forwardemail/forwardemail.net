/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Behaviour for the hero console in app/views/_fe-console.pug. Everything here
// is additive: with this file blocked the rail is five real in-page links, all
// five views are visible stacked (see the html.no-js rules in _fe-landing.scss),
// and every deep link still lands on the right one. What this adds is showing
// one view at a time, the arrow-key tablist, and the auto-advance.

const CONSOLE = '[data-fe-console]';
const RAIL = '[data-fe-console-rail]';
const TAB = '[data-fe-console-tab]';
const VIEW = '[data-fe-console-view]';

const ACTIVE_TAB = 'fe-console__tab--active';
const ACTIVE_VIEW = 'fe-console__view--active';

// Spec: advance every 5s until the visitor interacts, then stay put.
const ADVANCE_MS = 5000;

/**
 * Whether the visitor has asked for less motion. Checked at each tick rather
 * than once at start-up, because the setting can change while the page is open
 * and this is content swapping itself under someone who just asked it to stop.
 *
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Upgrade the rail from a list of links to a real tablist, and show one view.
 *
 * The roles are applied here rather than in the template on purpose: until this
 * file runs there is nothing to answer an arrow key, and a rail that announces
 * itself as tabs without responding to them is worse for a screen reader than
 * one that stays a plain set of links.
 *
 * @param {Element} root - the .fe-console element
 */
function setUpConsole(root) {
  const rail = root.querySelector(RAIL);
  const tabs = [...root.querySelectorAll(TAB)];
  const views = [...root.querySelectorAll(VIEW)];
  if (!rail || tabs.length === 0 || tabs.length !== views.length) return;

  rail.setAttribute('role', 'tablist');

  for (const tab of tabs) {
    const id = tab.dataset.feConsoleTab;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', id);
  }

  for (const view of views) view.setAttribute('role', 'tabpanel');

  let timer = null;
  let stopped = false;

  /**
   * Show one view by id. Inactive views keep their box (they are stacked in the
   * same grid cell) so the hero never changes height between tabs, and are
   * hidden with visibility rather than the hidden attribute, which is what takes
   * them out of the accessibility tree without collapsing that box.
   *
   * @param {string} id
   * @param {boolean} [focusTab] - move focus to the tab, for keyboard activation
   * @returns {boolean} whether the id matched a view
   */
  function show(id, focusTab) {
    const index = tabs.findIndex((tab) => tab.dataset.feConsoleTab === id);
    if (index === -1) return false;

    for (const [i, tab] of tabs.entries()) {
      const on = i === index;
      tab.classList.toggle(ACTIVE_TAB, on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      // Roving tabindex: one stop for the whole rail, arrows move within it.
      tab.tabIndex = on ? 0 : -1;
      views[i].classList.toggle(ACTIVE_VIEW, on);
    }

    if (focusTab) tabs[index].focus();
    return true;
  }

  /**
   * Stop auto-advancing, permanently. Called on the first real interaction of
   * any kind, including a hover that parks a pointer over the console: content
   * that rewrites itself under someone mid-sentence is the thing to avoid, and
   * reading is an interaction even when nothing is clicked.
   */
  function stop() {
    stopped = true;
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    if (stopped || timer !== null || prefersReducedMotion()) return;
    timer = setInterval(() => {
      // Reduced motion can be switched on after start-up, and a background tab
      // has nobody watching, so neither should keep swapping content.
      if (prefersReducedMotion()) {
        stop();
        return;
      }

      if (document.hidden) return;

      const current = tabs.findIndex((tab) =>
        tab.classList.contains(ACTIVE_TAB)
      );
      show(tabs[(current + 1) % tabs.length].dataset.feConsoleTab);
    }, ADVANCE_MS);
  }

  /**
   * Activate from a click on the rail, without moving the page.
   *
   * preventDefault alone is not enough here. core.js delegates a handler off
   * body for every `a[href^="#"]` on the site, and jQuery runs a delegated
   * handler whether or not the event was already defaulted-prevented, so
   * @ladjs/assets jumpTo() would still scroll the console to the top of the
   * viewport on every tab click. stopPropagation keeps the event inside the
   * rail so that handler never sees it. Note that `data-ignore-hash-change` is
   * not the opt-out for this: only changeHashOnScroll reads that attribute,
   * and core.js has it commented out.
   *
   * The URL is still updated, which is what keeps /#send shareable.
   * replaceState rather than pushState: back should leave the page, not walk
   * back through tabs one at a time.
   *
   * @param {Event} ev
   */
  function onClick(ev) {
    const tab = ev.target.closest(TAB);
    if (!tab) return;

    ev.preventDefault();
    ev.stopPropagation();
    stop();

    const id = tab.dataset.feConsoleTab;
    if (!show(id)) return;

    if (window.history && typeof window.history.replaceState === 'function')
      window.history.replaceState(null, '', `#${id}`);
    else window.location.hash = id;
  }

  /**
   * Arrow keys move between tabs and activate as they go, which is the expected
   * pattern for a tablist whose panels are already in the DOM. Home and End go
   * to the ends. Enter and Space are left to the browser: these are anchors, so
   * they already activate, and the click handler picks them up.
   *
   * @param {KeyboardEvent} ev
   */
  function onKeydown(ev) {
    const tab = ev.target.closest(TAB);
    if (!tab) return;

    const current = tabs.indexOf(tab);
    let next = -1;

    // The rail follows reading order, so Left means previous under LTR and next
    // under RTL. layout.pug sets dir on the html element for ar and he.
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';

    switch (ev.key) {
      case 'ArrowRight': {
        next = current + (rtl ? -1 : 1);
        break;
      }

      case 'ArrowLeft': {
        next = current + (rtl ? 1 : -1);
        break;
      }

      case 'ArrowDown': {
        next = current + 1;
        break;
      }

      case 'ArrowUp': {
        next = current - 1;
        break;
      }

      case 'Home': {
        next = 0;
        break;
      }

      case 'End': {
        next = tabs.length - 1;
        break;
      }

      default: {
        return;
      }
    }

    ev.preventDefault();
    stop();

    next = (next + tabs.length) % tabs.length;
    show(tabs[next].dataset.feConsoleTab, true);
  }

  rail.addEventListener('click', onClick);
  rail.addEventListener('keydown', onKeydown);

  // A pointer resting on the console, or focus landing anywhere inside it,
  // counts as the first interaction.
  root.addEventListener('pointerenter', stop);
  root.addEventListener('focusin', stop);

  // A link elsewhere on the page pointing at #send, or someone editing the
  // hash by hand. Landing on a specific view is a deliberate choice, so it
  // stops the rotation too.
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    if (show(id)) stop();
  });

  // A deep link decides the opening view, and means the visitor asked for that
  // one rather than a tour. Anything else opens on the first view, which the
  // template already marked active, and starts rotating.
  const deepLink = window.location.hash.slice(1);
  if (deepLink && show(deepLink)) stop();
  else {
    show(tabs[0].dataset.feConsoleTab);
    start();
  }
}

function init() {
  for (const root of document.querySelectorAll(CONSOLE)) setUpConsole(root);
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', init);
else init();
