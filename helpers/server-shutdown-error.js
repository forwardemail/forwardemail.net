/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

class ServerShutdownError extends Error {
  // NOTE: smtp-server does not have an affixed "." in the server shutdown message
  constructor(message = 'Server shutting down', ...args) {
    super(message, ...args);
    Error.captureStackTrace(this, ServerShutdownError);
    this.responseCode = 421;
  }
}

module.exports = ServerShutdownError;
