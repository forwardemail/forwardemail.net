/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Apex = require('apexcharts');
const Clipboard = require('clipboard');
const Lazyload = require('lazyload');
const Popper = require('popper.js');
const Swal = require('sweetalert2/dist/sweetalert2.js');
const URLParse = require('url-parse');
const base64url = require('base64url');
const lazyframe = require('lazyframe');
const superagent = require('superagent');
const { generateSlug } = require('random-word-slugs');
const { spinner: Spinner } = require('@ladjs/assets');

// <https://gist.github.com/miguelmota/5b06ae5698877322d0ca?permalink_comment_id=3611597#gistcomment-3611597>
// <https://stackoverflow.com/a/31394257>
function toArrayBuffer(buffer) {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}

function getRandomHexColor() {
  // Generate a random integer between 0 and 16777215 (which is 0xFFFFFF in decimal).
  // This represents all possible 24-bit RGB colors.
  const randomNum = Math.floor(Math.random() * 16777215);

  // Convert the integer to a hexadecimal string.
  // toString(16) converts a number to a hexadecimal string.
  let hexColor = randomNum.toString(16);

  // Pad the hexadecimal string with leading zeros if necessary
  // to ensure it is always 6 characters long.
  while (hexColor.length < 6) {
    hexColor = '0' + hexColor;
  }

  // Prepend '#' to form a valid CSS hex color code.
  return '#' + hexColor;
}

// load jQuery and Bootstrap
// <https://stackoverflow.com/a/34340392>
// <https://github.com/FezVrasta/popper.js/issues/287#issuecomment-321887784>
window.$ = $;
window.jQuery = $;

// required for bootstrap (we could use the bundle but this is cleaner)
window.Popper = Popper;

require('bootstrap');

require('bootstrap-dropdown-hover')(window, $);

const {
  ajaxForm,
  // changeHashOnScroll,
  clipboard,
  confirmPrompt,
  customFileInput,
  flash,
  handleFormOnPopstate,
  handleHashChange,
  handleHashOnLoad,
  modalAnchor,
  // resizeNavbarPadding,
  returnTo,
  jumpTo
} = require('@ladjs/assets');

const debounce = require('./debounce');
const logger = require('./logger');
const sendRequest = require('./send-request');

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

// Allow ?return_to=/some/path
returnTo();

// Handle hashes when page loads
// <http://stackoverflow.com/a/29853395>
handleHashOnLoad();

// Handle hash change when user clicks on links
$('body').on('click.handleHashChange', "a[href^='#']", handleHashChange);

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
  $('body').on('show.bs.modal', '.modal', function () {
    $(this).find('.cf-explicit-turnstile').each(handleExplicitTurnstile);
  });
};

