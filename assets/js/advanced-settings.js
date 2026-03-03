/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Swal = require('sweetalert2/dist/sweetalert2.js');
const CodeMirror = require('codemirror');

const sendRequest = require('./send-request');

// editing addons
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/closetag');
require('codemirror/addon/edit/continuelist');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/trailingspace');

// code hinting addons
require('codemirror/addon/hint/anyword-hint');
require('codemirror/addon/hint/css-hint');
require('codemirror/addon/hint/html-hint');
require('codemirror/addon/hint/javascript-hint');
require('codemirror/addon/hint/show-hint');

// code linting addons
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/html-lint'); // requires htmlhint
require('codemirror/addon/lint/css-lint');
require('codemirror/addon/lint/javascript-lint');
require('codemirror/addon/lint/json-lint');

// code selection active line
require('codemirror/addon/selection/active-line');

// code modes
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');

const debounce = require('./debounce');

const $preview = $('#custom-verification-preview');
const $editor = $('#textarea-custom-verification-html');
const cm = CodeMirror.fromTextArea($editor.get(0), {
  theme: 'material',
  mode: 'htmlmixed',
  lineNumbers: true,
  lineWrapping: true,
  spellcheck: true,
  autocorrect: true,
  showTrailingSpace: true,
  styleActiveLine: true,
  continueComments: true,
  autoRefresh: true,
  readOnly: window.IS_CUSTOM_VERIFICATION_DISABLED === true,
  lint: true,
  gutters: ['CodeMirror-lint-markers']
});

function change() {
  const val = cm.getValue();
  $preview.contents().find('html').html(val);
}

change();

cm.on('change', debounce(change, 300));

// Custom S3 storage toggle and Test Connection
const $hasCustomS3 = $('#input-has-custom-s3');
const $customS3Fields = $('.custom-s3-fields');
const $btnTestS3 = $('#btn-test-s3');

if ($hasCustomS3.length > 0) {
  $hasCustomS3.on('change', function () {
    if ($(this).is(':checked')) {
      $customS3Fields.removeClass('d-none');
      $btnTestS3.removeClass('d-none');
    } else {
      $customS3Fields.addClass('d-none');
      $btnTestS3.addClass('d-none');
    }
  });
}

// Test S3 Connection button - sends current form field values
if ($btnTestS3.length > 0) {
  $btnTestS3.on('click', async function () {
    const $btn = $(this);
    const originalText = $btn.html();
    $btn
      .prop('disabled', true)
      .html('<i class="fa fa-spinner fa-spin"></i> Testing...');
    try {
      const url = window.location.pathname.replace(
        /\/advanced-settings$/,
        '/advanced-settings/test-s3-connection'
      );

      //
      // Send current form field values so users can test
      // before saving or after changing credentials.
      // The server will fall back to saved (encrypted) credentials
      // for any field left blank.
      //
      const body = {
        s3_endpoint: $('#s3-endpoint').val(),
        s3_access_key_id: $('#s3-access-key-id').val(),
        s3_secret_access_key: $('#s3-secret-access-key').val(),
        s3_region: $('#s3-region').val(),
        s3_bucket: $('#s3-bucket').val()
      };

      //
      // Client-side validation: ensure the endpoint URL includes
      // a protocol (https:// or http://) before sending to the server.
      // This matches the server-side isURL validation and prevents
      // a confusing UX where the test succeeds but save fails.
      //
      if (body.s3_endpoint && !/^https?:\/\//i.test(body.s3_endpoint)) {
        throw new Error(
          'Endpoint URL must start with https:// (e.g. https://s3.us-east-1.amazonaws.com)'
        );
      }

      const response = await sendRequest(body, url);
      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text:
            (response.body && response.body.message) ||
            'Connection successful!',
          icon: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 5000,
          position: 'top'
        });
      } else {
        throw response.err || new Error('Connection test failed');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message || 'Connection test failed',
        icon: 'error'
      });
    } finally {
      $btn.prop('disabled', false).html(originalText);
    }
  });
}
