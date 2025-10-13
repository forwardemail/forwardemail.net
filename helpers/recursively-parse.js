/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const mongoose = require('mongoose');

// <https://stackoverflow.com/a/52869830>
function isISODate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return (
    d instanceof Date && !Number.isNaN(d.getTime()) && d.toISOString() === str
  );
}

// this function takes stringified JSON
// and iterates recursively to convert
// { type: 'Buffer', data: [...] } back to a Buffer
function parseBuffers(json, objectId = false, checkDate = true) {
  if (typeof json !== 'object' || json === null) {
    // check if it is a date
    if (checkDate && typeof json === 'string' && isISODate(json))
      return new Date(json);

    if (
      objectId &&
      typeof json === 'string' &&
      mongoose.isObjectIdOrHexString(json)
    )
      return new mongoose.Types.ObjectId(json);

    return json;
  }

  if (Array.isArray(json)) {
    for (let i = 0; i < json.length; i++) {
      json[i] = parseBuffers(json[i], objectId, checkDate);
    }
  } else if (
    json &&
    json.type === 'Buffer' &&
    typeof json.data === 'object' &&
    Array.isArray(json.data)
  ) {
    json = Buffer.from(json.data);
  } else if (!Buffer.isBuffer(json)) {
    for (const key of Object.keys(json)) {
      // iterate recursively
      json[key] = parseBuffers(json[key], objectId, checkDate);
    }
  }

  return json;
}

function recursivelyParse(str, objectId = false, checkDate = true) {
  // Handle plain strings that aren't JSON (e.g., legacy data)
  if (typeof str === 'string') {
    try {
      const json = JSON.parse(str);
      return parseBuffers(json, objectId, checkDate);
    } catch {
      // Not valid JSON, return as-is (handles legacy string values)
      return str;
    }
  }

  const json = typeof str === 'object' && !Buffer.isBuffer(str) ? str : str;
  return parseBuffers(json, objectId, checkDate);
}

module.exports = recursivelyParse;