window.addEventListener(
  'load',
  () => {
    // <https://stackoverflow.com/a/52855084>
    if (!window.matchMedia('(any-pointer: coarse)').matches) {
      // if any input is a touch then don't use dropdown hover
      $.fn.bootstrapDropdownHover({
        clickBehavior: 'default',
        hideTimeout: 350
      });
    }

    const spinner = new Spinner($);

    const $body = $('body');

    // Resize navbar padding on load, window resize, and navbar collapse/show
    // $(window).on('load', () => {
    //  resizeNavbarPadding($);
    // });

    // highlight.js
    // const hljs = require('highlight.js');
    // hljs.initHighlightingOnLoad();

    // flash and toast messaging with sweetalert2
    flash();

    // $(window).on('resize.resizeNavbarPadding', () => {
    //   resizeNavbarPadding($);
    // });
    // $('.navbar-collapse').on('hidden.bs.collapse shown.bs.collapse', () => {
    //   resizeNavbarPadding($);
    // });

    // Add calc to min-vh-100
    const $navbarFixedTop = $('.navbar.fixed-top');
    if ($navbarFixedTop.length > 0) {
      $('.min-vh-100').css(
        'min-height',
        `calc(100vh - ${$navbarFixedTop.outerHeight()}px) !important;`
      );
    } else {
      $('.min-vh-100').css('min-height: 100vh !important;');
    }

    // Some pages have a navbar fixed to bottom (e.g. Step 1, Step 2)
    const $navbarFixedBottom = $('.fixed-bottom');
    if ($navbarFixedBottom.length === 1)
      $('body').css('padding-bottom', $navbarFixedBottom.outerHeight());

    // <https://stackoverflow.com/questions/10636667/bootstrap-modal-appearing-under-background/15780841#comment62524384_15780841>
    $body.on('show.bs.modal', function (ev) {
      let { target } = ev;
      if (!target && ev.relatedTarget)
        target = $(ev.relatedTarget).data('target');
      if (!target) return;
      // if the target is not in `<main>` or `<body>` then move it
      const $el = $(target);
      if ($el.length === 0) return;
      if ($el.parent().is('body') || $el.parent().is('main')) return;
      $el.appendTo('body');
    });

    // Re-render dates with user's local time
    // TODO: use <time> https://github.com/github/relative-time-element
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

    //
    // NOTE: we completely disabled this since it's kind of buggy and may be
    //       unwanted by the user for their URL to be changing
    //
    // Adjust the hash of the page as you scroll down
    // (e.g. if you scroll past a section "Section A" to "Section B"
    // then the URL bar will update to #section-b
    // if (!navigator || !navigator.userAgentData || !navigator.userAgentData.mobile)
    //   $(window).on('scroll.changeHashOnScroll', debounce(changeHashOnScroll, 1000));

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
      'a.confirm-prompt, button.confirm-prompt, input.confirm-prompt',
      confirmPrompt
    );

    // Bind ajax form submission and handle Stripe tokens in forms
    $body.on('submit.ajaxForm', 'form.ajax-form', ajaxForm);
    // Bind ajax link submission
    $body.on('click', 'a.ajax-form', ajaxForm);

    window.addEventListener('tableAjaxFormReloaded', renderDayjs);
    window.addEventListener('tableAjaxFormReloaded', function () {
      // remove any elements that have `remove-on-table-ajax-form-reloaded`
      $('.remove-on-table-ajax-form-reloaded').remove();
      // scroll to top of first ajax table form found
      // <https://github.com/forwardemail/forwardemail.net/issues/479>
      const $form = $('form.table-ajax-form:first');
      if ($form.length > 0 && $form.data('table') && $($form.data('table')))
        jumpTo($form.data('table'));
    });

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
      $(ev.trigger).on('hidden.bs.tooltip', () =>
        $(ev.trigger).tooltip('dispose')
      );
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
          .css('cursor', 'copy')
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
        $container.tooltip('dispose').css('cursor', 'copy');
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
      //
      // NOTE: previously we generated a random string
      //       however these strings were not memorable
      //
      // const string = randomstring({
      //   characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
      //   length: 10
      // });
      const string = generateSlug(2, {
        format: 'kebab',
        categories: {
          noun: [
            'animals',
            'business',
            'education',
            'food',
            'health',
            'media',
            'place',
            'profession',
            'science',
            'sports',
            'technology',
            'thing',
            'time',
            'transportation'
          ]
        }
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

    $body.on('shown.bs.modal', '#modal-search', function () {
      $(this).find('input[type="search"]:visible').focus();
    });

    // Handle copy invite link modal - update input with the invite-specific link
    $body.on('show.bs.modal', '#modal-copy-invite', function (ev) {
      const $button = $(ev.relatedTarget);
      const inviteLink = $button.data('invite-link');
      if (inviteLink) {
        $(this).find('#invite-link').val(inviteLink);
      }
    });

    //
    // any modals with embedded <iframe> we can assume need reset
    // (this also supports lazyframe lazy loaded videos)
    // <https://stackoverflow.com/a/52315492>
    //
    $body.on('shown.bs.modal', '.modal', function () {
      const $modal = $(this);
      const $lazyframe = $modal.find('.lazyframe:first');
      if ($lazyframe.length === 0) return;
      lazyframe('.lazyframe', { autoplay: true, initinview: false });
      $lazyframe.click();
    });
    $body.on('hide.bs.modal', '.modal', function () {
      const $modal = $(this);
      const $lazyframe = $modal.find('.lazyframe:first');
      if ($lazyframe.length === 0) return;
      $lazyframe.empty().removeClass('lazyframe--loaded');
      // need to completely replace element since addEventListener binded
      // (otherwise it will play multiple times)
      $lazyframe
        .get(0)
        .parentNode.replaceChild($lazyframe.clone().get(0), $lazyframe.get(0));
    });

    //
    // lazyload iframes
    // <https://github.com/vb/lazyframe>
    //
    lazyframe('.lazyframe', { autoplay: true, initinview: false });

    //
    // TODO: replace this with loading lazy attribute
    // <https://web.dev/articles/efficiently-load-third-party-javascript>
    // <https://web.dev/articles/browser-level-image-lazy-loading>
    // <https://caniuse.com/loading-lazy-attr>
    //
    // lazyload
    // <https://github.com/tuupola/lazyload>
    //
    // eslint-disable-next-line no-new
    new Lazyload();
    // in case of bootstrap-table renderings
    setTimeout(() => {
      // eslint-disable-next-line no-new
      new Lazyload();
    }, 1000);

    //
    // strip protocol from input[name="domain"][type="text"]
    // inspired by `getHostname` from `spamscanner`
    // <https://github.com/spamscanner/spamscanner>
    //
    let wwwCounter = 0;
    function domainKeyup() {
      const $input = $(this);

      // trim and convert to lowercase
      let val = $input.val().trim().toLowerCase();

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
    const $toggler = $nav.find('.navbar-toggler');
    const isTextWhiteRequired = $nav.hasClass('text-white-required');
    const togglerIsDark = $toggler.hasClass('text-themed');
    const navbarIsDark = $nav.hasClass('navbar-dark');

    function navbarScroll() {
      if (
        $(window).scrollTop() >= $nav.outerHeight() ||
        $('.navbar-collapse').hasClass('show')
      ) {
        $nav
          .addClass('bg-white navbar-themed bg-themed border-bottom')
          .removeClass(isTextWhiteRequired ? 'text-white' : '');
        $toggler
          .addClass(togglerIsDark ? '' : 'text-dark')
          .removeClass(isTextWhiteRequired ? 'text-white' : '');
      } else {
        $nav
          .addClass(isTextWhiteRequired ? 'text-white' : '')
          .removeClass('bg-white navbar-themed bg-themed border-bottom');
        $toggler
          .addClass(isTextWhiteRequired ? 'text-white' : '')
          .removeClass(togglerIsDark ? '' : 'text-dark');
      }
    }

    if ($nav.length > 0 && !navbarIsDark) {
      navbarScroll();
      $(window).scroll(debounce(navbarScroll, 125));
      $('#navbar-header')
        .on('shown.bs.collapse', navbarScroll)
        .on('hidden.bs.collapse', navbarScroll);
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

    //
    // if the user is logged in then update their timezone
    // (this is used for default calendar timezone creation)
    // (and way more accurate, fast, and license permissive than relying on maxmind/geoip/ip2location)
    //
    if (window.USER && window.USER.id && window.USER.email) {
      try {
        // <https://stackoverflow.com/a/34602679>
        const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();
        if (timeZone)
          superagent
            .post(`/${window.LOCALE}/my-account/timezone`)
            .set({
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            })
            .timeout(1000 * 30)
            .retry(3)
            .send({ timeZone })
            .then()
            .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }
    }

    //
    // webauthn support
    //
    if (window.PublicKeyCredential) {
      $('#webauthn-container').removeClass('d-none');

      $body.on(
        'click.webauthnRegister',
        '.btn-webauthn-register',
        async (ev) => {
          ev.preventDefault();

          try {
            if (!window.USER || !window.USER.id || !window.USER.email)
              throw new Error(
                'You are not logged in, please refresh and try again'
              );

            spinner.show();

            const response = await sendRequest({}, '/auth/webauthn/challenge');

            // Check if any errors occurred
            if (response.err) throw response.err;

            // Prepare a message if the body is not accurate
            if (
              typeof response.body !== 'object' ||
              response.body === null ||
              typeof response.body.challenge !== 'string'
            )
              throw new Error(
                response.statusText ||
                  response.text ||
                  'Invalid response, please try again'
              );

            // https://chromium.googlesource.com/chromium/src/+/master/content/browser/webauth/uv_preferred.md
            // https://chromium.googlesource.com/chromium/src/+/main/content/browser/webauth/pub_key_cred_params.md
            const credential = await navigator.credentials.create({
              publicKey: {
                rp: {
                  name: 'Forward Email'
                },
                user: {
                  id: toArrayBuffer(base64url.toBuffer(window.USER.id)),
                  // <https://blog.millerti.me/2023/02/14/controlling-the-name-displayed-during-webauthn-registration-and-authentication/>
                  name: window.USER.email,
                  displayName: window.USER.email
                },
                // https://chromium.googlesource.com/chromium/src/+/master/content/browser/webauth/client_data_json.md
                challenge: toArrayBuffer(
                  base64url.toBuffer(response.body.challenge)
                ),
                pubKeyCredParams: [
                  {
                    type: 'public-key',
                    alg: -7 // ES256
                  },
                  {
                    type: 'public-key',
                    alg: -257 // RS256
                  }
                ],
                // attestation: 'none',
                authenticatorSelection: {
                  // authenticatorAttachment: 'platform', // "platform" | "cross-platform"
                  residentKey: 'preferred',
                  requireResidentKey: false,
                  userVerification: 'preferred' // "required" | "preferred" (default) | "discouraged"
                },
                extensions: {
                  credProps: true,
                  minPinLength: true
                }
              }
            });

            const body = {
              response: {
                clientDataJSON: base64url.encode(
                  credential.response.clientDataJSON
                ),
                attestationObject: base64url.encode(
                  credential.response.attestationObject
                )
              }
            };

            if (credential.response.getTransports)
              body.response.transports = credential.response.getTransports();

            const webauthnResponse = await sendRequest(
              body,
              `/${window.LOCALE}/my-account/passkeys`
            );

            // Check if any errors occurred
            if (webauthnResponse.err) throw webauthnResponse.err;

            if (
              typeof webauthnResponse.body !== 'object' ||
              webauthnResponse.body === null ||
              typeof webauthnResponse.body.redirectTo !== 'string'
            ) {
              console.error('invalid response', webauthnResponse);
              throw new Error(
                response.statusText ||
                  response.text ||
                  'Invalid response, please try again'
              );
            }

            window.location.href = webauthnResponse.body.redirectTo;
          } catch (err) {
            console.error(err);
            logger.fatal(err);
            spinner.hide();
            Swal.fire(window._types.error, err.message, 'error');
          }
        }
      );

      $body.on('click.webauthnLogin', '.btn-webauthn-login', async (ev) => {
        ev.preventDefault();

        try {
          spinner.show();

          const response = await sendRequest({}, '/auth/webauthn/challenge');

          // Prepare a message if the body is not accurate
          if (
            typeof response.body !== 'object' ||
            response.body === null ||
            typeof response.body.challenge !== 'string'
          )
            throw new Error(
              response.statusText ||
                response.text ||
                'Invalid response, please try again'
            );

          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: toArrayBuffer(
                base64url.toBuffer(response.body.challenge)
              )
            }
          });

          const body = {
            id: credential.id,
            response: {
              clientDataJSON: base64url.encode(
                credential.response.clientDataJSON
              ),
              authenticatorData: base64url.encode(
                credential.response.authenticatorData
              ),
              signature: base64url.encode(credential.response.signature),
              userHandle: credential.response.userHandle
                ? base64url.encode(credential.response.userHandle)
                : null
            }
          };

          if (credential.authenticatorAttachment)
            body.authenticatorAttachment = credential.authenticatorAttachment;

          // send post request to /auth/webauthn
          const webauthnResponse = await sendRequest(body, '/auth/webauthn/ok');

          if (
            typeof webauthnResponse.body !== 'object' ||
            webauthnResponse.body === null ||
            typeof webauthnResponse.body.redirectTo !== 'string'
          )
            throw new Error(
              webauthnResponse.statusText ||
                webauthnResponse.text ||
                'Invalid response, please try again'
            );

          window.location.href = webauthnResponse.body.redirectTo;
        } catch (err) {
          console.error(err);
          logger.fatal(err);
          spinner.hide();
          Swal.fire(window._types.error, err.message, 'error');
        }
      });
    }

    //
    // update TTI every minute
    //
    let ttiChart;

    // <https://stackoverflow.com/a/58787671>
    // function omit(obj, ...keys) {
    //   const keysToRemove = new Set(keys.flat()); // flatten the props, and convert to a Set
    //   return Object.fromEntries(
    //     // convert the entries back to object
    //     Object.entries(obj) // convert the object to entries
    //       .filter(([k]) => !keysToRemove.has(k)) // remove entries with keys that exist in the Set
    //   );
    // }

    function getProviderColor(providerName) {
      let color;

      switch (providerName) {
        case 'Forward Email': {
          color = '#00FF00'; // green so it sticks out vs. '#0066ff';
          break;
        }

        case 'Gmail': {
          color = '#EA4335';
          break;
        }

        case 'Apple iCloud': {
          color = '#4084F4';
          break;
        }

        case 'Fastmail': {
          color = '#333E48';
          break;
        }

        case 'Yahoo/AOL': {
          color = '#410093';
          break;
        }

        case 'Outlook/Hotmail': {
          color = '#0078d4';
          break;
        }

        default: {
          color = getRandomHexColor();
        }
      }

      return color;
    }

    function createTTIChartOptions(data) {
      // Create series for each provider (averaged direct + forwarding)
      const providerData = new Map();

      // Process data to create averaged series for each provider
      for (const item of data) {
        const timestamp = new Date(item.created_at).getTime();

        for (const provider of item.providers) {
          if (!providerData.has(provider.name)) {
            providerData.set(provider.name, []);
          }

          // Calculate average of direct and forwarding for this provider at this timestamp
          const directMs = provider.directMs || 0;
          const forwardingMs = provider.forwardingMs || 0;

          // Only add data point if we have at least one valid measurement
          if (directMs > 0 || forwardingMs > 0) {
            let averageMs;
            if (directMs > 0 && forwardingMs > 0) {
              // Both values available, take average
              averageMs = (directMs + forwardingMs) / 2;
            } else {
              // Only one value available, use that
              averageMs = directMs > 0 ? directMs : forwardingMs;
            }

            providerData
              .get(provider.name)
              .push([timestamp, Math.round(averageMs)]);
          }
        }
      }

      // Convert to Apex series format and assign colors
      const series = [];
      const colors = [];

      for (const [providerName, data] of providerData) {
        if (data.length > 0) {
          // Sort data by timestamp
          data.sort((a, b) => a[0] - b[0]);
          series.push({
            name: providerName,
            data
          });

          colors.push(getProviderColor(providerName));
        }
      }

      const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();

      return {
        series,
        chart: {
          type: 'line',
          height: 500,
          background: 'transparent',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            }
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2.5, // Slightly thicker since we have fewer lines
          opacity: 0.9
        },
        markers: {
          size: 0,
          hover: {
            size: 5
          }
        },
        colors, // Use our custom colors
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'h TT',
            datetimeUTC: false,
            timezone: timeZone,
            style: {
              fontSize: '11px'
            }
          },
          title: {
            text: 'Time (24 Hours)',
            style: {
              fontSize: '13px',
              fontWeight: 600
            }
          },
          // we want to make it readable so only show
          // 2 tick each hour = 48
          tickAmount: 48
        },
        yaxis: {
          title: {
            text: 'Average Delivery Time',
            style: {
              fontSize: '13px',
              fontWeight: 600
            }
          },
          labels: {
            formatter(value) {
              if (value === 0) return 'N/A';
              if (value >= 1000) return (value / 1000).toFixed(1) + 's';
              return Math.round(value) + 'ms';
            },
            style: {
              fontSize: '11px'
            }
          }
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy HH:mm'
          },
          y: {
            formatter(value) {
              if (value === 0) return 'N/A';
              if (value >= 1000) return (value / 1000).toFixed(2) + 's';
              return Math.round(value) + 'ms';
            }
          },
          style: {
            fontSize: '12px'
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          floating: false,
          offsetY: 10,
          itemMargin: {
            horizontal: 15,
            vertical: 6
          },
          fontSize: '12px',
          fontWeight: 500,
          markers: {
            width: 10,
            height: 10
          }
        },
        grid: {
          borderColor: '#e7e7e7',
          strokeDashArray: 2,
          opacity: 0.4,
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        theme: {
          mode:
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
        }
      };
    }

    function initializeTTIChart() {
      const $chartElement = $('#tti-timeline-chart');
      const $chartData = $('#chart-data');

      if ($chartElement.length > 0 && $chartData.length > 0) {
        try {
          const chartData = $chartData.data('json');
          if (chartData && chartData.length > 0) {
            const chartOptions = createTTIChartOptions(chartData);
            ttiChart = new Apex($chartElement.get(0), chartOptions);
            $chartElement.empty();
            ttiChart.render();
          }
        } catch (err) {
          logger.error('Error initializing TTI chart:', err);
        }
      }
    }

    async function tti() {
      const $tti = $('#tti');
      if ($tti.length === 0) return;
      try {
        const res = await superagent
          .get(`/${window.LOCALE}/tti`)
          .set({
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          })
          .timeout(1000 * 30)
          .retry(3)
          .send();

        // Update the TTI HTML content
        $tti.html($(res.text).html());
        renderDayjs();

        // Initialize chart after HTML update (in case the chart container was updated)
        initializeTTIChart();

        setTimeout(async function () {
          await tti();
        }, 60000);
      } catch (err) {
        logger.error(err);
      }
    }

    setTimeout(() => {
      tti();
    }, 500);

    // Initialize TTI chart on page load
    $(document).ready(function () {
      initializeTTIChart();
    });

    // Handle theme changes for TTI chart
    function changeTTIChartTheme() {
      if (ttiChart) {
        // set theme to light or dark
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          ttiChart.updateOptions({
            theme: { mode: 'dark' }
          });
        } else {
          ttiChart.updateOptions({
            theme: { mode: 'light' }
          });
        }
      }
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', changeTTIChartTheme);

    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', changeTTIChartTheme);

    // Avoid CSP issues with inline styling for widths on progress bars
    $('[data-width]').each(function () {
      $(this).css('width', $(this).attr('data-width'));
    });

    //
    // <https://github.com/Faisal-Manzer/postcss-viewport-height-correction>
    //

    const customViewportCorrectionVariable = 'vh';

    function setViewportProperty(doc) {
      let prevClientHeight;
      const customVar = '--' + (customViewportCorrectionVariable || 'vh');
      let sat = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--sat')
      );
      if (Number.isNaN(sat)) sat = 0;
      let sab = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--sab')
      );
      if (Number.isNaN(sab)) sab = 0;
      function handleResize() {
        const { clientHeight } = doc;
        if (clientHeight === prevClientHeight) return;
        if (window.requestAnimationFrame !== undefined)
          window.requestAnimationFrame(function () {
            doc.style.setProperty(
              customVar,
              (clientHeight - sat - sab) * 0.01 + 'px'
            );
            prevClientHeight = clientHeight - sat - sab;
          });
      }

      handleResize();
      return handleResize;
    }

    window.addEventListener(
      'resize',
      setViewportProperty(document.documentElement)
    );

    function handleBulkReply() {
      const checkboxes = $('#table-inquiries input[type="checkbox"]:checked');
      const ids = checkboxes
        .map(function () {
          return $(this).val();
        })
        .get();

      if (ids.length === 0) {
        Swal.fire(window._types.error, 'No inquiries selected.', 'error');
        return;
      }

      if (ids.length === 1) {
        const { origin, pathname } = window.location;
        const redirectUrl = `${origin}${pathname}/${ids[0]}`;
        window.location.href = redirectUrl;
        return;
      }

      $('#bulk-reply-modal').modal('show');
    }

    async function handleSubmitBulkReply() {
      const checkboxes = $('#table-inquiries input[type="checkbox"]:checked');
      const ids = checkboxes
        .map(function () {
          return $(this).val();
        })
        .get();

      const message = $('#textarea-bulk-reply-message').val();

      try {
        spinner.show();

        const url = `${window.location.pathname}/bulk`;
        const response = await sendRequest({ ids, message }, url);

        if (response.err) {
          throw response.err;
        }

        spinner.hide();

        location.reload(true);
      } catch (err) {
        console.error(err);
        spinner.hide();
        Swal.fire(window._types.error, err.message, 'error');
      }
    }

    $('#table-inquiries').on('click', '#bulk-reply-button', handleBulkReply);
    $('#table-inquiries').on(
      'click',
      '#submit-bulk-reply',
      handleSubmitBulkReply
    );
  },
  false
);
