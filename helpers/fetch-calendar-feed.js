/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const { pipeline } = require('node:stream');

const ms = require('ms');

const isPrivateHost = require('#helpers/is-private-host');
const safeFetch = require('#helpers/safe-fetch');

//
// Fetch an iCalendar feed (a `webcal://`, `https://` or `http://` URL a user
// subscribed to) from a host we do not control.
//
// - `webcal://` is fetched over `https://`; `http://` only with `allowHttp`
// - every hop is resolved, checked to be a public address and pinned to it
//   (see helpers/safe-fetch.js), redirects included, up to `maxRedirects`
// - the whole fetch has one deadline and the body (as sent, and once
//   decompressed) one size limit
// - feed URLs often carry a secret token, so no error or log message here
//   holds one: errors carry a `code`, and `redactFeedUrl` is what to log
//
const MAX_URL_LENGTH = 2048;
const DEFAULTS = {
  allowHttp: false,
  maxRedirects: 5,
  maxBytes: 10 * 1024 * 1024,
  timeout: ms('30s')
};

const BYTE_ORDER_MARK = 0xfe_ff;
const USER_AGENT = 'ForwardEmail-Calendar/1.0 (+https://forwardemail.net)';
const REDIRECTS = new Set([301, 302, 303, 307, 308]);
const PERMANENT_REDIRECTS = new Set([301, 308]);
const DEFAULT_PORTS = { 'https:': 443, 'http:': 80 };
const DECODERS = {
  gzip: () => zlib.createGunzip(),
  'x-gzip': () => zlib.createGunzip(),
  deflate: () => zlib.createInflate(),
  br: () => zlib.createBrotliDecompress()
};

function feedError(code, message, props = {}) {
  return Object.assign(new Error(message), { code, isFeedError: true }, props);
}

