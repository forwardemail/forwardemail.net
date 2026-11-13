/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const { Splitter } = require('mailsplit');

const { limits } = require('#helpers/header-limits');

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

//
// Parsers join a header's folded lines in time in the number of folded lines
// times the number of lines, as they read each part: mailsplit (here, before
// it emits the part, so the check below would come too late, and in
// mailparser) splices them out one at a time (a part's header of 160,000
// folded lines held the event loop for 24 seconds, 50 among 499,000 others
// about a second), and the IMAP indexer (wildduck's parse-mime-tree, as
// messages are stored and as they are fetched) does too, and adds each value
// of a repeated field ahead of the others, each by moving the others: it
// reads a line as ending at a CR alone too, as folded when it starts with any
// white space (also VT, FF, CR or a no-break space), and a header as going on
// until an empty line, past the boundaries of parts (a top-level header of
// 60,000 folded lines ending at a CR alone took it 46 seconds).
//
// So that work is limited, as each of them reads it, for each header: a
// message's own, or an embedded message's (`MAX_HEADER_WORK`: as many folded
// lines among as many as the message's own may have, see
// `helpers/header-limits`, about 100ms, as a long References field of a
// thread, which Postfix cuts at 100 KB, has about 3000 lines; and at most
// twice as many lines, as a few folded among very many others take longer),
// and a part's (`MAX_PART_WORK`, a part's header having a few lines: about
// 2800 folded among as many, or 50 among 160,000 others, at most about
// 300ms), and for the message in all, its parts and embedded messages
// (`MAX_MESSAGE_WORK`), by ending the read at the line past any of them
// (mailsplit's own limit on a part's header, in bytes, then stops it); lines
// neither folded nor repeated cost little each, e.g. a part's body read as
// its header for want of the empty line ending it, which is not refused for
// them
//
// (this follows the parts as mailsplit finds them: the IMAP indexer finds
//  them by rules of its own, e.g. by the last Content-Type of a header, a
//  boundary line ending at a CR alone, or a boundary parameter read without
//  quotes, and takes time in the square of runs of CRs and white space
//  anywhere, so a message can still be made that it takes long to read; its
//  parser needs those fixed itself)
//
const MAX_HEADER_WORK = limits.lines * limits.lines;
const MAX_HEADER_LINES = 2 * limits.lines;
const MAX_PART_WORK = 8_000_000;
// (the sum of the squares of the runs of CR and LF bytes in a header: runs of
//  a few bytes, as lines end, are allowed many millions of lines)
const MAX_BREAK_WORK = 10_000_000;
const MAX_MESSAGE_WORK = 2 * MAX_HEADER_WORK;

// (white space as JavaScript's `\s` reads it in a binary string)
const SPACE = new Set([0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x20, 0xa0]);

// the work of joining a header's lines, as one parser reads them
function headerWork() {
  return { lines: 0, folded: 0, names: new Map(), repeated: 0, work: 0 };
}

// (a line added: whether folded, and its name, as the IMAP indexer keys a
//  repeated field; returns the change in work)
function addLine(header, folded, name) {
  const before = header.work;
  header.lines++;
  if (folded) header.folded++;
  else if (name) {
    const count = (header.names.get(name) || 0) + 1;
    header.names.set(name, count);
    if (count > header.repeated) header.repeated = count;
  }

  header.work = header.lines * (header.folded + header.repeated);
  return header.work - before;
}

// (a field's name: printable, without a space, to name it in an answer, and
//  as the IMAP indexer keys it, lowercase, to count it repeated)
function nameOf(text) {
  const colon = text.indexOf(':');
  if (colon <= 0 || colon > 100) return { field: '', key: '' };
  const name = text.slice(0, colon).trim();
  return {
    field: /^[\u0021-\u0039\u003B-\u007E]+$/.test(name) ? name : '',
    key: /^[a-zA-Z\d\-*]+$/.test(name) ? name.toLowerCase() : ''
  };
}

class LimitedSplitter extends Splitter {
  constructor(state) {
    super();
    // (not `state`, mailsplit's own)
    this.counts = state;
    // (the header as the IMAP indexer reads it, which goes on past the
    //  boundaries of parts until an empty line)
    this.indexed = headerWork();
  }

