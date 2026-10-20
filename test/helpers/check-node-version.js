/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { execFileSync, spawnSync } = require('node:child_process');
const path = require('node:path');
const process = require('node:process');

const test = require('ava');

const { getNodeVersionError } = require('../../scripts/check-node-version');

const script = path.join(
  __dirname,
  '..',
  '..',
  'scripts',
  'check-node-version.js'
);

test('any Node 18 release passes', (t) => {
  t.is(getNodeVersionError('18.20.8', '18.20.4'), null);
  t.is(getNodeVersionError('v18.0.0', '18.20.4'), null);
});

test('another Node major is refused with how to switch', (t) => {
  const message = getNodeVersionError('22.23.3', '18.20.4');
  t.regex(message, /needs Node 18/);
  t.regex(message, /this is Node 22\.23\.3/);
  t.regex(message, /n 18/);
});

test('the script passes on the Node the tests run on', (t) => {
  // the tests themselves run on the required Node, so this must exit 0
  t.notThrows(() => execFileSync(process.execPath, [script]));
});

test('the script fails on another Node major', (t) => {
  // run it with a Node of another major when this machine has one
  const bin = ['/usr/bin/node', '/usr/local/bin/node'].find((candidate) => {
    const r = spawnSync(candidate, ['-p', 'process.versions.node'], {
      encoding: 'utf8'
    });
    return r.status === 0 && !r.stdout.startsWith('18.');
  });
  if (!bin) return t.pass('no other Node major installed');
  const res = spawnSync(bin, [script], { encoding: 'utf8' });
  t.is(res.status, 1);
  t.regex(res.stderr, /needs Node 18/);
});
