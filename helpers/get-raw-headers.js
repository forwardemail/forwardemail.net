/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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

module.exports = getRawHeaders;
