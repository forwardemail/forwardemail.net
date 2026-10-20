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

//
// Headers whose repeats are never kept (see `getHeadersWithRepeats`).
//
// Logs only show a Bcc header once it has been filtered down to the viewer's
// own addresses (see `retrieve-log.js`, `list-logs.js` and `get-logs-csv.js`),
// so its other occurrences must not reach a log at all.
//
const UNREPEATED_KEYS = new Set(['bcc']);

function parseHeaders(headers, specificKey, repeated) {
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
    const seen = Object.hasOwn(_headers, key);

    // only keep the first value for certain keys
    // <https://github.com/nodemailer/mailparser/blob/ac11f78429cf13da42162e996a05b875030ae1c1/lib/mail-parser.js#L395-L413>
    // (unless every occurrence is wanted, see `getHeadersWithRepeats`)
    if (_headers[key] && SINGLE_KEYS.has(lc) && !repeated) continue;

    // unfold the header: every whitespace run that contains a line break
    // becomes a single space (runs without a line break are kept as-is)
    //
    // NOTE: a pattern like `/\s*\r?\n\s*/g` backtracks quadratically on long
    //       whitespace runs without a newline (e.g. 100k spaces took ~12s),
    //       so we match each maximal run once and decide in the callback
    let value = line
      .slice(index + 1)
      .trim()
      .replace(/\s+/g, (ws) => (ws.includes('\n') ? ' ' : ws));

    //
    // NOTE: it's recommended but we don't decode certain keys, we decode all
    //       (e.g. a List-Unsubscribe header with "<" could get encoded as
    //        =?us-ascii?Q?<https://example.com/unsubscribe?= =?us-ascii?Q?.php=3Fc=3D123>?=\n' +
    //
    //       https://github.com/nodemailer/wildduck/blob/7daa0e35d5462c46ff4228638f2e9e5f30ed880d/lib/message-handler.js#L1271-L1274
    //
    // if (ENCODED_HEADERS.has(lc)) {
    try {
      value = headers.libmime.decodeWords(value);
    } catch {}
    // }

    if (repeated && key && key !== '__proto__' && !UNREPEATED_KEYS.has(lc)) {
      if (Array.isArray(repeated[key])) repeated[key].push(value);
      else if (seen) repeated[key] = [_headers[key], value];
    }

    if (!_headers[key] || !SINGLE_KEYS.has(lc)) _headers[key] = value;

    if (typeof specificKey === 'string' && lc === specificKey.toLowerCase())
      return _headers[key];
  }

  if (typeof specificKey === 'string') return;

  return _headers;
}

function getHeaders(headers, specificKey = null) {
  return parseHeaders(headers, specificKey);
}

//
// The same headers as `getHeaders(headers)`, together with every value of
// each header that occurs more than once (in message order, keyed like
// `headers`), since `headers` keeps a single value per key.
//
// (e.g. a message signed by both Amazon SES and the sender's own domain has
//  two DKIM-Signature headers, and a log must show both of them)
//
function getHeadersWithRepeats(headers) {
  const repeated = {};
  return { headers: parseHeaders(headers, null, repeated), repeated };
}

module.exports = getHeaders;
module.exports.getHeadersWithRepeats = getHeadersWithRepeats;
