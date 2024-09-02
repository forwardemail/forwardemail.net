/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function getHeaders(headers, specificKey = null) {
  const _headers = {};

  //
  // NOTE: we should only decode these headers, but we're going to decode all anyways for now
  //       <https://github.com/nodemailer/mailparser/blob/ac11f78429cf13da42162e996a05b875030ae1c1/lib/mail-parser.js#L329>
  //
  // NOTE: we decode header values because
  //       want them to be easily searchable
  //       (e.g. an emoji in a header line gets encoded as:
  //       > '=?UTF-8?Q?=F0=9F=8E=89_beep?='
  //       and we want output that looks like
  //       > 🎉 beep
  //       (e.g. so a user could search for 🎉)
  //
  //       we can't use mailsplit b/c unicode characters get rewritten
  //       <https://github.com/andris9/mailsplit/issues/21>
  //
  let lines = headers.headers.toString();
  try {
    lines = headers.libmime.decodeWords(lines);
  } catch {
    // ignore, keep as is
  }

  lines = lines
    // <https://github.com/andris9/mailsplit/issues/22>
    .replace(/\r?\n?\t/g, ' ')
    .replace(/[\r\n]+$/, '')
    .split(/\r?\n/);

  for (const line of lines) {
    const index = line.indexOf(':');
    const key = line.slice(0, index);

    _headers[key] = line.slice(index + 1).trim();

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
