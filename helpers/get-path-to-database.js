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
  if (typeof alias?.storageLocation !== 'string')
    throw new TypeError('Alias storage location missing');
  if (typeof alias?.id !== 'string') throw new TypeError('Alias ID missing');
  // validate that they are all object ids
  if (!mongoose.Types.ObjectId.isValid(alias.id))
    throw new TypeError('Invalid alias id');

  const dir = path.join(
    config.env === 'production' ? '/mnt' : tmpdir,
    alias.storageLocation
  );

  if (config.env !== 'production') mkdirp.sync(dir);

  return path.join(dir, `${alias.id}.sqlite`);
}

module.exports = getPathToDatabase;
