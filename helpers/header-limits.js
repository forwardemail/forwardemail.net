/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

//
// The most a received message's header may hold: its parsers (mailsplit's,
// `helpers/get-headers`, mailauth's) join a field's folded lines one at a
// time, which takes time in the square of their number (40,000 folded lines
// in 160 KB took seconds of CPU in each, on the main thread), and mailauth
// reads address fields in time in the square of their length.  Legitimate
// mail has a header of a few hundred lines; Postfix truncates a field past
// 100 KB (header_size_limit, 102,400 bytes with LF line breaks), so a field
// may only be longer than that where it was never relayed through Postfix
// (e.g. a long References field of a long thread, truncated, and sent on
// with CRLF line breaks, is 104,078 bytes): the limit on a field leaves room
// above Postfix's, and does not count CR bytes.
//
// (the most CRs in a row within a header line, see `checkHeaderLimits`)
const MAX_CR_RUN = 16;

const limits = {
  lines: 5000,
  // (bytes, without CR)
  field: 131_072,
  // (the From field, which mailauth reads with nodemailer's addressparser,
  //  in time in the square of its groups: 100 KB of empty groups took
  //  seconds; it names one address, see `helpers/get-from-address`, which
  //  takes the address DMARC authenticated, as addressparser reads it, only
  //  from a value of at most 4096 characters: a longer one could name
  //  another address than the one DMARC passed for)
  from: 4096,
  // (groups nest: within the 4 KB a From field may be, 64 take
  //  addressparser 12ms; "Re: Fwd: ..." display names and IPv6 literals
  //  have a few)
  fromGroups: 64,
  fromSeparators: 2000
};

//
// mailauth reads a header (`parseHeaders` in mailauth/lib/tools) as latin1
// text split at line breaks, where a line starting with any white space (as
// JavaScript's `\s` reads it: tab, LF, VT, FF, CR, space and NBSP) continues
// the field before it, and a field's name is what comes before its first ":",
// without white space around it (`trim()`, which removes the same); the
// limits here read a header as it does, so a field it reads as From or
// DKIM-Signature is counted as one ("From\xa0:", a From field continued by a
// line starting with "\v")
//
const SPACE = new Set([0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x20, 0xa0]);

//
// The fields of a header (Buffer or latin1 string) as mailauth reads them:
// each its name in lowercase, its lines, and where its first ":" is in them
// joined with CR LF (-1 for none); in linear time
//
function headerFields(header) {
  const text = Buffer.isBuffer(header)
    ? header.toString('latin1')
    : typeof header === 'string'
    ? header
    : '';
  const fields = [];
  if (text === '') return fields;
  // (without the line breaks ending it, found by index: a pattern for them
  //  would be tried at every one of a run within it)
  let end = text.length;
  while (end > 0 && (text[end - 1] === '\r' || text[end - 1] === '\n')) end--;
  for (const line of text.slice(0, end).split(/\r?\n/)) {
    if (fields.length > 0 && SPACE.has(line.codePointAt(0))) {
      fields.at(-1).lines.push(line);
      continue;
    }

    fields.push({ name: '', lines: [line], colon: -1 });
  }

  // (its name as mailauth reads it: of its lines joined, up to the first
  //  ":", which may be on a folded line, "DKIM-Signature\r\n :")
  for (const field of fields) {
    let offset = 0;
    let end = field.lines.length;
    for (const [i, line] of field.lines.entries()) {
      const colon = line.indexOf(':');
      if (colon !== -1) {
        field.colon = offset + colon;
        end = i + 1;
        break;
      }

      offset += line.length + 2;
    }

    const head = field.lines.slice(0, end).join('\r\n');
    field.name = (field.colon === -1 ? head : head.slice(0, field.colon))
      .trim()
      .toLowerCase();
  }

  return fields;
}

// how many fields of a name a header has, as mailauth reads them
function countFields(header, name) {
  let count = 0;
  for (const field of headerFields(header)) if (field.name === name) count++;
  return count;
}

