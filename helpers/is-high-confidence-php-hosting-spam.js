/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

function getHeaderValues(headers, name) {
  if (!headers?.getDecoded) return [];

  const values = headers.getDecoded(name);
  if (!Array.isArray(values)) return [];

  return values
    .map((header) => header?.value)
    .filter((value) => typeof value === 'string');
}

function hasPhpOriginatingScript(headers) {
  return getHeaderValues(headers, 'x-php-originating-script').some((value) =>
    /^\d+:[\w-]+\.php$/i.test(value.trim())
  );
}

function hasExplicitBlankToWithoutBcc(headers) {
  const to = getHeaderValues(headers, 'to');
  if (to.length === 0 || to.some((value) => isSANB(value))) return false;

  // A disclosed Bcc recipient makes an empty visible To field expected.
  return !getHeaderValues(headers, 'bcc').some((value) => isSANB(value));
}

function hasTrustedSenderIdentity(session) {
  return (
    session?.hadAlignedAndPassingDKIM === true ||
    session?.dmarc?.status?.result === 'pass' ||
    session?.isTrustedArc === true
  );
}

/**
 * Detects unauthenticated blind mail sent by a PHP script through unrelated
 * shared-hosting infrastructure. Each condition is required because PHP mail,
 * empty To fields, unauthenticated mail, and hostname mismatch occur
 * legitimately in isolation. This helper intentionally ignores message content
 * and PGP/MIME state.
 *
 * Authentication inputs come only from mailauth-populated session fields, not
 * sender-supplied Authentication-Results headers.
 */
function isHighConfidencePhpHostingSpam(headers, session) {
  if (
    session?.isAllowlisted ||
    session?.isOriginalFromAddressAllowlisted ||
    session?.hasSameHostnameAsFrom !== false ||
    hasTrustedSenderIdentity(session)
  ) {
    return false;
  }

  return (
    hasExplicitBlankToWithoutBcc(headers) && hasPhpOriginatingScript(headers)
  );
}

module.exports = isHighConfidencePhpHostingSpam;
module.exports.getHeaderValues = getHeaderValues;
module.exports.hasExplicitBlankToWithoutBcc = hasExplicitBlankToWithoutBcc;
module.exports.hasPhpOriginatingScript = hasPhpOriginatingScript;
module.exports.hasTrustedSenderIdentity = hasTrustedSenderIdentity;
module.exports.isHighConfidencePhpHostingSpam = isHighConfidencePhpHostingSpam;
