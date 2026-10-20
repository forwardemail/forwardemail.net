/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The tests and native modules (e.g. re2) are built for the Node major in
// package.json "engines". Under another major every native module fails to
// load (ERR_DLOPEN_FAILED, NODE_MODULE_VERSION) and most test files crash,
// so stop before lint, build and tests start and say why.
//

const process = require('node:process');

const { engines } = require('../package.json');

function getNodeVersionError(
  version = process.versions.node,
  required = engines.node
) {
  const major = String(version).replace(/^v/, '').split('.')[0];
  const requiredMajor = String(required).replace(/^\D*/, '').split('.')[0];
  if (major === requiredMajor) return null;
  return `Forward Email needs Node ${requiredMajor} (package.json "engines" is ${required}), but this is Node ${version}. Switch with "n ${requiredMajor}" or "nvm use", then run the tests again.`;
}

if (require.main === module) {
  const message = getNodeVersionError();
  if (message) {
    console.error(message);
    process.exitCode = 1;
  }
}

module.exports = { getNodeVersionError };
