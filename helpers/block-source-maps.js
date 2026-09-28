/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

//
// Source maps (`*.js.map`, `*.css.map`) are written to the build directory
// for local debugging.  Outside development they are not served: the path
// is checked in the form the static file server resolves it to (decoded,
// with `.`, `..` and repeated slashes resolved), so no other spelling of a
// map's path reaches the file.
//
function isSourceMapPath(pathname) {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {}

  const normalized = path.posix.normalize(`/${decoded}`).replace(/\/+$/, '');
  return normalized.toLowerCase().endsWith('.map');
}

function blockSourceMaps() {
  return async function (ctx, next) {
    if (isSourceMapPath(ctx.path)) {
      ctx.status = 404;
      ctx.body = 'Not Found';
      return;
    }

    return next();
  };
}

module.exports = blockSourceMaps;
module.exports.isSourceMapPath = isSourceMapPath;
