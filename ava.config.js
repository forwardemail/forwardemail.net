/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// const os = require('node:os');

// const isCI = require('is-ci');

// const { familySync, GLIBC } = require('detect-libc');

module.exports = {
  verbose: true,
  failFast: true,
  serial: true, // isCI,
  concurrency: 1, // isCI ? 1 : 2, // isCI ? 2 : Math.floor(os.cpus().length / 3),
  files: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js', '!test/utils.js'],
  // <https://github.com/lovell/sharp/issues/3164#issuecomment-1168328811>
  workerThreads: false, // familySync() !== GLIBC,

  // <https://github.com/JCMais/node-libcurl/issues/414>
  // workerThreads: false,

  timeout: '10m'
};