//
// The address to fetch for a feed URL as a user gave it, or an error with
// `code` `FEED_URL_INVALID` or `FEED_HTTP_NOT_ALLOWED`.
//
function normalizeFeedUrl(input, { allowHttp = false } = {}) {
  if (typeof input !== 'string')
    throw feedError('FEED_URL_INVALID', 'Feed URL is not a string');
  let value = input.trim();
  if (value === '' || value.length > MAX_URL_LENGTH)
    throw feedError('FEED_URL_INVALID', 'Feed URL is empty or too long');

  // (`webcal:` and `webcals:` name how to open a link, not how to fetch it)
  value = value.replace(/^webcals?:\/\//i, 'https://');

  let url;
  try {
    url = new URL(value);
  } catch {
    throw feedError('FEED_URL_INVALID', 'Feed URL could not be parsed');
  }

  if (url.protocol === 'http:') {
    if (!allowHttp)
      throw feedError(
        'FEED_HTTP_NOT_ALLOWED',
        'Feed URL is not encrypted (http://)'
      );
  } else if (url.protocol !== 'https:') {
    throw feedError('FEED_URL_INVALID', 'Feed URL scheme is not supported');
  }

  // (credentials in a URL would be sent to wherever a redirect leads)
  if (url.username || url.password)
    throw feedError('FEED_URL_INVALID', 'Feed URL must not hold credentials');

  // the default port, or an unprivileged one (as helpers/push-endpoint-policy.js)
  const port = url.port ? Number(url.port) : DEFAULT_PORTS[url.protocol];
  if (port !== DEFAULT_PORTS[url.protocol] && port < 1024)
    throw feedError('FEED_URL_INVALID', 'Feed URL port is not allowed');

  if (!url.hostname)
    throw feedError('FEED_URL_INVALID', 'Feed URL has no host');

  url.hash = '';
  return url.toString();
}

// What may be logged of a feed URL: its scheme and host.
function redactFeedUrl(input) {
  try {
    const url = new URL(
      String(input)
        .trim()
        .replace(/^webcals?:\/\//i, 'https://')
    );
    return `${url.protocol}//${url.host}/…`;
  } catch {
    return '(invalid URL)';
  }
}

function header(headers, name) {
  const value = headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}

function discard(body) {
  if (body && typeof body.destroy === 'function' && !body.destroyed)
    body.destroy();
}

function parseRetryAfter(value) {
  if (typeof value !== 'string' || value.trim() === '') return;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  if (Number.isFinite(date)) return Math.max(0, date - Date.now());
}

async function readCapped(stream, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > limit) throw feedError('FEED_TOO_LARGE', 'Feed is too large');
    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
}

async function readBody(body, headers, maxBytes) {
  const length = Number(header(headers, 'content-length'));
  if (Number.isFinite(length) && length > maxBytes)
    throw feedError('FEED_TOO_LARGE', 'Feed is too large');

  const encoding = String(header(headers, 'content-encoding') || 'identity')
    .trim()
    .toLowerCase();
  if (encoding === 'identity' || encoding === '')
    return readCapped(body, maxBytes);

  const createDecoder = DECODERS[encoding];
  if (!createDecoder)
    throw feedError('FEED_INVALID', 'Feed content encoding is not supported');

  // (the limit is on what comes out, so a small body cannot expand past it)
  const decoder = createDecoder();
  pipeline(body, decoder, () => {});
  try {
    return await readCapped(decoder, maxBytes);
  } finally {
    decoder.destroy();
  }
}

//
// Resolves to `{ notModified: true }` when the feed answers 304 to the
// `etag` / `lastModified` given, otherwise to
// `{ notModified: false, body, etag, lastModified, url, permanentRedirect }`
// where `url` is the address that answered and `permanentRedirect` says every
// hop to it was a 301 or 308 (so `url` may replace the stored one).
//
// Rejects with an error holding one of these as `code`: FEED_URL_INVALID,
// FEED_HTTP_NOT_ALLOWED, FEED_PRIVATE_ADDRESS, FEED_TOO_MANY_REDIRECTS,
// FEED_TOO_LARGE, FEED_TIMEOUT, FEED_HTTP_STATUS (with `statusCode` and
// `retryAfter` in ms when the host gave one), FEED_INVALID or
// FEED_UNREACHABLE.
//
async function fetchCalendarFeed(input, options = {}) {
  const {
    resolver,
    etag,
    lastModified,
    // (the transport, replaced in tests)
    request = safeFetch
  } = options;
  const allowHttp = options.allowHttp ?? DEFAULTS.allowHttp;
  const maxRedirects = options.maxRedirects ?? DEFAULTS.maxRedirects;
  const maxBytes = options.maxBytes ?? DEFAULTS.maxBytes;
  const timeout = options.timeout ?? DEFAULTS.timeout;

  let url = normalizeFeedUrl(input, { allowHttp });

  const controller = new AbortController();
  let currentBody;
  const timer = setTimeout(() => {
    controller.abort();
    discard(currentBody);
  }, timeout);

  const headers = {
    accept: 'text/calendar, text/plain;q=0.5, */*;q=0.1',
    'accept-encoding': 'gzip, deflate, br',
    'user-agent': USER_AGENT
  };
  if (etag) headers['if-none-match'] = etag;
  if (lastModified) headers['if-modified-since'] = lastModified;

  try {
    let permanentRedirect = true;
    for (let hop = 0; hop <= maxRedirects; hop++) {
      // (the deadline is for every hop together, whatever the transport does)
      if (controller.signal.aborted)
        throw feedError('FEED_TIMEOUT', 'Feed took too long to answer');

      // (an address literal or reserved name is refused before any lookup;
      // the transport checks and pins what a name resolves to)
      if (isPrivateHost(new URL(url).hostname))
        throw feedError(
          'FEED_PRIVATE_ADDRESS',
          'Feed host is not a public address'
        );

      let response;
      try {
        response = await request(url, {
          method: 'GET',
          headers,
          resolver,
          signal: controller.signal,
          headersTimeout: timeout,
          bodyTimeout: timeout
        });
      } catch (err) {
        if (controller.signal.aborted) throw err;
        if (err instanceof TypeError) throw err;
        throw /private address/i.test(err?.message)
          ? feedError(
              'FEED_PRIVATE_ADDRESS',
              'Feed host is not a public address'
            )
          : feedError('FEED_UNREACHABLE', 'Feed host could not be reached', {
              cause: err?.code
            });
      }

      const { statusCode } = response;
      currentBody = response.body;

      if (REDIRECTS.has(statusCode)) {
        discard(currentBody);
        const location = header(response.headers, 'location');
        if (!location)
          throw feedError('FEED_INVALID', 'Feed redirect has no location');
        if (!PERMANENT_REDIRECTS.has(statusCode)) permanentRedirect = false;
        let next;
        try {
          next = new URL(location, url).toString();
        } catch {
          throw feedError('FEED_INVALID', 'Feed redirect could not be parsed');
        }

        // (each hop is held to the same rules as the first, so an `https://`
        // feed cannot send us to `http://` unless that was allowed)
        url = normalizeFeedUrl(next, { allowHttp });
        continue;
      }

      if (statusCode === 304) {
        discard(currentBody);
        return { notModified: true };
      }

      if (statusCode !== 200) {
        discard(currentBody);
        throw feedError('FEED_HTTP_STATUS', `Feed answered ${statusCode}`, {
          statusCode,
          retryAfter: parseRetryAfter(header(response.headers, 'retry-after'))
        });
      }

      const buffer = await readBody(currentBody, response.headers, maxBytes);
      // (without a byte order mark, which some exports start with)
      let body = buffer.toString('utf8');
      if (body.codePointAt(0) === BYTE_ORDER_MARK) body = body.slice(1);
      if (!/^\s*begin:vcalendar/i.test(body))
        throw feedError('FEED_INVALID', 'Feed is not an iCalendar file');

      return {
        notModified: false,
        body,
        etag: header(response.headers, 'etag'),
        lastModified: header(response.headers, 'last-modified'),
        url,
        permanentRedirect: hop > 0 && permanentRedirect
      };
    }

    throw feedError(
      'FEED_TOO_MANY_REDIRECTS',
      'Feed redirected too many times'
    );
  } catch (err) {
    discard(currentBody);
    if (controller.signal.aborted && !err?.isFeedError)
      throw feedError('FEED_TIMEOUT', 'Feed took too long to answer');
    if (err?.isFeedError || err instanceof TypeError) throw err;
    // (a stream or decompression failure; its message may hold the URL)
    throw feedError('FEED_INVALID', 'Feed could not be read', {
      cause: err?.code
    });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = fetchCalendarFeed;
module.exports.normalizeFeedUrl = normalizeFeedUrl;
module.exports.redactFeedUrl = redactFeedUrl;
module.exports.DEFAULTS = DEFAULTS;
