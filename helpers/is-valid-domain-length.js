/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

// RFC 1035 section 2.3.4: a name is at most 253 characters in its textual
// form (255 octets on the wire) and each label is at most 63 characters.
const MAX_NAME_LENGTH = 253;
const MAX_LABEL_LENGTH = 63;

//
// `is-fqdn` checks characters and label structure but not length, and it
// accepts a single label of any size, so a name must pass this as well before
// it is resolved, stored, or used as part of a DNS query.
//
// Internationalized names are measured in their ASCII (punycode) form, which
// is what actually goes over DNS.
//
function isValidDomainLength(name) {
  if (typeof name !== 'string') return false;
  // bail out before doing any conversion work on an oversized value
  if (name.length > MAX_NAME_LENGTH * 4) return false;

  let ascii;
  try {
    ascii = punycode.toASCII(name.trim().replace(/\.$/, ''));
  } catch {
    return false;
  }

  if (ascii.length === 0 || ascii.length > MAX_NAME_LENGTH) return false;
  return ascii
    .split('.')
    .every((label) => label.length > 0 && label.length <= MAX_LABEL_LENGTH);
}

module.exports = isValidDomainLength;
module.exports.MAX_NAME_LENGTH = MAX_NAME_LENGTH;
module.exports.MAX_LABEL_LENGTH = MAX_LABEL_LENGTH;
