/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Text that is safe to write on one line (a console line, an error message,
// a header value before it is sanitized further): at most `max` characters
// of it, without invisible formatting characters (a right-to-left override
// would reverse the rest of the line), and with control characters and line
// breaks as spaces, so a value cannot start a line of its own; `null` for no
// value.  (Only the first `max` characters are read, which bounds the work on
// a value of any length.)
//
// It has no dependencies, so the Spam Scanner worker can load it too.
//
function printable(value, max = 1000) {
  if (value === undefined || value === null) return null;
  return (
    String(value)
      .slice(0, max)
      // (and half a character the cut may leave, e.g. of an emoji)
      .replace(/[\p{Cf}\p{Cs}]+/gu, '')
      .replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, ' ')
      .trim()
  );
}

module.exports = printable;
