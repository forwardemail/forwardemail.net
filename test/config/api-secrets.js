/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const process = require('node:process');

const test = require('ava');

const root = path.join(__dirname, '..', '..');

function loadProductionEnv(apiSecrets) {
  return spawnSync(process.execPath, ['-e', "require('./config/env')"], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      API_SECRETS: apiSecrets,
      NODE_ENV: 'production'
    }
  });
}

test('production configuration rejects missing and predictable API secrets', (t) => {
  for (const apiSecrets of ['', 'secret,', 'short-secret']) {
    const result = loadProductionEnv(apiSecrets);

    t.not(result.status, 0);
    t.regex(
      result.stderr,
      /API_SECRETS must contain at least one 32-byte secret in production/
    );
  }
});

test('production configuration accepts a sufficiently long API secret', (t) => {
  const result = loadProductionEnv('a'.repeat(32));

  t.is(result.status, 0);
});
