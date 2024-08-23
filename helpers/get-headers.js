/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// <https://github.com/nodemailer/mailparser/blob/ac11f78429cf13da42162e996a05b875030ae1c1/lib/mail-parser.js#L329>
const ENCODED_HEADERS = new Set([
  'from',
  'to',
  'cc',
  'bcc',
  'sender',
  'reply-to',
  'delivered-to',
  'return-path',

  'subject',
  'references',
  'message-id',
  'in-reply-to'
]);

function getHeaders(headers, decode = true, specificKey = null) {
  const _headers = {};

  // NOTE: unicode characters get rewritten due to a (bug) in mailsplit
  // <https://github.com/andris9/mailsplit/issues/21>
  const lines = headers.headers
    .toString()
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
    const index = line.indexOf(':');
    const key = line.slice(0, index);

    _headers[key] = line.slice(index + 1).trim();

    if (decode && ENCODED_HEADERS.has(key.toLowerCase())) {
      try {
        _headers[key] = headers.libmime.decodeWords(_headers[key]);
      } catch {
        // ignore, keep as is
      }
    }

    if (
      typeof specificKey === 'string' &&
      key.toLowerCase() === specificKey.toLowerCase()
    )
      return _headers[key];
  }

  if (typeof specificKey === 'string') return;

  return _headers;
}

module.exports = getHeaders;
