/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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

// CI sharding support: set CI_SHARD=1 CI_TOTAL_SHARDS=3 to split test files
// across parallel CI jobs. Each shard gets a deterministic subset of files.
function getFiles() {
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

  // Assign files to shards based on hash for even distribution
  const shardFiles = all.filter((file) => {
    const hash = crypto.createHash('md5').update(file).digest();
    return (hash.readUInt32BE(0) % totalShards) + 1 === shard;
  });

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
