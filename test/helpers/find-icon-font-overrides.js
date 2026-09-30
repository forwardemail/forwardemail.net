/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');
const sass = require('sass');

const findIconFontOverrides = require('#helpers/find-icon-font-overrides');

test('reports rules that would replace the icon font on an icon', (t) => {
  t.deepEqual(
    findIconFontOverrides(`
      .reset i { font: inherit; }
      .card span { font-family: serif; }
      .markdown-body * { font-family: sans-serif; }
      a:hover > i { font: 12px/1 serif; }
      .reset i::before { font-family: serif; }
    `),
    [
      '.reset i',
      '.card span',
      '.markdown-body *',
      'a:hover > i',
      // the glyph is drawn in ::before
      '.reset i::before'
    ]
  );
});

test('ignores rules that cannot reach the icon font', (t) => {
  t.deepEqual(
    findIconFontOverrides(`
      .reset i:not(.fa):not(.fas):not(.far):not(.fab) { font: inherit; }
      :where(.scalar-app) * { font-family: inherit; }
      i { font-style: italic; }
      .reset em, .reset p { font: inherit; }
      .reset i { margin: 0; font-size: 100%; }
      .fa, .fas { font-family: "Font Awesome 5 Free"; }
      .fa.fa-github { font-family: "Font Awesome 5 Brands"; }
    `),
    []
  );
});

test('the site stylesheet leaves icons alone', (t) => {
  // the Scalar reset was the offender: `.scalar-app-reset i { font: inherit }`
  const scss = fs.readFileSync(
    path.join(__dirname, '..', '..', 'assets', 'css', '_scalar-app.scss'),
    'utf8'
  );
  const { css } = sass.compileString(scss);
  t.deepEqual(findIconFontOverrides(css), []);
});
