/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const fs = require('node:fs');

//
// A short fingerprint of one or more files' contents, for putting into a cache
// key so that editing a source file moves the cache to a new key instead of
// leaving the old parse in place until its TTL runs out.
//
// It hashes contents rather than using the mtime directly, so every server
// that deployed the same files computes the same key and they share one cache
// entry. The hash is memoised per path against mtime and size, so a request
// costs one stat per file and the file is only re-read when either changes.
//
const memo = new Map();

const HASH_LENGTH = 16;

function hashFile(filePath) {
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    // An unreadable file is not this helper's to report. The caller's own read
    // throws or degrades exactly as it did before, and a missing file still
    // gets a stable key.
    return 'missing';
  }

  const cached = memo.get(filePath);
  if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size)
    return cached.hash;

  let hash;
  try {
    hash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(filePath))
      .digest('hex')
      .slice(0, HASH_LENGTH);
  } catch {
    return 'missing';
  }

  memo.set(filePath, { mtimeMs: stat.mtimeMs, size: stat.size, hash });
  return hash;
}

/**
 * @param {...string} filePaths - absolute paths
 * @returns {string} - hex fingerprint of the files' contents, in order
 */
function getSourceHash(...filePaths) {
  if (filePaths.length === 1) return hashFile(filePaths[0]);
  return crypto
    .createHash('sha256')
    .update(filePaths.map((p) => hashFile(p)).join(':'))
    .digest('hex')
    .slice(0, HASH_LENGTH);
}

module.exports = getSourceHash;
