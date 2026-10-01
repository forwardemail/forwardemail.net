/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const getStream = require('get-stream');
const intoStream = require('into-stream');
const { Splitter, Joiner } = require('mailsplit');

async function getRawHeaders(input) {
  const splitter = new Splitter();
  const joiner = new Joiner();
  let headers;
  splitter.on('data', (node) => {
    if (node.root) headers = node.getHeaders();
  });
  // <https://github.com/sindresorhus/is-stream/blob/fb8caed475b4107cee3c22be3252a904020eb2d4/index.js#L3-L6>
  if (
    input !== null &&
    typeof input === 'object' &&
    typeof input.pipe === 'function'
  ) {
    await getStream(input.pipe(splitter).pipe(joiner));
  } else {
    await getStream(intoStream(input).pipe(splitter).pipe(joiner));
  }

  return headers;
}

// headers kept in a bounce notification to a return address outside the
// sender's domains (see `getMinimalHeaders`)
const MINIMAL_HEADERS = ['message-id', 'date', 'from', 'to', 'subject'];
const MAX_MINIMAL_HEADER_LENGTH = 200;

//
// A header line up to the length kept, cut between whole characters and at a
// space when there is one (so e.g. an encoded word is not cut in half)
//
function truncate(value) {
  const chars = [...value];
  if (chars.length <= MAX_MINIMAL_HEADER_LENGTH) return value;
  const cut = chars.slice(0, MAX_MINIMAL_HEADER_LENGTH).join('');
  const space = cut.lastIndexOf(' ');
  return space > cut.indexOf(':') + 1 ? cut.slice(0, space) : cut;
}

/**
 * Only the headers that identify a message (Message-ID, Date, From, To and
 * Subject, each unfolded and truncated), e.g. for a bounce notification to an
 * address the sender chose, so it cannot carry content of the sender's
 * choosing in other headers.
 *
 * @param {Buffer|string|Stream} input - Raw message
 * @returns {Promise<Buffer>} Headers
 */
async function getMinimalHeaders(input) {
  const splitter = new Splitter();
  const joiner = new Joiner();
  let lines = [];
  splitter.on('data', (node) => {
    if (!node.root || !node.headers) return;
    lines = [];
    for (const key of MINIMAL_HEADERS) {
      const [line] = node.headers.get(key) || [];
      if (typeof line !== 'string') continue;
      // (header lines are binary strings, e.g. with raw UTF-8)
      const value = Buffer.from(line, 'binary')
        .toString('utf8')
        .replace(/\r?\n[\t ]+/g, ' ')
        .replace(/[\r\n]/g, '');
      lines.push(truncate(value));
    }
  });
  if (
    input !== null &&
    typeof input === 'object' &&
    typeof input.pipe === 'function'
  ) {
    await getStream(input.pipe(splitter).pipe(joiner));
  } else {
    await getStream(intoStream(input).pipe(splitter).pipe(joiner));
  }

  return Buffer.from(lines.length > 0 ? `${lines.join('\r\n')}\r\n` : '');
}

module.exports = getRawHeaders;
module.exports.getMinimalHeaders = getMinimalHeaders;
