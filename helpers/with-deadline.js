/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * What a promise gives, or `late` when it takes longer than `ms`. It goes
 * on, so a lookup that ends later still fills its cache for the next time.
 *
 * @param   {Promise}  promise
 * @param   {number}   ms
 * @param   {*}        late
 * @returns {Promise<*>}
 */
async function withDeadline(promise, ms, late) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timer = setTimeout(resolve, Math.max(0, ms), late);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = withDeadline;
