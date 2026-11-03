/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Variable references in Sieve strings (RFC 5229), found in linear time (a
// regex such as /\${([^}]+)}/g scans to the end of the string again for
// every "${" that is never closed).
//

//
// RFC 5229 (section 3) lets an implementation limit the length of a variable
// (it must allow at least 4000 characters). Without a limit a few "set"
// commands that each repeat a variable ten times grow it to hundreds of MB,
// and every test on it blocks the delivery process.
//
const MAX_VARIABLE_LENGTH = 102_400; // 100KB

//
// The total length of the strings that expanding variables makes in one run
// of a script (keys of tests, flags, action arguments). Every key is expanded
// and matched on its own, so a short script listing "${a}" thousands of times
// made gigabytes of strings (and as many 100KB patterns for :matches) for
// each message, and thousands of flags or actions named "${a}" ran out of
// memory. (Not counted: the value of a set, see MAX_STORED_LENGTH, and a lone
// "${name}" as the source of a string test, which makes no string; see
// interpolateVariables in engine.js.)
//
const MAX_EXPANDED_LENGTH = 4 * 1024 * 1024; // 4MB

//
// The total length of all the variables of a run as they are at any time:
// setting thousands of variables to 100KB each ran out of memory, while
// setting one again and again (as for each part of a message) keeps only
// the last value.
//
const MAX_STORED_LENGTH = 4 * 1024 * 1024; // 4MB

// cut at a character boundary (RFC 5229, section 3)
function truncate(value, limit = MAX_VARIABLE_LENGTH) {
  if (value.length <= limit) return value;
  // (not between the two halves of a surrogate pair)
  return value.slice(
    0,
    value.codePointAt(limit - 1) > 0xff_ff ? limit - 1 : limit
  );
}

//
// A reference is "${" [namespace] variable-name "}" (RFC 5229 section 3): a
// name is an identifier or a number (a match variable), a namespace is an
// identifier and names, each followed by ".". Anything else, such as "${}"
// or "${doh!}", is not a reference and is left as it is.
//
// (the match cannot run past the next "$", so finding all of them is linear)
const REFERENCE = /\${([\w.]+)}/g;
const VARIABLE_NAME =
  /^(?:[a-z_]\w*\.(?:(?:[a-z_]\w*|\d+)\.)*)?(?:[a-z_]\w*|\d+)$/i;

//
// Call `onReference(start, end, name)` for each "${name}" in order (end is the
// index of the "}"); a truthy return stops the walk.
//
function walkReferences(str, onReference) {
  if (!str.includes('${')) return;
  for (const match of str.matchAll(REFERENCE)) {
    if (
      VARIABLE_NAME.test(match[1]) &&
      onReference(match.index, match.index + match[0].length - 1, match[1])
    )
      return;
  }
}

//
// Replace each reference with `lookup(name)` ('' when undefined). The result
// is cut at MAX_VARIABLE_LENGTH (or the length of the string itself, for a
// longer literal).
//
function interpolate(str, lookup) {
  const limit = Math.max(MAX_VARIABLE_LENGTH, str.length);
  let out = '';
  let copied = 0;
  let full = false;
  walkReferences(str, (start, end, name) => {
    const value = lookup(name);
    out += str.slice(copied, start) + (value === undefined ? '' : value);
    copied = end + 1;
    full = out.length > limit;
    return full;
  });
  if (copied === 0) return str;
  if (!full) out += str.slice(copied);
  return truncate(out, limit);
}

// whether the string is one reference and nothing else ("${name}"): its
// expansion is the value of the variable as it is, not a new string
function isBareReference(str) {
  let bare = false;
  walkReferences(str, (start, end) => {
    bare = start === 0 && end === str.length - 1;
    return true;
  });
  return bare;
}

// the names of the references in the string, with their namespaces
function getVariableReferences(str) {
  const names = [];
  walkReferences(str, (start, end, name) => {
    names.push(name);
  });
  return names;
}

// whether the string holds a reference
function hasVariableReference(str) {
  let found = false;
  walkReferences(str, () => {
    found = true;
    return true;
  });
  return found;
}

module.exports = {
  MAX_VARIABLE_LENGTH,
  MAX_EXPANDED_LENGTH,
  MAX_STORED_LENGTH,
  truncate,
  interpolate,
  isBareReference,
  getVariableReferences,
  hasVariableReference
};
