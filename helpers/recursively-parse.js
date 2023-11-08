/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

// this function takes stringified JSON
// and iterates recursively to convert
// { type: 'Buffer', data: [...] } back to a Buffer
function parseBuffers(json) {
  if (typeof json !== 'object' || json === null) {
    return json;
  }

  if (Array.isArray(json)) {
    for (let i = 0; i < json.length; i++) {
      json[i] = parseBuffers(json[i]);
    }
  } else if (
    json &&
    json.type === 'Buffer' &&
    typeof json.data === 'object' &&
    Array.isArray(json.data)
  ) {
    json = Buffer.from(json.data);
  } else {
    for (const key of Object.keys(json)) {
      // iterate recursively
      json[key] = parseBuffers(json[key]);
    }
  }

  return json;
}

function recursivelyParse(str) {
  const json = JSON.parse(str);
  return parseBuffers(json);
}

module.exports = recursivelyParse;
