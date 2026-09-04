/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function normalizeRdapUrl(url) {
  if (url instanceof URL) return url;
  if (typeof url !== 'string') throw new TypeError('RDAP URL must be a string');

  const value = url.trim();
  if (!value) throw new TypeError('RDAP URL must not be empty');

  // Some registrar RDAP bootstrap records omit the scheme. Fetch requires an
  // absolute URL, while RFC 9082 RDAP endpoints are HTTP(S) resources.
  const normalized = /^[a-z][a-z\d+.-]*:/i.test(value)
    ? value
    : `https://${value}`;
  const parsed = new URL(normalized);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    throw new TypeError('RDAP URL must use HTTP or HTTPS');

  return parsed;
}

module.exports = normalizeRdapUrl;
