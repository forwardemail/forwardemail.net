/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const config = require('#config');

//
// The build (`gulp build`, run before the tests) gives every script and
// stylesheet a revisioned copy that pages load. The copy must be the same
// file under a new name. gulp-rev-all rewrote quoted names of other scripts
// in it, so the revisioned scalar.js called `tte["build.693f86c2"]` where
// Scalar defines `build`, and the API reference failed to render.
//
test('revisioned scripts and stylesheets are unchanged copies', (t) => {
  const manifest = JSON.parse(fs.readFileSync(config.manifest, 'utf8'));
  const assets = Object.entries(manifest).filter(([name]) =>
    /\.(css|js)$/.test(name)
  );

  t.true(
    assets.some(([name]) => name === 'js/scalar.js'),
    'the build has a revisioned js/scalar.js'
  );

  for (const [name, revisioned] of assets) {
    const original = fs.readFileSync(path.join(config.buildDir, name));
    const copy = fs.readFileSync(path.join(config.buildDir, revisioned));
    t.true(original.equals(copy), `${revisioned} differs from ${name}`);
  }
});
