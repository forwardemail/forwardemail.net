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
  const names = [];

  let e = err;
  while (e) {
    if (!e || !e.name || names.includes(e.name)) break;
    names.push(e.name);
    if (
      !err.constructor ||
      !Object.getPrototypeOf(err.constructor).name ||
      names.includes(Object.getPrototypeOf(err.constructor).name)
    )
      break;
    names.push(Object.getPrototypeOf(err.constructor).name);
    if (
      !Object.getPrototypeOf(Object.getPrototypeOf(err.constructor)).name ||
      names.includes(
        Object.getPrototypeOf(Object.getPrototypeOf(err.constructor)).name
      )
    )
      break;
    names.push(
      Object.getPrototypeOf(Object.getPrototypeOf(err.constructor)).name
    );
    e = Object.getPrototypeOf(e.constructor);
  }

  return names.includes(name);
}

module.exports = isErrorConstructorName;
