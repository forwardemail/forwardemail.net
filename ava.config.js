/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isCI = require('is-ci');
const { familySync, GLIBC } = require('detect-libc');

module.exports = {
  verbose: true,
  failFast: true,
  serial: true,
  files: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js', '!test/utils.js'],
  // <https://github.com/lovell/sharp/issues/3164#issuecomment-1168328811>
  workerThreads: familySync() !== GLIBC,
  timeout: isCI ? '1m' : '15s'
};
