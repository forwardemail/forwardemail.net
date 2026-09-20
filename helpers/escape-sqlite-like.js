/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Escape a literal for a SQLite `LIKE ... ESCAPE '\'` pattern so that the
// wildcards `%` and `_` (and the escape character itself) match literally.
//
// User-supplied search terms must never reach the REGEXP operator: the
// sqlite-regex extension is optional (a handle without it has no REGEXP
// function at all) and it rejects any scanned value that is not valid
// UTF-8 with "utf8 err".  Message headers are stored as JSON, and a header
// that decoded to a lone surrogate (a truncated UTF-16 encoded-word, for
// example) is extracted by `json_extract` as invalid UTF-8, which made every
// header search of that mailbox fail.  LIKE compares bytes and has neither
// problem.
//
function escapeSqliteLike(value) {
  if (typeof value !== 'string') throw new TypeError('Value must be a string');
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_');
}

module.exports = escapeSqliteLike;
