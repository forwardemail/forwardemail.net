/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Detect if error is due to REQUIRETLS not being supported (RFC 8689 Section 4.2)
 * @param {Error} err - Error object
 * @returns {boolean} - true if error is REQUIRETLS-related
 */
function isRequireTLSError(err) {
  if (!err) return false;

  // Check error message for REQUIRETLS-specific strings
  const message = typeof err.message === 'string' ? err.message : '';
  const response = typeof err.response === 'string' ? err.response : '';
  const reason = typeof err.reason === 'string' ? err.reason : '';

  // RFC 8689 Section 4.2: Server doesn't support REQUIRETLS extension
  if (
    message.includes('Server does not support REQUIRETLS') ||
    message.includes('REQUIRETLS not supported') ||
    message.includes('REQUIRETLS extension not supported')
  ) {
    return true;
  }

  if (
    response.includes('Server does not support REQUIRETLS') ||
    response.includes('REQUIRETLS not supported') ||
    response.includes('REQUIRETLS extension not supported')
  ) {
    return true;
  }

  if (
    reason.includes('Server does not support REQUIRETLS') ||
    reason.includes('REQUIRETLS not supported') ||
    reason.includes('REQUIRETLS extension not supported')
  ) {
    return true;
  }

  // RFC 8689 Section 4.2.1: 555 response code indicates REQUIRETLS not supported
  if (err.responseCode === 555) {
    return true;
  }

  return false;
}

module.exports = isRequireTLSError;
