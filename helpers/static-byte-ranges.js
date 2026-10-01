/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const { Buffer } = require('node:buffer');

//
// Byte ranges (RFC 9110, section 14) for static audio and video.
//
// The static file middleware in @ladjs/web always sends the whole file, and
// Safari (macOS and iOS) will not play a <video> unless the server answers its
// first request, `Range: bytes=0-1`, with 206 Partial Content. Every other
// browser also uses ranges to seek without downloading the whole file first.
//
// Ranges apply to GET only (RFC 9110 defines them for no other method; HEAD
// gets the full headers and Accept-Ranges). One range per request: several
// ranges, a malformed header, or an If-Range that no longer matches get the
// whole file instead, as RFC 9110 allows. Responses that are not audio or
// video, or not a plain file or buffer, are left as they are.
//

const RANGE = /^bytes=(\d*)-(\d*)$/;

function isMedia(type) {
  return typeof type === 'string' && /^(?:audio|video)\//i.test(type);
}

// If-Range holds either an ETag or a date; only an exact strong ETag or the
// exact Last-Modified date still matches (a weak ETag never does)
function ifRangeMatches(ctx) {
  const value = ctx.get('If-Range').trim();
  if (!value) return true;
  if (value.startsWith('"')) return value === ctx.response.get('ETag');
  if (value.startsWith('W/')) return false;
  return value === ctx.response.get('Last-Modified');
}

function staticByteRanges() {
  return async function (ctx, next) {
    await next();

    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') return;
    if (ctx.status !== 200 || !isMedia(ctx.response.type)) return;

    // koa-cash marks the responses it handles `identity`, which is no encoding
    const encoding = ctx.response.get('Content-Encoding');
    if (encoding && encoding.toLowerCase() !== 'identity') return;

    const { body } = ctx;
    const isFile =
      body instanceof fs.ReadStream && typeof body.path === 'string';
    if (!isFile && !Buffer.isBuffer(body)) return;

    let size = isFile ? ctx.response.length : body.length;
    if (isFile && !Number.isInteger(size)) {
      const stats = await fs.promises.stat(body.path);
      size = stats.size;
    }

    if (!Number.isInteger(size)) return;

    ctx.set('Accept-Ranges', 'bytes');

    if (ctx.method !== 'GET') return;

    const match = RANGE.exec(ctx.get('Range').trim());
    if (!match || (match[1] === '' && match[2] === '')) return;
    if (!ifRangeMatches(ctx)) return;

    let start;
    let end;
    if (match[1] === '') {
      // a suffix: the last N bytes
      start = Math.max(0, size - Number(match[2]));
      end = size - 1;
      if (Number(match[2]) === 0) start = size;
    } else {
      start = Number(match[1]);
      // a last byte before the first is no range at all
      if (match[2] !== '' && Number(match[2]) < start) return;
      end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    }

    if (start >= size) {
      if (isFile) body.destroy();
      ctx.status = 416;
      ctx.set('Content-Range', `bytes */${size}`);
      // the year-long cache header is for the file, not for this error
      ctx.set('Cache-Control', 'no-store');
      ctx.remove('ETag');
      ctx.remove('Last-Modified');
      ctx.remove('Content-Type');
      ctx.body = '';
      return;
    }

    ctx.status = 206;
    if (isFile) {
      body.destroy();
      ctx.body = fs.createReadStream(body.path, { start, end });
    } else {
      ctx.body = body.subarray(start, end + 1);
    }

    ctx.set('Content-Range', `bytes ${start}-${end}/${size}`);
    ctx.length = end - start + 1;
  };
}

module.exports = staticByteRanges;
