/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// TODO: should we use messageSplitter.rawHeaders instead

/*
const ENCODED_HEADERS = new Set([
  'bcc',
  'cc',
  'content-disposition',
  'content-type',
  'delivered-to',
  'dkim-signature',
  'from',
  'in-reply-to',
  'message-id',
  'references',
  'reply-to',
  'return-path',
  'sender',
  'subject',
  'to'
]);
*/

const SINGLE_KEYS = new Set([
  'content-description',
  'content-disposition',
  'content-id',
  'content-transfer-encoding',
  'content-type',
  'date',
  // NOTE: Errors-To header is deprecated
  'errors-to',
  'from',
  'in-reply-to',
  'message-id',
  'mime-version',
  'precedence',
  'priority',
  'reply-to',
  'sender',
  'subject'
]);

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
  // <https://github.com/andris9/mailsplit/blob/37b0d216d84bae0b2efacd65a3c2d89d8452b323/lib/headers.js#L190-L231>
  // NOTE: we don't want toString('binary') like above mailsplit code has otherwise we lose unicode chars
  const lines = headers.headers
    .toString()
    .replace(/[\r\n]+$/, '')
    .split(/\r?\n/);

  for (let i = lines.length - 1; i >= 0; i--) {
    const chr = lines[i].charAt(0);
    if (i && (chr === ' ' || chr === '\t')) {
      lines[i - 1] += '\r\n' + lines[i];
      lines.splice(i, 1);
    } else {
      const line = lines[i];
      if (!i && /^from /i.test(line)) {
        lines.splice(i, 1);
        continue;
      } else if (!i && /^post /i.test(line)) {
        lines.splice(i, 1);
        continue;
      }

      const key = headers._normalizeHeader(
        line.slice(0, Math.max(0, line.indexOf(':')))
      );
      lines[i] = {
        key,
        line
      };
    }
  }

  for (const { line } of lines) {
    const index = line.indexOf(':');
    const key = line.slice(0, index);
    const lc = key.toLowerCase();

    // only keep the first value for certain keys
    // <https://github.com/nodemailer/mailparser/blob/ac11f78429cf13da42162e996a05b875030ae1c1/lib/mail-parser.js#L395-L413>
    if (_headers[key] && SINGLE_KEYS.has(lc)) continue;

    _headers[key] = line
      .slice(index + 1)
      .trim()
      .replace(/\s*\r?\n\s*/g, ' ');

    //
    // NOTE: it's recommended but we don't decode certain keys, we decode all
    //       (e.g. a List-Unsubscribe header with "<" could get encoded as
    //        =?us-ascii?Q?<https://example.com/unsubscribe?= =?us-ascii?Q?.php=3Fc=3D123>?=\n' +
    //
    //       https://github.com/nodemailer/wildduck/blob/7daa0e35d5462c46ff4228638f2e9e5f30ed880d/lib/message-handler.js#L1271-L1274
    //
    // if (ENCODED_HEADERS.has(lc)) {
    try {
      _headers[key] = headers.libmime.decodeWords(_headers[key]);
    } catch {}
    // }

    if (typeof specificKey === 'string' && lc === specificKey.toLowerCase())
      return _headers[key];
  }

  if (typeof specificKey === 'string') return;

  return _headers;
}

module.exports = getHeaders;
