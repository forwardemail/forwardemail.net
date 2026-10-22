/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const { Splitter } = require('mailsplit');

//
// The address parsers of every nodemailer copy that reads incoming mail
// (mailauth's DMARC check, mailparser, the IMAP indexer and nodemailer
// itself) take time quadratic in the number of list elements of an address
// header (GHSA-2x7j-588g-ccc2) and in the length of a run of text without
// whitespace (GHSA-v53p-9fqp-m79j, GHSA-prgh-xp8r-p3m5).  A From such as
// `a@example.com,x,x,x,…` a few hundred KB long held each parser for over a
// minute, and anyone can send one.
//
// The parsers read the address headers of every part of a message too, and
// of the messages embedded in it as `message/rfc822` (the IMAP indexer
// descends into those whatever their disposition), so every header block is
// checked, down through a reasonable depth of embedded messages.
//
// So a message is refused, before anything parses its addresses, when an
// address header is longer than Postfix's header_size_limit, has more list
// separators than a real list of recipients has (counting the commas in
// quoted display names too), or has a run of more than 998
// characters without whitespace (RFC 5322 limits a line to 998 characters,
// and a header is only folded at whitespace, so no compliant header has
// one), or when its address headers are longer than 128 KB in all, across
// every part (each one is parsed, and a header can be repeated).  A value is checked both as sent
// and with its encoded-words decoded, since the parsers read it decoded too.
// Within these limits each parser stays well under a second.
//
const ADDRESS_HEADERS = new Set([
  'bcc',
  'cc',
  'delivered-to',
  'disposition-notification-to',
  'errors-to',
  'from',
  'mail-followup-to',
  'mail-reply-to',
  'reply-to',
  'resent-bcc',
  'resent-cc',
  'resent-from',
  'resent-reply-to',
  'resent-sender',
  'resent-to',
  'return-path',
  'return-receipt-to',
  'sender',
  'to'
]);

const MAX_LENGTH = 102_400;
const MAX_TOTAL_LENGTH = 131_072;
const MAX_SEPARATORS = 8000;
const MAX_RUN_LENGTH = 998;

function isWhitespace(code) {
  return code === 32 || (code >= 9 && code <= 13);
}

// the reason a value is refused (or undefined when it is not)
function check(value) {
  if (value.length > MAX_LENGTH) return 'is too long';

  let separators = 0;
  let run = 0;
  for (let i = 0; i < value.length; i++) {
    const code = value.codePointAt(i);
    if (isWhitespace(code)) {
      run = 0;
      continue;
    }

    if (++run > MAX_RUN_LENGTH) return 'has a word that is too long';
    if ((code === 44 || code === 59) && ++separators > MAX_SEPARATORS)
      return 'has too many addresses';
  }
}

// the first address header of a header block that is refused
function checkHeaders(headers, state) {
  for (const { key, line } of headers.getList()) {
    if (!ADDRESS_HEADERS.has(key)) continue;
    const raw = String(line);
    const index = raw.indexOf(':');
    // (unfolded: a line break followed by whitespace is only whitespace)
    const value = raw.slice(index + 1).replace(/\r?\n/g, '');
    state.total += value.length;
    let reason =
      state.total > MAX_TOTAL_LENGTH
        ? 'makes the address headers too long'
        : '';
    reason ||= check(value);
    if (!reason) {
      let decoded;
      try {
        decoded = headers.libmime.decodeWords(value);
      } catch {}

      if (typeof decoded === 'string' && decoded !== value)
        reason = check(decoded);
    }

    if (reason) return { key: raw.slice(0, index).trim(), reason };
  }
}

// the content-transfer-encodings an embedded message is read through
const EMBEDDED_ENCODINGS = new Set(['', '7bit', '8bit', 'binary']);

// the depth of embedded messages that are descended into (a forwarded chain
// is rarely deep, and a deeper one is refused rather than parsed)
const MAX_EMBEDDED_DEPTH = 8;

// one pass over a message: check each part's headers, and collect the
// embedded `message/rfc822` parts to descend into (as the IMAP indexer does,
// whatever their disposition, see parse-mime-tree.js)
function scanMessage(chunks, state) {
  return new Promise((resolve) => {
    const splitter = new Splitter();
    let done = false;
    const embedded = [];
    const collecting = new Map();
    const finish = (result) => {
      if (done) return;
      done = true;
      resolve({ unsafe: result, embedded });
    };

    splitter.on('data', (data) => {
      if (done) return;
      if (data.type === 'node') {
        const unsafe = checkHeaders(data.headers, state);
        if (unsafe) {
          finish(unsafe);
          splitter.destroy();
          return;
        }

        if (
          data.contentType === 'message/rfc822' &&
          EMBEDDED_ENCODINGS.has(String(data.encoding || '').toLowerCase())
        ) {
          const parts = [];
          embedded.push(parts);
          collecting.set(data, parts);
        }
      } else if (data.type === 'body' && collecting.has(data.node)) {
        collecting.get(data.node).push(data.value);
      }
    });
    splitter.once('end', () => finish());
    // (a message the splitter cannot read is left to the other checks)
    splitter.once('error', () => finish());
    splitter.once('close', () => finish());

    for (const chunk of chunks) splitter.write(chunk);
    splitter.end();
  });
}

//
// The first address header of a message (a Buffer, or the Buffers it is
// made of, in order) that is refused, as `{ key, reason }`, or undefined.
//
async function getUnsafeAddressHeader(message) {
  const chunks = (Array.isArray(message) ? message : [message])
    .filter((chunk) => chunk !== undefined && chunk !== null)
    .map((chunk) => (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));

  const state = { total: 0 };
  // (the message, then every embedded message it holds, breadth first)
  let level = [chunks];
  for (let depth = 0; level.length > 0; depth++) {
    if (depth > MAX_EMBEDDED_DEPTH)
      return { key: 'Content-Type', reason: 'nests too many messages' };

    const next = [];
    for (const parts of level) {
      const { unsafe, embedded } = await scanMessage(parts, state);
      if (unsafe) return unsafe;
      next.push(...embedded);
    }

    level = next;
  }
}

module.exports = getUnsafeAddressHeader;
module.exports.MAX_SEPARATORS = MAX_SEPARATORS;
module.exports.MAX_EMBEDDED_DEPTH = MAX_EMBEDDED_DEPTH;
