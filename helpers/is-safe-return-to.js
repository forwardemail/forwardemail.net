/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function containsControlCharacter(value) {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint <= 0x1f || codePoint === 0x7f) return true;
  }

  return false;
}

function containsUnsafeCharacters(value) {
  let decoded = value;

  // Test the original value and two decoded forms. This rejects both direct
  // controls/backslashes and values such as %0d%0a or %255c without changing
  // the redirect that will eventually be emitted.
  for (let index = 0; index < 3; index++) {
    if (containsControlCharacter(decoded) || decoded.includes('\\')) {
      return true;
    }

    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      return true;
    }
  }

  return false;
}

/**
 * Determine whether a post-authentication redirect target is safe.
 *
 * Relative paths must begin with one forward slash. Absolute targets must use
 * HTTP(S) and remain on the configured web origin.
 *
 * @param {unknown} value - User-controlled return URL
 * @param {string} webUrl - Trusted web origin
 * @returns {boolean} Whether the target is safe to redirect to
 */
function isSafeReturnTo(value, webUrl) {
  if (typeof value !== 'string' || value.length === 0) return false;

  if (containsUnsafeCharacters(value)) return false;

  if (value.startsWith('/') && value[1] !== '/' && value[1] !== '\\') {
    return true;
  }

  try {
    const parsed = new URL(value);
    const trusted = new URL(webUrl);

    return (
      ['http:', 'https:'].includes(parsed.protocol) &&
      parsed.origin === trusted.origin
    );
  } catch {
    return false;
  }
}

module.exports = isSafeReturnTo;
module.exports.containsUnsafeCharacters = containsUnsafeCharacters;