  newNode(parent) {
    super.newNode(parent);
    const { node } = this;
    // (`breaks` and `breakWork` are this node's, see below)
    this.breaks = 0;
    this.breakWork = 0;
    // (as mailsplit reads it: lines ending at LF, folded when they start
    //  with a space or tab)
    const split = headerWork();
    // (a message's own header, or an embedded message's, also one mailsplit
    //  reads within the message, e.g. an attached message shown inline)
    const root = !parent || parent.contentType === 'message/rfc822';
    const most = root ? MAX_HEADER_WORK : MAX_PART_WORK;
    let field = '';
    const addHeaderChunk = node.addHeaderChunk.bind(node);
    node.addHeaderChunk = (line) => {
      addHeaderChunk(line);
      if (!line || line.length === 0) return;
      // (`counts` and `indexed` read as each line is: the constructor makes
      //  the root node before they are set)
      const { counts } = this;
      this.indexed ||= headerWork();
      const text = line.toString('latin1');
      const added = { split: 0, indexed: 0 };
      const blank = /^\r*\n?$/.test(text);
      if (!blank) {
        const { field: name } = nameOf(text);
        if (line[0] === 0x20 || line[0] === 0x09)
          added.split += addLine(split, true);
        else {
          added.split += addLine(split, false);
          field = name;
        }
      }

      // (runs of CR and LF bytes: mailsplit removes those ending a header
      //  with `/[\r\n]+$/`, which takes time in the square of every run of
      //  them within it, as it parses it, so a header with long ones is
      //  refused before; a line ends with one of two or three)
      for (const byte of line) {
        if (byte === 0x0d || byte === 0x0a) {
          this.breaks++;
          continue;
        }

        if (this.breaks > 0) {
          this.breakWork += this.breaks * this.breaks;
          this.breaks = 0;
        }
      }

      // (the pieces the IMAP indexer reads, at every CR alone, without the
      //  line break ending the line, found by index, as a pattern for it would
      //  be tried at every CR of a run)
      let end = text.length;
      // (two CRs or more before the LF are a line ending at a CR alone, then
      //  an empty one, which ends the header to the indexer)
      let ended = false;
      if (text[end - 1] === '\n') {
        end--;
        const crlf = end;
        while (end > 0 && text[end - 1] === '\r') end--;
        ended = crlf - end >= 2;
      }

      for (const piece of text.slice(0, end).split(/\r+(?!\n)/)) {
        if (piece === '') {
          this.indexed = headerWork();
          continue;
        }

        added.indexed += addLine(
          this.indexed,
          SPACE.has(piece.codePointAt(0)),
          nameOf(piece).key
        );
      }

      if (ended) this.indexed = headerWork();
      if (counts) {
        counts.work = (counts.work || 0) + added.split;
        counts.indexed = (counts.indexed || 0) + added.indexed;
      }

      let reason = '';
      if (this.breakWork > MAX_BREAK_WORK)
        reason = 'has too many line breaks in a row';
      else if (split.work > most || this.indexed.work > most)
        reason = 'is folded or repeated over too many lines';
      else if (
        root &&
        ((split.lines > MAX_HEADER_LINES &&
          split.folded + split.repeated > 0) ||
          (this.indexed.lines > MAX_HEADER_LINES &&
            this.indexed.folded + this.indexed.repeated > 1))
      )
        reason = 'is in a header of too many lines';
      else if (
        counts &&
        (counts.work > MAX_MESSAGE_WORK || counts.indexed > MAX_MESSAGE_WORK)
      )
        reason =
          'makes the headers of the message folded or repeated over too many lines';
      if (reason) {
        this.tooLong = { key: field || 'Content-Type', reason };
        node._headerlen = this.maxHeadSize + 1;
      }
    };
  }
}

// one pass over a message: check each part's headers, and collect the
// embedded `message/rfc822` parts to descend into (as the IMAP indexer does,
// whatever their disposition, see parse-mime-tree.js)
function scanMessage(chunks, state) {
  return new Promise((resolve) => {
    const splitter = new LimitedSplitter(state);
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
    // (a message the splitter cannot read is left to the other checks, as
    //  one with a part's header over 1 MB, e.g. a body read as its header for
    //  want of the empty line ending it, but not a header too long to read in
    //  reasonable time, nor a message of more than 1000 parts, past which no
    //  header would be checked, and parsers without that limit, e.g. the IMAP
    //  indexer, read every one)
    splitter.once('error', (err) =>
      finish(
        splitter.tooLong ||
          (err?.code === 'EMAXLEN' && /child nodes/i.test(err.message)
            ? {
                key: 'Content-Type',
                reason: 'has too many parts to read'
              }
            : undefined)
      )
    );
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
module.exports.MAX_HEADER_WORK = MAX_HEADER_WORK;
module.exports.MAX_PART_WORK = MAX_PART_WORK;
module.exports.MAX_HEADER_LINES = MAX_HEADER_LINES;
module.exports.MAX_MESSAGE_WORK = MAX_MESSAGE_WORK;
