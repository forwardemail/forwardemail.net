/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Behaviour for the hero console in app/views/_fe-console.pug. Everything here
// is additive: with this file blocked the rail is hidden and all six views are
// visible stacked (see the html.no-js rules in _fe-home.scss), and every deep
// link still lands on the right one because the views keep their ids. What
// this adds is showing one view at a time, the arrow-key tablist, and the
// auto-advance.
//
// Two things this must never do, because both were reported as bugs: scroll
// the page (the rail is scrolled, the document is not, so a view changing
// under the fold cannot yank the visitor back up to the hero) and write to the
// address bar (a tab names its view through `data-target`; the hash is only
// ever read, for deep links).

const CONSOLE = '[data-fe-console]';
const RAIL = '[data-fe-console-rail]';
const TAB = '[data-fe-console-tab]';
const VIEW = '[data-fe-console-view]';
const SCROLL = '[data-fe-console-scroll]';

const ACTIVE_TAB = 'fe-console__tab--active';
const ACTIVE_VIEW = 'fe-console__view--active';

// Spec: advance every 5s until the visitor interacts, then stay put.
const ADVANCE_MS = 5000;

/**
 * The id of the view a tab controls, from its `data-target="#view"`.
 *
 * @param {Element} tab
 * @returns {string}
 */
function viewId(tab) {
  const target = tab.dataset.target || '';
  return target.charAt(0) === '#' ? target.slice(1) : target;
}

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
  const scrollControls = [...root.querySelectorAll(SCROLL)];
  if (!rail || tabs.length === 0 || tabs.length !== views.length) return;

  rail.setAttribute('role', 'tablist');

  for (const tab of tabs) {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', viewId(tab));
  }

  for (const [i, view] of views.entries()) {
    view.setAttribute('role', 'tabpanel');
    view.setAttribute('aria-labelledby', tabs[i].id);
  }

  let timer = null;
  let stopped = false;

  function updateRailControls() {
    const overflow = rail.scrollWidth > rail.clientWidth + 1;
    root.classList.toggle('fe-console--rail-overflow', overflow);

    if (!overflow) {
      root.classList.remove('fe-console--rail-at-end');
      for (const control of scrollControls) control.disabled = true;
      return;
    }

    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    const railBox = rail.getBoundingClientRect();
    const firstBox = tabs[0].getBoundingClientRect();
    const lastBox = tabs[tabs.length - 1].getBoundingClientRect();
    const atStart = rtl
      ? firstBox.right <= railBox.right + 1
      : firstBox.left >= railBox.left - 1;
    const atEnd = rtl
      ? lastBox.left >= railBox.left - 1
      : lastBox.right <= railBox.right + 1;

    root.classList.toggle('fe-console--rail-at-end', atEnd);
    for (const control of scrollControls) {
      control.disabled =
        control.dataset.feConsoleScroll === 'previous' ? atStart : atEnd;
    }
  }

  /**
   * Bring a tab inside the visible part of the rail, by scrolling the rail and
   * nothing else. On phones the rail is a horizontal scroller; on wider
   * viewports it does not overflow and this is a no-op.
   *
   * scrollIntoView is not used on purpose: it scrolls every scrollable
   * ancestor, the document included, so the auto-advance used to drag the page
   * back to the hero every five seconds once the visitor had scrolled past it.
   *
   * @param {Element} tab
   */
  function revealTab(tab) {
    const railBox = rail.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();

    // Nearest edge, like scrollIntoView's inline: 'nearest'. A delta along
    // the x axis means the same thing under RTL: scrollBy moves the viewport,
    // whichever end the content starts from.
    let delta = 0;
    if (tabBox.left < railBox.left) delta = tabBox.left - railBox.left;
    else if (tabBox.right > railBox.right) delta = tabBox.right - railBox.right;
    if (delta === 0) return;

    // The rail's own scroll-behavior decides smooth or instant (it is auto
    // under prefers-reduced-motion, see _fe-home.scss), so 'auto' here defers
    // to the stylesheet rather than forcing a smooth scroll.
    if (typeof rail.scrollBy === 'function')
      rail.scrollBy({ left: delta, behavior: 'auto' });
    else rail.scrollLeft += delta;
  }

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
    const index = tabs.findIndex((tab) => viewId(tab) === id);
    if (index === -1) return false;

    for (const [i, tab] of tabs.entries()) {
      const on = i === index;
      tab.classList.toggle(ACTIVE_TAB, on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      // Roving tabindex: one stop for the whole rail, arrows move within it.
      tab.tabIndex = on ? 0 : -1;
      views[i].classList.toggle(ACTIVE_VIEW, on);
    }

    revealTab(tabs[index]);

    window.setTimeout(updateRailControls, 0);
    // The rail was just scrolled to the tab, so focus must not scroll the
    // page as well.
    if (focusTab) tabs[index].focus({ preventScroll: true });
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

  // Whether the console is on screen. A visitor who has scrolled past the
  // hero is reading something else: the views pause where they are (rather
  // than cycling unseen, or being pulled back into view) and resume when the
  // console scrolls back in. Without IntersectionObserver it is treated as
  // always on screen, which is only ever the pre-fix cycling, never a scroll.
  let onScreen = true;
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen = entry.isIntersecting;
    }).observe(root);
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

      if (document.hidden || !onScreen) return;

      const current = tabs.findIndex((tab) =>
        tab.classList.contains(ACTIVE_TAB)
      );
      show(viewId(tabs[(current + 1) % tabs.length]));
    }, ADVANCE_MS);
  }

  /**
   * Activate from a click on the rail. The tabs are buttons, so there is no
   * default to prevent, nothing for core.js's `a[href^="#"]` handler to scroll
   * the page for, and no hash to keep out of the address bar: choosing a view
   * leaves the URL exactly as it was.
   *
   * @param {Event} ev
   */
  function onClick(ev) {
    const tab = ev.target.closest(TAB);
    if (!tab) return;

    stop();
    show(viewId(tab));
  }

  /**
   * Arrow keys move between tabs and activate as they go, which is the expected
   * pattern for a tablist whose panels are already in the DOM. Home and End go
   * to the ends. Enter and Space are left to the browser: these are buttons, so
   * they already click, and the click handler picks them up.
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
    show(viewId(tabs[next]), true);
  }

  rail.addEventListener('click', onClick);
  rail.addEventListener('keydown', onKeydown);
  rail.addEventListener('scroll', updateRailControls, { passive: true });

  for (const control of scrollControls) {
    control.addEventListener('click', () => {
      const current = tabs.findIndex((tab) =>
        tab.classList.contains(ACTIVE_TAB)
      );
      const offset = control.dataset.feConsoleScroll === 'previous' ? -1 : 1;
      const next = current + offset;
      if (next < 0 || next >= tabs.length) return;
      stop();
      show(viewId(tabs[next]), true);
    });
  }

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(updateRailControls).observe(rail);
  }

  // A pointer resting on the console, or focus landing anywhere inside it,
  // counts as the first interaction.
  root.addEventListener('pointerenter', stop);
  root.addEventListener('focusin', stop);

  // The hash is read, never written: a link elsewhere on the page pointing at
  // #send, or someone editing the hash by hand. Landing on a specific view is
  // a deliberate choice, so it stops the rotation too.
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
    show(viewId(tabs[0]));
    start();
  }

  updateRailControls();
}

function init() {
  for (const root of document.querySelectorAll(CONSOLE)) setUpConsole(root);
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', init);
else init();
