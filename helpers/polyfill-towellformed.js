/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/* eslint-disable no-use-extend-native/no-use-extend-native, no-extend-native, func-names */

//
// Polyfill for String.prototype.toWellFormed
// Required for undici v7+ compatibility with Node.js 18
//
// String.prototype.toWellFormed() was introduced in ES2024 and is available
// natively in Node.js 20+ (V8 11.3+). This polyfill enables undici v7 to work
// on Node.js 18.
//
// This file should be required at the very beginning of the application entry
// point, before any other modules are loaded (especially before undici).
//
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed
//

if (typeof String.prototype.toWellFormed !== 'function') {
  Object.defineProperty(String.prototype, 'toWellFormed', {
    value: function toWellFormed() {
      return this.replace(
        // Match lone surrogates (high surrogate not followed by low surrogate,
        // or low surrogate not preceded by high surrogate)
        // High surrogate: \uD800-\uDBFF
        // Low surrogate: \uDC00-\uDFFF
        /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/gu,
        '\uFFFD' // Unicode replacement character
      );
    },
    writable: true,
    enumerable: false,
    configurable: true
  });
}

module.exports = {};
