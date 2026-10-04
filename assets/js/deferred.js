/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Markup that ships in <template data-fe-deferred>: the navbar's dropdown
// menus, the sign in, sign up and search dialogs (_nav.pug) and the domain
// search dialog (_modal-domain-search.pug). The page as served holds a few
// hundred fewer elements, and the browser builds them once it is idle after
// load, off the path to first paint.
//
// Whatever comes first puts every template's content in place of the
// template:
// - the browser going idle after load (where it can, so crawlers that render
//   the page and in-browser agents get the links and the WebMCP forms)
// - the visitor pointing, touching, focusing, pressing a key or clicking (in
//   the capture phase, ahead of bootstrap's own handlers), since nobody can
//   open a menu or a dialog without one of those
// - core.js at load with a mouse, just before the dropdown hover plugin binds
//   each menu
//
// Afterwards a "fe:deferred" event on the document carries the elements
// added, for code that sets things up on page load (see core.js).
//

const EVENTS = [
  'pointerdown',
  'pointerover',
  'touchstart',
  'focusin',
  'keydown',
  'click'
];

let done = false;

function stamp() {
  if (done) return;
  done = true;
  for (const name of EVENTS)
    window.document.removeEventListener(name, stamp, true);

  const elements = [];
  for (const template of window.document.querySelectorAll(
    'template[data-fe-deferred]'
  )) {
    elements.push(...template.content.children);
    template.replaceWith(template.content);
  }

  window.document.dispatchEvent(
    new window.CustomEvent('fe:deferred', { detail: { elements } })
  );
}

if (window.document.querySelector('template[data-fe-deferred]')) {
  for (const name of EVENTS)
    window.document.addEventListener(name, stamp, {
      capture: true,
      passive: true
    });

  const whenIdle = () => {
    if (typeof window.requestIdleCallback === 'function')
      window.requestIdleCallback(stamp, { timeout: 2000 });
    else window.setTimeout(stamp, 1);
  };

  if (window.document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}

module.exports = stamp;
