/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const fs = require('node:fs').promises;

const disk = require('diskusage');

/**
 * Checks disk space for a given path using native system calls,
 * completely avoiding 'df' and 'E2BIG' errors.
 *
 * This is a drop-in replacement for `check-disk-space`
 * <https://github.com/Alex-D/check-disk-space/issues/33>
 *
 * @param {string} path The file system path to check.
 * @returns {Promise<{free: number, size: number, path: string, used: number, available: number}>}
 *          A promise that resolves with an object containing free space, total size,
 *          used space, available space (to non-root users), and the checked path in bytes.
 */
async function checkDiskSpace(inputPath) {
  let targetPath = path.resolve(inputPath); // Ensure we're working with an absolute path
  try {
    try {
      const stats = await fs.stat(targetPath);
      // If the input path is a file, get its containing directory
      if (stats.isFile()) targetPath = path.dirname(targetPath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      targetPath = path.dirname(targetPath);
    }

    // If it's a directory, targetPath remains the same
    const info = await disk.check(targetPath);
    // The 'diskusage' package provides 'free', 'total', and 'available'.
    // 'available' is typically the space available to non-root users (Linux reserves some for root).
    // 'used' can be calculated as total - free.
    return {
      free: info.free,
      size: info.total,
      path,
      used: info.total - info.free,
      available: info.available // Space available to non-root users
    };
  } catch (err) {
    // 'diskusage' throws an error if the path is invalid or other issues occur.
    // This error will NOT be E2BIG, as it doesn't use child_process for df/du.
    err.isCodeBug = true;

    /*
    // Handle specific ENOENT for the initial path not existing
    if (error.code === 'ENOENT') {
      throw new Error(`Path does not exist: "${inputPath}"`);
    }

    // Catch any other errors from diskusage.check() or fs.stat()
    throw new Error(
      `Failed to check disk space for "${inputPath}" (resolved to "${targetPath}"): ${error.message}`
    );
    */

    throw err;
  }
}

module.exports = checkDiskSpace;
