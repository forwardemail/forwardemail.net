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

// remove trailing CR and LF characters (linear, see `parseHeaders`)
function trimLineBreaks(str) {
  let end = str.length;
  while (end > 0) {
    const code = str.codePointAt(end - 1);
    if (code !== 0x0d && code !== 0x0a) break;
    end--;
  }

  return end === str.length ? str : str.slice(0, end);
}

function splitLines(str) {
  return str.split(/\r?\n/);
}

//
// join folded lines onto the header line they continue, and drop a leading
// mbox "From " or HTTP "POST " line, the same as mailsplit does
// <https://github.com/andris9/mailsplit/blob/37b0d216d84bae0b2efacd65a3c2d89d8452b323/lib/headers.js#L190-L231>
// (walking forward instead of splicing, so it stays linear)
//
function unfoldLines(rawLines) {
  const lines = [];
  for (const [i, raw] of rawLines.entries()) {
    const chr = raw.charAt(0);
    if (i && (chr === ' ' || chr === '\t') && lines.length > 0) {
      lines[lines.length - 1].push(raw);
    } else {
      lines.push([raw]);
    }
  }

  const result = [];
  for (const [i, parts] of lines.entries()) {
    const line = parts.join('\r\n');
    if (!i && (/^from /i.test(line) || /^post /i.test(line))) continue;
    result.push({ line });
  }

  return result;
}

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
  //
  // NOTE: both steps below must stay linear in the size of the header block,
  //       since it comes from whoever sent the message (and is only bounded by
  //       the message size): a `/[\r\n]+$/` trim backtracks quadratically on
  //       a long run of bare CR characters, and unfolding with `lines.splice()`
  //       is quadratic in the number of folded lines (a few hundred KB of
  //       either held the event loop for over a minute)
  //
  const lines = unfoldLines(
    splitLines(trimLineBreaks(headers.headers.toString()))
  );

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
