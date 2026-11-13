/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The name a link host is looked up as, for the Spam Scanner link checks
// (`helpers/spam-scanner.js`, and its worker, which loads this too: it
// depends on tldts only).
//
// `new URL()` keeps characters in a host name that no name has ("!", ",",
// "{", "~", and more, also from "%2C"), and a label can be empty or too
// long; such a name cannot be looked up, but Cloudflare's resolvers block a
// name by its parent domains too, and so would block it, as a mail client's
// resolver may.  So it is looked up as its longest suffix of labels that can
// be (at most 253 characters): "x!y.evil.example" as "evil.example".  Only
// when a name cut so leaves no label, or only a public suffix ("x!.com",
// "x!y.github.io"), is there no name to look up (`null`), as Spam Scanner
// reads it; a name that needs no cutting is looked up as it is.
//

const { getPublicSuffix } = require('tldts');

// a label of a name that can be looked up (lowercased; an internationalized
// name is in its ASCII form)
const LABEL = /^[a-z\d_-]{1,63}$/;

// (`host`: a host name, not an address)
function lookupName(host) {
  if (typeof host !== 'string') return null;
  // (without the dots it ends with, however many: read from its end, in
  //  linear time)
  let end = host.length;
  while (end > 0 && host[end - 1] === '.') end--;
  const name = host.slice(0, end).toLowerCase();
  const labels = name.split('.');
  let start = labels.length;
  let length = -1;
  while (
    start > 0 &&
    LABEL.test(labels[start - 1]) &&
    length + 1 + labels[start - 1].length <= 253
  ) {
    start--;
    length += 1 + labels[start].length;
  }

  if (start === labels.length) return null;
  if (start === 0) return name;
  const suffix = labels.slice(start).join('.');
  // (a single label, or a public suffix: no domain of its own)
  if (
    start === labels.length - 1 ||
    getPublicSuffix(suffix, { allowPrivateDomains: true }) === suffix
  )
    return null;
  return suffix;
}

module.exports = lookupName;
