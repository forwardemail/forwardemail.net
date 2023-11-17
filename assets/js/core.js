/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Clipboard = require('clipboard');
const Lazyload = require('lazyload');
const Popper = require('popper.js');
const Swal = require('sweetalert2');
const URLParse = require('url-parse');
const debounce = require('lodash/debounce');
const lazyframe = require('lazyframe');
const Typed = require('typed.js');
const { randomstring } = require('@sidoshi/random-string');

// load jQuery and Bootstrap
// <https://stackoverflow.com/a/34340392>
// <https://github.com/FezVrasta/popper.js/issues/287#issuecomment-321887784>
window.$ = $;
window.jQuery = $;

// required for bootstrap (we could use the bundle but this is cleaner)
window.Popper = Popper;

// bind Typed to window namespace for specific pages
window.Typed = Typed;

require('bootstrap');

require('bootstrap-dropdown-hover')(window, $);

// <https://stackoverflow.com/a/52855084>
if (!window.matchMedia('(any-pointer: coarse)').matches) {
  // if any input is a touch then don't use dropdown hover
  $.fn.bootstrapDropdownHover({
    clickBehavior: 'default',
    hideTimeout: 350
  });
}

const $body = $('body');

const {
  ajaxForm,
  changeHashOnScroll,
  clipboard,
  confirmPrompt,
  customFileInput,
  flash,
  handleFormOnPopstate,
  handleHashChange,
  handleHashOnLoad,
  modalAnchor,
  resizeNavbarPadding,
  returnTo,
  jumpTo
} = require('@ladjs/assets');

// Resize navbar padding on load, window resize, and navbar collapse/show
resizeNavbarPadding($);

// highlight.js
// const hljs = require('highlight.js');
// hljs.initHighlightingOnLoad();

// Allow ?return_to=/some/path
returnTo();

// flash and toast messaging with sweetalert2
flash();

// Handle hashes when page loads
// <http://stackoverflow.com/a/29853395>
handleHashOnLoad();
$(window).on('resize.resizeNavbarPadding', () => {
  resizeNavbarPadding($);
});
$('.navbar-collapse').on('hidden.bs.collapse shown.bs.collapse', () => {
  resizeNavbarPadding($);
});

// Add calc to min-vh-100
const $navbarFixedTop = $('.navbar.fixed-top');
if ($navbarFixedTop.length > 0) {
  $('.min-vh-100').attr(
    'style',
    `min-height: calc(100vh - ${$navbarFixedTop.outerHeight()}px) !important;`
  );
} else {
  $('.min-vh-100').attr('style', 'min-height: 100vh !important;');
}

// Some pages have a navbar fixed to bottom (e.g. Step 1, Step 2)
const $navbarFixedBottom = $('.fixed-bottom');
if ($navbarFixedBottom.length === 1)
  $('body').css('padding-bottom', $navbarFixedBottom.outerHeight());

//
// Handle explicit Cloudflare Turnstile (Advanced Example with Bootstrap/Modals/Responsive Support)
// <https://github.com/forwardemail/forwardemail.net>
// <https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#explicitly-render-the-turnstile-widget>
//
function handleExplicitTurnstile() {
  let widgetId = $(this).data('widgetId');
  if (widgetId) return;

  const isModal = $(this).parents('.modal:first').length > 0;

  widgetId = window.turnstile.render(this, {
    sitekey: window.TURNSTILE_SITE_KEY,
    tabindex: isModal ? -1 : 0,
    action: isModal ? 'modal' : 'page',
    language:
      typeof window.LOCALE === 'string' &&
      [
        'ar',
        'de',
        'en',
        'es',
        'fa',
        'fr',
        'id',
        'it',
        'ja',
        'ko',
        'nl',
        'pl',
        'pt',
        'ru',
        'tr',
        'zh'
      ].includes(window.LOCALE)
        ? window.LOCALE
        : 'auto',
    'error-callback': (err) => console.error(err)
  });

  if (widgetId) {
    $(this).data('widgetId', widgetId);
    return;
  }

  console.error(new Error('[Cloudflare Turnstile] widgetId missing'));
  Swal.fire(window._types.error, window.TURNSTILE_RENDER_ERROR, 'error');
}

// an alternative approach for performance is to use IntersectionObserver API
window.onloadTurnstileCallback = function () {
  $('.cf-explicit-turnstile')
    .filter(function () {
      // render if not inside modal or if inside modal that's shown
      // (e.g. in case you render a modal on the page when it loads; which is an anti-pattern)
      const $modal = $(this).parents('.modal:first');
      if ($modal.length === 0) return true;
      return $modal.is(':visible');
    })
    .each(handleExplicitTurnstile);
  $body.on('show.bs.modal', '.modal', function () {
    $(this).find('.cf-explicit-turnstile').each(handleExplicitTurnstile);
  });
};

