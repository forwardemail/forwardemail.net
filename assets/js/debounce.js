/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// NOTE: this is more lightweight than using lodash
// <https://www.joshwcomeau.com/snippets/javascript/debounce/>
// <https://gomakethings.com/debouncing-vs.-throttling-with-vanilla-js/>
// <https://gist.github.com/ionurboz/51b505ee3281cd713747b4a84d69f434>
//
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      callback.apply(null, args);
    }, wait);
  };
};

module.exports = debounce;
