/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// NOTE: this is copied from `koa-better-error-handler` but it belongs in its own package
//       and then used here and in that package as well
//       <https://github.com/ladjs/koa-better-error-handler/blob/261701158b5151f7df4020834e47249b09952aa8/index.js#L57-L85>
//
function isErrorConstructorName(err, name) {
  const names = new Set();

  let e = err;
  while (e) {
    if (!e || !e.name) break;
    names.add(e.name);
    if (e.constructor && e.constructor.name) names.add(e.constructor.name);
    if (!e.constructor || !Object.getPrototypeOf(e.constructor).name) break;
    names.add(Object.getPrototypeOf(e.constructor).name);
    if (!Object.getPrototypeOf(Object.getPrototypeOf(e.constructor)).name)
      break;
    names.add(Object.getPrototypeOf(Object.getPrototypeOf(e.constructor)).name);
    e = Object.getPrototypeOf(e.constructor);
  }

  names.delete('Object');

  return names.has(name);
}

module.exports = isErrorConstructorName;
