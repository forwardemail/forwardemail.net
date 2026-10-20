/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// A widget renders when it is outside a modal, or inside a modal that is
// open or opening. Bootstrap fires `show.bs.modal` while the backdrop fades
// in and only then makes the modal visible, so if api.js loads in that gap
// (e.g. from cache on the click that opened the modal) the opening modal
// must still get its widget, or the form posts without a token.
function isTurnstileRenderable($, el) {
  const $modal = $(el).parents('.modal:first');
  if ($modal.length === 0) return true;
  if ($modal.is(':visible')) return true;
  const modal = $modal.data('bs.modal');
  return Boolean(modal && modal._isShown);
}

function resetTurnstile($, $form, turnstile) {
  if (!turnstile || typeof turnstile.reset !== 'function') return;

  $form.find('.cf-explicit-turnstile').each(function () {
    const widgetId = $(this).data('widgetId');
    if (typeof widgetId === 'undefined') return;
    turnstile.reset(widgetId);
  });
}

function createAjaxFormWithTurnstile(
  $,
  ajaxForm,
  getTurnstile = () => window.turnstile
) {
  return async function (ev) {
    const $form = $(ev.currentTarget);
    const requiresConfirmation =
      $form.hasClass('confirm-prompt') ||
      $form.data('toggle') === 'confirm-prompt';
    const shouldResetTurnstile =
      !requiresConfirmation || Boolean($form.data('confirmed'));

    try {
      return await ajaxForm.call(this, ev);
    } finally {
      if (shouldResetTurnstile) resetTurnstile($, $form, getTurnstile());
    }
  };
}

module.exports = {
  createAjaxFormWithTurnstile,
  isTurnstileRenderable,
  resetTurnstile
};
