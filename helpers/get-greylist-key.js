/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const revHash = require('rev-hash');

function getGreylistKey(value) {
  return `greylist:${revHash(value)}`;
}

module.exports = getGreylistKey;
