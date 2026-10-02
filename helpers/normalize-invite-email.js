/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

//
// The form an invite address is stored and compared in: trimmed, lowercase,
// and with an international domain in its ASCII (xn--) form, so an invite
// sent to "Jane@Bücher.example" matches an account registered as
// "jane@xn--bcher-kva.example" and the reverse.
//
function normalizeInviteEmail(email) {
  if (typeof email !== 'string') return '';
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf('@');
  if (at === -1) return value;
  let domain = value.slice(at + 1);
  try {
    domain = punycode.toASCII(domain);
  } catch {
    // leave a domain punycode cannot convert as it is
  }

  return `${value.slice(0, at)}@${domain}`;
}

module.exports = normalizeInviteEmail;
