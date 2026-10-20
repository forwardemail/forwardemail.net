/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const test = require('ava');
const { JSDOM } = require('jsdom');
const jquery = require('jquery');

const {
  createAjaxFormWithTurnstile,
  isTurnstileRenderable,
  resetTurnstile
} = require('../../assets/js/turnstile');

// page with the site's jQuery and Bootstrap modal plugin loaded as globals
function createModalDom() {
  const dom = new JSDOM(
    `
    <form id="page-form" class="ajax-form">
      <div id="page-turnstile" class="cf-explicit-turnstile"></div>
    </form>
    <div class="modal fade" id="modal-generate-password" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content"><div class="modal-body">
        <form class="ajax-form confirm-prompt">
          <div id="modal-turnstile" class="cf-explicit-turnstile"></div>
        </form>
      </div></div></div>
    </div>
  `,
    { runScripts: 'outside-only' }
  );
  for (const file of [
    require.resolve('jquery/dist/jquery.js'),
    require.resolve('bootstrap/dist/js/bootstrap.bundle.js')
  ]) {
    dom.window.eval(fs.readFileSync(file, 'utf8'));
  }

  return { $: dom.window.jQuery, dom };
}

test('renders widgets outside modals', (t) => {
  const { $, dom } = createModalDom();
  t.true(isTurnstileRenderable($, $('#page-turnstile').get(0)));
  dom.window.close();
});

test('does not render widgets in closed modals', (t) => {
  const { $, dom } = createModalDom();
  t.false(isTurnstileRenderable($, $('#modal-turnstile').get(0)));
  dom.window.close();
});

test('renders the widget of a modal that is still opening', async (t) => {
  const { $, dom } = createModalDom();
  const $modal = $('#modal-generate-password');
  const shown = new Promise((resolve) => {
    $modal.one('shown.bs.modal', resolve);
  });

  // api.js can finish loading after `show.bs.modal` fired and before the
  // backdrop fade makes the modal visible
  $modal.modal('show');
  t.true($modal.data('bs.modal')._isTransitioning);
  t.true(isTurnstileRenderable($, $('#modal-turnstile').get(0)));

  await shown;
  $modal.modal('hide');
  t.false(isTurnstileRenderable($, $('#modal-turnstile').get(0)));
  dom.window.close();
});

function createDom() {
  const dom = new JSDOM(`
    <form id="login" class="ajax-form">
      <div id="login-turnstile" class="cf-explicit-turnstile"></div>
    </form>
    <form id="register" class="ajax-form">
      <div id="register-turnstile" class="cf-explicit-turnstile"></div>
    </form>
  `);
  const $ = jquery(dom.window);
  $('#login-turnstile').data('widgetId', 'login-widget');
  $('#register-turnstile').data('widgetId', 'register-widget');
  return { $, dom };
}

test('resets only the submitted form after an AJAX attempt completes', async (t) => {
  const { $, dom } = createDom();
  const resetWidgetIds = [];
  let resolveRequest;
  const request = new Promise((resolve) => {
    resolveRequest = resolve;
  });
  const ajaxForm = async () => request;
  const handler = createAjaxFormWithTurnstile($, ajaxForm, () => ({
    reset(widgetId) {
      resetWidgetIds.push(widgetId);
    }
  }));
  const form = $('#login').get(0);
  const resultPromise = handler.call(form, { currentTarget: form });

  t.deepEqual(resetWidgetIds, []);
  resolveRequest('handled response');
  t.is(await resultPromise, 'handled response');
  t.deepEqual(resetWidgetIds, ['login-widget']);
  dom.window.close();
});

test('resets a consumed widget when the AJAX handler throws', async (t) => {
  const { $, dom } = createDom();
  const error = new Error('Invalid password');
  const resetWidgetIds = [];
  const handler = createAjaxFormWithTurnstile(
    $,
    async () => {
      throw error;
    },
    () => ({
      reset(widgetId) {
        resetWidgetIds.push(widgetId);
      }
    })
  );
  const form = $('#login').get(0);

  const thrown = await t.throwsAsync(
    handler.call(form, { currentTarget: form })
  );
  t.is(thrown, error);
  t.deepEqual(resetWidgetIds, ['login-widget']);
  dom.window.close();
});

test('does not reset during the initial confirmation prompt', async (t) => {
  const { $, dom } = createDom();
  const $form = $('#login').addClass('confirm-prompt');
  const resetWidgetIds = [];
  let resolveRequest;
  const request = new Promise((resolve) => {
    resolveRequest = resolve;
  });
  const ajaxForm = async (ev) => {
    if (!$(ev.currentTarget).data('confirmed')) return false;
    return request;
  };

  const handler = createAjaxFormWithTurnstile($, ajaxForm, () => ({
    reset(widgetId) {
      resetWidgetIds.push(widgetId);
    }
  }));
  const form = $form.get(0);

  t.false(await handler.call(form, { currentTarget: form }));
  t.deepEqual(resetWidgetIds, []);

  $form.data('confirmed', true);
  const resultPromise = handler.call(form, { currentTarget: form });
  $form.data('confirmed', false);
  resolveRequest('submitted');
  t.is(await resultPromise, 'submitted');
  t.deepEqual(resetWidgetIds, ['login-widget']);
  dom.window.close();
});

test('resetTurnstile ignores unavailable and unrendered widgets', (t) => {
  const { $, dom } = createDom();
  const $form = $('#login');
  $form.find('.cf-explicit-turnstile').removeData('widgetId');

  t.notThrows(() => resetTurnstile($, $form));
  t.notThrows(() => resetTurnstile($, $form, {}));
  t.notThrows(() =>
    resetTurnstile($, $form, {
      reset() {
        t.fail('unrendered widget must not be reset');
      }
    })
  );
  dom.window.close();
});

test('resetTurnstile supports a zero-valued widget ID', (t) => {
  const { $, dom } = createDom();
  const $form = $('#login');
  $form.find('.cf-explicit-turnstile').data('widgetId', 0);
  const resetWidgetIds = [];

  resetTurnstile($, $form, {
    reset(widgetId) {
      resetWidgetIds.push(widgetId);
    }
  });

  t.deepEqual(resetWidgetIds, [0]);
  dom.window.close();
});
