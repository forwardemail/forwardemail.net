/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

function getHeaders(headers) {
  const _headers = {};
  const lines = headers.headers
    .toString('binary')
    .replace(/[\r\n]+$/, '')
    .split(/\r?\n/);

  //
  // NOTE: we decode header values because
  //       want them to be easily searchable
  //       (e.g. an emoji in a header line gets encoded as:
  //       > '=?UTF-8?Q?=F0=9F=8E=89_beep?='
  //       and we want output that looks like
  //       > 🎉 beep
  //       (e.g. so a user could search for 🎉)
  //
  for (const line of lines) {
    const value = Buffer.from(line, 'binary').toString();
    const index = value.indexOf(': ');
    const key = value.slice(0, index);

    _headers[key] = value.slice(index + 2);

    // <https://github.com/nodemailer/mailparser/blob/ac11f78429cf13da42162e996a05b875030ae1c1/lib/mail-parser.js#L329>
    if (
      ['subject', 'references', 'message-id', 'in-reply-to'].includes(
        key.toLowerCase()
      )
    ) {
      try {
        _headers[key] = headers.libmime.decodeWords(_headers[key]);
      } catch {
        // ignore, keep as is
      }
    }
  }

  return _headers;
}

module.exports = getHeaders;
