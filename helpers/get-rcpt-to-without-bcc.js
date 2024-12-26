/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const getHeaders = require('#helpers/get-headers');
const parseAddresses = require('#helpers/parse-addresses');

function getRcptToWithoutBcc(session, headers) {
  const rcptTo = new Set();

  // add RCPT TO addresses
  for (const to of session.envelope.rcptTo) {
    rcptTo.add(punycode.toASCII(to.address).toLowerCase());
  }

  // strip BCC addresses
  const bcc = parseAddresses(getHeaders(headers, 'bcc'));

  if (bcc.length > 0) {
    for (const addr of bcc) {
      rcptTo.delete(punycode.toASCII(addr).toLowerCase());
    }
  }

  // convert to Array as return value
  return [...rcptTo];
}

module.exports = getRcptToWithoutBcc;
