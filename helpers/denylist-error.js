/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

class DenylistError extends Error {
  constructor(
    message = 'Denylisted',
    responseCode = 554,
    denylistValue = '',
    ...parameters
  ) {
    super(...parameters);
    Error.captureStackTrace(this, DenylistError);
    this.name = 'DenylistError';
    this.message = message;
    this.responseCode = responseCode;
    this.denylistValue = denylistValue.toLowerCase();
  }
}

module.exports = DenylistError;
