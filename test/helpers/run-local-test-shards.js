/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const test = require('ava');
const {
  DEFAULT_TOTAL_SHARDS,
  getRunnerPaths,
  getTotalShards,
  runShards
} = require('../../scripts/run-local-test-shards');

test('uses the CI-compatible six-shard default', (t) => {
  t.is(DEFAULT_TOTAL_SHARDS, 6);
  t.is(getTotalShards(), 6);
});

test('resolves the installed AVA and NYC runner entrypoints', (t) => {
  const { ava, nyc } = getRunnerPaths();
  t.true(fs.existsSync(ava));
  t.true(fs.existsSync(nyc));
});

test('launches isolated commands using the CI shard environment', async (t) => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'forwardemail-local-shards-test-')
  );
  t.teardown(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const calls = [];
  const results = await runShards({
    cwd: process.cwd(),
    totalShards: 3,
    tempDir,
    async runCommand(command, args, options) {
      calls.push({ command, args, options });
      return { code: 0, signal: null };
    }
  });

  t.deepEqual(results, [
    { code: 0, signal: null },
    { code: 0, signal: null },
    { code: 0, signal: null }
  ]);
  t.is(calls.length, 3);

  for (const [index, call] of calls.entries()) {
    const shard = index + 1;
    t.is(call.command, process.execPath);
    t.is(call.options.env.AVA_SHARD, '1');
    t.is(call.options.env.CI_SHARD, String(shard));
    t.is(call.options.env.CI_TOTAL_SHARDS, '3');
    t.is(call.options.prefix, `[shard ${shard}/3]`);
    t.true(call.args.includes('--silent'));
    t.true(fs.existsSync(path.join(tempDir, `shard-${shard}`)));
  }
});

test('accepts a positive local shard override', (t) => {
  t.is(getTotalShards('3'), 3);
  t.is(getTotalShards('12'), 12);
});

test('rejects unsafe local shard overrides', (t) => {
  for (const value of ['0', '-1', '1.5', 'not-a-number']) {
    const error = t.throws(() => getTotalShards(value), {
      instanceOf: TypeError
    });
    t.is(
      error.message,
      'LOCAL_TEST_SHARDS must be a positive integer when it is set.'
    );
  }
});
