/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const parseRootDomain = require('#helpers/parse-root-domain');

//
// whether mail to `host` is delivered to Google (e.g. gmail.com or a Google
// Workspace domain) based on its most preferred MX record
//
async function isGoogleMX(resolver, host) {
  if (!isSANB(host) || isIP(host) || !isFQDN(host)) return false;

  let records;
  try {
    records = await resolver.resolveMx(host);
  } catch {
    return false;
  }

  if (!Array.isArray(records) || records.length === 0) return false;

  const [record] = records
    .filter((record) => isSANB(record?.exchange))
    .sort((a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0));

  if (!record) return false;

  const exchange = record.exchange.toLowerCase().replace(/\.$/, '');
  return (
    isFQDN(exchange) &&
    ['google.com', 'googlemail.com'].includes(parseRootDomain(exchange))
  );
}

module.exports = isGoogleMX;
