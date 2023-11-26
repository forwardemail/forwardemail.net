/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const path = require('node:path');

const mkdirp = require('mkdirp');
const mongoose = require('mongoose');

const config = require('#config');

const tmpdir = os.tmpdir();

function getPathToDatabase(alias) {
  if (typeof alias !== 'object') throw new TypeError('Alias missing');
  if (typeof alias?.storage_location !== 'string')
    throw new TypeError('Alias storage location missing');
  if (alias?.id === undefined) throw new TypeError('Alias ID missing');
  // validate that they are all object ids
  if (!mongoose.isObjectIdOrHexString(alias.id))
    throw new TypeError('Invalid alias id');

  const dir = path.join(
    config.env === 'production' ? '/mnt' : tmpdir,
    alias.storage_location
  );

  if (config.env !== 'production') mkdirp.sync(dir);

  return path.join(dir, `${alias.id}.sqlite`);
}

module.exports = getPathToDatabase;
