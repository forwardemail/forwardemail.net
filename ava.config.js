/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const allFilePatterns = [
  'test/*.js',
  'test/**/*.js',
  'test/**/**/*.js',
  '!test/utils.js',
  '!test/sieve/**/*.js'
];

// Walk a directory tree and return all .js file paths (relative to cwd)
function walkSync(dir, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSync(full, results);
    } else if (entry.name.endsWith('.js')) {
      results.push(full);
    }
  }

  return results;
}

// Count test declarations in a file (approximate weight)
function countTests(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/^test(\.serial)?\s*\(/gm);
    return matches ? matches.length : 1;
  } catch {
    return 1;
  }
}

// CI sharding support: set CI_SHARD=1 CI_TOTAL_SHARDS=6 to split test files
// across parallel CI jobs. Uses weighted round-robin to ensure heavy test files
// (like IMAP with 91 tests) are distributed evenly.
// NOTE: We only apply sharding when AVA_SHARD=1 is set (passed by the test
// script) to avoid confusing the XO linter's ava/no-ignored-test-files rule,
// which evaluates this config at lint time.
function getFiles() {
  // Only shard when explicitly opted in via AVA_SHARD env var
  if (!process.env.AVA_SHARD) {
    return allFilePatterns;
  }

  const shard = Number.parseInt(process.env.CI_SHARD, 10);
  const totalShards = Number.parseInt(process.env.CI_TOTAL_SHARDS, 10);

  if (!shard || !totalShards || shard < 1 || shard > totalShards) {
    return allFilePatterns;
  }

  // Resolve all test files manually (no external glob dependency)
  const all = walkSync('test', [])
    .map((f) => f.split(path.sep).join('/'))
    .filter((f) => !f.startsWith('test/sieve/') && f !== 'test/utils.js')
    .sort();

  // Weighted distribution: sort files by test count (heaviest first),
  // then assign to shards using greedy load-balancing (each file goes
  // to the shard with the lowest current total weight).
  const weighted = all
    .map((file) => ({ file, weight: countTests(file) }))
    .sort((a, b) => b.weight - a.weight);

  const shardWeights = Array.from({ length: totalShards }, () => 0);
  const shardAssignments = Array.from({ length: totalShards }, () => []);

  for (const { file, weight } of weighted) {
    // Find the shard with the lowest total weight
    let minIdx = 0;
    for (let i = 1; i < totalShards; i++) {
      if (shardWeights[i] < shardWeights[minIdx]) {
        minIdx = i;
      }
    }

    shardAssignments[minIdx].push(file);
    shardWeights[minIdx] += weight;
  }

  const shardFiles = shardAssignments[shard - 1];

  // Return explicit file list for this shard
  return shardFiles.length > 0 ? shardFiles : ['!**/*'];
}

module.exports = {
  verbose: true,
  failFast: true,
  serial: true,
  concurrency: 1,
  files: getFiles(),
  // <https://github.com/lovell/sharp/issues/3164#issuecomment-1168328811>
  workerThreads: false,
  // <https://github.com/JCMais/node-libcurl/issues/414>
  // workerThreads: false,
  timeout: '10m'
};
