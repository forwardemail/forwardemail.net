/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function getHeaders(headers) {
  const _headers = {};
  const lines = headers.headers
    .toString('binary')
    .replace(/[\r\n]+$/, '')
    .split(/\r?\n/);
  for (const line of lines) {
    const index = line.indexOf(': ');
    _headers[line.slice(0, index)] = line.slice(index + 2);
  }

  return _headers;
}

module.exports = getHeaders;
