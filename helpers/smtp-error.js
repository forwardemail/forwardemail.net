/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

class SMTPError extends Error {
  constructor(message, options = {}, ...args) {
    super(message, options, ...args);
    Error.captureStackTrace(this, SMTPError);
    this.responseCode = options?.responseCode || 550;
    Object.assign(this, options);
  }
}

module.exports = SMTPError;
