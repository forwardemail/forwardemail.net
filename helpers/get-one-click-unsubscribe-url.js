/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { parseDomain, ParseResultType } = require('parse-domain');

const _ = require('#helpers/lodash');
const env = require('#config/env');
const isPrivateHost = require('#helpers/is-private-host');

// (longer URLs are not worth sending a request to)
const MAX_URL_LENGTH = 2048;

//
// Why a message our MX servers accepted could not be forwarded (or was
// deferred) that says nothing about the message itself: unsubscribing from
// one that was rejected as spam, a virus, or failing authentication (e.g.
// DMARC) would only confirm to its sender that the address is read
//
const HARMLESS_CATEGORIES = new Set([
  'capacity',
  'greylist',
  'message',
  'network',
  'protocol',
  'recipient'
]);

function getHeader(headers, name) {
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === name)
      return typeof headers[key] === 'string' ? headers[key] : undefined;
  }
}

//
// The HTTPS URL a log's message can be unsubscribed from with one click
// (RFC 8058), or `undefined` if it cannot be.
//
// The viewer's own browser sends the request (see `assets/js/core.js`), so
// the URL must be HTTPS on the default port, without credentials, and for a
// host name under a public suffix (never an IP address or a name such as
// "router.local", which could reach a device on the viewer's own network).
// We never look the name up ourselves, so its owner cannot tell whether the
// viewer looked at the message.
//
// Only for a message our MX servers received for the viewer (the log's
// recipients are the viewer's own, see `retrieve-log.js` and
// `list-logs.js`), not one they sent: their own list mail carries its
// List-Unsubscribe headers for its recipients.
//
function getOneClickUnsubscribeUrl(log) {
  if (!_.isObject(log) || log.email || log?.meta?.email) return;

  const hostname = log?.meta?.app?.hostname;
  if (!isSANB(hostname) || ![env.MX1_HOST, env.MX2_HOST].includes(hostname))
    return;

  if (
    !Array.isArray(log?.meta?.session?.envelope?.rcptTo) ||
    log.meta.session.envelope.rcptTo.length === 0
  )
    return;

  const err = log.err || log?.meta?.err;
  if (
    err &&
    !HARMLESS_CATEGORIES.has(
      _.isObject(err.bounceInfo) ? err.bounceInfo.category : log.bounce_category
    )
  )
    return;

  const headers = log?.meta?.session?.headers;
  if (!_.isObject(headers)) return;

  // "List-Unsubscribe-Post: List-Unsubscribe=One-Click" (RFC 8058)
  const post = getHeader(headers, 'list-unsubscribe-post');
  if (
    !isSANB(post) ||
    post.trim().toLowerCase() !== 'list-unsubscribe=one-click'
  )
    return;

  // a comma separated list of URIs in angle brackets (RFC 2369 section 2)
  const value = getHeader(headers, 'list-unsubscribe');
  if (!isSANB(value)) return;

  for (const match of value.matchAll(/<([^<>]*)>/g)) {
    const uri = match[1].trim();
    if (uri.length === 0 || uri.length > MAX_URL_LENGTH) continue;

    let url;
    try {
      url = new URL(uri);
    } catch {
      continue;
    }

    if (url.protocol !== 'https:' || url.username || url.password || url.port)
      continue;

    // (an IPv6 address is in brackets)
    const { hostname } = url;
    if (
      isIP(hostname.replace(/^\[|]$/g, '')) !== 0 ||
      isPrivateHost(hostname) ||
      !isFQDN(hostname)
    )
      continue;

    const parsed = parseDomain(hostname);
    if (
      parsed.type !== ParseResultType.Listed ||
      !Array.isArray(parsed.icann?.topLevelDomains) ||
      parsed.icann.topLevelDomains.length === 0 ||
      !isSANB(parsed.icann.domain)
    )
      continue;

    if (url.href.length > MAX_URL_LENGTH) continue;

    return url.href;
  }
}

module.exports = getOneClickUnsubscribeUrl;
module.exports.getHeader = getHeader;
