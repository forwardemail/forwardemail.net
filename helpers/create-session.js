/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function createSession(email) {
  return {
    envelope: {
      mailFrom: {
        address: email.envelope.from
      },
      rcptTo: email.envelope.to.map((address) => ({
        address
      }))
    },
    headers: email.headers,
    originalFromAddress: email.envelope.from
  };
}

module.exports = createSession;
