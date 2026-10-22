/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const undici = require('undici');

//
// Content codings a third party must not get decoded here:
//
// - Brotli: the decoder bundled with Node.js v18 has an out-of-bounds write
//   that permits remote code execution with a crafted stream
//   (CVE-2026-111497, fixed only in Node.js 22.23.4, 24.22.1 and 26.12.1)
// - a chain of more than two codings: `fetch` in undici 7.12.0 sets up one
//   decoder per coding before anything is read (CVE-2026-22036)
//
// `refuseUnsafeRequestEncoding` answers such a request body with 415 before
// a body parser (koa-bodyparser decodes Brotli through `inflation`) reads it.
//
// `refuseUnsafeResponseEncoding` (an undici interceptor) fails such a
// response before `fetch` decodes it (it decodes Brotli for any response
// that says `br`, even when Brotli was not asked for).
//

const MAX_CODINGS = 2;

// (`Content-Encoding` may list several codings, e.g. "gzip, br", and may be
//  sent more than once)
function getCodings(value) {
  const values = Array.isArray(value) ? value : [value];
  const codings = [];
  for (const v of values) {
    if (typeof v !== 'string') continue;
    for (const coding of v.split(',')) {
      const name = coding.trim().toLowerCase();
      if (name) codings.push(name);
    }
  }

  return codings;
}

function isUnsafeEncoding(value) {
  const codings = getCodings(value);
  return codings.includes('br') || codings.length > MAX_CODINGS;
}

function createError() {
  const err = new Error('Unsupported content encoding');
  err.code = 'ERR_UNSUPPORTED_CONTENT_ENCODING';
  err.status = 415;
  err.statusCode = 415;
  err.expose = true;
  return err;
}

function refuseUnsafeRequestEncoding(ctx, next) {
  if (isUnsafeEncoding(ctx.get('Content-Encoding'))) {
    const err = createError();
    // (on the error, which the error handler sends; a header set on `ctx`
    //  before throwing may be cleared)
    err.headers = { 'Accept-Encoding': 'gzip, deflate, identity' };
    throw err;
  }

  return next();
}

class RefuseUnsafeEncodingHandler extends undici.DecoratorHandler {
  onResponseStart(controller, statusCode, headers, statusMessage) {
    if (isUnsafeEncoding(headers?.['content-encoding'])) {
      controller.abort(createError());
      return;
    }

    return super.onResponseStart(
      controller,
      statusCode,
      headers,
      statusMessage
    );
  }
}

function refuseUnsafeResponseEncoding(dispatch) {
  return function (options, handler) {
    return dispatch(options, new RefuseUnsafeEncodingHandler(handler));
  };
}

//
// A dispatcher for `undici.fetch` that never decodes Brotli (or a long chain
// of codings), for requests that need no agent options of their own; send
// `Accept-Encoding: gzip, deflate` with it, so a server has no reason to
// answer otherwise.
//
let dispatcher;
function getDispatcher() {
  dispatcher ||= new undici.Agent().compose(refuseUnsafeResponseEncoding);
  return dispatcher;
}

const ACCEPT_ENCODING = 'gzip, deflate';

module.exports = {
  ACCEPT_ENCODING,
  getDispatcher,
  isUnsafeEncoding,
  refuseUnsafeRequestEncoding,
  refuseUnsafeResponseEncoding
};
