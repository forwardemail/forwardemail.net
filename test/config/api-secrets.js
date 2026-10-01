/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const process = require('node:process');

const test = require('ava');

const root = path.join(__dirname, '..', '..');

function loadEnv(apiSecrets, nodeEnv = 'production') {
  return spawnSync(process.execPath, ['-e', "require('./config/env')"], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      API_SECRETS: apiSecrets,
      NODE_ENV: nodeEnv
    }
  });
}

const strong = 'a'.repeat(32);
const strong2 = 'b'.repeat(40);

test('production configuration rejects missing and predictable API secrets', (t) => {
  for (const apiSecrets of [
    '',
    ',',
    'secret,',
    'short-secret',
    // a weak secret stays valid next to a strong one, so it is rejected too
    `${strong},secret`,
    `secret,${strong}`,
    `${strong},${strong2},${'c'.repeat(31)}`
  ]) {
    const result = loadEnv(apiSecrets);

    t.not(result.status, 0, `${apiSecrets}`);
    t.regex(
      result.stderr,
      /API_SECRETS must contain only 32-byte \(or longer\) secrets in production/,
      `${apiSecrets}`
    );
  }
});

test('production configuration accepts only sufficiently long API secrets', (t) => {
  for (const apiSecrets of [
    strong,
    `${strong},${strong2}`,
    // empty entries (e.g. a trailing comma) are ignored
    `${strong},`
  ]) {
    const result = loadEnv(apiSecrets);

    t.is(result.status, 0, `${apiSecrets}\n${result.stderr}`);
  }
});

test('non-production configuration keeps accepting the development default', (t) => {
  for (const apiSecrets of ['secret,', `${strong},secret`]) {
    const result = loadEnv(apiSecrets, 'test');

    t.is(result.status, 0, `${apiSecrets}\n${result.stderr}`);
  }
});
