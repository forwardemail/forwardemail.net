/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const root = path.join(__dirname, '..', '..');
const expected = "servers: new Set(['1.1.1.3', '1.0.0.3'])";

test('uses Cloudflare Family DNS consistently for post-create and batch checks', (t) => {
  for (const file of [
    path.join(root, 'app', 'models', 'domains.js'),
    path.join(root, 'jobs', 'check-domains-cloudflare-family.js')
  ]) {
    t.true(
      fs.readFileSync(file, 'utf8').includes(expected),
      `expected documented Cloudflare Family DNS resolvers in ${file}`
    );
  }
});
