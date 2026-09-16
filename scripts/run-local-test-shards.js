/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { spawn } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const DEFAULT_TOTAL_SHARDS = 6;
const SIEVE_TEST_FILES = [
  'test/sieve/parser.js',
  'test/sieve/engine.js',
  'test/sieve/extensions.js',
  'test/sieve/store.js',
  'test/sieve/filter-handler.js',
  'test/sieve/security.js',
  'test/sieve/managesieve-server.js',
  'test/sieve/mx-integration.js',
  'test/sieve/runtime-enforcement.js'
];

function getTotalShards(value = process.env.LOCAL_TEST_SHARDS) {
  if (!value) return DEFAULT_TOTAL_SHARDS;

  if (!/^[1-9]\d*$/.test(value))
    throw new TypeError(
      'LOCAL_TEST_SHARDS must be a positive integer when it is set.'
    );

  const totalShards = Number(value);
  if (!Number.isSafeInteger(totalShards))
    throw new TypeError(
      'LOCAL_TEST_SHARDS must be a positive integer when it is set.'
    );

  return totalShards;
}

function writePrefixed(stream, output, prefix) {
  let remainder = '';

  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    const lines = `${remainder}${chunk}`.split('\n');
    remainder = lines.pop();

    for (const line of lines) output.write(`${prefix} ${line}\n`);
  });

  stream.on('end', () => {
    if (remainder) output.write(`${prefix} ${remainder}\n`);
  });
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    writePrefixed(child.stdout, process.stdout, options.prefix);
    writePrefixed(child.stderr, process.stderr, options.prefix);

    child.once('error', reject);
    child.once('exit', (code, signal) => {
      resolve({ code: code ?? 1, signal });
    });
  });
}

function getRunnerPaths() {
  return {
    nyc: require.resolve('nyc/bin/nyc.js'),
    ava: path.join(path.dirname(require.resolve('ava')), 'cli.mjs')
  };
}

async function runShards({ cwd, totalShards, tempDir, runCommand = run }) {
  const { nyc, ava } = getRunnerPaths();

  const results = await Promise.all(
    Array.from({ length: totalShards }, async (_, index) => {
      const shard = index + 1;
      const shardDir = path.join(tempDir, `shard-${shard}`);
      await fs.mkdir(shardDir, { recursive: true });

      return runCommand(
        process.execPath,
        [
          nyc,
          '--temp-dir',
          shardDir,
          '--report-dir',
          path.join(shardDir, 'coverage'),
          '--silent',
          ava
        ],
        {
          cwd,
          env: {
            ...process.env,
            AVA_SHARD: '1',
            CI_SHARD: String(shard),
            CI_TOTAL_SHARDS: String(totalShards)
          },
          prefix: `[shard ${shard}/${totalShards}]`
        }
      );
    })
  );

  return results;
}

async function runSieve(cwd) {
  return run(process.execPath, ['--test', ...SIEVE_TEST_FILES], {
    cwd,
    env: process.env,
    prefix: '[sieve]'
  });
}

async function main() {
  const totalShards = getTotalShards();
  const cwd = path.join(__dirname, '..');
  const tempDir = path.join(
    os.tmpdir(),
    `forwardemail-local-test-shards-${randomUUID()}`
  );

  await fs.mkdir(tempDir, { recursive: true });

  try {
    console.log(
      `Running ${totalShards} AVA shards in parallel using the CI shard assignment.`
    );

    const results = await runShards({ cwd, totalShards, tempDir });
    const sieve = await runSieve(cwd);
    const failed = [
      ...results.map((result, index) => ({
        name: `shard ${index + 1}/${totalShards}`,
        ...result
      })),
      { name: 'sieve', ...sieve }
    ].filter((result) => result.code !== 0 || result.signal);

    if (failed.length > 0) {
      for (const result of failed) {
        console.error(
          `${result.name} failed${
            result.signal
              ? ` from ${result.signal}`
              : ` with exit code ${result.code}`
          }.`
        );
      }

      process.exitCode = 1;
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

module.exports = {
  DEFAULT_TOTAL_SHARDS,
  SIEVE_TEST_FILES,
  getRunnerPaths,
  getTotalShards,
  runShards,
  runSieve
};
