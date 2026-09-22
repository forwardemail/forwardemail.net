/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const test = require('ava');

const ROOT = path.join(__dirname, '..', '..');
const FRENCH_CASE_STUDY = path.join(
  ROOT,
  'app',
  'views',
  'docs',
  'alumni-email-forwarding-university-case-study',
  'index-fr.md'
);

test('French Gantt dependencies retain Mermaid DSL keywords', (t) => {
  const source = fs.readFileSync(FRENCH_CASE_STUDY, 'utf8');
  const block = source.match(/```mermaid\n([\s\S]*?)\n```/)[1];
  const dependencies = block.match(/:\w\d, after(?: \w\d)+/g) || [];

  t.is(dependencies.length, 10);
  t.false(block.includes('après '));
});
