const $ = require('jquery');
const Clipboard = require('clipboard');
const Lazyload = require('lazyload');
const Popper = require('popper.js');
const Swal = require('sweetalert2');
const URLParse = require('url-parse');
const debounce = require('lodash/debounce');
const lazyframe = require('lazyframe');
const { randomstring } = require('@sidoshi/random-string');

// load jQuery and Bootstrap
// <https://stackoverflow.com/a/34340392>
// <https://github.com/FezVrasta/popper.js/issues/287#issuecomment-321887784>
window.$ = $;
window.jQuery = $;

// required for bootstrap (we could use the bundle but this is cleaner)
window.Popper = Popper;

require('bootstrap');

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
  returnTo
} = require('@ladjs/assets');

// Resize navbar padding on load, window resize, and navbar collapse/show
resizeNavbarPadding($);

// import waypoints (see below example for how to use + `pnpm install waypoints`)
require('waypoints/lib/jquery.waypoints.js');

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
$(window).on('scroll.changeHashOnScroll', debounce(changeHashOnScroll, 100));

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

// Example for how to detect waypoint scrolling:
//
// Detect when we scroll to the #the-web-server selector
// so that we can hide the "Learn More" banner on bottom
/*
  if ($('#learn-more').length > 0 && $('#the-web-server').length > 0) {
    const waypoint = new window.Waypoint({
      element: $('#the-web-server').get(0),
      handler: direction => {
        if (direction === 'up') $('#learn-more').addClass('show');
        else if (direction === 'down') $('#learn-more').removeClass('show');
      },
      offset: '25%'
    });
    // When the page loads we need to make sure its checked
    waypoint.context.refresh();
  }
  */

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

// <https://stackoverflow.com/a/19424832>
let animation;
let pseudoAnimation;
let previousX;
let previousY;

const el = document.querySelector('#freddy');
const styleTag = document.createElement('style');
document.head.insertAdjacentElement('beforeend', styleTag);

async function freddy(e) {
  // return early if the element we're hovering over is a button or link
  if (
    e.target instanceof HTMLAnchorElement ||
    e.target instanceof HTMLButtonElement ||
    e.target instanceof HTMLFormElement ||
    e.target instanceof HTMLInputElement
  )
    return;

  // <https://developer.mozilla.org/en-US/docs/Web/API/Animation/commitStyles>
  if (animation) {
    animation.pause();
    animation.commitStyles();
    animation.cancel();
  }

  if (pseudoAnimation) {
    pseudoAnimation.pause();
    pseudoAnimation.commitStyles();
    pseudoAnimation.cancel();
  }

  const x = e.clientX / 10;
  const y = e.clientY / 10;

  const backgroundPosition = `${115 - Math.round(x / 5)}% ${
    115 - Math.round(y / 5)
  }%, ${50 - Math.round(x / 7)}% ${50 - Math.round(y / 7)}%, ${
    100 - Math.round(x / 6)
  }% ${100 - Math.round(y / 6)}%`;

  // if the difference between either x or y is more than 25% viewport
  // then slow the animation down a bit
  let duration = 1000;
  if (
    previousX &&
    previousY &&
    (Math.abs(e.clientX - previousX) >
      document.documentElement.clientHeight / 2 ||
      Math.abs(e.clientY - previousY) >
        document.documentElement.clientWidth / 2)
  )
    duration = 2000;

  // <https://stackoverflow.com/a/29016808>
  // <https://css-tricks.com/pseudo-elements-in-the-web-animations-api/>
  // <https://stackoverflow.com/a/50571368>
  // const { right, bottom } = getComputedStyle(el, ':after');
  const cssTemplateString = `#freddy::after {
    right: calc(15% + ${x / 5}%);
    bottom: calc(30% + ${y / 5}%);
  }`;
  // right: ${Math.round(Number.parseInt(right, 10) + e.clientX / 5)}px;
  // bottom: ${Math.round(Number.parseInt(bottom, 10) + e.clientY / 5)}px;
  styleTag.innerHTML = cssTemplateString;

  previousX = e.clientX;
  previousY = e.clientY;

  animation = el.animate(
    [
      { backgroundPosition: getComputedStyle(el).backgroundPosition },
      { backgroundPosition }
    ],
    { duration, easing: 'linear', fill: 'forwards' }
  );
}

if (el) {
  const $nav = $('.navbar.fixed-top');
  let direction;
  if ($nav.length > 0) {
    const waypoint = new window.Waypoint({
      element: $('main').get(0),
      handler(_direction) {
        direction = _direction;
        if (direction === 'up') {
          $nav
            .addClass('text-white')
            .removeClass('bg-white navbar-themed bg-themed border-bottom');
          $nav.find('.navbar-toggler').addClass('text-white');
        } else if (direction === 'down') {
          $nav
            .addClass('bg-white navbar-themed bg-themed border-bottom')
            .removeClass('text-white');
          $nav.find('.navbar-toggler').removeClass('text-white');
        }
      }
      // offset: $nav.outerHeight()
    });

    waypoint.context.refresh();

    $('#navbar-header')
      .on('shown.bs.collapse', function () {
        if (!direction || direction === 'up') {
          $nav
            .addClass('bg-white navbar-themed bg-themed border-bottom')
            .removeClass('text-white');
          $nav.find('.navbar-toggler').removeClass('text-white');
        }
      })
      .on('hidden.bs.collapse', function () {
        if (!direction || direction === 'up') {
          $nav
            .addClass('text-white')
            .removeClass('bg-white navbar-themed bg-themed border-bottom');
          $nav.find('.navbar-toggler').removeClass('text-white');
        }
      });
  }

  // <https://developer.chrome.com/en/docs/lighthouse/best-practices/uses-passive-event-listeners/>
  // <https://github.com/jquery/jquery/issues/2871#issuecomment-175175180>
  window.jQuery.event.special.mousemove = {
    setup(_, ns, handle) {
      if (ns.includes('noPreventDefault')) {
        this.addEventListener('mousemove', handle, { passive: true });
      } else {
        return false;
      }
    }
  };

  $(document).on('mousemove.noPreventDefault', debounce(freddy, 10));
}
