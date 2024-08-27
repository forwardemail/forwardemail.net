/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// const isCI = require('is-ci');
// const { familySync, GLIBC } = require('detect-libc');

module.exports = {
  verbose: true,
  failFast: true,
  // serial: true,
  // concurrency: 2, // <--- this defaults to `2` in CI environments
  files: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js', '!test/utils.js'],
  // <https://github.com/lovell/sharp/issues/3164#issuecomment-1168328811>
  // workerThreads: familySync() !== GLIBC,

  // <https://github.com/JCMais/node-libcurl/issues/414>
  // workerThreads: false,

  timeout: '1m'
};