// Re-render dates with user's local time
function renderDayjs() {
  $('.dayjs').each(function () {
    const data = $(this).data();
    if (!data.time) {
      console.error(new Error('Dayjs missing time'));
      return;
    }

    // eslint-disable-next-line prefer-object-spread
    const options = Object.assign(
      { dateStyle: 'short', timeStyle: 'short' },
      data
    );

    if (data.dateStyle === false) delete options.dateStyle;

    if (data.timeStyle === false) delete options.timeStyle;

    $(this).text(
      new Intl.DateTimeFormat(window.LOCALE, options).format(
        new Date(data.time)
      )
    );
  });
}

renderDayjs();

// Handle modals on anchor tags with data-target specified (preserve href)
$('a[data-toggle="modal-anchor"]').on('click.modalAnchor', modalAnchor);

// Adjust the hash of the page as you scroll down
// (e.g. if you scroll past a section "Section A" to "Section B"
// then the URL bar will update to #section-b
$(window).on('scroll.changeHashOnScroll', debounce(changeHashOnScroll, 250));

// Handle hash change when user clicks on links
$body.on('click.handleHashChange', "a[href^='#']", handleHashChange);

// Automatically show tooltips and popovers
$('[data-toggle="tooltip"]').tooltip();
$('[data-toggle="popover"]').popover();

// Handle custom file inputs
//
// Example usage:
//
// <label class="d-block">
//   <input required="required" data-toggle="custom-file" data-target="#company-logo" type="file" name="company_logo" accept="image/*" class="custom-file-input">
//   <span id="company-logo" class="custom-file-control custom-file-name" data-btn="{{ t('Select File') }}" data-content="{{ t('Upload company logo...') }}"></span>
// </label>
$body.on(
  'change.customFileInput',
  'input[type="file"][data-toggle="custom-file"]',
  customFileInput
);

// Handle clipboard copy event
clipboard();

// Bind confirm prompt event for clicks and form submissions
$body.on(
  'submit.confirmPrompt',
  'form.confirm-prompt, form[data-toggle="confirm-prompt"]',
  confirmPrompt
);
$body.on(
  'click.confirmPrompt',
  'button.confirm-prompt, input.confirm-prompt',
  confirmPrompt
);

// Bind ajax form submission and handle Stripe tokens in forms
$body.on('submit.ajaxForm', 'form.ajax-form', ajaxForm);
// Bind ajax link submission
$body.on('click', 'a.ajax-form', ajaxForm);

window.addEventListener('tableAjaxFormReloaded', renderDayjs);

// handle popstate
$(window).on('popstate', handleFormOnPopstate);

// all <code> blocks should have a toggle tooltip and clipboard
function errorHandler(ev) {
  ev.clearSelection();
  $(ev.trigger)
    .tooltip('dispose')
    .tooltip({
      title: 'Please manually copy to clipboard',
      html: true,
      placement: 'bottom'
    })
    .tooltip('show');
  $(ev.trigger).on('hidden.bs.tooltip', () => $(ev.trigger).tooltip('dispose'));
}

function successHandler(ev) {
  ev.clearSelection();
  let $container = $(ev.trigger).parents('pre:first');
  if ($container.length === 0) $container = $(ev.trigger);
  $container
    .tooltip('dispose')
    .tooltip({
      title: 'Copied!',
      placement: 'bottom'
    })
    .tooltip('show');
  $container.on('hidden.bs.tooltip', () => {
    $container.tooltip('dispose');
  });
}

if (Clipboard.isSupported()) {
  // <https://github.com/zenorocha/clipboard.js/issues/860>
  // <https://github.com/zenorocha/clipboard.js/wiki/Known-Issues>
  // <https://github.com/twbs/bootstrap/issues/19850>
  $.fn.modal.Constructor.prototype._enforceFocus = function () {};
  $body.on('mouseenter', 'code', function () {
    let $container = $(this).parents('pre:first');
    if ($container.length === 0) $container = $(this);
    $container
      .css('cursor', 'pointer')
      .tooltip({
        title: 'Click to copy',
        placement: 'bottom',
        trigger: 'manual'
      })
      .tooltip('show');
  });
  $body.on('mouseleave', 'code', function () {
    let $container = $(this).parents('pre:first');
    if ($container.length === 0) $container = $(this);
    $container.tooltip('dispose').css('cursor', 'initial');
  });
  const clipboard = new Clipboard('code', {
    text(trigger) {
      return trigger.textContent;
    },
    target(trigger) {
      return trigger.tagName === 'CODE' ? trigger : trigger.closest('code');
    }
  });
  clipboard.on('success', successHandler);
  clipboard.on('error', errorHandler);
}

//
// generate random alias
//
// <https://en.wikipedia.org/wiki/Email_address#Local-part>
//
$body.on('click', '.generate-random-alias', function () {
  const target = $(this).data('target');
  if (!target) return;
  const $target = $(target);
  if ($target.lengh === 0) return;
  const string = randomstring({
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 10
  });
  $target.val(string);
});

