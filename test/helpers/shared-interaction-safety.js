/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const ROOT = path.join(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

test('shared client bundle preserves hover dropdown behavior', (t) => {
  const core = read('assets/js/core.js');
  const packageJson = read('package.json');

  t.true(core.includes("require('bootstrap-dropdown-hover')(window, $)"));
  t.true(core.includes('$.fn.bootstrapDropdownHover({'));
  t.true(packageJson.includes('"bootstrap-dropdown-hover": "4.2.0"'));
});

test('tooltips render at the document root and cannot intercept pointer events', (t) => {
  const core = read('assets/js/core.js');
  const styles = read('assets/css/_custom.scss');
  const domainTable = read('app/views/my-account/domains/_table.pug');

  t.regex(styles, /\.tooltip\s*{[^}]*pointer-events:\s*none;/s);
  t.regex(
    core,
    /\$\('\[data-toggle="tooltip"]'\)\.tooltip\({[^}]*container: 'body'/s
  );
  t.true(domainTable.includes('stretched-link'));
  t.true(domainTable.includes('td.align-middle.p-3.position-relative'));
});
