/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');

//
// Gmail ignores dots in the part before the @ and anything after a plus sign
// (+), and googlemail.com is the same as gmail.com, so e.g.
// "first.last+tag@googlemail.com" is the same Gmail account as
// "firstlast@gmail.com"
//
const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * The Gmail account an address belongs to, as its username without dots or
 * a plus tag (or null if it is not a Gmail address).
 *
 * @param {string} email - Email address
 * @returns {string|null} Gmail username (e.g. "firstlast")
 */
function getGmailUsername(email) {
  if (typeof email !== 'string') return null;
  const lower = email.toLowerCase().trim();
  const at = lower.lastIndexOf('@');
  if (at <= 0 || !GMAIL_DOMAINS.has(lower.slice(at + 1))) return null;
  const username = lower.slice(0, at).split('+')[0].replaceAll('.', '');
  return username || null;
}

/**
 * MongoDB query for users whose email address is the same Gmail account as
 * `email` (in any of its dot, plus tag or googlemail.com variants), or null
 * if `email` is not a Gmail address.  Email addresses are stored in
 * lowercase, and the pattern starts with the username's first letter, so the
 * query can use the email index.
 *
 * @param {string} email - Email address
 * @returns {Object|null} Query on `email`
 */
function getGmailVariantsQuery(email) {
  const username = getGmailUsername(email);
  if (!username) return null;
  const pattern = [...username].map((c) => _.escapeRegExp(c)).join('\\.*');
  return {
    email: new RegExp(
      `^${pattern}\\.*(?:\\+[^@]*)?@(?:gmail|googlemail)\\.com$`
    )
  };
}

module.exports = getGmailVariantsQuery;
module.exports.getGmailUsername = getGmailUsername;