function keyup() {
  const $that = $(this);
  if ($that.val().length >= 6) {
    const $form = $that.parents('form').first();
    const $btn = $form.find('button[type="submit"]');
    if ($form.length > 0 && $btn.length > 0 && !$btn.is(':disabled'))
      $form.submit();
  }
}

$body.on('keyup', '.verification-form', debounce(keyup, 200));

//
// any modals with embedded <iframe> we can assume need reset
// <https://stackoverflow.com/a/52315492>
//
$body.on('hide.bs.modal', '.modal', function () {
  const $modal = $(this);
  if ($modal.find('iframe').length === 0) return;
  const html = $modal.html();
  $modal.html(html);
});

//
// lazyload iframes
// <https://github.com/vb/lazyframe>
//
lazyframe('.lazyframe', { autoplay: false, initinview: true });

//
// lazyload
// <https://github.com/tuupola/lazyload>
//
// eslint-disable-next-line no-new
new Lazyload();

//
// strip protocol from input[name="domain"][type="text"]
// inspired by `getHostname` from `spamscanner`
// <https://github.com/spamscanner/spamscanner>
//
let wwwCounter = 0;
function domainKeyup() {
  const $input = $(this);

  // trim and convert to lowercase
  let val = $(this).val().trim().toLowerCase();

  // remove anything before the @ symbol in case the user entered an email
  const atSymbolIndex = val.indexOf('@');
  if (atSymbolIndex !== -1) val = val.slice(atSymbolIndex + 1);

  // parse hostname (e.g. from https:// or http:// pasted URL)
  const url = new URLParse(val, {});
  if (url.hostname) {
    val = url.hostname;
    // strip www up to 3x
    if (wwwCounter < 3 && val.startsWith('www.')) {
      val = val.replace('www.', '');
      wwwCounter++;
    }

    $input.val(val);
    return;
  }

  // strip protocol
  if (val.startsWith('http:') || val.startsWith('https:'))
    val = val
      .replace('http://', '')
      .replace('http:/', '')
      .replace('https://', '')
      .replace('https:/', '');

  // strip www up to 3x
  if (wwwCounter < 3 && val.startsWith('www.')) {
    val = val.replace('www.', '');
    wwwCounter++;
  }

  // remove everything after the slash (if there was one)
  const index = val.indexOf('/');
  if (index === -1) {
    $input.val(val);
    return;
  }

  if (index === 0) {
    $input.val(val.slice(1));
    return;
  }

  $input.val(val.slice(0, Math.max(0, index)));
}

$body.on(
  'keydown keydown blur change paste',
  'input[name="domain"][type="text"]',
  debounce(domainKeyup, 300)
);

const $btnPrint = $('#btn-print');
if ($btnPrint.length > 0)
  $body.on('keyup keydown', function (ev) {
    if (ev.keyCode === 80 && (ev.ctrlKey || ev.metaKey)) {
      $btnPrint.get(0).click();
      return false;
    }

    return true;
  });

const $nav = $('.navbar.fixed-top');
const el = document.querySelector('#freddy');

function navbarScroll() {
  if (
    $(window).scrollTop() >= $nav.outerHeight() ||
    $('.navbar-collapse').hasClass('show')
  ) {
    $nav
      .addClass('bg-white navbar-themed bg-themed border-bottom')
      .removeClass('text-white');
    $nav
      .find('.navbar-toggler')
      .addClass('text-dark')
      .removeClass('text-white');
  } else {
    $nav
      .addClass('text-white')
      .removeClass('bg-white navbar-themed bg-themed border-bottom');
    $nav
      .find('.navbar-toggler')
      .addClass('text-white')
      .removeClass('text-dark');
  }
}

if (el && $nav.length > 0) {
  navbarScroll();
  $(window).scroll(debounce(navbarScroll, 125));
  $('#navbar-header')
    .on('shown.bs.collapse', navbarScroll)
    .on('hidden.bs.collapse', navbarScroll);
}

//
// mermaid support + theme change support
//
if (window.mermaid) {
  initializeMermaid();
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', initializeMermaid);
} else {
  $('div.mermaid').addClass('d-none');
}

function initializeMermaid() {
  const theme =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'neutral';

  // <https://github.com/mermaid-js/mermaid/issues/1945>
  window.mermaid.initialize({
    mermaid: {
      startOnLoad: true
    },
    theme,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true
    },
    secure: [
      'secure',
      'securityLevel',
      'startOnLoad',
      'maxTextSize',
      'htmlLabels'
    ],
    securityLevel: 'strict'
  });
}

//
// if user attempts to use CTRL+F or CMD+F then expand all collapsed sections
// so that full text search will work on pages like the FAQ
//
let collapsed = false;
$(window).keydown((ev) => {
  if ((ev.key === 'f' || ev.which === 70) && (ev.metaKey || ev.ctrlKey)) {
    const { hash } = window.location;
    $('.collapse').collapse('show');
    if (collapsed) {
      setTimeout(() => {
        jumpTo(hash);
      }, 1);
    }

    collapsed = true;
  }
});
