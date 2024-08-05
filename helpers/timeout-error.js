/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

class TimeoutError extends Error {
  constructor(message = 'Timeout', ...args) {
    super(message, ...args);
    Error.captureStackTrace(this, TimeoutError);
  }
}

module.exports = TimeoutError;
