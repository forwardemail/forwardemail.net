/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

//
// A JSON body is parsed as deep as it is nested (5,000 times "[" is 5 KB),
// and what reads it as deep as it goes runs out of stack at a few thousand
// levels.  What described a request for a log did (parse-request, under
// Cabin), in the error handler (the request was then never answered) and
// once more as the response ended (an uncaught exception), for anyone and on
// any path; it no longer reads the body (see config/api.js), but a route
// that copies its body or writes it out does.
//
// No body of ours is nested more than a few levels: one nested deeper than
// this is refused as it is set, by the body parser or by a route.
//
const MAX_BODY_DEPTH = 64;

function isTooDeep(value, depth = 1) {
  if (value === null || typeof value !== 'object') return false;
  const isArray = Array.isArray(value);
  if (!isArray) {
    // (a buffer, a stream or a file is not read into)
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return false;
  }

  if (depth > MAX_BODY_DEPTH) return true;
  if (isArray) {
    for (const item of value)
      if (typeof item === 'object' && isTooDeep(item, depth + 1)) return true;
    return false;
  }

  // (key by key: an object of millions of keys, as 50 MB of JSON hold,
  // takes over twice as long to give all its values at once)
  for (const key of Object.keys(value)) {
    const item = value[key];
    if (typeof item === 'object' && isTooDeep(item, depth + 1)) return true;
  }

  return false;
}

function limitBodyDepth(ctx, next) {
  let body;
  Object.defineProperty(ctx.request, 'body', {
    configurable: true,
    enumerable: true,
    get: () => body,
    set(value) {
      if (isTooDeep(value))
        throw Boom.badRequest('The body of the request is nested too deep');
      body = value;
    }
  });
  return next();
}

module.exports = limitBodyDepth;