//
// Why a header (Buffer) is past the limits, or null: read once, in linear
// time
//
function checkHeaderLimits(header) {
  if (!header || typeof header.indexOf !== 'function') return null;
  let lines = 0;
  let field = 0;
  let nextCr = -2;
  for (let start = 0; start < header.length; ) {
    let stop = header.indexOf(0x0a, start);
    if (stop === -1) stop = header.length;
    lines++;
    if (lines > limits.lines)
      return `Message header has more than ${limits.lines} lines`;
    // (a line starting with white space other than a space or tab, which
    //  mailauth reads as continuing the field before it and other parsers as
    //  a field of its own, so they would read another header; not the empty
    //  line that ends it)
    // (a line of CRs alone too: it never ends a header, see
    //  `helpers/message-splitter`, and mailauth reads it, and what continues
    //  after it, as part of the field before it, where mailsplit ends that
    //  field: they would read another From address)
    const first = header[start];
    if (
      first === 0x0b ||
      first === 0x0c ||
      first === 0xa0 ||
      (first === 0x0d && stop - start > 1)
    )
      return 'Message header has a line starting with a control character';
    // (nor a run of CRs within a line: parsers remove the line breaks ending
    //  a header with `/[\r\n]+$/`, in time in the square of every run of
    //  them within it; a line ends with one or two)
    // (the next CR found once for all lines, so each byte is searched once)
    if (nextCr !== -1 && nextCr < start) nextCr = header.indexOf(0x0d, start);
    while (nextCr !== -1 && nextCr < stop) {
      let run = nextCr;
      while (run < stop && header[run] === 0x0d) run++;
      if (run - nextCr > MAX_CR_RUN && run < stop)
        return 'Message header has too many line breaks in a row';
      nextCr = header.indexOf(0x0d, run);
    }

    // (a line starting with white space continues the field before it, as
    //  mailauth reads it, see `SPACE`; its bytes and LF, without the CR
    //  before it)
    if (!SPACE.has(header[start])) field = 0;
    field += stop - start + 1;
    if (stop > start && header[stop - 1] === 0x0d) field--;
    if (field > limits.field + 1)
      return `Message header has a field longer than ${limits.field} bytes`;
    start = stop + 1;
  }

  return null;
}

//
// The groups (":") and separators ("," and ";") of an address field, as the
// address parser mailauth reads it with (nodemailer's) reads them: one
// operator at a time, a quoted string, a comment or an address in angle
// brackets running to its end (no nesting; an escape only in a quoted
// string), in which they are text, but a group's, which it reads again,
// counted (`From: "Alert: disk: full" <a@example.com>` is one address); in
// one pass
//
const OPERATORS = new Map([
  ['"', '"'],
  ['(', ')'],
  ['<', '>'],
  [',', ''],
  [':', ';'],
  [';', '']
]);

function countDelimiters(value) {
  let groups = 0;
  let separators = 0;
  let expecting = '';
  let escaped = false;
  for (const char of value) {
    if (escaped) {
      escaped = false;
      continue;
    }

    if (expecting !== '' && char === expecting) {
      expecting = '';
      continue;
    }

    if (expecting === '' && OPERATORS.has(char)) {
      if (char === ':') groups++;
      else if (char === ',' || char === ';') separators++;
      expecting = OPERATORS.get(char);
      continue;
    }

    if (expecting === '"' && char === '\\') escaped = true;
    // (in a group, which is read again as a list of its own)
    else if (expecting === ';' && char === ':') groups++;
    else if (expecting === ';' && char === ',') separators++;
  }

  return { groups, separators };
}

//
// Why a From field of a header (Buffer) is past the limits mailauth reads it
// in reasonable time with, or null: each field mailauth reads as From (see
// `headerFields`)
//
function checkFromLimits(header) {
  if (!Buffer.isBuffer(header) && typeof header !== 'string') return null;
  for (const field of headerFields(header)) {
    if (field.name !== 'from') continue;
    // (its value, after the first ":", with its folded lines joined with
    //  CR LF, as mailauth reads it)
    let size = -field.colon - 3;
    for (const line of field.lines) size += line.length + 2;
    if (size > limits.from)
      return `The email sent has a "From" header longer than ${limits.from} bytes`;
    const value = field.lines.join('\r\n').slice(field.colon + 1);
    if (value.length > limits.from)
      return `The email sent has a "From" header longer than ${limits.from} bytes`;
    const { groups, separators } = countDelimiters(value);
    if (groups > limits.fromGroups || separators > limits.fromSeparators)
      return 'The email sent has a "From" header with too many addresses or groups';
  }

  return null;
}

module.exports = {
  limits,
  checkHeaderLimits,
  checkFromLimits,
  countFields,
  headerFields
};
