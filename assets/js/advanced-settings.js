/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const CodeMirror = require('codemirror');

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
